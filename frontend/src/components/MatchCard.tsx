import type { ReactNode } from "react";
import { Match } from "../types/api";

interface MatchCardProps {
  match: Match;
  action?: ReactNode;
}

export default function MatchCard({ match, action }: MatchCardProps) {
  return (
    <div className="glass-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">
            {match.competition ?? match.status}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold">
            {match.timeA} <span className="text-white/40">x</span> {match.timeB}
          </h3>
          {(match.stage || match.venue) && (
            <p className="mt-2 text-sm text-white/60">
              {[match.stage, match.venue].filter(Boolean).join(" • ")}
            </p>
          )}
          <p className="mt-2 text-sm text-white/60">
            {new Date(match.dataHora).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </div>
        {action}
      </div>
      {match.status === "OPEN" && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-2xl bg-black/20 px-3 py-2">
            <p className="text-white/45">1</p>
            <p className="mt-1 font-semibold text-lime">{match.timeA}</p>
          </div>
          <div className="rounded-2xl bg-black/20 px-3 py-2">
            <p className="text-white/45">X</p>
            <p className="mt-1 font-semibold text-lime">Empate</p>
          </div>
          <div className="rounded-2xl bg-black/20 px-3 py-2">
            <p className="text-white/45">2</p>
            <p className="mt-1 font-semibold text-lime">{match.timeB}</p>
          </div>
        </div>
      )}
      {match.status === "FINISHED" && (
        <div className="mt-4 rounded-2xl bg-black/20 px-3 py-2 text-sm text-lime">
          Resultado: {match.golsTimeA} x {match.golsTimeB}
        </div>
      )}
    </div>
  );
}
