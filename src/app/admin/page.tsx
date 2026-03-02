"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/list");
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-600">Reindirizzamento...</p>
    </div>
  );
}
