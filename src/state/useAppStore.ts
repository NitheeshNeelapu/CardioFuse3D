import { create } from 'zustand';
import { Vessel } from '../types/vessel';
import { Modality, ModalityState } from '../types/modality';
import { Patient, PatientInput, ECGMetrics } from '../types/patient';
import { PredictionResult, VesselEvidence } from '../types/model';
import { apiClient } from '../api/client';
import { PIPELINE_STAGES } from '../data/pipelineStages';
import { GeminiExplanationResponse } from '../api/types';
import { demoPatient01, DEMO_PATIENTS } from '../data/demoPatient';
import { computeDemoPrediction, getDemoVesselEvidence } from '../data/demoPredictions';

export type AnalysisStatus = 'idle' | 'input' | 'analyzing' | 'complete' | 'error';

// Module-level sequence counter to eliminate race conditions
let requestSeq = 0;

export interface AppState {
  // Navigation & Modals
  activeTab: 'dashboard' | 'architecture' | 'evaluation' | 'about';
  setActiveTab: (tab: 'dashboard' | 'architecture' | 'evaluation' | 'about') => void;
  isProvenanceOpen: boolean;
  setIsProvenanceOpen: (open: boolean) => void;
  isInputOpen: boolean;
  isEditMode: boolean;

  // Patient Selection
  selectedPatientId: string;
  selectedPatient: Patient;
  setPatient: (patientId: string) => Promise<void>;

  // What-If Scenario Overrides
  whatIf: {
    age?: number;
    systolicBp?: number;
    bmi?: number;
    heartRate?: number;
  };
  setWhatIf: (partial: Partial<{ age?: number; systolicBp?: number; bmi?: number; heartRate?: number }>) => void;
  resetWhatIf: () => void;

  // Narrative & ECG Overrides (for Voice & Photo extraction)
  narrativeOverride: string | null;
  setNarrativeOverride: (text: string | null) => void;
  ecgOverride: Partial<ECGMetrics> | null;
  setEcgOverride: (override: Partial<ECGMetrics> | null) => void;

  getEffectivePatient: () => Patient;

  // Analysis Lifecycle & Data
  analysisStatus: AnalysisStatus;
  pipelineStep: number;
  patientInput: PatientInput | null;
  selectedVessel: Vessel;
  activeModalities: ModalityState;
  modalities: ModalityState; // alias for compatibility
  prediction: PredictionResult | null;
  evidence: VesselEvidence | null;
  error: string | null;

  // 3D Controls
  autoRotate: boolean;
  setAutoRotate: (val: boolean) => void;
  resetCameraTrigger: number;
  triggerResetCamera: () => void;
  zoomInTrigger: number;
  triggerZoomIn: () => void;
  zoomOutTrigger: number;
  triggerZoomOut: () => void;
  focusVesselTrigger: Vessel | null;
  triggerFocusVessel: (vessel: Vessel) => void;

  // Testing & Error Injection
  simulateApiFailure: boolean;
  setSimulateApiFailure: (val: boolean) => void;

  // Actions
  setSelectedVessel: (vessel: Vessel) => Promise<void>;
  toggleModality: (modality: Modality) => Promise<void>;
  setPatientInput: (input: PatientInput) => void;
  setPrediction: (result: PredictionResult | null) => void;
  resetAnalysis: () => void;
  openInputPanel: (isEdit?: boolean) => void;
  closeInputPanel: () => void;
  runAnalysisPipeline: (input: PatientInput) => Promise<void>;
  rerunFusionModel: () => Promise<void>;
  refreshAnalysis: () => Promise<void>;
  retryAnalysis: () => Promise<void>;
  setError: (err: string | null) => void;

  geminiExplanation: GeminiExplanationResponse | null;
  geminiExplanationLoading: boolean;
  geminiExplanationError: string | null;
  requestGeminiExplanation: () => Promise<void>;
}

const initialModalities: ModalityState = {
  clinical: true,
  ecg: true,
  symptoms: true,
};

const initialPatient = demoPatient01;
const initialPatientInput: PatientInput = {
  patientId: initialPatient.id,
  name: initialPatient.name,
  age: initialPatient.age,
  sex: initialPatient.sex,
  systolicBP: initialPatient.vitals.bloodPressureSys,
  diastolicBP: initialPatient.vitals.bloodPressureDia,
  restingHeartRate: initialPatient.vitals.heartRate,
  bmi: initialPatient.bmi,
  ecg: {
    available: true,
    pattern: initialPatient.ecg.rhythm as any,
    leadNotes: initialPatient.ecg.leadNotes,
  },
  symptoms: {
    available: true,
    narrativeText: initialPatient.clinicalNarrative,
  },
};

