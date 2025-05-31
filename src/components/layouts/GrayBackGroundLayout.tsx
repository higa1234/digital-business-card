// components/layouts/GrayBackgroundLayout.tsx
import { Box, Container } from "@chakra-ui/react";
import { memo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const GrayBackgroundLayout = memo(({ children }: Props) => {
  return (
    <Box bg="gray.100" minH="100vh" py={10}>
      <Container maxW="sm" centerContent>
        {children}
      </Container>
    </Box>
  );
});
