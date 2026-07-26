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
| Framework    | React 19                                                                           |
| Build tool   | Vite 8 (`@vitejs/plugin-react`)                                                    |
| Routing      | `react-router` 7                                                                   |
| Server state | `@tanstack/react-query` 5                                                          |
| Styling      | Tailwind CSS 4 via `@tailwindcss/vite` (no `tailwind.config.js` — v4 is CSS-first) |
| Forms        | `react-hook-form` 7                                                                |
| HTTP         | `axios` 1 with a shared configured instance                                        |
| Language     | JavaScript (JSX), ES modules                                                       |
| Linting      | ESLint 10 with `react-hooks` and `react-refresh` plugins                           |

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
  App.jsx                  Composition root: query client, router, auth provider
  index.css                Tailwind entry and global styles
  App.css
  api/
    axiosClient.js         Configured axios instance, refresh interceptor, error extraction
    authApi.js             Auth endpoint wrappers
    queryClient.js         react-query defaults (retry policy, staleness)
  auth/
    AuthProvider.jsx       Session state, sign-out intent, expiry handling
    auth-context.js        Context object + the current-user cache key
    useAuth.js             Hook every screen reads the session through
    roles.js               Role constants, per-role home path, display name
  routes/
    AppRoutes.jsx          The route table
  assets/                  Images
components/
  layouts/
    AppLayout.jsx          Shared chrome + page container for signed-in routes
    AppHeader.jsx          Role-aware nav, identity, sign out
  routes/
    ProtectedRoute.jsx     Requires a session, optionally a role
    GuestRoute.jsx         Public surfaces + the redirect once signed in
  pages/
    LandingPage.jsx        Public marketing page; path drives which modal is open
    JobSeekerHomePage.jsx  Seeker dashboard
    RecruiterHomePage.jsx  Recruiter dashboard
    AdminHomePage.jsx      Admin console
    PlaceholderDashboard.jsx  Shared scaffold behind the three dashboards
    NotFoundPage.jsx       404
  ui/
    Button.jsx             primary / secondary / ghost, with loading state
    Spinner.jsx            The one spinner
    FullPageLoader.jsx     Whole-screen loading state
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

### Routing

`react-router` with two guards wrapping everything. Adding a screen is one `<Route>` under the right role — chrome, auth, and redirects come for free.

| Path | Guard | Renders |
| --- | --- | --- |
| `/` | Guest | Landing page |
| `/login` | Guest | Landing page, sign-in modal open |
| `/signup` | Guest | Landing page, registration modal open |
| `/dashboard` | `job_seeker` | Seeker dashboard inside `AppLayout` |
| `/recruiter` | `recruiter` | Recruiter dashboard inside `AppLayout` |
| `/admin` | `admin` | Admin console inside `AppLayout` |
| `*` | — | 404 |

`/`, `/login`, and `/signup` all render `LandingPage`; the path decides which modal is open. The overlay UX is unchanged, but both flows are now linkable and back-button friendly — which is what lets `ProtectedRoute` bounce someone to `/login` and have them land on a real sign-in surface.

**Guards are UX, not security.** Every protected route is enforced server-side by `AccessTokenGuard`/`RolesGuard`. These exist to route people somewhere sensible instead of rendering a screen that will 401. A signed-in user who opens a route for another role is redirected to their own home rather than shown an error — with three roles, a wrong-role URL is far more often a stale link than an intrusion.

**Deploy note:** client-side routing needs the host to serve `index.html` for unknown paths, or a hard refresh on `/dashboard` 404s. Vite's dev server does this already; a static host needs an SPA fallback rule.

### Authentication model

The frontend deliberately holds **no tokens**. The backend issues HttpOnly cookies that JavaScript cannot read, so:

- Every request sets `withCredentials: true` and the browser attaches the cookies.
- There is nothing to persist in `localStorage`, and therefore nothing for an XSS payload to exfiltrate.
- The `user` from `useAuth()` is _display state only_. Authorization is always enforced server-side.

