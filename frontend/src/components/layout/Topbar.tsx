'use client';

import React from 'react';
import { Search, Bell, Mic, Video, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import CaptureModal from '@/components/meetings/CaptureModal';

export default function Topbar() {
    const pathname = usePathname();
    const title = pathname === '/meetings/new' ? 'Uploads' : 'Home';
    const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);

    return (
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10 w-full">
            {/* Left side: Title */}
            <div className="w-64 shrink-0">
                <h1 className="text-gray-700 font-medium text-lg">{title}</h1>
            </div>

            {/* Center: Search */}
            <div className="flex-1 px-4 flex">
                <div className="relative w-full max-w-[480px]">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Search by title or keyword" 
                        className="w-full pl-9 pr-16 py-1.5 bg-gray-50/80 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-purple-200 focus:border-purple-300 transition-all placeholder:text-gray-400"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10.5px] font-medium text-gray-400">Ctrl + K</kbd>
                    </div>
                </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-3 shrink-0">
                <button className="px-3 py-1.5 bg-[#E6F8F3] text-[#059669] text-[13px] font-semibold rounded-md hover:bg-[#D1F2EB] transition-colors tracking-wide mr-2">
                    Upgrade
                </button>
                
                <button 
                    onClick={() => setIsCaptureModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#6941C6] hover:bg-[#53389E] text-white text-[13px] font-semibold rounded-md transition-colors shadow-sm"
                >
                    <Video className="w-4 h-4" />
                    Capture
                    <div className="w-px h-4 bg-white/20 mx-1"></div>
                    <ChevronDown className="w-3.5 h-3.5 -ml-1" />
                </button>
                
                <button className="p-2 ml-1 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition-colors border border-gray-200 shadow-sm ml-2">
                    <Mic className="w-4 h-4 text-gray-600" />
                </button>

                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative border border-gray-200 shadow-sm ml-1">
                    <Bell className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="h-[34px] w-[34px] rounded-md bg-[#5C4033] text-[#F5CBA7] flex items-center justify-center font-bold text-sm cursor-pointer ml-3 shadow-sm">
                    T
                </div>
            </div>

            <CaptureModal 
                isOpen={isCaptureModalOpen} 
                onClose={() => setIsCaptureModalOpen(false)} 
            />
        </header>
    );
}
