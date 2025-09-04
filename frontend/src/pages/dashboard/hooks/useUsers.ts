import { useEffect, useState } from "react";

import api from "../../../api/api";
import { User } from "../Types";

export const useUsers = (enabled: boolean) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<User[]>("/Users");
      setUsers(res.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) fetchUsers();
  }, [enabled]);

  return { users, loading, refresh: fetchUsers }; 
};