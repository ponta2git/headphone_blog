import NextLink from "next/link";
import Image from "next/image";
import {
  Center,
  Heading,
  HStack,
  Link,
  VStack,
  Avatar,
} from "@chakra-ui/react";

const Header = () => {
  return (
    <Center pt={6} pb={6}>
      <VStack spacing={5}>
        <Image
          src="/headphone.jpg"
          alt=""
          width="150"
          height="150"
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
