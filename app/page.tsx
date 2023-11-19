import { ExcerptCard } from "../src/components/PageElements/ExcerptCard"
import { Tab } from "../src/components/PageElements/Tab"
import IndexService from "../src/services/IndexService"

const service = new IndexService()

export default async function Page() {
  const posts = await service.getData()

  return (
    <>
      <Tab active="new" />
      <div className="flex flex-col gap-y-14">
        {posts.map((post) => (
          <ExcerptCard key={post.frontmatter.date} post={post} />
        ))}
      </div>
    </>
  )
}
