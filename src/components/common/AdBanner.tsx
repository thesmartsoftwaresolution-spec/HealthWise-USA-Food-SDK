import React from 'react';

interface AdBannerProps {
  slot?: 'article-inline' | 'article-bottom' | 'recipe-sidebar' | 'horizontal-banner';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot = 'horizontal-banner', className = '' }) => {
  return (
    <div className={`my-6 select-none ${className}`} aria-label="Sponsored advertisement">
      <div className="text-[10px] uppercase tracking-wider text-[#5A7060]/70 font-semibold mb-1 text-center">
        Advertisement
      </div>
      <div className="bg-[#E8F5EC]/60 border border-[#D4E6D9] rounded-xl p-4 text-center transition hover:border-[#2D7D46]/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto">
          <div className="text-left">
            <span className="inline-block text-[11px] font-bold text-[#E07B39] uppercase tracking-wider">
              Recommended Wellness Partner
            </span>
            <p className="text-sm font-semibold text-[#1C2B20] mt-0.5">
              100% Grass-Fed Whey & Organic Supergreens
            </p>
            <p className="text-xs text-[#5A7060]">
              Third-party tested, zero artificial sweeteners. Clean American nutrition.
            </p>
          </div>
          <a
            href="#partner"
            onClick={(e) => {
              e.preventDefault();
              alert('HealthWise Partner link: Third-party tested clean whole nutrition products.');
            }}
            className="shrink-0 px-4 py-2 bg-[#2D7D46] hover:bg-[#1A5C31] text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            Explore Clean Fuel
          </a>
        </div>
      </div>
    </div>
  );
};
