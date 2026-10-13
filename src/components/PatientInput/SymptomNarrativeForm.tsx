import React from 'react';
import { FileText, Sparkles, MessageSquare } from 'lucide-react';

interface SymptomNarrativeFormProps {
  narrativeText: string;
  setNarrativeText: (text: string) => void;
  onInsertSample?: (sampleText: string) => void;
}

export const SymptomNarrativeForm: React.FC<SymptomNarrativeFormProps> = ({
  narrativeText,
  setNarrativeText,
  onInsertSample,
}) => {
  const sampleTemplates = [
    {
      label: 'Exertional substernal discomfort',
      text: 'Patient describes substernal chest discomfort occurring during uphill walking, lasting 5-10 minutes and resolving with rest. No radiation to left jaw or left arm.',
    },
    {
      label: 'Atypical fatigue & exertional dyspnea',
      text: 'Reports generalized exertional fatigue and shortness of breath upon moderate physical exertion for 2 weeks. Mild epigastric fullness without overt chest tightness.',
    },
    {
      label: 'Non-anginal musculoskeletal notes',
      text: 'Sharp localized anterior chest wall tenderness exacerbated by deep inspiration and palpation. No exertional triggers noted.',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor="symptom-narrative" className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-pink-400" />
          <span>Clinical Symptoms / Narrative</span>
        </label>
        <span className="text-[10px] font-mono text-slate-400">
          Unstructured Clinical Text NLP
        </span>
      </div>

      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
        Enter free-form clinical intake notes, patient descriptors, or reported exertional sensations. Text will be processed via BioClinicalBERT tokens in the multimodal late-fusion layer.
      </p>

      {/* Large Text Area */}
      <textarea
        id="symptom-narrative"
        rows={5}
        value={narrativeText}
        onChange={(e) => setNarrativeText(e.target.value)}
        placeholder="Enter available clinical narrative or symptoms…"
        className="w-full bg-[#030712] border border-white/15 rounded-xl p-3.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors leading-relaxed"
      />

      {/* Sample Quick Insert Helpers */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Optional Quick Text Templates (Click to paste):</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {sampleTemplates.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (onInsertSample) onInsertSample(t.text);
                else setNarrativeText(t.text);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] font-mono transition-colors text-left"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
