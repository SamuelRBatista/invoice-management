import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";

import api from "../../api/api";
import styles from "./SupplierForm.styles";

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

const SupplierForm = ({ onClose, onSaved }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("pj");

  const handleSubmit = async () => {
    if (!name || !email || !password) return alert("Preencha todos os campos");

    try {
      await api.post("/Users", { name, email, password, role });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar fornecedor");
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Cadastrar Fornecedor</DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <TextField
          label="Nome Fantasia"
          fullWidth
          sx={styles.textField}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          sx={styles.textField}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          sx={styles.textField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

export default SupplierForm;
