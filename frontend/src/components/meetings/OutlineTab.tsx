'use client';

import React from 'react';
import { OutlineItem } from '@/lib/types';
import { List, PlayCircle, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

interface OutlineTabProps {
    items: OutlineItem[];
    onSeek: (time: number) => void;
}

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function OutlineTab({ items, onSeek }: OutlineTabProps) {
    // Sort items by sort_order just in case
    const sortedItems = [...items].sort((a, b) => a.sort_order - b.sort_order);

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <List className="w-5 h-5 text-indigo-600" />
                Chapters & Topics
            </h2>

            {sortedItems.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center mt-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">No chapters found</h3>
                    <p className="text-sm text-gray-500">
                        This meeting doesn't have any generated chapters or topics yet.
                    </p>
                </div>
            ) : (
                <div className="relative border-l-2 border-indigo-100 ml-3 space-y-8 py-4">
                    {sortedItems.map((item) => (
                        <div key={item.id} className="relative pl-6">
                            {/* Timeline dot */}
                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-indigo-100 border-2 border-white rounded-full"></div>
                            
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        {item.title}
                                    </h3>
                                    <button 
                                        onClick={() => onSeek(item.start_time_seconds)}
                                        className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors"
                                    >
                                        <PlayCircle className="w-3.5 h-3.5" />
                                        {formatTime(item.start_time_seconds)}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Click the timestamp to jump directly to this part of the conversation.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
