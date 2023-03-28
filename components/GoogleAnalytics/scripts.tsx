import Script from "next/script";
import { GA_TRACKING_ID } from "../../libs/gtag";

const GoogleAnalyticsScripts = () => {
  return (
    <>
      {GA_TRACKING_ID && (
        <>
          <Script
            defer
            src={`https://www.googletagmanager.com/gtag/js?id=G-${GA_TRACKING_ID}`}
          />
          <Script
            id="ga"
            defer
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-${GA_TRACKING_ID}');
        `,
            }}
          ></Script>
        </>
      )}
    </>
  );
};

export default GoogleAnalyticsScripts;
