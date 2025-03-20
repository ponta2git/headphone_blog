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
    <Container>
      <h1 className="font-header-setting text-2xl leading-snug font-bold tracking-[0.6px] text-[#2F4F4F]">
        プライバシーポリシー
      </h1>
      <div className="text-sm leading-5 tracking-[0.2px]">
        <p className="text-[#7b8ca2]">2025-02-15</p>
      </div>

      <div className="mx-2 my-10 mt-6 flex flex-col gap-4 lg:px-2">
        <p className="text-justify tracking-[-0.0125rem] break-words">
          pontaのヘッドホンブログ（以下、当サイト）におけるプライバシーポリシーは次の通りです。
        </p>
        <h2 className="font-header-setting font-semibold tracking-[0.6px] text-[#2F4F4F]">
          日本国の法令に基づく個人情報の保護
        </h2>
        <p className="text-justify tracking-[-0.0125rem] break-words">
          当サイトにおける個人情報の保護は、日本国の法令に基づいて行われることとします。
        </p>
        <h2 className="font-header-setting font-semibold tracking-[0.6px] text-[#2F4F4F]">
          アクセス解析ツールの使用
        </h2>
        <p className="text-justify tracking-[-0.0125rem] break-words">
          当サイトでは、Googleのアクセス解析ツール、Google
          Analyticsを使用しています。Google
          Analyticsは、アクセスデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。Cookieを無効にすることで収集を拒否できますので、お使いのブラウザの設定をご確認ください。詳細は、
          <a
            href="https://policies.google.com/technologies/ads?hl=ja"
            rel="noopener noreferrer"
            className="text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
          >
            Googleポリシーと規約をご覧ください。
          </a>
        </p>

        <h2 className="font-header-setting font-semibold tracking-[0.6px] text-[#2F4F4F]">
          免責事項
        </h2>
        <p className="text-justify tracking-[-0.0125rem] break-words">
          当サイトでは、当サイトの掲載内容によって生じた損害に対する一切の責任を負いません。また、可能な限り注意を払った情報提供を心がけておりますが、正確性や安全性を保証するものではありません。また、リンク先の他サイトで提供される情報・サービスにつきましても、一切の責任を負いません。
        </p>
        <h2 className="font-header-setting font-semibold tracking-[0.6px] text-[#2F4F4F]">
          プライバシーポリシーの改定
        </h2>
        <p className="text-justify tracking-[-0.0125rem] break-words">
          当サイトは、本プライバシーポリシーを予告なく改定する事があります。修正された最新のプライバシーポリシーは、常に本ページにて公開されます。
        </p>
        <p className="text-justify tracking-[-0.0125rem] break-words">以上</p>
        <address className="text-justify tracking-[-0.0125rem] break-words">
          <p>連絡先：ponta</p>
          <p>
            <a
              href="mailto:coshun@gmail.com"
              className="mr-1 text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
            >
              coshun [at] gmail.com
            </a>
          </p>
        </address>
      </div>
    </Container>
  );
}
