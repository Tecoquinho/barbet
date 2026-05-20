interface StatCardProps {
  label: string;
  value: string | number;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="glass-panel p-4">
      <p className="text-sm text-white/60">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-gold">{value}</p>
    </div>
  );
}
