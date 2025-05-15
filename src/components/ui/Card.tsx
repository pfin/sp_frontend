import React, { ReactNode } from 'react';

type CardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  noPadding?: boolean;
  headerAction?: ReactNode;
  compact?: boolean;
};

export default function Card({ 
  title, 
  subtitle, 
  children, 
  className = '', 
  footer, 
  noPadding = false, 
  headerAction, 
  compact = false 
}: CardProps) {
  const paddingClass = noPadding 
    ? '' 
    : compact 
      ? 'p-3 md:p-4' 
      : 'p-4 md:p-5 lg:p-6';

  return (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow border border-neutral-100 overflow-hidden transition-shadow ${className}`}>
      {title && (
        <div className={`${compact ? 'px-3 py-2 md:px-4 md:py-3' : 'px-4 py-3 md:px-5 md:py-4'} border-b border-neutral-100 bg-neutral-50 flex items-center justify-between`}>
          <div>
            <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
            {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && (
            <div className="ml-4">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className={paddingClass}>{children}</div>
      {footer && (
        <div className={`border-t border-neutral-100 ${compact ? 'px-3 py-2 md:px-4 md:py-3' : 'px-4 py-3 md:px-5 md:py-4'} bg-neutral-50`}>
          {footer}
        </div>
      )}
    </div>
  );
}