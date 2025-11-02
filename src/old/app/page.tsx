import Link from "next/link";

import Container from "../components/layout/Container";
import { ExcerptCard } from "../components/sections/article/ExcerptCard";
import { getAllPostDates, getPostByDate } from "../posts/api";
import { PageMenu } from "../components/layout/PageMenu";

export default async function Page() {
  const all = (await getAllPostDates()).toReversed();
  const split = all.slice(0, 5);

  const posts = await Promise.all(split.map((date) => getPostByDate(date)));

  return (
    <>
      <div className="">
        <PageMenu
          menuItems={[
            { label: "新着記事", href: "latest-articles" },
            { label: "現在のシステム構成", href: "system-components" },
            { label: "記事一覧", href: "all-articles" },
          ]}
        />
      </div>
      <Container>
        <div className="flex flex-col gap-y-12">
          <section>
            <h1
              id="latest-articles"
              className="font-header text-bigger text-heading"
            >
              {/* <FontAwesomeIcon icon={faBolt} className="inline-block h-5 w-5" /> */}
              <span className="inline-block">新着記事</span>
            </h1>

            <div className="flex flex-col gap-y-10">
              {posts.map((post) => (
                <ExcerptCard key={post.frontmatter.date.toISO()} post={post} />
              ))}
            </div>
          </section>

          <section>
            <h1
              id="system-components"
              className="font-header text-bigger text-heading"
            >
              {/* <FontAwesomeIcon
                icon={faRadio}
                className="inline-block h-5 w-5"
              /> */}
              <span className="inline-block">現在のシステム構成</span>
            </h1>

            <div className="text-justify tracking-[-0.0125rem] break-words">
              現在のシステム構成は、
              <Link href="/posts/20250320">
                <span className="text-link-blue transition-colors hover:text-link-blue-hover">
                  こちらです。
                </span>
              </Link>
              筆者がいつもどのようなシステムを使っているか、気になる方はご覧ください。特に、購入物は、こちらのシステムで評価することがほとんどです。
            </div>
          </section>

          <section>
            <h1
              id="all-articles"
              className="font-header text-bigger text-heading"
            >
              {/* <FontAwesomeIcon
                icon={faSitemap}
                className="inline-block h-5 w-5"
              /> */}
              <span className="inline-block">記事一覧</span>
            </h1>

            <div className="text-justify tracking-[-0.0125rem] break-words">
              その他、過去の記事の一覧は
              <Link href="/all-articles">
                <span className="text-link-blue transition-colors hover:text-link-blue-hover">
                  こちらです。
                </span>
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
