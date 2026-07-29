import React, { useState } from 'react';
import { X, Link as LinkIcon, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface CaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CaptureModal({ isOpen, onClose }: CaptureModalProps) {
    const [meetingName, setMeetingName] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [language, setLanguage] = useState('English (Global)');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!meetingLink) {
            toast.error('Meeting link is required');
            return;
        }

        setIsSubmitting(true);
        // Simulate a "Coming Soon" or processing delay
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success('Live meeting capture requested (Placeholder)');
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Add to live meeting</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                            Name your meeting <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="E.g. Product team sync"
                            value={meetingName}
                            onChange={(e) => setMeetingName(e.target.value)}
                            className="w-full border-gray-200 border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#8fa4fc] focus:border-[#8fa4fc] outline-none placeholder:text-gray-400"
                        />
                    </div>

                    {/* Link */}
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1">
                            Meeting link
                        </label>
                        <p className="text-xs text-gray-500 mb-2">Capture meetings from GMeet, Zoom, MS teams, and <a href="#" className="underline">more.</a></p>
                        
                        <div className="relative flex items-center">
                            <div className="absolute left-3 text-gray-400 border-r border-gray-200 pr-2">
                                <LinkIcon className="w-4 h-4" />
                            </div>
                            <input 
                                type="url" 
                                placeholder="https://global.gotomeeting.com/join/333699349"
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                className="w-full border-gray-200 border rounded-lg pl-12 pr-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#8fa4fc] focus:border-[#8fa4fc] outline-none placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Language */}
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                            Meeting language
                        </label>
                        <div className="relative">
                            <select 
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full border-gray-200 border rounded-lg px-3.5 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-[#8fa4fc] focus:border-[#8fa4fc] outline-none bg-white"
                            >
                                <option>English (Global)</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Footer / Buttons */}
                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!meetingLink || isSubmitting}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#EAE5FF] text-[#6941C6] rounded-lg transition-colors disabled:opacity-50"
                            style={{ backgroundColor: (meetingLink && !isSubmitting) ? '#EAE5FF' : '#F3F4F6', color: (meetingLink && !isSubmitting) ? '#6941C6' : '#9CA3AF' }}
                        >
                            {isSubmitting ? 'Starting...' : 'Start Capturing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
