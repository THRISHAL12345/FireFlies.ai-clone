'use client';

import React, { useRef, useEffect } from 'react';
import { TranscriptSegment } from '@/lib/types';

interface TranscriptLineProps {
    segment: TranscriptSegment;
    isActive: boolean;
    searchQuery: string;
    onSeek: (time: number) => void;
    customTextColor?: string;
}

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function TranscriptLine({ segment, isActive, searchQuery, onSeek, customTextColor }: TranscriptLineProps) {
    const lineRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic when this line becomes active
    useEffect(() => {
        if (isActive && lineRef.current) {
            lineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isActive]);

    // Highlight search query text
    const renderText = () => {
        if (!searchQuery) return <span>{segment.text}</span>;

        const parts = segment.text.split(new RegExp(`(${searchQuery})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => {
                    const isMatch = part.toLowerCase() === searchQuery.toLowerCase();
                    if (isMatch) {
                        return (
                            <span 
                                key={i} 
                                className="rounded-sm px-0.5 text-[#E8348B] bg-pink-50"
                            >
                                {part}
                            </span>
                        );
                    }
                    return <span key={i}>{part}</span>;
                })}
            </span>
        );
    };

    // Placeholder for actual speaker initials/color mapping
    const speakerInitial = segment.speaker.label ? segment.speaker.label.charAt(0).toUpperCase() : 'S';
    
    // In a real app we'd map this dynamically, hardcoding light green/dark green for demo based on screenshot
    const avatarBg = "bg-[#79D498]";
    const avatarColor = "text-white";

    return (
        <div 
            ref={lineRef}
            className={`flex gap-4 p-2 -ml-2 rounded-lg cursor-pointer transition-colors ${
                isActive 
                    ? 'bg-indigo-50/40' 
                    : 'bg-transparent hover:bg-gray-50/60'
            }`}
        >
            <div className="flex-shrink-0 mt-0.5">
                <div className={`w-6 h-6 rounded flex items-center justify-center font-semibold text-[13px] ${avatarBg} ${avatarColor}`}>
                    {speakerInitial}
                </div>
            </div>
            
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-medium text-[14px] text-gray-700">
                        {segment.speaker.label}
                    </span>
                    <span className="text-gray-300">·</span>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onSeek(segment.start_time_seconds);
                        }}
                        className="text-[14px] font-medium text-[#0284C7] hover:underline"
                    >
                        {formatTime(segment.start_time_seconds)}
                    </button>
                </div>
                <p className={`text-[15px] leading-[1.6] ${customTextColor ? customTextColor : (isActive ? 'text-gray-900' : 'text-gray-600')}`}>
                    {renderText()}
                </p>
            </div>
        </div>
    );
}
