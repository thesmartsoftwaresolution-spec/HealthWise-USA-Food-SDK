import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Article, Recipe } from '../types/index.ts';
import { Badge } from '../components/common/Badge.tsx';
import { Search as SearchIcon, BookOpen, Utensils, Clock, Heart, ArrowRight, Star, ArrowUpDown } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const currentTab = searchParams.get('tab') || 'all';

  const [input, setInput] = useState(query);
  const [articles, setArticles] = useState<Article[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'time' | 'cost'>('relevance');
  const [isLoading, setIsLoading] = useState(false);
  const { isArticleSaved, toggleSaveArticle, isRecipeSaved, toggleSaveRecipe } = useApp();

  useEffect(() => {
    setInput(query);
    if (!query.trim()) {
      setArticles([]);
      setRecipes([]);
      return;
    }

    setIsLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query.trim())}&type=all`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setArticles(data.data.articles || []);
          setRecipes(data.data.recipes || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setSearchParams({ q: input.trim(), tab: currentTab });
    }
  };

  const setTab = (t: string) => {
    setSearchParams({ q: query, tab: t });
  };

  const totalResults =
    currentTab === 'articles'
      ? articles.length
      : currentTab === 'recipes'
      ? recipes.length
      : articles.length + recipes.length;

  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortBy === 'time') return a.totalTimeMin - b.totalTimeMin;
    if (sortBy === 'cost') return a.costPerServing - b.costPerServing;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Search Header */}
      <div className="bg-[#E8F5EC] border border-[#D4E6D9] rounded-3xl p-8 sm:p-10 space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2B20]">
          Search Health & Nutrition
        </h1>

        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-[#5A7060]" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search by topic, condition, recipe, or ingredient..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] text-sm focus:ring-2 focus:ring-[#2D7D46] shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#2D7D46] hover:bg-[#1A5C31] text-white text-sm font-semibold rounded-xl transition shadow-xs cursor-pointer"
          >
            Search
          </button>
        </form>

        {query && (
          <p className="text-xs text-[#5A7060]">
            Showing {totalResults} result{totalResults === 1 ? '' : 's'} for &ldquo;<strong>{query}</strong>&rdquo;
          </p>
        )}
      </div>

      {/* Tabs & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4E6D9] pb-1">
        <div className="flex gap-4 text-sm font-semibold">
          <button
            onClick={() => setTab('all')}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              currentTab === 'all'
                ? 'border-[#2D7D46] text-[#2D7D46]'
                : 'border-transparent text-[#5A7060] hover:text-[#1C2B20]'
            }`}
          >
            All Results ({articles.length + recipes.length})
          </button>
          <button
            onClick={() => setTab('articles')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'articles'
                ? 'border-[#2D7D46] text-[#2D7D46]'
                : 'border-transparent text-[#5A7060] hover:text-[#1C2B20]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Articles ({articles.length})</span>
          </button>
          <button
            onClick={() => setTab('recipes')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'recipes'
                ? 'border-[#2D7D46] text-[#2D7D46]'
                : 'border-transparent text-[#5A7060] hover:text-[#1C2B20]'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Recipes ({recipes.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#5A7060] pb-2 sm:pb-0">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span className="font-semibold">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2 py-1 rounded-lg border border-[#D4E6D9] bg-white text-[#1C2B20] text-xs"
          >
            <option value="relevance">Most Relevant</option>
            <option value="time">Fastest Cook Time</option>
            <option value="cost">Lowest Cost / Serving</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm text-[#5A7060]">Searching database...</div>
      ) : totalResults === 0 && query ? (
        <div className="bg-white border border-[#D4E6D9] rounded-2xl p-12 text-center space-y-3">
          <p className="font-serif text-xl font-bold text-[#1C2B20]">No results found for &ldquo;{query}&rdquo;</p>
          <p className="text-xs text-[#5A7060]">Try searching for &ldquo;blood pressure&rdquo;, &ldquo;oats&rdquo;, &ldquo;salmon&rdquo;, or &ldquo;fiber&rdquo;.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Articles Section */}
          {(currentTab === 'all' || currentTab === 'articles') && articles.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#1C2B20] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2D7D46]" /> Health Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((art) => (
                  <article
                    key={art.id}
                    className="bg-white border border-[#D4E6D9] rounded-2xl overflow-hidden p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div>
                      <Badge variant="category" size="sm">{art.categoryName}</Badge>
                      <Link to={`/health-tips/${art.slug}`}>
                        <h4 className="font-serif text-lg font-bold text-[#1C2B20] group-hover:text-[#2D7D46] transition mt-2">
                          {art.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-[#5A7060] mt-2 line-clamp-2">{art.excerpt}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-[#D4E6D9]/50 flex items-center justify-between text-xs text-[#5A7060]">
                      <span>{art.readingTimeMin} min read</span>
                      <Link to={`/health-tips/${art.slug}`} className="font-semibold text-[#2D7D46] hover:underline">
                        Read &rarr;
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Recipes Section */}
          {(currentTab === 'all' || currentTab === 'recipes') && sortedRecipes.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#1C2B20] flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#E07B39]" /> Healthy Recipes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedRecipes.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white border border-[#D4E6D9] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition p-3.5 flex flex-col justify-between group"
                  >
                    <div>
                      <img
                        src={rec.coverImageUrl}
                        alt={rec.title}
                        className="w-full h-36 object-cover rounded-xl mb-3"
                      />
                      <div className="flex items-center justify-between text-xs text-[#5A7060] mb-1">
                        <span>{rec.totalTimeMin} min</span>
                        <span className="flex items-center gap-0.5 text-[#E07B39] font-bold text-[11px]">
                          <Star className="w-3 h-3 fill-[#E07B39]" /> {rec.rating ? rec.rating.toFixed(1) : '4.8'}
                        </span>
                        <span className="font-bold text-[#2D7D46]">${rec.costPerServing.toFixed(2)}</span>
                      </div>
                      <Link to={`/recipes/${rec.slug}`}>
                        <h4 className="font-serif text-base font-bold text-[#1C2B20] group-hover:text-[#2D7D46] transition line-clamp-2">
                          {rec.title}
                        </h4>
                      </Link>
                    </div>
                    <div className="pt-2 mt-2 border-t border-[#D4E6D9]/50 text-xs font-semibold text-[#2D7D46]">
                      <Link to={`/recipes/${rec.slug}`} className="hover:underline">
                        View Recipe &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
