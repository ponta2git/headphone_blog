import {
  faCircleExclamation,
  faExternalLink,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import Link from "next/link"

import type { MDXRemoteProps } from "next-mdx-remote/rsc"
import type { HTMLProps, PropsWithChildren } from "react"

const numberOnly = (num: string | number | undefined) =>
  !Number.isNaN(Number(num)) ? Number(num) : undefined

const ArticleTags: Required<MDXRemoteProps["components"]> = {
  h1: (props: HTMLProps<HTMLHeadingElement>) => (
    <h2 {...props} className="text-lg font-bold" />
  ),
  h2: (props: HTMLProps<HTMLHeadingElement>) => (
    <h3 {...props} className="font-bold" />
  ),
  a: ({ href, children, ...props }: HTMLProps<HTMLAnchorElement>) =>
    href ? (
      href.startsWith("http") ? (
        <a
          {...props}
          href={href}
          rel="noopener noreferrer"
          className="mr-1 inline-flex flex-row items-center gap-x-1 text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
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
          className="text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
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
        className="mx-auto block rounded-sm shadow shadow-gray-600"
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
      className="border-b-[1px] border-slate-300 pb-1 pl-1 text-left text-sm"
    />
  ),
  td: (props: HTMLProps<HTMLTableCellElement>) => (
    <td {...props} className="py-1 pl-1 pr-4 text-sm leading-6" />
  ),
  p: (props: HTMLProps<HTMLParagraphElement>) => (
    <p {...props} className="content tracking-normal" />
  ),
  Info: (props: PropsWithChildren) => (
    <div className="flex flex-row items-center gap-x-4 rounded-lg bg-sky-100 p-4 text-sm leading-6 tracking-[0.4px]">
      <p className="h-[20px] w-[20px] shrink-0 text-sky-600">
        <FontAwesomeIcon icon={faInfoCircle} />
      </p>
      {props.children}
    </div>
  ),
  Warning: (props: PropsWithChildren) => (
    <div className="flex flex-row items-center gap-x-4 rounded-lg bg-amber-100 p-4 text-sm leading-6 tracking-[0.4px]">
      <p className="h-[20px] w-[20px] shrink-0 text-yellow-600">
        <FontAwesomeIcon icon={faCircleExclamation} />
      </p>
      {props.children}
    </div>
  ),
  Postscript: (props: PropsWithChildren) => (
    <div className="text-sm text-slate-500">{props.children}</div>
  ),
}

export default ArticleTags
