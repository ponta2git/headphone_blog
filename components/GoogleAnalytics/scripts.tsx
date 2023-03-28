import Script from "next/script";
import { GA_TRACKING_ID } from "../../libs/gtag";

const GoogleAnalyticsScripts = () => {
  return (
    <>
      {GA_TRACKING_ID && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=G-${GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga"
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
