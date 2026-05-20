import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { getDashboard } from "../../services/adminService";
import { Dashboard } from "../../types/api";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  useEffect(() => {
    getDashboard().then(setDashboard);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Jogos abertos" value={dashboard?.jogosAbertos ?? 0} />
        <StatCard label="Total de apostas" value={dashboard?.totalApostas ?? 0} />
        <StatCard label="Clientes no ranking" value={dashboard?.ranking.length ?? 0} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-panel p-5">
          <h2 className="font-display text-2xl font-semibold">Jogos da rodada</h2>
          <div className="mt-4 space-y-3">
            {dashboard?.jogos.map((match) => (
              <div key={match.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">
                    {match.timeA} x {match.timeB}
                  </p>
                  <span className="chip">{match.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel p-5">
          <h2 className="font-display text-2xl font-semibold">Top ranking</h2>
          <div className="mt-4 space-y-3">
            {dashboard?.ranking.slice(0, 5).map((item, index) => (
              <div key={item.customerId} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/60">#{index + 1}</p>
                <p className="mt-1 font-semibold">{item.apelido}</p>
                <p className="text-sm text-gold">{item.totalPontos} pts</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
