import {
  IconBeer,
  IconChevronDown,
  IconCircleCheckFilled,
  IconX,
} from "@tabler/icons-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRequireSession } from "../hooks/useRequireSession";
import { createBet, getBeerOptions, getOpenMatches } from "../services/clientService";
import { BeerOption, Match, WinnerChoice } from "../types/api";

function getPotentialGain(match: Match | null, winner: WinnerChoice, quantidade: number) {
  if (!match) return 0;
  const odd =
    winner === "TEAM_A" ? match.oddTeamA ?? 1 : winner === "TEAM_B" ? match.oddTeamB ?? 1 : match.oddDraw ?? 1;
  return Number((quantidade * odd).toFixed(1));
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
      const [openMatches, beerOptions] = await Promise.all([
        getOpenMatches(session.barSlug),
        getBeerOptions(),
      ]);
      setMatch(openMatches.find((item) => item.id === Number(matchId)) ?? null);
      setBeers(beerOptions);
      setCervejaId(beerOptions[0]?.id ?? "");
    }
    load();
  }, [matchId, session]);

  const selectedBeer = useMemo(() => beers.find((item) => item.id === cervejaId) ?? null, [beers, cervejaId]);
  const potentialGain = useMemo(() => getPotentialGain(match, winner, cervejas), [cervejas, match, winner]);

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
    <div className="fixed inset-0 z-40 flex items-end justify-center sheet-backdrop px-3">
      <div className="app-shell relative h-full max-h-[100vh] overflow-hidden border-none bg-transparent shadow-none">
        <button
          type="button"
          onClick={() => navigate(`/bar/${barSlug}/mesa/${mesaCodigo}/jogos`)}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-bg-surface text-text-secondary"
        >
          <IconX size={18} />
        </button>

        <div className="absolute inset-0 bg-transparent" />

        <div className="sheet-panel absolute bottom-0 left-0 right-0 px-4 pb-6 pt-4">
          <div className="mb-4 flex justify-center">
            <div className="h-1.5 w-20 rounded-full bg-border-subtle" />
          </div>

          <div>
            <p className="section-label">Bottom sheet de aposta</p>
            <h2 className="mt-2 font-display text-[28px] font-semibold tracking-[-0.03em] text-text-primary">
              {match?.timeA} <span className="text-text-muted">x</span> {match?.timeB}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">Escolha um resultado, ajuste as cervejas e confirme.</p>
          </div>

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-3 gap-2">
              {match &&
                [
                  { label: match.timeA, value: "TEAM_A" },
                  { label: "Empate", value: "DRAW" },
                  { label: match.timeB, value: "TEAM_B" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setWinner(option.value as WinnerChoice)}
                    className={`surface-raised px-3 py-3 text-left transition ${
                      winner === option.value ? "border-accent bg-accent-bg" : ""
                    }`}
                  >
                    <p className="section-label">{option.value === "DRAW" ? "X" : option.value === "TEAM_A" ? "1" : "2"}</p>
                    <p className="mt-2 text-sm font-medium text-text-primary">{option.label}</p>
                  </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                className="input"
                type="number"
                min="0"
                placeholder={match?.timeA ?? "Time A"}
                value={placarA}
                onChange={(event) => setPlacarA(event.target.value)}
              />
              <input
                className="input"
                type="number"
                min="0"
                placeholder={match?.timeB ?? "Time B"}
                value={placarB}
                onChange={(event) => setPlacarB(event.target.value)}
              />
            </div>

            <div className="surface-raised px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-label">Tipo de cerveja</p>
                  <p className="mt-1 text-sm text-text-secondary">Mantendo a logica atual do app</p>
                </div>
                <IconChevronDown size={18} className="text-text-secondary" />
              </div>
              <div className="mt-3 space-y-2">
                {beers.map((beer) => (
                  <button
                    key={beer.id}
                    type="button"
                    onClick={() => setCervejaId(beer.id)}
                    className={`flex w-full items-center justify-between rounded-[18px] border px-3 py-3 text-left ${
                      cervejaId === beer.id ? "border-accent bg-accent-bg" : "border-border-default bg-bg-base"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-text-primary">{beer.nome}</p>
                      <p className="text-xs text-text-secondary">{beer.marca}</p>
                    </div>
                    <p className="text-sm text-accent">R$ {beer.preco.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="surface-raised px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-label">Quantidade</p>
                  <p className="mt-1 text-sm text-text-secondary">Ajuste quantas cervejas entram no pool</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-bg-base text-text-primary"
                    onClick={() => setCervejas((value) => Math.max(1, value - 1))}
                  >
                    -
                  </button>
                  <span className="min-w-[32px] text-center text-lg font-semibold text-text-primary">{cervejas}</span>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-bg-base text-text-primary"
                    onClick={() => setCervejas((value) => Math.min(12, value + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="surface-card flex items-center justify-between px-4 py-4">
              <div>
                <p className="section-label">Ganho potencial</p>
                <p className="mt-1 text-sm text-text-secondary">Estimativa visual da tela</p>
              </div>
              <div className="flex items-center gap-2 text-accent">
                <IconBeer size={18} />
                <span className="text-xl font-semibold">{potentialGain.toFixed(1)}</span>
              </div>
            </div>

            {selectedBeer && (
              <div className="flex items-center gap-2 rounded-[18px] bg-green-bg px-3 py-3 text-sm text-green">
                <IconCircleCheckFilled size={16} />
                Confirmando com {selectedBeer.nome}
              </div>
            )}

            {error && <p className="text-sm text-red">{error}</p>}

            <button className="btn-primary" disabled={loading || !match || !cervejaId}>
              {loading ? "Confirmando..." : `Confirmar • ${potentialGain.toFixed(1)}🍺 potencial`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
