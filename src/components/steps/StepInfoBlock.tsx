"use client";

import type { InfoBlockStep } from "@/types/survey";

interface Props {
  step: InfoBlockStep;
  onContinue: () => void;
  disabled?: boolean;
  minimal?: boolean;
}

export default function StepInfoBlock({ step, onContinue, disabled, minimal = false }: Props) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <h2 className={`text-2xl md:text-3xl font-semibold mb-2 ${minimal ? "text-[var(--survey-text)]" : "text-white"}`}>
        {step.question}
      </h2>
      {step.description && (
        <p className={`mb-8 whitespace-pre-line ${minimal ? "text-[var(--survey-muted)]" : "text-white/80"}`}>
          {step.description}
        </p>
      )}
      <button
        type="button"
        onClick={onContinue}
        disabled={disabled}
        className={minimal ? "px-6 py-3 rounded-lg text-white font-medium disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--survey-accent)]" : "px-6 py-3 rounded-xl bg-white text-slate-900 font-medium disabled:opacity-50 hover:bg-white/95 transition-colors"}
        style={minimal ? { backgroundColor: "var(--survey-accent)" } : undefined}
      >
        OK
      </button>
    </div>
  );
}
