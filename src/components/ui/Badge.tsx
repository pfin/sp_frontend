import React, { ReactNode } from 'react';

type BadgeColor = 
  | 'primary' 
  | 'secondary' 
  | 'indigo' 
  | 'blue' 
  | 'green' 
  | 'red' 
  | 'amber' 
  | 'gray' 
  | 'dark'
  | 'white'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
type BadgeVariant = 'default' | 'soft' | 'outlined' | 'dot';

type BadgeProps = {
  children: ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  variant?: BadgeVariant;
  className?: string;
  icon?: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
};

export default function Badge({ 
  children, 
  color = 'primary', 
  size = 'md', 
  variant = 'default',
  className = '',
  icon,
  removable = false,
  onRemove
}: BadgeProps) {

  // Helper function to determine style based on variant and color
  const getVariantStyle = () => {
    const styles: Record<BadgeVariant, Record<BadgeColor, string>> = {
      default: {
        primary: 'bg-purple-500 text-white',
        secondary: 'bg-pink-500 text-white',
        indigo: 'bg-indigo-500 text-white',
        blue: 'bg-blue-500 text-white',
        green: 'bg-emerald-500 text-white',
        red: 'bg-red-500 text-white',
        amber: 'bg-amber-500 text-white',
        gray: 'bg-gray-500 text-white',
        dark: 'bg-gray-800 text-white',
        white: 'bg-white text-gray-800 border border-gray-200',
        success: 'bg-emerald-500 text-white',
        warning: 'bg-amber-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white'
      },
      soft: {
        primary: 'bg-purple-100 text-purple-800',
        secondary: 'bg-pink-100 text-pink-800',
        indigo: 'bg-indigo-100 text-indigo-800',
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-emerald-100 text-emerald-800',
        red: 'bg-red-100 text-red-800',
        amber: 'bg-amber-100 text-amber-800',
        gray: 'bg-gray-100 text-gray-800',
        dark: 'bg-gray-200 text-gray-800',
        white: 'bg-white text-gray-800 border border-gray-100',
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-amber-100 text-amber-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800'
      },
      outlined: {
        primary: 'bg-transparent text-purple-600 border border-purple-500',
        secondary: 'bg-transparent text-pink-600 border border-pink-500',
        indigo: 'bg-transparent text-indigo-600 border border-indigo-500',
        blue: 'bg-transparent text-blue-600 border border-blue-500',
        green: 'bg-transparent text-emerald-600 border border-emerald-500',
        red: 'bg-transparent text-red-600 border border-red-500',
        amber: 'bg-transparent text-amber-600 border border-amber-500',
        gray: 'bg-transparent text-gray-600 border border-gray-500',
        dark: 'bg-transparent text-gray-800 border border-gray-700',
        white: 'bg-transparent text-gray-700 border border-gray-300',
        success: 'bg-transparent text-emerald-600 border border-emerald-500',
        warning: 'bg-transparent text-amber-600 border border-amber-500',
        error: 'bg-transparent text-red-600 border border-red-500',
        info: 'bg-transparent text-blue-600 border border-blue-500'
      },
      dot: {
        primary: 'bg-white text-gray-700 border border-gray-200 pl-6',
        secondary: 'bg-white text-gray-700 border border-gray-200 pl-6',
        indigo: 'bg-white text-gray-700 border border-gray-200 pl-6',
        blue: 'bg-white text-gray-700 border border-gray-200 pl-6',
        green: 'bg-white text-gray-700 border border-gray-200 pl-6',
        red: 'bg-white text-gray-700 border border-gray-200 pl-6',
        amber: 'bg-white text-gray-700 border border-gray-200 pl-6',
        gray: 'bg-white text-gray-700 border border-gray-200 pl-6',
        dark: 'bg-white text-gray-700 border border-gray-200 pl-6',
        white: 'bg-gray-100 text-gray-700 border border-gray-200 pl-6',
        success: 'bg-white text-gray-700 border border-gray-200 pl-6',
        warning: 'bg-white text-gray-700 border border-gray-200 pl-6',
        error: 'bg-white text-gray-700 border border-gray-200 pl-6',
        info: 'bg-white text-gray-700 border border-gray-200 pl-6'
      }
    };
    
    return styles[variant][color];
  };
  
  // Size classes
  const sizeClasses: Record<BadgeSize, string> = {
    xs: 'text-xs px-1.5 py-0.5 rounded',
    sm: 'text-xs px-2 py-0.5 rounded-md',
    md: 'text-sm px-2.5 py-0.5 rounded-md',
    lg: 'text-sm px-3 py-1 rounded-md'
  };
  
  // Determine dot color for dot variant
  const getDotColor = () => {
    const dotColors: Record<BadgeColor, string> = {
      primary: 'bg-purple-500',
      secondary: 'bg-pink-500',
      indigo: 'bg-indigo-500',
      blue: 'bg-blue-500',
      green: 'bg-emerald-500',
      red: 'bg-red-500',
      amber: 'bg-amber-500',
      gray: 'bg-gray-500',
      dark: 'bg-gray-800',
      white: 'bg-gray-400',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      error: 'bg-red-500',
      info: 'bg-blue-500'
    };
    
    return dotColors[color];
  };

  return (
    <span
      className={`inline-flex items-center font-medium ${sizeClasses[size]} ${getVariantStyle()} ${className} transition-all duration-150`}
    >
      {variant === 'dot' && (
        <span className={`absolute w-2 h-2 ${getDotColor()} rounded-full left-2`}></span>
      )}
      
      {icon && (
        <span className="mr-1 -ml-0.5">{icon}</span>
      )}
      
      {children}
      
      {removable && (
        <button 
          onClick={onRemove}
          className="ml-1.5 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </span>
  );
}