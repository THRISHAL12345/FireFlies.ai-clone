'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Download, Star, Share, ThumbsUp, ThumbsDown } from 'lucide-react';

interface PlayerProps {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
    onTimeUpdate: React.Dispatch<React.SetStateAction<number>>;
}

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function Player({ currentTime, duration, onSeek, onTimeUpdate }: PlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Mock playback progress
    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                onTimeUpdate((prev) => {
                    if (prev >= duration) {
                        setIsPlaying(false);
                        return duration;
                    }
                    return prev + 1; // 1 second per interval
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, duration, onTimeUpdate]);

    return (
        <div className="w-full h-full relative flex flex-col justify-center">
            {/* Progress Slider */}
            <div className="absolute -top-[1px] -left-6 -right-6 h-1 group cursor-pointer flex items-center z-10">
                <input 
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => onSeek(Number(e.target.value))}
                    className="w-full absolute inset-0 opacity-0 cursor-pointer z-20"
                />
                <div className="w-full h-[2px] bg-gray-200 group-hover:h-[3px] transition-all relative">
                    <div 
                        className="h-full bg-[#6941C6] relative pointer-events-none"
                        style={{ width: `${Math.min(100, Math.max(0, (currentTime / (duration || 1)) * 100))}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#6941C6] rounded-full opacity-0 group-hover:opacity-100 transform translate-x-1/2 transition-opacity shadow-sm" />
                    </div>
                </div>
            </div>

            {/* Controls Row */}
            <div className="w-full flex items-center justify-between">
                {/* Left: Time */}
                <div className="text-[12px] font-medium text-gray-500 w-32 flex items-center gap-1">
                    <span className="text-gray-700">{formatTime(currentTime)}</span>
                    <span className="text-gray-400">/ {formatTime(duration)}</span>
                </div>

                {/* Center: Playback Controls */}
                <div className="flex-1 flex justify-center items-center gap-6">
                    <button className="text-[12px] font-medium text-gray-500 hover:text-gray-900 transition-colors mr-2">
                        1x
                    </button>
                    <button 
                        onClick={() => onSeek(Math.max(0, currentTime - 15))}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-9 h-9 bg-[#6941C6] hover:bg-[#53389E] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                    </button>
                    <button 
                        onClick={() => onSeek(Math.min(duration, currentTime + 15))}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <RotateCw className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-700 transition-colors ml-4">
                        <Download className="w-4 h-4" />
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="w-32 flex items-center justify-end gap-5">
                    <button className="text-gray-400 hover:text-gray-700 transition-colors">
                        <Star className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-700 transition-colors">
                        <Share className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-700 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-700 transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
