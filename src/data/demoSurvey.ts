import type { Survey } from "@/types/survey";

export const demoSurvey: Omit<Survey, "id" | "createdAt" | "updatedAt"> = {
  companyName: "Demo Company",
  title: "Sondaggio di esempio",
  subtitle: "Queste poche domande ci aiutano a migliorare il servizio.",
  backgroundImageUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920",
  steps: [
    {
      id: "step-welcome",
      type: "info_block",
      question: "Benvenuto",
      description: "Questo sondaggio è composto da 5 step. Puoi tornare indietro in qualsiasi momento.",
      required: false,
      order: 0,
    },
    {
      id: "step-name",
      type: "short_text",
      question: "Come ti chiami?",
      description: "Un nome o soprannome è sufficiente.",
      placeholder: "Il tuo nome",
      required: true,
      order: 1,
    },
    {
      id: "step-satisfaction",
      type: "scale_1_5",
      question: "Quanto sei soddisfatto del nostro servizio?",
      leftLabel: "Per niente",
      rightLabel: "Molto",
      required: true,
      order: 2,
    },
    {
      id: "step-referral",
      type: "multiple_choice",
      question: "Come ci hai trovato?",
      options: [
        { id: "opt-1", label: "Motore di ricerca" },
        { id: "opt-2", label: "Passaparola" },
        { id: "opt-3", label: "Social network" },
        { id: "opt-4", label: "Altro", isOther: true },
      ],
      required: true,
      order: 3,
    },
    {
      id: "step-contact",
      type: "contact",
      question: "Lasciaci i tuoi contatti",
      description: "Per inviarti aggiornamenti e offerte.",
      required: true,
      order: 4,
    },
  ],
};
