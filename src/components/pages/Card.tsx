/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useEffect, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import DOMPurify from "dompurify";

import { useGetUser } from "../../hooks/useGetUser";
import { GrayBackgroundLayout } from "../layouts/GrayBackGroundLayout";
import { WhiteCardLayout } from "../layouts/WhiteCardLayout";

export const Card: FC = memo(() => {
  const params = useParams();
  const navigate = useNavigate();

  const { getUserData, user, loading } = useGetUser();

  // 初回
  useEffect(() => {
    const userId = params.postId;
    if (!userId) {
      return;
    }
    getUserData(userId);
  }, [params.postId]);

  if (loading) {
    return (
      <GrayBackgroundLayout>
        <Text data-testid="loading">Loading...</Text>
      </GrayBackgroundLayout>
    );
  }

  return (
    <>
      <GrayBackgroundLayout>
        <WhiteCardLayout>
          <Stack spacing={6} data-testid="digital-card">
            <Heading size="md" data-testid="user-name">
              {user?.name}
            </Heading>
            <Box>
              <Text fontWeight="bold">自己紹介</Text>
              <Text
                fontSize="lg"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(user?.description ?? ""),
                }}
                data-testid="user-description"
              ></Text>
            </Box>
            <Box>
              <Text fontWeight="bold">好きな技術</Text>
              <Stack spacing={1}>
                {user?.skills.map((skill) => (
                  <Text fontSize="lg" key={skill.id} data-testid="user-skill">
                    {skill.name}
                  </Text>
                ))}
              </Stack>
            </Box>
            <HStack spacing={8} justify="center">
              {user?.github_id && (
                <IconButton
                  as="a"
                  href={user.github_id}
                  aria-label="GitHub"
                  icon={<FaGithub />}
                  variant="ghost"
                  size="lg"
                  fontSize="4xl"
                />
              )}
              {user?.qiita_id && (
                <IconButton
                  as="a"
                  href={user.qiita_id}
                  aria-label="Qiita"
                  icon={<MdArticle />}
                  variant="ghost"
                  size="lg"
                  fontSize="4xl"
                />
              )}
              {user?.x_id && (
                <IconButton
                  as="a"
                  href={user.x_id}
                  aria-label="X"
                  icon={<FaTwitter />}
                  variant="ghost"
                  size="lg"
                  fontSize="4xl"
                />
              )}
            </HStack>
          </Stack>
        </WhiteCardLayout>
        <Box w="100%" mt={4} textAlign="center">
          <Button w="100%" colorScheme="teal" onClick={() => navigate("/")}>
            戻る
          </Button>
        </Box>
      </GrayBackgroundLayout>
    </>
  );
});
