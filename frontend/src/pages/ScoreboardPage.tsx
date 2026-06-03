import { IconAward, IconBeer, IconCrown } from "@tabler/icons-react";
import NoticeCard from "../components/NoticeCard";
import SectionHeader from "../components/SectionHeader";
import { useRequireSession } from "../hooks/useRequireSession";
import { getCustomerBets } from "../services/clientService";
import { useEffect, useMemo, useState } from "react";
import { Bet } from "../types/api";

interface RankingRow {
  id: number;
  name: string;
  avatar: string;
  beers: number;
}

const baseRanking: RankingRow[] = [
  { id: 1, name: "Carol", avatar: "🔥", beers: 22 },
  { id: 2, name: "Motta", avatar: "😎", beers: 18 },
  { id: 3, name: "Bia", avatar: "⚽", beers: 16 },
  { id: 4, name: "JP", avatar: "🍀", beers: 11 },
];

function getSaldo(bets: Bet[]) {
  return bets.reduce((sum, bet) => sum + (bet.saldoLiquidoCervejas ?? 0), 0);
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
      id: session?.customerId ?? 999,
      name: localStorage.getItem(`barbet-nickname-${session?.customerId}`) ?? session?.apelido ?? "Voce",
      avatar: localStorage.getItem(`barbet-avatar-${session?.customerId}`) ?? "🍺",
      beers: Number(getSaldo(bets).toFixed(1)),
    };

    return [...baseRanking, currentUser].sort((a, b) => b.beers - a.beers);
  }, [bets, session]);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Placar"
        title="Ranking da mesa"
        description="Acompanhe quem esta mais quente na rodada e quem ja encheu a mesa de cervejas."
      />

      <div className="surface-card px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-label">Mesa em disputa</p>
            <p className="mt-2 font-display text-2xl font-semibold text-text-primary">Top cervejeiros</p>
          </div>
          <div className="pill-accent">
            <IconCrown size={16} className="mr-2" />
            Copa
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {ranking.map((item, index) => (
            <div key={`${item.id}-${item.name}`} className="surface-raised flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-accent-bg text-xl">
                  {item.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{medals[index] ?? "•"}</span>
                    <p className="font-medium text-text-primary">{item.name}</p>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                    {index < 3 ? "No pódio da rodada" : "Seguindo na disputa"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-green">
                  <IconBeer size={16} />
                  <span className="text-lg font-semibold">{item.beers.toFixed(1)}</span>
                </div>
                <p className="mt-1 text-xs text-text-muted">saldo</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NoticeCard />
    </div>
  );
}
