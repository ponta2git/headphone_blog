# Astro移行：工程4の進捗と切り替え手順

2026-11-08に開始。**Previewビルドは成功、認証後の配信検査と本番切り替えは未完了。**

## 確認済み

- `codex/astro-migration-baseline` をGitHubへpushし、VercelのGitHub連携によるPreviewを作成した。`main` は変更していない。
- 検査対象コード `d069ae90dd03b97ab94374b90ac5b3bbd4b074ae` の本体Previewが成功した。GitHub Deployment IDは `7633900204`、環境名は `Preview – ponta-headphone-blog`。
- [Vercelのデプロイ詳細](https://vercel.com/ponta2gits-projects/ponta-headphone-blog/9AcsnEhhSgmLYo3qZHomJQSzaZZR) / [Preview](https://ponta-headphone-blog-hz78tmstz-ponta2gits-projects.vercel.app)。
- Previewへの未認証HTTPアクセスは302でVercel認証へ転送された。`x-robots-tag: noindex` は認証応答で観測した値であり、アプリケーションHTMLの検査成功とは扱わない。
- 旧metagenにもGitHub連携が残っているため、同じpushでそのPreviewも生成された。現在の本番やプロジェクト設定は変更していない。
- 公開中の `https://ponta-headphone.net/` では旧Next.jsスクリプト、`robots=index, follow`、公開済みGTM ID `GTM-TK3HL5Z` を確認した。スクリプトは実行せずHTMLを読み取った。

## HTTP検査の準備

[verify-deployment.mjs](../../scripts/verify-deployment.mjs) を追加した。次を検査する。

- 通常48URLのHTTP 200、canonical、title、h1、description、JSON-LD、環境別のrobots・GTM出力。
- ルート以外の47URLについて、末尾スラッシュと`.html`からの恒久転送94件。
- 未知URLのHTTP 404と独自ページ。
- 旧記事画像11URLのHTTP応答と工程1のSHA-256との一致。
- ページが参照する画像・srcset・CSS・JavaScriptの取得。
- 最新5件のRSSのタイトル・URL・GUID・抜粋・JST基準の公開日時。
- `/sitemap.xml` の恒久転送、サイトマップの全48URL、robots.txt。

検査スクリプトのlint・整形・差分検査が成功。既存の `dist/` と転送規則を配信する一時ローカルサーバーに対して **200項目成功・失敗0**。これは検査スクリプトの動作確認であり、Vercelの転送規則や配信内容を実証した結果ではない。

```sh
node scripts/verify-deployment.mjs https://<deployment-host> preview /tmp/preview-check.json
node scripts/verify-deployment.mjs https://ponta-headphone.net production /tmp/production-check.json
```

スクリプトは未認証の302等を検出すると最初のリクエストで停止する。認証情報の抽出・保存や保護設定の変更は行わない。保護されたPreviewはログイン済みブラウザーで検査する。

## 続きに必要な確認

1. Vercelへログインし、上記Previewを閲覧できる状態にする。CLI認証は未設定、利用したブラウザーのVercel管理画面も未ログインだった。
2. ビルドログとプロジェクト設定を確認する。ルート、Node.js 24、pnpmのfrozen/strictインストール、静的出力、システム環境変数の公開設定を記録する。ビルド成功だけでは設定値まで確認済みとはしない。
3. Previewの48URL・画像・フィード・転送・404・SEO・GTM抑制と、代表ページのPC／モバイル表示・コピー・先頭移動を確認する。
4. Productionの `GTM_ID` または旧名 `NEXT_PUBLIC_GTAGMGR_ID` が現在の公開済みIDと対応し、`VERCEL_ENV=production` がビルドに渡ることを確認する。
5. 検査成功後、移行ブランチを本番ブランチへ統合してProductionビルドを作成する。PreviewのHTMLはnoindex・GTMなしであるため、単なるドメイン付け替えで公開しない。VercelのPreview昇格も現在はProduction変数による再ビルドを行うが、実際の環境と生成物を確認する。
6. 公開ドメインに対してHTTP検査を実行し、ブラウザーでGTMの実ロード・送信を確認する。生成HTMLにIDがあることと計測の成立は分けて確認する。
7. 本体から新しいRSS・サイトマップが配信され、旧metagenへの依存がなくなったことを確認する。旧metagenの停止・削除は安定確認後の別作業とする。

## 切り戻し先と手順

切り替え前の本番は `a4dc608448d105214fa7efa05259270241505ed5`。GitHub Deployment IDは `7223664527`、環境名は `Production – ponta-headphone-blog`。

- [旧本番のデプロイ詳細](https://vercel.com/ponta2gits-projects/ponta-headphone-blog/AXWmS2jHUhxtzobSbxFnuioXQfZs)
- [旧本番の固有URL](https://ponta-headphone-blog-exhe1b9ii-ponta2gits-projects.vercel.app)

切り替え後に不具合があれば、本体プロジェクトのDeploymentsから、この旧本番デプロイへのInstant Rollbackを行う。旧本番を削除せず、旧metagenも動作したまま保持する。旧デプロイの `vercel.json` にはmetagenへのrewriteが含まれるため、フィードも切り戻し対象になる。

Instant Rollbackは既存デプロイへドメインを戻す操作で、再ビルドはしない。Gitの `main` や共有のプロジェクト設定まで元に戻す操作ではない。設定変更が必要になった場合は変更前の値を記録し、別途復元する。コードは必要に応じて通常のrevertで戻し、以後の自動デプロイで不具合版へ戻らないようにする。切り戻し後にも公開ページ・画像・RSS・サイトマップ・GTMを確認する。

現時点では管理画面での切り戻し操作の可否確認・実行は未実施。上記は取得済みデプロイ情報に基づく手順であり、切り戻し実験の成功記録ではない。

参考: [Vercel Preview環境](https://vercel.com/docs/deployments/environments)、[PreviewからProductionへの昇格](https://vercel.com/docs/deployments/promote-preview-to-production)、[Instant Rollback](https://vercel.com/docs/instant-rollback)。
