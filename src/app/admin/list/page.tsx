"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminListPage() {
  const [surveys, setSurveys] = useState<{ id: string; title: string; companyName?: string }[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { getSurveys } = await import("@/lib/firestore");
      const list = await getSurveys();
      setSurveys(list.map((s) => ({ id: s.id!, title: s.title, companyName: s.companyName })));
      setLoadingList(false);
    };
    load();
  }, []);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--survey-bg)" }}>
      <header className="bg-white/90 border-b border-[var(--survey-accent)]/20 px-4 py-3 flex justify-between items-center shadow-sm">
        <Link href="/admin/list" className="font-semibold text-slate-900">
          I miei sondaggi
        </Link>
        <Link href="/admin/new" className="text-slate-700 hover:text-slate-900 text-sm font-medium">
          + Nuova survey
        </Link>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-[var(--survey-text)] mb-6">Le tue survey</h1>
        {loadingList ? (
          <p className="text-[var(--survey-muted)]">Caricamento...</p>
        ) : surveys.length === 0 ? (
          <p className="text-[var(--survey-muted)]">
            Nessuna survey. <Link href="/admin/new" className="text-[var(--survey-accent)] underline">Creane una</Link>.
          </p>
        ) : (
          <ul className="space-y-3">
            {surveys.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/90 border border-[var(--survey-accent)]/20 shadow-sm"
              >
                <div>
                  <p className="font-medium text-[var(--survey-text-on-light)]">{s.title}</p>
                  {s.companyName && (
                    <p className="text-sm text-slate-500">{s.companyName}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/admin/${s.id}`}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    Modifica
                  </Link>
                  <span className="text-slate-400">|</span>
                  <Link
                    href={`/admin/${s.id}/results`}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    Risultati
                  </Link>
                  <span className="text-slate-400">|</span>
                  <a
                    href={`${baseUrl}/s/${s.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    Apri link
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`${baseUrl}/s/${s.id}`);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700"
                    title="Copia link"
                  >
                    Copia
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
