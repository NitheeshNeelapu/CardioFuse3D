import React, { useMemo } from 'react';
import { Activity, AlertTriangle, Radio } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useAppStore } from '../../state/useAppStore';

export const ECGChart: React.FC = () => {
  const isEcgActive = useAppStore((s) => s.modalities.ecg);
  const patient = useAppStore((s) => s.selectedPatient);

  // Generate synthetic P-Q-R-S-T continuous waveform path for SVG
  const ecgPath = useMemo(() => {
    const width = 460;
    const height = 90;
    const baseline = height / 2;
    const points: string[] = [];

    const cycleWidth = 110;
    const numCycles = Math.ceil(width / cycleWidth) + 1;

    for (let c = 0; c < numCycles; c++) {
      const offsetX = c * cycleWidth;

      // P wave
      points.push(`M ${offsetX} ${baseline}`);
      points.push(`Q ${offsetX + 12} ${baseline - 8}, ${offsetX + 24} ${baseline}`);
      // PR segment
      points.push(`L ${offsetX + 36} ${baseline}`);
      // Q dip
      points.push(`L ${offsetX + 40} ${baseline + 6}`);
      // R peak (sharp upward)
      points.push(`L ${offsetX + 48} ${baseline - 38}`);
      // S dip (sharp downward)
      points.push(`L ${offsetX + 54} ${baseline + 16}`);
      // ST baseline
      points.push(`L ${offsetX + 66} ${baseline}`);
      // T wave
      points.push(`Q ${offsetX + 82} ${baseline - 14}, ${offsetX + 98} ${baseline}`);
      // Isoelectric
      points.push(`L ${offsetX + cycleWidth} ${baseline}`);
    }

    return points.join(' ');
  }, []);

  return (
    <div className="space-y-3">
      {/* Header with Title & Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            ECG Analysis
          </h3>
        </div>
        <Badge variant={isEcgActive ? 'cyan' : 'unavailable'}>
          {isEcgActive ? 'DEMO ECG' : 'UNAVAILABLE'}
        </Badge>
      </div>

      {isEcgActive ? (
        <div className="space-y-2.5">
          {/* ECG Waveform Display */}
          <div className="relative w-full h-[95px] rounded-xl bg-[#030712] border border-cyan-500/20 overflow-hidden">
            {/* Grid background */}
            <svg className="w-full h-full" viewBox="0 0 460 90" preserveAspectRatio="none">
              <defs>
                <pattern id="ecg-mesh-grid" width="20" height="15" patternUnits="userSpaceOnUse">
                  <rect width="20" height="15" fill="none" stroke="rgba(0, 229, 255, 0.07)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="460" height="90" fill="url(#ecg-mesh-grid)" />
              <path
                d={ecgPath}
                fill="none"
                stroke="#00E5FF"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_6px_rgba(0,229,255,0.7)]"
              />
            </svg>

            {/* Sweep light effect */}
            <div className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent animate-scanline pointer-events-none" />

            {/* Live Indicator overlay */}
            <div className="absolute top-2 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-cyan-500/30 text-[9px] font-mono text-cyan-300">
              <Radio className="w-2.5 h-2.5 animate-pulse text-cyan-400" />
              <span>LEAD V1-V4 • 500 Hz</span>
            </div>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-xs">
            <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-[9px] text-slate-400 block">HR</span>
              <span className="text-white font-bold">{patient.ecg.heartRate}</span>
              <span className="text-[8px] text-slate-500 block">bpm</span>
            </div>
            <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-[9px] text-slate-400 block">PR</span>
              <span className="text-white font-bold">{patient.ecg.prInterval}</span>
              <span className="text-[8px] text-slate-500 block">ms</span>
            </div>
            <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-[9px] text-slate-400 block">QRS</span>
              <span className="text-white font-bold">{patient.ecg.qrsDuration}</span>
              <span className="text-[8px] text-slate-500 block">ms</span>
            </div>
            <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-[9px] text-slate-400 block">QTc</span>
              <span className="text-white font-bold">{patient.ecg.qtcInterval}</span>
              <span className="text-[8px] text-slate-500 block">ms</span>
            </div>
          </div>
        </div>
      ) : (
        /* Disabled ECG State: NEVER show stale info */
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-xs font-bold text-amber-300">
              ECG evidence unavailable
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            Prediction recalculated using available evidence.
          </p>
          <div className="pt-2 border-t border-amber-500/20 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Waveform encoder: MASKED</span>
            <span className="text-amber-400 font-bold">Dual-Fusion Active</span>
          </div>
        </div>
      )}
    </div>
  );
};
