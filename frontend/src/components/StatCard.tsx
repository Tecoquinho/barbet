interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="glass-panel stat-panel p-4">
      <p className="tiny-label">{label}</p>
      <p className="mt-3 font-display text-3xl font-bold text-gold">{value}</p>
      {hint && <p className="mt-2 text-xs text-white/48">{hint}</p>}
    </div>
  );
}
