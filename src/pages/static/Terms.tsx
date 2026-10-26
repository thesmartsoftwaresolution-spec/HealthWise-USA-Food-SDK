import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left">
      <div className="space-y-3">
        <span className="text-xs font-bold text-[#2D7D46] uppercase tracking-wider">Terms of Service</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C2B20]">
          Terms of Use
        </h1>
        <p className="text-sm text-[#5A7060]">Effective Date: October 2026</p>
      </div>

      <div className="bg-white border border-[#D4E6D9] rounded-3xl p-8 space-y-6 text-sm text-[#5A7060] leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20]">1. Agreement to Terms</h2>
          <p>
            By accessing or using HealthWise USA, you agree to be bound by these Terms of Use and our Medical Disclaimer. If you do not agree with any part of these terms, you may not use our services or AI tools.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20]">2. Appropriate Use of AI Tools</h2>
          <p>
            You agree to use our AI Wellness Assistant, Meal Planner, and Recipe Generator only for lawful educational purposes. You agree not to attempt prompt injection attacks, reverse engineer AI endpoints, or exceed our published hourly rate limits.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20]">3. Intellectual Property</h2>
          <p>
            All original editorial articles, photography, website branding, and proprietary meal compilation software belong to HealthWise USA. You may print recipes and meal plans for personal home use, but commercial redistribution or mass automated scraping without written consent is prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20]">4. Limitation of Liability</h2>
          <p>
            In no event shall HealthWise USA, its founders, medical reviewers, or software engineers be held liable for damages resulting from nutritional choices, ingredient allergies, culinary accidents, or reliance on information presented on this site.
          </p>
        </section>
      </div>
    </div>
  );
};
