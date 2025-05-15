import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Icons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd" />
  </svg>
);

const OpportunitiesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: <DashboardIcon /> },
  { name: 'Currency Pairs', href: '/currency-pairs', icon: <AnalyticsIcon /> },
  { name: 'Historical Data', href: '/historical', icon: <ChartIcon /> },
  { name: 'Opportunities', href: '/opportunities', icon: <OpportunitiesIcon /> },
  { name: 'Settings', href: '/settings', icon: <SettingsIcon /> },
];

// Form for handling sign out functionality
function SignOutForm() {
  return (
    <form action={async () => {
      'use server';
      await import('@/auth').then(({ signOut }) => signOut());
    }}>
      <button type="submit" className="text-xs text-primary-300 hover:text-primary-100">
        Sign Out
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
  
  const userName = user?.name || 'User';
  const firstLetter = userName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col w-64 bg-primary-900 text-white h-screen">
      <div className="p-4 border-b border-primary-800">
        <h1 className="text-2xl font-bold">SP Frontend</h1>
        <p className="text-sm text-primary-300">Currency Futures Arbitrage</p>
      </div>
      <nav className="flex-1 overflow-y-auto pt-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    isActive 
                      ? 'bg-primary-800 text-white' 
                      : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                  } transition-colors duration-150 rounded-md mx-2`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-primary-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
            <span className="font-bold">{firstLetter}</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">{userName}</p>
            <p className="text-xs text-primary-300">{user?.email}</p>
          </div>
          <SignOutForm />
        </div>
      </div>
    </div>
  );
}