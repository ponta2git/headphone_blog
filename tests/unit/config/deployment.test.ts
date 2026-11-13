import { describe, expect, it } from "vitest";
import { deploymentSettings } from "../../../src/config/deployment";

describe("deployment settings", () => {
  it.each(["preview", "development", undefined])(
    "keeps %s builds unindexed and untracked",
    (vercelEnv) => {
      expect(
        deploymentSettings({
          productionBuild: true,
          vercelEnv,
          gtmId: "GTM-TEST",
        }),
      ).toEqual({ indexable: false, gtmId: undefined });
    },
  );
  it("never enables tracking in the dev server or a Vercel Preview", () => {
    expect(
      deploymentSettings({ productionBuild: false, siteEnv: "production" })
        .indexable,
    ).toBe(false);
    expect(
      deploymentSettings({
        productionBuild: true,
        vercelEnv: "preview",
        siteEnv: "production",
      }).indexable,
    ).toBe(false);
  });
  it.each(["GTM-ABC123", "ABC123"])(
    "accepts existing ID format %s in production",
    (legacyGtmId) => {
      expect(
        deploymentSettings({
          productionBuild: true,
          vercelEnv: "production",
          legacyGtmId,
        }),
      ).toEqual({ indexable: true, gtmId: "GTM-ABC123" });
    },
  );
  it("prefers the current setting and rejects missing or invalid production IDs", () => {
    expect(
      deploymentSettings({
        productionBuild: true,
        siteEnv: "production",
        gtmId: "GTM-NEW",
        legacyGtmId: "OLD",
      }).gtmId,
    ).toBe("GTM-NEW");
    for (const gtmId of [undefined, "", "GTM-", "<script>"])
      expect(() =>
        deploymentSettings({
          productionBuild: true,
          vercelEnv: "production",
          gtmId,
        }),
      ).toThrow();
  });
});
