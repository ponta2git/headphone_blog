import NextLink from "next/link";
import Head from "next/head";

import { Link, VStack } from "@chakra-ui/react";

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>404 Not Found - pontaのヘッドホンブログ</title>
      </Head>
      <VStack
        mx={4}
        my={4}
        lineHeight="tall"
        letterSpacing="wider"
        wordBreak="break-all"
        alignItems="start"
        spacing={6}
      >
        <p>
          ページが見つかりませんでした。記事のURLが正しいかどうかお確かめください。
        </p>
        <NextLink href="/" passHref>
          <Link>トップページへ戻る</Link>
        </NextLink>
      </VStack>
    </>
  );
};

export default NotFoundPage;
