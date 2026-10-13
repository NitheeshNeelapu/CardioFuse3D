import { Patient } from '../types/patient';
import { Vessel } from '../types/vessel';
import { Modality, ModalityState } from '../types/modality';
import { scoreVessel } from '../data/scorer';
import { lookupGuideline, GuidelineSnippet } from '../data/guidelines';
import { callLlm } from '../api/llm';

export interface AgentTraceStep {
  tool: string;
  input: string;
  output: string;
  timestamp: string;
}

export interface MissingEvidenceItem {
  modalityKey: string;
  label: string;
  delta: number;
  newScore: number;
  rankFlipped: boolean;
  isConfirmatory: boolean;
  guidelineId?: string;
  rationale: string;
}

export interface AgentRunResult {
  steps: AgentTraceStep[];
  ranking: MissingEvidenceItem[];
  explanation: string;
  isFallback: boolean;
}

/**
 * Tool 1: Inspects current evidence state
 */
export function toolGetCurrentEvidence(modalities: ModalityState) {
  const active: Modality[] = [];
  const inactive: Modality[] = [];

  (['clinical', 'ecg', 'symptoms'] as Modality[]).forEach((m) => {
    if (modalities[m]) active.push(m);
    else inactive.push(m);
  });

  return { active, inactive };
}

/**
 * Tool 2: Evaluates hypothetical impact of switching on missing modalities
 */
export function toolRankMissingEvidence(
  patient: Patient,
  selectedVessel: Vessel,
  modalities: ModalityState
): MissingEvidenceItem[] {
  const { inactive } = toolGetCurrentEvidence(modalities);
  const baselineScore = scoreVessel(patient, selectedVessel, modalities).probability;

  // Determine current top vessel
  const vessels: Vessel[] = ['LAD', 'LCX', 'RCA'];
  const currentProbs: Record<Vessel, number> = {
    LAD: scoreVessel(patient, 'LAD', modalities).probability,
    LCX: scoreVessel(patient, 'LCX', modalities).probability,
    RCA: scoreVessel(patient, 'RCA', modalities).probability,
  };
  const baselineTop = [...vessels].sort((a, b) => currentProbs[b] - currentProbs[a])[0];

  if (inactive.length === 0) {
    // All modalities are already active -> Rank confirmatory guideline tests without fabricated numbers
    return [
      {
        modalityKey: 'ccta',
        label: 'Coronary CT Angiography (CCTA)',
        delta: 0,
        newScore: baselineScore,
        rankFlipped: false,
        isConfirmatory: true,
        guidelineId: 'ccta',
        rationale: 'Anatomical plaque and stenosis visualization for intermediate clinical risk.',
      },
      {
        modalityKey: 'stress_testing',
        label: 'Stress Echocardiography / Perfusion Imaging',
        delta: 0,
        newScore: baselineScore,
        rankFlipped: false,
        isConfirmatory: true,
        guidelineId: 'stress_testing',
        rationale: 'Functional evaluation of reversible regional ischemia during workload.',
      },
      {
        modalityKey: 'troponin',
        label: 'Serial Troponin Biomarkers',
        delta: 0,
        newScore: baselineScore,
        rankFlipped: false,
        isConfirmatory: true,
        guidelineId: 'troponin',
        rationale: 'Myocardial injury assessment for suspected acute coronary syndromes.',
      },
    ];
  }

  const items: MissingEvidenceItem[] = [];

  for (const mod of inactive) {
    const nextModalities: ModalityState = {
      ...modalities,
      [mod]: true,
    };

    const newScore = scoreVessel(patient, selectedVessel, nextModalities).probability;
    const delta = newScore - baselineScore;

    // Check if turning this on flips top vessel
    const newProbs: Record<Vessel, number> = {
      LAD: scoreVessel(patient, 'LAD', nextModalities).probability,
      LCX: scoreVessel(patient, 'LCX', nextModalities).probability,
      RCA: scoreVessel(patient, 'RCA', nextModalities).probability,
    };
    const newTop = [...vessels].sort((a, b) => newProbs[b] - newProbs[a])[0];
    const rankFlipped = newTop !== baselineTop;

    const label = mod === 'clinical' ? 'Clinical Measurements' : mod === 'ecg' ? '12-Lead ECG Signal' : 'Symptom Narrative';
    const guidelineId = mod === 'ecg' ? 'resting_ecg' : 'echocardiography';

    items.push({
      modalityKey: mod,
      label,
      delta,
      newScore,
      rankFlipped,
      isConfirmatory: false,
      guidelineId,
      rationale: rankFlipped
        ? `Would shift primary highest-risk territory from ${baselineTop} to ${newTop}.`
        : `Adjusts ${selectedVessel} estimate by ${Math.abs(delta)} pts (${delta >= 0 ? '+' : ''}${delta}).`,
    });
  }

  // Sort by ranking flip first, then by absolute delta descending
  items.sort((a, b) => {
    if (a.rankFlipped && !b.rankFlipped) return -1;
    if (!a.rankFlipped && b.rankFlipped) return 1;
    return Math.abs(b.delta) - Math.abs(a.delta);
  });

  return items;
}

