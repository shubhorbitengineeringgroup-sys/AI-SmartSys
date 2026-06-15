import { Star, StarHalf, Quote } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { GlowOrb } from "./TechPattern";
import { useStaggerReveal } from "@/hooks/useScrollReveal";

// Premium Flat Character Avatars (Indian Males, Professional, Vector Style)
const ShreeContractorAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="shreeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    {/* Background Circle */}
    <circle cx="50" cy="50" r="48" fill="url(#shreeGrad)" />
    
    {/* Neck */}
    <rect x="45" y="62" width="10" height="15" fill="#D29960" rx="2" />
    
    {/* Shoulders & Suit/Collar */}
    <path d="M25 88 C25 74, 75 74, 75 88 Z" fill="#1e293b" />
    <path d="M42 74 L50 84 L58 74" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
    
    {/* Ears */}
    <circle cx="31" cy="48" r="5" fill="#D29960" />
    <circle cx="69" cy="48" r="5" fill="#D29960" />
    
    {/* Face */}
    <circle cx="50" cy="48" r="18" fill="#E2A76F" />
    
    {/* Hair (Smart Professional Cut) */}
    <path d="M31 42 C30 28, 42 22, 50 24 C58 22, 70 28, 69 42 C65 39, 58 37, 50 37 C42 37, 35 39, 31 42" fill="#0f172a" />
    
    {/* Eyebrows */}
    <path d="M38 41 Q43 39 46 41" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
    <path d="M54 41 Q57 39 62 41" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

    {/* Eyes */}
    <circle cx="42" cy="45" r="2" fill="#0f172a" />
    <circle cx="58" cy="45" r="2" fill="#0f172a" />
    
    {/* Glasses (Mature Professional Look) */}
    <rect x="36" y="41" width="12" height="9" rx="2" fill="none" stroke="#f59e0b" strokeWidth="2" />
    <rect x="52" y="41" width="12" height="9" rx="2" fill="none" stroke="#f59e0b" strokeWidth="2" />
    <line x1="48" y1="45" x2="52" y2="45" stroke="#f59e0b" strokeWidth="2" />

    {/* Nose */}
    <path d="M49 45 L48 53 L52 53 Z" fill="#C58A52" />
    
    {/* Mouth */}
    <path d="M45 58 Q50 62 55 58" fill="none" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const LokeshPariharAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="lokeshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#14b8a6" />
      </linearGradient>
    </defs>
    {/* Background Circle */}
    <circle cx="50" cy="50" r="48" fill="url(#lokeshGrad)" />
    
    {/* Neck */}
    <rect x="45" y="62" width="10" height="15" fill="#F3D1B0" rx="2" />
    
    {/* Shoulders & Shirt */}
    <path d="M25 88 C25 74, 75 74, 75 88 Z" fill="#334155" />
    <path d="M41 74 L50 83 L59 74" fill="none" stroke="#f1f5f9" strokeWidth="2.5" />
    
    {/* Ears */}
    <circle cx="31" cy="48" r="5" fill="#F5DDB6" />
    <circle cx="69" cy="48" r="5" fill="#F5DDB6" />
    
    {/* Face (Fair Skin Tone) */}
    <circle cx="50" cy="48" r="18" fill="#FCE5CD" />
    
    {/* Hair (Spikey Modern Cut) */}
    <path d="M30 40 C28 26, 38 18, 50 18 C62 18, 72 26, 70 40 C66 36, 58 35, 50 35 C42 35, 34 36, 30 40" fill="#2d1c18" />
    <path d="M45 18 L50 12 L55 18" fill="#2d1c18" />
    
    {/* Eyebrows */}
    <path d="M38 41 Q43 39 46 41" fill="none" stroke="#2d1c18" strokeWidth="2" strokeLinecap="round" />
    <path d="M54 41 Q57 39 62 41" fill="none" stroke="#2d1c18" strokeWidth="2" strokeLinecap="round" />

    {/* Eyes */}
    <circle cx="42" cy="45" r="2" fill="#2d1c18" />
    <circle cx="58" cy="45" r="2" fill="#2d1c18" />
    
    {/* Nose */}
    <path d="M49 45 L48 53 L52 53 Z" fill="#E8C39E" />
    
    {/* Mouth */}
    <path d="M45 58 Q50 62 55 58" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const UmaShankarAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="umaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    {/* Background Circle */}
    <circle cx="50" cy="50" r="48" fill="url(#umaGrad)" />
    
    {/* Neck */}
    <rect x="45" y="62" width="10" height="15" fill="#D39D6C" rx="2" />
    
    {/* Shoulders & Shirt */}
    <path d="M25 88 C25 74, 75 74, 75 88 Z" fill="#1e3a8a" />
    <path d="M41 74 L50 82 L59 74" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
    
    {/* Ears */}
    <circle cx="31" cy="48" r="5" fill="#D39D6C" />
    <circle cx="69" cy="48" r="5" fill="#D39D6C" />
    
    {/* Face (Wheatish Skin Tone) */}
    <circle cx="50" cy="48" r="18" fill="#E6AE7D" />
    
    {/* Hair (Side-parted classic) */}
    <path d="M31 40 C30 27, 40 22, 52 23 C62 23, 70 28, 69 40 C65 37, 56 36, 48 37 C40 38, 35 38, 31 40" fill="#111827" />
    
    {/* Eyebrows */}
    <path d="M38 41 Q43 39 46 41" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
    <path d="M54 41 Q57 39 62 41" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" />

    {/* Eyes */}
    <circle cx="42" cy="45" r="2.5" fill="#111827" />
    <circle cx="58" cy="45" r="2.5" fill="#111827" />
    
    {/* Nose */}
    <path d="M49 45 L48 53 L52 53 Z" fill="#C58A52" />
    
    {/* Mouth */}
    <path d="M45 58 Q50 62 55 58" fill="none" stroke="#be123c" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SanjaySinghAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="sanjayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>
    </defs>
    {/* Background Circle */}
    <circle cx="50" cy="50" r="48" fill="url(#sanjayGrad)" />
    
    {/* Neck */}
    <rect x="45" y="62" width="10" height="15" fill="#C68F5A" rx="2" />
    
    {/* Shoulders & Shirt */}
    <path d="M25 88 C25 74, 75 74, 75 88 Z" fill="#7c2d12" />
    <path d="M41 74 L50 82 L59 74" fill="none" stroke="#fb923c" strokeWidth="2.5" />
    
    {/* Ears */}
    <circle cx="31" cy="48" r="5" fill="#C68F5A" />
    <circle cx="69" cy="48" r="5" fill="#C68F5A" />
    
    {/* Face */}
    <circle cx="50" cy="48" r="18" fill="#DA9E64" />
    
    {/* Beard & Mustache */}
    <path d="M32 48 C34 58, 38 64, 50 64 C62 64, 66 58, 68 48 C65 52, 58 54, 50 54 C42 54, 35 52, 32 48" fill="#1e293b" />
    <path d="M42 52 Q50 49 58 52" fill="none" stroke="#1e293b" strokeWidth="2" />
    
    {/* Hair */}
    <path d="M31 40 C30 27, 40 22, 50 23 C60 22, 70 27, 69 40 C65 37, 58 36, 50 36 C42 36, 35 37, 31 40" fill="#1e293b" />
    
    {/* Eyebrows */}
    <path d="M38 41 Q43 39 46 41" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
    <path d="M54 41 Q57 39 62 41" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

    {/* Eyes */}
    <circle cx="42" cy="45" r="2" fill="#1e293b" />
    <circle cx="58" cy="45" r="2" fill="#1e293b" />
    
    {/* Nose */}
    <path d="M49 45 L48 53 L52 53 Z" fill="#B27845" />
    
    {/* Mouth */}
    <path d="M45 58 Q50 61 55 58" fill="none" stroke="#9f1239" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const getAvatarComponent = (name: string) => {
  switch (name) {
    case "Shree Contractor":
      return <ShreeContractorAvatar />;
    case "Lokesh Parihar":
      return <LokeshPariharAvatar />;
    case "Uma Shankar":
      return <UmaShankarAvatar />;
    case "Sanjay Singh":
      return <SanjaySinghAvatar />;
    default:
      return null;
  }
};

