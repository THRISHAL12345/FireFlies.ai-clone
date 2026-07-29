import React from 'react';
import MeetingSidebar from '@/components/meetings/MeetingSidebar';

export default function MeetingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen bg-white relative overflow-hidden">
      <MeetingSidebar />
      <div className="flex-1 flex flex-col h-full w-full relative z-10">
        {children}
      </div>
    </div>
  );
}
