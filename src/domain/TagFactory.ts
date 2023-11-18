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

  static createFromString(str: string): Tag {
    if (!TagFactory.isTagTitle(str)) throw `${str} is not a tag!!`
    return TagFactory.create(str)
  }

  static createAllTags(): Tag[] {
    const tagTitles = Object.keys(TagsJson)
    // TagsJsonのキーを抽出してるので、TagTitle以外になり得ない
    return tagTitles.map((title) => TagFactory.create(title as TagTitle))
  }
}
