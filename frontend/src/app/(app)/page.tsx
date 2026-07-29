import { api } from '@/lib/api';
import { Meeting } from '@/lib/types';
import MeetingRow from '@/components/meetings/MeetingRow';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import QuickStart from '@/components/dashboard/QuickStart';
import { HelpCircle, Monitor, Smartphone, Settings, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function Dashboard({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined;
    const participant = typeof resolvedSearchParams.participant === 'string' ? resolvedSearchParams.participant : undefined;
    const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'recent';

    let meetings: Meeting[] = [];
    try {
        meetings = await api.meetings.list({ q, participant, sort });
    } catch (err) {
        console.error("Failed to fetch meetings:", err);
    }

    return (
        <div className="p-10 max-w-[1150px] mx-auto w-full pb-32">
            
            {/* Welcome Card */}
            <WelcomeCard />

            {/* Quick Start */}
            <QuickStart />

            {/* Meetings List Tabs */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <button className="px-3.5 py-1.5 bg-white border border-gray-200 text-gray-800 text-[13px] font-semibold rounded-md shadow-sm">Recent</button>
                    <button className="px-3.5 py-1.5 text-gray-500 hover:text-gray-700 text-[13px] font-medium rounded-md">Upcoming - 1</button>
                    <button className="px-3.5 py-1.5 text-gray-500 hover:text-gray-700 text-[13px] font-medium rounded-md bg-gray-50/50">AI Feed</button>
                </div>
                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-[13px] font-medium">
                    <Settings className="w-4 h-4" />
                    Settings
                </button>
            </div>

            {/* Meeting List */}
            <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] border border-gray-100 divide-y divide-gray-100 mb-16">
                {meetings.length === 0 ? (
                     <div className="p-8 text-center text-gray-500">No recent meetings.</div>
                ) : (
                    meetings.map((meeting) => (
                        <MeetingRow key={meeting.id} meeting={meeting} />
                    ))
                )}
            </div>

            {/* Try More Section */}
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Try More</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#FAFAFA] rounded-xl p-6 border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 flex items-center justify-center mb-4">
                                <Monitor className="w-6 h-6 text-[#8FA4FC]" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Desktop App</h4>
                            <p className="text-sm text-gray-500 leading-relaxed mb-6">Capture conversations without any bot present in your meeting.</p>
                        </div>
                        <div>
                            <button className="px-5 py-2.5 bg-[#6941C6] hover:bg-[#53389E] text-white text-sm font-semibold rounded-md transition-colors flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                    </div>
                    <div className="bg-[#FAFAFA] rounded-xl p-6 border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 flex items-center justify-center mb-4">
                                <Smartphone className="w-6 h-6 text-[#FFA8D1]" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Mobile App</h4>
                            <p className="text-sm text-gray-500 leading-relaxed mb-6">Record in-person conversations and review meetings on the go.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="w-11 h-11 bg-white border border-gray-200 hover:border-gray-300 rounded-md flex items-center justify-center transition-colors shadow-sm">
                                <Image src="/images/landing/app-store.svg" alt="App Store" width={20} height={20} />
                            </button>
                            <button className="w-11 h-11 bg-white border border-gray-200 hover:border-gray-300 rounded-md flex items-center justify-center transition-colors shadow-sm">
                                <Image src="/images/landing/google-play.svg" alt="Google Play" width={20} height={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Help Button */}
            <button className="fixed bottom-6 right-6 w-12 h-12 bg-[#311A66] hover:bg-[#201046] text-white rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105 z-50">
                <HelpCircle className="w-6 h-6" />
            </button>

        </div>
    );
}
