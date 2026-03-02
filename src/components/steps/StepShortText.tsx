"use client";

import type { ShortTextStep } from "@/types/survey";

interface Props {
  step: ShortTextStep;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  onContinue: () => void;
  disabled?: boolean;
  minimal?: boolean;
}

export default function StepShortText({ step, value, onChange, onContinue, disabled, minimal = false }: Props) {
  const canContinue = !step.required || (value !== undefined && String(value).trim() !== "");

  return (
    <div className="w-full max-w-xl mx-auto">
      <h2
        className={`text-2xl md:text-3xl font-semibold mb-2 ${
          minimal ? "text-[var(--survey-text)]" : "text-white"
        }`}
      >
        {step.question}
      </h2>
      {step.description && (
        <p className={minimal ? "text-[var(--survey-muted)] mb-6" : "text-white/80 mb-6"}>
          {step.description}
        </p>
      )}
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        placeholder={step.placeholder ?? "Type or select an option"}
        className={
          minimal
            ? "w-full py-3 bg-transparent border-0 border-b-2 border-[var(--survey-muted)]/40 text-[var(--survey-text)] placeholder-[var(--survey-muted)]/70 focus:outline-none focus:border-[var(--survey-accent)] focus:ring-0"
            : "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
        }
        autoFocus
      />
      <div className="mt-8">
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue || disabled}
          className={
            minimal
              ? "px-6 py-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--survey-accent)]"
              : "px-6 py-3 rounded-xl bg-white text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/95 transition-colors"
          }
          style={minimal ? { backgroundColor: "var(--survey-accent)" } : undefined}
        >
          OK
        </button>
      </div>
    </div>
  );
}
