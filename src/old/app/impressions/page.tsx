import { faHeadphonesSimple } from "@fortawesome/free-solid-svg-icons/faHeadphonesSimple";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import Container from "../../components/layout/Container";
import { MetaCard } from "../../components/sections/article/MetaCard";
import { generateArchiveMetadata } from "../../posts/meta";
import { getPostsByTag } from "../../posts/api";
import * as TagService from "../../lib/tag";

import type { Post } from "../../posts/types";

export function generateMetadata() {
  return generateArchiveMetadata(
    "機材インプレッション",
    "impressions",
    "機材のインプレッション記事一覧",
  );
}

export default async function Page() {
  const tryTag = TagService.fromName("試聴");
  const purchaseTag = TagService.fromName("購入");

  const [tryPosts, purchasePosts] = await Promise.all([
    getPostsByTag(tryTag),
    getPostsByTag(purchaseTag),
  ]);

  // Combine and deduplicate posts
  const postMap = new Map<string, Post>();
  [...tryPosts, ...purchasePosts].forEach((post) => {
    const key = post.frontmatter.date.toISO();
    if (key && !postMap.has(key)) {
      postMap.set(key, post);
    }
  });

  const filtered = Array.from(postMap.values()).sort(
    (a, b) => b.frontmatter.date.toMillis() - a.frontmatter.date.toMillis(),
  );

  return (
    <Container>
      <h1 className="font-header-setting mb-4 flex flex-row items-center gap-x-1.5 text-lg text-text-heading">
        <FontAwesomeIcon
          icon={faHeadphonesSimple}
          className="inline-block h-5 w-5"
        />
        <span className="inline-block">感想</span>
      </h1>
      <div className="flex flex-col gap-y-4">
        <div className="text-justify tracking-[-0.0125rem] break-words">
          わたしが実際に聴いた機材のインプレッションの一覧です。このサイトのメインコンテンツの一つです。わたしの中の機材に対する評価指標・考え方に関しては、こちらの
          <Link href="/tags/metric">
            <span className="text-link-blue transition-colors hover:text-link-blue-hover">
              これらの記事を読むとわかりやすい
            </span>
          </Link>
          ですので、先にそちらをご覧ください。
        </div>
        {filtered.map((post) => (
          <MetaCard key={post.frontmatter.date.toISO()} post={post} />
        ))}
        <div className="text-justify tracking-[-0.0125rem] break-words">
          別ジャンルの記事をお探しなら、
          <Link href="/tags">
            <span className="text-link-blue transition-colors hover:text-link-blue-hover">
              ジャンル一覧をご覧ください。
            </span>
          </Link>
        </div>
      </div>
    </Container>
  );
}
