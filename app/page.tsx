import Container from "../src/components/PageElements/Container"
import { ExcerptCard } from "../src/components/PageElements/ExcerptCard"
import { Tab } from "../src/components/PageElements/Tab"
import Wrapper from "../src/components/PageElements/Wrapper"
import {
  getAllPostDatesWithCache,
  findPostByWithCache,
} from "../src/infrastructure/CachedInfrastructure"

export default async function Page() {
  const postDates = (await getAllPostDatesWithCache()).toReversed()
  const posts = await Promise.all(
    postDates.map((date) => findPostByWithCache(date)),
  )

  return (
    <Wrapper>
      <Tab active="new" />
      <Container>
        <div className="flex flex-col gap-y-10">
          {posts.map((post) => (
            <ExcerptCard key={post.frontmatter.date.toISODate()} post={post} />
          ))}
        </div>
      </Container>
    </Wrapper>
  )
}
