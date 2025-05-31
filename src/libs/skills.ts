import { Skill } from "../domain/skill";
import { supabaseClient } from "./supabaseClient";

export async function getAllSkills(): Promise<Skill[]> {
  const { data, error } = await supabaseClient.from("skills").select("*");

  // 取得結果エラー
  if (error) {
    throw new Error(error.message);
  }

  const skillsData = data.map((skill) => {
    return Skill.createSkill(skill.id, skill.name);
  });

  return skillsData;
}
