interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-full border border-gold/15 bg-gold/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
        {eyebrow}
      </div>
      <div className="space-y-2">
        <h1 className="max-w-[14ch] font-display text-[2rem] font-bold leading-tight text-white">
          {title}
        </h1>
        <p className="max-w-[36ch] text-sm leading-6 text-white/68">{description}</p>
      </div>
    </div>
  );
}
