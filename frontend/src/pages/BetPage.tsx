import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MatchCard from "../components/MatchCard";
import SectionHeader from "../components/SectionHeader";
import { useRequireSession } from "../hooks/useRequireSession";
import { createBet, getOpenMatches } from "../services/clientService";
import { Match, WinnerChoice } from "../types/api";

export default function BetPage() {
  const session = useRequireSession();
  const { matchId, barSlug, mesaCodigo } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [winner, setWinner] = useState<WinnerChoice>("TEAM_A");
  const [placarA, setPlacarA] = useState("");
  const [placarB, setPlacarB] = useState("");
  const [cervejas, setCervejas] = useState(3);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!session || !matchId) return;
      const openMatches = await getOpenMatches(session.barSlug);
      const selected = openMatches.find((item) => item.id === Number(matchId)) ?? null;
      setMatch(selected);
    }
    load();
  }, [matchId, session]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!session || !match) return;
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
      });
      navigate(`/bar/${barSlug}/mesa/${mesaCodigo}/meus-palpites`);
    } catch (err: any) {
      setError(err.response?.data?.details?.[0] ?? "Nao foi possivel enviar o palpite");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Novo palpite"
        title="Aposte suas cervejas"
        description="Cada jogo aceita um unico palpite por cliente. O ranking soma vencedor e placar exato."
      />
      {match && <MatchCard match={match} />}
      <form className="glass-panel space-y-4 p-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <p className="text-sm text-white/70">Vencedor</p>
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
                  className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
                    winner === option.value ? "bg-lime text-night" : "bg-white/10 text-white"
                  }`}
                >
                  {option.label}
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
        <div>
          <label className="mb-2 block text-sm text-white/70">Quantidade de cervejas simbolicas</label>
          <input
            className="input"
            type="number"
            min="1"
            max="20"
            value={cervejas}
            onChange={(event) => setCervejas(Number(event.target.value))}
          />
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button className="btn-primary" disabled={loading || !match}>
          {loading ? "Enviando..." : "Confirmar palpite"}
        </button>
      </form>
    </div>
  );
}
