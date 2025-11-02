# Renewal Plan — headphone_blog（静的出力・ライトテーマ）

最終更新: 2025-11-02 (JST)

本計画は、静的出力（output: "export"）とライトテーマのみを前提に、没入×回遊、アクセシビリティ、パフォーマンス、SEOを横断で最適化する処方的ガイドです。詳細仕様は分割ドキュメント（Tokens/Accessibility/Content/Images）に委譲します。

関連ドキュメント:

- Design Tokens: `knowledges/design-tokens.md`
- Accessibility: `knowledges/accessibility.md`
- Content Style: `knowledges/content-style.md`
- Performance & Images (LCP): `knowledges/performance-images.md`

## 1) ゴール/KPI

- Core Web Vitals（モバイル P75）
  - LCP ≤ 2.5s、CLS < 0.1、INP ≤ 200ms
  - 参考: FCP ≤ 1.5s、TTFB ≤ 0.6s（静的配信を想定）
- アクセシビリティ
  - WCAG 2.2 AA（2.4.11/12/13、2.5.7/2.5.8 含む）
  - ランドマーク構造一貫（banner/navigation/main/complementary/contentinfo/region/search）
- SEO/ディスカバラビリティ
  - Metadata API 完全化 + BlogPosting JSON-LD、RSS/sitemap 維持
- 体験設計
  - 没入: 読みのリズム（65–72ch, lh 1.8）
  - 回遊: 最小リンク密度（タグ/関連記事/隣接/本文内リンク）
- 運用性
  - 全静的（ISR/SSRなし）、pre-build 最大活用

不変条件（Invariants）:

- output: "export"、typed routes、`dynamic = 'error'`、`dynamicParams = false`
- CSS Modules と design tokens を採用（直参照色の禁止）
- ダークモードは対象外（ライトのみ）

## 2) フェーズ別計画

### フェーズ1: 基盤の統一（1–2週）

- Landmarks/Skip/Focus
  - banner/main/navigation/contentinfo の整備、スキップリンク、focus ring（2px/3:1）、非被覆（scroll-margin-top）
- Tokens/Type
  - semantic 色・見出しスケール・段落間隔を tokens 化（直参照排除）
- Metadata/JSON-LD
  - title/description/canonical/OG/Twitter、BlogPosting を全ページで静的確定
- 受け入れ
  - Lighthouse a11y ≥ 96、対比テスト AA 100%、ランドマーク重複/欠落なし

### フェーズ2: パフォーマンス & SSG（1–2週）

- 画像パイプライン（pre-build）
  - AVIF/WebP + JPEG、幅 640/960/1280/1600、ハッシュ名、`srcset/sizes` をテンプレ別に固定
  - `width/height/aspect-ratio` 指定で CLSゼロ志向
- LCP 最適化
  - ヒーローを LCP 候補として明示、Metadata から preload 付与、fold 内先頭に配置
- JS/ルーティング
  - Client→Server化の見直し、検索は遅延・軽量実装
  - `generateStaticParams` 完全列挙、`dynamic = 'error'`
- 受け入れ
  - LCP ≤ 2.5s、CLS < 0.1（代表テンプレ/モバイル）

### フェーズ3: 回遊密度の最適化（1–2週）

- 記事テンプレ
  - タグ（≥3 あれば）、関連記事（≤4）、隣接（2）、本文内内部リンク（≥2 該当時）
- 一覧/タグ
  - カードは article セマンティクス、タグ表示は1–3、主要タグ ≤9（上部）
- ラベル/リンク目的
  - 2.4.4/2.4.9 準拠（"続きを読む" 単独禁止）
- 受け入れ
  - 重要ページへの到達が 1–2 クリックで可能、離脱率改善の兆し

### フェーズ4: 計測と運用（継続）

- RUM
  - web-vitals を導入（LCP要素ID、CLS寄与要素）。軽量アナリティクス（Plausible/Umami）
- 自動監査
  - コントラスト/ランドマーク/リンク目的のスナップショットテスト、リンク切れ検知
- 運用
  - 週次で CWV と a11y スコアを確認し小刻みに改善

## 3) 実装対象（マップ）

- tokens: `src/styles/tokens/*`（semantic 命名の導入、focus/visited/state 追加）
- レイアウト/ナビ: `src/app/layout.tsx`, `src/components/features/SiteHeader/*`, `SiteFooter/*`
- 記事: `src/app/posts/[postdate]/page.tsx`, `ArticleContent/*`, `ArticleRelations/*`
- 一覧: `src/app/page.tsx`, `src/app/all-articles/page.tsx`, `src/app/tags/*`, `ArticleCard/*`
- メタ: `src/posts/meta/*`（Metadata/JSON-LD）
- 画像: pre-build（`metagen/` 併用）で生成・差し替え

## 4) 認知・心理の運用指針（要約）

- 近接/類同/共通領域でグルーピング（カード/関連記事）
- 色相は意味専用（ブランド/リンク/状態）。装飾は明度差中心
- 行長 65–72ch、段落間 1.5×、視線の跳躍を一定化
- ナビは少数精鋭、ターゲットは ≥24×24（推奨 44×44）
- 記事末: 「隣接→関連記事→タグ」の順で導線を提示

## 5) 受け入れ基準（統合）

- a11y: WCAG 2.2 AA、Lighthouse ≥ 96、フォーカス非被覆、ターゲットサイズ
- Perf: LCP ≤ 2.5s、CLS < 0.1、実行JS ≤ 80KB、LCP画像 ≤ 120KB（代表ケース）
- SEO: すべてのページで Metadata 完備 + BlogPosting JSON-LD
- IA/回遊: 主要到達 1–2 クリック、カード/ナビのリンク目的が明確

## 6) リスクと対策

- 画像生成のビルド時間増
  - 差分ビルドとキャッシュ、対象ファイル限定
- コントラストの設計負債
  - semantic 経由の導入・自動テストをCIに組み込み
- LCP 候補の変動
  - テンプレで明示・preload を機械生成（Metadata 経由）

## 7) チェックリスト（短縮版）

- [ ] landmark が一貫（banner/nav/main/contentinfo）
- [ ] フォーカス 2px/3:1、ヘッダと非被覆
- [ ] 文章幅 65–72ch、段落間 1.5×
- [ ] 画像に width/height/aspect-ratio 指定、LCP preload あり
- [ ] 関連 ≤4、隣接 2、タグ ≥3（該当時）
- [ ] Link 目的が単体で判読（"続きを読む" 単独なし）
- [ ] JSON-LD（BlogPosting）と Metadata 完備
- [ ] LCP ≤ 2.5s、CLS < 0.1（モバイル代表ケース）

---

この計画はライトテーマのみ対象です。ダークモード導入時は Core/Semantic トークンの2系統化で拡張可能です（現時点では範囲外）。
