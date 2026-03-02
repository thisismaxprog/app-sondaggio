"use client";

import { useState, useCallback } from "react";
import type {
  Survey,
  SurveyStep,
  StepType,
  ShortTextStep,
  MultipleChoiceStep,
  MultipleChoiceOption,
  CascadeStep,
  CascadeOption,
  ScaleStep,
  InfoBlockStep,
  ContactStep,
} from "@/types/survey";
import { demoSurvey } from "@/data/demoSurvey";

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

const STEP_TYPES: { value: StepType; label: string }[] = [
  { value: "short_text", label: "Testo breve" },
  { value: "multiple_choice", label: "Scelta multipla" },
  { value: "cascade", label: "Dropdown (cascata)" },
  { value: "scale_1_5", label: "Scala 1-5" },
  { value: "info_block", label: "Blocco informativo" },
  { value: "contact", label: "Contatti (email + telefono)" },
];

function createEmptyStep(type: StepType, order: number): SurveyStep {
  const base = {
    id: generateId(),
    type,
    question: "",
    description: "",
    required: false,
    order,
  };
  switch (type) {
    case "short_text":
      return { ...base, type: "short_text", placeholder: "" } as ShortTextStep;
    case "multiple_choice":
      return { ...base, type: "multiple_choice", options: [{ id: generateId(), label: "Opzione 1" }] } as MultipleChoiceStep;
    case "cascade":
      return { ...base, type: "cascade", options: [{ id: generateId(), label: "Opzione 1" }] } as CascadeStep;
    case "scale_1_5":
      return { ...base, type: "scale_1_5", leftLabel: "Per niente", rightLabel: "Molto" } as ScaleStep;
    case "info_block":
      return { ...base, type: "info_block" } as InfoBlockStep;
    case "contact":
      return { ...base, type: "contact" } as ContactStep;
    default:
      return { ...base, type: "short_text" } as ShortTextStep;
  }
}

