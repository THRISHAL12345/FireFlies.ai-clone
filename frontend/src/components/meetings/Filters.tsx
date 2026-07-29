'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, ArrowDownUp } from 'lucide-react';
import { useDebounce } from '@/lib/hooks'; // We'll create this

interface FiltersProps {
    currentParams: {
        q?: string;
        participant?: string;
        sort?: string;
    };
}

export default function Filters({ currentParams }: FiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(currentParams.q || '');
    const [participant, setParticipant] = useState(currentParams.participant || '');
    
    // Debounce the text inputs so we don't spam the API on every keystroke
    const debouncedSearch = useDebounce(searchQuery, 300);
    const debouncedParticipant = useDebounce(participant, 300);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        let hasChanges = false;
        
        if (debouncedSearch) {
            if (params.get('q') !== debouncedSearch) {
                params.set('q', debouncedSearch);
                hasChanges = true;
            }
        } else if (params.has('q')) {
            params.delete('q');
            hasChanges = true;
        }

        if (debouncedParticipant) {
            if (params.get('participant') !== debouncedParticipant) {
                params.set('participant', debouncedParticipant);
                hasChanges = true;
            }
        } else if (params.has('participant')) {
            params.delete('participant');
            hasChanges = true;
        }

        if (hasChanges) {
            const newUrl = params.toString() ? `/?${params.toString()}` : '/';
            router.push(newUrl);
        }
    }, [debouncedSearch, debouncedParticipant, router, searchParams]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', e.target.value);
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                    type="text" 
                    placeholder="Search meetings by title..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
                {/* Participant Filter */}
                <div className="relative flex-1 md:w-48">
                    <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Filter by participant..." 
                        value={participant}
                        onChange={(e) => setParticipant(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Sort Dropdown */}
                <div className="relative md:w-40 flex-shrink-0">
                    <ArrowDownUp className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select 
                        defaultValue={currentParams.sort || 'recent'}
                        onChange={handleSortChange}
                        className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
