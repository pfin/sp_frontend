import React, { ReactNode } from 'react';

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  noPadding?: boolean;
};

export default function Card({ title, children, className = '', footer, noPadding = false }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-card hover:shadow-card-hover border border-neutral-200 overflow-hidden transition-shadow ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
      {footer && (
        <div className="border-t border-neutral-200 px-5 py-4 bg-neutral-50">
          {footer}
        </div>
      )}
    </div>
  );
}