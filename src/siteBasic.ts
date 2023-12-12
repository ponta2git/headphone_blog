export const siteName = "pontaのヘッドホンブログ" as const
export const siteDescription = "ヘッドホンオーディオを楽しんでいます。ヘッドホンや機材のインプレッションやヘッドホンオーディオの楽しみ方などについて気楽に書き連ねています。" as const

type TabName = "new" | "tags"

type Tab = {
  name: TabName
  displayText: string
  topPage: string
}

export type ActiveTabName = TabName

export const siteTabs: Tab[] = [
  {
    name: "new",
    displayText: "新着一覧",
    topPage: "/",
  },
  {
    name: "tags",
    displayText: "タグ",
    topPage: "/tags",
  },
]
