import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "jogos", label: "Jogos de Hoje" },
  { to: "meus-palpites", label: "Meus palpites" },
];

export default function ClientLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-8 pt-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-lime">BarBet</p>
          <h1 className="font-display text-2xl font-bold">Bolao da Copa no bar</h1>
        </div>
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <nav className="glass-panel sticky bottom-4 mt-6 grid grid-cols-2 gap-2 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-3 text-center text-sm font-semibold transition ${
                isActive ? "bg-white text-night" : "text-white/70"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
