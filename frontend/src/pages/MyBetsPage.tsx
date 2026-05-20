import { useEffect, useMemo, useState } from "react";
import NoticeCard from "../components/NoticeCard";
import SectionHeader from "../components/SectionHeader";
import { useRequireSession } from "../hooks/useRequireSession";
import { getCustomerBets } from "../services/clientService";
import { Bet } from "../types/api";

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
        acc.pontos += bet.pontos;
        acc.cervejas += bet.quantidadeCervejas;
        return acc;
      },
      { pontos: 0, cervejas: 0 }
    );
  }, [bets]);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow={session?.apelido ?? "Sessao"}
        title="Meus palpites"
        description="Acompanhe status, pontos e o total de cervejas simbolicas colocadas na brincadeira."
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-panel p-4">
          <p className="text-sm text-white/60">Total de pontos</p>
          <p className="mt-2 font-display text-3xl font-bold text-gold">{summary.pontos}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-white/60">Cervejas apostadas</p>
          <p className="mt-2 font-display text-3xl font-bold text-lime">{summary.cervejas}</p>
        </div>
      </div>
      <NoticeCard />
      <div className="space-y-4">
        {bets.length === 0 && (
          <div className="glass-panel p-5 text-sm text-white/70">Voce ainda nao fez nenhum palpite.</div>
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
              <p>Vencedor: {bet.vencedorEscolhido}</p>
              <p>
                Placar: {bet.placarTimeA ?? "-"} x {bet.placarTimeB ?? "-"}
              </p>
              <p>
                Pontos: <span className="font-semibold text-gold">{bet.pontos}</span>
              </p>
              <p>
                Data:{" "}
                {new Date(bet.dataHora).toLocaleString("pt-BR", {
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
