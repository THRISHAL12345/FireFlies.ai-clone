import React from 'react';
import Link from 'next/link';
import { Meeting } from '@/lib/types';
import Image from 'next/image';

export default function MeetingRow({ meeting }: { meeting: Meeting }) {
    const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });

    return (
        <Link 
            href={`/meetings/${meeting.id}`}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
        >
            <div className="w-10 h-10 shrink-0 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-indigo-100">
                <Image src="/images/landing/logo.svg" alt="Fireflies" width={20} height={20} className="w-5 h-5 opacity-80" />
            </div>
            
            <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-semibold text-gray-800 truncate mb-0.5">{meeting.title}</h4>
                <p className="text-xs text-gray-500 truncate">{formattedDate}</p>
            </div>
        </Link>
    );
}
