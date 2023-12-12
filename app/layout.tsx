import { GoogleTagManager } from "@next/third-parties/dist/google"
const GTAGMGR_ID = process.env.NEXT_PUBLIC_GTAGMGR_ID || ""

import "./globals.css"

import Container from "../src/components/PageElements/Container"
import Footer from "../src/components/PageElements/Footer"
import Header from "../src/components/PageElements/Header"
import { siteName, siteDescription } from "../src/siteBasic"

import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  metadataBase: new URL("https://ponta-headphone.net"),
  title: siteName,
  description: siteDescription,
  alternates: {
    canonical: "https://ponta-headphone.net/",
  },
  openGraph: {
    url: "https://ponta-headphone.net/",
    locale: "ja_JP",
    type: "website",
    description: siteDescription
  },
  twitter: {
    card: "summary",
    site: "@ponta2twit",
    description: siteDescription
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head prefix="og: http://ogp.me/ns#" />
      <body className="bg-[#d2dee7] font-sans text-[#121a24]">
        <div className="flex min-h-screen flex-col">
          <div className="flex-grow">
            <Header />
            <Container>{children}</Container>
          </div>
          <Footer />
        </div>
      </body>
      <GoogleTagManager gtmId={GTAGMGR_ID} />
    </html>
  )
}
