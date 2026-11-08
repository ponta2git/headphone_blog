import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import { load } from "cheerio";

const args = process.argv.slice(2);
const useShare = args.includes("--share-url-stdin");
const [origin, environment, reportFile] = args.filter(
  (arg) => arg !== "--share-url-stdin",
);
if (!origin || !["preview", "production"].includes(environment)) {
  throw new Error(
    "Usage: node scripts/verify-deployment.mjs <origin> <preview|production> [report.json] [--share-url-stdin]",
  );
}
const base = new URL(origin);
assert.equal(base.pathname, "/", "Pass an origin without a path");
assert.ok(["https:", "http:"].includes(base.protocol));
assert.ok(!base.username && !base.password && !base.search && !base.hash);
const baseline = JSON.parse(
  await readFile(
    new URL("../docs/astro-migration/baseline.json", import.meta.url),
    "utf8",
  ),
);
const production = environment === "production";
const canonicalOrigin = new URL(baseline.site).origin;
const results = [];
const assets = new Set();
const descriptions = new Map();
const report = { origin: base.origin, environment, checkedAt: "", results };
let cookie;

if (useShare) {
  assert.equal(
    environment,
    "preview",
    "Shared access is only for Preview checks",
  );
  console.log("Waiting for the authorized Preview share URL on stdin.");
  const input = createInterface({ input: process.stdin });
  const [line] = await new Promise((resolve) =>
    input.once("line", (...args) => resolve(args)),
  );
  input.close();
  const shared = new URL(line);
  assert.equal(
    shared.origin,
    base.origin,
    "The share URL must target this deployment",
  );
  assert.ok(
    shared.searchParams.has("_vercel_share"),
    "A Vercel share URL is required",
  );
  const access = await fetch(shared, {
    redirect: "manual",
    signal: AbortSignal.timeout(20_000),
  });
  cookie = access.headers
    .getSetCookie()
    .map((value) => value.split(";", 1)[0])
    .join("; ");
  assert.ok(
    cookie,
    `Shared access returned no session cookie (HTTP ${access.status})`,
  );
}

async function request(route) {
  const url = new URL(route, base);
  assert.equal(url.origin, base.origin, "Only request the deployment origin");
  const response = await fetch(url, {
    redirect: "manual",
    headers: cookie ? { cookie } : {},
    signal: AbortSignal.timeout(20_000),
  });
  const body = Buffer.from(await response.arrayBuffer());
  return { response, body, text: body.toString("utf8") };
}

async function check(name, action) {
  try {
    const detail = await action();
    results.push({ name, passed: true, ...detail });
  } catch (error) {
    results.push({ name, passed: false, error: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

async function each(items, action) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(6, items.length) }, async () => {
      while (next < items.length) await action(items[next++]);
    }),
  );
}

async function redirect(from, to) {
  const { response } = await request(from);
  assert.ok([301, 308].includes(response.status), `HTTP ${response.status}`);
  assert.equal(
    new URL(response.headers.get("location"), base).href,
    new URL(to, base).href,
  );
  return {
    status: response.status,
    location: response.headers.get("location"),
  };
}

const preflight = await request("/");
assert.equal(
  preflight.response.status,
  200,
  `GET / returned ${preflight.response.status}. Verify access to the deployment before running the checks; authentication redirects are not page responses.`,
);

await each(baseline.pages, async (page) => {
  await check(`page ${page.url}`, async () => {
    const { response, text } = await request(page.url);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /text\/html/);
    const $ = load(text);
    assert.equal(
      $("link[rel=canonical]").attr("href"),
      new URL(page.url, canonicalOrigin).href,
    );
    assert.ok($("title").text().trim());
    assert.ok($("h1").text().trim());
    const description = $("meta[name=description]").attr("content");
    assert.ok(description);
    descriptions.set(page.url, description);
    const robots = $("meta[name=robots]").attr("content") ?? "";
    const headerRobots = response.headers.get("x-robots-tag") ?? "";
    assert.equal(/noindex/.test(robots), !production);
    if (production) assert.doesNotMatch(headerRobots, /noindex/);
    assert.equal(text.includes("www.googletagmanager.com/gtm.js"), production);
    assert.equal(text.includes("www.googletagmanager.com/ns.html"), production);
    const schemas = $("script[type='application/ld+json']");
    assert.ok(schemas.length);
    schemas.each((_, el) => assert.ok(JSON.parse($(el).text())["@context"]));
    $("img[src], script[src], link[rel=stylesheet]").each((_, el) => {
      const value = $(el).attr("src") ?? $(el).attr("href");
      const asset = new URL(value, base);
      if (asset.origin === base.origin) assets.add(asset.pathname);
    });
    $("img[srcset], source[srcset]").each((_, el) => {
      for (const entry of $(el).attr("srcset").split(",")) {
        const asset = new URL(entry.trim().split(/\s+/)[0], base);
        if (asset.origin === base.origin) assets.add(asset.pathname);
      }
    });
    return { status: response.status, robots, headerRobots };
  });
  if (page.url !== "/") {
    await check(`slash ${page.url}/`, () => redirect(`${page.url}/`, page.url));
    await check(`html ${page.url}.html`, () =>
      redirect(`${page.url}.html`, page.url),
    );
  }
});

