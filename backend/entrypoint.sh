#!/bin/bash

echo "=== Iniciando Backend em Desenvolvimento ==="

# Configurar PATH
export PATH="$PATH:/root/.dotnet/tools"

# Aguardar PostgreSQL
echo "Aguardando PostgreSQL..."
while ! nc -z postgres 5432; do
  sleep 1
done

# Tentar aplicar migrations (não falha se der erro)
echo "Aplicando migrations..."
dotnet ef database update || echo "Migrations podem ter falhado - continuando..."

# Hot reload para desenvolvimento
echo "Iniciando aplicação com hot reload..."
exec dotnet watch run --urls "http://0.0.0.0:5000"