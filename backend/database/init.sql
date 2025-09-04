-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'pj'))
);

-- Tabela de notas fiscais
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    reference_month TEXT NOT NULL, -- formato MM/YYYY
    file_path TEXT NOT NULL,
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir primeiro usuário admin
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin Financeiro', 'admin@empresa.com', 'SENHA_HASH_AQUI', 'admin');
