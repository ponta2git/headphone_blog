import { GoogleTagManager } from "@next/third-parties/google";
const GTAGMGR_ID = process.env.NEXT_PUBLIC_GTAGMGR_ID || "";

import "./globals.css";

import Footer from "../src/components/layout/Footer";
import GlobalMenu from "../src/components/layout/GlobalMenu";
import Header from "../src/components/layout/Header";
import ScrollToTop from "../src/components/layout/ScrollToTop";
import { MetaInfo } from "../src/MetaInfo";

import type { Metadata } from "next";
import type { ReactNode } from "react";

// JSON-LDの構造化データを追加したメタデータを生成
export const generateMetadata = async (): Promise<Metadata> => {
  return {
    ...MetaInfo.baseMetadata,
    other: {
      "json-ld": JSON.stringify(MetaInfo.schemaOrg.website()),
    },
  };
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head />
      <body className="bg-bg-base text-text">
        <div className="flex min-h-screen flex-col">
          <div className="grow">
            <div className="pt-10 pb-6">
              <Header />
            </div>
            <div className="mx-4 mb-6 md:mx-auto md:w-3/5">
              <GlobalMenu />
            </div>
            {children}
          </div>
          <Footer />
          <ScrollToTop />
        </div>
      </body>
      {process.env.NODE_ENV === "production" ? (
        <GoogleTagManager gtmId={`GTM-${GTAGMGR_ID}`} />
      ) : null}
    </html>
  );
}
