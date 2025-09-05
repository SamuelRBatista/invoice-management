# =============================
# Stage 1: Build
# =============================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia arquivos de projeto e restaura dependências
COPY *.csproj ./
RUN dotnet restore

# Copia o restante do código e publica
COPY . ./
RUN dotnet publish -c Release -o out

# =============================
# Stage 2: Runtime
# =============================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copia a saída do build
COPY --from=build /app/out ./

# Exponha a porta
EXPOSE 5000

# Comando correto para rodar a aplicação
ENTRYPOINT ["dotnet", "backend.dll", "--server", "tcp://0.0.0.0:5005"]

