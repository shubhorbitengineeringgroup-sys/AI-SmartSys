import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { useTheme } from "@/context/ThemeContext";
import { 
  Terminal, Cpu, Database, Network, Server, Activity, 
  Search, FileText, Play, Pause, Code2, Check, Info 
} from "lucide-react";

interface VisualizerProps {
  theme: "light" | "dark";
}

// ─── SVG Step Illustrations (Hologram stage replacements) ───

const DiscoveryIllustration = ({ theme }: VisualizerProps) => {
  const isLight = theme === "light";
  return (
    <div className="flex items-center justify-center h-full w-full select-none">
      <svg viewBox="0 0 120 120" className="w-24 h-24 overflow-visible">
        {/* Document page shape */}
        <rect x="25" y="15" width="50" height="70" rx="4" fill="none" stroke={isLight ? "#94a3b8" : "#4b5563"} strokeWidth="1.5" />
        <line x1="33" y1="28" x2="67" y2="28" stroke={isLight ? "#cbd5e1" : "#374151"} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="33" y1="40" x2="67" y2="40" stroke={isLight ? "#cbd5e1" : "#374151"} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="33" y1="52" x2="55" y2="52" stroke={isLight ? "#cbd5e1" : "#374151"} strokeWidth="1.5" strokeLinecap="round" />

        {/* Database/Storage shape on bottom right */}
        <rect x="65" y="55" width="35" height="45" rx="3" fill={isLight ? "#f8fafc" : "#0f172a"} stroke={isLight ? "#2563eb" : "#22d3ee"} strokeWidth="1.5" />
        <line x1="72" y1="65" x2="93" y2="65" stroke={isLight ? "#93c5fd" : "#06b6d4"} strokeWidth="1" />
        <line x1="72" y1="75" x2="93" y2="75" stroke={isLight ? "#93c5fd" : "#06b6d4"} strokeWidth="1" />
        <line x1="72" y1="85" x2="85" y2="85" stroke={isLight ? "#93c5fd" : "#06b6d4"} strokeWidth="1" />

        {/* Magnifying Glass scanning */}
        <g className="animate-float" style={{ animationDuration: "4s" }}>
          <circle cx="45" cy="65" r="15" fill={isLight ? "rgba(219,234,254,0.3)" : "rgba(6,182,212,0.1)"} stroke={isLight ? "#2563eb" : "#22d3ee"} strokeWidth="1.5" />
          <line x1="56" y1="76" x2="72" y2="92" stroke={isLight ? "#2563eb" : "#22d3ee"} strokeWidth="2.5" strokeLinecap="round" />
        </g>
        
        {/* Floating active data particles */}
        <circle cx="58" cy="28" r="1.5" fill={isLight ? "#2563eb" : "#22d3ee"} className="animate-pulse" />
        <circle cx="80" cy="40" r="2" fill={isLight ? "#7c3aed" : "#a78bfa"} className="animate-ping" style={{ animationDuration: "2s" }} />
      </svg>
    </div>
  );
};

