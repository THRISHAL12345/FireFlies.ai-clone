import json
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Table, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from typing import Any
from app import db

Base = db.Base

# Many-to-many association table for meetings and participants
meeting_participants = Table(
    'meeting_participants',
    Base.metadata,
    Column('meeting_id', Integer, ForeignKey('meetings.id'), primary_key=True),
    Column('participant_id', Integer, ForeignKey('participants.id'), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    date = Column(DateTime)
    duration_seconds = Column(Integer)
    media_url = Column(String, nullable=True)
    status = Column(String, default="processed") # 'processed' | 'processing'
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    participants = relationship("Participant", secondary=meeting_participants, back_populates="meetings")
    speakers = relationship("Speaker", back_populates="meeting", cascade="all, delete-orphan")
    transcript_segments = relationship("TranscriptSegment", back_populates="meeting", cascade="all, delete-orphan")
    summary = relationship("Summary", back_populates="meeting", uselist=False, cascade="all, delete-orphan")
    outline_items = relationship("OutlineItem", back_populates="meeting", cascade="all, delete-orphan")
    action_items = relationship("ActionItem", back_populates="meeting", cascade="all, delete-orphan")

class Participant(Base):
    __tablename__ = "participants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, nullable=True)

    # Relationships
    meetings = relationship("Meeting", secondary=meeting_participants, back_populates="participants")
    speakers = relationship("Speaker", back_populates="participant")
    assigned_action_items = relationship("ActionItem", back_populates="assigned_participant")

class Speaker(Base):
    __tablename__ = "speakers"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    label = Column(String)
    participant_id = Column(Integer, ForeignKey("participants.id"), nullable=True)

    # Relationships
    meeting = relationship("Meeting", back_populates="speakers")
    participant = relationship("Participant", back_populates="speakers")
    transcript_segments = relationship("TranscriptSegment", back_populates="speaker")

class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), index=True)
    speaker_id = Column(Integer, ForeignKey("speakers.id"))
    start_time_seconds = Column(Float, index=True)
    end_time_seconds = Column(Float)
    text = Column(Text)
    sort_order = Column(Integer)

    # Relationships
    meeting = relationship("Meeting", back_populates="transcript_segments")
    speaker = relationship("Speaker", back_populates="transcript_segments")

class Summary(Base):
    __tablename__ = "summaries"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), unique=True)
    overview_text = Column(Text)
    _keywords = Column("keywords", Text) # Storing as JSON string
    generated_by = Column(String) # 'llm' | 'seeded' | 'manual'
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    meeting = relationship("Meeting", back_populates="summary")
    
    @property
    def keywords(self) -> list[str]:
        if not self._keywords:
            return []
        try:
            return json.loads(self._keywords) # type: ignore
        except json.JSONDecodeError:
            return []
            
    @keywords.setter
    def keywords(self, value: list[str]):
        self._keywords = json.dumps(value) # type: ignore

class OutlineItem(Base):
    __tablename__ = "outline_items"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    title = Column(String)
    start_time_seconds = Column(Float)
    sort_order = Column(Integer)

    # Relationships
    meeting = relationship("Meeting", back_populates="outline_items")

class ActionItem(Base):
    __tablename__ = "action_items"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    text = Column(Text)
    assignee = Column(String, nullable=True) # Free text
    participant_id = Column(Integer, ForeignKey("participants.id"), nullable=True) # Optional FK
    is_completed = Column(Boolean, default=False)
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    meeting = relationship("Meeting", back_populates="action_items")
    assigned_participant = relationship("Participant", back_populates="assigned_action_items")
