# HealthWise USA — Implementation Plan

**Version:** 1.0  
**Date:** October 2026  
**Total Duration:** 12 Weeks (3 months)  
**Team Size:** 1–2 developers

---

## Overview

```
Phase 1: Foundation    (Weeks 1–3)   → Core website, content, admin
Phase 2: AI Tools      (Weeks 4–6)   → All AI features, rate limiting
Phase 3: User Accounts (Weeks 7–9)   → Auth, dashboard, personalization
Phase 4: Growth        (Weeks 10–12) → SEO, monetization, optimization
```

---

## Pre-Development Checklist

Before writing a single line of code, complete these:

- [ ] Register domain (healthwiseusa.com or similar)
- [ ] Create Cloudflare account
- [ ] Create Anthropic account and get API key
- [ ] Set up GitHub repository (private)
- [ ] Set up Google Analytics 4 account
- [ ] Install Node.js (v20+) and npm
- [ ] Install Wrangler CLI: `npm install -g wrangler`
- [ ] Authenticate Wrangler: `wrangler login`
- [ ] Plan initial content: outline 20 articles + 30 recipes

---

## PHASE 1 — Foundation
**Duration:** Weeks 1–3  
**Goal:** Launch a fully working static website with content

---

### Week 1: Setup & Structure

**Day 1–2: Project Initialization**

```bash
# 1. Create frontend (React + Vite + TypeScript)
npm create vite@latest healthwise-frontend -- --template react-ts
cd healthwise-frontend
npm install

# 2. Install core dependencies
npm install react-router-dom @tanstack/react-query zustand
npm install react-helmet-async lucide-react
npm install react-hook-form zod @hookform/resolvers

# 3. Install & configure Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Create Cloudflare Worker (backend API)
cd ..
npm create cloudflare@latest healthwise-api -- --type hono
cd healthwise-api
npm install hono @hono/zod-validator zod

# 5. Create D1 database
wrangler d1 create healthwise-db
# Copy the database_id to wrangler.toml

# 6. Create KV namespace
wrangler kv:namespace create "KV"
# Copy namespace_id to wrangler.toml

# 7. Create R2 bucket
wrangler r2 bucket create healthwise-images
```

**Day 3–4: Design System & Base Components**

Tasks:
- [ ] Set up Tailwind config with custom color tokens (from Design Brief)
- [ ] Install Google Fonts (DM Serif Display + Inter) via CSS
- [ ] Build base UI components:
  - `Button.tsx` (primary, secondary, accent variants)
  - `Card.tsx` (article, recipe variants)
  - `Badge.tsx` (category, dietary tags)
  - `Input.tsx`, `Select.tsx`, `Checkbox.tsx`
  - `Skeleton.tsx` (loading states)
  - `Toast.tsx` (notifications)

**Day 5: Layout Components**

Tasks:
- [ ] `Header.tsx` — desktop + mobile nav
- [ ] `Footer.tsx` — links, newsletter signup
- [ ] `MobileBottomNav.tsx` — 5-tab mobile nav
- [ ] `PageWrapper.tsx` — layout container
- [ ] `SEOHead.tsx` — React Helmet wrapper

---

**Day 6–7: Database Setup**

