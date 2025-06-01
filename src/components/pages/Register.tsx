/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useEffect, type FC } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useGetSkills } from "../../hooks/useGetSkills";
import { RegisterFormData } from "../../domain/form/RegisterFormData";
import { useRegister } from "../../hooks/useRegister";
import { WhiteCardLayout } from "../layouts/WhiteCardLayout";
import { GrayBackgroundLayout } from "../layouts/GrayBackGroundLayout";

export const Register: FC = memo(() => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const navigate = useNavigate(); // useNavigateを使う

  const { getSkillsData, skills, loading } = useGetSkills();
  const { onClickRegister } = useRegister();

  // 初回
  useEffect(() => {
    getSkillsData();
  }, []);

  // 新規登録ボタン押下時の処理
  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const {
      eitango_id,
      name,
      description,
      skill_id,
      github_id,
      qiita_id,
      x_id,
    } = data;

    const registerFormData = RegisterFormData.createRegisterFormData(
      eitango_id,
      name,
      description,
      skill_id,
      github_id,
      qiita_id,
      x_id
    );

    const success = await onClickRegister(registerFormData);

    if (success) {
      navigate("/");
    }
  };

  return (
    <GrayBackgroundLayout>
      <Heading data-testid="register-title">新規名刺登録</Heading>
      <WhiteCardLayout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4} data-testid="register-form">
            <Text> * は必須項目です</Text>
            <FormControl isInvalid={!!errors.eitango_id}>
              <FormLabel>好きな英単語 *</FormLabel>
              <Input
                type="text"
                placeholder="apple"
                {...register("eitango_id", {
                  required: "内容の入力は必須です",
                  pattern: {
                    value: /^[A-Za-z_-]+$/,
                    message: "英字のみ入力してください",
                  },
                })}
              ></Input>
              <FormErrorMessage data-testid="error-eitango_id">
                {errors.eitango_id && errors.eitango_id.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>お名前 *</FormLabel>
              <Input
                type="text"
                {...register("name", {
                  required: "内容の入力は必須です",
                })}
              ></Input>
              <FormErrorMessage data-testid="error-name">
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.description}>
              <FormLabel>自己紹介 *</FormLabel>
              <Textarea
                placeholder="<h1>HTMLタグも使用できます</h1>"
                {...register("description", {
                  required: "内容の入力は必須です",
                })}
              ></Textarea>
              <FormErrorMessage data-testid="error-description">
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.skill_id}>
              <FormLabel>好きな技術 *</FormLabel>
              <Select
                placeholder="選択してください"
                {...register("skill_id", {
                  required: "内容の入力は必須です",
                })}
              >
                {!loading &&
                  skills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
              </Select>
              <FormErrorMessage data-testid="error-skill">
                {errors.skill_id && errors.skill_id.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>GitHub ID</FormLabel>
              <Input type="text" placeholder="@は不要です"></Input>
            </FormControl>
            <FormControl>
              <FormLabel>Qiita ID</FormLabel>
              <Input type="text" placeholder="@は不要です"></Input>
            </FormControl>
            <FormControl>
              <FormLabel>X(Twitter) ID</FormLabel>
              <Input type="text" placeholder="@は不要です"></Input>
            </FormControl>

            <Button type="submit" colorScheme="blue" mr={3}>
              登録
            </Button>
          </Stack>
        </form>
      </WhiteCardLayout>
    </GrayBackgroundLayout>
  );
});
