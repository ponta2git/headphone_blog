import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../layouts/theme";
import Container from "../layouts/container";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <ChakraProvider resetCSS theme={theme}>
        <Container>
          <Component {...pageProps} />
        </Container>
      </ChakraProvider>
      <Analytics />
    </>
  );
};

export default MyApp;
