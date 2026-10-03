import { create } from 'zustand';
import { Vessel } from '../types/vessel';
import { Modality, ModalityState } from '../types/modality';
import { Patient } from '../types/patient';
import { PredictionResult, VesselEvidence } from '../types/model';
import { apiClient } from '../api/client';
import { demoPatient01 } from '../data/demoPatient';
import { computeDemoPrediction, getDemoVesselEvidence } from '../data/demoPredictions';

export interface AppState {
  // Navigation & modals
  activeTab: 'dashboard' | 'architecture' | 'evaluation' | 'about';
  setActiveTab: (tab: 'dashboard' | 'architecture' | 'evaluation' | 'about') => void;
  isProvenanceOpen: boolean;
  setIsProvenanceOpen: (open: boolean) => void;

  // Patient & Demo Mode
  selectedPatientId: string;
  selectedPatient: Patient;
  isDemoData: boolean;
  setDemoMode: (val: boolean) => void;
  setPatient: (patientId: string) => Promise<void>;

  // Selected Anatomy & Modalities
  selectedVessel: Vessel;
  modalities: ModalityState;

  // Model Results & Evidence
  prediction: PredictionResult | null;
  evidence: VesselEvidence | null;
  isLoading: boolean;
  loadingMessage: string;
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

  // Error simulation for Test 8
  simulateApiFailure: boolean;
  setSimulateApiFailure: (val: boolean) => void;

  // Actions
  setSelectedVessel: (vessel: Vessel) => void;
  toggleModality: (modality: Modality) => void;
  setPrediction: (pred: PredictionResult | null) => void;
  setLoading: (loading: boolean, msg?: string) => void;
  setError: (err: string | null) => void;
  refreshAnalysis: () => Promise<void>;
  retryAnalysis: () => Promise<void>;
}

// Initial default state
const initialModalities: ModalityState = {
  clinical: true,
  ecg: true,
  text: true,
};

const initialPrediction = computeDemoPrediction('LAD', initialModalities, 'DEMO-00482');
const initialEvidence = getDemoVesselEvidence('LAD', initialModalities);

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isProvenanceOpen: false,
  setIsProvenanceOpen: (open) => set({ isProvenanceOpen: open }),

  selectedPatientId: 'DEMO-00482',
  selectedPatient: demoPatient01,
  isDemoData: true,
  setDemoMode: (val) => set({ isDemoData: val }),

  selectedVessel: 'LAD',
  modalities: initialModalities,

  prediction: initialPrediction,
  evidence: initialEvidence,
  isLoading: false,
  loadingMessage: 'Analyzing evidence...',
  error: null,

  autoRotate: true,
  setAutoRotate: (val) => set({ autoRotate: val }),
  resetCameraTrigger: 0,
  triggerResetCamera: () =>
    set((state) => ({
      resetCameraTrigger: state.resetCameraTrigger + 1,
      autoRotate: true,
    })),
  zoomInTrigger: 0,
  triggerZoomIn: () =>
    set((state) => ({
      zoomInTrigger: state.zoomInTrigger + 1,
    })),
  zoomOutTrigger: 0,
  triggerZoomOut: () =>
    set((state) => ({
      zoomOutTrigger: state.zoomOutTrigger + 1,
    })),
  focusVesselTrigger: 'LAD',
  triggerFocusVessel: (vessel: Vessel) => {
    get().setSelectedVessel(vessel);
  },

  simulateApiFailure: false,
  setSimulateApiFailure: (val: boolean) => {
    apiClient.setSimulateFailure(val);
    set({ simulateApiFailure: val });
  },

  setPrediction: (pred) => set({ prediction: pred }),
  setLoading: (loading, msg = 'Analyzing evidence...') =>
    set({ isLoading: loading, loadingMessage: msg }),
  setError: (err) => set({ error: err }),

  setPatient: async (patientId: string) => {
    set({ isLoading: true, loadingMessage: 'Loading patient profile...', error: null });
    try {
      const patient = await apiClient.getPatient(patientId);
      set({ selectedPatient: patient, selectedPatientId: patientId });
      // Re-run prediction for this patient
      await get().refreshAnalysis();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to retrieve patient record.';
      set({ error: message, isLoading: false });
    }
  },

  setSelectedVessel: async (vessel: Vessel) => {
    // Immediate camera trigger & vessel switch for snappy 3D responsiveness
    set({
      selectedVessel: vessel,
      autoRotate: false,
      focusVesselTrigger: vessel,
      isLoading: true,
      loadingMessage: `Focusing ${vessel} & recalculating evidence...`,
      error: null,
    });

    const { selectedPatientId, modalities } = get();

    try {
      const [pred, ev] = await Promise.all([
        apiClient.predict(selectedPatientId, vessel, modalities),
        apiClient.getEvidence(selectedPatientId, vessel, modalities),
      ]);
      set({
        prediction: pred,
        evidence: ev,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to retrieve model output.';
      set({ error: message, isLoading: false });
    }
  },

  toggleModality: async (modality: Modality) => {
    const current = get().modalities;
    const nextModalities: ModalityState = {
      ...current,
      [modality]: !current[modality],
    };

    set({
      modalities: nextModalities,
      isLoading: true,
      loadingMessage: `Recalculating without ${modality.toUpperCase()} evidence...`,
      error: null,
    });

    const { selectedPatientId, selectedVessel } = get();

    try {
      const [pred, ev] = await Promise.all([
        apiClient.predict(selectedPatientId, selectedVessel, nextModalities),
        apiClient.getEvidence(selectedPatientId, selectedVessel, nextModalities),
      ]);
      set({
        prediction: pred,
        evidence: ev,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to retrieve model output.';
      set({ error: message, isLoading: false });
    }
  },

  refreshAnalysis: async () => {
    const { selectedPatientId, selectedVessel, modalities } = get();
    set({ isLoading: true, loadingMessage: 'Analyzing evidence...', error: null });

    try {
      const [pred, ev] = await Promise.all([
        apiClient.predict(selectedPatientId, selectedVessel, modalities),
        apiClient.getEvidence(selectedPatientId, selectedVessel, modalities),
      ]);
      set({
        prediction: pred,
        evidence: ev,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to retrieve model output.';
      set({ error: message, isLoading: false });
    }
  },

  retryAnalysis: async () => {
    // If simulated failure is active, toggle it off for clean retry experience
    if (get().simulateApiFailure) {
      get().setSimulateApiFailure(false);
    }
    await get().refreshAnalysis();
  },
}));
