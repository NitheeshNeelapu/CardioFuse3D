import { Patient } from '../types/patient';
import { Vessel } from '../types/vessel';
import { ModalityState } from '../types/modality';
import { PredictionResult, VesselEvidence, ExplainabilityFeature } from '../types/model';

export interface PredictRequest {
  patientId: string;
  selectedVessel: Vessel;
  modalities: ModalityState;
}

export interface ExplainRequest {
  patientId: string;
  selectedVessel: Vessel;
  modalities: ModalityState;
}

export interface ExplainResponse {
  vessel: Vessel;
  features: ExplainabilityFeature[];
  activeModalitiesCount: number;
  fusionStrategy: string;
  attributionMethod: string;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded';
  version: string;
  service: string;
  backendConnected: boolean;
}
