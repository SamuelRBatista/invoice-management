import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";

import api from "../../api/api";
import styles from "./InvoiceForm.styles";
import { useInvoice } from "./hooks/useInvoice";

interface Props {
  onClose: () => void;
  onSaved: () => void;
  invoiceId?: number;
}

  const InvoiceForm = ({ onClose, onSaved, invoiceId }: Props) => {
  const { invoice } = useInvoice({ invoiceId, onClose });

  const [title, setTitle] = useState("");
  const [referenceMonth, setReferenceMonth] = useState("");
  const [observations, setObservations] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Popula o formulário quando a invoice é carregada
  useEffect(() => {
    if (!invoice) return;
    setTitle(invoice.title);
    setReferenceMonth(invoice.referenceMonth);
    setObservations(invoice.observations || "");
  }, [invoice]);

  const handleSubmit = async () => {
    if (!title || !referenceMonth)
      return alert("Preencha todos os campos obrigatórios");

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("ReferenceMonth", referenceMonth);
    formData.append("Observations", observations);
    if (file) formData.append("File", file);

    try {
      if (invoiceId) {
        await api.put(`/invoices/${invoiceId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/Invoices", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSaved();
      onClose();
    } catch (err: any) {
      if (err.response) {
        console.log("Erros retorno da api", err.response);
        switch (err.response.status) {
          case 403:
            alert("Você não tem permissão para alterar esta nota!");
            break;
          case 404:
            alert("Nota fiscal não encontrada!");
            break;
          default:
            alert(`Erro ao salvar nota fiscal: ${err.response.data || err.message}`);
        }
      } else {
        console.error(err);
        alert("Erro de conexão ou interno");
      }
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{invoiceId ? "Editar Nota Fiscal" : "Cadastrar Nota Fiscal"}</DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <TextField
          label="Título"
          fullWidth
          sx={styles.textField}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Referência (DD/MM/YYYY)"
          fullWidth
          sx={styles.textField}
          value={referenceMonth}
          onChange={(e) => setReferenceMonth(e.target.value)}
        />
        <TextField
          label="Observações"
          fullWidth
          sx={styles.textField}
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={styles.fileInput as React.CSSProperties}
        />
        <Button
          variant="contained"
          fullWidth
          sx={styles.submitButton}
          onClick={handleSubmit}
        >
          Salvar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceForm;