### Session bootstrap

`AuthProvider` resolves the session once through react-query and every screen reads it via `useAuth()`:

```
App mounts
  └─ GET /users/me
       ├─ 200                     → cache the user, render their dashboard
       ├─ 401 + valid refresh     → interceptor rotates tokens, replays the call, hydrates
       └─ 401 / network failure   → resolve to null and render the landing page
```

Guards must check `isBootstrapping` before deciding anything — without it a returning user gets bounced to the landing page before their cookie has even been checked.

### Two ways a session ends

They look identical in state (no user) but deserve different destinations, and conflating them is a visible bug:

| | Trigger | Destination | Why |
| --- | --- | --- | --- |
| **Deliberate** | User clicks Sign Out | `/` | They asked to leave. A sign-in prompt reads as though the sign-out failed. |
| **Involuntary** | `auth:session-expired` from the interceptor | `/login`, with `from` remembered | They were interrupted; signing back in should return them where they were. |

`AuthProvider` exposes `isSigningOut` to tell these apart, and `ProtectedRoute` picks the destination.

Two things about this are deliberate and easy to undo by accident:

1. **`signOut` never calls `navigate()`.** react-query delivers cache updates on a microtask, so the session clears asynchronously while `navigate()` applies synchronously. Any imperative redirect loses the race: a guard observes the new location while the session is still set, bounces back to the dashboard, and _then_ the cleared session sends the user to `/login`. Letting the guards route declaratively avoids the race entirely.
2. **`isSigningOut` is derived during render, not stored and reset in an effect.** Resetting it on "user is now null" flips it back while the router is still mid-redirect, and `ProtectedRoute` — rendered once more on the old path with the flag already false — sends the user to `/login` anyway. It is computed as "sign-out was requested _and_ we haven't reached a public route yet."

### Data fetching

`@tanstack/react-query` owns server state, so screens don't hand-roll loading, error, and refetch state. Defaults live in `src/api/queryClient.js`: no retry on 4xx (the axios interceptor already handles 401 recovery, and retrying on top of it multiplies requests against a rotated token), a 30s staleness window, and no refetch on window focus.

Signing out calls `removeQueries` on everything outside the `auth` key, so the next user on the same browser cannot see the previous user's data flash on screen.

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

**Styling.** Tailwind utility classes inline, no CSS modules. Tailwind 4 is configured entirely through `@tailwindcss/vite` and `src/index.css` — there is no `tailwind.config.js`. Rounded, soft-shadow surfaces (`rounded-3xl`, `border-slate-200`, `shadow-sm`) on a `bg-slate-50` page; indigo is the primary accent; slate is the neutral ramp. Note Tailwind 4 spells gradients `bg-linear-to-br`, not `bg-gradient-to-br`.

**Shared primitives.** Reach for `components/ui/` before writing new markup — `Button` (primary / secondary / ghost, with a built-in loading state), `Spinner`, and `FullPageLoader`. They hold the exact classes the landing page and modals already use, so new screens inherit the look rather than approximating it. The three role dashboards are all `PlaceholderDashboard` with different copy, which is why they stay visually identical without anyone maintaining three copies.

**Page chrome belongs to the layout.** Authenticated pages render content only — `AppLayout` owns the `bg-slate-50` background, the header, and the `mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8` container. A page that adds its own wrapper will double the padding.

**Role accents.** Shared indigo anchor, distinct hero gradient per role: seeker `from-indigo-600 via-indigo-500 to-sky-500`, recruiter `from-emerald-600 via-teal-600 to-indigo-600` (echoing the signup modal), admin `from-slate-800 via-slate-700 to-indigo-700`.

