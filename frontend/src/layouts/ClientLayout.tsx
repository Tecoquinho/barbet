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
    <div className="bottom-safe mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-8 pt-5">
      <div className="glass-panel hero-panel mb-6 overflow-hidden p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-lime/90">BarBet</p>
            <h1 className="mt-2 max-w-[12ch] font-display text-[2rem] font-bold leading-[1.05] text-foam">
              Copa, bar e resenha na mesma mesa
            </h1>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-black/15 px-3 py-2 text-right backdrop-blur-xl">
            <p className="tiny-label text-white/55">Mesa</p>
            <p className="mt-1 font-display text-lg font-semibold text-white">{mesaCodigo}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
          <div className="rounded-[22px] border border-white/10 bg-black/15 px-4 py-3 backdrop-blur-xl">
            <p className="tiny-label text-white/55">Bar da rodada</p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{barName}</p>
          </div>
          <div className="rounded-[22px] border border-gold/15 bg-gold/10 px-4 py-3 text-right">
            <p className="tiny-label text-gold/75">Modo</p>
            <p className="mt-1 text-sm font-semibold text-gold">Pool simbolico</p>
          </div>
        </div>
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      {!isEntry && (
        <nav className="glass-panel sticky bottom-4 mt-6 grid grid-cols-2 gap-2 p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-[22px] px-4 py-3 text-left transition ${
                  isActive
                    ? "bg-white text-night shadow-[0_12px_24px_rgba(255,255,255,0.18)]"
                    : "bg-transparent text-white/68"
                }`
              }
            >
              {({ isActive }) => (
                <div>
                  <p className={`text-[11px] uppercase tracking-[0.22em] ${isActive ? "text-night/50" : "text-white/35"}`}>
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
  );
}
