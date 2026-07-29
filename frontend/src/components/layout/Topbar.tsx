'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Mic, Video, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import CaptureModal from '@/components/meetings/CaptureModal';
import NotificationDropdown from '@/components/layout/NotificationDropdown';
import GlobalSearchModal from '@/components/layout/GlobalSearchModal';
import { api } from '@/lib/api';
import { Notification } from '@/lib/types';

export default function Topbar() {
    const pathname = usePathname();
    const title = 
        pathname === '/meetings/new' ? 'Uploads' : 
        pathname === '/meetings' ? 'Meetings' : 
        'Home';
    const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        api.notifications.list()
            .then(setNotifications)
            .catch(err => console.error("Failed to fetch notifications:", err));
    }, []);

    // Global keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const hasUnread = notifications.some(n => n.is_unread);

    return (
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10 w-full">
            {/* Left side: Title */}
            <div className="w-64 shrink-0">
                <h1 className="text-gray-700 font-medium text-lg">{title}</h1>
            </div>

            {/* Center: Search */}
            <div className="flex-1 px-4 flex">
                <div 
                    className="relative w-full max-w-[480px] cursor-pointer group"
                    onClick={() => setIsSearchOpen(true)}
                >
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-gray-600 transition-colors" />
                    <div className="w-full pl-9 pr-16 py-1.5 bg-gray-50/80 border border-gray-200 rounded-lg text-[13px] text-gray-400 group-hover:border-gray-300 transition-all flex items-center h-[34px]">
                        Search by title or keyword
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10.5px] font-medium text-gray-400 border border-gray-200 rounded bg-white shadow-sm">Ctrl + K</kbd>
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

                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className={`p-2 rounded-full transition-colors relative border shadow-sm ml-1 ${isNotificationOpen ? 'text-indigo-600 bg-gray-50 border-indigo-200' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 border-gray-200'}`}
                    >
                        <Bell className="w-4 h-4" />
                        {hasUnread && <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></div>}
                    </button>
                    <NotificationDropdown 
                        isOpen={isNotificationOpen} 
                        onClose={() => setIsNotificationOpen(false)} 
                        notifications={notifications}
                        setNotifications={setNotifications}
                    />
                </div>
                
                <div className="h-[34px] w-[34px] rounded-md bg-[#5C4033] text-[#F5CBA7] flex items-center justify-center font-bold text-sm cursor-pointer ml-3 shadow-sm">
                    T
                </div>
            </div>

            <CaptureModal 
                isOpen={isCaptureModalOpen} 
                onClose={() => setIsCaptureModalOpen(false)} 
            />

            <GlobalSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </header>
    );
}
