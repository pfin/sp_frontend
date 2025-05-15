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
};

export default function Header({ title, subtitle, breadcrumbs }: HeaderProps) {
  return (
    <div className="border-b border-neutral-200 pb-5 mb-6">
      {breadcrumbs && (
        <nav className="flex mb-3" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 text-sm">
            <li>
              <Link href="/" className="text-neutral-500 hover:text-primary-600">
                Dashboard
              </Link>
            </li>
            
            {breadcrumbs.map((item, index) => (
              <li key={item.name}>
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link
                    href={item.href}
                    className={`ml-1 ${
                      item.current
                        ? 'text-primary-600 font-medium'
                        : 'text-neutral-500 hover:text-primary-600'
                    }`}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 leading-tight">{title}</h1>
          {subtitle && <p className="text-neutral-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}