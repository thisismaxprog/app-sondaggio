// Validazione email (regex standard)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// Telefono: accetta +, spazi, numeri; almeno 8 cifre numeriche
export function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 8;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\s/g, "").trim();
}
