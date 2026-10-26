import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Button } from '../components/common/Button.tsx';
import { LogIn, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('sarah.johnson@example.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, switchUser } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await login(email);
    setIsSubmitting(false);
    if (ok) {
      showToast('Welcome back to HealthWise USA!', 'success');
      navigate('/dashboard');
    } else {
      showToast('Email or password is incorrect.', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-left space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] text-[#2D7D46] flex items-center justify-center mx-auto text-2xl border border-[#D4E6D9]">
          🌿
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1C2B20]">Sign In to HealthWise</h1>
        <p className="text-xs text-[#5A7060]">Access your saved recipes, customized meal plans, and habit streaks.</p>
      </div>

      {/* Demo Credentials Quick Box */}
      <div className="bg-[#E8F5EC] border border-[#D4E6D9] rounded-2xl p-4 text-xs space-y-2">
        <p className="font-bold text-[#1A5C31] uppercase tracking-wider">Quick Demo Login:</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              switchUser('user');
              navigate('/dashboard');
            }}
            className="p-2.5 bg-white rounded-xl border border-[#D4E6D9] hover:border-[#2D7D46] text-left transition"
          >
            <p className="font-bold text-[#1C2B20]">Sarah (User)</p>
            <p className="text-[11px] text-[#5A7060]">Regular Member</p>
          </button>
          <button
            type="button"
            onClick={() => {
              switchUser('admin');
              navigate('/admin');
            }}
            className="p-2.5 bg-white rounded-xl border border-[#D4E6D9] hover:border-[#2D7D46] text-left transition"
          >
            <p className="font-bold text-[#1C2B20]">Dr. Alex (Admin)</p>
            <p className="text-[11px] text-[#5A7060]">Full Editorial Access</p>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1C2B20]">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold uppercase tracking-wider text-[#1C2B20]">Password</label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to registered email.'); }} className="text-[#2D7D46] hover:underline">Forgot?</a>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
          />
        </div>

        <div className="pt-2">
          <Button variant="primary" size="lg" className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>

        <div className="text-center text-xs text-[#5A7060] pt-2">
          Don&rsquo;t have an account?{' '}
          <Link to="/register" className="font-bold text-[#2D7D46] hover:underline">
            Create free account
          </Link>
        </div>
      </form>
    </div>
  );
};
