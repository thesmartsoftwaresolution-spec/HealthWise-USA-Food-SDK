import React from 'react';
import { ShieldCheck, Heart, Award, Users, BookOpen } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      <div className="space-y-4">
        <span className="text-xs font-bold text-[#2D7D46] uppercase tracking-wider">About Our Platform</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C2B20]">
          Real Food. Real Health. Made Simple for Everyday Americans.
        </h1>
        <p className="text-base text-[#5A7060] leading-relaxed">
          HealthWise USA was founded to solve a modern dilemma: Americans are bombarded with contradictory, clinical, and often predatory health advice. We bridge the gap between academic clinical research and your family kitchen table.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#E8F5EC] border border-[#D4E6D9] p-6 rounded-2xl space-y-2">
          <ShieldCheck className="w-8 h-8 text-[#2D7D46]" />
          <h3 className="font-serif text-lg font-bold text-[#1C2B20]">Evidence-Grounded</h3>
          <p className="text-xs text-[#5A7060]">
            Every article is grounded in CDC, USDA, NIH, and peer-reviewed clinical cohorts, reviewed by certified dietitians.
          </p>
        </div>
        <div className="bg-[#FDF0E6] border border-[#FED7AA] p-6 rounded-2xl space-y-2">
          <Heart className="w-8 h-8 text-[#E07B39]" />
          <h3 className="font-serif text-lg font-bold text-[#1C2B20]">Practical & Affordable</h3>
          <p className="text-xs text-[#5A7060]">
            We design recipes around common grocery store staples, keeping meals under $3 per serving without sacrificing flavor.
          </p>
        </div>
        <div className="bg-[#E0F2FE] border border-[#BAE6FD] p-6 rounded-2xl space-y-2">
          <Award className="w-8 h-8 text-[#0369A1]" />
          <h3 className="font-serif text-lg font-bold text-[#1C2B20]">Zero AI Gimmicks</h3>
          <p className="text-xs text-[#5A7060]">
            Our AI tools emphasize deep nutritional reasoning and meal planning rather than generic bots or unverified medical claims.
          </p>
        </div>
      </div>

      <div id="editorial" className="bg-white border border-[#D4E6D9] rounded-3xl p-8 space-y-4 shadow-xs">
        <h2 className="font-serif text-2xl font-bold text-[#1C2B20]">Editorial Integrity & Standards</h2>
        <p className="text-sm text-[#5A7060] leading-relaxed">
          HealthWise USA maintains strict editorial independence. Our content is written by credentialed nutritionists and medical writers, verified against randomized controlled trials, and audited regularly for scientific updates. We do not accept sponsored content that dictates clinical conclusions.
        </p>
      </div>

      <div id="affiliate" className="bg-[#F4F8F5] border border-[#D4E6D9] rounded-3xl p-8 space-y-3">
        <h2 className="font-serif text-xl font-bold text-[#1C2B20]">Affiliate & Advertising Disclosure</h2>
        <p className="text-xs text-[#5A7060] leading-relaxed">
          HealthWise USA may earn a modest commission when you purchase kitchen gear or wholesome food staples through affiliate links on our site. These links never influence our editorial integrity or recipe nutritional benchmarks. All sponsored ad units are clearly designated with an &ldquo;Advertisement&rdquo; label per FTC guidelines.
        </p>
      </div>
    </div>
  );
};
