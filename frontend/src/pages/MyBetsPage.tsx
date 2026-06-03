import { IconBeer, IconClockHour4, IconRosetteDiscountCheck, IconX } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import NoticeCard from "../components/NoticeCard";
import SectionHeader from "../components/SectionHeader";
import StatCard from "../components/StatCard";
import { useRequireSession } from "../hooks/useRequireSession";
import { getCustomerBets } from "../services/clientService";
import { Bet } from "../types/api";

function resolveStatus(bet: Bet) {
  if (bet.status === "OPEN" || bet.status === "CLOSED") {
    return {
      label: "Pendente",
      tone: "text-accent",
      bg: "bg-accent-bg",
      icon: IconClockHour4,
    };
  }

  if ((bet.saldoLiquidoCervejas ?? 0) >= 0) {
    return {
      label: "Ganhou",
      tone: "text-green",
      bg: "bg-green-bg",
      icon: IconRosetteDiscountCheck,
    };
  }

  return {
    label: "Perdeu",
    tone: "text-red",
    bg: "bg-red/10",
    icon: IconX,
  };
}

export default function MyBetsPage() {
  const session = useRequireSession();
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    if (!session) return;
    getCustomerBets(session.customerId).then(setBets);
  }, [session]);

  const summary = useMemo(() => {
    return bets.reduce(
      (acc, bet) => {
        acc.total += bet.quantidadeCervejas;
        acc.saldo += bet.saldoLiquidoCervejas ?? 0;
        return acc;
      },
      { total: 0, saldo: 0 }
    );
  }, [bets]);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Apostas"
        title="Apostas da mesa"
        description="Veja os bilhetes ativos e o resultado de cada jogo sem sair do clima da rodada."
      />

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Bilhetes" value={bets.length} hint="Criados por voce" />
        <StatCard label="Saldo" value={`${summary.saldo.toFixed(1)}🍺`} hint={`${summary.total} cervejas apostadas`} />
      </div>

      <div className="space-y-3">
        {bets.length === 0 && <div className="surface-card px-4 py-5 text-sm text-text-secondary">Nenhuma aposta ainda.</div>}
        {bets.map((bet) => {
          const status = resolveStatus(bet);
          const StatusIcon = status.icon;

          return (
            <div key={bet.id} className="surface-card px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="section-label">{bet.timeA} x {bet.timeB}</p>
                  <p className="mt-2 text-base font-medium text-text-primary">{bet.vencedorEscolhido.replace("TEAM_", "Time ")}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Placar: {bet.placarTimeA ?? "-"} x {bet.placarTimeB ?? "-"}
                  </p>
                </div>
                <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status.tone} ${status.bg}`}>
                  <StatusIcon size={14} />
                  {status.label}
                </div>
              </div>

              <div className="mt-4 divider-line" />

              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="section-label">Entrada</p>
                  <p className="mt-1 flex items-center gap-1 text-text-primary">
                    <IconBeer size={16} className="text-accent" />
                    {bet.quantidadeCervejas}
                  </p>
                </div>
                <div>
                  <p className="section-label">Premio</p>
                  <p className="mt-1 text-text-primary">{(bet.premioCervejas ?? 0).toFixed(1)}🍺</p>
                </div>
                <div>
                  <p className="section-label">Saldo</p>
                  <p className={`mt-1 font-medium ${(bet.saldoLiquidoCervejas ?? 0) >= 0 ? "text-green" : "text-red"}`}>
                    {(bet.saldoLiquidoCervejas ?? 0).toFixed(1)}🍺
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <NoticeCard />
    </div>
  );
}
