import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { auth } from '@/auth';

type MainLayoutProps = {
  children: ReactNode;
};

export default async function MainLayout({ children }: MainLayoutProps) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto p-6 lg:p-8 hd:p-10">
        <div className="max-w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}