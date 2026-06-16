import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import NeuralCanvas from "@/components/NeuralCanvas";
import { 
  Brain, 
  Code, 
  Sparkles, 
  MessageSquare, 
  Activity, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Zap, 
  LineChart 
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

// Import custom generated images
import aiDevImg from "@/assets/images/capabilities/ai_dev.png";
import webDevImg from "@/assets/images/capabilities/web_dev.png";
import automationImg from "@/assets/images/capabilities/automation.png";
import chatbotDevImg from "@/assets/images/capabilities/chatbot_dev.png";
import dataAnalyticsImg from "@/assets/images/capabilities/data_analytics.png";
import mobileAppsImg from "@/assets/images/capabilities/mobile_apps.png";

const capabilities = [
  {
    id: "ai-development",
    icon: Brain,
    title: "AI Development",
    subtitle: "Custom Neural Networks, LLMs & Deep Learning Models",
    desc: "Supercharge your business with custom-trained machine learning intelligence. We engineer bespoke NLP pipelines, predictive intelligence dashboards, computer vision setups, and deep neural architectures tailored to your operational needs.",
    image: aiDevImg,
    metrics: {
      "Model Accuracy": "99.8%",
      "Inference Speed": "<45ms",
      "Architecture": "Custom Neural"
    },
    features: [
      "Custom Large Language Model (LLM) fine-tuning & domain adaptation",
      "Predictive analytics, forecasting engines, and anomaly detection",
      "Computer vision setups including object tracking & optical recognition",
      "Semantic neural search pipelines utilizing vector database indexing"
    ],
    techStack: ["Python", "PyTorch", "TensorFlow", "HuggingFace", "LangChain", "Docker"],
    color: "from-cyan-500 to-blue-600",
    glowColor: "rgba(6, 182, 212, 0.25)",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-500/20",
    bgGlow: "bg-cyan-500/10"
  },
  {
    id: "web-development",
    icon: Code,
    title: "Web Development",
    subtitle: "High-Speed, Next-Gen SaaS & Enterprise Portals",
    desc: "Create robust, blisteringly fast web architectures that deliver phenomenal user experiences. From responsive client dashboards to highly secure database systems, we build fullstack solutions that scale seamlessly under heavy workloads.",
    image: webDevImg,
    metrics: {
      "PageSpeed Score": "100/100",
      "Server Uptime": "99.99%",
      "Time-to-Interactive": "<0.5s"
    },
    features: [
      "Custom React, Next.js, and TypeScript frontend applications",
      "Highly optimized Node.js and Go REST/GraphQL backends",
      "Real-time synchronized architectures with WebSocket protocols",
      "Secure SQL and NoSQL database structures (PostgreSQL, MongoDB, Redis)"
    ],
    techStack: ["React", "TypeScript", "Node.js", "Next.js", "PostgreSQL", "Tailwind CSS"],
    color: "from-purple-500 to-indigo-600",
    glowColor: "rgba(168, 85, 247, 0.25)",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    bgGlow: "bg-purple-500/10"
  },
  {
    id: "automation",
    icon: Sparkles,
    title: "Automation",
    subtitle: "SCADA Integrations, RPA & IoT Telemetry",
    desc: "Bridge the gap between physical machinery and cloud systems. We develop custom software automations, industrial SCADA interfaces, RPA scripts, and telemetry aggregators that process sensor logs with zero latency.",
    image: automationImg,
    metrics: {
      "Process Overhead": "-85%",
      "Throughput Rate": "+2.5x",
      "Deploy Cost": "-40%"
    },
    features: [
      "Industrial IoT telemetry and SCADA software configurations",
      "Robotic Process Automation (RPA) for redundant operational tasks",
      "Automated testing, build pipelines, and CI/CD configurations",
      "Real-time edge telemetry and visual node-based workflow systems"
    ],
    techStack: ["Node-RED", "Python", "MQTT", "Docker", "Rust", "Apache Kafka"],
    color: "from-amber-500 to-orange-600",
    glowColor: "rgba(245, 158, 11, 0.25)",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/20",
    bgGlow: "bg-amber-500/10"
  },
  {
    id: "chatbot-development",
    icon: MessageSquare,
    title: "Chatbot Development",
    subtitle: "Generative AI Chat Assistants & Dialog Systems",
    desc: "Deploy autonomous AI agents capable of resolving user requests round-the-clock. Our custom-designed conversational engines combine semantic vector search (RAG) with API tool-calling to automate customer support and onboarding pipelines.",
    image: chatbotDevImg,
    metrics: {
      "Auto-Resolution": "87%",
      "Support Overhead": "-60%",
      "Response Delay": "<1.2s"
    },
    features: [
      "Generative AI support agents with Retrieval-Augmented Generation (RAG)",
      "Multi-channel deployments (WhatsApp, Slack, Web widgets, Discord)",
      "Dynamic API tool-calling (database updates, CRM syncing, booking)",
      "Secure customer intent routing and seamless human-agent handoffs"
    ],
    techStack: ["LangChain", "FastAPI", "OpenAI SDK", "Gemini API", "Supabase", "Python"],
    color: "from-pink-500 to-rose-600",
    glowColor: "rgba(236, 72, 153, 0.25)",
    textColor: "text-pink-400",
    borderColor: "border-pink-500/20",
    bgGlow: "bg-pink-500/10"
  },
  {
    id: "data-analytics",
    icon: Activity,
    title: "Data Analytics",
    subtitle: "Big Data Visualizations & Business Intelligence Engines",
    desc: "Transform complex tabular data logs into actionable commercial insights. We build real-time interactive business intelligence reports, dynamic heatmaps, interactive charts, and predictive visual analytics nodes.",
    image: dataAnalyticsImg,
    metrics: {
      "Data Volume": "Terabyte-Scale",
      "Query Performance": "<100ms",
      "Visual Update": "Real-time"
    },
    features: [
      "Multi-source data ingestion and complex ETL pipeline modeling",
      "Real-time interactive analytical dashboards and telemetry consoles",
      "Statistical regression, anomaly detection, and fraud pattern alerts",
      "Flexible data architecture exporting (CSV, Parquet, secure database feeds)"
    ],
    techStack: ["Python", "Pandas", "D3.js", "ClickHouse", "Apache Spark", "Apache Superset"],
    color: "from-emerald-500 to-teal-600",
    glowColor: "rgba(16, 185, 129, 0.25)",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    bgGlow: "bg-emerald-500/10"
  },
  {
    id: "mobile-apps",
    icon: Smartphone,
    title: "Mobile Apps",
    subtitle: "Cross-Platform iOS & Android Masterpieces",
    desc: "Launch premium, fast-performing native applications. We specialize in developing fluid, cross-platform mobile apps with local data caching, biometric security, pushing push-notifications, and real-time offline synchronization.",
    image: mobileAppsImg,
    metrics: {
      "Refresh Rate": "120 FPS",
      "Offline Sync": "Instant",
      "Crash-Free Rate": "99.99%"
    },
    features: [
      "High-performance React Native and Flutter applications",
      "Local caching using SQLite, WatermelonDB, or Realm database storage",
      "Interactive push alerts, local notifications, and geofencing setups",
      "Full app compliance and distribution pipeline setups (App Store, Play Store)"
    ],
    techStack: ["React Native", "Flutter", "TypeScript", "Firebase", "SQLite", "App Store Connect"],
    color: "from-blue-500 to-sky-600",
    glowColor: "rgba(59, 130, 246, 0.25)",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    bgGlow: "bg-blue-500/10"
  }
];

const Capabilities = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<string>("");

  useEffect(() => {
    // Scroll to section hash if provided
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleActionClick = (capabilityTitle: string) => {
    setSelectedCapability(capabilityTitle);
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <SEO 
        title="Enterprise Capabilities | AI-SmartSys Solutions" 
        description="Explore AI SmartSyS's capabilities: AI development, web development, custom automation, generative AI chatbots, data analytics, and mobile applications."
        keywords="AI engineering capabilities, chatbot systems, data analytics, responsive web development, enterprise mobile apps, robotic automation"
        ogUrl="https://aismartsys.in/capabilities"
      />

      {/* Floating Network Background */}
      <NeuralCanvas />

      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[130px] pointer-events-none" />
      </div>

      <div className="relative z-10">

        {/* HERO SECTION */}
        <section className="relative pt-36 pb-20 overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs uppercase tracking-widest font-mono font-bold mb-6 inline-block">
                Our Tech Stack & Expertise
              </span>
              
              <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tight mb-8">
                Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Enterprise Capabilities</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10 font-medium">
                We engineer scalable, premium, and intelligent software systems that streamline your operations and maximize productivity.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-card/45 px-3 py-1.5 rounded-full border border-border/40">
                  <Cpu size={14} className="text-primary" /> Multi-Agent AI
                </span>
                <span className="flex items-center gap-1.5 bg-card/45 px-3 py-1.5 rounded-full border border-border/40">
                  <Layers size={14} className="text-secondary" /> Microservices
                </span>
                <span className="flex items-center gap-1.5 bg-card/45 px-3 py-1.5 rounded-full border border-border/40">
                  <Zap size={14} className="text-accent" /> Low Latency
                </span>
                <span className="flex items-center gap-1.5 bg-card/45 px-3 py-1.5 rounded-full border border-border/40">
                  <LineChart size={14} className="text-emerald-500" /> High ROI
                </span>
              </div>
            </motion.div>
          </div>

          {/* Decorative scroll down indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:block">
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border border-border/60 rounded-full flex justify-center p-1.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => {
                const el = document.getElementById("ai-development");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </motion.div>
          </div>
        </section>

        {/* DETAILED CAPABILITIES SECTIONS */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            {capabilities.map((cap, index) => {
              const IconComponent = cap.icon;
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={cap.id} 
                  id={cap.id}
                  className={`py-24 border-b border-border/20 last:border-0 scroll-mt-24`}
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center`}>
                    
                    {/* Content Block (lg:col-span-6) */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className={`lg:col-span-6 flex flex-col gap-6 ${!isEven ? "lg:order-2" : ""}`}
                    >
                      {/* Badge Header */}
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-card border ${cap.borderColor} ${cap.textColor}`}>
                          <IconComponent size={24} />
                        </div>
                        <span className={`text-sm font-bold uppercase tracking-wider ${cap.textColor}`}>
                          {cap.title}
                        </span>
                      </div>

                      {/* Header Title */}
                      <div className="text-left">
                        <h2 className="text-3xl md:text-4xl font-heading font-black text-foreground mb-3">
                          {cap.subtitle}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                          {cap.desc}
                        </p>
                      </div>

                      {/* Bullet features list */}
                      <div className="flex flex-col gap-3.5 my-2">
                        {cap.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-3 text-left">
                            <CheckCircle2 className={`w-5 h-5 shrink-0 ${cap.textColor} mt-0.5`} />
                            <span className="text-sm font-medium text-foreground/90">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tech badges */}
                      <div className="flex flex-wrap gap-2.5">
                        {cap.techStack.map((tech) => (
                          <span 
                            key={tech} 
                            className={`text-xs font-mono font-bold px-3 py-1 rounded-full bg-card border border-border/40 text-muted-foreground hover:text-foreground hover:border-border transition-colors`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Performance Panel Grid */}
                      <div className="grid grid-cols-3 gap-3 bg-card/30 backdrop-blur-sm border border-border/40 rounded-2xl p-4 mt-2">
                        {Object.entries(cap.metrics).map(([key, val]) => (
                          <div key={key} className="text-center">
                            <span className="block text-[9px] text-muted-foreground/80 uppercase tracking-widest font-mono">{key}</span>
                            <span className={`text-xs sm:text-sm font-black font-mono tracking-tight mt-0.5 block ${cap.textColor}`}>{val}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleActionClick(cap.title)}
                        className={`w-full sm:w-auto px-7 py-3.5 mt-2 rounded-xl font-extrabold text-xs uppercase tracking-wider text-white bg-gradient-to-r ${cap.color} shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn self-start`}
                      >
                        Deploy {cap.title} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>

                    {/* Image Stage Showcase (lg:col-span-6) */}
                    <div className={`lg:col-span-6 relative flex justify-center items-center ${!isEven ? "lg:order-1" : ""}`} style={{ perspective: "1000px" }}>
                      
                      {/* Cyber 3D Projection base glow */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          className="w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] rounded-full blur-[100px] transition-all duration-1000 opacity-25"
                          style={{
                            background: `radial-gradient(circle, ${cap.glowColor} 0%, transparent 70%)`
                          }}
                        />
                      </div>

                      {/* RENDERING DYNAMIC CYBER SHAPE FRAMES & DISTINCT ANIMATIONS BASED ON ID */}
                      {cap.id === "ai-development" && (
                        <div className="w-full flex justify-center relative">
                          {/* Octagonal Frame Brackets */}
                          <div className="absolute w-[88%] h-[104%] border border-dashed border-cyan-500/20 rounded-[2rem] pointer-events-none z-10 flex items-center justify-center scale-105">
                            <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl" />
                            <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl" />
                            <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl" />
                            <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-xl" />
                          </div>
                          <motion.div
                            animate={{ y: [0, -12, 0], rotate: [0, 1.5, -1.5, 0] }}
                            whileHover={{ scale: 1.05, rotateY: 8, rotateX: -4 }}
                            transition={{
                              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                              rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                              scale: { type: "spring", stiffness: 200, damping: 15 }
                            }}
                            className="relative z-20 w-full flex justify-center"
                          >
                            <div className="w-[85%] sm:w-[75%] md:w-[70%] aspect-square shape-octagonal bg-slate-950/40 p-1.5 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-[2px]">
                              <img 
                                src={cap.image} 
                                alt={cap.title}
                                className="w-full h-full object-cover shape-octagonal"
                              />
                            </div>
                          </motion.div>
                        </div>
                      )}

                      {cap.id === "web-development" && (
                        <div className="w-full flex justify-center relative">
                          <motion.div
                            animate={{ y: [0, -8, 0], x: [0, 5, -5, 0] }}
                            whileHover={{ scale: 1.05, rotateY: -8, rotateX: -4 }}
                            transition={{
                              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                              x: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                              scale: { type: "spring", stiffness: 200, damping: 15 }
                            }}
                            className="relative z-20 w-full flex justify-center"
                          >
                            {/* Web Browser Frame */}
                            <div className="w-[85%] sm:w-[75%] md:w-[72%] rounded-2xl border border-purple-500/30 bg-slate-950/40 shadow-[0_20px_50px_rgba(139,92,246,0.25)] overflow-hidden backdrop-blur-[2px]">
                              {/* Browser Title Bar */}
                              <div className="bg-slate-900/80 px-4 py-2.5 border-b border-purple-500/20 flex items-center gap-3">
                                <div className="flex gap-1.5 shrink-0">
                                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                </div>
                                <div className="bg-slate-950/60 rounded-lg text-[9px] font-mono text-purple-400/70 py-1 px-3 w-[65%] text-left truncate border border-purple-500/10">
                                  https://aismartsys.in/app
                                </div>
                              </div>
                              {/* Browser Content (Image) */}
                              <div className="p-1.5 bg-slate-950/20">
                                <img 
                                  src={cap.image} 
                                  alt={cap.title}
                                  className="w-full h-auto object-contain rounded-xl"
                                />
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}

                      {cap.id === "automation" && (
                        <div className="w-full flex justify-center relative">
                          <motion.div
                            animate={{ scale: [1, 1.03, 1], rotate: [0, 1.2, -1.2, 0] }}
                            whileHover={{ scale: 1.05, rotateY: 8, rotateX: -4 }}
                            transition={{
                              scale: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                              rotate: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
                              rotateY: { type: "spring", stiffness: 200, damping: 15 }
                            }}
                            className="relative z-20 w-full flex justify-center"
                          >
                            <div className="w-[85%] sm:w-[75%] md:w-[70%] shape-chamfered bg-slate-950/40 p-2 border border-amber-500/35 shadow-[0_0_30px_rgba(245,158,11,0.15)] backdrop-blur-[2px] relative overflow-hidden">
                              <img 
                                src={cap.image} 
                                alt={cap.title}
                                className="w-full h-full object-cover shape-chamfered"
                              />
                              {/* Telemetry label overlay */}
                              <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-amber-500/25 px-2 py-0.5 rounded text-[8px] font-mono text-amber-400 select-none tracking-widest uppercase animate-pulse">
                                SYS_READY: TELEM_ON
                              </div>
                              {/* Industrial corner crosshairs */}
                              <span className="absolute top-2 left-2 text-[10px] text-amber-500/60 font-mono font-bold select-none">+</span>
                              <span className="absolute top-2 right-2 text-[10px] text-amber-500/60 font-mono font-bold select-none">+</span>
                            </div>
                          </motion.div>
                        </div>
                      )}

                      {cap.id === "chatbot-development" && (
                        <div className="w-full flex justify-center relative">
                          <motion.div
                            animate={{ x: [0, 7, 0], y: [0, -9, 0] }}
                            whileHover={{ scale: 1.06, rotateY: -8 }}
                            transition={{
                              x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                              y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                              scale: { type: "spring", stiffness: 250, damping: 12 }
                            }}
                            className="relative z-20 w-full flex justify-center"
                          >
                            {/* Message Bubble frame container */}
                            <div className="w-[85%] sm:w-[75%] md:w-[70%] shape-bubble bg-slate-950/40 p-2 border-2 border-pink-500/30 shadow-[0_15px_40px_rgba(236,72,153,0.2)] backdrop-blur-[2px] relative">
                              <img 
                                src={cap.image} 
                                alt={cap.title}
                                className="w-full h-full object-cover shape-bubble"
                              />
                              <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white rounded-full p-1 shadow-lg border border-white/10 flex items-center justify-center">
                                <MessageSquare size={12} />
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}

                      {cap.id === "data-analytics" && (
                        <div className="w-full flex justify-center relative">
                          <motion.div
                            animate={{ y: [0, -12, 0] }}
                            whileHover={{ scale: 1.05, rotateY: 8 }}
                            transition={{
                              y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
                              scale: { type: "spring", stiffness: 200, damping: 15 }
                            }}
                            className="relative z-20 w-full flex justify-center"
                          >
                            {/* Dashboard grid analyzer screen */}
                            <div className="w-[85%] sm:w-[75%] md:w-[70%] rounded-2xl bg-slate-950/40 p-2 border border-emerald-500/35 shadow-[0_0_35px_rgba(16,185,129,0.2)] backdrop-blur-[2px] relative overflow-hidden">
                              {/* Grid lines pattern overlay */}
                              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10" />
                              <img 
                                src={cap.image} 
                                alt={cap.title}
                                className="w-full h-full object-cover rounded-xl"
                              />
                              {/* Scanning Laser beam */}
                              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute left-0 z-30 animate-scan-laser shadow-[0_0_8px_#10b981]" />
                            </div>
                          </motion.div>
                        </div>
                      )}

                      {cap.id === "mobile-apps" && (
                        <div className="w-full flex justify-center relative">
                          <motion.div
                            animate={{ y: [0, -15, 0] }}
                            whileHover={{ scale: 1.05, rotateY: -8, rotateX: 3 }}
                            transition={{
                              y: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
                              scale: { type: "spring", stiffness: 200, damping: 15 }
                            }}
                            className="relative z-20 w-full flex justify-center"
                          >
                            {/* Smartphone Device Mockup Frame */}
                            <div className="w-[80%] sm:w-[70%] md:w-[62%] max-w-[270px] aspect-[9/18.5] border-[6px] border-slate-950 bg-slate-950/60 rounded-[2.5rem] relative flex items-center justify-center shadow-2xl p-1 overflow-hidden backdrop-blur-md ring-2 ring-blue-500/30">
                              {/* Dynamic Island notch */}
                              <div className="w-20 h-4 bg-slate-950 rounded-full absolute top-2.5 left-1/2 -translate-x-1/2 z-30 border border-white/5" />
                              {/* Swipe home indicator */}
                              <div className="w-20 h-1 bg-slate-700/60 rounded-full absolute bottom-1.5 left-1/2 -translate-x-1/2 z-30" />
                              {/* Screen Content (Image) */}
                              <div className="w-full h-full overflow-hidden rounded-[2rem] bg-slate-950">
                                <img 
                                  src={cap.image} 
                                  alt={cap.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}

                      {/* Tech Scanner light overlay beam (for fallback or general accent) */}
                      {!["data-analytics", "web-development", "mobile-apps"].includes(cap.id) && (
                        <motion.div 
                          className="w-[60%] h-[150px] bg-gradient-to-t absolute bottom-[10px] left-[20%] rounded-t-full blur-3xl pointer-events-none z-10"
                          style={{
                            background: `linear-gradient(to top, ${cap.glowColor.replace("0.25", "0.2")}, transparent)`
                          }}
                          animate={{
                            opacity: [0.1, 0.35, 0.1]
                          }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA BOTTOM CONTACT ROW */}
        <section className="py-24 bg-card/15 border-t border-border/10">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card border-white/5 bg-slate-950/20 p-8 md:p-12 rounded-3xl glow-cyan flex flex-col items-center gap-6"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-black text-foreground">
                Ready to transform your business operations?
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl font-medium">
                Connect with our systems architects today for a free project scoping session and deployment analysis.
              </p>
              <button
                onClick={() => handleActionClick("General Consultation")}
                className="px-8 py-4 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-xl hover:bg-primary/95 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center gap-2"
              >
                Schedule scoping call <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => navigate("/dashboard")}
      />
    </div>
  );
};

export default Capabilities;
