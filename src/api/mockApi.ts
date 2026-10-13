import { Patient, PatientInput } from '../types/patient';
import { Vessel } from '../types/vessel';
import { ModalityState } from '../types/modality';
import { PredictionResult, VesselEvidence, ProvenanceData } from '../types/model';
import { computeDemoPrediction, getDemoVesselEvidence, resolvePatient } from '../data/demoPredictions';
import { DEMO_PATIENTS, demoPatient01 } from '../data/demoPatient';
import { ExplainResponse, HealthResponse } from './types';

// Deterministic delay for demonstration (150ms)
const simulateDelay = (ms: number = 150): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

let shouldSimulateError = false;

export const setMockApiErrorSimulation = (simulate: boolean) => {
  shouldSimulateError = simulate;
};

export const getMockApiErrorSimulation = () => shouldSimulateError;

export const mockApi = {
  async getPatient(patientId: string): Promise<Patient> {
    await simulateDelay(100);
    if (shouldSimulateError) {
      throw new Error('Unable to retrieve patient profile.');
    }
    const patient = DEMO_PATIENTS[patientId] || DEMO_PATIENTS['DEMO-00482'] || demoPatient01;
    return JSON.parse(JSON.stringify(patient));
  },

  async predict(
    patient: Patient | string | PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<PredictionResult> {
    await simulateDelay(150);
    if (shouldSimulateError) {
      throw new Error('Unable to generate model output.');
    }
    const resolved = resolvePatient(patient);
    const result = computeDemoPrediction(selectedVessel, modalities, resolved);
    return JSON.parse(JSON.stringify(result));
  },

  async explain(
    patient: Patient | string | PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<ExplainResponse> {
    await simulateDelay(120);
    if (shouldSimulateError) {
      throw new Error('Unable to generate model explanations.');
    }
    const resolved = resolvePatient(patient);
    const pred = computeDemoPrediction(selectedVessel, modalities, resolved);
    return {
      vessel: selectedVessel,
      features: pred.features,
      activeModalitiesCount: pred.activeModalitiesCount,
      fusionStrategy: pred.fusionStrategy,
      attributionMethod: 'Transparent weighted scorer + occlusion attribution; trained multimodal model is planned',
      isSynthetic: true,
    };
  },

  async getEvidence(
    patient: Patient | string | PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<VesselEvidence> {
    await simulateDelay(120);
    if (shouldSimulateError) {
      throw new Error('Unable to load vessel evidence.');
    }
    const resolved = resolvePatient(patient);
    const evidence = getDemoVesselEvidence(selectedVessel, modalities, resolved);
    return JSON.parse(JSON.stringify(evidence));
  },

  async getProvenance(patient: Patient | string | PatientInput, modalities: ModalityState): Promise<ProvenanceData> {
    const resolved = resolvePatient(patient);
    const pred = computeDemoPrediction('LAD', modalities, resolved);
    return pred.provenance;
  },

  async getHealth(): Promise<HealthResponse> {
    return {
      status: 'healthy',
      version: '0.2.0-demo',
      service: 'cardiofuse-rule-scorer',
      backendConnected: false,
      executionMode: 'mock_demo',
    };
  },
};
