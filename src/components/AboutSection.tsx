import { CheckCircle2, Target, Eye, Cpu, Cloud, Code, Sparkles, Activity, Layers, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import whyChooseTeamImg from "@/assets/images/why_choose_team.png";
import whyChooseTechImg from "@/assets/images/why_choose_tech.png";
import whyChooseSecurityImg from "@/assets/images/why_choose_security.png";
import whyChooseCustomerImg from "@/assets/images/why_choose_customer.png";

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 1200; // 1.2s duration
    const end = value;
    const increment = Math.max(1, Math.ceil(end / (duration / 25)));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [started, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

interface TiltCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  text: string;
  colorClass: string;
  bgClass: string;
  glowShadow: string;
  isActive: boolean;
  onClick: () => void;
}

const TiltBentoCard = ({ icon: Icon, title, text, colorClass, bgClass, glowShadow, isActive, onClick }: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate rotation angles (max 10 degrees tilt)
    const rX = -(mouseY / (height / 2)) * 10;
    const rY = (mouseX / (width / 2)) * 10;

    setRotateX(rX);
    setRotateY(rY);

    // Also update mouse position for glowing borders
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out, border-color 0.4s, background-color 0.4s",
      }}
      className={`glow-card p-10 rounded-[2.2rem] overflow-hidden flex flex-col items-center text-center cursor-pointer select-none group relative transition-all duration-300 ${
        isActive 
          ? "border-primary/50 shadow-2xl bg-card/20 shadow-primary/10 scale-[1.02]" 
          : "border-border/50 bg-card/30 hover:border-border"
      }`}
    >
      <div className="glow-card-bg" />
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
      )}
      <div 
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`} 
      />

      <div 
        style={{ transform: "translateZ(30px)" }}
        className={`h-16 w-16 rounded-[1.2rem] ${bgClass} flex items-center justify-center mb-8 border border-border/40 ${glowShadow} z-10 transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className={colorClass} size={32} />
      </div>

      <h4 
        style={{ transform: "translateZ(20px)" }}
        className="text-3xl font-extrabold mb-5 text-foreground z-10"
      >
        {title}
      </h4>

      <p 
        style={{ transform: "translateZ(10px)" }}
        className="text-muted-foreground leading-relaxed z-10 text-base flex-grow font-medium"
      >
        {text}
      </p>

      <div className="mt-8 text-[11px] font-mono text-primary/60 group-hover:text-primary transition-colors z-10 flex items-center gap-2 uppercase tracking-widest font-bold">
        <span>{isActive ? "➔ active diagram" : "➔ view flowchart"}</span>
      </div>
    </motion.div>
  );
};

const DIAGRAMS = [
  {
    title: "Mission Pipeline Flow",
    desc: "How we implement our mission: transforming client objectives into automated workflows.",
    nodes: [
      { label: "1. Objectives", detail: "Identify business blockages" },
      { label: "2. NLP Processor", detail: "Analyze logs & workflows" },
      { label: "3. Smart Automation", detail: "Generate custom tools" },
      { label: "4. Scaling", detail: "Increase operational volume" }
    ]
  },
  {
    title: "Vision Pipeline Flow",
    desc: "How we achieve our vision: engineering sector-wide adaptable models for enterprise automation.",
    nodes: [
      { label: "1. Data Ingestion", detail: "Secure raw file feeds" },
      { label: "2. ML Clustering", detail: "Align patterns and triggers" },
      { label: "3. Sector Engines", detail: "Configure domain adaptations" },
      { label: "4. Deployment", detail: "Deliver instant integrations" }
    ]
  },
  {
    title: "Philosophy Pipeline Flow",
    desc: "How we execute our philosophy: augmenting human workforce capacity through AI assistance.",
    nodes: [
      { label: "1. Human Input", detail: "Observe user patterns" },
      { label: "2. Cognitive Augment", detail: "Suggest actions in real-time" },
      { label: "3. Synergy", detail: "Integrate feedback loops" },
      { label: "4. Optimal Speed", detail: "Deliver maximum productivity" }
    ]
  }
];

