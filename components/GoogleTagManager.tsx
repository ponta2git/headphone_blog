import Script from "next/script"
import { GTAGMGR_ID } from "../libs/tagManager"

const GoogleTagManager = () => {
  return (
    <>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-${GTAGMGR_ID}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
      />
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-${GTAGMGR_ID}');
                `,
        }}
      />
    </>
  )
}

export default GoogleTagManager
