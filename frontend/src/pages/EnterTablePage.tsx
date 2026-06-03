import { FormEvent, useEffect, useMemo, useState } from "react";
import { IconArmchair, IconArrowRight, IconUsers } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { enterTable } from "../services/clientService";
import { useSessionStore } from "../stores/sessionStore";

const avatars = ["🦁", "🐯", "🦊", "🐻", "🦅", "🐙"];
const teamOptions = [
  { emoji: "🇧🇷", label: "Brasil" },
  { emoji: "🇦🇷", label: "Argentina" },
  { emoji: "🇩🇪", label: "Alemanha" },
  { emoji: "🇫🇷", label: "Franca" },
  { emoji: "🇵🇹", label: "Portugal" },
  { emoji: "🏳️", label: "Neutro" },
];

function getPlayersPreview(currentAvatar: string, nickname: string) {
  return [
    { avatar: currentAvatar, name: nickname || "Voce", you: true },
    { avatar: "🐯", name: "Joao" },
    { avatar: "🦊", name: "Maria" },
    { avatar: "🐻", name: "Pedro" },
  ];
}

export default function EnterTablePage() {
  const { barSlug = "", mesaCodigo = "" } = useParams();
  const navigate = useNavigate();
  const { session, setSession, hydrate } = useSessionStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const [team, setTeam] = useState(teamOptions[0]);
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

  const playersPreview = useMemo(() => getPlayersPreview(avatar, nickname.trim() || "Ze"), [avatar, nickname]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await enterTable({ nomeCompleto, cpf, barSlug, mesaCodigo });
      setSession(data);
      localStorage.setItem(`barbet-avatar-${data.customerId}`, avatar);
      localStorage.setItem(`barbet-team-${data.customerId}`, team.label);
      localStorage.setItem(`barbet-nickname-${data.customerId}`, nickname.trim() || data.apelido);
      navigate(`/bar/${barSlug}/mesa/${mesaCodigo}/jogos`);
    } catch (err: any) {
      setError(err.response?.data?.details?.[0] ?? "Nao foi possivel entrar na mesa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {step === 1 ? (
        <div>
          <div className="hero">
            <div className="bar-logo">🍺</div>
            <div className="bar-nome">Bar do Teco</div>
            <div className="bar-sub">Apostas de cerveja na Copa</div>
            <div className="mesa-tag">
              <IconArmchair size={13} stroke={2} />
              <span>Mesa {mesaCodigo}</span>
            </div>
          </div>

          <div className="form-area">
            <div className="field-group">
              <label className="field-label" htmlFor="inp-apelido">
                Como te chamam?
              </label>
              <input
                id="inp-apelido"
                className="field-input"
                type="text"
                placeholder="Ex: Ze, Bia, Tiao..."
                maxLength={20}
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
              {nickname.trim().length > 0 && nickname.trim().length < 2 ? (
                <div className="error-msg-inline">Coloca pelo menos 2 letras</div>
              ) : null}
            </div>

            <div className="field-group">
              <label className="field-label">Escolha seu avatar</label>
              <div className="avatar-row">
                {avatars.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`avatar-opt ${avatar === item ? "sel" : ""}`}
                    onClick={() => setAvatar(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Time do coracao</label>
              <div className="avatar-row">
                {teamOptions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className={`avatar-opt ${team.label === item.label ? "sel" : ""}`}
                    onClick={() => setTeam(item)}
                    title={item.label}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-area">
            <button
              type="button"
              className="btn-primary-full"
              disabled={nickname.trim().length < 2}
              onClick={() => setStep(2)}
            >
              <IconArrowRight size={18} stroke={2} />
              Entrar na mesa
            </button>
            <div className="terms-note">Ao entrar voce concorda com a brincadeira recreativa 🍺</div>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: "flex", minHeight: "100%", flexDirection: "column" }}>
          <div className="step-2-body">
            <div className="success-circle">{avatar}</div>
            <div className="success-nome">E ai, {nickname.trim() || "Ze"}!</div>
            <div className="success-sub">
              Voce entrou na <b style={{ color: "#e6edf3" }}>Mesa {mesaCodigo}</b> do Bar do Teco.
              <br />
              Os outros ja estao te esperando!
            </div>

            <div className="jogadores-na-mesa">
              <div className="jnm-header">
                <IconUsers size={13} stroke={2} style={{ marginRight: 5, verticalAlign: -2 }} />
                Na mesa agora
              </div>
              {playersPreview.map((player, index) => (
                <div key={`${player.name}-${index}`} className="jnm-row">
                  <div className="jnm-av">{player.avatar}</div>
                  <span className="jnm-nome">{player.name}</span>
                  {player.you ? <span className="jnm-voce">Voce</span> : null}
                  <div className="jnm-online" />
                </div>
              ))}
            </div>

            <div style={{ width: "100%" }}>
              <div className="field-group">
                <label className="field-label" htmlFor="inp-nome">
                  Nome completo
                </label>
                <input
                  id="inp-nome"
                  className="field-input"
                  value={nomeCompleto}
                  onChange={(event) => setNomeCompleto(event.target.value)}
                  placeholder="Nome e sobrenome"
                  required
                />
              </div>

              <div className="field-group" style={{ marginBottom: 0 }}>
                <label className="field-label" htmlFor="inp-cpf">
                  CPF
                </label>
                <input
                  id="inp-cpf"
                  className="field-input"
                  value={cpf}
                  onChange={(event) => setCpf(event.target.value)}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  maxLength={14}
                  required
                />
              </div>
            </div>

            {error ? <div className="error-msg-inline">{error}</div> : null}
          </div>

          <div className="footer-area">
            <button type="submit" className="btn-primary-full" disabled={loading}>
              {loading ? "Entrando..." : "Ver jogos e apostar 🍺"}
            </button>
            <button type="button" className="btn-secondary-full" onClick={() => setStep(1)}>
              Voltar
            </button>
          </div>
        </form>
      )}
    </>
  );
}
