from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models import domain as models
from app.schemas import domain as schemas

router = APIRouter(
    prefix="/api/notifications",
    tags=["notifications"]
)

@router.get("", response_model=List[schemas.Notification])
def get_notifications(db: Session = Depends(get_db)):
    """
    Get all notifications, ordered by creation date descending.
    """
    notifications = db.query(models.Notification).order_by(models.Notification.created_at.desc()).all()
    return notifications

@router.patch("/mark-read", response_model=List[schemas.Notification])
def mark_notifications_read(db: Session = Depends(get_db)):
    """
    Marks all unread notifications as read.
    """
    unread_notifications = db.query(models.Notification).filter(models.Notification.is_unread == True).all()
    
    for notification in unread_notifications:
        notification.is_unread = False
        
    db.commit()
    
    # Return all notifications updated
    return db.query(models.Notification).order_by(models.Notification.created_at.desc()).all()
