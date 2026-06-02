import { useEffect, useMemo, useState } from "react";
import NoticeCard from "../components/NoticeCard";
import SectionHeader from "../components/SectionHeader";
import StatCard from "../components/StatCard";
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
        acc.apostadas += bet.quantidadeCervejas;
        acc.saldo += bet.saldoLiquidoCervejas ?? 0;
        acc.premios += bet.premioCervejas ?? 0;
        return acc;
      },
      { apostadas: 0, premios: 0, saldo: 0 }
    );
  }, [bets]);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow={session?.nomeCompleto ?? "Sessao"}
        title="Minhas apostas"
        description="Consulte seus palpites, veja o saldo por jogo e acompanhe como o pool foi dividido."
      />
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Cupons" value={bets.length} hint="Jogos registrados" />
        <StatCard label="Apostadas" value={summary.apostadas.toFixed(0)} hint="Cervejas em jogo" />
        <StatCard label="Saldo liquido" value={summary.saldo.toFixed(2)} hint="Resultado da rodada" />
      </div>
      <NoticeCard />
      <div className="space-y-4">
        {bets.length === 0 && (
          <div className="glass-panel p-5 text-sm text-white/70">Voce ainda nao confirmou nenhuma aposta.</div>
        )}
        {bets.map((bet) => (
          <div key={bet.id} className="glass-panel bet-shell p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="tiny-label">{bet.status}</p>
                <h3 className="mt-2 truncate font-display text-xl font-semibold text-white">
                  {bet.timeA} <span className="text-white/35">x</span> {bet.timeB}
                </h3>
                <p className="mt-1 text-sm text-white/58">Palpite em {winnerLabel(bet)}</p>
              </div>
              <span className="chip">{bet.quantidadeCervejas} cervejas</span>
            </div>

            <div className="mt-4 rounded-[22px] border border-white/8 bg-black/18 p-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <p className="tiny-label">Placar</p>
                  <p className="mt-1 text-white">
                    {bet.placarTimeA ?? "-"} x {bet.placarTimeB ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="tiny-label">Acerto</p>
                  <p className={`mt-1 font-semibold ${bet.acertouResultado ? "text-lime" : "text-white/72"}`}>
                    {bet.acertouResultado ? "Resultado certo" : "Resultado nao bateu"}
                  </p>
                </div>
                <div>
                  <p className="tiny-label">Premio</p>
                  <p className="mt-1 font-semibold text-gold">{(bet.premioCervejas ?? 0).toFixed(2)} cervejas</p>
                </div>
                <div>
                  <p className="tiny-label">Saldo</p>
                  <p className={`mt-1 font-semibold ${(bet.saldoLiquidoCervejas ?? 0) >= 0 ? "text-lime" : "text-white"}`}>
                    {(bet.saldoLiquidoCervejas ?? 0).toFixed(2)} cervejas
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/58">
                <span className="line-soft rounded-full px-3 py-2">
                  Bar: {(bet.comissaoBarCervejas ?? 0).toFixed(2)} cerveja
                </span>
                <span className="line-soft rounded-full px-3 py-2">
                  {new Date(bet.createdAt).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
