import React from 'react';
import { SexOption } from '../../types/patient';
import { ValidationErrors } from './InputValidation';
import { User, Activity, Heart, Scale, Sparkles } from 'lucide-react';

interface ClinicalDataFormProps {
  age: number | string;
  setAge: (val: number | string) => void;
  sex: SexOption;
  setSex: (val: SexOption) => void;
  systolicBP: number | string;
  setSystolicBP: (val: number | string) => void;
  diastolicBP: number | string;
  setDiastolicBP: (val: number | string) => void;
  cholesterol: number | string;
  setCholesterol: (val: number | string) => void;
  restingHeartRate: number | string;
  setRestingHeartRate: (val: number | string) => void;
  bmi: number | string;
  setBmi: (val: number | string) => void;
  errors: ValidationErrors;
  onApplyPreset?: (preset: {
    age: number;
    sex: SexOption;
    systolicBP: number;
    diastolicBP: number;
    cholesterol: number;
    restingHeartRate: number;
    bmi: number;
  }) => void;
}

export const ClinicalDataForm: React.FC<ClinicalDataFormProps> = ({
  age,
  setAge,
  sex,
  setSex,
  systolicBP,
  setSystolicBP,
  diastolicBP,
  setDiastolicBP,
  cholesterol,
  setCholesterol,
  restingHeartRate,
  setRestingHeartRate,
  bmi,
  setBmi,
  errors,
  onApplyPreset,
}) => {
  return (
    <div className="space-y-4">
      {/* Quick Test Fixture Presets */}
      {onApplyPreset && (
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick Research Test Presets:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onApplyPreset({
                  age: 48,
                  sex: 'Male',
                  systolicBP: 138,
                  diastolicBP: 86,
                  cholesterol: 218,
                  restingHeartRate: 76,
                  bmi: 26.2,
                })
              }
              className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/30 text-[11px] transition-all"
            >
              Exertional Profile (Age 48)
            </button>
            <button
              type="button"
              onClick={() =>
                onApplyPreset({
                  age: 26,
                  sex: 'Female',
                  systolicBP: 114,
                  diastolicBP: 72,
                  cholesterol: 175,
                  restingHeartRate: 68,
                  bmi: 21.8,
                })
              }
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] transition-all"
            >
              Baseline Normotensive (Age 26)
            </button>
          </div>
        </div>
      )}

      {/* Row 1: Age & Sex */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Age */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="input-age" className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Age (Years)</span>
            </label>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              REQUIRED
            </span>
          </div>
          <input
            id="input-age"
            type="number"
            min={18}
            max={100}
            value={age}
            onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="e.g. 52 (18–100)"
            className={`w-full bg-[#030712] border rounded-xl px-3.5 py-2 text-sm text-white font-mono placeholder-slate-600 focus:outline-none transition-colors ${
              errors.age ? 'border-red-500 focus:border-red-400' : 'border-white/15 focus:border-cyan-400'
            }`}
          />
          {errors.age && (
            <p className="text-[11px] text-red-400 font-mono mt-1">{errors.age}</p>
          )}
        </div>

        {/* Sex */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="input-sex" className="text-xs font-bold text-slate-200 font-mono">
              Sex
            </label>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              REQUIRED
            </span>
          </div>
          <select
            id="input-sex"
            value={sex}
            onChange={(e) => setSex(e.target.value as SexOption)}
            className="w-full bg-[#030712] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to specify">Prefer not to specify</option>
          </select>
          {errors.sex && (
            <p className="text-[11px] text-red-400 font-mono mt-1">{errors.sex}</p>
          )}
        </div>
      </div>

      {/* Row 2: Blood Pressure (Systolic & Diastolic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="input-sysbp" className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Systolic BP (mmHg)</span>
            </label>
            <span className="text-[10px] font-mono text-slate-400">
              {systolicBP ? 'ENTERED' : 'OPTIONAL'}
            </span>
          </div>
          <input
            id="input-sysbp"
            type="number"
            min={60}
            max={260}
            value={systolicBP}
            onChange={(e) => setSystolicBP(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="e.g. 128"
            className={`w-full bg-[#030712] border rounded-xl px-3.5 py-2 text-sm text-white font-mono placeholder-slate-600 focus:outline-none transition-colors ${
              errors.systolicBP ? 'border-red-500' : 'border-white/15 focus:border-cyan-400'
            }`}
          />
          {errors.systolicBP && (
            <p className="text-[11px] text-red-400 font-mono mt-1">{errors.systolicBP}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="input-diabp" className="text-xs font-bold text-slate-200 font-mono">
              Diastolic BP (mmHg)
            </label>
            <span className="text-[10px] font-mono text-slate-400">
              {diastolicBP ? 'ENTERED' : 'OPTIONAL'}
            </span>
          </div>
          <input
            id="input-diabp"
            type="number"
            min={40}
            max={150}
            value={diastolicBP}
            onChange={(e) => setDiastolicBP(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="e.g. 82"
            className={`w-full bg-[#030712] border rounded-xl px-3.5 py-2 text-sm text-white font-mono placeholder-slate-600 focus:outline-none transition-colors ${
              errors.diastolicBP ? 'border-red-500' : 'border-white/15 focus:border-cyan-400'
            }`}
          />
          {errors.diastolicBP && (
            <p className="text-[11px] text-red-400 font-mono mt-1">{errors.diastolicBP}</p>
          )}
        </div>
      </div>

      {/* Row 3: Total Cholesterol & Resting Heart Rate */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="input-chol" className="text-xs font-bold text-slate-200 font-mono">
              Total Cholesterol (mg/dL)
            </label>
            <span className="text-[10px] font-mono text-slate-400">
              {cholesterol ? 'ENTERED' : 'OPTIONAL'}
            </span>
          </div>
          <input
            id="input-chol"
            type="number"
            min={80}
            max={500}
            value={cholesterol}
            onChange={(e) => setCholesterol(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="e.g. 210"
            className={`w-full bg-[#030712] border rounded-xl px-3.5 py-2 text-sm text-white font-mono placeholder-slate-600 focus:outline-none transition-colors ${
              errors.cholesterol ? 'border-red-500' : 'border-white/15 focus:border-cyan-400'
            }`}
          />
          {errors.cholesterol && (
            <p className="text-[11px] text-red-400 font-mono mt-1">{errors.cholesterol}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="input-hr" className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Resting Heart Rate (bpm)</span>
            </label>
            <span className="text-[10px] font-mono text-slate-400">
              {restingHeartRate ? 'ENTERED' : 'OPTIONAL'}
            </span>
          </div>
          <input
            id="input-hr"
            type="number"
            min={40}
            max={200}
            value={restingHeartRate}
            onChange={(e) => setRestingHeartRate(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="e.g. 74"
            className={`w-full bg-[#030712] border rounded-xl px-3.5 py-2 text-sm text-white font-mono placeholder-slate-600 focus:outline-none transition-colors ${
              errors.restingHeartRate ? 'border-red-500' : 'border-white/15 focus:border-cyan-400'
            }`}
          />
          {errors.restingHeartRate && (
            <p className="text-[11px] text-red-400 font-mono mt-1">{errors.restingHeartRate}</p>
          )}
        </div>
      </div>

      {/* Row 4: BMI */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="input-bmi" className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-violet-400" />
            <span>Body Mass Index (BMI kg/m²)</span>
          </label>
          <span className="text-[10px] font-mono text-slate-400">
            {bmi ? 'ENTERED' : 'OPTIONAL'}
          </span>
        </div>
        <input
          id="input-bmi"
          type="number"
          step="0.1"
          min={12}
          max={65}
          value={bmi}
          onChange={(e) => setBmi(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="e.g. 24.6"
          className={`w-full bg-[#030712] border rounded-xl px-3.5 py-2 text-sm text-white font-mono placeholder-slate-600 focus:outline-none transition-colors ${
            errors.bmi ? 'border-red-500' : 'border-white/15 focus:border-cyan-400'
          }`}
        />
        {errors.bmi && (
          <p className="text-[11px] text-red-400 font-mono mt-1">{errors.bmi}</p>
        )}
      </div>
    </div>
  );
};
