from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

class ParticipantBase(BaseModel):
    name: str
    email: Optional[str] = None

class ParticipantCreate(ParticipantBase):
    pass

class Participant(ParticipantBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class SpeakerBase(BaseModel):
    label: str
    participant_id: Optional[int] = None

class SpeakerCreate(SpeakerBase):
    pass

class Speaker(SpeakerBase):
    id: int
    meeting_id: int
    participant: Optional[Participant] = None
    model_config = ConfigDict(from_attributes=True)

class TranscriptSegmentBase(BaseModel):
    start_time_seconds: float
    end_time_seconds: float
    text: str
    sort_order: int

class TranscriptSegmentCreate(TranscriptSegmentBase):
    speaker_label: str # Useful for creation before speakers are normalized

class TranscriptSegment(TranscriptSegmentBase):
    id: int
    meeting_id: int
    speaker_id: int
    speaker: Speaker
    model_config = ConfigDict(from_attributes=True)

class SummaryBase(BaseModel):
    overview_text: str
    keywords: List[str]
    generated_by: str

class SummaryCreate(SummaryBase):
    pass

class Summary(SummaryBase):
    id: int
    meeting_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class OutlineItemBase(BaseModel):
    title: str
    start_time_seconds: float
    sort_order: int

class OutlineItemCreate(OutlineItemBase):
    pass

class OutlineItem(OutlineItemBase):
    id: int
    meeting_id: int
    model_config = ConfigDict(from_attributes=True)

class ActionItemBase(BaseModel):
    text: str
    assignee: Optional[str] = None
    is_completed: bool = False
    due_date: Optional[datetime] = None

class ActionItemCreate(ActionItemBase):
    pass

class ActionItem(ActionItemBase):
    id: int
    meeting_id: int
    participant_id: Optional[int] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ActionItemUpdate(BaseModel):
    text: Optional[str] = None
    assignee: Optional[str] = None
    is_completed: Optional[bool] = None
    due_date: Optional[datetime] = None

class MeetingBase(BaseModel):
    title: str
    date: datetime
    duration_seconds: int
    media_url: Optional[str] = None
    status: str = "processed"

class MeetingCreate(MeetingBase):
    participants: List[ParticipantCreate] = []
    raw_transcript: Optional[str] = None

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    participants: Optional[List[ParticipantCreate]] = None

class Meeting(MeetingBase):
    id: int
    created_at: datetime
    updated_at: datetime
    participants: List[Participant] = []
    summary: Optional[Summary] = None
    
    # We might not want to include all transcript segments in the list view,
    # but we can have a detailed view schema.
    model_config = ConfigDict(from_attributes=True)

class MeetingDetail(Meeting):
    outline_items: List[OutlineItem] = []
    action_items: List[ActionItem] = []
    # Note: Transcripts can be fetched separately if they are too large.
    model_config = ConfigDict(from_attributes=True)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    role: str
    content: str
