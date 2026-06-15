import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, X, Send, Bot, Sparkles, User, FileText, CheckCircle, 
  AlertCircle, Mic, MicOff, Volume2, VolumeX, Maximize2, Minimize2, 
  Settings, Trash2, HelpCircle, ChevronRight, Briefcase, DollarSign, Clock 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { askGemini, type GeminiMessage } from "@/lib/gemini";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

type ChatMode = "chat" | "form-name" | "form-email" | "form-phone" | "form-message" | "form-submitting" | "form-complete";
type TerminalTheme = "cyber-blue" | "matrix" | "holo-pink";

// Theme configuration palette mapping
const THEMES = {
  "cyber-blue": {
    bgDark: "bg-slate-950/85 backdrop-blur-2xl border-white/10 text-slate-100",
    bgLight: "bg-white/80 backdrop-blur-2xl border-slate-200 text-slate-800",
    border: "border-white/10",
    accent: "from-cyan-500 via-indigo-500 to-purple-600",
    accentGlow: "shadow-[0_8px_32px_rgba(6,182,212,0.4)]",
    accentLight: "from-cyan-500/10 to-indigo-500/10 hover:from-cyan-500/20 hover:to-indigo-500/20 text-cyan-700 dark:text-cyan-200 border-cyan-500/25 hover:border-cyan-400",
    textAccent: "text-cyan-600 dark:text-cyan-400",
    textAccentLight: "text-cyan-500 dark:text-cyan-300",
    glow: "shadow-[0_0_50px_rgba(6,182,212,0.15)]",
    bubbleUser: "bg-gradient-to-br from-cyan-500 to-indigo-600 text-white border-cyan-400/40 shadow-[0_4px_20px_rgba(6,182,212,0.3)]",
    bubbleBotDark: "bg-slate-900/80 border border-white/5 text-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
    bubbleBotLight: "bg-slate-100 border border-slate-200/60 text-slate-800 shadow-[0_4px_15px_rgba(0,0,0,0.05)]",
    orbs: ["bg-cyan-500/20", "bg-purple-500/20"],
    headerBorder: "via-cyan-500/50",
    faceGlow: "drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]",
    micGlow: "bg-cyan-500/20 border-cyan-500/50",
    pulse: "bg-cyan-500"
  },
  "matrix": {
    bgDark: "bg-black/95 backdrop-blur-2xl border-emerald-500/20 text-emerald-400",
    bgLight: "bg-emerald-950/10 backdrop-blur-2xl border-emerald-500/30 text-emerald-950",
    border: "border-emerald-500/20",
    accent: "from-emerald-600 via-green-600 to-emerald-950",
    accentGlow: "shadow-[0_8px_32px_rgba(16,185,129,0.4)]",
    accentLight: "from-emerald-500/15 to-green-500/15 hover:from-emerald-500/25 hover:to-green-500/25 text-emerald-700 dark:text-emerald-200 border-emerald-500/25 hover:border-emerald-400",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    textAccentLight: "text-emerald-500 dark:text-emerald-300",
    glow: "shadow-[0_0_55px_rgba(16,185,129,0.15)]",
    bubbleUser: "bg-gradient-to-br from-emerald-600 to-green-800 text-green-100 border-emerald-500/40 font-mono shadow-[0_4px_20px_rgba(16,185,129,0.2)]",
    bubbleBotDark: "bg-black border border-emerald-500/20 text-emerald-400 font-mono shadow-[0_4px_20px_rgba(0,0,0,0.5)]",
    bubbleBotLight: "bg-emerald-50 border border-emerald-500/20 text-emerald-900 font-mono shadow-[0_4px_15px_rgba(0,0,0,0.05)]",
    orbs: ["bg-emerald-500/10", "bg-green-600/10"],
    headerBorder: "via-emerald-500/50",
    faceGlow: "drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]",
    micGlow: "bg-emerald-500/20 border-emerald-500/50",
    pulse: "bg-emerald-500"
  },
  "holo-pink": {
    bgDark: "bg-neutral-950/85 backdrop-blur-2xl border-pink-500/10 text-neutral-200",
    bgLight: "bg-pink-50/10 backdrop-blur-2xl border-pink-500/20 text-neutral-800",
    border: "border-pink-500/10",
    accent: "from-pink-500 via-rose-500 to-indigo-600",
    accentGlow: "shadow-[0_8px_32px_rgba(236,72,153,0.4)]",
    accentLight: "from-pink-500/10 to-rose-500/10 hover:from-pink-500/20 hover:to-rose-500/20 text-pink-700 dark:text-pink-200 border-pink-500/25 hover:border-pink-400",
    textAccent: "text-pink-600 dark:text-pink-400",
    textAccentLight: "text-pink-500 dark:text-pink-300",
    glow: "shadow-[0_0_50px_rgba(236,72,153,0.15)]",
    bubbleUser: "bg-gradient-to-br from-pink-500 to-rose-600 text-white border-pink-400/40 shadow-[0_4px_20px_rgba(236,72,153,0.3)]",
    bubbleBotDark: "bg-neutral-900/80 border border-white/5 text-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
    bubbleBotLight: "bg-neutral-100 border border-pink-200 text-neutral-800 shadow-[0_4px_15px_rgba(0,0,0,0.05)]",
    orbs: ["bg-pink-500/20", "bg-rose-500/20"],
    headerBorder: "via-pink-500/50",
    faceGlow: "drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]",
    micGlow: "bg-pink-500/20 border-pink-500/50",
    pulse: "bg-pink-500"
  }
};

// Canvas confetti particle animation
const CanvasConfetti = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const colors = ["#06b6d4", "#3b82f6", "#a855f7", "#ec4899", "#10b981", "#f59e0b"];
    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 5 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 2.5 + 2,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 3 - 1.5,
    }));

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    const update = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.size % 2 === 0) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      animationId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full z-30" />;
};

// Copyable Code block component
const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  
  const storedTheme = typeof window !== "undefined" ? localStorage.getItem("smarty_chat_theme") || "cyber-blue" : "cyber-blue";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code snippet copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3.5 rounded-xl border border-white/10 bg-slate-950 font-mono text-[11px] overflow-hidden shadow-inner w-full max-w-full">
      <div className="flex justify-between items-center bg-slate-900/50 px-3 py-1.5 border-b border-white/5 text-slate-400 select-none">
        <span>Console Script</span>
        <button
          onClick={handleCopy}
          className="text-[10px] hover:text-white px-2.5 py-0.5 rounded hover:bg-white/5 transition-all font-semibold uppercase tracking-wider"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className={`p-3 overflow-x-auto text-slate-300 whitespace-pre cute-scrollbar ${storedTheme}-scroll max-w-full leading-relaxed`}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Markdown text renderer helper
