import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import { GlassCard } from '../common/GlassCard';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { Badge } from '../common/Badge';
import { Sliders, Activity, Database, FileText, AlertTriangle } from 'lucide-react';

export const ModalityPanel: React.FC = () => {
  const modalities = useAppStore((s) => s.modalities);
  const toggleModality = useAppStore((s) => s.toggleModality);
  const activeCount = useAppStore((s) => s.prediction?.activeModalitiesCount || 3);

  return (
    <GlassCard borderVariant="subtle" padding="md">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Modality Controls
          </h3>
        </div>
        <Badge variant={activeCount === 3 ? 'emerald' : 'amber'}>
          {activeCount} of 3 ACTIVE
        </Badge>
      </div>

      <p className="text-[11px] text-slate-400 mb-3">
        Toggle multimodal evidence streams. When an input is disabled, the model recalculates using available modalities rather than fabricating missing signals.
      </p>

      {/* Toggles */}
      <div className="space-y-2.5 bg-black/30 p-2.5 rounded-xl border border-white/5">
        {/* Clinical Toggle */}
        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                Clinical Evidence
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Demographics, vitals & lab markers
              </span>
            </div>
          </div>
          <ToggleSwitch
            checked={modalities.clinical}
            onChange={() => toggleModality('clinical')}
            activeColor="cyan"
            id="toggle-clinical"
          />
        </div>

        {/* ECG Toggle */}
        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-violet-400" />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                ECG Evidence
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                12-lead continuous waveform
              </span>
            </div>
          </div>
          <ToggleSwitch
            checked={modalities.ecg}
            onChange={() => toggleModality('ecg')}
            activeColor="violet"
            id="toggle-ecg"
          />
        </div>

        {/* Text Toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-pink-400" />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                Text Evidence
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Unstructured clinical symptom notes
              </span>
            </div>
          </div>
          <ToggleSwitch
            checked={modalities.text}
            onChange={() => toggleModality('text')}
            activeColor="pink"
            id="toggle-text"
          />
        </div>
      </div>

      {/* Dynamic Masking Notice if ECG is OFF */}
      {!modalities.ecg && (
        <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold text-amber-300 block">ECG Masked:</span>
            Waveform vector dynamically omitted. Model output recalculated without synthetic hallucination.
          </div>
        </div>
      )}
    </GlassCard>
  );
};
