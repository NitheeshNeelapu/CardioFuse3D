import { mockApi, setMockApiErrorSimulation, getMockApiErrorSimulation } from './mockApi';
import { Patient, PatientInput } from '../types/patient';
import { Vessel } from '../types/vessel';
import { ModalityState } from '../types/modality';
import { PredictionResult, VesselEvidence, ProvenanceData } from '../types/model';
import { ExplainResponse, HealthResponse, GeminiExplanationResponse } from './types';
import { callLlm } from './llm';

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
