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
          <div key={bet.id} className="glass-panel p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="tiny-label">{bet.status}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-white">
                  {bet.timeA} <span className="text-white/40">x</span> {bet.timeB}
                </h3>
              </div>
              <span className="chip">{bet.quantidadeCervejas} cervejas</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-white/70">
              <div className="panel-soft px-3 py-3">
                <p className="tiny-label">Mercado</p>
                <p className="mt-2 text-white">{winnerLabel(bet)}</p>
              </div>
              <div className="panel-soft px-3 py-3">
                <p className="tiny-label">Acerto</p>
                <p className={`mt-2 font-semibold ${bet.acertouResultado ? "text-lime" : "text-white/75"}`}>
                  {bet.acertouResultado ? "Acertou o resultado" : "Nao bateu o resultado"}
                </p>
              </div>
              <div className="panel-soft px-3 py-3">
                <p className="tiny-label">Placar</p>
                <p className="mt-2 text-white">
                  {bet.placarTimeA ?? "-"} x {bet.placarTimeB ?? "-"}
                </p>
              </div>
              <div className="panel-soft px-3 py-3">
                <p className="tiny-label">Premio do pool</p>
                <p className="mt-2 text-gold">{(bet.premioCervejas ?? 0).toFixed(2)} cervejas</p>
              </div>
              <div className="panel-soft px-3 py-3">
                <p className="tiny-label">Bar</p>
                <p className="mt-2 text-white">{(bet.comissaoBarCervejas ?? 0).toFixed(2)} cerveja</p>
              </div>
              <div className="panel-soft px-3 py-3">
                <p className="tiny-label">Saldo</p>
                <p className={`mt-2 font-semibold ${(bet.saldoLiquidoCervejas ?? 0) >= 0 ? "text-lime" : "text-white"}`}>
                  {(bet.saldoLiquidoCervejas ?? 0).toFixed(2)} cervejas
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-white/46">
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