const renderMessageText = (text: string) => {
  if (!text) return "";

  const codeBlockRegex = /```([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const textBefore = text.substring(lastIndex, match.index);
    if (textBefore) {
      parts.push({ type: "text", content: textBefore });
    }
    parts.push({ type: "code-block", content: match[1] });
    lastIndex = codeBlockRegex.lastIndex;
  }

  const textAfter = text.substring(lastIndex);
  if (textAfter) {
    parts.push({ type: "text", content: textAfter });
  }

  return parts.map((part, index) => {
    if (part.type === "code-block") {
      return <CodeBlock key={index} code={part.content.trim()} />;
    }

    return (
      <span 
        key={index} 
        className="block space-y-1.5"
        dangerouslySetInnerHTML={{ __html: parseMarkdownInline(part.content) }} 
      />
    );
  });
};

const parseMarkdownInline = (text: string): string => {
  let html = text;

  // Escape HTML tags to prevent XSS
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold **text**
  html = html.replace(/\*\*([\s\S]*?)\*\*/g, "<strong>$1</strong>");

  // Italic *text*
  html = html.replace(/\*([\s\S]*?)\*/g, "<em>$1</em>");

  // Inline code `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-900 dark:bg-slate-800 border border-black/10 dark:border-white/15 px-1 py-0.5 rounded text-cyan-600 dark:text-cyan-300 font-mono text-[11px]">$1</code>');

  // Bullet point list
  html = html.replace(/^\s*-\s+(.+)$/gm, '<span class="flex items-start gap-1.5 pl-1.5"><span class="text-cyan-500 mt-1.5 shrink-0 w-1 h-1 rounded-full bg-cyan-500"></span><span>$1</span></span>');

  // Line breaks
  html = html.replace(/\n/g, "<br />");

  return html;
};

