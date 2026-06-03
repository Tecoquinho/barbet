import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRequireSession } from "../hooks/useRequireSession";
import { createBet, getBeerOptions, getOpenMatches } from "../services/clientService";
import { BeerOption, Match, WinnerChoice } from "../types/api";

const flagMap: Record<string, string> = {
  Brasil: "🇧🇷",
  Alemanha: "🇩🇪",
  Argentina: "🇦🇷",
  Franca: "🇫🇷",
  Portugal: "🇵🇹",
  Uruguai: "🇺🇾",
};

function getFlag(team: string) {
  return flagMap[team] ?? "🏳️";
}

function getPotentialGain(match: Match | null, winner: WinnerChoice, quantidade: number) {
  if (!match) return 0;
  const odd =
    winner === "TEAM_A" ? match.oddTeamA ?? 1 : winner === "TEAM_B" ? match.oddTeamB ?? 1 : match.oddDraw ?? 1;
  return Number((quantidade * odd).toFixed(1));
}

function getOdd(match: Match | null, choice: WinnerChoice) {
  if (!match) return 1;
  if (choice === "TEAM_A") return match.oddTeamA ?? 1;
  if (choice === "TEAM_B") return match.oddTeamB ?? 1;
  return match.oddDraw ?? 1;
}

export default function BetPage() {
  const session = useRequireSession();
  const { matchId, barSlug, mesaCodigo } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [beers, setBeers] = useState<BeerOption[]>([]);
  const [winner, setWinner] = useState<WinnerChoice>("TEAM_A");
  const [placarA, setPlacarA] = useState("");
  const [placarB, setPlacarB] = useState("");
  const [cervejas, setCervejas] = useState(2);
  const [cervejaId, setCervejaId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!session || !matchId) return;
      const [openMatches, beerOptions] = await Promise.all([getOpenMatches(session.barSlug), getBeerOptions()]);
      setMatch(openMatches.find((item) => item.id === Number(matchId)) ?? null);
      setBeers(beerOptions);
      setCervejaId(beerOptions[0]?.id ?? "");
    }

    load();
  }, [matchId, session]);

  const potentialGain = useMemo(() => getPotentialGain(match, winner, cervejas), [cervejas, match, winner]);
  const selectedBeer = useMemo(() => beers.find((beer) => beer.id === cervejaId) ?? null, [beers, cervejaId]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!session || !match || !cervejaId) return;

    setLoading(true);
    setError("");

    try {
      await createBet({
        clienteId: session.customerId,
        jogoId: match.id,
        vencedorEscolhido: winner,
        placarTimeA: placarA ? Number(placarA) : undefined,
        placarTimeB: placarB ? Number(placarB) : undefined,
        quantidadeCervejas: cervejas,
        cervejaId,
      });
      navigate(`/bar/${barSlug}/mesa/${mesaCodigo}/apostas`);
    } catch (err: any) {
      setError(err.response?.data?.details?.[0] ?? "Nao foi possivel enviar a aposta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-wrap" onClick={(event) => event.target === event.currentTarget && navigate(`/bar/${barSlug}/mesa/${mesaCodigo}/jogos`)}>
      <form className="modal" onSubmit={onSubmit}>
        <div className="modal-handle" />
        <div className="modal-title">
          {getFlag(match?.timeA ?? "")} {match?.timeA ?? "Time A"} × {getFlag(match?.timeB ?? "")} {match?.timeB ?? "Time B"}
        </div>
        <div className="modal-sub">{match?.stage ?? "Rodada"} · {match?.competition ?? "Copa do Mundo"}</div>

        <div className="m-opcoes">
          {match
            ? [
                { flag: getFlag(match.timeA), label: match.timeA, value: "TEAM_A" as WinnerChoice },
                { flag: "⚖️", label: "Empate", value: "DRAW" as WinnerChoice },
                { flag: getFlag(match.timeB), label: match.timeB, value: "TEAM_B" as WinnerChoice },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`m-op ${winner === option.value ? "sel" : ""}`}
                  onClick={() => setWinner(option.value)}
                >
                  <span className="m-op-flag">{option.flag}</span>
                  <span className="m-op-name">{option.label}</span>
                  <small>{getOdd(match, option.value).toFixed(1)}x</small>
                </button>
              ))
            : null}
        </div>

        <div className="field-group" style={{ marginBottom: 14 }}>
          <label className="field-label">Placar opcional</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input
              className="field-input"
              type="number"
              min="0"
              placeholder={match?.timeA ?? "Time A"}
              value={placarA}
              onChange={(event) => setPlacarA(event.target.value)}
            />
            <input
              className="field-input"
              type="number"
              min="0"
              placeholder={match?.timeB ?? "Time B"}
              value={placarB}
              onChange={(event) => setPlacarB(event.target.value)}
            />
          </div>
        </div>

        <div className="field-group" style={{ marginBottom: 14 }}>
          <label className="field-label">Cerveja da aposta</label>
          <select className="field-input" value={cervejaId} onChange={(event) => setCervejaId(event.target.value)}>
            {beers.map((beer) => (
              <option key={beer.id} value={beer.id}>
                {beer.nome} · {beer.marca} · R$ {beer.preco.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div className="m-qtd-row">
          <span>Quantas cervejas?</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button type="button" className="m-q-btn" onClick={() => setCervejas((value) => Math.max(1, value - 1))}>
              −
            </button>
            <span>{"🍺".repeat(cervejas)}</span>
            <button type="button" className="m-q-btn" onClick={() => setCervejas((value) => Math.min(10, value + 1))}>
              +
            </button>
          </div>
        </div>

        {selectedBeer ? (
          <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 12 }}>
            Cerveja selecionada: <span style={{ color: "#e6edf3" }}>{selectedBeer.nome}</span>
          </div>
        ) : null}

        {error ? <div className="error-msg-inline">{error}</div> : null}

        <button type="submit" className="m-confirm" disabled={loading || !match || !cervejaId}>
          {loading ? "Confirmando..." : `Apostar ${cervejas}🍺 → ganhar ${potentialGain.toFixed(1)}🍺`}
        </button>
        <button type="button" className="m-cancel" onClick={() => navigate(`/bar/${barSlug}/mesa/${mesaCodigo}/jogos`)}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
