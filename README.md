# Survey App – Sondaggi one-question-per-page

Webapp per creare e pubblicare sondaggi in stile Typeform: una domanda per pagina, design minimal, sfondo personalizzabile. Stack: **Next.js (App Router)**, **TypeScript**, **TailwindCSS**, **Firebase (Firestore + Auth)**. Deploy-ready per **Vercel**.

---

## Setup Firebase (passo-passo)

Segui questi passaggi per completare la configurazione del database e dell’auth.

### 1. Crea il progetto Firebase

1. Vai su **[Firebase Console](https://console.firebase.google.com/)** e accedi con Google.
2. Clicca **“Aggiungi progetto”** (o “Crea un progetto”).
3. Inserisci un nome (es. `survey-app`) → **Continua** → disattiva Google Analytics se non ti serve → **Crea progetto**.
4. Quando è pronto, clicca **“Continua”** per entrare nella home del progetto.

### 2. Registra l’app web e copia la config

1. Nella **overview del progetto** (home), clicca sull’icona **web** `</>` (“Aggiungi app” / “Aggiungi un’app”).
2. Inserisci un **nickname** (es. `survey-web`) e **non** abilitare Firebase Hosting per ora → **Registra app**.
3. Ti verrà mostrato un blocco tipo:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "tuo-progetto.firebaseapp.com",
     projectId: "tuo-progetto",
     storageBucket: "tuo-progetto.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc..."
   };
   ```
4. **Copia questi valori**: ti servono per il file `.env.local` (passo 5).

### 3. Crea il database Firestore

1. Nel menu a sinistra: **Build** → **Firestore Database**.
2. Clicca **“Crea database”**.
3. Scegli **“Avvia in modalità produzione”** → **Avanti**.
4. Scegli una **region** (es. `europe-west1` per l’Europa) → **Abilita**.
5. Quando il database è attivo, vai al tab **“Regole”** (Rules).
6. **Sostituisci** tutto il contenuto con le regole sotto (sono le stesse del file `firestore.rules` nel repo):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /surveys/{surveyId} {
         allow read: if true;
         allow create, update, delete: if request.auth != null;
       }
       match /responses/{responseId} {
         allow create: if true;
         allow read, update, delete: if request.auth != null;
       }
       match /contacts/{contactId} {
         allow create: if true;
         allow read, update, delete: if request.auth != null;
       }
     }
   }
   ```
7. Clicca **“Pubblica”**.

Non devi creare a mano le collection `surveys`, `responses`, `contacts`: le creerà l’app al primo utilizzo.

### 4. Abilita Authentication (Email/Password)

1. Nel menu: **Build** → **Authentication**.
2. Clicca **“Inizia”** (o “Get started”).
3. Nel tab **“Sign-in method”** clicca su **“Email/Password”**.
4. Attiva **“Abilita”** (primo toggle) → **Salva**.
5. (Opzionale) Crea subito un utente admin: tab **“Users”** → **“Aggiungi utente”** → inserisci **email** e **password** → **Aggiungi utente**. Userai queste credenziali per accedere a `/admin`.

### 5. Variabili d’ambiente in locale

1. Nella root del progetto copia il file di esempio:
   ```bash
   cp .env.example .env.local
   ```
2. Apri `.env.local` e compila ogni riga con i valori della `firebaseConfig` (passo 2):

   | Variabile | Dove prenderla nella firebaseConfig |
   |-----------|--------------------------------------|
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | `apiKey` |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | `appId` |

   Esempio (con valori fittizi):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=survey-app-xxx.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=survey-app-xxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=survey-app-xxx.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef...
   ```

3. Salva il file. **Non** committare `.env.local` (è già in `.gitignore`).

### 6. Verifica che tutto funzioni

1. Avvia l’app in locale:
   ```bash
   npm install
   npm run dev
   ```
2. Apri [http://localhost:3000](http://localhost:3000) → **Vai all’admin**.
3. Accedi con l’**email** e **password** dell’utente creato in Authentication (passo 4).
4. Se il login va a buon fine, sei nell’area admin: da lì puoi creare una survey (anche con **“Usa template demo”**) e vedere il link tipo `http://localhost:3000/s/xxxx`. Aprendo quel link, le risposte e i contatti verranno salvati in Firestore nelle collection `responses` e `contacts`.

Se qualcosa non funziona:
- Controlla che in **Authentication → Sign-in method** sia abilitato **Email/Password**.
- Controlla che le regole Firestore siano state pubblicate (tab Regole).
- Controlla che in `.env.local` non ci siano spazi extra o virgolette intorno ai valori.

---

## Funzionalità

