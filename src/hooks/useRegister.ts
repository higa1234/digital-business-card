import { useCallback } from "react";
import type { RegisterFormData } from "../domain/form/RegisterFormData";
import { insertUserAndUserSkill } from "../libs/users";

export const useRegister = () => {
  // 登録ボタン
  const onClickRegister = useCallback(
    async (registerFormData: RegisterFormData): Promise<boolean> => {
      //
      //   if (title === "" || time === 0) {
      //     console.error("入力されていない項目があります");
      //     return false;
      //   }

      const { error } = await insertUserAndUserSkill(registerFormData);
      if (error) {
        console.log(error.message);
        console.error("登録に失敗しました");
        return false;
      }
      return true;
    },
    []
  );

  return {
    onClickRegister,
  };
};
