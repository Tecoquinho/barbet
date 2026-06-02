import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";

const navItems = [
  { to: "jogos", label: "Jogos", hint: "Rodada" },
  { to: "meus-palpites", label: "Palpites", hint: "Minha mesa" },
];

export default function ClientLayout() {
  const { barSlug = "barbet", mesaCodigo = "mesa" } = useParams();
  const location = useLocation();
  const barName = barSlug
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
  const isEntry = location.pathname.endsWith(`/${mesaCodigo}`);

  return (
    <div className="mx-auto flex min-h-screen items-start justify-center px-3 py-3">
      <div className="phone-frame bottom-safe flex flex-col px-4 pb-6 pt-4">
        <div className="mb-5 flex items-center justify-center">
          <div className="h-1.5 w-24 rounded-full bg-white/10" />
        </div>
        <div className="glass-panel hero-panel mb-5 overflow-hidden p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">BarBet</p>
              <h1 className="mt-2 max-w-[11ch] font-display text-[1.85rem] font-bold leading-[1.02] text-white">
                Matchday no bar
              </h1>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-[#0f141b] px-3 py-2 text-right">
              <p className="tiny-label text-white/55">Mesa</p>
              <p className="mt-1 font-display text-lg font-semibold text-white">{mesaCodigo}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
            <div className="rounded-[22px] border border-white/10 bg-[#0f141b] px-4 py-3">
              <p className="tiny-label text-white/55">Bar</p>
              <p className="mt-1 truncate text-sm font-semibold text-white">{barName}</p>
            </div>
            <div className="rounded-[22px] border border-gold/20 bg-gold/10 px-4 py-3 text-right">
              <p className="tiny-label text-gold/80">Modo</p>
              <p className="mt-1 text-sm font-semibold text-gold">Simbolico</p>
            </div>
          </div>
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
        {!isEntry && (
          <nav className="glass-panel sticky bottom-3 mt-5 grid grid-cols-2 gap-2 p-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-[24px] px-4 py-3 text-left transition ${
                    isActive ? "bg-gold text-night" : "bg-transparent text-white/68"
                  }`
                }
              >
                {({ isActive }) => (
                  <div>
                    <p className={`text-[11px] uppercase tracking-[0.22em] ${isActive ? "text-night/55" : "text-white/35"}`}>
                      {item.hint}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{item.label}</p>
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
