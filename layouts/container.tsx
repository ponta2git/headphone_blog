import type { FC, PropsWithChildren } from "react";
import { Box, Divider } from "@chakra-ui/react";

import Header from "./header";
import Footer from "./footer";

const Container: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      w={{ base: "90%", lg: "60%" }}
      mx="auto"
      my={7}
      borderRadius="md"
      bgColor="gray.50"
      shadow="lg"
    >
      <Header />
      <Divider />
      <Box p={4}>{children}</Box>
      <Divider />
      <Footer />
    </Box>
  );
};

export default Container;