const StrategyIllustration = ({ theme }: VisualizerProps) => {
  const isLight = theme === "light";
  return (
    <div className="flex items-center justify-center h-full w-full select-none">
      <svg viewBox="0 0 120 120" className="w-24 h-24 overflow-visible">
        {/* Central routing hub */}
        <line x1="60" y1="60" x2="30" y2="30" stroke={isLight ? "#cbd5e1" : "#374151"} strokeWidth="1.5" />
        <line x1="60" y1="60" x2="90" y2="30" stroke={isLight ? "#cbd5e1" : "#374151"} strokeWidth="1.5" />
        <line x1="60" y1="60" x2="60" y2="95" stroke={isLight ? "#cbd5e1" : "#374151"} strokeWidth="1.5" />

        {/* Nodes */}
        <circle cx="60" cy="60" r="12" fill={isLight ? "#ffffff" : "#090d16"} stroke={isLight ? "#7c3aed" : "#a78bfa"} strokeWidth="2" />
        <circle cx="30" cy="30" r="8" fill={isLight ? "#ffffff" : "#090d16"} stroke={isLight ? "#2563eb" : "#22d3ee"} strokeWidth="1.5" />
        <circle cx="90" cy="30" r="8" fill={isLight ? "#ffffff" : "#090d16"} stroke={isLight ? "#2563eb" : "#22d3ee"} strokeWidth="1.5" />
        <circle cx="60" cy="95" r="10" fill={isLight ? "#ffffff" : "#090d16"} stroke={isLight ? "#16a34a" : "#34d399"} strokeWidth="2" />

        {/* Little core network patterns inside nodes */}
        <circle cx="60" cy="60" r="4" fill={isLight ? "#7c3aed" : "#a78bfa"} />
        <circle cx="60" cy="95" r="3" fill={isLight ? "#16a34a" : "#34d399"} />
        
        {/* Dashed outer orbit lines */}
        <circle cx="60" cy="60" r="24" fill="none" stroke={isLight ? "#e2e8f0" : "#1f2937"} strokeWidth="1" strokeDasharray="3 3" className="animate-[spin_10s_linear_infinite]" />

        {/* Traveling flow signal dots */}
        <circle cx="45" cy="45" r="2" fill={isLight ? "#2563eb" : "#22d3ee"}>
          <animate attributeName="cx" values="60;30" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="cy" values="60;30" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="75" cy="45" r="2" fill={isLight ? "#2563eb" : "#22d3ee"}>
          <animate attributeName="cx" values="60;90" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="cy" values="60;30" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

const DevelopmentIllustration = ({ theme }: VisualizerProps) => {
  const isLight = theme === "light";
  return (
    <div className="flex items-center justify-center h-full w-full select-none">
      <svg viewBox="0 0 120 120" className="w-24 h-24 overflow-visible">
        {/* Code window frame */}
        <rect x="15" y="25" width="55" height="40" rx="3" fill={isLight ? "#f8fafc" : "#111827"} stroke={isLight ? "#94a3b8" : "#374151"} strokeWidth="1.5" />
        <circle cx="23" cy="31" r="1.5" fill="#ff5f56" />
        <circle cx="28" cy="31" r="1.5" fill="#ffbd2e" />
        <circle cx="33" cy="31" r="1.5" fill="#27c93f" />
        
        {/* Code syntax outlines */}
        <line x1="23" y1="42" x2="48" y2="42" stroke={isLight ? "#7c3aed" : "#a78bfa"} strokeWidth="2" strokeLinecap="round" />
        <line x1="23" y1="50" x2="60" y2="50" stroke={isLight ? "#2563eb" : "#22d3ee"} strokeWidth="2" strokeLinecap="round" />
        <line x1="23" y1="58" x2="38" y2="58" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />

        {/* Git commit branch path on right */}
        <path d="M 85 20 L 85 100" fill="none" stroke={isLight ? "#cbd5e1" : "#374151"} strokeWidth="1.5" />
        <path d="M 85 45 C 105 45 105 75 85 75" fill="none" stroke={isLight ? "#7c3aed" : "#a78bfa"} strokeWidth="1.5" />

        {/* Commit nodes */}
        <circle cx="85" cy="35" r="3" fill={isLight ? "#2563eb" : "#22d3ee"} />
        <circle cx="98" cy="60" r="3.5" fill={isLight ? "#7c3aed" : "#a78bfa"} className="animate-pulse" />
        <circle cx="85" cy="85" r="3" fill={isLight ? "#2563eb" : "#22d3ee"} />
      </svg>
    </div>
  );
};

const LaunchIllustration = ({ theme }: VisualizerProps) => {
  const isLight = theme === "light";
  return (
    <div className="flex items-center justify-center h-full w-full select-none">
      <svg viewBox="0 0 120 120" className="w-24 h-24 overflow-visible">
        {/* Server Rack Box */}
        <rect x="25" y="20" width="70" height="75" rx="5" fill="none" stroke={isLight ? "#cbd5e1" : "#374151"} strokeWidth="1.5" />

        {/* Blade Server 1 */}
        <rect x="32" y="30" width="56" height="12" rx="2" fill={isLight ? "#f1f5f9" : "#0f172a"} stroke={isLight ? "#2563eb" : "#22d3ee"} strokeWidth="1" />
        <circle cx="40" cy="36" r="1.5" fill="#22c55e" className="animate-pulse" />
        <circle cx="46" cy="36" r="1.5" fill="#22c55e" />
        <line x1="56" y1="36" x2="80" y2="36" stroke={isLight ? "#cbd5e1" : "#374151"} strokeWidth="1.5" strokeLinecap="round" />

        {/* Blade Server 2 */}
        <rect x="32" y="50" width="56" height="12" rx="2" fill={isLight ? "#f1f5f9" : "#0f172a"} stroke={isLight ? "#2563eb" : "#22d3ee"} strokeWidth="1" />
        <circle cx="40" cy="56" r="1.5" fill="#22c55e" />
        <circle cx="46" cy="56" r="1.5" fill="#22c55e" className="animate-pulse" />
        <line x1="56" y1="56" x2="72" y2="56" stroke={isLight ? "#cbd5e1" : "#374151"} strokeWidth="1.5" strokeLinecap="round" />

        {/* Blade Server 3 */}
        <rect x="32" y="70" width="56" height="12" rx="2" fill={isLight ? "#f1f5f9" : "#0f172a"} stroke={isLight ? "#7c3aed" : "#a78bfa"} strokeWidth="1" />
        <circle cx="40" cy="76" r="1.5" fill="#22c55e" className="animate-pulse" />
        <circle cx="46" cy="76" r="1.5" fill="#eab308" className="animate-pulse" />
        <line x1="56" y1="76" x2="76" y2="76" stroke={isLight ? "#cbd5e1" : "#374151"} strokeWidth="1.5" strokeLinecap="round" />

        {/* Transmitting wireless signal ripples on top */}
        <path d="M 45 12 A 20 20 0 0 1 75 12" fill="none" stroke={isLight ? "#2563eb" : "#22d3ee"} strokeWidth="1.25" strokeLinecap="round" className="animate-ping" style={{ animationDuration: "2.5s" }} />
        <path d="M 50 15 A 12 12 0 0 1 70 15" fill="none" stroke={isLight ? "#7c3aed" : "#a78bfa"} strokeWidth="1.25" strokeLinecap="round" className="animate-pulse" />
      </svg>
    </div>
  );
};

// ─── Step 1: Discovery & Ingestion Visualizer ───
const DiscoveryVisualizer = ({ theme }: VisualizerProps) => {
  const isLight = theme === "light";
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const files = [
    { name: "customer_metrics.csv", size: "142.4 MB", status: "INGESTED" },
    { name: "req_spec_draft.pdf", size: "1.2 MB", status: "PARSED" },
    { name: "integration_apis.json", size: "45 KB", status: "INDEXING" }
  ];

  useEffect(() => {
    const fileInterval = setInterval(() => {
      setActiveFileIndex((prev) => (prev + 1) % files.length);
    }, 1800);
    return () => clearInterval(fileInterval);
  }, [files.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 xl:grid-cols-2 gap-3.5 items-center"
    >
      {/* Left Pane: Ingest Scan Document Sheet */}
      <div className={`p-4 rounded-xl border relative overflow-hidden text-left h-[175px] flex flex-col justify-between transition-all duration-500 ${
        isLight 
          ? "bg-white border-slate-200/80 shadow-sm text-slate-800" 
          : "bg-zinc-900 border-zinc-800 text-zinc-350"
      }`}>
        {/* Scanning laser sweep */}
        <div className={`absolute left-0 right-0 h-px animate-laser-sweep pointer-events-none ${
          isLight ? "bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "bg-cyan-400/80 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
        }`} />
        
        <p className={`text-[10px] font-bold tracking-widest uppercase border-b pb-2 flex items-center justify-between font-mono ${
          isLight ? "text-slate-400 border-slate-100" : "text-zinc-500 border-zinc-800"
        }`}>
          <span>Ingest Parser</span>
          <span className={isLight ? "text-blue-500 animate-pulse" : "text-cyan-400 animate-pulse"}>SCANNING</span>
        </p>

        {/* Mock parsed requirements text */}
        <div className="space-y-1.5 flex-1 mt-3.5 font-mono text-[9.5px] leading-relaxed">
          <div className="flex items-center gap-1.5">
            <span className={`w-1 h-1 rounded-full ${isLight ? "bg-slate-400" : "bg-zinc-650"}`} />
            <span className="font-bold shrink-0">INTENT:</span> <span>SCADA AI Agent Integration</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1 h-1 rounded-full ${isLight ? "bg-slate-400" : "bg-zinc-655"}`} />
            <span className="font-bold shrink-0">DATA:</span> <span>Ingesting 2.4M Historical Rows</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1 h-1 rounded-full ${isLight ? "bg-slate-400" : "bg-zinc-655"}`} />
            <span className="font-bold shrink-0">LIMIT:</span> <span className={isLight ? "text-blue-600 font-bold" : "text-cyan-400"}>Latency &lt; 100ms</span>
          </div>
        </div>

        {/* Dynamic parsing tag queue */}
        <div className="flex gap-2 mt-2 pt-2 border-t border-dashed border-border/10">
          <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded font-mono ${
            isLight ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
          }`}>
            STACK: NODE
          </span>
          <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded font-mono ${
            isLight ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
          }`}>
            MODEL: LLM
          </span>
        </div>
      </div>

      {/* Right Pane: Searching / Indexing Grid */}
      <div className={`flex flex-col items-center justify-center p-3.5 border rounded-xl h-[175px] transition-all duration-500 ${
        isLight ? "bg-slate-50/70 border-slate-200" : "bg-zinc-900/40 border-zinc-800/80"
      }`}>
        <div className="relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border border-dashed border-border/20">
          {/* Radial concentric rings */}
          <div className={`absolute w-18 h-18 rounded-full border border-dashed transition-colors duration-500 ${
            isLight ? "border-slate-200" : "border-zinc-800/85"
          }`} />
          <div className={`absolute w-10 h-10 rounded-full border border-dashed transition-colors duration-500 ${
            isLight ? "border-slate-300" : "border-zinc-700/60"
          }`} />

          {/* Radar search sweep cone */}
          <div className="absolute inset-0 origin-center animate-radar-sweep pointer-events-none" style={{
            background: isLight
              ? 'conic-gradient(from 0deg, rgba(59, 130, 246, 0.12) 0deg, rgba(59, 130, 246, 0) 120deg)'
              : 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.15) 0deg, rgba(6, 182, 212, 0) 120deg)'
          }} />

          {/* Search pins/nodes mapping */}
          <span className={`absolute top-1/4 left-1/3 w-2.5 h-2.5 rounded-full animate-pulse ${isLight ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" : "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"}`} />
          <span className={`absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full animate-ping ${isLight ? "bg-blue-400/80" : "bg-cyan-400/60"}`} />
          <span className={`absolute top-1/2 right-1/3 w-2 h-2 rounded-full animate-pulse ${isLight ? "bg-blue-500/85" : "bg-cyan-400/90"}`} />

          <Search size={16} className={isLight ? "text-blue-500 animate-pulse relative z-10" : "text-cyan-400 animate-pulse relative z-10"} />
        </div>
        
        {/* checklist metrics below radar */}
        <div className={`mt-3 w-full text-[9px] font-sans border-t pt-2 grid grid-cols-2 gap-1 text-left transition-colors duration-500 ${
          isLight ? "text-slate-500 border-slate-200" : "text-zinc-500 border-zinc-800"
        }`}>
          <div className="flex items-center gap-1">
            <Check size={10} className={isLight ? "text-blue-500" : "text-cyan-400"} />
            <span>Entities Parsed</span>
          </div>
          <div className="flex items-center gap-1">
            <Check size={10} className={isLight ? "text-blue-500" : "text-cyan-400"} />
            <span>Scope Mapped</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Step 2: Strategy Architecture Topology ───
const StrategyVisualizer = ({ theme }: VisualizerProps) => {
  const isLight = theme === "light";
  const [hoveredNode, setHoveredNode] = useState<string>("Router");

  const nodes = [
    { id: "UI", name: "Client Web Interface", type: "Client Gateway", x: 45, y: 100, info: "Browser UI Entry | WebSocket Connection | Auth: Secure Handshake" },
    { id: "Router", name: "LangGraph Prompt Router", type: "Agent Director", x: 160, y: 100, info: "Dynamic Semantic Intent Routing | Guardrail Validation | Temp: 0.0" },
    { id: "VectorDB", name: "Chroma Embeddings Index", type: "RAG Pipeline", x: 285, y: 45, info: "Pinecone Serverless | HNSW Index | Metric: Cosine Similarity" },
    { id: "LLM", name: "vLLM Inference Cluster", type: "Cognitive Processor", x: 285, y: 155, info: "Model: LLaMA-3-8B-Instruct | Parallel TP-4 GPU | Prec: FP16" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full justify-between gap-3.5"
    >
      {/* Topology SVG Network Diagram */}
      <div className={`relative flex-1 min-h-[160px] rounded-lg border p-2 overflow-hidden flex items-center justify-center transition-all duration-500 ${
        isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-955/80 border-zinc-900/80"
      }`}>
        <svg viewBox="0 0 360 200" className="w-full h-full max-h-[170px] overflow-visible">
          {/* Node Connections */}
          {/* UI to Router */}
          <path d="M 65 100 L 135 100" fill="none" stroke={isLight ? "#cbd5e1" : "#27272a"} strokeWidth="1.5" className="opacity-60" />
          <path d="M 65 100 L 135 100" fill="none" stroke={isLight ? "#2563eb" : "#22d3ee"} strokeWidth="2.5" strokeLinecap="round" className="animate-flow-dash" />
          
          {/* Router to VectorDB */}
          <path d="M 185 90 Q 225 45 260 45" fill="none" stroke={isLight ? "#cbd5e1" : "#27272a"} strokeWidth="1.5" className="opacity-60" />
          <path d="M 185 90 Q 225 45 260 45" fill="none" stroke={isLight ? "#7c3aed" : "#a78bfa"} strokeWidth="2.5" strokeLinecap="round" className="animate-flow-dash" />

          {/* Router to LLM */}
          <path d="M 185 110 Q 225 155 260 155" fill="none" stroke={isLight ? "#cbd5e1" : "#27272a"} strokeWidth="1.5" className="opacity-60" />
          <path d="M 185 110 Q 225 155 260 155" fill="none" stroke={isLight ? "#7c3aed" : "#a78bfa"} strokeWidth="2.5" strokeLinecap="round" className="animate-flow-dash" />

          {/* VectorDB to LLM (Retrieval Context) */}
          <path d="M 285 70 L 285 130" fill="none" stroke={isLight ? "#cbd5e1" : "#27272a"} strokeWidth="1.5" className="opacity-60" />
          <path d="M 285 70 L 285 130" fill="none" stroke={isLight ? "#2563eb" : "#22d3ee"} strokeWidth="2.5" strokeLinecap="round" className="animate-flow-dash" />
          
          {/* LLM return to UI */}
          <path d="M 270 165 C 160 210 90 190 50 120" fill="none" stroke={isLight ? "#cbd5e1" : "#27272a"} strokeWidth="1.5" className="opacity-60" />
          <path d="M 270 165 C 160 210 90 190 50 120" fill="none" stroke={isLight ? "#16a34a" : "#34d399"} strokeWidth="2.5" strokeLinecap="round" className="animate-flow-dash" />

          {/* Nodes drawing */}
          {nodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            return (
              <g 
                key={node.id} 
                className="cursor-pointer" 
                onMouseEnter={() => setHoveredNode(node.id)}
                onClick={() => setHoveredNode(node.id)}
              >
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r="20" 
                  fill={isLight ? "#f8fafc" : "#090d16"} 
                  stroke={isHovered ? (isLight ? "#2563eb" : "#22d3ee") : (isLight ? "#cbd5e1" : "#27272a")} 
                  strokeWidth="2.5" 
                  className="transition-all duration-300"
                />
                
                {isHovered && (
                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r="24" 
                    fill="none" 
                    stroke={isLight ? "#2563eb" : "#22d3ee"} 
                    strokeWidth="1" 
                    className="opacity-45 animate-pulse"
                  />
                )}
                
                {/* Node Icons inside circle */}
                <foreignObject x={node.x - 10} y={node.y - 10} width="20" height="20" className="pointer-events-none">
                  <div className={`w-full h-full flex items-center justify-center ${
                    isHovered 
                      ? (isLight ? "text-blue-600" : "text-cyan-400") 
                      : (isLight ? "text-slate-400" : "text-zinc-650")
                  } transition-colors duration-300`}>
                    {node.id === "UI" && <Server size={11} />}
                    {node.id === "Router" && <Network size={11} />}
                    {node.id === "VectorDB" && <Database size={11} />}
                    {node.id === "LLM" && <Cpu size={11} />}
                  </div>
                </foreignObject>
                
                {/* Labels */}
                <text 
                  x={node.x} 
                  y={node.y + 32} 
                  textAnchor="middle" 
                  className={`text-[9px] font-sans font-bold tracking-widest transition-colors duration-300 ${
                    isHovered 
                      ? (isLight ? "fill-blue-600 font-extrabold" : "fill-cyan-300") 
                      : (isLight ? "fill-slate-400" : "fill-zinc-650")
                  }`}
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Inspector Console Box */}
      <div className={`p-3 border rounded-lg text-left select-none transition-all duration-500 ${
        isLight ? "bg-slate-50 border-slate-200" : "bg-zinc-900/60 border-zinc-800/80"
      }`}>
        <p className={`text-[10px] font-bold uppercase tracking-widest border-b pb-1.5 mb-2 flex items-center gap-1.5 font-mono ${
          isLight ? "text-slate-400 border-slate-200" : "text-zinc-500 border-zinc-800/80"
        }`}>
          <Info size={11} className={isLight ? "text-blue-500" : "text-cyan-400"} />
          <span>System Topology Blueprint</span>
        </p>
        <div>
          <div className="flex items-center justify-between text-xs mb-1 font-sans">
            <span className={`font-bold ${isLight ? "text-slate-800" : "text-white"}`}>{nodes.find(n => n.id === hoveredNode)?.name}</span>
            <span className={`text-[9px] font-bold border px-1.5 rounded uppercase ${
              isLight 
                ? "text-blue-600 border-blue-200 bg-blue-50/50" 
                : "text-cyan-400 border-cyan-500/25 bg-cyan-500/5"
            }`}>
              {nodes.find(n => n.id === hoveredNode)?.type}
            </span>
          </div>
          <p className={`text-[11px] font-sans leading-relaxed ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
            {nodes.find(n => n.id === hoveredNode)?.info}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Step 3: Dev Compiler Terminal with AI Agent sidecar ───
const DevelopmentVisualizer = ({ theme }: VisualizerProps) => {
  const isLight = theme === "light";
  const [codeText, setCodeText] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [compileProgress, setCompileProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const codeScript = [
    "# model_fine_tune.py",
    "from peft import LoraConfig, get_peft_model",
    "peft_config = LoraConfig(",
    "    r=16, lora_alpha=32,",
    "    target_modules=['q_proj', 'v_proj'],",
    "    lora_dropout=0.05,",
    "    task_type='CAUSAL_LM'",
    ")",
    "model = get_peft_model(base_model, peft_config)",
    "print('LoRA adapter injection: SUCCESS')",
  ];

  const terminalOutput = [
    "$ python src/train.py",
    "Loading weights: Meta-Llama-3-8B...",
    "Injecting LoRA adapters... SUCCESS",
    "Epoch 1/3 | Loss: 1.842 | Time: 42s",
    "Epoch 2/3 | Loss: 0.941 | Time: 40s",
    "Epoch 3/3 | Loss: 0.124 | Time: 41s",
    "✔ Exporting model output... DONE",
    "$ pytest tests/test_inference.py",
    "tests/test_inference.py::test_latency PASSED [100%]",
    "tests/test_inference.py::test_dialog PASSED [100%]",
    "✔ All unit tests passed. [COMPILED]"
  ];

  // Code writing typewriter effect
  useEffect(() => {
    let charIndex = 0;
    let currentLine = 0;
    let fullText = "";
    setCodeText("");
    
    const codeTimer = setInterval(() => {
      if (currentLine < codeScript.length) {
        const line = codeScript[currentLine];
        if (charIndex < line.length) {
          fullText += line[charIndex];
          setCodeText(fullText);
          charIndex++;
        } else {
          fullText += "\n";
          setCodeText(fullText);
          currentLine++;
          charIndex = 0;
        }
      } else {
        clearInterval(codeTimer);
      }
    }, 12);

    return () => clearInterval(codeTimer);
  }, []);

  // Terminal logging logic
  useEffect(() => {
    setTerminalLines([]);
    setCompileProgress(0);
    setIsDone(false);

    let lineIndex = 0;
    const logTimer = setInterval(() => {
      if (lineIndex < terminalOutput.length) {
        const line = terminalOutput[lineIndex];
        
        if (line.includes("Epoch 1")) setCompileProgress(33);
        else if (line.includes("Epoch 2")) setCompileProgress(66);
        else if (line.includes("Epoch 3")) setCompileProgress(100);

        setTerminalLines((prev) => [...prev, line]);
        lineIndex++;
      } else {
        setIsDone(true);
        clearInterval(logTimer);
      }
    }, 700);

    return () => clearInterval(logTimer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 xl:grid-cols-12 gap-3 h-full select-none"
    >
      {/* VSCode IDE mock */}
      <div className={`xl:col-span-8 flex flex-col border rounded-lg overflow-hidden h-[175px] text-[10px] text-left transition-all duration-500 ${
        isLight 
          ? "bg-white border-slate-200 shadow-sm text-slate-800" 
          : "bg-[#181818] border-zinc-800 text-zinc-350"
      }`}>
        <div className={`flex items-center justify-between border-b px-3 py-1.5 text-zinc-500 font-sans transition-colors duration-500 ${
          isLight ? "bg-[#f3f4f6] border-slate-200 text-slate-500" : "bg-[#0c0d0e] border-zinc-800 text-zinc-500"
        }`}>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span className={`font-semibold font-mono text-[9px] ${isLight ? "text-slate-700" : "text-zinc-300"}`}>fine_tune.py</span>
          </div>
          <span className="text-[8px] font-mono tracking-wider">Workspace</span>
        </div>
        
        {/* Editor Content */}
        <div className={`flex-1 p-2.5 font-mono overflow-y-auto whitespace-pre leading-relaxed ${
          isLight ? "bg-white text-slate-800" : "bg-[#1e1e1e] text-zinc-350"
        }`}>
          {codeText.split("\n").map((line, idx) => {
            const isComment = line.trim().startsWith("#");
            const isImport = line.includes("import") || line.includes("from");
            
            let lineClass = "";
            if (isComment) lineClass = isLight ? "text-emerald-600 font-bold" : "text-emerald-500";
            else if (isImport) lineClass = isLight ? "text-[#a71d5d] font-bold" : "text-[#c678dd]";
            else if (line.includes("LoraConfig") || line.includes("get_peft_model")) lineClass = isLight ? "text-[#0086b3]" : "text-[#e5c07b]";

            return (
              <div key={idx} className={lineClass}>
                {line}
              </div>
            );
          })}
          <span className="inline-block w-1.5 h-3.5 bg-cyan-400 animate-blink ml-0.5" />
        </div>
      </div>

      {/* AI Agent Sidecar Panel */}
      <div className={`xl:col-span-4 flex flex-col border rounded-lg overflow-hidden h-[175px] text-[9px] text-left transition-all duration-500 ${
        isLight 
          ? "bg-slate-50 border-slate-200 shadow-sm text-slate-755" 
          : "bg-[#121212] border-zinc-850 text-zinc-400"
      }`}>
        <div className={`flex items-center justify-between border-b px-3 py-1.5 font-sans transition-colors duration-500 ${
          isLight ? "bg-[#e2e8f0] border-slate-200 text-slate-650" : "bg-[#09090b] border-zinc-850 text-zinc-500"
        }`}>
          <span className={`font-bold font-mono text-[8.5px] ${isLight ? "text-slate-800" : "text-zinc-200"}`}>🤖 AI AGENT</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        
        <div className="flex-1 p-2.5 font-mono space-y-2 overflow-y-auto leading-relaxed">
          <div className={`border-b pb-1.5 ${isLight ? "border-slate-200 text-slate-500" : "border-zinc-800 text-zinc-550"}`}>
            <span className="font-bold uppercase tracking-wider text-[8px]">Status:</span>
            <p className={`font-sans mt-0.5 font-semibold text-[9px] ${isLight ? "text-slate-700" : "text-zinc-350"}`}>Generating unit tests...</p>
          </div>
          
          <div className="space-y-1 text-[8.5px]">
            <p className="text-[7.5px] font-bold text-zinc-550 uppercase tracking-wider">Agent Logs:</p>
            <div className={`p-1 rounded text-[7.5px] leading-relaxed ${isLight ? "bg-slate-100/70 text-slate-650" : "bg-zinc-900 text-zinc-550"}`}>
              [AGENT] Fine-tune hook active. Checking autocomplete parameters...
            </div>
            <div className={`p-1 rounded text-[7.5px] leading-relaxed ${isLight ? "bg-slate-100/70 text-slate-655" : "bg-zinc-900 text-zinc-555"}`}>
              [TESTS] Autogenerating modules for validation layers.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Step 4: Live Operations Monitor ───
const LaunchVisualizer = ({ theme }: VisualizerProps) => {
  const isLight = theme === "light";
  const [latencyData, setLatencyData] = useState<number[]>([
    124, 138, 120, 145, 132, 128, 140, 134, 122, 130, 118, 124
  ]);
  const [cpuVal, setCpuVal] = useState(34);
  const [logs, setLogs] = useState<string[]>([
    "16:10:20 - INFO  - CI/CD Deploy Stage... SUCCESS",
    "16:10:21 - GET   - /v1/system/health - 200 OK (8ms)",
    "16:10:22 - POST  - /v1/agent/chat - 200 OK (124ms)"
  ]);

  // Live charting operations data stream
  useEffect(() => {
    const timer = setInterval(() => {
      setLatencyData((prev) => {
        const nextVal = Math.floor(105 + Math.random() * 45);
        return [...prev.slice(1), nextVal];
      });
      setCpuVal(Math.floor(28 + Math.random() * 15));

      const endpoints = ["/v1/chat/completions", "/v1/embeddings", "/v1/agent/chat", "/v1/system/health"];
      const responseTimes = [124, 45, 112, 6];
      const randIdx = Math.floor(Math.random() * endpoints.length);
      const randEP = endpoints[randIdx];
      const randRT = responseTimes[randIdx];
      const method = randEP.includes("completions") || randEP.includes("chat") ? "POST" : "GET";
      const timeStr = new Date().toTimeString().split(" ")[0];
      
      const newLog = `${timeStr} - ${method}  - ${randEP} - 200 OK (${randRT}ms)`;
      setLogs((prev) => [...prev.slice(-3), newLog]);
    }, 1400);

    return () => clearInterval(timer);
  }, []);

  const maxVal = 180;
  const chartWidth = 320;
  const chartHeight = 45;
  
  const points = latencyData.map((val, i) => {
    const x = i * (chartWidth / (latencyData.length - 1));
    const y = chartHeight - (val / maxVal) * chartHeight;
    return { x, y };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L 0 ${chartHeight} Z`;

  const pipelineStages = [
    { name: "Build", status: "PASS" },
    { name: "Test", status: "PASS" },
    { name: "Deploy", status: "PASS" },
    { name: "Monitor", status: "ACTIVE" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full justify-between gap-3 text-left select-none"
    >
      {/* CI/CD Pipeline flow */}
      <div className={`p-2 rounded-xl border flex items-center justify-between text-[9px] font-sans transition-all duration-500 ${
        isLight ? "bg-slate-50 border-slate-200" : "bg-zinc-900/40 border-zinc-900"
      }`}>
        <span className="font-bold uppercase tracking-widest text-[8px] text-zinc-500 shrink-0 ml-1">CI/CD:</span>
        <div className="flex items-center gap-3.5 flex-1 justify-end">
          {pipelineStages.map((stage, i) => {
            const isActive = stage.status === "ACTIVE";
            return (
              <div key={stage.name} className="flex items-center gap-1">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono text-[7px] font-bold ${
                  isActive 
                    ? (isLight ? "bg-blue-600 text-white animate-pulse" : "bg-cyan-500 text-black animate-pulse")
                    : (isLight ? "bg-emerald-100 text-emerald-700" : "bg-emerald-500/10 text-emerald-400")
                }`}>
                  {isActive ? "●" : "✓"}
                </span>
                <span className={`font-semibold text-[8.5px] ${
                  isActive 
                    ? (isLight ? "text-blue-600" : "text-cyan-400") 
                    : (isLight ? "text-slate-655" : "text-zinc-400")
                }`}>{stage.name}</span>
                {i < 3 && <span className={`text-[7px] ${isLight ? "text-slate-300" : "text-zinc-700"}`}>➔</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cluster Metrics row */}
      <div className="grid grid-cols-3 gap-2">
        {/* CPU circular progress */}
        <div className={`flex items-center gap-2 p-1.5 border rounded-lg transition-colors duration-500 ${
          isLight ? "bg-white border-slate-200" : "bg-zinc-900/40 border-zinc-900/60"
        }`}>
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="16" cy="16" r="12" fill="none" stroke={isLight ? "#e2e8f0" : "#1f2937"} strokeWidth="2.5" />
              <circle 
                cx="16" cy="16" r="12" fill="none" stroke={isLight ? "#2563eb" : "#22d3ee"} strokeWidth="2.5" 
                strokeDasharray="75" 
                strokeDashoffset={75 - (75 * cpuVal) / 100}
                className="transition-all duration-300"
              />
            </svg>
            <span className={`absolute text-[8px] font-bold font-mono ${isLight ? "text-blue-600" : "text-cyan-400"}`}>{cpuVal}%</span>
          </div>
          <div className="text-left leading-none font-sans">
            <span className="text-[7.5px] text-zinc-555 font-bold uppercase tracking-wide">CPU</span>
            <p className={`text-[9px] font-semibold mt-0.5 ${isLight ? "text-slate-700" : "text-zinc-300"}`}>Cluster</p>
          </div>
        </div>

        {/* Memory circular progress */}
        <div className={`flex items-center gap-2 p-1.5 border rounded-lg transition-colors duration-500 ${
          isLight ? "bg-white border-slate-200" : "bg-zinc-900/40 border-zinc-900/60"
        }`}>
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="16" cy="16" r="12" fill="none" stroke={isLight ? "#e2e8f0" : "#1f2937"} strokeWidth="2.5" />
              <circle 
                cx="16" cy="16" r="12" fill="none" stroke={isLight ? "#7c3aed" : "#a78bfa"} strokeWidth="2.5" 
                strokeDasharray="75" 
                strokeDashoffset={75 - (75 * 72.4) / 100}
              />
            </svg>
            <span className={`absolute text-[8px] font-bold font-mono ${isLight ? "text-purple-650" : "text-purple-400"}`}>72%</span>
          </div>
          <div className="text-left leading-none font-sans">
            <span className="text-[7.5px] text-zinc-555 font-bold uppercase tracking-wide">RAM</span>
            <p className={`text-[9px] font-semibold mt-0.5 ${isLight ? "text-slate-700" : "text-zinc-300"}`}>11.6GB</p>
          </div>
        </div>

        {/* Status beacon indicator */}
        <div className={`flex items-center gap-2 p-1.5 border rounded-lg transition-colors duration-500 ${
          isLight ? "bg-white border-slate-200" : "bg-zinc-900/40 border-zinc-900/60"
        }`}>
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <span className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative z-10" />
            </span>
          </div>
          <div className="text-left leading-none font-sans">
            <span className="text-[7.5px] text-zinc-555 font-bold uppercase tracking-wide">Status</span>
            <p className="text-[9px] text-emerald-500 font-bold font-mono mt-0.5">Live 99.9%</p>
          </div>
        </div>
      </div>

      {/* Latency line graph */}
      <div className={`p-2.5 rounded-lg border transition-all duration-500 ${
        isLight ? "bg-white border-slate-200" : "bg-zinc-950 border-zinc-900/80"
      }`}>
        <p className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest border-b pb-1 mb-2 flex items-center justify-between border-border/10">
          <span className="flex items-center gap-1.5">
            <Activity size={11} className={isLight ? "text-blue-500 animate-pulse" : "text-cyan-400 animate-pulse"} />
            Cloud Latency (ms)
          </span>
          <span className="text-[8.5px] font-mono text-zinc-650">180ms Max</span>
        </p>
        <div className="h-11 w-full relative overflow-visible">
          <svg className="w-full h-full" viewBox="0 0 320 45" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chart-grad-light" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.18)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
              </linearGradient>
              <linearGradient id="chart-grad-dark" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.22)" />
                <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
              </linearGradient>
              <linearGradient id="stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isLight ? "#2563eb" : "#22d3ee"} />
                <stop offset="100%" stopColor={isLight ? "#7c3aed" : "#a78bfa"} />
              </linearGradient>
            </defs>
            <line x1="0" y1="15" x2="320" y2="15" stroke={isLight ? "#f1f5f9" : "#1f2937/30"} strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="0" y1="30" x2="320" y2="30" stroke={isLight ? "#f1f5f9" : "#1f2937/30"} strokeWidth="0.75" strokeDasharray="3 3" />
            
            <path d={areaD} fill={isLight ? "url(#chart-grad-light)" : "url(#chart-grad-dark)"} />
            <path d={pathD} fill="none" stroke="url(#stroke-grad)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Scrolling logs output stream */}
      <div className={`p-2 border rounded-lg text-[8.5px] font-mono space-y-1 transition-all duration-500 ${
        isLight ? "bg-slate-50 border-slate-200 text-slate-655" : "bg-zinc-900/60 border-zinc-855 text-zinc-455"
      }`}>
        {logs.map((log, index) => {
          const isPost = log.includes("POST");
          return (
            <div key={index} className="truncate flex items-center justify-between font-mono">
              <span className="truncate">{log.split(" - ")[0]} - <span className={isPost ? "text-purple-500 font-semibold" : "text-blue-500"}>{log.split(" - ")[1]}</span> - {log.split(" - ")[2]}</span>
              <span className={`font-bold shrink-0 ${isLight ? "text-emerald-600" : "text-emerald-400"}`}>{log.split(" - ")[3]}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ─── 3D-Like Vector Illustration Stage Component ───
interface HologramStageProps {
  theme: "light" | "dark";
  activeStep: number;
}

const HologramStage = ({ theme, activeStep }: HologramStageProps) => {
  const isLight = theme === "light";
  
  const labels = ["DATA DISCOVERY", "STRATEGY SYSTEM", "AGILE COMPILER", "MONITORING NODES"];
  const colors = [
    isLight ? "text-blue-600" : "text-cyan-400",
    isLight ? "text-purple-650" : "text-purple-400",
    isLight ? "text-emerald-650" : "text-emerald-450",
    isLight ? "text-blue-600" : "text-blue-400"
  ];

  return (
    <div className="relative flex flex-col items-center justify-center h-full min-h-[240px] w-full select-none">
      {/* Reticle Brackets wrapping the vector stage */}
      <div className="absolute w-36 h-36 pointer-events-none flex items-center justify-center">
        {/* Top-left corner */}
        <span className={`absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 transition-colors duration-500 ${isLight ? "border-slate-350" : "border-zinc-700/60"}`} />
        {/* Top-right corner */}
        <span className={`absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 transition-colors duration-500 ${isLight ? "border-slate-350" : "border-zinc-700/60"}`} />
        {/* Bottom-left corner */}
        <span className={`absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 transition-colors duration-500 ${isLight ? "border-slate-350" : "border-zinc-700/60"}`} />
        {/* Bottom-right corner */}
        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 transition-colors duration-500 ${isLight ? "border-slate-350" : "border-zinc-700/60"}`} />
      </div>

      {/* Rotating outer compass ring */}
      <div className={`absolute w-30 h-30 rounded-full border border-dashed animate-radar-sweep opacity-25 pointer-events-none ${
        isLight ? "border-slate-400" : "border-zinc-650"
      }`} />
      
      {/* Floating Vector Illustration stage */}
      <div className="relative z-10 w-28 h-28 flex items-center justify-center">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full h-full flex items-center justify-center"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full flex items-center justify-center"
          >
            {activeStep === 0 && <DiscoveryIllustration theme={theme} />}
            {activeStep === 1 && <StrategyIllustration theme={theme} />}
            {activeStep === 2 && <DevelopmentIllustration theme={theme} />}
            {activeStep === 3 && <LaunchIllustration theme={theme} />}
          </motion.div>
        </motion.div>
      </div>

      {/* Base Light Pedestal */}
      <div className="absolute bottom-2 flex flex-col items-center justify-center w-full">
        {/* Glowing pedestal ellipse */}
        <div className={`w-20 h-3.5 rounded-full filter blur-[2px] opacity-35 ${
          isLight ? "bg-gradient-to-t from-blue-400 to-transparent" : "bg-gradient-to-t from-cyan-400 to-transparent"
        }`} />
        
        {/* Spotlight light beam projecting up */}
        <div className={`w-10 h-20 absolute bottom-1.5 filter blur-md opacity-20 pointer-events-none ${
          isLight ? "bg-gradient-to-t from-blue-300 to-transparent" : "bg-gradient-to-t from-cyan-500/80 to-transparent"
        }`} style={{ transform: "perspective(80px) rotateX(45deg)" }} />

        {/* Text marker details */}
        <div className="mt-3 text-center select-none font-mono">
          <span className={`text-[8.5px] font-bold tracking-widest uppercase ${colors[activeStep]}`}>
            {labels[activeStep]}
          </span>
          <p className={`text-[7px] mt-0.5 tracking-wide ${isLight ? "text-slate-400" : "text-zinc-600"}`}>
            VECTOR // INTEGRATION_0{activeStep + 1}
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Timeline Steps Data ───
const steps = [
  {
    title: "Discovery",
    desc: "We analyze your needs and define project scope.",
    status: "SCANNING_REQS",
    coords: "NODE_01 // SEC_DISC",
    illustration: "discovery",
    glowLight: "shadow-[0_4px_25px_rgba(59,130,246,0.04)] border-slate-200/80",
    glowDark: "shadow-[0_0_20px_rgba(6,182,212,0.12)] border-cyan-500/20"
  },
  {
    title: "Strategy",
    desc: "We design a tailored AI-powered solution.",
    status: "MAPPING_PIPELINE",
    coords: "NODE_02 // SEC_STRAT",
    illustration: "strategy",
    glowLight: "shadow-[0_4px_25px_rgba(124,58,237,0.04)] border-slate-200/80",
    glowDark: "shadow-[0_0_20px_rgba(167,139,250,0.12)] border-purple-500/20"
  },
  {
    title: "Development",
    desc: "Agile sprints bring your solution to life.",
    status: "TRAINING_MODEL",
    coords: "NODE_03 // SEC_DEV",
    illustration: "development",
    glowLight: "shadow-[0_4px_25px_rgba(22,163,74,0.04)] border-slate-200/80",
    glowDark: "shadow-[0_0_20px_rgba(52,211,153,0.12)] border-emerald-500/20"
  },
  {
    title: "Launch",
    desc: "Deploy, monitor, and continuously optimize.",
    status: "SYSTEM_ONLINE",
    coords: "NODE_04 // SEC_LIVE",
    illustration: "launch",
    glowLight: "shadow-[0_4px_25px_rgba(37,99,235,0.04)] border-slate-200/80",
    glowDark: "shadow-[0_0_20px_rgba(59,130,246,0.12)] border-blue-500/20"
  },
];

// ─── Main Section Component ───
const OurProcess = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [activeStep, setActiveStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (progressInterval.current) clearInterval(progressInterval.current);
      return;
    }

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((prevStep) => (prevStep + 1) % steps.length);
          return 0;
        }
        return prev + 1.25; // Cycles step roughly every 4.8 seconds
      });
    }, 60);

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPaused]);

  const handleStepClick = (idx: number) => {
    setActiveStep(idx);
    setProgress(0);
    setIsPaused(true);
  };

  return (
    <section id="process" className="relative py-28 overflow-hidden bg-background">
      {/* Inline styles for custom animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-radar-sweep {
          animation: radar-sweep 5s linear infinite;
        }
        @keyframes laser-sweep {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-laser-sweep {
          animation: laser-sweep 3s ease-in-out infinite;
        }
        @keyframes flow-dash {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-flow-dash {
          stroke-dasharray: 8 12;
          animation: flow-dash 1.5s linear infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}} />

      {/* Tech Grid Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border) / 0.15) 1px, transparent 0),
            linear-gradient(to bottom, hsl(var(--border) / 0.15) 1px, transparent 0)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.5,
        }}
      />

      {/* Soft Decorative Glow Spotlights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto relative z-10 px-4">
        <SectionHeader badge="Our Process" title="How We Work" description="A streamlined dashboard showing our approach from strategy discovery to live deployment." />

        <div className="relative max-w-6xl mx-auto mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* LEFT SIDE: Vercel-style Continuous Vertical Timeline Selector (40% width) */}
            <div className="lg:col-span-5 relative pl-10 flex flex-col justify-between gap-6 py-2 select-none">
              
              {/* The timeline track running vertically */}
              <div className={`absolute left-[20px] top-4 bottom-4 w-[2px] transition-colors duration-500 ${
                isLight ? "bg-slate-200" : "bg-zinc-800"
              }`} />

              {steps.map((s, i) => {
                const isActive = activeStep === i;
                
                return (
                  <div 
                    key={s.title}
                    onClick={() => handleStepClick(i)}
                    className="relative cursor-pointer group"
                  >
                    {/* Sliding indicator dot on the track */}
                    <div className={`absolute -left-[29px] top-2.5 w-4 h-4 rounded-full border flex items-center justify-center z-20 transition-all duration-500 ${
                      isActive 
                        ? (isLight ? "border-blue-650 bg-white shadow-sm" : "border-cyan-400 bg-zinc-950 shadow-[0_0_8px_rgba(6,182,212,0.6)]")
                        : (isLight ? "border-slate-300 bg-slate-100" : "border-zinc-800 bg-zinc-900")
                    }`}>
                      {isActive ? (
                        <span className={`w-2 h-2 rounded-full animate-pulse ${isLight ? "bg-blue-600" : "bg-cyan-400"}`} />
                      ) : (
                        <span className={`w-1.5 h-1.5 rounded-full ${isLight ? "bg-slate-350" : "bg-zinc-700"}`} />
                      )}
                    </div>

                    {/* Step Card Text Box */}
                    <div className={`p-4 rounded-xl border transition-all duration-500 text-left relative overflow-hidden ${
                      isActive
                        ? (isLight ? "bg-white border-blue-200/85 shadow-sm" : "bg-[#0c101a] border-primary/20 shadow-card")
                        : (isLight ? "bg-transparent border-transparent hover:border-slate-200" : "bg-transparent border-transparent hover:border-zinc-800")
                    }`}>
                      {/* Active step progress indicator bottom line */}
                      {isActive && !isPaused && (
                        <div 
                          className={`absolute bottom-0 left-0 h-[1.5px] transition-all duration-75 ${
                            isLight ? "bg-blue-600" : "bg-gradient-to-r from-cyan-400 to-purple-500"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      )}

                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500">
                          STEP 0{i + 1}
                        </span>
                        {isPaused && isActive && (
                          <span className="text-[9px] font-mono text-zinc-450/85 bg-zinc-800/10 dark:bg-zinc-850/40 px-1.5 py-0.5 rounded flex items-center gap-1 select-none">
                            <Pause size={8} /> Paused
                          </span>
                        )}
                      </div>
                      <h3 className={`font-heading font-semibold text-base mb-1 transition-colors duration-305 ${
                        isActive ? (isLight ? "text-blue-650 font-bold" : "text-primary") : "text-foreground"
                      }`}>
                        {s.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {s.desc}
                      </p>
                      
                      {/* Telemetry metadata coordinate tags */}
                      <div className="mt-2.5 flex gap-4 font-mono text-[9px] text-zinc-400/60 select-none border-t border-border/10 pt-2">
                        <span>{s.coords}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Play/Pause cycling control button */}
              {isPaused && (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    setIsPaused(false);
                    setProgress(0);
                  }}
                  className={`mt-2 text-[10px] font-mono font-bold flex items-center gap-1.5 justify-center self-start px-3 py-1.5 rounded border cursor-pointer transition-all ${
                    isLight 
                      ? "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100" 
                      : "text-cyan-400 bg-cyan-500/5 border-cyan-500/15 hover:bg-cyan-500/10"
                  }`}
                >
                  <Play size={10} /> RESUME AUTO-CYCLE
                </motion.button>
              )}
            </div>

            {/* RIGHT SIDE: Multi-Dimensional Cockpit (60% width) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className={`w-full p-0.5 rounded-2xl transition-all duration-500 ${
                isLight ? steps[activeStep].glowLight : steps[activeStep].glowDark
              } bg-gradient-to-br from-border/80 via-border/20 to-border/40`}>
                <div className={`backdrop-blur-2xl rounded-[15px] p-5 shadow-2xl relative overflow-hidden font-mono min-h-[390px] flex flex-col justify-between transition-all duration-500 ${
                  isLight 
                    ? "bg-[#f8fafc]/95 border-slate-200/50 text-slate-800" 
                    : "bg-[#0b0e14]/90 dark:bg-[#06080c]/95 text-zinc-300"
                }`}>
                  {/* Console Header Bar */}
                  <div className={`flex items-center justify-between border-b pb-3 mb-4 select-none ${
                    isLight ? "border-slate-200" : "border-zinc-800"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className={`ml-2 text-[10px] font-mono tracking-wide ${isLight ? "text-slate-400" : "text-zinc-550"}`}>{steps[activeStep].coords}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className={`text-[9px] tracking-widest font-bold uppercase ${isLight ? "text-emerald-600" : "text-emerald-400"}`}>{steps[activeStep].status}</span>
                    </div>
                  </div>
                  
                  {/* Split Sandbox layout: Vector Illustration on Left, Console Dashboard on Right */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch flex-1">
                    
                    {/* Col A: SVG Illustration Stage projection (5 columns on desktop) */}
                    <div className={`md:col-span-5 border-b md:border-b-0 md:border-r flex flex-col justify-center items-center pb-5 md:pb-0 md:pr-4 ${
                      isLight ? "border-slate-200" : "border-zinc-800/70"
                    }`}>
                      <HologramStage theme={theme} activeStep={activeStep} />
                    </div>

                    {/* Col B: Interactive operations console details (7 columns on desktop) */}
                    <div className="md:col-span-7 flex flex-col justify-center pt-3 md:pt-0">
                      <AnimatePresence mode="wait">
                        {activeStep === 0 && <DiscoveryVisualizer key="discovery" theme={theme} />}
                        {activeStep === 1 && <StrategyVisualizer key="strategy" theme={theme} />}
                        {activeStep === 2 && <DevelopmentVisualizer key="development" theme={theme} />}
                        {activeStep === 3 && <LaunchVisualizer key="launch" theme={theme} />}
                      </AnimatePresence>
                    </div>

                  </div>
                  
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default OurProcess;
