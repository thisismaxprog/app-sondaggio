import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-2xl font-semibold text-slate-900 mb-2">Survey App</h1>
      <p className="text-slate-600 mb-6 text-center max-w-md">
        Crea e condividi sondaggi one-question-per-page. Clicca sotto per creare survey e vedere link, risposte e contatti (email/telefono) salvati nel database.
      </p>
      <Link
        href="/admin/list"
        className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800"
      >
        I miei sondaggi
      </Link>
    </div>
  );
}
