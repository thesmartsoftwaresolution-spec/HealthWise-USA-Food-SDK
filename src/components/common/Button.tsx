import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px] font-semibold'
  };

  const variantClasses = {
    primary:
      'bg-[#2D7D46] hover:bg-[#1A5C31] text-white shadow-sm focus:ring-[#2D7D46] border border-transparent',
    secondary:
      'bg-transparent hover:bg-[#E8F5EC] text-[#2D7D46] border-2 border-[#2D7D46] focus:ring-[#2D7D46]',
    accent:
      'bg-[#E07B39] hover:bg-[#C96628] text-white shadow-sm focus:ring-[#E07B39] border border-transparent',
    ghost:
      'bg-transparent hover:bg-black/5 text-[#1C2B20] focus:ring-black/20 border border-transparent',
    danger:
      'bg-[#C0392B] hover:bg-[#962D22] text-white focus:ring-[#C0392B] border border-transparent'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
