"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSurveyEditor from "@/components/AdminSurveyEditor";
import { createSurvey } from "@/lib/firestore";

export default function AdminNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSave(data: Parameters<Parameters<typeof AdminSurveyEditor>[0]["onSave"]>[0]) {
    setSaving(true);
    try {
      const id = await createSurvey(data);
      router.replace(`/admin/${id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--survey-bg)" }}>
      <header className="bg-white/90 border-b border-[var(--survey-accent)]/20 px-4 py-3 shadow-sm">
        <Link href="/admin/list" className="font-semibold text-[var(--survey-text-on-light)]">
          ← I miei sondaggi
        </Link>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-[var(--survey-text)] mb-6">Nuova survey</h1>
        <AdminSurveyEditor initial={{}} onSave={handleSave} saving={saving} />
      </main>
    </div>
  );
}
