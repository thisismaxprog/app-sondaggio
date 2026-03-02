"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminSurveyEditor from "@/components/AdminSurveyEditor";
import { getSurvey, updateSurvey } from "@/lib/firestore";
import type { Survey } from "@/types/survey";

export default function AdminSurveyEditPage() {
  const params = useParams();
  const surveyId = params.surveyId as string;
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSurvey(surveyId)
      .then(setSurvey)
      .catch(() => setLoadError("Survey non trovata"));
  }, [surveyId]);

  async function handleSave(data: Omit<Survey, "id" | "createdAt" | "updatedAt">) {
    setSaving(true);
    try {
      await updateSurvey(surveyId, data);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (loadError || (!survey && !loadError)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">{loadError ?? "Caricamento..."}</p>
        <Link href="/admin/list" className="ml-2 text-slate-900 underline">Torna alla lista</Link>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--survey-bg)" }}>
      <header className="bg-white/90 border-b border-[var(--survey-accent)]/20 px-4 py-3 shadow-sm">
        <Link href="/admin/list" className="font-semibold text-[var(--survey-text-on-light)]">
          ← I miei sondaggi
        </Link>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-[var(--survey-text)] mb-6">Modifica survey</h1>
        <AdminSurveyEditor
          initial={{
            companyName: survey.companyName,
            title: survey.title,
            subtitle: survey.subtitle,
            backgroundImageUrl: survey.backgroundImageUrl,
            steps: survey.steps,
          }}
          onSave={handleSave}
          saving={saving}
        />
      </main>
    </div>
  );
}
