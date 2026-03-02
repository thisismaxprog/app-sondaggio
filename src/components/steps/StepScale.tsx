"use client";

import type { ScaleStep } from "@/types/survey";

interface Props {
  step: ScaleStep;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  onContinue: () => void;
  disabled?: boolean;
  minimal?: boolean;
}

const SCALE = [1, 2, 3, 4, 5];

export default function StepScale({ step, value, onChange, onContinue, disabled, minimal = false }: Props) {
  const canContinue = !step.required || (value !== undefined && value >= 1 && value <= 5);

  return (
    <div className="w-full max-w-xl mx-auto">
      <h2 className={`text-2xl md:text-3xl font-semibold mb-2 ${minimal ? "text-[var(--survey-text)]" : "text-white"}`}>
        {step.question}
      </h2>
      {step.description && (
        <p className={minimal ? "text-[var(--survey-muted)] mb-6" : "text-white/80 mb-6"}>{step.description}</p>
      )}
      {(step.leftLabel || step.rightLabel) && (
        <div className={`flex justify-between text-sm mb-2 ${minimal ? "text-[var(--survey-muted)]" : "text-white/70"}`}>
          <span>{step.leftLabel ?? ""}</span>
          <span>{step.rightLabel ?? ""}</span>
        </div>
      )}
      <div className="flex gap-2 flex-wrap justify-center">
        {SCALE.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={
              value === n
                ? minimal
                  ? "w-12 h-12 rounded-lg font-medium bg-[var(--survey-accent)] text-white"
                  : "w-12 h-12 rounded-xl font-medium bg-white text-slate-900"
                : minimal
                  ? "w-12 h-12 rounded-lg font-medium border-2 border-[var(--survey-muted)]/40 text-[var(--survey-text)] hover:border-[var(--survey-accent)] hover:bg-[var(--survey-accent)]/10"
                  : "w-12 h-12 rounded-xl font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20"
            }
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue || disabled}
          className={minimal ? "px-6 py-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--survey-accent)]" : "px-6 py-3 rounded-xl bg-white text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/95 transition-colors"}
          style={minimal ? { backgroundColor: "var(--survey-accent)" } : undefined}
        >
          OK
        </button>
      </div>
    </div>
  );
}
