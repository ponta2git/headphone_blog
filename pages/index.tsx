import { readFileSync } from "fs";
import { basename, join } from "path";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import NextLink from "next/link";

import { HStack, Text, Link, Heading, VStack } from "@chakra-ui/react";

import { Frontmatter } from "../types/types";
import Head from "next/head";
/*
import { compile, run } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import { remarkMdxFrontmatter } from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";

import runtime from "react/jsx-runtime";
import ReactDOMServer from "react-dom/server";
*/

import { getAllPosts } from "../libs/getAllPosts";

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
        <meta property="og:title" content="pontaのヘッドホンブログ" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://ponta-headphone.net/`} />
        <meta
          property="og:image"
          content={`https://ponta-headphone.net/headphone.jpg`}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ponta2twit" />
      </Head>
      {postsInfo.map((info) => {
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
            {/*
            <Text wordBreak="break-all">{info.excerpt}</Text>
            <Text w="100%" textAlign="right">
              <NextLink href={info.path} passHref>
                <Link color="gray.500">続きを読む</Link>
              </NextLink>
            </Text>
            */}
          </VStack>
        );
      })}
    </>
  );
};

export default Index;

export const getStaticProps: GetStaticProps = async () => {
  const TRUNC_CHAR_COUNT = 100 as const;

  const postList: string[] = [];
  for (const postPath of getAllPosts()) {
    postList.push(postPath);
  }

  const postsInfo = await Promise.all(
    postList.reverse().map(async (fileName) => {
      const postFile = readFileSync(fileName);
      const { data } = matter(postFile);

      /*
      const compiled = await compile(postFile, {
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
        development: false,
        outputFormat: "function-body",
      });

      const parsed = await run(String(compiled), runtime);

      const body = ReactDOMServer.renderToStaticMarkup(parsed.default());

      const excerpt = body
        .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
        .replace(/\r\n|\n|\r/g, "")
        .trim()
        .substring(0, TRUNC_CHAR_COUNT)
        .concat("……");

      */

      return {
        frontmatter: data,
        // excerpt,
        path: join("posts", basename(fileName, ".mdx")),
      };
    })
  );

  return {
    props: {
      postsInfo,
    },
  };
};
