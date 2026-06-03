import {
  IconArrowUpRight,
  IconBeer,
  IconBolt,
  IconClock,
  IconPlayFootball,
  IconUserCircle,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NoticeCard from "../components/NoticeCard";
import SectionHeader from "../components/SectionHeader";
import { useRequireSession } from "../hooks/useRequireSession";
import { getCustomerBets, getOpenMatches } from "../services/clientService";
import { Bet, Match } from "../types/api";

function getSavedAvatar(customerId?: number) {
  if (!customerId) return "🍺";
  return localStorage.getItem(`barbet-avatar-${customerId}`) ?? "🍺";
}

function getLiveMinute() {
  const base = 61;
  return base + (Math.floor(Date.now() / 60000) % 19);
}

export default function MatchesPage() {
  const session = useRequireSession();
  const [matches, setMatches] = useState<Match[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [minute, setMinute] = useState(getLiveMinute());

  useEffect(() => {
    if (!session) return;
    Promise.all([getOpenMatches(session.barSlug), getCustomerBets(session.customerId)]).then(([matchData, betData]) => {
      setMatches(matchData);
      setBets(betData);
    });
  }, [session]);

  useEffect(() => {
    const timer = window.setInterval(() => setMinute(getLiveMinute()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const liveMatch = matches[0];
  const avatar = getSavedAvatar(session?.customerId);
  const balance = useMemo(() => bets.reduce((sum, bet) => sum + (bet.saldoLiquidoCervejas ?? 0), 0), [bets]);

  return (
    <div className="space-y-5">
      <div className="surface-card px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-accent-bg text-2xl">{avatar}</div>
            <div>
              <p className="section-label">Jogos</p>
              <p className="text-base font-medium text-text-primary">{session?.apelido ?? "Jogador"}</p>
            </div>
          </div>
          <div className="rounded-[14px] border border-border-default bg-bg-raised px-3 py-2 text-right">
            <p className="section-label">Saldo</p>
            <p className="mt-1 flex items-center justify-end gap-1 font-medium text-accent">
              <IconBeer size={16} />
              {balance.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      <SectionHeader
        eyebrow="Jogos"
        title="Rodada aberta"
        description="Veja o ao vivo, escolha o confronto e solte sua aposta simbolica em poucos toques."
      />

      {liveMatch && (
        <div className="surface-card overflow-hidden px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="pill-accent">
              <IconBolt size={14} className="mr-2" />
              Ao vivo
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <IconClock size={16} />
              {minute}'
            </div>
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div>
              <p className="text-lg font-semibold text-text-primary">{liveMatch.timeA}</p>
            </div>
            <div className="rounded-[14px] bg-bg-raised px-4 py-3 text-center">
              <p className="font-display text-3xl font-semibold text-accent">1 x 0</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-text-primary">{liveMatch.timeB}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="surface-card px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-label">{match.stage ?? "Rodada"}</p>
                <h3 className="mt-2 font-display text-[24px] font-semibold tracking-[-0.03em] text-text-primary">
                  {match.timeA} <span className="text-text-muted">x</span> {match.timeB}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {new Date(match.dataHora).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="pill">
                <IconPlayFootball size={14} className="mr-2" />
                {match.venue ?? "Arena"}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: match.timeA, value: "TEAM_A" },
                { label: "Empate", value: "DRAW" },
                { label: match.timeB, value: "TEAM_B" },
              ].map((option) => (
                <Link
                  key={option.value}
                  to={`/bar/${session?.barSlug}/mesa/${session?.mesaCodigo}/jogos/${match.id}/apostar`}
                  className="surface-raised surface-hover flex min-h-[72px] flex-col justify-between px-3 py-3"
                >
                  <span className="section-label">{option.value === "DRAW" ? "X" : option.value === "TEAM_A" ? "1" : "2"}</span>
                  <span className="text-sm font-medium text-text-primary">{option.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-text-secondary">
              <span>{match.competition ?? "Copa do Mundo BarBet"}</span>
              <div className="flex items-center gap-1 text-accent">
                <span>Apostar</span>
                <IconArrowUpRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <NoticeCard />
    </div>
  );
}
