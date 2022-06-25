import { readdirSync, readFileSync } from "fs";
import { basename, join } from "path";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import NextLink from "next/link";

import { HStack, Text, Link, Heading, VStack } from "@chakra-ui/react";

import { Frontmatter } from "../types/types";

type IndexProps = {
  postsInfo: {
    excerpt: string;
    frontmatter: Frontmatter;
    path: string;
  }[];
};

const Index = (props: IndexProps) => {
  const { postsInfo } = props;
  return postsInfo.reverse().map((info) => {
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
  });
};

export default Index;

export const getStaticProps: GetStaticProps = () => {
  const TRUNC_CHAR_COUNT = 100 as const;
  const postList = readdirSync(join("posts"));

  const postsInfo = postList.map((fileName) => {
    const postFile = readFileSync(join("posts", fileName));
    const { content, data } = matter(postFile);

    const plainContent = content
      .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
      .trim();

    const excerpt =
      plainContent.length > TRUNC_CHAR_COUNT
        ? plainContent.substring(0, TRUNC_CHAR_COUNT) + `……`
        : plainContent;

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
