import React, { ReactNode } from 'react';

type BadgeColor = 'primary' | 'secondary' | 'purple' | 'blue' | 'green' | 'red' | 'amber' | 'gray';

type BadgeProps = {
  children: ReactNode;
  color?: BadgeColor;
  className?: string;
};

export default function Badge({ children, color = 'primary', className = '' }: BadgeProps) {
  // Map color to background and text colors with updated styling
  const colorClasses: Record<BadgeColor, string> = {
    primary: 'bg-primary-100 text-primary-800 ring-1 ring-primary-200',
    secondary: 'bg-secondary-100 text-secondary-800 ring-1 ring-secondary-200',
    purple: 'bg-purple-100 text-purple-800 ring-1 ring-purple-200',
    blue: 'bg-blue-100 text-blue-800 ring-1 ring-blue-200',
    green: 'bg-green-100 text-green-800 ring-1 ring-green-200',
    red: 'bg-red-100 text-red-800 ring-1 ring-red-200',
    amber: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
    gray: 'bg-gray-100 text-gray-800 ring-1 ring-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
}