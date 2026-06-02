import { useEffect } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAdminStore } from "../stores/adminStore";

const navItems = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/jogos", label: "Jogos" },
  { to: "/admin/mesas", label: "Mesas" },
  { to: "/admin/ranking", label: "Ranking" },
];

export default function AdminLayout() {
  const { token, hydrate, setAuth } = useAdminStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-night px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[32px] border border-white/10 bg-panel p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Admin BarBet</p>
            <h1 className="font-display text-3xl font-bold text-white">Painel do bar</h1>
          </div>
          <button className="btn-secondary md:w-auto" onClick={() => setAuth(null)}>
            Sair
          </button>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive ? "bg-gold text-night" : "glass-panel text-white/80"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </div>
  );
}
