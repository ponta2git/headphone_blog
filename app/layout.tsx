import "./globals.css"
import { siteName } from "../libs/siteBasic"
import GoogleTagManager from "../components/GoogleTagManager/tagmanager"

import { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteName,
  openGraph: {
    url: "https://ponta-headphone.net/",
    locale: "ja-JP",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head prefix="og: http://ogp.me/ns#" />
      <body>
        {process.env.NODE_ENV === "production" && <GoogleTagManager />}
        {children}
      </body>
    </html>
  )
}
