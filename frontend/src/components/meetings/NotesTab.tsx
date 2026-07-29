'use client';

import React, { useState } from 'react';
import { MeetingDetail, Summary } from '@/lib/types';
import { api } from '@/lib/api';
import { Bot, UploadCloud, Video, Copy, Maximize2, Edit2, Check, X, Plus, Zap, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import ActionItemsTab from './ActionItemsTab';

interface NotesTabProps {
    meeting: MeetingDetail;
}

export default function NotesTab({ meeting }: NotesTabProps) {
    const [summary, setSummary] = useState<Summary | undefined>(meeting.summary);
    const [activeTab, setActiveTab] = useState<'notes' | 'ai_skills'>('notes');
    const [showVideo, setShowVideo] = useState(false);
    
    // Title editing state
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleText, setTitleText] = useState(meeting.title);
    const [isSavingTitle, setIsSavingTitle] = useState(false);

    const handleSaveTitle = async () => {
        if (!titleText.trim() || titleText === meeting.title) {
            setIsEditingTitle(false);
            setTitleText(meeting.title);
            return;
        }
        setIsSavingTitle(true);
        try {
            await api.meetings.update(meeting.id, { title: titleText });
            toast.success("Title updated");
            setIsEditingTitle(false);
            // Optionally could trigger a global refresh or rely on local state
        } catch (error) {
            console.error("Failed to update title", error);
            toast.error("Failed to update title");
            setTitleText(meeting.title); // revert
        } finally {
            setIsSavingTitle(false);
        }
    };

    // Format date string
    const formattedDate = new Date(meeting.date).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-gray-100 shrink-0">
                <div className="flex-1"></div>
                <div className="bg-gray-50 p-1 rounded-lg flex items-center">
                    <button 
                        onClick={() => setActiveTab('notes')}
                        className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-all ${
                            activeTab === 'notes' ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100 text-gray-800' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Notes
                    </button>
                    <button 
                        onClick={() => setActiveTab('ai_skills')}
                        className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-all ${
                            activeTab === 'ai_skills' ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100 text-gray-800' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        AI Skills - 0
                    </button>
                </div>
                <div className="flex-1 flex justify-end pr-2">
                    <button className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors">
                        <Maximize2 className="w-[18px] h-[18px]" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'notes' ? (
                    <div className="max-w-3xl mx-auto relative">
                        {/* Video Element */}
                        {showVideo && (
                            <div className="w-full aspect-video bg-black rounded-lg mb-6 overflow-hidden relative shadow-md border border-gray-200 flex items-center justify-center group">
                                {/* This would be the actual <video src={meeting.media_url} /> element */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors cursor-pointer border border-white/10 z-10">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 z-10 text-white text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="shrink-0 font-mono tracking-wider">0:00 / {Math.floor(meeting.duration_seconds / 60)}:{(meeting.duration_seconds % 60).toString().padStart(2, '0')}</span>
                                    <div className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-0 bg-indigo-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Title & Video Button */}
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 group relative flex items-center pr-4">
                                {isEditingTitle ? (
                                    <div className="flex items-center gap-2 w-full">
                                        <input 
                                            type="text" 
                                            value={titleText}
                                            onChange={(e) => setTitleText(e.target.value)}
                                            className="text-[28px] text-gray-800 font-medium leading-tight w-full border-b border-indigo-300 focus:outline-none focus:border-indigo-600 bg-transparent"
                                            autoFocus
                                            disabled={isSavingTitle}
                                        />
                                        <button 
                                            onClick={handleSaveTitle}
                                            disabled={isSavingTitle}
                                            className="p-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => { setIsEditingTitle(false); setTitleText(meeting.title); }}
                                            disabled={isSavingTitle}
                                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-[28px] text-gray-800 font-medium leading-tight">
                                            {titleText}
                                        </h1>
                                        <button 
                                            onClick={() => setIsEditingTitle(true)}
                                            className="ml-3 p-1.5 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                            <button 
                                onClick={() => setShowVideo(!showVideo)}
                                className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm font-medium transition-colors shrink-0 ml-4 ${showVideo ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                            >
                                <Video className="w-4 h-4" />
                                Video
                            </button>
                        </div>

                        {/* Subtitle Row */}
                        <div className="flex items-center gap-2.5 text-[13px] text-gray-500 mb-8 font-medium">
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <Bot className="w-3.5 h-3.5 text-[#E8348B]" />
                                <span className="underline decoration-gray-300 underline-offset-4">Fred Fireflies</span>
                            </div>
                            <span>{formattedDate}</span>
                            <div className="flex items-center gap-1 text-gray-500 ml-1">
                                <UploadCloud className="w-3.5 h-3.5 text-gray-400" />
                                <span>· English (Global)</span>
                            </div>
                        </div>

                        {/* General Summary */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 text-gray-400 font-medium text-sm mb-4">
                                <SparklesIcon />
                                General Summary
                                <button className="hover:text-gray-600 transition-colors ml-1">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Notes content */}
                        <div className="mb-6">
                            <h3 className="text-[17px] font-semibold text-gray-800 mb-3">Notes</h3>
                            {summary ? (
                                <div className="space-y-4">
                                    {/* For demonstration, rendering the overview text.
                                        In a real scenario, this might be Markdown or structured HTML */}
                                    <p className="text-[15px] text-gray-700 leading-relaxed">
                                        {summary.overview_text}
                                    </p>
                                    
                                    {/* Mocking the bullet points layout shown in screenshot */}
                                    <ul className="list-disc pl-5 space-y-3 mt-6 text-[15px] text-gray-700 leading-relaxed">
                                        <li>
                                            Fireflies offers an automatic meeting join feature that users can toggle per meeting or calendar-wide, with language settings adaptable per meeting or by default to English <a href="#" className="text-[#3b82f6] hover:underline">(00:01)</a>.
                                            <ul className="list-[circle] pl-6 mt-2 space-y-2 text-gray-600">
                                                <li>This ensures users never miss transcription and summary capabilities without manual invites.</li>
                                                <li>Auto-join minimizes user effort and maximizes meeting capture rates.</li>
                                                <li>This system supports multilingual meetings by allowing pre-meeting language selection, improving accuracy and relevance.</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-[15px]">No summary generated yet.</p>
                            )}
                        </div>

                        {/* Action Items Section */}
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <ActionItemsTab meetingId={meeting.id} initialItems={meeting.action_items || []} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4 mt-12">
                        {/* Pink Plus Icon */}
                        <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <Plus className="w-6 h-6 text-pink-400" strokeWidth={3} />
                        </div>
                        
                        <h2 className="text-[20px] font-semibold text-gray-800 mb-2">
                            Extract specific insights from this meeting ✨
                        </h2>
                        <p className="text-[14px] text-gray-500 text-center max-w-md mb-10 leading-relaxed">
                            AI skills analyze your conversations to surface specific insights that's relevant to you.
                        </p>
                        
                        {/* Skills Container */}
                        <div className="w-full bg-[#F2FBF7] rounded-2xl p-6 border border-emerald-50/50 shadow-sm">
                            <div className="space-y-3">
                                {/* Skill Row 1 */}
                                <div className="bg-white rounded-xl flex items-center justify-between p-3.5 shadow-sm border border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                                            <Plus className="w-4 h-4 text-teal-500" strokeWidth={3} />
                                        </div>
                                        <span className="text-[14.5px] font-medium text-gray-700">Attendee Contributions</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Zap className="w-3.5 h-3.5 fill-current" />
                                            <span className="text-[13px] font-medium">52.8k</span>
                                        </div>
                                        <button className="text-[13.5px] font-medium text-gray-600 hover:text-indigo-600 transition-colors">Run</button>
                                    </div>
                                </div>
                                
                                {/* Skill Row 2 */}
                                <div className="bg-white rounded-xl flex items-center justify-between p-3.5 shadow-sm border border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                                            <Plus className="w-4 h-4 text-indigo-500" strokeWidth={3} />
                                        </div>
                                        <span className="text-[14.5px] font-medium text-gray-700">Todos</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Zap className="w-3.5 h-3.5 fill-current" />
                                            <span className="text-[13px] font-medium">128.2k</span>
                                        </div>
                                        <button className="text-[13.5px] font-medium text-gray-600 hover:text-indigo-600 transition-colors">Run</button>
                                    </div>
                                </div>
                                
                                {/* Skill Row 3 */}
                                <div className="bg-white rounded-xl flex items-center justify-between p-3.5 shadow-sm border border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                                            <Plus className="w-4 h-4 text-indigo-500" strokeWidth={3} />
                                        </div>
                                        <span className="text-[14.5px] font-medium text-gray-700">Meeting Effectiveness</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Zap className="w-3.5 h-3.5 fill-current" />
                                            <span className="text-[13px] font-medium">22.5k</span>
                                        </div>
                                        <button className="text-[13.5px] font-medium text-gray-600 hover:text-indigo-600 transition-colors">Run</button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Footer */}
                            <div className="flex items-center justify-between mt-6 px-1">
                                <button className="flex items-center gap-1 text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group">
                                    200+ AI Skills 
                                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                                </button>
                                <span className="text-[12px] text-gray-400 font-medium">Consumes AI credits</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function SparklesIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
        </svg>
    );
}
