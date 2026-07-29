'use client';

import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

export default function WelcomeCard() {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    return (
        <>
            <div className="bg-[#FFF4EC]/70 backdrop-blur-sm border border-[#FDEBD0] rounded-[24px] p-12 flex flex-col md:flex-row items-center justify-between gap-8 mb-12 shadow-sm">
                <div className="max-w-md md:ml-12">
                    <h2 className="text-[26px] font-semibold text-gray-800 mb-2.5 tracking-tight">Welcome Aboard, Thrishal!</h2>
                    <p className="text-gray-500 text-[15px] leading-relaxed">
                        Fireflies is now ready to automate your meetings<br />
                        and streamline your workflows.
                    </p>
                </div>
                <div className="mt-8 md:mt-0 relative shrink-0 md:mr-16">
                    <div className="w-[300px] h-[190px] bg-gradient-to-br from-[#1E1162] via-[#2F1A8C] to-[#551C94] rounded-[16px] overflow-hidden relative shadow-lg border-4 border-[#FFF9F5]">
                        {/* Mock Video Thumbnail */}
                        <div className="absolute inset-0 opacity-40 bg-[url('/images/landing/dark-star-gradient.svg')] bg-cover mix-blend-overlay"></div>
                        <button 
                            onClick={() => setIsVideoOpen(true)}
                            className="absolute inset-0 flex items-center justify-center w-full h-full"
                        >
                            <div className="w-12 h-12 bg-[#5233FF] rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/50">
                                <Play className="w-5 h-5 text-white ml-1 fill-white" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {isVideoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-black border border-white/20 rounded-2xl overflow-hidden shadow-2xl relative w-full max-w-4xl aspect-video animate-in fade-in zoom-in-95 duration-200">
                        {/* Close button */}
                        <button 
                            onClick={() => setIsVideoOpen(false)}
                            className="absolute -top-12 right-0 md:top-4 md:right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/uZuFXgNfZmI?autoplay=1" 
                            title="Product Demo" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                            className="absolute inset-0"
                        ></iframe>
                    </div>
                </div>
            )}
        </>
    );
}
