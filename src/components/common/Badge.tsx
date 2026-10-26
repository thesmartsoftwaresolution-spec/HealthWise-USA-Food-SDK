import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'category' | 'vegetarian' | 'vegan' | 'glutenFree' | 'highProtein' | 'budget' | 'quick' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'category',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold'
  };

  const variantClasses = {
    category: 'bg-[#E8F5EC] text-[#2D7D46] border border-[#D4E6D9]',
    vegetarian: 'bg-[#E8F5EC] text-[#1A5C31] border border-[#C5E1CD]',
    vegan: 'bg-[#D2ECD9] text-[#144726] border border-[#B0DABB]',
    glutenFree: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]',
    highProtein: 'bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]',
    budget: 'bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]',
    quick: 'bg-[#FFEDD5] text-[#C2410C] border border-[#FED7AA]',
    neutral: 'bg-white text-[#5A7060] border border-[#D4E6D9]'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide uppercase font-sans ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
