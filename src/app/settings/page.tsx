'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';

export default function SettingsPage() {
  const breadcrumbs = [
    { name: 'Settings', href: '/settings', current: true }
  ];

  return (
    <MainLayout>
      <Header 
        title="Settings" 
        subtitle="Configure your application preferences"
        breadcrumbs={breadcrumbs}
      />
      
      <div className="space-y-6 max-w-3xl">
        <Card className="hover:shadow-lg transition-all">
          <h2 className="text-lg font-medium mb-4 text-neutral-900">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                defaultValue="Peter"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                defaultValue="peter@example.com"
              />
            </div>
            
            <div className="pt-3">
              <button type="button" className="btn-primary">
                Save Profile
              </button>
            </div>
          </div>
        </Card>
        
        <Card className="hover:shadow-lg transition-all">
          <h2 className="text-lg font-medium mb-4 text-neutral-900">Application Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-neutral-700">Dark Mode</h4>
                <p className="text-sm text-neutral-500">Enable dark theme for the application</p>
              </div>
              <div className="flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-neutral-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
              <div>
                <h4 className="text-sm font-medium text-neutral-700">Notifications</h4>
                <p className="text-sm text-neutral-500">Enable push notifications</p>
              </div>
              <div className="flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="relative w-11 h-6 bg-neutral-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
              <div>
                <h4 className="text-sm font-medium text-neutral-700">Auto-refresh Data</h4>
                <p className="text-sm text-neutral-500">Automatically refresh market data</p>
              </div>
              <div className="flex items-center">
                <select className="bg-neutral-50 border border-neutral-300 text-neutral-700 text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block p-2">
                  <option value="30">Every 30 seconds</option>
                  <option value="60">Every minute</option>
                  <option value="300">Every 5 minutes</option>
                  <option value="0">Manual refresh</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4">
              <button type="button" className="btn-primary">
                Save Preferences
              </button>
            </div>
          </div>
        </Card>
        
        <Card className="hover:shadow-lg transition-all">
          <h2 className="text-lg font-medium mb-4 text-neutral-900">API Access</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium text-neutral-700 mb-1">
                API Key
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="api-key"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-l-md bg-neutral-50"
                  value="1a2b3c4d5e6f7g8h9i0j"
                  readOnly
                />
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-neutral-300 text-sm font-medium rounded-r-md text-neutral-700 bg-neutral-50 hover:bg-neutral-100"
                >
                  Copy
                </button>
              </div>
              <p className="mt-1 text-sm text-neutral-500">Use this key to access the API</p>
            </div>
            
            <div className="pt-3">
              <button type="button" className="btn-secondary">
                Regenerate API Key
              </button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}