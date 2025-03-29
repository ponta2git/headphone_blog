import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import {
  PostdateService,
  type Postdate,
} from "../../../services/date/PostdateService";
import { PostService } from "../../../services/post/PostService";

export async function Neighbours({ selfDate }: { selfDate: Postdate }) {
  const postdates = await PostdateService.getAllPostdates();
  const pos = postdates.findIndex((date) => date.equals(selfDate));

  const [prev, next] = [
    pos > 0 ? PostService.getByPostdate(postdates[pos - 1]) : undefined,
    pos < postdates.length - 1
      ? PostService.getByPostdate(postdates[pos + 1])
      : undefined,
  ];

  const [prevMatter, nextMatter] = [
    prev ? prev.frontmatter : undefined,
    next ? next.frontmatter : undefined,
  ];

  return (
    <div className="flex w-full flex-row items-center justify-start">
      <div className="w-[20px] shrink-0 items-center">
        <FontAwesomeIcon icon={faChevronLeft} className="block h-3 w-3" />
      </div>
      <div className="w-1/3 shrink-0 pl-1.5 leading-relaxed">
        {prevMatter && (
          <Link
            href={`/posts/${prevMatter.date.toFormat("yyyyMMdd")}`}
            className="font-header-setting text-sm tracking-[0.6px] text-primary transition-colors hover:text-primary-hover"
          >
            {prevMatter.title}
          </Link>
        )}
      </div>
      <div className="w-1/3"></div>
      <div className="w-1/3 shrink-0 pr-1.5 text-right leading-relaxed">
        {nextMatter && (
          <Link
            href={`/posts/${nextMatter.date.toFormat("yyyyMMdd")}`}
            className="font-header-setting text-sm tracking-[0.6px] text-primary transition-colors hover:text-primary-hover"
          >
            {nextMatter.title}
          </Link>
        )}
      </div>
      <div className="w-[20px] shrink-0 items-center">
        <FontAwesomeIcon icon={faChevronRight} className="ml-2 block h-3 w-3" />
      </div>
    </div>
  );
}
