import { readdirSync, readFileSync } from "fs";
import { basename, join } from "path";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import NextLink from "next/link";

import { HStack, Text, Link, Heading, VStack } from "@chakra-ui/react";

import { Frontmatter } from "../types/types";
import Head from "next/head";
import { compileSync, runSync } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import { remarkMdxFrontmatter } from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";

import * as runtime from "react/jsx-runtime";
import ReactDOMServer from "react-dom/server";

type IndexProps = {
  postsInfo: {
    excerpt: string;
    frontmatter: Frontmatter;
    path: string;
  }[];
};

const Index = (props: IndexProps) => {
  const { postsInfo } = props;
  return (
    <>
      <Head>
        <title>pontaのヘッドホンブログ</title>
      </Head>
      {postsInfo.reverse().map((info) => {
        return (
          <VStack
            key={info.frontmatter.date}
            mx={4}
            my={4}
            lineHeight="tall"
            letterSpacing="wider"
            wordBreak="break-all"
            alignItems="start"
            spacing={6}
          >
            <HStack spacing={2} alignItems="baseline">
              <Text color="gray.500" fontSize="sm">
                {info.frontmatter.date}
              </Text>
              <NextLink href={info.path} passHref>
                <Link>
                  <Heading as="h2" fontSize="md">
                    {info.frontmatter.title}
                  </Heading>
                </Link>
              </NextLink>
            </HStack>
            <Text wordBreak="break-all">{info.excerpt}</Text>
            <Text w="100%" textAlign="right">
              <NextLink href={info.path} passHref>
                <Link color="gray.500">続きを読む</Link>
              </NextLink>
            </Text>
          </VStack>
        );
      })}
    </>
  );
};

export default Index;

export const getStaticProps: GetStaticProps = () => {
  const TRUNC_CHAR_COUNT = 100 as const;
  const postList = readdirSync(join("posts"));

  const postsInfo = postList.map((fileName) => {
    const postFile = readFileSync(join("posts", fileName));
    const { data } = matter(postFile);

    const compiled = compileSync(postFile, {
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
      outputFormat: "function-body",
    });

    const parsed = runSync(String(compiled), runtime);
    const body = ReactDOMServer.renderToStaticMarkup(parsed.default());
    const excerpt = body
      .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
      .trim()
      .substring(0, TRUNC_CHAR_COUNT)
      .concat("……");

    const path = join("posts", basename(fileName, ".mdx"));

    return {
      frontmatter: data,
      excerpt,
      path,
    };
  });

  return {
    props: {
      postsInfo,
    },
  };
};
