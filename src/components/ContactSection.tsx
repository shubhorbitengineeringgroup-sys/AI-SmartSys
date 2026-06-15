import { useState, useEffect, useRef } from "react";
import { Phone, Mail, Send, MessageSquare, Check, RefreshCw, AlertCircle, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionHeader from "./SectionHeader";
import { GlowOrb } from "./TechPattern";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import customerOnboardingImg from "@/assets/images/customer_onboarding.png";
import { askOnboardingGemini, GeminiMessage } from "@/lib/gemini";

interface ChatMessage {
  id: string;
  sender: "agent" | "user";
  text: string;
}

interface Step {
  field: "name" | "email" | "phone" | "message";
  question: string | ((name: string) => string);
  placeholder: string;
  type: string;
  validation: (val: string) => boolean;
}

const STEPS: Step[] = [
  {
    field: "name",
    question: "Hi there! I'm the SmartSys AI onboarding agent. To begin, what is your name?",
    placeholder: "Enter your full name...",
    type: "text",
    validation: (val: string) => val.trim().length >= 2
  },
  {
    field: "email",
    question: (name: string) => `Nice to meet you, ${name}! What is your email address?`,
    placeholder: "Enter your email...",
    type: "email",
    validation: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  },
  {
    field: "phone",
    question: "Thank you. What phone number can we reach you at? (Type 'skip' to skip)",
    placeholder: "Enter phone number or 'skip'...",
    type: "text",
    validation: (val: string) => {
      const clean = val.trim().toLowerCase();
      if (clean === "skip") return true;
      const digits = clean.replace(/[^0-9]/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }
  },
  {
    field: "message",
    question: "Lastly, please describe your project requirements, goals, and target timeline in detail (Minimum 100 characters required).",
    placeholder: "Describe your project or goals in detail (min 100 characters)...",
    type: "textarea",
    validation: (val: string) => val.trim().length >= 100
  }
];

// Animated SVG AI core status indicators
const AICoreStatus = () => (
  <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
    <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
    <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_8s_linear_infinite] relative z-10">
      <circle cx="50" cy="50" r="40" stroke="url(#coreGrad)" strokeWidth="5" strokeDasharray="30 15 10 15" fill="none" />
      <circle cx="50" cy="50" r="25" stroke="url(#coreGrad)" strokeWidth="7" strokeDasharray="10 10" fill="none" />
      <circle cx="50" cy="50" r="10" fill="#6366f1" />
      <defs>
        <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const AICoreMini = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_4s_linear_infinite]">
    <circle cx="50" cy="50" r="40" stroke="url(#coreGradMini)" strokeWidth="8" strokeDasharray="40 20" fill="none" />
    <circle cx="50" cy="50" r="15" fill="#8b5cf6" />
    <defs>
      <linearGradient id="coreGradMini" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  </svg>
);

