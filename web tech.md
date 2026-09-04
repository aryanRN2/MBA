# MISSION & SPECIFICATION: ULTRA-FAST MCQ PRACTICE & TESTING WEB APP

## 1. OBJECTIVE & PERFORMANCE REQUIREMENTS
Build a full-stack, responsive, zero-latency MCQ practice testing application.
- Target Metric: Sub-50ms UI response times during question navigation.
- Initial Bundle Size: Minimal client-side JavaScript.
- Formula/Math Support: Render LaTeX/scientific notation instantly without blocking the main UI thread.
- Resilience: Offline-safe state persistence (progress preserved across reloads).

---

## 2. TECHNOLOGY STACK
- Frontend: SvelteKit (or Next.js with React Server Components) + Tailwind CSS + Lucide Icons.
- Math & Code Rendering: KaTeX (lightweight, client-rendered).
- Backend / API: FastAPI (Python) with Pydantic schemas and async endpoints.
- Database: SQLite (local development) / PostgreSQL schema via SQLAlchemy or Prisma.
- Client State Management: Local reactive store paired with IndexedDB/localStorage sync.

---

## 3. CORE ARCHITECTURAL RULES
1. Single-Payload Test Delivery:
   - When a user starts an exam/quiz, fetch the entire test payload (questions, metadata, option choices) in a single compressed JSON response.
   - Question-to-question navigation must execute strictly in memory with 0ms server latency.
2. Two Operational Modes:
   - Practice Mode: Solutions, detailed explanations, and KaTeX breakdown are revealed immediately upon option selection.
   - Timed Exam Mode: Correct answer keys and explanations are omitted from the initial payload. Answers are submitted in batch at the end for server-side evaluation.
3. State Resilience:
   - Persist question index, selected options, flagged-for-review items, and remaining timer seconds to `localStorage` on every user action.
   - If the user reloads or disconnects, the UI must hydrate back to the exact question and timer state.
4. UI & Layout:
   - Clean, test-taking layout: Top navigation (Timer, Question counter, Finish button).
   - Central view: Question card with KaTeX formula support, clear radio option choices with keyboard accessibility (keys 1-4 or A-D).
   - Side panel / Drawer: Responsive Question Grid Palette showing status (Answered, Unanswered, Marked for Review).

---

## 4. DATABASE & DATA MODEL SPECIFICATION
Create the following relational entities:
- `Subject` (id, title, slug)
- `Topic` (id, subject_id, title)
- `Question` (id, topic_id, question_latex, explanation_latex, difficulty, created_at)
- `Option` (id, question_id, option_text, is_correct)
- `QuizAttempt` (id, user_id, start_time, end_time, total_score, status)
- `AttemptAnswer` (id, attempt_id, question_id, selected_option_id, is_correct)

---

## 5. STEP-BY-STEP EXECUTION PLAN FOR AGENT
1. Architecture & Scaffold:
   - Initialize the project structure: `/frontend` and `/backend`.
   - Set up Tailwind CSS and configure KaTeX styling.
2. Backend Implementation:
   - Implement database models and migrations.
   - Create mock seeds with at least 15 sample math and science questions containing LaTeX equations (e.g., quadratic equations, integrals, matrices).
   - Expose REST endpoints:
     - `GET /api/v1/tests/{id}?mode=practice|exam`
     - `POST /api/v1/tests/{id}/submit`
     - `GET /api/v1/tests/{id}/analytics`
3. Frontend Implementation:
   - Build test player engine with zero-latency navigation.
   - Implement high-accuracy web-worker-backed countdown timer.
   - Implement KaTeX auto-render wrapper for formulas.
   - Build the interactive question grid navigator.
4. Validation & Verification:
   - Test full quiz run in practice mode and timed exam mode.
   - Confirm page reload retains user answers and timer state.
   - Verify mobile responsiveness and responsive breakpoints.