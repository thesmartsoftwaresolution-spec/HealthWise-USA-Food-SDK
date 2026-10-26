import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Article, Recipe, SiteSettings, User, AIUsageLog } from '../types/index.ts';
import { Button } from '../components/common/Button.tsx';
import { Badge } from '../components/common/Badge.tsx';
import {
  ShieldAlert,
  BookOpen,
  Utensils,
  Brain,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'recipes' | 'users' | 'ai' | 'homepage'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Users & Newsletter & Messages State
  const [usersList, setUsersList] = useState<User[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);

  // New Article Form State
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleCategory, setNewArticleCategory] = useState(1);
  const [newArticleExcerpt, setNewArticleExcerpt] = useState('');
  const [newArticleContent, setNewArticleContent] = useState('');

  // New Recipe Form State
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const [newRecipeTitle, setNewRecipeTitle] = useState('');
  const [newRecipeCategory, setNewRecipeCategory] = useState(1);
  const [newRecipeDesc, setNewRecipeDesc] = useState('');
  const [newRecipeCalories, setNewRecipeCalories] = useState(380);
  const [newRecipeProtein, setNewRecipeProtein] = useState(25);
  const [newRecipeCarbs, setNewRecipeCarbs] = useState(35);
  const [newRecipeFat, setNewRecipeFat] = useState(12);
  const [newRecipeTime, setNewRecipeTime] = useState(25);
  const [newRecipeCost, setNewRecipeCost] = useState(2.50);
  const [newRecipeDiet, setNewRecipeDiet] = useState('High-Protein');

  // Daily Tip State
  const [editedTip, setEditedTip] = useState('');

  useEffect(() => {
    fetchStats();
    fetch('/api/articles?limit=50').then((r) => r.json()).then((d) => setArticles(d.data || []));
    fetch('/api/recipes?limit=50').then((r) => r.json()).then((d) => setRecipes(d.data || []));
    fetch('/api/settings').then((r) => r.json()).then((d) => {
      setSettings(d.settings);
      setEditedTip(d.settings?.dailyTip || '');
    });
    fetch('/api/admin/users').then((r) => r.json()).then((d) => setUsersList(d.users || []));
    fetch('/api/admin/newsletter').then((r) => r.json()).then((d) => setSubscribers(d.subscribers || []));
    fetch('/api/admin/contact').then((r) => r.json()).then((d) => setContactMessages(d.messages || []));
  }, []);

  const fetchStats = () => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats(d.stats);
      });
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleTitle.trim() || !newArticleContent.trim()) {
      showToast('Title and content are required.', 'error');
      return;
    }

    const payload = {
      title: newArticleTitle.trim(),
      slug: newArticleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: newArticleExcerpt.trim() || newArticleContent.slice(0, 150),
      content: `<p>${newArticleContent}</p>`,
      coverImageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
      categoryId: newArticleCategory,
      categoryName: newArticleCategory === 1 ? 'Nutrition & Diet' : 'Heart & Longevity',
      tags: ['Health', 'Wellness'],
      authorName: user?.name || 'Dr. Alex Rivera, MS, RD',
      medicalReviewer: 'Dr. Michael Chen, MD',
      readingTimeMin: 5,
      status: 'published',
      keyTakeaways: ['Evidence-based whole food lifestyle.', 'Consult healthcare providers for specific needs.'],
      references: [{ id: 1, title: 'CDC Nutrition Report', url: 'https://cdc.gov', source: 'CDC' }]
    };

    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      setArticles([data.data, ...articles]);
      setIsCreatingArticle(false);
      setNewArticleTitle('');
      setNewArticleContent('');
      setNewArticleExcerpt('');
      showToast('Article published successfully!', 'success');
      fetchStats();
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    setArticles(articles.filter((a) => a.id !== id));
    showToast('Article deleted.', 'info');
    fetchStats();
  };

  const handleCreateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeTitle.trim()) {
      showToast('Recipe title is required.', 'error');
      return;
    }
    const slug = newRecipeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const payload = {
      title: newRecipeTitle.trim(),
      slug,
      description: newRecipeDesc.trim() || 'A delicious, balanced, nutrient-dense recipe made with everyday US supermarket staples.',
      coverImageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
      categoryId: newRecipeCategory,
      categoryName: newRecipeCategory === 1 ? 'Healthy Breakfast' : newRecipeCategory === 2 ? 'Budget Meals' : 'Quick Meals',
      dietaryTags: [newRecipeDiet, 'Budget-Friendly'],
      allergens: [],
      difficulty: 'easy',
      prepTimeMin: 10,
      cookTimeMin: Number(newRecipeTime) - 10 > 0 ? Number(newRecipeTime) - 10 : 15,
      totalTimeMin: Number(newRecipeTime),
      baseServings: 4,
      costPerServing: Number(newRecipeCost),
      calories: Number(newRecipeCalories),
      proteinG: Number(newRecipeProtein),
      carbsG: Number(newRecipeCarbs),
      fatG: Number(newRecipeFat),
      fiberG: 6,
      sodiumMg: 380,
      ingredients: [
        { id: 1, amountUs: '1 lb', ingredient: 'Primary protein or plant staple', sortOrder: 1 },
        { id: 2, amountUs: '2 cups', ingredient: 'Fresh organic greens / vegetables', sortOrder: 2 },
        { id: 3, amountUs: '1 tbsp', ingredient: 'Extra virgin olive oil', sortOrder: 3 },
        { id: 4, amountUs: '1 tsp', ingredient: 'Garlic powder, sea salt, black pepper', sortOrder: 4 }
      ],
      instructions: [
        { id: 1, stepNumber: 1, instruction: 'Prep all fresh ingredients and measure seasonings.' },
        { id: 2, stepNumber: 2, instruction: 'Cook the protein and vegetables in a skillet or sheet pan over medium heat until golden.' },
        { id: 3, stepNumber: 3, instruction: 'Portion into bowls, garnish with herbs, and serve fresh.' }
      ],
      status: 'published'
    };

    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      setRecipes([data.data, ...recipes]);
      setIsCreatingRecipe(false);
      setNewRecipeTitle('');
      setNewRecipeDesc('');
      showToast('New recipe published successfully!', 'success');
      fetchStats();
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
    setRecipes(recipes.filter((r) => r.id !== id));
    showToast('Recipe deleted from database.', 'info');
    fetchStats();
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    const data = await res.json();
    if (data.success) {
      setUsersList(usersList.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u)));
      showToast(`User role updated to ${newRole}.`, 'success');
    }
  };

  const handleToggleMessageStatus = async (msgId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'unread' ? 'resolved' : 'unread';
    const res = await fetch(`/api/admin/contact/${msgId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (data.success) {
      setContactMessages(contactMessages.map((m) => (m.id === msgId ? { ...m, status: newStatus } : m)));
      showToast(`Message marked as ${newStatus}.`, 'info');
    }
  };

  const handleSaveDailyTip = async () => {
    if (!settings) return;
    const updated = { ...settings, dailyTip: editedTip };
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    setSettings(updated);
    showToast('Homepage Daily Health Tip updated successfully!', 'success');
  };

  const handleResetDatabase = async () => {
    try {
      const res = await fetch('/api/admin/reset-database', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('Database restored to fresh clean authentic seed state!', 'success');
        fetchStats();
        fetch('/api/articles?limit=50').then((r) => r.json()).then((d) => setArticles(d.data || []));
        fetch('/api/recipes?limit=50').then((r) => r.json()).then((d) => setRecipes(d.data || []));
        fetch('/api/admin/users').then((r) => r.json()).then((d) => setUsersList(d.users || []));
        fetch('/api/admin/contact').then((r) => r.json()).then((d) => setContactMessages(d.messages || []));
      }
    } catch {
      showToast('Failed to reset database.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Admin Header */}
      <div className="bg-[#1C2B20] text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C0392B]/30 border border-[#C0392B]/50 text-xs font-bold text-[#F87171] uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> Admin Editorial Control Center
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            HealthWise USA Management
          </h1>
          <p className="text-xs sm:text-sm text-[#E8F5EC]/80">
            Publish articles, curate recipes, review live AI requests, and edit homepage feature spotlights.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleResetDatabase}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition flex items-center gap-1.5 cursor-pointer"
            title="Restore database to fresh authentic seed state"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Demo DB
          </button>
          <Button
            variant="accent"
            size="md"
            onClick={() => {
              setActiveTab('articles');
              setIsCreatingArticle(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            New Article
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="text-white border-white/40 hover:bg-white/10"
            onClick={() => {
              setActiveTab('recipes');
              setIsCreatingRecipe(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            New Recipe
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#D4E6D9] gap-4 overflow-x-auto scrollbar-none text-sm font-semibold">
        {[
          { id: 'overview', label: 'Stats & Overview' },
          { id: 'articles', label: `Articles (${articles.length})` },
          { id: 'recipes', label: `Recipes (${recipes.length})` },
          { id: 'users', label: `Users & Inquiries (${usersList.length + subscribers.length + contactMessages.length})` },
          { id: 'ai', label: 'AI Engine & Logs' },
          { id: 'homepage', label: 'Homepage Editor' }
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
      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-in fade-in">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#D4E6D9] rounded-2xl p-5 space-y-1 shadow-xs">
              <span className="text-xs font-semibold text-[#5A7060] uppercase">Total Articles</span>
              <p className="font-serif text-3xl font-bold text-[#1C2B20]">{stats.totalArticles}</p>
              <span className="text-[11px] text-[#2D7D46] font-medium">All published & indexed</span>
            </div>
            <div className="bg-white border border-[#D4E6D9] rounded-2xl p-5 space-y-1 shadow-xs">
              <span className="text-xs font-semibold text-[#5A7060] uppercase">Healthy Recipes</span>
              <p className="font-serif text-3xl font-bold text-[#1C2B20]">{stats.totalRecipes}</p>
              <span className="text-[11px] text-[#E07B39] font-medium">With US nutrition facts</span>
            </div>
            <div className="bg-white border border-[#D4E6D9] rounded-2xl p-5 space-y-1 shadow-xs">
              <span className="text-xs font-semibold text-[#5A7060] uppercase">AI Tool Invocations</span>
              <p className="font-serif text-3xl font-bold text-[#1C2B20]">{stats.totalAiRequests}</p>
              <span className="text-[11px] text-[#0369A1] font-medium">Gemini 4 Argon reasoning</span>
            </div>
            <div className="bg-white border border-[#D4E6D9] rounded-2xl p-5 space-y-1 shadow-xs">
              <span className="text-xs font-semibold text-[#5A7060] uppercase">Newsletter Subscribers</span>
              <p className="font-serif text-3xl font-bold text-[#1C2B20]">{stats.subscribersCount}</p>
              <span className="text-[11px] text-[#2D7D46] font-medium">Active email audience</span>
            </div>
          </div>

          {/* Recent AI Usage Logs Table */}
          <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#D4E6D9]/50 pb-3">
              <h3 className="font-serif text-xl font-bold text-[#1C2B20] flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#2D7D46]" /> Recent AI Requests & Safety Audits
              </h3>
              <span className="text-xs text-[#5A7060]">Filtered for clinical compliance</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#D4E6D9] text-[#5A7060] font-semibold">
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Tool</th>
                    <th className="py-2.5 px-3">Prompt Excerpt</th>
                    <th className="py-2.5 px-3">Model</th>
                    <th className="py-2.5 px-3">Latency</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4E6D9]/50">
                  {stats.aiLogs?.map((log: AIUsageLog) => (
                    <tr key={log.id} className="hover:bg-[#F4F8F5]">
                      <td className="py-2.5 px-3 whitespace-nowrap text-[#5A7060]">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-3 font-bold uppercase text-[#2D7D46]">{log.tool}</td>
                      <td className="py-2.5 px-3 max-w-xs truncate text-[#1C2B20]">{log.promptPreview}</td>
                      <td className="py-2.5 px-3 text-[#5A7060]">{log.modelUsed}</td>
                      <td className="py-2.5 px-3 font-mono">{log.durationMs}ms</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#E8F5EC] text-[#2D7D46] font-bold">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARTICLES CRUD */}
      {activeTab === 'articles' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#1C2B20]">Manage Health Articles</h2>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreatingArticle(!isCreatingArticle)}
              icon={<Plus className="w-4 h-4" />}
            >
              {isCreatingArticle ? 'Cancel' : 'Add New Article'}
            </Button>
          </div>

          {/* Create Article Form */}
          {isCreatingArticle && (
            <form onSubmit={handleCreateArticle} className="bg-[#E8F5EC] border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#1A5C31]">Publish New Health Article</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase text-[#1C2B20]">Article Title</label>
                  <input
                    type="text"
                    value={newArticleTitle}
                    onChange={(e) => setNewArticleTitle(e.target.value)}
                    required
                    placeholder="e.g. The Role of Zinc & Vitamin C in Upper Respiratory Health"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4E6D9] bg-white text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-[#1C2B20]">Category</label>
                  <select
                    value={newArticleCategory}
                    onChange={(e) => setNewArticleCategory(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4E6D9] bg-white text-sm"
                  >
                    <option value={1}>Nutrition & Diet</option>
                    <option value={2}>Heart & Longevity</option>
                    <option value={3}>Fitness & Movement</option>
                    <option value={4}>Sleep & Recovery</option>
                    <option value={5}>Stress & Mental Health</option>
                    <option value={6}>Weight Management</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-[#1C2B20]">Short Excerpt</label>
                <input
                  type="text"
                  value={newArticleExcerpt}
                  onChange={(e) => setNewArticleExcerpt(e.target.value)}
                  placeholder="1-2 sentences summarizing clinical findings..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D4E6D9] bg-white text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-[#1C2B20]">Content (HTML or Paragraphs)</label>
                <textarea
                  rows={6}
                  value={newArticleContent}
                  onChange={(e) => setNewArticleContent(e.target.value)}
                  required
                  placeholder="Write evidence-based content citing CDC/NIH guidelines..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4E6D9] bg-white text-sm"
                />
              </div>

              <Button variant="primary" size="md" type="submit">
                Publish Article to Live Site
              </Button>
            </form>
          )}

          {/* Articles Table */}
          <div className="bg-white border border-[#D4E6D9] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F4F8F5] border-b border-[#D4E6D9] text-[#5A7060] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4">Published Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4E6D9]/50">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-[#F4F8F5]">
                      <td className="py-3 px-4 font-semibold text-[#1C2B20] max-w-sm truncate">
                        <Link to={`/health-tips/${art.slug}`} className="hover:underline">
                          {art.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-[#5A7060]">{art.categoryName}</td>
                      <td className="py-3 px-4 font-mono">{art.viewCount}</td>
                      <td className="py-3 px-4 text-[#5A7060]">
                        {new Date(art.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="text-red-600 hover:text-red-800 p-1 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECIPES CRUD */}
      {activeTab === 'recipes' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#1C2B20]">Manage Recipes ({recipes.length})</h2>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreatingRecipe(!isCreatingRecipe)}
              icon={<Plus className="w-4 h-4" />}
            >
              {isCreatingRecipe ? 'Cancel' : 'Add New Recipe'}
            </Button>
          </div>

          {/* Create Recipe Form */}
          {isCreatingRecipe && (
            <form onSubmit={handleCreateRecipe} className="bg-[#FDF0E6] border border-[#FED7AA] rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#9A3412]">Publish New Nutritious Recipe</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase text-[#1C2B20]">Recipe Title</label>
                  <input
                    type="text"
                    value={newRecipeTitle}
                    onChange={(e) => setNewRecipeTitle(e.target.value)}
                    required
                    placeholder="e.g. 20-Minute Garlic Herb Shrimp & Broccoli Skillet"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FED7AA] bg-white text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-[#1C2B20]">Category</label>
                  <select
                    value={newRecipeCategory}
                    onChange={(e) => setNewRecipeCategory(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FED7AA] bg-white text-sm"
                  >
                    <option value={1}>Healthy Breakfast</option>
                    <option value={2}>Budget Meals (&lt;$3)</option>
                    <option value={3}>Quick Meals (&lt;30m)</option>
                    <option value={4}>High-Protein Dinners</option>
                    <option value={5}>Plant-Based & Vegetarian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-[#1C2B20]">Calories</label>
                  <input
                    type="number"
                    value={newRecipeCalories}
                    onChange={(e) => setNewRecipeCalories(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#FED7AA] bg-white text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-[#1C2B20]">Protein (g)</label>
                  <input
                    type="number"
                    value={newRecipeProtein}
                    onChange={(e) => setNewRecipeProtein(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#FED7AA] bg-white text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-[#1C2B20]">Total Time (min)</label>
                  <input
                    type="number"
                    value={newRecipeTime}
                    onChange={(e) => setNewRecipeTime(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#FED7AA] bg-white text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-[#1C2B20]">Cost / Serving ($)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={newRecipeCost}
                    onChange={(e) => setNewRecipeCost(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#FED7AA] bg-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-[#1C2B20]">Description</label>
                <textarea
                  rows={3}
                  value={newRecipeDesc}
                  onChange={(e) => setNewRecipeDesc(e.target.value)}
                  placeholder="Quick flavor profile and why it supports family health..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#FED7AA] bg-white text-sm"
                />
              </div>

              <Button variant="accent" size="md" type="submit">
                Publish Recipe to Catalog
              </Button>
            </form>
          )}

          <div className="bg-white border border-[#D4E6D9] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F4F8F5] border-b border-[#D4E6D9] text-[#5A7060] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Recipe Title</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Calories</th>
                    <th className="py-3 px-4">Cost/Serv</th>
                    <th className="py-3 px-4">Dietary Tags</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4E6D9]/50">
                  {recipes.map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#F4F8F5]">
                      <td className="py-3 px-4 font-semibold text-[#1C2B20]">
                        <Link to={`/recipes/${rec.slug}`} className="hover:underline">
                          {rec.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-mono">{rec.totalTimeMin}m</td>
                      <td className="py-3 px-4 font-mono">{rec.calories} kcal</td>
                      <td className="py-3 px-4 font-mono text-[#2D7D46]">${rec.costPerServing.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-700">
                          {rec.dietaryTags.join(', ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link to={`/recipes/${rec.slug}`} className="text-[#2D7D46] hover:underline font-semibold">
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteRecipe(rec.id)}
                          className="text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USERS & INQUIRIES */}
      {activeTab === 'users' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Registered Users */}
          <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#1C2B20] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2D7D46]" /> Registered User Accounts ({usersList.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F4F8F5] border-b border-[#D4E6D9] text-[#5A7060]">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Current Role</th>
                    <th className="py-3 px-4">Dietary Prefs</th>
                    <th className="py-3 px-4 text-right">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4E6D9]/50">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-[#F4F8F5]">
                      <td className="py-3 px-4 font-bold text-[#1C2B20]">{u.name}</td>
                      <td className="py-3 px-4 text-[#5A7060]">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                          u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-[#E8F5EC] text-[#2D7D46]'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#5A7060]">{u.dietaryPrefs?.join(', ') || 'Standard'}</td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                          className="px-2 py-1 rounded-md border border-[#D4E6D9] text-xs bg-white text-[#1C2B20]"
                        >
                          <option value="user">User</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Newsletter Subscribers */}
          <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#D4E6D9]/50 pb-3">
              <h3 className="font-serif text-xl font-bold text-[#1C2B20]">
                Email Newsletter Subscribers ({subscribers.length})
              </h3>
              <button
                onClick={() => {
                  const csv = ['Email,Source,SubscribedAt', ...subscribers.map(s => `${s.email},${s.source},${s.subscribedAt}`)].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'healthwise-subscribers.csv';
                  a.click();
                  showToast('Exported subscribers CSV.', 'success');
                }}
                className="px-3 py-1.5 bg-[#E8F5EC] hover:bg-[#2D7D46] text-[#2D7D46] hover:text-white rounded-lg text-xs font-semibold transition"
              >
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F4F8F5] border-b border-[#D4E6D9] text-[#5A7060]">
                  <tr>
                    <th className="py-2.5 px-4">Email</th>
                    <th className="py-2.5 px-4">Source</th>
                    <th className="py-2.5 px-4">Date Subscribed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4E6D9]/50">
                  {subscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-[#F4F8F5]">
                      <td className="py-2.5 px-4 font-semibold text-[#1C2B20]">{s.email}</td>
                      <td className="py-2.5 px-4 text-[#5A7060] capitalize">{s.source}</td>
                      <td className="py-2.5 px-4 text-[#5A7060]">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact Inquiries */}
          <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#1C2B20]">
              Editorial & Reader Inquiries ({contactMessages.length})
            </h3>
            {contactMessages.length === 0 ? (
              <p className="text-xs text-[#5A7060] py-4">No reader inquiries logged yet.</p>
            ) : (
              <div className="space-y-3">
                {contactMessages.map((m) => (
                  <div key={m.id} className="p-4 rounded-2xl border border-[#D4E6D9] bg-[#FAFDFB] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#1C2B20]">{m.name}</span>
                        <span className="text-[#5A7060] ml-2">({m.email})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          m.status === 'unread' ? 'bg-amber-100 text-amber-800' : 'bg-[#E8F5EC] text-[#2D7D46]'
                        }`}>
                          {m.status}
                        </span>
                        <button
                          onClick={() => handleToggleMessageStatus(m.id, m.status)}
                          className="text-xs text-[#2D7D46] hover:underline font-semibold"
                        >
                          Mark as {m.status === 'unread' ? 'Resolved' : 'Unread'}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-[#1C2B20]">Subject: {m.subject}</p>
                    <p className="text-xs text-[#5A7060] bg-white p-3 rounded-xl border border-[#D4E6D9]/50">
                      {m.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: HOMEPAGE EDITOR */}
      {activeTab === 'homepage' && settings && (
        <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl animate-in fade-in">
          <h2 className="font-serif text-2xl font-bold text-[#1C2B20]">Homepage Feature Customizer</h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#1C2B20] block">Daily Health Tip</label>
              <textarea
                rows={3}
                value={editedTip}
                onChange={(e) => setEditedTip(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4E6D9] text-sm text-[#1C2B20]"
              />
              <p className="text-[#5A7060]">Shown in the top highlight bar across the homepage.</p>
            </div>

            <Button variant="primary" size="md" onClick={handleSaveDailyTip}>
              Save Homepage Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
