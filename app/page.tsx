import Container from "../src/components/PageElements/Container"
import { ExcerptCard } from "../src/components/PageElements/ExcerptCard"
import { Tab } from "../src/components/PageElements/Tab"
import Wrapper from "../src/components/PageElements/Wrapper"
import { toFrontmatter } from "../src/domain/Frontmatter"
import {
  findPostByDateWithCache,
  getAllPostDatesWithCache,
} from "../src/infrastructure/CachedInfrastructure"

export default async function Page() {
  const postDates = await getAllPostDatesWithCache()

  const allPosts = await Promise.all([
    ...postDates.map((date) => findPostByDateWithCache(date)),
  ])

  const allMatters = allPosts.map((post) => toFrontmatter(post)).toReversed()

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
