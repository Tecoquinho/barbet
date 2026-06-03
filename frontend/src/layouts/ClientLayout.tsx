import {
  IconBallFootball,
  IconBeer,
  IconMedal,
  IconReceipt2,
  IconUserCircle,
} from "@tabler/icons-react";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useSessionStore } from "../stores/sessionStore";

const navItems = [
  { to: "jogos", label: "Jogos", icon: IconBallFootball },
  { to: "apostas", label: "Apostas", icon: IconReceipt2 },
  { to: "placar", label: "Placar", icon: IconMedal },
];

function getSavedAvatar(customerId?: number) {
  if (!customerId) return "🍺";
  return localStorage.getItem(`barbet-avatar-${customerId}`) ?? "🍺";
}

export default function ClientLayout() {
  const location = useLocation();
  const { barSlug = "", mesaCodigo = "" } = useParams();
  const { session } = useSessionStore();

  const barLabel = useMemo(() => {
    return barSlug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }, [barSlug]);

  const avatar = getSavedAvatar(session?.customerId);
  const isEntryScreen = location.pathname === `/bar/${barSlug}/mesa/${mesaCodigo}` || location.pathname.endsWith("/entrada");
  const currentPath = location.pathname;

  return (
    <div className="mx-auto flex min-h-screen items-start justify-center px-3 py-3">
      <div className="app-shell bottom-safe flex flex-col overflow-hidden px-4 pb-4 pt-4">
        <div className="mb-4 flex items-center justify-center">
          <div className="h-1.5 w-24 rounded-full bg-border-subtle" />
        </div>

        <header className="surface-card mb-4 px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-accent">
                <IconBeer size={18} stroke={2} />
                <span className="section-label text-accent">BarBet</span>
              </div>
              <p className="mt-2 font-display text-[24px] font-semibold leading-tight text-text-primary">
                {barLabel || "BarBet"}
              </p>
              <p className="mt-1 text-sm text-text-secondary">Mesa {mesaCodigo} • bolao simbolico da rodada</p>
            </div>
            <div className="surface-raised flex items-center gap-2 px-3 py-2">
              <span className="text-xl leading-none">{avatar}</span>
              <div className="text-right">
                <p className="section-label">Conta</p>
                <p className="text-sm font-medium text-text-primary">{session?.apelido ?? "Visitante"}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        {!isEntryScreen && (
          <nav className="surface-card sticky bottom-0 mt-4 grid grid-cols-3 gap-2 p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPath.endsWith(`/${item.to}`) || (item.to === "apostas" && currentPath.endsWith("/meus-palpites"));

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                className={`flex flex-col items-center justify-center rounded-[16px] px-3 py-3 transition ${
                  active ? "bg-accent text-bg-base" : "text-text-secondary"
                }`}
                >
                  <Icon size={18} stroke={2} />
                  <span className={`mt-1 text-[12px] font-medium ${active ? "text-bg-base" : "text-text-secondary"}`}>
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
