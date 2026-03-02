"use client";

import type { Survey } from "@/types/survey";

interface SurveyStartProps {
  survey: Survey;
  onStart: () => void;
  hasImageBackground?: boolean;
}

export default function SurveyStart({ survey, onStart, hasImageBackground = false }: SurveyStartProps) {
  const isMinimal = !hasImageBackground;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {survey.companyName && (
        <p
          className={
            isMinimal
              ? "text-sm font-medium text-[var(--survey-muted)] uppercase tracking-wider mb-2"
              : "text-sm font-medium text-white/70 uppercase tracking-wider mb-2"
          }
        >
          {survey.companyName}
        </p>
      )}
      <h1
        className={`max-w-xl mb-3 text-3xl md:text-4xl font-semibold ${
          isMinimal ? "text-[var(--survey-text)]" : "text-white"
        }`}
      >
        {survey.title}
      </h1>
      {survey.subtitle && (
        <p
          className={
            isMinimal
              ? "text-lg text-[var(--survey-muted)] max-w-md mb-10"
              : "text-lg text-white/85 max-w-md mb-10"
          }
        >
          {survey.subtitle}
        </p>
      )}
      <button
        type="button"
        onClick={onStart}
        className={
          isMinimal
            ? "px-8 py-4 rounded-lg text-white font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--survey-accent)] focus:ring-offset-2"
            : "px-8 py-4 rounded-xl bg-white text-slate-900 font-semibold text-lg shadow-lg hover:bg-white/95 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        }
        style={isMinimal ? { backgroundColor: "var(--survey-accent)" } : undefined}
      >
        {isMinimal ? "Inizia" : "Start"}
      </button>
    </div>
  );
}
