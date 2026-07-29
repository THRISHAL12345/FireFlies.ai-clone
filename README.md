# Fireflies.ai Clone

A functional, high-fidelity clone of the Fireflies.ai meeting notes and transcription platform. This project allows users to browse a library of past meetings, view interactive transcripts with synchronized media playback, and read AI-generated summaries and action items.

---

## 🏗️ Architecture Overview

The application is built on a decoupled **client-server architecture**:

1. **Frontend (Next.js)**: Responsible for the user interface, routing, state management, and rendering. It communicates with the backend exclusively via REST APIs.
2. **Backend (FastAPI)**: Serves as the core logic handler. It exposes RESTful endpoints, manages database connections, handles CRUD operations for meetings and transcripts, and orchestrates the LLM integration for generating summaries.
3. **Database (SQLite)**: A lightweight, relational database storing all structured data (meetings, segments, participants, etc.).

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS v4, Lucide React (Icons).
- **Backend**: Python 3, FastAPI, SQLAlchemy (ORM), Pydantic (Data validation).
- **Database**: SQLite (local file-based relational database).
- **AI Integration**: Designed to integrate with Anthropic's Claude (or similar LLMs) for summary generation.

---

## 🗄️ Database Schema

The database is built on a normalized relational model to efficiently handle transcripts, speakers, and AI-generated metadata.

### Core Tables
* **`meetings`**: The central entity. Stores `title`, `date`, `duration_seconds`, `media_url`, and `status`.
* **`participants`**: Stores unique user identities (`name`, `email`).
* **`meeting_participants`**: A many-to-many join table linking `meetings` and `participants`.

### Transcript Data
* **`speakers`**: Represents a distinct voice in a transcript (e.g., "Speaker 1"). Links to `meeting_id` and optionally a resolved `participant_id`.
* **`transcript_segments`**: The backbone of the app. Stores the actual conversation snippets. Includes `start_time_seconds`, `end_time_seconds`, `text`, and links to the `speaker_id` and `meeting_id`.

### AI Outputs
* **`summaries`**: 1-to-1 relationship with `meetings`. Stores the AI-generated `overview_text`, `keywords` (JSON), and generation method.
* **`outline_items`**: Chapters/topics extracted from the meeting, tied to a `start_time_seconds`.
* **`action_items`**: Tasks assigned during the meeting. Tracks `text`, `is_completed`, and an optional `assignee`.

---

## 🔌 API Design (REST)

The FastAPI backend exposes the following clean RESTful endpoints:

**Meetings (CRUD)**
* `GET /api/meetings`: List all meetings (Supports query params: `q` for search, `participant`, `sort`).
* `POST /api/meetings`: Create a new meeting.
* `GET /api/meetings/{id}`: Fetch full meeting details (metadata, summary, action items).
* `PATCH /api/meetings/{id}`: Update meeting metadata (title, etc.).
* `DELETE /api/meetings/{id}`: Delete a meeting and cascade delete its assets.

**Transcripts**
* `GET /api/meetings/{id}/transcript`: Fetch ordered transcript segments.
* `GET /api/meetings/{id}/transcript/search?q=...`: Full-text search within a specific transcript.

**AI & Metadata**
* `GET /api/meetings/{id}/summary`: Fetch the summary for a meeting.
* `POST /api/meetings/{id}/summary/regenerate`: Trigger the LLM to process the transcript and generate a new summary, outline, and action items.
* `GET /api/meetings/{id}/action-items`: List action items.
* `POST /api/meetings/{id}/action-items`: Manually create an action item.
* `PATCH /api/action-items/{id}/complete`: Toggle the completion status of a task.

---

## 🚀 Setup Instructions

### Prerequisites
* **Node.js** (v18+)
* **Python** (3.10+)

### 1. Backend Setup (FastAPI)
Open a terminal and navigate to the `backend` directory:
```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations & seed initial mock data
python scripts/seed.py

# Start the API server
uvicorn app.main:app --reload --port 8000
```
*The backend will now be running on `http://localhost:8000`.*

### 2. Frontend Setup (Next.js)
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The frontend will now be running on `http://localhost:3000`.*

---

## 🧠 Assumptions Made

As per the project brief, the following assumptions and design decisions were made to prioritize core functionality:
1. **Authentication**: No real authentication flow exists. We assume a single default logged-in user for demonstration purposes.
2. **Audio/Video Player**: The media player UI is functional (seeking works), but it plays a placeholder/sample file. Real dynamic recording ingest is out of scope.
3. **Action Item Assignees**: Assignees are treated as free-text strings. If they happen to match a known participant, they can be linked later, but strict Foreign Key enforcement is relaxed for flexibility.
4. **Duration**: Meeting duration is automatically computed based on the final timestamp of the transcript's last segment.
5. **Speech-to-Text**: Real, live transcription of audio is completely out of scope. Transcripts are either seeded, pasted, or simulated via uploaded JSON/VTT files.
6. **Integrations & Live Bots**: Features like Zoom integration or live-bot joining are represented by "Coming Soon" placeholders in the UI.
