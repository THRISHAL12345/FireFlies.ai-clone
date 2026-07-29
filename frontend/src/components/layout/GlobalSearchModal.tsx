import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Bot, ChevronRight, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Meeting } from '@/lib/types';

interface GlobalSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Meeting[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const meetings = await api.meetings.list({ q: query });
                setResults(meetings.slice(0, 5)); // Limit to 5 results for dropdown
            } catch (error) {
                console.error("Failed to search meetings", error);
            } finally {
                setIsLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    const handleSelectMeeting = (id: number) => {
        onClose();
        router.push(`/meetings/${id}`);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            
            {/* Modal */}
            <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Search Input Area */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400 shrink-0" />
                    <input 
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by title or keyword.."
                        className="flex-1 bg-transparent text-[15px] text-gray-900 focus:outline-none placeholder:text-gray-400"
                    />
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-3 bg-gray-50/50 flex-1 min-h-[100px] max-h-[60vh] overflow-y-auto">
                    
                    {query.trim() === '' ? (
                        /* Ask Fred Banner */
                        <div className="bg-[#F8F5FF] border border-[#E9D5FF] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-purple-600">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <span className="text-[14px] text-gray-700 font-medium">Ask Fred anything about your meetings</span>
                            </div>
                            <span className="text-[#6941C6] text-[13px] font-semibold pr-2">Try AskFred</span>
                        </div>
                    ) : (
                        /* Results */
                        <div className="space-y-1">
                            {isLoading ? (
                                <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                            ) : results.length > 0 ? (
                                <>
                                    <div className="px-3 pb-2 pt-1 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Meetings</div>
                                    {results.map(meeting => (
                                        <div 
                                            key={meeting.id}
                                            onClick={() => handleSelectMeeting(meeting.id)}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 cursor-pointer transition-all group"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-[14px] font-medium text-gray-900 truncate">{meeting.title}</div>
                                                    <div className="text-[12px] text-gray-500 mt-0.5">
                                                        {new Date(meeting.date).toLocaleDateString()} · {Math.round(meeting.duration_seconds / 60)} min
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="p-8 text-center">
                                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No meetings found matching "{query}"</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    );
}
