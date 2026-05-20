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
  const [apelido, setApelido] = useState("");
  const [telefone, setTelefone] = useState("");
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
      const data = await enterTable({ apelido, telefone, barSlug, mesaCodigo });
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
        title="Entre no bolao"
        description="Escaneou o QR da mesa. Agora escolha um apelido e entre nos palpites da rodada."
      />
      <div className="glass-panel space-y-4 p-5">
        <div className="rounded-3xl border border-gold/20 bg-gold/10 p-4 text-sm text-foam">
          <p className="font-semibold">Bar do Teco</p>
          <p className="mt-1 text-white/70">Palpites recreativos em cervejas simbolicas.</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            className="input"
            placeholder="Seu apelido"
            value={apelido}
            onChange={(event) => setApelido(event.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Telefone (opcional)"
            value={telefone}
            onChange={(event) => setTelefone(event.target.value)}
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button className="btn-primary" disabled={loading}>
            {loading ? "Entrando..." : "Entrar na mesa"}
          </button>
        </form>
      </div>
      <NoticeCard />
    </div>
  );
}
