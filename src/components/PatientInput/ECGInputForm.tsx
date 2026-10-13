import React from 'react';
import { ECGPattern } from '../../types/patient';
import { Activity, AlertTriangle, CheckCircle2, EyeOff, Radio } from 'lucide-react';

interface ECGInputFormProps {
  ecgAvailable: boolean;
  setEcgAvailable: (val: boolean) => void;
  selectedPattern: ECGPattern;
  setSelectedPattern: (pattern: ECGPattern) => void;
  leadNotes: string;
  setLeadNotes: (notes: string) => void;
}

export const ECGInputForm: React.FC<ECGInputFormProps> = ({
  ecgAvailable,
  setEcgAvailable,
  selectedPattern,
  setSelectedPattern,
  leadNotes,
  setLeadNotes,
}) => {
  const patterns: {
    id: ECGPattern;
    title: string;
    description: string;
    leadContext: string;
    accentColor: string;
  }[] = [
    {
      id: 'Normal Sinus Rhythm',
      title: 'Normal Sinus Rhythm Pattern',
      description: 'Isoelectric ST segment; standard physiological repolarization across 12 leads.',
      leadContext: 'Standard 12-lead baseline test signal',
      accentColor: 'border-emerald-500/40 text-emerald-300',
    },
    {
      id: 'Anterior ST-Elevation Pattern',
      title: 'Anterior ST-Elevation Pattern',
      description: 'Demonstration ST-segment elevation in precordial leads V1-V4.',
      leadContext: 'Demonstration anterior repolarization vector',
      accentColor: 'border-cyan-500/40 text-cyan-300',
    },
    {
      id: 'Lateral T-Wave Inversion Pattern',
      title: 'Lateral T-Wave Inversion Pattern',
      description: 'Demonstration asymmetric T-wave inversion in leads I, aVL, V5, V6.',
      leadContext: 'Demonstration lateral repolarization vector',
      accentColor: 'border-violet-500/40 text-violet-300',
    },
    {
      id: 'Inferior ST-Depression Pattern',
      title: 'Inferior ST-Depression Pattern',
      description: 'Demonstration ST-segment depression in inferior leads II, III, aVF.',
      leadContext: 'Demonstration inferior repolarization vector',
      accentColor: 'border-pink-500/40 text-pink-300',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Availability Toggle */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              ecgAvailable ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-mono uppercase">
              12-Lead ECG Evidence Availability
            </h4>
            <p className="text-[11px] text-slate-400">
              Indicate whether physiological waveform signal data is present.
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEcgAvailable(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
              ecgAvailable
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            Available
          </button>
          <button
            type="button"
            onClick={() => setEcgAvailable(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
              !ecgAvailable
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            Not Available
          </button>
        </div>
      </div>

      {ecgAvailable ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="font-bold uppercase flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              Select Demonstration Waveform Pattern:
            </span>
            <span className="text-[10px] text-slate-400">
              Demo pattern only • Non-diagnostic
            </span>
          </div>

          {/* Pattern Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {patterns.map((p) => {
              const isSelected = selectedPattern === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPattern(p.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? `bg-cyan-950/40 ${p.accentColor} shadow-[0_0_15px_rgba(0,229,255,0.15)] ring-1 ring-cyan-400/50`
                      : 'bg-[#030712] border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-mono text-white">
                      {p.title}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-2 font-sans">
                    {p.description}
                  </p>
                  <div className="text-[10px] font-mono text-cyan-400/80 pt-1 border-t border-white/5">
                    {p.leadContext}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional Lead Notes */}
          <div className="pt-1">
            <label htmlFor="ecg-lead-notes" className="text-xs font-mono text-slate-300 block mb-1">
              Optional Technical Observations / Lead Details:
            </label>
            <input
              id="ecg-lead-notes"
              type="text"
              value={leadNotes}
              onChange={(e) => setLeadNotes(e.target.value)}
              placeholder="e.g. 500 Hz sampling, V3-V4 ST-segment tracing"
              className="w-full bg-[#030712] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>
      ) : (
        /* Explicit Unavailable Notice */
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <h4 className="text-xs font-bold font-mono text-amber-300 uppercase">
              ECG Evidence Unavailable
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            The multimodal model will mask physiological waveform encoder weights. Downstream calculations will synthesize risk exclusively from clinical vitals and symptom narrative without synthetic signal hallucination.
          </p>
          <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-amber-500/20">
            Mask Status: Latent vector omitted from fusion layer
          </div>
        </div>
      )}
    </div>
  );
};
