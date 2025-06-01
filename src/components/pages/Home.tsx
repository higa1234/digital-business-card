import { memo, type FC } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { GrayBackgroundLayout } from "../layouts/GrayBackGroundLayout";
import { WhiteCardLayout } from "../layouts/WhiteCardLayout";
import { getUserById } from "../../libs/users";

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

  // 「名刺をみる」ボタン押下時、処理
  const onSubmit: SubmitHandler<UserId> = async (data) => {
    const { user_id } = data;

    // 存在チェック
    const user = await getUserById(user_id);

    if (user) {
      // 画面遷移
      navigate("/card/" + user_id);
    }
  };

  return (
    <GrayBackgroundLayout>
      <Heading data-testid="home-title">デジタル名刺アプリ</Heading>
      <WhiteCardLayout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={8} data-testid="search-form">
            <FormControl isInvalid={!!errors.user_id}>
              <FormLabel>ID</FormLabel>
              <Input
                type="text"
                {...register("user_id", {
                  required: "IDを入力してください",
                })}
              ></Input>
              <FormErrorMessage data-testid="error-user_id">
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
        <Link color="teal" to="/card/register">
          新規登録はこちら
        </Link>
      </Box>
    </GrayBackgroundLayout>
  );
});
