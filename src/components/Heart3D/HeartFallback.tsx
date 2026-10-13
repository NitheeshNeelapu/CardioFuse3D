import React from 'react';
import { Vessel } from '../../types/vessel';
import { useAppStore } from '../../state/useAppStore';
import { Eye } from 'lucide-react';

interface VesselSvgConfig {
  id: Vessel;
  vesselPoint: { x: number; y: number };
  leaderPath: string;
  labelRect: { x: number; y: number; width: number; height: number };
  textPoint: { x: number; y: number };
}

const VESSEL_CONFIGS: Record<Vessel, VesselSvgConfig> = {
  LCX: {
    id: 'LCX',
    vesselPoint: { x: 115, y: 210 },
    leaderPath: 'M 115 210 L 40 190 L 5 190',
    labelRect: { x: -40, y: 175, width: 92, height: 30 },
    textPoint: { x: 6, y: 195 },
  },
  LAD: {
    id: 'LAD',
    vesselPoint: { x: 186, y: 285 },
    leaderPath: 'M 186 285 L 110 335 L 75 335',
    labelRect: { x: -35, y: 320, width: 92, height: 30 },
    textPoint: { x: 11, y: 340 },
  },
  RCA: {
    id: 'RCA',
    vesselPoint: { x: 282, y: 230 },
    leaderPath: 'M 282 230 L 350 215 L 385 215',
    labelRect: { x: 345, y: 200, width: 92, height: 30 },
    textPoint: { x: 391, y: 220 },
  },
};

