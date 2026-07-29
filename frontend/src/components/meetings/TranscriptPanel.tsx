'use client';

import React, { useState, useMemo } from 'react';
import { TranscriptSegment } from '@/lib/types';
import { Search, FileText, Maximize2, ChevronUp, Sparkles, ArrowUp, X, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import TranscriptLine from './TranscriptLine';
import { api } from '@/lib/api';

interface TranscriptPanelProps {
    segments: TranscriptSegment[];
    currentTime: number;
    onSeek: (time: number) => void;
}

export default function TranscriptPanel({ segments, currentTime, onSeek }: TranscriptPanelProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'ask_fred' | 'transcript'>('ask_fred');
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    
    const searchParams = useSearchParams();
    const activeFilter = searchParams.get('aifilter');

    const filteredSegments = useMemo(() => {
        if (!activeFilter) return segments;
        
        return segments.filter(seg => {
            const text = seg.text.toLowerCase();
            const isPositive = /\b(great|awesome|good|perfect|fantastic|excellent|love|happy|success|yes|agreed|thanks|thank you)\b/i.test(text);
            const isNegative = /\b(bad|terrible|wrong|error|issue|problem|fail|sad|concerned|hate|no|disagree|downtime|outage|starved)\b/i.test(text);

            switch (activeFilter) {
                case 'datetime':
                    return /\b(tomorrow|yesterday|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|year|\d{1,2} (am|pm))\b/i.test(text);
                case 'tasks':
                    return /\b(need to|will do|action item|task|assign)\b/i.test(text);
                case 'metrics':
                    return /(\d+%|\$\d+|\b(revenue|arr|metrics|percent)\b)/i.test(text);
                case 'questions':
                    return /\?/.test(text);
                case 'positive':
                    return isPositive;
                case 'negative':
                    return isNegative && !isPositive; // Prefer positive if mixed
                case 'neutral':
                    return !isPositive && !isNegative;
                default:
                    return true;
            }
        });
    }, [segments, activeFilter]);

    const getFilterColor = (filter: string | null) => {
        switch (filter) {
            case 'datetime': return 'text-[#12B76A]';
            case 'tasks': return 'text-[#F79009]';
            case 'metrics': return 'text-[#06AED4]';
            case 'questions': return 'text-[#E8348B]';
            case 'positive': return 'text-[#06AED4]'; // Using cyan as in SmartSearchPanel
            case 'negative': return 'text-[#F79009]'; // Using orange as in SmartSearchPanel
            case 'neutral': return 'text-[#E8348B]'; // Using pink as in SmartSearchPanel
            default: return '';
        }
    };
    
    const meetingId = segments.length > 0 ? segments[0].meeting_id : 0;

    const activeSegmentId = useMemo(() => {
        const active = segments.find(
            s => currentTime >= s.start_time_seconds && currentTime <= s.end_time_seconds
        );
        if (active) return active.id;
        
        const passed = [...segments].reverse().find(s => currentTime > s.end_time_seconds);
        return passed ? passed.id : (segments[0]?.id || null);
    }, [currentTime, segments]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !meetingId || isChatLoading) return;
        
        const newMsg = { role: 'user', content: text };
        const newMessages = [...messages, newMsg];
        setMessages(newMessages);
        setChatInput('');
        setIsChatLoading(true);
        
        try {
            const response = await api.chat.sendMessage(meetingId, newMessages);
            setMessages([...newMessages, response]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI.' }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
                <div className="flex-1"></div>
                <div className="bg-gray-100/80 p-1 rounded-lg flex items-center shadow-inner">
                    <button 
                        onClick={() => setActiveTab('ask_fred')}
                        className={`px-4 py-1 text-[13px] font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                            activeTab === 'ask_fred' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <BotIcon />
                        AskFred
                    </button>
                    <button 
                        onClick={() => setActiveTab('transcript')}
                        className={`px-4 py-1 text-[13px] font-medium rounded-md transition-colors ${
                            activeTab === 'transcript' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Transcript
                    </button>
                </div>
                <div className="flex-1 flex justify-end">
                    <button className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {activeTab === 'transcript' ? (
                <div className="flex flex-col flex-1 overflow-hidden relative">
                    {/* Search Bar */}
                    <div className="px-6 py-3 border-b border-gray-100 shrink-0">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text" 
                                placeholder="Find or Replace" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-transparent text-[14px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Transcript Scroll Area */}
                    <div className="flex-1 overflow-y-auto px-6 pt-4 pb-24 relative">
                        {filteredSegments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <FileText className="w-8 h-8 text-gray-300 mb-2" />
                                <h3 className="text-gray-900 font-medium text-sm">No segments match filter</h3>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredSegments.map((segment) => (
                                    <TranscriptLine 
                                        key={segment.id}
                                        segment={segment}
                                        isActive={segment.id === activeSegmentId}
                                        searchQuery={searchQuery}
                                        onSeek={onSeek}
                                        customTextColor={getFilterColor(activeFilter)}
                                    />
                                ))}
                            </div>
                        )}
                        
                        {/* Floating Sync Button */}
                        <div className="sticky bottom-6 flex justify-center pointer-events-none mt-8">
                            <button className="bg-white border border-gray-200 shadow-lg rounded-full px-4 py-1.5 flex items-center gap-1.5 text-[13px] font-medium text-gray-700 pointer-events-auto hover:bg-gray-50 transition-colors">
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                                Sync with audio
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col flex-1 overflow-hidden bg-white relative">
                    {/* Integration Banner */}
                    <div className="mx-6 mt-4 p-4 rounded-xl bg-[#F8F5FF] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-white p-1.5 rounded-lg shadow-sm">
                                <IntegrationIconsSmall />
                            </div>
                            <div className="text-[13px] text-gray-700">
                                <span className="font-semibold text-gray-900">Connect Slack and Gmail</span> — get answers with full context.
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="text-[#6941C6] text-[13px] font-semibold hover:underline">
                                Connect
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto px-6 py-8">
                        {messages.length === 0 ? (
                            <>
                                <div className="flex items-center text-[#34D399] mb-4">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h2 className="text-gray-900 text-lg font-medium mb-1">Hi Thrishal!</h2>
                                <p className="text-gray-800 text-[15px] font-medium mb-8">Ask anything about this meeting</p>

                                {/* Suggestions */}
                                <div className="space-y-3">
                                    <button onClick={() => handleSendMessage("In what ways does Fireflies enhance user productivity?")} className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl text-[13.5px] text-gray-700">
                                        In what ways does Fireflies enhance user productivity?
                                    </button>
                                    <button onClick={() => handleSendMessage("How does task management integration improve team accountability?")} className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl text-[13.5px] text-gray-700">
                                        How does task management integration improve team accountability?
                                    </button>
                                    <button onClick={() => handleSendMessage("What insights can analytics dashboards provide to managers regarding team performance?")} className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl text-[13.5px] text-gray-700">
                                        What insights can analytics dashboards provide to managers regarding team performance?
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-6">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] ${
                                            msg.role === 'user' 
                                            ? 'bg-[#F3E8FF] text-[#6941C6] rounded-br-sm' 
                                            : 'bg-gray-50 text-gray-800 rounded-bl-sm border border-gray-100'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isChatLoading && (
                                    <div className="flex items-start">
                                        <div className="px-4 py-3 bg-gray-50 text-gray-400 rounded-2xl rounded-bl-sm border border-gray-100 flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="px-6 pb-6 pt-2 shrink-0 bg-white">
                        <div className="relative flex items-center w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:border-purple-300 focus-within:ring-1 focus-within:ring-purple-200 transition-all">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSendMessage(chatInput);
                                }}
                                disabled={isChatLoading}
                                placeholder="Ask anything. Type / to run AI Skills" 
                                className="w-full py-3.5 pl-4 pr-12 text-[14px] outline-none placeholder:text-gray-400 disabled:bg-gray-50"
                            />
                            <button 
                                onClick={() => handleSendMessage(chatInput)}
                                disabled={isChatLoading || !chatInput.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#F3E8FF] text-[#9333EA] hover:bg-[#E9D5FF] disabled:opacity-50 disabled:hover:bg-[#F3E8FF] rounded-lg transition-colors"
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function BotIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#E8348B"/>
            <path d="M7 11V14M17 11V14M9 16H15M8 9H16C17.1046 9 18 9.89543 18 11V15C18 16.1046 17.1046 17 16 17H8C6.89543 17 6 16.1046 6 15V11C6 9.89543 6.89543 9 8 9ZM10.5 9V7C10.5 6.17157 11.1716 5.5 12 5.5V5.5C12.8284 5.5 13.5 6.17157 13.5 7V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function IntegrationIconsSmall() {
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
