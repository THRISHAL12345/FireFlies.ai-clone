from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db
from app.models import domain as models
from app.schemas import domain as schemas

router = APIRouter(tags=["action_items"])

@router.get("/api/meetings/{meeting_id}/action-items", response_model=List[schemas.ActionItem])
def get_meeting_action_items(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    return db.query(models.ActionItem).filter(models.ActionItem.meeting_id == meeting_id).all()

@router.post("/api/meetings/{meeting_id}/action-items", response_model=schemas.ActionItem)
def create_action_item(meeting_id: int, action_in: schemas.ActionItemCreate, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    # check if assignee matches a participant
    participant_id = None
    if action_in.assignee:
        for p in meeting.participants:
            if p.name == action_in.assignee:
                participant_id = p.id
                break
                
    action_item = models.ActionItem(
        meeting_id=meeting_id,
        text=action_in.text,
        assignee=action_in.assignee,
        participant_id=participant_id,
        is_completed=action_in.is_completed,
        due_date=action_in.due_date
    )
    db.add(action_item)
    db.commit()
    db.refresh(action_item)
    return action_item

@router.patch("/api/action-items/{id}", response_model=schemas.ActionItem)
def update_action_item(id: int, action_in: schemas.ActionItemUpdate, db: Session = Depends(get_db)):
    action_item = db.query(models.ActionItem).filter(models.ActionItem.id == id).first()
    if not action_item:
        raise HTTPException(status_code=404, detail="Action item not found")
        
    if action_in.text is not None:
        action_item.text = action_in.text  # type: ignore
    if action_in.assignee is not None:
        action_item.assignee = action_in.assignee  # type: ignore
        # Try to resolve participant
        meeting = db.query(models.Meeting).filter(models.Meeting.id == action_item.meeting_id).first()
        participant_id = None
        if meeting:
            for p in meeting.participants:
                if p.name == action_in.assignee:
                    participant_id = p.id
                    break
        action_item.participant_id = participant_id  # type: ignore
        
    if action_in.is_completed is not None:
        action_item.is_completed = action_in.is_completed  # type: ignore
    if action_in.due_date is not None:
        action_item.due_date = action_in.due_date  # type: ignore
        
    db.commit()
    db.refresh(action_item)
    return action_item

@router.patch("/api/action-items/{id}/complete", response_model=schemas.ActionItem)
def toggle_action_item_complete(id: int, db: Session = Depends(get_db)):
    action_item = db.query(models.ActionItem).filter(models.ActionItem.id == id).first()
    if not action_item:
        raise HTTPException(status_code=404, detail="Action item not found")
        
    action_item.is_completed = not action_item.is_completed  # type: ignore
    db.commit()
    db.refresh(action_item)
    return action_item
