# Performance & Images — SSG最適化とLCP戦略

最終更新: 2025-11-02 (JST)

静的出力（output: "export"）前提で、画像とメタを pre-build に寄せ、CWV を安定化します。

## 予算（モバイル P75 目安）

- HTML ≤ 30KB
- CSS ≤ 60KB
- 実行JS ≤ 80KB
- LCP画像 ≤ 120KB
- LCP ≤ 2.5s、CLS < 0.1、INP ≤ 200ms

## 画像パイプライン（pre-build）

- 出力形式: AVIF/WebP + JPEG fallback
- 幅バリアント: 640 / 960 / 1280 / 1600
- ファイル名: コンテンツハッシュ付与（長期キャッシュ）
- `srcset/sizes` をテンプレ別に固定
  - ヒーロー: `(min-width: 960px) 960px, 100vw`
  - カード: `(min-width: 640px) 320px, 50vw`
  - 本文画像: `min(100vw, 70ch)` に準拠
- `aspect-ratio` と width/height 指定で CLS をゼロ志向

## LCP 戦略

- LCP 候補（ヒーロー or h1 ブロック）をテンプレで明示
- `<link rel="preload" as="image">` を Metadata API から付与
- LCP 要素は fold 内最上部に配置、装飾を最小化

## Lazy/優先度

- fold外画像は `loading="lazy"`
- 重要でないカード画像は遅延、LCP のみ preload + 高優先度

## メタ/ルーティング（SSG）

- `generateStaticParams()` 完全列挙、`dynamic = 'error'`
- canonical/OG/Twitter/JSON-LD は静的確定
- プリフェッチは上位テンプレのみ選択的に有効化

## 計測

- web-vitals RUM を導入（LCP要素ID、CLSの最大寄与要素を記録）
- WebPageTest で LCP 要素の認定を確認

## 受け入れ基準

- サンプル記事群で LCP ≤ 2.5s、CLS < 0.1（モバイル）
- 代表テンプレで画像の `width/height/aspect-ratio` が設定済み
- out/ に生成される画像が想定のバリアント/ハッシュで存在
