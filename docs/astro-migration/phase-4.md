# Astro移行：工程4の検証と切り替え記録

2026-11-08に実施。**Vercel Previewの配信・ブラウザー検査が完了。本番切り替え前の記録。**

## 確認済み

- `codex/astro-migration-baseline` をGitHubへpushし、VercelのGitHub連携によるPreviewを作成した。`main` は変更していない。
- 検査対象コード `a3c77763af9a29e8e161ec490207b5e68d00d1e6` の本体Previewが成功した。Vercel Deploymentは `dpl_3qyT1hgkuBwE7FuC2gtcnedewCEr`、環境はPreview、状態はREADY。
- [Vercelのデプロイ詳細](https://vercel.com/ponta2gits-projects/ponta-headphone-blog/3qyT1hgkuBwE7FuC2gtcnedewCEr) / [Preview](https://ponta-headphone-blog-l27gb5jfj-ponta2gits-projects.vercel.app)。
- 初回の未認証HTTPアクセスは302でVercel認証へ転送された。その後Vercelプラグインの接続・チーム承認を行い、ユーザーの明示承認を受けて、このPreview専用の23時間有効な共有リンクを新規作成した。アプリケーションの配信内容はこの認証後に検査した。
- ビルドログでNode.js 24、pnpm 10.8.0、frozen/strictインストール、`astro build` の成功を確認。`/vercel/path0` から `dist/` へ完全静的生成し、通常48ページ＋404、変換画像41件を出力した。
- 公開中の `https://ponta-headphone.net/` では旧Next.jsスクリプト、`robots=index, follow`、公開済みGTM ID `GTM-TK3HL5Z` を確認した。スクリプトは実行せずHTMLを読み取った。

## 配信・ブラウザー検査

[verify-deployment.mjs](../../scripts/verify-deployment.mjs) を追加した。次を検査する。

- 通常48URLのHTTP 200、canonical、title、h1、description、JSON-LD、環境別のrobots・GTM出力。
- ルート以外の47URLについて、末尾スラッシュと`.html`からの恒久転送94件。
- 未知URLのHTTP 404と独自ページ。
- 旧記事画像11URLのHTTP応答と工程1のSHA-256との一致。
- ページが参照する画像・srcset・CSS・JavaScriptの取得。
- 最新5件のRSSのタイトル・URL・GUID・抜粋・JST基準の公開日時。
- `/sitemap.xml` の恒久転送、サイトマップの全48URL、robots.txt。

検査スクリプトのlint・整形・差分検査が成功。ローカルの一時サーバーでの動作確認後、**Vercel Previewに対して200項目成功・失敗0**。全結果は [preview-http.json](./preview-http.json) に保存した。

| 項目           | Vercel Previewでの結果                                                              |
| -------------- | ----------------------------------------------------------------------------------- |
| ページ・転送   | 通常48URLが200。末尾スラッシュ47件と`.html`47件が恒久転送。未知URLは独自404         |
| 画像・アセット | 旧記事画像11件のSHA-256が工程1と一致。参照される画像・CSS等42アセットを取得         |
| SEO・フィード  | canonical・JSON-LD、RSSの最新5件・GUID・JST日時・抜粋、サイトマップ48URLが正常      |
| 検索・計測     | 全48ページにnoindex。robots.txtはDisallow。GTMのHTML出力なし                        |
| 表示           | Chromium、1280×900と390×844。代表7ページ×2サイズの14表示で横はみ出し・画像エラー0   |
| 操作           | Enterでコピー完了通知、先頭移動後のフォーカス、矢印キーによる表の横スクロールを確認 |
| ブラウザー通信 | 上記表示検査中の実行例外・失敗した通信・HTTP 400以上の応答0、GTMの通信0             |

代表ページは `/`、`/tags/system`、記事 `20220626`・`20231211`・`20250518`・`20240421`・`20250330`。縦長画像の配信寸法も確認した。

コピーはアプリケーションの成功通知を確認した。検査用ブラウザーのクリップボード読み取り結果は空だったため、クリップボード内容そのものを確認済みとはしない。ローカルでのコピー成功・失敗・キーボード操作の検査結果は工程3の記録を参照。

```sh
node scripts/verify-deployment.mjs https://<deployment-host> preview /tmp/preview-check.json
node scripts/verify-deployment.mjs https://ponta-headphone.net production /tmp/production-check.json
```

スクリプトは未認証の302等を検出すると最初のリクエストで停止する。承認済みの共有URLがある場合は `--share-url-stdin` を追加し、入力待ちへURLを1行で渡す。同じPreviewのURLだけを受け付け、取得したセッションCookieはそのプロセスのメモリ内でのみ使用する。共有URL・Cookieは本資料や検査レポートに含めない。プロジェクトの認証保護は有効のまま。

## Vercel設定と本番切り替え

本体プロジェクトは `ponta-headphone-blog`（`prj_kSrF1VHPqBVeZLQIPaWavbN0w8eC`）。

| 設定                   | 変更前                                | 切り替え用設定                                            |
| ---------------------- | ------------------------------------- | --------------------------------------------------------- |
| Framework              | Next.js                               | Astro                                                     |
| Node.js                | 22.x                                  | 24.x                                                      |
| システム環境変数の公開 | APIの取得結果に値が含まれず未取得     | `autoExposeSystemEnvs: true` を指定し更新成功             |
| GTM                    | Productionの `NEXT_PUBLIC_GTAGMGR_ID` | 既存値を維持。公開中の `GTM-TK3HL5Z` に一致することを照合 |
| 認証保護               | Previewと本番固有URLでVercel認証      | 変更なし                                                  |

Preview時点ではリポジトリ設定がNext.js・Node.js 22という既定値を上書きしていた。現在は管理画面側も実際の構成に揃えた。インストール・ビルド・出力・URL正規化は引き続き `vercel.json` で管理する。Productionのシステム環境変数の反映は、本番のnoindex解除とGTM出力でも検査する。

旧 `headphone-blog-metagen` も同じGitHubリポジトリからAstroをビルドしていた。mainへの統合で旧フィードが上書きされないよう、このプロジェクトのIgnored Build Stepを **`exit 0`** へ設定した。変更前のコマンドはAPI応答に含まれず未取得。既存の本番配信は維持し、Pauseや削除は行っていない。旧metagen本番は `dpl_EJnS6UCdGFL6CgnktiMjLYqvcgtP`、コミットは `a4dc608`。

本番切り替えの順序:

1. 検査対象とアプリケーションが同一であることを確認し、移行ブランチをmainへ統合してProductionビルドを作成する。PreviewのHTMLをドメイン付け替えだけで公開しない。
2. 公開ドメインへ200項目のHTTP検査を実行し、www等の別名からの転送も確認する。
3. ブラウザーでGTMの実ロード・送信を確認する。生成HTMLのIDと実計測の成立は分けて記録する。
4. 本体からRSS・サイトマップが配信されていることと、旧metagenの本番が保持されていることを確認する。旧metagenのサービス停止・削除は安定確認後の別作業とする。

## 切り戻し先と手順

切り替え前の本番は `a4dc608448d105214fa7efa05259270241505ed5`。GitHub Deployment IDは `7223664527`、環境名は `Production – ponta-headphone-blog`。

- [旧本番のデプロイ詳細](https://vercel.com/ponta2gits-projects/ponta-headphone-blog/AXWmS2jHUhxtzobSbxFnuioXQfZs)
- [旧本番の固有URL](https://ponta-headphone-blog-exhe1b9ii-ponta2gits-projects.vercel.app)

切り替え後に不具合があれば、本体プロジェクトのDeploymentsから、この旧本番デプロイへのInstant Rollbackを行う。旧本番を削除せず、旧metagenも動作したまま保持する。旧デプロイの `vercel.json` にはmetagenへのrewriteが含まれるため、フィードも切り戻し対象になる。

Instant Rollbackは既存デプロイへドメインを戻す操作で、再ビルドはしない。Gitのmainやプロジェクトの既定設定は戻らない。コードは通常のrevertで戻し、以後の自動デプロイで不具合版へ戻らないようにする。旧コードを再ビルドする場合は本体のFrameworkをNext.js、Node.jsを22.xへ戻す。システム環境変数の公開と旧metagenのビルド抑制は切り戻し時も維持できる。切り戻し後にも公開ページ・画像・RSS・サイトマップ・GTMを確認する。

APIで旧本番のREADY・Production・mainと、切り戻し対象の `ponta-headphone.net`、`www.ponta-headphone.net`、`ponta-headphone-blog.vercel.app` の3別名を確認した。切り戻しの実行試験は行っていない。

参考: [Vercel Preview環境](https://vercel.com/docs/deployments/environments)、[システム環境変数](https://vercel.com/docs/environment-variables/system-environment-variables)、[Ignored Build Step](https://vercel.com/kb/guide/how-do-i-use-the-ignored-build-step-field-on-vercel)、[Instant Rollback](https://vercel.com/docs/instant-rollback)。
