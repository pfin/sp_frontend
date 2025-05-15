import React, { ReactNode } from 'react';

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
};

export default function Card({ title, children, className = '', footer }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden ${className}`}>
      {title && (
        <div className="border-b border-neutral-200 px-4 py-3 bg-neutral-50">
          <h3 className="text-sm font-medium text-neutral-700">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && <div className="border-t border-neutral-200 px-4 py-3 bg-neutral-50">{footer}</div>}
    </div>
  );
}