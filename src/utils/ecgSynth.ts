import { Patient } from '../types/patient';
import { Vessel } from '../types/vessel';

export type LeadName =
  | 'I'
  | 'II'
  | 'III'
  | 'aVR'
  | 'aVL'
  | 'aVF'
  | 'V1'
  | 'V2'
  | 'V3'
  | 'V4'
  | 'V5'
  | 'V6';

export const LEAD_TERRITORIES: Record<LeadName, Vessel | null> = {
  I: 'LCX',
  II: 'RCA',
  III: 'RCA',
  aVR: null,
  aVL: 'LCX',
  aVF: 'RCA',
  V1: 'LAD',
  V2: 'LAD',
  V3: 'LAD',
  V4: 'LAD',
  V5: 'LCX',
  V6: 'LCX',
};

export const STANDARD_12_LEADS: LeadName[][] = [
  ['I', 'aVR', 'V1', 'V4'],
  ['II', 'aVL', 'V2', 'V5'],
  ['III', 'aVF', 'V3', 'V6'],
];

/**
 * Generates an SVG path string for a specific lead in a given width x height box.
 */
export function generateLeadWaveform(
  lead: LeadName,
  patient: Patient | null,
  width = 120,
  height = 45
): string {
  const baseline = height * 0.58;
  const cycleWidth = width / 2.2;
  const numCycles = 3;
  const points: string[] = [];

  const notes = (patient?.ecg?.leadNotes || '').toLowerCase();
  const rhythm = (patient?.ecg?.rhythm || '').toLowerCase();
  const hasLateralFinding =
    notes.includes('lateral') ||
    notes.includes('v5') ||
    notes.includes('v6') ||
    notes.includes('avl') ||
    rhythm.includes('lateral');
  const hasAnteriorFinding =
    notes.includes('anterior') ||
    notes.includes('v1') ||
    notes.includes('v2') ||
    notes.includes('v3') ||
    notes.includes('v4') ||
    rhythm.includes('anterior');
  const hasInferiorFinding =
    notes.includes('inferior') ||
    notes.includes('ii') ||
    notes.includes('iii') ||
    notes.includes('avf') ||
    rhythm.includes('inferior');

  // Lead-specific morphology adjustments
  const isAVR = lead === 'aVR';
  const isV1V2 = lead === 'V1' || lead === 'V2';

  for (let c = 0; c < numCycles; c++) {
    const ox = c * cycleWidth;
    if (ox > width + 20) break;

    // Start baseline
    if (c === 0) {
      points.push(`M ${ox} ${baseline}`);
    } else {
      points.push(`L ${ox} ${baseline}`);
    }

    // P-wave
    const pAmp = isAVR ? 2.5 : 3.2;
    const pY = isAVR ? baseline + pAmp : baseline - pAmp;
    points.push(`Q ${ox + cycleWidth * 0.1} ${pY}, ${ox + cycleWidth * 0.2} ${baseline}`);

    // PR Segment
    points.push(`L ${ox + cycleWidth * 0.28} ${baseline}`);

    // Q-wave
    const qAmp = isAVR ? 0 : 2.5;
    points.push(`L ${ox + cycleWidth * 0.32} ${baseline + qAmp}`);

    // R-wave
    let rAmp = 18;
    if (isAVR) rAmp = -14;
    else if (isV1V2) rAmp = 6;
    else if (lead === 'V5' || lead === 'V6') rAmp = 20;

    points.push(`L ${ox + cycleWidth * 0.38} ${baseline - rAmp}`);

    // S-wave
    let sAmp = 5;
    if (isAVR) sAmp = 0;
    else if (isV1V2) sAmp = 12;

    points.push(`L ${ox + cycleWidth * 0.44} ${baseline + sAmp}`);

    // ST segment & T-wave
    let stShift = 0;
    let tAmp = isAVR ? -4 : 6;

    if (hasAnteriorFinding && (lead === 'V1' || lead === 'V2' || lead === 'V3' || lead === 'V4')) {
      stShift = -6; // ST elevation
      tAmp = 9;
    } else if (hasLateralFinding && (lead === 'I' || lead === 'aVL' || lead === 'V5' || lead === 'V6')) {
      stShift = 2.5; // ST depression
      tAmp = -4; // T-wave inversion / flattening
    } else if (hasInferiorFinding && (lead === 'II' || lead === 'III' || lead === 'aVF')) {
      stShift = 3; // ST depression
      tAmp = 2; // Flat T-wave
    }

    // ST segment
    points.push(`L ${ox + cycleWidth * 0.54} ${baseline + stShift}`);

    // T-wave
    const tApexY = baseline + stShift - tAmp;
    points.push(
      `Q ${ox + cycleWidth * 0.72} ${tApexY}, ${ox + cycleWidth * 0.88} ${baseline}`
    );

    // Isoelectric finish
    points.push(`L ${ox + cycleWidth} ${baseline}`);
  }

  return points.join(' ');
}
