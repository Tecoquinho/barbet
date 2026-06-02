export default function NoticeCard() {
  return (
    <div className="panel-soft flex items-start gap-3 p-4 text-sm text-white/72">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-xs font-bold uppercase tracking-[0.16em] text-gold">
        18+
      </div>
      <div>
        <p className="font-semibold text-white">Uso recreativo e simbolico</p>
        <p className="mt-1 leading-6 text-white/62">
          BarBet usa cervejas como pontuacao social entre amigos. Nao ha dinheiro real, saque ou pagamento.
        </p>
      </div>
    </div>
  );
}
