import { Text, VStack, HStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <VStack mb={5}>
      <Text fontSize="sm" align={"center"}>
        (C) 2023 ponta. <br />
        このサイトはGoogle Analyticsを使用しています
      </Text>
      <HStack spacing={5} color="gray.500">
        <a href="mailto:coshun@gmail.com">
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
        <a href="https://twitter.com/ponta2twit" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      </HStack>
    </VStack>
  );
};

export default Footer;
