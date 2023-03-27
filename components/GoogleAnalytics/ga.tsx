import { useEffect } from "react";
import { useRouter } from "next/router";

import { GA_TRACKING_ID, pageView } from "../../libs/gtag";
import GoogleAnalyticsScripts from "./scripts";

const handleChangeRoute = (path: string) => {
  pageView(path);
};

const GoogleAnalytics = () => {
  const router = useRouter();

  useEffect(() => {
    if (!GA_TRACKING_ID) return;

    router.events.on("routeChangeComplete", handleChangeRoute);

    return () => {
      router.events.off("routeChangeComplete", handleChangeRoute);
    };
  }, [router.events]);

  return <GoogleAnalyticsScripts />;
};

export default GoogleAnalytics;
