"use client";

import { useState } from "react";
import type { MultipleChoiceStep } from "@/types/survey";

interface Props {
  step: MultipleChoiceStep;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  onContinue: () => void;
  disabled?: boolean;
  minimal?: boolean;
}

const btnMinimal = "px-6 py-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--survey-accent)]";
const btnImage = "px-6 py-3 rounded-xl bg-white text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/95 transition-colors";

export default function StepMultipleChoice({ step, value, onChange, onContinue, disabled, minimal = false }: Props) {
  const [otherText, setOtherText] = useState("");
  const selectedOption = step.options.find((o) => o.id === value);
  const isOther = selectedOption?.isOther === true;

  const canContinue =
    !step.required ||
    (value !== undefined && (!selectedOption?.isOther || otherText.trim() !== ""));

  return (
    <div className="w-full max-w-xl mx-auto">
      <h2 className={`text-2xl md:text-3xl font-semibold mb-2 ${minimal ? "text-[var(--survey-text)]" : "text-white"}`}>
        {step.question}
      </h2>
      {step.description && (
        <p className={minimal ? "text-[var(--survey-muted)] mb-6" : "text-white/80 mb-6"}>{step.description}</p>
      )}
      <div className="space-y-2">
        {step.options.map((opt) => (
          <label
            key={opt.id}
            className={
              minimal
                ? "flex items-center gap-3 p-4 rounded-lg border border-[var(--survey-muted)]/30 cursor-pointer hover:border-[var(--survey-accent)]/50 hover:bg-[var(--survey-accent)]/5 has-[:checked]:border-[var(--survey-accent)] has-[:checked]:bg-[var(--survey-accent)]/10"
                : "flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 cursor-pointer hover:bg-white/15 has-[:checked]:border-white/50 has-[:checked]:bg-white/15"
            }
          >
            <input
              type="radio"
              name={`step-${step.id}`}
              value={opt.id}
              checked={value === opt.id}
              onChange={() => onChange(opt.id)}
              className={minimal ? "w-4 h-4 text-[var(--survey-accent)] border-[var(--survey-muted)] focus:ring-[var(--survey-accent)]" : "w-4 h-4 text-white border-white/50 focus:ring-white/50"}
            />
            <span className={minimal ? "text-[var(--survey-text)]" : "text-white"}>{opt.label}</span>
          </label>
        ))}
      </div>
      {isOther && (
        <input
          type="text"
          value={otherText}
          onChange={(e) => setOtherText(e.target.value)}
          placeholder="Specifica..."
          className={
            minimal
              ? "mt-3 w-full py-3 bg-transparent border-0 border-b-2 border-[var(--survey-muted)]/40 text-[var(--survey-text)] placeholder-[var(--survey-muted)]/70 focus:outline-none focus:border-[var(--survey-accent)]"
              : "mt-3 w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
          }
        />
      )}
      <div className="mt-8">
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue || disabled}
          className={minimal ? btnMinimal : btnImage}
          style={minimal ? { backgroundColor: "var(--survey-accent)" } : undefined}
        >
          OK
        </button>
      </div>
    </div>
  );
}
