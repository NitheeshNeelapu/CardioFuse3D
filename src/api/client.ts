import { mockApi, setMockApiErrorSimulation, getMockApiErrorSimulation } from './mockApi';
import { Patient, PatientInput } from '../types/patient';
import { Vessel } from '../types/vessel';
import { ModalityState } from '../types/modality';
import { PredictionResult, VesselEvidence, ProvenanceData } from '../types/model';
import { ExplainResponse, HealthResponse, GeminiExplanationResponse } from './types';
import { callLlm } from './llm';

const DEFAULT_API_BASE_URL = 'https://cardiofuse3d.onrender.com';

class CardioApiClient {
  private baseUrl: string;

  constructor() {
    const configured = import.meta.env.VITE_API_BASE_URL;
    if (typeof configured === 'string' && configured.trim() !== '') {
      this.baseUrl = configured.trim().replace(/\/+$/, '');
    } else {
      this.baseUrl = DEFAULT_API_BASE_URL;
    }
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  async getPatient(patientId: string): Promise<Patient> {
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/patients/${patientId}`);
        if (response.ok) return await response.json();
      } catch {
        // Fall back to mockApi
      }
    }
    return await mockApi.getPatient(patientId);
  }

  async predict(
    patient: Patient | string | PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<PredictionResult> {
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patient, selectedVessel, modalities }),
        });
        if (response.ok) return await response.json();
      } catch {
        // Fall back to rule-based mockApi
      }
    }
    return await mockApi.predict(patient, selectedVessel, modalities);
  }

  async explain(
    patient: Patient | string | PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<ExplainResponse> {
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/model-explain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patient, selectedVessel, modalities }),
        });
        if (response.ok) return await response.json();
      } catch {
        // Fall back to mockApi
      }
    }
    return await mockApi.explain(patient, selectedVessel, modalities);
  }

  async getEvidence(
    patient: Patient | string | PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<VesselEvidence> {
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/evidence`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patient, selectedVessel, modalities }),
        });
        if (response.ok) return await response.json();
      } catch {
        // Fall back to mockApi
      }
    }
    return await mockApi.getEvidence(patient, selectedVessel, modalities);
  }

  async getProvenance(
    patient: Patient | string | PatientInput,
    modalities: ModalityState
  ): Promise<ProvenanceData> {
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/provenance`);
        if (response.ok) return await response.json();
      } catch {
        // Fall back to mockApi
      }
    }
    return await mockApi.getProvenance(patient, modalities);
  }

  async getHealth(): Promise<HealthResponse> {
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/health`);
        if (response.ok) {
          const data = await response.json();
          return {
            status: data.status === 'ok' ? 'healthy' : 'degraded',
            version: '1.0.0-render',
            service: 'cardiofuse3d-render-backend',
            backendConnected: true,
            executionMode: data.predictionModelConnected ? 'live_model' : 'mock_demo',
          };
        }
      } catch (err) {
        console.warn('Render backend /api/health unavailable, falling back to mockApi', err);
      }
    }
    return await mockApi.getHealth();
  }

  async getGeminiExplanation(
    patientInput: PatientInput,
    selectedVessel: Vessel,
    modalities: ModalityState
  ): Promise<GeminiExplanationResponse> {
    const disclaimer =
      'RESEARCH PROTOTYPE • NOT CLINICALLY VALIDATED • FOR DEMONSTRATION PURPOSES ONLY';

    const fallbackExplanation = `### Multimodal Evidence Assessment (${selectedVessel})

**Demonstration Context:**
The current profile was evaluated across active diagnostic modalities using a transparent, rule-based cross-attention scoring algorithm.

**Summary of Findings:**
- **Target Territory:** ${selectedVessel} coronary supply bed.
- **Evidence Streams Active:** ${Object.entries(modalities).filter(([, v]) => v).map(([k]) => k.toUpperCase()).join(', ') || 'None'}.
- **Clinical Demographics:** Age ${patientInput.age || 'unspecified'}, SBP ${patientInput.systolicBP || 'unspecified'} mmHg, BMI ${patientInput.bmi || 'unspecified'}.
- **ECG & Symptoms:** ${patientInput.ecg?.available ? '12-lead ECG markers provided' : 'ECG not supplied'}; ${patientInput.symptoms?.narrativeText ? 'Symptom narrative analyzed' : 'No symptom narrative provided'}.

**Recommendation:**
This is a research prototype demonstration. Scores are synthetic and do not constitute a diagnostic probability or clinical advice. Diagnostic confirmation requires physician assessment, high-sensitivity troponin assays, echocardiography, or coronary CTA.`;

    // 1. Attempt live Render backend /api/explain
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/explain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientInput,
            selectedVessel,
            modalities,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.explanation === 'string') {
            return {
              explanation: data.explanation,
              source: data.source ? `${data.source} (Render Backend)` : 'Gemini (Render Backend)',
              clinicallyValidated: false,
              predictionModelConnected: false,
              disclaimer: data.disclaimer || disclaimer,
            };
          }
        } else {
          console.warn(`Render backend /api/explain returned HTTP ${response.status}`);
        }
      } catch (err) {
        console.warn('Render backend /api/explain unreachable, attempting client fallback', err);
      }
    }

    // 2. Fallback to client-side LLM call if available
    try {
      const llmResult = await callLlm<string>('agent_explain', {
        selectedVessel,
        activeModalities: modalities,
        ranking: [],
        guidelineSnippets: [],
      });

      if (llmResult && typeof llmResult === 'string' && llmResult.trim().length > 10) {
        return {
          explanation: llmResult.trim(),
          source: 'Gemini LLM (Synthesized via /api/llm)',
          clinicallyValidated: false,
          predictionModelConnected: false,
          disclaimer,
        };
      }
    } catch {
      // Return deterministic fallback below
    }

    // 3. Fallback to deterministic template
    return {
      explanation: fallbackExplanation,
      source: 'Deterministic Rule-Based Fallback (Offline / Proxy-Free)',
      clinicallyValidated: false,
      predictionModelConnected: false,
      disclaimer,
    };
  }

  setSimulateFailure(simulate: boolean): void {
    setMockApiErrorSimulation(simulate);
  }

  isSimulatingFailure(): boolean {
    return getMockApiErrorSimulation();
  }
}

export const apiClient = new CardioApiClient();
