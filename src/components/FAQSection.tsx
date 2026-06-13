import { useState, useEffect, useRef } from "react";
import SectionHeader from "./SectionHeader";
import { Terminal, Cpu, Database, Disc } from "lucide-react";

const faqs = [
  { q: "What AI services does AI SmartSyS offer?", a: "We offer AI development, chatbot building, data analytics, automation solutions, web and mobile app development powered by artificial intelligence." },
  { q: "How long does an AI project typically take?", a: "Project timelines vary based on complexity. A standard AI solution takes 4-12 weeks from discovery to deployment." },
  { q: "Do you offer custom AI solutions?", a: "Yes! Every solution is tailored to your specific business requirements and goals. We don't believe in one-size-fits-all." },
  { q: "What industries do you serve?", a: "We work across e-commerce, healthcare, finance, education, marketing, and more. Our AI solutions adapt to any industry." },
  { q: "How do you ensure data security?", a: "We implement enterprise-grade encryption, secure APIs, and follow industry best practices for data protection and privacy compliance." },
];

const FAQSection = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [displayedAnswer, setDisplayedAnswer] = useState<string>("");
  const [typingComplete, setTypingComplete] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const consoleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayedAnswer("");
    setTypingComplete(false);
    
    // Initial logs for command execution
    setTerminalLogs([
      `guest@smartsys:~$ ./query_faq.sh --question_id=0${selectedIdx + 1}`,
      `[SYS] Initializing natural language model v4.8...`,
      `[SYS] Indexing vector db keys matching query...`
    ]);

    let typeInterval: NodeJS.Timeout | number;

    // Delay simulating connection and retrieval, then start typewriter effect
    const logTimer = setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[SYS] Decrypting context buffer...`,
        `[SUCCESS] Match found (confidence: 99.8%). Printing reply:`
      ]);

      const answerText = faqs[selectedIdx].a;
      let charIdx = 0;

      typeInterval = setInterval(() => {
        if (charIdx < answerText.length) {
          setDisplayedAnswer(answerText.substring(0, charIdx + 1));
          charIdx++;
        } else {
          clearInterval(typeInterval as number);
          setTypingComplete(true);
        }
      }, 15); // Fast, snappy typing
    }, 500);

    return () => {
      clearTimeout(logTimer);
      if (typeInterval) {
        clearInterval(typeInterval as number);
      }
    };
  }, [selectedIdx]);

  // Scroll terminal logs container internally to the bottom if content grows
  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [terminalLogs, displayedAnswer]);

  return (
    <section id="faq" className="relative section-padding overflow-hidden bg-background">
      {/* Background Circuit Loop */}
      <div className="video-container opacity-5">
        <video autoPlay muted loop playsInline>
          <source src="https://assets.mixkit.co/videos/preview/mixkit-background-of-a-digital-circuit-board-looping-24709-large.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px]" />

      <div className="container mx-auto relative z-10 px-4">
        <SectionHeader badge="FAQ" title="Frequently Asked Questions" description="Find answers to common questions about our AI services." />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto mt-16 items-start">
          {/* Left Column: Command Buttons (Questions) */}
          <div className="lg:col-span-5 flex flex-col gap-3 w-full">
            {faqs.map((f, i) => {
              const isActive = selectedIdx === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedIdx(i)}
                  className={`w-full text-left p-4 rounded-2xl border font-mono transition-all duration-300 flex items-center justify-between text-xs sm:text-sm ${
                    isActive
                      ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(6,182,212,0.15)] lg:translate-x-3"
                      : "bg-card/30 border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:border-border"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={isActive ? "text-accent animate-pulse font-bold" : "text-muted-foreground/30"}>
                      {isActive ? "➔" : `0${i + 1}`}
                    </span>
                    <span>{f.q}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: AI QA Terminal Simulator */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-[var(--shadow-elevated)] p-0.5">
              {/* Terminal Window Header Bar */}
              <div className="bg-[#181818] px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-mono select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 font-medium tracking-tight text-zinc-400">smartsys-chatbot-shell</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-60">
                  <Terminal size={12} className="text-zinc-400" />
                  <span className="text-zinc-400">bash</span>
                </div>
              </div>

              {/* Terminal Console Body */}
              <div className="bg-[#121212] p-6 font-mono text-xs sm:text-sm leading-relaxed flex flex-col h-[380px] rounded-b-2xl">
                {/* Scrollable logs area */}
                <div 
                  ref={consoleContainerRef} 
                  className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-850"
                >
                  {/* System & Command execution logs */}
                  {terminalLogs.map((log, idx) => {
                    let textClass = "text-zinc-400";
                    if (log.startsWith("guest")) {
                      textClass = "text-zinc-200 font-semibold";
                    } else if (log.startsWith("[SYS]")) {
                      textClass = "text-cyan-400";
                    } else if (log.startsWith("[SUCCESS]")) {
                      textClass = "text-emerald-400 font-bold";
                    }
                    return (
                      <div key={idx} className={`${textClass} animate-fade-in`}>
                        {log}
                      </div>
                    );
                  })}

                  {/* Typewriter Answer Output */}
                  {displayedAnswer && (
                    <div className="text-zinc-100 border-t border-zinc-800/80 pt-3 mt-3 leading-relaxed">
                      {displayedAnswer}
                      {!typingComplete && (
                        <span className="inline-block w-1.5 h-4 ml-1.5 bg-primary typing-cursor align-middle" />
                      )}
                    </div>
                  )}
                </div>

                {/* Fixed bottom details bar */}
                <div className="mt-4 border-t border-zinc-800/80 pt-3 flex items-center justify-between text-[10px] text-zinc-500 select-none shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Cpu size={10} /> model: gemini-pro</span>
                    <span className="flex items-center gap-1"><Database size={10} /> source: local_kb</span>
                  </div>
                  <span className="flex items-center gap-1 animate-spin-slow"><Disc size={10} className="text-accent" /> sync_ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
