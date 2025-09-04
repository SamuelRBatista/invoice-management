import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import api from "../../api/api";
import styles from "./SupplierForm.styles";

interface Props {
  userId?: number;      
  onClose: () => void;   
  onSaved: () => void; 
}

const SupplierForm = ({ userId, onClose, onSaved }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("pj");

  useEffect(() => {
    if (userId) {
      api.get(`/Users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }).then(res => {
        setName(res.data.name);
        setEmail(res.data.email);
        setRole(res.data.role);
      }).catch(err => {
        console.error("Erro ao carregar usuário:", err);
      });
    } else {
      
      setName("");
      setEmail("");
      setPassword("");
      setRole("pj");
    }
  }, [userId]);

  const handleSubmit = async () => {
    if (!name || !email) return alert("Preencha todos os campos");

    try {
      const payload: any = { name, email, role };
      if (password) payload.password = password;

      if (userId) {      
        await api.put(`/Users/${userId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else {     
        if (!password) return alert("Preencha a senha");
        await api.post("/Users", payload);
      }

      onSaved(); 
      onClose(); 
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      alert("Ocorreu um erro ao salvar o usuário.");
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{userId ? "Editar Fornecedor" : "Cadastrar Fornecedor"}</DialogTitle>
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
          label={userId ? "Nova Senha (opcional)" : "Senha"}
          type="password"
          fullWidth
          sx={styles.textField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={userId ? "Deixe vazio para manter a senha atual" : ""}
        />
        <FormControl fullWidth sx={styles.textField}>
          <InputLabel>Role</InputLabel>
          <Select value={role} label="Role" onChange={e => setRole(e.target.value)}>
            <MenuItem value="pj">Fornecedor</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
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
