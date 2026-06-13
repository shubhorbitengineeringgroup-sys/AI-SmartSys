/** Decorative SVG patterns for tech sections */

export const CircuitPattern = ({ className = "" }: { className?: string }) => (
  <svg className={`absolute pointer-events-none opacity-[0.04] ${className}`} width="400" height="400" viewBox="0 0 400 400" fill="none">
    <circle cx="50" cy="50" r="4" fill="currentColor" />
    <circle cx="150" cy="50" r="4" fill="currentColor" />
    <circle cx="250" cy="150" r="4" fill="currentColor" />
    <circle cx="350" cy="50" r="4" fill="currentColor" />
    <circle cx="50" cy="200" r="4" fill="currentColor" />
    <circle cx="200" cy="300" r="4" fill="currentColor" />
    <circle cx="350" cy="350" r="4" fill="currentColor" />
    <circle cx="100" cy="350" r="4" fill="currentColor" />
    <line x1="54" y1="50" x2="146" y2="50" stroke="currentColor" strokeWidth="1" />
    <line x1="154" y1="50" x2="250" y2="150" stroke="currentColor" strokeWidth="1" />
    <line x1="254" y1="150" x2="346" y2="50" stroke="currentColor" strokeWidth="1" />
    <line x1="50" y1="54" x2="50" y2="196" stroke="currentColor" strokeWidth="1" />
    <line x1="50" y1="204" x2="196" y2="300" stroke="currentColor" strokeWidth="1" />
    <line x1="204" y1="300" x2="346" y2="350" stroke="currentColor" strokeWidth="1" />
    <line x1="104" y1="350" x2="196" y2="300" stroke="currentColor" strokeWidth="1" />
    <rect x="45" y="195" width="10" height="10" rx="2" fill="currentColor" />
    <rect x="245" y="145" width="10" height="10" rx="2" fill="currentColor" />
  </svg>
);

export const GridDots = ({ className = "" }: { className?: string }) => (
  <svg className={`absolute pointer-events-none opacity-[0.06] ${className}`} width="200" height="200" viewBox="0 0 200 200">
    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="currentColor" />
    </pattern>
    <rect width="200" height="200" fill="url(#dots)" />
  </svg>
);

export const GlowOrb = ({ className = "", color = "primary" }: { className?: string; color?: string }) => (
  <div className={`absolute rounded-full blur-3xl pointer-events-none ${
    color === "primary" ? "bg-primary/8" : color === "accent" ? "bg-accent/8" : "bg-secondary/6"
  } ${className}`} />
);

export const HexGrid = ({ className = "" }: { className?: string }) => (
  <svg className={`absolute pointer-events-none opacity-[0.03] ${className}`} width="300" height="260" viewBox="0 0 300 260">
    {[0, 1, 2, 3].map(row =>
      [0, 1, 2, 3].map(col => {
        const x = col * 75 + (row % 2 ? 37.5 : 0);
        const y = row * 65;
        return (
          <polygon
            key={`${row}-${col}`}
            points={`${x},${y + 20} ${x + 17},${y} ${x + 43},${y} ${x + 60},${y + 20} ${x + 43},${y + 40} ${x + 17},${y + 40}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        );
      })
    )}
  </svg>
);
