import { useCallback, useState } from "react";

import type { User } from "../domain/users";
import { getUserById } from "../libs/users";

export const useGetUser = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const getUserData = useCallback(async (id: string) => {
    setLoading(true);
    const userData = await getUserById(id);
    setUser(userData);
    setLoading(false);
  }, []);

  return { getUserData, user, loading };
};
