from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.models import domain as models
from app.schemas import domain as schemas
from app.db import get_db

router = APIRouter(
    prefix="/api/participants",
    tags=["participants"]
)

@router.get("", response_model=List[schemas.Participant])
def get_participants(db: Session = Depends(get_db)):
    """
    Get all unique participants in the database.
    """
    participants = db.query(models.Participant).all()
    return participants
