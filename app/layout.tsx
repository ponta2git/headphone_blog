import { GoogleTagManager } from "@next/third-parties/google"
const GTAGMGR_ID = process.env.NEXT_PUBLIC_GTAGMGR_ID || ""

import "./globals.css"

import Footer from "../src/components/layout/Footer"
import Header from "../src/components/layout/Header"
import { siteName, siteDescription, siteUrl } from "../src/siteBasic"

import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description: siteDescription,
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    url: siteUrl,
    locale: "ja_JP",
    type: "website",
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    site: "@ponta2twit",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head />
      <body className="bg-[#d2dee7] text-[#121a24]">
        <div className="flex min-h-screen flex-col">
          <div className="flex-grow">
            <Header />
            {children}
          </div>
          <Footer />
        </div>
      </body>
      <GoogleTagManager gtmId={`GTM-${GTAGMGR_ID}`} />
    </html>
  )
}
