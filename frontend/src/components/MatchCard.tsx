import type { ReactNode } from "react";
import { Match } from "../types/api";

interface MatchCardProps {
  match: Match;
  action?: ReactNode;
}

export default function MatchCard({ match, action }: MatchCardProps) {
  return (
    <div className="glass-panel match-shell overflow-hidden p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="tiny-label">{match.competition ?? match.status}</span>
          {match.stage && <span className="team-pill">{match.stage}</span>}
        </div>
        {action}
      </div>

      <div className="mt-4 rounded-[24px] border border-white/8 bg-black/15 px-4 py-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="min-w-0 text-left">
            <p className="tiny-label">Casa</p>
            <h3 className="mt-2 truncate font-display text-[1.35rem] font-semibold leading-tight text-white">
              {match.timeA}
            </h3>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.26em] text-gold/70">match</p>
            <p className="mt-2 font-display text-3xl font-bold text-gold">x</p>
          </div>
          <div className="min-w-0 text-right">
            <p className="tiny-label">Fora</p>
            <h3 className="mt-2 truncate font-display text-[1.35rem] font-semibold leading-tight text-white">
              {match.timeB}
            </h3>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/72">
          <div className="line-soft rounded-full px-3 py-2">
            {new Date(match.dataHora).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </div>
          {match.venue && <div className="line-soft rounded-full px-3 py-2">{match.venue}</div>}
        </div>
      </div>

      {match.status === "OPEN" && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="line-soft rounded-[18px] px-3 py-3">
            <p className="tiny-label">1</p>
            <p className="mt-2 font-semibold text-white">Casa</p>
          </div>
          <div className="line-soft rounded-[18px] px-3 py-3">
            <p className="tiny-label">X</p>
            <p className="mt-2 font-semibold text-gold">Empate</p>
          </div>
          <div className="line-soft rounded-[18px] px-3 py-3">
            <p className="tiny-label">2</p>
            <p className="mt-2 font-semibold text-white">Fora</p>
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
