import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "../components/features/SiteHeader";
import { SiteFooter } from "../components/features/SiteFooter";
import { generateStaticMetadata } from "../posts/meta";

import "../styles/globals/reset.css";
import "../styles/globals/base.css";
import "../styles/globals/utilities.css";

import styles from "./layout.module.css";

const GTAGMGR_ID = process.env.NEXT_PUBLIC_GTAGMGR_ID || "";

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
      <body>
        <div className={styles.container}>
          <div className={styles.content}>
            <SiteHeader />
            {children}
          </div>
          <SiteFooter />
        </div>
        {process.env.ENABLE_GTM === "true" ? (
          <GoogleTagManager gtmId={`GTM-${GTAGMGR_ID}`} />
        ) : null}
      </body>
    </html>
  );
}
