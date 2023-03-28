import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../layouts/theme";
import Container from "../layouts/container";
import GoogleTagManager from "../components/GoogleTagManager/tagmanager";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      {process.env.NODE_ENV === "production" && <GoogleTagManager />}

      <ChakraProvider resetCSS theme={theme}>
        <Container>
          <Component {...pageProps} />
        </Container>
      </ChakraProvider>
    </>
  );
};

export default MyApp;
