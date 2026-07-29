# AGENTS.md — Fireflies.ai Clone (SDE Fullstack Take-Home)

This file is the single source of truth for any AI coding agent (Claude Code, Cursor,
Copilot, etc.) working on this repository. Read this file completely before writing
any code. Every requirement below traces back to the original assignment brief —
nothing here is invented scope, and nothing in the brief has been dropped.

If a task is ambiguous, resolve it using the "Assumptions" section at the bottom
rather than asking the human to clarify mid-build.

---

## 1. Mission

Build a functional, visually faithful clone of **Fireflies.ai** — an AI meeting
notes and transcription platform. The clone must let a user:

- Browse a library of past meetings
- Open a meeting and read an interactive, speaker-labeled, timestamped transcript
- See an AI-generated summary, action items, and topic outline for that meeting
- Search within a transcript (highlighted matches) and across the meetings library
- Create, edit, and delete meetings and their action items
- Feel, visually and interactionally, like the real Fireflies app — not a generic
  "notes app"

Real speech-to-text is **out of scope**. Transcripts are seeded, uploaded, or pasted.
Summaries can be mocked/seeded OR generated live from transcript text via an LLM call
— prefer the LLM path where feasible, since genuine AI-generated summaries score
better on both "Functionality" and "AI Tools Usage" in the eval rubric.

---

