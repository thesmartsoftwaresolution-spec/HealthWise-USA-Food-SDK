import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { SearchBar } from '../common/SearchBar.tsx';
import {
  Sparkles,
  BookOpen,
  Utensils,
  User as UserIcon,
  ShieldAlert,
  ChevronDown,
  LogOut,
  Sliders,
  Bookmark,
  CalendarDays,
  Menu,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, switchUser, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D4E6D9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] flex items-center justify-center border border-[#D4E6D9] group-hover:scale-105 transition-transform">
            <span className="text-2xl" role="img" aria-label="Sprout leaf">🌿</span>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#1C2B20] group-hover:text-[#2D7D46] transition-colors">
              HealthWise <span className="text-[#2D7D46]">USA</span>
            </span>
            <span className="hidden sm:block text-[10px] tracking-wider uppercase font-semibold text-[#5A7060] -mt-1">
              Evidence-Based Nutrition
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <Link
            to="/health-tips"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/health-tips')
                ? 'bg-[#E8F5EC] text-[#2D7D46] font-semibold'
                : 'text-[#1C2B20] hover:text-[#2D7D46] hover:bg-[#F4F8F5]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#2D7D46]" />
            <span>Health Tips</span>
          </Link>

          <Link
            to="/recipes"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/recipes')
                ? 'bg-[#E8F5EC] text-[#2D7D46] font-semibold'
                : 'text-[#1C2B20] hover:text-[#2D7D46] hover:bg-[#F4F8F5]'
            }`}
          >
            <Utensils className="w-4 h-4 text-[#E07B39]" />
            <span>Recipes</span>
          </Link>

          <Link
            to="/ai-tools"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/ai-tools')
                ? 'bg-[#E8F5EC] text-[#2D7D46] font-semibold'
                : 'text-[#1C2B20] hover:text-[#2D7D46] hover:bg-[#F4F8F5]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#2D7D46]" />
            <span>AI Wellness Hub</span>
            <span className="text-[10px] bg-[#E07B39] text-white font-bold px-1.5 py-0.2 rounded-full">
              New
            </span>
          </Link>
        </nav>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden lg:block w-72">
          <SearchBar />
        </div>

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search toggle button for mobile/tablet */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden p-2 rounded-lg text-[#1C2B20] hover:bg-[#E8F5EC] transition"
            aria-label="Toggle search bar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* User Account / Role switcher */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-[#D4E6D9] hover:border-[#2D7D46] bg-white transition shadow-xs"
                aria-expanded={isUserDropdownOpen}
                aria-label="User profile menu"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#D4E6D9]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#E8F5EC] text-[#2D7D46] flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-semibold text-[#1C2B20] max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#5A7060]" />
              </button>

              {isUserDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#D4E6D9] py-2 z-50 divide-y divide-[#D4E6D9]/50 animate-in fade-in"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5">
                    <p className="text-xs text-[#5A7060]">Signed in as</p>
                    <p className="text-sm font-bold text-[#1C2B20] truncate">{user.name}</p>
                    <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#E8F5EC] text-[#2D7D46] uppercase">
                      {user.role} role
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1C2B20] hover:bg-[#E8F5EC] transition"
                    >
                      <UserIcon className="w-4 h-4 text-[#2D7D46]" />
                      <span>My Dashboard</span>
                    </Link>
                    <Link
                      to="/dashboard#saved"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1C2B20] hover:bg-[#E8F5EC] transition"
                    >
                      <Bookmark className="w-4 h-4 text-[#2D7D46]" />
                      <span>Saved Recipes & Articles</span>
                    </Link>
                    <Link
                      to="/dashboard#plans"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1C2B20] hover:bg-[#E8F5EC] transition"
                    >
                      <CalendarDays className="w-4 h-4 text-[#2D7D46]" />
                      <span>My Meal Plans</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-[#C0392B] hover:bg-red-50 transition"
                      >
                        <ShieldAlert className="w-4 h-4 text-[#C0392B]" />
                        <span>Admin Control Panel</span>
                      </Link>
                    )}
                  </div>

                  {/* Quick Persona Switcher for effortless testing */}
                  <div className="px-4 py-2 bg-[#F4F8F5]">
                    <p className="text-[11px] font-semibold text-[#5A7060] uppercase mb-1.5 flex items-center gap-1">
                      <Sliders className="w-3 h-3" />
                      <span>Quick Role Switch</span>
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          switchUser('user');
                          setIsUserDropdownOpen(false);
                        }}
                        className={`text-xs px-2 py-1 rounded-md font-medium transition ${
                          user.role === 'user' ? 'bg-[#2D7D46] text-white' : 'bg-white border text-[#1C2B20]'
                        }`}
                      >
                        Sarah (User)
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          switchUser('admin');
                          setIsUserDropdownOpen(false);
                        }}
                        className={`text-xs px-2 py-1 rounded-md font-medium transition ${
                          user.role === 'admin' ? 'bg-[#2D7D46] text-white' : 'bg-white border text-[#1C2B20]'
                        }`}
                      >
                        Dr. Alex (Admin)
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          switchUser('guest');
                          setIsUserDropdownOpen(false);
                        }}
                        className="text-xs px-2 py-1 rounded-md font-medium bg-white border text-[#1C2B20] hover:bg-gray-100"
                      >
                        Guest
                      </button>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#C0392B] hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4 text-[#C0392B]" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-semibold text-[#2D7D46] hover:text-[#1A5C31] px-3 py-2 rounded-lg transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold bg-[#2D7D46] hover:bg-[#1A5C31] text-white px-4 py-2.5 rounded-lg shadow-xs transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#1C2B20] hover:bg-[#E8F5EC] transition"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet expanded search bar */}
      {isSearchOpen && (
        <div className="lg:hidden px-4 pb-3 pt-1 border-t border-[#D4E6D9]/60 bg-[#F4F8F5]">
          <SearchBar onSelect={() => setIsSearchOpen(false)} autoFocus />
        </div>
      )}

      {/* Mobile Full Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#D4E6D9] bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-150">
          <div className="space-y-1">
            <Link
              to="/health-tips"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-[#E8F5EC] text-[#1C2B20]"
            >
              <BookOpen className="w-5 h-5 text-[#2D7D46]" />
              <span>Health Tips & Articles</span>
            </Link>
            <Link
              to="/recipes"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-[#E8F5EC] text-[#1C2B20]"
            >
              <Utensils className="w-5 h-5 text-[#E07B39]" />
              <span>Healthy Recipes</span>
            </Link>
            <Link
              to="/ai-tools"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-[#E8F5EC] text-[#1C2B20]"
            >
              <Sparkles className="w-5 h-5 text-[#2D7D46]" />
              <span>AI Wellness Hub (5 Tools)</span>
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-[#E8F5EC] text-[#1C2B20]"
            >
              <UserIcon className="w-5 h-5 text-[#2D7D46]" />
              <span>Personal Dashboard</span>
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[#C0392B] hover:bg-red-50"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>Admin Control Panel</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
