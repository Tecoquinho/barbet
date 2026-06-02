import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NoticeCard from "../components/NoticeCard";
import SectionHeader from "../components/SectionHeader";
import { enterTable } from "../services/clientService";
import { useSessionStore } from "../stores/sessionStore";

export default function EnterTablePage() {
  const { barSlug = "", mesaCodigo = "" } = useParams();
  const navigate = useNavigate();
  const { session, setSession, hydrate } = useSessionStore();
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

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await enterTable({ nomeCompleto, cpf, barSlug, mesaCodigo });
      setSession(data);
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
        eyebrow={`Mesa ${mesaCodigo}`}
        title="Entrar no bolao da rodada"
        description="Confirme seus dados para liberar os jogos, acompanhar a mesa e disputar o pool simbolico em cervejas."
      />
      <div className="glass-panel overflow-hidden p-5">
        <div className="rounded-[24px] border border-gold/15 bg-gradient-to-br from-gold/16 to-white/5 p-4 text-sm text-foam">
          <p className="tiny-label text-gold/80">Hoje no bar</p>
          <p className="mt-2 text-lg font-semibold text-white">Bar do Teco</p>
          <p className="mt-1 leading-6 text-white/68">
            Quem acertar o resultado divide as cervejas de quem errou. O bar separa 1 cerveja por jogo.
          </p>
        </div>
        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <div>
            <p className="tiny-label">Identificacao</p>
            <p className="mt-1 text-sm text-white/58">A entrada e simples e fica salva so neste dispositivo.</p>
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
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button className="btn-primary" disabled={loading}>
            {loading ? "Entrando..." : "Entrar e ver jogos"}
          </button>
        </form>
      </div>
      <NoticeCard />
    </div>
  );
}
