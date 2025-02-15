import { GoogleTagManager } from "@next/third-parties/google";
const GTAGMGR_ID = process.env.NEXT_PUBLIC_GTAGMGR_ID || "";

import "./globals.css";

import Footer from "../src/components/layout/Footer";
import Header from "../src/components/layout/Header";
import { MetaInfo } from "../src/MetaInfo";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = MetaInfo.metadataBase;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head />
      <body className="bg-[#d2dee7] text-[#121a24]">
        <div className="flex min-h-screen flex-col">
          <div className="grow">
            <Header />
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
