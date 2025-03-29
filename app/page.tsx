import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { faRadio } from "@fortawesome/free-solid-svg-icons/faRadio";
import { faSitemap } from "@fortawesome/free-solid-svg-icons/faSitemap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import ChildMenu from "../src/components/layout/ChildMenu";
import Container from "../src/components/layout/Container";
import { ExcerptCard } from "../src/components/sections/article/ExcerptCard";
import { PostdateService } from "../src/services/date/PostdateService";
import { PostService } from "../src/services/post/PostService";

export default async function Page() {
  const all = (await PostdateService.getAllPostdates()).toReversed();
  const split = all.splice(0, 5);

  const posts = await Promise.all(
    split.map((date) => PostService.getByPostdate(date)),
  );

  return (
    <Container>
      <div className="mb-4">
        <ChildMenu>
          <li className="text-link-blue transition-colors hover:text-link-blue-hover">
            <Link href="#latest-articles">新着記事</Link>
          </li>
          <li className="text-link-blue transition-colors hover:text-link-blue-hover">
            <Link href="#system-components">現在のシステム構成</Link>
          </li>
          <li className="text-link-blue transition-colors hover:text-link-blue-hover">
            <Link href="#all-articles">記事一覧</Link>
          </li>
        </ChildMenu>
      </div>

      <div className="flex flex-col gap-y-12">
        <div>
          <h1
            id="latest-articles"
            className="font-header-setting mb-4 flex flex-row items-center gap-x-1.5 text-lg text-text-heading"
          >
            <FontAwesomeIcon icon={faBolt} className="inline-block h-5 w-5" />
            <span className="inline-block">新着記事</span>
          </h1>

          <div className="flex flex-col gap-y-10">
            {posts.map((post) => (
              <ExcerptCard key={post.frontmatter.date.toISO()} post={post} />
            ))}
          </div>
        </div>

        <div>
          <h1
            id="system-components"
            className="font-header-setting mb-4 flex flex-row items-center gap-x-1.5 text-lg text-text-heading"
          >
            <FontAwesomeIcon icon={faRadio} className="inline-block h-5 w-5" />
            <span className="inline-block">現在のシステム構成</span>
          </h1>

          <div className="text-justify tracking-[-0.0125rem] break-words">
            現在のシステム構成は、
            <Link href="posts/20231211">
              <span className="text-link-blue transition-colors hover:text-link-blue-hover">
                こちらです。
              </span>
            </Link>
            筆者がいつもどのようなシステムを使っているか、気になる方はご覧ください。特に、購入物は、こちらのシステムで評価することがほとんどです。
          </div>
        </div>

        <div>
          <h1
            id="all-articles"
            className="font-header-setting mb-4 flex flex-row items-center gap-x-1.5 text-lg text-text-heading"
          >
            <FontAwesomeIcon
              icon={faSitemap}
              className="inline-block h-5 w-5"
            />
            <span className="inline-block">記事一覧</span>
          </h1>

          <div className="text-justify tracking-[-0.0125rem] break-words">
            その他、過去の記事の一覧は
            <Link href="all-articles">
              <span className="text-link-blue transition-colors hover:text-link-blue-hover">
                こちらです。
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
