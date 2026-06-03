import {
  IconBattery2,
  IconBeer,
  IconSoccerField,
  IconTicket,
  IconTrophy,
  IconWifi,
} from "@tabler/icons-react";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useSessionStore } from "../stores/sessionStore";

const navItems = [
  { to: "jogos", label: "Jogos", icon: IconSoccerField },
  { to: "apostas", label: "Apostas", icon: IconTicket },
  { to: "placar", label: "Placar", icon: IconTrophy },
];

function getSavedAvatar(customerId?: number) {
  if (!customerId) return "🍺";
  return localStorage.getItem(`barbet-avatar-${customerId}`) ?? "🍺";
}

function getCurrentTimeLabel() {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
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

  const isEntryScreen = location.pathname === `/bar/${barSlug}/mesa/${mesaCodigo}` || location.pathname.endsWith("/entrada");
  const avatar = getSavedAvatar(session?.customerId);
  return (
    <div className="page-bg">
      <div className="phone-frame">
        <div className="status-bar">
          <span>{getCurrentTimeLabel()}</span>
          <div className="status-icons">
            <IconWifi size={13} stroke={2} />
            <IconBattery2 size={13} stroke={2} />
          </div>
        </div>

        <div className="screen">
          {!isEntryScreen && (
            <div className="top-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="avatar">{avatar}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e6edf3" }}>
                    {session?.apelido ?? "Visitante"}
                  </div>
                  <div style={{ fontSize: 10, color: "#8b949e" }}>
                    Mesa {mesaCodigo} · {barLabel || "BarBet"}
                  </div>
                </div>
              </div>
              <div className="saldo-pill">
                <IconBeer size={14} stroke={2} />
                <span>Pool</span>
              </div>
            </div>
          )}

          <Outlet />
        </div>

        {!isEntryScreen && (
          <div className="bottom-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                location.pathname.endsWith(`/${item.to}`) ||
                (item.to === "apostas" && location.pathname.endsWith("/meus-palpites"));

              return (
                <NavLink key={item.to} to={item.to} className={`bnav-item ${active ? "active" : ""}`}>
                  <div style={{ position: "relative" }}>
                    <Icon size={20} stroke={1.8} />
                  </div>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
