# =============================
# Dockerfile para DESENVOLVIMENTO
# =============================
FROM mcr.microsoft.com/dotnet/sdk:8.0

# Define variáveis de ambiente
ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://+:5000
ENV DOTNET_USE_POLLING_FILE_WATCHER=1
ENV PATH="$PATH:/root/.dotnet/tools"

# Define o diretório de trabalho
WORKDIR /app

# Instala dotnet-ef globalmente
RUN dotnet tool install --global dotnet-ef --version 8.0.0

# Copia o arquivo de projeto e restaura dependências
COPY *.csproj ./
RUN dotnet restore

# Copia todo o código fonte
COPY . ./

# Expõe as portas
EXPOSE 5000
EXPOSE 5005

# Comando para desenvolvimento com hot reload
ENTRYPOINT ["bash", "-c", "dotnet ef database update || echo 'Migrations may have failed' && dotnet watch run --urls http://0.0.0.0:5000"]