import { Meeting, MeetingDetail, TranscriptSegment, Summary, ActionItem } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
    }

    return res.json();
}

export const api = {
    meetings: {
        list: (params?: { q?: string; participant?: string; sort?: string }) => {
            const query = new URLSearchParams();
            if (params?.q) query.append('q', params.q);
            if (params?.participant) query.append('participant', params.participant);
            if (params?.sort) query.append('sort', params.sort);
            
            const queryString = query.toString();
            const url = queryString ? `/api/meetings?${queryString}` : '/api/meetings';
            
            return fetchAPI(url) as Promise<Meeting[]>;
        },
        get: (id: number) => fetchAPI(`/api/meetings/${id}`) as Promise<MeetingDetail>,
        create: (data: any) => fetchAPI('/api/meetings', { method: 'POST', body: JSON.stringify(data) }) as Promise<MeetingDetail>,
        update: (id: number, data: any) => fetchAPI(`/api/meetings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }) as Promise<MeetingDetail>,
        delete: (id: number) => fetchAPI(`/api/meetings/${id}`, { method: 'DELETE' }),
    },
    transcripts: {
        get: (meetingId: number) => fetchAPI(`/api/meetings/${meetingId}/transcript`) as Promise<TranscriptSegment[]>,
        search: (meetingId: number, query: string) => fetchAPI(`/api/meetings/${meetingId}/transcript/search?q=${encodeURIComponent(query)}`),
    },
    summaries: {
        get: (meetingId: number) => fetchAPI(`/api/meetings/${meetingId}/summary`) as Promise<Summary>,
        regenerate: (meetingId: number) => fetchAPI(`/api/meetings/${meetingId}/summary/regenerate`, { method: 'POST' }) as Promise<Summary>,
    },
    actionItems: {
        list: (meetingId: number) => fetchAPI(`/api/meetings/${meetingId}/action-items`) as Promise<ActionItem[]>,
        create: (meetingId: number, data: any) => fetchAPI(`/api/meetings/${meetingId}/action-items`, { method: 'POST', body: JSON.stringify(data) }) as Promise<ActionItem>,
        update: (id: number, data: any) => fetchAPI(`/api/action-items/${id}`, { method: 'PATCH', body: JSON.stringify(data) }) as Promise<ActionItem>,
        toggleComplete: (id: number) => fetchAPI(`/api/action-items/${id}/complete`, { method: 'PATCH' }) as Promise<ActionItem>,
    },
    chat: {
        sendMessage: (meetingId: number, messages: {role: string, content: string}[]) => 
            fetchAPI(`/api/meetings/${meetingId}/chat`, { method: 'POST', body: JSON.stringify({ messages }) }) as Promise<{role: string, content: string}>,
    }
};
