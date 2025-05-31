import { useCallback, useState } from "react";

import type { Skill } from "../domain/skill";
import { getAllSkills } from "../libs/skills";

export const useGetSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getSkillsData = useCallback(async () => {
    const skillsData = await getAllSkills();
    setSkills(skillsData);
    setLoading(false);
  }, []);

  return { getSkillsData, skills, loading };
};
