import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Recipe } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { Badge } from '../components/common/Badge.tsx';
import {
  Clock,
  Heart,
  Search as SearchIcon,
  ArrowRight,
  Utensils,
  Filter,
  DollarSign,
  Zap,
  Star
} from 'lucide-react';

export const Recipes: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';
  const currentDiet = searchParams.get('diet') || 'all';
  const currentMaxTime = searchParams.get('maxTime') || '';

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toggleSaveRecipe, isRecipeSaved } = useApp();

  const dietaryOptions = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'High-Protein', 'Budget'];

  useEffect(() => {
    setIsLoading(true);
    let url = `/api/recipes?limit=40`;
    if (currentCategory && currentCategory !== 'all') {
      url += `&category=${encodeURIComponent(currentCategory)}`;
    }
    if (currentDiet && currentDiet !== 'all') {
      url += `&dietary=${encodeURIComponent(currentDiet)}`;
    }
    if (currentMaxTime) {
      url += `&maxTime=${encodeURIComponent(currentMaxTime)}`;
    }
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecipes(data.data || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [currentCategory, currentDiet, currentMaxTime, searchQuery]);

  const handleSelectDiet = (diet: string) => {
    if (diet.toLowerCase() === 'all') {
      searchParams.delete('diet');
    } else {
      searchParams.set('diet', diet.toLowerCase());
    }
    setSearchParams(searchParams);
  };

  const handleSelectMaxTime = (time: string) => {
    if (!time) {
      searchParams.delete('maxTime');
    } else {
      searchParams.set('maxTime', time);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header Banner */}
      <div className="bg-[#FDF0E6] border border-[#FED7AA] rounded-3xl p-8 sm:p-10">
        <div className="max-w-2xl space-y-3">
          <Badge variant="quick">Nutritious American Kitchen</Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C2B20]">
            Wholesome, Budget-Friendly Recipes
          </h1>
          <p className="text-sm sm:text-base text-[#5A7060] leading-relaxed">
            Real home cooking using everyday US supermarket ingredients. Filter by dietary lifestyle, prep time under 30 minutes, or affordable meals under $3 per serving.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-4 bg-white p-5 rounded-2xl border border-[#D4E6D9] shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Dietary Lifestyle Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-[#5A7060] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Diet:
            </span>
            {dietaryOptions.map((opt) => {
              const active =
                currentDiet.toLowerCase() === opt.toLowerCase() ||
                (currentDiet === 'all' && opt === 'All');
              return (
                <button
                  key={opt}
                  onClick={() => handleSelectDiet(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? 'bg-[#E07B39] text-white shadow-xs'
                      : 'bg-[#F4F8F5] border border-[#D4E6D9] text-[#1C2B20] hover:bg-gray-100'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Search bar inside recipes */}
          <div className="relative w-full lg:w-80 shrink-0">
            <SearchIcon className="absolute left-3.5 top-3 w-4 h-4 text-[#5A7060]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, ingredients..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] placeholder:text-[#5A7060]/70 focus:outline-none focus:border-[#2D7D46] focus:ring-1 focus:ring-[#2D7D46]"
            />
          </div>
        </div>

        {/* Secondary filters: Time & Cost shortcuts */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D4E6D9]/50 text-xs">
          <span className="font-semibold text-[#5A7060] mr-1">Quick Filters:</span>
          <button
            onClick={() => handleSelectMaxTime(currentMaxTime === '30' ? '' : '30')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
              currentMaxTime === '30'
                ? 'bg-[#2D7D46] text-white font-semibold'
                : 'bg-gray-100 hover:bg-gray-200 text-[#1C2B20]'
            }`}
          >
            <Clock className="w-3 h-3" /> Under 30 Minutes
          </button>
          <button
            onClick={() => handleSelectMaxTime(currentMaxTime === '20' ? '' : '20')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
              currentMaxTime === '20'
                ? 'bg-[#2D7D46] text-white font-semibold'
                : 'bg-gray-100 hover:bg-gray-200 text-[#1C2B20]'
            }`}
          >
            <Zap className="w-3 h-3 text-[#E07B39]" /> Fast &lt; 20 Min
          </button>
          <Link
            to="/ai-tools/recipe"
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#E07B39] hover:underline"
          >
            <span>Have specific ingredients? Try AI Recipe Generator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recipes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white border border-[#D4E6D9] rounded-2xl h-80 animate-pulse p-4 space-y-3">
              <div className="bg-gray-200 h-44 rounded-xl" />
              <div className="bg-gray-200 h-4 w-3/4 rounded-sm" />
              <div className="bg-gray-200 h-3 w-1/2 rounded-sm" />
            </div>
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="bg-white border border-[#D4E6D9] rounded-2xl p-12 text-center space-y-3">
          <Utensils className="w-10 h-10 text-[#5A7060] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#1C2B20]">No recipes matched your filters</h3>
          <p className="text-sm text-[#5A7060]">
            Try relaxing your time or dietary preferences to see more dishes.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleSelectDiet('all');
              handleSelectMaxTime('');
            }}
            className="px-4 py-2 bg-[#2D7D46] text-white text-xs font-semibold rounded-lg hover:bg-[#1A5C31] transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    {recipe.dietaryTags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="vegetarian" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <button
                    onClick={() => toggleSaveRecipe(recipe)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#1C2B20] hover:text-[#E07B39] transition shadow-xs cursor-pointer"
                    aria-label={isSaved ? 'Remove from saved' : 'Save recipe'}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#E07B39] text-[#E07B39]' : ''}`} />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#5A7060] mb-2">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" /> {recipe.totalTimeMin} min
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#E07B39]">
                        <Star className="w-3 h-3 fill-[#E07B39] text-[#E07B39]" />
                        <span>{recipe.rating ? recipe.rating.toFixed(1) : '4.8'}</span>
                      </div>
                      <span className="font-semibold text-[#2D7D46]">
                        ${recipe.costPerServing.toFixed(2)}/serv
                      </span>
                    </div>

                    <Link to={`/recipes/${recipe.slug}`}>
                      <h3 className="font-serif text-lg font-bold text-[#1C2B20] group-hover:text-[#2D7D46] transition-colors line-clamp-2 leading-snug">
                        {recipe.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#5A7060] mt-2 line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs py-1.5 px-2.5 bg-[#F4F8F5] rounded-lg">
                      <span className="font-bold text-[#1C2B20]">{recipe.calories} cal</span>
                      <span className="text-[#5A7060] font-medium">{recipe.proteinG}g protein</span>
                      <span className="text-[#5A7060] font-medium">{recipe.carbsG}g carbs</span>
                    </div>
                  </div>

                  <Link
                    to={`/recipes/${recipe.slug}`}
                    className="w-full py-2 bg-[#E8F5EC] hover:bg-[#2D7D46] text-[#2D7D46] hover:text-white rounded-lg text-xs font-semibold text-center transition flex items-center justify-center gap-1"
                  >
                    <span>View Recipe Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
