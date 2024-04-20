export type PageTabName = "new" | "tags"

type PageTab = {
  name: PageTabName
  displayText: string
  topPage: string
}

export const allTabs: PageTab[] = [
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
