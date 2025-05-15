'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { handleSignOut } from '@/actions/auth';

// Modern Icons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const CurrencyPairsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="8"></circle>
    <line x1="16" y1="8" x2="8" y2="16"></line>
    <line x1="12" y1="7" x2="12" y2="17"></line>
    <path d="M10 10H7"></path>
    <path d="M17 14h-3"></path>
  </svg>
);

const HistoricalDataIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="12 8 12 12 14 14"></polyline>
    <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"></path>
  </svg>
);

const OpportunitiesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="m2 8 2 2-2 2 2 2-2 2"></path>
    <path d="m22 8-2 2 2 2-2 2 2 2"></path>
    <path d="M8 18.82 6.5 21l-3-4.5L4 16"></path>
    <path d="M16 18.82 17.5 21l3-4.5-1-1"></path>
    <path d="M10.5 21H8.5l-.5-9 1.5-1 1.5 1-.5 9Z"></path>
    <path d="m14 10.5 1 .5 1-1-.5-1-1.5.5"></path>
    <path d="M13.5 21h2l.5-9-1.5-1.5-1.5 1L14 13l-.5 8Z"></path>
    <path d="M11 10.5 9.5 10l-.5 1 .5 1L11 12"></path>
  </svg>
);

const YieldCurvesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 21H4a2 2 0 0 1-2-2V3"></path>
    <path d="M19 15c-1.5 0-3-2-4.5-2s-3 2-4.5 2-3-2-4.5-2S3 15 1.5 15"></path>
    <path d="M19 8.5c-1.5 0-3-2-4.5-2s-3 2-4.5 2-3-2-4.5-2S3 8.5 1.5 8.5"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: <DashboardIcon />, description: 'Market Overview' },
  { name: 'Currency Pairs', href: '/currency-pairs', icon: <CurrencyPairsIcon />, description: 'FX Analysis' },
  { name: 'Historical Data', href: '/historical', icon: <HistoricalDataIcon />, description: 'Time Series' },
  { name: 'Opportunities', href: '/opportunities', icon: <OpportunitiesIcon />, description: 'Arbitrage Finder' },
  { name: 'Yield Curves', href: '/yield-curves/page-redesigned', icon: <YieldCurvesIcon />, description: 'QuantLib Models' },
  { name: 'Settings', href: '/settings', icon: <SettingsIcon />, description: 'Preferences' },
];

// Form for handling sign out functionality
function SignOutForm() {
  return (
    <form action={handleSignOut}>
      <button type="submit" className="p-1 rounded-full hover:bg-white/10 transition-all" title="Sign Out">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </form>
  );
}

type SidebarProps = {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  const userName = user?.name || 'User';
  const firstLetter = userName.charAt(0).toUpperCase();

  return (
    <div className={`flex flex-col ${collapsed ? 'w-16' : 'w-64 hd:w-72'} bg-[#111827] text-white h-screen overflow-hidden shadow-xl transition-all duration-300 border-r border-gray-800`}>
      {/* Logo and App Name */}
      <div className="py-5 px-4 border-b border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-white text-sm">FX</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">SwapPulse</h1>
              <p className="text-xs text-indigo-300">Financial Analytics</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700/50 transition-colors"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <polyline points="13 17 18 12 13 7"></polyline>
              <polyline points="6 17 11 12 6 7"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="18 17 13 12 18 7"></polyline>
            </svg>
          )}
        </button>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {!collapsed && (
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 px-3 mb-2">Main Navigation</p>
          )}
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                        : 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
                    }`}
                    title={collapsed ? item.name : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-100'}`}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="text-sm hd:text-base font-medium">{item.name}</span>
                      )}
                    </div>
                    
                    {!collapsed && isActive && item.description && (
                      <span className="text-xs text-indigo-200 bg-indigo-500/30 px-2 py-0.5 rounded-full">
                        {item.description}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        {!collapsed && (
          <div className="mt-8 px-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-gray-400">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input 
                type="text" 
                className="bg-gray-900/70 text-sm rounded-lg block w-full pl-10 pr-4 py-2 border border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-white"
                placeholder="Search..."
              />
            </div>
          </div>
        )}
      </nav>
      
      {/* QuantLib Banner - Only shown when sidebar is expanded */}
      {!collapsed && (
        <div className="mx-3 my-4 p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-lg">
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-indigo-400 mr-1">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span className="text-xs font-medium text-indigo-300">Powered by QuantLib</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">Advanced yield curve modeling with industry standard methods</p>
          <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-md transition-colors w-full">
            Documentation
          </button>
        </div>
      )}
      
      {/* User Profile */}
      <div className="mt-auto border-t border-gray-700/50 bg-gray-900/30 p-3">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} p-2 rounded-lg`}>
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
            <span className="font-semibold text-white text-sm">{firstLetter}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-100 text-sm truncate">{userName}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && <SignOutForm />}
        </div>
      </div>
    </div>
  );
}