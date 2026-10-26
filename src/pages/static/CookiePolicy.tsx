import React from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookiePolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left">
      <div className="space-y-3">
        <span className="text-xs font-bold text-[#2D7D46] uppercase tracking-wider">Privacy & Compliance</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C2B20]">
          Cookie & Local Storage Policy
        </h1>
        <p className="text-xs text-[#5A7060]">Effective Date: October 2026 • Compliant with CCPA and US Privacy Standards</p>
      </div>

      <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs leading-relaxed text-sm text-[#1C2B20]">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20] flex items-center gap-2">
            <Cookie className="w-5 h-5 text-[#E07B39]" /> 1. What Are Cookies and Local Storage?
          </h2>
          <p className="text-[#5A7060]">
            Cookies and HTML5 browser LocalStorage are small data packets stored securely in your web browser. <strong>HealthWise USA</strong> uses these technologies exclusively to remember your wellness preferences (such as your chosen measurement units—US Imperial vs. Metric, your bookmarked recipes, your habit streak records, and your active meal plan).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20]">2. Categories of Storage We Use</h2>
          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl border border-[#D4E6D9] bg-[#F4F8F5]">
              <p className="font-bold text-[#1C2B20]">Strictly Essential Storage</p>
              <p className="text-xs text-[#5A7060] mt-0.5">
                Required for core website navigation, authentication tokens, security rate-limiting on API endpoints, and keeping you logged in between browser tabs.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-[#D4E6D9] bg-[#F4F8F5]">
              <p className="font-bold text-[#1C2B20]">Functional Preferences</p>
              <p className="text-xs text-[#5A7060] mt-0.5">
                Saves your dietary filters (e.g., vegetarian, gluten-free), custom servings multipliers on recipes, and measurement unit choices (cups/ounces vs. grams/milliliters).
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-[#D4E6D9] bg-[#F4F8F5]">
              <p className="font-bold text-[#1C2B20]">Aggregated Analytics</p>
              <p className="text-xs text-[#5A7060] mt-0.5">
                Anonymized metrics on article pageviews and recipe popularities to help our registered dietitians craft content that answers everyday American health questions.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20]">3. Managing Your Preferences</h2>
          <p className="text-[#5A7060]">
            You have full autonomy over your data. You may reset or clear your cached browser storage at any time via your browser settings or export your personal dashboard data via the <Link to="/dashboard" className="text-[#2D7D46] font-semibold underline">Account Settings</Link> tab.
          </p>
        </section>
      </div>
    </div>
  );
};