const ContactSection = () => {
  const { ref, isVisible } = useScrollReveal();
  
  // Dual-mode state
  const [isConversational, setIsConversational] = useState<boolean>(true);
  
  // Form values (shared)
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  
  // Classic Form Validation errors
  const [classicErrors, setClassicErrors] = useState({ name: "", email: "", phone: "", message: "" });
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Conversational state
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [chatLanguage, setChatLanguage] = useState<'en' | 'hi'>("en");
  const [chatTone, setChatTone] = useState<'professional' | 'witty'>("witty");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Helper for dynamic onboarding chatbot greeting
  const getInitialGreeting = (lang: 'en' | 'hi', tone: 'professional' | 'witty'): string => {
    if (lang === 'hi') {
      return tone === 'witty'
        ? "Oho! Aaiye aaiye, welcome! *waves mechanical arm* Main hoon Smarty, aapka AI tech partner. Sabse pehle apna shubh naam batayein, taaki dosti shuru ho sake! 😉"
        : "Namaste, AI-SmartSys onboarding portal me aapka swagat hai. Main Smarty hoon. Kripya apna naam batakar onboarding process shuru karein. 🙏";
    } else {
      return tone === 'witty'
        ? "Hi! I'm Smarty, your AI onboarding assistant. Let's make something amazing together! To begin, what is your name? 😊"
        : "Welcome to AI-SmartSys. I am Smarty, your onboarding assistant. To initiate your project consultation, please share your name. 💼";
    }
  };

  // Initialize or update initial chatbot greeting when settings change
  useEffect(() => {
    if (isConversational) {
      if (messages.length === 0) {
        setMessages([
          {
            id: "msg-0",
            sender: "agent",
            text: getInitialGreeting(chatLanguage, chatTone)
          }
        ]);
      } else if (messages.length === 1 && messages[0].sender === "agent") {
        setMessages([
          {
            id: "msg-0",
            sender: "agent",
            text: getInitialGreeting(chatLanguage, chatTone)
          }
        ]);
      }
    }
  }, [isConversational, messages.length, chatLanguage, chatTone]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAgentTyping]);

  // Handle Conversational Submit
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    const val = inputValue.trim();
    if (!val) return;

    // Add user response message
    const userMsgId = `user-${Date.now()}`;
    const newMessages = [...messages, { id: userMsgId, sender: "user", text: val }];
    setMessages(newMessages);
    setInputValue("");

    // Simulate Agent Typing next question
    setIsAgentTyping(true);

    try {
      // Map history to GeminiMessage format
      const chatHistory: GeminiMessage[] = newMessages.map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      // Send to Gemini Onboarding with language & tone
      const rawReply = await askOnboardingGemini(val, chatHistory.slice(0, -1), chatLanguage, chatTone);

      // Check for submission tag [ONBOARDING_DATA: {...}]
      const match = rawReply.match(/\[ONBOARDING_DATA:\s*(\{.*?\})\]/);

      let cleanReply = rawReply;
      let dataToSubmit = null;

      if (match) {
        cleanReply = rawReply.replace(/\[ONBOARDING_DATA:.*?\]/, "").trim();
        try {
          dataToSubmit = JSON.parse(match[1]);
        } catch (err) {
          console.error("Failed to parse onboarding data JSON:", err);
        }
      }

      setIsAgentTyping(false);
      setMessages(prev => [...prev, { id: `agent-${Date.now()}`, sender: "agent", text: cleanReply }]);

      if (dataToSubmit) {
        // Form Complete
        setCurrentStep(STEPS.length); // Sets node wizard to complete state
        
        // Submit to Supabase
        const { error } = await supabase.from("contact_submissions").insert({
          name: dataToSubmit.name,
          email: dataToSubmit.email,
          phone: dataToSubmit.phone,
          message: dataToSubmit.message,
          source: "onboarding_bot"
        });

        if (error) {
          console.error("Supabase insert failed for onboarding bot:", error.message);
        }
        toast.success("Request sent! Our team will contact you shortly.");
      } else {
        // Update progress node step based on message index
        const nextStepIdx = newMessages.filter(m => m.sender === "user").length;
        if (nextStepIdx < STEPS.length) {
          setCurrentStep(nextStepIdx);
        }
      }
    } catch (err) {
      console.error("Error in onboarding chat submit:", err);
      setIsAgentTyping(false);
      toast.error("Oops! Something went wrong. Please try again.");
    }
  };

  // Reset Conversational Form
  const resetChat = () => {
    setForm({ name: "", email: "", phone: "", message: "" });
    setCurrentStep(0);
    setInputValue("");
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: "agent",
        text: getInitialGreeting(chatLanguage, chatTone)
      }
    ]);
  };

  // Validate Classic Form
  const validateClassicForm = () => {
    const errors = { name: "", email: "", phone: "", message: "" };
    let isValid = true;

    if (form.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    const cleanPhone = form.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      errors.phone = "Phone number must be between 10 and 15 digits.";
      isValid = false;
    }

    if (form.message.trim().length < 100) {
      errors.message = `Requirements must be at least 100 characters. Currently ${form.message.trim().length}/100.`;
      isValid = false;
    }

    setClassicErrors(errors);
    return isValid;
  };

  // Handle Classic Submit
  const handleClassicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateClassicForm()) {
      toast.error("Please resolve the validation errors.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        source: "classic_form"
      });
      if (error) {
        console.error("Supabase classic form submission failed:", error.message);
      }
      toast.success("Message sent! We'll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setClassicErrors({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Error saving classic submission:", err);
      toast.success("Message sent! We'll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setClassicErrors({ name: "", email: "", phone: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative section-padding overflow-hidden bg-background">
      {/* Background Video */}
      <div className="video-container opacity-20">
        <video autoPlay muted loop playsInline>
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-data-visualization-concept-animation-24706-large.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
      <GlowOrb className="w-[400px] h-[400px] bottom-0 -right-40" color="primary" />

      <div className="container mx-auto relative z-10" ref={ref}>
        <SectionHeader badge="Contact Us" title="Get In Touch" description="Ready to transform your business with AI? Let's talk." />
        
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl mx-auto items-center lg:items-start transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          {/* Left Column: Dual Form Box */}
          <div className="premium-card flex flex-col h-[590px] sm:h-[620px] lg:h-[660px] overflow-hidden hover:translate-y-0 hover:scale-100">
            {/* Tab Switcher at the top of the card */}
            <div className="flex p-1 bg-slate-100/50 dark:bg-slate-950/80 rounded-xl border border-slate-200/50 dark:border-white/5 mx-6 mt-6 mb-2 z-10">
              <button
                type="button"
                onClick={() => {
                  setIsConversational(true);
                  resetChat();
                }}
                className={`flex-1 py-2 text-xs font-mono font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  isConversational
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquare size={13} />
                <span>AI Chat Agent</span>
              </button>
              <button
                type="button"
                onClick={() => setIsConversational(false)}
                className={`flex-1 py-2 text-xs font-mono font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  !isConversational
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Send size={12} />
                <span>Classic Form</span>
              </button>
            </div>

            {/* Step Progress Bar */}
            {isConversational && currentStep < STEPS.length && (
              <div className="px-6 pt-3 pb-1">
                <div className="relative flex justify-between items-center w-full max-w-[320px] mx-auto">
                  {/* Progress Line Background */}
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2 rounded-full pointer-events-none" />
                  
                  {/* Glowing Active Progress Line */}
                  <div 
                    className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 -translate-y-1/2 rounded-full transition-all duration-500 pointer-events-none"
                    style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                  />

                  {/* Step Nodes */}
                  {STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStep;
                    const isActive = idx === currentStep;
                    
                    const StepIcon = () => {
                      if (isCompleted) return <Check size={11} className="text-white" />;
                      switch (step.field) {
                        case "name": return <User size={11} />;
                        case "email": return <Mail size={11} />;
                        case "phone": return <Phone size={11} />;
                        case "message": return <MessageSquare size={11} />;
                        default: return null;
                      }
                    };

                    return (
                      <div key={step.field} className="relative z-10 flex flex-col items-center">
                        <motion.div 
                          animate={isActive ? { scale: [1, 1.12, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          className={`w-6.5 h-6.5 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isCompleted 
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20" 
                              : isActive 
                                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-md shadow-indigo-500/30" 
                                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-muted-foreground/60"
                          }`}
                          style={{ width: "26px", height: "26px" }}
                        >
                          <StepIcon />
                        </motion.div>
                        <span className={`text-[8px] font-mono mt-1 font-semibold uppercase tracking-wider hidden sm:block ${
                          isActive ? "text-indigo-500 dark:text-indigo-400 font-bold" : isCompleted ? "text-emerald-500" : "text-muted-foreground/40"
                        }`}>
                          {step.field}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {isConversational ? (
              /* Conversational Mode UI */
              <div className="px-6 pb-6 flex flex-col flex-grow justify-between overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-border/50 pb-2 mb-3 select-none">
                  <div className="flex items-center gap-2.5">
                    <AICoreStatus />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground/80 tracking-wide font-mono hidden sm:inline">SmartSys AI Onboarding</span>
                      <span className="text-xs font-bold text-foreground/80 tracking-wide font-mono sm:hidden inline">AI Onboarding</span>
                      <span className="text-[9px] text-emerald-500 dark:text-emerald-400 font-mono font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Core Active
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => setShowSettings(!showSettings)}
                      className={`p-1.5 rounded-lg border transition-all duration-300 ${
                        showSettings 
                          ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-500" 
                          : "border-border/60 hover:bg-slate-500/10 text-muted-foreground"
                      }`}
                      title="Agent Settings"
                      type="button"
                    >
                      <Settings size={13} className={showSettings ? "animate-spin-slow" : ""} />
                    </button>
                    {currentStep < STEPS.length && (
                      <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 whitespace-nowrap">
                        Step {currentStep + 1} of {STEPS.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Agent Settings Panel */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden bg-slate-500/5 dark:bg-slate-950/20 border border-border/30 rounded-xl p-3.5 mb-3 select-none flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-center text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-500 dark:text-indigo-400">
                        <span>Agent Control System</span>
                        <button 
                          onClick={() => {
                            resetChat();
                            toast.success("Chat configuration reset!");
                          }}
                          className="flex items-center gap-1 text-[9px] hover:text-indigo-400 transition-colors uppercase font-mono font-bold bg-indigo-500/5 px-2 py-0.5 border border-indigo-500/10 rounded-md"
                        >
                          <RefreshCw size={9} /> Reset Chat
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Language Selector */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-semibold text-muted-foreground">Select Language</label>
                          <div className="grid grid-cols-2 bg-slate-200/50 dark:bg-slate-900/60 p-0.5 rounded-lg border border-border/40">
                            <button
                              type="button"
                              onClick={() => {
                                setChatLanguage("en");
                                toast.success("Language switched to English");
                              }}
                              className={`text-[10px] font-bold py-1.5 rounded-md transition-all ${
                                chatLanguage === "en"
                                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-white/5"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              English
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setChatLanguage("hi");
                                toast.success("भाषा बदलकर हिंग्लिश की गई");
                              }}
                              className={`text-[10px] font-bold py-1.5 rounded-md transition-all ${
                                chatLanguage === "hi"
                                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-white/5"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              Hinglish
                            </button>
                          </div>
                        </div>

                        {/* Tone Selector */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-semibold text-muted-foreground">Select Vibe</label>
                          <div className="grid grid-cols-2 bg-slate-200/50 dark:bg-slate-900/60 p-0.5 rounded-lg border border-border/40">
                            <button
                              type="button"
                              onClick={() => {
                                setChatTone("witty");
                                toast.success("Vibe changed to Playful!");
                              }}
                              className={`text-[10px] font-bold py-1.5 rounded-md transition-all ${
                                chatTone === "witty"
                                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-white/5"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              Playful
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setChatTone("professional");
                                toast.success("Vibe changed to Professional!");
                              }}
                              className={`text-[10px] font-bold py-1.5 rounded-md transition-all ${
                                chatTone === "professional"
                                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-white/5"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              Professional
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message Stream */}
                <div 
                  ref={chatContainerRef} 
                  className="flex-grow overflow-y-auto pr-1 flex flex-col gap-4 scrollbar-thin p-4 rounded-xl bg-slate-500/5 dark:bg-slate-950/40 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] border border-border/20 shadow-inner"
                >
                  <AnimatePresence initial={false}>
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-2.5 max-w-[88%] ${
                          m.sender === "user" ? "self-end flex-row-reverse" : "self-start"
                        }`}
                      >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border shadow-sm ${
                          m.sender === "user"
                            ? "border-indigo-500/20 bg-indigo-500/5 text-indigo-500 dark:text-indigo-400"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1"
                        }`}>
                          {m.sender === "user" ? (
                            <User size={13} />
                          ) : (
                            <AICoreMini />
                          )}
                        </div>

                        {/* Bubble */}
                        <div
                          className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            m.sender === "user"
                              ? "bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 text-white shadow-md shadow-indigo-500/15 rounded-tr-none"
                              : "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 text-foreground shadow-sm rounded-tl-none"
                          }`}
                        >
                          {m.text}
                        </div>
                      </motion.div>
                    ))}

                    {isAgentTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2.5 self-start items-center"
                      >
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-sm">
                          <AICoreMini />
                        </div>
                        {/* Typing Animation */}
                        <div className="flex gap-1.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 rounded-2xl rounded-tl-none py-3 px-4 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={chatEndRef} />
                </div>

                {/* Form Controls / Inputs */}
                <div className="mt-3">
                  {currentStep < STEPS.length ? (
                    <form onSubmit={handleChatSubmit} className="space-y-1.5">
                      <div className="flex gap-2 w-full relative">
                        <div className="relative flex-grow">
                          {STEPS[currentStep].type === "textarea" ? (
                            <>
                              <MessageSquare size={16} className="absolute left-3.5 top-4 text-muted-foreground/60" />
                              <Textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={STEPS[currentStep].placeholder}
                                required
                                rows={2}
                                className="pl-12 bg-white/50 dark:bg-slate-950/30 border-border/60 dark:border-white/10 resize-none text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm"
                              />
                            </>
                          ) : (
                            <>
                              {STEPS[currentStep].field === "name" && <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 z-10" />}
                              {STEPS[currentStep].field === "email" && <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 z-10" />}
                              {STEPS[currentStep].field === "phone" && <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 z-10" />}
                              <Input
                                type={STEPS[currentStep].type}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={STEPS[currentStep].placeholder}
                                required
                                className="pl-12 bg-white/50 dark:bg-slate-950/30 border-border/60 dark:border-white/10 h-11 text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm"
                              />
                            </>
                          )}
                        </div>
                        <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.03]">
                          <Send size={15} />
                        </Button>
                      </div>
                      
                      {/* Character count for conversational textarea requirements */}
                      {STEPS[currentStep].field === "message" && (
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono px-1">
                          <span className={inputValue.trim().length < 100 ? "text-amber-500 animate-pulse font-semibold" : "text-emerald-400 font-bold"}>
                            {inputValue.trim().length < 100 
                              ? `Requires ${100 - inputValue.trim().length} more characters` 
                              : "Requirement details: Sufficient ✓"}
                          </span>
                          <span>{inputValue.trim().length}/100</span>
                        </div>
                      )}
                      
                      {errorText && (
                        <div className="flex items-center gap-1.5 text-xs text-destructive animate-fade-in font-mono">
                          <AlertCircle size={12} />
                          <span>{errorText}</span>
                        </div>
                      )}
                    </form>
                  ) : (
                    /* Final step success buttons */
                    <div className="flex flex-col items-center text-center p-2 animate-fade-in">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-500/30">
                        <Check size={18} className="animate-pulse" />
                      </div>
                      <h4 className="font-heading font-semibold text-foreground text-sm mb-2">Onboarding Complete</h4>
                      <Button onClick={resetChat} variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 border-border/60 hover:bg-muted/50">
                        <RefreshCw size={12} /> Restart Form
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Classic Form UI */
              <form onSubmit={handleClassicSubmit} className="px-6 pb-6 flex flex-col flex-grow justify-between overflow-y-auto scrollbar-none space-y-5 lg:space-y-6">
                <div className="space-y-4 lg:space-y-5">
                  {/* Subtle contextual header */}
                  <div className="space-y-1 pb-1 border-b border-border/20 select-none">
                    <h4 className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 tracking-wider font-mono uppercase">Direct Scoping Queue</h4>
                    <p className="text-[10.5px] text-muted-foreground leading-normal">
                      Submit your details to enter our priority engineering queue for a custom scope assessment.
                    </p>
                  </div>

                  {/* Name Input Group */}
                  <div className={`group bg-slate-500/5 dark:bg-slate-950/20 border rounded-2xl px-4 py-2 transition-all duration-300 focus-within:border-indigo-500/50 focus-within:bg-white dark:focus-within:bg-slate-950/30 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.06)] hover:border-slate-300 dark:hover:border-white/10 ${
                    classicErrors.name ? "border-rose-500/60" : "border-slate-200/60 dark:border-white/5"
                  }`}>
                    <label className="text-[9px] font-bold text-muted-foreground/80 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 tracking-wider uppercase font-mono block transition-colors select-none mb-0.5">
                      Your Name
                    </label>
                    <div className="relative flex items-center">
                      <User size={15} className="absolute left-0 text-muted-foreground/50 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors z-10" />
                      <Input
                        placeholder="Your Name"
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (classicErrors.name) setClassicErrors({ ...classicErrors, name: "" });
                        }}
                        required
                        className="pl-7 pr-0 py-0 bg-transparent border-0 h-8 text-sm text-foreground placeholder:text-muted-foreground/45 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 shadow-none"
                      />
                    </div>
                    {classicErrors.name && (
                      <p className="text-[10px] text-rose-400 font-mono mt-1 flex items-center gap-1"><AlertCircle size={10} />{classicErrors.name}</p>
                    )}
                  </div>

                  {/* Email Input Group */}
                  <div className={`group bg-slate-500/5 dark:bg-slate-950/20 border rounded-2xl px-4 py-2 transition-all duration-300 focus-within:border-indigo-500/50 focus-within:bg-white dark:focus-within:bg-slate-950/30 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.06)] hover:border-slate-300 dark:hover:border-white/10 ${
                    classicErrors.email ? "border-rose-500/60" : "border-slate-200/60 dark:border-white/5"
                  }`}>
                    <label className="text-[9px] font-bold text-muted-foreground/80 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 tracking-wider uppercase font-mono block transition-colors select-none mb-0.5">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail size={15} className="absolute left-0 text-muted-foreground/50 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors z-10" />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          if (classicErrors.email) setClassicErrors({ ...classicErrors, email: "" });
                        }}
                        required
                        className="pl-7 pr-0 py-0 bg-transparent border-0 h-8 text-sm text-foreground placeholder:text-muted-foreground/45 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 shadow-none"
                      />
                    </div>
                    {classicErrors.email && (
                      <p className="text-[10px] text-rose-400 font-mono mt-1 flex items-center gap-1"><AlertCircle size={10} />{classicErrors.email}</p>
                    )}
                  </div>

                  {/* Phone Input Group */}
                  <div className={`group bg-slate-500/5 dark:bg-slate-950/20 border rounded-2xl px-4 py-2 transition-all duration-300 focus-within:border-indigo-500/50 focus-within:bg-white dark:focus-within:bg-slate-950/30 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.06)] hover:border-slate-300 dark:hover:border-white/10 ${
                    classicErrors.phone ? "border-rose-500/60" : "border-slate-200/60 dark:border-white/5"
                  }`}>
                    <label className="text-[9px] font-bold text-muted-foreground/80 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 tracking-wider uppercase font-mono block transition-colors select-none mb-0.5">
                      Phone Number
                    </label>
                    <div className="relative flex items-center">
                      <Phone size={15} className="absolute left-0 text-muted-foreground/50 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors z-10" />
                      <Input
                        placeholder="Phone Number (e.g., +91 70241 28029)"
                        value={form.phone}
                        onChange={(e) => {
                          setForm({ ...form, phone: e.target.value });
                          if (classicErrors.phone) setClassicErrors({ ...classicErrors, phone: "" });
                        }}
                        required
                        className="pl-7 pr-0 py-0 bg-transparent border-0 h-8 text-sm text-foreground placeholder:text-muted-foreground/45 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 shadow-none"
                      />
                    </div>
                    {classicErrors.phone && (
                      <p className="text-[10px] text-rose-400 font-mono mt-1 flex items-center gap-1"><AlertCircle size={10} />{classicErrors.phone}</p>
                    )}
                  </div>

                  {/* Project Details Textarea Group */}
                  <div className={`group bg-slate-500/5 dark:bg-slate-950/20 border rounded-2xl px-4 py-3 transition-all duration-300 focus-within:border-indigo-500/50 focus-within:bg-white dark:focus-within:bg-slate-950/30 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.06)] hover:border-slate-300 dark:hover:border-white/10 ${
                    classicErrors.message ? "border-rose-500/60" : "border-slate-200/60 dark:border-white/5"
                  }`}>
                    <label className="text-[9px] font-bold text-muted-foreground/80 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 tracking-wider uppercase font-mono block transition-colors select-none mb-1">
                      Project Details
                    </label>
                    <div className="relative flex items-start">
                      <MessageSquare size={15} className="absolute left-0 top-1 text-muted-foreground/50 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors z-10" />
                      <Textarea
                        placeholder="Describe your project requirements, goals, and target timeline in detail..."
                        value={form.message}
                        onChange={(e) => {
                          setForm({ ...form, message: e.target.value });
                          if (classicErrors.message) setClassicErrors({ ...classicErrors, message: "" });
                        }}
                        required
                        rows={5}
                        className="pl-7 pr-0 py-0 bg-transparent border-0 resize-none text-sm text-foreground placeholder:text-muted-foreground/45 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 shadow-none outline-none min-h-[90px]"
                      />
                    </div>
                    {/* Character counter */}
                    <div className="flex justify-between items-center text-[10px] mt-1.5 font-mono px-1">
                      <span className={form.message.trim().length < 100 ? "text-amber-500 animate-pulse font-semibold" : "text-emerald-500 dark:text-emerald-400 font-bold"}>
                        {form.message.trim().length < 100 
                          ? `Min 100 chars (${100 - form.message.trim().length} more)` 
                          : "Requirements: Complete ✓"}
                      </span>
                      <span className={form.message.trim().length < 100 ? "text-muted-foreground/60" : "text-emerald-500 dark:text-emerald-400 font-bold"}>
                        {form.message.trim().length}/100
                      </span>
                    </div>
                        {classicErrors.message && (
                        <p className="text-[10px] text-rose-400 font-mono mt-1 flex items-center gap-1"><AlertCircle size={10} />{classicErrors.message}</p>
                      )}
                    </div>
                  </div>

                <div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5" 
                    size="lg" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>
                        <Send size={15} className="mr-2" /> Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Contact Info & Colorful Illustration */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Neon-framed Image Card */}
            <div className="relative w-full aspect-square max-w-[400px] mx-auto rounded-3xl overflow-hidden bg-slate-950/40 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex items-center justify-center p-2 group">
              {/* Ambient pulsing neon orb */}
              <div className="absolute w-[200px] h-[200px] bg-cyan-500/20 rounded-full blur-[60px] opacity-70 animate-pulse pointer-events-none" />
              
              {/* Float Animation of our custom illustration */}
              <motion.img 
                src={customerOnboardingImg} 
                alt="AI SmartSys Customer Onboarding Checklist" 
                className="w-full h-full object-cover rounded-2xl relative z-10 border border-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Holographic scanner scanline overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.35)_50%,rgba(0,0,0,0.35))] bg-[size:100%_4px] pointer-events-none opacity-20" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-black text-xl text-foreground text-center lg:text-left text-gradient-primary">Let's Build Something Great</h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-center lg:text-left">
                Submit your requirements using the conversational AI onboarding bot or the classic form. Our engineers will analyze your stack and contact you within 24 hours.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { icon: Phone, label: "Phone", value: "+91 70241 28029", href: "tel:+917024128029" },
                { icon: Mail, label: "Email", value: "vijaytiwari@orbitengineerings.com", href: "mailto:vijaytiwari@orbitengineerings.com" },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group">
                  <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-primary group-hover:bg-gradient-button group-hover:text-secondary-foreground transition-all duration-500 border border-white/5 group-hover:border-primary/30 animate-pulse">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono font-medium">{label}</p>
                    <p className="font-medium text-foreground text-sm">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/50">
              {[
                { num: "100+", label: "Clients" },
                { num: "250+", label: "Projects" },
                { num: "99%", label: "Satisfaction" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-heading font-bold text-2xl text-gradient-primary">{s.num}</p>
                  <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider font-mono">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
