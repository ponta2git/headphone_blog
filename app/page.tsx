import { readFile } from "fs/promises"

import matter from "gray-matter"

import Container from "../src/components/PageElements/Container"
import { ExcerptCard } from "../src/components/PageElements/ExcerptCard"
import { Tab } from "../src/components/PageElements/Tab"
import Wrapper from "../src/components/PageElements/Wrapper"
import { toFrontmatter } from "../src/domain/Frontmatter"
import { getAllPostDatesWithCache } from "../src/infrastructure/CachedInfrastructure"

export default async function Page() {
  const postDates = await getAllPostDatesWithCache()

  const allPosts = await Promise.all([
    ...postDates.map((date) =>
      readFile(`posts/${date.year}/${date.toFormat("yyyyMMdd")}.mdx`),
    ),
  ])

  const allMatters = allPosts
    .map((post) => matter(String(post)))
    .map((raw) => toFrontmatter(raw.data))
    .toReversed()

  return (
    <Wrapper>
      <Tab active="new" />
      <Container>
        <div className="flex flex-col gap-y-8">
          {allMatters.map((matt) => (
            <ExcerptCard key={matt.date.toISODate()} frontmatter={matt} />
          ))}
        </div>
      </Container>
    </Wrapper>
  )
}
