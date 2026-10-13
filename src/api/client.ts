import { mockApi, setMockApiErrorSimulation, getMockApiErrorSimulation } from './mockApi';
import { Patient, PatientInput } from '../types/patient';
import { Vessel } from '../types/vessel';
import { ModalityState } from '../types/modality';
import { PredictionResult, VesselEvidence, ProvenanceData } from '../types/model';
import { ExplainResponse, HealthResponse, GeminiExplanationResponse } from './types';

class CardioApiClient {
  private useRealBackend: boolean = false;
  private baseUrl: string = '';

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    this.useRealBackend = Boolean(this.baseUrl);
  }

  async getPatient(patientId: string): Promise<Patient> {
    if (this.useRealBackend) {
      try {
        const response = await fetch(`${this.baseUrl}/api/patients/${patientId}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn('Real backend unavailable, falling back to mockApi', err);
      }
    }
    return await mockApi.getPatient(patientId);
  }

  async predict(
    patient: Patient | string | PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<PredictionResult> {
    if (this.useRealBackend) {
      try {
        const response = await fetch(`${this.baseUrl}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patient, selectedVessel, modalities }),
        });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn('Real backend unavailable, falling back to mockApi', err);
      }
    }
    return await mockApi.predict(patient, selectedVessel, modalities);
  }

  async explain(
    patient: Patient | string | PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<ExplainResponse> {
    if (this.useRealBackend) {
      try {
        const response = await fetch(`${this.baseUrl}/api/explain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patient, selectedVessel, modalities }),
        });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn('Real backend unavailable, falling back to mockApi', err);
      }
    }
    return await mockApi.explain(patient, selectedVessel, modalities);
  }

  async getEvidence(
    patient: Patient | string | PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<VesselEvidence> {
    if (this.useRealBackend) {
      try {
        const response = await fetch(`${this.baseUrl}/api/evidence`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patient, selectedVessel, modalities }),
        });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn('Real backend unavailable, falling back to mockApi', err);
      }
    }
    return await mockApi.getEvidence(patient, selectedVessel, modalities);
  }

  async getProvenance(
    patient: Patient | string | PatientInput,
    modalities: ModalityState
  ): Promise<ProvenanceData> {
    if (this.useRealBackend) {
      try {
        const response = await fetch(`${this.baseUrl}/api/provenance`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn('Real backend unavailable, falling back to mockApi', err);
      }
    }
    return await mockApi.getProvenance(patient, modalities);
  }

  async getHealth(): Promise<HealthResponse> {
    if (this.useRealBackend) {
      try {
        const response = await fetch(`${this.baseUrl}/api/health`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn('Real backend unavailable, falling back to mockApi', err);
      }
    }
    return await mockApi.getHealth();
  }

  async getGeminiExplanation(
    patientInput: PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<GeminiExplanationResponse> {
    const response = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientInput,
        selectedVessel,
        modalities,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error || `Gemini request failed: HTTP ${response.status}`
      );
    }

    if (typeof data?.explanation !== 'string') {
      throw new Error('The explanation service returned an invalid response.');
    }

    return data as GeminiExplanationResponse;
  }

  setSimulateFailure(simulate: boolean): void {
    setMockApiErrorSimulation(simulate);
  }

  isSimulatingFailure(): boolean {
    return getMockApiErrorSimulation();
  }
}

export const apiClient = new CardioApiClient();
