import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { auth, signOut } from '@/auth';

type MainLayoutProps = {
  children: ReactNode;
};

export default async function MainLayout({ children }: MainLayoutProps) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}