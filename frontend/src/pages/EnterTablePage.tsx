import { FormEvent, useEffect, useMemo, useState } from "react";
import { IconArrowRight, IconCheck, IconMoodSmile, IconShirtSport } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import NoticeCard from "../components/NoticeCard";
import SectionHeader from "../components/SectionHeader";
import { enterTable } from "../services/clientService";
import { useSessionStore } from "../stores/sessionStore";

const avatars = ["🍺", "😎", "🔥", "⚽", "🦁", "🐯", "🤙", "👑"];
const favoriteTeams = ["Brasil", "Argentina", "Franca", "Portugal", "Uruguai", "Alemanha"];

export default function EnterTablePage() {
  const { barSlug = "", mesaCodigo = "" } = useParams();
  const navigate = useNavigate();
  const { session, setSession, hydrate } = useSessionStore();
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const [team, setTeam] = useState(favoriteTeams[0]);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (session?.mesaCodigo === mesaCodigo) {
      navigate(`/bar/${barSlug}/mesa/${mesaCodigo}/jogos`, { replace: true });
    }
  }, [barSlug, mesaCodigo, navigate, session]);

  const nicknameHint = useMemo(() => {
    return nickname.trim() ? `Seu avatar sera ${avatar} • torcendo por ${team}` : "Escolha como voce quer aparecer na mesa";
  }, [avatar, nickname, team]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await enterTable({ nomeCompleto, cpf, barSlug, mesaCodigo });
      setSession(data);
      localStorage.setItem(`barbet-avatar-${data.customerId}`, avatar);
      localStorage.setItem(`barbet-team-${data.customerId}`, team);
      localStorage.setItem(`barbet-nickname-${data.customerId}`, nickname || data.apelido);
      navigate(`/bar/${barSlug}/mesa/${mesaCodigo}/jogos`);
    } catch (err: any) {
      setError(err.response?.data?.details?.[0] ?? "Nao foi possivel entrar na mesa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Entrada"
        title="Entre no bolao da mesa"
        description="Cadastro rapido em dois passos para liberar palpites, placar e ranking da rodada."
      />

      <div className="surface-card px-4 py-4">
        <div className="mb-5 flex items-center gap-2">
          {[1, 2].map((item) => (
            <div key={item} className={`h-2 flex-1 rounded-full ${item <= step ? "bg-accent" : "bg-border-default"}`} />
          ))}
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <p className="section-label">Step 1</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-text-primary">Apelido, avatar e time</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{nicknameHint}</p>
            </div>

            <div className="surface-raised px-4 py-4">
              <label className="section-label">Apelido</label>
              <input
                className="input mt-3"
                placeholder="Como a mesa vai te chamar?"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                maxLength={18}
              />
            </div>

            <div className="surface-raised px-4 py-4">
              <div className="flex items-center gap-2 text-text-primary">
                <IconMoodSmile size={18} />
                <p className="section-label">Avatar emoji</p>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {avatars.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAvatar(item)}
                    className={`rounded-[14px] border px-3 py-3 text-2xl transition ${
                      avatar === item ? "border-accent bg-accent-bg" : "border-border-default bg-bg-raised"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="surface-raised px-4 py-4">
              <div className="flex items-center gap-2 text-text-primary">
                <IconShirtSport size={18} />
                <p className="section-label">Time do coracao</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {favoriteTeams.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTeam(item)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      team === item ? "border-accent bg-accent-bg text-accent" : "border-border-default text-text-secondary"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-primary" type="button" onClick={() => setStep(2)} disabled={!nickname.trim()}>
              Continuar <IconArrowRight size={18} className="ml-2" />
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <p className="section-label">Step 2</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-text-primary">Confirme seus dados</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Mantemos a logica atual de cadastro usando nome completo e CPF.
              </p>
            </div>

            <div className="surface-raised px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-accent-bg text-3xl">{avatar}</div>
                <div>
                  <p className="font-medium text-text-primary">{nickname}</p>
                  <p className="text-sm text-text-secondary">Time: {team}</p>
                </div>
              </div>
            </div>

            <input
              className="input"
              placeholder="Nome completo"
              value={nomeCompleto}
              onChange={(event) => setNomeCompleto(event.target.value)}
              required
            />
            <input
              className="input"
              placeholder="CPF"
              value={cpf}
              onChange={(event) => setCpf(event.target.value)}
              inputMode="numeric"
              maxLength={14}
              required
            />

            {error && <p className="text-sm text-red">{error}</p>}

            <div className="flex gap-3">
              <button className="btn-secondary" type="button" onClick={() => setStep(1)}>
                Voltar
              </button>
              <button className="btn-primary" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"} {loading ? null : <IconCheck size={18} className="ml-2" />}
              </button>
            </div>
          </form>
        )}
      </div>

      <NoticeCard />
    </div>
  );
}
