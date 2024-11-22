import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import enioImage from "./assets/enio.png";
import giovaniImage from "./assets/gio.png";
import carlosImage from "./assets/carlos.png";
import joaoImage from "./assets/joao.png";
import marcusImage from "./assets/marcus.png";

const socket = io("http://192.168.0.8:3001");

const CANDIDATES = [
  { name: "Ênio", image: enioImage },
  { name: "Giovani", image: giovaniImage },
  { name: "Carlos", image: carlosImage },
  { name: "João", image: joaoImage },
  { name: "Marcus", image: marcusImage },
];

function App() {
  const [votos, setVotos] = useState({});
  const [leader, setLeader] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [votacaoAtiva, setVotacaoAtiva] = useState(false);

  useEffect(() => {
   
    socket.on("atualizar_votos", (dados) => {
      setVotos(dados);

      const total = Object.values(dados).reduce((acc, curr) => acc + Number(curr), 0);
      setTotalVotes(total);

      const maxVotes = Math.max(...Object.values(dados).map(Number));
      const liderAtual = Object.keys(dados).find(
        (name) => Number(dados[name]) === maxVotes
      );
      setLeader(liderAtual);
    });

   
    socket.on("votacao_status", ({ ativa }) => {
      setVotacaoAtiva(ativa);
    });

    return () => {
      socket.off("atualizar_votos");
      socket.off("votacao_status");
    };
  }, []);

  const votar = (participante) => {
    if (votacaoAtiva) {
      socket.emit("votar", participante);
    }
  };

  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  return (
    <div className="container">
      <h1 className="title">🎉 Votação: Quem é o mais bonito da turma? 🎉</h1>

      {votacaoAtiva ? (
        <div>
          <p className="votacao-status">✅ A votação está aberta!</p>
          <p className="total-votes">Total de votos registrados: {totalVotes}</p>
          <div className="candidates">
            {CANDIDATES.map((candidate) => (
              <div key={candidate.name} className="candidate-card">
                <img
                  src={candidate.image}
                  alt={`Imagem de ${candidate.name}`}
                  className="candidate-image"
                />
                <h2 className="candidate-name">{candidate.name}</h2>
                <button
                  onClick={() => votar(candidate.name)}
                  className="vote-button"
                >
                  Votar
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {totalVotes > 0 && (
            <div className="winner-announcement">
              <h2 className="winner-title">🏆 E o vencedor é:</h2>
              <div className="winner-card">
                <img
                  src={CANDIDATES.find(
                    (candidate) => candidate.name === leader
                  )?.image}
                  alt={`Imagem de ${leader}`}
                  className="winner-image"
                />
                <h3>{leader}</h3>
                <p>{votos[leader]} votos</p>
              </div>
            </div>
          )}
          <div className="candidates">
            {CANDIDATES.map((candidate) => (
              <div key={candidate.name} className="candidate-card">
                <img
                  src={candidate.image}
                  alt={`Imagem de ${candidate.name}`}
                  className="candidate-image"
                />
                <h2 className="candidate-name">{candidate.name}</h2>
                <p className="votes">
                  {votos[candidate.name] || 0} voto
                  {votos[candidate.name] === 1 ? "" : "s"}
                </p>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${calculatePercentage(
                        votos[candidate.name] || 0
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="percentage">
                  {calculatePercentage(votos[candidate.name] || 0)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
