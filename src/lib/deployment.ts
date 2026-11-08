interface Environment {
  productionBuild: boolean;
  vercelEnv?: string;
  siteEnv?: string;
  gtmId?: string;
  legacyGtmId?: string;
}

export function deploymentSettings(env: Environment) {
  const indexable =
    env.productionBuild && (env.vercelEnv ?? env.siteEnv) === "production";
  const rawId = (env.gtmId ?? env.legacyGtmId ?? "").trim();
  const gtmId = rawId.startsWith("GTM-") ? rawId : `GTM-${rawId}`;
  if (indexable && !/^GTM-[A-Z0-9]+$/.test(gtmId))
    throw new Error("Production requires GTM_ID (or NEXT_PUBLIC_GTAGMGR_ID).");
  return { indexable, gtmId: indexable ? gtmId : undefined };
}

export const deployment = deploymentSettings({
  productionBuild: import.meta.env.PROD,
  vercelEnv: import.meta.env.VERCEL_ENV,
  siteEnv: import.meta.env.SITE_ENV,
  gtmId: import.meta.env.GTM_ID,
  legacyGtmId: import.meta.env.NEXT_PUBLIC_GTAGMGR_ID,
});
