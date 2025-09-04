import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";

import api from "../../api/api";
import styles from "./InvoiceForm.styles";

interface Props {
  onClose: () => void;
  onSaved: () => void;
  invoiceId?: number; 
}

const InvoiceForm = ({ onClose, onSaved, invoiceId }: Props) => {
  const [title, setTitle] = useState("");
  const [referenceMonth, setReferenceMonth] = useState("");
  const [observations, setObservations] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
  if (!invoiceId) return;

  const fetchInvoice = async () => {
    try {
      let res;
      const role = localStorage.getItem("role"); // ou outro jeito de pegar role do usuário
      if (role === "admin") {
        res = await api.get("/Invoices"); // busca todas
      } else {
        res = await api.get("/invoices/my"); // só do usuário logado
      }

      const invoice = res.data.find((i: any) => i.id === invoiceId);
      if (!invoice) {
        alert("Nota fiscal não encontrada para edição");
        onClose();
        return;
      }

      setTitle(invoice.title);
      setReferenceMonth(invoice.referenceMonth);
      setObservations(invoice.observations || "");
      
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar nota fiscal para edição");
      onClose();
    }
  };

  fetchInvoice();
}, [invoiceId, onClose]);

 const handleSubmit = async () => {
  if (!title || !referenceMonth) 
    return alert("Preencha todos os campos obrigatórios");

  const formData = new FormData();
  formData.append("Title", title);
  formData.append("ReferenceMonth", referenceMonth);
  formData.append("Observations", observations);
  if (file) formData.append("File", file); // só envia se houver arquivo novo

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
    // Se houver resposta do backend
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
