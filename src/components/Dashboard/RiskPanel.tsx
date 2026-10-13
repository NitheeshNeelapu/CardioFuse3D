import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { ContributionChart } from '../Charts/ContributionChart';
import { Bullseye } from '../Charts/Bullseye';
import { detectConflict } from '../../data/conflict';
import { Activity, Heart, RefreshCw, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Vessel } from '../../types/vessel';

export const RiskPanel: React.FC = () => {
  const prediction = useAppStore((s) => s.prediction);
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const setSelectedVessel = useAppStore((s) => s.setSelectedVessel);
  const rerunFusionModel = useAppStore((s) => s.rerunFusionModel);
  const modalities = useAppStore((s) => s.modalities);
  const getEffectivePatient = useAppStore((s) => s.getEffectivePatient);

  if (!prediction) return null;

  const effectivePatient = getEffectivePatient();
  const conflict = detectConflict(effectivePatient, modalities);

  const vessels: { id: Vessel; name: string; desc: string; score: number }[] = [
    {
      id: 'LAD',
      name: 'LAD',
      desc: 'Left Anterior Descending',
      score: prediction.vesselPredictions.LAD.demoScore,
    },
    {
      id: 'LCX',
      name: 'LCX',
      desc: 'Left Circumflex',
      score: prediction.vesselPredictions.LCX.demoScore,
    },
    {
      id: 'RCA',
      name: 'RCA',
      desc: 'Right Coronary',
      score: prediction.vesselPredictions.RCA.demoScore,
    },
  ];

  return (
    <div className="space-y-4 select-none">
      {/* 0. Evidence Conflict Detector Card */}
      {conflict.status === 'agree' && (
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 font-mono text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Modalities agree on {conflict.topVessel}</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              CONCORDANT
            </span>
          </div>
          <p className="text-[10px] text-slate-300 font-sans">
            Independent evaluations of all active modalities concordantly identify {conflict.topVessel} as the primary risk territory.
          </p>
          <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
            {conflict.perModality?.map((m) => (
              <button
                key={m.modality}
                onClick={() => setSelectedVessel(m.topVessel)}
                className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-[10px] flex items-center gap-1 transition-all"
                title={`Click to focus ${m.topVessel}`}
              >
                <span>{m.label}:</span>
                <span className="font-bold">{m.topVessel}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {conflict.status === 'conflict' && (
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 font-mono text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{conflict.message}</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              NEEDS REVIEW
            </span>
          </div>
          <p className="text-[10px] text-slate-300 font-sans">
            Active evidence modalities favor different coronary territories. Click a chip to focus that vessel:
          </p>
          <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
            {conflict.perModality?.map((m) => (
              <button
                key={m.modality}
                onClick={() => setSelectedVessel(m.topVessel)}
                className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-all border ${
                  selectedVessel === m.topVessel
                    ? 'bg-amber-400/20 text-amber-200 border-amber-400 font-bold'
                    : 'bg-black/40 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
                title={`Click to select ${m.topVessel}`}
              >
                <span>{m.label}:</span>
                <span className="font-bold underline">{m.topVessel}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {conflict.status === 'insufficient' && (
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>Need 2+ active modalities</span>
          </div>
          <span className="text-[9px] text-slate-500">Conflict check disabled</span>
        </div>
      )}

      {/* 1. Main Demonstration Output Card */}
      <GlassCard borderVariant="cyan" glow={true} padding="md">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 mb-3 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Demonstration Output (Mock)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Target territory: {selectedVessel}
              </span>
            </div>
          </div>
          <Badge variant="amber" className="text-[9px] whitespace-normal text-center sm:text-right">
            SYNTHETIC DEMONSTRATION OUTPUT — NOT CLINICALLY VALIDATED
          </Badge>
        </div>

        {/* Selected Vessel Synthetic Demo Score Highlight */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/40 via-[#08111F] to-blue-950/30 border border-cyan-500/30 mb-4">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-1">
            <span className="font-bold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              {selectedVessel} DEMONSTRATION SCORE
            </span>
            <span className="text-[10px] text-slate-400">Mock late-fusion preview</span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {prediction.probability}/100
            </span>
            <span className="text-xs text-amber-300/90 font-mono">
              — Synthetic demo score
            </span>
          </div>

          {/* Bar indicator */}
          <div className="w-full bg-black/50 rounded-full h-2 mt-2.5 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(0,229,255,0.5)]"
              style={{ width: `${prediction.probability}%` }}
            />
          </div>

          <div className="mt-2.5 p-2 rounded-lg bg-black/50 border border-white/5 text-[10px] text-slate-300 font-mono leading-relaxed">
            <div className="flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                Demonstration score for interface workflow demonstration only. No trained prediction model is connected. Values do not represent real disease probability.
              </span>
            </div>
          </div>
        </div>

        {/* Modality Contribution Visualization */}
        <div className="pt-2 border-t border-white/10 mb-3">
          <ContributionChart />
        </div>

        {/* Multi-modal Agreement Indicator (Explicitly: Not calculated — demo mode) */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">
              Modality Agreement
            </span>
            <Badge variant="amber">DEMO MODE</Badge>
          </div>
          <div className="text-xs font-mono font-bold text-amber-300">
            Not calculated — demo mode
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            {prediction.agreementDescription ||
              'Defined agreement calculation requires a connected model and verified patient evidence. Not calculated in demonstration mode.'}
          </p>
        </div>

        {/* Re-run Fusion Model Action Button */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <button
            onClick={() => rerunFusionModel()}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 group"
          >
            <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
            <span>RE-RUN FUSION DEMONSTRATION</span>
          </button>
        </div>
      </GlassCard>

      {/* 2. Coronary Analysis Section */}
      <GlassCard borderVariant="subtle" padding="md">
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Coronary Branches
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            Click to focus territory
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
                      Synthetic demo score
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold font-mono text-white">
                    {v.score}/100
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono block">
                    {isSelected ? 'Active Target' : 'Select'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* 3. AHA 17-Segment Polar Map */}
      <GlassCard borderVariant="subtle" padding="md">
        <Bullseye />
      </GlassCard>
    </div>
  );
};
