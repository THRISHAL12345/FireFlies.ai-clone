import React from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Clock, Calendar, Users, Sparkles } from 'lucide-react';
import { Meeting } from '@/lib/types';

interface MeetingCardProps {
    meeting: Meeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
    const dateObj = parseISO(meeting.date);
    const formattedDate = format(dateObj, 'MMM d, yyyy');
    const formattedTime = format(dateObj, 'h:mm a');
    const durationMinutes = Math.round(meeting.duration_seconds / 60);

    return (
        <Link 
            href={`/meetings/${meeting.id}`}
            className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all group"
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {meeting.title}
                </h3>
                <div className="flex -space-x-2">
                    {meeting.participants.slice(0, 3).map((p, i) => (
                        <div 
                            key={p.id} 
                            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
                            style={{ backgroundColor: `hsl(${p.id * 50 + 100}, 60%, 50%)` }}
                            title={p.name}
                        >
                            {p.name.charAt(0).toUpperCase()}
                        </div>
                    ))}
                    {meeting.participants.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">
                            +{meeting.participants.length - 3}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate} &bull; {formattedTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{durationMinutes} min</span>
                </div>
            </div>

            {meeting.summary && (
                <div className="bg-indigo-50/50 rounded-lg p-3 text-sm border border-indigo-100/50">
                    <div className="flex items-center gap-1.5 text-indigo-700 font-medium mb-1.5 text-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Summary Preview
                    </div>
                    <p className="text-gray-600 line-clamp-2">
                        {meeting.summary.overview_text}
                    </p>
                </div>
            )}
        </Link>
    );
}