export const HeartFallback: React.FC = () => {
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const setSelectedVessel = useAppStore((s) => s.setSelectedVessel);
  const hoveredVessel = useAppStore((s) => s.hoveredVessel);
  const setHoveredVessel = useAppStore((s) => s.setHoveredVessel);
  const prediction = useAppStore((s) => s.prediction);

  const getScore = (v: Vessel): number | null => {
    if (!prediction?.vesselPredictions?.[v]) return null;
    return prediction.vesselPredictions[v].probability;
  };

  // Render order: unselected vessels first, selected vessel LAST so it is always on top
  const allVessels: Vessel[] = ['LCX', 'LAD', 'RCA'];
  const unselectedVessels = allVessels.filter((v) => v !== selectedVessel);
  const renderOrder = [...unselectedVessels, selectedVessel];

  const renderVesselPaths = (vesselId: Vessel, isSelected: boolean) => {
    const isHovered = hoveredVessel === vesselId;
    const strokeColor = isSelected
      ? '#00E5FF'
      : isHovered
      ? '#38BDF8'
      : '#BE123C';
    const mainStrokeWidth = isSelected ? 6 : 3.8;
    const branchStrokeWidth = isSelected ? 4 : 2.5;

    if (vesselId === 'LAD') {
      const ladMain =
        'M 188 150 C 185 190, 180 240, 186 280 C 190 310, 195 345, 200 375';
      const ladDiag = 'M 183 230 C 160 250, 145 270, 135 290';

      return (
        <g key="LAD-paths">
          {/* Transparent click targets (strokeWidth 22) */}
          <path
            d={ladMain}
            stroke="transparent"
            strokeWidth="22"
            fill="none"
            style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
            onClick={() => setSelectedVessel('LAD')}
            onMouseEnter={() => setHoveredVessel('LAD')}
            onMouseLeave={() => setHoveredVessel(null)}
          />
          <path
            d={ladDiag}
            stroke="transparent"
            strokeWidth="22"
            fill="none"
            style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
            onClick={() => setSelectedVessel('LAD')}
            onMouseEnter={() => setHoveredVessel('LAD')}
            onMouseLeave={() => setHoveredVessel(null)}
          />

          {/* Visible vessel lines */}
          <path
            d={ladMain}
            stroke={strokeColor}
            strokeWidth={mainStrokeWidth}
            fill="none"
            strokeLinecap="round"
            filter={isSelected ? 'url(#glow-cyan)' : undefined}
            className="transition-all duration-150 pointer-events-none"
          />
          <path
            d={ladDiag}
            stroke={strokeColor}
            strokeWidth={branchStrokeWidth}
            fill="none"
            strokeLinecap="round"
            filter={isSelected ? 'url(#glow-cyan)' : undefined}
            className="transition-all duration-150 pointer-events-none"
          />
        </g>
      );
    }

    if (vesselId === 'LCX') {
      const lcxMain =
        'M 192 155 C 160 165, 125 185, 115 220 C 110 245, 120 270, 125 295';
      return (
        <g key="LCX-paths">
          <path
            d={lcxMain}
            stroke="transparent"
            strokeWidth="22"
            fill="none"
            style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
            onClick={() => setSelectedVessel('LCX')}
            onMouseEnter={() => setHoveredVessel('LCX')}
            onMouseLeave={() => setHoveredVessel(null)}
          />
          <path
            d={lcxMain}
            stroke={strokeColor}
            strokeWidth={mainStrokeWidth}
            fill="none"
            strokeLinecap="round"
            filter={isSelected ? 'url(#glow-cyan)' : undefined}
            className="transition-all duration-150 pointer-events-none"
          />
        </g>
      );
    }

    if (vesselId === 'RCA') {
      const rcaMain =
        'M 215 155 C 245 168, 280 200, 282 235 C 284 265, 270 295, 255 320';
      return (
        <g key="RCA-paths">
          <path
            d={rcaMain}
            stroke="transparent"
            strokeWidth="22"
            fill="none"
            style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
            onClick={() => setSelectedVessel('RCA')}
            onMouseEnter={() => setHoveredVessel('RCA')}
            onMouseLeave={() => setHoveredVessel(null)}
          />
          <path
            d={rcaMain}
            stroke={strokeColor}
            strokeWidth={mainStrokeWidth}
            fill="none"
            strokeLinecap="round"
            filter={isSelected ? 'url(#glow-cyan)' : undefined}
            className="transition-all duration-150 pointer-events-none"
          />
        </g>
      );
    }

    return null;
  };

  const renderVesselLabel = (vesselId: Vessel, isSelected: boolean) => {
    const config = VESSEL_CONFIGS[vesselId];
    const isHovered = hoveredVessel === vesselId;
    const score = getScore(vesselId);

    return (
      <g
        key={`${vesselId}-label-group`}
        className="cursor-pointer transition-all duration-150"
        onClick={() => setSelectedVessel(vesselId)}
        onMouseEnter={() => setHoveredVessel(vesselId)}
        onMouseLeave={() => setHoveredVessel(null)}
      >
        {/* Thin leader line outside heart silhouette */}
        <path
          d={config.leaderPath}
          fill="none"
          stroke={isSelected ? '#00E5FF' : 'rgba(148, 163, 184, 0.45)'}
          strokeWidth={isSelected ? '1.5' : '1'}
          strokeDasharray={isSelected ? undefined : '3 3'}
        />

        {/* Small anchor dot on vessel point */}
        <circle
          cx={config.vesselPoint.x}
          cy={config.vesselPoint.y}
          r={isSelected ? 4 : 2.5}
          fill={isSelected ? '#00E5FF' : '#94A3B8'}
        />

        {/* Label Box outside heart silhouette */}
        <rect
          x={config.labelRect.x}
          y={config.labelRect.y}
          width={config.labelRect.width}
          height={config.labelRect.height}
          rx="6"
          fill={isSelected ? '#00E5FF' : 'rgba(8, 17, 31, 0.9)'}
          stroke={
            isSelected
              ? '#00E5FF'
              : isHovered
              ? 'rgba(255, 255, 255, 0.4)'
              : 'rgba(255, 255, 255, 0.15)'
          }
          strokeWidth={isSelected ? '1.5' : '1'}
          filter={isSelected ? 'url(#glow-cyan-sm)' : undefined}
        />

        {/* Label text */}
        <text
          x={config.textPoint.x}
          y={config.textPoint.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={isSelected ? '#020617' : isHovered ? '#FFFFFF' : '#94A3B8'}
          fontWeight={isSelected ? 'bold' : '600'}
          fontSize="10"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
          className="select-none pointer-events-none"
        >
          {vesselId} • {score !== null ? `${score}%` : '--'}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center bg-[#030712] rounded-xl overflow-hidden p-4 select-none">
      {/* Background medical grid */}
      <div className="absolute inset-0 bg-medical-grid pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,229,255,0.08)_0%,_transparent_75%)] pointer-events-none" />

      {/* Top Banner */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/75 border border-white/10 text-[10px] font-mono text-slate-300">
        <Eye className="w-3.5 h-3.5 text-cyan-400" />
        <span>2.5D Anatomical Schematic</span>
      </div>

      {/* Interactive SVG Heart Schematic */}
      <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
        <svg
          viewBox="-48 20 496 390"
          className="w-full h-full drop-shadow-[0_0_20px_rgba(0,229,255,0.15)]"
        >
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
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-cyan-sm" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
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

          {/* SVG RENDER ORDER:
              Draw all unselected vessels and labels FIRST,
              Draw selected vessel and its label LAST so it is always on top. */}
          {renderOrder.map((vesselId) => {
            const isSelected = vesselId === selectedVessel;
            return (
              <g key={`group-${vesselId}`}>
                {renderVesselPaths(vesselId, isSelected)}
                {renderVesselLabel(vesselId, isSelected)}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
