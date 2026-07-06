# Task Manager

A small React + Vite app for two kinds of lists:

- **Tasks** — a notepad-style textarea where you jot down tasks one per line
  and add them all at once. Tasks can be edited inline, checked off, or
  deleted, and can carry a category, a due date, a separate "work on" date,
  and a checklist of subtasks.
- **Things to enjoy** — a separate list of enjoyable, non-obligatory things
  (not tasks, no checkboxes, no due dates). The app surfaces a "Maybe
  today…" suggestion pulled from that list, with a button to shuffle to a
  different one.

Your tasks sync across devices via Firebase (Firestore), protected by a PIN
you set on first use.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Setting up Firebase (required for the app to run)

The app needs a Firebase project to store your data and handle the PIN
login.

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
   and create a free project.
2. In the project, go to **Build → Authentication → Get started**, and
   enable the **Email/Password** sign-in provider.
3. Go to **Build → Firestore Database → Create database**, and start it in
   production mode (the security rules in `firestore.rules` lock every
   document to its own owner).
4. Deploy the security rules once you have the Firebase CLI set up:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules --project <your-project-id>
   ```
5. In the Firebase console, go to **Project settings → General → Your apps**,
   add a "Web app", and copy the config values shown there.
6. Copy `.env.example` to `.env` and fill in those values:
   ```bash
   cp .env.example .env
   ```
7. Run `npm run dev` (or deploy the built app) — the first PIN you create
   becomes your account, and you use that same PIN to sign in on any other
   device.

### Testing without a real Firebase project

You can run everything against Firebase's local emulators instead, with no
real project or account needed:

```bash
npm install -g firebase-tools
firebase emulators:start --project demo-task-manager --only auth,firestore
```

Then set `VITE_USE_FIREBASE_EMULATOR=true` in `.env` (the other `VITE_FIREBASE_*`
values can be left as placeholder strings) and run `npm run dev` in another
terminal.