// Robot Mascot SVG
const RobotFace = ({ expression, size = 40, theme = "cyber-blue" }: { expression: "idle" | "typing" | "happy" | "winking" | "listening" | "speaking"; size?: number; theme?: TerminalTheme }) => {
  const currentTheme = THEMES[theme];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={currentTheme.faceGlow}>
      <defs>
        {/* 3D Sphere Gradients */}
        <radialGradient id="ai-core" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={theme === "matrix" ? "#10b981" : theme === "holo-pink" ? "#ec4899" : "#c084fc"} />
          <stop offset="50%" stopColor={theme === "matrix" ? "#047857" : theme === "holo-pink" ? "#be185d" : "#3b82f6"} />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
        <radialGradient id="eye-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={theme === "matrix" ? "#a7f3d0" : theme === "holo-pink" ? "#fbcfe8" : "#67e8f9"} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="metal-ring" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Outer Metal Ring */}
      <circle cx="50" cy="50" r="48" fill="url(#metal-ring)" />
      
      {/* Inner Glowing Core */}
      <circle cx="50" cy="50" r="42" fill="url(#ai-core)" />

      {/* Floating Holographic Elements */}
      <path d="M 20 50 Q 50 20 80 50 Q 50 80 20 50" fill="none" stroke="rgba(103,232,249,0.3)" strokeWidth="2" className="animate-[spin_12s_linear_infinite]" style={{ transformOrigin: "50% 50%" }} />
      <path d="M 30 50 Q 50 30 70 50 Q 50 70 30 50" fill="none" stroke="rgba(103,232,249,0.5)" strokeWidth="1" className="animate-[spin_9s_linear_infinite_reverse]" style={{ transformOrigin: "50% 50%" }} />

      {/* Antenna with blinking beacon */}
      <line x1="50" y1="8" x2="50" y2="20" stroke="#94a3b8" strokeWidth="4" />
      <circle cx="50" cy="8" r="4" fill={theme === "matrix" ? "#34d399" : theme === "holo-pink" ? "#f472b6" : "#67e8f9"} className="animate-pulse" />

      {/* Expression / Face */}
      {expression === "idle" && (
        <g>
          <circle cx="35" cy="48" r="6" fill="#fff" />
          <circle cx="65" cy="48" r="6" fill="#fff" />
          <circle cx="35" cy="48" r="12" fill="url(#eye-glow)" />
          <circle cx="65" cy="48" r="12" fill="url(#eye-glow)" />
          <path d="M 42 66 Q 50 71 58 66" stroke={theme === "matrix" ? "#34d399" : theme === "holo-pink" ? "#f472b6" : "#67e8f9"} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      )}
      {expression === "listening" && (
        <g>
          <circle cx="35" cy="48" r="6" fill="#67e8f9" className="animate-ping" style={{ transformOrigin: "35% 48%" }} />
          <circle cx="65" cy="48" r="6" fill="#67e8f9" className="animate-ping" style={{ transformOrigin: "65% 48%" }} />
          <circle cx="35" cy="48" r="5" fill="#fff" />
          <circle cx="65" cy="48" r="5" fill="#fff" />
          <path d="M 35 66 C 40 60, 60 60, 65 66" stroke={theme === "matrix" ? "#34d399" : theme === "holo-pink" ? "#f472b6" : "#67e8f9"} strokeWidth="3" strokeLinecap="round" fill="none" className="animate-pulse" />
        </g>
      )}
      {expression === "speaking" && (
        <g>
          <circle cx="35" cy="48" r="7" fill="#fff" />
          <circle cx="65" cy="48" r="7" fill="#fff" />
          {/* Speaking Equalizer waves for mouth */}
          <line x1="42" y1="66" x2="42" y2="72" stroke="#67e8f9" strokeWidth="2.5" className="animate-pulse" />
          <line x1="46" y1="64" x2="46" y2="74" stroke="#c084fc" strokeWidth="2.5" className="animate-bounce" />
          <line x1="50" y1="63" x2="50" y2="75" stroke="#f472b6" strokeWidth="2.5" className="animate-pulse" />
          <line x1="54" y1="64" x2="54" y2="74" stroke="#c084fc" strokeWidth="2.5" className="animate-bounce" />
          <line x1="58" y1="66" x2="58" y2="72" stroke="#67e8f9" strokeWidth="2.5" className="animate-pulse" />
        </g>
      )}
      {expression === "typing" && (
        <g>
          <ellipse cx="35" cy="48" rx="8" ry="2" fill="#fde047" className="animate-pulse" />
          <ellipse cx="65" cy="48" rx="8" ry="2" fill="#fde047" className="animate-pulse" />
          <circle cx="50" cy="67" r="3" fill="#fde047" className="animate-pulse" />
        </g>
      )}
      {expression === "happy" && (
        <g>
          <path d="M 28 50 Q 35 40 42 50" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M 58 50 Q 65 40 72 50" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M 35 63 Q 50 78 65 63" stroke={theme === "holo-pink" ? "#f472b6" : theme === "matrix" ? "#34d399" : "#ff007f"} strokeWidth="4.5" strokeLinecap="round" fill="none" />
        </g>
      )}
      {expression === "winking" && (
        <g>
          <circle cx="35" cy="48" r="6" fill="#fff" />
          <circle cx="35" cy="48" r="12" fill="url(#eye-glow)" />
          <path d="M 58 48 L 72 48" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 40 66 Q 50 73 60 66" stroke={theme === "holo-pink" ? "#f472b6" : theme === "matrix" ? "#34d399" : "#67e8f9"} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      )}
      
      {/* Highlighting curve for 3D sphere effect */}
      <path d="M 15 50 A 35 35 0 0 1 50 15 A 35 35 0 0 1 85 50" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
};

export const AIChatbot = () => {
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  
  const isLight = theme === "light";
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expression, setExpression] = useState<"idle" | "typing" | "happy" | "winking" | "listening" | "speaking">("idle");
  const [sessionId, setSessionId] = useState("");
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [terminalTheme, setTerminalTheme] = useState<TerminalTheme>("cyber-blue");
  
  // Audio state
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(false);
  
  // Dropdowns & Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Project Brief Form Builder State (Dashboard panel)
  const [briefService, setBriefService] = useState("Website Design & Development");
  const [briefBudget, setBriefBudget] = useState("$1,000 - $5,000 (~₹83,000 - ₹4,15,000 INR)");
  const [briefTimeline, setBriefTimeline] = useState("2-3 Months");
  const [briefDetails, setBriefDetails] = useState("");

  // Requirement Form State
  const [mode, setMode] = useState<ChatMode>("chat");
  const [reqForm, setReqForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formInputVal, setFormInputVal] = useState("");
  const [formError, setFormError] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const colors = THEMES[terminalTheme];

  const [isNearContact, setIsNearContact] = useState(false);

  // Intersection Observer to detect if contact section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearContact(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const contactElement = document.getElementById("contact");
    if (contactElement) {
      observer.observe(contactElement);
    }

    return () => {
      if (contactElement) {
        observer.unobserve(contactElement);
      }
    };
  }, []);

  // Initialize Session ID
  useEffect(() => {
    let sid = localStorage.getItem("smarty_chat_session_id");
    if (!sid) {
      sid = crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("smarty_chat_session_id", sid);
    }
    setSessionId(sid);

    // Initial default theme load from local storage
    const storedTheme = localStorage.getItem("smarty_chat_theme");
    if (storedTheme && (storedTheme === "cyber-blue" || storedTheme === "matrix" || storedTheme === "holo-pink")) {
      setTerminalTheme(storedTheme as TerminalTheme);
    }
  }, []);

  // Fetch / Migrate conversation logs based on Auth Status
  useEffect(() => {
    if (!sessionId) return;

    const syncHistory = async () => {
      if (isAuthenticated && user?.email) {
        try {
          // 1. Migrate any guest messages generated in current session to the logged-in user
          await supabase
            .from("chat_messages")
            .update({ user_email: user.email, user_name: user.name || user.email.split("@")[0] })
            .eq("session_id", sessionId);

          // 2. Load user's complete history across all sessions
          const { data, error } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("user_email", user.email)
            .order("created_at", { ascending: true });

          if (error) throw error;

          if (data && data.length > 0) {
            const formatted = data.map((d: any) => ({
              id: d.id,
              sender: d.sender as "user" | "bot",
              text: d.message,
              timestamp: new Date(d.created_at)
            }));
            setMessages(formatted);
          } else {
            loadDefaultWelcome();
          }
        } catch (err) {
          console.warn("Could not retrieve profile transcripts, using local logs.", err);
          loadLocalHistory();
        }
      } else {
        loadLocalHistory();
      }
    };

    syncHistory();
  }, [isAuthenticated, user, sessionId]);

  // Load message logs from local storage (Fallback/Guest)
  const loadLocalHistory = () => {
    const local = localStorage.getItem(`smarty_chat_logs_${sessionId}`);
    if (local) {
      try {
        const parsed = JSON.parse(local).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(parsed);
      } catch {
        loadDefaultWelcome();
      }
    } else {
      loadDefaultWelcome();
    }
  };

  const loadDefaultWelcome = () => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: "Beep boop! *spins antenna* Welcome! I am Smarty, your AI technology buddy. 🤖 Let me know if you have questions or click 'Submit Requirements' to share a project requirement with us!",
        timestamp: new Date()
      }
    ]);
  };

  // Sync state to local storage when guest messages change
  useEffect(() => {
    if (sessionId && !isAuthenticated && messages.length > 0) {
      localStorage.setItem(`smarty_chat_logs_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, isAuthenticated, sessionId]);

  // Scroll stream
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, mode]);

  // Alert new messages
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasNewMessages(true);
    }
  }, [messages, isOpen]);

  // Sync open state to body tag
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("chatbot-open");
    } else {
      document.body.classList.remove("chatbot-open");
    }
    return () => {
      document.body.classList.remove("chatbot-open");
    };
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessages(false);
      setExpression("winking");
      setTimeout(() => setExpression("idle"), 1200);
    } else {
      setIsMaximized(false);
      // Cancel speech if closing
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Voice synthesis text-to-speech reader
  const speakReply = (text: string) => {
    if (!isSpeakingEnabled || typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    // Clean markdown and emojis
    const clean = text
      .replace(/\*[\s\S]*?\*/g, "") // remove robotic expressions *beep*
      .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, ""); // remove emojis

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.pitch = 1.35; 
    utterance.rate = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google"));
    if (targetVoice) utterance.voice = targetVoice;

    utterance.onstart = () => setExpression("speaking");
    utterance.onend = () => setExpression("idle");
    utterance.onerror = () => setExpression("idle");

    window.speechSynthesis.speak(utterance);
  };

  // Voice recognition speech-to-text capturer
  const toggleSpeechInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser version.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      setExpression("idle");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN";

      rec.onstart = () => {
        setIsListening(true);
        setExpression("listening");
        toast.info("Listening... Speak clearly.");
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + (prev ? " " : "") + transcript);
        toast.success("Voice text added!");
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition error:", event.error);
        setIsListening(false);
        setExpression("idle");
      };

      rec.onend = () => {
        setIsListening(false);
        setExpression("idle");
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error("Speech initialization error:", err);
      setIsListening(false);
      setExpression("idle");
    }
  };

  // Save conversation log in database (Supabase)
  const saveMessageToDatabase = async (sender: "user" | "bot", text: string) => {
    try {
      const dbUserEmail = isAuthenticated && user?.email ? user.email : (reqForm.email || null);
      const dbUserName = isAuthenticated && user?.name ? user.name : (reqForm.name || null);

      const { error } = await supabase.from("chat_messages").insert({
        session_id: sessionId,
        sender,
        message: text,
        user_name: dbUserName,
        user_email: dbUserEmail
      });
      if (error) console.error("Database sync log failed:", error.message);
    } catch (err) {
      console.warn("Supabase client is offline, message saved locally.");
    }
  };

  // Submit guided client requirements form
  const submitRequirementsToDatabase = async (finalMessage: string) => {
    const messageBody = `[Submitted via Chatbot Guided Form]\nProject Requirements: ${finalMessage}`;
    try {
      const dbUserEmail = isAuthenticated && user?.email ? user.email : reqForm.email;
      const dbUserName = isAuthenticated && user?.name ? user.name : reqForm.name;

      const { error } = await supabase.from("contact_submissions").insert({
        name: dbUserName || "Anonymous Form User",
        email: dbUserEmail || "N/A",
        phone: reqForm.phone || "Not provided",
        message: messageBody,
        source: "ai_chatbot",
        status: "new"
      });
      if (error) throw error;
      toast.success("Requirements submitted successfully! Our team will contact you.");
    } catch (err: any) {
      console.error("Supabase Submission Error:", err);
      toast.success("Requirements logged successfully (Demo Submission).");
    }
  };

  // Handle message submissions
  const handleChatSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText("");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    saveMessageToDatabase("user", userText);

    setIsTyping(true);
    setExpression("typing");

    const geminiHistory: GeminiMessage[] = messages
      .filter(m => m.id !== "welcome")
      .map(m => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

    const botReply = await askGemini(userText, geminiHistory);

    setIsTyping(false);
    setExpression("happy");
    setTimeout(() => setExpression("idle"), 1400);

    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: botReply,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMsg]);
    saveMessageToDatabase("bot", botReply);

    // Speak response if toggled
    speakReply(botReply);
  };

  const handleChipClick = (chipText: string) => {
    if (chipText.toLowerCase().includes("requirement")) {
      startRequirementForm();
    } else {
      setInputText(chipText);
    }
  };

  // Guided wizard flow
  const startRequirementForm = () => {
    setMode("form-name");
    setFormInputVal("");
    setFormError("");
    setMessages(prev => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: "bot",
        text: "Beep boop! Let's build your project configuration. What is your full name? 📝",
        timestamp: new Date()
      }
    ]);
  };

  const handleFormNext = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const val = formInputVal.trim();

    if (mode === "form-name") {
      if (val.length < 2) {
        setFormError("Name must be at least 2 characters.");
        return;
      }
      setReqForm(prev => ({ ...prev, name: val }));
      setMessages(prev => [
        ...prev,
        { id: `user-name-${Date.now()}`, sender: "user", text: val, timestamp: new Date() },
        { id: `bot-q-email-${Date.now()}`, sender: "bot", text: `Got it, ${val}! What is your email address? 📧`, timestamp: new Date() }
      ]);
      setMode("form-email");
      setFormInputVal("");
    } 
    
    else if (mode === "form-email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        setFormError("Please enter a valid email address.");
        return;
      }
      setReqForm(prev => ({ ...prev, email: val }));
      setMessages(prev => [
        ...prev,
        { id: `user-email-${Date.now()}`, sender: "user", text: val, timestamp: new Date() },
        { id: `bot-q-phone-${Date.now()}`, sender: "bot", text: "Excellent! What is your phone number? (Type 'skip' to bypass) 📞", timestamp: new Date() }
      ]);
      setMode("form-phone");
      setFormInputVal("");
    } 
    
    else if (mode === "form-phone") {
      if (!val) {
        setFormError("Please enter a number or type 'skip'.");
        return;
      }
      const isSkip = val.toLowerCase() === "skip";
      if (!isSkip) {
        const digits = val.replace(/[^0-9]/g, "");
        if (digits.length < 10 || digits.length > 15) {
          setFormError("Phone number must contain between 10 and 15 digits.");
          return;
        }
      }
      const phoneVal = isSkip ? "Not provided" : val;
      setReqForm(prev => ({ ...prev, phone: phoneVal }));
      setMessages(prev => [
        ...prev,
        { id: `user-phone-${Date.now()}`, sender: "user", text: val, timestamp: new Date() },
        { id: `bot-q-msg-${Date.now()}`, sender: "bot", text: "Lastly, what project requirements or questions would you like to submit? (Provide at least 100 characters) 📝", timestamp: new Date() }
      ]);
      setMode("form-message");
      setFormInputVal("");
    } 
    
    else if (mode === "form-message") {
      if (val.length < 100) {
        setFormError(`Describe requirements in at least 100 characters. Currently ${val.length}/100.`);
        return;
      }
      
      setMode("form-submitting");
      setExpression("typing");
      
      const updatedForm = { ...reqForm, message: val };
      setReqForm(updatedForm);

      setMessages(prev => [
        ...prev,
        { id: `user-msg-${Date.now()}`, sender: "user", text: val, timestamp: new Date() }
      ]);

      setTimeout(async () => {
        await submitRequirementsToDatabase(val);
        saveMessageToDatabase("user", `[FORM SUBMISSION] Name: ${updatedForm.name}, Email: ${updatedForm.email}, Phone: ${updatedForm.phone}, Message: ${val}`);
        
        setMessages(prev => [
          ...prev,
          {
            id: `bot-complete-${Date.now()}`,
            sender: "bot",
            text: `Perfect! I have sent your requirements to our main brain. 🚀 We will reach out to you at ${updatedForm.email} shortly! *excited beep boop*`,
            timestamp: new Date()
          }
        ]);
        setMode("form-complete");
        setExpression("happy");
      }, 1000);
    }
  };

  const cancelForm = () => {
    setMode("chat");
    setExpression("idle");
    setMessages(prev => [
      ...prev,
      {
        id: `sys-cancel-${Date.now()}`,
        sender: "bot",
        text: "Form cancelled. Back in general chat mode! Ask me anything. *beeps*",
        timestamp: new Date()
      }
    ]);
  };

  const resetFormComplete = () => {
    setMode("chat");
    setExpression("idle");
  };

  const clearChatHistory = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`smarty_chat_logs_${sessionId}`);
    }
    loadDefaultWelcome();
    setIsSettingsOpen(false);
    toast.success("Conversation history cleared!");
  };

  const handleThemeChange = (theme: TerminalTheme) => {
    setTerminalTheme(theme);
    localStorage.setItem("smarty_chat_theme", theme);
    toast.success(`Theme updated to ${theme.replace("-", " ")}!`);
  };

  // Generate automated brief from dashboard
  const handleGenerateBrief = () => {
    if (!briefDetails.trim()) {
      toast.error("Please add some project description first.");
      return;
    }
    const brief = `Hi Smarty! I want to submit a project brief:\n- **Service**: ${briefService}\n- **Budget**: ${briefBudget}\n- **Timeline**: ${briefTimeline}\n- **Description**: ${briefDetails}\nCan you review this client requirement?`;
    setInputText(brief);
    setBriefDetails("");
    toast.success("Brief copied into chat input! Press Send to initiate audit.");
  };

  return (
    <div className={`fixed z-[100] select-none ${isMaximized ? "inset-0 flex items-center justify-center p-4" : "bottom-6 left-6"} ${!isOpen && isNearContact ? "hidden lg:block" : ""}`}>
      {/* 1. Chatbot Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 bg-gradient-to-r ${colors.accent} border border-white/30 group ${colors.accentGlow}`}
        >
          <span className={`absolute inset-0 rounded-full ${colors.pulse} opacity-30 group-hover:scale-125 transition-transform duration-500 animate-ping`} />
          <div className="relative animate-float">
            <RobotFace expression={hasNewMessages ? "happy" : "idle"} size={44} theme={terminalTheme} />
            {hasNewMessages && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 border-[3px] border-indigo-600 animate-bounce shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
            )}
          </div>
        </button>
      )}

      {/* 2. Chatbot Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isMaximized ? { opacity: 0, scale: 0.95 } : { opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={isMaximized ? { opacity: 0, scale: 0.95 } : { opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className={`rounded-[24px] ${isLight ? colors.bgLight : colors.bgDark} border ${isLight ? "border-slate-200" : colors.border} ${colors.glow} flex overflow-hidden ring-1 ring-white/5 relative z-40 ${
              isLight ? "text-slate-800" : "text-slate-200"
            } ${
              isMaximized 
                ? "w-full max-w-5xl h-[85vh] flex-row" 
                : "w-[92vw] sm:w-[380px] h-[550px] flex-col"
            }`}
          >
            {/* Split Screen Layout for Maximized dashboard */}
            <div className={`flex flex-col h-full relative z-10 ${isMaximized ? "w-full md:w-1/2 border-r border-white/5" : "w-full"}`}>
              {/* Header */}
              <div className={`relative p-4 ${isLight ? "bg-slate-100/60 text-slate-800" : "bg-slate-900/40 text-white"} backdrop-blur-xl border-b ${isLight ? "border-slate-200" : "border-white/5"} flex items-center justify-between z-20 shrink-0`}>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(90deg, transparent, var(--tw-gradient-stops), transparent)` }} />
                <div className="flex items-center gap-3">
                  <div className="bg-slate-950/80 rounded-full p-1 border border-cyan-500/30">
                    <RobotFace expression={expression} size={42} theme={terminalTheme} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-heading font-black uppercase tracking-wider ${isLight ? "text-slate-800" : "text-white"}`}>Smarty</span>
                      <span className={`text-[10px] bg-cyan-500/10 px-1.5 py-0.2 rounded-full border border-cyan-500/20 font-mono animate-pulse ${colors.textAccentLight}`}>
                        AI Mascot
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className={`text-[10px] font-mono ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        {isAuthenticated && user?.email ? `${user.name || "User"} online` : "Beep boop online"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Speech output reader toggle */}
                  <button
                    onClick={() => {
                      setIsSpeakingEnabled(!isSpeakingEnabled);
                      if (isSpeakingEnabled && typeof window !== "undefined" && window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                      }
                      toast.success(isSpeakingEnabled ? "Voice output disabled." : "Voice output enabled!");
                    }}
                    className={`p-1.5 rounded-xl transition-all ${isSpeakingEnabled ? "text-cyan-400 bg-cyan-500/10" : "text-slate-400 hover:text-slate-800 dark:hover:text-white"}`}
                    title="Toggle Text-to-Speech"
                  >
                    {isSpeakingEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>

                  {/* Settings toggle */}
                  <div className="relative">
                    <button
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                      className={`p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all ${isSettingsOpen ? "bg-white/5" : ""}`}
                      title="Settings"
                    >
                      <Settings size={16} />
                    </button>
                    
                    {/* Settings Dropdown menu */}
                    <AnimatePresence>
                      {isSettingsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className={`absolute right-0 mt-2 w-44 rounded-xl ${isLight ? "bg-white border-slate-200 text-slate-800 shadow-xl" : "bg-slate-900/95 border-white/10 text-white shadow-2xl"} border p-2.5 z-50 text-[11px] space-y-2.5`}
                        >
                          <div className={`font-semibold border-b pb-1 ${isLight ? "text-slate-500 border-slate-100" : "text-slate-400 border-white/5"}`}>CONSOLE THEME</div>
                          <div className="flex flex-col gap-1">
                            <button onClick={() => handleThemeChange("cyber-blue")} className={`w-full text-left px-2 py-1 rounded transition-colors ${terminalTheme === "cyber-blue" ? (isLight ? "text-cyan-600 bg-slate-100" : "text-cyan-400 bg-white/5") : (isLight ? "text-slate-700 hover:bg-slate-100" : "text-slate-300 hover:bg-white/5")}`}>Cyber Blue</button>
                            <button onClick={() => handleThemeChange("matrix")} className={`w-full text-left px-2 py-1 rounded transition-colors ${terminalTheme === "matrix" ? (isLight ? "text-emerald-600 bg-slate-100" : "text-emerald-400 bg-white/5") : (isLight ? "text-slate-700 hover:bg-slate-100" : "text-slate-300 hover:bg-white/5")}`}>Matrix Terminal</button>
                            <button onClick={() => handleThemeChange("holo-pink")} className={`w-full text-left px-2 py-1 rounded transition-colors ${terminalTheme === "holo-pink" ? (isLight ? "text-pink-600 bg-slate-100" : "text-pink-400 bg-white/5") : (isLight ? "text-slate-700 hover:bg-slate-100" : "text-slate-300 hover:bg-white/5")}`}>Holo Pink</button>
                          </div>
                          <div className={`border-t pt-2 ${isLight ? "border-slate-100" : "border-white/5"}`}>
                            <button 
                              onClick={clearChatHistory} 
                              className="w-full text-left px-2 py-1.5 rounded text-pink-500 hover:bg-pink-500/10 transition-colors flex items-center gap-1.5"
                            >
                              <Trash2 size={12} /> Clear Chat history
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Window Maximize / Minimize toggle */}
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="text-slate-400 hover:text-slate-800 dark:hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-colors hidden md:block"
                    title={isMaximized ? "Exit Dashboard Mode" : "Expand to Dashboard"}
                  >
                    {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>

                  <button
                    onClick={toggleChat}
                    className="text-slate-400 hover:text-slate-800 dark:hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Background patterns */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className={`absolute top-1/4 left-1/4 w-32 h-32 ${colors.orbs[0]} rounded-full blur-[60px] pointer-events-none z-0`} />
              <div className={`absolute bottom-1/4 right-1/4 w-40 h-40 ${colors.orbs[1]} rounded-full blur-[70px] pointer-events-none z-0`} />

              {/* Canvas Confetti on complete */}
              {mode === "form-complete" && <CanvasConfetti />}

              {/* Messages dialogue stream */}
              <div className={`flex-1 overflow-y-auto p-4 space-y-4 cute-scrollbar ${terminalTheme}-scroll z-10 relative`}>
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} items-start gap-2.5`}
                  >
                    {m.sender === "bot" && (
                      <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)] mt-1">
                        <Bot size={13} className={colors.textAccent} />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] px-4 py-3 text-[13px] sm:text-sm leading-relaxed tracking-wide rounded-[20px] ${
                        m.sender === "user"
                          ? `${colors.bubbleUser} rounded-br-sm`
                          : `${isLight ? colors.bubbleBotLight : colors.bubbleBotDark} rounded-tl-sm`
                      }`}
                    >
                      {renderMessageText(m.text)}
                      <span className={`text-[8px] block text-right mt-1.5 font-light select-none ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {m.sender === "user" && (
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${colors.accent} flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.3)] mt-1`}>
                        <User size={13} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)] mt-1">
                      <Bot size={13} className={colors.textAccent} />
                    </div>
                    <div className={`${isLight ? "bg-slate-100 border-slate-200" : "bg-slate-900/80 border-white/5"} border backdrop-blur-md px-5 py-3.5 rounded-[20px] rounded-tl-sm flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.1)]`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-[bounce_1s_infinite_0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-[bounce_1s_infinite_150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-[bounce_1s_infinite_300ms]" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Actions (Suggestion chips) */}
              {mode === "chat" && !isTyping && (
                <div className={`px-4 py-3 flex gap-2 overflow-x-auto shrink-0 select-none border-t ${isLight ? "border-slate-200 bg-slate-50/45" : "border-white/5 bg-slate-950/40"} backdrop-blur-md cute-scrollbar ${terminalTheme}-scroll relative z-20`}>
                  <button
                    onClick={() => handleChipClick("Submit Requirements 📝")}
                    className={`shrink-0 text-[10px] sm:text-xs font-semibold py-1.5 px-3 rounded-full bg-gradient-to-r ${colors.accentLight}`}
                  >
                    <FileText size={10} className="mr-1 inline" /> Submit Requirements
                  </button>
                  <button
                    onClick={() => handleChipClick("Website Designing & UI/UX 🎨")}
                    className={`shrink-0 text-[10px] sm:text-xs py-1.5 px-3 rounded-full ${isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 hover:border-cyan-500/30" : "bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border-white/10 hover:border-cyan-500/30"} transition-all shadow-sm`}
                  >
                    Website UI/UX
                  </button>
                  <button
                    onClick={() => handleChipClick("Website Development & Systems 💻")}
                    className={`shrink-0 text-[10px] sm:text-xs py-1.5 px-3 rounded-full ${isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 hover:border-cyan-500/30" : "bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border-white/10 hover:border-cyan-500/30"} transition-all shadow-sm`}
                  >
                    Web Development
                  </button>
                  <button
                    onClick={() => handleChipClick("Custom Automation Software ⚙️")}
                    className={`shrink-0 text-[10px] sm:text-xs py-1.5 px-3 rounded-full ${isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 hover:border-cyan-500/30" : "bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border-white/10 hover:border-cyan-500/30"} transition-all shadow-sm`}
                  >
                    Custom Software
                  </button>
                </div>
              )}

              {/* Input Area */}
              <div className={`p-4 ${isLight ? "bg-slate-50/80 border-slate-200" : "bg-slate-950/60 border-white/5"} backdrop-blur-xl border-t shrink-0 relative z-20`}>
                {mode === "chat" ? (
                  <form onSubmit={handleChatSubmit} className="flex gap-2 items-center">
                    {/* Speech Recognition mic button */}
                    <button
                      type="button"
                      onClick={toggleSpeechInput}
                      className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border ${isLight ? "border-slate-200" : "border-white/10"} text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all relative ${
                        isListening ? `${colors.micGlow} text-cyan-400 animate-pulse` : (isLight ? "bg-white hover:bg-slate-100" : "bg-slate-900/80 hover:bg-slate-800")
                      }`}
                      title={isListening ? "Listening... click to stop" : "Start Voice input"}
                    >
                      {isListening ? (
                        <>
                          <MicOff size={16} />
                          {/* Audio Wave visuals */}
                          <span className="absolute -bottom-1 flex gap-0.5 justify-center w-full">
                            <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-0.5 h-3.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </span>
                        </>
                      ) : (
                        <Mic size={16} />
                      )}
                    </button>

                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isListening ? "Speak now..." : "Ask Smarty something..."}
                      disabled={isTyping || isListening}
                      className={`${isLight ? "bg-white border-slate-200 text-slate-800 focus:bg-white" : "bg-slate-900/80 border-white/10 text-white focus:bg-slate-800"} focus:ring-1 focus:ring-cyan-400/50 rounded-2xl h-11 px-4 text-xs sm:text-[13px] placeholder:text-slate-500 shadow-inner transition-all flex-1`}
                    />

                    <Button
                      type="submit"
                      disabled={isTyping || !inputText.trim()}
                      className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${colors.accent} hover:opacity-90 shrink-0 text-white shadow-lg border border-white/10 transition-all hover:scale-105`}
                      size="icon"
                    >
                      <Send size={15} />
                    </Button>
                  </form>
                ) : mode === "form-submitting" ? (
                  <div className="flex items-center justify-center py-2.5 text-xs text-cyan-300 font-mono gap-2 animate-pulse">
                    <div className="w-4 h-4 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
                    <span>Transmitting parameters...</span>
                  </div>
                ) : mode === "form-complete" ? (
                  <div className="flex gap-2 w-full">
                    <Button
                      onClick={resetFormComplete}
                      className="w-full rounded-2xl bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-semibold h-11 transition-all"
                    >
                      Back to Chat
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleFormNext} className="space-y-2.5">
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        {mode === "form-message" ? (
                          <Textarea
                            value={formInputVal}
                            onChange={(e) => setFormInputVal(e.target.value)}
                            placeholder="Describe your project requirements (min 100 characters)..."
                            required
                            rows={2}
                            className={`${isLight ? "bg-white border-slate-200 text-slate-800" : "bg-slate-900/80 border-white/10 text-white"} focus:border-cyan-400/50 focus:bg-slate-800 focus:ring-1 focus:ring-cyan-400/50 rounded-2xl text-xs sm:text-[13px] placeholder:text-slate-500 resize-none min-h-[60px] p-3 shadow-inner transition-all`}
                          />
                        ) : (
                          <Input
                            value={formInputVal}
                            onChange={(e) => setFormInputVal(e.target.value)}
                            placeholder={
                              mode === "form-name"
                                ? "Enter full name..."
                                : mode === "form-email"
                                ? "Enter email address..."
                                : "Enter phone number or 'skip'..."
                            }
                            type={mode === "form-email" ? "email" : "text"}
                            required
                            className={`${isLight ? "bg-white border-slate-200 text-slate-800" : "bg-slate-900/80 border-white/10 text-white"} focus:border-cyan-400/50 focus:bg-slate-800 focus:ring-1 focus:ring-cyan-400/50 rounded-2xl h-11 px-4 text-xs sm:text-[13px] placeholder:text-slate-500 shadow-inner transition-all`}
                          />
                        )}
                      </div>
                      <Button
                        type="submit"
                        className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${colors.accent} hover:opacity-90 text-white shrink-0 border border-white/10 transition-all hover:scale-105`}
                        size="icon"
                      >
                        <Send size={15} />
                      </Button>
                    </div>
                    
                    {mode === "form-message" && (
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-1 pt-0.5">
                        <span className={formInputVal.trim().length < 100 ? "text-amber-400 animate-pulse font-semibold" : "text-emerald-400 font-bold"}>
                          {formInputVal.trim().length < 100 
                            ? `Needs ${100 - formInputVal.trim().length} more chars` 
                            : "Brief length: Perfect!"}
                        </span>
                        <span>{formInputVal.trim().length}/100</span>
                      </div>
                    )}

                    {formError && (
                      <div className="flex items-center gap-1.5 text-[10px] text-pink-500 font-mono animate-fade-in">
                        <AlertCircle size={11} />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center select-none pt-0.5">
                      <span className="text-[9px] font-mono text-slate-500">
                        Step {mode === "form-name" ? 1 : mode === "form-email" ? 2 : mode === "form-phone" ? 3 : 4} of 4
                      </span>
                      <button
                        type="button"
                        onClick={cancelForm}
                        className="text-[10px] font-semibold text-slate-400 hover:text-pink-400 hover:underline transition-colors font-mono"
                      >
                        Cancel Form
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Panel: Advanced Command Center Dashboard (split screen layout) */}
            {isMaximized && (
              <div className={`hidden md:flex md:w-1/2 flex-col h-full ${isLight ? "bg-slate-50/50" : "bg-slate-900/20"} overflow-y-auto p-6 space-y-6 relative z-10 font-body select-none cute-scrollbar ${terminalTheme}-scroll`}>
                <div>
                  <h3 className={`text-base font-heading font-black tracking-wider uppercase flex items-center gap-2 ${colors.textAccent}`}>
                    <Sparkles size={16} /> Command Center
                  </h3>
                  <p className={`text-xs leading-relaxed mt-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    Pre-compile detailed project requirements directly into Smarty's neural parser using our system configs.
                  </p>
                </div>

                {/* 1. Project Brief Generator */}
                <div className={`p-5 rounded-2xl ${isLight ? "bg-white border-slate-200/80 shadow-md text-slate-800" : "bg-slate-950/70 border-white/5 text-white"} border space-y-4 shadow-xl`}>
                  <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Briefcase size={13} className={colors.textAccent} /> Requirement Compiler
                  </h4>
                  
                  <div className="space-y-3">
                    {/* Service selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Service Categories</label>
                      <select 
                        value={briefService}
                        onChange={(e) => setBriefService(e.target.value)}
                        className={`w-full h-9 ${isLight ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-slate-900 border-white/5 text-slate-300"} border focus:border-cyan-500/30 text-xs rounded-xl px-2 outline-none transition-colors`}
                      >
                        <option>Website Design & Development</option>
                        <option>Mobile App (iOS/Android)</option>
                        <option>Custom CRM & automation</option>
                        <option>Bulk SMS Platform</option>
                        <option>SEO & Digital Marketing</option>
                      </select>
                    </div>

                    {/* Grid for budget and timeline */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">Budget Bracket</label>
                        <select 
                          value={briefBudget}
                          onChange={(e) => setBriefBudget(e.target.value)}
                          className={`w-full h-9 ${isLight ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-slate-900 border-white/5 text-slate-300"} border text-xs rounded-xl px-2 outline-none`}
                        >
                          <option>&lt; $1,000 (~₹83,000 INR)</option>
                          <option>$1,000 - $5,000 (~₹83,000 - ₹4,15,000 INR)</option>
                          <option>$5,000 - $10,000 (~₹4,15,000 - ₹8,30,000 INR)</option>
                          <option>&gt; $10,000 (~₹8,30,000+ INR)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">Timeline</label>
                        <select 
                          value={briefTimeline}
                          onChange={(e) => setBriefTimeline(e.target.value)}
                          className={`w-full h-9 ${isLight ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-slate-900 border-white/5 text-slate-300"} border text-xs rounded-xl px-2 outline-none`}
                        >
                          <option>1 Month</option>
                          <option>2-3 Months</option>
                          <option>Flexible</option>
                        </select>
                      </div>
                    </div>

                    {/* Brief description */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Brief Description</label>
                      <Textarea 
                        value={briefDetails}
                        onChange={(e) => setBriefDetails(e.target.value)}
                        placeholder="Type system parameters, features, pages, or databases needed..."
                        rows={3}
                        className={`w-full ${isLight ? "bg-slate-50 border-slate-200 text-slate-700 focus:bg-white" : "bg-slate-900 border-white/5 text-slate-300 focus:bg-slate-800"} border focus:border-cyan-500/30 text-xs rounded-xl p-2.5 outline-none resize-none min-h-[70px] transition-colors`}
                      />
                    </div>

                    <Button
                      onClick={handleGenerateBrief}
                      className={`w-full h-9 rounded-xl bg-gradient-to-r ${colors.accent} text-xs font-bold shadow-md hover:opacity-95 transition-all text-white border border-white/10`}
                    >
                      Compile & Add to Input
                    </Button>
                  </div>
                </div>

                {/* 2. OES System Capabilities Showcase */}
                <div className="space-y-3.5">
                  <h4 className={`text-xs font-bold uppercase tracking-widest ${isLight ? "text-slate-600" : "text-slate-300"}`}>Capabilities Index</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      onClick={() => setInputText("What is the average timeline for a website redesign project?")}
                      className={`p-3 rounded-xl ${isLight ? "bg-white border-slate-200/80 hover:bg-slate-100/50 shadow-sm" : "bg-slate-950/40 border-white/5 hover:border-cyan-500/30"} border transition-all cursor-pointer text-left`}
                    >
                      <div className={`font-semibold text-xs ${isLight ? "text-slate-800" : "text-slate-300"}`}>Website UI/UX</div>
                      <div className="text-[9px] text-slate-500 mt-1 leading-relaxed">Average project timelines, process flow, and prototypes.</div>
                    </div>
                    <div 
                      onClick={() => setInputText("Tell me more about your Custom Software Automation & CRMs.")}
                      className={`p-3 rounded-xl ${isLight ? "bg-white border-slate-200/80 hover:bg-slate-100/50 shadow-sm" : "bg-slate-950/40 border-white/5 hover:border-cyan-500/30"} border transition-all cursor-pointer text-left`}
                    >
                      <div className={`font-semibold text-xs ${isLight ? "text-slate-800" : "text-slate-300"}`}>Custom CRM</div>
                      <div className="text-[9px] text-slate-500 mt-1 leading-relaxed">Workflow automations, internal portals, database integrations.</div>
                    </div>
                    <div 
                      onClick={() => setInputText("What bulk SMS APIs and delivery rates do you provide?")}
                      className={`p-3 rounded-xl ${isLight ? "bg-white border-slate-200/80 hover:bg-slate-100/50 shadow-sm" : "bg-slate-950/40 border-white/5 hover:border-cyan-500/30"} border transition-all cursor-pointer text-left`}
                    >
                      <div className={`font-semibold text-xs ${isLight ? "text-slate-800" : "text-slate-300"}`}>Bulk SMS APIs</div>
                      <div className="text-[9px] text-slate-500 mt-1 leading-relaxed">High-throughput outreach with 99.8% server uptime.</div>
                    </div>
                    <div 
                      onClick={() => setInputText("How does OES secure rankings on page-1 of Google search?")}
                      className={`p-3 rounded-xl ${isLight ? "bg-white border-slate-200/80 hover:bg-slate-100/50 shadow-sm" : "bg-slate-950/40 border-white/5 hover:border-cyan-500/30"} border transition-all cursor-pointer text-left`}
                    >
                      <div className={`font-semibold text-xs ${isLight ? "text-slate-800" : "text-slate-300"}`}>SEO Solutions</div>
                      <div className="text-[9px] text-slate-500 mt-1 leading-relaxed">Traffic pipelines, keywords audit, and search visibility.</div>
                    </div>
                  </div>
                </div>

                {/* 3. System FAQs */}
                <div className="space-y-3">
                  <h4 className={`text-xs font-bold uppercase tracking-widest ${isLight ? "text-slate-600" : "text-slate-300"}`}>Quick FAQs</h4>
                  <div className="space-y-2 text-xs">
                    <div 
                      onClick={() => setInputText("Can I capture leads directly in my internal database with the chatbot?")}
                      className={`flex items-center justify-between p-2.5 rounded-xl ${isLight ? "bg-white border-slate-200/60 hover:bg-slate-50 text-slate-800 shadow-sm" : "bg-slate-950/20 border-white/5 hover:bg-slate-900/40 text-slate-300"} border cursor-pointer transition-colors text-left`}
                    >
                      <span className="truncate font-medium">Can chatbot capture leads in custom CRM?</span>
                      <ChevronRight size={13} className="text-slate-500 shrink-0 ml-2" />
                    </div>
                    <div 
                      onClick={() => setInputText("Do you offer post-launch maintenance & code support?")}
                      className={`flex items-center justify-between p-2.5 rounded-xl ${isLight ? "bg-white border-slate-200/60 hover:bg-slate-50 text-slate-800 shadow-sm" : "bg-slate-950/20 border-white/5 hover:bg-slate-900/40 text-slate-300"} border cursor-pointer transition-colors text-left`}
                    >
                      <span className="truncate font-medium">Do you provide maintenance and updates?</span>
                      <ChevronRight size={13} className="text-slate-500 shrink-0 ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
