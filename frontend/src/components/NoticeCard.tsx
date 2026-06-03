import { IconShieldCheck } from "@tabler/icons-react";

export default function NoticeCard() {
  return (
    <div className="surface-card px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-accent-bg text-accent">
          <IconShieldCheck size={18} stroke={2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">Uso recreativo • +18</p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            O BarBet usa cervejas como pontuacao simbolica. Nao existe dinheiro real, saque ou pagamento.
          </p>
        </div>
      </div>
    </div>
  );
}
