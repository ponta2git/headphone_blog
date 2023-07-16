import "./globals.css"
import { siteName } from "../libs/siteBasic"
import GoogleTagManager from "../components/GoogleTagManager"

import { ReactNode } from "react"
import type { Metadata } from "next"
import Header from "../components/PageElements/Header"
import Container from "../components/PageElements/Container"
import Footer from "../components/PageElements/Footer"

export const metadata: Metadata = {
  title: siteName,
  alternates: {
    canonical: "https://ponta-headphone.net/",
  },
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
      <body className="bg-[#d2dee7] font-sans text-[#121a24]">
        {process.env.NODE_ENV === "production" && <GoogleTagManager />}
        <div className="flex min-h-screen flex-col">
          <div className="flex-grow">
            <Header />
            <Container>{children}</Container>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
