import { IconDefinition } from "@fortawesome/free-brands-svg-icons"
import { faBolt, faTags } from "@fortawesome/free-solid-svg-icons"

export type PageTabName = "new" | "tags"

type PageTab = {
  name: PageTabName
  displayText: string
  topPage: string
  icon: IconDefinition
}

export const allTabs: PageTab[] = [
  {
    name: "new",
    displayText: "新着",
    topPage: "/",
    icon: faBolt,
  },
  {
    name: "tags",
    displayText: "タグ",
    topPage: "/tags",
    icon: faTags,
  },
]
