import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Article, Category } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { Badge } from '../components/common/Badge.tsx';
import { Clock, Bookmark, Search as SearchIcon, ArrowRight, BookOpen } from 'lucide-react';

export const HealthTips: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toggleSaveArticle, isArticleSaved } = useApp();

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then(() => {
        // Fetch categories from database via articles / seed
        const seedCats: Category[] = [
          { id: 0, name: 'All Categories', slug: 'all', type: 'both', icon: '✨' },
          { id: 1, name: 'Nutrition & Diet', slug: 'nutrition', type: 'article', icon: '🥗' },
          { id: 2, name: 'Heart & Longevity', slug: 'heart-health', type: 'article', icon: '❤️' },
          { id: 3, name: 'Fitness & Movement', slug: 'fitness', type: 'article', icon: '🏃' },
          { id: 4, name: 'Sleep & Recovery', slug: 'sleep', type: 'article', icon: '😴' },
          { id: 5, name: 'Stress & Mental Health', slug: 'stress', type: 'article', icon: '🧘' },
          { id: 6, name: 'Weight Management', slug: 'weight', type: 'article', icon: '⚖️' }
        ];
        setCategories(seedCats);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    let url = `/api/articles?limit=30`;
    if (currentCategory && currentCategory !== 'all') {
      url += `&category=${encodeURIComponent(currentCategory)}`;
    }
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setArticles(data.data || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [currentCategory, searchQuery]);

  const handleSelectCategory = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header banner */}
      <div className="bg-[#E8F5EC] border border-[#D4E6D9] rounded-3xl p-8 sm:p-10">
        <div className="max-w-2xl space-y-3">
          <Badge variant="category">Evidence-Based Wellness</Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C2B20]">
            Health & Nutrition Articles
          </h1>
          <p className="text-sm sm:text-base text-[#5A7060] leading-relaxed">
            Clear, honest health guidance written in plain American English. Grounded in CDC, USDA, and NIH clinical research with zero commercial gimmickry.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-none">
          {categories.map((cat) => {
            const isSelected = (currentCategory === cat.slug) || (currentCategory === 'all' && cat.slug === 'all');
            return (
              <button
                key={cat.slug}
                onClick={() => handleSelectCategory(cat.slug)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2D7D46] text-white shadow-xs'
                    : 'bg-white border border-[#D4E6D9] text-[#1C2B20] hover:bg-[#E8F5EC]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search inside articles */}
        <div className="relative w-full md:w-72 shrink-0">
          <SearchIcon className="absolute left-3.5 top-3 w-4 h-4 text-[#5A7060]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search health tips..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] placeholder:text-[#5A7060]/70 focus:outline-none focus:border-[#2D7D46] focus:ring-1 focus:ring-[#2D7D46]"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white border border-[#D4E6D9] rounded-2xl h-80 animate-pulse p-4 space-y-4">
              <div className="bg-gray-200 h-44 rounded-xl" />
              <div className="bg-gray-200 h-4 w-3/4 rounded-sm" />
              <div className="bg-gray-200 h-3 w-1/2 rounded-sm" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white border border-[#D4E6D9] rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[#5A7060] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#1C2B20]">No articles found</h3>
          <p className="text-sm text-[#5A7060]">
            Try adjusting your search terms or picking another health category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleSelectCategory('all');
            }}
            className="px-4 py-2 bg-[#2D7D46] text-white text-xs font-semibold rounded-lg hover:bg-[#1A5C31] transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => {
            const isSaved = isArticleSaved(article.id);
            return (
              <article
                key={article.id}
                className="bg-white border border-[#D4E6D9] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                <div className="relative h-52 overflow-hidden">
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
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#1C2B20] hover:text-[#2D7D46] transition shadow-xs cursor-pointer"
                    aria-label={isSaved ? 'Remove from saved' : 'Save article'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#2D7D46] text-[#2D7D46]' : ''}`} />
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7060] mb-2.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readingTimeMin} min read</span>
                      <span>•</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <Link to={`/health-tips/${article.slug}`}>
                      <h3 className="font-serif text-xl font-bold text-[#1C2B20] group-hover:text-[#2D7D46] transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-[#5A7060] mt-2.5 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#D4E6D9]/60 flex items-center justify-between text-xs text-[#5A7060]">
                    <span className="font-medium truncate max-w-[170px]">{article.authorName}</span>
                    <Link
                      to={`/health-tips/${article.slug}`}
                      className="font-semibold text-[#2D7D46] hover:text-[#1A5C31] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