## 2. Tech Stack (fixed — do not substitute)

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + TypeScript |
| Backend | Python — FastAPI (preferred) or Django |
| Database | SQLite (custom schema — see §5) |
| Styling | Tailwind CSS (fastest path to Fireflies' clean, card-based aesthetic) |
| Auth | None — assume a single default logged-in user, no real auth flow |
| Deployment | Frontend → Vercel/Netlify. Backend → Render/Railway. Must be a live, working link |

Do not introduce a different backend framework, a different database, or swap
Next.js for another React framework. These are fixed requirements from the brief.

---

## 3. Repository Structure

```
/
├── frontend/                  # Next.js + TypeScript app
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   └── page.tsx           # Meetings Library / Dashboard
│   │   ├── meetings/
│   │   │   ├── new/page.tsx       # Create meeting (upload/paste transcript)
│   │   │   └── [id]/page.tsx      # Meeting detail (transcript + summary)
│   │   ├── settings/page.tsx      # Settings placeholder
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/                # Navbar, Sidebar
│   │   ├── meetings/               # MeetingCard, MeetingList, Filters, SearchBar
│   │   ├── transcript/             # TranscriptPanel, TranscriptLine, Player, SeekBar
│   │   ├── summary/                 # SummaryPanel, ActionItems, Outline/Chapters
│   │   └── ui/                      # Buttons, Modals, Toasts, Inputs (shared primitives)
│   ├── lib/                        # API client, types, utils
│   └── styles/
├── backend/                    # FastAPI (or Django) app
│   ├── app/
│   │   ├── main.py
│   │   ├── models/                 # SQLAlchemy models (or Django models)
│   │   ├── schemas/                # Pydantic schemas
│   │   ├── routers/                # meetings.py, transcripts.py, summaries.py, action_items.py
│   │   ├── services/               # llm_summary.py, seed.py
│   │   └── db.py
│   ├── seed_data/                  # sample transcripts + JSON fixtures
│   └── tests/
├── README.md
└── AGENTS.md                   # this file
```

---

## 4. Core Features — Must Have (exact scope from brief)

### 4.1 Meetings Library / Dashboard
- List of past meetings: title, date, duration, participants
- Search and filter by title, date, participant
- Sort by recency
- Navbar with profile/settings placeholders

### 4.2 Meeting / Transcript Detail View
- Interactive transcript with speaker labels + timestamps
- Media player area with a seek bar (audio/video may be a placeholder or sample file)
- Clicking a transcript line seeks the player to that timestamp, **and** player
  progress highlights/scrolls to the active transcript line (bidirectional sync —
  this is explicitly required, not optional)
- Search within the transcript with highlighted matches

### 4.3 AI Summary & Notes
- AI-generated meeting summary section
- Action items / tasks extracted from the meeting
- Key topics / outline / chapters
- Summaries seeded, mocked, or LLM-generated from transcript text

### 4.4 Meeting Management (CRUD)
- Create a meeting (upload transcript, paste transcript, or via a form)
- Edit meeting metadata (title, participants)
- Delete a meeting
- Add / edit / complete action items
- Everything persists (meetings, transcripts, summaries, action items)

### 4.5 Fireflies Experience (look-and-feel parity)
- Navigation and layout mirroring library + detail view structure
- Transcript and summary panels laid out side by side in the detail view
- Forms, modals, search, filters
- Notifications / toasts
- Settings placeholders

### 4.6 Explicitly Mocked / Placeholder-Only (do NOT build real versions of these)
- Real-time bot joining live calls → "Coming Soon" placeholder
- Actual speech-to-text → out of scope entirely
- Integrations (Zoom, Google Meet, calendar, CRM) → "Coming Soon" placeholder
- Team / sharing / collaboration → "Coming Soon" placeholder
- Real user authentication → assume a default logged-in user, no login flow

### 4.7 Bonus (optional, build only after 4.1–4.6 are solid)
- Comments / highlights / soundbites on transcript segments
- Export transcript or summary (PDF / Markdown / TXT)
- Global search across all meetings
- Tags / topics with filtering
- LLM "ask a question about this meeting" chat (mirrors Fireflies' real "AskFred" feature)
- Dark mode

---

## 5. Database Schema (design target — evaluated criterion, get this right)

```
users
  id (PK)
  name
  email
  created_at

meetings
  id (PK)
  title
  date
  duration_seconds
  media_url            -- nullable, placeholder/sample file path
  status                -- e.g. 'processed' | 'processing' (mock states are fine)
  created_at
  updated_at

participants
  id (PK)
  name
  email                 -- nullable

meeting_participants     -- many-to-many join
  meeting_id (FK -> meetings.id)
  participant_id (FK -> participants.id)

speakers                  -- distinct from participants: speaker labels as they
  id (PK)                 -- appear in the transcript (may map 1:1 to a participant)
  meeting_id (FK -> meetings.id)
  label                    -- e.g. "Speaker 1" or resolved name
  participant_id (FK -> participants.id, nullable)

transcript_segments
  id (PK)
  meeting_id (FK -> meetings.id)
  speaker_id (FK -> speakers.id)
  start_time_seconds
  end_time_seconds
  text
  sort_order

summaries
  id (PK)
  meeting_id (FK -> meetings.id, unique)  -- one summary per meeting
  overview_text
  keywords              -- JSON array or separate table (see summary_keywords)
  generated_by           -- 'llm' | 'seeded' | 'manual'
  created_at

outline_items            -- topics / chapters
  id (PK)
  meeting_id (FK -> meetings.id)
  title
  start_time_seconds
  sort_order

action_items
  id (PK)
  meeting_id (FK -> meetings.id)
  text
  assignee               -- free text or FK -> participants.id, nullable
  is_completed            -- boolean, default false
  due_date                -- nullable
  created_at

tags                       -- bonus feature
  id (PK)
  name

meeting_tags               -- bonus feature, many-to-many
  meeting_id (FK -> meetings.id)
  tag_id (FK -> tags.id)

comments                   -- bonus feature
  id (PK)
  meeting_id (FK -> meetings.id)
  transcript_segment_id (FK -> transcript_segments.id, nullable)
  text
  created_at
```

Design notes for the agent:
- `transcript_segments` is the backbone of the whole app — the player sync, the
  transcript search, and the outline all read from it. Index on `(meeting_id, start_time_seconds)`.
- Keep `summaries` 1:1 with `meetings` rather than embedding summary text on the
  meetings table — it keeps regeneration (re-running the LLM) clean and auditable.
- `speakers` is intentionally separate from `participants` because a transcript
  may have "Speaker 1 / Speaker 2" labels before/without being resolved to a real
  participant identity — this mirrors how Fireflies actually handles diarization.

---

## 6. API Design (REST, FastAPI-style paths — adapt if using Django)

```
GET    /api/meetings                    # list + search/filter/sort query params
POST   /api/meetings                    # create (accepts transcript upload or paste)
GET    /api/meetings/{id}               # full detail: metadata + transcript + summary + action items
PATCH  /api/meetings/{id}                # edit metadata (title, participants)
DELETE /api/meetings/{id}

GET    /api/meetings/{id}/transcript     # transcript segments (paginated if long)
GET    /api/meetings/{id}/transcript/search?q=...   # in-transcript search, returns matching segment ids + offsets

GET    /api/meetings/{id}/summary
POST   /api/meetings/{id}/summary/regenerate    # re-run LLM summary generation

GET    /api/meetings/{id}/action-items
POST   /api/meetings/{id}/action-items
PATCH  /api/action-items/{id}            # edit text / assignee / due date
PATCH  /api/action-items/{id}/complete    # toggle completion

GET    /api/search?q=...                 # bonus: global search across meetings
```

Query params on `GET /api/meetings`: `q` (title search), `participant`, `date_from`,
`date_to`, `sort` (`recent` default).

---

## 7. UI/UX Specification (Fireflies parity)

Researched from the real Fireflies.ai product. Match this structure and tone —
clean, productivity-focused, generous white space, card-based lists, purple/indigo
as the primary brand accent with a warm orange/yellow secondary accent for
highlights and CTAs.

### 7.1 Global Layout
- **Left sidebar**: logo, primary nav (Meetings/Home, Search, Settings placeholder,
  Integrations placeholder marked "Coming Soon"), collapsed/expandable.
- **Top bar** (on dashboard): search input, notifications bell, profile avatar menu.

### 7.2 Meetings Library (Dashboard)
- Meeting list rendered as **cards or rows**, each showing: title, date/time,
  duration, participant avatars (stacked), and a 2–3 bullet AI-style summary
  preview (short sentence fragments) so the user can scan meeting content without
  opening it — this scannable-preview pattern is a signature Fireflies UX detail,
  replicate it even though the brief doesn't spell it out line-by-line.
- Filter bar above the list: search box, date range, participant filter, sort
  dropdown (defaults to Recent).
- Empty state and "Create Meeting" primary button in the top-right of this view.

### 7.3 Meeting Detail View
Three-region layout:
1. **Header**: meeting title (inline-editable), date, participants, edit/delete
   actions, back-to-library link.
2. **Left/main panel — tabbed**: `Notes` (summary + keywords + overview),
   `Action Items`, `Outline/Chapters`. Tabs, not separate pages — Fireflies keeps
   these as a tab set inside the same panel.
3. **Right panel — Transcript**: scrollable transcript with speaker labels and
   timestamps per line, search box with highlighted matches, and the media
   player + seek bar pinned above or below it. Clicking any line seeks the
   player; playback progress auto-scrolls and highlights the active line.

### 7.4 Interaction Details
- Toasts for create/edit/delete/complete actions (bottom-right, auto-dismiss).
- Modals for: create meeting, edit metadata, delete confirmation, add action item.
- Loading and empty states everywhere data is fetched.
- Action items render as a checklist; completing one strikes it through, doesn't
  remove it.

### 7.5 Visual Language
- Typography: clean sans-serif (Inter or similar), strong heading weight,
  comfortable line height for transcript readability.
- Color: white/near-white background, indigo/purple primary, soft grays for
  secondary text and borders, one accent color reserved for AI-generated content
  markers (badges like "AI Summary", "AI Generated") — Fireflies visually tags
  AI-produced content distinctly from user-entered content; replicate that.

---

## 8. Sample Data / Seeding

- Seed **at least 5 meetings**, each with:
  - Full transcript (10–30 realistic segments across 2–4 speakers)
  - A generated or hand-written summary with keywords + overview
  - 3–6 action items, some completed, some not
  - An outline of 3–5 topic chapters with timestamps
- Store seed transcripts as `.json` or `.vtt`-style fixtures in `backend/seed_data/`
  and load them via a `seed.py` script run on first startup or via a CLI command.
- Vary meeting types (standup, sales call, 1:1, planning session) so the library
  view looks realistic rather than repetitive.

---

## 9. LLM Summary Generation (recommended path)

- Backend service `services/llm_summary.py` takes a transcript's full text and
  calls an LLM (Anthropic API or equivalent) to produce: overview paragraph,
  3–6 keywords, bullet-point notes, action items with assignees where inferable,
  and a topic outline with approximate timestamps.
- Prompt the model to return **strict JSON** matching the `summaries` /
  `action_items` / `outline_items` shape so the response can be parsed directly
  into the database without brittle regex parsing.
- Fall back to seeded/mocked summaries if no LLM API key is configured, so the
  app remains fully demoable offline.
- Expose this via `POST /api/meetings/{id}/summary/regenerate` so the evaluator
  can watch it run live — this is a strong signal of "real" functionality vs. a
  static mock.

---

## 10. Non-Functional Requirements

- **TypeScript**: strict mode on, no `any` in new code without a comment
  justifying it.
- **Separation of concerns**: no business logic inside React components beyond
  simple derived UI state; API calls live in `lib/api.ts`, not scattered inline.
- **Reusability**: build the transcript line, meeting card, and modal as generic
  reusable components, not one-off per-page markup.
- **Backend**: routers thin, logic in `services/`, DB access via a repository/
  service layer, not raw queries inside route handlers.
- **Persistence**: SQLite file committed to `.gitignore`, but seed script must
  regenerate it reliably from a clean clone.
- **Tests**: at minimum, backend unit tests for CRUD endpoints and the
  transcript-search endpoint.

---

## 11. Build Order (recommended phases for the agent to follow)

1. **Schema + backend scaffold** — implement §5 models, migrations, seed script.
   Verify seeded data loads correctly before touching the frontend.
2. **Backend CRUD + read endpoints** — implement §6 fully, test with a REST
   client before wiring any UI.
3. **Frontend scaffold** — Next.js app shell, sidebar/navbar, routing per §3.
4. **Meetings Library view** — list, search, filter, sort, card component.
5. **Meeting Detail view** — transcript panel + player + bidirectional seek sync
   first (this is the highest-risk interactive feature — de-risk it early).
6. **Summary/Notes/Action Items tabs** — wire to backend, including the
   regenerate-summary flow.
7. **CRUD flows in UI** — create/edit/delete meeting modals, action item
   add/edit/complete.
8. **Polish pass** — toasts, empty/loading states, visual parity pass against
   real Fireflies screenshots, responsive check.
9. **Bonus features** — only after all of the above is solid and demoable.
10. **README + deploy** — write docs, deploy both halves, verify the public
    links work from a clean/incognito session.

---

## 12. README Requirements (write this last, once architecture is final)

Must include:
- Setup instructions (local dev, both frontend and backend)
- Tech stack used
- Architecture overview (how frontend/backend/DB fit together)
- Database schema (can reference/reproduce §5)
- API overview (can reference/reproduce §6)
- Assumptions made (see §13 below — carry these over)

---

## 13. Assumptions (use these to resolve ambiguity without stopping to ask)

- Single default logged-in user; no multi-tenant auth.
- "Media player" can play a placeholder/sample audio or video file — it does not
  need to correspond to a real recording of the seeded transcript content.
- Action item assignees are free-text strings unless a matching participant
  exists, in which case link by `participant_id`.
- "Duration" on a meeting is computed from the transcript's last segment
  `end_time_seconds` unless explicitly set.
- Transcript upload accepts `.txt`, `.vtt`, and `.json` (segment array) formats.
- Deployment budget is free-tier services (Vercel/Render/Railway free tiers are
  acceptable and expected).

---

## 14. Deliverables Checklist

- [ ] Public GitHub repo with `frontend/` and `backend/`
- [ ] README with setup, architecture, schema, API overview, assumptions
- [ ] Seeded database with ≥5 realistic meetings
- [ ] Deployed, working demo link (frontend + backend both reachable)
- [ ] All Core Features (§4.1–4.6) functioning end-to-end
- [ ] Author can explain every part of the codebase in the evaluation interview
