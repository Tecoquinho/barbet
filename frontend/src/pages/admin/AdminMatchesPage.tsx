import { FormEvent, useEffect, useState } from "react";
import MatchCard from "../../components/MatchCard";
import {
  closeMatch,
  createMatch,
  finishMatch,
  getMatches,
  updateMatch,
} from "../../services/adminService";
import { Match } from "../../types/api";

const initialForm = { barId: 1, timeA: "", timeB: "", dataHora: "" };

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [finishScores, setFinishScores] = useState<Record<number, { a: string; b: string }>>({});

  async function load() {
    setMatches(await getMatches());
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const payload = {
      ...form,
      dataHora: new Date(form.dataHora).toISOString(),
    };
    if (editingId) {
      await updateMatch(editingId, payload);
    } else {
      await createMatch(payload);
    }
    setForm(initialForm);
    setEditingId(null);
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form className="glass-panel space-y-4 p-5" onSubmit={onSubmit}>
        <h2 className="font-display text-2xl font-semibold">{editingId ? "Editar jogo" : "Novo jogo"}</h2>
        <input
          className="input"
          placeholder="Time A"
          value={form.timeA}
          onChange={(event) => setForm({ ...form, timeA: event.target.value })}
        />
        <input
          className="input"
          placeholder="Time B"
          value={form.timeB}
          onChange={(event) => setForm({ ...form, timeB: event.target.value })}
        />
        <input
          className="input"
          type="datetime-local"
          value={form.dataHora}
          onChange={(event) => setForm({ ...form, dataHora: event.target.value })}
        />
        <button className="btn-primary" type="submit">
          {editingId ? "Salvar alteracoes" : "Criar jogo"}
        </button>
      </form>
      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.id} className="space-y-3">
            <MatchCard
              match={match}
              action={
                <button
                  className="rounded-2xl bg-white/10 px-4 py-2 text-sm"
                  type="button"
                  onClick={() => {
                    setEditingId(match.id);
                    setForm({
                      barId: 1,
                      timeA: match.timeA,
                      timeB: match.timeB,
                      dataHora: match.dataHora.slice(0, 16),
                    });
                  }}
                >
                  Editar
                </button>
              }
            />
            <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <button className="btn-secondary" type="button" onClick={() => closeMatch(match.id).then(load)}>
                Fechar apostas
              </button>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="input"
                  placeholder="Gols A"
                  type="number"
                  min="0"
                  value={finishScores[match.id]?.a ?? ""}
                  onChange={(event) =>
                    setFinishScores({
                      ...finishScores,
                      [match.id]: { a: event.target.value, b: finishScores[match.id]?.b ?? "" },
                    })
                  }
                />
                <input
                  className="input"
                  placeholder="Gols B"
                  type="number"
                  min="0"
                  value={finishScores[match.id]?.b ?? ""}
                  onChange={(event) =>
                    setFinishScores({
                      ...finishScores,
                      [match.id]: { a: finishScores[match.id]?.a ?? "", b: event.target.value },
                    })
                  }
                />
              </div>
              <button
                className="btn-primary md:w-auto"
                type="button"
                onClick={() =>
                  finishMatch(match.id, {
                    golsTimeA: Number(finishScores[match.id]?.a ?? 0),
                    golsTimeB: Number(finishScores[match.id]?.b ?? 0),
                  }).then(load)
                }
              >
                Finalizar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
