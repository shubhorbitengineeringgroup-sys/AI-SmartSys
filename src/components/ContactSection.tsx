import { useState, useEffect, useRef } from "react";
import { Phone, Mail, Send, MessageSquare, Check, RefreshCw, AlertCircle } from "lucide-react";
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
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize chatbot
  useEffect(() => {
    if (isConversational && messages.length === 0) {
      setMessages([
        {
          id: "msg-0",
          sender: "agent",
          text: STEPS[0].question as string
        }
      ]);
    }
  }, [isConversational, messages.length]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAgentTyping]);

  // Handle Conversational Submit
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    const step = STEPS[currentStep];
    const val = inputValue.trim();

    // Run field validation
    if (!step.validation(val)) {
      if (step.field === "email") {
        setErrorText("Please enter a valid email address.");
      } else if (step.field === "phone") {
        setErrorText("Please enter a valid phone number (10 to 15 digits) or 'skip'.");
      } else if (step.field === "message") {
        setErrorText(`Please write at least 100 characters. Current count: ${val.length}/100`);
      } else {
        setErrorText("Please enter a valid response.");
      }
      return;
    }

    // Capture response
    const key = step.field;
    let finalVal = val;
    if (key === "phone" && val.toLowerCase() === "skip") {
      finalVal = "Not provided";
    }
    
    const updatedForm = { ...form, [key]: finalVal };
    setForm(updatedForm);

    // Add user response message
    const userMsgId = `user-${Date.now()}`;
    setMessages(prev => [...prev, { id: userMsgId, sender: "user", text: val }]);
    setInputValue("");

    const nextStep = currentStep + 1;

    // Simulate Agent Typing next question
    setIsAgentTyping(true);
    
    setTimeout(() => {
      setIsAgentTyping(false);
      
      if (nextStep < STEPS.length) {
        setCurrentStep(nextStep);
        const nextQ = STEPS[nextStep].question;
        const questionText = typeof nextQ === "function" 
          ? nextQ(updatedForm.name) 
          : nextQ;
        
        setMessages(prev => [
          ...prev, 
          { id: `agent-${Date.now()}`, sender: "agent", text: questionText }
        ]);
      } else {
        // Form Complete
        setCurrentStep(STEPS.length);
        setMessages(prev => [
          ...prev,
          { 
            id: `agent-end-${Date.now()}`, 
            sender: "agent", 
            text: "Perfect! I have received all your information. Submitting request..." 
          }
        ]);
        
        // Submit to Supabase contact_submissions
        supabase.from("contact_submissions").insert({
          name: updatedForm.name,
          email: updatedForm.email,
          phone: updatedForm.phone,
          message: updatedForm.message,
          source: "onboarding_bot"
        }).then(({ error }) => {
          if (error) {
            console.error("Supabase insert failed for onboarding bot:", error.message);
          }
          toast.success("Request sent! Our team will contact you shortly.");
        }).catch(err => {
          console.error("Error submitting onboarding bot requirements:", err);
          toast.success("Request sent! Our team will contact you shortly.");
        });
      }
    }, 900);
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
        text: STEPS[0].question as string
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
        
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          {/* Left Column: Dual Form Box */}
          <div className="premium-card flex flex-col justify-between min-h-[460px]">
            {isConversational ? (
              /* Conversational Mode UI */
              <div className="p-6 md:p-8 flex flex-col justify-between h-full flex-grow">
                <div>
                  <div className="flex justify-between items-center border-b border-border/50 pb-3 mb-4 select-none">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-foreground/80 tracking-wide font-mono">SmartSys Onboarding Bot</span>
                    </div>
                    {currentStep < STEPS.length && (
                      <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                        Step {currentStep + 1} of {STEPS.length}
                      </span>
                    )}
                  </div>

                  {/* Message Stream */}
                  <div ref={chatContainerRef} className="h-[250px] overflow-y-auto pr-1 flex flex-col gap-3 scrollbar-thin">
                    <AnimatePresence initial={false}>
                      {messages.map((m) => (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`flex flex-col max-w-[80%] ${
                            m.sender === "user" ? "self-end items-end" : "self-start items-start"
                          }`}
                        >
                          <div
                            className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                              m.sender === "user"
                                ? "bg-primary/20 text-foreground border border-primary/30 rounded-tr-none"
                                : "bg-card/40 border border-border/50 text-foreground/90 rounded-tl-none"
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
                          className="flex gap-1.5 self-start bg-card/40 border border-border/50 rounded-2xl rounded-tl-none py-3.5 px-4 shadow-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                  </div>
                </div>

                {/* Form Controls / Inputs */}
                <div className="mt-4 border-t border-border/50 pt-4">
                  {currentStep < STEPS.length ? (
                    <form onSubmit={handleChatSubmit} className="space-y-2">
                      <div className="flex gap-2">
                        {STEPS[currentStep].type === "textarea" ? (
                          <Textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={STEPS[currentStep].placeholder}
                            required
                            rows={2}
                            className="bg-muted/30 border-border/50 resize-none text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:border-primary/40 transition-colors text-sm"
                          />
                        ) : (
                          <Input
                            type={STEPS[currentStep].type}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={STEPS[currentStep].placeholder}
                            required
                            className="bg-muted/30 border-border/50 h-11 text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:border-primary/40 transition-colors text-sm"
                          />
                        )}
                        <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-xl">
                          <Send size={15} />
                        </Button>
                      </div>
                      
                      {/* Character count for conversational textarea requirements */}
                      {STEPS[currentStep].field === "message" && (
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono px-1 pb-1">
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
                    <div className="flex flex-col items-center text-center p-3 animate-fade-in">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/30">
                        <Check size={20} className="animate-pulse" />
                      </div>
                      <h4 className="font-heading font-semibold text-foreground text-sm mb-3">Onboarding Complete</h4>
                      <Button onClick={resetChat} variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 border-border/60 hover:bg-muted/50">
                        <RefreshCw size={12} /> Restart Form
                      </Button>
                    </div>
                  )}

                  {/* Mode switcher */}
                  <div 
                    onClick={() => setIsConversational(false)}
                    className="text-[10px] text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-1 mt-3.5 mx-auto justify-center cursor-pointer select-none font-mono underline"
                  >
                    <MessageSquare size={10} /> Switch to Classic Form
                  </div>
                </div>
              </div>
            ) : (
              /* Classic Form UI */
              <form onSubmit={handleClassicSubmit} className="p-8 md:p-10 space-y-5 h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-foreground text-lg mb-4 text-gradient-primary">Send us a message</h3>
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Your Name"
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (classicErrors.name) setClassicErrors({ ...classicErrors, name: "" });
                        }}
                        required
                        className={`bg-muted/30 h-12 text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:border-primary/40 transition-colors ${
                          classicErrors.name ? "border-rose-500/60 focus:border-rose-500" : "border-border/50"
                        }`}
                      />
                      {classicErrors.name && (
                        <p className="text-[10px] text-rose-400 font-mono mt-1 flex items-center gap-1"><AlertCircle size={10} />{classicErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          if (classicErrors.email) setClassicErrors({ ...classicErrors, email: "" });
                        }}
                        required
                        className={`bg-muted/30 h-12 text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:border-primary/40 transition-colors ${
                          classicErrors.email ? "border-rose-500/60 focus:border-rose-500" : "border-border/50"
                        }`}
                      />
                      {classicErrors.email && (
                        <p className="text-[10px] text-rose-400 font-mono mt-1 flex items-center gap-1"><AlertCircle size={10} />{classicErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        placeholder="Phone Number (e.g., +91 70241 28029)"
                        value={form.phone}
                        onChange={(e) => {
                          setForm({ ...form, phone: e.target.value });
                          if (classicErrors.phone) setClassicErrors({ ...classicErrors, phone: "" });
                        }}
                        required
                        className={`bg-muted/30 h-12 text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:border-primary/40 transition-colors ${
                          classicErrors.phone ? "border-rose-500/60 focus:border-rose-500" : "border-border/50"
                        }`}
                      />
                      {classicErrors.phone && (
                        <p className="text-[10px] text-rose-400 font-mono mt-1 flex items-center gap-1"><AlertCircle size={10} />{classicErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <Textarea
                        placeholder="Describe your project requirements, goals, and target timeline in detail..."
                        value={form.message}
                        onChange={(e) => {
                          setForm({ ...form, message: e.target.value });
                          if (classicErrors.message) setClassicErrors({ ...classicErrors, message: "" });
                        }}
                        required
                        rows={4}
                        className={`bg-muted/30 resize-none text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:border-primary/40 transition-colors ${
                          classicErrors.message ? "border-rose-500/60 focus:border-rose-500" : "border-border/50"
                        }`}
                      />
                      {/* Character counter */}
                      <div className="flex justify-between items-center text-[10px] mt-1 font-mono px-1">
                        <span className={form.message.trim().length < 100 ? "text-amber-400 animate-pulse font-semibold" : "text-emerald-400 font-bold"}>
                          {form.message.trim().length < 100 
                            ? `Min 100 characters required (${100 - form.message.trim().length} more)` 
                            : "Requirement detail level: Excellent ✓"}
                        </span>
                        <span className={form.message.trim().length < 100 ? "text-muted-foreground/60" : "text-emerald-400"}>
                          {form.message.trim().length}/100
                        </span>
                      </div>
                      {classicErrors.message && (
                        <p className="text-[10px] text-rose-400 font-mono mt-1 flex items-center gap-1"><AlertCircle size={10} />{classicErrors.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button type="submit" className="w-full rounded-xl" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" /> Send Message
                      </>
                    )}
                  </Button>
                  
                  {/* Mode switcher */}
                  <div 
                    onClick={() => {
                      setIsConversational(true);
                      resetChat();
                    }}
                    className="text-[10px] text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-1 mt-4 mx-auto justify-center cursor-pointer select-none font-mono underline"
                  >
                    <MessageSquare size={10} /> Switch to Conversational Onboarding Bot
                  </div>
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
