import Container from "../src/components/PageElements/Container"
import { ExcerptCard } from "../src/components/PageElements/ExcerptCard"
import { Tab } from "../src/components/PageElements/Tab"
import Wrapper from "../src/components/PageElements/Wrapper"
import IndexService from "../src/services/IndexService"

const service = new IndexService()

export default async function Page() {
  const posts = await service.getData()

  return (
    <Wrapper>
      <Tab active="new" />
      <Container>
        <div className="flex flex-col gap-y-10">
          {posts.map((post) => (
            <ExcerptCard key={post.frontmatter.date} post={post} />
          ))}
        </div>
      </Container>
    </Wrapper>
  )
}
