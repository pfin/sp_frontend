import React from 'react';

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="border-b border-neutral-200 pb-4 mb-6">
      <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
      {subtitle && <p className="text-neutral-500 mt-1">{subtitle}</p>}
    </div>
  );
}