const testimonials = [
  {
    name: "Shree Contractor",
    product: "SCADA Systems UI",
    text: "AI SmartSyS built the absolute best SCADA UI for our industrial control room. The visual telemetry flow and real-time monitoring graphs are top-notch. Truly exceptional UI/UX development!",
    rating: 5,
    topBar: "from-cyan-500 to-blue-500",
    borderHover: "hover:border-cyan-500/50",
    shadowHover: "hover:shadow-cyan-500/20 dark:hover:shadow-cyan-500/10",
    iconColor: "text-cyan-500 dark:text-cyan-400",
    badgeBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
  },
  {
    name: "Lokesh Parihar",
    product: "Inventory Management",
    text: "Very pleased with the custom Inventory Management portal they delivered. It has made tracking our warehouse stocks and automating purchase orders incredibly simple. Highly professional work!",
    rating: 4.5,
    topBar: "from-emerald-400 to-teal-500",
    borderHover: "hover:border-emerald-500/50",
    shadowHover: "hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
  },
  {
    name: "Uma Shankar",
    product: "Attendance System",
    text: "The automated Attendance System they integrated is solid and reliable. It syncs perfectly with our biometric devices and has simplified our monthly payroll operations a lot.",
    rating: 4,
    topBar: "from-indigo-500 to-purple-500",
    borderHover: "hover:border-indigo-500/50",
    shadowHover: "hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/10",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
  },
  {
    name: "Sanjay Singh",
    product: "Astrology System",
    text: "Great job developing our Astrology portal. The chart-generation algorithms are fast, and the daily horoscopes dashboard has significantly increased our daily active users.",
    rating: 4,
    topBar: "from-pink-500 to-rose-500",
    borderHover: "hover:border-pink-500/50",
    shadowHover: "hover:shadow-pink-500/20 dark:hover:shadow-pink-500/10",
    iconColor: "text-pink-500 dark:text-pink-400",
    badgeBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20"
  },
];

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<Star key={i} size={14} className="fill-accent text-accent" />);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(<StarHalf key={i} size={14} className="fill-accent text-accent" />);
    } else {
      stars.push(<Star key={i} size={14} className="text-accent/30" />);
    }
  }
  return stars;
};