- **Take survey** (`/s/[surveyId]`): landing → step paginati con progress bar → schermata “Grazie”. Risposte in stato + localStorage; step contatti salva subito in Firestore (`contacts`).
- **Admin** (`/admin`): login email/password (Firebase Auth). Crea/modifica survey, link di condivisione, step ordinabili (su/giù).
- **Tipi di step**: testo breve, scelta multipla (con “Altro”), dropdown/cascata, scala 1–5, blocco informativo, contatti (email + telefono con validazione).
- **Anti-spam**: cooldown client-side + honeypot field; reCAPTCHA v3 lasciato come TODO commentato.

---

## Creare un progetto Firebase (piano Spark, gratuito)

1. Vai su [Firebase Console](https://console.firebase.google.com/) e crea un progetto (o usane uno esistente).
2. **Firestore**: in “Build” → “Firestore Database” → “Crea database” (modalità produzione). Scegli una region (es. `europe-west1`). Le regole le imposti dopo (vedi sotto).
3. **Authentication**: in “Build” → “Authentication” → “Get started” → abilita “Email/Password” (primo metodo).
4. **Configurazione app**: nella home del progetto, clicca sull’icona web `</>`, registra l’app con un nickname (es. “survey-web”). Copia l’oggetto `firebaseConfig` e usa le proprietà per le variabili d’ambiente (vedi sotto).
5. **Regole Firestore**: in Firestore → “Regole”, incolla il contenuto di `firestore.rules` (nella root del repo) e pubblica.

---

## Variabili d’ambiente

Copia `.env.example` in `.env.local` e compila con i valori della tua app Firebase:

```bash
cp .env.example .env.local
```

Compila:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Per i nomi delle variabili e dove trovarle, vedi la tabella nella sezione **Setup Firebase (passo-passo)**. Comando: `cp .env.example .env.local`. Non committare `.env.local`.

---

## Avvio in locale

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000). Dalla home vai su “Vai all’admin”, accedi con un utente creato in Firebase Authentication (Email/Password). Poi:

- **Nuova survey**: “Nuova survey” → compila e salva (o usa “Usa template demo”).
- **Lista**: da “Survey Admin” vedi le survey e i link `/s/[surveyId]` da condividere.
- **Modifica**: “Modifica” su una survey esistente.

Per testare il flusso utente: apri il link “Apri link” (es. `http://localhost:3000/s/xxxx`) e compila il sondaggio; le risposte e i contatti (se presenti) saranno in Firestore nelle collection `responses` e `contacts`.

---

## Deploy su Vercel

1. Push del codice su GitHub (o altro provider supportato da Vercel).
2. Su [Vercel](https://vercel.com) crea un nuovo progetto e importa il repo.
3. Nelle **Environment Variables** del progetto aggiungi le stesse variabili usate in locale (`NEXT_PUBLIC_FIREBASE_*`).
4. Deploy: Vercel userà `next build` e `next start` (o l’equivalente per Next.js).

Dopo il deploy, in Firebase Console → Authentication → “Authorized domains” aggiungi il dominio Vercel (es. `*.vercel.app` e il tuo dominio custom se lo usi).

---

## Struttura dati Firestore

- **surveys**  
  Documenti survey: `companyName`, `title`, `subtitle`, `backgroundImageUrl`, `steps` (array di step con `id`, `type`, `question`, ecc.), `createdAt`, `updatedAt`.

- **responses**  
  Una risposta per sondaggio completato: `surveyId`, `createdAt`, `answers` (mappa `stepId → value`), opzionale `contact` (`email`, `phone`).

- **contacts**  
  Un documento per ogni compilazione dello step contatti (anche se l’utente non finisce il sondaggio): `surveyId`, `email`, `phone`, `createdAt`, opzionale `partialAnswers`.

Le regole in `firestore.rules` consentono: lettura pubblica di `surveys`; creazione pubblica di `responses` e `contacts`; lettura/scrittura su tutte e tre le collection solo per utenti autenticati (admin).

---

## File tree principale

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Home → link admin
│   ├── globals.css
│   ├── admin/
│   │   ├── layout.tsx        # AuthProvider
│   │   ├── page.tsx          # Login
│   │   ├── list/page.tsx     # Lista survey + link
│   │   ├── new/page.tsx      # Nuova survey
│   │   └── [surveyId]/page.tsx  # Modifica survey
│   └── s/
│       └── [surveyId]/page.tsx  # Take survey (pubblico)
├── components/
│   ├── ProgressBar.tsx
│   ├── SurveyStart.tsx
│   ├── SurveyStepRenderer.tsx
│   ├── AdminSurveyEditor.tsx
│   └── steps/
│       ├── StepShortText.tsx
│       ├── StepMultipleChoice.tsx
│       ├── StepCascade.tsx
│       ├── StepScale.tsx
│       ├── StepInfoBlock.tsx
│       └── StepContact.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── firebase.ts
│   ├── firestore.ts
│   └── validation.ts
├── types/
│   └── survey.ts
└── data/
    └── demoSurvey.ts
```

---

## Licenza

MIT.
