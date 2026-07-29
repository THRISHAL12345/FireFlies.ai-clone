export interface Participant {
    id: number;
    name: string;
    email?: string;
}

export interface Meeting {
    id: number;
    title: string;
    date: string;
    duration_seconds: number;
    media_url?: string;
    status: string;
    created_at: string;
    updated_at: string;
    participants: Participant[];
    summary?: Summary;
}

export interface Summary {
    id: number;
    meeting_id: number;
    overview_text: string;
    keywords: string[];
    generated_by: string;
    created_at: string;
}

export interface OutlineItem {
    id: number;
    meeting_id: number;
    title: string;
    start_time_seconds: number;
    sort_order: number;
}

export interface ActionItem {
    id: number;
    meeting_id: number;
    text: string;
    assignee?: string;
    is_completed: boolean;
    due_date?: string;
    participant_id?: number;
    created_at: string;
}

export interface MeetingDetail extends Meeting {
    outline_items: OutlineItem[];
    action_items: ActionItem[];
}

export interface Speaker {
    id: number;
    meeting_id: number;
    label: string;
    participant_id?: number;
}

export interface TranscriptSegment {
    id: number;
    meeting_id: number;
    speaker_id: number;
    start_time_seconds: number;
    end_time_seconds: number;
    text: string;
    sort_order: number;
    speaker: Speaker;
}
