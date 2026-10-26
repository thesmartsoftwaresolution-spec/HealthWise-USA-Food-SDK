import React from 'react';
import { DollarSign, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AffiliateDisclosure: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left">
      <div className="space-y-3">
        <span className="text-xs font-bold text-[#E07B39] uppercase tracking-wider">FTC Transparency</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C2B20]">
          Affiliate & Advertising Disclosure
        </h1>
        <p className="text-xs text-[#5A7060]">In compliance with Federal Trade Commission (FTC) Guides (16 CFR Part 255)</p>
      </div>

      <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs leading-relaxed text-sm text-[#1C2B20]">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20] flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#2D7D46]" /> 1. Overview of Affiliate Partnerships
          </h2>
          <p className="text-[#5A7060]">
            HealthWise USA is committed to providing free, high-quality, evidence-grounded nutritional guidance and affordable recipes to everyday American households. To sustain our editorial staff, recipe testing kitchen, and server infrastructure, we participate in selective affiliate marketing programs.
          </p>
          <p className="text-[#5A7060]">
            When you click on certain product links (such as recommended kitchen cookware, cast-iron skillets, glass storage containers, or grocery delivery staples) and make a purchase, HealthWise USA may earn a modest commission at <strong>no additional cost to you</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#2D7D46]" /> 2. Editorial Independence Guarantee
          </h2>
          <p className="text-[#5A7060]">
            Our editorial integrity is strictly separated from our commercial operations. We operate under three non-negotiable principles:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5A7060] pt-1">
            <li><strong>No Paid Positive Reviews:</strong> We never accept monetary compensation in exchange for a favorable product or recipe review.</li>
            <li><strong>Evidence-First Verification:</strong> Nutritional health claims must cite peer-reviewed clinical cohorts, CDC, USDA, or NIH benchmarks regardless of affiliate relationships.</li>
            <li><strong>Clear Disclosure:</strong> Any article or recipe featuring affiliate links or sponsored placements carries an explicit disclosure tag.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1C2B20]">3. Questions & Feedback</h2>
          <p className="text-[#5A7060]">
            If you have questions regarding our affiliate relationships, or wish to report a concern about any featured product, please reach out via our <Link to="/contact" className="text-[#2D7D46] font-semibold underline">Editorial Contact page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};
