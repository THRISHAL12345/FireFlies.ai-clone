import React, { useState } from 'react';
import { CheckSquare, Edit, GraduationCap, ShieldCheck, Mic, ArrowRight, Download, Check, Sparkles } from 'lucide-react';
import { Notification } from '@/lib/types';
import { api } from '@/lib/api';

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export default function NotificationDropdown({ isOpen, onClose, notifications, setNotifications }: NotificationDropdownProps) {
    const [filterUnread, setFilterUnread] = useState(false);

    if (!isOpen) return null;

    const displayNotifications = filterUnread ? notifications.filter(n => n.is_unread) : notifications;
    
    const unreadCount = notifications.filter(n => n.is_unread).length;

    const handleMarkAllRead = async () => {
        try {
            const updated = await api.notifications.markAllRead();
            setNotifications(updated);
        } catch (error) {
            console.error("Failed to mark notifications read:", error);
        }
    };

    const renderIcon = (type: string) => {
        switch (type) {
            case 'course':
                return (
                    <div className="w-10 h-10 rounded-xl bg-[#6941C6] flex items-center justify-center text-white shadow-sm">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                );
            case 'webinar':
                return (
                    <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center text-[#E2E8F0] shadow-sm">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                );
            case 'feature':
                return (
                    <div className="w-10 h-10 rounded-xl bg-[#E0E7FF] flex items-center justify-center text-[#4F46E5] shadow-sm border border-[#C7D2FE]">
                        <Mic className="w-5 h-5" />
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shadow-sm border border-gray-200">
                        <Sparkles className="w-5 h-5" />
                    </div>
                );
        }
    };

    return (
        <>
            {/* Backdrop to detect outside clicks */}
            <div className="fixed inset-0 z-40" onClick={onClose}></div>
            
            {/* Popover container */}
            <div className="absolute top-[60px] right-6 w-[480px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-50 flex flex-col overflow-hidden max-h-[80vh]">
                
                {/* Header / Tabs */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-800 text-[13px] font-semibold rounded-md border border-gray-200">
                            All {notifications.length > 0 && `· ${notifications.length}`}
                        </button>
                        <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 text-[13px] font-medium rounded-md transition-colors">
                            Updates {unreadCount > 0 && `· ${unreadCount}`}
                        </button>
                        <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 text-[13px] font-medium rounded-md transition-colors">
                            Auto-Fill
                        </button>
                        <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 text-[13px] font-medium rounded-md transition-colors flex items-center gap-1.5">
                            Status <span className="bg-[#E6F8F3] text-[#059669] text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">New</span>
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                        <label className="flex items-center gap-2 cursor-pointer" onClick={() => setFilterUnread(!filterUnread)}>
                            <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${filterUnread ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                                {filterUnread && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-[13px] text-gray-500 font-medium">Unread</span>
                        </label>
                        <button onClick={handleMarkAllRead} className="text-gray-400 hover:text-gray-600 transition-colors" title="Mark all as read">
                            <CheckSquare className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Notification List */}
                <div className="overflow-y-auto flex-1 pb-2 min-h-[300px]">
                    {displayNotifications.length === 0 ? (
                        <div className="flex items-center justify-center h-full pt-12 pb-8">
                            <span className="text-sm text-gray-400 font-medium">No notifications</span>
                        </div>
                    ) : (
                        displayNotifications.map((notification, index) => (
                            <div key={notification.id} className={`px-5 py-3 hover:bg-gray-50 flex items-start gap-4 transition-colors cursor-pointer group ${index !== 0 ? 'border-t border-gray-50' : ''}`}>
                                <div className="relative shrink-0 mt-1">
                                    {renderIcon(notification.icon_type)}
                                    
                                    {notification.is_unread && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full flex items-center justify-center border-[1.5px] border-white"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-[14px] font-semibold text-gray-900 leading-tight">{notification.title}</h4>
                                            {notification.is_unread && <div className="w-2 h-2 rounded-full bg-red-500 mb-0.5"></div>}
                                        </div>
                                        <span className="text-[11px] font-medium text-gray-400 shrink-0">{notification.time_str}</span>
                                    </div>
                                    <p className="text-[13.5px] text-gray-500 mt-1 pr-6 leading-snug">{notification.message}</p>
                                    
                                    {notification.action_text && (
                                        <button className="mt-3 flex items-center gap-1.5 px-4 py-1.5 bg-[#6941C6] hover:bg-[#53389E] text-white text-[13px] font-semibold rounded-md transition-colors shadow-sm">
                                            {notification.action_text} 
                                            {notification.action_text.includes('->') || notification.action_text.includes('recording') || notification.action_text.includes('live') ? <ArrowRight className="w-3.5 h-3.5" /> : null}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Bottom Banner */}
                <div className="p-4 bg-white border-t border-gray-100 mt-auto shrink-0">
                    <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] rounded-xl p-3.5 flex items-center justify-between shadow-md cursor-pointer hover:shadow-lg transition-all border border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#2D2D2D] flex items-center justify-center shadow-inner border border-gray-700 overflow-hidden">
                                <img src="/images/landing/logo.svg" alt="Fireflies" className="w-5 h-5 opacity-90 brightness-200 contrast-200 sepia hue-rotate-300 saturate-200" />
                            </div>
                            <div>
                                <h4 className="text-white text-[13.5px] font-semibold leading-tight">Fireflies Desktop App</h4>
                                <p className="text-gray-400 text-[12px] mt-0.5">Capture conversations without a bot.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-white text-[13px] font-medium pr-1">
                            Download <Download className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
