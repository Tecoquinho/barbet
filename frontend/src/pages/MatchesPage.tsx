import { IconClock, IconSoccerField } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequireSession } from "../hooks/useRequireSession";
import { getCustomerBets, getOpenMatches } from "../services/clientService";
import { Bet, Match, WinnerChoice } from "../types/api";

const flagMap: Record<string, string> = {
  Brasil: "🇧🇷",
  Alemanha: "🇩🇪",
  Argentina: "🇦🇷",
  Franca: "🇫🇷",
  Portugal: "🇵🇹",
  Uruguai: "🇺🇾",
};

const siglaMap: Record<string, string> = {
  Brasil: "BRA",
  Alemanha: "GER",
  Argentina: "ARG",
  Franca: "FRA",
  Portugal: "POR",
  Uruguai: "URU",
};

function getFlag(team: string) {
  return flagMap[team] ?? "🏳️";
}

function getSigla(team: string) {
  return siglaMap[team] ?? team.slice(0, 3).toUpperCase();
}

function getLiveMinute() {
  const base = 68;
  return Math.min(90, base + (Math.floor(Date.now() / 8000) % 23));
}

function getChoiceOdd(match: Match, choice: WinnerChoice) {
  if (choice === "TEAM_A") return match.oddTeamA ?? 1;
  if (choice === "TEAM_B") return match.oddTeamB ?? 1;
  return match.oddDraw ?? 1;
}

export default function MatchesPage() {
  const session = useRequireSession();
  const navigate = useNavigate();
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
  const pendingBets = useMemo(() => bets.filter((bet) => bet.status === "OPEN" || bet.status === "CLOSED").length, [bets]);

  function openBet(matchId: number) {
    if (!session) return;
    navigate(`/bar/${session.barSlug}/mesa/${session.mesaCodigo}/jogos/${matchId}/apostar`);
  }

  return (
    <>
      <div className="section-wrap">
        <div className="group-pill">
          <IconClock size={13} stroke={2} />
          <span>{pendingBets} apostas ativas na mesa</span>
        </div>
      </div>

      {liveMatch ? (
        <div className="live-banner">
          <div className="live-header">
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span className="live-dot" />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#3fb950", letterSpacing: 0.8 }}>AO VIVO</span>
            </div>
            <span style={{ fontSize: 10, color: "#3fb950", fontWeight: 700 }}>{minute}'</span>
          </div>

          <div className="live-body">
            <div className="time">
              <span className="time-bandeira">{getFlag(liveMatch.timeA)}</span>
              <span className="time-nome">{liveMatch.timeA}</span>
              <span className="time-sigla">{getSigla(liveMatch.timeA)}</span>
            </div>

            <div className="placar-box">
              <div className="placar">
                <span className="placar-num">{liveMatch.golsTimeA ?? 1}</span>
                <span className="placar-sep">×</span>
                <span className="placar-num">{liveMatch.golsTimeB ?? 0}</span>
              </div>
              <span className="minuto">{minute}'</span>
            </div>

            <div className="time">
              <span className="time-bandeira">{getFlag(liveMatch.timeB)}</span>
              <span className="time-nome">{liveMatch.timeB}</span>
              <span className="time-sigla">{getSigla(liveMatch.timeB)}</span>
            </div>
          </div>

          <div className="live-footer">
            {[
              { label: liveMatch.timeA, flag: getFlag(liveMatch.timeA), value: "TEAM_A" as WinnerChoice },
              { label: "Empate", flag: "⚖️", value: "DRAW" as WinnerChoice },
              { label: liveMatch.timeB, flag: getFlag(liveMatch.timeB), value: "TEAM_B" as WinnerChoice },
            ].map((option) => (
              <button key={option.value} type="button" className="btn-apostar" onClick={() => openBet(liveMatch.id)}>
                <span>{option.flag}</span>
                <span>{option.label}</span>
                <span className="odds">+{getChoiceOdd(liveMatch, option.value).toFixed(1)}x</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="section-wrap">
        <div className="section-title">
          <IconSoccerField size={14} stroke={2} />
          Proximos jogos
        </div>
      </div>

      {matches.map((match, index) => (
        <div key={match.id} className={`jogo-card ${index === 0 ? "ao-vivo" : ""}`}>
          <div className="jogo-header">
            <span>{match.competition ?? "Copa do Mundo"} · {match.stage ?? "Rodada"}</span>
            <span>
              {index === 0
                ? "Agora"
                : new Date(match.dataHora).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </span>
          </div>

          <div className="jogo-body">
            <div className="time">
              <span className="time-bandeira">{getFlag(match.timeA)}</span>
              <span className="time-nome">{match.timeA}</span>
              <span className="time-sigla">{getSigla(match.timeA)}</span>
            </div>

            <div className="placar-box">
              <div className="placar">
                <span className="placar-num" style={{ color: "#8b949e", fontSize: 28 }}>
                  {index === 0 ? match.golsTimeA ?? 1 : "-"}
                </span>
                <span className="placar-sep">×</span>
                <span className="placar-num" style={{ color: "#8b949e", fontSize: 28 }}>
                  {index === 0 ? match.golsTimeB ?? 0 : "-"}
                </span>
              </div>
              <span className="horario">
                {index === 0
                  ? `${minute}'`
                  : new Date(match.dataHora).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </span>
            </div>

            <div className="time">
              <span className="time-bandeira">{getFlag(match.timeB)}</span>
              <span className="time-nome">{match.timeB}</span>
              <span className="time-sigla">{getSigla(match.timeB)}</span>
            </div>
          </div>

          <div className="jogo-footer">
            {[
              { label: match.timeA, flag: getFlag(match.timeA), value: "TEAM_A" as WinnerChoice },
              { label: "Empate", flag: "⚖️", value: "DRAW" as WinnerChoice },
              { label: match.timeB, flag: getFlag(match.timeB), value: "TEAM_B" as WinnerChoice },
            ].map((option) => (
              <button key={option.value} type="button" className="btn-apostar" onClick={() => openBet(match.id)}>
                <span>{option.flag}</span>
                <span>{option.label}</span>
                <span className="odds">+{getChoiceOdd(match, option.value).toFixed(1)}x</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
