import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MatchCard from "../components/MatchCard";
import NoticeCard from "../components/NoticeCard";
import SectionHeader from "../components/SectionHeader";
import { useRequireSession } from "../hooks/useRequireSession";
import { getOpenMatches } from "../services/clientService";
import { Match } from "../types/api";

export default function MatchesPage() {
  const session = useRequireSession();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!session) return;
      const data = await getOpenMatches(session.barSlug);
      setMatches(data);
      setLoading(false);
    }
    load();
  }, [session]);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow={session ? `${session.barNome} · ${session.mesaCodigo}` : "Carregando"}
        title="Jogos abertos"
        description="Escolha seu vencedor, informe as cervejas simbolicas e entre no ranking do bar."
      />
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
                Apostar
              </Link>
            }
          />
        ))}
      </div>
    </div>
  );
}
