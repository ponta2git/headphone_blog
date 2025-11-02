# Design Tokens — 色・タイポ・スペース・モーション（No Dark Mode）

最終更新: 2025-11-02 (JST)

この文書は、ブログのデザイン・トークン設計を Core / Semantic / Component の3層で定義し、実装・レビュー・計測の基準を明確化します。ダークモードは要件外（当面はライトのみ）。

## トークン階層

- Core（物理値レイヤー）
  - colors: OKLCH（推奨）/ HEX を原色として管理（例: `--color-neutral-98`、`--color-brand-60`）
  - typography: family / size / weight / leading
  - spacing: 4px 基本のスケール（4,8,12,16,24,32,48,64）
  - radius: 2 / 4 / 8 / 12
  - shadow: 1 / 2 / 3 段（小→大）
  - motion: duration 100/150/200ms, easing standard/exit
- Semantic（意味レイヤー）
  - text.{primary,secondary,muted}
  - surface.{default,subtle,raised}
  - border.{subtle,default,strong}
  - brand.{fg,bg}
  - link.{fg,visited}
  - state.{info,success,warning,danger}.{fg,bg,border}
  - focus.ring
- Component（部品レイヤー）
  - card.surface, card.border
  - badge.{neutral,brand,tag-<family>}
  - toc.accent, quote.bar, header.nav.bg など

命名は「意味→プロパティ」優先（例: `--link-fg`、`--focus-ring`）。色の直参照（#xxxxxx）は禁止、必ず semantic 経由。

## 色設計（ライトのみ）

- 役割と対比
  - 本文 text.primary × surface.default: AA (4.5:1+) 必須
  - text.secondary: primary 比 70–80% の明度差（AA維持）
  - UI境界（非テキスト）: 1.4.11 の対象は主要境界のみ 3:1 を担保
  - focus.ring: 2px 等価 + 3:1 以上
- 状態色
  - info/成功/警告/危険 は色相別。彩度は控えめ、背景 `state.*.bg` は 6–8% 程度の明度差
- リンク
  - `--link-fg` は本文と十分な対比。`--link-visited` は色相は固定し、明度/彩度のみ軽度変化
- タグ・パレット
  - 最大 ~8 系（青/緑/黄/橙/赤/桃/紫/青緑）。一覧は無彩色優先、記事本文で強調が必要な場合のみ彩色
- CLS 回避
  - 色切替でレイアウトを動かさない。フォーカス/ホバーは色・影・拡大率のみで表現

受け入れ基準:

- 代表12ペアのコントラストテストが AA 100% 合格
- リンク/ブランド/フォーカス/状態が、色相の役割ズレなく一貫

## タイポグラフィ（日本語）

- ベース: 17px / line-height 1.8、`font-feature-settings: "palt" 1, "pkna" 1`
- 見出しスケール（和文に最適化）
  - h1: 1.6–1.8rem、h2: 1.35–1.5、h3: 1.2–1.3、h4: 1.15、h5: 1.1、h6: 1.05
- 段落間: 行間の 1.5 倍目安（読みチャンク化）
- 80chではなく 65–72ch を標準とし、本文幅を tokens で管理（例: `--measure-reading: 70ch`）

受け入れ基準:

- 200% ズームでレイアウト破綻なし（1.4.4/1.4.10）
- 英数と和文の字間が視覚的均衡

## スペーシング/レイアウト

- スケール: 4/8/12/16/24/32/48/64（本文は 12/16/24 を多用）
- コンテナ: `--container-reading: 70ch`、`--container-wide: 90ch`
- カード群の縦リズムは 8 のラスタに吸着

## モーション

- duration: 100ms（小）、150ms（標準）、200ms（出入り）
- easing: standard: cubic-bezier(0.2, 0, 0, 1)
- `prefers-reduced-motion: reduce` で 0ms フォールバック

## マイグレーション指針（実装なし版）

1. 既存 `src/styles/tokens/colors.css` を semantic 命名に整理（直値参照の禁止を ESLint/Stylelint で警告）
2. フォーカスリング、visited、state のトークンを追加
3. 見出しスケールと段落間隔を tokens 化

## チェックリスト

- [ ] コントラスト自動テスト（AA）に合格
- [ ] フォーカスリング一貫、2px/3:1 以上
- [ ] 直参照カラーが 0 件（semantic 経由のみ）
