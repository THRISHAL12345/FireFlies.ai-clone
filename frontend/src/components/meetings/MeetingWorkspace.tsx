'use client';

import React, { useState } from 'react';
import { MeetingDetail, TranscriptSegment } from '@/lib/types';
import Player from './Player';
import TranscriptPanel from './TranscriptPanel';
import NotesTab from './NotesTab';
import ActionItemsTab from './ActionItemsTab';
import OutlineTab from './OutlineTab';

interface MeetingWorkspaceProps {
    meeting: MeetingDetail;
    transcriptSegments: TranscriptSegment[];
}

export default function MeetingWorkspace({ meeting, transcriptSegments }: MeetingWorkspaceProps) {
    const [currentTime, setCurrentTime] = useState(0);
    const duration = meeting.duration_seconds || 
        (transcriptSegments.length > 0 ? transcriptSegments[transcriptSegments.length - 1].end_time_seconds : 0);
    
    // For now we will just show Notes on the left and Transcript on the right
    // The inner toggles (AskFred vs Transcript) can be handled inside the panels or here.

    const handleSeek = (time: number) => {
        setCurrentTime(time);
    };

    return (
        <div className="flex flex-col h-full w-full relative">
            <div className="flex flex-1 overflow-hidden pb-[64px]">
                {/* Left Panel */}
                <div className="w-[60%] h-full flex flex-col border-r border-gray-200 bg-white overflow-hidden">
                    <NotesTab meeting={meeting} />
                </div>

                {/* Right Panel */}
                <div className="w-[40%] h-full flex flex-col bg-white overflow-hidden">
                    <TranscriptPanel 
                        segments={transcriptSegments} 
                        currentTime={currentTime}
                        onSeek={handleSeek}
                    />
                </div>
            </div>

            {/* Bottom Full-Width Player */}
            <div className="fixed bottom-0 left-[52px] right-0 h-[64px] bg-white border-t border-gray-200 z-30 flex items-center px-6">
                <Player 
                    currentTime={currentTime} 
                    duration={duration} 
                    onSeek={handleSeek} 
                    onTimeUpdate={setCurrentTime}
                />
            </div>
        </div>
    );
}
