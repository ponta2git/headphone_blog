import NextLink from "next/link";
import Image from "next/image";
import { Center, Heading, HStack, Link, VStack } from "@chakra-ui/react";

const Header = () => {
  return (
    <Center py={4} borderTopRadius={4}>
      <VStack spacing={5}>
        <Image
          src="/headphone.jpg"
          alt=""
          layout="intrinsic"
          width="100"
          height="100"
          style={{ borderRadius: "100%" }}
        />
        <HStack>
          <Heading as="h1" size="sm">
            <NextLink href="/" passHref>
              <Link>pontaのヘッドホンブログ</Link>
            </NextLink>
          </Heading>
        </HStack>
      </VStack>
    </Center>
  );
};

export default Header;
