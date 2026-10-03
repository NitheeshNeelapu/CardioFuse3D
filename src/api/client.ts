import { mockApi, setMockApiErrorSimulation, getMockApiErrorSimulation } from './mockApi';
import { Patient } from '../types/patient';
import { Vessel } from '../types/vessel';
import { ModalityState } from '../types/modality';
import { PredictionResult, VesselEvidence } from '../types/model';
import { ExplainResponse } from './types';

// API client that abstracts data fetching.
// In future production deployment, this client routes to FastAPI endpoints:
// GET /api/patient/:id
// POST /api/predict
// POST /api/explain
// GET /api/evidence/:patientId/:vessel

class CardioApiClient {
  private useRealBackend: boolean = false;
  private baseUrl: string = '';

  constructor() {
    this.baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || '';
    this.useRealBackend = Boolean(this.baseUrl);
  }

  async getPatient(patientId: string): Promise<Patient> {
    if (this.useRealBackend) {
      try {
        const response = await fetch(`${this.baseUrl}/api/patient/${patientId}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn('Real backend unavailable, falling back to mockApi', err);
      }
    }
    return await mockApi.getPatient(patientId);
  }

  async predict(
    patientId: string,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<PredictionResult> {
    if (this.useRealBackend) {
      try {
        const response = await fetch(`${this.baseUrl}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientId, selectedVessel, modalities }),
        });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn('Real backend unavailable, falling back to mockApi', err);
      }
    }
    return await mockApi.predict(patientId, selectedVessel, modalities);
  }

  async explain(
    patientId: string,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<ExplainResponse> {
    if (this.useRealBackend) {
      try {
        const response = await fetch(`${this.baseUrl}/api/explain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientId, selectedVessel, modalities }),
        });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn('Real backend unavailable, falling back to mockApi', err);
      }
    }
    return await mockApi.explain(patientId, selectedVessel, modalities);
  }

  async getEvidence(
    patientId: string,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<VesselEvidence> {
    if (this.useRealBackend) {
      try {
        const response = await fetch(
          `${this.baseUrl}/api/evidence/${patientId}/${selectedVessel}`
        );
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn('Real backend unavailable, falling back to mockApi', err);
      }
    }
    return await mockApi.getEvidence(patientId, selectedVessel, modalities);
  }

  // Developer / test tool for Acceptance Test 8
  setSimulateFailure(simulate: boolean): void {
    setMockApiErrorSimulation(simulate);
  }

  isSimulatingFailure(): boolean {
    return getMockApiErrorSimulation();
  }
}

export const apiClient = new CardioApiClient();
