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
    <div className="flex h-screen bg-neutral-50">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto p-4 md:p-5 lg:p-6 xl:p-8 2xl:max-w-[1600px] 2xl:mx-auto">
        <div className="max-w-screen-2xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}