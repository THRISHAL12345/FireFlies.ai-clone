import React, { useEffect, useState } from 'react';
import { Search, ChevronUp, Plus, Hash, Check } from 'lucide-react';
import { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { TranscriptSegment } from '@/lib/types';

const COLORS = ['#6CE9A6', '#F04438', '#06AED4', '#F79009', '#E8348B'];

export default function SmartSearchPanel() {
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const meetingId = parseInt(params.id as string, 10);
    const [segments, setSegments] = useState<TranscriptSegment[]>([]);

    const activeFilter = searchParams.get('aifilter');

    const handleFilterClick = (filterName: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        if (activeFilter === filterName) {
            current.delete('aifilter');
        } else {
            current.set('aifilter', filterName);
        }
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`);
    };

    useEffect(() => {
        if (!isNaN(meetingId)) {
            api.transcripts.get(meetingId).then(setSegments).catch(console.error);
        }
    }, [meetingId]);

    const stats = React.useMemo(() => {
        const counts = { datetime: 0, tasks: 0, metrics: 0, questions: 0 };
        const sentiments = { positive: 0, negative: 0, neutral: 0, total: 0 };
        
        segments.forEach(seg => {
            const text = seg.text.toLowerCase();
            if (/\b(tomorrow|yesterday|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|year|\d{1,2} (am|pm))\b/i.test(text)) counts.datetime++;
            if (/\b(need to|will do|action item|task|assign)\b/i.test(text)) counts.tasks++;
            if (/(\d+%|\$\d+|\b(revenue|arr|metrics|percent)\b)/i.test(text)) counts.metrics++;
            if (/\?/.test(text)) counts.questions++;
            
            const isPositive = /\b(great|awesome|good|perfect|fantastic|excellent|love|happy|success|yes|agreed|thanks|thank you)\b/i.test(text);
            const isNegative = /\b(bad|terrible|wrong|error|issue|problem|fail|sad|concerned|hate|no|disagree|downtime|outage|starved)\b/i.test(text);
            
            if (isPositive) sentiments.positive++;
            else if (isNegative) sentiments.negative++;
            else sentiments.neutral++;
            sentiments.total++;
        });
        
        return {
            filterCounts: counts,
            sentimentCounts: sentiments
        };
    }, [segments]);
    
    const { filterCounts, sentimentCounts } = stats;

    // Calculate speaker talktime
    const speakerStats = React.useMemo(() => {
        const stats: Record<string, { duration: number, words: number }> = {};
        let totalDuration = 0;

        segments.forEach(seg => {
            const duration = Math.max(0, seg.end_time_seconds - seg.start_time_seconds);
            const words = seg.text.trim().split(/\s+/).length;
            totalDuration += duration;
            
            // Use the nested speaker object label
            const label = seg.speaker?.label || 'Unknown Speaker';
                          
            if (!stats[label]) {
                stats[label] = { duration: 0, words: 0 };
            }
            stats[label].duration += duration;
            stats[label].words += words;
        });

        return Object.entries(stats).map(([speaker, data]) => {
            const talkTimePct = totalDuration > 0 ? Math.round((data.duration / totalDuration) * 100) : 0;
            const wpm = data.duration > 0 ? Math.round((data.words / (data.duration / 60))) : 0;
            
            return {
                speaker,
                talkTimePct,
                wpm
            };
        }).sort((a, b) => b.talkTimePct - a.talkTimePct);
    }, [segments]);

    return (
        <div className="w-[320px] h-full bg-white border-r border-gray-200 flex flex-col overflow-y-auto shrink-0 z-40 relative shadow-[4px_0_10px_rgba(0,0,0,0.02)]">
            {/* Header */}
            <div className="flex items-center gap-2 p-4 pt-6">
                <div className="w-6 h-6 rounded border border-[#6941C6] flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4 text-[#6941C6]" />
                </div>
                <h2 className="text-[15px] font-medium text-gray-800">Smart Search</h2>
            </div>

            {/* AI Filters */}
            <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold text-gray-400 tracking-wider">AI FILTERS</span>
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {/* Date & Time */}
                    <div 
                        onClick={() => handleFilterClick('datetime')}
                        className={`rounded-lg p-2 flex items-center justify-between border cursor-pointer transition-colors ${activeFilter === 'datetime' ? 'bg-[#12B76A]/10 border-[#12B76A]/30' : 'bg-gray-50/80 border-gray-100 hover:bg-gray-100'}`}
                    >
                        <div className="flex items-center gap-2">
                            {activeFilter === 'datetime' ? (
                                <Check className="w-3.5 h-3.5 text-[#12B76A]" />
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#12B76A] ml-1"></div>
                            )}
                            <span className="text-xs text-gray-700">Date & Time</span>
                        </div>
                        <span className="text-xs font-medium text-gray-500">{filterCounts.datetime}</span>
                    </div>
                    {/* Tasks */}
                    <div 
                        onClick={() => handleFilterClick('tasks')}
                        className={`rounded-lg p-2 flex items-center justify-between border cursor-pointer transition-colors ${activeFilter === 'tasks' ? 'bg-[#F79009]/10 border-[#F79009]/30' : 'bg-gray-50/80 border-gray-100 hover:bg-gray-100'}`}
                    >
                        <div className="flex items-center gap-2">
                            {activeFilter === 'tasks' ? (
                                <Check className="w-3.5 h-3.5 text-[#F79009]" />
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#F79009] ml-1"></div>
                            )}
                            <span className="text-xs text-gray-700">Tasks</span>
                        </div>
                        <span className="text-xs font-medium text-gray-500">{filterCounts.tasks}</span>
                    </div>
                    {/* Metrics */}
                    <div 
                        onClick={() => handleFilterClick('metrics')}
                        className={`rounded-lg p-2 flex items-center justify-between border cursor-pointer transition-colors ${activeFilter === 'metrics' ? 'bg-[#06AED4]/10 border-[#06AED4]/30' : 'bg-gray-50/80 border-gray-100 hover:bg-gray-100'}`}
                    >
                        <div className="flex items-center gap-2">
                            {activeFilter === 'metrics' ? (
                                <Check className="w-3.5 h-3.5 text-[#06AED4]" />
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#06AED4] ml-1"></div>
                            )}
                            <span className="text-xs text-gray-700">Metrics</span>
                        </div>
                        <span className="text-xs font-medium text-gray-500">{filterCounts.metrics}</span>
                    </div>
                    {/* Questions */}
                    <div 
                        onClick={() => handleFilterClick('questions')}
                        className={`rounded-lg p-2 flex items-center justify-between border cursor-pointer transition-colors ${activeFilter === 'questions' ? 'bg-[#E8348B]/10 border-[#E8348B]/30' : 'bg-gray-50/80 border-gray-100 hover:bg-gray-100'}`}
                    >
                        <div className="flex items-center gap-2">
                            {activeFilter === 'questions' ? (
                                <Check className="w-3.5 h-3.5 text-[#E8348B]" />
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E8348B] ml-1"></div>
                            )}
                            <span className="text-xs text-gray-700">Questions</span>
                        </div>
                        <span className="text-xs font-medium text-gray-500">{filterCounts.questions}</span>
                    </div>
                </div>
            </div>

            {/* Sentiments */}
            <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold text-gray-400 tracking-wider">SENTIMENTS</span>
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-2">
                    {/* Positive */}
                    <div 
                        onClick={() => handleFilterClick('positive')}
                        className={`rounded-lg p-2 flex items-center justify-between border cursor-pointer transition-colors ${activeFilter === 'positive' ? 'bg-[#06AED4]/10 border-[#06AED4]/30' : 'bg-transparent border-transparent hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center gap-2">
                            {activeFilter === 'positive' ? (
                                <Check className="w-3.5 h-3.5 text-[#06AED4]" />
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#06AED4] ml-1"></div>
                            )}
                            <span className="text-xs text-gray-700">Positive</span>
                        </div>
                        <span className="text-xs font-medium text-gray-500">{sentimentCounts.total > 0 ? Math.round((sentimentCounts.positive / sentimentCounts.total) * 100) : 0}%</span>
                    </div>
                    {/* Neutral */}
                    <div 
                        onClick={() => handleFilterClick('neutral')}
                        className={`rounded-lg p-2 flex items-center justify-between border cursor-pointer transition-colors ${activeFilter === 'neutral' ? 'bg-[#E8348B]/10 border-[#E8348B]/30' : 'bg-transparent border-transparent hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center gap-2">
                            {activeFilter === 'neutral' ? (
                                <Check className="w-3.5 h-3.5 text-[#E8348B]" />
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E8348B] ml-1"></div>
                            )}
                            <span className="text-xs text-gray-700">Neutral</span>
                        </div>
                        <span className="text-xs font-medium text-gray-500">{sentimentCounts.total > 0 ? Math.round((sentimentCounts.neutral / sentimentCounts.total) * 100) : 0}%</span>
                    </div>
                    {/* Negative */}
                    <div 
                        onClick={() => handleFilterClick('negative')}
                        className={`rounded-lg p-2 flex items-center justify-between border cursor-pointer transition-colors ${activeFilter === 'negative' ? 'bg-[#F79009]/10 border-[#F79009]/30' : 'bg-transparent border-transparent hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center gap-2">
                            {activeFilter === 'negative' ? (
                                <Check className="w-3.5 h-3.5 text-[#F79009]" />
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#F79009] ml-1"></div>
                            )}
                            <span className="text-xs text-gray-700">Negative</span>
                        </div>
                        <span className="text-xs font-medium text-gray-500">{sentimentCounts.total > 0 ? Math.round((sentimentCounts.negative / sentimentCounts.total) * 100) : 0}%</span>
                    </div>
                </div>
            </div>

            {/* Speaker Talktime */}
            <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold text-gray-400 tracking-wider">SPEAKER TALKTIME</span>
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                </div>
                
                {/* Table Header */}
                <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 mb-3 tracking-wider px-1">
                    <span className="w-[120px]">SPEAKERS</span>
                    <span className="w-[40px] text-center">WPM</span>
                    <span className="w-[60px] text-right">TALKTIME</span>
                </div>
                
                {/* Dynamic Speaker Rows */}
                <div className="space-y-1">
                    {speakerStats.length > 0 ? speakerStats.map((stat, i) => {
                        const initial = stat.speaker.charAt(0).toUpperCase();
                        const color = COLORS[i % COLORS.length];
                        
                        return (
                            <div key={stat.speaker} className="flex items-center justify-between bg-gray-50/50 rounded-lg p-2 border border-transparent hover:border-gray-100 transition-colors">
                                <div className="flex items-center gap-2 w-[120px]">
                                    <div 
                                        className="w-5 h-5 text-white rounded flex items-center justify-center text-[10px] font-medium shrink-0"
                                        style={{ backgroundColor: color }}
                                    >
                                        {initial}
                                    </div>
                                    <span className="text-xs text-gray-700 truncate" title={stat.speaker}>{stat.speaker}</span>
                                </div>
                                
                                <div className="w-[40px] flex items-center justify-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-[#F04438]"></div>
                                    <span className="text-xs text-gray-600">{stat.wpm}</span>
                                </div>
                                
                                <div className="w-[60px] flex items-center justify-end gap-2">
                                    <div className="relative w-4 h-4 flex items-center justify-center">
                                        <svg className="w-4 h-4 -rotate-90" viewBox="0 0 36 36">
                                            <path
                                                className="text-gray-200"
                                                strokeWidth="4"
                                                stroke="currentColor"
                                                fill="none"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                            <path
                                                className="text-[#6941C6]"
                                                strokeDasharray={`${stat.talkTimePct}, 100`}
                                                strokeWidth="4"
                                                stroke="currentColor"
                                                fill="none"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-600">{stat.talkTimePct}%</span>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-xs text-gray-400 py-2 px-1">Loading...</div>
                    )}
                </div>
            </div>

            {/* Topic Trackers */}
            <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold text-gray-400 tracking-wider">TOPIC TRACKERS</span>
                    <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
                
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-400">
                        <Hash className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-medium text-gray-900 mt-1">No topic tracker</span>
                </div>
            </div>
        </div>
    );
}
