import { useEffect, useState } from "react";
import api from "../../../api/api";

interface Invoice {
  id: number;
  title: string;
  referenceMonth: string;
  observations?: string;
}

interface UseInvoiceProps {
  invoiceId?: number;
  onClose: () => void;
}

export const useInvoice = ({ invoiceId, onClose }: UseInvoiceProps) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!invoiceId) return;

    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const role = localStorage.getItem("role");
        let res;

        if (role === "admin") {
          res = await api.get("/Invoices");
        } else {
          res = await api.get("/invoices/my");
        }

        const foundInvoice = res.data.find((i: Invoice) => i.id === invoiceId);

        if (!foundInvoice) {
          alert("Nota fiscal não encontrada para edição");
          onClose();
          return;
        }

        setInvoice(foundInvoice);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar nota fiscal para edição");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, onClose]);

  return { invoice, loading };
};
