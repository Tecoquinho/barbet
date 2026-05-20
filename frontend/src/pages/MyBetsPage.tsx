import { useEffect, useMemo, useState } from "react";
import NoticeCard from "../components/NoticeCard";
import SectionHeader from "../components/SectionHeader";
import { useRequireSession } from "../hooks/useRequireSession";
import { getCustomerBets } from "../services/clientService";
import { Bet } from "../types/api";

function winnerLabel(bet: Bet) {
  if (bet.vencedorEscolhido === "TEAM_A") return bet.timeA;
  if (bet.vencedorEscolhido === "TEAM_B") return bet.timeB;
  return "Empate";
}

export default function MyBetsPage() {
  const session = useRequireSession();
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    async function load() {
      if (!session) return;
      const data = await getCustomerBets(session.customerId);
      setBets(data);
    }
    load();
  }, [session]);

  const summary = useMemo(() => {
    return bets.reduce(
      (acc, bet) => {
        acc.cervejas += bet.quantidadeCervejas;
        acc.valor += (bet.precoCerveja ?? 0) * bet.quantidadeCervejas;
        acc.retorno += bet.retornoPotencial ?? 0;
        return acc;
      },
      { cervejas: 0, valor: 0, retorno: 0 }
    );
  }, [bets]);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow={session?.nomeCompleto ?? "Sessao"}
        title="Minhas apostas"
        description="Aqui ficam salvas suas entradas confirmadas, a cerveja escolhida e o retorno potencial de cada jogo."
      />
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-panel p-4">
          <p className="text-sm text-white/60">Cupons</p>
          <p className="mt-2 font-display text-3xl font-bold text-gold">{bets.length}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-white/60">Investido</p>
          <p className="mt-2 font-display text-2xl font-bold text-white">R$ {summary.valor.toFixed(2)}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-white/60">Retorno pot.</p>
          <p className="mt-2 font-display text-2xl font-bold text-lime">R$ {summary.retorno.toFixed(2)}</p>
        </div>
      </div>
      <NoticeCard />
      <div className="space-y-4">
        {bets.length === 0 && (
          <div className="glass-panel p-5 text-sm text-white/70">Voce ainda nao confirmou nenhuma aposta.</div>
        )}
        {bets.map((bet) => (
          <div key={bet.id} className="glass-panel p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">{bet.status}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">
                  {bet.timeA} <span className="text-white/40">x</span> {bet.timeB}
                </h3>
              </div>
              <span className="chip">{bet.quantidadeCervejas} cervejas</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-white/70">
              <p>Mercado: {winnerLabel(bet)}</p>
              <p>Odd: {bet.odd?.toFixed(2)}</p>
              <p>Cerveja: {bet.cervejaNome}</p>
              <p>Preco unit.: R$ {bet.precoCerveja?.toFixed(2)}</p>
              <p>
                Placar: {bet.placarTimeA ?? "-"} x {bet.placarTimeB ?? "-"}
              </p>
              <p>Retorno: R$ {bet.retornoPotencial?.toFixed(2)}</p>
              <p>
                Data:{" "}
                {new Date(bet.createdAt).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
