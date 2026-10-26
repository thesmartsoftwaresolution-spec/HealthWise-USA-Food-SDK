import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, BookOpen, Utensils, ArrowRight } from 'lucide-react';
import { Article, Recipe } from '../../types/index.ts';

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  onSelect?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search articles, recipes, vitamins, ingredients...',
  autoFocus = false,
  className = '',
  onSelect
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{ articles: Article[]; recipes: Recipe[] }>({ articles: [], recipes: [] });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ articles: [], recipes: [] });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success) {
          setResults({ articles: data.data.articles || [], recipes: data.data.recipes || [] });
          setIsOpen(true);
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsOpen(false);
      if (onSelect) onSelect();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectArticle = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    if (onSelect) onSelect();
    navigate(`/health-tips/${slug}`);
  };

  const handleSelectRecipe = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    if (onSelect) onSelect();
    navigate(`/recipes/${slug}`);
  };

  const handleSeeAll = () => {
    setIsOpen(false);
    if (onSelect) onSelect();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const totalResults = results.articles.length + results.recipes.length;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-3.5 w-4 h-4 text-[#5A7060] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] placeholder:text-[#5A7060]/70 focus:outline-none focus:border-[#2D7D46] focus:ring-2 focus:ring-[#2D7D46]/20 transition-all shadow-xs"
          aria-label="Search HealthWise content"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 p-1 text-[#5A7060] hover:text-[#1C2B20] transition"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#D4E6D9] z-50 overflow-hidden divide-y divide-[#D4E6D9]/50 animate-in fade-in slide-in-from-top-1 duration-150">
          {isLoading && (
            <div className="p-4 text-center text-sm text-[#5A7060]">
              Searching articles and recipes...
            </div>
          )}

          {!isLoading && totalResults === 0 && (
            <div className="p-6 text-center">
              <p className="text-sm font-medium text-[#1C2B20]">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#5A7060] mt-1">Try keywords like &ldquo;blood pressure&rdquo;, &ldquo;oats&rdquo;, &ldquo;salmon&rdquo;, or &ldquo;fiber&rdquo;.</p>
            </div>
          )}

          {!isLoading && results.articles.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5A7060] uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-[#2D7D46]" />
                <span>Health Articles</span>
              </div>
              <div className="space-y-1 mt-1">
                {results.articles.slice(0, 4).map((art) => (
                  <button
                    key={art.id}
                    onClick={() => handleSelectArticle(art.slug)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#E8F5EC] transition flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1C2B20] group-hover:text-[#1A5C31] truncate">
                        {art.title}
                      </p>
                      <p className="text-xs text-[#5A7060] truncate">{art.categoryName} • {art.readingTimeMin} min read</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2D7D46] opacity-0 group-hover:opacity-100 transition shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isLoading && results.recipes.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5A7060] uppercase tracking-wider">
                <Utensils className="w-3.5 h-3.5 text-[#E07B39]" />
                <span>Healthy Recipes</span>
              </div>
              <div className="space-y-1 mt-1">
                {results.recipes.slice(0, 4).map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => handleSelectRecipe(rec.slug)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FDF0E6] transition flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1C2B20] group-hover:text-[#E07B39] truncate">
                        {rec.title}
                      </p>
                      <p className="text-xs text-[#5A7060] truncate">{rec.calories} cal • {rec.totalTimeMin} min • ${rec.costPerServing.toFixed(2)}/serving</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E07B39] opacity-0 group-hover:opacity-100 transition shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {totalResults > 0 && (
            <div className="p-2.5 bg-[#F4F8F5] text-center">
              <button
                onClick={handleSeeAll}
                className="text-xs font-semibold text-[#2D7D46] hover:text-[#1A5C31] flex items-center justify-center gap-1.5 mx-auto py-1"
              >
                <span>View all results for &ldquo;{query}&rdquo;</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