interface AdminSurveyEditorProps {
  initial: Partial<Survey>;
  onSave: (data: Omit<Survey, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  saving?: boolean;
}

export default function AdminSurveyEditor({ initial, onSave, saving = false }: AdminSurveyEditorProps) {
  const [companyName, setCompanyName] = useState(initial.companyName ?? "");
  const [title, setTitle] = useState(initial.title ?? "");
  const [subtitle, setSubtitle] = useState(initial.subtitle ?? "");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(initial.backgroundImageUrl ?? "");
  const [steps, setSteps] = useState<SurveyStep[]>(() => {
    const s = initial.steps?.slice().sort((a, b) => a.order - b.order) ?? [];
    return s.length ? s : [createEmptyStep("short_text", 0)];
  });

  const loadDemo = useCallback(() => {
    setCompanyName(demoSurvey.companyName);
    setTitle(demoSurvey.title);
    setSubtitle(demoSurvey.subtitle);
    setBackgroundImageUrl(demoSurvey.backgroundImageUrl ?? "");
    setSteps(
      demoSurvey.steps.map((st, i) => ({ ...st, id: st.id ?? generateId(), order: i }))
    );
  }, []);

  const updateStep = useCallback((index: number, updater: (s: SurveyStep) => SurveyStep) => {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = updater(next[index]);
      return next.map((st, i) => ({ ...st, order: i }));
    });
  }, []);

  const addStep = useCallback(() => {
    setSteps((prev) => [...prev, createEmptyStep("short_text", prev.length)].map((st, i) => ({ ...st, order: i })));
  }, []);

  const removeStep = useCallback((index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index).map((st, i) => ({ ...st, order: i })));
  }, []);

  const moveStep = useCallback((index: number, delta: number) => {
    setSteps((prev) => {
      const next = [...prev];
      const j = index + delta;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next.map((st, i) => ({ ...st, order: i }));
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await onSave({
        companyName: companyName.trim(),
        title: title.trim(),
        subtitle: subtitle.trim(),
        backgroundImageUrl: backgroundImageUrl.trim() || undefined,
        steps: steps.map((s, i) => ({ ...s, order: i })),
      });
    },
    [companyName, title, subtitle, backgroundImageUrl, steps, onSave]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-2xl bg-white/90 border border-[var(--survey-accent)]/20 p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[var(--survey-text-on-light)]">Informazioni survey</h2>
          <button
            type="button"
            onClick={loadDemo}
            className="text-sm text-[var(--survey-muted-on-light)] hover:text-[var(--survey-accent)] underline"
          >
            Usa template demo
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nome azienda</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Es. La mia azienda"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Titolo</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo della survey"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sottotitolo</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Breve descrizione"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sfondo survey (JPEG/PNG, es. mascotte)</label>
          <input
            type="url"
            value={backgroundImageUrl}
            onChange={(e) => setBackgroundImageUrl(e.target.value)}
            placeholder="https://... (opzionale: immagine full-screen per tutte le pagine)"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--survey-accent)] focus:border-[var(--survey-accent)]"
          />
          <p className="text-xs text-slate-500 mt-1">Se vuoto: sfondo verde chiaro minimal. Puoi anche impostare uno sfondo diverso per ogni step sotto.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white/90 border border-[var(--survey-accent)]/20 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--survey-text-on-light)]">Step (pagine del sondaggio)</h2>
          <button
            type="button"
            onClick={addStep}
            className="px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--survey-accent)]"
            style={{ backgroundColor: "var(--survey-accent)" }}
          >
            + Aggiungi step
          </button>
        </div>
        <ul className="space-y-4">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="border border-[var(--survey-muted)]/30 rounded-xl p-4 bg-[var(--survey-bg)]/50"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-sm font-medium text-slate-600">
                  Step {index + 1} – {STEP_TYPES.find((t) => t.value === step.type)?.label ?? step.type}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveStep(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 rounded text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                    title="Sposta su"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStep(index, 1)}
                    disabled={index === steps.length - 1}
                    className="p-1.5 rounded text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                    title="Sposta giù"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    disabled={steps.length <= 1}
                    className="p-1.5 rounded text-red-600 hover:bg-red-50 disabled:opacity-40"
                    title="Rimuovi"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
                  <select
                    value={step.type}
                    onChange={(e) => {
                      const newStep = createEmptyStep(e.target.value as StepType, index);
                      newStep.id = step.id;
                      updateStep(index, () => newStep);
                    }}
                    className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
                  >
                    {STEP_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Domanda / Titolo</label>
                  <input
                    type="text"
                    value={step.question}
                    onChange={(e) => updateStep(index, (s) => ({ ...s, question: e.target.value }))}
                    placeholder="Testo della domanda"
                    className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Descrizione (opzionale)</label>
                  <textarea
                    value={step.description ?? ""}
                    onChange={(e) => updateStep(index, (s) => ({ ...s, description: e.target.value }))}
                    placeholder="Testo aggiuntivo"
                    rows={2}
                    className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={step.required ?? false}
                    onChange={(e) => updateStep(index, (s) => ({ ...s, required: e.target.checked }))}
                    className="rounded border-slate-300"
                  />
                  <span className="text-xs text-slate-600">Obbligatorio</span>
                </label>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Sfondo questa pagina (opzionale)</label>
                  <input
                    type="url"
                    value={step.backgroundImageUrl ?? ""}
                    onChange={(e) => updateStep(index, (s) => ({ ...s, backgroundImageUrl: e.target.value.trim() || undefined }))}
                    placeholder="URL JPEG/PNG (lascia vuoto per usare lo sfondo survey)"
                    className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
                  />
                </div>

                {step.type === "short_text" && (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Placeholder</label>
                    <input
                      type="text"
                      value={(step as ShortTextStep).placeholder ?? ""}
                      onChange={(e) => updateStep(index, (s) => ({ ...s, placeholder: e.target.value }))}
                      className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
                    />
                  </div>
                )}

                {(step.type === "multiple_choice" || step.type === "cascade") && (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Opzioni</label>
                    {(step.type === "multiple_choice"
                      ? (step as MultipleChoiceStep).options
                      : (step as CascadeStep).options
                    ).map((opt, optIndex) => (
                      <div key={opt.id} className="flex gap-2 items-center mb-2">
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => {
                            updateStep(index, (s) => {
                              const opts = s.type === "multiple_choice"
                                ? (s as MultipleChoiceStep).options
                                : (s as CascadeStep).options;
                              const next = opts.map((o, i) =>
                                i === optIndex ? { ...o, label: e.target.value } : o
                              );
                              return s.type === "multiple_choice"
                                ? { ...s, options: next } as MultipleChoiceStep
                                : { ...s, options: next } as CascadeStep;
                            });
                          }}
                          className="flex-1 px-2 py-1.5 rounded border border-slate-300 text-sm"
                        />
                        {step.type === "multiple_choice" && (
                          <label className="flex items-center gap-1 text-xs text-slate-600">
                            <input
                              type="checkbox"
                              checked={(opt as MultipleChoiceOption).isOther ?? false}
                              onChange={(e) => {
                                updateStep(index, (s) => {
                                  const st = s as MultipleChoiceStep;
                                  const next = st.options.map((o, i) =>
                                    i === optIndex ? { ...o, isOther: e.target.checked } : o
                                  );
                                  return { ...st, options: next };
                                });
                              }}
                            />
                            Altro
                          </label>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            updateStep(index, (s) => {
                              const opts = s.type === "multiple_choice"
                                ? (s as MultipleChoiceStep).options
                                : (s as CascadeStep).options;
                              if (opts.length <= 1) return s;
                              const next = opts.filter((_, i) => i !== optIndex);
                              return s.type === "multiple_choice"
                                ? { ...s, options: next } as MultipleChoiceStep
                                : { ...s, options: next } as CascadeStep;
                            });
                          }}
                          className="text-red-600 text-xs hover:underline"
                        >
                          Rimuovi
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        updateStep(index, (s) => {
                          const opts = s.type === "multiple_choice"
                            ? (s as MultipleChoiceStep).options
                            : (s as CascadeStep).options;
                          const newOpt = { id: generateId(), label: `Opzione ${opts.length + 1}` };
                          if (s.type === "multiple_choice") {
                            return { ...s, options: [...opts, newOpt] } as MultipleChoiceStep;
                          }
                          return { ...s, options: [...opts, newOpt] } as CascadeStep;
                        });
                      }}
                      className="text-sm text-slate-600 hover:underline"
                    >
                      + Aggiungi opzione
                    </button>
                  </div>
                )}

                {step.type === "scale_1_5" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Label sinistra (1)</label>
                      <input
                        type="text"
                        value={(step as ScaleStep).leftLabel ?? ""}
                        onChange={(e) => updateStep(index, (s) => ({ ...s, leftLabel: e.target.value }))}
                        className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Label destra (5)</label>
                      <input
                        type="text"
                        value={(step as ScaleStep).rightLabel ?? ""}
                        onChange={(e) => updateStep(index, (s) => ({ ...s, rightLabel: e.target.value }))}
                        className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="px-6 py-2.5 rounded-lg text-white font-medium disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--survey-accent)]"
          style={{ backgroundColor: "var(--survey-accent)" }}
        >
          {saving ? "Salvataggio..." : "Salva survey"}
        </button>
      </div>
    </form>
  );
}
