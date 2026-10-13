import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle2, RotateCcw, AlertCircle, Loader2, Sparkles, FileImage, ShieldAlert } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useAppStore } from '../../state/useAppStore';
import { callLlm } from '../../api/llm';
import { ECGMetrics } from '../../types/patient';

interface ExtractedValues {
  heartRate: number | null;
  prInterval: number | null;
  qrsDuration: number | null;
  qtcInterval: number | null;
  rhythm: string | null;
  confidence: 'low' | 'medium' | 'high';
  notes: string | null;
}

function downscaleImage(file: File, maxDim = 1280): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function validateAndFilter(raw: any): ExtractedValues {
  const parseNum = (v: any, min: number, max: number): number | null => {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (isNaN(n) || n < min || n > max) return null;
    return Math.round(n);
  };

  return {
    heartRate: parseNum(raw?.heartRate, 20, 250),
    prInterval: parseNum(raw?.prInterval, 60, 400),
    qrsDuration: parseNum(raw?.qrsDuration, 40, 250),
    qtcInterval: parseNum(raw?.qtcInterval, 250, 700),
    rhythm: typeof raw?.rhythm === 'string' && raw.rhythm.trim() ? raw.rhythm.trim() : null,
    confidence: ['low', 'medium', 'high'].includes(raw?.confidence) ? raw.confidence : 'low',
    notes: typeof raw?.notes === 'string' && raw.notes.trim() ? raw.notes.trim() : null,
  };
}

