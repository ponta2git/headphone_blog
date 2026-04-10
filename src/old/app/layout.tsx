import { GoogleTagManager } from "@next/third-parties/google";

import "../assets/css/reset.css";
import "../assets/css/global.css";

import Footer from "../components/layout/Footer";
import GlobalMenu from "../components/layout/GlobalMenu";
import Header from "../components/layout/Header";
import { generateStaticMetadata } from "../posts/meta";

import type { Metadata } from "next";
import type { ReactNode } from "react";

const GTAGMGR_ID = process.env.NEXT_PUBLIC_GTAGMGR_ID || "";

// JSON-LDの構造化データを追加したメタデータを生成
export function generateMetadata(): Metadata {
  return generateStaticMetadata(
    "",
    "",
    "ヘッドホンオーディオを楽しんでいます。ヘッドホンや機材のインプレッションやヘッドホンオーディオの楽しみ方などについて気楽に書き連ねています。",
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head />
      {process.env.ENABLE_GTM === "true" ? (
        <GoogleTagManager gtmId={`GTM-${GTAGMGR_ID}`} />
      ) : null}
      <body className="bg-base">
        <div id="root-container">
          <div id="content-container">
            <div className="margin-start-section">
              <Header />
            </div>
            <div className="fit-content center margin-start-section margin-end-section">
              <GlobalMenu />
            </div>
            {children}
          </div>
          <div
            id="footer-container"
            className="margin-start-section margin-end-section"
          >
            <Footer />
          </div>
          {/* <ScrollToTop /> */}
        </div>
      </body>
    </html>
  );
}
