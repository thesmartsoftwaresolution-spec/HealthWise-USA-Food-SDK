import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Badge } from '../components/common/Badge.tsx';
import { Button } from '../components/common/Button.tsx';
import { calculateHabitStreak } from '../utils/nutrition.ts';
import {
  CalendarDays,
  Bookmark,
  Sparkles,
  Heart,
  ShoppingCart,
  Flame,
  Check,
  Clock,
  ArrowRight,
  Settings,
  Plus,
  Sliders,
  RefreshCw
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, updateUserPrefs } = useAuth();
  const {
    savedArticles,
    savedRecipes,
    toggleSaveArticle,
    toggleSaveRecipe,
    activeMealPlan,
    activeGroceryList,
    toggleGroceryItem,
    habits,
    habitLogs,
    toggleHabit,
    isHabitCompletedOnDate,
    measurementUnit,
    toggleMeasurementUnit,
    showToast
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'plan' | 'grocery' | 'habits' | 'settings'>('overview');
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    const hash = location.hash.replace('#', '');
    const target = tabParam || hash;
    if (target === 'saved') setActiveTab('saved');
    else if (target === 'plans' || target === 'plan') setActiveTab('plan');
    else if (target === 'habits') setActiveTab('habits');
    else if (target === 'grocery') setActiveTab('grocery');
    else if (target === 'settings') setActiveTab('settings');
  }, [location.search, location.hash]);

  // Week days for habit tracker grid: Monday to Sunday
  const getWeekDays = () => {
    const days = [];
    const curr = new Date();
    const dayOfWeek = curr.getDay() || 7; // Monday = 1, Sunday = 7
    const monday = new Date(curr);
    monday.setDate(curr.getDate() - dayOfWeek + 1);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateStr: d.toISOString().split('T')[0],
        isToday: d.toISOString().split('T')[0] === todayStr
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  const handleExportData = () => {
    const exportData = {
      user,
      savedArticles,
      savedRecipes,
      activeMealPlan,
      activeGroceryList,
      habits,
      habitLogs
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healthwise-data-${user?.name || 'user'}.json`;
    a.click();
    showToast('Your HealthWise personal data was exported successfully.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1C2B20] to-[#2D7D46] text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Waving hand">👋</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#84D49B]">
              Personal Wellness Dashboard
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Welcome back, {user?.name || 'Friend'}!
          </h1>
          <p className="text-sm text-[#E8F5EC]/85 leading-relaxed">
            Track daily hydration, review your weekly meal plan, and explore your saved recipes.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="accent"
            size="md"
            onClick={() => navigate('/ai-tools/meal-planner')}
            icon={<CalendarDays className="w-4 h-4" />}
          >
            New Meal Plan
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="text-white border-white/50 hover:bg-white/10"
            onClick={() => navigate('/ai-tools/chat')}
            icon={<Sparkles className="w-4 h-4" />}
          >
            AI Assistant
          </Button>
        </div>
      </div>

      {/* Dashboard Sub Navigation Tabs */}
      <div className="flex border-b border-[#D4E6D9] gap-4 overflow-x-auto scrollbar-none text-sm font-semibold">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'habits', label: 'Habit Tracker' },
          { id: 'plan', label: 'Weekly Meal Plan' },
          { id: 'grocery', label: 'Supermarket List' },
          { id: 'saved', label: `Saved Items (${savedRecipes.length + savedArticles.length})` },
          { id: 'settings', label: 'Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#2D7D46] text-[#2D7D46]'
                : 'border-transparent text-[#5A7060] hover:text-[#1C2B20]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Habits Widget */}
          <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#D4E6D9]/50 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1C2B20] flex items-center gap-2">
                  <Flame className="w-6 h-6 text-[#E07B39]" /> Daily Wellness Habit Tracker
                </h3>
                <p className="text-xs text-[#5A7060]">Check off your daily health goals to maintain your streak.</p>
              </div>
              <button
                onClick={() => setActiveTab('habits')}
                className="text-xs font-semibold text-[#2D7D46] hover:underline"
              >
                View Full Grid &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {habits.map((habit) => {
                const completedToday = isHabitCompletedOnDate(habit.id, todayStr);
                const habitLogDates = habitLogs.filter((l) => l.habitId === habit.id && l.completed).map((l) => l.loggedDate);
                const streak = calculateHabitStreak(habitLogDates, todayStr);

                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id, todayStr)}
                    className={`p-4 rounded-2xl border transition cursor-pointer select-none flex flex-col justify-between space-y-3 ${
                      completedToday
                        ? 'bg-[#E8F5EC] border-[#2D7D46] shadow-xs'
                        : 'bg-[#F4F8F5] border-[#D4E6D9] hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{habit.icon}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-[#E07B39] border border-[#D4E6D9]">
                        <Flame className="w-3 h-3 fill-[#E07B39]" /> {streak} day streak
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#1C2B20]">{habit.name}</p>
                      <p className="text-xs text-[#5A7060] mt-0.5">Target: {habit.targetPerDay} {habit.unit}/day</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#D4E6D9]/50 text-xs font-semibold">
                      <span className={completedToday ? 'text-[#2D7D46]' : 'text-[#5A7060]'}>
                        {completedToday ? 'Completed Today ✓' : 'Click to complete'}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition ${
                          completedToday ? 'bg-[#2D7D46] border-[#2D7D46] text-white' : 'border-[#D4E6D9] bg-white'
                        }`}
                      >
                        {completedToday && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* This Week's Meal Plan Card */}
          {activeMealPlan && (
            <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4E6D9]/50 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D7D46]">Active Plan</span>
                  <h3 className="font-serif text-2xl font-bold text-[#1C2B20]">{activeMealPlan.title}</h3>
                  <p className="text-xs text-[#5A7060]">
                    Avg. {activeMealPlan.planData.weeklyAvgCalories} cal/day • ${activeMealPlan.planData.estimatedWeeklyCost} estimated weekly groceries
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/ai-tools/meal-planner"
                    className="px-3.5 py-1.5 bg-[#E8F5EC] hover:bg-[#2D7D46] text-[#2D7D46] hover:text-white rounded-xl text-xs font-semibold transition"
                  >
                    Open 7-Day Calendar
                  </Link>
                  <Link
                    to="/ai-tools/grocery"
                    className="px-3.5 py-1.5 bg-[#2D7D46] hover:bg-[#1A5C31] text-white rounded-xl text-xs font-semibold transition flex items-center gap-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Supermarket List
                  </Link>
                </div>
              </div>

              {/* Day Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeMealPlan.planData.days.slice(0, 4).map((d) => (
                  <div key={d.day} className="bg-[#F4F8F5] p-4 rounded-2xl border border-[#D4E6D9] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold uppercase text-[#2D7D46]">{d.day}</span>
                      <span className="font-semibold text-[#1C2B20]">{d.totalCalories} cal</span>
                    </div>
                    <div className="text-xs space-y-1 text-[#1C2B20]">
                      <p className="truncate"><strong>B:</strong> {d.meals.breakfast?.name}</p>
                      <p className="truncate"><strong>L:</strong> {d.meals.lunch?.name}</p>
                      <p className="truncate"><strong>D:</strong> {d.meals.dinner?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Items Quick Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Saved Recipes */}
            <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#D4E6D9]/50 pb-3">
                <h3 className="font-serif text-xl font-bold text-[#1C2B20] flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#E07B39]" /> Saved Recipes ({savedRecipes.length})
                </h3>
                <Link to="/recipes" className="text-xs font-semibold text-[#2D7D46] hover:underline">
                  Browse More
                </Link>
              </div>

              {savedRecipes.length === 0 ? (
                <p className="text-xs text-[#5A7060] py-4 text-center">No recipes saved yet. Click the heart icon on any recipe to save it here!</p>
              ) : (
                <div className="space-y-2.5">
                  {savedRecipes.slice(0, 3).map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between p-2.5 rounded-xl border border-[#D4E6D9] hover:bg-[#E8F5EC]/40 transition">
                      <div className="min-w-0 pr-2">
                        <Link to={`/recipes/${rec.slug}`} className="text-sm font-semibold text-[#1C2B20] hover:text-[#2D7D46] truncate block">
                          {rec.title}
                        </Link>
                        <span className="text-xs text-[#5A7060]">{rec.calories} cal • ${rec.costPerServing.toFixed(2)}/serving</span>
                      </div>
                      <button
                        onClick={() => toggleSaveRecipe(rec)}
                        className="text-xs text-red-500 hover:text-red-700 p-1"
                        title="Remove"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Articles */}
            <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#D4E6D9]/50 pb-3">
                <h3 className="font-serif text-xl font-bold text-[#1C2B20] flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[#2D7D46]" /> Bookmarked Articles ({savedArticles.length})
                </h3>
                <Link to="/health-tips" className="text-xs font-semibold text-[#2D7D46] hover:underline">
                  Explore Articles
                </Link>
              </div>

              {savedArticles.length === 0 ? (
                <p className="text-xs text-[#5A7060] py-4 text-center">No articles saved yet. Bookmark health guides to build your personal library!</p>
              ) : (
                <div className="space-y-2.5">
                  {savedArticles.slice(0, 3).map((art) => (
                    <div key={art.id} className="flex items-center justify-between p-2.5 rounded-xl border border-[#D4E6D9] hover:bg-[#E8F5EC]/40 transition">
                      <div className="min-w-0 pr-2">
                        <Link to={`/health-tips/${art.slug}`} className="text-sm font-semibold text-[#1C2B20] hover:text-[#2D7D46] truncate block">
                          {art.title}
                        </Link>
                        <span className="text-xs text-[#5A7060]">{art.readingTimeMin} min read • {art.categoryName}</span>
                      </div>
                      <button
                        onClick={() => toggleSaveArticle(art)}
                        className="text-xs text-red-500 hover:text-red-700 p-1"
                        title="Remove"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HABIT TRACKER GRID */}
      {activeTab === 'habits' && (
        <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in">
          <div className="border-b border-[#D4E6D9]/50 pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#1C2B20]">Weekly Habit Matrix</h2>
            <p className="text-xs text-[#5A7060]">Track your daily wellness habits across the entire current week.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-[#D4E6D9]">
                  <th className="py-3 px-4 font-bold text-[#1C2B20]">Daily Habit</th>
                  {weekDays.map((d) => (
                    <th key={d.dateStr} className={`py-3 px-2 text-center text-xs font-semibold ${d.isToday ? 'text-[#2D7D46] font-bold' : 'text-[#5A7060]'}`}>
                      {d.name} {d.isToday && '★'}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-center text-xs font-bold text-[#E07B39]">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4E6D9]/60">
                {habits.map((habit) => {
                  const habitLogDates = habitLogs.filter((l) => l.habitId === habit.id && l.completed).map((l) => l.loggedDate);
                  const streak = calculateHabitStreak(habitLogDates, todayStr);

                  return (
                    <tr key={habit.id} className="hover:bg-[#F4F8F5]">
                      <td className="py-3.5 px-4 font-medium text-[#1C2B20] flex items-center gap-2">
                        <span className="text-lg">{habit.icon}</span>
                        <span>{habit.name}</span>
                      </td>
                      {weekDays.map((d) => {
                        const done = isHabitCompletedOnDate(habit.id, d.dateStr);
                        return (
                          <td key={d.dateStr} className="py-3.5 px-2 text-center">
                            <button
                              onClick={() => toggleHabit(habit.id, d.dateStr)}
                              className={`w-7 h-7 mx-auto rounded-lg border flex items-center justify-center transition cursor-pointer ${
                                done ? 'bg-[#2D7D46] border-[#2D7D46] text-white shadow-xs' : 'border-[#D4E6D9] bg-white hover:bg-gray-100'
                              }`}
                            >
                              {done && <Check className="w-4 h-4 stroke-[3]" />}
                            </button>
                          </td>
                        );
                      })}
                      <td className="py-3.5 px-4 text-center font-bold text-[#E07B39]">
                        {streak}d 🔥
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WEEKLY MEAL PLAN */}
      {activeTab === 'plan' && (
        <div className="space-y-6 animate-in fade-in">
          {activeMealPlan ? (
            <div className="space-y-6">
              <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4E6D9]/50 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2D7D46]">Active Nutritional Roadmap</span>
                    <h2 className="font-serif text-2xl font-bold text-[#1C2B20]">{activeMealPlan.title}</h2>
                    <p className="text-xs text-[#5A7060]">
                      Target: ~{activeMealPlan.planData.weeklyAvgCalories} cal/day • Budget: ~${activeMealPlan.planData.estimatedWeeklyCost} / week • {activeMealPlan.servings || 2} servings
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/ai-tools/meal-planner"
                      className="px-4 py-2 bg-[#E8F5EC] hover:bg-[#2D7D46] text-[#2D7D46] hover:text-white rounded-xl text-xs font-semibold transition"
                    >
                      Customize in AI Planner
                    </Link>
                    <button
                      onClick={() => setActiveTab('grocery')}
                      className="px-4 py-2 bg-[#2D7D46] hover:bg-[#1A5C31] text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> View Grocery List
                    </button>
                  </div>
                </div>

                {/* 7 Days Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {activeMealPlan.planData.days.map((d) => (
                    <div key={d.day} className="bg-[#F4F8F5] p-4 rounded-2xl border border-[#D4E6D9] space-y-2.5">
                      <div className="flex justify-between items-center text-xs pb-1 border-b border-[#D4E6D9]/60">
                        <span className="font-bold uppercase text-[#2D7D46]">{d.day}</span>
                        <span className="font-bold text-[#1C2B20] bg-white px-2 py-0.5 rounded-md border border-[#D4E6D9]">{d.totalCalories} kcal</span>
                      </div>
                      <div className="text-xs space-y-1.5 text-[#1C2B20]">
                        <p><strong className="text-[#E07B39]">B:</strong> {d.meals.breakfast?.name} <span className="text-[#5A7060]">({d.meals.breakfast?.calories} cal)</span></p>
                        <p><strong className="text-[#2D7D46]">L:</strong> {d.meals.lunch?.name} <span className="text-[#5A7060]">({d.meals.lunch?.calories} cal)</span></p>
                        <p><strong className="text-[#0369A1]">D:</strong> {d.meals.dinner?.name} <span className="text-[#5A7060]">({d.meals.dinner?.calories} cal)</span></p>
                        {d.meals.snack && (
                          <p><strong className="text-[#7C3AED]">S:</strong> {d.meals.snack?.name} <span className="text-[#5A7060]">({d.meals.snack?.calories} cal)</span></p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#D4E6D9] rounded-3xl p-12 text-center space-y-4 shadow-xs">
              <CalendarDays className="w-12 h-12 text-[#2D7D46] mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-[#1C2B20]">No Active Meal Plan</h3>
              <p className="text-sm text-[#5A7060] max-w-md mx-auto">
                Generate an individualized 7-day nutritional calendar tailored to your dietary restrictions, household budget, and calorie goals.
              </p>
              <Link
                to="/ai-tools/meal-planner"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D7D46] text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-[#1A5C31] transition"
              >
                <Sparkles className="w-4 h-4" /> Create 7-Day Plan
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SUPERMARKET GROCERY LIST */}
      {activeTab === 'grocery' && (
        <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4E6D9]/50 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D7D46]">Aisle-by-Aisle Checklist</span>
              <h2 className="font-serif text-2xl font-bold text-[#1C2B20]">
                {activeGroceryList?.title || "Weekly Supermarket Grocery Checklist"}
              </h2>
              <p className="text-xs text-[#5A7060]">
                Estimated Total: ${activeGroceryList?.estimatedTotal?.toFixed(2) || '75.00'} USD
              </p>
            </div>
            <Link
              to="/ai-tools/grocery"
              className="px-4 py-2 bg-[#2D7D46] hover:bg-[#1A5C31] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Open Grocery Tool
            </Link>
          </div>

          {activeGroceryList ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(activeGroceryList.categories).map(([category, items]) => (
                <div key={category} className="bg-[#F4F8F5] border border-[#D4E6D9] rounded-2xl p-4 space-y-3">
                  <h4 className="font-serif text-base font-bold text-[#1C2B20] capitalize border-b border-[#D4E6D9]/60 pb-1.5">
                    {category}
                  </h4>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => toggleGroceryItem(category as any, item.id)}
                        className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer text-xs transition ${
                          item.checked ? 'bg-white/60 text-[#5A7060]/70 line-through' : 'bg-white text-[#1C2B20] shadow-2xs'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 ${
                            item.checked ? 'bg-[#2D7D46] border-[#2D7D46] text-white' : 'border-[#D4E6D9] bg-white'
                          }`}
                        >
                          {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold">{item.item}</span>
                          <span className="text-[#5A7060] ml-1">({item.amount})</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#5A7060] py-6 text-center">No grocery checklist created yet. Build one from your recipe or meal plan!</p>
          )}
        </div>
      )}

      {/* TAB 5: SAVED ITEMS */}
      {activeTab === 'saved' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Recipes */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#1C2B20]">Saved Recipes ({savedRecipes.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map((r) => (
                <div key={r.id} className="bg-white border border-[#D4E6D9] rounded-2xl overflow-hidden shadow-xs p-4 flex flex-col justify-between">
                  <div>
                    <img src={r.coverImageUrl} alt={r.title} className="w-full h-40 object-cover rounded-xl mb-3" />
                    <Link to={`/recipes/${r.slug}`} className="font-serif text-lg font-bold text-[#1C2B20] hover:text-[#2D7D46] block line-clamp-2">
                      {r.title}
                    </Link>
                    <p className="text-xs text-[#5A7060] mt-1">{r.calories} cal • {r.totalTimeMin} min</p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#D4E6D9]/50 flex justify-between items-center text-xs">
                    <Link to={`/recipes/${r.slug}`} className="font-semibold text-[#2D7D46]">View Recipe</Link>
                    <button onClick={() => toggleSaveRecipe(r)} className="text-red-500 hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div className="space-y-4 pt-6 border-t border-[#D4E6D9]">
            <h2 className="font-serif text-2xl font-bold text-[#1C2B20]">Bookmarked Articles ({savedArticles.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedArticles.map((a) => (
                <div key={a.id} className="bg-white border border-[#D4E6D9] rounded-2xl overflow-hidden shadow-xs p-4 flex flex-col justify-between">
                  <div>
                    <img src={a.coverImageUrl} alt={a.title} className="w-full h-40 object-cover rounded-xl mb-3" />
                    <Link to={`/health-tips/${a.slug}`} className="font-serif text-lg font-bold text-[#1C2B20] hover:text-[#2D7D46] block line-clamp-2">
                      {a.title}
                    </Link>
                    <p className="text-xs text-[#5A7060] mt-1">{a.readingTimeMin} min read • {a.categoryName}</p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#D4E6D9]/50 flex justify-between items-center text-xs">
                    <Link to={`/health-tips/${a.slug}`} className="font-semibold text-[#2D7D46]">Read Guide</Link>
                    <button onClick={() => toggleSaveArticle(a)} className="text-red-500 hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl animate-in fade-in">
          <h2 className="font-serif text-2xl font-bold text-[#1C2B20]">Account & Preferences</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#1C2B20] block mb-1">Name</label>
              <input type="text" defaultValue={user?.name} disabled className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4E6D9] bg-gray-50 text-gray-700" />
            </div>

            <div>
              <label className="font-bold text-[#1C2B20] block mb-1">Email</label>
              <input type="email" defaultValue={user?.email} disabled className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4E6D9] bg-gray-50 text-gray-700" />
            </div>

            <div className="pt-3 border-t border-[#D4E6D9]">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-[#1C2B20]">Measurement Units</p>
                  <p className="text-[#5A7060]">Choose between US standards (cups, oz, tbsp, °F) and Metric.</p>
                </div>
                <button
                  onClick={toggleMeasurementUnit}
                  className="px-4 py-2 rounded-xl bg-[#E8F5EC] text-[#2D7D46] font-bold border border-[#D4E6D9]"
                >
                  {measurementUnit === 'us' ? 'US Units (°F, oz)' : 'Metric (g, ml, °C)'}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4E6D9] flex justify-between items-center">
              <div>
                <p className="font-bold text-sm text-[#1C2B20]">Data Export & Portability</p>
                <p className="text-[#5A7060]">Download a full copy of your saved plans, recipes, and habit logs.</p>
              </div>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-white border border-[#D4E6D9] hover:bg-gray-50 text-[#1C2B20] font-semibold rounded-xl"
              >
                Download JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
