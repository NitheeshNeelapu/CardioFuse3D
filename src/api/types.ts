import { Patient, PatientInput } from '../types/patient';
import { Vessel } from '../types/vessel';
import { ModalityState } from '../types/modality';
import { PredictionResult, VesselEvidence, ExplainabilityFeature, ProvenanceData } from '../types/model';

/**
 * ============================================================================
 * BACKEND INTEGRATION CONTRACT SPECIFICATION
 * CARDIOFUSE 3D API Contract for Real-Model Backend Integration
 * ============================================================================
 */

export interface PredictRequest {
  patient: Patient | string | PatientInput;
  selectedVessel: Vessel;
  modalities: ModalityState;
}

export interface ExplainRequest {
  patient: Patient | string | PatientInput;
  selectedVessel: Vessel;
  modalities: ModalityState;
}

export interface EvidenceRequest {
  patient: Patient | string | PatientInput;
  selectedVessel: Vessel;
  modalities: ModalityState;
}

export interface ExplainResponse {
  vessel: Vessel;
  features: ExplainabilityFeature[];
  activeModalitiesCount: number;
  fusionStrategy: string;
  attributionMethod: string;
  isSynthetic: boolean;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded';
  version: string;
  service: string;
  backendConnected: boolean;
  executionMode: 'mock_demo' | 'live_model';
}

export interface GeminiExplanationResponse {
  explanation: string;
  source: string;
  clinicallyValidated: boolean;
  predictionModelConnected: boolean;
  disclaimer: string;
}
