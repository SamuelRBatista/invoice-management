import { useEffect, useState } from "react";

import api from "../../../api/api";
import { Invoice } from "../Types";

export const useInvoices = (role: "admin" | "pj") => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    debugger;
    try {
      setLoading(true);
      const endpoint = role === "admin" ? "/Invoices" : "/Invoices/my";
      const res = await api.get<Invoice[]>(endpoint);
      console.log("As notas retornadas da api", res);
      setInvoices(res.data);
    } catch (err) {
      console.error("Erro ao buscar notas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [role]);

  return { invoices, loading, refresh: fetchInvoices }; // adiciona refresh
};