const initialPrediction = computeDemoPrediction('LAD', initialModalities, initialPatient);
const initialEvidence = getDemoVesselEvidence('LAD', initialModalities, initialPatient);

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isProvenanceOpen: false,
  setIsProvenanceOpen: (open) => set({ isProvenanceOpen: open }),
  isInputOpen: false,
  isEditMode: false,

  selectedPatientId: 'DEMO-00482',
  selectedPatient: initialPatient,

  whatIf: {},
  narrativeOverride: null,
  ecgOverride: null,

  getEffectivePatient: () => {
    const { selectedPatient, whatIf, narrativeOverride, ecgOverride } = get();
    if (!selectedPatient) return demoPatient01;
    const effective: Patient = {
      ...selectedPatient,
      age: whatIf.age !== undefined ? whatIf.age : selectedPatient.age,
      bmi: whatIf.bmi !== undefined ? whatIf.bmi : selectedPatient.bmi,
      clinicalNarrative:
        narrativeOverride !== null && narrativeOverride !== undefined
          ? narrativeOverride
          : selectedPatient.clinicalNarrative,
      vitals: {
        ...selectedPatient.vitals,
        bloodPressureSys:
          whatIf.systolicBp !== undefined
            ? whatIf.systolicBp
            : selectedPatient.vitals.bloodPressureSys,
        heartRate:
          whatIf.heartRate !== undefined
            ? whatIf.heartRate
            : selectedPatient.vitals.heartRate,
      },
      ecg: {
        ...selectedPatient.ecg,
        ...(ecgOverride || {}),
      },
    };
    return effective;
  },

  setWhatIf: (partial) => {
    const nextWhatIf = { ...get().whatIf, ...partial };
    set({ whatIf: nextWhatIf });

    // Synchronously recompute predictions without network delay for instant slider response
    const effPatient = get().getEffectivePatient();
    const { selectedVessel, modalities } = get();
    const pred = computeDemoPrediction(selectedVessel, modalities, effPatient);
    const ev = getDemoVesselEvidence(selectedVessel, modalities, effPatient);
    set({ prediction: pred, evidence: ev, analysisStatus: 'complete' });
  },

  resetWhatIf: () => {
    set({ whatIf: {} });
    const effPatient = get().getEffectivePatient();
    const { selectedVessel, modalities } = get();
    const pred = computeDemoPrediction(selectedVessel, modalities, effPatient);
    const ev = getDemoVesselEvidence(selectedVessel, modalities, effPatient);
    set({ prediction: pred, evidence: ev, analysisStatus: 'complete' });
  },

  setNarrativeOverride: (text) => {
    set({ narrativeOverride: text });
    const effPatient = get().getEffectivePatient();
    const { selectedVessel, modalities } = get();
    const pred = computeDemoPrediction(selectedVessel, modalities, effPatient);
    const ev = getDemoVesselEvidence(selectedVessel, modalities, effPatient);
    set({ prediction: pred, evidence: ev });
  },

  setEcgOverride: (override) => {
    set({ ecgOverride: override });
    const effPatient = get().getEffectivePatient();
    const { selectedVessel, modalities } = get();
    const pred = computeDemoPrediction(selectedVessel, modalities, effPatient);
    const ev = getDemoVesselEvidence(selectedVessel, modalities, effPatient);
    set({ prediction: pred, evidence: ev });
  },

  analysisStatus: 'complete',
  pipelineStep: 0,
  patientInput: initialPatientInput,
  selectedVessel: 'LAD',
  activeModalities: initialModalities,
  modalities: initialModalities,
  prediction: initialPrediction,
  evidence: initialEvidence,
  error: null,
  geminiExplanation: null,
  geminiExplanationLoading: false,
  geminiExplanationError: null,

  autoRotate: true,
  setAutoRotate: (val) => set({ autoRotate: val }),
  resetCameraTrigger: 0,
  triggerResetCamera: () =>
    set((state) => ({
      resetCameraTrigger: state.resetCameraTrigger + 1,
      autoRotate: true,
    })),
  zoomInTrigger: 0,
  triggerZoomIn: () => set((state) => ({ zoomInTrigger: state.zoomInTrigger + 1 })),
  zoomOutTrigger: 0,
  triggerZoomOut: () => set((state) => ({ zoomOutTrigger: state.zoomOutTrigger + 1 })),
  focusVesselTrigger: 'LAD',
  triggerFocusVessel: (vessel: Vessel) => {
    get().setSelectedVessel(vessel);
  },

  simulateApiFailure: false,
  setSimulateApiFailure: (val) => {
    apiClient.setSimulateFailure(val);
    set({ simulateApiFailure: val });
  },

  setPatientInput: (input) => set({ patientInput: input }),
  setPrediction: (pred) => set({ prediction: pred }),
  setError: (err) => set({ error: err }),

  openInputPanel: (isEdit = false) => {
    set({ isInputOpen: true, isEditMode: isEdit });
  },

  closeInputPanel: () => {
    set({ isInputOpen: false });
  },

  resetAnalysis: () => {
    set({
      selectedPatientId: 'DEMO-00482',
      selectedPatient: demoPatient01,
      whatIf: {},
      narrativeOverride: null,
      ecgOverride: null,
      patientInput: initialPatientInput,
      selectedVessel: 'LAD',
      activeModalities: initialModalities,
      modalities: initialModalities,
      prediction: initialPrediction,
      evidence: initialEvidence,
      error: null,
      geminiExplanation: null,
      geminiExplanationLoading: false,
      geminiExplanationError: null,
      autoRotate: true,
      analysisStatus: 'complete',
    });
  },

  setPatient: async (patientId: string) => {
    try {
      const patient = await apiClient.getPatient(patientId);
      const adaptedInput: PatientInput = {
        patientId: patient.id,
        name: patient.name,
        age: patient.age,
        sex: patient.sex,
        systolicBP: patient.vitals.bloodPressureSys,
        diastolicBP: patient.vitals.bloodPressureDia,
        restingHeartRate: patient.vitals.heartRate,
        bmi: patient.bmi,
        ecg: {
          available: true,
          pattern: patient.ecg.rhythm as any,
          leadNotes: patient.ecg.leadNotes,
        },
        symptoms: {
          available: true,
          narrativeText: patient.clinicalNarrative,
        },
      };

      set({
        selectedPatient: patient,
        selectedPatientId: patient.id,
        patientInput: adaptedInput,
        whatIf: {},
        narrativeOverride: null,
        ecgOverride: null,
        error: null,
      });

      await get().refreshAnalysis();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to retrieve patient profile.';
      set({ error: message });
    }
  },

  refreshAnalysis: async () => {
    const mine = ++requestSeq;
    const { selectedVessel, modalities } = get();
    const effPatient = get().getEffectivePatient();

    try {
      const [pred, ev] = await Promise.all([
        apiClient.predict(effPatient, selectedVessel, modalities),
        apiClient.getEvidence(effPatient, selectedVessel, modalities),
      ]);

      if (mine !== requestSeq) return;

      set({
        prediction: pred,
        evidence: ev,
        analysisStatus: 'complete',
        error: null,
      });
    } catch (err: unknown) {
      if (mine !== requestSeq) return;
      const message = err instanceof Error ? err.message : 'Unable to generate model output.';
      set({ error: message });
    }
  },

  setSelectedVessel: async (vessel: Vessel) => {
    set({
      selectedVessel: vessel,
      autoRotate: false,
      focusVesselTrigger: vessel,
    });
    await get().refreshAnalysis();
  },

  toggleModality: async (modality: Modality) => {
    const current = get().modalities;
    const nextModalities: ModalityState = {
      ...current,
      [modality]: !current[modality],
    };

    const activeCount = Object.values(nextModalities).filter(Boolean).length;
    if (activeCount === 0) {
      set({ error: 'At least one evidence modality must remain active' });
      return;
    }

    set({
      modalities: nextModalities,
      activeModalities: nextModalities,
      error: null,
    });

    await get().refreshAnalysis();
  },

  runAnalysisPipeline: async (input: PatientInput) => {
    set({
      analysisStatus: 'analyzing',
      patientInput: input,
      pipelineStep: 0,
      error: null,
    });

    try {
      for (let i = 0; i < PIPELINE_STAGES.length; i++) {
        set({ pipelineStep: i });
        await new Promise((res) => setTimeout(res, 180));
      }

      // Convert PatientInput to Patient for consistent store representation
      const currentPatient = get().selectedPatient;
      const updatedPatient: Patient = {
        ...currentPatient,
        id: input.patientId,
        age: input.age,
        sex: input.sex,
        bmi: input.bmi || currentPatient.bmi,
        clinicalNarrative: input.symptoms?.narrativeText || currentPatient.clinicalNarrative,
        vitals: {
          ...currentPatient.vitals,
          bloodPressureSys: input.systolicBP || currentPatient.vitals.bloodPressureSys,
          bloodPressureDia: input.diastolicBP || currentPatient.vitals.bloodPressureDia,
          heartRate: input.restingHeartRate || currentPatient.vitals.heartRate,
        },
        ecg: {
          ...currentPatient.ecg,
          leadNotes: input.ecg?.leadNotes || currentPatient.ecg.leadNotes,
          rhythm: input.ecg?.pattern || currentPatient.ecg.rhythm,
        },
      };

      set({ selectedPatient: updatedPatient, selectedPatientId: updatedPatient.id });
      await get().refreshAnalysis();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to generate model output.';
      set({ error: message, analysisStatus: 'error' });
    }
  },

  rerunFusionModel: async () => {
    await get().refreshAnalysis();
  },

  retryAnalysis: async () => {
    if (get().simulateApiFailure) {
      get().setSimulateApiFailure(false);
    }
    await get().refreshAnalysis();
  },

  requestGeminiExplanation: async () => {
    const { patientInput, selectedVessel, activeModalities } = get();

    if (!patientInput) {
      set({
        geminiExplanation: null,
        geminiExplanationError: 'Enter patient data before requesting an explanation.',
      });
      return;
    }

    set({
      geminiExplanationLoading: true,
      geminiExplanationError: null,
      geminiExplanation: null,
    });

    try {
      const result = await apiClient.getGeminiExplanation(
        patientInput,
        selectedVessel,
        activeModalities
      );

      set({
        geminiExplanation: result,
        geminiExplanationError: null,
      });
    } catch (err: unknown) {
      set({
        geminiExplanation: null,
        geminiExplanationError:
          err instanceof Error ? err.message : 'Unable to retrieve the Gemini explanation.',
      });
    } finally {
      set({ geminiExplanationLoading: false });
    }
  },
}));
