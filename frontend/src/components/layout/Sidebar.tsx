'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Home, 
    Bot,
    Video,
    Activity,
    Upload,
    Layers,
    BarChart2,
    Users,
    Star,
    Settings,
    MoreHorizontal,
    Headset,
    Lock,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import Image from 'next/image';

export default function Sidebar() {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHoveringLogo, setIsHoveringLogo] = useState(false);

    const topNavItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'AskFred', href: '#', icon: Bot, shortcut: 'Ctrl + J' },
        { name: 'Meetings', href: '/meetings', icon: Video },
        { name: 'Meeting Status', href: '#', icon: Activity },
        { name: 'Uploads', href: '/meetings/new', icon: Upload },
    ];

    const integrationsNavItems = [
        { name: 'Integrations', href: '#', icon: Layers },
        { name: 'Analytics', href: '#', icon: BarChart2 },
    ];

    const aiNavItems = [
        { name: 'Voice Agents', href: '#', icon: Headset, badge: 'NEW' },
        { name: 'AI Skills', href: '#', icon: Star },
    ];

    const bottomNavItems = [
        { name: 'Team', href: '#', icon: Users },
        { name: 'Upgrade', href: '#', icon: Star },
        { name: 'Settings', href: '#', icon: Settings },
        { name: 'More', href: '#', icon: MoreHorizontal },
    ];

    const renderIcon = (item: any) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        if (!isExpanded) {
            return (
                <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-center w-9 h-9 rounded-md mb-2 mx-auto transition-colors ${
                        isActive 
                            ? 'bg-[#F3E8FF] text-[#6941C6]' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                    title={item.name}
                >
                    <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-[#6941C6]' : ''}`} />
                </Link>
            );
        }

        return (
            <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between w-full h-9 px-3 rounded-md mb-0.5 transition-colors ${
                    isActive 
                        ? 'bg-[#F4F0FF] text-[#6941C6]' 
                        : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
                <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#6941C6]' : 'text-gray-500'}`} />
                    <span className="text-[13px] font-medium">{item.name}</span>
                </div>
                {item.shortcut && (
                    <span className="text-[10px] text-gray-400 font-medium">{item.shortcut}</span>
                )}
                {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-400 text-white tracking-wider">
                        {item.badge}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <div 
            className={`flex flex-col border-r border-gray-100 bg-white h-screen sticky top-0 shrink-0 z-20 transition-all duration-300 ${
                isExpanded ? 'w-[240px]' : 'w-[64px]'
            }`}
        >
            {/* Logo area */}
            <div 
                className="h-16 flex items-center justify-center relative mb-4 mt-2 px-4"
                onMouseEnter={() => setIsHoveringLogo(true)}
                onMouseLeave={() => setIsHoveringLogo(false)}
            >
                <Link 
                    href="/" 
                    className={`flex items-center gap-2 transition-opacity duration-200 ${isExpanded ? 'w-full' : ''} ${(!isExpanded && isHoveringLogo) ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}
                >
                    <div className="w-8 h-8 rounded flex items-center justify-center shrink-0">
                        <Image src="/images/landing/logo.svg" alt="Fireflies Logo" width={24} height={24} className="w-6 h-6" />
                    </div>
                    {isExpanded && (
                        <span className="font-bold text-xl tracking-tight text-gray-900 truncate transition-opacity duration-300">
                            fireflies.ai
                        </span>
                    )}
                </Link>
                
                {/* Toggle Button */}
                {isHoveringLogo && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`absolute p-1.5 bg-white border border-gray-200 rounded-md shadow-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors z-10 ${
                            isExpanded ? 'right-2 top-1/2 -translate-y-1/2' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                        }`}
                        title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
                    >
                        {isExpanded ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                    </button>
                )}
            </div>

            <div className={`flex-1 overflow-y-auto pb-20 ${isExpanded ? 'px-4' : 'px-0'}`}>
                {/* Top Group */}
                <div className="flex flex-col w-full mb-4">
                    {topNavItems.map(renderIcon)}
                </div>

                <div className={`h-px bg-gray-100 mb-4 ${isExpanded ? 'mx-2' : 'mx-4'}`}></div>

                {/* Integrations Group */}
                <div className="flex flex-col w-full mb-4">
                    {integrationsNavItems.map(renderIcon)}
                </div>

                <div className={`h-px bg-gray-100 mb-4 ${isExpanded ? 'mx-2' : 'mx-4'}`}></div>

                {/* AI Group */}
                <div className="flex flex-col w-full mb-4">
                    {aiNavItems.map(renderIcon)}
                </div>

                <div className={`h-px bg-gray-100 mb-4 ${isExpanded ? 'mx-2' : 'mx-4'}`}></div>

                {/* Bottom Group */}
                <div className="flex flex-col w-full">
                    {bottomNavItems.map(renderIcon)}
                </div>
            </div>

            {/* Footer / Privacy */}
            <div className={`absolute bottom-0 w-full p-4 bg-white border-t border-gray-50 flex ${isExpanded ? 'justify-start' : 'justify-center'}`}>
                <Link href="#" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors px-2" title="Your Privacy Choices">
                    <Lock className="w-4 h-4 shrink-0" />
                    {isExpanded && <span className="text-[11px] font-medium truncate">Your Privacy Choices</span>}
                </Link>
            </div>
        </div>
    );
}
