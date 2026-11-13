import { deployment } from "../infrastructure/deployment";
import { site } from "../config/site";

export function GET() {
  return new Response(
    deployment.indexable
      ? `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n`
      : "User-agent: *\nDisallow: /\n",
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}
