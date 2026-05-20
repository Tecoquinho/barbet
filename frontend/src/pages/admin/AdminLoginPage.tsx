import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../components/SectionHeader";
import { adminLogin } from "../../services/adminService";
import { useAdminStore } from "../../stores/adminStore";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAdminStore();
  const [email, setEmail] = useState("admin@barbet.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await adminLogin({ email, password });
      setAuth(data.token, data.email);
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.details?.[0] ?? "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
      <div className="w-full space-y-5">
        <SectionHeader
          eyebrow="Admin"
          title="Acesso do bar"
          description="Controle jogos, mesas, resultados e ranking interno do BarBet."
        />
        <form className="glass-panel space-y-4 p-5" onSubmit={onSubmit}>
          <input className="input" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input
            className="input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button className="btn-primary" disabled={loading}>
            {loading ? "Entrando..." : "Entrar no admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
