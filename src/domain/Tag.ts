import TagsJson from "./Tags.json"

export type TagTitle = keyof typeof TagsJson

export type Tag = {
  title: TagTitle
  alias: string
}
