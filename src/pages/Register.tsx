import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Button } from '../components/common/Button.tsx';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(['High-Protein']);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const diets = ['High-Protein', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Low-Carb', 'Mediterranean'];

  const toggleDiet = (d: string) => {
    setDietaryPrefs((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please enter your name and email.', 'error');
      return;
    }
    setIsSubmitting(true);
    const result = await register(name, email, password, dietaryPrefs, newsletterOptIn);
    setIsSubmitting(false);
    if (result.success && result.needsEmailConfirmation) {
      showToast('Account created. Check your email to confirm it, then sign in.', 'success');
      navigate('/login');
    } else if (result.success) {
      showToast('Account created successfully! Welcome to HealthWise USA.', 'success');
      navigate('/dashboard');
    } else {
      showToast('Could not create account. Check your details and password, or try another email.', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-left space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] text-[#2D7D46] flex items-center justify-center mx-auto text-2xl border border-[#D4E6D9]">
          🌿
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1C2B20]">Join HealthWise USA</h1>
        <p className="text-xs text-[#5A7060]">Free access to personalized AI meal planning and habit tracking.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1C2B20]">Full Name</label>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Sarah Johnson"
            className="w-full px-4 py-2.5 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1C2B20]">Email Address</label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="sarah@example.com"
            className="w-full px-4 py-2.5 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1C2B20]">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="w-full px-4 py-2.5 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
          />
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1C2B20]">
            Primary Dietary Lifestyles (Optional):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {diets.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDiet(d)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                  dietaryPrefs.includes(d) ? 'bg-[#2D7D46] text-white border-[#2D7D46]' : 'bg-[#F4F8F5] text-[#1C2B20] border-[#D4E6D9]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="newsletter"
            checked={newsletterOptIn}
            onChange={(e) => setNewsletterOptIn(e.target.checked)}
            className="rounded accent-[#2D7D46]"
          />
          <label htmlFor="newsletter" className="text-xs text-[#5A7060]">
            Send me weekly healthy recipes and evidence-based nutrition tips.
          </label>
        </div>

        <div className="pt-2">
          <Button variant="primary" size="lg" className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
          </Button>
        </div>

        <div className="text-center text-xs text-[#5A7060] pt-2">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#2D7D46] hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};