/**
 * Executes the tool-using evidence agent:
 * 1. toolGetCurrentEvidence
 * 2. toolRankMissingEvidence
 * 3. lookupGuideline
 * 4. callLlm('agent_explain') with deterministic fallback
 */
export async function runEvidenceAgent(
  patient: Patient,
  selectedVessel: Vessel,
  modalities: ModalityState
): Promise<AgentRunResult> {
  const steps: AgentTraceStep[] = [];
  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Tool 1
  const evidenceState = toolGetCurrentEvidence(modalities);
  steps.push({
    tool: 'getCurrentEvidence',
    input: `Active modalities count: ${evidenceState.active.length}/3`,
    output: `Active: [${evidenceState.active.join(', ') || 'none'}] | Inactive: [${evidenceState.inactive.join(', ') || 'none'}]`,
    timestamp: now(),
  });

  // Tool 2
  const ranking = toolRankMissingEvidence(patient, selectedVessel, modalities);
  const topRankSummary = ranking.map((r) => `${r.label} (Δ: ${r.delta > 0 ? '+' : ''}${r.delta} pts)`).join('; ');
  steps.push({
    tool: 'rankMissingEvidence',
    input: `Patient: ${patient.id}, Target Vessel: ${selectedVessel}`,
    output: `Ranked ${ranking.length} potential evidence inputs: ${topRankSummary}`,
    timestamp: now(),
  });

  // Tool 3
  const guidelineSnippets: GuidelineSnippet[] = [];
  const guidelineTopics = ranking.map((r) => r.guidelineId).filter(Boolean) as string[];
  const uniqueTopics = Array.from(new Set(guidelineTopics));

  for (const topic of uniqueTopics) {
    const snip = lookupGuideline(topic);
    guidelineSnippets.push(snip);
  }

  steps.push({
    tool: 'lookupGuideline',
    input: `Topics: [${uniqueTopics.join(', ')}]`,
    output: `Retrieved ${guidelineSnippets.length} educational clinical guideline snippets`,
    timestamp: now(),
  });

  // LLM synthesis with strict fallback
  let explanation = '';
  let isFallback = false;

  const llmResult = await callLlm<string>('agent_explain', {
    selectedVessel,
    activeModalities: evidenceState,
    ranking,
    guidelineSnippets,
  });

  if (llmResult && typeof llmResult === 'string' && llmResult.trim().length > 10) {
    explanation = llmResult.trim();
  } else {
    isFallback = true;
    if (evidenceState.inactive.length > 0 && ranking[0]) {
      const top = ranking[0];
      const sign = top.delta > 0 ? '+' : '';
      explanation = `${top.label} is currently missing and represents the most informative evidence to collect next (projected shift of ${sign}${top.delta} points for ${selectedVessel}). Gathering this data would directly resolve existing model uncertainty across coronary supply beds. Confirmatory testing and physical examination under qualified clinical oversight remain essential.`;
    } else {
      explanation = `All primary evidence modalities (Clinical, ECG, and Symptom Narrative) are currently active for the ${selectedVessel} evaluation. To further clarify cardiovascular risk, guideline-directed confirmatory diagnostics such as CCTA or functional stress imaging should be discussed with a qualified physician.`;
    }
  }

  return {
    steps,
    ranking,
    explanation,
    isFallback,
  };
}
