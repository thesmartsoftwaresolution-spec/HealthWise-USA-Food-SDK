import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left">
      <div className="space-y-3">
        <span className="text-xs font-bold text-[#2D7D46] uppercase tracking-wider">Privacy & Trust</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C2B20]">
          Privacy Policy (CCPA & GDPR Compliant)
        </h1>
        <p className="text-sm text-[#5A7060]">Effective Date: October 2026</p>
      </div>

      <div className="bg-white border border-[#D4E6D9] rounded-3xl p-8 space-y-6 text-sm text-[#5A7060] leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20]">1. Our Core Privacy Commitment</h2>
          <p>
            HealthWise USA respects your privacy. We strictly adhere to a data-minimization philosophy: we do not sell your personal or nutritional data to health insurance providers, pharmaceutical advertisers, or data brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20]">2. Information We Collect</h2>
          <p>We only collect data necessary to provide personalized features:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account Data:</strong> Name and email when you register.</li>
            <li><strong>Wellness Preferences:</strong> Dietary preferences (e.g. Vegetarian, High-Protein) to customize your meal plans.</li>
            <li><strong>Saved Items & Habit Logs:</strong> Recipes, articles, and daily habit checks stored in your personal dashboard.</li>
            <li><strong>Usage Logs:</strong> Anonymized query logs to prevent AI rate limit abuse and audit safety compliance.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20]">3. California Consumer Privacy Act (CCPA) Rights</h2>
          <p>
            Under the California Consumer Privacy Act (CCPA), California residents have the right to request access to their stored personal data, request deletion of their records, and opt out of any third-party disclosures. You can export your full data anytime directly from your Personal Dashboard via JSON export.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20]">4. Cookies & Local Storage</h2>
          <p>
            We use functional local storage to remember your dietary units (US vs. Metric) and active session tokens. We do not engage in invasive cross-site tracking.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20]">5. Contact Our Data Officer</h2>
          <p>
            If you have questions regarding your data privacy, email privacy@healthwiseusa.com or submit a request via our Contact page.
          </p>
        </section>
      </div>
    </div>
  );
};
