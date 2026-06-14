# Becoming Firdaus — Inner War Protocol

NEET 2027 personal tracking system. PWA — installs on your home screen like a real app.

---

## Deploy in 5 Minutes

### Step 1 — Run locally first (optional check)
```bash
npm install
npm run dev
# Open http://localhost:5173
```

### Step 2 — Push to GitHub
1. Go to https://github.com/new → create repo named `becoming-firdaus`
2. In this folder, run:
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/becoming-firdaus.git
git push -u origin main
```

### Step 3 — Deploy on Vercel (free)
1. Go to https://vercel.com → sign in with GitHub
2. Click **"Add New Project"** → select your `becoming-firdaus` repo
3. Leave all settings default → click **Deploy**
4. In ~1 minute you get a URL like: `https://becoming-firdaus.vercel.app`

### Step 4 — Install on your phone
**Android (Chrome):**
- Open the Vercel URL in Chrome
- Tap the 3-dot menu → **"Add to Home Screen"**
- Done ✓

**iPhone (Safari):**
- Open the Vercel URL in Safari (must be Safari, not Chrome)
- Tap the Share button (box with arrow) → **"Add to Home Screen"**
- Done ✓

---

## All Your Data
All logging (study sessions, workout, sleep, distractions, journal, quests) is saved to Firebase — same as in the Claude artifact. Nothing changes. Your data is already there.

## Firebase Note
Your Firestore rules are open until your set date. For a personal app this is fine. If you ever want to lock it down, go to Firebase Console → Firestore → Rules and set:
```
allow read, write: if false; // blocks everyone
```
Then add auth later if needed.

---

## Tech Stack
- React 18 + Vite 5
- vite-plugin-pwa (service worker + manifest)
- Recharts (charts)
- Firebase Firestore REST API (no SDK needed)
