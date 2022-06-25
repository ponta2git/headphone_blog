import { Center, Text, VStack, HStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <Center py={4}>
      <VStack>
        <Text fontSize="sm">(C) 2022 ponta.</Text>
        <HStack spacing={5} color="gray.500">
          <a href="mailto:coshun@gmail.com">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://twitter.com/ponta2twit" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </HStack>
      </VStack>
    </Center>
  );
};

export default Footer;
