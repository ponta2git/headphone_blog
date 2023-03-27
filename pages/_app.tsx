import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../layouts/theme";
import Container from "../layouts/container";
import GoogleAnalytics from "../components/GoogleAnalytics/ga";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      {process.env.NODE_ENV === "production" && <GoogleAnalytics />}

      <ChakraProvider resetCSS theme={theme}>
        <Container>
          <Component {...pageProps} />
        </Container>
      </ChakraProvider>
    </>
  );
};

export default MyApp;
