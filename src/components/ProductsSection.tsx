import { Type, FileText, Bot, ShoppingCart, Cpu, Server, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";
import { ArrowRight } from "lucide-react";

import imgCaption from "@/assets/images/caption-generator.jpg";
import imgResume from "@/assets/images/resume-builder.png";
import imgCloudServer from "@/assets/images/cloud-server.png";
import imgChatbot from "@/assets/images/chatboat.png";
import productEcommerce from "@/assets/images/product-ecommerce.jpg";
import productScada from "@/assets/images/product-scada.png";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { motion, AnimatePresence } from "framer-motion";

const products = [
  {
    id: "caption",
    icon: Type,
    title: "AI Caption Generator",
    desc: "Generate engaging social media captions instantly with AI-powered creativity.",
    image: imgCaption,
    color: "rgba(59, 130, 246, 0.15)",
    glowColor: "rgba(6, 182, 212, 0.4)",
    themeColor: "text-blue-400",
    features: ["Multiple tone selections", "Smart hashtags suggestions", "SEO optimized copy"]
  },
  {
    id: "resume",
    icon: FileText,
    title: "AI Resume Builder",
    desc: "Create professional, ATS-optimized resumes in minutes with smart AI assistance.",
    image: imgResume,
    color: "rgba(139, 92, 246, 0.15)",
    glowColor: "rgba(139, 92, 246, 0.4)",
    themeColor: "text-purple-400",
    features: ["ATS keywords alignment", "Professional templates", "AI phrasing suggestions"]
  },
  {
    id: "cloud-server",
    icon: Server,
    title: "Cloud Server Management",
    desc: "Deploy, manage and scale your applications on secure and high-performance cloud servers with reliable uptime.",
    image: imgCloudServer,
    color: "rgba(6, 182, 212, 0.15)",
    glowColor: "rgba(6, 182, 212, 0.4)",
    themeColor: "text-cyan-400",
    features: ["One-click server deployments", "Automated backups", "24/7 security monitoring"]
  },
  {
    id: "chatbot",
    icon: Bot,
    title: "AI Chatbot Builder",
    desc: "Build and deploy intelligent chatbots without code for any customer support or sales platform.",
    image: imgChatbot,
    color: "rgba(59, 130, 246, 0.15)",
    glowColor: "rgba(99, 102, 241, 0.4)",
    themeColor: "text-indigo-400",
    features: ["No-code drag-and-drop builder", "Multilingual chat support", "Live handover integration"]
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    desc: "Comprehensive e-commerce platforms designed to drive sales and enhance your checkout experience.",
    image: productEcommerce,
    color: "rgba(249, 115, 22, 0.15)",
    glowColor: "rgba(249, 115, 22, 0.4)",
    themeColor: "text-orange-400",
    features: ["Fast secure payment gateways", "AI product recommendations", "Advanced analytics dashboard"]
  },
  {
    id: "scada",
    icon: Cpu,
    title: "SCADA Solutions",
    desc: "Advanced supervisory control and data acquisition systems for smart industrial automation.",
    image: productScada,
    color: "rgba(16, 185, 129, 0.15)",
    glowColor: "rgba(16, 185, 129, 0.4)",
    themeColor: "text-emerald-400",
    features: ["Real-time sensor monitoring", "Centralized control grids", "Automated anomaly alarms"]
  }
];

const ProductsSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play interval progress
  useEffect(() => {
    if (isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const duration = 5000; // 5 seconds per tab
    const steps = 100;
    const stepTime = duration / steps;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveTab((current) => (current + 1) % products.length);
          return 0;
        }
        return prev + 1;
      });
    }, stepTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, activeTab]);

  // Reset progress when active tab changes manually
  const handleTabSelect = (index: number) => {
    setActiveTab(index);
    setProgress(0);
  };

  const handleExplore = (toolId: string) => {
    if (isAuthenticated) {
      navigate(`/dashboard?tool=${toolId}`);
    } else {
      setSelectedToolId(toolId);
      setIsAuthModalOpen(true);
    }
  };

  const currentProduct = products[activeTab];

  return (
    <section id="products" className="relative py-28 overflow-hidden bg-background">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Separator Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 z-10 relative">
        <SectionHeader badge="Our Products" title="AI-Powered Products" description="Ready-to-use AI tools designed to boost productivity and business operations." />

        <div 
          className="grid lg:grid-cols-12 gap-10 items-center max-w-7xl mx-auto mt-20"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Column: Interactive Tabs Selector (4 Columns) */}
          <div className="lg:col-span-5 flex flex-row lg:flex-col gap-3.5 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none w-full">
            {products.map((p, index) => {
              const Icon = p.icon;
              const isActive = index === activeTab;
              return (
                <button
                  key={p.id}
                  onClick={() => handleTabSelect(index)}
                  className={`flex items-center gap-5 p-5 rounded-[1.5rem] border transition-all duration-300 text-left shrink-0 w-[280px] lg:w-full relative overflow-hidden group ${
                    isActive 
                      ? "bg-card/30 border-primary/30 shadow-lg shadow-primary/5" 
                      : "bg-transparent border-border/40 hover:border-border/80"
                  }`}
                >
                  {/* Tab Active Glow Background */}
                  {isActive && (
                    <motion.div 
                      layoutId="active-tab-glow" 
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{ backgroundColor: p.glowColor }}
                    />
                  )}

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isActive ? "bg-gradient-button text-white" : "bg-muted/30 text-muted-foreground group-hover:scale-105"
                  }`}>
                    <Icon size={20} />
                  </div>

                  {/* Title & Description */}
                  <div className="flex-grow">
                    <h4 className={`font-extrabold text-sm md:text-base tracking-tight ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                      {p.title}
                    </h4>
                  </div>

                  {/* Loading Progress Bar Indicator (Right Edge) */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Immersive Card Showcase (7 Columns) */}
          <div className="lg:col-span-7 w-full h-[620px] md:h-[560px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 25, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -25, scale: 0.98 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-full h-full rounded-[2.5rem] overflow-hidden glass border border-border/50 relative p-8 md:p-12 flex flex-col justify-between shadow-2xl"
                style={{
                  boxShadow: `0 20px 50px -12px ${currentProduct.glowColor}`
                }}
              >
                {/* Background themed color block */}
                <div 
                  className="absolute inset-0 opacity-10 transition-colors duration-500 pointer-events-none"
                  style={{ backgroundColor: currentProduct.color }}
                />

                <div className="flex flex-col md:flex-row gap-6 items-center flex-grow">
                  {/* Info details */}
                  <div className="flex-1 text-left z-10 w-full">
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4 leading-tight">
                      {currentProduct.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
                      {currentProduct.desc}
                    </p>

                    {/* Features checklist */}
                    <ul className="space-y-3 mb-6">
                      {currentProduct.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs md:text-sm text-foreground/80">
                          <CheckCircle2 size={16} className={`${currentProduct.themeColor} shrink-0`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Render Visual Showcase */}
                  <div className="flex-1 w-full h-[240px] md:h-[340px] relative rounded-3xl overflow-hidden border border-border/50 shadow-xl z-10 bg-muted/10 group">
                    {/* Blurred background preview */}
                    <img
                      src={currentProduct.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-lg opacity-40 scale-110"
                    />
                    {/* Main image */}
                    <img
                      src={currentProduct.image}
                      alt={currentProduct.title}
                      className="relative z-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                  </div>
                </div>

                {/* Explore button footer */}
                <div className="z-10 mt-6 pt-4 border-t border-border/50 flex justify-between items-center w-full">
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    * Hover to pause auto-cycle
                  </span>
                  <Button
                    variant="hero"
                    onClick={() => handleExplore(currentProduct.id)}
                    className="rounded-xl px-6 py-5 text-sm group/btn font-semibold flex items-center gap-2 bg-gradient-button text-white hover:opacity-95 shadow-lg shadow-primary/20 w-full sm:w-auto"
                  >
                    Explore Product <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => navigate(`/dashboard?tool=${selectedToolId}`)}
      />
    </section>
  );
};

export default ProductsSection;
