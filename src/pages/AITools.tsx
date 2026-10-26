import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/common/Badge.tsx';
import {
  CalendarDays,
  Utensils,
  Sparkles,
  BookOpen,
  ShoppingCart,
  Bot,
  Brain,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const AITools: React.FC = () => {
  const tools = [
    {
      title: 'AI 7-Day Meal Planner',
      path: '/ai-tools/meal-planner',
      badge: 'Most Popular',
      icon: CalendarDays,
      iconColor: 'bg-[#2D7D46]',
      description:
        'Generate a realistic, personalized weekly meal plan customized to your family budget, calorie goal, and dietary lifestyle. Includes one-click supermarket grocery list generation.',
      features: ['Monday–Sunday macro breakdown', 'Adjustable budget ($50–$200/wk)', 'Instant grocery export']
    },
    {
      title: 'AI Wellness Assistant',
      path: '/ai-tools/chat',
      badge: 'High Thinking Reasoning',
      icon: Sparkles,
      iconColor: 'bg-[#E07B39]',
      description:
        'Ask complex questions regarding nutritional biochemistry, lipid panels, cardiovascular wellness, and whole foods. Powered by Gemini 4 with High Thinking mode.',
      features: ['Deep evidence-based answers', 'Direct on-site article citations', 'Emergency 911 safeguards']
    },
    {
      title: 'AI Recipe Generator',
      path: '/ai-tools/recipe',
      badge: 'Fridge to Table',
      icon: Utensils,
      iconColor: 'bg-[#0369A1]',
      description:
        'Have random staples sitting in your pantry or fridge? Enter 3+ ingredients to generate delicious, healthy recipes with step-by-step instructions in under 30 minutes.',
      features: ['Zero food waste', 'Allergy & diet filters', 'US measurement units']
    },
    {
      title: 'AI Nutrition Analyzer',
      path: '/ai-tools/nutrition',
      badge: 'Macro & Micro Breakdown',
      icon: BookOpen,
      iconColor: 'bg-[#7C3AED]',
      description:
        'Calculate estimated calories, protein, carbs, fat, fiber, and micronutrients for any custom meal or family recipe using USDA nutritional database parameters.',
      features: ['Per-serving calculations', 'Visual macro distribution', 'Prebiotic fiber tracking']
    },
    {
      title: 'AI Supermarket Grocery Organizer',
      path: '/ai-tools/grocery',
      badge: 'Aisle-By-Aisle',
      icon: ShoppingCart,
      iconColor: 'bg-[#059669]',
      description:
        'Transform any meal plan or recipe list into an aisle-categorized supermarket checklist (Produce, Dairy, Lean Proteins, Pantry, Frozen) with estimated USD costs.',
      features: ['Check-off as you shop', 'USD budget totals', 'Mobile-friendly checklist']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-left">
      {/* Top Banner */}
      <div className="bg-[#1C2B20] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#2D7D46]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E07B39]/20 border border-[#E07B39]/40 text-xs font-bold text-[#E07B39] uppercase tracking-wider">
            <Brain className="w-4 h-4" /> Gemini 4 Argon • High Thinking Mode Active
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            AI Wellness & Meal Planning Hub
          </h1>
          <p className="text-sm sm:text-base text-[#E8F5EC]/80 leading-relaxed">
            Practical artificial intelligence engineered for everyday American wellness. Powered by Google Gemini with deep reasoning capabilities, rate-limiting protections, and strict medical safety filters.
          </p>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-[#E8F5EC] border border-[#D4E6D9] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-[#2D7D46] shrink-0 mt-0.5" />
        <div className="text-xs text-[#1C2B20] leading-relaxed space-y-1">
          <p className="font-bold uppercase tracking-wider text-[#1A5C31]">AI Safety & Medical Ethics Commitment</p>
          <p>
            HealthWise USA AI tools are educational wellness companions, not clinical physicians. Our models will never provide prescription medication advice or disease diagnoses. For emergency conditions, call 911 immediately.
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.title}
              to={tool.path}
              className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${tool.iconColor} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E8F5EC] text-[#2D7D46] uppercase tracking-wider">
                    {tool.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#1C2B20] group-hover:text-[#2D7D46] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A7060] mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#D4E6D9]/50 space-y-1.5">
                  {tool.features.map((f, i) => (
                    <div key={i} className="text-xs text-[#1C2B20] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D7D46]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4 flex items-center justify-between text-xs font-bold text-[#2D7D46]">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