await check("unknown URL", async () => {
  const { response, text } = await request("/migration-check-nonexistent-page");
  assert.equal(response.status, 404);
  assert.match(load(text)("h1").text(), /ページが見つかりません/);
  return { status: response.status };
});

await each(
  baseline.assets.filter((asset) => asset.url.startsWith("/images/posts/")),
  async (asset) => {
    await check(`legacy image ${asset.url}`, async () => {
      const { response, body } = await request(asset.url);
      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type") ?? "", /image\//);
      const sha256 = createHash("sha256").update(body).digest("hex");
      assert.equal(sha256, asset.sha256);
      return { status: response.status, bytes: body.length, sha256 };
    });
  },
);

await each([...assets], async (asset) => {
  await check(`asset ${asset}`, async () => {
    const { response, body } = await request(asset);
    assert.equal(response.status, 200);
    assert.ok(body.length);
    assert.doesNotMatch(
      response.headers.get("content-type") ?? "",
      /text\/html/,
    );
    return { status: response.status, bytes: body.length };
  });
});

await check("RSS latest five and JST dates", async () => {
  const { response, text } = await request("/rss.xml");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /xml/);
  const $ = load(text, { xml: true });
  const latest = [...baseline.posts]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 5);
  assert.equal($("item").length, latest.length);
  $("item").each((i, el) => {
    const item = $(el);
    const post = latest[i];
    const url = new URL(post.url, canonicalOrigin).href;
    assert.equal(item.find("title").text(), post.title);
    assert.equal(item.find("link").text(), url);
    assert.equal(item.find("guid").text(), url);
    assert.equal(
      new Date(item.find("pubDate").text()).getTime(),
      new Date(`${post.date}T00:00:00+09:00`).getTime(),
    );
    assert.equal(item.find("description").text(), descriptions.get(post.url));
  });
  return { status: response.status, items: latest.length };
});

await check("sitemap redirect", () =>
  redirect("/sitemap.xml", "/sitemap-index.xml"),
);
await check("sitemap all public URLs", async () => {
  const index = await request("/sitemap-index.xml");
  assert.equal(index.response.status, 200);
  const $ = load(index.text, { xml: true });
  const maps = $("sitemap > loc")
    .map((_, el) => $(el).text())
    .get();
  assert.ok(maps.length);
  const urls = [];
  for (const map of maps) {
    const url = new URL(map);
    assert.equal(url.origin, canonicalOrigin);
    const sitemap = await request(url.pathname);
    assert.equal(sitemap.response.status, 200);
    const xml = load(sitemap.text, { xml: true });
    urls.push(
      ...xml("url > loc")
        .map((_, el) => xml(el).text())
        .get(),
    );
  }
  assert.deepEqual(
    urls.sort(),
    baseline.pages
      .map((page) => new URL(page.url, canonicalOrigin).href)
      .sort(),
  );
  return { urls: urls.length };
});

await check("robots policy", async () => {
  const { response, text } = await request("/robots.txt");
  assert.equal(response.status, 200);
  if (production) {
    assert.match(text, /^Allow: \/$/m);
    assert.ok(text.includes(`Sitemap: ${canonicalOrigin}/sitemap-index.xml`));
    assert.doesNotMatch(text, /^Disallow: \/$/m);
  } else {
    assert.match(text, /^Disallow: \/$/m);
  }
  return { status: response.status, text };
});

report.checkedAt = new Date().toISOString();
report.passed = results.filter((result) => result.passed).length;
report.failed = results.length - report.passed;
results.sort((a, b) => a.name.localeCompare(b.name));
if (reportFile)
  await writeFile(reportFile, `${JSON.stringify(report, null, 2)}\n`);
console.log(
  `${environment} ${base.origin}: ${report.passed} passed, ${report.failed} failed`,
);
process.exitCode = report.failed ? 1 : 0;
