from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import asc
from typing import List

from app.db import get_db
from app.models import domain as models
from app.schemas import domain as schemas

router = APIRouter(prefix="/api/meetings/{meeting_id}/transcript", tags=["transcripts"])

@router.get("", response_model=List[schemas.TranscriptSegment])
def get_transcript(meeting_id: int, db: Session = Depends(get_db)):
    segments = (
        db.query(models.TranscriptSegment)
        .filter(models.TranscriptSegment.meeting_id == meeting_id)
        .order_by(asc(models.TranscriptSegment.sort_order))
        .all()
    )
    if not segments:
        # Check if meeting exists
        meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")
        return []
    return segments

@router.get("/search")
def search_transcript(meeting_id: int, q: str = Query(...), db: Session = Depends(get_db)):
    segments = (
        db.query(models.TranscriptSegment)
        .filter(models.TranscriptSegment.meeting_id == meeting_id)
        .filter(models.TranscriptSegment.text.ilike(f"%{q}%"))
        .order_by(asc(models.TranscriptSegment.sort_order))
        .all()
    )
    
    results = []
    for seg in segments:
        # Simple case-insensitive search to find the offset
        text_lower = seg.text.lower()
        q_lower = q.lower()
        start_idx = text_lower.find(q_lower)
        if start_idx != -1:
            results.append({
                "segment_id": seg.id,
                "offset": start_idx,
                "text": seg.text
            })
            
    return results
