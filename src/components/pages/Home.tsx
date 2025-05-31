import { memo, type FC } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
} from "@chakra-ui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { GrayBackgroundLayout } from "../layouts/GrayBackGroundLayout";
import { WhiteCardLayout } from "../layouts/WhiteCardLayout";

type UserId = {
  user_id: string;
};

export const Home: FC = memo(() => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserId>();
  const navigate = useNavigate(); // useNavigateを使う

  // 名刺を見る」ボタン押下時、処理
  const onSubmit: SubmitHandler<UserId> = async (data) => {
    const { user_id } = data;

    // select

    // 画面遷移
    navigate("/card/" + user_id);
  };

  return (
    <GrayBackgroundLayout>
      <Heading>デジタル名刺アプリ</Heading>
      <WhiteCardLayout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={8}>
            <FormControl isInvalid={!!errors.user_id}>
              <FormLabel>ID</FormLabel>
              <Input
                type="text"
                {...register("user_id", {
                  required: "IDを入力してください",
                })}
              ></Input>
              <FormErrorMessage>
                {errors.user_id && errors.user_id.message}
              </FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="teal" mb={4} w="100%">
              名刺をみる
            </Button>
          </Stack>
        </form>
      </WhiteCardLayout>
      <Box w="100%" mt={4} textAlign="center">
        <Link color="teal" href="/card/register">
          新規登録はこちら
        </Link>
      </Box>
    </GrayBackgroundLayout>
  );
});
