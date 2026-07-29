from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import List, Optional
from datetime import datetime

from app.db import get_db
from app.models import domain as models
from app.schemas import domain as schemas

router = APIRouter(prefix="/api/meetings", tags=["meetings"])

@router.get("", response_model=List[schemas.Meeting])
def get_meetings(
    db: Session = Depends(get_db),
    q: Optional[str] = None,
    participant: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    sort: str = "recent",
):
    query = db.query(models.Meeting)
    
    if q:
        query = query.filter(models.Meeting.title.ilike(f"%{q}%"))
        
    if date_from:
        query = query.filter(models.Meeting.date >= date_from)
        
    if date_to:
        query = query.filter(models.Meeting.date <= date_to)
        
    if participant:
        query = query.join(models.Meeting.participants).filter(
            models.Participant.name.ilike(f"%{participant}%")
        )

    if sort == "recent":
        query = query.order_by(desc(models.Meeting.date))
    elif sort == "oldest":
        query = query.order_by(asc(models.Meeting.date))

    meetings = query.all()
    return meetings

@router.get("/{id}", response_model=schemas.MeetingDetail)
def get_meeting(id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting

@router.post("", response_model=schemas.MeetingDetail)
def create_meeting(meeting_in: schemas.MeetingCreate, db: Session = Depends(get_db)):
    # Basic creation, transcript upload handling will be separate or extended here
    db_meeting = models.Meeting(
        title=meeting_in.title,
        date=meeting_in.date,
        duration_seconds=meeting_in.duration_seconds,
        media_url=meeting_in.media_url,
        status=meeting_in.status
    )
    db.add(db_meeting)
    db.flush()
    
    for p_in in meeting_in.participants:
        p_db = models.Participant(name=p_in.name, email=p_in.email)
        db.add(p_db)
        db.flush()
        db_meeting.participants.append(p_db)

    db.commit()
    db.refresh(db_meeting)
    return db_meeting

@router.patch("/{id}", response_model=schemas.MeetingDetail)
def update_meeting(id: int, meeting_in: schemas.MeetingUpdate, db: Session = Depends(get_db)):
    db_meeting = db.query(models.Meeting).filter(models.Meeting.id == id).first()
    if not db_meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    if meeting_in.title is not None:
        db_meeting.title = meeting_in.title
        
    if meeting_in.participants is not None:
        # Simplified: clear and re-add participants
        db_meeting.participants.clear()
        for p_in in meeting_in.participants:
            # check if participant exists
            p_db = db.query(models.Participant).filter(models.Participant.name == p_in.name).first()
            if not p_db:
                p_db = models.Participant(name=p_in.name, email=p_in.email)
                db.add(p_db)
            db_meeting.participants.append(p_db)
            
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

@router.delete("/{id}")
def delete_meeting(id: int, db: Session = Depends(get_db)):
    db_meeting = db.query(models.Meeting).filter(models.Meeting.id == id).first()
    if not db_meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    db.delete(db_meeting)
    db.commit()
    return {"message": "Meeting deleted"}
