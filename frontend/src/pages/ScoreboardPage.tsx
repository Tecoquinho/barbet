import { useEffect, useMemo, useState } from "react";
import { useRequireSession } from "../hooks/useRequireSession";
import { getCustomerBets } from "../services/clientService";
import { Bet } from "../types/api";

interface RankingRow {
  id: number;
  name: string;
  avatar: string;
  saldo: number;
  stats: string;
}

const baseRanking: RankingRow[] = [
  { id: 1, name: "Joao", avatar: "J", saldo: 6, stats: "4 apostas · 3 certas" },
  { id: 2, name: "Maria", avatar: "M", saldo: 3, stats: "5 apostas · 3 certas" },
  { id: 3, name: "Rafael", avatar: "R", saldo: -2, stats: "3 apostas · 1 certa" },
  { id: 4, name: "Pedro", avatar: "P", saldo: -5, stats: "4 apostas · 1 certa" },
];

function getSaldo(bets: Bet[]) {
  return Number(bets.reduce((sum, bet) => sum + (bet.saldoLiquidoCervejas ?? 0), 0).toFixed(1));
}

function getPositionClass(index: number) {
  if (index === 0) return "pos-1";
  if (index === 1) return "pos-2";
  if (index === 2) return "pos-3";
  return "pos-n";
}

function getSaldoClass(value: number) {
  if (value > 0) return "saldo-pos";
  if (value < 0) return "saldo-neg";
  return "saldo-zero";
}

export default function ScoreboardPage() {
  const session = useRequireSession();
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    if (!session) return;
    getCustomerBets(session.customerId).then(setBets);
  }, [session]);

  const ranking = useMemo(() => {
    const currentUser: RankingRow = {
      id: session?.customerId ?? 9999,
      name: localStorage.getItem(`barbet-nickname-${session?.customerId}`) ?? session?.apelido ?? "Voce",
      avatar: (localStorage.getItem(`barbet-avatar-${session?.customerId}`) ?? "🍺").slice(0, 2),
      saldo: getSaldo(bets),
      stats: `${bets.length} apostas · ${bets.filter((bet) => (bet.saldoLiquidoCervejas ?? 0) >= 0).length} certas`,
    };

    return [...baseRanking, currentUser].sort((a, b) => b.saldo - a.saldo);
  }, [bets, session]);

  const totalInPlay = useMemo(() => bets.reduce((sum, bet) => sum + bet.quantidadeCervejas, 0), [bets]);

  return (
    <>
      <div className="ranking-head">
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Placar da Mesa</div>
          <div style={{ fontSize: 12, color: "#8b949e" }}>Copa 2026 · Mesa {session?.mesaCodigo ?? "01"}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#8b949e" }}>Em jogo</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#f0b429" }}>{totalInPlay} 🍺</div>
        </div>
      </div>

      <div className="ranking-card" style={{ margin: "0 14px 16px" }}>
        {ranking.map((item, index) => (
          <div key={`${item.id}-${item.name}`} className="ranking-row">
            <div className={`pos-badge ${getPositionClass(index)}`}>{index + 1}</div>
            <div className="jogador-avatar" style={{ color: index === 0 ? "#f0b429" : "#8b949e" }}>
              {item.avatar}
            </div>
            <div className="jogador-info">
              <div className="jogador-nome">{item.name}</div>
              <div className="jogador-stats">{item.stats}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className={`saldo-num ${getSaldoClass(item.saldo)}`}>
                {item.saldo > 0 ? "+" : ""}
                {item.saldo.toFixed(1)} 🍺
              </div>
              <div className="saldo-label">saldo</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: "#8b949e", textAlign: "center", padding: 8 }}>
        Atualizado em tempo real · Apostas pendentes nao contam
      </div>
    </>
  );
}
