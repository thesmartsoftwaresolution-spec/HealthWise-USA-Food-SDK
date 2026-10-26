# HealthWise USA — Technical Requirements Document (TRD)

**Version:** 1.0  
**Date:** October 2026  
**Status:** Ready for Engineering  
**Audience:** Frontend Engineers, Backend Engineers, DevOps

---

## 1. System Architecture Overview

HealthWise USA is built as a **Jamstack architecture** hosted entirely on Cloudflare's ecosystem. The system is composed of three layers:

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
│         React SPA (Cloudflare Pages CDN)                │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS API calls
┌──────────────────▼──────────────────────────────────────┐
│              CLOUDFLARE WORKERS (Edge API)               │
│   /api/articles  /api/recipes  /api/ai/*  /api/auth      │
└──────────┬───────────────┬────────────────┬─────────────┘
           │               │                │
    ┌──────▼──────┐  ┌─────▼─────┐  ┌──────▼──────┐
    │ Cloudflare  │  │Cloudflare │  │  Anthropic  │
    │     D1      │  │    R2     │  │  Claude API │
    │  (Database) │  │ (Images)  │  │  (AI Tools) │
    └─────────────┘  └───────────┘  └─────────────┘
```

---

## 2. Technology Stack

### Frontend
| Component | Technology | Version | Reason |
|---|---|---|---|
| Framework | React | 18.x | Component-based, large ecosystem |
| Language | TypeScript | 5.x | Type safety, better DX |
| Build Tool | Vite | 5.x | Fast builds, HMR |
| Routing | React Router | 6.x | SPA routing |
| State Management | Zustand | 4.x | Lightweight, simple |
| Server State | TanStack Query | 5.x | API caching, loading states |
| Styling | Tailwind CSS | 3.x | Utility-first, fast development |
| Icons | Lucide React | Latest | Consistent icon set |
| Forms | React Hook Form | 7.x | Performant forms |
| Validation | Zod | 3.x | Schema validation |

### Backend (Cloudflare Workers)
| Component | Technology | Reason |
|---|---|---|
| Runtime | Cloudflare Workers (Edge) | Low latency, free tier, global CDN |
| Language | TypeScript | Consistent with frontend |
| Framework | Hono.js | Lightweight, Workers-optimized |
| Database | Cloudflare D1 (SQLite) | Free 5GB, SQL support |
| Storage | Cloudflare R2 | Free 10GB image storage |
| KV Store | Cloudflare KV | Rate limiting, sessions |
| AI Gateway | Anthropic Claude API | Health AI tools |

### Infrastructure
| Service | Provider | Plan |
|---|---|---|
| Hosting (Frontend) | Cloudflare Pages | Free |
| API Runtime | Cloudflare Workers | Free (100k req/day) |
| Database | Cloudflare D1 | Free (5GB) |
| Object Storage | Cloudflare R2 | Free (10GB) |
| KV Storage | Cloudflare KV | Free (1GB) |
| CDN | Cloudflare (built-in) | Free |
| Analytics | Google Analytics 4 | Free |
| AI API | Anthropic Claude | Pay-per-use |

---

## 3. Project File Structure

```
healthwise-usa/
├── frontend/                          # React App
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── assets/                    # Static assets
│   │   ├── components/
│   │   │   ├── ui/                    # Base UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   └── Modal.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── AdminLayout.tsx
│   │   │   ├── article/
│   │   │   │   ├── ArticleCard.tsx
│   │   │   │   ├── ArticleDetail.tsx
│   │   │   │   └── ArticleList.tsx
│   │   │   ├── recipe/
│   │   │   │   ├── RecipeCard.tsx
│   │   │   │   ├── RecipeDetail.tsx
│   │   │   │   ├── RecipeFilter.tsx
│   │   │   │   └── NutritionBadge.tsx
│   │   │   └── ai/
│   │   │       ├── ChatWidget.tsx
│   │   │       ├── MealPlanner.tsx
│   │   │       ├── RecipeGenerator.tsx
│   │   │       ├── NutritionAnalyzer.tsx
│   │   │       └── GroceryList.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── HealthTips.tsx
│   │   │   ├── ArticleDetail.tsx
│   │   │   ├── Recipes.tsx
│   │   │   ├── RecipeDetail.tsx
│   │   │   ├── AITools.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── ManageArticles.tsx
│   │   │   │   ├── ManageRecipes.tsx
│   │   │   │   └── ManageUsers.tsx
│   │   │   └── static/
│   │   │       ├── About.tsx
│   │   │       ├── Contact.tsx
│   │   │       ├── Privacy.tsx
│   │   │       ├── Terms.tsx
│   │   │       └── Disclaimer.tsx
│   │   ├── hooks/
│   │   │   ├── useArticles.ts
│   │   │   ├── useRecipes.ts
│   │   │   ├── useAI.ts
│   │   │   └── useAuth.ts
│   │   ├── lib/
│   │   │   ├── api.ts                 # API client
│   │   │   ├── auth.ts               # Auth utilities
│   │   │   └── utils.ts              # Helpers
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   └── appStore.ts
│   │   ├── types/
│   │   │   ├── article.ts
│   │   │   ├── recipe.ts
│   │   │   └── user.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── workers/                           # Cloudflare Workers API
│   ├── src/
│   │   ├── index.ts                   # Main entry point (Hono router)
│   │   ├── routes/
│   │   │   ├── articles.ts
│   │   │   ├── recipes.ts
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── search.ts
│   │   │   └── ai/
│   │   │       ├── chat.ts
│   │   │       ├── mealPlan.ts
│   │   │       ├── recipeGen.ts
│   │   │       ├── nutrition.ts
│   │   │       └── grocery.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT verification
│   │   │   ├── rateLimit.ts          # IP-based rate limiting
│   │   │   ├── cors.ts
│   │   │   └── validate.ts
│   │   ├── services/
│   │   │   ├── claudeService.ts      # Anthropic API calls
│   │   │   ├── dbService.ts          # D1 queries
│   │   │   └── storageService.ts     # R2 operations
│   │   └── types/
│   │       └── env.ts                # Worker env bindings
│   └── wrangler.toml
│
├── schema/
│   ├── schema.sql                    # D1 database schema
│   └── seed.sql                      # Initial data
│
└── docs/                             # Project documentation
```

---

## 4. API Design

### Base URL
```
Production: https://api.healthwiseusa.com
Development: http://localhost:8787
```

### Authentication
All protected routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

### API Endpoints

#### Articles
```
GET    /api/articles              List articles (paginated)
GET    /api/articles/:slug        Get single article
POST   /api/articles              Create article (admin)
PUT    /api/articles/:id          Update article (admin)
DELETE /api/articles/:id          Delete article (admin)

Query params: ?category=&page=&limit=&search=
```

#### Recipes
```
GET    /api/recipes               List recipes (paginated)
GET    /api/recipes/:slug         Get single recipe
POST   /api/recipes               Create recipe (admin)
PUT    /api/recipes/:id           Update recipe (admin)
DELETE /api/recipes/:id           Delete recipe (admin)

Query params: ?category=&dietary=&maxTime=&maxCost=&page=&limit=
```

#### AI Services
```
POST   /api/ai/chat               Wellness assistant chat
POST   /api/ai/meal-plan          Generate 7-day meal plan
POST   /api/ai/recipe             Generate recipe from ingredients
POST   /api/ai/nutrition          Analyze recipe nutrition
POST   /api/ai/grocery            Generate grocery list

All AI routes: Rate limited (10/hour per IP, 50/hour per user)
```

#### Auth
```
POST   /api/auth/register         Register new user
POST   /api/auth/login            Login, returns JWT
POST   /api/auth/logout           Invalidate token
POST   /api/auth/refresh          Refresh JWT
POST   /api/auth/reset-password   Request password reset
```

#### Users
```
GET    /api/users/me              Get current user profile
PUT    /api/users/me              Update profile
GET    /api/users/me/saved        Get saved articles/recipes
POST   /api/users/me/saved        Save article or recipe
DELETE /api/users/me/saved/:id    Remove saved item
GET    /api/users/me/plans        Get saved meal plans
```

#### Search
```
GET    /api/search?q=&type=        Search across content
Types: articles | recipes | all
```

### Standard Response Format
```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many AI requests. Try again in 1 hour."
  }
}
```

---

## 5. AI Service Integration

### Claude API Configuration

```typescript
// workers/src/services/claudeService.ts
interface ClaudeRequest {
  tool: 'wellness' | 'mealPlan' | 'recipe' | 'nutrition' | 'grocery';
  userMessage: string;
  conversationHistory?: Message[];
}

const SYSTEM_PROMPTS = {
  wellness: `You are a friendly, knowledgeable health and wellness assistant 
    for HealthWise USA. Answer questions about general health, nutrition, 
    and healthy eating in simple American English. Always:
    - Recommend consulting a doctor for medical concerns
    - Link to relevant website articles when possible
    - Avoid diagnosing conditions or prescribing medications
    - Keep responses under 300 words
    - Add "This is general wellness information, not medical advice." at end`,

  mealPlan: `You are a US meal planning expert. Create practical, affordable 
    7-day meal plans using common American grocery store ingredients. 
    Use US measurements (cups, oz, tbsp, °F). 
    Respond ONLY in valid JSON format: 
    { days: [{day, meals: {breakfast, lunch, dinner, snacks}}], 
      dailyCalories: number, groceryList: string[] }`,

  recipe: `You are a healthy recipe creator for American home cooks. 
    Create recipes using ingredients provided. Use US measurements. 
    Respond ONLY in valid JSON:
    { recipes: [{ title, ingredients: [{amount, unit, item}], 
      instructions: string[], prepTime, cookTime, servings, 
      estimatedCalories, dietaryTags }] }`,

  nutrition: `You are a nutrition estimation tool. Calculate approximate 
    nutrition for recipes. Be clear these are estimates.
    Respond ONLY in valid JSON:
    { perServing: { calories, protein, carbs, fat, fiber }, 
      disclaimer: string }`,

  grocery: `Convert a meal plan into an organized grocery list for 
    an American supermarket. Respond ONLY in valid JSON:
    { categories: { produce: [], dairy: [], proteins: [], 
      pantry: [], frozen: [] }, estimatedTotalCost: number }`
};

export async function callClaude(
  request: ClaudeRequest,
  env: Env
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 1500,
      system: SYSTEM_PROMPTS[request.tool],
      messages: [
        ...(request.conversationHistory || []),
        { role: 'user', content: request.userMessage }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}
```

### Rate Limiting Implementation

```typescript
// workers/src/middleware/rateLimit.ts
export async function rateLimitMiddleware(
  c: Context,
  next: Next
) {
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  const key = `ratelimit:ai:${ip}`;
  
  const current = await c.env.KV.get(key);
  const count = current ? parseInt(current) : 0;
  
  if (count >= 10) {
    return c.json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'You have used 10 AI requests this hour. Resets in 1 hour. Create a free account for higher limits.'
      }
    }, 429);
  }
  
  // Increment counter with 1-hour TTL
  await c.env.KV.put(key, String(count + 1), { expirationTtl: 3600 });
  
  await next();
}
```

---

## 6. Authentication System

### JWT Implementation
```typescript
// Token structure
{
  "sub": "user_id",
  "email": "user@email.com",
  "role": "user" | "editor" | "admin",
  "iat": 1234567890,
  "exp": 1234567890  // 7 days
}
```

### Auth Flow
1. User registers → password hashed (bcrypt) → stored in D1
2. User logs in → credentials verified → JWT issued
3. Frontend stores JWT in memory (not localStorage for security)
4. Refresh token stored in httpOnly cookie
5. All protected API calls include `Authorization: Bearer <token>`
6. Worker middleware verifies JWT on protected routes

---

## 7. Database Queries (Key Patterns)

```sql
-- Paginated articles with search
SELECT * FROM articles 
WHERE status = 'published'
  AND (title LIKE ? OR content LIKE ?)
  AND (? IS NULL OR category = ?)
ORDER BY published_at DESC
LIMIT ? OFFSET ?;

-- Recipe with filters
SELECT * FROM recipes
WHERE (? IS NULL OR category = ?)
  AND (? IS NULL OR prep_time + cook_time <= ?)
  AND (? IS NULL OR cost_per_serving <= ?)
  AND JSON_EACH(dietary_tags) LIKE ?
ORDER BY created_at DESC
LIMIT ? OFFSET ?;

-- User's saved items
SELECT r.*, 'recipe' as type FROM recipes r
JOIN saved_items si ON si.item_id = r.id AND si.item_type = 'recipe'
WHERE si.user_id = ?
UNION
SELECT a.*, 'article' as type FROM articles a
JOIN saved_items si ON si.item_id = a.id AND si.item_type = 'article'
WHERE si.user_id = ?;
```

---

## 8. Frontend State Management

### Zustand Store
```typescript
// store/authStore.ts
interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

// store/appStore.ts
interface AppStore {
  savedRecipes: Recipe[];
  mealPlan: MealPlan | null;
  groceryList: GroceryItem[];
  dietaryPrefs: string[];
  setMealPlan: (plan: MealPlan) => void;
  addToGroceryList: (items: GroceryItem[]) => void;
}
```

### TanStack Query Setup
```typescript
// All API calls use React Query for caching
const { data: articles, isLoading } = useQuery({
  queryKey: ['articles', { category, page }],
  queryFn: () => api.getArticles({ category, page }),
  staleTime: 5 * 60 * 1000, // 5 minutes cache
});
```

---

## 9. SEO Implementation

### Structured Data (Schema.org)
```typescript
// Article schema
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "author": { "@type": "Person", "name": article.author },
  "datePublished": article.published_at,
  "dateModified": article.updated_at,
  "publisher": { "@type": "Organization", "name": "HealthWise USA" }
}

// Recipe schema
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": recipe.title,
  "recipeIngredient": recipe.ingredients,
  "nutrition": { "@type": "NutritionInformation", "calories": recipe.calories },
  "prepTime": `PT${recipe.prep_time}M`,
  "cookTime": `PT${recipe.cook_time}M`
}
```

### Meta Tags (React Helmet)
```tsx
<Helmet>
  <title>{article.title} | HealthWise USA</title>
  <meta name="description" content={article.meta_description} />
  <meta property="og:title" content={article.title} />
  <meta property="og:image" content={article.cover_image} />
  <link rel="canonical" href={`https://healthwiseusa.com/articles/${article.slug}`} />
</Helmet>
```

---

## 10. Performance Requirements

| Metric | Target | Method |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Image optimization, CDN |
| FID / INP | < 100ms | Code splitting, lazy loading |
| CLS | < 0.1 | Stable layouts, skeleton loaders |
| Bundle Size (initial) | < 150KB gzipped | Tree shaking, code splitting |
| API Response Time | < 200ms | Edge Workers, D1 |
| Image Optimization | WebP format | R2 + Cloudflare Images |

### Code Splitting Strategy
```typescript
// Lazy load heavy pages
const AITools = lazy(() => import('./pages/AITools'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
```

---

## 11. Security Requirements

| Requirement | Implementation |
|---|---|
| HTTPS only | Cloudflare enforced |
| API key security | Keys only in Worker environment variables |
| SQL injection | Parameterized queries in D1 |
| XSS prevention | React auto-escaping + DOMPurify for user content |
| CORS | Workers CORS middleware (whitelist frontend domain only) |
| Rate limiting | KV-based per-IP limiting |
| Input validation | Zod schemas on all API inputs |
| Auth tokens | JWT in memory, refresh in httpOnly cookie |
| Admin routes | Role check middleware on all /admin/* |

---

## 12. Cloudflare Configuration

```toml
# wrangler.toml
name = "healthwise-api"
main = "src/index.ts"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "healthwise-db"
database_id = "your-d1-id-here"

[[r2_buckets]]
binding = "IMAGES"
bucket_name = "healthwise-images"

[[kv_namespaces]]
binding = "KV"
id = "your-kv-id-here"

[vars]
ENVIRONMENT = "production"
FRONTEND_URL = "https://healthwiseusa.com"
JWT_EXPIRY = "7d"

# Secrets (set via wrangler secret put)
# ANTHROPIC_API_KEY
# JWT_SECRET
```

---

## 13. Testing Requirements

| Test Type | Tool | Coverage Target |
|---|---|---|
| Unit Tests | Vitest | 70% of utilities and hooks |
| Component Tests | React Testing Library | All key UI components |
| API Tests | Vitest + Worker test env | All API endpoints |
| E2E Tests | Playwright | Critical user journeys |
| Accessibility | axe-core | WCAG 2.1 AA |
| Performance | Lighthouse CI | Score > 90 |

---

## 14. Deployment Pipeline

```
Developer pushes to GitHub
    ↓
GitHub Actions runs:
  - TypeScript type check
  - Linting (ESLint)
  - Unit tests (Vitest)
  ↓
On merge to main:
  - Frontend: Cloudflare Pages auto-deploy
  - Workers: wrangler deploy
  - D1 migrations: wrangler d1 migrations apply
```

---

*Document Owner: Engineering Lead*  
*Last Updated: October 2026*
