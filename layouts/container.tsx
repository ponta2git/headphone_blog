import type { FC, PropsWithChildren } from "react";
import { Box } from "@chakra-ui/react";

import Header from "./header";
import Footer from "./footer";

const Container: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      <Box
        w={{ base: "100%", md: "90%", lg: "60%" }}
        mx="auto"
        my={7}
        borderRadius="md"
        bgColor="gray.50"
        shadow="md"
        lineHeight="7"
        letterSpacing="wide"
        wordBreak="break-all"
        alignItems="start"
      >
        <Box>{children}</Box>
      </Box>
      <Footer />
    </>
  );
};

export default Container;
