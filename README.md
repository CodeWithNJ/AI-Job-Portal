# AI Job Portal — Frontend

React SPA for the **AI-Powered Job Portal**, a two-sided hiring marketplace where job seekers and recruiters are matched by resume intelligence and RAG-backed relevance rather than keyword search.

Built with **React 19 + Vite 8 + Tailwind CSS 4**.

> Companion repository: **AI Job Portal — Backend** (NestJS REST API).
> Product source of truth: `ai_job_portal_prd.pdf` (PRD v1.0, 30 Apr 2026).

---

## Table of contents

- [Product context](#product-context)
- [Implementation status](#implementation-status)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Backend API contract](#backend-api-contract)
- [UI conventions](#ui-conventions)
- [Known gaps](#known-gaps)
- [Roadmap](#roadmap)

---

## Product context

The PRD frames the core UX problem plainly: seekers dislike repetitive forms and want to see only likely-fit roles; recruiters want to publish a role once and immediately see ranked candidates they can trust. Every screen this app builds should be measured against that.

| Persona            | What the UI owes them                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Job seeker**     | A profile that fills itself from an uploaded resume, recommended roles over raw listings, one-click apply, visible application status |
| **Recruiter**      | Fast job authoring, ranked applicant pipelines, semantic candidate search, simple shortlist/reject actions                            |
| **Hiring manager** | Concise candidate summaries with the evidence behind each recommendation                                                              |
| **Platform admin** | Moderation queues, taxonomy management, analytics review                                                                              |

**AI principles that shape the interface** (from the PRD):

- **Assistive, not autonomous** — a human always takes the final action; the UI never presents an AI decision as final.
- **Explainable** — every recommendation surfaces its evidence: matched skills, experience overlap, missing qualification flags.
- **Safe defaults and correction** — parsed resume values are shown as _suggestions the user can edit_, never as silently-applied facts. Confidence is displayed, not hidden.
- **Consent and transparency** — the UI discloses that resumes are parsed and how the data is used.

Practically, that means resume-parsed fields must always render as reviewable, editable, clearly-labelled suggestions — a UI decision, not just a backend one.

---

## Implementation status

### Shipped

| Area                        | Detail                                                                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Marketing landing page**  | Header, hero, job-seeker section, recruiter section, trust section, final CTA — fully responsive                                          |
| **Signup modal**            | `react-hook-form` validation, role selection (job seeker / recruiter), password confirmation, terms acceptance, success → sign-in handoff |
| **Login modal**             | Email/password with a "Keep me signed in" checkbox (default **on**)                                                                       |
| **Cookie-based auth**       | `withCredentials` axios client; the browser holds HttpOnly cookies, the app holds no tokens                                               |
| **Silent token refresh**    | Response interceptor retries a 401 once via `POST /users/refresh`, with concurrent 401s collapsed into a single refresh call              |
| **Session rehydration**     | On boot, `GET /users/me` restores the session; a dedicated loading state prevents a landing-page flicker for returning users              |
| **Session-expiry handling** | An unrecoverable 401 dispatches a custom window event that resets app auth state                                                          |
| **Job seeker home page**    | Authenticated placeholder shell with sign-out and "coming soon" cards                                                                     |

### Not yet built

- Client-side routing (no router installed — see [Architecture](#architecture))
- Profile creation and editing screens (the backend endpoints exist and are unused)
- Resume upload UI against the signed-URL flow (the backend endpoints exist and are unused)
- Recruiter-side experience entirely: company setup, job authoring, applicant pipelines, candidate search
- Job browsing, search, filters, recommendations, and application tracking
- Explainability UI (matched skills, experience overlap, missing qualifications)
- Notifications, admin console, analytics instrumentation
- Automated tests (no test runner configured)

---

## Tech stack

| Concern    | Choice                                                                             |
| ---------- | ---------------------------------------------------------------------------------- |
| Framework  | React 19                                                                           |
| Build tool | Vite 8 (`@vitejs/plugin-react`)                                                    |
| Styling    | Tailwind CSS 4 via `@tailwindcss/vite` (no `tailwind.config.js` — v4 is CSS-first) |
| Forms      | `react-hook-form` 7                                                                |
| HTTP       | `axios` 1 with a shared configured instance                                        |
| Language   | JavaScript (JSX), ES modules                                                       |
| Linting    | ESLint 10 with `react-hooks` and `react-refresh` plugins                           |

---

## Getting started

### Prerequisites

- Node.js 22+ and npm 10+
- The backend API running locally (default `http://localhost:7500`)

### 1. Install dependencies

```bash
npm install
```

### 2. Point the app at your API

Create a `.env` in the project root:

```
VITE_API_URL=http://localhost:7500
```

This is optional locally — `axiosClient` falls back to `http://localhost:7500`, which matches the backend's `PORT`. It is required for any deployed environment.

### 3. Run the dev server

```bash
npm run dev
```

Vite serves on `http://localhost:5173`, which the backend already allows as a credentialed CORS origin.

### Running the full stack

Auth depends on cookies crossing origins, so both sides must agree:

1. Start the backend (`npm run start:dev` in the backend repo) — it must be reachable at `VITE_API_URL`.
2. The backend's `CORS_ORIGIN` must include this app's origin. It defaults to `http://localhost:5173` and `http://127.0.0.1:5173`.
3. Use `localhost` consistently on both sides. Mixing `localhost` and `127.0.0.1` gives you two different cookie origins and auth will appear to fail for no visible reason.

---

## Environment variables

| Variable       | Required               | Example                 | Purpose                                                     |
| -------------- | ---------------------- | ----------------------- | ----------------------------------------------------------- |
| `VITE_API_URL` | Only outside local dev | `http://localhost:7500` | Backend API base URL; falls back to `http://localhost:7500` |

Vite only exposes variables prefixed `VITE_` to client code. Everything in this file ships to the browser — never put a secret here.

---

## Available scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Vite dev server with HMR           |
| `npm run build`   | Production build into `dist/`      |
| `npm run preview` | Serve the production build locally |
| `npm run lint`    | ESLint over the project            |

---

## Project structure

```
index.html                 Vite entry document
vite.config.js             React + Tailwind plugins
public/
  favicon.svg
  icons.svg                Shared SVG sprite
src/
  main.jsx                 React root (StrictMode)
  App.jsx                  Auth state, session bootstrap, top-level view switch
  index.css                Tailwind entry and global styles
  App.css
  api/
    axiosClient.js         Configured axios instance, refresh interceptor, error extraction
    authApi.js             Auth endpoint wrappers
  assets/                  Images
components/
  LandingPage.jsx          Unauthenticated composition + modal orchestration
  JobSeekerHomePage.jsx    Authenticated shell (placeholder dashboard)
  Header.jsx               Landing nav and primary CTAs
  HeroSection.jsx          Above-the-fold value proposition
  JobSeekerSection.jsx     Seeker-side story (uses JobCard, StatusStep, Tag)
  RecruiterSection.jsx     Recruiter-side story (uses CandidateRow, SignalCard)
  TrustSection.jsx         Trust and AI-safety messaging (uses TrustCard)
  FinalCTA.jsx             Closing conversion block
  LoginModal.jsx           Sign-in form
  SignupModal.jsx          Registration form
  JobCard.jsx  CandidateRow.jsx  MetricCard.jsx  SignalCard.jsx
  StatusStep.jsx  Tag.jsx  TrustCard.jsx        Presentational primitives
```

**Note:** `components/` sits at the repository root, _beside_ `src/`, not inside it — so components import the API layer as `../src/api/authApi`. Worth keeping in mind when adding files or moving things around.

---

## Architecture

### View switching (no router yet)

`App.jsx` renders one of three states directly, with no routing library involved:

```
bootstrapping  → full-screen "Restoring your session..." spinner
authedUser     → <JobSeekerHomePage />
otherwise      → <LandingPage />
```

`LandingPage` manages its own modal state (`null` | `"login"` | `"signup"`) rather than using URLs.

This is fine for a two-view app, but it caps growth: no deep links, no browser back/forward, no per-role dashboards. Adding `react-router` is a prerequisite for essentially every remaining feature (profile editor, job detail pages, recruiter pipelines), so it's the natural next structural change.

### Authentication model

The frontend deliberately holds **no tokens**. The backend issues HttpOnly cookies that JavaScript cannot read, so:

- Every request sets `withCredentials: true` and the browser attaches the cookies.
- There is nothing to persist in `localStorage`, and therefore nothing for an XSS payload to exfiltrate.
- `authedUser` in `App.jsx` is _display state only_ — it decides which view renders. Authorization is always enforced server-side.

### Session bootstrap

```
App mounts
  └─ GET /users/me
       ├─ 200                     → hydrate authedUser, render the home page
       ├─ 401 + valid refresh     → interceptor rotates tokens, replays the call, hydrates
       └─ 401 + no valid refresh  → render the landing page
```

`bootstrapping` is tracked separately from `authedUser` on purpose: without it, a returning "Keep me signed in" user would see the landing page flash before the dashboard replaces it.

### Silent refresh interceptor

`src/api/axiosClient.js` recovers from expired access tokens without bouncing the user to a login screen:

- Only `401` responses on non-auth endpoints are eligible. `/users/signin`, `/users/signup`, `/users/refresh`, and `/users/logout` are excluded — a 401 there means bad credentials or a dead session, not a stale token.
- Each request is retried at most **once** (`_retried` flag), so a second 401 cannot loop.
- A single in-flight refresh promise is shared. Without it, N concurrent 401s would each fire their own refresh and all but the first would race against an already-rotated token.
- If refresh fails, the interceptor dispatches the `auth:session-expired` window event and rejects with the original error. `App.jsx` listens for that event and clears auth state.

### Error handling

`extractApiErrorMessage(error, fallback)` turns the backend's envelope into one user-facing string, preferring the most specific message available:

1. `error.response.data.error.details[0]` — the first field-level validation message
2. `error.response.data.message` — the top-level API message
3. A friendly connectivity message for `Network Error`
4. The provided fallback

Use it for every user-visible error rather than reading `error.response` inline, so error copy stays consistent as the app grows.

---

## Backend API contract

Wrappers live in `src/api/authApi.js`. All calls send credentials automatically.

| Function                                           | Request               | Notes                                                    |
| -------------------------------------------------- | --------------------- | -------------------------------------------------------- |
| `signupUser({ email, password, role, contactNo })` | `POST /users/signup`  | `201` on success                                         |
| `loginUser({ email, password, rememberMe })`       | `POST /users/signin`  | Sets both auth cookies; returns the user object          |
| `refreshSession()`                                 | `POST /users/refresh` | Called by the interceptor, not by components             |
| `fetchProfile()`                                   | `GET /users/me`       | Session rehydration on boot                              |
| `logoutUser()`                                     | `POST /users/logout`  | Clears cookies and revokes the server-side refresh token |

### Response envelope

Every backend response has the same shape, so `response.data` handling is uniform:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": { "id": "…", "fullName": "…", "email": "…", "role": "job_seeker" }
  },
  "timestamp": "2026-07-25T10:15:00.000Z",
  "path": "/users/signin"
}
```

Errors use the same envelope with `success: false` and an `error: { code, details }` object.

### Strict validation

The backend's global `ValidationPipe` runs with `forbidNonWhitelisted: true` — **unknown fields are rejected, not ignored**. Sending `confirmPassword` along with the signup payload produces a `400`, which is why `SignupModal` builds its request body explicitly instead of forwarding the whole form. Keep that discipline when adding forms.

### Endpoints available but not yet wired up

| Endpoint                              | What it unlocks                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------- |
| `GET /profiles/me`                    | Profile view — returns `{ role, profile }`, creating an empty profile on first access |
| `PATCH /profiles/me`                  | Profile editor — partial updates; body shape depends on the caller's role             |
| `POST /profiles/me/resume/upload-url` | Step 1 of resume upload (job seekers only)                                            |
| `PUT /uploads/resumes/:token`         | Step 2 — `PUT` the raw file bytes to the returned signed URL                          |

The resume upload is a two-step, S3-style signed-URL flow. The client asks for a URL, then `PUT`s the file directly using the exact `Content-Type` the server specified:

```js
const { data } = await axiosClient.post("/profiles/me/resume/upload-url", {
  fileName: file.name,
  mimeType: file.type,
});

// PUT with a bare axios call: the signed token is the credential, so this
// request needs no cookies and must not carry the JSON default headers.
await axios.put(data.data.uploadUrl, file, {
  headers: data.data.headers,
});
```

Only PDF and DOCX are accepted, and the backend verifies both the declared MIME type and the file's magic bytes — so client-side file-type filtering is a UX nicety, not the security boundary.

---

## UI conventions

Patterns already established in the codebase; follow them for consistency.

**Styling.** Tailwind utility classes inline, no CSS modules. Tailwind 4 is configured entirely through `@tailwindcss/vite` and `src/index.css` — there is no `tailwind.config.js`. Rounded, soft-shadow surfaces (`rounded-3xl`, `border-slate-200`, `shadow-sm`) on a `bg-slate-50` page; indigo is the primary accent; slate is the neutral ramp.

**Responsiveness.** Mobile-first: base styles target small screens, then `sm:` / `lg:` widen. Containers use `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.

**Modals.** Both modals follow the same pattern, and new ones should too:

- A thin wrapper that returns `null` when closed, so the content component **unmounts** — guaranteeing fresh form state, cleared errors, and no stale success banners on reopen.
- Body scroll locked while mounted (`document.body.style.overflow = "hidden"`), restored on unmount. This is what fixed the double-scrollbar bug.
- Fixed overlay: `fixed inset-0 z-50 … bg-slate-950/70 backdrop-blur-sm`.

**Forms.** `react-hook-form` with `mode: "onTouched"` so errors appear after a field is left rather than on every keystroke. Server errors and success messages live in local `useState`, separate from field-level errors. `isSubmitting` disables the submit control. Inputs share an `inputClass(hasError)` helper that swaps the border/ring colour to rose on error.

**Timers.** Any `setTimeout` is stored in a ref and cleared in a `useEffect` cleanup — see the signup success redirect.

---

## Known gaps

Worth knowing before you touch these areas.

**Signup does not send `fullName`.** `signupUser()` in `src/api/authApi.js` sends only `email`, `password`, `role`, and optional `contactNo`. The backend's `CreateUserDto` now requires `fullName` (2–100 chars), and `SignupModal` already collects and validates it — it just isn't forwarded. Signup therefore fails with a `400` until `fullName` is added to the payload in both `authApi.js` and the modal's `onSubmit`. This is the first thing to fix.

**Recruiters land on the job seeker dashboard.** `App.jsx` renders `JobSeekerHomePage` for any authenticated user regardless of `user.role`. Signup offers a recruiter role, but there is no recruiter view to send them to.

**The display name is derived from the email.** `JobSeekerHomePage` uses `user.email.split("@")[0]`. Now that the backend returns `fullName` on both signin and `/users/me`, prefer that with the email prefix as a fallback.

**Landing nav links are inert.** The `Header` nav items are `href="#"` placeholders, and "Post a Job" has no handler. They need either in-page anchors or routes.

**No tests.** There is no test runner configured. Vitest plus React Testing Library would be the natural fit for a Vite project.

---

## Roadmap

Tracks the PRD's phases, scoped to the frontend.

**Phase 1 — MVP.** Fix the `fullName` payload gap. Add routing and role-aware layouts. Build the seeker profile editor and the resume upload experience — including a parsed-resume review UI that shows confidence and lets users correct every extracted field. Then job browsing with search and filters, a recommended-jobs feed, apply flow, and application status tracking. On the recruiter side: company setup, job authoring, the applicant pipeline with ranked candidates and shortlist/reject actions, and semantic candidate search. Every recommendation surface needs its explainability panel (matched skills, experience overlap, missing qualifications) from the start, plus event instrumentation for activation and CTR.

**Phase 2 — Product-market fit.** Conversational career assistant for seekers (resume tips, job-fit Q&A, interview prep) and a recruiter copilot (rewrite JDs, generate screening questions, summarize pipelines). Saved searches, personalized alerts, recruiter collaboration, employer branding pages, and UI affordances that feed the ranking feedback loop — dismiss, not-interested, and shortlist signals.

**Phase 3 — Scale and monetization.** Subscription and billing surfaces, employer seat management, bulk outreach, interview scheduling, advanced analytics dashboards, and trust-and-safety tooling.

### Explicit non-goals

No HRIS or ATS replacement in MVP. No payroll, offer management, or onboarding screens. No UI that presents an AI decision as final — the human always acts.
