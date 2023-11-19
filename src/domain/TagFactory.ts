import { Tag, TagTitle } from "./Tag"
import TagsJson from "./Tags.json"

export default class TagFactory {
  static create(tagname: TagTitle): Tag {
    return {
      title: tagname,
      alias: TagsJson[tagname],
    }
  }

  static isTagTitle(str: string): str is TagTitle {
    return !!Object.keys(TagsJson).find((tagname) => tagname === str)
  }

  static isTagAlias(str: string) {
    return !!Object.values(TagsJson).find((tagalias) => tagalias === str)
  }

  static createFromTitle(str: string): Tag {
    if (!TagFactory.isTagTitle(str)) throw new Error(`${str} is not a tag!!`)
    return TagFactory.create(str)
  }

  static createFromAlias(str: string): Tag {
    if (!TagFactory.isTagAlias(str))
      throw new Error(`${str} is not a tag alias!!`)

    const tagTitle = Object.keys(TagsJson).find(
      (title) => TagsJson[title as TagTitle] === str,
    )!

    return TagFactory.createFromTitle(tagTitle)
  }

  static createAllTags(): Tag[] {
    const tagTitles = Object.keys(TagsJson)
    // TagsJsonのキーを抽出してるので、TagTitle以外になり得ない
    return tagTitles.map((title) => TagFactory.create(title as TagTitle))
  }
}
