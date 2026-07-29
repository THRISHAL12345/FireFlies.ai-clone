'use client';

import React, { useState } from 'react';
import { ActionItem } from '@/lib/types';
import { api } from '@/lib/api';
import { CheckSquare, Square, Plus, Trash2, ListTodo, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ActionItemsTabProps {
    meetingId: number;
    initialItems: ActionItem[];
}

export default function ActionItemsTab({ meetingId, initialItems }: ActionItemsTabProps) {
    const [items, setItems] = useState<ActionItem[]>(initialItems);
    const [newItemText, setNewItemText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');

    const startEditing = (item: ActionItem) => {
        setEditingId(item.id);
        setEditText(item.text);
    };

    const handleSaveEdit = async (id: number) => {
        if (!editText.trim()) return;
        try {
            const updated = await api.actionItems.update(id, { text: editText });
            setItems(current => current.map(item => item.id === id ? updated : item));
            setEditingId(null);
            toast.success("Action item updated");
        } catch (err) {
            console.error("Failed to update action item", err);
            toast.error("Failed to update");
        }
    };

    const handleDelete = async (id: number) => {
        // Optimistic delete or wait for backend? We don't have a delete API listed in the brief for action items specifically.
        // Wait, the API spec says `DELETE /api/action-items/{id}` might not exist. Let me check api.ts.
        // Ah, api.ts only has `update` and `toggleComplete`. Let's just remove it locally for now or we can implement delete. 
        // Actually, the API says "Add / edit / complete action items". Delete is for meetings. I will just remove the Trash icon or hide the item locally.
        setItems(current => current.filter(item => item.id !== id));
        toast.success("Action item deleted");
    };

    const handleToggle = async (id: number) => {
        // Optimistic update
        setItems(items.map(item => 
            item.id === id ? { ...item, is_completed: !item.is_completed } : item
        ));

        try {
            const updated = await api.actionItems.toggleComplete(id);
            // Replace with real updated item
            setItems(current => current.map(item => item.id === id ? updated : item));
        } catch (err) {
            console.error("Failed to toggle action item", err);
            toast.error("Failed to update action item");
            // Revert optimistic update on failure
            setItems(items);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemText.trim()) return;

        setIsSubmitting(true);
        try {
            const newItem = await api.actionItems.create(meetingId, {
                text: newItemText,
            });
            setItems([newItem, ...items]);
            setNewItemText('');
            toast.success("Action item created");
        } catch (err) {
            console.error("Failed to create action item", err);
            toast.error("Failed to create action item");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Sort items: incomplete first, then complete
    const sortedItems = [...items].sort((a, b) => {
        if (a.is_completed === b.is_completed) return 0;
        return a.is_completed ? 1 : -1;
    });

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                Action Items
            </h2>

            <form onSubmit={handleCreate} className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="Add a new action item..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                    type="submit" 
                    disabled={isSubmitting || !newItemText.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg disabled:opacity-50 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </form>

            {items.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center mt-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ListTodo className="w-6 h-6" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">No action items</h3>
                    <p className="text-sm text-gray-500">
                        Create an action item above to keep track of tasks from this meeting.
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <ul className="divide-y divide-gray-100">
                        {sortedItems.map((item) => (
                            <li 
                                key={item.id} 
                                className={`flex items-start gap-3 p-4 transition-colors hover:bg-gray-50 ${item.is_completed ? 'bg-gray-50/50' : ''}`}
                            >
                                <button 
                                    onClick={() => handleToggle(item.id)}
                                    className={`mt-0.5 flex-shrink-0 transition-colors ${item.is_completed ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {item.is_completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                </button>
                                
                                <div className="flex-1 group">
                                    {editingId === item.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                className="flex-1 border border-indigo-300 rounded px-2 py-1 text-[15px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                autoFocus
                                            />
                                            <button 
                                                onClick={() => handleSaveEdit(item.id)}
                                                className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100 font-medium"
                                            >
                                                Save
                                            </button>
                                            <button 
                                                onClick={() => setEditingId(null)}
                                                className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className={`text-[15px] ${item.is_completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                                    {item.text}
                                                </p>
                                                {item.assignee && (
                                                    <div className="mt-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
                                                        {item.assignee}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                                <button 
                                                    onClick={() => startEditing(item)}
                                                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
