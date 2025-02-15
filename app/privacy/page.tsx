import Container from "../../src/components/layout/Container";
import { MetaInfo } from "../../src/MetaInfo";

import type { Metadata } from "next";

export const metadata: Metadata = {
  ...MetaInfo.metadataBase,
  title: `プライバシーポリシー: ${MetaInfo.siteInfo.name}`,
  alternates: {
    ...MetaInfo.metadataBase.alternates,
    canonical: `${MetaInfo.siteInfo.url}privacy`,
  },
  openGraph: {
    ...MetaInfo.metadataBase.openGraph,
    url: `${MetaInfo.siteInfo.url}privacy`,
  },
};

export default function Page() {
  return (
    <Container postMode>
      <h1 className="line-break-strict text-2xl leading-snug font-bold tracking-[0.6px]">
        プライバシーポリシー
      </h1>
      <div className="text-sm leading-7 tracking-[0.2px]">
        <p className="text-slate-500">2024-06-08</p>
      </div>

      <div className="mx-2 my-10 mt-6 flex flex-col gap-4 lg:px-2">
        <p>
          pontaのヘッドホンブログ（以下、当サイト）におけるプライバシーポリシーは次の通りです。
        </p>
        <h2 className="font-semibold">日本国の法令に基づく個人情報の保護</h2>
        <p>
          当サイトにおける個人情報の保護は、日本国の法令に基づいて行われることとします。
        </p>
        <h2 className="font-semibold">アクセス解析ツールの使用</h2>
        <p>
          当サイトでは、Googleによるアクセス解析ツール、Google
          Analyticsを使用しています。Google
          Analyticsは、アクセスデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。Cookieを無効にすることで収集を拒否できますので、お使いのブラウザの設定をご確認ください。詳細は、
          <a
            href="https://policies.google.com/technologies/ads?hl=ja"
            rel="noopener noreferrer"
            className="mr-1 inline-flex flex-row items-center gap-x-1 text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
          >
            Googleポリシーと規約をご覧ください。
          </a>
        </p>

        <h2 className="font-semibold">免責事項</h2>
        <p>
          当サイトでは、当サイトの掲載内容によって生じた損害に対する一切の責任を負いません。また、可能な限り注意を払った情報提供を心がけておりますが、正確性や安全性を保証するものではありません。また、リンク先の他サイトで提供される情報・サービスにつきましても一切の責任を負いません。
        </p>
        <h2 className="font-semibold">プライバシーポリシーの改定</h2>
        <p>
          当サイトは、本プライバシーポリシーを予告なく改定する事があります。修正された最新のプライバシーポリシーは、常に本ページにて公開されます。
        </p>
        <p>以上</p>
        <p>
          連絡先：ponta
          <address>
            <a
              href="mailto:coshun@gmail.com"
              className="mr-1 inline-flex flex-row items-center gap-x-1 text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
            >
              coshun [at] gmail.com
            </a>
          </address>
        </p>
      </div>
    </Container>
  );
}
