'use client';

import React from 'react';
import { User, Bell, Shield, Key, Puzzle, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex-1 w-full bg-white flex flex-col p-8 pb-32">
      <div className="max-w-4xl mx-auto w-full">
        
        <h1 className="text-[28px] text-gray-900 font-semibold mb-8">Settings</h1>
        
        <div className="flex gap-8">
          {/* Settings Sidebar */}
          <div className="w-64 shrink-0 flex flex-col gap-1">
            <button className="flex items-center gap-3 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-md font-medium text-sm transition-colors">
              <User className="w-4 h-4" />
              Account Settings
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors">
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors">
              <Shield className="w-4 h-4" />
              Privacy & Security
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors">
              <Key className="w-4 h-4" />
              API Keys
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors">
              <Puzzle className="w-4 h-4" />
              Integrations
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors">
              <CreditCard className="w-4 h-4" />
              Billing
            </button>
          </div>

          {/* Settings Content */}
          <div className="flex-1 space-y-8">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Profile</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your personal information and preferences.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-semibold">
                    JD
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                      Change Avatar
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" disabled defaultValue="John" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" disabled defaultValue="Doe" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" disabled defaultValue="john.doe@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Meeting Preferences</h2>
                <p className="text-sm text-gray-500 mt-1">Configure how Fred joins and processes your meetings.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Auto-join calendar events</h3>
                    <p className="text-sm text-gray-500">Fred will automatically join meetings with a supported link.</p>
                  </div>
                  <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer opacity-50">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Send meeting recaps</h3>
                    <p className="text-sm text-gray-500">Automatically send notes to participants after the meeting.</p>
                  </div>
                  <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer opacity-50">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 text-center mt-8">
              Note: Settings are disabled in this demo environment.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
