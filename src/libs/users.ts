import { supabaseClient } from "./supabaseClient";
import type { PostgrestError } from "@supabase/supabase-js";

import type { RegisterFormData } from "../domain/form/RegisterFormData";
import { User } from "../domain/users";

export async function getUserById(id: string): Promise<User | undefined> {
  const { data, error } = await supabaseClient
    .from("users")
    .select(
      `
        user_id, 
        name, 
        description, 
        github_id, 
        qiita_id, 
        x_id,
        skills (id, name)
     `
    )
    .eq("user_id", id)
    .limit(1)
    .single();

  // 取得結果エラー
  if (error) {
    throw new Error(error.message);
  }

  return User.createUser(
    data.user_id,
    data.name,
    data.description,
    data.skills,
    data.github_id ?? undefined,
    data.qiita_id ?? undefined,
    data.x_id ?? undefined
  );
}

export async function insertUserAndUserSkill(
  registerFormData: RegisterFormData
): Promise<{ error: PostgrestError | null }> {
  const { error } = await supabaseClient.rpc("insert_user_and_userskill", {
    _user_id: registerFormData.eitango_id,
    _name: registerFormData.name,
    _description: registerFormData.description,
    _skill_id: registerFormData.skill_id,
    _github_id: registerFormData.github_id || null,
    _qiita_id: registerFormData.qiita_id || null,
    _x_id: registerFormData.x_id || null,
  });
  return { error };
}
