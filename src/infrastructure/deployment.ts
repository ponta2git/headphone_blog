import { deploymentSettings } from "../config/deployment";

// Environment access stays at the build boundary, outside the pure policy.
export const deployment = deploymentSettings({
  productionBuild: import.meta.env.PROD,
  vercelEnv: import.meta.env.VERCEL_ENV,
  siteEnv: import.meta.env.SITE_ENV,
  gtmId: import.meta.env.GTM_ID,
  legacyGtmId: import.meta.env.NEXT_PUBLIC_GTAGMGR_ID,
});
