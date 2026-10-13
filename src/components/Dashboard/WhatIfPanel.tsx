import React, { useEffect, useRef, useState } from 'react';
import { Sliders, RotateCcw, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { useAppStore } from '../../state/useAppStore';
import { scoreVessel } from '../../data/scorer';
import { Vessel } from '../../types/vessel';

export const WhatIfPanel: React.FC = () => {
  const selectedPatient = useAppStore((s) => s.selectedPatient);
  const whatIf = useAppStore((s) => s.whatIf);
  const setWhatIf = useAppStore((s) => s.setWhatIf);
  const resetWhatIf = useAppStore((s) => s.resetWhatIf);
  const modalities = useAppStore((s) => s.modalities);
  const prediction = useAppStore((s) => s.prediction);

  // Local state for instant slider responsiveness
  const [localAge, setLocalAge] = useState<number>(selectedPatient.age);
  const [localSbp, setLocalSbp] = useState<number>(selectedPatient.vitals.bloodPressureSys || 120);
  const [localBmi, setLocalBmi] = useState<number>(Math.round(selectedPatient.bmi || 24));
  const [localHr, setLocalHr] = useState<number>(selectedPatient.vitals.heartRate || 72);

  // Sync when selected patient changes
  useEffect(() => {
    setLocalAge(selectedPatient.age);
    setLocalSbp(selectedPatient.vitals.bloodPressureSys || 120);
    setLocalBmi(Math.round(selectedPatient.bmi || 24));
    setLocalHr(selectedPatient.vitals.heartRate || 72);
  }, [selectedPatient.id]);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSliderChange = (key: 'age' | 'systolicBp' | 'bmi' | 'heartRate', val: number) => {
    if (key === 'age') setLocalAge(val);
    if (key === 'systolicBp') setLocalSbp(val);
    if (key === 'bmi') setLocalBmi(val);
    if (key === 'heartRate') setLocalHr(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setWhatIf({ [key]: val });
    }, 120);
  };

  const handleReset = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setLocalAge(selectedPatient.age);
    setLocalSbp(selectedPatient.vitals.bloodPressureSys || 120);
    setLocalBmi(Math.round(selectedPatient.bmi || 24));
    setLocalHr(selectedPatient.vitals.heartRate || 72);
    resetWhatIf();
  };

  const isHypothetical = Object.keys(whatIf).length > 0;

  // Compute baseline vs hypothetical deltas for each vessel
  const vessels: Vessel[] = ['LAD', 'LCX', 'RCA'];
  const deltas: Record<Vessel, number> = { LAD: 0, LCX: 0, RCA: 0 };

  vessels.forEach((v) => {
    const baselineScore = scoreVessel(selectedPatient, v, modalities).probability;
    const currentScore = prediction?.vesselPredictions?.[v]?.demoScore ?? baselineScore;
    deltas[v] = currentScore - baselineScore;
  });

  const renderDeltaChip = (vessel: Vessel) => {
    const d = deltas[vessel];
    let colorClass = 'text-slate-400 bg-white/5 border-white/10';
    let Icon = Minus;

    if (d > 0) {
      colorClass = 'text-rose-300 bg-rose-500/10 border-rose-500/30';
      Icon = TrendingUp;
    } else if (d < 0) {
      colorClass = 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30';
      Icon = TrendingDown;
    }

    return (
      <span
        key={vessel}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${colorClass}`}
        title={`${vessel} difference vs original baseline intake`}
      >
        <span className="font-bold">{vessel}</span>
        <Icon className="w-2.5 h-2.5" />
        <span>{d > 0 ? `+${d}` : d} pts</span>
      </span>
    );
  };

  return (
    <GlassCard borderVariant={isHypothetical ? 'cyan' : 'subtle'} padding="md" className="space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            What-If Scenario Exploration
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {isHypothetical ? (
            <Badge variant="cyan" className="text-[9px]">
              Hypothetical scenario
            </Badge>
          ) : (
            <span className="text-[10px] text-slate-400 font-sans">Baseline Intake</span>
          )}

          {isHypothetical && (
            <button
              type="button"
              onClick={handleReset}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[10px] flex items-center gap-1 transition-all"
              title="Reset sliders to baseline patient values"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <p className="text-[10px] text-slate-400 font-sans leading-tight">
        Simulate changes in clinical factors to observe how the transparent rule-based scorer shifts coronary vessel estimates in real time.
      </p>

      {/* Sliders Grid */}
      <div className="space-y-2.5 text-xs">
        {/* Age Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-300">Age</span>
            <span className="font-bold text-cyan-300">{localAge} yrs</span>
          </div>
          <input
            type="range"
            min={18}
            max={90}
            value={localAge}
            onChange={(e) => handleSliderChange('age', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Systolic BP Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-300">Systolic Blood Pressure</span>
            <span className="font-bold text-cyan-300">{localSbp} mmHg</span>
          </div>
          <input
            type="range"
            min={90}
            max={200}
            value={localSbp}
            onChange={(e) => handleSliderChange('systolicBp', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* BMI Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-300">Body Mass Index (BMI)</span>
            <span className="font-bold text-cyan-300">{localBmi} kg/m²</span>
          </div>
          <input
            type="range"
            min={16}
            max={40}
            value={localBmi}
            onChange={(e) => handleSliderChange('bmi', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Resting Heart Rate Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-300">Resting Heart Rate</span>
            <span className="font-bold text-cyan-300">{localHr} bpm</span>
          </div>
          <input
            type="range"
            min={40}
            max={140}
            value={localHr}
            onChange={(e) => handleSliderChange('heartRate', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* Delta Chips vs Baseline */}
      <div className="pt-2 border-t border-white/5 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>Shift vs Baseline:</span>
          <span className="text-slate-400 font-sans">Scorer points ($\Delta$)</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {vessels.map((v) => renderDeltaChip(v))}
        </div>
      </div>

      <div className="text-[9px] text-slate-400 font-sans italic pt-1 border-t border-white/5">
        Research prototype • not medical advice • instant deterministic recalculation.
      </div>
    </GlassCard>
  );
};
