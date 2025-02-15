import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toFrontmatter } from "../../../domain/Frontmatter";
import { findPostByDateWithCache } from "../../../infrastructure/CachedInfrastructure";
import { siteName } from "../../../siteBasic";

import type { PostDate } from "../../../domain/PostDate";

export async function ShareWith({ postDate }: { postDate: PostDate }) {
  const post = await findPostByDateWithCache(postDate);
  const frontmatter = toFrontmatter(post);

  return (
    <div className="inline-flex flex-row items-center justify-start gap-2 text-xs text-[#7b8ca2] lg:px-2">
      <p>Share with</p>
      <p className="h-4 w-4">
        <a
          href={
            "https://twitter.com/intent/tweet" +
            `?text=${frontmatter.title} - ${siteName}` +
            `&url=https://ponta-headphone.net/posts/${frontmatter.date.toFormat("yyyyMMdd")}`
          }
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faTwitter} size="1x" />
        </a>
      </p>
    </div>
  );
}
