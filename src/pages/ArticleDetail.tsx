import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Article } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { Badge } from '../components/common/Badge.tsx';
import { AdBanner } from '../components/common/AdBanner.tsx';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer.tsx';
import {
  Clock,
  Calendar,
  Bookmark,
  Share2,
  Check,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

export const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { toggleSaveArticle, isArticleSaved, showToast } = useApp();

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/articles/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setArticle(data.data);
          setRelatedArticles(data.data.relatedArticles || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    showToast('Article link copied to clipboard!', 'info');
    setTimeout(() => setIsCopied(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-sm w-3/4 mx-auto" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="h-4 bg-gray-200 rounded-sm w-full" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-[#1C2B20]">Article Not Found</h2>
        <p className="text-sm text-[#5A7060]">The article you requested could not be located.</p>
        <Link
          to="/health-tips"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D7D46] text-white rounded-lg text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Health Tips
        </Link>
      </div>
    );
  }

  const isSaved = isArticleSaved(article.id);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#5A7060]">
        <Link to="/" className="hover:text-[#2D7D46]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/health-tips" className="hover:text-[#2D7D46]">Health Tips</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1C2B20] font-medium truncate max-w-[200px]">{article.categoryName}</span>
      </nav>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="category">{article.categoryName}</Badge>
          <span className="text-xs text-[#5A7060] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readingTimeMin} min read
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C2B20] leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-[#5A7060] leading-relaxed">
          {article.excerpt}
        </p>

        {/* Authorship & Trust Signals */}
        <div className="pt-2 pb-4 border-b border-[#D4E6D9] flex flex-wrap items-center justify-between gap-4 text-xs text-[#5A7060]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8F5EC] text-[#2D7D46] flex items-center justify-center font-bold text-sm">
              {article.authorName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-[#1C2B20]">{article.authorName}</p>
              {article.medicalReviewer && (
                <p className="text-[#2D7D46] flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Medically reviewed by {article.medicalReviewer}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Published {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <button
              onClick={() => toggleSaveArticle(article)}
              className={`p-2 rounded-xl border flex items-center gap-1.5 transition text-xs font-semibold ${
                isSaved
                  ? 'bg-[#E8F5EC] border-[#2D7D46] text-[#2D7D46]'
                  : 'bg-white border-[#D4E6D9] text-[#1C2B20] hover:bg-gray-50'
              }`}
              aria-label={isSaved ? 'Remove from saved' : 'Save article'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#2D7D46]' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl border border-[#D4E6D9] bg-white text-[#1C2B20] hover:bg-gray-50 transition text-xs font-semibold flex items-center gap-1.5"
              aria-label="Share article"
            >
              {isCopied ? <Check className="w-4 h-4 text-[#2D7D46]" /> : <Share2 className="w-4 h-4" />}
              <span>{isCopied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-md max-h-[440px]">
        <img
          src={article.coverImageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Key Takeaways Box (Green Card) */}
      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
        <div className="bg-[#E8F5EC] border-2 border-[#2D7D46]/30 rounded-2xl p-6 sm:p-7 space-y-3">
          <h3 className="font-serif text-xl font-bold text-[#1A5C31] flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="Key">🔑</span> Key Clinical Takeaways
          </h3>
          <ul className="space-y-2">
            {article.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-[#1C2B20]">
                <span className="w-5 h-5 rounded-full bg-[#2D7D46] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Article Body */}
      <div
        className="prose prose-green max-w-[680px] mx-auto text-[#1C2B20] text-base leading-[28px] space-y-6"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* In-Article Advertisement slot */}
      <AdBanner slot="article-inline" />

      {/* Research References / Trusted Sources */}
      {article.references && article.references.length > 0 && (
        <div className="bg-white border border-[#D4E6D9] rounded-2xl p-6 space-y-3">
          <h3 className="font-serif text-lg font-bold text-[#1C2B20] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#2D7D46]" /> Research References & Trusted Sources
          </h3>
          <p className="text-xs text-[#5A7060]">
            HealthWise USA only cites peer-reviewed clinical studies, federal health institutions, and accredited dietary standards.
          </p>
          <ul className="space-y-2 pt-1">
            {article.references.map((ref) => (
              <li key={ref.id} className="text-xs flex items-center justify-between gap-3 text-[#5A7060] pb-1.5 border-b border-[#D4E6D9]/40 last:border-0">
                <span className="font-medium text-[#1C2B20]">{ref.title}</span>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#2D7D46] hover:underline font-semibold shrink-0"
                >
                  <span>{ref.source}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Medical & FDA Disclaimer Box */}
      <MedicalDisclaimer
        variant="inline"
        sourceCitation={article.medicalReviewer ? `Clinically Reviewed by ${article.medicalReviewer}` : 'Peer-Reviewed Clinical Sources'}
      />

      {/* Bottom Sharing & Action Bar */}
      <div className="p-6 bg-white border border-[#D4E6D9] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-serif text-lg font-bold text-[#1C2B20]">Find this guide helpful?</h4>
          <p className="text-xs text-[#5A7060]">Save it to your dashboard or share it with a friend.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toggleSaveArticle(article)}
            className="px-4 py-2 bg-[#2D7D46] hover:bg-[#1A5C31] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            <span>{isSaved ? 'Saved in Dashboard' : 'Bookmark Article'}</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-white border border-[#D4E6D9] hover:bg-gray-50 text-[#1C2B20] text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="pt-8 space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#1C2B20]">Related Health Guides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                to={`/health-tips/${rel.slug}`}
                className="bg-white border border-[#D4E6D9] rounded-2xl overflow-hidden p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <img
                    src={rel.coverImageUrl}
                    alt={rel.title}
                    className="w-full h-32 object-cover rounded-xl mb-3"
                  />
                  <Badge variant="category" size="sm">{rel.categoryName}</Badge>
                  <h4 className="font-serif text-base font-bold text-[#1C2B20] group-hover:text-[#2D7D46] transition-colors mt-2 line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
                <div className="text-xs text-[#5A7060] pt-3 mt-3 border-t border-[#D4E6D9]/50 flex items-center justify-between">
                  <span>{rel.readingTimeMin} min read</span>
                  <span className="font-semibold text-[#2D7D46]">Read &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
