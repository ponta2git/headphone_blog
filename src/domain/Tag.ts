import { Frontmatter } from "./Frontmatter";
import Definition from "./Tags.json";
import { TagPathError, TagTitleError } from "../Errors";

type TagTitle = keyof typeof Definition;

export type Tag = {
  title: TagTitle;
  path: string;
};

function isTitle(str: string): str is TagTitle {
  return str in Definition;
}

function isPath(str: string) {
  return Object.values(Definition).includes(str);
}

function create(title: TagTitle): Tag {
  return {
    title,
    path: Definition[title],
  } satisfies Tag;
}

export function tagInPost(tag: Tag, matt: Frontmatter) {
  return matt.tags
    .map((frontmatterTag) => frontmatterTag.title)
    .includes(tag.title);
}

export function toTagFromTitle(str: string) {
  if (!isTitle(str)) {
    throw TagTitleError(str);
  }

  return create(str);
}

export function toTagFromPath(str: string) {
  if (!isPath(str)) {
    throw TagPathError(str);
  }

  const title = Object.keys(Definition).find(
    (key) => Definition[key as TagTitle] === str,
  ) as TagTitle;
  return create(title);
}

export function allTags() {
  return Object.keys(Definition).map((key) => create(key as TagTitle));
}

export function isTagEqual(a: Tag, b: Tag) {
  return a.path === b.path;
}
