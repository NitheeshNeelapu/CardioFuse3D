import React, { useMemo, useState, useRef } from 'react';
import { useAppStore } from '../../state/useAppStore';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { ECGChart } from '../Charts/ECGChart';
import { validatePatientInput } from '../PatientInput/InputValidation';
import { computeTextOcclusionAttribution } from '../../data/scorer';
import { callLlm } from '../../api/llm';
import {
  User,
  FileText,
  Edit3,
  Info,
  AlertCircle,
  Mic,
  MicOff,
  Globe,
  RotateCcw,
  Sparkles,
  Loader2,
} from 'lucide-react';

type VoiceLang = 'en-IN' | 'hi-IN' | 'te-IN';

const VOICE_LANG_LABELS: Record<VoiceLang, string> = {
  'en-IN': 'English',
  'hi-IN': 'हिन्दी',
  'te-IN': 'తెలుగు',
};

export const PatientCard: React.FC = () => {
  const patientInput = useAppStore((s) => s.patientInput);
  const openInputPanel = useAppStore((s) => s.openInputPanel);
  const selectedPatient = useAppStore((s) => s.selectedPatient);
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const activeModalities = useAppStore((s) => s.activeModalities);
  const narrativeOverride = useAppStore((s) => s.narrativeOverride);
  const setNarrativeOverride = useAppStore((s) => s.setNarrativeOverride);

  // Voice & Narrative editing state
  const [isEditing, setIsEditing] = useState(false);
  const [voiceLang, setVoiceLang] = useState<VoiceLang>('en-IN');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [originalVoiceText, setOriginalVoiceText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const recognitionRef = useRef<any>(null);

  if (!patientInput) return null;

  const { isPartial, missingOptionalFields } = validatePatientInput(patientInput);

  // Active narrative string: override takes precedence
  const effectiveNarrative =
    narrativeOverride !== null && narrativeOverride !== undefined
      ? narrativeOverride
      : patientInput.symptoms?.narrativeText || selectedPatient?.clinicalNarrative || '';

  const tokenAttributions = useMemo(() => {
    if (!effectiveNarrative) return [];
    const patientObj = selectedPatient
      ? { ...selectedPatient, clinicalNarrative: effectiveNarrative }
      : {
          id: patientInput.patientId || 'custom',
          name: 'Patient',
          age: patientInput.age,
          sex: patientInput.sex,
          bmi: patientInput.bmi,
          clinicalNarrative: effectiveNarrative,
          vitals: {
            bloodPressureSys: patientInput.systolicBP || 120,
            bloodPressureDia: patientInput.diastolicBP || 80,
            heartRate: patientInput.restingHeartRate || 70,
            cholesterol: patientInput.cholesterol,
          },
        };

    return computeTextOcclusionAttribution(patientObj as any, selectedVessel, activeModalities);
  }, [effectiveNarrative, selectedPatient, selectedVessel, activeModalities, patientInput]);

  const handleVoiceInput = () => {
    setVoiceError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Voice input not supported in this browser, use Chrome.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = voiceLang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setVoiceError(`Voice recognition error: ${event.error || 'Check microphone access.'}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (!transcript) return;

        if (voiceLang === 'en-IN') {
          // English voice
          const updated = effectiveNarrative ? `${effectiveNarrative} ${transcript}` : transcript;
          setNarrativeOverride(updated);
          setOriginalVoiceText(null);
        } else {
          // Non-English: record original and call LLM translation
          setOriginalVoiceText(transcript);
          setIsTranslating(true);

          try {
            const res = await callLlm<{ english: string }>('translate_narrative', {
              text: transcript,
              language: VOICE_LANG_LABELS[voiceLang],
            });

            if (res && res.english) {
              const updated = effectiveNarrative ? `${effectiveNarrative} ${res.english}` : res.english;
              setNarrativeOverride(updated);
            } else {
              // Fallback: keep original text
              const updated = effectiveNarrative ? `${effectiveNarrative} ${transcript}` : transcript;
              setNarrativeOverride(updated);
              setVoiceError('Translation unavailable; original text retained. Scoring keywords may require English terms.');
            }
          } catch {
            const updated = effectiveNarrative ? `${effectiveNarrative} ${transcript}` : transcript;
            setNarrativeOverride(updated);
            setVoiceError('Translation unavailable; original text retained.');
          } finally {
            setIsTranslating(false);
          }
        }
      };

      recognition.start();
    } catch {
      setVoiceError('Failed to initialize microphone.');
      setIsListening(false);
    }
  };

  const handleResetNarrative = () => {
    setNarrativeOverride(null);
    setOriginalVoiceText(null);
    setVoiceError(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 select-none">
      {/* 1. Patient Demographics & Profile */}
      <GlassCard borderVariant="subtle" padding="md">
        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide font-mono">
                  {patientInput.patientId}
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                User-Entered Evidence Profile
              </p>
            </div>
          </div>

          <button
            onClick={() => openInputPanel(true)}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Edit manual patient values"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>EDIT</span>
          </button>
        </div>

        {/* Validation Status Badge */}
        <div className="mb-3 space-y-1.5">
          <div>
            {isPartial ? (
              <Badge variant="amber" className="text-[10px] py-1 px-2.5">
                CUSTOM USER INPUT — PARTIAL EVIDENCE
              </Badge>
            ) : (
              <Badge variant="emerald" className="text-[10px] py-1 px-2.5">
                CUSTOM USER INPUT — UNVALIDATED
              </Badge>
            )}
          </div>

          {missingOptionalFields.length > 0 && (
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <span className="text-amber-400">Not provided:</span>
              <span className="truncate">{missingOptionalFields.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Demographics details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono mb-3">
          <div className="p-2 rounded-lg bg-black/30 border border-white/5">
            <span className="text-[10px] text-slate-400 block">Age (Required)</span>
            <span className="text-white font-bold">{patientInput.age} yrs</span>
          </div>

          <div className="p-2 rounded-lg bg-black/30 border border-white/5">
            <span className="text-[10px] text-slate-400 block">Sex (Required)</span>
            <span className="text-white font-bold">{patientInput.sex}</span>
          </div>

          <div className="p-2 rounded-lg bg-black/30 border border-white/5">
            <span className="text-[10px] text-slate-400 block">BMI</span>
            <span className="text-white font-bold">
              {patientInput.bmi ? `${patientInput.bmi} kg/m²` : 'Not provided'}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-black/30 border border-white/5">
            <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
            <span className="text-white font-bold">
              {patientInput.systolicBP && patientInput.diastolicBP
                ? `${patientInput.systolicBP}/${patientInput.diastolicBP}`
                : patientInput.systolicBP
                ? `${patientInput.systolicBP}/--`
                : 'Not provided'}{' '}
              {patientInput.systolicBP && <span className="text-[9px] text-slate-400 font-normal">mmHg</span>}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-black/30 border border-white/5">
            <span className="text-[10px] text-slate-400 block">Resting HR</span>
            <span className="text-white font-bold">
              {patientInput.restingHeartRate ? `${patientInput.restingHeartRate} bpm` : 'Not provided'}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-black/30 border border-white/5">
            <span className="text-[10px] text-slate-400 block">Cholesterol</span>
            <span className="text-white font-bold">
              {patientInput.cholesterol ? `${patientInput.cholesterol} mg/dL` : 'Not provided'}
            </span>
          </div>
        </div>

        {/* Narrative Section with Token-level Occlusion Attribution & Voice Dictation */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs space-y-2">
          {/* Narrative Card Header */}
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase font-bold">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3 h-3" />
              <span>Symptom Narrative</span>
            </span>

            <div className="flex items-center gap-1.5">
              {/* Language Selector for Voice */}
              <div className="flex rounded bg-black/60 border border-white/10 p-0.5 text-[9px]">
                {(Object.keys(VOICE_LANG_LABELS) as VoiceLang[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setVoiceLang(code)}
                    className={`px-1.5 py-0.2 rounded transition-all ${
                      voiceLang === code
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {VOICE_LANG_LABELS[code]}
                  </button>
                ))}
              </div>

              {/* Mic Dictation Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-1 rounded transition-all border ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : 'bg-white/5 hover:bg-white/10 text-cyan-300 border-white/10'
                }`}
                title={isListening ? 'Stop listening' : `Dictate symptoms in ${VOICE_LANG_LABELS[voiceLang]}`}
              >
                {isListening ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-cyan-400" />}
              </button>

              {/* Edit text toggle */}
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`p-1 rounded transition-all border ${
                  isEditing
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
                }`}
                title={isEditing ? 'View attribution' : 'Edit narrative text'}
              >
                <Edit3 className="w-3 h-3" />
              </button>

              {narrativeOverride !== null && (
                <button
                  type="button"
                  onClick={handleResetNarrative}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10"
                  title="Reset narrative to baseline"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Voice status banner */}
          {isListening && (
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[10px] text-rose-200 flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Listening in {VOICE_LANG_LABELS[voiceLang]}… Speak your symptoms clearly.</span>
            </div>
          )}

          {isTranslating && (
            <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-[10px] text-violet-200 flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin text-violet-400" />
              <span>Translating voice transcript into clinical English for model scoring…</span>
            </div>
          )}

          {voiceError && (
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300">
              {voiceError}
            </div>
          )}

          {originalVoiceText && (
            <div className="p-1.5 rounded-lg bg-black/50 border border-white/10 text-[10px] space-y-0.5">
              <span className="text-slate-500 block uppercase">Original Transcript ({VOICE_LANG_LABELS[voiceLang]}):</span>
              <p className="text-slate-300 italic">"{originalVoiceText}"</p>
            </div>
          )}

          {/* Editable Textarea OR Interactive Token Occlusion View */}
          {isEditing ? (
            <div className="space-y-1.5">
              <textarea
                value={effectiveNarrative}
                onChange={(e) => setNarrativeOverride(e.target.value)}
                placeholder="Enter patient narrative (e.g., substernal exertional pressure radiating to jaw, no prior CAD)..."
                rows={3}
                className="w-full p-2 rounded-lg bg-black/60 border border-cyan-500/30 text-xs text-white font-sans focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 resize-none"
              />
              <div className="flex items-center justify-between text-[9px] text-slate-400">
                <span>Directly affects text modality score and token attribution</span>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                >
                  Done Editing
                </button>
              </div>
            </div>
          ) : effectiveNarrative ? (
            <div className="space-y-2">
              <div className="text-[11px] leading-relaxed font-sans p-2 rounded-lg bg-black/50 border border-white/5">
                {tokenAttributions.map((tok, idx) => {
                  if (tok.impact === 'positive') {
                    return (
                      <span
                        key={idx}
                        className="bg-cyan-500/25 text-cyan-200 font-semibold px-1 py-0.5 rounded border-b border-cyan-400 cursor-help transition-colors hover:bg-cyan-500/40"
                        title={`Token attribution: +${tok.delta}% score for ${selectedVessel}`}
                      >
                        {tok.text}
                      </span>
                    );
                  }
                  if (tok.impact === 'negative') {
                    return (
                      <span
                        key={idx}
                        className="bg-emerald-500/25 text-emerald-200 font-semibold px-1 py-0.5 rounded border-b border-emerald-400 cursor-help transition-colors hover:bg-emerald-500/40"
                        title={`Token attribution: ${tok.delta}% score (protective factor)`}
                      >
                        {tok.text}
                      </span>
                    );
                  }
                  return <span key={idx} className="text-slate-300">{tok.text}</span>;
                })}
              </div>

              {/* Attribution Legend */}
              <div className="flex flex-wrap items-center justify-between text-[9px] font-mono gap-1 text-slate-400">
                <span className="text-cyan-400 font-bold">Occlusion Attribution:</span>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300">■ Elevates score</span>
                  <span className="text-emerald-300">■ Protective</span>
                  <span className="text-slate-500">■ Neutral</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">
              No symptom narrative entered by user.
            </p>
          )}
        </div>

        {/* Non-validated user input notice */}
        <div className="mt-3 p-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span>User-entered evidence • Not clinically verified</span>
        </div>
      </GlassCard>

      {/* 2. ECG Signal & Analysis Waveform Card */}
      <GlassCard borderVariant="subtle" padding="md">
        <ECGChart />
      </GlassCard>
    </div>
  );
};
