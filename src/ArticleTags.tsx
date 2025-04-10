import {
  faCircleExclamation,
  faExternalLink,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

import type { MDXComponents } from "mdx/types";
import type { HTMLProps, PropsWithChildren } from "react";

const numberOnly = (num: string | number | undefined) =>
  !Number.isNaN(Number(num)) ? Number(num) : undefined;

const ArticleTags: MDXComponents = {
  h1: (props: HTMLProps<HTMLHeadingElement>) => (
    // skipcq: JS-0747
    <h2
      {...props}
      className="font-header-setting text-lg leading-snug font-bold tracking-[0.6px] text-text-heading"
    />
  ),
  h2: (props: HTMLProps<HTMLHeadingElement>) => (
    // skipcq: JS-0747
    <h3
      {...props}
      className="font-header-setting leading-snug font-bold tracking-[0.6px] text-text-heading"
    />
  ),
  a: ({ href, children, ...props }: HTMLProps<HTMLAnchorElement>) =>
    href ? (
      href.startsWith("http") ? (
        <a
          {...props}
          href={href}
          rel="noopener noreferrer"
          className="mr-1 inline-flex flex-row items-center gap-x-1 text-link-blue transition-colors hover:text-link-blue-hover"
        >
          {children}
          <FontAwesomeIcon
            icon={faExternalLink}
            className="inline-block h-3 w-3"
          />
        </a>
      ) : (
        <Link
          href={href}
          className="text-primary transition-colors hover:text-primary-hover"
        >
          {children}
        </Link>
      )
    ) : undefined,
  img: ({ src, alt, width, height }: HTMLProps<HTMLImageElement>) =>
    src ? (
      <Image
        src={src}
        alt={alt ?? ""}
        width={numberOnly(width) ?? 640}
        height={numberOnly(height) ?? 480}
        className="mx-auto block rounded-md shadow-sm shadow-universal-shadow"
      />
    ) : undefined,
  ul: (props: HTMLProps<HTMLUListElement>) => (
    <ul {...props} className="ml-4 list-disc" />
  ),
  table: (props: HTMLProps<HTMLTableElement>) => (
    <table
      {...props}
      className="mx-auto block max-w-full overflow-x-scroll whitespace-nowrap"
    />
  ),
  th: (props: HTMLProps<HTMLTableCellElement>) => (
    <th
      {...props}
      className="font-header-setting border-b-[1px] border-text-meta pb-2 pl-1 text-left text-sm text-text-heading"
    />
  ),
  tr: (props: HTMLProps<HTMLTableRowElement>) => (
    <tr {...props} className="rounded-lg hover:bg-bg-alt" />
  ),
  td: (props: HTMLProps<HTMLTableCellElement>) => (
    <td
      {...props}
      className="py-1.5 pr-4 pl-1 text-justify text-sm tracking-[-0.0125rem] break-words"
    />
  ),
  p: (props: HTMLProps<HTMLParagraphElement>) => (
    <p {...props} className="text-justify tracking-[-0.0125rem] break-words" />
  ),
  del: (props: HTMLProps<HTMLModElement>) => (
    <del {...props} className="text-text-meta" />
  ),
  hr: () => (
    <Image
      src="/images/line.svg"
      alt="Description of the line"
      className="block h-2 min-w-full"
    />
  ),
  Info: (props: PropsWithChildren) => (
    <div className="flex flex-row items-center gap-x-4 rounded-lg bg-bg-alt p-4 text-justify text-sm leading-6 tracking-[-0.0125rem] break-words">
      <p className="h-[20px] w-[20px] shrink-0 text-[#0d98ba]">
        <FontAwesomeIcon icon={faInfoCircle} />
      </p>
      {props.children}
    </div>
  ),
  Warning: (props: PropsWithChildren) => (
    <div className="flex flex-row items-center gap-x-4 rounded-lg bg-[#FFFACD] p-4 text-sm leading-6 tracking-[0.4px]">
      <p className="h-[20px] w-[20px] shrink-0 text-[#FFD700]">
        <FontAwesomeIcon icon={faCircleExclamation} />
      </p>
      {props.children}
    </div>
  ),
  Postscript: (props: PropsWithChildren) => (
    <div className="text-justify text-sm tracking-[-0.0125rem] break-words text-text-meta">
      {props.children}
    </div>
  ),
};

export default ArticleTags;
