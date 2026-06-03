interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="surface-card px-4 py-4">
      <p className="section-label">{label}</p>
      <p className="mt-3 font-display text-[28px] font-semibold tracking-[-0.03em] text-text-primary">{value}</p>
      {hint && <p className="mt-2 text-xs leading-5 text-text-secondary">{hint}</p>}
    </div>
  );
}
