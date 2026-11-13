import { spawnSync } from "node:child_process";

// Explicit test environments make local and CI checks independent of a user's
// deployment variables. The final output is always the untracked preview build.
const env = {
  ...process.env,
  ASTRO_TELEMETRY_DISABLED: "1",
  VERCEL_ENV: "preview",
  SITE_ENV: "preview",
  GTM_ID: "",
  NEXT_PUBLIC_GTAGMGR_ID: "",
};

function run(args, overrides = {}) {
  const result = spawnSync("pnpm", args, {
    stdio: "inherit",
    env: { ...env, ...overrides },
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `pnpm ${args.join(" ")} failed (${result.status ?? result.signal}).`,
    );
}

try {
  for (const command of ["check", "lint", "format:check", "test"])
    run([command]);
  const production = { VERCEL_ENV: "production", GTM_ID: "GTM-TEST123" };
  try {
    run(["build", "--force"], production);
    run(["test:build"], production);
  } finally {
    run(["build"]);
    run(["test:build"]);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
