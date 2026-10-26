import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useApp();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' })
      });
      const data = await res.json();
      if (data.success) {
        setIsSubscribed(true);
        showToast('Welcome to HealthWise USA! Check your inbox for your free welcome guide.', 'success');
      }
    } catch {
      showToast('Subscription failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#1C2B20] text-[#E8F5EC] border-t border-[#2D7D46]/30 pb-20 md:pb-12 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#2D7D46] flex items-center justify-center border border-[#E8F5EC]/20">
                <span className="text-2xl" role="img" aria-label="Sprout leaf">🌿</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                HealthWise <span className="text-[#84D49B]">USA</span>
              </span>
            </Link>
            <p className="text-sm text-[#E8F5EC]/80 leading-relaxed max-w-sm">
              Real food, real health — made simple for everyday Americans. We deliver evidence-based wellness guidance, budget-friendly nutritious recipes, and AI-powered meal planning tools grounded in peer-reviewed science.
            </p>

            {/* Newsletter Box */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#84D49B] mb-2">
                Join 10,000+ Americans Eating Healthier
              </p>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-sm text-[#84D49B] bg-[#2D7D46]/30 p-3 rounded-xl border border-[#2D7D46]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You&rsquo;re subscribed! Check your inbox for weekly recipe roundups.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="flex-1 px-3.5 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-[#84D49B] focus:ring-1 focus:ring-[#84D49B]"
                    aria-label="Email address for newsletter"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2.5 bg-[#E07B39] hover:bg-[#C96628] text-white text-sm font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Joining...' : 'Subscribe'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Health Content Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#84D49B] mb-4">
              Health Articles
            </h4>
            <ul className="space-y-2.5 text-sm text-[#E8F5EC]/80">
              <li>
                <Link to="/health-tips?category=nutrition" className="hover:text-white transition">
                  Nutrition & Whole Foods
                </Link>
              </li>
              <li>
                <Link to="/health-tips?category=heart-health" className="hover:text-white transition">
                  Heart & Blood Pressure
                </Link>
              </li>
              <li>
                <Link to="/health-tips?category=fitness" className="hover:text-white transition">
                  Fitness & Movement
                </Link>
              </li>
              <li>
                <Link to="/health-tips?category=sleep" className="hover:text-white transition">
                  Sleep & Recovery
                </Link>
              </li>
              <li>
                <Link to="/health-tips?category=stress" className="hover:text-white transition">
                  Stress & Gut Health
                </Link>
              </li>
              <li>
                <Link to="/health-tips?category=weight" className="hover:text-white transition">
                  Metabolic Health & Weight
                </Link>
              </li>
            </ul>
          </div>

          {/* Recipes & AI Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#84D49B] mb-4">
              Recipes & AI Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-[#E8F5EC]/80">
              <li>
                <Link to="/recipes?category=healthy-breakfast" className="hover:text-white transition">
                  Healthy Breakfast
                </Link>
              </li>
              <li>
                <Link to="/recipes?category=budget-meals" className="hover:text-white transition">
                  Budget Meals Under $3
                </Link>
              </li>
              <li>
                <Link to="/recipes?category=quick-meals" className="hover:text-white transition">
                  Quick Dinners &lt;30 Min
                </Link>
              </li>
              <li>
                <Link to="/ai-tools/meal-planner" className="hover:text-[#E07B39] font-medium transition">
                  AI 7-Day Meal Planner
                </Link>
              </li>
              <li>
                <Link to="/ai-tools/chat" className="hover:text-[#E07B39] font-medium transition">
                  AI Wellness Assistant
                </Link>
              </li>
              <li>
                <Link to="/ai-tools/recipe" className="hover:text-[#E07B39] font-medium transition">
                  AI Recipe Generator
                </Link>
              </li>
              <li>
                <Link to="/ai-tools/nutrition" className="hover:text-[#E07B39] font-medium transition">
                  AI Nutrition Analyzer
                </Link>
              </li>
              <li>
                <Link to="/ai-tools/grocery" className="hover:text-[#E07B39] font-medium transition">
                  AI Grocery List Organizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust, Legal & Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#84D49B] mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-[#E8F5EC]/80">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About HealthWise USA
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact & Editorial Feedback
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-white transition font-medium text-[#E07B39]">
                  Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy (CCPA)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-white transition">
                  Cookie & LocalStorage Policy
                </Link>
              </li>
              <li>
                <Link to="/affiliate-disclosure" className="hover:text-white transition">
                  Affiliate Disclosure (FTC)
                </Link>
              </li>
              <li>
                <Link to="/about#editorial" className="hover:text-white transition">
                  Editorial & Corrections Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Required Medical & Nutrition Disclaimer Box */}
        <div className="bg-[#121E16] border border-[#2D7D46]/40 rounded-2xl p-6 text-xs text-[#E8F5EC]/70 leading-relaxed mb-8">
          <p className="font-bold text-[#84D49B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span role="img" aria-label="Warning sign">⚠️</span>
            <span>Important Medical & Nutrition Disclaimer</span>
          </p>
          <p>
            The content, AI wellness tools, meal plans, and recipe recommendations provided by <strong>HealthWise USA</strong> are designed strictly for educational and informational purposes. They are not intended as medical advice, clinical diagnosis, or individualized treatment plans. Always consult with a board-certified physician, registered dietitian, or qualified healthcare professional before adopting major nutritional adjustments, fasting regimens, or strenuous physical training. If you suspect an emergency medical condition, dial 911 immediately.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8F5EC]/60">
          <p>&copy; 2026 HealthWise USA. All rights reserved. Built for everyday American wellness.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/disclaimer" className="hover:underline">Medical Disclaimer</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