const TestimonialsSection = () => {
  const { ref, isVisible, getDelay } = useStaggerReveal(testimonials.length, 120);

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background Video */}
      <div className="video-container opacity-10">
        <video autoPlay muted loop playsInline>
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-modern-network-loop-24708-large.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]" />

      <GlowOrb className="w-[400px] h-[400px] top-0 -right-40" color="accent" />

      <div className="container mx-auto relative z-10" ref={ref}>
        <SectionHeader badge="Testimonials" title="What Our Clients Say" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`relative p-8 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden flex flex-col justify-between h-full ${t.borderHover} ${t.shadowHover} ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={getDelay(i)}
            >
              {/* Top accent gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${t.topBar}`} />
              
              {/* Background radial glow */}
              <div className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-[0.08] dark:opacity-[0.12] bg-gradient-to-br ${t.topBar} pointer-events-none`} />

              <div className="relative z-10">
                <Quote size={48} className={`absolute -top-3 -left-3 opacity-[0.08] ${t.iconColor}`} />
                <div className="flex justify-between items-center mb-5 gap-2 flex-wrap relative z-10">
                  <div className="flex gap-0.5">
                    {renderStars(t.rating)}
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${t.badgeBg}`}>
                    {t.product}
                  </span>
                </div>
                <p className="text-muted-foreground dark:text-slate-300 text-sm leading-relaxed mb-8 italic relative z-10">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-4 mt-6 relative z-10">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-md bg-slate-100/50 dark:bg-slate-800/80">
                  {getAvatarComponent(t.name)}
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground text-sm tracking-wide">{t.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
