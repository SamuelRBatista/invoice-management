# =============================
# Dockerfile para DESENVOLVIMENTO
# =============================
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia package.json e instala dependências
COPY package.json package-lock.json ./
RUN npm install

# Copia todo o código fonte
COPY . .

# Expõe a porta
EXPOSE 3000

# Comando para desenvolvimento com hot reload
CMD ["npm", "start"]