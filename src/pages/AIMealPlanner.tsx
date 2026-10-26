import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { MealPlan, MealDay } from '../types/index.ts';
import { Button } from '../components/common/Button.tsx';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer.tsx';
import {
  CalendarDays,
  Sparkles,
  DollarSign,
  Clock,
  Users,
  RefreshCw,
  ShoppingCart,
  Bookmark,
  CheckCircle2,
  Brain,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const AIMealPlanner: React.FC = () => {
  const { user } = useAuth();
  const { setActiveMealPlan, setActiveGroceryList, showToast, activeMealPlan } = useApp();
  const navigate = useNavigate();

  // Wizard state: 1 = Preferences, 2 = Goals & Budget, 3 = Generated Plan
  const [step, setStep] = useState<number>(activeMealPlan ? 3 : 1);
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(user?.dietaryPrefs || ['High-Protein']);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [calorieGoal, setCalorieGoal] = useState<number>(2000);
  const [weeklyBudget, setWeeklyBudget] = useState<number>(75);
  const [cookTime, setCookTime] = useState<string>('30to60');
  const [servings, setServings] = useState<number>(2);

  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(activeMealPlan);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const dietOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'High-Protein', 'Low-Carb', 'Mediterranean'];
  const allergyOptions = ['Nuts', 'Peanuts', 'Shellfish', 'Eggs', 'Soy', 'Dairy'];

  const togglePref = (p: string) => {
    setDietaryPrefs((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const toggleAllergy = (a: string) => {
    setAllergies((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStep(3);

    try {
      const res = await fetch('/api/ai/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dietaryPrefs,
          allergies,
          calorieGoal,
          weeklyBudget,
          cookTimePref: cookTime,
          servings,
          userId: user?.id
        })
      });

      const data = await res.json();
      if (data.success && data.plan) {
        setGeneratedPlan(data.plan);
        setActiveMealPlan(data.plan);
        showToast('Your 7-day personalized meal plan is ready!', 'success');
      } else {
        showToast(data.error || 'Failed to generate plan. Please try again.', 'error');
        setStep(2);
      }
    } catch {
      showToast('Network error while planning meals.', 'error');
      setStep(2);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSwapMeal = (dayIdx: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    if (!generatedPlan) return;
    const alternatives = [
      { name: 'Oatmeal with Blueberries & Chia', calories: 350 },
      { name: 'Grilled Lemon Herb Chicken Bowl', calories: 480 },
      { name: 'Tuscan White Bean & Kale Skillet', calories: 310 },
      { name: 'Greek Yogurt with 1 oz Raw Walnuts', calories: 210 },
      { name: '15-Minute Skillet Turkey Tacos', calories: 410 },
      { name: 'Wild Alaskan Salmon & Roasted Asparagus', calories: 420 }
    ];
    const picked = alternatives[Math.floor(Math.random() * alternatives.length)];

    const updatedDays = [...generatedPlan.planData.days];
    updatedDays[dayIdx].meals[mealType] = picked;

    const updatedPlan = {
      ...generatedPlan,
      planData: {
        ...generatedPlan.planData,
        days: updatedDays
      }
    };
    setGeneratedPlan(updatedPlan);
    setActiveMealPlan(updatedPlan);
    showToast(`Swapped ${mealType} for ${updatedDays[dayIdx].day}!`, 'info');
  };

  const handleExportGroceryList = async () => {
    if (!generatedPlan) return;
    const allMealNames: string[] = [];
    generatedPlan.planData.days.forEach((d) => {
      if (d.meals.breakfast?.name) allMealNames.push(d.meals.breakfast.name);
      if (d.meals.lunch?.name) allMealNames.push(d.meals.lunch.name);
      if (d.meals.dinner?.name) allMealNames.push(d.meals.dinner.name);
      if (d.meals.snack?.name) allMealNames.push(d.meals.snack.name);
    });

    try {
      const res = await fetch('/api/ai/grocery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: allMealNames,
          mealPlanTitle: generatedPlan.title,
          userId: user?.id
        })
      });
      const data = await res.json();
      if (data.success && data.list) {
        setActiveGroceryList(data.list);
        showToast('Exported to Supermarket Grocery Checklist!', 'success');
        navigate('/ai-tools/grocery');
      }
    } catch {
      showToast('Could not export grocery list.', 'error');
    }
  };

  const selectedDay: MealDay | undefined = generatedPlan?.planData.days[selectedDayIdx];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Top Banner */}
      <div className="bg-[#E8F5EC] border border-[#D4E6D9] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#2D7D46] text-white uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5" /> High Thinking Nutritional Engine
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2B20]">
            AI 7-Day Personalized Meal Planner
          </h1>
          <p className="text-sm text-[#5A7060] leading-relaxed">
            Create an affordable, balanced week of meals tailored to your calorie goals, family budget, and dietary preferences.
          </p>
        </div>

        {step === 3 && generatedPlan && (
          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-white border border-[#D4E6D9] hover:bg-gray-50 text-[#1C2B20] text-xs font-semibold rounded-xl shadow-xs transition"
            >
              Adjust Settings
            </button>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 bg-[#2D7D46] hover:bg-[#1A5C31] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate
            </button>
          </div>
        )}
      </div>

      {/* STEP 1: PREFERENCES */}
      {step === 1 && (
        <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs animate-in fade-in">
          <div className="border-b border-[#D4E6D9]/60 pb-4">
            <span className="text-xs font-bold text-[#2D7D46] uppercase tracking-wider">Step 1 of 2</span>
            <h2 className="font-serif text-2xl font-bold text-[#1C2B20] mt-1">Dietary Preferences & Allergens</h2>
            <p className="text-xs text-[#5A7060]">Select all diets and food restrictions that apply to you or your household.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-[#1C2B20]">Dietary Lifestyles:</label>
            <div className="flex flex-wrap gap-2.5">
              {dietOptions.map((opt) => {
                const selected = dietaryPrefs.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => togglePref(opt)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                      selected
                        ? 'bg-[#2D7D46] text-white border-[#2D7D46] shadow-xs'
                        : 'bg-[#F4F8F5] border-[#D4E6D9] text-[#1C2B20] hover:bg-gray-100'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-[#1C2B20]">Allergies / Foods to Exclude:</label>
            <div className="flex flex-wrap gap-2.5">
              {allergyOptions.map((opt) => {
                const selected = allergies.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleAllergy(opt)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                      selected
                        ? 'bg-[#C0392B] text-white border-[#C0392B] shadow-xs'
                        : 'bg-[#F4F8F5] border-[#D4E6D9] text-[#1C2B20] hover:bg-gray-100'
                    }`}
                  >
                    {selected ? `✓ No ${opt}` : `Exclude ${opt}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#D4E6D9]/60 flex justify-end">
            <Button variant="primary" size="lg" onClick={() => setStep(2)}>
              Next: Goals & Budget &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: GOALS & BUDGET */}
      {step === 2 && (
        <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs animate-in fade-in">
          <div className="border-b border-[#D4E6D9]/60 pb-4">
            <span className="text-xs font-bold text-[#2D7D46] uppercase tracking-wider">Step 2 of 2</span>
            <h2 className="font-serif text-2xl font-bold text-[#1C2B20] mt-1">Nutrition Goals & Weekly Budget</h2>
            <p className="text-xs text-[#5A7060]">Tailor daily caloric targets and supermarket grocery constraints.</p>
          </div>

          {/* Calorie Goal */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-[#1C2B20]">Daily Calorie Target:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: '1,500 cal', desc: 'Sustainable fat loss & deficit', val: 1500 },
                { label: '2,000 cal', desc: 'Optimal health maintenance', val: 2000 },
                { label: '2,500 cal', desc: 'Active & muscle building', val: 2500 }
              ].map((c) => (
                <button
                  key={c.val}
                  onClick={() => setCalorieGoal(c.val)}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    calorieGoal === c.val
                      ? 'border-[#2D7D46] bg-[#E8F5EC] shadow-xs'
                      : 'border-[#D4E6D9] bg-[#F4F8F5] hover:bg-gray-100'
                  }`}
                >
                  <p className="font-bold text-base text-[#1C2B20]">{c.label}</p>
                  <p className="text-xs text-[#5A7060] mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Budget Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <label className="text-sm font-bold text-[#1C2B20]">Weekly Supermarket Budget:</label>
              <span className="font-serif text-2xl font-bold text-[#E07B39]">${weeklyBudget} USD</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              step="5"
              value={weeklyBudget}
              onChange={(e) => setWeeklyBudget(parseInt(e.target.value, 10))}
              className="w-full accent-[#2D7D46] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#5A7060]">
              <span>$50 / week (Ultra Budget)</span>
              <span>$125 / week (Balanced)</span>
              <span>$200 / week (Organic Premium)</span>
            </div>
          </div>

          {/* Cooking Time & Servings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1C2B20]">Cook Time Available:</label>
              <select
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D4E6D9] bg-white text-sm text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
              >
                <option value="under30">Under 30 Minutes (Quick weeknights)</option>
                <option value="30to60">30 to 60 Minutes (Standard)</option>
                <option value="any">Flexible (Weekend meal prepping)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1C2B20]">Household Servings:</label>
              <select
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D4E6D9] bg-white text-sm text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
              >
                <option value={1}>1 person (Solo)</option>
                <option value={2}>2 people (Couple)</option>
                <option value={4}>4 people (Family)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#D4E6D9]/60 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button variant="accent" size="lg" onClick={handleGenerate} icon={<Sparkles className="w-5 h-5" />}>
              Generate 7-Day Plan
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: GENERATED 7-DAY MEAL PLAN */}
      {step === 3 && (
        <div className="space-y-8 animate-in fade-in">
          {isGenerating ? (
            <div className="bg-white border border-[#D4E6D9] rounded-3xl p-16 text-center space-y-4">
              <Brain className="w-12 h-12 text-[#2D7D46] animate-pulse mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-[#1C2B20]">
                Generating Your Personalized 7-Day Plan...
              </h3>
              <p className="text-sm text-[#5A7060] max-w-md mx-auto">
                Gemini 4 Argon with High Thinking is optimizing meal variety, balancing daily caloric targets, and keeping ingredient overlap efficient for your ${weeklyBudget} grocery budget.
              </p>
            </div>
          ) : generatedPlan && selectedDay ? (
            <div className="space-y-6">
              {/* Plan Summary Bar */}
              <div className="bg-white border border-[#D4E6D9] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C2B20]">{generatedPlan.title}</h3>
                  <p className="text-xs text-[#5A7060]">
                    Avg. {generatedPlan.planData.weeklyAvgCalories} cal/day • Est. Weekly Grocery Cost: ${generatedPlan.planData.estimatedWeeklyCost} USD
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleExportGroceryList}
                    className="px-4 py-2.5 bg-[#2D7D46] hover:bg-[#1A5C31] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Get Supermarket Grocery List</span>
                  </button>
                  <button
                    onClick={() => {
                      showToast('Plan saved to your Personal Dashboard!', 'success');
                    }}
                    className="px-4 py-2.5 bg-white border border-[#D4E6D9] hover:bg-gray-50 text-[#1C2B20] text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-[#2D7D46]" />
                    <span>Save Plan</span>
                  </button>
                </div>
              </div>

              {/* Day Tabs (Monday to Sunday) */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {generatedPlan.planData.days.map((d, idx) => {
                  const active = idx === selectedDayIdx;
                  return (
                    <button
                      key={d.day}
                      onClick={() => setSelectedDayIdx(idx)}
                      className={`flex-1 min-w-[100px] py-3 px-4 rounded-2xl border text-center transition cursor-pointer ${
                        active
                          ? 'bg-[#2D7D46] text-white border-[#2D7D46] shadow-sm'
                          : 'bg-white border-[#D4E6D9] text-[#1C2B20] hover:bg-[#E8F5EC]'
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase">{d.day.slice(0, 3)}</p>
                      <p className="text-sm font-bold mt-0.5">{d.totalCalories} cal</p>
                    </button>
                  );
                })}
              </div>

              {/* Day Meals Card */}
              <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#D4E6D9]/60 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1C2B20]">{selectedDay.day} Menu</h3>
                    <p className="text-xs text-[#5A7060]">Target: ~{calorieGoal} kcal</p>
                  </div>
                  <span className="text-base font-bold text-[#2D7D46] bg-[#E8F5EC] px-3.5 py-1 rounded-full border border-[#D4E6D9]">
                    Daily Total: {selectedDay.totalCalories} calories
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Breakfast */}
                  <div className="bg-[#F4F8F5] border border-[#D4E6D9] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#5A7060]">
                        <span className="font-bold uppercase tracking-wider text-[#E07B39]">🌅 Breakfast</span>
                        <span className="font-bold text-[#1C2B20]">{selectedDay.meals.breakfast?.calories} cal</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#1C2B20] mt-1">
                        {selectedDay.meals.breakfast?.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleSwapMeal(selectedDayIdx, 'breakfast')}
                      className="text-xs text-[#2D7D46] hover:text-[#1A5C31] flex items-center gap-1 font-semibold pt-2"
                    >
                      <RefreshCw className="w-3 h-3" /> Swap Breakfast
                    </button>
                  </div>

                  {/* Lunch */}
                  <div className="bg-[#F4F8F5] border border-[#D4E6D9] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#5A7060]">
                        <span className="font-bold uppercase tracking-wider text-[#2D7D46]">☀️ Lunch</span>
                        <span className="font-bold text-[#1C2B20]">{selectedDay.meals.lunch?.calories} cal</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#1C2B20] mt-1">
                        {selectedDay.meals.lunch?.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleSwapMeal(selectedDayIdx, 'lunch')}
                      className="text-xs text-[#2D7D46] hover:text-[#1A5C31] flex items-center gap-1 font-semibold pt-2"
                    >
                      <RefreshCw className="w-3 h-3" /> Swap Lunch
                    </button>
                  </div>

                  {/* Dinner */}
                  <div className="bg-[#F4F8F5] border border-[#D4E6D9] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#5A7060]">
                        <span className="font-bold uppercase tracking-wider text-[#0369A1]">🌙 Dinner</span>
                        <span className="font-bold text-[#1C2B20]">{selectedDay.meals.dinner?.calories} cal</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#1C2B20] mt-1">
                        {selectedDay.meals.dinner?.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleSwapMeal(selectedDayIdx, 'dinner')}
                      className="text-xs text-[#2D7D46] hover:text-[#1A5C31] flex items-center gap-1 font-semibold pt-2"
                    >
                      <RefreshCw className="w-3 h-3" /> Swap Dinner
                    </button>
                  </div>

                  {/* Snack */}
                  <div className="bg-[#F4F8F5] border border-[#D4E6D9] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#5A7060]">
                        <span className="font-bold uppercase tracking-wider text-[#7C3AED]">🍎 Snack</span>
                        <span className="font-bold text-[#1C2B20]">{selectedDay.meals.snack?.calories} cal</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#1C2B20] mt-1">
                        {selectedDay.meals.snack?.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleSwapMeal(selectedDayIdx, 'snack')}
                      className="text-xs text-[#2D7D46] hover:text-[#1A5C31] flex items-center gap-1 font-semibold pt-2"
                    >
                      <RefreshCw className="w-3 h-3" /> Swap Snack
                    </button>
                  </div>
                </div>
              </div>

              {/* Inline FDA & Clinical Disclaimer */}
              <MedicalDisclaimer
                variant="inline"
                sourceCitation="USDA FoodData Central / Dietary Guidelines for Americans (2025-2030)"
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
