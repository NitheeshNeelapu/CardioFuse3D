import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Database,
  ShieldAlert,
  Cpu,
  AlertCircle,
  FileText,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { useAppStore } from '../../state/useAppStore';

export const ProvenanceModal: React.FC = () => {
  const isProvenanceOpen = useAppStore((s) => s.isProvenanceOpen);
  const setIsProvenanceOpen = useAppStore((s) => s.setIsProvenanceOpen);
  const prediction = useAppStore((s) => s.prediction);
  const patientInput = useAppStore((s) => s.patientInput);
  const activeModalities = useAppStore((s) => s.activeModalities);

  // Dynamic provenance resolution
  const prov = prediction?.provenance;
  const executionMode = prov?.executionMode ?? 'Mock/Demo';
  const predictionModel = prov?.predictionModel ?? 'Not connected';
  const clinicalValidation = prov?.clinicalValidation ?? 'Not performed';
  
  const inputSource = prov?.inputSource ?? (patientInput ? 'User-entered' : 'Not submitted');
  
  const ecgSource = prov?.ecgSource ?? (
    patientInput?.ecg?.available
      ? 'Synthetic visualization'
      : 'Patient recording: Not provided'
  );

  const missingModalities = prov?.missingModalities ?? (
    Object.entries(activeModalities)
      .filter(([_, active]) => !active)
      .map(([name]) => name.toUpperCase())
  );

  const missingOptionalFields = prov?.missingOptionalFields ?? [];

  return (
    <Modal
      isOpen={isProvenanceOpen}
      onClose={() => setIsProvenanceOpen(false)}
      title="Model & Data Provenance"
      subtitle="Execution Lineage, Model Connectivity & Clinical Safety Disclosures"
      icon={<Database className="w-4 h-4 text-cyan-400" />}
      maxWidth="3xl"
    >
      <div className="space-y-4 text-xs font-sans max-h-[75vh] overflow-y-auto pr-1">
        {/* Persistent Safety Notice */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>RESEARCH PROTOTYPE • NOT A MEDICAL DEVICE • NOT CLINICALLY VALIDATED</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            CARDIOFUSE 3D is an investigational student hackathon research prototype designed exclusively to demonstrate evidence-to-anatomy multimodal machine learning architectures. Model-derived outputs are synthetic demonstration scores and must NOT be used for clinical decisions, triage, diagnosis, or patient management.
          </p>
        </div>

        {/* Dynamic Live Provenance Status Card */}
        <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/30 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                Active Runtime Provenance
              </span>
            </div>
            <Badge variant="amber">RESEARCH PROTOTYPE</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 1. Execution Mode */}
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block">1. Execution Mode</span>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">{executionMode}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DEMO MODE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Running in mock demonstration mode. All inference functions execute deterministic heuristic demo algorithms.
              </p>
            </div>

            {/* 2. Prediction Model */}
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block">2. Prediction Model</span>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">{predictionModel}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300 border border-red-500/30">
                  NOT CONNECTED
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                No trained neural network is connected. The system uses a weighted multimodal scorer (clinical + ECG + text + ECG photo) with a tool-using LLM agent for explanation, translation and extraction. The LLM never computes risk.
              </p>
            </div>

            {/* 3. Clinical Validation */}
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block">3. Clinical Validation</span>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">{clinicalValidation}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300 border border-red-500/30">
                  NOT PERFORMED
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Zero prospective clinical trials, randomized evaluations, or clearance by FDA/CE/regulatory bodies have been performed.
              </p>
            </div>

            {/* 4. Input Source */}
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block">4. Patient Input Source</span>
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold">{inputSource}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {patientInput ? 'MANUAL INTAKE' : 'AWAITING INTAKE'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                {patientInput
                  ? `Entered manually during this session (${patientInput.age}y ${patientInput.sex}${patientInput.systolicBP && patientInput.diastolicBP ? `, BP ${patientInput.systolicBP}/${patientInput.diastolicBP}` : ''}).`
                  : 'No patient data has been entered. Dashboard opened with empty welcome state.'}
              </p>
            </div>

            {/* 5. ECG Source */}
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block">5. ECG Waveform Source</span>
              <div className="flex items-center justify-between">
                <span className="text-violet-300 font-bold">{ecgSource}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  VISUALIZATION ONLY
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                {patientInput?.ecg?.available
                  ? 'Demonstration waveform pattern selected for interface testing. Does NOT establish patient electrophysiology or normal sinus rhythm.'
                  : 'Patient ECG: Not provided. Waveforms are omitted to prevent synthetic patient substitution.'}
              </p>
            </div>

            {/* 6. Missing Modalities & Optional Fields */}
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block">6. Missing Modalities & Fields</span>
              <div className="space-y-1">
                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-400">Modalities omitted: </span>
                  {missingModalities.length > 0 ? (
                    <span className="text-amber-400 font-bold">{missingModalities.join(', ')}</span>
                  ) : (
                    <span className="text-emerald-400">None (all 3 active)</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">
                  <span className="text-slate-500">Unsupplied optional fields: </span>
                  {missingOptionalFields.length > 0 ? (
                    <span className="text-amber-300/80">{missingOptionalFields.join(', ')}</span>
                  ) : (
                    <span>All optional fields provided or analysis pending</span>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Missing modalities are dynamically masked rather than filled with fabricated values.
              </p>
            </div>

            {/* 7. Numerical Output Format */}
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block">7. Numerical Output Specification</span>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Synthetic demonstration score</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  0–100 DEMO SCALE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Scores on this 0–100 demo scale are computed by a transparent rule-based demo scorer for testing UI responsiveness and evidence-to-anatomy links. They do NOT represent probability of coronary artery disease, stenosis percentage, or lesion risk.
              </p>
            </div>

            {/* 8. Limitations */}
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block">8. Operational Limitations</span>
              <div className="flex items-center justify-between">
                <span className="text-rose-300 font-bold">Software Prototype Only</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  NON-CLINICAL
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Demonstration prototype only. No trained cardiovascular prediction model connected. Outputs must not be used for clinical decision-making or diagnostic triage.
              </p>
            </div>
          </div>
        </div>

        {/* 6 Core Architectural Dimensions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
          {/* DATA */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Architectural Data Pipeline</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-xs">Separate User Data & Demo Logic</span>
              <Badge variant="cyan">SEPARATED</Badge>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              User-entered values are strictly preserved without silent defaults. Missing values are flagged as "Not provided" rather than substituted.
            </p>
          </div>

          {/* MODEL ARCHITECTURE */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Target Model Architecture</span>
            <span className="text-white font-bold text-xs">Multimodal Late Fusion (Planned)</span>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Target design: Cross-attention fusion aggregating tabular embeddings, 1D ResNet waveform vectors, and clinical NLP tokens. Currently running a transparent rule-based demo scorer (not a trained model).
            </p>
          </div>

          {/* EVALUATION STATUS */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Evaluation Status</span>
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-bold text-xs">Evaluation Pending</span>
              <Badge variant="amber">PENDING</Badge>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              No ROC-AUC, sensitivity, specificity, or test-set accuracy metrics are claimed or fabricated. Evaluation is pending multi-center benchmark verification.
            </p>
          </div>

          {/* MODALITY AGREEMENT STATUS */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Modality Agreement Status</span>
            <span className="text-amber-300 font-bold text-xs">Not calculated — demo mode</span>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Consensus metrics require trained multi-head outputs. In demo mode, agreement calculation is disabled.
            </p>
          </div>
        </div>

        {/* Target Anatomical Supply Beds */}
        <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 font-mono space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase">
            <span>Synchronized Anatomical Supply Beds</span>
            <span className="text-cyan-400">Coronary Projections</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-white/[0.02] border border-cyan-500/20">
              <span className="text-cyan-300 font-bold block">LAD</span>
              <span className="text-[10px] text-slate-400 block">Ant. Descending</span>
            </div>
            <div className="p-2 rounded bg-white/[0.02] border border-violet-500/20">
              <span className="text-violet-300 font-bold block">LCX</span>
              <span className="text-[10px] text-slate-400 block">Circumflex</span>
            </div>
            <div className="p-2 rounded bg-white/[0.02] border border-pink-500/20">
              <span className="text-pink-300 font-bold block">RCA</span>
              <span className="text-[10px] text-slate-400 block">Right Coronary</span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">
            Build: CARDIOFUSE-3D-v0.2-RESEARCH (MOCK/DEMO MODE)
          </span>
          <button
            onClick={() => setIsProvenanceOpen(false)}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold transition-all"
          >
            ACKNOWLEDGE & CLOSE
          </button>
        </div>
      </div>
    </Modal>
  );
};

