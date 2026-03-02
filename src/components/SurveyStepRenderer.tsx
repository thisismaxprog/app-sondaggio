"use client";

import { useCallback } from "react";
import type { SurveyStep } from "@/types/survey";
import StepShortText from "./steps/StepShortText";
import StepMultipleChoice from "./steps/StepMultipleChoice";
import StepCascade from "./steps/StepCascade";
import StepScale from "./steps/StepScale";
import StepInfoBlock from "./steps/StepInfoBlock";
import StepContact from "./steps/StepContact";

interface SurveyStepRendererProps {
  step: SurveyStep;
  value: string | number | { email?: string; phone?: string } | undefined;
  onChange: (value: string | number | { email?: string; phone?: string } | undefined) => void;
  onContinue: (contact?: { email: string; phone: string }) => void;
  isSubmitting?: boolean;
  onContactSubmit?: (email: string, phone: string) => Promise<void>;
  isLastStep?: boolean;
  minimal?: boolean;
  /** Numero step (1-based) per box nero nello step contatti */
  stepNumber?: number;
}

export default function SurveyStepRenderer({
  step,
  value,
  onChange,
  onContinue,
  isSubmitting = false,
  onContactSubmit,
  isLastStep = false,
  minimal = false,
  stepNumber = 1,
}: SurveyStepRendererProps) {
  const handleContinue = useCallback(
    (contact?: { email: string; phone: string }) => {
      onContinue(contact);
    },
    [onContinue]
  );

  switch (step.type) {
    case "short_text":
      return (
        <StepShortText
          step={step}
          value={value as string | undefined}
          onChange={onChange as (v: string | undefined) => void}
          onContinue={handleContinue}
          disabled={isSubmitting}
          minimal={minimal}
        />
      );
    case "multiple_choice":
      return (
        <StepMultipleChoice
          step={step}
          value={value as string | undefined}
          onChange={onChange as (v: string | undefined) => void}
          onContinue={handleContinue}
          disabled={isSubmitting}
          minimal={minimal}
        />
      );
    case "cascade":
      return (
        <StepCascade
          step={step}
          value={value as string | undefined}
          onChange={onChange as (v: string | undefined) => void}
          onContinue={handleContinue}
          disabled={isSubmitting}
          minimal={minimal}
        />
      );
    case "scale_1_5":
      return (
        <StepScale
          step={step}
          value={value as number | undefined}
          onChange={onChange as (v: number | undefined) => void}
          onContinue={handleContinue}
          disabled={isSubmitting}
          minimal={minimal}
        />
      );
    case "info_block":
      return (
        <StepInfoBlock step={step} onContinue={handleContinue} disabled={isSubmitting} minimal={minimal} />
      );
    case "contact":
      return (
        <StepContact
          step={step}
          value={value as { email?: string; phone?: string } | undefined}
          onChange={onChange as (v: { email?: string; phone?: string } | undefined) => void}
          onContinue={(c) => handleContinue(c)}
          onContactSubmit={onContactSubmit}
          disabled={isSubmitting}
          minimal={minimal}
          stepNumber={stepNumber}
        />
      );
    default:
      return (
        <div className="w-full max-w-xl mx-auto rounded-xl border-2 border-amber-400 bg-amber-50 p-6 text-amber-900">
          <p className="font-medium">Step non supportato</p>
          <p className="text-sm mt-1">Tipo: {String((step as SurveyStep & { type?: string }).type ?? "sconosciuto")}. Aggiungi uno step &quot;Contatti (email + telefono)&quot; dall’editor per raccogliere email e telefono.</p>
        </div>
      );
  }
}
