import { useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";

import api from "../../api/api";
import { setAuth } from "../../utils/auth";
import styles from "./LoginPage.styles";

interface JwtPayload {
  role: string;
}

const LoginPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name || !email || !password || !roleInput) return alert("Preencha todos os campos");

    try {
      const res = await api.post("/Users/login", { name, email, password, role: roleInput });
      const { token } = res.data;
      const decoded = jwt_decode<JwtPayload>(token);
      const role = decoded.role;

      setAuth(role, token);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login falhou");
    }
  };

  return (
    <Container maxWidth="sm" sx={styles.container}>
      <Typography variant="h4" align="center" gutterBottom sx={styles.title}>
        Login
      </Typography>

      <TextField label="Nome" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField
        label="Senha"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="Role (admin ou pj)"
        fullWidth
        margin="normal"
        value={roleInput}
        onChange={(e) => setRoleInput(e.target.value)}
      />

      <Button fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
        Entrar
      </Button>
    </Container>
  );
};

export default LoginPage;