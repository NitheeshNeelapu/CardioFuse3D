import { mockApi, setMockApiErrorSimulation, getMockApiErrorSimulation } from './mockApi';
import { Patient, PatientInput } from '../types/patient';
import { Vessel } from '../types/vessel';
import { ModalityState } from '../types/modality';
import { PredictionResult, VesselEvidence, ProvenanceData } from '../types/model';
import { ExplainResponse, HealthResponse } from './types';

class CardioApiClient {
  async getPatient(patientId: string): Promise<Patient> {
    return await mockApi.getPatient(patientId);
  }

  async predict(
    patient: Patient | string | PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<PredictionResult> {
    return await mockApi.predict(patient, selectedVessel, modalities);
  }

  async explain(
    patient: Patient | string | PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<ExplainResponse> {
    return await mockApi.explain(patient, selectedVessel, modalities);
  }

  async getEvidence(
    patient: Patient | string | PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<VesselEvidence> {
    return await mockApi.getEvidence(patient, selectedVessel, modalities);
  }

  async getProvenance(
    patient: Patient | string | PatientInput,
    modalities: ModalityState
  ): Promise<ProvenanceData> {
    return await mockApi.getProvenance(patient, modalities);
  }

  async getHealth(): Promise<HealthResponse> {
    return await mockApi.getHealth();
  }

  setSimulateFailure(simulate: boolean): void {
    setMockApiErrorSimulation(simulate);
  }

  isSimulatingFailure(): boolean {
    return getMockApiErrorSimulation();
  }
}

export const apiClient = new CardioApiClient();
