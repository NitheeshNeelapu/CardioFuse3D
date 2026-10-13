import React, { useState } from 'react';
import { Volume2, VolumeX, Globe, Sparkles, UserCheck, Stethoscope, AlertCircle, Loader2 } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { useAppStore } from '../../state/useAppStore';
import { callLlm } from '../../api/llm';

type LangCode = 'English' | 'Hindi' | 'Telugu';

const LANG_CONFIG: Record<LangCode, { label: string; speechCode: string }> = {
  English: { label: 'English', speechCode: 'en-IN' },
  Hindi: { label: 'हिन्दी (Hindi)', speechCode: 'hi-IN' },
  Telugu: { label: 'తెలుగు (Telugu)', speechCode: 'te-IN' },
};

export const PatientSummaryPanel: React.FC = () => {
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const prediction = useAppStore((s) => s.prediction);
  const modalities = useAppStore((s) => s.modalities);

  const [language, setLanguage] = useState<LangCode>('English');
  const [isLoading, setIsLoading] = useState(false);
  const [patientText, setPatientText] = useState<string | null>(null);
  const [clinicianText, setClinicianText] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  const currentScore = prediction?.vesselPredictions?.[selectedVessel]?.demoScore ?? 25;

  const getFallbackText = (lang: LangCode, vessel: string, score: number) => {
    switch (lang) {
      case 'Hindi':
        return {
          patient: `आपके द्वारा दर्ज किए गए नैदानिक परीक्षणों के आधार पर, अनुसंधान मॉडल ने ${vessel} क्षेत्र के लिए ${score}% का प्रदर्शन अनुमान लगाया है। यह केवल एक कंप्यूटर मॉडल स्कोर है और हृदय रोग का निदान नहीं है। कृपया अपने स्वास्थ्य और लक्षणों के बारे में अपने डॉक्टर से परामर्श करें।`,
          clinician: `Multimodal heuristic scores indicate ${score}% exploratory output for ${vessel} territory. No diagnostic blockage or stenosis is clinically established; physician review is required.`,
        };
      case 'Telugu':
        return {
          patient: `మీరు నమోదు చేసిన క్లినికల్ పరీక్షల ఆధారంగా, పరిశోధనా నమూనా ${vessel} ప్రాంతానికి ${score}% ప్రదర్శన అంచనాను లెక్కించింది. ఇది కేవలం కంప్యూటర్ మోడల్ స్కోర్ మాత్రమే, గుండె జబ్బు నిర్ధారణ కాదు. దయచేసి మీ ఆరోగ్యం మరియు లక్షణాల గురించి మీ వైద్యుడిని సంప్రదించండి.`,
          clinician: `Multimodal heuristic scores indicate ${score}% exploratory output for ${vessel} territory. No diagnostic blockage or stenosis is clinically established; physician review is required.`,
        };
      case 'English':
      default:
        return {
          patient: `Based on your entered clinical measurements and evidence, the research demonstration model calculated a score of ${score}% for the ${vessel} region. This is a computer model output and NOT a diagnosis of coronary artery disease. Please speak with your doctor or healthcare professional about what this means for you.`,
          clinician: `Multimodal heuristic scores indicate ${score}% exploratory output for ${vessel} territory under current active modalities. No diagnostic blockage or stenosis is clinically established; physician review is required.`,
        };
    }
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    stopSpeech();

    const probs = {
      LAD: prediction?.vesselPredictions?.LAD?.demoScore ?? 0,
      LCX: prediction?.vesselPredictions?.LCX?.demoScore ?? 0,
      RCA: prediction?.vesselPredictions?.RCA?.demoScore ?? 0,
    };

    try {
      const response = await callLlm<{ patientExplanation: string; clinicianSummary: string }>(
        'patient_summary',
        {
          language,
          selectedVessel,
          probabilities: probs,
          activeModalities: modalities,
        }
      );

      if (response && response.patientExplanation) {
        setPatientText(response.patientExplanation);
        setClinicianText(response.clinicianSummary || null);
        setIsFallback(false);
      } else {
        const fb = getFallbackText(language, selectedVessel, currentScore);
        setPatientText(fb.patient);
        setClinicianText(fb.clinician);
        setIsFallback(true);
      }
    } catch {
      const fb = getFallbackText(language, selectedVessel, currentScore);
      setPatientText(fb.patient);
      setClinicianText(fb.clinician);
      setIsFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = () => {
    if (!patientText || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(patientText);
    utterance.lang = LANG_CONFIG[language].speechCode;
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return (
    <GlassCard borderVariant="subtle" padding="md" className="space-y-3 select-none font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Patient Explanation & Multilingual Voice
          </h3>
        </div>

        {/* Language Select */}
        <div className="flex items-center gap-1.5 text-xs">
          {(Object.keys(LANG_CONFIG) as LangCode[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLanguage(l);
                stopSpeech();
              }}
              className={`px-2 py-0.5 rounded text-[10px] transition-all border ${
                language === l
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                  : 'bg-black/30 text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              {LANG_CONFIG[l].label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
        Translates complex cardiovascular evidence estimates into clear, accessible language (approx. 6th-grade reading level) for shared decision-making.
      </p>

      {/* Action Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="flex-1 py-2 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 border border-cyan-500/30 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>TRANSLATING EXPLANATION…</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>EXPLAIN TO PATIENT ({language.toUpperCase()})</span>
            </>
          )}
        </button>

        {patientText && speechSupported && (
          <button
            type="button"
            onClick={isSpeaking ? stopSpeech : speakText}
            className={`py-2 px-3 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
              isSpeaking
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
            }`}
            title={isSpeaking ? 'Stop speech' : 'Read aloud in selected language'}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Read aloud</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Generated Content Box */}
      {patientText && (
        <div className="space-y-3 pt-2 border-t border-white/5 animate-fadeIn">
          {/* Patient Facing Section */}
          <div className="p-3.5 rounded-xl bg-black/50 border border-cyan-500/20 space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5 uppercase">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Patient-Facing Explanation ({language})</span>
              </span>
              {isFallback && (
                <span className="text-amber-300 text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                  DETERMINISTIC TEMPLATE
                </span>
              )}
            </div>

            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              "{patientText}"
            </p>
          </div>

          {/* Clinician Briefing Section */}
          {clinicianText && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-bold">
                <Stethoscope className="w-3 h-3 text-violet-400" />
                <span>Clinician Briefing (English)</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {clinicianText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Note */}
      <div className="text-[9px] text-slate-400 font-sans italic pt-1 border-t border-white/5">
        Research prototype • not medical advice • no prescription or treatment instructions provided.
      </div>
    </GlassCard>
  );
};
