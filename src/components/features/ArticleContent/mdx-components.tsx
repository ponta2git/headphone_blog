import type { MDXComponents } from "mdx/types";
import type { HTMLProps, PropsWithChildren, ReactNode } from "react";
import React from "react";
import Image from "next/image";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons/faCircleExclamation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "../../ui/Link";
import styles from "./ArticleContent.module.css";

const numberOnly = (num: string | number | undefined) =>
  !Number.isNaN(Number(num)) ? Number(num) : undefined;

const textFromChildren = (children: ReactNode): string => {
  const parts: string[] = [];
  const walk = (node: ReactNode): void => {
    if (node == null || node === false) return;
    if (typeof node === "string" || typeof node === "number") {
      parts.push(String(node));
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (React.isValidElement(node)) {
      // Dive into children of elements (em, strong, code, etc.)
      const element = node as React.ReactElement<{ children?: ReactNode }>;
      const child = element.props?.children;
      walk(child);
    }
  };
  walk(children);
  return parts.join("").trim();
};

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .replace(/[！-／：-＠［-｀｛-～]/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export function createMdxComponents(): MDXComponents {
  const counts = new Map<string, number>();
  const uniqueId = (text: string): string => {
    const baseRaw = slugify(text);
    const base = baseRaw.length > 0 ? baseRaw : "section";
    const next = (counts.get(base) ?? 0) + 1;
    counts.set(base, next);
    return next === 1 ? base : `${base}-${next}`;
  };

  return {
    h2: (props: HTMLProps<HTMLHeadingElement>) => {
      const id = props.id ?? uniqueId(textFromChildren(props.children));
      return <h2 {...props} id={id} className={styles.h2} />;
    },
    h3: (props: HTMLProps<HTMLHeadingElement>) => {
      const id = props.id ?? uniqueId(textFromChildren(props.children));
      return <h3 {...props} id={id} className={styles.h3} />;
    },
    h4: (props: HTMLProps<HTMLHeadingElement>) => {
      const id = props.id ?? uniqueId(textFromChildren(props.children));
      return <h4 {...props} id={id} className={styles.h4} />;
    },
    h5: (props: HTMLProps<HTMLHeadingElement>) => {
      const id = props.id ?? uniqueId(textFromChildren(props.children));
      return <h5 {...props} id={id} className={styles.h5} />;
    },
    h6: (props: HTMLProps<HTMLHeadingElement>) => {
      const id = props.id ?? uniqueId(textFromChildren(props.children));
      return <h6 {...props} id={id} className={styles.h6} />;
    },
    a: ({ href, children }: HTMLProps<HTMLAnchorElement>) =>
      href ? (
        <Link href={href} external={href.startsWith("http")}>
          {children}
        </Link>
      ) : undefined,
    img: ({ src, alt, width, height }: HTMLProps<HTMLImageElement>) =>
      src ? (
        <Image
          src={src}
          alt={alt ?? ""}
          width={numberOnly(width) ?? 640}
          height={numberOnly(height) ?? 480}
          className={styles.img}
        />
      ) : undefined,
    ul: (props: HTMLProps<HTMLUListElement>) => (
      <ul {...props} className={styles.ul} />
    ),
    ol: (props: HTMLProps<HTMLOListElement>) => {
      const { type: _discard, ...rest } = props;
      void _discard;
      return <ol {...rest} className={styles.ol} />;
    },
    table: (props: HTMLProps<HTMLTableElement>) => (
      <div className={styles.tableWrapper}>
        <table {...props} className={styles.table} />
      </div>
    ),
    th: (props: HTMLProps<HTMLTableCellElement>) => (
      <th {...props} className={styles.th} />
    ),
    tr: (props: HTMLProps<HTMLTableRowElement>) => (
      <tr {...props} className={styles.tr} />
    ),
    td: (props: HTMLProps<HTMLTableCellElement>) => (
      <td {...props} className={styles.td} />
    ),
    p: (props: HTMLProps<HTMLParagraphElement>) => (
      <p {...props} className={styles.p} />
    ),
    hr: () => <hr className={styles.hr} />,
    blockquote: (props: HTMLProps<HTMLQuoteElement>) => (
      <blockquote {...props} className={styles.blockquote} />
    ),
    Info: (props: PropsWithChildren) => (
      <div className={styles.info}>
        <div className={styles.infoIcon}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </div>
        <div className={styles.infoContent}>{props.children}</div>
      </div>
    ),
    Warning: (props: PropsWithChildren) => (
      <div className={styles.warning}>
        <div className={styles.warningIcon}>
          <FontAwesomeIcon icon={faCircleExclamation} />
        </div>
        <div className={styles.warningContent}>{props.children}</div>
      </div>
    ),
    Postscript: (props: PropsWithChildren) => (
      <div className={styles.postscript}>{props.children}</div>
    ),
  };
}
