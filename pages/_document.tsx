import Document, { Head, Html, Main, NextScript } from "next/document";
import { GTAGMGR_ID } from "../libs/tagManager";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head prefix="og: http://ogp.me/ns#" />
        <body>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-${GTAGMGR_ID}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
