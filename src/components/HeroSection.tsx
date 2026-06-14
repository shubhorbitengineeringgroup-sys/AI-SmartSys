import { Button } from "@/components/ui/button";
import { GlowOrb } from "./TechPattern";
import { ArrowRight, Terminal, RefreshCw, Cpu, Layers, Sparkles, Zap, BrainCircuit, Shield } from "lucide-react";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import heroNeural from "@/assets/images/hero-neural.png";
import heroBrain from "@/assets/images/hero-brain.png";
import heroData from "@/assets/images/hero-data.png";
import heroAutomation from "@/assets/images/hero-automation.png";
import modernAiBg from "@/assets/images/modern-ai-bg.png";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// ─── Floating Particles Component ───
const FloatingParticles = memo(() => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particles = Array.from({ length: isMobile ? 6 : 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.id % 3 === 0
              ? 'hsl(199, 89%, 55%)'
              : p.id % 3 === 1
              ? 'hsl(263, 70%, 60%)'
              : 'hsl(190, 95%, 48%)',
            boxShadow: `0 0 ${p.size * 3}px ${p.size}px ${p.id % 3 === 0 ? 'hsla(199, 89%, 55%, 0.3)' : p.id % 3 === 1 ? 'hsla(263, 70%, 50%, 0.3)' : 'hsla(190, 95%, 48%, 0.3)'}`,
          }}
          animate={{
            y: [0, -40, 10, -30, 0],
            x: [0, 20, -15, 25, 0],
            opacity: [p.opacity, p.opacity + 0.3, p.opacity, p.opacity + 0.2, p.opacity],
            scale: [1, 1.3, 0.8, 1.1, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});
FloatingParticles.displayName = 'FloatingParticles';

// ─── Animated Counter Component ───
const AnimatedCounter = ({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = Date.now();
          const step = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-heading font-bold text-shimmer">
        {count}{suffix}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground mt-1 font-medium tracking-wide uppercase">
        {label}
      </div>
    </div>
  );
};

// ─── Floating Tech Badge ───
const FloatingBadge = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    className={`absolute px-3 py-1.5 rounded-full glass text-[10px] font-bold uppercase tracking-wider text-foreground/80 border border-primary/20 backdrop-blur-xl select-none z-20 ${className}`}
    animate={{
      y: [0, -10, 5, -8, 0],
      rotate: [0, 2, -1, 1, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

// ─── Word-by-word text reveal ───
const WordReveal = ({ text, className, gradient = false }: { text: string; className?: string; gradient?: boolean }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={`inline-block mr-[0.3em] ${gradient ? 'text-shimmer' : ''}`}
          initial={{ opacity: 0, y: 30, rotateX: -60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3 + i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// ═══════════════════════════════════════
// ─── MAIN HERO SECTION ───────────────
// ═══════════════════════════════════════
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Command prompt states
  const [promptText, setPromptText] = useState("");
  const [activePrompt, setActivePrompt] = useState<number | null>(null);
  const [isTypingPrompt, setIsTypingPrompt] = useState(false);

  // Fanning deck state
  const [isStackHovered, setIsStackHovered] = useState(false);

  // Mouse tracking for spotlight
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  }, [mouseX, mouseY]);

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, 80]);
  const opacityFade = useTransform(scrollY, [0, 500], [1, 0.3]);
  const bgScale = useTransform(scrollY, [0, 600], [1, 1.15]);

  const slides = [
    { image: modernAiBg, title: "Advanced AI Smart Systems" },
    { image: heroNeural, title: "AI Neural Network" },
    { image: heroBrain, title: "Artificial Intelligence Brain" },
    { image: heroData, title: "Digital Data Visualization" },
    { image: heroAutomation, title: "AI Powered Automation" }
  ];

  const PROMPTS = [
    { label: "Analyze Data", cmd: "run --mode=analytics --verbose", slide: 3, icon: Zap },
    { label: "Deploy NLP Bot", cmd: "deploy --agent=chatbot --cluster=node-5", slide: 1, icon: BrainCircuit },
    { label: "SCADA Connect", cmd: "connect --scada --site=burhar", slide: 4, icon: Shield }
  ];

  useEffect(() => {
    if (isTypingPrompt) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isTypingPrompt, slides.length]);

  const runPrompt = (idx: number) => {
    if (isTypingPrompt) return;
    setIsTypingPrompt(true);
    setActivePrompt(idx);
    const cmd = PROMPTS[idx].cmd;
    let currentText = "";
    let charIdx = 0;
    setPromptText("");

    const typeInterval = setInterval(() => {
      if (charIdx < cmd.length) {
        currentText += cmd[charIdx];
        setPromptText(currentText);
        charIdx++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setIsTypingPrompt(false);
          setCurrentSlide(PROMPTS[idx].slide);
          setActivePrompt(null);
        }, 300);
      }
    }, 25);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) navigate("/dashboard");
    else setIsAuthModalOpen(true);
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  // 3D Card Stack visual calculator
  const getCardStyle = (cardIndex: number) => {
    const frontIndex = currentSlide % 3;

    const isActive = frontIndex === cardIndex;
    let zIndex = 10, scale = 0.85, rotate = 0, x = 0, y = 0;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const xMult = isMobile ? 0.6 : 1;
    const yMult = isMobile ? 0.6 : 1;

    if (isActive) {
      zIndex = 30; scale = 1.04; rotate = 0; x = 0; y = 0;
    } else if (cardIndex === 0) {
      zIndex = frontIndex === 1 ? 20 : 10;
      scale = frontIndex === 1 ? 0.92 : 0.85;
      rotate = -8; x = (isStackHovered ? -120 : -50) * xMult; y = (isStackHovered ? -40 : -15) * yMult;
    } else if (cardIndex === 1) {
      zIndex = frontIndex === 0 ? 20 : 10;
      scale = frontIndex === 0 ? 0.92 : 0.85;
      rotate = 8; x = (isStackHovered ? 120 : 50) * xMult; y = (isStackHovered ? 50 : 20) * yMult;
    } else {
      zIndex = frontIndex === 0 ? 10 : 20;
      scale = frontIndex === 0 ? 0.85 : 0.92;
      rotate = -12; x = (isStackHovered ? -60 : -25) * xMult; y = (isStackHovered ? 100 : 40) * yMult;
    }

    return { zIndex, scale, x, y, rotate, opacity: isActive ? 1 : 0.4 };
  };

  const cardData = [
    { img: heroBrain, label: "COGNITIVE CORE", icon: Cpu, color: "text-primary" },
    { img: heroData, label: "DATA SPHERE", icon: Layers, color: "text-accent" },
    { img: heroAutomation, label: "AUTOMATION ENGINE", icon: Terminal, color: "text-secondary" },
  ];

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
    >
      {/* ── Layer 1: Background Video ── */}
      <div className="video-container">
        <video autoPlay muted loop playsInline className="opacity-30">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-blue-connection-cloud-23000-large.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay" />
      </div>

      {/* ── Layer 2: Animated Gradient Mesh ── */}
      <div className="absolute inset-0 z-[1] hero-gradient-mesh" />

      {/* ── Layer 3: Slide Image (subtle) ── */}
      <motion.div className="absolute inset-0 z-[1]" style={{ scale: bgScale }}>
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.08, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/30" />
      </motion.div>

      {/* ── Layer 4: Mouse-following Spotlight ── */}
      <motion.div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: useTransform(
            [smoothX, smoothY],
            ([x, y]) => `radial-gradient(700px circle at ${x}% ${y}%, hsla(199, 89%, 55%, 0.05), transparent 50%)`
          ),
        }}
      />

      {/* ── Layer 5: Floating Particles ── */}
      <FloatingParticles />

      {/* ── Layer 6: Glow Orbs ── */}
      <GlowOrb className="w-[700px] h-[700px] top-1/4 -left-60 animate-float z-[2]" color="primary" />
      <GlowOrb className="w-[800px] h-[800px] bottom-1/4 -right-60 animate-float z-[2]" color="secondary" />

      {/* Morphing Blob Decoration */}
      <div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] opacity-[0.04] z-[2] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, hsl(199, 89%, 55%), hsl(263, 70%, 50%))',
          animation: 'morphBlob 12s ease-in-out infinite',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        }}
      />

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-32 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-12 xl:gap-16 items-center">

          {/* ─── LEFT COLUMN ─── */}
          <div className="lg:col-span-7 flex flex-col items-start">

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass text-sm text-accent mb-8 group cursor-default"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
              </span>
              <span className="font-semibold tracking-wide">AI-Powered Innovation</span>
              <Sparkles size={14} className="text-accent/60 group-hover:text-accent transition-colors" />
            </motion.div>

            {/* Main Heading with Word Reveal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-foreground mb-6 leading-[1.08] tracking-tight text-left">
              <WordReveal text="Smart AI Solutions" />
              <br />
              <WordReveal text="for a Smarter" gradient />
              <br />
              <WordReveal text="Future" />
            </h1>

            {/* Subtitle with fade-in */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-lg md:text-xl text-foreground/70 mb-8 max-w-lg leading-relaxed text-left font-medium"
            >
              AI SmartSyS provides cutting-edge AI tools, intelligent automation, and smart digital solutions to transform your business.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10"
            >
              <Button
                variant="hero"
                size="lg"
                onClick={handleGetStarted}
                className="text-base px-8 py-6 rounded-xl group flex items-center justify-center gap-3 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Get Started
                  <span className="arrow-gradient">
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </span>
              </Button>
              <Button
                variant="hero-outline"
                size="lg"
                onClick={scrollToContact}
                className="text-base px-8 py-6 rounded-xl"
              >
                Contact Us
              </Button>
            </motion.div>

            {/* Terminal Console with Neon Rotating Border */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 1.5 }}
              className="w-full max-w-lg neon-border-card rounded-2xl p-5 flex flex-col gap-4 shadow-2xl z-10 font-mono relative overflow-hidden"
            >
              {/* Scanline effect */}
              <div className="terminal-scanline absolute inset-0 pointer-events-none z-0" />

              <div className="relative z-10 flex items-center justify-between text-[10px] text-muted-foreground/60 select-none border-b border-border/30 pb-2.5">
                <span className="flex items-center gap-2">
                  <Terminal size={11} className="text-accent" />
                  <span className="text-foreground/80 font-bold">smartsys-interactive-dashboard</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">online</span>
                </span>
              </div>

              {/* Prompt Display */}
              <div className="relative z-10 text-xs text-zinc-300 min-h-[36px] flex items-center select-none bg-black/40 px-3.5 py-2.5 rounded-xl border border-border/20 shadow-inner">
                <span className="text-accent mr-1.5 font-bold">❯</span>
                <span>{promptText}</span>
                <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary typing-cursor" />
              </div>

              {/* Prompt Pills */}
              <div className="relative z-10 grid grid-cols-3 gap-2.5 pt-1">
                {PROMPTS.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => runPrompt(idx)}
                      disabled={isTypingPrompt}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`px-3 py-2.5 rounded-xl text-[10px] border transition-all duration-300 flex items-center justify-center gap-2 font-bold uppercase tracking-wider select-none ${
                        activePrompt === idx
                          ? "bg-accent/20 border-accent text-accent shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[0.98]"
                          : "bg-muted/20 border-border/40 text-muted-foreground hover:border-primary hover:text-foreground hover:bg-primary/5 disabled:opacity-50"
                      }`}
                    >
                      {activePrompt === idx ? <RefreshCw size={10} className="animate-spin text-accent" /> : <Icon size={10} className="text-primary" />}
                      {p.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN: Card Deck + Orbital Rings ─── */}
          <motion.div
            style={{ y: yParallax, opacity: opacityFade, willChange: 'transform, opacity' }}
            className="lg:col-span-5 relative flex items-center justify-center z-[2]"
          >
            {/* Floating Tech Badges */}
            <FloatingBadge className="-top-8 right-4 hidden lg:flex" delay={0}>
              <Sparkles size={10} className="mr-1 text-accent" /> ML Engine
            </FloatingBadge>
            <FloatingBadge className="top-1/4 -left-12 hidden lg:flex" delay={1.5}>
              <BrainCircuit size={10} className="mr-1 text-primary" /> Neural
            </FloatingBadge>
            <FloatingBadge className="bottom-8 -right-4 hidden lg:flex" delay={3}>
              <Shield size={10} className="mr-1 text-secondary" /> Secure
            </FloatingBadge>

            <div
              onMouseEnter={() => setIsStackHovered(true)}
              onMouseLeave={() => setIsStackHovered(false)}
              className="relative w-full max-w-[320px] h-[360px] md:max-w-none md:w-[420px] md:h-[480px] flex items-center justify-center select-none mt-8 md:mt-0"
            >
              {/* Orbit Ring 1 */}
              <div className="hero-orbit-ring w-[280px] h-[280px] md:w-[400px] md:h-[400px]" />
              {/* Orbit Ring 2 */}
              <div className="hero-orbit-ring-2 w-[340px] h-[340px] md:w-[500px] md:h-[500px]" />

              {/* Pulse Rings behind deck */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full border border-primary/20"
                animate={{ scale: [0.8, 2.5], opacity: [0.4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                style={{ x: '-50%', y: '-50%' }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full border border-accent/15"
                animate={{ scale: [0.8, 2.5], opacity: [0.3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
                style={{ x: '-50%', y: '-50%' }}
              />

              {/* Card Deck */}
              {cardData.map((card, idx) => {
                const isActive = (currentSlide % 3) === idx;
                return (
                  <motion.div
                    key={idx}
                    animate={getCardStyle(idx)}
                    transition={{ type: "spring", stiffness: 100, damping: 16 }}
                    className="absolute w-[220px] h-[300px] md:w-[280px] md:h-[370px] rounded-3xl overflow-hidden border shadow-2xl"
                    style={{
                      borderColor: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)'
                    }}
                  >
                    <div className="relative w-full h-full overflow-hidden bg-slate-900">
                      <img src={card.img} alt={card.label} className="w-full h-full object-cover" />
                      <div className={`absolute inset-0 transition-colors duration-500 ${isActive ? 'bg-gradient-to-t from-black/60 via-transparent to-transparent' : 'bg-black/60'}`} />
                      <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 text-[9px] font-mono text-white/90 bg-black/50 border border-white/15 px-2.5 py-1 rounded-full backdrop-blur-sm transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                        <card.icon size={10} className={card.color} /> {card.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ─── STATS COUNTER BAR ─── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 glass rounded-3xl p-8 md:p-10 relative overflow-hidden"
          style={{ animation: 'barGlow 4s ease-in-out infinite' }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
              animate={{ x: ['-100%', '400%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
            />
          </div>

          <AnimatedCounter target={150} suffix="+" label="Projects Delivered" />
          <AnimatedCounter target={50} suffix="+" label="Happy Clients" />
          <AnimatedCounter target={8} suffix="+" label="Years Experience" />
          <AnimatedCounter target={24} suffix="/7" label="Support Available" />
        </motion.div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => navigate("/dashboard")}
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 select-none z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] font-medium">Scroll</span>
          <div className="w-6 h-10 border-2 border-foreground/15 rounded-full flex items-start justify-center p-1.5">
            <motion.div
              className="w-1.5 h-3 bg-primary/60 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
