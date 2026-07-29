'use client';

import React, { useState } from 'react';
import { MeetingDetail } from '@/lib/types';
import Link from 'next/link';
import { MoreHorizontal, Bell, Plus, Share2, ArrowRight, X, Menu, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface MeetingHeaderProps {
    meeting?: MeetingDetail;
}

export default function MeetingHeader({ meeting }: MeetingHeaderProps) {
    const [showPromo, setShowPromo] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!meeting) return;
        if (!confirm("Are you sure you want to delete this meeting? This cannot be undone.")) return;
        
        setIsDeleting(true);
        try {
            await api.meetings.delete(meeting.id);
            toast.success("Meeting deleted successfully");
            router.push('/');
        } catch (error) {
            console.error("Failed to delete meeting", error);
            toast.error("Failed to delete meeting");
            setIsDeleting(false);
        }
    };
    const title = meeting?.title || "Loading...";

    return (
        <div className="flex flex-col w-full border-b border-gray-200 bg-white shrink-0">
            {/* Promo Banner */}
            {showPromo && (
                <div className="w-full bg-[#F5F3FF] py-1.5 flex items-center justify-center gap-2 border-b border-purple-100 relative">
                    <span className="text-[13px] text-gray-700 font-medium">
                        You are eligible for 7 days business plan free trial.
                    </span>
                    <Link href="#" className="text-[13px] text-[#6941C6] font-semibold flex items-center hover:underline">
                        Start free trial <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                    <button onClick={() => setShowPromo(false)} className="absolute right-4 text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Main Header */}
            <header className="h-14 flex items-center justify-between px-6">
                {/* Left Side */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center text-[13px] font-medium text-gray-500">
                        <Link href="/" className="hover:text-gray-900 transition-colors">
                            #All Meetings
                        </Link>
                        <span className="mx-2 font-normal text-gray-300">/</span>
                        <span className="text-gray-700">{title}</span>
                    </div>
                    <button 
                        onClick={handleDelete}
                        disabled={isDeleting || !meeting}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded ml-1"
                        title="Delete Meeting"
                    >
                        <Trash2 className="w-[15px] h-[15px]" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-700 transition-colors rounded ml-1">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    <button className="px-3 py-1 bg-[#ecfdf5] text-[#059669] text-[13px] font-semibold rounded hover:bg-[#d1fae5] transition-colors">
                        Upgrade
                    </button>
                    
                    <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center rounded">
                        <IntegrationIcon />
                    </button>

                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6941C6] hover:bg-[#53389E] text-white text-[13px] font-medium rounded transition-colors shadow-sm">
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                        <div className="w-px h-3 bg-white/30 mx-1"></div>
                        <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>

                    <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>

                    <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-full">
                        <Bell className="w-4 h-4" />
                    </button>

                    <div className="h-7 w-7 rounded bg-[#5D4037] text-white flex items-center justify-center font-medium text-xs cursor-pointer ml-1">
                        T
                    </div>
                </div>
            </header>
        </div>
    );
}

function IntegrationIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="6" height="6" rx="1.5" fill="#E01E5A"/>
            <rect x="9" y="6" width="6" height="6" rx="1.5" fill="#36C5F0"/>
            <rect x="16" y="6" width="6" height="6" rx="1.5" fill="#2EB67D"/>
            <rect x="2" y="13" width="6" height="6" rx="1.5" fill="#ECB22E"/>
            <path d="M12 16L14 18L18 14" stroke="#6941C6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}
