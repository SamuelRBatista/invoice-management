## 🛠️ COMANDOS PARA EXECUTAR:

### 1. Navegar para a área de trabalho e criar diretório
cd ~/Área\ de\ trabalho
mkdir invoice-management
cd invoice-management

### 2. Criar solução e projeto .NET 8
dotnet new sln -n InvoiceManagement
dotnet new webapi -n Backend -f net8.0
dotnet sln add Backend/Backend.csproj

### 3. Adicionar pacotes necessários
cd Backend
dotnet add package Npgsql
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.AspNetCore.Http.Features

### 4. Criar estrutura de pastas
mkdir -p {Controllers,Services,DataAccess,Models,DTOs,Utils,Middleware}

## 📁 ARQUIVO DOCKER-COMPOSE.YML
Crie o arquivo 'docker-compose.yml' na raiz do projeto:

version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: invoice_management
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:

## 📁 SCRIPT SQL
Crie o diretório 'scripts' e o arquivo 'init-database.sql':

CREATE DATABASE invoice_management;
\c invoice_management;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'pj'))
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    reference_month TEXT NOT NULL,
    file_path TEXT NOT NULL,
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password_hash, role) 
VALUES (
    'Admin Financeiro', 
    'admin@financeiro.com', 
    '$2a$11$rL4U7S8Sd7E2fV2X8P8kEeJZ8X2V8X8P8kEeJZ8X2V8X8P8kEeJZ8X2V8X8P8kE', 
    'admin'
);

## 🚀 COMANDOS PARA EXECUTAR O PROJETO:

### Iniciar PostgreSQL com Docker
docker-compose up -d

### Executar script do banco (em outro terminal)
psql -h localhost -U postgres -f scripts/init-database.sql

### Executar a aplicação
cd Backend
dotnet run

## 🔐 USUÁRIO PADRÃO:
- Email: admin@financeiro.com
- Senha: admin123
- Perfil: Admin

## 🔧 CONFIGURAÇÃO APPSETTINGS.JSON
Adicione esta connection string no appsettings.json:

"ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=invoice_management;Username=postgres;Password=postgres"
}

## 📊 PRÓXIMOS PASSOS:
1. Configurar connection string no appsettings.json
2. Implementar modelos User e Invoice
3. Criar DbContext
4. Implementar autenticação JWT
5. Criar serviços e controllers

A aplicação estará disponível em: http://localhost:5000 ou https://localhost:7000

## 📞 INFORMAÇÕES DE CONTATO
Desenvolvido por Samuel Ribeiro Batista - samuka-srb@live.com
