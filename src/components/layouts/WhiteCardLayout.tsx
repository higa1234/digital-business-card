import { Box } from "@chakra-ui/react";
import type { ReactNode, FC } from "react";

type Props = {
  children: ReactNode;
};

export const WhiteCardLayout: FC<Props> = ({ children }) => (
  <Box
    w="100%"
    p={6}
    mt={4}
    bg="white"
    boxShadow="md"
    borderRadius="xl"
    textAlign="left"
  >
    {children}
  </Box>
);
