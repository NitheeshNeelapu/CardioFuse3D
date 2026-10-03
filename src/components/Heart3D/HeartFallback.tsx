import React, { useState } from 'react';
import { Vessel } from '../../types/vessel';
import { useAppStore } from '../../state/useAppStore';
import { AlertCircle, Eye, RefreshCcw } from 'lucide-react';

export const HeartFallback: React.FC = () => {
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const setSelectedVessel = useAppStore((s) => s.setSelectedVessel);
  const prediction = useAppStore((s) => s.prediction);
  const [hoveredVessel, setHoveredVessel] = useState<Vessel | null>(null);

  const fullNames: Record<Vessel, string> = {
    LAD: 'Left Anterior Descending Artery',
    LCX: 'Left Circumflex Artery',
    RCA: 'Right Coronary Artery',
  };

  const ladScore = prediction?.vesselPredictions.LAD.probability ?? 68;
  const lcxScore = prediction?.vesselPredictions.LCX.probability ?? 42;
  const rcaScore = prediction?.vesselPredictions.RCA.probability ?? 28;

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center bg-[#030712] rounded-xl overflow-hidden p-4 select-none">
      {/* Background medical grid */}
      <div className="absolute inset-0 bg-medical-grid pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,229,255,0.08)_0%,_transparent_75%)] pointer-events-none" />

      {/* Fallback Notice Banner */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/70 border border-white/10 text-[10px] font-mono text-slate-300">
        <Eye className="w-3.5 h-3.5 text-cyan-400" />
        <span>2.5D Anatomical Schematic (WebGL Fallback Active)</span>
      </div>

      {/* Interactive SVG Heart Schematic */}
      <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_20px_rgba(0,229,255,0.15)]">
          <defs>
            <linearGradient id="muscleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B1A30" />
              <stop offset="60%" stopColor="#081426" />
              <stop offset="100%" stopColor="#050C17" />
            </linearGradient>
            <linearGradient id="aortaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" />
            </linearGradient>
            <linearGradient id="pulmonaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Great Vessels */}
          {/* Aorta Arch */}
          <path
            d="M 170 120 C 170 60, 230 60, 245 130 L 225 140 C 215 85, 185 85, 185 130 Z"
            fill="url(#aortaGrad)"
            opacity="0.9"
          />
          {/* Brachiocephalic branches */}
          <rect x="180" y="45" width="8" height="25" fill="#E11D48" rx="3" />
          <rect x="195" y="40" width="8" height="30" fill="#E11D48" rx="3" />
          <rect x="210" y="48" width="8" height="22" fill="#E11D48" rx="3" />

          {/* Pulmonary trunk */}
          <path
            d="M 215 135 C 220 90, 260 95, 275 140 L 255 150 C 245 115, 225 110, 225 145 Z"
            fill="url(#pulmonaryGrad)"
            opacity="0.9"
          />

          {/* Cardiac chambers outline (Stylized anatomical silhouette) */}
          <path
            d="M 200 130 
               C 270 130, 310 180, 290 250 
               C 270 320, 215 365, 200 375 
               C 185 365, 120 315, 105 240 
               C 95 170, 140 130, 200 130 Z"
            fill="url(#muscleGrad)"
            stroke="rgba(0, 229, 255, 0.3)"
            strokeWidth="1.5"
          />

          {/* Sulcus groove */}
          <path
            d="M 195 150 Q 185 260 200 375"
            stroke="rgba(0, 229, 255, 0.15)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 4"
          />

          {/* 1. LAD Artery (Left Anterior Descending) */}
          <path
            d="M 188 150 
               C 185 190, 180 240, 186 280 
               C 190 310, 195 345, 200 375"
            stroke={selectedVessel === 'LAD' ? '#00E5FF' : hoveredVessel === 'LAD' ? '#38BDF8' : '#F43F5E'}
            strokeWidth={selectedVessel === 'LAD' ? '6' : '4'}
            fill="none"
            strokeLinecap="round"
            filter={selectedVessel === 'LAD' ? 'url(#glow-cyan)' : undefined}
            className="cursor-pointer transition-all duration-200"
            onClick={() => setSelectedVessel('LAD')}
            onMouseEnter={() => setHoveredVessel('LAD')}
            onMouseLeave={() => setHoveredVessel(null)}
          />
          {/* LAD Diagonal branch */}
          <path
            d="M 183 230 C 160 250, 145 270, 135 290"
            stroke={selectedVessel === 'LAD' ? '#00E5FF' : hoveredVessel === 'LAD' ? '#38BDF8' : '#F43F5E'}
            strokeWidth={selectedVessel === 'LAD' ? '4' : '2.5'}
            fill="none"
            strokeLinecap="round"
            className="cursor-pointer"
            onClick={() => setSelectedVessel('LAD')}
          />

          {/* 2. LCX Artery (Left Circumflex) */}
          <path
            d="M 192 155 
               C 160 165, 125 185, 115 220 
               C 110 245, 120 270, 125 295"
            stroke={selectedVessel === 'LCX' ? '#00E5FF' : hoveredVessel === 'LCX' ? '#38BDF8' : '#F43F5E'}
            strokeWidth={selectedVessel === 'LCX' ? '6' : '4'}
            fill="none"
            strokeLinecap="round"
            filter={selectedVessel === 'LCX' ? 'url(#glow-cyan)' : undefined}
            className="cursor-pointer transition-all duration-200"
            onClick={() => setSelectedVessel('LCX')}
            onMouseEnter={() => setHoveredVessel('LCX')}
            onMouseLeave={() => setHoveredVessel(null)}
          />

          {/* 3. RCA Artery (Right Coronary) */}
          <path
            d="M 215 155 
               C 245 168, 280 200, 282 235 
               C 284 265, 270 295, 255 320"
            stroke={selectedVessel === 'RCA' ? '#00E5FF' : hoveredVessel === 'RCA' ? '#38BDF8' : '#F43F5E'}
            strokeWidth={selectedVessel === 'RCA' ? '6' : '4'}
            fill="none"
            strokeLinecap="round"
            filter={selectedVessel === 'RCA' ? 'url(#glow-cyan)' : undefined}
            className="cursor-pointer transition-all duration-200"
            onClick={() => setSelectedVessel('RCA')}
            onMouseEnter={() => setHoveredVessel('RCA')}
            onMouseLeave={() => setHoveredVessel(null)}
          />
        </svg>

        {/* Floating HTML Tags for vessels */}
        {/* LAD Tag */}
        <button
          onClick={() => setSelectedVessel('LAD')}
          onMouseEnter={() => setHoveredVessel('LAD')}
          onMouseLeave={() => setHoveredVessel(null)}
          className={`absolute top-[62%] left-[48%] -translate-x-1/2 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
            selectedVessel === 'LAD'
              ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.8)] scale-110 z-20'
              : 'bg-black/85 text-cyan-300 border-cyan-500/40 hover:bg-white hover:text-black hover:border-white'
          }`}
        >
          LAD • {ladScore}%
        </button>

        {/* LCX Tag */}
        <button
          onClick={() => setSelectedVessel('LCX')}
          onMouseEnter={() => setHoveredVessel('LCX')}
          onMouseLeave={() => setHoveredVessel(null)}
          className={`absolute top-[48%] left-[16%] px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
            selectedVessel === 'LCX'
              ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.8)] scale-110 z-20'
              : 'bg-black/85 text-violet-300 border-violet-500/40 hover:bg-white hover:text-black hover:border-white'
          }`}
        >
          LCX • {lcxScore}%
        </button>

        {/* RCA Tag */}
        <button
          onClick={() => setSelectedVessel('RCA')}
          onMouseEnter={() => setHoveredVessel('RCA')}
          onMouseLeave={() => setHoveredVessel(null)}
          className={`absolute top-[52%] right-[16%] px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
            selectedVessel === 'RCA'
              ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.8)] scale-110 z-20'
              : 'bg-black/85 text-pink-300 border-pink-500/40 hover:bg-white hover:text-black hover:border-white'
          }`}
        >
          RCA • {rcaScore}%
        </button>

        {/* Hover Tooltip Overlay */}
        {hoveredVessel && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 p-2.5 rounded-xl bg-black/95 border border-cyan-400 text-center shadow-2xl backdrop-blur-md min-w-[210px] pointer-events-none">
            <span className="text-xs font-bold font-mono text-cyan-300 block">
              {hoveredVessel}
            </span>
            <span className="text-[10px] text-slate-200 block">
              {fullNames[hoveredVessel]}
            </span>
            <span className="text-[9px] font-mono text-cyan-400 mt-1 block">
              Click to inspect
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