const AboutSection = () => {
  const [activeDiagramIdx, setActiveDiagramIdx] = useState<number>(0);

  return (
    <section className="py-28 relative overflow-hidden bg-background/20">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Title */}
      <div className="container mx-auto px-4 text-center mb-20">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 text-foreground tracking-tight">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">AI SmartSyS</span>
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Building <span className="text-foreground font-medium">intelligent AI solutions</span> for modern businesses.
        </p>
      </div>

      {/* Company Introduction */}
      <div className="container mx-auto px-4 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-extrabold mb-8 text-foreground tracking-tight">
            Who We <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Are</span>
          </h3>
          <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-light">
            AI SmartSyS is a <span className="text-foreground font-medium">technology-driven company</span> focused on developing <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary font-medium">AI-powered solutions</span>,{" "}
            automation systems, and smart digital platforms to help businesses accelerate growth and efficiency.
          </p>
        </div>
      </div>

      {/* Bento Grid: Mission, Vision, Philosophy */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <TiltBentoCard
            icon={Target}
            title="Our Mission"
            text="To empower businesses globally with innovative AI and automation technologies that drive meaningful transformation."
            colorClass="text-primary"
            bgClass="bg-primary/10"
            glowShadow="shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            isActive={activeDiagramIdx === 0}
            onClick={() => setActiveDiagramIdx(0)}
          />

          <TiltBentoCard
            icon={Eye}
            title="Our Vision"
            text="To become the premier leading provider of AI-driven digital transformation solutions across diverse industries."
            colorClass="text-secondary"
            bgClass="bg-secondary/10"
            glowShadow="shadow-[0_0_15px_rgba(139,92,246,0.2)]"
            isActive={activeDiagramIdx === 1}
            onClick={() => setActiveDiagramIdx(1)}
          />

          <TiltBentoCard
            icon={Sparkles}
            title="Our Philosophy"
            text="We believe in creating intelligent, scalable systems that augment human capabilities rather than replace them."
            colorClass="text-accent"
            bgClass="bg-accent/10"
            glowShadow="shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            isActive={activeDiagramIdx === 2}
            onClick={() => setActiveDiagramIdx(2)}
          />
        </div>
      </div>

      {/* Interactive Flow Diagram Overlay */}
      <div className="container mx-auto px-4 mb-24 max-w-6xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDiagramIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-6xl mx-auto glass-card border border-border/60 bg-muted/10 p-8 md:p-12 rounded-[2.5rem] glow-cyan shadow-2xl relative overflow-hidden mt-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/40 pb-6 mb-8 select-none gap-2">
              <div>
                <h4 className="text-2xl font-black text-foreground font-mono tracking-tight">
                  {DIAGRAMS[activeDiagramIdx].title}
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  {DIAGRAMS[activeDiagramIdx].desc}
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full self-start md:self-center uppercase tracking-widest">
                OPERATIONAL PIPELINE
              </span>
            </div>

            {/* Pipeline flowchart */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4 max-w-5xl mx-auto">
              {DIAGRAMS[activeDiagramIdx].nodes.map((node, i) => {
                const isLast = i === DIAGRAMS[activeDiagramIdx].nodes.length - 1;
                return (
                  <div key={i} className="flex flex-col md:flex-row items-center flex-1 gap-6 w-full">
                    {/* Node block */}
                    <div className="bg-card/40 border border-border/50 rounded-[1.25rem] p-6 flex flex-col items-center md:items-start text-center md:text-left flex-grow w-full md:w-auto shadow-lg hover:border-primary/40 hover:bg-card/60 transition-all duration-300">
                      <span className="text-sm font-mono font-bold text-primary mb-2 uppercase tracking-wider">
                        {node.label}
                      </span>
                      <span className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {node.detail}
                      </span>
                    </div>

                    {/* Connecting line on desktop */}
                    {!isLast && (
                      <div className="w-12 h-px bg-primary/30 relative hidden md:block shrink-0">
                        <div 
                          className="w-2 h-2 rounded-full bg-accent absolute top-1/2 -translate-y-1/2 animate-ping"
                          style={{ left: '50%' }}
                        />
                      </div>
                    )}
                    
                    {/* Connecting arrow/line on mobile */}
                    {!isLast && (
                      <div className="h-8 w-px bg-primary/30 relative md:hidden shrink-0">
                        <div 
                          className="w-2 h-2 rounded-full bg-accent absolute left-1/2 -translate-x-1/2 animate-ping"
                          style={{ top: '50%' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stats Counter Section */}
      <div className="container mx-auto px-4 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto border-t border-foreground/10 pt-16">
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
              <Layers className="relative text-primary" size={48} />
            </div>
            <h4 className="text-5xl md:text-6xl font-black mb-3 tracking-tight text-foreground drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Counter value={150} suffix="+" />
            </h4>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-sm hidden md:block">Solutions Deployed</p>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.1em] text-sm md:hidden">Deployed</p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-secondary/30 blur-2xl rounded-full" />
              <Activity className="relative text-secondary" size={48} />
            </div>
            <h4 className="text-5xl md:text-6xl font-black mb-3 tracking-tight text-foreground drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Counter value={25} suffix="+" />
            </h4>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-sm hidden md:block">Industries Served</p>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.1em] text-sm md:hidden">Industries</p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-accent/30 blur-2xl rounded-full" />
              <Target className="relative text-accent" size={48} />
            </div>
            <h4 className="text-5xl md:text-6xl font-black mb-3 tracking-tight text-foreground drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Counter value={99} suffix=".9%" />
            </h4>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-sm hidden md:block">System Accuracy</p>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.1em] text-sm md:hidden">Accuracy</p>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="container mx-auto px-4 mb-24 text-center">
        <h3 className="text-3xl font-bold mb-12 text-foreground">Our Expertise</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
          {[
            { title: "AI Development", icon: Cpu, color: "text-primary", bg: "bg-primary/5" },
            { title: "Web Development", icon: Code, color: "text-secondary", bg: "bg-secondary/5" },
            { title: "Automation", icon: Sparkles, color: "text-accent", bg: "bg-accent/5" },
            { title: "Cloud & Server", icon: Cloud, color: "text-primary", bg: "bg-primary/5" },
            { title: "SCADA Solutions", icon: Cpu, color: "text-secondary", bg: "bg-secondary/5" },
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card backdrop-blur-md border border-border/50 rounded-2xl p-6 flex flex-col items-center transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-lg group"
            >
              <div className={`p-4 rounded-full ${service.bg} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <service.icon className={service.color} size={32} />
              </div>
              <h4 className="font-semibold text-foreground text-sm md:text-base">{service.title}</h4>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="container mx-auto px-4 mt-8 pb-12">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center text-foreground uppercase tracking-wider text-gradient-primary">
            Why Choose Us
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: "1200px" }}>
            {[
              {
                title: "Experienced & Specialized Team",
                desc: "Our senior engineers specialize in custom AI frameworks, responsive fullstack architectures, and creative UI/UX designs.",
                image: whyChooseTeamImg,
                glow: "shadow-[0_0_20px_rgba(6,182,212,0.15)] border-cyan-500/25",
                color: "text-cyan-400",
                hoverAnim: { scale: 1.03, y: -8, rotateY: 6 }
              },
              {
                title: "Modern & Scalable Technology",
                desc: "We deploy future-ready technologies like React, Next.js, Node, and state-of-the-art LLMs built to scale with your volume.",
                image: whyChooseTechImg,
                glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)] border-purple-500/25",
                color: "text-purple-400",
                hoverAnim: { scale: 1.03, y: -8, rotateX: -6 }
              },
              {
                title: "Reliable & Secure Solutions",
                desc: "Security is foundational. We integrate enterprise-grade encryption, secure db nodes, and guarantee high availability.",
                image: whyChooseSecurityImg,
                glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)] border-emerald-500/25",
                color: "text-emerald-400",
                hoverAnim: { scale: 1.03, y: -8, rotate: 1.5 }
              },
              {
                title: "Customer Focused Approach",
                desc: "We align directly with your growth vision through weekly iterations, rapid agile updates, and transparent sync cycles.",
                image: whyChooseCustomerImg,
                glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)] border-amber-500/25",
                color: "text-amber-400",
                hoverAnim: { 
                  y: -10, 
                  scale: 1.03,
                  transition: { y: { repeat: Infinity, repeatType: "mirror", duration: 1.6, ease: "easeInOut" } } 
                }
              }
            ].map((item, index) => {
              // Different spring entrance physics for "alag alag animations"
              const getEntranceProps = (idx: number) => {
                switch(idx) {
                  case 0:
                    return {
                      initial: { opacity: 0, y: 45 },
                      whileInView: { opacity: 1, y: 0 },
                      transition: { type: "spring", stiffness: 110, damping: 12, delay: 0.05 }
                    };
                  case 1:
                    return {
                      initial: { opacity: 0, x: 45 },
                      whileInView: { opacity: 1, x: 0 },
                      transition: { type: "spring", stiffness: 100, damping: 14, delay: 0.15 }
                    };
                  case 2:
                    return {
                      initial: { opacity: 0, scale: 0.92, rotate: -2 },
                      whileInView: { opacity: 1, scale: 1, rotate: 0 },
                      transition: { type: "spring", stiffness: 115, damping: 10, delay: 0.25 }
                    };
                  case 3:
                    return {
                      initial: { opacity: 0, y: -45 },
                      whileInView: { opacity: 1, y: 0 },
                      transition: { type: "spring", stiffness: 95, damping: 15, delay: 0.35 }
                    };
                  default:
                    return {};
                }
              };

              const entranceProps = getEntranceProps(index);

              return (
                <motion.div
                  key={index}
                  {...entranceProps}
                  viewport={{ once: true }}
                  whileHover={item.hoverAnim}
                  className={`flex flex-col sm:flex-row gap-5 p-5 rounded-[2rem] bg-card/60 border backdrop-blur-md transition-all duration-500 shadow-xl group cursor-pointer ${item.glow}`}
                >
                  {/* Glassmorphic Illustration frame */}
                  <div className="relative w-full sm:w-[130px] aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-slate-950/60 border border-white/5 shrink-0 flex items-center justify-center">
                    {/* Pulsing light source */}
                    <div 
                      className="absolute w-20 h-20 rounded-full blur-[25px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle, ${item.glow.includes("6,182,212") ? "#06b6d4" : item.glow.includes("168,85,247") ? "#a855f7" : item.glow.includes("16,185,129") ? "#10b981" : "#f59e0b"} 0%, transparent 70%)`
                      }}
                    />
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Scanner scanline filters overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />
                  </div>

                  {/* Content details */}
                  <div className="flex flex-col justify-center text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className={`${item.color} shrink-0 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]`} size={20} />
                      <h4 className="text-base font-bold text-foreground font-heading leading-snug group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
