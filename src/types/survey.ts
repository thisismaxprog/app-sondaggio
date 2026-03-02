// Step types for survey builder and rendering
export type StepType =
  | "short_text"
  | "multiple_choice"
  | "cascade"
  | "scale_1_5"
  | "info_block"
  | "contact";

// Base step (common fields)
export interface StepBase {
  id: string;
  type: StepType;
  question: string;
  description?: string;
  required?: boolean;
  order: number;
  /** Sfondo per questa pagina (JPEG/PNG). Se vuoto, usa quello della survey. */
  backgroundImageUrl?: string;
}

export interface ShortTextStep extends StepBase {
  type: "short_text";
  placeholder?: string;
}

export interface MultipleChoiceOption {
  id: string;
  label: string;
  /** Se true, mostra campo "Altro" con textbox */
  isOther?: boolean;
}

export interface MultipleChoiceStep extends StepBase {
  type: "multiple_choice";
  options: MultipleChoiceOption[];
}

export interface CascadeOption {
  id: string;
  label: string;
  /** stepId da mostrare se si sceglie questa opzione (dipendenza) */
  dependentStepId?: string;
}

export interface CascadeStep extends StepBase {
  type: "cascade";
  options: CascadeOption[];
}

export interface ScaleStep extends StepBase {
  type: "scale_1_5";
  /** Label per estremi, es. ["Per niente", "Molto"] */
  leftLabel?: string;
  rightLabel?: string;
}

export interface InfoBlockStep extends StepBase {
  type: "info_block";
  /** Nessuna risposta richiesta */
}

export interface ContactStep extends StepBase {
  type: "contact";
  /** Email e phone con validazione */
}

export type SurveyStep =
  | ShortTextStep
  | MultipleChoiceStep
  | CascadeStep
  | ScaleStep
  | InfoBlockStep
  | ContactStep;

export interface Survey {
  id?: string;
  companyName: string;
  title: string;
  subtitle: string;
  backgroundImageUrl?: string;
  steps: SurveyStep[];
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string;
}

export interface ResponseAnswer {
  [stepId: string]: string | number | ContactInfo | { email?: string; phone?: string } | undefined;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface SurveyResponse {
  id?: string;
  surveyId: string;
  createdAt: number;
  answers: ResponseAnswer;
  contact?: ContactInfo;
}

export interface ContactLead {
  id?: string;
  surveyId: string;
  email: string;
  phone: string;
  createdAt: number;
  partialAnswers?: ResponseAnswer;
}

// Helper: step richiede risposta utente?
export function stepCollectsAnswer(step: SurveyStep): boolean {
  return step.type !== "info_block";
}

// Helper: step è contact?
export function isContactStep(step: SurveyStep): step is ContactStep {
  return step.type === "contact";
}
