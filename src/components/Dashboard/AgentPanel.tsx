import React, { useState } from 'react';
import { Bot, Play, CheckCircle2, ChevronRight, Loader2, Sparkles, Layers, ShieldAlert, AlertCircle } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { useAppStore } from '../../state/useAppStore';
import { runEvidenceAgent, AgentRunResult } from '../../agent/missingEvidenceAgent';

export const AgentPanel: React.FC = () => {
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const modalities = useAppStore((s) => s.modalities);
  const getEffectivePatient = useAppStore((s) => s.getEffectivePatient);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AgentRunResult | null>(null);

  const handleRunAgent = async () => {
    setIsLoading(true);
    try {
      const patient = getEffectivePatient();
      const agentRes = await runEvidenceAgent(patient, selectedVessel, modalities);
      setResult(agentRes);
    } catch {
      // Deterministic fallback already handled in runEvidenceAgent
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard borderVariant="violet" glow={true} padding="md" className="space-y-3.5 select-none font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-violet-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Missing-Evidence Agent
          </h3>
        </div>

        <Badge variant="violet" className="text-[9px]">
          TOOL-USING AGENT
        </Badge>
      </div>

      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
        Systematically inspects active evidence, runs counterfactual scorer evaluations, consults clinical guideline criteria, and synthesizes the highest-yield diagnostic next steps.
      </p>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleRunAgent}
        disabled={isLoading}
        className="w-full py-2 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-200 border border-violet-500/30 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
            <span>EXECUTING AGENT WORKFLOW…</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
            <span>RUN EVIDENCE AGENT</span>
          </>
        )}
      </button>

      {/* Agent Trace Logs */}
      {result && (
        <div className="space-y-3 pt-2 border-t border-white/5 animate-fadeIn">
          {/* Tool Execution Trace */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">
              Step-by-Step Agent Trace
            </span>
            <div className="space-y-1.5 p-2 rounded-xl bg-black/50 border border-white/5 text-[10px]">
              {result.steps.map((st, idx) => (
                <div key={idx} className="p-1.5 rounded bg-white/[0.02] border border-white/5 space-y-0.5">
                  <div className="flex items-center justify-between text-violet-300 font-bold">
                    <span className="flex items-center gap-1">
                      <ChevronRight className="w-2.5 h-2.5 text-cyan-400" />
                      <span>{st.tool}()</span>
                    </span>
                    <span className="text-[9px] text-slate-500">{st.timestamp}</span>
                  </div>
                  <div className="text-slate-400 pl-3">
                    <span className="text-slate-500">In: </span>
                    <span>{st.input}</span>
                  </div>
                  <div className="text-slate-200 pl-3 font-sans">
                    <span className="text-emerald-400">Out: </span>
                    <span>{st.output}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranked Missing Evidence List */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">
              Most Informative Evidence to Collect Next
            </span>
            <div className="space-y-1.5">
              {result.ranking.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-start justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-bold text-xs">{idx + 1}. {item.label}</span>
                      {item.isConfirmatory ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                          CONFIRMATORY
                        </span>
                      ) : item.rankFlipped ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                          TERRITORY FLIP
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {item.rationale}
                    </p>
                  </div>

                  {!item.isConfirmatory && (
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-extrabold text-cyan-300 block">
                        {item.delta > 0 ? `+${item.delta}` : item.delta} pts
                      </span>
                      <span className="text-[9px] text-slate-500">projected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Plain Text Explanation */}
          <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-violet-300 font-bold uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-violet-400" />
                <span>Agent Synthesis & Explanation</span>
              </span>
              {result.isFallback ? (
                <span className="text-[9px] text-amber-300 px-1.5 py-0.2 rounded bg-amber-500/10">
                  DETERMINISTIC FALLBACK
                </span>
              ) : (
                <span className="text-[9px] text-cyan-300 px-1.5 py-0.2 rounded bg-cyan-500/10">
                  LLM EXPLANATION
                </span>
              )}
            </div>
            <p className="text-xs text-slate-200 font-sans leading-relaxed pt-1">
              "{result.explanation}"
            </p>
          </div>
        </div>
      )}

      {/* Safety & Methodology Footer */}
      <div className="pt-1.5 border-t border-white/5 space-y-1 text-[9px] font-sans text-slate-400">
        <p>
          * Tool-using agent: probabilities computed exclusively by the transparent rule-based scorer; LLM used only for explanation synthesis.
        </p>
        <p className="italic text-slate-500">
          Research prototype • not medical advice • clinical evaluation always required.
        </p>
      </div>
    </GlassCard>
  );
};
