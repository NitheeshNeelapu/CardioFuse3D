import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useAppStore } from '../../state/useAppStore';

export const Hero: React.FC = () => {
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  const handleScrollToDashboard = () => {
    const el = document.getElementById('anatomy') || document.getElementById('dashboard');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-[#fafaf9] text-slate-900 min-h-[78svh] md:min-h-[88svh] flex flex-col justify-between items-center px-4 sm:px-8 pt-6 sm:pt-10 pb-20 sm:pb-28 overflow-hidden select-none">
      <style>{`
        /* 16s Holo Hue-Rotate for heart gradient */
        @keyframes holoShift {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(45deg); }
          100% { filter: hue-rotate(0deg); }
        }

        .heart-holo-fill {
          animation: holoShift 16s linear infinite;
        }

        /* 72 bpm Heartbeat: 1 cycle = 0.833s with lub-dub scale 1 -> 1.045 -> 1 -> 1.025 -> 1 */
        @keyframes heartbeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.045); }
          28% { transform: scale(1); }
          42% { transform: scale(1.025); }
          56% { transform: scale(1); }
          100% { transform: scale(1); }
        }

        .heart-beat-group {
          transform-origin: 300px 265px;
          animation: heartbeat 0.833s ease-in-out infinite;
        }

        /* Coronary Arteries Self-Drawing sequence (loop 6s, staggered) */
        @keyframes drawArtery {
          0% { stroke-dashoffset: 340; opacity: 0; }
          4% { opacity: 1; }
          32% { stroke-dashoffset: 0; opacity: 1; }
          80% { stroke-dashoffset: 0; opacity: 1; }
          94% { opacity: 0; stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 340; opacity: 0; }
        }

        .artery-lad {
          stroke-dasharray: 340;
          animation: drawArtery 6s ease-in-out infinite;
          animation-delay: 0s;
        }

        .artery-lcx {
          stroke-dasharray: 340;
          animation: drawArtery 6s ease-in-out infinite;
          animation-delay: 0.4s;
        }

        .artery-rca {
          stroke-dasharray: 340;
          animation: drawArtery 6s ease-in-out infinite;
          animation-delay: 0.8s;
        }

        /* ECG Highlight pulse across hero width */
        @keyframes ecgHighlight {
          0% { stroke-dashoffset: 650; }
          100% { stroke-dashoffset: -650; }
        }

        .ecg-highlight-line {
          stroke-dasharray: 80 570;
          animation: ecgHighlight 0.833s linear infinite;
        }

        /* Hide evidence pill text and background on screens below 480px */
        @media (max-width: 479px) {
          .hero-pill-box {
            display: none !important;
          }
          .hero-pill-text {
            display: none !important;
          }
        }

        /* prefers-reduced-motion: disable all animations */
        @media (prefers-reduced-motion: reduce) {
          .heart-holo-fill,
          .heart-beat-group,
          .artery-lad,
          .artery-lcx,
          .artery-rca,
          .ecg-highlight-line {
            animation: none !important;
          }
          animateMotion {
            dur: 0s !important;
          }
        }
      `}</style>

      {/* Top Header Bar inside Hero */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-30">
        <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-wider text-slate-500 uppercase">
          Cardiology • Multimodal AI
        </span>

        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          className="text-[11px] sm:text-xs font-mono font-medium tracking-wider text-slate-600 hover:text-black transition-colors underline decoration-slate-300 underline-offset-4 cursor-pointer"
        >
          Architecture
        </button>
      </div>

      {/* Main Evidence-to-Anatomy Heart Canvas (Pure SVG + CSS, zero WebGL) */}
      <div className="relative flex items-center justify-center my-auto py-2 sm:py-6 z-10 w-full">
        {/* SVG Container */}
        <div className="w-[clamp(280px,56vw,560px)] aspect-[600/520] relative flex items-center justify-center">
          <svg
            viewBox="0 0 600 520"
            className="w-full h-full select-none overflow-visible"
            aria-label="Evidence to anatomy animated heart"
          >
            <defs>
              {/* Pastel Holographic Gradient */}
              <linearGradient id="heartHoloGrad" x1="15%" y1="10%" x2="85%" y2="90%">
                <stop offset="0%" stopColor="#fbcfe8" />
                <stop offset="35%" stopColor="#bae6fd" />
                <stop offset="68%" stopColor="#a7f3d0" />
                <stop offset="100%" stopColor="#e9d5ff" />
              </linearGradient>

              {/* Subtle Grain Filter */}
              <filter id="heartGrainFilter" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.14 0" />
              </filter>

              {/* Artery Dot Glow */}
              <filter id="arteryGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* PART 1d: Three Evidence Connection Lines & Travelling Dots into the Heart */}
            {/* Top-Left: Clinical -> Heart */}
            <path
              id="wire-clinical"
              d="M 95 95 L 175 125"
              stroke="#94a3b8"
              strokeDasharray="3 3"
              strokeWidth="1.2"
              fill="none"
              opacity="0.55"
            />
            <circle r="3.5" fill="#0891b2" filter="url(#arteryGlow)">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M 95 95 L 175 125" />
            </circle>

            {/* Top-Right: ECG -> Heart */}
            <path
              id="wire-ecg"
              d="M 505 95 L 425 125"
              stroke="#94a3b8"
              strokeDasharray="3 3"
              strokeWidth="1.2"
              fill="none"
              opacity="0.55"
            />
            <circle r="3.5" fill="#7c3aed" filter="url(#arteryGlow)">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M 505 95 L 425 125" />
            </circle>

            {/* Bottom-Center: Narrative -> Heart Apex */}
            <path
              id="wire-narrative"
              d="M 300 500 L 300 468"
              stroke="#94a3b8"
              strokeDasharray="3 3"
              strokeWidth="1.2"
              fill="none"
              opacity="0.55"
            />
            <circle r="3.5" fill="#db2777" filter="url(#arteryGlow)">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M 300 500 L 300 468" />
            </circle>

            {/* PART 1a: Heart Silhouette with Holographic Gradient & 72 bpm Lub-Dub Heartbeat */}
            <g className="heart-beat-group">
              {/* Base Silhouette */}
              <path
                d="M300 470 C120 350 60 250 60 170 C60 100 110 60 170 60 C225 60 270 90 300 135 C330 90 375 60 430 60 C490 60 540 100 540 170 C540 250 480 350 300 470 Z"
                fill="url(#heartHoloGrad)"
                className="heart-holo-fill drop-shadow-[0_16px_36px_rgba(244,114,182,0.18)]"
              />

              {/* Grain Overlay */}
              <path
                d="M300 470 C120 350 60 250 60 170 C60 100 110 60 170 60 C225 60 270 90 300 135 C330 90 375 60 430 60 C490 60 540 100 540 170 C540 250 480 350 300 470 Z"
                fill="#000000"
                filter="url(#heartGrainFilter)"
                opacity="0.12"
                style={{ mixBlendMode: 'overlay' }}
              />

              {/* PART 1b: Three Coronary Arteries (Self-drawing, 3px stroke, round caps, glowing end dots) */}
              {/* 1. LAD: Anterior Descending (Cyan #0891B2) */}
              <path
                d="M300 150 C290 230 300 330 300 440"
                fill="none"
                stroke="#0891B2"
                strokeWidth="3.2"
                strokeLinecap="round"
                className="artery-lad"
              />
              <circle cx="300" cy="440" r="4" fill="#0891B2" filter="url(#arteryGlow)" />

              {/* 2. LCX: Circumflex (Violet #7C3AED) */}
              <path
                d="M300 150 C220 160 150 210 140 300"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="3.2"
                strokeLinecap="round"
                className="artery-lcx"
              />
              <circle cx="140" cy="300" r="4" fill="#7C3AED" filter="url(#arteryGlow)" />

              {/* 3. RCA: Right Coronary (Pink #DB2777) */}
              <path
                d="M300 150 C380 160 450 210 460 300"
                fill="none"
                stroke="#DB2777"
                strokeWidth="3.2"
                strokeLinecap="round"
                className="artery-rca"
              />
              <circle cx="460" cy="300" r="4" fill="#DB2777" filter="url(#arteryGlow)" />
            </g>

            {/* PART 1c: Thin Black ECG Line at Heart Vertical Center (y=260) with Travelling Highlight */}
            <g className="z-15">
              {/* Static Thin Black ECG Baseline & QRS-T Wave */}
              <path
                d="M 0 260 L 220 260 Q 235 250, 250 260 L 270 260 L 278 274 L 295 165 L 312 295 L 322 260 L 338 260 Q 355 248, 375 260 L 600 260"
                fill="none"
                stroke="#18181b"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Travelling Highlight pulse matching heartbeat period */}
              <path
                d="M 0 260 L 220 260 Q 235 250, 250 260 L 270 260 L 278 274 L 295 165 L 312 295 L 322 260 L 338 260 Q 355 248, 375 260 L 600 260"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.4"
                strokeLinecap="round"
                className="ecg-highlight-line"
              />
            </g>

            {/* PART 1d: Three Evidence Pills (Clinical, ECG, Narrative) - Text hidden on <480px */}
            {/* Top-Left: Clinical */}
            <g transform="translate(40, 80)">
              <rect
                className="hero-pill-box"
                x="0"
                y="0"
                width="74"
                height="24"
                rx="12"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))"
              />
              <circle cx="12" cy="12" r="3.5" fill="#0891b2" />
              <text
                className="hero-pill-text"
                x="24"
                y="15.5"
                fill="#1e293b"
                fontSize="10"
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="600"
              >
                Clinical
              </text>
            </g>

            {/* Top-Right: ECG */}
            <g transform="translate(486, 80)">
              <rect
                className="hero-pill-box"
                x="0"
                y="0"
                width="64"
                height="24"
                rx="12"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))"
              />
              <circle cx="12" cy="12" r="3.5" fill="#7c3aed" />
              <text
                className="hero-pill-text"
                x="24"
                y="15.5"
                fill="#1e293b"
                fontSize="10"
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="600"
              >
                ECG
              </text>
            </g>

            {/* Bottom-Center: Narrative */}
            <g transform="translate(254, 486)">
              <rect
                className="hero-pill-box"
                x="0"
                y="0"
                width="92"
                height="24"
                rx="12"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))"
              />
              <circle cx="12" cy="12" r="3.5" fill="#db2777" />
              <text
                className="hero-pill-text"
                x="24"
                y="15.5"
                fill="#1e293b"
                fontSize="10"
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="600"
              >
                Narrative
              </text>
            </g>
          </svg>

          {/* Huge Bold Title "CardioFuse" Overlapping the Animated Heart */}
          <h1
            className="absolute inset-0 flex items-center justify-center text-black font-extrabold tracking-tighter pointer-events-none select-none z-20 leading-none text-center"
            style={{
              fontSize: 'clamp(48px, 13vw, 168px)',
              fontWeight: 800,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.04em',
            }}
          >
            CardioFuse
          </h1>
        </div>
      </div>

      {/* Editorial Subtitle, Pill Button, and Research Prototype Caption */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-xl mx-auto z-30 px-2">
        <p className="text-slate-700 text-xs sm:text-sm md:text-base font-normal max-w-lg leading-relaxed line-clamp-2">
          Evidence to anatomy: ECG, clinical data and symptoms mapped onto the coronary arteries.
        </p>

        <button
          type="button"
          onClick={handleScrollToDashboard}
          className="min-h-[44px] px-7 py-3 rounded-full bg-black text-white hover:bg-slate-800 transition-all text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span>Open dashboard</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>

        <span className="text-[11px] font-mono text-slate-500 tracking-tight">
          Research prototype • synthetic demo data
        </span>
      </div>

      {/* Gradient fade at bottom into the dark dashboard background (#030712) */}
      <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-b from-transparent via-[#030712]/50 to-[#030712] pointer-events-none z-0" />
    </section>
  );
};
