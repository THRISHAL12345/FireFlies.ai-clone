'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Inbox, File as FileIcon } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function NewMeetingPage() {
  const router = useRouter();
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for the modal that opens after selecting a file
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [duration, setDuration] = useState('30');
  const [participants, setParticipants] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, "")); // Default title to filename
      setIsModalOpen(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setTitle(e.dataTransfer.files[0].name.replace(/\.[^/.]+$/, ""));
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsedParticipants = participants
        .split(',')
        .map(p => p.trim())
        .filter(p => p)
        .map(p => ({ name: p }));

      let rawTranscript = undefined;
      if (selectedFile) {
          try {
              rawTranscript = await selectedFile.text();
          } catch (err) {
              console.error("Failed to read file", err);
              toast.error("Failed to read file content");
              setIsSubmitting(false);
              return;
          }
      }

      const newMeeting = await api.meetings.create({
        title: title || 'New Meeting',
        date: new Date(date).toISOString(),
        duration_seconds: parseInt(duration) * 60,
        participants: parsedParticipants,
        raw_transcript: rawTranscript,
        status: 'processed'
      });

      toast.success('File uploaded & meeting created!');
      router.push(`/meetings/${newMeeting.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create meeting.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-white flex flex-col items-center pt-8 pb-32">
      <div className="w-full max-w-[900px] px-8">
        
        {/* Banner */}
        {isBannerVisible && (
          <div className="bg-[#FFF8E6] border border-[#FBECC6] rounded-md py-3 px-4 flex items-center justify-between mb-8 relative">
            <p className="text-sm text-gray-800 flex-1 text-center font-medium">
              Uploads are moving — <span className="font-normal text-gray-600">you'll find them on the Meetings page soon.</span>
            </p>
            <button onClick={() => setIsBannerVisible(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Area */}
        <div 
            className="w-full border border-dashed border-[#BCC4F2] rounded-lg bg-white py-16 flex flex-col items-center justify-center transition-colors hover:bg-gray-50/50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="w-12 h-12 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-[#6941C6]" />
            </div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">Upload a file to generate a transcript</h3>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-xl">
                Browse or drag and drop <span className="font-semibold text-gray-700">MP3, M4A, WAV, MP4</span> or <span className="font-semibold text-gray-700">WEBM</span> files. (Max video size: 100 MB, Max audio size: 500 MB)
            </p>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept="audio/*,video/*,.json,.txt"
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 bg-[#6941C6] hover:bg-[#53389E] text-white text-sm font-medium rounded transition-colors shadow-sm"
            >
                Browse Files
            </button>
        </div>

        {/* Empty State */}
        <div className="mt-20 flex flex-col items-center justify-center opacity-60">
            <div className="mb-4 text-gray-300">
                {/* SVG matching the empty inbox tray icon */}
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">You have no recent uploads!</h3>
        </div>

      </div>

      {/* Details Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Meeting Details</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <FileIcon className="w-5 h-5 text-indigo-500" />
                      <span className="text-sm text-gray-700 font-medium truncate">{selectedFile?.name}</span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                          <input 
                              type="text" 
                              required
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                              <input 
                                  type="datetime-local" 
                                  required
                                  value={date}
                                  onChange={(e) => setDate(e.target.value)}
                                  className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                              <input 
                                  type="number" 
                                  required
                                  min="1"
                                  value={duration}
                                  onChange={(e) => setDuration(e.target.value)}
                                  className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Participants (comma separated)</label>
                          <input 
                              type="text" 
                              value={participants}
                              onChange={(e) => setParticipants(e.target.value)}
                              className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                              placeholder="Alice Johnson, Bob Smith"
                          />
                      </div>

                      <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                          <button
                              type="button"
                              onClick={() => setIsModalOpen(false)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                              Cancel
                          </button>
                          <button
                              type="submit"
                              disabled={isSubmitting}
                              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                          >
                              {isSubmitting ? 'Uploading...' : 'Upload & Process'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
