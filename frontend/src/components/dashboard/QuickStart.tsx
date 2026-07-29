'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Upload, Plus, ChevronRight } from 'lucide-react';
import CaptureModal from '@/components/meetings/CaptureModal';

export default function QuickStart() {
    const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);

    return (
        <div className="mb-10">
            <h3 className="text-[17px] font-semibold text-gray-800 mb-1">Quick Start</h3>
            <p className="text-gray-500 text-[13px] mb-5">Capture your first meeting or upload a recording to see Fireflies in action.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="#" className="bg-[#FFF5F8] hover:bg-[#FFEBF1] transition-colors rounded-[10px] px-5 py-4 flex items-center justify-between border border-transparent">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-[18px] h-[18px] text-[#F9A8D4]" />
                        <span className="text-[#374151] font-medium text-[13px]">Schedule Meeting</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="/meetings/new" className="bg-[#F0FDF4] hover:bg-[#DCFCE7] transition-colors rounded-[10px] px-5 py-4 flex items-center justify-between border border-transparent">
                    <div className="flex items-center gap-3">
                        <Upload className="w-[18px] h-[18px] text-[#6EE7B7]" />
                        <span className="text-[#374151] font-medium text-[13px]">Upload File</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <button 
                    onClick={() => setIsCaptureModalOpen(true)} 
                    className="bg-[#F5F3FF] hover:bg-[#EDE9FE] transition-colors rounded-[10px] px-5 py-4 flex items-center justify-between border border-transparent text-left w-full"
                >
                    <div className="flex items-center gap-3">
                        <Plus className="w-[18px] h-[18px] text-[#A78BFA]" />
                        <span className="text-[#374151] font-medium text-[13px]">Capture Meeting</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            <CaptureModal 
                isOpen={isCaptureModalOpen} 
                onClose={() => setIsCaptureModalOpen(false)} 
            />
        </div>
    );
}
