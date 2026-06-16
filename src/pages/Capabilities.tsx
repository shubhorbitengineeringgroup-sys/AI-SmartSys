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
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
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
                      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
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

                      {/* Floating bounding brackets */}
                      <div className="absolute w-[85%] h-[80%] border border-dashed border-primary/5 rounded-[2rem] pointer-events-none z-10 flex items-center justify-center">
                        <span className="absolute top-0 left-0 w-6 h-6 border-t border-l rounded-tl-xl transition-colors duration-1000" style={{ borderColor: cap.glowColor }} />
                        <span className="absolute top-0 right-0 w-6 h-6 border-t border-r rounded-tr-xl transition-colors duration-1000" style={{ borderColor: cap.glowColor }} />
                        <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l rounded-bl-xl transition-colors duration-1000" style={{ borderColor: cap.glowColor }} />
                        <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r rounded-br-xl transition-colors duration-1000" style={{ borderColor: cap.glowColor }} />
                      </div>

                      {/* Image element with smooth levitating animation */}
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        whileHover={{ scale: 1.05, rotateY: isEven ? 8 : -8, rotateX: -4 }}
                        transition={{
                          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                          scale: { type: "spring", stiffness: 200, damping: 15 },
                          rotateY: { type: "spring", stiffness: 200, damping: 15 },
                          rotateX: { type: "spring", stiffness: 200, damping: 15 }
                        }}
                        className="relative z-20 w-full flex justify-center"
                      >
                        <img 
                          src={cap.image} 
                          alt={cap.title}
                          className="w-[85%] sm:w-[75%] md:w-[70%] max-h-[350px] object-contain rounded-2xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/5 bg-slate-950/20 backdrop-blur-[2px]"
                        />
                      </motion.div>

                      {/* Tech Scanner light overlay beam */}
                      <motion.div 
                        className="w-[60%] h-[150px] bg-gradient-to-t absolute bottom-[10px] left-[20%] rounded-t-full blur-3xl pointer-events-none z-10"
                        style={{
                          background: `linear-gradient(to top, ${cap.glowColor.replace("0.25", "0.15")}, transparent)`
                        }}
                        animate={{
                          opacity: [0.1, 0.35, 0.1]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      />
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
