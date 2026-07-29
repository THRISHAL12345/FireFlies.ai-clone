import os
import json
from datetime import datetime, timedelta
import random

# Ensure seed_data directory exists
os.makedirs("seed_data", exist_ok=True)

meetings_data = [
    {
        "title": "Weekly Product Sync",
        "date": (datetime.utcnow() - timedelta(days=2)).isoformat(),
        "duration_seconds": 1800,
        "participants": [
            {"name": "Alice Johnson", "email": "alice@example.com"},
            {"name": "Bob Smith", "email": "bob@example.com"}
        ],
        "speakers": ["Alice", "Bob"],
        "transcript": [
            {"start": 0, "end": 15, "speaker": "Alice", "text": "Alright, let's get started. Bob, can you give an update on the new feature rollout?"},
            {"start": 15, "end": 45, "speaker": "Bob", "text": "Sure. The backend API is deployed and stable. We are seeing about a 20% increase in latency, but it's within acceptable limits. I'll create an action item to investigate optimization next week."},
            {"start": 45, "end": 60, "speaker": "Alice", "text": "Sounds good. Make sure to assign that to yourself. What about the frontend?"},
            {"start": 60, "end": 120, "speaker": "Bob", "text": "Frontend is looking great. The new UI is merged. We just need to do a final pass on the copy before we launch."},
            {"start": 120, "end": 140, "speaker": "Alice", "text": "Okay, I will review the copy by tomorrow morning. I think that covers our main agenda. Anything else?"},
            {"start": 140, "end": 150, "speaker": "Bob", "text": "No, that's it from me."},
            {"start": 150, "end": 155, "speaker": "Alice", "text": "Great, thanks everyone. Bye."}
        ],
        "summary": {
            "overview_text": "The team discussed the recent feature rollout. The backend API is stable but requires latency optimization. Frontend UI is merged and requires a final copy review.",
            "keywords": ["rollout", "API latency", "UI update", "copy review"],
            "generated_by": "seeded"
        },
        "outline_items": [
            {"title": "Backend Update", "start_time_seconds": 15},
            {"title": "Frontend Update", "start_time_seconds": 60},
            {"title": "Wrap Up", "start_time_seconds": 120}
        ],
        "action_items": [
            {"text": "Investigate API latency optimization", "assignee": "Bob Smith", "is_completed": False},
            {"text": "Review new UI copy", "assignee": "Alice Johnson", "is_completed": True}
        ]
    },
    {
        "title": "Q3 Planning Session",
        "date": (datetime.utcnow() - timedelta(days=5)).isoformat(),
        "duration_seconds": 3600,
        "participants": [
            {"name": "Alice Johnson", "email": "alice@example.com"},
            {"name": "Charlie Davis", "email": "charlie@example.com"},
            {"name": "Diana Prince", "email": "diana@example.com"}
        ],
        "speakers": ["Alice", "Charlie", "Diana"],
        "transcript": [
            {"start": 0, "end": 30, "speaker": "Alice", "text": "Welcome to our Q3 planning session. Our main goal is to align on the roadmap for the next three months. Charlie, do you want to start with engineering goals?"},
            {"start": 30, "end": 90, "speaker": "Charlie", "text": "Yes. Engineering's primary focus will be migrating to the new database cluster. We expect this to take roughly a month. After that, we want to tackle the mobile app redesign."},
            {"start": 90, "end": 150, "speaker": "Diana", "text": "From the design side, we have wireframes ready for the mobile app. We need engineering to review them by next Friday so we can finalize the assets."},
            {"start": 150, "end": 180, "speaker": "Alice", "text": "Okay, Charlie, please schedule a design review with your team. What about marketing?"},
            {"start": 180, "end": 240, "speaker": "Diana", "text": "Marketing is planning a big push for the new mobile release. We need a confirmed launch date by mid-Q3 to start booking ads."},
            {"start": 240, "end": 300, "speaker": "Charlie", "text": "I can commit to August 15th for the launch. Let's aim for that."},
            {"start": 300, "end": 330, "speaker": "Alice", "text": "Perfect. August 15th it is. Let's make sure all our action items reflect this timeline. Thanks everyone."}
        ],
        "summary": {
            "overview_text": "Q3 planning focused on the database migration and mobile app redesign. Engineering will spend a month on the database before starting the mobile app. A launch date of August 15th was agreed upon, allowing marketing to plan their push.",
            "keywords": ["Q3", "database migration", "mobile app", "launch date"],
            "generated_by": "seeded"
        },
        "outline_items": [
            {"title": "Engineering Goals", "start_time_seconds": 30},
            {"title": "Design Update", "start_time_seconds": 90},
            {"title": "Marketing Launch Date", "start_time_seconds": 180}
        ],
        "action_items": [
            {"text": "Review mobile app wireframes", "assignee": "Charlie Davis", "is_completed": False},
            {"text": "Schedule design review meeting", "assignee": "Charlie Davis", "is_completed": False},
            {"text": "Book marketing ads for launch", "assignee": "Diana Prince", "is_completed": False}
        ]
    },
    {
        "title": "Sales Sync with Acme Corp",
        "date": (datetime.utcnow() - timedelta(days=10)).isoformat(),
        "duration_seconds": 2400,
        "participants": [
            {"name": "Eve Smith", "email": "eve@example.com"},
            {"name": "Frank White", "email": "frank@acme.com"}
        ],
        "speakers": ["Eve", "Frank"],
        "transcript": [
            {"start": 0, "end": 45, "speaker": "Eve", "text": "Hi Frank, thanks for joining. I wanted to walk you through our new enterprise tier and how it might fit Acme's growing needs."},
            {"start": 45, "end": 105, "speaker": "Frank", "text": "Hi Eve. Yes, we are definitely interested. Our main concern right now is data residency. We need to ensure all our data stays within the EU."},
            {"start": 105, "end": 150, "speaker": "Eve", "text": "I completely understand. The good news is our new enterprise tier includes selectable regions. I can send you the documentation on our EU data centers."},
            {"start": 150, "end": 180, "speaker": "Frank", "text": "That would be perfect. If the documentation looks good, we can probably move forward with a trial next month."},
            {"start": 180, "end": 210, "speaker": "Eve", "text": "Excellent. I will get that over to you today. We'll also need to sign a new NDA before the trial starts. I'll have legal draft that up."},
            {"start": 210, "end": 230, "speaker": "Frank", "text": "Sounds like a plan. Looking forward to reviewing the docs. Thanks Eve."},
            {"start": 230, "end": 240, "speaker": "Eve", "text": "Thanks Frank, talk soon."}
        ],
        "summary": {
            "overview_text": "Sales discussion with Acme Corp regarding the enterprise tier. The client emphasized the need for EU data residency, which the enterprise tier supports. Eve will send documentation and draft an NDA to proceed with a trial next month.",
            "keywords": ["enterprise tier", "data residency", "EU", "trial", "NDA"],
            "generated_by": "seeded"
        },
        "outline_items": [
            {"title": "Enterprise Introduction", "start_time_seconds": 0},
            {"title": "Data Residency Concerns", "start_time_seconds": 45},
            {"title": "Next Steps: Docs & NDA", "start_time_seconds": 150}
        ],
        "action_items": [
            {"text": "Send EU data center documentation to Frank", "assignee": "Eve Smith", "is_completed": True},
            {"text": "Draft and send new NDA", "assignee": "Eve Smith", "is_completed": False}
        ]
    },
    {
        "title": "Design Review - Onboarding Flow",
        "date": (datetime.utcnow() - timedelta(days=1)).isoformat(),
        "duration_seconds": 2100,
        "participants": [
            {"name": "Diana Prince", "email": "diana@example.com"},
            {"name": "George King", "email": "george@example.com"}
        ],
        "speakers": ["Diana", "George"],
        "transcript": [
            {"start": 0, "end": 30, "speaker": "Diana", "text": "Thanks for taking the time, George. I want to show you the updated user onboarding flow. We've simplified the signup steps."},
            {"start": 30, "end": 60, "speaker": "George", "text": "Great, let's see it. Oh, I like how you combined the profile setup and team invite into one screen. That's much cleaner."},
            {"start": 60, "end": 90, "speaker": "Diana", "text": "Exactly. Our metrics showed a big drop-off there. However, I'm unsure about the color contrast on the primary CTA button. Do you think it's accessible?"},
            {"start": 90, "end": 120, "speaker": "George", "text": "Hmm, let me run it through the contrast checker... Yeah, it's a bit low. We should probably darken the purple shade slightly."},
            {"start": 120, "end": 150, "speaker": "Diana", "text": "Okay, I'll make a note to adjust the CTA colors for accessibility. I'll have the final version ready by tomorrow's sync."},
            {"start": 150, "end": 180, "speaker": "George", "text": "Awesome. The rest of the flow looks solid to me. Good work."},
            {"start": 180, "end": 190, "speaker": "Diana", "text": "Thanks George."}
        ],
        "summary": {
            "overview_text": "Review of the new onboarding flow design. The consolidated profile setup screen was approved. A contrast issue on the primary CTA button was identified and will be fixed by Diana before the next sync.",
            "keywords": ["onboarding", "design", "accessibility", "CTA"],
            "generated_by": "seeded"
        },
        "outline_items": [
            {"title": "Onboarding Flow Presentation", "start_time_seconds": 0},
            {"title": "Accessibility Check", "start_time_seconds": 60},
            {"title": "Wrap Up", "start_time_seconds": 150}
        ],
        "action_items": [
            {"text": "Adjust CTA button color for accessibility", "assignee": "Diana Prince", "is_completed": False},
            {"text": "Prepare final version for tomorrow's sync", "assignee": "Diana Prince", "is_completed": False}
        ]
    },
    {
        "title": "Incident Post-Mortem",
        "date": (datetime.utcnow() - timedelta(hours=12)).isoformat(),
        "duration_seconds": 3000,
        "participants": [
            {"name": "Alice Johnson", "email": "alice@example.com"},
            {"name": "Charlie Davis", "email": "charlie@example.com"},
            {"name": "Hannah Lee", "email": "hannah@example.com"}
        ],
        "speakers": ["Alice", "Charlie", "Hannah"],
        "transcript": [
            {"start": 0, "end": 45, "speaker": "Alice", "text": "Let's begin the post-mortem for yesterday's outage. Charlie, can you walk us through the timeline?"},
            {"start": 45, "end": 120, "speaker": "Charlie", "text": "At 2 PM, we saw a massive spike in database connections, which eventually starved the connection pool. The API started returning 500s. We identified a misconfigured cron job that was spawning too many worker threads."},
            {"start": 120, "end": 180, "speaker": "Hannah", "text": "I was on call. It took us about 30 minutes to pinpoint the cron job. Once we killed it, the system recovered immediately. We need better alerting on connection pool saturation."},
            {"start": 180, "end": 240, "speaker": "Alice", "text": "I agree. Hannah, can you take the action item to set up DataDog alerts for when the connection pool hits 80% capacity?"},
            {"start": 240, "end": 270, "speaker": "Hannah", "text": "Yes, I can do that today. I'll also add a runbook entry for this specific scenario."},
            {"start": 270, "end": 330, "speaker": "Charlie", "text": "I'll take the action to fix the cron job configuration so it enforces a strict concurrency limit. We should also review all other cron jobs to ensure they follow this pattern."},
            {"start": 330, "end": 360, "speaker": "Alice", "text": "Good plan. Let's make sure these action items are done by the end of the sprint. Thanks for the quick response during the incident, team."}
        ],
        "summary": {
            "overview_text": "Post-mortem for the recent outage caused by a misconfigured cron job exhausting the database connection pool. The team resolved the issue in 30 minutes. Action items include setting up new connection pool alerts, updating the runbook, and fixing the cron job concurrency limits.",
            "keywords": ["outage", "post-mortem", "database", "cron job", "alerting"],
            "generated_by": "seeded"
        },
        "outline_items": [
            {"title": "Incident Timeline", "start_time_seconds": 45},
            {"title": "Alerting Improvements", "start_time_seconds": 120},
            {"title": "Root Cause Fix", "start_time_seconds": 270}
        ],
        "action_items": [
            {"text": "Set up DataDog alerts for connection pool > 80%", "assignee": "Hannah Lee", "is_completed": False},
            {"text": "Add runbook entry for connection pool exhaustion", "assignee": "Hannah Lee", "is_completed": False},
            {"text": "Fix cron job concurrency limit", "assignee": "Charlie Davis", "is_completed": False},
            {"text": "Audit other cron jobs for concurrency limits", "assignee": "Charlie Davis", "is_completed": False}
        ]
    }
]

for i, meeting in enumerate(meetings_data):
    file_path = os.path.join("seed_data", f"meeting_{i+1}.json")
    with open(file_path, "w") as f:
        json.dump(meeting, f, indent=2)

print("Seed fixtures generated in seed_data/")
