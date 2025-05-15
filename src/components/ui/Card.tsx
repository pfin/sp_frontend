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
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  accentColor?: 'primary' | 'indigo' | 'blue' | 'gray' | 'green' | 'red';
};

export default function Card({ 
  title, 
  subtitle, 
  children, 
  className = '', 
  footer, 
  noPadding = false, 
  headerAction,
  compact = false,
  variant = 'default',
  accentColor
}: CardProps) {
  const paddingClass = noPadding 
    ? '' 
    : compact 
      ? 'p-4 hd:p-5' 
      : 'p-5 hd:p-6';
      
  // Variant styling
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg border-0',
    outlined: 'bg-white border-2 border-gray-200',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20'
  };
  
  // Accent color styling
  const getAccentStyles = () => {
    if (!accentColor) return '';
    
    const accentColors = {
      primary: 'border-l-4 border-l-purple-500',
      indigo: 'border-l-4 border-l-indigo-500',
      blue: 'border-l-4 border-l-blue-500',
      gray: 'border-l-4 border-l-gray-500',
      green: 'border-l-4 border-l-emerald-500',
      red: 'border-l-4 border-l-red-500'
    };
    
    return accentColors[accentColor];
  };

  // Header styling based on variant
  const getHeaderStyles = () => {
    if (variant === 'glass') {
      return 'border-b border-gray-200/50 bg-gray-50/50';
    }
    return 'border-b border-gray-200 bg-gray-50/80';
  };

  return (
    <div className={`rounded-xl ${variantClasses[variant]} ${getAccentStyles()} overflow-hidden transition-all duration-300 ${className}`}>
      {title && (
        <div className={`${compact ? 'p-4 hd:p-5' : 'p-5 hd:p-6'} ${getHeaderStyles()} flex items-center justify-between`}>
          <div>
            <h3 className="text-base font-medium text-gray-800 flex items-center">
              {accentColor && (
                <span className={`w-2 h-2 rounded-full bg-${accentColor === 'primary' ? 'purple' : accentColor}-500 mr-2`}></span>
              )}
              {title}
            </h3>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {headerAction && (
            <div className="ml-4 flex-shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className={paddingClass}>{children}</div>
      {footer && (
        <div className={`border-t border-gray-200 ${compact ? 'p-4 hd:p-5' : 'p-5 hd:p-6'} ${variant === 'glass' ? 'bg-gray-50/30' : 'bg-gray-50'}`}>
          {footer}
        </div>
      )}
    </div>
  );
}