export const ECGUploadSection: React.FC = () => {
  const ecgOverride = useAppStore((s) => s.ecgOverride);
  const setEcgOverride = useAppStore((s) => s.setEcgOverride);
  const selectedPatient = useAppStore((s) => s.selectedPatient);

  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ExtractedValues>({
    heartRate: null,
    prInterval: null,
    qrsDuration: null,
    qtcInterval: null,
    rhythm: null,
    confidence: 'low',
    notes: null,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const base64 = await downscaleImage(file);
      const result = await callLlm<any>('ecg_extract', {
        mimeType: 'image/jpeg',
        base64,
      });

      if (result) {
        const validated = validateAndFilter(result);
        setFormValues(validated);
        setStatusMessage('Values extracted — please verify and confirm below.');
      } else {
        setStatusMessage('Could not read the image — enter values manually.');
        setFormValues({
          heartRate: null,
          prInterval: null,
          qrsDuration: null,
          qtcInterval: null,
          rhythm: null,
          confidence: 'low',
          notes: null,
        });
      }
    } catch {
      setStatusMessage('Could not read the image — enter values manually.');
    } finally {
      setIsProcessing(false);
      // Reset input value so same file can be selected again
      if (e.target) e.target.value = '';
    }
  };

  const handleApply = () => {
    const override: Partial<ECGMetrics> = {
      ...(formValues.heartRate !== null ? { heartRate: formValues.heartRate } : {}),
      ...(formValues.prInterval !== null ? { prInterval: formValues.prInterval } : {}),
      ...(formValues.qrsDuration !== null ? { qrsDuration: formValues.qrsDuration } : {}),
      ...(formValues.qtcInterval !== null ? { qtcInterval: formValues.qtcInterval } : {}),
      ...(formValues.rhythm !== null ? { rhythm: formValues.rhythm } : {}),
      ...(formValues.notes !== null ? { leadNotes: formValues.notes } : {}),
    };

    setEcgOverride(override);
    setStatusMessage('ECG values applied to active analysis.');
  };

  const handleClear = () => {
    setEcgOverride(null);
    setFormValues({
      heartRate: null,
      prInterval: null,
      qrsDuration: null,
      qtcInterval: null,
      rhythm: null,
      confidence: 'low',
      notes: null,
    });
    setStatusMessage('Reverted to patient baseline ECG.');
  };

  const isConfirmed = Boolean(ecgOverride);

  return (
    <div className="space-y-2 pt-2 border-t border-white/5 font-mono text-xs">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-violet-300 hover:text-white flex items-center gap-1.5 text-[11px] font-bold transition-colors"
        >
          <Camera className="w-3.5 h-3.5 text-violet-400" />
          <span>{isOpen ? 'Hide Paper ECG Upload' : 'Upload Paper ECG Photo'}</span>
        </button>

        {isConfirmed ? (
          <Badge variant="emerald" className="text-[9px]">
            ECG values confirmed by user from photo
          </Badge>
        ) : (
          <span className="text-[9px] text-slate-500">Assistive OCR extraction</span>
        )}
      </div>

      {isOpen && (
        <div className="p-3 rounded-xl bg-black/50 border border-violet-500/20 space-y-3 animate-fadeIn">
          {/* Safety & Instructions Banner */}
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[10px] space-y-0.5 font-sans leading-relaxed">
            <div className="flex items-center gap-1 font-bold text-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Assistive extraction — verify values manually. Do not upload real patient data.</span>
            </div>
            <p className="text-slate-300">
              Only synthetic demo ECG tracings are accepted. Image will be downscaled locally. Review all fields before applying.
            </p>
          </div>

          {/* Upload Input & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full sm:flex-1 py-1.5 px-3 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-200 border border-violet-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                  <span>Extracting printed intervals…</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-violet-400" />
                  <span>Choose Photo / Take Picture</span>
                </>
              )}
            </button>

            {isConfirmed && (
              <button
                type="button"
                onClick={handleClear}
                className="py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs flex items-center gap-1"
                title="Revert to baseline ECG"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Revert</span>
              </button>
            )}
          </div>

          {statusMessage && (
            <div className="text-[10px] text-cyan-300 font-sans">
              {statusMessage}
            </div>
          )}

          {/* Editable Confirmation Form */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-white font-bold uppercase">Extracted Values Confirmation</span>
              <span className="text-slate-400">
                Confidence:{' '}
                <span
                  className={`font-bold uppercase ${
                    formValues.confidence === 'high'
                      ? 'text-emerald-400'
                      : formValues.confidence === 'medium'
                      ? 'text-cyan-400'
                      : 'text-amber-400'
                  }`}
                >
                  {formValues.confidence}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* HR */}
              <div className="space-y-0.5">
                <label className="text-[10px] text-slate-400 block">Heart Rate (bpm)</label>
                <input
                  type="number"
                  min={20}
                  max={250}
                  value={formValues.heartRate ?? ''}
                  placeholder="e.g. 72"
                  onChange={(e) =>
                    setFormValues({ ...formValues, heartRate: e.target.value ? Number(e.target.value) : null })
                  }
                  className="w-full p-1.5 rounded bg-black/60 border border-white/10 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* PR */}
              <div className="space-y-0.5">
                <label className="text-[10px] text-slate-400 block">PR Interval (ms)</label>
                <input
                  type="number"
                  min={60}
                  max={400}
                  value={formValues.prInterval ?? ''}
                  placeholder="e.g. 160"
                  onChange={(e) =>
                    setFormValues({ ...formValues, prInterval: e.target.value ? Number(e.target.value) : null })
                  }
                  className="w-full p-1.5 rounded bg-black/60 border border-white/10 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* QRS */}
              <div className="space-y-0.5">
                <label className="text-[10px] text-slate-400 block">QRS Duration (ms)</label>
                <input
                  type="number"
                  min={40}
                  max={250}
                  value={formValues.qrsDuration ?? ''}
                  placeholder="e.g. 90"
                  onChange={(e) =>
                    setFormValues({ ...formValues, qrsDuration: e.target.value ? Number(e.target.value) : null })
                  }
                  className="w-full p-1.5 rounded bg-black/60 border border-white/10 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* QTc */}
              <div className="space-y-0.5">
                <label className="text-[10px] text-slate-400 block">QTc Interval (ms)</label>
                <input
                  type="number"
                  min={250}
                  max={700}
                  value={formValues.qtcInterval ?? ''}
                  placeholder="e.g. 415"
                  onChange={(e) =>
                    setFormValues({ ...formValues, qtcInterval: e.target.value ? Number(e.target.value) : null })
                  }
                  className="w-full p-1.5 rounded bg-black/60 border border-white/10 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Rhythm */}
              <div className="col-span-2 space-y-0.5">
                <label className="text-[10px] text-slate-400 block">Rhythm Classification</label>
                <input
                  type="text"
                  value={formValues.rhythm ?? ''}
                  placeholder="e.g. Normal Sinus Rhythm"
                  onChange={(e) => setFormValues({ ...formValues, rhythm: e.target.value || null })}
                  className="w-full p-1.5 rounded bg-black/60 border border-white/10 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div className="col-span-2 space-y-0.5">
                <label className="text-[10px] text-slate-400 block">Observable Findings / Lead Notes</label>
                <input
                  type="text"
                  value={formValues.notes ?? ''}
                  placeholder="e.g. Minimal lateral T-wave flattening"
                  onChange={(e) => setFormValues({ ...formValues, notes: e.target.value || null })}
                  className="w-full p-1.5 rounded bg-black/60 border border-white/10 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={handleApply}
              className="w-full mt-2 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Apply to Analysis</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
