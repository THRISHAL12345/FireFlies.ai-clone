from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db
from app.models import domain as models
from app.schemas import domain as schemas
from app.services import llm_service

router = APIRouter(prefix="/api/meetings/{meeting_id}/chat", tags=["chat"])

@router.post("", response_model=schemas.ChatResponse)
def ask_fred_chat(meeting_id: int, request: schemas.ChatRequest, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    segments = db.query(models.TranscriptSegment).filter(
        models.TranscriptSegment.meeting_id == meeting_id
    ).order_by(models.TranscriptSegment.sort_order).all()
    
    # Reconstruct the transcript text
    transcript_text = "\n".join([f"[{s.start_time_seconds} - {s.end_time_seconds}] {s.text}" for s in segments])
    
    # Extract query from the last message
    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")
        
    query = request.messages[-1].content
    
    # Build history (excluding the last message which is the query)
    history = [{"role": msg.role, "content": msg.content} for msg in request.messages[:-1]]
    
    response_text = llm_service.generate_chat_response(transcript_text, history, query)
    
    return schemas.ChatResponse(role="assistant", content=response_text)
