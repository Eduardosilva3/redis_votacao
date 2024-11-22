
# redis_votacao

## Passos para Iniciar o Projeto

### 1. Iniciar o Redis com Docker
Execute o comando abaixo para iniciar o Redis com persistência habilitada:
```bash
docker run --name redis-votacao -p 6379:6379 -d \
  -v redis-data:/data \
  redis redis-server --save 60 1 --appendonly yes
```

---

### 2. Backend

1. Entre na pasta do backend:
   ```bash
   cd backend-votacao
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o backend:
   ```bash
   npm start
   ```

4. Controle a votação:
   - **Iniciar a votação**:
     ```bash
     curl -X GET http://localhost:3001/start
     ```
   - **Encerrar a votação**:
     ```bash
     curl -X GET http://localhost:3001/stop
     ```

---

### 3. Frontend

1. Entre na pasta do frontend:
   ```bash
   cd frontend-votacao
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o frontend:
   ```bash
   npm start
   ```

---

## Informações Adicionais

- **Backend**: O servidor estará disponível em `http://localhost:3001`.
- **Frontend**: A aplicação estará disponível em `http://localhost:3000`.

Agora você pode controlar a votação em tempo real e visualizar os resultados! 🚀
