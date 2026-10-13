# TheOne — Mind Support AI

A classic React + Vite web app with a server-side AI chat endpoint. It can run locally with Express or deploy to Vercel using serverless functions. It does not depend on Higgsfield.

## Features
- Conversational AI companion powered by the OpenAI API
- Guided grounding and mindfulness practices
- A thought-reflection worksheet
- 3-, 7-, and 14-day wellbeing checklists
- A science section that distinguishes evidence from speculation
- Basic safety routing for messages that may indicate self-harm
- API key stays server-side and is never exposed to browser code

## Deploy on Vercel (recommended)

### 1. Upload the project to GitHub
1. Extract `theone-classic-vercel.zip` on your computer.
2. Sign in to GitHub and create a **new repository** (for example, `theone-mind-support`).
3. Upload the files and folders from inside `theone-classic` to the repository's root. Make sure `package.json`, `src`, `api`, and `vercel.json` are at the repository root level. Do **not** upload a real `.env` file or any API key.

### 2. Import it into Vercel
1. Sign in at https://vercel.com/.
2. Choose **Add New → Project** and import the GitHub repository.
3. Vercel should detect Vite. The build command is `npm run build` and the output directory is `dist` (these are also set in `vercel.json`).
4. Before or after the first deployment, open the Vercel project **Settings → Environment Variables**.
5. Add `OPENAI_API_KEY` as the name and paste your OpenAI API key as the value. Select the environments you need (at least **Production**). Never put the key in `src`, a public Vite variable, or GitHub.
6. Save the variable and **redeploy** the project so the serverless function receives it.

### 3. Test it
Open the Vercel URL. The mindfulness, reflection, plan, and science sections should work without an API key. The chat needs a valid OpenAI API key and API billing/access. Send a simple test message to check it.

## Run locally
Requirements: Node.js 18 or newer.

1. In this folder, run `npm install`.
2. Copy `.env.example` to `.env` and add your key after `OPENAI_API_KEY=`.
3. Run `npm run dev`.
4. Open the local URL printed by Vite, usually `http://localhost:5173`.

The local Vite server proxies `/api` to the Express server on port 3001. For Vercel, `/api/chat` and `/api/health` are implemented as serverless functions in the `api` folder.

## Privacy and safety notes
- The app does not save chat history to a database; chat stays in browser memory and is lost on refresh.
- Messages sent to the AI service are processed by OpenAI according to the applicable account/API terms. Do not enter passwords, financial information, or identifying secrets.
- The self-harm pattern check is a basic fallback, not a reliable crisis detector. It cannot replace human support or emergency services.
- TheOne provides general wellbeing support, not diagnosis, treatment, or a substitute for professional care.
- In India, call 112 for emergencies or Tele-MANAS at 14416 for mental-health support. Elsewhere, contact local emergency services or a crisis line.
- Before a public launch, add rate limiting, stronger validation, robust crisis handling, a privacy notice, and abuse monitoring.
