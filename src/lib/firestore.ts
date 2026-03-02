import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Survey, SurveyResponse, ContactLead } from "@/types/survey";

function requireDb() {
  if (!db) throw new Error("Firebase non configurato. Imposta le variabili NEXT_PUBLIC_FIREBASE_*.");
  return db;
}

const SURVEYS = "surveys";
const RESPONSES = "responses";
const CONTACTS = "contacts";

// --- Surveys ---
export async function getSurvey(surveyId: string): Promise<Survey | null> {
  const database = requireDb();
  const ref = doc(database, SURVEYS, surveyId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Survey;
}

export async function getSurveys(): Promise<Survey[]> {
  const database = requireDb();
  const ref = collection(database, SURVEYS);
  const snap = await getDocs(ref);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Survey));
}

export async function createSurvey(data: Omit<Survey, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const database = requireDb();
  const ref = collection(database, SURVEYS);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateSurvey(
  surveyId: string,
  data: Partial<Omit<Survey, "id">>
): Promise<void> {
  const database = requireDb();
  const ref = doc(database, SURVEYS, surveyId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

// --- Responses ---
/** Rimuove da answers eventuali valori non serializzabili (es. SyntheticBaseEvent) */
function sanitizeAnswers(
  answers: Record<string, string | number | object | undefined>
): Record<string, string | number | object | undefined> {
  const out: Record<string, string | number | object | undefined> = {};
  for (const [key, value] of Object.entries(answers)) {
    if (value === undefined || value === null) {
      out[key] = value;
      continue;
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      out[key] = value;
      continue;
    }
    if (typeof value === "object") {
      if (typeof (value as { nativeEvent?: unknown }).nativeEvent !== "undefined") {
        continue;
      }
      if (value.constructor && value.constructor.name !== "Object" && value.constructor.name !== "Array") {
        continue;
      }
      if ("email" in value && "phone" in value && typeof (value as { email: unknown }).email === "string" && typeof (value as { phone: unknown }).phone === "string") {
        out[key] = { email: (value as { email: string }).email, phone: (value as { phone: string }).phone };
        continue;
      }
    }
    out[key] = value;
  }
  return out;
}

export async function submitResponse(
  surveyId: string,
  answers: Record<string, string | number | object | undefined>,
  contact?: { email: string; phone: string }
): Promise<string> {
  const database = requireDb();
  const ref = collection(database, RESPONSES);
  const safeAnswers = sanitizeAnswers(answers);
  const safeContact =
    contact &&
    typeof contact === "object" &&
    typeof (contact as { email?: unknown }).email === "string" &&
    typeof (contact as { phone?: unknown }).phone === "string" &&
    !("nativeEvent" in contact)
    ? { email: contact.email, phone: contact.phone }
    : undefined;
  const docRef = await addDoc(ref, {
    surveyId,
    createdAt: serverTimestamp(),
    answers: safeAnswers,
    ...(safeContact && { contact: safeContact }),
  });
  return docRef.id;
}

// --- Contacts (lead su step contatti) ---
export async function saveContact(
  surveyId: string,
  email: string,
  phone: string,
  partialAnswers?: Record<string, string | number | object | undefined>
): Promise<string> {
  const database = requireDb();
  const ref = collection(database, CONTACTS);
  const docRef = await addDoc(ref, {
    surveyId,
    email,
    phone,
    createdAt: serverTimestamp(),
    ...(partialAnswers && { partialAnswers: sanitizeAnswers(partialAnswers) }),
  });
  return docRef.id;
}

// --- Admin: lista risposte per survey ---
export async function getResponsesForSurvey(surveyId: string): Promise<SurveyResponse[]> {
  const database = requireDb();
  const ref = collection(database, RESPONSES);
  const q = query(ref, where("surveyId", "==", surveyId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      surveyId: data.surveyId,
      createdAt: data.createdAt?.seconds ?? data.createdAt ?? 0,
      answers: data.answers ?? {},
      contact: data.contact,
    } as SurveyResponse;
  });
}

export async function getContactsForSurvey(surveyId: string): Promise<ContactLead[]> {
  const database = requireDb();
  const ref = collection(database, CONTACTS);
  const q = query(ref, where("surveyId", "==", surveyId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      surveyId: data.surveyId,
      email: data.email,
      phone: data.phone,
      createdAt: data.createdAt?.seconds ?? data.createdAt ?? 0,
      partialAnswers: data.partialAnswers,
    } as ContactLead;
  });
}
