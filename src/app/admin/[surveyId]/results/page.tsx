"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSurvey, getResponsesForSurvey, getContactsForSurvey } from "@/lib/firestore";
import type { Survey, SurveyResponse, ContactLead } from "@/types/survey";

export default function AdminSurveyResultsPage() {
  const params = useParams();
  const surveyId = params.surveyId as string;
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [contacts, setContacts] = useState<ContactLead[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    Promise.all([
      getSurvey(surveyId),
      getResponsesForSurvey(surveyId),
      getContactsForSurvey(surveyId),
    ])
      .then(([s, r, c]) => {
        setSurvey(s ?? null);
        setResponses(r);
        setContacts(c);
      })
      .finally(() => setLoadingData(false));
  }, [surveyId]);

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Caricamento risultati...</p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Survey non trovata.</p>
        <Link href="/admin/list" className="ml-2 text-slate-900 underline">Lista</Link>
      </div>
    );
  }

  const formatDate = (seconds: number) => {
    return new Date(seconds * 1000).toLocaleString("it-IT");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--survey-bg)" }}>
      <header className="bg-white/90 border-b border-[var(--survey-accent)]/20 px-4 py-3 shadow-sm">
        <Link href="/admin/list" className="font-semibold text-[var(--survey-text-on-light)]">
          ← I miei sondaggi
        </Link>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-[var(--survey-text)] mb-2">Risultati: {survey.title}</h1>
        <p className="text-[var(--survey-muted)] mb-8">
          {responses.length} risposte complete · {contacts.length} contatti (anche parziali)
        </p>

        <section className="mb-10">
          <h2 className="text-lg font-medium text-[var(--survey-text)] mb-3">Risposte complete</h2>
          {responses.length === 0 ? (
            <p className="text-slate-500">Nessuna risposta ancora.</p>
          ) : (
            <div className="space-y-4">
              {responses.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <p className="text-xs text-slate-500 mb-2">{formatDate(r.createdAt)}</p>
                  {r.contact && (
                    <p className="text-sm text-slate-700 mb-2">
                      📧 {r.contact.email} · 📞 {r.contact.phone}
                    </p>
                  )}
                  <pre className="text-sm text-slate-800 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(r.answers, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--survey-text)] mb-3">Contatti (email e telefono)</h2>
          <p className="text-sm text-[var(--survey-muted)] mb-3">
            Salvati allo step contatti anche se il sondaggio non è stato completato.
          </p>
          {contacts.length === 0 ? (
            <p className="text-slate-500">Nessun contatto ancora.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-3">Data</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Telefono</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id} className="border-t border-slate-200">
                      <td className="p-3 text-slate-600">{formatDate(c.createdAt)}</td>
                      <td className="p-3">{c.email}</td>
                      <td className="p-3">{c.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
