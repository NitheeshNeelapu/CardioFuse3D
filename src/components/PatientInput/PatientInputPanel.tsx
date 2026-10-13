import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../state/useAppStore';
import { PatientInput, SexOption, ECGPattern } from '../../types/patient';
import { ClinicalDataForm } from './ClinicalDataForm';
import { ECGInputForm } from './ECGInputForm';
import { SymptomNarrativeForm } from './SymptomNarrativeForm';
import { validatePatientInput, ValidationErrors } from './InputValidation';
import { X, AlertTriangle, Play, Database, Activity, FileText, CheckCircle2 } from 'lucide-react';

export const PatientInputPanel: React.FC = () => {
  const isInputOpen = useAppStore((s) => s.isInputOpen);
  const isEditMode = useAppStore((s) => s.isEditMode);
  const closeInputPanel = useAppStore((s) => s.closeInputPanel);
  const patientInput = useAppStore((s) => s.patientInput);
  const runAnalysisPipeline = useAppStore((s) => s.runAnalysisPipeline);

  // Tabs: 'clinical' | 'ecg' | 'symptoms'
  const [activeTab, setActiveTab] = useState<'clinical' | 'ecg' | 'symptoms'>('clinical');

  // Form State
  const [age, setAge] = useState<number | string>('');
  const [sex, setSex] = useState<SexOption>('Male');
  const [systolicBP, setSystolicBP] = useState<number | string>('');
  const [diastolicBP, setDiastolicBP] = useState<number | string>('');
  const [cholesterol, setCholesterol] = useState<number | string>('');
  const [restingHeartRate, setRestingHeartRate] = useState<number | string>('');
  const [bmi, setBmi] = useState<number | string>('');

  // ECG State
  const [ecgAvailable, setEcgAvailable] = useState<boolean>(true);
  const [selectedPattern, setSelectedPattern] = useState<ECGPattern>('Normal Sinus Rhythm');
  const [leadNotes, setLeadNotes] = useState<string>('');

  // Symptom State
  const [narrativeText, setNarrativeText] = useState<string>('');

  // Validation
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Populate when opening in edit mode or when current input exists
  useEffect(() => {
    if (patientInput) {
      setAge(patientInput.age || '');
      setSex(patientInput.sex || 'Male');
      setSystolicBP(patientInput.systolicBP || '');
      setDiastolicBP(patientInput.diastolicBP || '');
      setCholesterol(patientInput.cholesterol || '');
      setRestingHeartRate(patientInput.restingHeartRate || '');
      setBmi(patientInput.bmi || '');
      setEcgAvailable(patientInput.ecg ? patientInput.ecg.available : true);
      setSelectedPattern(patientInput.ecg?.pattern || 'Normal Sinus Rhythm');
      setLeadNotes(patientInput.ecg?.leadNotes || '');
      setNarrativeText(patientInput.symptoms?.narrativeText || '');
    } else {
      // Clean slate default (no fake patient!)
      setAge('');
      setSex('Male');
      setSystolicBP('');
      setDiastolicBP('');
      setCholesterol('');
      setRestingHeartRate('');
      setBmi('');
      setEcgAvailable(true);
      setSelectedPattern('Normal Sinus Rhythm');
      setLeadNotes('');
      setNarrativeText('');
    }
    setErrors({});
  }, [isInputOpen, patientInput]);

  if (!isInputOpen) return null;

  const handleApplyPreset = (preset: {
    age: number;
    sex: SexOption;
    systolicBP: number;
    diastolicBP: number;
    cholesterol: number;
    restingHeartRate: number;
    bmi: number;
  }) => {
    setAge(preset.age);
    setSex(preset.sex);
    setSystolicBP(preset.systolicBP);
    setDiastolicBP(preset.diastolicBP);
    setCholesterol(preset.cholesterol);
    setRestingHeartRate(preset.restingHeartRate);
    setBmi(preset.bmi);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const candidate: Partial<PatientInput> = {
      patientId: patientInput?.patientId || `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      age: age === '' ? undefined : Number(age),
      sex,
      systolicBP: systolicBP === '' ? undefined : Number(systolicBP),
      diastolicBP: diastolicBP === '' ? undefined : Number(diastolicBP),
      cholesterol: cholesterol === '' ? undefined : Number(cholesterol),
      restingHeartRate: restingHeartRate === '' ? undefined : Number(restingHeartRate),
      bmi: bmi === '' ? undefined : Number(bmi),
      ecg: {
        available: ecgAvailable,
        pattern: ecgAvailable ? selectedPattern : undefined,
        leadNotes: ecgAvailable ? leadNotes : undefined,
      },
      symptoms: {
        available: Boolean(narrativeText.trim()),
        narrativeText: narrativeText.trim(),
      },
    };

    const validation = validatePatientInput(candidate);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setActiveTab('clinical');
      return;
    }

    const fullInput: PatientInput = {
      patientId: candidate.patientId!,
      age: candidate.age!,
      sex: candidate.sex!,
      systolicBP: candidate.systolicBP,
      diastolicBP: candidate.diastolicBP,
      cholesterol: candidate.cholesterol,
      restingHeartRate: candidate.restingHeartRate,
      bmi: candidate.bmi,
      ecg: candidate.ecg,
      symptoms: candidate.symptoms,
    };

    closeInputPanel();
    runAnalysisPipeline(fullInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl max-h-[92vh] rounded-2xl glass-panel-glow border border-cyan-500/30 overflow-hidden flex flex-col bg-[#08111F]/95 shadow-[0_0_50px_rgba(0,229,255,0.18)]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide font-mono uppercase">
                {isEditMode ? 'Edit Patient & Evidence Data' : 'New Patient Evidence Intake'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Manual Multimodal Data Entry for CARDIOFUSE 3D
              </p>
            </div>
          </div>

          <button
            onClick={closeInputPanel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Notice Before Analysis (Section 7) */}
        <div className="mx-4 sm:mx-5 mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
          <div className="flex items-center gap-2 font-bold mb-0.5 text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>RESEARCH PROTOTYPE — NOT A MEDICAL DEVICE</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            “Model-derived outputs are experimental and must not be interpreted as a diagnosis, prognosis, or treatment recommendation.”
          </p>
        </div>

        {/* 3 Tabs Navigation Bar */}
        <div className="px-4 sm:px-5 pt-3 border-b border-white/10 flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('clinical')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 font-bold transition-all ${
              activeTab === 'clinical'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>1. CLINICAL DATA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ecg')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 font-bold transition-all ${
              activeTab === 'ecg'
                ? 'border-violet-400 text-violet-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>2. ECG SIGNAL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('symptoms')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 font-bold transition-all ${
              activeTab === 'symptoms'
                ? 'border-pink-400 text-pink-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>3. SYMPTOM NARRATIVE</span>
          </button>
        </div>

        {/* Tab Form Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 pr-2">
          {activeTab === 'clinical' && (
            <ClinicalDataForm
              age={age}
              setAge={setAge}
              sex={sex}
              setSex={setSex}
              systolicBP={systolicBP}
              setSystolicBP={setSystolicBP}
              diastolicBP={diastolicBP}
              setDiastolicBP={setDiastolicBP}
              cholesterol={cholesterol}
              setCholesterol={setCholesterol}
              restingHeartRate={restingHeartRate}
              setRestingHeartRate={setRestingHeartRate}
              bmi={bmi}
              setBmi={setBmi}
              errors={errors}
              onApplyPreset={handleApplyPreset}
            />
          )}

          {activeTab === 'ecg' && (
            <ECGInputForm
              ecgAvailable={ecgAvailable}
              setEcgAvailable={setEcgAvailable}
              selectedPattern={selectedPattern}
              setSelectedPattern={setSelectedPattern}
              leadNotes={leadNotes}
              setLeadNotes={setLeadNotes}
            />
          )}

          {activeTab === 'symptoms' && (
            <SymptomNarrativeForm
              narrativeText={narrativeText}
              setNarrativeText={setNarrativeText}
              onInsertSample={(text) => setNarrativeText(text)}
            />
          )}
        </div>

        {/* Form Actions Footer (Section 6) */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between bg-black/40">
          <button
            type="button"
            onClick={closeInputPanel}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs font-bold transition-colors"
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-extrabold tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isEditMode ? 'APPLY & RE-ANALYZE' : 'APPLY & ANALYZE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
