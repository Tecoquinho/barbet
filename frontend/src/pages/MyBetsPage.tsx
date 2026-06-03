import { useEffect, useMemo, useState } from "react";
import { useRequireSession } from "../hooks/useRequireSession";
import { getCustomerBets } from "../services/clientService";
import { Bet } from "../types/api";

function getChoiceMeta(bet: Bet) {
  if (bet.vencedorEscolhido === "TEAM_A") return { flag: "🏆", label: `${bet.timeA} vence` };
  if (bet.vencedorEscolhido === "TEAM_B") return { flag: "🏆", label: `${bet.timeB} vence` };
  return { flag: "⚖️", label: "Empate" };
}

function getStatusClass(bet: Bet) {
  if (bet.status === "OPEN" || bet.status === "CLOSED") {
    return { label: "Pendente", className: "status-pendente" };
  }

  if ((bet.saldoLiquidoCervejas ?? 0) >= 0) {
    return { label: "Ganhou", className: "status-ganhou" };
  }

  return { label: "Perdeu", className: "status-perdeu" };
}

export default function MyBetsPage() {
  const session = useRequireSession();
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    if (!session) return;
    getCustomerBets(session.customerId).then(setBets);
  }, [session]);

  const totalPool = useMemo(() => bets.reduce((sum, bet) => sum + bet.quantidadeCervejas, 0), [bets]);

  return (
    <>
      <div className="section-wrap">
        <div className="ranking-head">
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Apostas da Mesa</div>
            <div style={{ fontSize: 12, color: "#8b949e" }}>Bilhetes ativos do seu lado da mesa</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#8b949e" }}>Em jogo</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#f0b429" }}>{totalPool} 🍺</div>
          </div>
        </div>
      </div>

      {bets.length === 0 ? (
        <div style={{ padding: "0 14px" }}>
          <div className="aposta-card">
            <div className="aposta-body" style={{ textAlign: "center", color: "#8b949e", padding: 24 }}>
              Nenhuma aposta ainda. Entra em um jogo e abre o pool da rodada.
            </div>
          </div>
        </div>
      ) : null}

      {bets.map((bet) => {
        const choice = getChoiceMeta(bet);
        const status = getStatusClass(bet);

        return (
          <div key={bet.id} className="aposta-card">
            <div className="aposta-header">
              <span className="aposta-jogo">
                {bet.timeA} × {bet.timeB}
              </span>
              <span className={`aposta-status ${status.className}`}>{status.label}</span>
            </div>

            <div className="aposta-body">
              <div className="aposta-escolha">
                <span className="flag">{choice.flag}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#e6edf3" }}>{choice.label}</div>
                  <div style={{ fontSize: 11, color: "#8b949e" }}>
                    Apostado por {session?.apelido ?? "Voce"} · {bet.cervejaNome ?? "Cerveja da mesa"}
                  </div>
                </div>
              </div>

              <div className="aposta-valor">
                <span>
                  Aposta: <b style={{ color: "#f0b429" }}>{bet.quantidadeCervejas} 🍺</b>
                </span>
                <span>
                  Pode ganhar: <b style={{ color: "#3fb950" }}>{(bet.premioCervejas ?? 0).toFixed(1)} 🍺</b>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
