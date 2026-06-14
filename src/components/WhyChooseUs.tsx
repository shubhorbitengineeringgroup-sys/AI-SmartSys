import { Users, Cpu, ShieldCheck, HeartHandshake, Sparkles, Coins, CheckCircle2, ArrowRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { GlowOrb } from "./TechPattern";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";

import whyChooseTeamImg from "@/assets/images/why_choose_team.png";
import whyChooseTechImg from "@/assets/images/why_choose_tech.png";
import whyChooseSecurityImg from "@/assets/images/why_choose_security.png";
import whyChooseCustomerImg from "@/assets/images/why_choose_customer.png";

const pillars = [
  {
    id: 0,
    icon: Users,
    title: "Experienced & Specialized Team",
    subtitle: "Elite Tech Architects",
    desc: "Our team consists of seasoned AI engineers, fullstack developers, and creative designers who specialize in building complex digital systems.",
    badge: "Senior Engineers",
    tag: "SYS-TEAM-01",
    shape: "rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-2xl rounded-bl-2xl",
    color: "from-cyan-400 via-sky-500 to-blue-600",
    glowColor: "rgba(6, 182, 212, 0.25)",
    themeGlow: "#06b6d4",
    textColor: "text-cyan-400 dark:text-cyan-400",
    borderColor: "border-cyan-500/20 group-hover:border-cyan-500/60",
    image: whyChooseTeamImg
  },
  {
    id: 1,
    icon: Cpu,
    title: "Modern & Scalable Technology",
    subtitle: "Future-Ready Frameworks",
    desc: "We build with top-tier technology including React, Next.js, FastAPI, Node, and state-of-the-art LLMs, ensuring rapid performance and seamless scale.",
    badge: "Cutting Edge",
    tag: "SYS-TECH-02",
    shape: "rounded-tr-[3.5rem] rounded-bl-[3.5rem] rounded-tl-2xl rounded-br-2xl",
    color: "from-purple-400 via-fuchsia-500 to-indigo-600",
    glowColor: "rgba(168, 85, 247, 0.25)",
    themeGlow: "#a855f7",
    textColor: "text-purple-400 dark:text-purple-400",
    borderColor: "border-purple-500/20 group-hover:border-purple-500/60",
    image: whyChooseTechImg
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Reliable & Secure Solutions",
    subtitle: "Enterprise-Grade Safety",
    desc: "Security is built in, not bolted on. We implement banking-grade encryption, rigorous data protection protocols, and secure database connections.",
    badge: "Uptime Guaranteed",
    tag: "SYS-SAFE-03",
    shape: "rounded-tr-[3.5rem] rounded-bl-[3.5rem] rounded-tl-2xl rounded-br-2xl",
    color: "from-emerald-400 via-teal-500 to-cyan-600",
    glowColor: "rgba(16, 185, 129, 0.25)",
    themeGlow: "#10b981",
    textColor: "text-emerald-400 dark:text-emerald-400",
    borderColor: "border-emerald-500/20 group-hover:border-emerald-500/60",
    image: whyChooseSecurityImg
  },
  {
    id: 3,
    icon: HeartHandshake,
    title: "Customer Focused Approach",
    subtitle: "Your Growth is Our Goal",
    desc: "We act as your dedicated engineering partners. Through weekly iterations, direct communication channels, and agile updates, we align with your vision.",
    badge: "Direct Collaboration",
    tag: "SYS-CUST-04",
    shape: "rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-2xl rounded-bl-2xl",
    color: "from-amber-400 via-orange-500 to-rose-600",
    glowColor: "rgba(245, 158, 11, 0.25)",
    themeGlow: "#f59e0b",
    textColor: "text-amber-400 dark:text-amber-400",
    borderColor: "border-amber-500/20 group-hover:border-amber-500/60",
    image: whyChooseCustomerImg
  }
];

const WhyChooseUs = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);
  const [compareModel, setCompareModel] = useState<"smartsys" | "agency">("smartsys");

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <section id="why-choose-us" className="relative py-28 overflow-hidden bg-background">
      {/* Inline styles for custom sweep and glow animations */}
      <style>{`
        @keyframes progressSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-progress-sweep {
          background-size: 200% auto;
          animation: progressSweep 3s linear infinite;
        }
        @keyframes headerShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-header-shimmer {
          background-size: 200% auto;
          animation: headerShimmer 6s linear infinite;
        }
      `}</style>

      {/* Background elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: "12s" }} />

      {/* Separator line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <GlowOrb className="w-[400px] h-[400px] top-1/3 -left-40 animate-float opacity-30 z-0" color="secondary" />

      <div className="container mx-auto relative z-10 px-4">
        {/* Animated Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-bold uppercase tracking-widest mb-6 text-accent animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground via-accent to-foreground mb-5 leading-tight tracking-tight animate-header-shimmer">
            Premium Quality, Fair Pricing
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed font-medium">
            We leverage advanced AI tooling and hyper-efficient workflows to deliver elite enterprise code without the standard agency overheads.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-stretch max-w-7xl mx-auto mt-16" style={{ perspective: "1500px" }}>
          
          {/* LEFT COLUMN: Interactive Cost/Quality Comparison Card (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div 
              animate={{
                y: [0, -6, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full rounded-tr-[4rem] rounded-bl-[4rem] rounded-tl-2xl rounded-br-2xl p-7 sm:p-8 bg-card border border-border/60 relative overflow-hidden shadow-2xl transition-all duration-500"
              style={{
                boxShadow: compareModel === "smartsys"
                  ? "0 25px 60px -15px rgba(6, 182, 212, 0.3)"
                  : "0 25px 50px -15px rgba(100, 116, 139, 0.15)"
              }}
            >
              {/* Technical Grid Pattern overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:16px_28px] pointer-events-none opacity-50" />

              {/* Bounding tech corner brackets with pulse animation */}
              <motion.span 
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 rounded-tl-md" 
                style={{ borderColor: compareModel === "smartsys" ? "#06b6d4" : "#64748b" }} 
              />
              <motion.span 
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 rounded-tr-md" 
                style={{ borderColor: compareModel === "smartsys" ? "#06b6d4" : "#64748b" }} 
              />
              <motion.span 
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 rounded-bl-md" 
                style={{ borderColor: compareModel === "smartsys" ? "#06b6d4" : "#64748b" }} 
              />
              <motion.span 
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 rounded-br-md" 
                style={{ borderColor: compareModel === "smartsys" ? "#06b6d4" : "#64748b" }} 
              />

              {/* Title & Toggle Switch */}
              <div className="flex flex-col gap-4 text-left border-b border-border/40 pb-5 z-10 relative">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Coins size={11} className="text-accent animate-bounce" /> Cost vs Quality Value Engine
                </span>
                
                <h3 className="font-heading font-black text-xl text-foreground">
                  The Smart Value Model
                </h3>

                {/* Tactical Toggle Control */}
                <div className="flex bg-muted/40 p-1.5 rounded-2xl border border-border/30 w-full relative">
                  <button
                    onClick={() => setCompareModel("smartsys")}
                    className={`flex-1 py-2.5 text-center text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 relative z-10 ${
                      compareModel === "smartsys"
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    AI SmartSyS
                  </button>
                  <button
                    onClick={() => setCompareModel("agency")}
                    className={`flex-1 py-2.5 text-center text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 relative z-10 ${
                      compareModel === "agency"
                        ? "text-foreground font-extrabold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Traditional Agency
                  </button>
                  
                  {/* Sliding button background */}
                  <motion.div
                    className={`absolute top-1.5 bottom-1.5 rounded-xl ${compareModel === "smartsys" ? "bg-gradient-button shadow-lg shadow-primary/20" : "bg-muted border border-border/40 shadow-inner"}`}
                    animate={{
                      left: compareModel === "smartsys" ? "6px" : "50%",
                      right: compareModel === "smartsys" ? "50%" : "6px"
                    }}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                  />
                </div>
              </div>

              {/* Dynamic Value Metrics */}
              <div className="py-6 flex flex-col gap-6 text-left z-10 relative">
                {/* Metric 1: Quality */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black font-mono uppercase tracking-wider text-foreground">Project Quality</span>
                    <motion.span 
                      key={compareModel}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-xs font-black font-mono ${compareModel === "smartsys" ? "text-cyan-400" : "text-muted-foreground"}`}
                      style={{ textShadow: compareModel === "smartsys" ? "0 0 10px rgba(6,182,212,0.4)" : "none" }}
                    >
                      {compareModel === "smartsys" ? "98% (Enterprise)" : "75% (Standard)"}
                    </motion.span>
                  </div>
                  <div className="h-3.5 w-full bg-muted/50 rounded-full overflow-hidden border border-border/20 p-[2px]">
                    <motion.div
                      className={`h-full rounded-full relative overflow-hidden animate-progress-sweep ${compareModel === "smartsys" ? "bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600" : "bg-slate-500"}`}
                      initial={{ width: "0%" }}
                      animate={{ width: compareModel === "smartsys" ? "98%" : "75%" }}
                      transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    >
                      {/* Pulse shimmer wave */}
                      <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)] bg-[size:200px_100%] animate-[shimmer_2s_infinite]" />
                    </motion.div>
                  </div>
                </div>

                {/* Metric 2: Pricing */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black font-mono uppercase tracking-wider text-foreground">Client Investment</span>
                    <motion.span 
                      key={compareModel}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-xs font-black font-mono ${compareModel === "smartsys" ? "text-emerald-400" : "text-rose-400"}`}
                      style={{ textShadow: compareModel === "smartsys" ? "0 0 10px rgba(16,185,129,0.4)" : "none" }}
                    >
                      {compareModel === "smartsys" ? "40% (Highly Affordable)" : "100% (High Premium)"}
                    </motion.span>
                  </div>
                  <div className="h-3.5 w-full bg-muted/50 rounded-full overflow-hidden border border-border/20 p-[2px]">
                    <motion.div
                      className={`h-full rounded-full relative overflow-hidden animate-progress-sweep ${compareModel === "smartsys" ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-600" : "bg-gradient-to-r from-rose-500 to-red-600"}`}
                      initial={{ width: "0%" }}
                      animate={{ width: compareModel === "smartsys" ? "40%" : "100%" }}
                      transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    >
                      <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)] bg-[size:200px_100%] animate-[shimmer_2s_infinite]" />
                    </motion.div>
                  </div>
                </div>

                {/* Metric 3: Time to Market */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black font-mono uppercase tracking-wider text-foreground">Delivery Speed</span>
                    <motion.span 
                      key={compareModel}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-xs font-black font-mono ${compareModel === "smartsys" ? "text-accent" : "text-muted-foreground"}`}
                      style={{ textShadow: compareModel === "smartsys" ? "0 0 10px rgba(6,182,212,0.4)" : "none" }}
                    >
                      {compareModel === "smartsys" ? "2x Faster" : "Standard Speed"}
                    </motion.span>
                  </div>
                  <div className="h-3.5 w-full bg-muted/50 rounded-full overflow-hidden border border-border/20 p-[2px]">
                    <motion.div
                      className={`h-full rounded-full relative overflow-hidden animate-progress-sweep ${compareModel === "smartsys" ? "bg-gradient-to-r from-accent via-sky-400 to-blue-500" : "bg-slate-500"}`}
                      initial={{ width: "0%" }}
                      animate={{ width: compareModel === "smartsys" ? "90%" : "45%" }}
                      transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    >
                      <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)] bg-[size:200px_100%] animate-[shimmer_2s_infinite]" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Dynamic Descriptive Points */}
              <div className="border-t border-border/40 pt-5 z-10 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={compareModel}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-3 text-left text-xs sm:text-sm text-muted-foreground"
                  >
                    {compareModel === "smartsys" ? (
                      <>
                        <div className="flex gap-2.5 items-start">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
                          <span><strong>Lean Efficiency:</strong> We use internal AI-assisted scaffolding tools to write core features 3x faster, passing the savings to you.</span>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
                          <span><strong>Zero Overhead:</strong> You pay directly for the engineering expertise. No sales overhead, account managers, or office leases.</span>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
                          <span><strong>Verified Quality:</strong> Fully custom layouts, clean codebases, complete documentation, and automated tests.</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-2.5 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 shrink-0 mt-2" />
                          <span><strong>Bloated Costs:</strong> Heavy project manager margins, sales reps commissions, and massive administrative overheads.</span>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 shrink-0 mt-2" />
                          <span><strong>Delayed Shipping:</strong> Long chain of communications, manual coding processes, and legacy release cycles.</span>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 shrink-0 mt-2" />
                          <span><strong>Outsourced Coding:</strong> Quality fluctuates since projects are often passed down to junior offshore contractors.</span>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Call to action inside comparison */}
              <div className="mt-8 z-10 relative">
                <Button
                  variant="hero"
                  onClick={handleCTA}
                  className="w-full py-4 text-xs uppercase tracking-widest font-extrabold flex items-center justify-center gap-2 group shadow-lg shadow-primary/10 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Cost-Saving Project <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Subtle pulsing background glow on button */}
                  <span className="absolute inset-0 bg-white/5 animate-pulse" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: 4 Pillars Interactive Layout - Asymmetric Shapes & HUD Accents (7 Columns) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
            {pillars.map((p, index) => {
              const Icon = p.icon;
              const isHovered = hoveredPillar === index;

              // Define different entrance and hover animations for each card
              const getAnimationProps = (idx: number) => {
                switch(idx) {
                  case 0: // Team - 3D Tilt & Spring Vertical bounce entrance
                    return {
                      initial: { opacity: 0, y: 60, scale: 0.95 },
                      animate: { opacity: 1, y: 0, scale: 1 },
                      whileHover: { rotateY: 8, rotateX: -8, y: -12, scale: 1.02 },
                      transition: { type: "spring", stiffness: 120, damping: 12, delay: 0.1 }
                    };
                  case 1: // Tech - Horizontal slide & Zoom hover
                    return {
                      initial: { opacity: 0, x: 80 },
                      animate: { opacity: 1, x: 0 },
                      whileHover: { y: -12, scale: 1.04 },
                      transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.25 }
                    };
                  case 2: // Security - Scale Wobble & Radar pulse hover
                    return {
                      initial: { opacity: 0, scale: 0.8, rotate: -4 },
                      animate: { opacity: 1, scale: 1, rotate: 0 },
                      whileHover: { y: -12, scale: 1.02 },
                      transition: { type: "spring", stiffness: 110, damping: 10, delay: 0.4 }
                    };
                  case 3: // Customer - Diagonal sweep & float hover loop
                    return {
                      initial: { opacity: 0, x: 50, y: 50 },
                      animate: { opacity: 1, x: 0, y: 0 },
                      whileHover: { 
                        y: -15,
                        transition: {
                          y: { repeat: Infinity, repeatType: "mirror", duration: 1.8, ease: "easeInOut" }
                        }
                      },
                      transition: { type: "spring", stiffness: 90, damping: 14, delay: 0.55 }
                    };
                  default:
                    return {};
                }
              };

              const animProps = getAnimationProps(index);

              return (
                <motion.div
                  key={p.title}
                  onMouseEnter={() => setHoveredPillar(index)}
                  onMouseLeave={() => setHoveredPillar(null)}
                  {...animProps}
                  className={`relative p-6 bg-card/45 border transition-all duration-500 flex flex-col justify-between overflow-hidden group/card z-10 ${p.shape} ${p.borderColor}`}
                  style={{
                    boxShadow: isHovered ? `0 20px 45px -10px ${p.glowColor}` : "none",
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Cyber Grid pattern inside each card */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808004_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:14px_22px] pointer-events-none opacity-50 group-hover/card:opacity-90 transition-opacity duration-500" />
                  
                  {/* Sliding Gradient Mesh on Hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover/card:opacity-[0.08] transition-opacity duration-500 pointer-events-none bg-gradient-to-br"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${p.glowColor.replace("0.25", "1")}, transparent)`
                    }}
                  />

                  {/* Corner sharp HUD lines inside the card bounds - Slowly pulsing constantly */}
                  <motion.span 
                    animate={{ opacity: isHovered ? 1 : [0.15, 0.4, 0.15] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 rounded-tl-sm transition-opacity duration-500" 
                    style={{ borderColor: p.themeGlow }} 
                  />
                  <motion.span 
                    animate={{ opacity: isHovered ? 1 : [0.15, 0.4, 0.15] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute bottom-3.5 right-3.5 w-4 h-4 border-b-2 border-r-2 rounded-br-sm transition-opacity duration-500" 
                    style={{ borderColor: p.themeGlow }} 
                  />
                  
                  {/* System tag (Mono) in corner - pulsing constantly */}
                  <motion.div 
                    animate={{ opacity: isHovered ? 0.8 : [0.15, 0.35, 0.15] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-3 right-5 text-[8px] font-mono tracking-wider"
                  >
                    {p.tag}
                  </motion.div>

                  <div className="space-y-4">
                    {/* Viewport for Graphic Illustration */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950/60 border border-white/5 flex items-center justify-center group/img shadow-md">
                      {/* Radial glow inside image viewport */}
                      <div 
                        className="absolute w-[120px] h-[120px] rounded-full blur-[40px] opacity-25 group-hover/card:opacity-50 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle, ${p.glowColor.replace("0.25", "1")} 0%, transparent 70%)`
                        }}
                      />
                      
                      {/* Image */}
                      <img 
                        src={p.image} 
                        alt={p.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                      />
                      
                      {/* Scanline pattern over illustration */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />
                      
                      {/* Radar Scanning Ring for Security card */}
                      {index === 2 && isHovered && (
                        <motion.div 
                          className="absolute w-24 h-24 border-2 border-emerald-500/30 rounded-full pointer-events-none"
                          animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        />
                      )}
                    </div>

                    {/* Header: Icon with Spinning HUD reticle & Badge */}
                    <div className="flex justify-between items-center">
                      <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                        {/* Ambient slow spinning rings */}
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={isHovered 
                            ? { duration: 5, repeat: Infinity, ease: "linear" }
                            : { duration: 20, repeat: Infinity, ease: "linear" }
                          }
                          className="absolute inset-[-3px] border border-dashed rounded-lg opacity-25 group-hover/card:opacity-75 transition-all duration-500" 
                          style={{ borderColor: p.themeGlow }}
                        />
                        <div className={`w-full h-full rounded-xl flex items-center justify-center border transition-all duration-500 ${
                          isHovered
                            ? `bg-gradient-to-br ${p.color} text-white border-transparent shadow-lg scale-105`
                            : "bg-background/40 border-border/40 text-muted-foreground"
                        }`}>
                          <Icon size={16} className={isHovered ? "animate-pulse" : ""} />
                        </div>
                      </div>

                      {/* Pill Badge */}
                      <span className="text-[8px] font-bold font-mono uppercase tracking-wider text-muted-foreground/60 border border-border/40 px-2.5 py-0.5 rounded-full select-none mt-1 animate-pulse" style={{ animationDuration: "3s" }}>
                        {p.badge}
                      </span>
                    </div>

                    {/* Content text */}
                    <div>
                      <h4 className="font-heading font-black text-sm text-foreground mb-1 transition-all duration-300" style={{ color: isHovered ? p.themeGlow : "inherit", textShadow: isHovered ? `0 0 12px ${p.glowColor.replace("0.25", "0.6")}` : "none" }}>
                        {p.title}
                      </h4>
                      <p className={`text-[9px] font-mono uppercase tracking-widest font-extrabold mb-3 transition-colors duration-300 ${
                        isHovered ? p.textColor : "text-muted-foreground/70"
                      }`}>
                        {p.subtitle}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  {/* Aesthetic bottom loading bar */}
                  <div className="mt-5 w-full h-[2.5px] bg-border/30 relative overflow-hidden rounded-full p-[0.5px]">
                    <motion.div
                      className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${p.color}`}
                      initial={{ width: "20%" }}
                      animate={{ width: isHovered ? "100%" : "20%" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => navigate("/dashboard")}
      />
    </section>
  );
};

export default WhyChooseUs;