```sql
-- Run schema migration
wrangler d1 execute healthwise-db --file=schema/schema.sql

-- Verify tables created
wrangler d1 execute healthwise-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

Tasks:
- [ ] Run full schema.sql migration
- [ ] Insert seed data: categories, site settings
- [ ] Test D1 connection from Worker

---

### Week 2: Core Pages

**Articles System (Days 8–10)**

Worker routes to build:
```typescript
GET /api/articles              → list (paginated, filterable)
GET /api/articles/:slug        → single article
GET /api/articles/category/:slug → articles by category
```

Frontend pages to build:
- [ ] `HealthTips.tsx` — article listing with category filters
- [ ] `ArticleDetail.tsx` — full article page with TOC, references
- [ ] `ArticleCard.tsx` — reusable card component

**Recipes System (Days 11–13)**

Worker routes to build:
```typescript
GET /api/recipes               → list (filterable by category, diet, time, cost)
GET /api/recipes/:slug         → single recipe with ingredients + steps
GET /api/recipes/category/:slug → recipes by category
```

Frontend pages to build:
- [ ] `Recipes.tsx` — recipe listing with filter bar
- [ ] `RecipeDetail.tsx` — full recipe with adjustable servings
- [ ] `RecipeCard.tsx` — reusable card
- [ ] `RecipeFilter.tsx` — filter sidebar/bar component
- [ ] `NutritionPanel.tsx` — nutrition facts display

**Day 14: Home Page**

Build `Home.tsx`:
- [ ] Hero section with CTA
- [ ] Daily tip highlight bar
- [ ] Featured articles (3 cards)
- [ ] AI Tools banner/promo section
- [ ] Popular recipes (4 cards, horizontal scroll mobile)
- [ ] Newsletter signup section

---

### Week 3: Admin, Static Pages, Search, Deploy

**Admin Panel (Days 15–16)**

Admin Worker routes:
```typescript
// All require: Authorization header + admin role check
POST   /api/admin/articles          create
PUT    /api/admin/articles/:id      update
DELETE /api/admin/articles/:id      delete
POST   /api/admin/recipes           create
PUT    /api/admin/recipes/:id       update
DELETE /api/admin/recipes/:id       delete
GET    /api/admin/dashboard-stats   overview metrics
```

Admin frontend pages:
- [ ] `AdminLogin.tsx`
- [ ] `AdminDashboard.tsx` — stats overview
- [ ] `ManageArticles.tsx` — CRUD table
- [ ] `ArticleEditor.tsx` — rich text + SEO fields
- [ ] `ManageRecipes.tsx` — CRUD table
- [ ] `RecipeEditor.tsx` — full recipe form
- [ ] `HomepageSettings.tsx` — featured content editor

**Days 17–18: Static Pages & Search**

Static pages:
- [ ] About Us
- [ ] Contact (with form → saves to contact_messages table)
- [ ] Privacy Policy
- [ ] Terms of Use
- [ ] Medical Disclaimer
- [ ] Affiliate Disclosure

Search:
- [ ] `Search.tsx` — results page
- [ ] `SearchBar.tsx` — with live preview dropdown
- [ ] Worker: `GET /api/search?q=&type=`

**Day 19–21: SEO + Deploy**

SEO tasks:
- [ ] Add React Helmet to all pages
- [ ] Article schema markup (Article type)
- [ ] Recipe schema markup (Recipe + NutritionInformation)
- [ ] Generate sitemap.xml (Worker endpoint)
- [ ] robots.txt
- [ ] Open Graph meta tags for social sharing

Deployment:
```bash
# Deploy Worker
cd healthwise-api
wrangler deploy

# Deploy Frontend
cd ../healthwise-frontend
npm run build
wrangler pages deploy dist

