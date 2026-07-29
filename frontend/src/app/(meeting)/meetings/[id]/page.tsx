import { api } from '@/lib/api';
import MeetingHeader from '@/components/meetings/MeetingHeader';
import MeetingWorkspace from '@/components/meetings/MeetingWorkspace';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function MeetingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const meetingId = parseInt(resolvedParams.id, 10);
    
    if (isNaN(meetingId)) {
        notFound();
    }

    let meetingDetail;
    let transcriptSegments = [];
    
    try {
        // Run fetches in parallel
        const [detailResult, transcriptResult] = await Promise.all([
            api.meetings.get(meetingId),
            api.transcripts.get(meetingId)
        ]);
        
        meetingDetail = detailResult;
        transcriptSegments = transcriptResult;
    } catch (err) {
        console.error("Failed to fetch meeting data:", err);
        notFound();
    }

    return (
        <div className="flex flex-col h-full bg-gray-50/30">
            <MeetingHeader meeting={meetingDetail} />
            <div className="flex-1 overflow-hidden">
                <MeetingWorkspace 
                    meeting={meetingDetail} 
                    transcriptSegments={transcriptSegments} 
                />
            </div>
        </div>
    );
}
