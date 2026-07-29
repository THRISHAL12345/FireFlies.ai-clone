'use client';

import React, { useState } from 'react';
import { Menu, Search, Disc, MessageCircle, Bookmark } from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import SmartSearchPanel from './SmartSearchPanel';

export default function MeetingSidebar() {
    const [showMainSidebar, setShowMainSidebar] = useState(false);
    const [showSmartSearch, setShowSmartSearch] = useState(false);

    return (
        <div className={`relative h-full shrink-0 z-40 flex bg-white border-r border-gray-200 transition-all duration-200 ${showSmartSearch ? 'w-[372px]' : 'w-[52px]'}`}>
            {/* The main sidebar overlay */}
            {showMainSidebar && (
                <div 
                    className="absolute top-0 left-0 h-full bg-white shadow-2xl z-[100]"
                    onMouseLeave={() => setShowMainSidebar(false)}
                >
                    <Sidebar />
                </div>
            )}

            {/* Icon Strip */}
            <div className="flex flex-col py-4 h-full w-[52px] shrink-0 border-r border-gray-100 bg-white z-50">
                {/* Top Menu Icon */}
                <div 
                    className="px-2 mb-6"
                    onMouseEnter={() => setShowMainSidebar(true)}
                >
                    <button className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50" title="Menu">
                        <Menu className="w-5 h-5 shrink-0" />
                    </button>
                </div>

                {/* Nav Links */}
                <div className="px-2 flex flex-col gap-2 w-full">
                    <button 
                        onClick={() => setShowSmartSearch(!showSmartSearch)}
                        className={`w-full flex items-center justify-center p-2 transition-colors rounded-md group ${showSmartSearch ? 'bg-[#F9F5FF] text-[#6941C6]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`} 
                        title="Search"
                    >
                        <Search className={`w-5 h-5 shrink-0 transition-colors ${showSmartSearch ? 'text-[#6941C6]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    </button>
                    
                    <button className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50 group" title="AI Skills">
                        <Disc className="w-5 h-5 shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                    
                    <button className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50 group" title="Comments">
                        <MessageCircle className="w-5 h-5 shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                    
                    <button className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50 group" title="Bookmarks">
                        <Bookmark className="w-5 h-5 shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                </div>
            </div>

            {/* Expanded Smart Search Panel */}
            {showSmartSearch && (
                <div className="h-full w-[320px] shrink-0 bg-white">
                    <SmartSearchPanel />
                </div>
            )}
        </div>
    );
}
