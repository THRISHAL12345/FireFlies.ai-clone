'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Filter, User, Users, Calendar, Clock, Mic, Eye, Search, Circle, CircleDot, Monitor, Smartphone, UploadCloud, Bot, Globe } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Participant } from '@/lib/types';

export default function MeetingsFilterDropdown({ participants = [] }: { participants?: Participant[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Hosted by');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const currentParticipant = searchParams.get('participant') || '';
    const currentDateRange = searchParams.get('date_range') || 'Any Time';
    const currentDuration = searchParams.get('duration') || '';
    const currentCapturedFrom = searchParams.get('captured_from') || '';

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const clearAll = () => {
        router.push(pathname);
    };

    const hasAnyFilter = Array.from(searchParams.keys()).length > 0;

    const tabs = [
        { id: 'Hosted by', icon: User },
        { id: 'Participants', icon: Users },
        { id: 'Date Range', icon: Calendar },
        { id: 'Duration', icon: Clock },
        { id: 'Captured From', icon: Mic },
        { id: 'Privacy', icon: Eye },
    ];

    const dateRanges = ['Any Time', 'Today', 'Last 7 Days', 'Last 14 Days', 'Last 30 Days'];
    const durations = ['< 15 mins', '15 to 30 Mins', '30 to 60 mins', '60 to 90 mins', '90+ mins'];
    const capturedSources = [
        { name: 'Meeting Notetaker', icon: User },
        { name: 'Chrome Extension', icon: Globe },
        { name: 'Mobile App', icon: Smartphone },
        { name: 'Desktop App', icon: Monitor },
        { name: 'Uploads', icon: UploadCloud },
        { name: 'Voice Agent', icon: Bot },
    ];

    const toggleParticipant = (name: string) => {
        if (currentParticipant === name) updateParam('participant', '');
        else updateParam('participant', name);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-[13px] font-medium transition-colors ${
                    isOpen || hasAnyFilter
                        ? 'border-indigo-300 bg-indigo-50 text-indigo-600' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
                <Filter className="w-4 h-4" />
                Filters
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 flex w-[550px] z-50 overflow-hidden min-h-[350px]">
                    {/* Left Column: Categories */}
                    <div className="w-[220px] flex flex-col border-r border-gray-100 bg-[#FAFAFA]">
                        <div className="flex-1 py-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-5 py-3 text-[14px] font-medium transition-colors ${
                                            isActive 
                                                ? 'bg-indigo-50 text-indigo-600 border-l-2 border-indigo-600 -ml-[2px]' 
                                                : 'text-gray-600 hover:bg-gray-50 border-l-2 border-transparent'
                                        }`}
                                    >
                                        <Icon className="w-[18px] h-[18px] opacity-75" />
                                        {tab.id}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="p-4 mt-auto">
                            <button 
                                onClick={clearAll}
                                className={`text-[13px] font-medium ${hasAnyFilter ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 cursor-not-allowed'}`}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Options */}
                    <div className="flex-1 bg-white p-5">
                        {(activeTab === 'Hosted by' || activeTab === 'Participants') && (
                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="relative flex-1">
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input 
                                            type="text" 
                                            placeholder={`Search ${activeTab === 'Hosted by' ? 'host' : 'participant'}`} 
                                            className="w-full pl-9 pr-3 py-2 border border-gray-100 rounded-md text-[13px] outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 text-gray-700 placeholder:text-gray-400"
                                        />
                                    </div>
                                    <button 
                                        onClick={() => updateParam('participant', '')}
                                        className="text-[13px] font-medium text-gray-300 hover:text-gray-500 whitespace-nowrap"
                                    >
                                        Clear all
                                    </button>
                                </div>

                                <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                                    {participants.length === 0 && (
                                        <div className="text-[13px] text-gray-500 text-center py-4">No participants found</div>
                                    )}
                                    {participants.map(p => (
                                        <label key={p.id} className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                            <div className="w-9 h-9 rounded-md bg-[#5C4033] text-[#F5CBA7] flex items-center justify-center font-bold text-sm shrink-0">
                                                {p.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 flex justify-between items-center pt-0.5">
                                                <div>
                                                    <div className="text-[14px] font-medium text-gray-800">{p.name}</div>
                                                    <div className="text-[13px] text-gray-400">{p.email || 'No email provided'}</div>
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    checked={currentParticipant === p.name}
                                                    onChange={() => toggleParticipant(p.name)}
                                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 mt-1 cursor-pointer" 
                                                />
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Date Range' && (
                            <div className="flex flex-col space-y-5 mt-2">
                                {dateRanges.map(range => (
                                    <label key={range} className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-[14px] text-gray-700 group-hover:text-gray-900">{range}</span>
                                        <div onClick={() => updateParam('date_range', range === 'Any Time' ? '' : range)}>
                                            {(currentDateRange === range || (range === 'Any Time' && !currentDateRange)) ? (
                                                <CircleDot className="w-[18px] h-[18px] text-indigo-600" />
                                            ) : (
                                                <Circle className="w-[18px] h-[18px] text-gray-200 group-hover:text-gray-300 transition-colors" />
                                            )}
                                        </div>
                                    </label>
                                ))}
                                <div className="h-px bg-gray-100 my-2"></div>
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-[14px] text-gray-700 group-hover:text-gray-900">Custom Date Range</span>
                                    <Calendar className="w-[18px] h-[18px] text-gray-400" />
                                </label>
                            </div>
                        )}

                        {activeTab === 'Duration' && (
                            <div className="flex flex-col space-y-5 mt-2">
                                {durations.map(dur => (
                                    <label key={dur} className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-[14px] text-gray-700 group-hover:text-gray-900">{dur}</span>
                                        <div onClick={() => updateParam('duration', currentDuration === dur ? '' : dur)}>
                                            {currentDuration === dur ? (
                                                <CircleDot className="w-[18px] h-[18px] text-indigo-600" />
                                            ) : (
                                                <Circle className="w-[18px] h-[18px] text-gray-200 group-hover:text-gray-300 transition-colors" />
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        {activeTab === 'Captured From' && (
                            <div className="flex flex-col space-y-5 mt-2">
                                {capturedSources.map(source => {
                                    const SourceIcon = source.icon;
                                    const isChecked = currentCapturedFrom.includes(source.name);
                                    return (
                                        <label key={source.name} className="flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <SourceIcon className="w-[18px] h-[18px] text-gray-400" />
                                                <span className="text-[14px] text-gray-700 group-hover:text-gray-900">{source.name}</span>
                                            </div>
                                            <input 
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => updateParam('captured_from', isChecked ? '' : source.name)}
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" 
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                        
                        {activeTab === 'Privacy' && (
                            <div className="flex items-center justify-center h-full text-[13px] text-gray-400">
                                Privacy options coming soon
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
