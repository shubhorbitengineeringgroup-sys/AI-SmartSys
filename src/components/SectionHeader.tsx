interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
}

const SectionHeader = ({ badge, title, description }: SectionHeaderProps) => (
  <div className="text-center max-w-2xl mx-auto mb-20">
    {badge && (
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-widest mb-6 text-accent">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        {badge}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-heading font-bold text-foreground mb-5 leading-tight tracking-tight">{title}</h2>
    {description && <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>}
  </div>
);

export default SectionHeader;