# Set secrets
wrangler secret put JWT_SECRET
wrangler secret put ANTHROPIC_API_KEY
```

**Phase 1 Deliverable:**
✅ Live website with articles, recipes, search, admin panel, and static pages

---

## PHASE 2 — AI Tools
**Duration:** Weeks 4–6  
**Goal:** All 5 AI features live with safety controls

---

### Week 4: AI Infrastructure

**Day 22–23: Claude Service Layer**

Build `workers/src/services/claudeService.ts`:
- [ ] All 5 system prompts (wellness, mealPlan, recipe, nutrition, grocery)
- [ ] `callClaude()` function with error handling
- [ ] Response parsing (JSON tools vs plain text)
- [ ] Input sanitization before sending to Claude

**Day 24: Rate Limiting Middleware**

Build `workers/src/middleware/rateLimit.ts`:
- [ ] Guest: 10 req/hour per IP (KV-based)
- [ ] Logged-in user: 25 req/hour per user_id
- [ ] Return: requests_used, requests_remaining, resets_at
- [ ] Graceful error response with register CTA

**Day 25: AI Usage Logging**

- [ ] Log every AI request to `ai_usage_logs` table
- [ ] Log: tool, user_id/ip, token counts, duration, status
- [ ] Admin dashboard reads from this table

---

### Week 5: AI Tool Pages

**AI Wellness Chat (Days 26–27)**

Worker: `POST /api/ai/chat`
```typescript
Body: { message: string, history: Message[] }
Response: { reply: string, relatedArticles: ArticleRef[] }
```

Frontend `ChatWidget.tsx`:
- [ ] Chat interface (message bubbles)
- [ ] Typing indicator (animated dots)
- [ ] Conversation history (session storage only)
- [ ] Suggested starter questions
- [ ] Rate limit counter display
- [ ] AI disclaimer banner
- [ ] Related articles shown after each response

**AI Meal Planner (Days 28–30)**

Worker: `POST /api/ai/meal-plan`
```typescript
Body: { preferences: UserPrefs }
Response: { plan: MealPlan, status: 'success' }
```

Frontend `MealPlanner.tsx`:
- [ ] Step 1: Dietary preferences (multi-select)
- [ ] Step 2: Goals, budget, cook time, servings
- [ ] Loading state: "Creating your personalized plan..." (5–8 sec)
- [ ] 7-day calendar display (tabs per day)
- [ ] Each meal: name, calories, swap button
- [ ] "Get Grocery List" button
- [ ] "Save Plan" button (logged-in users)

---

### Week 6: Remaining AI Tools + Safety

**AI Recipe Generator (Days 31–32)**

Worker: `POST /api/ai/recipe`  
Frontend: `RecipeGenerator.tsx`
- [ ] Ingredient input (chip/tag input)
- [ ] Allergy filters
- [ ] Output: 2–3 recipe cards with full details
- [ ] "Save Recipe" option (logged-in users)

**AI Nutrition Analyzer (Day 33)**

Worker: `POST /api/ai/nutrition`  
Frontend: `NutritionAnalyzer.tsx`
- [ ] Ingredient + quantity form (add/remove rows)
- [ ] Servings input
- [ ] Output: nutrition facts table
- [ ] "Estimates only" disclaimer prominent

**AI Grocery List (Day 34)**

Worker: `POST /api/ai/grocery`  
Frontend: `GroceryList.tsx`
- [ ] Accept meal plan data as input
- [ ] Output: categorized checklist
- [ ] Interactive checkboxes
- [ ] Estimated total cost display

**Safety & AI Hub Page (Days 35–36)**

Safety implementation:
- [ ] All AI responses filtered for diagnosis/prescription language
- [ ] Emergency symptoms trigger: "Please call 911 or seek emergency care immediately"
- [ ] "This is not medical advice" appended to all responses
- [ ] Flagged responses logged with status='flagged' in ai_usage_logs

`AITools.tsx` — AI hub page:
- [ ] Cards for all 5 tools with descriptions
- [ ] Usage stats shown to logged-in users
- [ ] Guest users see "Create free account for more requests"

**Phase 2 Deliverable:**
✅ All 5 AI tools live with safety controls, rate limiting, and logging

---

## PHASE 3 — User Accounts
**Duration:** Weeks 7–9  
**Goal:** Full auth system, personal dashboard, saved items

---

### Week 7: Authentication

**Days 37–39: Auth System**

Worker auth routes:
```typescript
POST /api/auth/register    → create user, return JWT
POST /api/auth/login       → verify, return JWT + refresh token
POST /api/auth/refresh     → exchange refresh token for new JWT
POST /api/auth/logout      → invalidate refresh token
POST /api/auth/reset-pw    → send reset email
```

Implementation:
- [ ] Password hashing: bcrypt in Worker (using Web Crypto API)
- [ ] JWT signing/verification (using jose library)
- [ ] Refresh tokens: httpOnly cookie (7-day expiry)
- [ ] Access tokens: memory only in frontend (1-hour expiry)
- [ ] Login lockout after 5 failed attempts (KV-based, 30-min)
- [ ] Auth middleware for all protected routes

Frontend auth pages:
- [ ] `Login.tsx` — email + password form
- [ ] `Register.tsx` — name, email, password + dietary prefs
- [ ] `ForgotPassword.tsx` — email input
- [ ] `ResetPassword.tsx` — new password form
- [ ] `AuthProvider.tsx` — React context for auth state
- [ ] Protected route wrapper component

**Days 40–41: Auth Integration**

- [ ] Integrate auth into Header (show user menu when logged in)
- [ ] Update AI rate limits to use user_id for logged-in users
- [ ] Add "Save" button behavior (redirect to login if guest)
- [ ] Persist auth state across page refreshes (refresh token → new access token)

---

### Week 8: User Dashboard & Saved Items

**Days 42–44: Saved Items**

Worker routes:
```typescript
GET    /api/users/me/saved          → list saved items
POST   /api/users/me/saved          → save item { type, id }
DELETE /api/users/me/saved/:id      → remove saved item
```

Frontend:
- [ ] Save/unsave button on all article cards
- [ ] Save/unsave button on all recipe cards
- [ ] `SavedItems.tsx` — dashboard section
- [ ] Optimistic UI updates (instant feedback)

**Days 45–47: Dashboard**

`Dashboard.tsx` sections:
- [ ] Welcome bar with user name
- [ ] Quick action buttons (New Plan, AI Chat, Continue Reading)
- [ ] This week's meal plan summary
- [ ] Saved recipes carousel (horizontal scroll)
- [ ] Saved articles list
- [ ] Active grocery list with checkboxes
- [ ] Habit tracker section

Meal plan persistence:
- [ ] Save meal plan to DB when user clicks "Save Plan"
- [ ] Load most recent plan on dashboard
- [ ] View/delete previous plans

---

### Week 9: Habit Tracker & Account Settings

**Days 48–50: Habit Tracker**

Worker routes:
```typescript
GET    /api/users/me/habits         → list user habits
POST   /api/users/me/habits         → create habit
PUT    /api/users/me/habits/:id     → update habit
DELETE /api/users/me/habits/:id     → delete habit
POST   /api/users/me/habits/:id/log → log completion for today
GET    /api/users/me/habits/streak  → streak data for charts
```

Frontend `HabitTracker.tsx`:
- [ ] Default habits: drink water, eat veggies, walk 30 min, sleep 7+ hrs
- [ ] Add custom habits
- [ ] Daily checkbox grid (Mon–Sun current week)
- [ ] Streak counter per habit
- [ ] Weekly completion summary

**Days 51–53: Account Settings**

`AccountSettings.tsx`:
- [ ] Update name and email
- [ ] Change password
- [ ] Dietary preferences (multi-select update)
- [ ] Measurement units (US / Metric toggle)
- [ ] Newsletter preference
- [ ] Notification preferences
- [ ] Download my data (JSON export)
- [ ] Delete account (with confirmation)

**Phase 3 Deliverable:**
✅ Full auth system, personal dashboard, saved items, habits

---

## PHASE 4 — Growth & Monetization
**Duration:** Weeks 10–12  
**Goal:** SEO optimization, monetization, analytics, performance

---

### Week 10: SEO Deep Work

**Days 54–56: Technical SEO**

- [ ] XML sitemap auto-generation Worker endpoint (`/sitemap.xml`)
- [ ] Verify all canonical URLs are correct
- [ ] Fix any duplicate title/meta issues
- [ ] Add breadcrumb schema to all content pages
- [ ] Verify Recipe schema with Google Rich Results Test
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Search Console property
- [ ] Install Google Analytics 4 + configure events:
  - `article_view`, `recipe_view`, `ai_tool_used`, `save_item`
  - `newsletter_signup`, `user_registered`, `meal_plan_generated`

**Days 57–59: Content SEO**

- [ ] Audit all published articles: title tags, meta descriptions
- [ ] Add internal links between related articles
- [ ] Create content clusters (e.g., "Healthy Breakfast" hub page)
- [ ] Optimize all images: WebP format, descriptive alt text
- [ ] Add table of contents to all articles (auto-generated from H2s)
- [ ] Ensure all articles over 1,000 words have key takeaways box

---

### Week 11: Monetization

**Days 60–62: Google AdSense**

- [ ] Apply for Google AdSense (need 20+ quality articles)
- [ ] Add AdSense script to site (lazy-loaded)
- [ ] Create ad unit components: `AdBanner.tsx`, `AdSidebar.tsx`
- [ ] Placement rules:
  - Articles: 1 ad after paragraph 3, 1 ad at bottom
  - Recipes: 1 ad in ingredient column
  - NO ads in AI tools sections
  - NO ads near medical disclaimers
- [ ] Add "Advertisement" label above all ad units (FTC requirement)

**Days 63–65: Affiliate Links**

- [ ] Sign up for Amazon Associates (US)
- [ ] Create product recommendation component
- [ ] Add affiliate disclosure to relevant pages (legal requirement)
- [ ] Add "Best Kitchen Tools" article with affiliate links:
  - Meal prep containers
  - Healthy cooking pans
  - Portion control tools
  - Blenders for smoothies
- [ ] Track affiliate clicks in analytics

**Days 66–67: Newsletter System**

Options (free tier):
- [ ] Resend.com (3,000 emails/month free) — recommended
- [ ] Mailchimp (500 contacts free)

Implementation:
- [ ] Connect newsletter signup to chosen provider's API
- [ ] Welcome email template
- [ ] Weekly recipe roundup email template
- [ ] Admin: newsletter subscriber management page
- [ ] Unsubscribe link in all emails (CAN-SPAM requirement)

---

### Week 12: Performance & Polish

**Days 68–70: Performance Optimization**

Frontend optimization:
- [ ] Run Lighthouse on all major pages — target score 90+
- [ ] Implement proper code splitting (lazy load Dashboard, Admin)
- [ ] Optimize Core Web Vitals:
  - LCP: add `fetchpriority="high"` to hero images
  - CLS: add explicit width/height to all images
  - INP: reduce JavaScript bundle size
- [ ] Add skeleton screens everywhere data loads
- [ ] Implement stale-while-revalidate caching strategy
- [ ] Add service worker for offline article reading (PWA lite)

Worker optimization:
- [ ] Add response caching headers for public API routes
- [ ] Cache homepage data in KV (5-minute cache)
- [ ] Cache article/recipe detail in KV (5-minute cache)
- [ ] Add pagination to all list endpoints

**Days 71–73: Admin Analytics Dashboard**

Build admin analytics page:
- [ ] Daily/weekly/monthly visitors chart
- [ ] Most popular articles (by views)
- [ ] Most popular recipes (by views + saves)
- [ ] AI tool usage breakdown (by tool type)
- [ ] AI usage cost estimate
- [ ] Newsletter subscriber growth chart
- [ ] User registration trend

**Days 74–84: Final QA & Launch**

Testing checklist:
- [ ] Test all pages on mobile (iOS Safari + Android Chrome)
- [ ] Test all pages on desktop (Chrome, Firefox, Safari, Edge)
- [ ] Test all AI tools end-to-end
- [ ] Test auth flow (register, login, logout, forgot password)
- [ ] Test admin panel: CRUD for articles and recipes
- [ ] Test search across all content types
- [ ] Test rate limiting (exceed 10 AI requests)
- [ ] Run axe accessibility audit on all pages
- [ ] Test all error states (404, network error, AI error)
- [ ] Test recipe serving adjustment
- [ ] Test mobile bottom navigation
- [ ] Verify all legal pages exist and are linked in footer
- [ ] Verify medical disclaimers on all article pages

**Phase 4 Deliverable:**
✅ Production-ready website with SEO, monetization, and analytics

---

## Total Timeline Summary

| Phase | Weeks | Focus | Key Deliverable |
|---|---|---|---|
| Phase 1 | 1–3 | Foundation | Live website + admin + content |
| Phase 2 | 4–6 | AI Tools | 5 AI tools + safety controls |
| Phase 3 | 7–9 | User Accounts | Auth + dashboard + personalization |
| Phase 4 | 10–12 | Growth | SEO + monetization + optimization |

---

## Minimum Viable Launch (MVP)

If you want to launch faster (in 3–4 weeks), launch with only:

| Feature | Status |
|---|---|
| Home page | ✅ Include |
| 15+ published articles | ✅ Include |
| 20+ published recipes | ✅ Include |
| Search | ✅ Include |
| AI Wellness Chat | ✅ Include |
| AI Meal Planner | ✅ Include |
| Admin panel | ✅ Include |
| Static pages (Privacy, Disclaimer, etc.) | ✅ Include (required) |
| User accounts | ⏸ Phase 2 |
| AI Recipe Generator | ⏸ Phase 2 |
| Habit Tracker | ⏸ Phase 2 |
| AdSense | ⏸ Phase 3 |

This gets you a live, valuable product quickly — then iterate.

---

## Post-Launch Priorities

After launch, focus on:

1. **Content velocity** — publish 2–3 new articles per week
2. **Keyword research** — target low-competition health keywords
3. **User feedback** — add a simple feedback widget
4. **AI tool improvements** — based on actual usage patterns
5. **Performance monitoring** — Cloudflare analytics + GA4
6. **Content refresh** — update older articles every 6 months

---

## Risk Mitigation

| Risk | Plan |
|---|---|
| Anthropic API costs too high | Monitor daily, add stricter rate limits |
| D1 storage limit hit | Archive old AI logs monthly |
| Low organic traffic at launch | Start with social media + Reddit health communities |
| AI gives wrong health info | Weekly audit of AI logs for flagged responses |
| Cloudflare Worker 100k req/day hit | Upgrade to $5/month Workers Paid plan |

---

## Development Tools & Resources

```
Code Editor:          VS Code (recommended)
API Testing:          Bruno or Hoppscotch (free Postman alternatives)
Database GUI:         Cloudflare D1 console in dashboard
Git Workflow:         main (production) + dev (development) branches
Design Reference:     Design Brief (Document 4)
Schema Reference:     Backend Schema (Document 5)
```

---

*Document Owner: Project Lead*  
*Version: 1.0 — October 2026*  
*Ready to build: Start with Phase 1, Week 1, Day 1.*
