import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Establishing Neural Link...");

  useEffect(() => {
    // Lock scrolling on mount
    document.body.style.overflow = "hidden";

    // Progress charging timeline (0 to 100 over 2.2s for high-fidelity appreciation)
    const duration = 2200;
    const intervalTime = 25;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + increment, 100);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 400); // Small pause at 100% to show completion
        }
        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  // Booting sequence log messages
  useEffect(() => {
    if (progress < 15) {
      setStatus("Neural Link Offline... Injecting Power");
    } else if (progress < 35) {
      setStatus("Charging Spine Feed & Cerebellum...");
    } else if (progress < 60) {
      setStatus("Powering Frontal-Temporal Pathways...");
    } else if (progress < 85) {
      setStatus("Stabilizing Synaptic Firing Rates...");
    } else {
      setStatus("AI SmartSys Operational.");
    }
  }, [progress]);

  // Defining left-side PCB traces (18 tracks total, covering the lobes comprehensively)
  const leftTraces = [
    { d: "M 197 348 L 197 305 L 180 300 L 145 300 L 130 310", delay: 0.05, duration: 1.5, threshold: 2 }, // Cerebellum
    { d: "M 195 290 L 175 270 L 175 220 L 145 200 L 110 200 L 95 180", delay: 0.15, duration: 1.4, threshold: 10 }, // Temporal
    { d: "M 195 280 L 165 260 L 165 240 L 125 240 L 105 250", delay: 0.25, duration: 1.5, threshold: 18 }, // Occipital
    { d: "M 195 220 L 160 185 L 160 145 L 125 145 L 105 170", delay: 0.4, duration: 1.6, threshold: 28 }, // Parietal
    { d: "M 195 180 L 165 150 L 165 115 L 135 85 L 120 110", delay: 0.55, duration: 1.3, threshold: 38 }, // Frontal lower
    { d: "M 195 140 L 160 105 L 160 80 L 140 60 L 135 80", delay: 0.7, duration: 1.5, threshold: 52 }, // Frontal upper
    { d: "M 145 200 L 130 215 L 100 215 L 95 200", delay: 0.3, duration: 1.2, threshold: 20 },
    { d: "M 135 160 L 120 175 L 105 175 L 95 160", delay: 0.45, duration: 1.1, threshold: 30 },
    { d: "M 125 110 L 110 125 L 90 125 L 90 105", delay: 0.6, duration: 1.3, threshold: 44 },
    // Denser vertical parallel tracks near central fissure
    { d: "M 188 60 L 188 300", delay: 0.35, duration: 1.6, threshold: 15 },
    { d: "M 180 70 L 180 290", delay: 0.45, duration: 1.5, threshold: 22 },
    { d: "M 172 80 L 172 280", delay: 0.55, duration: 1.4, threshold: 32 },
    // Denser branching parallel paths inside gyri folds
    { d: "M 165 200 L 150 215 L 115 215 L 100 200", delay: 0.35, duration: 1.2, threshold: 22 },
    { d: "M 155 170 L 140 185 L 115 185 L 105 175", delay: 0.48, duration: 1.25, threshold: 32 },
    { d: "M 150 130 L 135 145 L 115 145 L 105 135", delay: 0.58, duration: 1.3, threshold: 42 },
    { d: "M 150 90 L 135 105 L 115 105 L 110 95", delay: 0.68, duration: 1.35, threshold: 54 },
    // Denser temporal bottom tracks
    { d: "M 195 300 L 180 310 L 150 310 L 135 295 L 115 295 L 105 285", delay: 0.1, duration: 1.6, threshold: 4 },
    { d: "M 150 310 L 140 320 L 120 320 L 110 310", delay: 0.2, duration: 1.3, threshold: 8 }
  ];

  // Defining right-side PCB traces (mirrored symmetrically)
  const rightTraces = [
    { d: "M 203 348 L 203 305 L 220 300 L 255 300 L 270 310", delay: 0.05, duration: 1.5, threshold: 2 }, // Cerebellum
    { d: "M 205 290 L 225 270 L 225 220 L 255 200 L 290 200 L 305 180", delay: 0.15, duration: 1.4, threshold: 10 }, // Temporal
    { d: "M 205 280 L 235 260 L 235 240 L 275 240 L 295 250", delay: 0.25, duration: 1.5, threshold: 18 }, // Occipital
    { d: "M 205 220 L 240 185 L 240 145 L 275 145 L 295 170", delay: 0.4, duration: 1.6, threshold: 28 }, // Parietal
    { d: "M 205 180 L 235 150 L 235 115 L 265 85 L 280 110", delay: 0.55, duration: 1.3, threshold: 38 }, // Frontal lower
    { d: "M 205 140 L 240 105 L 240 80 L 260 60 L 265 80", delay: 0.7, duration: 1.5, threshold: 52 }, // Frontal upper
    { d: "M 255 200 L 270 215 L 300 215 L 305 200", delay: 0.3, duration: 1.2, threshold: 20 },
    { d: "M 265 160 L 280 175 L 295 175 L 305 160", delay: 0.45, duration: 1.1, threshold: 30 },
    { d: "M 275 110 L 290 125 L 310 125 L 310 105", delay: 0.6, duration: 1.3, threshold: 44 },
    // Denser vertical parallel tracks
    { d: "M 212 60 L 212 300", delay: 0.35, duration: 1.6, threshold: 15 },
    { d: "M 220 70 L 220 290", delay: 0.45, duration: 1.5, threshold: 22 },
    { d: "M 228 80 L 228 280", delay: 0.55, duration: 1.4, threshold: 32 },
    // Denser branching parallel paths
    { d: "M 235 200 L 250 215 L 285 215 L 300 200", delay: 0.35, duration: 1.2, threshold: 22 },
    { d: "M 245 170 L 260 185 L 285 185 L 295 175", delay: 0.48, duration: 1.25, threshold: 32 },
    { d: "M 250 130 L 265 145 L 285 145 L 295 135", delay: 0.58, duration: 1.3, threshold: 42 },
    { d: "M 250 90 L 265 105 L 285 105 L 290 95", delay: 0.68, duration: 1.35, threshold: 54 },
    // Denser temporal bottom tracks
    { d: "M 205 300 L 220 310 L 250 310 L 265 295 L 285 295 L 295 285", delay: 0.1, duration: 1.6, threshold: 4 },
    { d: "M 250 310 L 260 320 L 280 320 L 290 310", delay: 0.2, duration: 1.3, threshold: 8 }
  ];

  // 34 Symmetrical Synaptic nodes (17 Left, 17 Right) positioned precisely on the dense grid
  const leftNodes = [
    { cx: 188, cy: 60, threshold: 15 },
    { cx: 180, cy: 70, threshold: 22 },
    { cx: 172, cy: 80, threshold: 32 },
    { cx: 95, cy: 160, threshold: 30 },
    { cx: 95, cy: 130, threshold: 35 },
    { cx: 95, cy: 95, threshold: 44 },
    { cx: 120, cy: 75, threshold: 52 },
    { cx: 105, cy: 285, threshold: 4 },
    { cx: 110, cy: 310, threshold: 8 },
    { cx: 100, cy: 200, threshold: 22 },
    { cx: 105, cy: 175, threshold: 32 },
    { cx: 105, cy: 135, threshold: 42 },
    { cx: 110, cy: 95, threshold: 54 },
    { cx: 165, cy: 200, threshold: 20 },
    { cx: 155, cy: 170, threshold: 30 },
    { cx: 150, cy: 130, threshold: 40 },
    { cx: 150, cy: 90, threshold: 50 },
    { cx: 150, cy: 310, threshold: 8 }
  ];

  const rightNodes = [
    { cx: 212, cy: 60, threshold: 15 },
    { cx: 220, cy: 70, threshold: 22 },
    { cx: 228, cy: 80, threshold: 32 },
    { cx: 305, cy: 160, threshold: 30 },
    { cx: 305, cy: 130, threshold: 35 },
    { cx: 305, cy: 95, threshold: 44 },
    { cx: 280, cy: 75, threshold: 52 },
    { cx: 295, cy: 285, threshold: 4 },
    { cx: 290, cy: 310, threshold: 8 },
    { cx: 300, cy: 200, threshold: 22 },
    { cx: 295, cy: 175, threshold: 32 },
    { cx: 295, cy: 135, threshold: 42 },
    { cx: 290, cy: 95, threshold: 54 },
    { cx: 235, cy: 200, threshold: 20 },
    { cx: 245, cy: 170, threshold: 30 },
    { cx: 250, cy: 130, threshold: 40 },
    { cx: 250, cy: 90, threshold: 50 },
    { cx: 250, cy: 310, threshold: 8 }
  ];

  // Dynamic opacity values linked to loading progress
  const baseOpacity = 0.05 + (progress / 100) * 0.25; 
  const currentFlowOpacity = progress < 5 ? 0 : Math.min((progress - 5) / 15, 1); 
  const sparkOpacity = progress < 20 ? 0 : Math.min((progress - 20) / 25, 0.85);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020008] text-white select-none"
    >
      {/* High-fidelity CSS animations for lightning arcing, current flow and synapse twinkling */}
      <style>{`
        circle.twinkle-node {
          transform-box: fill-box;
          transform-origin: center;
          animation: synapseTwinkle 2s ease-in-out infinite;
        }

        @keyframes synapseTwinkle {
          0%, 100% {
            opacity: 0.25;
            transform: scale(0.85);
            filter: drop-shadow(0 0 1px rgba(168, 85, 247, 0.4));
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
            filter: drop-shadow(0 0 10px rgba(192, 132, 252, 0.95));
          }
        }

        .pulse-path {
          stroke-dasharray: 45 90;
          animation: flowCurrent 1.4s linear infinite;
        }

        .pulse-path-reverse {
          stroke-dasharray: 45 90;
          animation: flowCurrentReverse 1.4s linear infinite;
        }

        @keyframes flowCurrent {
          0% { stroke-dashoffset: 135; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes flowCurrentReverse {
          0% { stroke-dashoffset: -135; }
          100% { stroke-dashoffset: 0; }
        }

        .lightning-arc {
          animation: sparkFlicker 0.45s ease-in-out infinite;
        }

        @keyframes sparkFlicker {
          0%, 100% { opacity: 0; }
          10% { opacity: 0.85; filter: drop-shadow(0 0 6px #d8b4fe); }
          15% { opacity: 0.05; }
          25% { opacity: 0.95; filter: drop-shadow(0 0 8px #a855f7); }
          30% { opacity: 0; }
          48% { opacity: 0.75; filter: drop-shadow(0 0 5px #c084fc); }
          55% { opacity: 0.02; }
          65% { opacity: 0.9; filter: drop-shadow(0 0 7px #e9d5ff); }
          72% { opacity: 0; }
        }

        .aura-pulse {
          animation: auraBreath 4.5s ease-in-out infinite;
          transform-origin: 200px 185px;
        }

        @keyframes auraBreath {
          0%, 100% {
            transform: scale(0.92);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.12);
            opacity: 0.95;
          }
        }

        .animate-spin-slow {
          animation: spinSlow 20s linear infinite;
          transform-origin: 200px 185px;
        }

        .animate-spin-reverse {
          animation: spinReverse 14s linear infinite;
          transform-origin: 200px 185px;
        }

        @keyframes spinSlow {
          to { transform: rotate(360deg); }
        }

        @keyframes spinReverse {
          to { transform: rotate(-360deg); }
        }
      `}</style>

      {/* Main Loader Core Block */}
      <div className="relative flex flex-col items-center justify-center w-96 h-96">
        
        {/* Glow Filters and Symmetrical SVG Brain Graphic */}
        <svg viewBox="0 0 400 400" className="w-full h-full z-10">
          <defs>
            <filter id="glow-heavy" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="9" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <filter id="glow-light" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Neon Purple Radial Gradient Aura */}
            <radialGradient id="aura-gradient" cx="50%" cy="46%" r="42%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#7e22ce" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#020008" stopOpacity="0" />
            </radialGradient>

            {/* Purple current path gradients */}
            <linearGradient id="purple-gradient-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="purple-gradient-right" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d8b4fe" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="100%" stopColor="#6b21a8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* ================= BREATHING RADIAL BACKGROUND AURA ================= */}
          <circle cx="200" cy="185" r="180" fill="url(#aura-gradient)" className="aura-pulse" />

          {/* Rotating Outer HUD Scanning Rings (centered at 200, 185) */}
          <circle 
            cx="200" 
            cy="185" 
            r="168" 
            stroke="rgba(168, 85, 247, 0.08)" 
            strokeWidth="1.5" 
            strokeDasharray="4 24" 
            fill="none" 
            className="animate-spin-slow" 
          />
          <circle 
            cx="200" 
            cy="185" 
            r="176" 
            stroke="rgba(216, 180, 254, 0.1)" 
            strokeWidth="2" 
            strokeDasharray="100 120" 
            fill="none" 
            className="animate-spin-reverse" 
          />

          {/* ================= BACKGROUND BRAIN OUTLINES (REALISTIC WRINKLY CONVOLUTIONS) ================= */}
          {/* Left Hemisphere Lobe contours (incorporating 20 detailed Bezier folds for anatomical gyri/sulci) */}
          <path 
            d="M 197 50 C 192 48, 185 45, 178 45 C 172 45, 168 50, 164 54 C 160 52, 152 48, 146 50 C 138 52, 134 58, 130 64 C 124 62, 118 64, 114 70 C 108 76, 106 84, 102 92 C 96 92, 90 96, 88 104 C 86 112, 88 120, 86 128 C 80 132, 74 138, 74 148 C 74 158, 80 166, 78 174 C 72 178, 68 186, 70 196 C 72 206, 80 212, 80 220 C 78 226, 76 232, 80 238 C 84 244, 92 246, 96 252 C 98 258, 98 266, 104 272 C 110 278, 120 276, 126 282 C 132 288, 134 296, 142 300 C 150 304, 160 300, 168 304 C 176 308, 180 316, 188 316 C 192 316, 195 310, 197 304 L 197 50" 
            stroke={strokeColorForHemisphere(baseOpacity)} 
            strokeWidth="3" 
            fill="none" 
            filter="url(#glow-light)"
          />

          {/* Right Hemisphere Lobe contours (mirrored 20 detailed Bezier folds) */}
          <path 
            d="M 203 50 C 208 48, 215 45, 222 45 C 228 45, 232 50, 236 54 C 240 52, 248 48, 254 50 C 262 52, 266 58, 270 64 C 276 62, 282 64, 286 70 C 292 76, 294 84, 298 92 C 304 92, 310 96, 312 104 C 314 112, 312 120, 314 128 C 320 132, 326 138, 326 148 C 326 158, 320 166, 322 174 C 328 178, 332 186, 330 196 C 328 206, 320 212, 320 220 C 322 226, 324 232, 320 238 C 316 244, 308 246, 304 252 C 302 258, 302 266, 296 272 C 290 278, 280 276, 274 282 C 268 288, 266 296, 258 300 C 250 304, 240 300, 232 304 C 224 308, 220 316, 212 316 C 208 316, 205 310, 203 304 L 203 50" 
            stroke={strokeColorForHemisphere(baseOpacity)} 
            strokeWidth="3" 
            fill="none" 
            filter="url(#glow-light)"
          />

          {/* Symmetrical Spinal main canal/stem lines */}
          <path d="M 197 348 L 197 300" stroke={strokeColorForHemisphere(baseOpacity)} strokeWidth="2.5" fill="none" />
          <path d="M 203 348 L 203 300" stroke={strokeColorForHemisphere(baseOpacity)} strokeWidth="2.5" fill="none" />

          {/* Symmetrical medulla lines inside the stem */}
          <g style={{ opacity: baseOpacity }}>
            <line x1="192" y1="300" x2="192" y2="348" stroke="#a855f7" strokeWidth="1" />
            <line x1="208" y1="300" x2="208" y2="348" stroke="#a855f7" strokeWidth="1" />
          </g>

          {/* Left passive circuit traces (always loaded at base opacity) */}
          {leftTraces.map((trace, idx) => (
            <path 
              key={`left-passive-${idx}`} 
              d={trace.d} 
              stroke={strokeColorForHemisphere(baseOpacity)} 
              strokeWidth="2" 
              fill="none" 
            />
          ))}

          {/* Right passive circuit traces (always loaded at base opacity) */}
          {rightTraces.map((trace, idx) => (
            <path 
              key={`right-passive-${idx}`} 
              d={trace.d} 
              stroke={strokeColorForHemisphere(baseOpacity)} 
              strokeWidth="2" 
              fill="none" 
            />
          ))}


          {/* ================= POWER-ON CURRENT PATHS (IGNITING SEQUENTIALLY) ================= */}
          {/* Spine power injection */}
          {progress >= 2 && (
            <>
              <path 
                d="M 197 348 L 197 300" 
                stroke="url(#purple-gradient-left)" 
                strokeWidth="3.5" 
                fill="none" 
                className="pulse-path"
                filter="url(#glow-heavy)"
                style={{ strokeOpacity: currentFlowOpacity, animationDuration: "1.2s" }}
              />
              <path 
                d="M 203 348 L 203 300" 
                stroke="url(#purple-gradient-right)" 
                strokeWidth="3.5" 
                fill="none" 
                className="pulse-path-reverse"
                filter="url(#glow-heavy)"
                style={{ strokeOpacity: currentFlowOpacity, animationDuration: "1.2s" }}
              />
            </>
          )}

          {/* Left active current paths */}
          {leftTraces.map((trace, idx) => {
            if (progress < trace.threshold) return null;
            
            // Adjust speed dynamically: as progress charges closer to 100%, the current flows faster
            const speed = Math.max(1.5 - (progress / 100) * 0.7, 0.65);

            return (
              <path
                key={`left-active-${idx}`}
                d={trace.d}
                stroke="url(#purple-gradient-left)"
                strokeWidth="3"
                fill="none"
                className={idx % 2 === 0 ? "pulse-path" : "pulse-path-reverse"}
                filter="url(#glow-light)"
                style={{ 
                  strokeOpacity: currentFlowOpacity, 
                  animationDelay: `${trace.delay}s`,
                  animationDuration: `${speed}s`
                }}
              />
            );
          })}

          {/* Right active current paths */}
          {rightTraces.map((trace, idx) => {
            if (progress < trace.threshold) return null;

            const speed = Math.max(1.5 - (progress / 100) * 0.7, 0.65);

            return (
              <path
                key={`right-active-${idx}`}
                d={trace.d}
                stroke="url(#purple-gradient-right)"
                strokeWidth="3"
                fill="none"
                className={idx % 2 === 0 ? "pulse-path-reverse" : "pulse-path"}
                filter="url(#glow-light)"
                style={{ 
                  strokeOpacity: currentFlowOpacity, 
                  animationDelay: `${trace.delay}s`,
                  animationDuration: `${speed}s`
                }}
              />
            );
          })}


          {/* ================= HIGH-VOLTAGE SPARK/LIGHTNING DISCHARGES (BRANCHED) ================= */}
          {progress >= 20 && (
            <g style={{ opacity: sparkOpacity }}>
              {/* Left branched lightning arcs */}
              <path 
                d="M 130 64 L 105 45 L 115 35 L 90 20 L 98 8 L 80 0 M 115 35 L 125 25 L 110 15" 
                stroke="#e9d5ff" 
                strokeWidth="1.5" 
                fill="none" 
                className="lightning-arc" 
                style={{ animationDelay: "0.1s" }}
              />
              <path 
                d="M 74 148 L 54 138 L 58 128 L 38 132 L 42 118 L 22 122 L 28 105 L 2 100 M 42 118 L 48 108 L 32 105" 
                stroke="#c084fc" 
                strokeWidth="1.8" 
                fill="none" 
                className="lightning-arc" 
                style={{ animationDelay: "0.3s" }}
              />
              <path 
                d="M 110 278 L 92 292 L 98 302 L 82 315 L 88 328 L 65 338 M 82 315 L 72 325 L 78 335" 
                stroke="#d8b4fe" 
                strokeWidth="1.5" 
                fill="none" 
                className="lightning-arc" 
                style={{ animationDelay: "0.25s" }}
              />

              {/* Right branched lightning arcs */}
              <path 
                d="M 270 64 L 295 45 L 285 35 L 310 20 L 302 8 L 320 0 M 285 35 L 275 25 L 290 15" 
                stroke="#e9d5ff" 
                strokeWidth="1.5" 
                fill="none" 
                className="lightning-arc" 
                style={{ animationDelay: "0.15s" }}
              />
              <path 
                d="M 326 148 L 346 138 L 342 128 L 362 132 L 358 118 L 378 122 L 372 105 L 398 100 M 358 118 L 352 108 L 368 105" 
                stroke="#c084fc" 
                strokeWidth="1.8" 
                fill="none" 
                className="lightning-arc" 
                style={{ animationDelay: "0.05s" }}
              />
              <path 
                d="M 290 278 L 308 292 L 302 302 L 318 315 L 312 328 L 335 338 M 318 315 L 328 325 L 322 335" 
                stroke="#d8b4fe" 
                strokeWidth="1.5" 
                fill="none" 
                className="lightning-arc" 
                style={{ animationDelay: "0.35s" }}
              />
            </g>
          )}


          {/* ================= TERMINAL CIRCUIT PADS (SYNAPSE NODES) ================= */}
          {/* Spine start pads */}
          {progress >= 2 && (
            <>
              <circle cx="197" cy="300" r="4.5" fill="#e9d5ff" className="twinkle-node" filter="url(#glow-light)" style={{ fillOpacity: currentFlowOpacity, stroke: "#a855f7", strokeWidth: 1.5 }} />
              <circle cx="203" cy="300" r="4.5" fill="#e9d5ff" className="twinkle-node" filter="url(#glow-light)" style={{ fillOpacity: currentFlowOpacity, stroke: "#a855f7", strokeWidth: 1.5 }} />
            </>
          )}

          {/* Left hemisphere node pads (twinkling independently) */}
          {leftNodes.map((node, idx) => {
            const isLit = progress >= node.threshold;
            
            // Varied speed based on pad coordinates to look organic
            const twinkleDelay = (idx * 0.13) % 1.7;
            const twinkleDuration = 1.2 + ((idx * 0.3) % 1.3);

            return (
              <circle
                key={`left-node-${idx}`}
                cx={node.cx}
                cy={node.cy}
                r="4.5"
                fill={isLit ? "#e9d5ff" : "#2e1065"}
                className={isLit ? "twinkle-node" : ""}
                filter={isLit ? "url(#glow-light)" : ""}
                style={{ 
                  fillOpacity: isLit ? Math.min(progress / 75, 1) : 0.3,
                  stroke: isLit ? "#c084fc" : "none",
                  strokeWidth: isLit ? 1.5 : 0,
                  animationDelay: `${twinkleDelay}s`,
                  animationDuration: `${twinkleDuration}s`
                }}
              />
            );
          })}

          {/* Right hemisphere node pads (twinkling independently) */}
          {rightNodes.map((node, idx) => {
            const isLit = progress >= node.threshold;
            
            const twinkleDelay = (idx * 0.17) % 1.9;
            const twinkleDuration = 1.1 + ((idx * 0.25) % 1.4);

            return (
              <circle
                key={`right-node-${idx}`}
                cx={node.cx}
                cy={node.cy}
                r="4.5"
                fill={isLit ? "#e9d5ff" : "#2e1065"}
                className={isLit ? "twinkle-node" : ""}
                filter={isLit ? "url(#glow-light)" : ""}
                style={{ 
                  fillOpacity: isLit ? Math.min(progress / 75, 1) : 0.3,
                  stroke: isLit ? "#c084fc" : "none",
                  strokeWidth: isLit ? 1.5 : 0,
                  animationDelay: `${twinkleDelay}s`,
                  animationDuration: `${twinkleDuration}s`
                }}
              />
            );
          })}
        </svg>

        {/* Dynamic percentage counter inside center brain canal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center mt-3 z-20">
          <span className="text-xl font-extrabold tracking-widest text-[#d8b4fe] font-mono filter drop-shadow-[0_0_8px_rgba(168,85,247,0.75)]">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Power-On Text & Loading Bar Interface */}
      <div className="w-80 max-w-sm flex flex-col items-center gap-5 px-6 mt-2 z-10">
        
        {/* Glow Header */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-2xl font-extrabold uppercase tracking-[0.22em] text-[#d8b4fe] font-mono filter drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]">
            Powering On
          </h2>
          <motion.p 
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.25em] font-mono font-bold text-purple-400/80 text-center h-4"
          >
            {status}
          </motion.p>
        </div>

        {/* High-Fidelity Sleek Purple Progress Bar */}
        <div className="w-full h-2.5 bg-[#090214] border border-purple-900/45 rounded-full overflow-hidden relative shadow-[inner_0_1.5px_4px_rgba(0,0,0,0.9)]">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-700 via-fuchsia-500 to-purple-400 relative"
            style={{ width: `${progress}%` }}
            layoutId="preload-bar"
          >
            {/* Glowing lead spotlight cap (spotlight leader dot) */}
            {progress > 0 && (
              <span className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full filter drop-shadow-[0_0_8px_#ffffff] shadow-[0_0_15px_#a855f7] animate-pulse" />
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to handle base outline opacity
const strokeColorForHemisphere = (opacity: number) => {
  return `rgba(168, 85, 247, ${opacity})`;
};

export default Preloader;
