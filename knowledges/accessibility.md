# Accessibility — ランドマーク/フォーカス/ナビ（WCAG 2.2 AA）

最終更新: 2025-11-02 (JST)

WCAG 2.2 AA を主目標とし、App Router + 静的出力の前提で実装・検証します。

## ランドマーク設計（WAI-ARIA APG 準拠）

- header → banner
- nav（サイト）→ navigation[aria-label="サイト"]
- main → main（1ページ1つ）
- footer → contentinfo
- 目次 → navigation[aria-label="目次"]
- 関連/隣接 → navigation[aria-label="関連記事"|"前後の記事"]
- 検索（導入時）→ search（可能なら `<search>`）
- `section` は見出しがある場合のみ region（aria-labelledby 必須）

重複 landmark は aria-label をユニークに。ランドマーク順序はページ間で一貫。

## フォーカス/キーボード

- 2.4.7 Focus Visible: 常に明確なリング
- 2.4.11/12 Focus Not Obscured: 固定ヘッダと被らない（`scroll-margin-top`）
- 2.4.13 Focus Appearance: 2px 等価・3:1 以上（可能な範囲で準拠）
- スキップリンク: 「本文へスキップ」（先頭、focus 時に表示）

## ターゲットサイズ/リンク目的

- 2.5.8 Target Size (Minimum): 24×24 CSS px 以上、または十分な間隔
- 2.4.4/2.4.9 Link Purpose: リンク単体で意味が伝わる。"続きを読む" 単独は不可（タイトル併記）

## TOC/セクション

- TOC は h が 3 つ以上で nav として表示
- `figure/figcaption` を画像に付与、`<time datetime>` を日付に使用

## 認知・心理の原則（適用）

- 近接/類同/共通領域でカード/セクションを視覚グループ化
- preattentive: 色相は意味専用（ブランド/リンク/状態）。本文装飾は明度差中心
- Hick/Fitts: ナビ項目は少数、主要ターゲットは 24×24 以上（推奨 44×44）
- Von Restorff: 記事末の「隣接→関連記事」に最小アクセントで視線誘導

## チェックリスト（手動）

- VoiceOver で landmarks → headings → links へ順に探索し迷子にならない
- フォーカスが固定ヘッダに隠れない（記事の見出しリンクで確認）
- TOC/関連記事/隣接の aria-label が固有

## 受け入れ基準

- Lighthouse Accessibility ≥ 96
- 主要画面で landmark 重複/欠落なし
- キーボードのみで主要タスク達成（閲覧/回遊）
