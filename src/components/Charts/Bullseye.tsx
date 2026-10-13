import React, { useState } from 'react';
import { Vessel } from '../../types/vessel';
import { useAppStore } from '../../state/useAppStore';
import { GlassCard } from '../common/GlassCard';

export interface AHASegment {
  id: number;
  name: string;
  shortName: string;
  vessel: Vessel;
  ring: 'basal' | 'mid' | 'apical' | 'apex';
  startAngle?: number;
  endAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
}

const SEGMENTS: AHASegment[] = [
  // Basal ring (1-6) - Outer
  { id: 1, name: 'Basal Anterior', shortName: 'B-Ant', vessel: 'LAD', ring: 'basal', startAngle: -120, endAngle: -60, innerRadius: 85, outerRadius: 118 },
  { id: 2, name: 'Basal Anteroseptal', shortName: 'B-AS', vessel: 'LAD', ring: 'basal', startAngle: -180, endAngle: -120, innerRadius: 85, outerRadius: 118 },
  { id: 3, name: 'Basal Inferoseptal', shortName: 'B-IS', vessel: 'RCA', ring: 'basal', startAngle: 120, endAngle: 180, innerRadius: 85, outerRadius: 118 },
  { id: 4, name: 'Basal Inferior', shortName: 'B-Inf', vessel: 'RCA', ring: 'basal', startAngle: 60, endAngle: 120, innerRadius: 85, outerRadius: 118 },
  { id: 5, name: 'Basal Inferolateral', shortName: 'B-IL', vessel: 'LCX', ring: 'basal', startAngle: 0, endAngle: 60, innerRadius: 85, outerRadius: 118 },
  { id: 6, name: 'Basal Anterolateral', shortName: 'B-AL', vessel: 'LCX', ring: 'basal', startAngle: -60, endAngle: 0, innerRadius: 85, outerRadius: 118 },

  // Mid ring (7-12) - Middle
  { id: 7, name: 'Mid Anterior', shortName: 'M-Ant', vessel: 'LAD', ring: 'mid', startAngle: -120, endAngle: -60, innerRadius: 52, outerRadius: 85 },
  { id: 8, name: 'Mid Anteroseptal', shortName: 'M-AS', vessel: 'LAD', ring: 'mid', startAngle: -180, endAngle: -120, innerRadius: 52, outerRadius: 85 },
  { id: 9, name: 'Mid Inferoseptal', shortName: 'M-IS', vessel: 'RCA', ring: 'mid', startAngle: 120, endAngle: 180, innerRadius: 52, outerRadius: 85 },
  { id: 10, name: 'Mid Inferior', shortName: 'M-Inf', vessel: 'RCA', ring: 'mid', startAngle: 60, endAngle: 120, innerRadius: 52, outerRadius: 85 },
  { id: 11, name: 'Mid Inferolateral', shortName: 'M-IL', vessel: 'LCX', ring: 'mid', startAngle: 0, endAngle: 60, innerRadius: 52, outerRadius: 85 },
  { id: 12, name: 'Mid Anterolateral', shortName: 'M-AL', vessel: 'LCX', ring: 'mid', startAngle: -60, endAngle: 0, innerRadius: 52, outerRadius: 85 },

  // Apical ring (13-16) - Inner
  { id: 13, name: 'Apical Anterior', shortName: 'A-Ant', vessel: 'LAD', ring: 'apical', startAngle: -135, endAngle: -45, innerRadius: 24, outerRadius: 52 },
  { id: 14, name: 'Apical Septal', shortName: 'A-Sep', vessel: 'LAD', ring: 'apical', startAngle: -225, endAngle: -135, innerRadius: 24, outerRadius: 52 },
  { id: 15, name: 'Apical Inferior', shortName: 'A-Inf', vessel: 'RCA', ring: 'apical', startAngle: 45, endAngle: 135, innerRadius: 24, outerRadius: 52 },
  { id: 16, name: 'Apical Lateral', shortName: 'A-Lat', vessel: 'LCX', ring: 'apical', startAngle: -45, endAngle: 45, innerRadius: 24, outerRadius: 52 },

  // Apex (17) - Center
  { id: 17, name: 'Apex', shortName: 'Apex', vessel: 'LAD', ring: 'apex', innerRadius: 0, outerRadius: 24 },
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArcSector(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startDeg: number,
  endDeg: number
) {
  const p1 = polarToCartesian(cx, cy, rOuter, startDeg);
  const p2 = polarToCartesian(cx, cy, rOuter, endDeg);
  const p3 = polarToCartesian(cx, cy, rInner, endDeg);
  const p4 = polarToCartesian(cx, cy, rInner, startDeg);

  const arcSweep = Math.abs(endDeg - startDeg) <= 180 ? 0 : 1;

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${arcSweep} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${arcSweep} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ');
}

const VESSEL_BASE_COLORS: Record<Vessel, string> = {
  LAD: '#00E5FF',
  LCX: '#A78BFA',
  RCA: '#EC4899',
};

export const Bullseye: React.FC = () => {
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const setSelectedVessel = useAppStore((s) => s.setSelectedVessel);
  const prediction = useAppStore((s) => s.prediction);

  const [hoveredSegment, setHoveredSegment] = useState<AHASegment | null>(null);

  const cx = 130;
  const cy = 130;

  const getVesselScore = (vessel: Vessel) => {
    return prediction?.vesselPredictions?.[vessel]?.demoScore ?? 0;
  };

  const activeSegment = hoveredSegment ?? SEGMENTS.find((s) => s.vessel === selectedVessel) ?? SEGMENTS[0];

  return (
    <GlassCard borderVariant="subtle" padding="md" className="space-y-3 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-2">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
            AHA 17-Segment Polar Bullseye
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            Left Ventricular Myocardial Segments
          </span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block shadow-[0_0_6px_#00E5FF]" />
            <span className="text-cyan-300 font-bold">LAD</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-violet-400 inline-block shadow-[0_0_6px_#A78BFA]" />
            <span className="text-violet-300 font-bold">LCX</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-pink-400 inline-block shadow-[0_0_6px_#EC4899]" />
            <span className="text-pink-300 font-bold">RCA</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3">
        {/* SVG Bullseye centered max 280px */}
        <div className="relative w-full max-w-[280px] aspect-square flex-shrink-0 flex items-center justify-center mx-auto">
          <svg
            viewBox="0 0 260 260"
            className="w-full h-full max-w-[260px] max-h-[260px] select-none"
            aria-label="AHA 17-Segment Diagram"
          >
            {/* Guide circle */}
            <circle cx={cx} cy={cy} r="122" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="2 2" />

            {/* Segments 1-16 (Sector arcs) */}
            {SEGMENTS.filter((s) => s.ring !== 'apex').map((seg) => {
              const pathD = describeArcSector(
                cx,
                cy,
                seg.innerRadius!,
                seg.outerRadius!,
                seg.startAngle!,
                seg.endAngle!
              );

              const isTargetVessel = seg.vessel === selectedVessel;
              const isHovered = hoveredSegment?.id === seg.id;
              const score = getVesselScore(seg.vessel);
              const color = VESSEL_BASE_COLORS[seg.vessel];
              const opacity = 0.22 + (score / 100) * 0.65;

              // Centroid for label
              const midR = (seg.innerRadius! + seg.outerRadius!) / 2;
              const midAngle = (seg.startAngle! + seg.endAngle!) / 2;
              const pt = polarToCartesian(cx, cy, midR, midAngle);

              return (
                <g key={seg.id} className="cursor-pointer transition-all duration-200">
                  <path
                    d={pathD}
                    fill={color}
                    fillOpacity={isHovered ? 0.95 : isTargetVessel ? opacity + 0.15 : opacity}
                    stroke={isHovered ? '#FFFFFF' : isTargetVessel ? color : '#0F172A'}
                    strokeWidth={isHovered ? 2 : isTargetVessel ? 1.5 : 0.8}
                    onClick={() => setSelectedVessel(seg.vessel)}
                    onMouseEnter={() => setHoveredSegment(seg)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                  <text
                    x={pt.x}
                    y={pt.y + 3}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill={isHovered ? '#FFFFFF' : isTargetVessel ? '#FFFFFF' : '#E2E8F0'}
                    className="pointer-events-none select-none font-mono"
                    opacity={0.9}
                  >
                    {seg.id}
                  </text>
                </g>
              );
            })}

            {/* Apex (Center Circle Segment 17) */}
            {(() => {
              const seg17 = SEGMENTS.find((s) => s.id === 17)!;
              const isTargetVessel = seg17.vessel === selectedVessel;
              const isHovered = hoveredSegment?.id === 17;
              const score = getVesselScore(seg17.vessel);
              const color = VESSEL_BASE_COLORS.LAD;
              const opacity = 0.25 + (score / 100) * 0.65;

              return (
                <g className="cursor-pointer transition-all duration-200">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={seg17.outerRadius}
                    fill={color}
                    fillOpacity={isHovered ? 0.95 : isTargetVessel ? opacity + 0.15 : opacity}
                    stroke={isHovered ? '#FFFFFF' : isTargetVessel ? color : '#0F172A'}
                    strokeWidth={isHovered ? 2 : isTargetVessel ? 1.5 : 0.8}
                    onClick={() => setSelectedVessel(seg17.vessel)}
                    onMouseEnter={() => setHoveredSegment(seg17)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                  <text
                    x={cx}
                    y={cy + 3}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#FFFFFF"
                    className="pointer-events-none select-none font-mono"
                  >
                    17
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Segment Detail Readout */}
        <div className="w-full sm:w-[170px] p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>SEGMENT #{activeSegment.id}</span>
            <span
              className="px-1.5 py-0.2 rounded font-bold"
              style={{
                backgroundColor: `${VESSEL_BASE_COLORS[activeSegment.vessel]}20`,
                color: VESSEL_BASE_COLORS[activeSegment.vessel],
              }}
            >
              {activeSegment.vessel}
            </span>
          </div>

          <div className="text-white font-bold text-xs leading-tight">
            {activeSegment.name}
          </div>

          <div className="text-[10px] text-slate-400">
            Ring: <span className="text-slate-200 uppercase">{activeSegment.ring}</span>
          </div>

          <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Territory Score:</span>
            <span className="text-white font-bold">
              {getVesselScore(activeSegment.vessel)}/100
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedVessel(activeSegment.vessel)}
            className="w-full mt-1.5 min-h-[44px] py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-xs font-semibold text-cyan-300 border border-cyan-500/20 text-center transition-all flex items-center justify-center cursor-pointer"
          >
            Focus {activeSegment.vessel} Vessel
          </button>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 text-center italic">
        Click any segment to synchronize the 3D heart and peripheral panels with its coronary supply bed.
      </div>
    </GlassCard>
  );
};
