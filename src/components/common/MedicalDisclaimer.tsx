import React from 'react';
import { ShieldAlert, AlertCircle, Info, Stethoscope } from 'lucide-react';

interface MedicalDisclaimerProps {
  variant?: 'inline' | 'card' | 'compact' | 'banner';
  className?: string;
  sourceCitation?: string;
  showEmergencyNotice?: boolean;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  variant = 'inline',
  className = '',
  sourceCitation,
  showEmergencyNotice = true
}) => {
  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-2 text-[11px] text-[#5A7060] bg-[#FAF8F5] border border-[#E2DDD5] px-3 py-1.5 rounded-lg ${className}`}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-[#D95D39] shrink-0" />
        <span>
          <strong>FDA & Medical Notice:</strong> Nutritional estimations and AI wellness outputs are for educational purposes only. Not intended to diagnose, treat, or cure any disease.
        </span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <aside
        aria-label="Medical Disclaimer Banner"
        className={`bg-[#FAF6F0] border-l-4 border-[#2D7D46] border-y border-r border-[#E2DDD5] p-4 rounded-xl text-xs text-[#5A7060] space-y-1.5 ${className}`}
      >
        <div className="flex items-center gap-2 text-[#1C2B20] font-bold">
          <Stethoscope className="w-4 h-4 text-[#2D7D46]" />
          <span>Evidence-Based Clinical & FDA Notice</span>
        </div>
        <p className="leading-relaxed">
          The nutritional data, meal recommendations, and wellness analyses provided across HealthWise USA are compiled from USDA FoodData Central and peer-reviewed dietary references. They do not constitute formal medical diagnosis or individual treatment plans.
        </p>
        {showEmergencyNotice && (
          <p className="text-[11px] text-[#D95D39] font-medium">
            ⚠️ If you are experiencing an acute medical emergency or chest pain, call 911 immediately.
          </p>
        )}
      </aside>
    );
  }

  // Default: 'inline' or 'card'
  return (
    <aside
      aria-label="FDA and Medical Advice Disclaimer"
      className={`bg-[#FAF8F5] border border-[#E2DDD5] rounded-2xl p-4 sm:p-5 text-xs text-[#5A7060] space-y-2.5 print:hidden shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#E2DDD5]/70 pb-2">
        <span className="font-bold text-[#1C2B20] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-[#D95D39]" /> FDA & Clinical Practice Disclaimer
        </span>
        {sourceCitation && (
          <span className="text-[11px] font-medium text-[#2D7D46] bg-[#E8F5EC] px-2 py-0.5 rounded-md">
            Source: {sourceCitation}
          </span>
        )}
      </div>

      <p className="leading-relaxed text-[#4A5D50]">
        Statements on this platform have not been evaluated by the <strong>Food and Drug Administration (FDA)</strong>. Content and AI-assisted outputs are provided for educational wellness and lifestyle guidance only and are not a substitute for clinical diagnosis, medical care, or therapy from a licensed physician or registered dietitian (RD).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 text-[#5A7060]">
        <div className="flex items-start gap-1.5">
          <span className="text-[#2D7D46] font-bold">•</span>
          <span>Always consult your healthcare provider before altering medications, fasting, or adopting strict diets.</span>
        </div>
        <div className="flex items-start gap-1.5">
          <span className="text-[#2D7D46] font-bold">•</span>
          <span>Calorie, sodium, and macro values are calculated estimates subject to agricultural and brand variations.</span>
        </div>
      </div>

      {showEmergencyNotice && (
        <div className="pt-2 border-t border-[#E2DDD5]/60 flex items-center justify-between text-[11px]">
          <span className="text-[#9A3412] font-semibold">
            Medical Emergency? Call 911 or visit the nearest emergency room immediately.
          </span>
          <span className="text-[#5A7060] hidden sm:inline">FTC & FDA Compliant Editorial</span>
        </div>
      )}
    </aside>
  );
};
