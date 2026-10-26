import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Utensils, Sparkles, User as UserIcon } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Tips', path: '/health-tips', icon: BookOpen },
    { label: 'Recipes', path: '/recipes', icon: Utensils },
    { label: 'AI Tools', path: '/ai-tools', icon: Sparkles },
    { label: 'You', path: '/dashboard', icon: UserIcon }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D4E6D9] pb-safe"
      aria-label="Mobile Navigation Bar"
    >
      <div className="grid grid-cols-5 h-16 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                active ? 'text-[#2D7D46] font-semibold' : 'text-[#5A7060] hover:text-[#1C2B20]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'scale-110 text-[#2D7D46]' : ''} transition-transform`} />
                {item.label === 'AI Tools' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E07B39]" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
