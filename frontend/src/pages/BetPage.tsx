import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MatchCard from "../components/MatchCard";
import SectionHeader from "../components/SectionHeader";
import { useRequireSession } from "../hooks/useRequireSession";
import { createBet, getBeerOptions, getOpenMatches } from "../services/clientService";
import { BeerOption, Match, WinnerChoice } from "../types/api";

export default function BetPage() {
  const session = useRequireSession();
  const { matchId, barSlug, mesaCodigo } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [beers, setBeers] = useState<BeerOption[]>([]);
  const [winner, setWinner] = useState<WinnerChoice>("TEAM_A");
  const [placarA, setPlacarA] = useState("");
  const [placarB, setPlacarB] = useState("");
  const [cervejas, setCervejas] = useState(1);
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
      const selected = openMatches.find((item) => item.id === Number(matchId)) ?? null;
      setMatch(selected);
      setBeers(beerOptions);
      setCervejaId(beerOptions[0]?.id ?? "");
    }
    load();
  }, [matchId, session]);

  const cervejaSelecionada = useMemo(() => {
    return beers.find((item) => item.id === cervejaId) ?? null;
  }, [beers, cervejaId]);

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
      navigate(`/bar/${barSlug}/mesa/${mesaCodigo}/meus-palpites`);
    } catch (err: any) {
      setError(err.response?.data?.details?.[0] ?? "Nao foi possivel enviar a aposta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Nova aposta"
        title="Escolha mercado e cerveja"
        description="Selecione o resultado do jogo e entre no pool. Quem acertar divide as cervejas dos perdedores, com 1 cerveja separada para o bar."
      />
      {match && <MatchCard match={match} />}
      <form className="glass-panel space-y-5 p-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <p className="text-sm text-white/70">Resultado da aposta</p>
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
                  className={`rounded-2xl border px-3 py-3 text-sm font-semibold ${
                    winner === option.value
                      ? "border-lime bg-lime text-night"
                      : "border-white/10 bg-white/10 text-white"
                  }`}
                >
                  <span className="block">{option.label}</span>
                </button>
              ))}
          </div>
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

        <div className="space-y-3">
          <p className="text-sm text-white/70">Escolha a cerveja da aposta</p>
          <div className="space-y-3">
            {beers.map((beer) => (
              <button
                key={beer.id}
                type="button"
                onClick={() => setCervejaId(beer.id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                  cervejaId === beer.id ? "border-gold bg-gold/10" : "border-white/10 bg-white/5"
                }`}
              >
                <div>
                  <p className="font-semibold text-white">{beer.nome}</p>
                  <p className="text-sm text-white/60">{beer.marca}</p>
                </div>
                <span className="chip">R$ {beer.preco.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">Quantidade</label>
          <input
            className="input"
            type="number"
            min="1"
            max="12"
            value={cervejas}
            onChange={(event) => setCervejas(Number(event.target.value))}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm">
          <div>
            <p className="text-white/50">Entrada</p>
            <p className="mt-1 font-semibold text-lime">{cervejas} cervejas</p>
          </div>
          <div>
            <p className="text-white/50">Cerveja escolhida</p>
            <p className="mt-1 font-semibold text-white">{cervejaSelecionada?.nome ?? "-"}</p>
          </div>
          <div>
            <p className="text-white/50">Regra</p>
            <p className="mt-1 font-semibold text-gold">1 cerveja fica no bar</p>
          </div>
        </div>

        {error && <p className="text-sm text-red-300">{error}</p>}
        <button className="btn-primary" disabled={loading || !match || !cervejaId}>
          {loading ? "Confirmando..." : "Confirmar aposta"}
        </button>
      </form>
    </div>
  );
}
