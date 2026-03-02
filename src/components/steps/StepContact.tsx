"use client";

import { useState, useCallback, useEffect } from "react";
import type { ContactStep } from "@/types/survey";
import { isValidEmail, isValidPhone } from "@/lib/validation";

export type ContactValue = { email?: string; phone?: string };

interface Props {
  step: ContactStep;
  value: ContactValue | undefined;
  onChange: (v: ContactValue | undefined) => void;
  onContinue: (contact?: { email: string; phone: string }) => void;
  onContactSubmit?: (email: string, phone: string) => Promise<void>;
  disabled?: boolean;
  minimal?: boolean;
  stepNumber?: number;
}

export default function StepContact({
  step,
  value,
  onChange,
  onContinue,
  onContactSubmit,
  disabled,
  minimal = false,
  stepNumber = 1,
}: Props) {
  const [email, setEmail] = useState(value?.email ?? "");
  const [phone, setPhone] = useState(value?.phone ?? "");
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEmail(value?.email ?? "");
    setPhone(value?.phone ?? "");
  }, [value?.email, value?.phone]);

  const emailValid = isValidEmail(email);
  const phoneValid = isValidPhone(phone);
  const canContinue = emailValid && phoneValid;

  const handleContinue = useCallback(async () => {
    setTouched(true);
    if (!emailValid || !phoneValid) return;
    if (disabled || saving) return;

    setSaving(true);
    try {
      if (onContactSubmit) {
        await onContactSubmit(email.trim(), phone.trim());
      }
      onChange({ email: email.trim(), phone: phone.trim() });
      onContinue({ email: email.trim(), phone: phone.trim() });
    } finally {
      setSaving(false);
    }
  }, [email, phone, emailValid, phoneValid, onContactSubmit, onChange, onContinue, disabled, saving]);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Intestazione: numero in box nero + titolo */}
      <div className="flex items-center gap-3 mb-8">
        <span
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-black text-sm font-medium text-white"
          aria-hidden
        >
          {stepNumber}
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#2d3748]">
          {step.question || "I tuoi dati"}
        </h2>
      </div>
      {step.description && (
        <p className="text-[#718096] mb-6 text-sm">{step.description}</p>
      )}

      {/* Due box ben distinti: Email e Telefono */}
      <div className="space-y-5">
        <div className="rounded-xl border-2 border-[#718096]/60 bg-white shadow-sm p-5">
          <label htmlFor="contact-email" className="block text-base font-semibold text-[#2d3748] mb-2">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="es. mario.rossi@email.com"
            className="w-full py-3 px-4 rounded-lg border-2 border-[#a0aec0]/70 bg-white text-[#2d3748] placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#5a8c6e] focus:border-[#5a8c6e]"
            autoComplete="email"
          />
          {touched && email && !emailValid && (
            <p className="mt-1 text-sm text-amber-600">Inserisci un&apos;email valida.</p>
          )}
        </div>
        <div className="rounded-xl border-2 border-[#718096]/60 bg-white shadow-sm p-5">
          <label htmlFor="contact-phone" className="block text-base font-semibold text-[#2d3748] mb-2">
            Numero di telefono
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="es. 312 345 6789"
            className="w-full py-3 px-4 rounded-lg border-2 border-[#a0aec0]/70 bg-white text-[#2d3748] placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#5a8c6e] focus:border-[#5a8c6e]"
            autoComplete="tel"
          />
          {touched && phone && !phoneValid && (
            <p className="mt-1 text-sm text-amber-600">Inserisci un numero valido (almeno 8 cifre).</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue || disabled || saving}
          className="px-8 py-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6b8f71]"
          style={{ backgroundColor: "#8E9C8F" }}
        >
          {saving ? "Salvataggio..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
