import { PropsWithChildren } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import NextLink from "next/link";

import { readFileSync } from "fs";
import { basename, join } from "path";
import { ParsedUrlQuery } from "querystring";
import { compileSync, runSync } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";

import {
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Text,
  HStack,
  Link,
  UnorderedList,
  ListProps,
  ListItem,
  ListItemProps,
  Box,
} from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";

import { getAllPosts } from "../../../libs/getAllPosts";

type PostProps = {
  content: String;
  name: String;
};

const components = {
  h1: (props: PropsWithChildren) => (
    <Heading as="h3" fontSize="lg" {...props}>
      {props.children}
    </Heading>
  ),
  table: (props: PropsWithChildren) => <Table {...props} />,
  tr: (props: PropsWithChildren) => <Tr {...props} />,
  thead: (props: PropsWithChildren) => <Thead {...props} />,
  th: (props: PropsWithChildren) => (
    <Th p={1} textTransform="none" color="gray.500" {...props} />
  ),
  tbody: (props: PropsWithChildren) => <Tbody {...props} />,
  td: (props: PropsWithChildren) => <Td p={1} {...props} />,
  a: ({ href, children }: PropsWithChildren<HTMLAnchorElement>) => {
    if (href.startsWith("http")) {
      return (
        <Link href={href} rel="noopener noreferrer" color="telegram.600">
          {children}
        </Link>
      );
    } else {
      return (
        <NextLink href={href} passHref>
          <Link color="telegram.600">{children}</Link>
        </NextLink>
      );
    }
  },
  img: ({ alt, src, width, height }: PropsWithChildren<HTMLImageElement>) => {
    return (
      <div>
        <a href={src}>
          <Image
            src={src}
            alt={alt}
            layout="intrinsic"
            width={width}
            height={height}
          />
        </a>
      </div>
    );
  },
  ul: (props: PropsWithChildren<ListProps>) => <UnorderedList {...props} />,
  li: (props: PropsWithChildren<ListItemProps>) => (
    <ListItem ml={5} {...props} />
  ),
};

const Post = (props: PostProps) => {
  const { content, name } = props;
  const parsed = runSync(content, runtime);
  const body = parsed.default({ components });

  return (
    <>
      <Head>
        <title>{`${parsed.title} - pontaのヘッドホンブログ`}</title>
        <meta
          property="og:title"
          content={`${parsed.title} - pontaのヘッドホンブログ`}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://ponta-headphone.net/posts/${name}`}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ponta2twit" />
      </Head>
      <VStack p={6} align={"stretch"}>
        <Heading as="h2" fontSize="xl">
          {parsed.title}
        </Heading>
        <Text color="gray.500" fontSize="12">
          {parsed.date}
        </Text>
        <VStack align="stretch" spacing={6}>
          {body}
        </VStack>
      </VStack>
    </>
  );
};

export default Post;

interface PostInfo {
  name: string;
}

interface PostUrlQuery extends ParsedUrlQuery, PostInfo {}

export const getStaticPaths: GetStaticPaths<PostUrlQuery> = () => {
  const paths: { params: PostUrlQuery }[] = [];

  for (const postPath of getAllPosts()) {
    paths.push({
      params: {
        name: basename(postPath, ".mdx"),
      },
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostProps, PostUrlQuery> = async (
  context
) => {
  if (!context.params) return { notFound: true };

  const { name } = context.params;
  const year = name.slice(0, 4); // extract year from filename.

  const file = readFileSync(join("posts", year, `${name}.mdx`));
  const compiled = compileSync(file, {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
    development: false,
    outputFormat: "function-body",
  });

  // convert img => _components.img
  const tricked = String(compiled).replaceAll('"img"', "_components.img");

  return {
    props: {
      content: tricked,
      name,
    },
  };
};
