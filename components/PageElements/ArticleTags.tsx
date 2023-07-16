import type { HTMLProps } from "react"
import Link from "next/link"
import Image from "next/image"
import type { MDXComponents } from "mdx/types"

const numberOnly = (num: string | number | undefined) =>
  !Number.isNaN(Number(num)) ? Number(num) : undefined

const ArticleTags: MDXComponents = {
  h1: (props: HTMLProps<HTMLHeadingElement>) => (
    <h3 {...props} className="text-lg" />
  ),
  h2: (props: HTMLProps<HTMLHeadingElement>) => <h4 {...props} />,
  a: ({ href, ...props }: HTMLProps<HTMLAnchorElement>) =>
    href ? (
      href.startsWith("http") ? (
        <a
          {...props}
          href={href}
          rel="noopener noreferrer"
          className="text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
        />
      ) : (
        <Link
          href={href}
          className=" text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
        >
          {props.children}
        </Link>
      )
    ) : null,
  img: ({ src, alt, width, height }: HTMLProps<HTMLImageElement>) =>
    src ? (
      <Image
        src={src}
        alt={alt ?? ""}
        width={numberOnly(width)}
        height={numberOnly(height)}
        className="mx-auto block rounded-md shadow-md"
      />
    ) : null,
  ul: (props: HTMLProps<HTMLUListElement>) => (
    <ul {...props} className="ml-4 list-disc" />
  ),
  table: (props: HTMLProps<HTMLTableElement>) => (
    <table {...props} className="mx-auto" />
  ),
  th: (props: HTMLProps<HTMLTableCellElement>) => (
    <th
      {...props}
      className="border-b-[1px] border-slate-300 pb-1 text-left text-sm"
    />
  ),
  td: (props: HTMLProps<HTMLTableCellElement>) => (
    <td {...props} className="pr-4" />
  ),
}

export default ArticleTags
