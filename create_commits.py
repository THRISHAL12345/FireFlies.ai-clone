import os
import subprocess

def run(cmd):
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True)

commits = [
    ('Define SQLAlchemy database models', 'backend/app/models/'),
    ('Define Pydantic schemas for API validation', 'backend/app/schemas/'),
    ('Implement database configuration and session management', 'backend/app/db.py'),
    ('Implement LLM chat API routes', 'backend/app/routers/chat.py'),
    ('Add LLM summary generation service', 'backend/app/services/llm_service.py'),
    ('Add backend test scripts and generators', 'backend/test_api.py backend/generate_fixtures.py'),
    ('Initialize frontend with Next.js configuration', 'frontend/package.json frontend/package-lock.json frontend/next.config.mjs frontend/tsconfig.json frontend/tailwind.config.ts frontend/postcss.config.js frontend/postcss.config.mjs'),
    ('Add global styles and root layout', 'frontend/src/app/globals.css frontend/src/app/layout.tsx frontend/src/app/loading.tsx frontend/src/app/not-found.tsx frontend/src/app/favicon.ico'),
    ('Implement frontend API client', 'frontend/src/lib/api.ts'),
    ('Add shared frontend types and custom hooks', 'frontend/src/lib/types.ts frontend/src/lib/hooks.ts'),
    ('Implement dashboard UI components', 'frontend/src/components/dashboard/'),
    ('Implement main meetings dashboard page', 'frontend/src/app/(app)/'),
    ('Implement meeting detail page routing', 'frontend/src/app/(meeting)/'),
    ('Implement dashboard layout components', 'frontend/src/components/layout/'),
    ('Add core meeting workspace components', 'frontend/src/components/meetings/MeetingCard.tsx frontend/src/components/meetings/MeetingRow.tsx frontend/src/components/meetings/MeetingHeader.tsx frontend/src/components/meetings/MeetingSidebar.tsx frontend/src/components/meetings/MeetingWorkspace.tsx'),
    ('Implement interactive TranscriptPanel with segment sync', 'frontend/src/components/meetings/TranscriptPanel.tsx frontend/src/components/meetings/TranscriptLine.tsx'),
    ('Implement Audio Player with bidirectional sync logic', 'frontend/src/components/meetings/Player.tsx'),
    ('Add SmartSearchPanel with dynamic AI sentiment filtering', 'frontend/src/components/meetings/SmartSearchPanel.tsx'),
    ('Implement Notes, Outline, and Action Items tabs', 'frontend/src/components/meetings/NotesTab.tsx frontend/src/components/meetings/OutlineTab.tsx frontend/src/components/meetings/ActionItemsTab.tsx'),
    ('Add Capture meeting modal and list filters', 'frontend/src/components/meetings/CaptureModal.tsx frontend/src/components/meetings/Filters.tsx'),
    ('Add static public assets and images', 'frontend/public/'),
    ('Final configuration and cleanup', '.vscode/ pyrightconfig.json create_commits.py backend/app/__pycache__/ backend/app/routers/__pycache__/ backend/app/services/__pycache__/ backend/fireflies.db')
]

for msg, path in commits:
    run(f'git add {path}')
    status = subprocess.run("git status --porcelain", shell=True, capture_output=True, text=True)
    if status.stdout.strip():
        run(f'git commit -m "{msg}"')
    else:
        print(f"Skipping commit '{msg}' - no files to commit")

run("git push -u origin main")
