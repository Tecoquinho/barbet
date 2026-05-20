import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MatchCard from "../components/MatchCard";
import NoticeCard from "../components/NoticeCard";
import SectionHeader from "../components/SectionHeader";
import { useRequireSession } from "../hooks/useRequireSession";
import { getCustomerBets, getOpenMatches } from "../services/clientService";
import { Bet, Match } from "../types/api";

export default function MatchesPage() {
  const session = useRequireSession();
  const [matches, setMatches] = useState<Match[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!session) return;
      const [matchData, betData] = await Promise.all([
        getOpenMatches(session.barSlug),
        getCustomerBets(session.customerId),
      ]);
      setMatches(matchData);
      setBets(betData);
      setLoading(false);
    }
    load();
  }, [session]);

  const totalRetorno = useMemo(() => {
    return bets.reduce((sum, bet) => sum + (bet.retornoPotencial ?? 0), 0);
  }, [bets]);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow={session ? `${session.barNome} • ${session.mesaCodigo}` : "Carregando"}
        title="Jogos de Hoje"
        description="Dashboard com jogos ficticios da Copa do Mundo, mercado 1X2 e retorno potencial em cada aposta."
      />
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-panel p-4">
          <p className="text-sm text-white/60">Jogos hoje</p>
          <p className="mt-2 font-display text-3xl font-bold text-gold">{matches.length}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-white/60">Minhas apostas</p>
          <p className="mt-2 font-display text-3xl font-bold text-lime">{bets.length}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-white/60">Retorno pot.</p>
          <p className="mt-2 font-display text-2xl font-bold text-white">R$ {totalRetorno.toFixed(2)}</p>
        </div>
      </div>
      <NoticeCard />
      <div className="space-y-4">
        {loading && <div className="glass-panel p-5 text-sm text-white/70">Carregando jogos...</div>}
        {!loading && matches.length === 0 && (
          <div className="glass-panel p-5 text-sm text-white/70">Nenhum jogo aberto no momento.</div>
        )}
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            action={
              <Link
                to={`/bar/${session?.barSlug}/mesa/${session?.mesaCodigo}/jogos/${match.id}/apostar`}
                className="rounded-2xl bg-lime px-4 py-2 text-sm font-semibold text-night"
              >
                Apostar agora
              </Link>
            }
          />
        ))}
      </div>
    </div>
  );
}
