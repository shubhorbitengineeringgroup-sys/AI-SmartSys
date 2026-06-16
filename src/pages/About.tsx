import { useEffect, useState, useRef } from "react";
import Footer from "@/components/Footer";
import { CheckCircle2, Target, Eye, Cpu, Cloud, Code, Sparkles, Activity, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "@/components/SEO";

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
  icon: React.ComponentType<any>;
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

    const rX = -(mouseY / (height / 2)) * 10;
    const rY = (mouseX / (width / 2)) * 10;

    setRotateX(rX);
    setRotateY(rY);

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
      className={`glow-card p-8 rounded-3xl overflow-hidden flex flex-col items-center text-center cursor-pointer select-none group relative transition-all duration-300 ${
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
        className={`h-14 w-14 rounded-2xl ${bgClass} flex items-center justify-center mb-6 border border-white/10 ${glowShadow} z-10 transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className={colorClass} size={28} />
      </div>

      <h4 
        style={{ transform: "translateZ(20px)" }}
        className="text-2xl font-bold mb-4 text-foreground z-10"
      >
        {title}
      </h4>

      <p 
        style={{ transform: "translateZ(10px)" }}
        className="text-muted-foreground leading-relaxed z-10 text-sm flex-grow"
      >
        {text}
      </p>

      <div className="mt-6 text-[10px] font-mono text-primary/60 group-hover:text-primary transition-colors z-10 flex items-center gap-1.5 uppercase tracking-widest font-bold">
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

const About = () => {
  const [activeDiagramIdx, setActiveDiagramIdx] = useState<number>(0);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEO 
        title="About Us | AI-SmartSys Team & Mission" 
        description="Learn about AI-SmartSys, a leading provider of intelligent AI software, industrial SCADA automation, and robust enterprise development tools. Meet our goals and engineering principles."
        keywords="about AI SmartSys, AI engineering, automation team, smart technology company India, machine learning solutions providers"
      />
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-secondary/20 rounded-full blur-[150px] opacity-70" />
      </div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10">
        
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-foreground tracking-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">AI SmartSyS</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Building <span className="text-foreground font-medium">intelligent AI solutions</span> for modern businesses.
            </p>
          </div>
        </section>

        {/* Company Introduction */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-foreground tracking-tight">
                Who We <span className="text-gradient-primary">Are</span>
              </h2>
              <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-light">
                AI SmartSyS is a <span className="text-foreground font-medium">technology-driven company</span> focused on developing <span className="text-gradient-accent font-medium">AI-powered solutions</span>, 
                automation systems, and smart digital platforms to help businesses accelerate growth and efficiency.
              </p>
            </div>
          </div>
        </section>

        {/* Bento Grid: Mission, Vision, Philosophy */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
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
        </section>

        {/* Interactive Flow Diagram Overlay */}
        <section className="pb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDiagramIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full glass-card border-white/5 bg-slate-950/20 p-6 md:p-8 rounded-3xl glow-cyan"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 mb-6 select-none gap-2">
                  <div>
                    <h4 className="text-lg font-bold text-foreground font-mono">
                      {DIAGRAMS[activeDiagramIdx].title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {DIAGRAMS[activeDiagramIdx].desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full self-start md:self-center">
                    OPERATIONAL PIPELINE
                  </span>
                </div>

                {/* Pipeline flowchart */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 max-w-4xl mx-auto">
                  {DIAGRAMS[activeDiagramIdx].nodes.map((node, i) => {
                    const isLast = i === DIAGRAMS[activeDiagramIdx].nodes.length - 1;
                    return (
                      <div key={i} className="flex flex-col md:flex-row items-center flex-1 gap-4 w-full">
                        {/* Node block */}
                        <div className="bg-card/10 border border-white/5 rounded-2xl p-4 flex flex-col items-center md:items-start text-center md:text-left flex-grow w-full md:w-auto shadow-md">
                          <span className="text-xs font-mono font-bold text-primary mb-1">
                            {node.label}
                          </span>
                          <span className="text-xs text-muted-foreground leading-relaxed">
                            {node.detail}
                          </span>
                        </div>

                        {/* Connecting line on desktop */}
                        {!isLast && (
                          <div className="w-8 h-px bg-primary/30 relative hidden md:block shrink-0">
                            <div 
                              className="w-1.5 h-1.5 rounded-full bg-accent absolute top-1/2 -translate-y-1/2 animate-ping"
                              style={{ left: '50%' }}
                            />
                          </div>
                        )}
                        
                        {/* Connecting arrow/line on mobile */}
                        {!isLast && (
                          <div className="h-6 w-px bg-primary/30 relative md:hidden shrink-0">
                            <div 
                              className="w-1.5 h-1.5 rounded-full bg-accent absolute left-1/2 -translate-x-1/2 animate-ping"
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
        </section>

        {/* Stats Counter Section */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto border-t border-white/10 pt-16">
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full" />
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
                  <div className="absolute inset-0 bg-secondary/40 blur-2xl rounded-full" />
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
                  <div className="absolute inset-0 bg-accent/40 blur-2xl rounded-full" />
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
        </section>

        {/* Services Overview */}
        <section className="pb-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12 text-foreground">Our Expertise</h2>
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
                  className="bg-card backdrop-blur-md border border-border/50 rounded-2xl p-6 flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg group"
                >
                  <div className={`p-4 rounded-full ${service.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={service.color} size={32} />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm md:text-base">{service.title}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="pb-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Why Choose Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  "Experienced & Specialized Team",
                  "Modern & Scalable Technology",
                  "Reliable & Secure Solutions",
                  "Customer Focused Approach"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 backdrop-blur-sm hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 shadow-sm"
                  >
                    <CheckCircle2 className="text-primary shrink-0 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" size={24} />
                    <span className="text-lg font-medium text-foreground/90">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default About;
