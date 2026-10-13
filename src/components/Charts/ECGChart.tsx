import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, Radio, Info, Grid, Maximize2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useAppStore } from '../../state/useAppStore';
import { ECGPattern } from '../../types/patient';
import {
  generateLeadWaveform,
  STANDARD_12_LEADS,
  LEAD_TERRITORIES,
  LeadName,
} from '../../utils/ecgSynth';
import { ECGUploadSection } from './ECGUploadSection';

export const ECGChart: React.FC = () => {
  const isEcgToggledOn = useAppStore((s) => s.modalities.ecg);
  const patientInput = useAppStore((s) => s.patientInput);
  const selectedPatient = useAppStore((s) => s.selectedPatient);
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const setSelectedVessel = useAppStore((s) => s.setSelectedVessel);

  const [viewMode, setViewMode] = useState<'12lead' | 'rhythm'>('12lead');

  const isEcgAvailable = isEcgToggledOn && Boolean(patientInput?.ecg?.available);
  const pattern: ECGPattern = patientInput?.ecg?.pattern || 'Normal Sinus Rhythm';

  // Generate continuous waveform path reflecting chosen pattern for SVG demonstration
  const ecgPath = useMemo(() => {
    const width = 460;
    const height = 90;
    const baseline = height / 2;
    const points: string[] = [];

    const cycleWidth = 115;
    const numCycles = Math.ceil(width / cycleWidth) + 1;

    for (let c = 0; c < numCycles; c++) {
      const offsetX = c * cycleWidth;

      // P wave
      points.push(`M ${offsetX} ${baseline}`);
      points.push(`Q ${offsetX + 12} ${baseline - 7}, ${offsetX + 24} ${baseline}`);
      // PR segment
      points.push(`L ${offsetX + 36} ${baseline}`);
      // Q dip
      points.push(`L ${offsetX + 40} ${baseline + 6}`);
      // R peak (sharp upward)
      points.push(`L ${offsetX + 48} ${baseline - 38}`);
      // S dip (sharp downward)
      points.push(`L ${offsetX + 54} ${baseline + 16}`);

      if (pattern === 'Anterior ST-Elevation Pattern') {
        points.push(`L ${offsetX + 64} ${baseline - 12}`);
        points.push(`Q ${offsetX + 80} ${baseline - 22}, ${offsetX + 98} ${baseline}`);
      } else if (pattern === 'Lateral T-Wave Inversion Pattern') {
        points.push(`L ${offsetX + 66} ${baseline}`);
        points.push(`Q ${offsetX + 82} ${baseline + 16}, ${offsetX + 98} ${baseline}`);
      } else if (pattern === 'Inferior ST-Depression Pattern') {
        points.push(`L ${offsetX + 64} ${baseline + 8}`);
        points.push(`Q ${offsetX + 80} ${baseline - 6}, ${offsetX + 98} ${baseline}`);
      } else {
        points.push(`L ${offsetX + 66} ${baseline}`);
        points.push(`Q ${offsetX + 82} ${baseline - 14}, ${offsetX + 98} ${baseline}`);
      }

      points.push(`L ${offsetX + cycleWidth} ${baseline}`);
    }

    return points.join(' ');
  }, [pattern]);

  const flatLeads: LeadName[] = STANDARD_12_LEADS.flat();

  return (
    <div className="space-y-3 select-none">
      {/* Header with Title & Badge & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            ECG Electrophysiology
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {isEcgAvailable && (
            <div className="flex rounded-lg bg-black/40 border border-white/10 p-0.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setViewMode('12lead')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                  viewMode === '12lead'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-3 h-3" />
                <span>12-Lead</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('rhythm')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                  viewMode === 'rhythm'
                    ? 'bg-violet-500/20 text-violet-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3 h-3" />
                <span>Rhythm</span>
              </button>
            </div>
          )}

          {isEcgAvailable ? (
            <Badge variant="violet" className="text-[9px] font-mono">
              Synthetic demo ECG
            </Badge>
          ) : (
            <Badge variant="unavailable" className="text-[9px] font-mono">
              Patient ECG: Not provided
            </Badge>
          )}
        </div>
      </div>

      {isEcgAvailable ? (
        <div className="space-y-2.5">
          {/* Pattern description pill */}
          <div className="flex items-center justify-between text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-black/40 border border-violet-500/20 text-violet-300">
            <span className="text-slate-400">Pattern:</span>
            <span className="font-bold truncate max-w-[240px]">{pattern}</span>
          </div>

          {viewMode === '12lead' ? (
            /* 12-Lead Grid View */
            <div className="space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono">
                {flatLeads.map((lead) => {
                  const territory = LEAD_TERRITORIES[lead];
                  const isHighlighted = territory === selectedVessel;
                  const leadPath = generateLeadWaveform(lead, selectedPatient, 100, 40);

                  let borderStyle = 'border-white/5 bg-black/40';
                  let tagBadge = null;

                  if (territory === 'LAD') {
                    tagBadge = <span className="text-[8px] text-cyan-300">LAD</span>;
                    if (isHighlighted) {
                      borderStyle = 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]';
                    }
                  } else if (territory === 'LCX') {
                    tagBadge = <span className="text-[8px] text-violet-300">LCX</span>;
                    if (isHighlighted) {
                      borderStyle = 'border-violet-400 bg-violet-950/30 shadow-[0_0_10px_rgba(167,139,250,0.2)]';
                    }
                  } else if (territory === 'RCA') {
                    tagBadge = <span className="text-[8px] text-pink-300">RCA</span>;
                    if (isHighlighted) {
                      borderStyle = 'border-pink-400 bg-pink-950/30 shadow-[0_0_10px_rgba(236,72,153,0.2)]';
                    }
                  } else {
                    tagBadge = <span className="text-[8px] text-slate-500">Recip</span>;
                  }

                  return (
                    <div
                      key={lead}
                      onClick={() => territory && setSelectedVessel(territory)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer relative overflow-hidden ${borderStyle} hover:border-white/20`}
                      title={territory ? `Territory: ${territory} (Click to select)` : 'Reciprocal Lead'}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-0.5 leading-none">
                        <span className="font-bold text-white">{lead}</span>
                        {tagBadge}
                      </div>

                      <div className="w-full h-[32px] overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <path
                            d={leadPath}
                            fill="none"
                            stroke={isHighlighted ? '#FFFFFF' : '#A78BFA'}
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Territory Key */}
              <div className="flex items-center justify-between text-[9px] font-mono px-2 py-1 rounded bg-black/40 border border-white/5 text-slate-400">
                <span>Territory Highlight:</span>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300">● LAD (V1–V4)</span>
                  <span className="text-violet-300">● LCX (I, aVL, V5, V6)</span>
                  <span className="text-pink-300">● RCA (II, III, aVF)</span>
                </div>
              </div>
            </div>
          ) : (
            /* Single Lead / Rhythm Strip View */
            <div className="relative w-full h-[95px] rounded-xl bg-[#030712] border border-violet-500/20 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 460 90" preserveAspectRatio="none">
                <defs>
                  <pattern id="ecg-mesh-grid" width="20" height="15" patternUnits="userSpaceOnUse">
                    <rect width="20" height="15" fill="none" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="460" height="90" fill="url(#ecg-mesh-grid)" />
                <path
                  d={ecgPath}
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_6px_rgba(167,139,250,0.6)]"
                />
              </svg>

              <div className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-violet-400/15 to-transparent animate-scanline pointer-events-none" />

              <div className="absolute top-2 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 border border-violet-500/30 text-[9px] font-mono text-violet-300">
                <Radio className="w-2.5 h-2.5 animate-pulse text-violet-400" />
                <span>LEAD II RHYTHM • SYNTHETIC DEMONSTRATION</span>
              </div>
            </div>
          )}

          {/* Explicit disclaimer note */}
          <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-[10px] text-slate-400 font-mono flex items-start gap-1.5 leading-relaxed">
            <Info className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
            <span>
              Synthetic ECG — visualization only. Generated for interface demonstration. Not a patient recording and does not establish normal sinus rhythm or real pathology.
            </span>
          </div>

          {/* Demographic resting pulse reference */}
          <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
            <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-[9px] text-slate-400 block">Resting HR (Vitals)</span>
              <span className="text-white font-bold">
                {patientInput?.restingHeartRate ? `${patientInput.restingHeartRate} bpm` : 'Not entered'}
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-[9px] text-slate-400 block">Waveform Source</span>
              <span className="text-violet-300 font-bold">Synthetic 12-Lead Model</span>
            </div>
          </div>

          {/* Paper ECG Photo Extraction Section */}
          <ECGUploadSection />
        </div>
      ) : (
        /* Disabled / Missing ECG State */
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
              Patient ECG: Not provided
            </h4>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            ECG evidence unavailable. No patient physiological recording was supplied. Downstream demonstration output is calculated using available evidence without synthetic signal substitution.
          </p>
          <div className="pt-2 border-t border-amber-500/20 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Waveform encoder: OMITTED</span>
            <span className="text-amber-400 font-bold">No Signal Substituted</span>
          </div>
        </div>
      )}
    </div>
  );
};
