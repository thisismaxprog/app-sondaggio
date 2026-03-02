"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSurvey, submitResponse, saveContact } from "@/lib/firestore";
import type { Survey, SurveyStep, ResponseAnswer, ContactInfo } from "@/types/survey";
import { stepCollectsAnswer, isContactStep } from "@/types/survey";
import SurveyStart from "@/components/SurveyStart";
import SurveyStepRenderer from "@/components/SurveyStepRenderer";
import ProgressBar from "@/components/ProgressBar";

const STORAGE_KEY_PREFIX = "survey_";
const COOLDOWN_MS = 2000;
const HONEYPOT_NAME = "website_url";

function getStorageKey(surveyId: string): string {
  return `${STORAGE_KEY_PREFIX}${surveyId}`;
}

function loadFromStorage(surveyId: string): ResponseAnswer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getStorageKey(surveyId));
    return raw ? (JSON.parse(raw) as ResponseAnswer) : null;
  } catch {
    return null;
  }
}

function saveToStorage(surveyId: string, answers: ResponseAnswer): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(surveyId), JSON.stringify(answers));
  } catch {}
}

export default function TakeSurveyPage({ params }: { params: Promise<{ surveyId: string }> }) {
  const { surveyId } = use(params);
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<ResponseAnswer>({});
  const [honeypot, setHoneypot] = useState("");
  const [lastSubmitAt, setLastSubmitAt] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // TODO: opzionale reCAPTCHA v3 per ridurre ulteriormente lo spam (NEXT_PUBLIC_RECAPTCHA_SITE_KEY)

  // Fetch survey
  useEffect(() => {
    getSurvey(surveyId)
      .then((s) => {
        if (s) setSurvey(s);
        else setError("Sondaggio non trovato.");
        setLoading(false);
      })
      .catch(() => {
        setError("Errore di caricamento.");
        setLoading(false);
      });
  }, [surveyId]);

  // Restore from localStorage
  useEffect(() => {
    if (!surveyId || !survey) return;
    const stored = loadFromStorage(surveyId);
    if (stored && Object.keys(stored).length > 0) {
      setAnswers(stored);
    }
  }, [surveyId, survey]);

  // Persist to localStorage when answers change
  useEffect(() => {
    if (!surveyId || Object.keys(answers).length === 0) return;
    saveToStorage(surveyId, answers);
  }, [surveyId, answers]);

  const steps = useMemo(
    () => survey?.steps?.slice().sort((a, b) => a.order - b.order) ?? [],
    [survey?.steps]
  );
  const totalSteps = steps.length;
  const isStart = stepIndex === 0;
  const isThankYou = stepIndex > totalSteps && totalSteps > 0;
  const currentStep = stepIndex >= 1 && stepIndex <= totalSteps ? steps[stepIndex - 1] : undefined;

  const answerForStep = useCallback(
    (step: SurveyStep) => {
      const v = answers[step.id];
      if (isContactStep(step) && v && typeof v === "object" && "email" in v) {
        return v as ContactInfo;
      }
      return v;
    },
    [answers]
  );

  const setAnswerForStep = useCallback(
    (stepId: string, value: string | number | ContactInfo | { email?: string; phone?: string } | undefined) => {
      if (value !== undefined && typeof value === "object" && value !== null && "nativeEvent" in value) {
        return;
      }
      setAnswers((prev) => ({ ...prev, [stepId]: value }));
    },
    []
  );

  const goNext = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, totalSteps + 1));
  }, [totalSteps]);

  const goBack = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleContactSubmit = useCallback(
    async (email: string, phone: string) => {
      await saveContact(surveyId, email, phone, answers);
    },
    [surveyId, answers]
  );

  const handleSubmitFinal = useCallback(
    async (contactFromStep?: ContactInfo) => {
      if (!survey) return;
      if (honeypot) return; // bot
      const now = Date.now();
      if (now - lastSubmitAt < COOLDOWN_MS) return;
      setLastSubmitAt(now);
      setSubmitting(true);
      try {
        const contactStep = steps.find(isContactStep);
        const contact =
          contactFromStep ??
          (contactStep ? (answers[contactStep.id] as ContactInfo | undefined) : undefined);
        const answersToSend = { ...answers };
        if (contactStep && contact) {
          answersToSend[contactStep.id] = contact;
        }
        await submitResponse(surveyId, answersToSend, contact);
        if (typeof window !== "undefined") {
          localStorage.removeItem(getStorageKey(surveyId));
        }
        setAnswers({});
        goNext();
      } catch (e) {
        console.error(e);
      } finally {
        setSubmitting(false);
      }
    },
    [survey, surveyId, steps, answers, honeypot, lastSubmitAt, goNext]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-white/80">Caricamento...</p>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-white/80">{error ?? "Sondaggio non trovato."}</p>
      </div>
    );
  }

  const bgImageUrl = isStart
    ? survey.backgroundImageUrl
    : (currentStep?.backgroundImageUrl ?? survey.backgroundImageUrl);
  const hasImageBackground = !!bgImageUrl;

  const bgStyle = hasImageBackground
    ? {
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { backgroundColor: "#b8c4b8" };

  return (
    <div
      className="min-h-screen flex flex-col relative transition-colors"
      style={bgStyle}
    >
      {hasImageBackground && (
        <div className="absolute inset-0 bg-black/35" aria-hidden />
      )}
      <div
        className={`relative z-10 flex flex-col min-h-screen px-4 py-6 md:py-8 ${
          hasImageBackground ? "survey-theme-image" : "survey-theme-minimal"
        }`}
      >
        <form
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col flex-1"
        >
          {/* Honeypot */}
          <input
            type="text"
            name={HONEYPOT_NAME}
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            aria-hidden
          />

          {isStart && (
            <SurveyStart onStart={goNext} survey={survey} hasImageBackground={!!survey.backgroundImageUrl} />
          )}

          {!isStart && !isThankYou && currentStep && (
            <>
              <div className="mb-6">
                <ProgressBar
                  current={stepIndex}
                  total={totalSteps}
                  minimal={!hasImageBackground}
                />
              </div>
                <SurveyStepRenderer
                  minimal={!hasImageBackground}
                  stepNumber={stepIndex}
                  step={currentStep}
                  value={answerForStep(currentStep)}
                  onChange={(v) => setAnswerForStep(currentStep.id, v)}
                  onContinue={(contactFromStep) => {
                    if (stepIndex === totalSteps) {
                      handleSubmitFinal(
                        isContactStep(currentStep) ? contactFromStep : undefined
                      );
                    } else {
                      goNext();
                    }
                  }}
                  isSubmitting={submitting}
                  onContactSubmit={isContactStep(currentStep) ? handleContactSubmit : undefined}
                />
              {stepIndex > 0 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={goBack}
                    className={hasImageBackground ? "text-white/80 hover:text-white text-sm" : "text-[var(--survey-muted)] hover:text-[var(--survey-text)] text-sm"}
                  >
                    ← Indietro
                  </button>
                </div>
              )}
            </>
          )}

          {isThankYou && (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <h2 className={`text-2xl md:text-3xl font-semibold mb-2 ${hasImageBackground ? "text-white" : "text-[var(--survey-text)]"}`}>
                Grazie
              </h2>
              <p className={hasImageBackground ? "text-white/85" : "text-[var(--survey-muted)]"}>
                Le tue risposte sono state inviate correttamente.
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Logo panda in basso a destra (SVG nitido come thegymbuddies) */}
      <div
        className="fixed bottom-4 right-4 z-20 w-20 h-20 md:w-24 md:h-24 pointer-events-none flex items-center justify-center"
        aria-hidden
      >
        <img
          src="/panda-logo.png"
          alt=""
          width={96}
          height={96}
          className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-md"
          style={{ imageRendering: "crisp-edges" }}
        />
      </div>
    </div>
  );
}
