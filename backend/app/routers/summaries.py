from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from app.db import get_db
from app.models import domain as models
from app.schemas import domain as schemas
from app.services import llm_service

router = APIRouter(prefix="/api/meetings/{meeting_id}/summary", tags=["summaries"])

@router.get("", response_model=schemas.Summary)
def get_summary(meeting_id: int, db: Session = Depends(get_db)):
    summary = db.query(models.Summary).filter(models.Summary.meeting_id == meeting_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")
        
    # Pydantic schema expects a list for keywords, but our model has a property keywords_list
    # Let's map it manually or let from_attributes do the job (it needs a bit of help since the model has a property)
    
    # Actually from_attributes should pick up keywords_list property if we aliased it or if we just construct the pydantic model.
    # To be safe, we'll construct it:
    return schemas.Summary(
        id=summary.id,
        meeting_id=summary.meeting_id,
        overview_text=summary.overview_text,
        keywords=summary.keywords,
        generated_by=summary.generated_by,
        created_at=summary.created_at
    )

@router.post("/regenerate", response_model=schemas.Summary)
def regenerate_summary(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    segments = db.query(models.TranscriptSegment).filter(
        models.TranscriptSegment.meeting_id == meeting_id
    ).order_by(models.TranscriptSegment.sort_order).all()
    transcript_text = "\\n".join([f"[{s.start_time_seconds} - {s.end_time_seconds}] {s.text}" for s in segments])
    
    llm_result = llm_service.generate_summary(meeting.title, transcript_text)
    
    summary = db.query(models.Summary).filter(models.Summary.meeting_id == meeting_id).first()
    if not summary:
        summary = models.Summary(meeting_id=meeting_id)
        db.add(summary)
        
    if llm_result:
        summary.overview_text = llm_result.get("overview_text", "Failed to parse overview.")
        summary.keywords = llm_result.get("keywords", [])
        summary.generated_by = "llm"
        
        # We could also insert action_items and outline here, but for now we focus on updating summary
        # If the user wants full sync, we'd delete old action items and insert new ones
    else:
        # Mock fallback
        summary.overview_text = "[MOCK] Regenerated LLM Summary for: " + meeting.title
        summary.keywords = ["mock", "regenerated", "llm"]
        summary.generated_by = "mock"
    
    db.commit()
    db.refresh(summary)
    
    return schemas.Summary(
        id=summary.id,
        meeting_id=summary.meeting_id,
        overview_text=summary.overview_text,
        keywords=summary.keywords,
        generated_by=summary.generated_by,
        created_at=summary.created_at
    )
