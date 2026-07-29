import os
import json
from datetime import datetime
import sys

# Ensure we can import the app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import SessionLocal, engine, Base
from app.models.domain import (
    User, Meeting, Participant, Speaker, 
    TranscriptSegment, Summary, OutlineItem, ActionItem
)

def reset_db():
    print("Resetting database...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    # 1. Create a default user
    default_user = User(name="Default Admin", email="admin@fireflies.local")
    db.add(default_user)
    db.commit()
    
    # 2. Read fixtures and populate
    seed_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "seed_data")
    if not os.path.exists(seed_dir):
        print(f"Seed data directory not found: {seed_dir}")
        return

    # To reuse participants across meetings, keep a dict
    participant_cache = {}

    for filename in os.listdir(seed_dir):
        if not filename.endswith(".json"):
            continue
            
        file_path = os.path.join(seed_dir, filename)
        with open(file_path, "r") as f:
            data = json.load(f)
            
        print(f"Seeding meeting: {data['title']}")
        
        transcript_data = data.get("transcript", [])
        computed_duration = transcript_data[-1]["end"] if transcript_data else data.get("duration_seconds", 0)
        
        meeting = Meeting(
            title=data['title'],
            date=datetime.fromisoformat(data['date']),
            duration_seconds=computed_duration,
            status="processed"
        )
        db.add(meeting)
        db.flush() # Get meeting.id
        
        # Participants
        for p_data in data.get("participants", []):
            email = p_data.get("email")
            if email not in participant_cache:
                participant = Participant(name=p_data["name"], email=email)
                db.add(participant)
                db.flush()
                participant_cache[email] = participant
            else:
                participant = participant_cache[email]
            
            meeting.participants.append(participant)
            
        db.flush()

        # Speakers (Map labels to participant objects if possible)
        speaker_cache = {}
        for s_label in data.get("speakers", []):
            # Try to find a matching participant by name (first name match)
            matched_p = None
            for p in meeting.participants:
                if p.name.startswith(s_label):
                    matched_p = p
                    break
                    
            speaker = Speaker(
                meeting_id=meeting.id,
                label=s_label,
                participant_id=matched_p.id if matched_p else None
            )
            db.add(speaker)
            db.flush()
            speaker_cache[s_label] = speaker

        # Transcript
        sort_order = 0
        for t_data in data.get("transcript", []):
            speaker_label = t_data["speaker"]
            speaker = speaker_cache.get(speaker_label)
            
            segment = TranscriptSegment(
                meeting_id=meeting.id,
                speaker_id=speaker.id if speaker else None,
                start_time_seconds=t_data["start"],
                end_time_seconds=t_data["end"],
                text=t_data["text"],
                sort_order=sort_order
            )
            db.add(segment)
            sort_order += 1
            
        # Summary
        s_data = data.get("summary")
        if s_data:
            summary = Summary(
                meeting_id=meeting.id,
                overview_text=s_data["overview_text"],
                generated_by=s_data["generated_by"]
            )
            summary.keywords = s_data["keywords"]
            db.add(summary)
            
        # Outline Items
        for i, o_data in enumerate(data.get("outline_items", [])):
            outline = OutlineItem(
                meeting_id=meeting.id,
                title=o_data["title"],
                start_time_seconds=o_data["start_time_seconds"],
                sort_order=i
            )
            db.add(outline)
            
        # Action Items
        for a_data in data.get("action_items", []):
            assignee_name = a_data.get("assignee")
            matched_p = None
            if assignee_name:
                for p in meeting.participants:
                    if p.name == assignee_name:
                        matched_p = p
                        break
                        
            action = ActionItem(
                meeting_id=meeting.id,
                text=a_data["text"],
                assignee=assignee_name,
                participant_id=matched_p.id if matched_p else None,
                is_completed=a_data["is_completed"]
            )
            db.add(action)
            
    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    reset_db()
    seed_database()
