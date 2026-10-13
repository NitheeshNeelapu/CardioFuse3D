import React from 'react';
import { Vessel, VESSEL_DEFINITIONS } from '../../types/vessel';
import { useAppStore } from '../../state/useAppStore';
import { GlassCard } from '../common/GlassCard';

const VESSEL_COLORS: Record<Vessel, { hex: string; border: string; bg: string }> = {
  LAD: {
    hex: '#00E5FF',
    border: 'border-cyan-400/50',
    bg: 'bg-cyan-950/30',
  },
  LCX: {
    hex: '#A78BFA',
    border: 'border-violet-400/50',
    bg: 'bg-violet-950/30',
  },
  RCA: {
    hex: '#EC4899',
    border: 'border-pink-400/50',
    bg: 'bg-pink-950/30',
  },
};

const VESSELS: Vessel[] = ['LAD', 'LCX', 'RCA'];

export const TerritorySummary: React.FC = () => {
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const setSelectedVessel = useAppStore((s) => s.setSelectedVessel);
  const prediction = useAppStore((s) => s.prediction);

  return (
    <GlassCard borderVariant="subtle" padding="md" className="space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
            Territory Supply Bed Summary
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            Coronary anatomical supply & current model probabilities
          </span>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800/80 border border-white/10 text-cyan-300 font-bold">
          3 VESSELS
        </span>
      </div>

      {/* 3 Compact Rows */}
      <div className="space-y-2">
        {VESSELS.map((vessel) => {
          const info = VESSEL_DEFINITIONS[vessel];
          const isSelected = selectedVessel === vessel;
          const score = prediction?.vesselPredictions?.[vessel]?.demoScore ?? 0;
          const styling = VESSEL_COLORS[vessel];

          return (
            <div
              key={vessel}
              onClick={() => setSelectedVessel(vessel)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedVessel(vessel);
                }
              }}
              className={`min-h-[44px] flex flex-col justify-center px-3 py-2.5 rounded-xl transition-all cursor-pointer border ${
                isSelected
                  ? `${styling.bg} ${styling.border} shadow-[0_0_15px_rgba(0,229,255,0.12)] ring-1 ring-white/20`
                  : 'bg-black/30 border-white/5 hover:bg-white/[0.04] hover:border-white/15'
              }`}
            >
              {/* Top metadata line */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: styling.hex,
                      boxShadow: isSelected ? `0 0 10px ${styling.hex}` : undefined,
                    }}
                  />
                  <span className="font-bold text-xs text-white font-mono flex-shrink-0">
                    {vessel}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate font-sans">
                    {info.territory}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className="font-bold text-xs font-mono"
                    style={{ color: styling.hex }}
                  >
                    {score}%
                  </span>
                </div>
              </div>

              {/* Thin Probability Bar */}
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(0, score))}%`,
                    backgroundColor: styling.hex,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety & Interaction Note */}
      <div className="text-[10px] text-slate-500 font-sans text-center pt-1 border-t border-white/5">
        Click any territory row to focus the 3D heart and sync diagnostic telemetry.
      </div>
    </GlassCard>
  );
};
