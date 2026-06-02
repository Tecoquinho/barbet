import type { ReactNode } from "react";
import { Match } from "../types/api";

interface MatchCardProps {
  match: Match;
  action?: ReactNode;
}

export default function MatchCard({ match, action }: MatchCardProps) {
  return (
    <div className="glass-panel overflow-hidden p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="tiny-label">{match.competition ?? match.status}</span>
            {match.stage && <span className="team-pill">{match.stage}</span>}
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-3 py-4 text-center">
              <p className="text-[13px] font-semibold tracking-[0.01em] text-white">{match.timeA}</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80">versus</p>
              <p className="mt-1 font-display text-2xl font-bold text-gold">x</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-3 py-4 text-center">
              <p className="text-[13px] font-semibold tracking-[0.01em] text-white">{match.timeB}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-white/58">
            <div className="panel-soft px-3 py-2">
              <p className="tiny-label">Horario</p>
              <p className="mt-1 text-white/80">
                {new Date(match.dataHora).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <div className="panel-soft px-3 py-2">
              <p className="tiny-label">Local</p>
              <p className="mt-1 truncate text-white/80">{match.venue ?? "Sports bar"}</p>
            </div>
          </div>
        </div>
        <div className="shrink-0">{action}</div>
      </div>
      {match.status === "OPEN" && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="panel-soft px-3 py-3">
            <p className="tiny-label">Casa</p>
            <p className="mt-2 font-semibold text-lime">{match.timeA}</p>
          </div>
          <div className="panel-soft px-3 py-3">
            <p className="tiny-label">Empate</p>
            <p className="mt-2 font-semibold text-gold">Pool</p>
          </div>
          <div className="panel-soft px-3 py-3">
            <p className="tiny-label">Fora</p>
            <p className="mt-2 font-semibold text-lime">{match.timeB}</p>
          </div>
        </div>
      )}
      {match.status === "FINISHED" && (
        <div className="mt-4 rounded-[22px] border border-lime/14 bg-lime/10 px-4 py-3 text-sm text-lime">
          Resultado encerrado: {match.golsTimeA} x {match.golsTimeB}
        </div>
      )}
    </div>
  );
}
