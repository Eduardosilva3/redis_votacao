const express = require("express");
const http = require("http");
const { createClient } = require("redis");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const redisClient = createClient();

let votacaoAtiva = false;

(async () => {
  await redisClient.connect();
  console.log("Redis conectado!");
})();

app.use(cors());

const PARTICIPANTES = ["Ênio", "Giovani", "Carlos", "João", "Marcus"];

(async () => {
  const votosExistem = await redisClient.exists("votos");
  if (!votosExistem) {
    console.log("Inicializando votos...");
    PARTICIPANTES.forEach(async (nome) => {
      await redisClient.hSet("votos", nome, 0);
    });
  } else {
    console.log("Votos existentes encontrados. Mantendo estado atual.");
  }
})();

app.get("/start", (req, res) => {
  votacaoAtiva = true;
  io.emit("votacao_status", { ativa: true }); 
  console.log("Votação iniciada.");
  res.json({ message: "Votação iniciada." });
});

app.get("/stop", (req, res) => {
  votacaoAtiva = false;
  io.emit("votacao_status", { ativa: false }); 
  console.log("Votação encerrada.");
  res.json({ message: "Votação encerrada." });
});

io.on("connection", (socket) => {
  console.log("Usuário conectado!");

  redisClient.hGetAll("votos").then((votos) => {
    socket.emit("atualizar_votos", votos);
    socket.emit("votacao_status", { ativa: votacaoAtiva });
  });

  socket.on("votar", async (participante) => {
    if (!votacaoAtiva) {
      console.log("Tentativa de votar com a votação desativada.");
      return;
    }

    if (PARTICIPANTES.includes(participante)) {
      const votosAtualizados = await redisClient.hIncrBy("votos", participante, 1);
      console.log(`${participante} recebeu um voto. Total: ${votosAtualizados}`);

      const votos = await redisClient.hGetAll("votos");
      io.emit("atualizar_votos", votos);
    } else {
      console.error(`Participante inválido: ${participante}`);
    }
  });
});


const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
