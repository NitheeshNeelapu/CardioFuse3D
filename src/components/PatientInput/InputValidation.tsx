import { PatientInput } from '../../types/patient';

export interface ValidationErrors {
  age?: string;
  sex?: string;
  systolicBP?: string;
  diastolicBP?: string;
  cholesterol?: string;
  restingHeartRate?: string;
  bmi?: string;
  general?: string;
}

export interface ValidationResult {
  isValid: boolean;
  isPartial: boolean;
  errors: ValidationErrors;
  missingOptionalFields: string[];
}

export function validatePatientInput(input: Partial<PatientInput>): ValidationResult {
  const errors: ValidationErrors = {};
  const missingOptionalFields: string[] = [];

  // Age is required (18-100)
  if (input.age === undefined || input.age === null || Number.isNaN(input.age)) {
    errors.age = 'Age is required (18–100 years).';
  } else if (input.age < 18 || input.age > 100) {
    errors.age = 'Age must be between 18 and 100 years.';
  }

  // Sex is required
  if (!input.sex) {
    errors.sex = 'Please specify sex category.';
  }

  // Systolic BP optional, validate bounds if provided
  if (input.systolicBP !== undefined && input.systolicBP !== null && !Number.isNaN(input.systolicBP)) {
    if (input.systolicBP < 60 || input.systolicBP > 260) {
      errors.systolicBP = 'Systolic BP should be between 60 and 260 mmHg.';
    }
  } else {
    missingOptionalFields.push('Systolic BP');
  }

  // Diastolic BP optional, validate bounds if provided
  if (input.diastolicBP !== undefined && input.diastolicBP !== null && !Number.isNaN(input.diastolicBP)) {
    if (input.diastolicBP < 35 || input.diastolicBP > 160) {
      errors.diastolicBP = 'Diastolic BP should be between 35 and 160 mmHg.';
    }
  } else {
    missingOptionalFields.push('Diastolic BP');
  }

  // Cholesterol optional, validate bounds if provided
  if (input.cholesterol !== undefined && input.cholesterol !== null && !Number.isNaN(input.cholesterol)) {
    if (input.cholesterol < 80 || input.cholesterol > 600) {
      errors.cholesterol = 'Total cholesterol should be between 80 and 600 mg/dL.';
    }
  } else {
    missingOptionalFields.push('Total Cholesterol');
  }

  // Resting HR optional, validate bounds if provided
  if (input.restingHeartRate !== undefined && input.restingHeartRate !== null && !Number.isNaN(input.restingHeartRate)) {
    if (input.restingHeartRate < 35 || input.restingHeartRate > 220) {
      errors.restingHeartRate = 'Heart rate should be between 35 and 220 bpm.';
    }
  } else {
    missingOptionalFields.push('Resting Heart Rate');
  }

  // BMI optional, validate bounds if provided
  if (input.bmi !== undefined && input.bmi !== null && !Number.isNaN(input.bmi)) {
    if (input.bmi < 12 || input.bmi > 70) {
      errors.bmi = 'BMI should be between 12 and 70 kg/m².';
    }
  } else {
    missingOptionalFields.push('BMI');
  }

  // Track modality evidence optional inputs
  if (!input.ecg?.available) {
    missingOptionalFields.push('Patient ECG recording');
  }
  if (!input.symptoms?.narrativeText?.trim()) {
    missingOptionalFields.push('Clinical symptom narrative');
  }

  const isValid = Object.keys(errors).length === 0;
  const isPartial = missingOptionalFields.length > 0;

  return { isValid, isPartial, errors, missingOptionalFields };
}
