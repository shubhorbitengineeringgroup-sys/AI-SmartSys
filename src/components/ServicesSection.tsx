import { PenTool, Globe, Server, MessageSquare, Smartphone, Code, Search, Cloud, Zap, ArrowRight, Activity } from "lucide-react";
import serviceWebDesigning from "@/assets/images/service-web-designing.png";
import serviceWebDevelopment from "@/assets/images/service-web-development.png";
import serviceDomain from "@/assets/images/service-domain.png";
import serviceSms from "@/assets/images/service-sms.png";
import serviceApp from "@/assets/images/service-app.png";
import serviceSoftware from "@/assets/images/service-software.png";
import serviceSeo from "@/assets/images/service-seo.png";
import serviceHosting from "@/assets/images/service-hosting.png";

import SectionHeader from "./SectionHeader";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  {
    ref: "website-designing",
    icon: PenTool,
    title: "Website Designing",
    subtitle: "UI/UX & Creative Layouts",
    desc: "Create visually stunning, bespoke, and user-friendly web designs that captivate your audience and elevate your brand presence.",
    image: serviceWebDesigning,
    color: "from-cyan-500 to-blue-600",
    glowColor: "rgba(6, 182, 212, 0.25)",
    textColor: "text-cyan-500 dark:text-cyan-400",
    themeGlow: "#06b6d4",
    borderColor: "border-cyan-500/30",
    bgGlow: "bg-cyan-500/10",
    metrics: {
      "UI/UX": "Bespoke",
      "Fidelity": "100%",
      "Responsiveness": "Fluid"
    }
  },
  {
    ref: "website-development",
    icon: Globe,
    title: "Website Development",
    subtitle: "Fullstack Coding & Systems",
    desc: "Build robust, highly scalable, and responsive web applications tailored to your business needs with cutting-edge frameworks.",
    image: serviceWebDevelopment,
    color: "from-purple-500 to-indigo-600",
    glowColor: "rgba(168, 85, 247, 0.25)",
    textColor: "text-purple-500 dark:text-purple-400",
    themeGlow: "#a855f7",
    borderColor: "border-purple-500/30",
    bgGlow: "bg-purple-500/10",
    metrics: {
      "Load Time": "<0.8s",
      "SEO Score": "100/100",
      "Code Base": "Clean"
    }
  },
  {
    ref: "domain-registration",
    icon: Server,
    title: "Domain Registration",
    subtitle: "Digital Identity & Security",
    desc: "Secure your unique digital identity and lock down your online domain name fast, complete with SSL certificates and DNS management.",
    image: serviceDomain,
    color: "from-blue-500 to-sky-600",
    glowColor: "rgba(59, 130, 246, 0.25)",
    textColor: "text-blue-500 dark:text-blue-400",
    themeGlow: "#3b82f6",
    borderColor: "border-blue-500/30",
    bgGlow: "bg-blue-500/10",
    metrics: {
      "SSL Certificate": "Free",
      "DNS Setup": "Instant",
      "Security": "Locked"
    }
  },
  {
    ref: "bulk-sms",
    icon: MessageSquare,
    title: "Bulk SMS Services",
    subtitle: "Instant Customer Outreach",
    desc: "Reach thousands of customers instantly with high-throughput, reliable message delivery protocols and modern API integrations.",
    image: serviceSms,
    color: "from-pink-500 to-rose-600",
    glowColor: "rgba(236, 72, 153, 0.25)",
    textColor: "text-pink-500 dark:text-pink-400",
    themeGlow: "#ec4899",
    borderColor: "border-pink-500/30",
    bgGlow: "bg-pink-500/10",
    metrics: {
      "Delivery Rate": "99.8%",
      "Throughput": "10k/s",
      "Protocol": "Direct"
    }
  },
  {
    ref: "app-development",
    icon: Smartphone,
    title: "App Development",
    subtitle: "iOS, Android & Native Apps",
    desc: "Develop high-performance, feature-rich mobile applications that offer fluid user experiences and offline capability.",
    image: serviceApp,
    color: "from-emerald-500 to-teal-600",
    glowColor: "rgba(16, 185, 129, 0.25)",
    textColor: "text-emerald-500 dark:text-emerald-400",
    themeGlow: "#10b981",
    borderColor: "border-emerald-500/30",
    bgGlow: "bg-emerald-500/10",
    metrics: {
      "Platforms": "iOS/Android",
      "Framerate": "120 FPS",
      "Offline Sync": "Yes"
    }
  },
  {
    ref: "customised-software",
    icon: Code,
    title: "Custom Software",
    subtitle: "Tailored Business Automation",
    desc: "Custom-built database systems, internal tooling, and automations structured specifically to power your operational workflows.",
    image: serviceSoftware,
    color: "from-amber-500 to-orange-600",
    glowColor: "rgba(245, 158, 11, 0.25)",
    textColor: "text-amber-500 dark:text-amber-400",
    themeGlow: "#f59e0b",
    borderColor: "border-amber-500/30",
    bgGlow: "bg-amber-500/10",
    metrics: {
      "Architecture": "Scalable",
      "DB Query": "<15ms",
      "API Nodes": "Secure"
    }
  },
  {
    ref: "seo",
    icon: Search,
    title: "SEO Solutions",
    subtitle: "Organic Traffic Growth",
    desc: "Index higher, optimize content, and rank page-one on Google search queries with our data-driven SEO techniques.",
    image: serviceSeo,
    color: "from-green-500 to-emerald-600",
    glowColor: "rgba(34, 197, 94, 0.25)",
    textColor: "text-green-500 dark:text-green-400",
    themeGlow: "#22c55e",
    borderColor: "border-green-500/30",
    bgGlow: "bg-green-500/10",
    metrics: {
      "Traffic Gain": "+250%",
      "Google Rank": "Top 10",
      "Authority": "High"
    }
  },
  {
    ref: "hosting",
    icon: Cloud,
    title: "Cloud Hosting",
    subtitle: "High Availability Servers",
    desc: "Host your assets with high reliability, auto-scaling, advanced security firewalls, and guaranteed 99.9% network uptime.",
    image: serviceHosting,
    color: "from-fuchsia-500 to-purple-600",
    glowColor: "rgba(217, 70, 239, 0.25)",
    textColor: "text-fuchsia-500 dark:text-fuchsia-400",
    themeGlow: "#d946ef",
    borderColor: "border-fuchsia-500/30",
    bgGlow: "bg-fuchsia-500/10",
    metrics: {
      "Uptime SLA": "99.99%",
      "SSD Type": "NVMe",
      "Bandwidth": "Unlimited"
    }
  },
];

const ServicesSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleServiceClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const activeService = services[activeIndex];

  return (
    <section id="services" className="relative py-28 overflow-hidden bg-background">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Separator line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto relative z-10 px-4">
        <SectionHeader 
          badge="Our Services" 
          title="What We Offer" 
          description="Empowering businesses with intelligent solutions across AI, web, and mobile." 
        />
        
        {/* Main Stage Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-stretch max-w-7xl mx-auto mt-16">
          
          {/* Mobile horizontal selector */}
          <div className="lg:hidden flex gap-3 overflow-x-auto pb-4 px-2 scrollbar-none snap-x snap-mandatory w-full col-span-1">
            {services.map((s, i) => {
              const Icon = s.icon;
              const isActive = activeIndex === i;
              return (
                <button
                  key={s.title}
                  onClick={() => setActiveIndex(i)}
                  className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-full border text-sm font-semibold transition-all duration-300 snap-center ${
                    isActive
                      ? "bg-primary/10 border-primary text-primary shadow-sm"
                      : "bg-card/25 border-border/40 text-muted-foreground"
                  }`}
                >
                  <Icon size={16} />
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Left Sidebar list */}
          <div className="hidden lg:col-span-5 lg:flex flex-col gap-3 max-h-[650px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {services.map((s, i) => {
              const Icon = s.icon;
              const isActive = activeIndex === i;
              return (
                <button
                  key={s.title}
                  onClick={() => setActiveIndex(i)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group ${
                    isActive
                      ? "bg-card border-border dark:border-primary/50 shadow-lg"
                      : "bg-card/30 border-border/40 hover:bg-card/50 hover:border-border"
                  }`}
                >
                  {/* Glow accent behind icon for active */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
                  )}
                  
                  {/* Left active border indicator */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${
                      isActive ? `bg-gradient-to-b ${s.color}` : "bg-transparent"
                    }`}
                  />

                  {/* Icon container */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-br ${s.color} text-white border-transparent shadow-md`
                        : "bg-background/40 border-border/40 text-muted-foreground group-hover:text-foreground group-hover:border-border/60"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "animate-pulse" : ""} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`font-heading font-extrabold text-base transition-colors duration-300 ${
                          isActive ? "text-foreground font-black" : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        {s.title}
                      </h4>
                      {isActive && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.bgGlow} ${s.textColor} font-semibold border ${s.borderColor} hidden sm:inline-block`}>
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/80 mt-0.5 truncate font-medium">
                      {s.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Holographic 3D Stage Showcase (Separated projection space & details card) */}
          <div className="col-span-1 lg:col-span-7 flex flex-col items-center gap-6 relative mt-4 lg:mt-0">
            
            {/* TOP: Holographic Image Projection Space - Expanded for Larger Display */}
            <div className="relative w-full h-[320px] sm:h-[400px] md:h-[440px] flex items-center justify-center" style={{ perspective: "1200px" }}>
              {/* Projection Glow Map */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full blur-[110px] transition-all duration-1000 opacity-30"
                  style={{
                    background: `radial-gradient(circle, ${activeService.glowColor} 0%, transparent 70%)`
                  }}
                />
              </div>

              {/* Bounding Scanner Box corners (New Feature) */}
              <div className="absolute w-[260px] sm:w-[360px] md:w-[400px] h-[240px] sm:h-[320px] md:h-[360px] border border-dashed border-primary/10 rounded-[2rem] pointer-events-none z-10 flex items-center justify-center">
                {/* Corner brackets */}
                <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-xl transition-colors duration-1000" style={{ borderColor: activeService.themeGlow }} />
                <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-xl transition-colors duration-1000" style={{ borderColor: activeService.themeGlow }} />
                <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-xl transition-colors duration-1000" style={{ borderColor: activeService.themeGlow }} />
                <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-xl transition-colors duration-1000" style={{ borderColor: activeService.themeGlow }} />
                
                {/* Tech target circles */}
                <div className="absolute w-4 h-4 border border-primary/30 rounded-full" />
                <div className="absolute w-20 h-20 border border-primary/5 rounded-full animate-ping" />
              </div>

              {/* Floating 3D Image - Sized significantly larger, fully uncropped */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                whileHover={{ scale: 1.06, rotateY: 10, rotateX: -5 }}
                transition={{
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  scale: { type: "spring", stiffness: 200, damping: 15 },
                  rotateY: { type: "spring", stiffness: 200, damping: 15 },
                  rotateX: { type: "spring", stiffness: 200, damping: 15 }
                }}
                className="relative z-20 w-full h-full flex items-center justify-center"
                style={{ transformStyle: "preserve-3d" }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeIndex}
                    src={activeService.image}
                    alt={activeService.title}
                    initial={{ opacity: 0, scale: 0.82, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.82, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-[90%] sm:h-full max-h-[290px] sm:max-h-[360px] md:max-h-[400px] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.6)]"
                  />
                </AnimatePresence>
              </motion.div>

              {/* Cyber-Stage Multi-layered Holographic Pedestal below floating image */}
              <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-[80%] sm:w-[90%] flex flex-col items-center pointer-events-none z-10">
                {/* Concentric rotating outer dotted ring */}
                <div 
                  className="w-[95%] h-[15px] border border-dashed rounded-full opacity-35 animate-[spin_25s_linear_infinite] transition-colors duration-1000"
                  style={{ borderColor: activeService.themeGlow }}
                />
                
                {/* Spinning inner dashed ring in opposite direction */}
                <div 
                  className="w-[80%] h-[12px] border border-dashed rounded-full -mt-[14px] opacity-60 animate-[spin_12s_linear_infinite_reverse] transition-colors duration-1000"
                  style={{ borderColor: activeService.themeGlow }}
                />

                {/* 3D Glowing Ellipse base */}
                <div
                  className="w-[65%] h-[12px] rounded-full blur-[3px] border border-white/10 transition-all duration-1000 -mt-[10px]"
                  style={{
                    background: `radial-gradient(ellipse at center, ${activeService.glowColor} 0%, transparent 80%)`,
                    boxShadow: `0 0 24px 4px ${activeService.glowColor}`
                  }}
                />

                {/* Concentrated light core source */}
                <div className="w-[20%] h-[4px] rounded-full blur-[1px] bg-white opacity-95 -mt-[11px]" />
                
                {/* Holographic vertical projection beam with pulse (New Feature) */}
                <motion.div 
                  className="w-[45%] bg-gradient-to-t absolute bottom-[10px] left-[27.5%] rounded-t-full blur-2xl pointer-events-none"
                  style={{
                    background: `linear-gradient(to top, ${activeService.glowColor.replace("0.25", "0.2")}, transparent)`
                  }}
                  animate={{
                    height: [60, 200, 60],
                    opacity: [0.15, 0.4, 0.15]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>

            {/* BOTTOM: Description and Details Control Panel Card */}
            <div 
              className="w-full max-w-[520px] rounded-[2rem] p-6 sm:p-7 bg-card border border-border/60 flex flex-col gap-4 shadow-xl relative overflow-hidden transition-all duration-500"
              style={{
                boxShadow: `0 10px 30px -10px ${activeService.glowColor}`
              }}
            >
              {/* Holographic Scanline Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent bg-[size:100%_4px] pointer-events-none opacity-25" />

              {/* Top bar info */}
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Control.Panel</span>
                </div>
                <span className="text-[10px] font-mono text-primary font-bold">
                  [ 0{activeIndex + 1} / 0{services.length} ]
                </span>
              </div>

              {/* Title & Description */}
              <div className="text-left">
                <h3 className="font-heading font-black text-lg sm:text-xl text-foreground flex items-center gap-2">
                  <Activity className={`w-5 h-5 ${activeService.textColor}`} />
                  {activeService.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1.5 font-medium">
                  {activeService.desc}
                </p>
              </div>

              {/* Metrics panel */}
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(activeService.metrics).map(([key, val]) => (
                  <div key={key} className="bg-muted/30 border border-border/50 rounded-xl p-2.5 text-center">
                    <span className="block text-[8px] text-muted-foreground uppercase tracking-widest font-mono">{key}</span>
                    <span className={`text-[10px] sm:text-xs font-bold font-mono ${activeService.textColor}`}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                onClick={handleServiceClick}
                className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider text-white bg-gradient-to-r ${activeService.color} shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn`}
              >
                Deploy Solution <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

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

export default ServicesSection;