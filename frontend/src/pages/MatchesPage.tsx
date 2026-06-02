import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MatchCard from "../components/MatchCard";
import NoticeCard from "../components/NoticeCard";
import SectionHeader from "../components/SectionHeader";
import StatCard from "../components/StatCard";
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

  const totalApostado = useMemo(() => {
    return bets.reduce((sum, bet) => sum + bet.quantidadeCervejas, 0);
  }, [bets]);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow={session ? `${session.barNome} / ${session.mesaCodigo}` : "Carregando"}
        title="Jogos da rodada"
        description="Escolha o confronto, entre no pool e acompanhe os palpites da sua mesa com clima de sports bar."
      />
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Jogos hoje" value={matches.length} hint="Ao vivo no pool" />
        <StatCard label="Meus palpites" value={bets.length} hint="Entradas confirmadas" />
        <StatCard label="Cervejas" value={totalApostado.toFixed(0)} hint="Volume apostado" />
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
                className="inline-flex rounded-[20px] bg-gradient-to-r from-lime to-gold px-4 py-2.5 text-sm font-semibold text-night shadow-[0_14px_28px_rgba(125,223,100,0.2)]"
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
