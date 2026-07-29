import React from 'react';
import { api } from '@/lib/api';
import { Meeting } from '@/lib/types';
import MeetingRow from '@/components/meetings/MeetingRow';
import MeetingsFilterDropdown from '@/components/meetings/MeetingsFilterDropdown';
import { Search, Filter, Hash, Plus, Folder, Mic, Video } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MeetingsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined;
    const participant = typeof resolvedSearchParams.participant === 'string' ? resolvedSearchParams.participant : undefined;
    const date_range = typeof resolvedSearchParams.date_range === 'string' ? resolvedSearchParams.date_range : undefined;
    const duration = typeof resolvedSearchParams.duration === 'string' ? resolvedSearchParams.duration : undefined;

    let date_from: string | undefined;
    let date_to: string | undefined;
    if (date_range === 'Today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date_from = today.toISOString();
    } else if (date_range === 'Last 7 Days') {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        date_from = d.toISOString();
    } else if (date_range === 'Last 14 Days') {
        const d = new Date();
        d.setDate(d.getDate() - 14);
        date_from = d.toISOString();
    } else if (date_range === 'Last 30 Days') {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        date_from = d.toISOString();
    }

    let duration_min: number | undefined;
    let duration_max: number | undefined;
    if (duration === '< 15 mins') {
        duration_max = 900;
    } else if (duration === '15 to 30 Mins') {
        duration_min = 900;
        duration_max = 1800;
    } else if (duration === '30 to 60 mins') {
        duration_min = 1800;
        duration_max = 3600;
    } else if (duration === '60 to 90 mins') {
        duration_min = 3600;
        duration_max = 5400;
    } else if (duration === '90+ mins') {
        duration_min = 5400;
    }

    let meetings: Meeting[] = [];
    let participants: { id: number, name: string, email?: string }[] = [];
    try {
        const [fetchedMeetings, fetchedParticipants] = await Promise.all([
            api.meetings.list({ 
                q, 
                participant, 
                date_from, 
                date_to, 
                duration_min, 
                duration_max, 
                sort: 'recent' 
            }),
            api.participants.list()
        ]);
        meetings = fetchedMeetings;
        participants = fetchedParticipants;
    } catch (err) {
        console.error("Failed to fetch data:", err);
    }

    return (
        <div className="flex h-full bg-white">
            {/* Secondary Sidebar (Channels) */}
            <div className="w-[240px] border-r border-gray-100 flex flex-col shrink-0">
                <div className="p-4">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search channels" 
                            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border-none rounded-md text-sm focus:ring-1 focus:ring-indigo-500 outline-none placeholder:text-gray-400 text-gray-700"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2">
                    <div className="space-y-0.5">
                        <Link href="#" className="flex items-center gap-3 px-3 py-2 bg-indigo-50/50 text-indigo-700 rounded-md font-medium text-[13px]">
                            <Hash className="w-4 h-4" />
                            My Meetings
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium text-[13px]">
                            <Folder className="w-4 h-4 text-gray-400" />
                            All Meetings
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium text-[13px]">
                            <Mic className="w-4 h-4 text-gray-400" />
                            Voice Agent Meetings
                        </Link>
                    </div>

                    <div className="mt-6 mb-2 px-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">All channels</span>
                    </div>

                    <div className="mt-8 flex flex-col items-center justify-center text-center px-4">
                        <Hash className="w-6 h-6 text-pink-300 mb-3" strokeWidth={2.5} />
                        <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-4">
                            Create channels to organize your conversations
                        </p>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                            <Plus className="w-4 h-4" />
                            Channel
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center p-0.5 bg-gray-50 border border-gray-200 rounded-md">
                            <button className="px-3 py-1 text-[13px] font-medium bg-white text-gray-700 rounded shadow-sm">Hosted by me</button>
                            <button className="px-3 py-1 text-[13px] font-medium text-gray-500 hover:text-gray-700">Shared with me</button>
                        </div>
                        <MeetingsFilterDropdown participants={participants} />
                    </div>
                    
                    <div>
                        <button className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
                    {meetings.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            {/* Empty State skeleton graphic */}
                            <div className="mb-8 space-y-3 w-72">
                                <div className="h-8 bg-white border border-gray-100 rounded-lg shadow-sm flex items-center px-3 opacity-50">
                                    <div className="w-4 h-4 bg-gray-100 rounded text-[9px] font-bold text-gray-400 flex items-center justify-center">K</div>
                                    <div className="w-24 h-1.5 bg-gray-100 rounded-full ml-3"></div>
                                </div>
                                <div className="h-10 bg-white border border-gray-100 rounded-lg shadow-sm flex flex-col justify-center px-3 opacity-75">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-gray-100 rounded text-[9px] font-bold text-gray-400 flex items-center justify-center">A</div>
                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full ml-3"></div>
                                    </div>
                                    <div className="w-20 h-1.5 bg-gray-50 rounded-full ml-7 mt-1.5"></div>
                                </div>
                                <div className="h-8 bg-white border border-gray-100 rounded-lg shadow-sm flex items-center px-3 opacity-50">
                                    <div className="w-4 h-4 bg-gray-100 rounded text-[9px] font-bold text-gray-400 flex items-center justify-center">R</div>
                                    <div className="w-24 h-1.5 bg-gray-100 rounded-full ml-3"></div>
                                </div>
                            </div>
                            
                            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">Looks like you haven't recorded a meeting yet</h3>
                            <p className="text-[14px] text-gray-500 text-center max-w-md mb-6 leading-relaxed">
                                Once you record your first meeting with Fireflies, it'll show up right here.
                            </p>
                            <Link 
                                href="/meetings/new"
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Capture
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] border border-gray-100 divide-y divide-gray-100 max-w-5xl mx-auto">
                            {meetings.map((meeting) => (
                                <MeetingRow key={meeting.id} meeting={meeting} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
