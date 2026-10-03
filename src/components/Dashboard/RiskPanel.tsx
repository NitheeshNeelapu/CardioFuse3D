import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { ContributionChart } from '../Charts/ContributionChart';
import { Activity, ShieldCheck, Heart, AlertCircle, ArrowRight } from 'lucide-react';
import { Vessel } from '../../types/vessel';

export const RiskPanel: React.FC = () => {
  const prediction = useAppStore((s) => s.prediction);
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const setSelectedVessel = useAppStore((s) => s.setSelectedVessel);
  const isEcgActive = useAppStore((s) => s.modalities.ecg);

  if (!prediction) return null;

  const vessels: { id: Vessel; name: string; desc: string; score: number }[] = [
    {
      id: 'LAD',
      name: 'LAD',
      desc: 'Left Anterior Descending',
      score: prediction.vesselPredictions.LAD.probability,
    },
    {
      id: 'LCX',
      name: 'LCX',
      desc: 'Left Circumflex',
      score: prediction.vesselPredictions.LCX.probability,
    },
    {
      id: 'RCA',
      name: 'RCA',
      desc: 'Right Coronary',
      score: prediction.vesselPredictions.RCA.probability,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Main Risk Card */}
      <GlassCard borderVariant="cyan" glow={true} padding="md">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Model-Derived Probability
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Anatomical projection: {selectedVessel}
              </span>
            </div>
          </div>
          <Badge variant="cyan">SYNTHETIC DEMO</Badge>
        </div>

        {/* Selected Vessel Probability Highlight */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/40 via-[#08111F] to-blue-950/30 border border-cyan-500/30 mb-4">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-1">
            <span className="font-bold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              {selectedVessel} VESSEL PROBABILITY
            </span>
            <span className="text-[10px] text-slate-400">Late-fusion estimate</span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
              {prediction.probability}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Model-derived probability
            </span>
          </div>

          {/* Bar indicator */}
          <div className="w-full bg-black/50 rounded-full h-2 mt-2.5 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(0,229,255,0.5)]"
              style={{ width: `${prediction.probability}%` }}
            />
          </div>

          <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Label: Model-derived probability</span>
            <span className="text-cyan-400">Clinical interpretation required</span>
          </div>
        </div>

        {/* Modality Contribution Visualization */}
        <div className="pt-2 border-t border-white/10">
          <ContributionChart />
        </div>
      </GlassCard>

      {/* 2. Coronary Analysis Section */}
      <GlassCard borderVariant="subtle" padding="md">
        <div className="flex items-center justify-between pb-2.5 border-b border-white/5 mb-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Coronary Analysis
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            Click to focus
          </span>
        </div>

        <div className="space-y-2">
          {vessels.map((v) => {
            const isSelected = selectedVessel === v.id;

            return (
              <button
                key={v.id}
                onClick={() => setSelectedVessel(v.id)}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.2)] translate-x-1'
                    : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      v.id === 'LAD'
                        ? 'bg-cyan-400'
                        : v.id === 'LCX'
                        ? 'bg-violet-400'
                        : 'bg-pink-400'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold font-mono text-white">
                        {v.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {v.desc}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Status: Demo interpretation
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold font-mono text-white">
                    {v.score}%
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono block">
                    {isSelected ? 'Active' : 'Select'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};
