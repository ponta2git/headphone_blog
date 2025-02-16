import { GoogleTagManager } from "@next/third-parties/google";
const GTAGMGR_ID = process.env.NEXT_PUBLIC_GTAGMGR_ID || "";

import "./globals.css";

import Footer from "../src/components/layout/Footer";
import Header from "../src/components/layout/Header";
import NavMenu from "../src/components/layout/NavMenu";
import { MetaInfo } from "../src/MetaInfo";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = MetaInfo.metadataBase;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head />
      <body className="bg-[#F0FFFF] text-[#484848]">
        <div className="flex min-h-screen flex-col">
          <div className="grow">
            <div className="pt-10 pb-6">
              <Header />
            </div>
            <div className="mx-4 mb-6 md:mx-auto md:w-3/5">
              <NavMenu />
            </div>
            {children}
          </div>
          <Footer />
        </div>
      </body>
      {process.env.NODE_ENV === "production" ? (
        <GoogleTagManager gtmId={`GTM-${GTAGMGR_ID}`} />
      ) : null}
    </html>
  );
}