**Responsiveness.** Mobile-first: base styles target small screens, then `sm:` / `lg:` widen. Containers use `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.

**Modals.** Both modals follow the same pattern, and new ones should too:

- A thin wrapper that returns `null` when closed, so the content component **unmounts** — guaranteeing fresh form state, cleared errors, and no stale success banners on reopen.
- Body scroll locked while mounted (`document.body.style.overflow = "hidden"`), restored on unmount. This is what fixed the double-scrollbar bug.
- Fixed overlay: `fixed inset-0 z-50 … bg-slate-950/70 backdrop-blur-sm` with `p-4 sm:p-6`.
- **Height containment — three classes that must travel together.** The panel is `min-h-0 overflow-y-auto`, and its grid parent is `max-h-full grid-rows-[minmax(0,1fr)] overflow-hidden`. All three matter: a grid item's automatic minimum size is `auto`, so without `min-h-0` the panel refuses to shrink; and without the clamped row track the row is sized to its content, so the panel is never shorter than what it contains and `overflow-y-auto` produces no scrollbar at all. Get either wrong and the parent's `overflow-hidden` silently clips the modal's footer — which is exactly how the sign-in link disappeared once a server error banner grew the form. Prefer `max-h-full` over a hard-coded `calc(100dvh-2rem)`: it tracks the overlay's own responsive padding instead of drifting from it at `sm:`.

**Forms.** `react-hook-form` with `mode: "onTouched"` so errors appear after a field is left rather than on every keystroke. Server errors and success messages live in local `useState`, separate from field-level errors. `isSubmitting` disables the submit control. Inputs share an `inputClass(hasError)` helper that swaps the border/ring colour to rose on error.

**Timers.** Any `setTimeout` is stored in a ref and cleared in a `useEffect` cleanup — see the signup success redirect.

---

## Known gaps

Worth knowing before you touch these areas.

**Client and server disagree on the name length limit.** `SignupModal` caps `fullName` at 60 characters; the backend allows 100. The client is the stricter of the two, so this rejects some names the API would accept rather than letting a bad request through.

**Recruiter signup is disabled in the UI but open on the API.** `SignupModal` marks the recruiter option "coming soon", yet `POST /users/signup` accepts `role: "recruiter"` from any client. A recruiter registered via curl now gets a real dashboard, so this is cosmetic rather than broken — but the two sides should agree before launch.

**Landing nav links are inert.** The `Header` nav items are still `href="#"` placeholders. They need in-page anchors.

**Admin has no profile endpoint.** `GET /profiles/me` rejects the admin role, so `AdminHomePage` deliberately avoids profile data. Any admin screen that needs it will need a backend change first.

**No tests.** There is no test runner configured. Vitest plus React Testing Library would be the natural fit for a Vite project.

---

## Roadmap

Tracks the PRD's phases, scoped to the frontend.

**Phase 1 — MVP.** Routing and role-aware layouts are in place. Next: build the seeker profile editor and the resume upload experience — including a parsed-resume review UI that shows confidence and lets users correct every extracted field. Then job browsing with search and filters, a recommended-jobs feed, apply flow, and application status tracking. On the recruiter side: company setup, job authoring, the applicant pipeline with ranked candidates and shortlist/reject actions, and semantic candidate search. Every recommendation surface needs its explainability panel (matched skills, experience overlap, missing qualifications) from the start, plus event instrumentation for activation and CTR.

**Phase 2 — Product-market fit.** Conversational career assistant for seekers (resume tips, job-fit Q&A, interview prep) and a recruiter copilot (rewrite JDs, generate screening questions, summarize pipelines). Saved searches, personalized alerts, recruiter collaboration, employer branding pages, and UI affordances that feed the ranking feedback loop — dismiss, not-interested, and shortlist signals.

**Phase 3 — Scale and monetization.** Subscription and billing surfaces, employer seat management, bulk outreach, interview scheduling, advanced analytics dashboards, and trust-and-safety tooling.

### Explicit non-goals

No HRIS or ATS replacement in MVP. No payroll, offer management, or onboarding screens. No UI that presents an AI decision as final — the human always acts.
