interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-5 space-y-2">
      <div className="pill-accent">{eyebrow}</div>
      <div>
        <h1 className="screen-title">{title}</h1>
        <p className="screen-copy mt-2">{description}</p>
      </div>
    </div>
  );
}
