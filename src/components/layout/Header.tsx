'use client';

import React from 'react';
import Link from 'next/link';

type BreadcrumbItem = {
  name: string;
  href: string;
  current: boolean;
};

type HeaderProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  tabs?: {
    name: string;
    href: string;
    current: boolean;
    count?: number;
  }[];
  showQuantLibBadge?: boolean;
};

export default function Header({ 
  title, 
  subtitle, 
  breadcrumbs, 
  actions,
  tabs,
  showQuantLibBadge = false
}: HeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs navigation */}
      {breadcrumbs && (
        <nav className="flex mb-2" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 text-xs text-gray-500">
            <li className="flex items-center">
              <Link href="/" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </Link>
            </li>
            
            {breadcrumbs.map((item, index) => (
              <li key={item.name} className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-gray-400 mx-1">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                <Link
                  href={item.href}
                  className={`${
                    item.current
                      ? 'text-indigo-600 font-medium'
                      : 'text-gray-600 hover:text-indigo-600'
                  } transition-colors`}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      {/* Header with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight truncate">
              {title}
            </h1>
            
            {showQuantLibBadge && (
              <div className="ml-3 flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5 mr-1 text-indigo-500">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  QuantLib
                </span>
              </div>
            )}
          </div>
          
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex-shrink-0 flex items-center mt-2 sm:mt-0 gap-2">
            {actions}
          </div>
        )}
      </div>
      
      {/* Optional tabs */}
      {tabs && (
        <div className="border-b border-gray-200 mt-4">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm 
                  ${tab.current
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } transition-colors
                `}
                aria-current={tab.current ? 'page' : undefined}
              >
                {tab.name}
                {tab.count !== undefined && (
                  <span
                    className={`ml-2 py-0.5 px-2 rounded-full text-xs font-medium ${
                      tab.current
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
      
      {/* Bottom indicators - visible on all screen sizes */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        {showQuantLibBadge && (
          <div className="flex items-center px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
            Market Data Connected
          </div>
        )}
        
        <div className="flex items-center px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5 mr-1 text-gray-500">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Last updated: <span className="font-medium ml-1">Just now</span>
        </div>
        
        {showQuantLibBadge && (
          <div className="flex items-center px-2 py-1 bg-indigo-50 rounded-lg text-xs text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5 mr-1">
              <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"></path>
              <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2"></path>
              <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"></path>
              <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"></path>
              <path d="M8.65 22c.21-.66.45-1.32.57-2"></path>
              <path d="M14 13.12c0 2.38 0 6.38-1 8.88"></path>
              <path d="M2 16h.01"></path>
              <path d="M21.8 16c.2-2 .131-5.354 0-6"></path>
              <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2"></path>
            </svg>
            QuantLib v1.30
          </div>
        )}
      </div>
    </div>
  );
}