import { Patient } from '../types/patient';
import { Vessel } from '../types/vessel';
import { ModalityState } from '../types/modality';
import { PredictionResult, VesselEvidence } from '../types/model';
import { DEMO_PATIENTS, demoPatient01 } from '../data/demoPatient';
import { computeDemoPrediction, getDemoVesselEvidence } from '../data/demoPredictions';
import { ExplainResponse } from './types';

// Helper for simulated latency (300ms - 700ms)
const simulateDelay = (minMs: number = 300, maxMs: number = 700): Promise<void> => {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

let shouldSimulateError = false;

export const setMockApiErrorSimulation = (simulate: boolean) => {
  shouldSimulateError = simulate;
};

export const getMockApiErrorSimulation = () => shouldSimulateError;

export const mockApi = {
  async getPatient(patientId: string): Promise<Patient> {
    await simulateDelay(350, 600);
    if (shouldSimulateError) {
      throw new Error('Simulated network anomaly: Unable to retrieve patient record.');
    }
    const patient = DEMO_PATIENTS[patientId] || demoPatient01;
    return JSON.parse(JSON.stringify(patient));
  },

  async predict(
    patientId: string,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<PredictionResult> {
    await simulateDelay(350, 650);
    if (shouldSimulateError) {
      throw new Error('Simulated network anomaly: Unable to retrieve model output.');
    }
    const result = computeDemoPrediction(selectedVessel, modalities, patientId);
    return JSON.parse(JSON.stringify(result));
  },

  async explain(
    patientId: string,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<ExplainResponse> {
    await simulateDelay(300, 500);
    if (shouldSimulateError) {
      throw new Error('Simulated network anomaly: Unable to compute model explanations.');
    }
    const pred = computeDemoPrediction(selectedVessel, modalities, patientId);
    return {
      vessel: selectedVessel,
      features: pred.explanationFeatures,
      activeModalitiesCount: pred.activeModalitiesCount,
      fusionStrategy: pred.fusionStrategy,
      attributionMethod: 'Integrated Gradients (Synthetic Multimodal Attribution)',
    };
  },

  async getEvidence(
    patientId: string,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<VesselEvidence> {
    await simulateDelay(300, 500);
    if (shouldSimulateError) {
      throw new Error('Simulated network anomaly: Unable to load vessel evidence.');
    }
    const evidence = getDemoVesselEvidence(selectedVessel, modalities);
    return JSON.parse(JSON.stringify(evidence));
  },
};
