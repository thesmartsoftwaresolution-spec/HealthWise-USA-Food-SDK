import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Button } from '../components/common/Button.tsx';
import { isSupabaseConfigured } from '../lib/supabase.ts';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      showToast('Supabase is not configured yet. Add the required environment variables.', 'error');
      return;
    }
    setIsSubmitting(true);
    const ok = await login(email, password);
    setIsSubmitting(false);
    if (ok) {
      showToast('Welcome back to HealthWise USA!', 'success');
      navigate('/dashboard');
    } else {
      showToast('Sign-in failed. Check your email and password, and confirm your email if required.', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-left space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] text-[#2D7D46] flex items-center justify-center mx-auto text-2xl border border-[#D4E6D9]">🌿</div>
        <h1 className="font-serif text-3xl font-bold text-[#1C2B20]">Sign In to HealthWise</h1>
        <p className="text-xs text-[#5A7060]">Access your saved recipes, customized meal plans, and habit streaks.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#1C2B20]">Email Address</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
            className="w-full px-4 py-2.5 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]" />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="password" className="font-bold uppercase tracking-wider text-[#1C2B20]">Password</label>
            <Link to="/reset-password" className="text-[#2D7D46] hover:underline">Forgot?</Link>
          </div>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
            className="w-full px-4 py-2.5 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]" />
        </div>
        <div className="pt-2">
          <Button variant="primary" size="lg" className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>
        <div className="text-center text-xs text-[#5A7060] pt-2">
          Don&rsquo;t have an account?{' '}
          <Link to="/register" className="font-bold text-[#2D7D46] hover:underline">Create free account</Link>
        </div>
      </form>
    </div>
  );
};
