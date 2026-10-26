import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Article, Recipe, SiteSettings } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { Badge } from '../components/common/Badge.tsx';
import { Button } from '../components/common/Button.tsx';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Bookmark,
  Utensils,
  BookOpen,
  DollarSign,
  Heart,
  ChevronRight,
  CheckCircle2,
  CalendarDays,
  Bot
} from 'lucide-react';

export const Home: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toggleSaveArticle, isArticleSaved, toggleSaveRecipe, isRecipeSaved } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then((res) => res.json()),
      fetch('/api/articles?limit=4').then((res) => res.json()),
      fetch('/api/recipes?limit=4').then((res) => res.json())
    ])
      .then(([settingsData, articlesData, recipesData]) => {
        if (settingsData.success) setSettings(settingsData.settings);
        if (articlesData.success) setArticles(articlesData.data);
        if (recipesData.success) setRecipes(recipesData.data);
      })
      .catch((err) => console.error('Error fetching home data:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-[#1C2B20] text-white shadow-xl mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6">
        <div className="absolute inset-0 z-0 opacity-35 bg-[radial-gradient(#2D7D46_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#2D7D46]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5EC]/15 border border-[#E8F5EC]/30 text-xs font-semibold text-[#84D49B] tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evidence-Based American Wellness</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {settings?.heroHeadline || 'Eat Well. Feel Great. Real Health for Everyday Americans.'}
            </h1>

            <p className="text-base sm:text-lg text-[#E8F5EC]/85 leading-relaxed max-w-xl">
              {settings?.heroSubtext ||
                'Practical nutrition science, budget-friendly meals under $3, and high-intelligence AI tools to empower your family health journey.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="accent"
                size="lg"
                onClick={() => navigate('/ai-tools/meal-planner')}
                icon={<CalendarDays className="w-5 h-5" />}
              >
                {settings?.heroCtaText || 'Generate 7-Day Meal Plan'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="text-white border-white/50 hover:bg-white/10"
                onClick={() => navigate('/recipes')}
                icon={<Utensils className="w-5 h-5" />}
              >
                Browse Healthy Recipes
              </Button>
            </div>

            {/* Micro proof badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#E8F5EC]/70">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#84D49B]" /> 100% Free AI Tools
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#84D49B]" /> CDC & USDA Nutrition Guidelines
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#84D49B]" /> US Grocery Store Staples
              </span>
            </div>
          </div>

          {/* Hero Featured Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 text-left">
              <div className="relative h-56 rounded-xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
                  alt="Fresh Mediterranean Salad with Greens and Herbs"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="category" className="bg-white/90 text-[#2D7D46] backdrop-blur-sm border-0 font-bold">
                    Featured Nutrition
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#84D49B] uppercase tracking-wider">
                  Featured Daily Focus
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1">
                  The Power of Micronutrient Diversity
                </h3>
                <p className="text-xs text-[#E8F5EC]/80 mt-1 line-clamp-2">
                  Consuming 30 distinct plant types weekly optimizes the gut microbiome, lowers systemic inflammation, and regulates mood through microbial short-chain fatty acids.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#E8F5EC]/70">6 min read • Reviewed by MD</span>
                <Link
                  to="/health-tips/gut-brain-axis-microbiome-fiber-stress"
                  className="text-xs font-semibold text-[#84D49B] hover:text-white flex items-center gap-1 transition"
                >
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DAILY HIGHLIGHT BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#E8F5EC] border border-[#D4E6D9] rounded-2xl p-6 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#D4E6D9]">
            {/* Daily Tip */}
            <div className="space-y-2 text-left md:pr-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2D7D46]">
                <span className="text-lg" role="img" aria-label="Bulb">💡</span>
                <span>Today&rsquo;s Health Tip</span>
              </div>
              <p className="text-sm font-medium text-[#1C2B20] leading-snug">
                {settings?.dailyTip ||
                  'Swapping refined carbohydrates for whole grains like oats or quinoa prevents post-meal glucose spikes.'}
              </p>
              <Link to="/health-tips" className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D7D46] hover:underline pt-1">
                More health tips <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Healthy Food of the Day */}
            <div className="space-y-2 text-left pt-4 md:pt-0 md:px-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2D7D46]">
                <span className="text-lg" role="img" aria-label="Fish">🐟</span>
                <span>Healthy Food of the Day</span>
              </div>
              <p className="text-sm font-bold text-[#1C2B20]">
                {settings?.healthyFoodOfDay?.name || 'Wild Alaskan Salmon'}
              </p>
              <p className="text-xs text-[#5A7060] line-clamp-2">
                {settings?.healthyFoodOfDay?.benefits ||
                  'Rich in EPA & DHA Omega-3 fatty acids, clinically shown to lower systemic inflammation.'}
              </p>
              <span className="inline-block text-[11px] font-semibold text-[#E07B39]">
                {settings?.healthyFoodOfDay?.calorieSnippet || '206 kcal & 22g protein per 3 oz'}
              </span>
            </div>

            {/* Quick Recipe Spotlight */}
            <div className="space-y-2 text-left pt-4 md:pt-0 md:pl-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E07B39]">
                <span className="text-lg" role="img" aria-label="Pan">🍳</span>
                <span>Quick Dinner Under 25 Min</span>
              </div>
              <p className="text-sm font-bold text-[#1C2B20]">
                Sheet-Pan Lemon Herb Salmon & Asparagus
              </p>
              <p className="text-xs text-[#5A7060]">
                38g protein • 420 cal • Easy cleanup on a single baking sheet.
              </p>
              <Link
                to="/recipes/sheet-pan-lemon-herb-salmon-asparagus"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#E07B39] hover:underline pt-1"
              >
                Cook this tonight <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRENDING HEALTH ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D4E6D9] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D7D46]">
              Evidence-Based Insights
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1C2B20] mt-1">
              This Week&rsquo;s Top Health Tips
            </h2>
            <p className="text-sm text-[#5A7060] mt-1">
              Grounded in CDC, USDA, and NIH nutritional research. Written in plain English.
            </p>
          </div>
          <Link
            to="/health-tips"
            className="text-sm font-semibold text-[#2D7D46] hover:text-[#1A5C31] flex items-center gap-1 shrink-0"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => {
            const isSaved = isArticleSaved(article.id);
            return (
              <article
                key={article.id}
                className="bg-white border border-[#D4E6D9] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={article.coverImageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="category">{article.categoryName}</Badge>
                  </div>
                  <button
                    onClick={() => toggleSaveArticle(article)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#1C2B20] hover:text-[#2D7D46] transition shadow-xs"
                    aria-label={isSaved ? 'Remove from saved' : 'Save article'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#2D7D46] text-[#2D7D46]' : ''}`} />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7060] mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readingTimeMin} min read</span>
                    </div>
                    <Link to={`/health-tips/${article.slug}`}>
                      <h3 className="font-serif text-lg font-bold text-[#1C2B20] group-hover:text-[#2D7D46] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#5A7060] mt-2 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D4E6D9]/50 flex items-center justify-between text-xs text-[#5A7060]">
                    <span className="truncate max-w-[150px]">{article.authorName}</span>
                    <Link
                      to={`/health-tips/${article.slug}`}
                      className="font-semibold text-[#2D7D46] hover:underline"
                    >
                      Read &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. AI TOOLS HUB PROMO BANNER */}
      <section className="bg-[#1C2B20] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E07B39]/20 border border-[#E07B39]/40 text-xs font-bold text-[#E07B39] uppercase tracking-wider">
              <Bot className="w-4 h-4" /> Powered by Deep Intelligence AI
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Try Our Free AI Health & Meal Tools
            </h2>
            <p className="text-sm text-[#E8F5EC]/80 leading-relaxed">
              No guesswork. From custom 7-day family meal plans to analyzing your favorite recipes, our AI works with real American grocery staples.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Tool 1 */}
            <Link
              to="/ai-tools/meal-planner"
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-6 transition group space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#2D7D46] flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">AI Meal Planner</h3>
                <p className="text-xs text-[#E8F5EC]/75 mt-2 leading-relaxed">
                  Personalized 7-day meal plan tailored to your dietary goals, calorie targets, and weekly grocery budget.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#84D49B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Plan My Week &rarr;
              </span>
            </Link>

            {/* Tool 2 */}
            <Link
              to="/ai-tools/recipe"
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-6 transition group space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#E07B39] flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">Recipe Generator</h3>
                <p className="text-xs text-[#E8F5EC]/75 mt-2 leading-relaxed">
                  What&rsquo;s in your fridge? Enter 3+ ingredients and get wholesome, chef-tested dinner recipes with instructions.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#E07B39] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Generate Recipes &rarr;
              </span>
            </Link>

            {/* Tool 3 */}
            <Link
              to="/ai-tools/chat"
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-6 transition group space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#2D7D46] flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">Wellness Assistant</h3>
                <p className="text-xs text-[#E8F5EC]/75 mt-2 leading-relaxed">
                  Ask deep wellness, vitamin, and metabolic questions. Grounded in peer-reviewed science with clear explanations.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#84D49B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Ask a Question &rarr;
              </span>
            </Link>

            {/* Tool 4 */}
            <Link
              to="/ai-tools/nutrition"
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-6 transition group space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0369A1] flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">Nutrition Analyzer</h3>
                <p className="text-xs text-[#E8F5EC]/75 mt-2 leading-relaxed">
                  Paste any recipe ingredient list to estimate calories, protein, carbs, fat, fiber, and micronutrients per serving.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#84D49B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Analyze Dish &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. POPULAR RECIPES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D4E6D9] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E07B39]">
              Wholesome Cooking
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1C2B20] mt-1">
              Healthy Recipes Americans Love
            </h2>
            <p className="text-sm text-[#5A7060] mt-1">
              Easy, delicious family meals with complete macros, budget estimates, and US measurements.
            </p>
          </div>
          <Link
            to="/recipes"
            className="text-sm font-semibold text-[#2D7D46] hover:text-[#1A5C31] flex items-center gap-1 shrink-0"
          >
            <span>Explore All Recipes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => {
            const isSaved = isRecipeSaved(recipe.id);
            return (
              <div
                key={recipe.id}
                className="bg-white border border-[#D4E6D9] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={recipe.coverImageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {recipe.dietaryTags.slice(0, 1).map((tag) => (
                      <Badge key={tag} variant="vegetarian" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <button
                    onClick={() => toggleSaveRecipe(recipe)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#1C2B20] hover:text-[#E07B39] transition shadow-xs"
                    aria-label={isSaved ? 'Remove from saved' : 'Save recipe'}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#E07B39] text-[#E07B39]' : ''}`} />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#5A7060] mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {recipe.totalTimeMin} min
                      </span>
                      <span className="font-semibold text-[#2D7D46]">
                        ${recipe.costPerServing.toFixed(2)}/serving
                      </span>
                    </div>

                    <Link to={`/recipes/${recipe.slug}`}>
                      <h3 className="font-serif text-lg font-bold text-[#1C2B20] group-hover:text-[#2D7D46] transition-colors line-clamp-2">
                        {recipe.title}
                      </h3>
                    </Link>

                    <div className="mt-3 flex items-center justify-between text-xs py-1.5 px-2.5 bg-[#F4F8F5] rounded-lg">
                      <span className="font-semibold text-[#1C2B20]">{recipe.calories} cal</span>
                      <span className="text-[#5A7060]">{recipe.proteinG}g protein</span>
                      <span className="text-[#5A7060]">{recipe.fiberG}g fiber</span>
                    </div>
                  </div>

                  <Link
                    to={`/recipes/${recipe.slug}`}
                    className="w-full py-2 bg-[#E8F5EC] hover:bg-[#2D7D46] text-[#2D7D46] hover:text-white rounded-lg text-xs font-semibold text-center transition flex items-center justify-center gap-1"
                  >
                    <span>View Recipe & Instructions</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
