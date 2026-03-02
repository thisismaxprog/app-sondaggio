"use client";

import type { CascadeStep } from "@/types/survey";

interface Props {
  step: CascadeStep;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  onContinue: () => void;
  disabled?: boolean;
  minimal?: boolean;
}

export default function StepCascade({ step, value, onChange, onContinue, disabled, minimal = false }: Props) {
  const canContinue = !step.required || value !== undefined;

  return (
    <div className="w-full max-w-xl mx-auto">
      <h2 className={`text-2xl md:text-3xl font-semibold mb-2 ${minimal ? "text-[var(--survey-text)]" : "text-white"}`}>
        {step.question}
      </h2>
      {step.description && (
        <p className={minimal ? "text-[var(--survey-muted)] mb-6" : "text-white/80 mb-6"}>{step.description}</p>
      )}
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className={
          minimal
            ? "w-full py-3 bg-transparent border-0 border-b-2 border-[var(--survey-muted)]/40 text-[var(--survey-text)] focus:outline-none focus:border-[var(--survey-accent)] appearance-none bg-no-repeat bg-[length:1rem] bg-[right_0_center] pr-8"
            : "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40 appearance-none bg-no-repeat bg-[length:1rem] bg-[right_0.75rem_center] pr-10"
        }
        style={{
          backgroundImage: minimal
            ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a6b5c'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`
            : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.8)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      >
        <option value="" className={minimal ? "bg-[var(--survey-bg)] text-[var(--survey-text)]" : "bg-slate-800 text-white"}>
          Seleziona...
        </option>
        {step.options.map((opt) => (
          <option key={opt.id} value={opt.id} className={minimal ? "bg-[var(--survey-bg)] text-[var(--survey-text)]" : "bg-slate-800 text-white"}>
            {opt.label}
          </option>
        ))}
      </select>
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
