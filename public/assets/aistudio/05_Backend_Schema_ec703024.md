# HealthWise USA — Backend Schema

**Version:** 1.0  
**Date:** October 2026  
**Database:** Cloudflare D1 (SQLite dialect)  
**Storage:** Cloudflare R2 (images), Cloudflare KV (cache/sessions)

---

## 1. Complete SQL Schema

```sql
-- ============================================
-- HEALTHWISE USA — DATABASE SCHEMA v1.0
-- Cloudflare D1 (SQLite)
-- ============================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;


-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
  id            TEXT      PRIMARY KEY,           -- UUID v4
  email         TEXT      UNIQUE NOT NULL,
  name          TEXT      NOT NULL,
  password_hash TEXT      NOT NULL,              -- bcrypt
  role          TEXT      NOT NULL DEFAULT 'user',  -- user | editor | admin
  status        TEXT      NOT NULL DEFAULT 'active', -- active | suspended | deleted
  avatar_url    TEXT,
  
  -- Preferences
  dietary_prefs TEXT      DEFAULT '[]',          -- JSON array: ["vegetarian","gluten-free"]
  measurement_unit TEXT   DEFAULT 'us',          -- us | metric
  newsletter_opt_in INTEGER DEFAULT 0,           -- 0 | 1
  
  -- Timestamps
  email_verified_at DATETIME,
  last_login_at     DATETIME,
  created_at        DATETIME  NOT NULL DEFAULT (datetime('now')),
  updated_at        DATETIME  NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);


CREATE TABLE refresh_tokens (
  id          TEXT      PRIMARY KEY,
  user_id     TEXT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT      UNIQUE NOT NULL,
  expires_at  DATETIME  NOT NULL,
  created_at  DATETIME  NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);


CREATE TABLE password_resets (
  id          TEXT      PRIMARY KEY,
  user_id     TEXT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT      UNIQUE NOT NULL,
  expires_at  DATETIME  NOT NULL,
  used_at     DATETIME,
  created_at  DATETIME  NOT NULL DEFAULT (datetime('now'))
);


-- ============================================
-- CONTENT — CATEGORIES
-- ============================================

CREATE TABLE categories (
  id          INTEGER   PRIMARY KEY AUTOINCREMENT,
  name        TEXT      UNIQUE NOT NULL,          -- "Heart Health"
  slug        TEXT      UNIQUE NOT NULL,          -- "heart-health"
  type        TEXT      NOT NULL,                 -- article | recipe | both
  description TEXT,
  icon        TEXT,                               -- emoji or icon name
  sort_order  INTEGER   DEFAULT 0,
  is_active   INTEGER   DEFAULT 1,
  created_at  DATETIME  NOT NULL DEFAULT (datetime('now'))
);

-- Seed data:
-- INSERT INTO categories (name, slug, type, icon) VALUES
--   ('Nutrition', 'nutrition', 'both', '🥗'),
--   ('Fitness', 'fitness', 'article', '💪'),
--   ('Sleep', 'sleep', 'article', '😴'),
--   ('Healthy Breakfast', 'healthy-breakfast', 'recipe', '🌅'),
--   ('Lunch & Dinner', 'lunch-dinner', 'recipe', '🍽'),
--   ('Healthy Snacks', 'healthy-snacks', 'recipe', '🍎'),
--   ('Budget Meals', 'budget-meals', 'recipe', '💰');


-- ============================================
-- ARTICLES
-- ============================================

CREATE TABLE articles (
  id                TEXT      PRIMARY KEY,        -- UUID v4
  title             TEXT      NOT NULL,
  slug              TEXT      UNIQUE NOT NULL,
  excerpt           TEXT,                         -- 150–200 char summary
  content           TEXT      NOT NULL,           -- HTML content
  cover_image_url   TEXT,
  
  -- Classification
  category_id       INTEGER   REFERENCES categories(id),
  tags              TEXT      DEFAULT '[]',        -- JSON array of tag strings
  
  -- Authorship
  author_id         TEXT      REFERENCES users(id),
  author_name       TEXT,                          -- fallback if no user account
  medical_reviewer  TEXT,
  
  -- SEO
  meta_title        TEXT,
  meta_description  TEXT,                          -- max 160 chars
  
  -- Metrics
  reading_time_min  INTEGER   DEFAULT 5,
  view_count        INTEGER   DEFAULT 0,
  
  -- Publishing
  status            TEXT      NOT NULL DEFAULT 'draft', -- draft | review | published | archived
  published_at      DATETIME,
  last_reviewed_at  DATETIME,
  
  -- Timestamps
  created_at        DATETIME  NOT NULL DEFAULT (datetime('now')),
  updated_at        DATETIME  NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_articles_slug        ON articles(slug);
CREATE INDEX idx_articles_category    ON articles(category_id);
CREATE INDEX idx_articles_status      ON articles(status);
CREATE INDEX idx_articles_published   ON articles(published_at DESC);


CREATE TABLE article_references (
  id          INTEGER   PRIMARY KEY AUTOINCREMENT,
  article_id  TEXT      NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  title       TEXT      NOT NULL,
  url         TEXT      NOT NULL,
  source      TEXT,                               -- "CDC", "NIH", "USDA"
  sort_order  INTEGER   DEFAULT 0
);


-- ============================================
-- RECIPES
-- ============================================

CREATE TABLE recipes (
  id                TEXT      PRIMARY KEY,        -- UUID v4
  title             TEXT      NOT NULL,
  slug              TEXT      UNIQUE NOT NULL,
  description       TEXT,
  cover_image_url   TEXT,
  
  -- Classification
  category_id       INTEGER   REFERENCES categories(id),
  dietary_tags      TEXT      DEFAULT '[]',        -- JSON: ["vegetarian","high-protein","gluten-free"]
  allergens         TEXT      DEFAULT '[]',        -- JSON: ["nuts","dairy","eggs"]
  difficulty        TEXT      DEFAULT 'easy',      -- easy | medium | hard
  
  -- Timing
  prep_time_min     INTEGER   NOT NULL,
  cook_time_min     INTEGER   NOT NULL,
  total_time_min    INTEGER   GENERATED ALWAYS AS (prep_time_min + cook_time_min) STORED,
  
  -- Serving
  base_servings     INTEGER   DEFAULT 4,
  
  -- Cost
  cost_per_serving  REAL,                          -- USD
  
  -- Nutrition (per base serving)
  calories          INTEGER,
  protein_g         REAL,
  carbs_g           REAL,
  fat_g             REAL,
  fiber_g           REAL,
  sodium_mg         REAL,
  sugar_g           REAL,
  nutrition_note    TEXT      DEFAULT 'Nutrition values are estimates.',
  
  -- SEO
  meta_title        TEXT,
  meta_description  TEXT,
  
  -- Metrics
  view_count        INTEGER   DEFAULT 0,
  save_count        INTEGER   DEFAULT 0,
  
  -- Authorship & Status
  author_id         TEXT      REFERENCES users(id),
  status            TEXT      NOT NULL DEFAULT 'draft', -- draft | published | archived
  published_at      DATETIME,
  
  -- Timestamps
  created_at        DATETIME  NOT NULL DEFAULT (datetime('now')),
  updated_at        DATETIME  NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_recipes_slug        ON recipes(slug);
CREATE INDEX idx_recipes_category    ON recipes(category_id);
CREATE INDEX idx_recipes_status      ON recipes(status);
CREATE INDEX idx_recipes_total_time  ON recipes(total_time_min);
CREATE INDEX idx_recipes_calories    ON recipes(calories);


CREATE TABLE recipe_ingredients (
  id          INTEGER   PRIMARY KEY AUTOINCREMENT,
  recipe_id   TEXT      NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  
  -- US-first with metric option
  amount_us   TEXT      NOT NULL,                 -- "2 cups", "1 lb", "3 tbsp"
  amount_metric TEXT,                             -- "480 ml", "450 g"
  ingredient  TEXT      NOT NULL,                 -- "rolled oats"
  notes       TEXT,                               -- "or quick-cook oats"
  
  sort_order  INTEGER   DEFAULT 0,
  group_name  TEXT                                -- "For the sauce:", "Topping:"
);

CREATE INDEX idx_ingredients_recipe ON recipe_ingredients(recipe_id);


CREATE TABLE recipe_instructions (
  id          INTEGER   PRIMARY KEY AUTOINCREMENT,
  recipe_id   TEXT      NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER   NOT NULL,
  instruction TEXT      NOT NULL,
  tip         TEXT                                -- optional tip for this step
);

CREATE INDEX idx_instructions_recipe ON recipe_instructions(recipe_id);


CREATE TABLE recipe_images (
  id          INTEGER   PRIMARY KEY AUTOINCREMENT,
  recipe_id   TEXT      NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  image_url   TEXT      NOT NULL,
  alt_text    TEXT,
  is_cover    INTEGER   DEFAULT 0,
  sort_order  INTEGER   DEFAULT 0
);


-- ============================================
-- USER SAVED ITEMS
-- ============================================

CREATE TABLE saved_items (
  id          INTEGER   PRIMARY KEY AUTOINCREMENT,
  user_id     TEXT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type   TEXT      NOT NULL,                 -- article | recipe
  item_id     TEXT      NOT NULL,
  saved_at    DATETIME  NOT NULL DEFAULT (datetime('now')),
  
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX idx_saved_user      ON saved_items(user_id);
CREATE INDEX idx_saved_user_type ON saved_items(user_id, item_type);


-- ============================================
-- MEAL PLANS
-- ============================================

CREATE TABLE meal_plans (
  id            TEXT      PRIMARY KEY,            -- UUID v4
  user_id       TEXT      REFERENCES users(id) ON DELETE SET NULL,  -- NULL = anonymous (session only)
  session_id    TEXT,                             -- for anonymous users
  
  title         TEXT      DEFAULT 'My Meal Plan',
  week_of       DATE,                             -- start of the week (Monday)
  
  -- User preferences at time of generation
  dietary_prefs TEXT      DEFAULT '[]',           -- JSON array
  allergies     TEXT      DEFAULT '[]',           -- JSON array
  calorie_goal  INTEGER,
  weekly_budget REAL,
  cook_time_pref TEXT     DEFAULT 'any',          -- under30 | 30to60 | any
  servings      INTEGER   DEFAULT 2,
  
  -- The plan data
  plan_data     TEXT      NOT NULL,               -- JSON: 7-day plan structure
  
  status        TEXT      DEFAULT 'active',       -- active | archived
  created_at    DATETIME  NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_meal_plans_user ON meal_plans(user_id);

/*
plan_data JSON structure:
{
  "days": [
    {
      "day": "Monday",
      "meals": {
        "breakfast": { "name": "Oatmeal with Berries", "calories": 350, "recipeId": "uuid-or-null" },
        "lunch": { "name": "Grilled Chicken Salad", "calories": 420 },
        "dinner": { "name": "Salmon & Veggies", "calories": 520 },
        "snack": { "name": "Greek Yogurt", "calories": 200 }
      },
      "total_calories": 1490
    },
    ...
  ],
  "weekly_avg_calories": 1500,
  "estimated_weekly_cost": 48.50
}
*/


-- ============================================
-- GROCERY LISTS
-- ============================================

CREATE TABLE grocery_lists (
  id          TEXT      PRIMARY KEY,              -- UUID v4
  user_id     TEXT      REFERENCES users(id) ON DELETE SET NULL,
  meal_plan_id TEXT     REFERENCES meal_plans(id) ON DELETE SET NULL,
  
  title       TEXT      DEFAULT 'Grocery List',
  list_data   TEXT      NOT NULL,                 -- JSON: categorized items
  estimated_total REAL,
  
  created_at  DATETIME  NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_grocery_user ON grocery_lists(user_id);

/*
list_data JSON structure:
{
  "categories": {
    "produce": [
      { "item": "Spinach", "amount": "1 bag (5 oz)", "checked": false, "estimatedCost": 2.99 }
    ],
    "dairy": [ ... ],
    "proteins": [ ... ],
    "pantry": [ ... ],
    "frozen": [ ... ]
  }
}
*/


-- ============================================
-- HABIT TRACKING
-- ============================================

CREATE TABLE habits (
  id          INTEGER   PRIMARY KEY AUTOINCREMENT,
  user_id     TEXT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT      NOT NULL,                 -- "Drink 8 glasses of water"
  category    TEXT      DEFAULT 'general',        -- hydration | nutrition | activity | sleep
  icon        TEXT,                               -- emoji
  is_active   INTEGER   DEFAULT 1,
  sort_order  INTEGER   DEFAULT 0,
  created_at  DATETIME  NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_habits_user ON habits(user_id);


CREATE TABLE habit_logs (
  id          INTEGER   PRIMARY KEY AUTOINCREMENT,
  habit_id    INTEGER   NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id     TEXT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logged_date DATE      NOT NULL,                 -- YYYY-MM-DD
  completed   INTEGER   DEFAULT 1,               -- 1 = done
  note        TEXT,
  
  UNIQUE(habit_id, logged_date)
);

CREATE INDEX idx_habit_logs_user ON habit_logs(user_id);
CREATE INDEX idx_habit_logs_date ON habit_logs(logged_date);


-- ============================================
-- AI TOOL USAGE LOGS
-- ============================================

CREATE TABLE ai_usage_logs (
  id          INTEGER   PRIMARY KEY AUTOINCREMENT,
  user_id     TEXT      REFERENCES users(id),    -- NULL = anonymous
  session_ip  TEXT,
  tool        TEXT      NOT NULL,                -- wellness | mealPlan | recipe | nutrition | grocery
  input_tokens  INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  duration_ms   INTEGER,
  status      TEXT      DEFAULT 'success',       -- success | error | rate_limited | flagged
  error_code  TEXT,
  created_at  DATETIME  NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_ai_logs_user    ON ai_usage_logs(user_id);
CREATE INDEX idx_ai_logs_tool    ON ai_usage_logs(tool);
CREATE INDEX idx_ai_logs_created ON ai_usage_logs(created_at);


-- ============================================
-- NEWSLETTER
-- ============================================

CREATE TABLE newsletter_subscribers (
  id              TEXT      PRIMARY KEY,          -- UUID v4
  email           TEXT      UNIQUE NOT NULL,
  name            TEXT,
  status          TEXT      NOT NULL DEFAULT 'active', -- active | unsubscribed
  source          TEXT,                           -- homepage | article | recipe | signup
  subscribed_at   DATETIME  NOT NULL DEFAULT (datetime('now')),
  unsubscribed_at DATETIME
);

CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);


-- ============================================
-- CONTACT MESSAGES
-- ============================================

CREATE TABLE contact_messages (
  id          INTEGER   PRIMARY KEY AUTOINCREMENT,
  name        TEXT      NOT NULL,
  email       TEXT      NOT NULL,
  subject     TEXT,
  message     TEXT      NOT NULL,
  status      TEXT      DEFAULT 'unread',        -- unread | read | replied
  ip_address  TEXT,
  created_at  DATETIME  NOT NULL DEFAULT (datetime('now'))
);


-- ============================================
-- ADMIN: HOMEPAGE SETTINGS
-- ============================================

CREATE TABLE site_settings (
  key         TEXT      PRIMARY KEY,
  value       TEXT,
  updated_by  TEXT      REFERENCES users(id),
  updated_at  DATETIME  DEFAULT (datetime('now'))
);

-- Default settings:
-- INSERT INTO site_settings (key, value) VALUES
--   ('hero_headline', 'Eat Well. Feel Great.'),
--   ('hero_subtext', 'Real health tips for everyday Americans.'),
--   ('hero_cta_text', 'Get My Free Meal Plan'),
--   ('daily_tip', 'Try adding one extra vegetable to your dinner tonight.'),
--   ('featured_recipe_ids', '[]'),
--   ('featured_article_ids', '[]'),
--   ('maintenance_mode', '0');
```

---

## 2. Cloudflare KV Schema

KV is used for ephemeral data (rate limiting, sessions, cache).

```
Key Pattern                          Value               TTL
──────────────────────────────────────────────────────────────────
ratelimit:ai:{ip}                    count (string)      3600s (1hr)
ratelimit:ai:user:{user_id}          count (string)      3600s
session:{session_id}                 user_id (string)    86400s (24hr)
cache:article:{slug}                 JSON string         300s (5min)
cache:recipe:{slug}                  JSON string         300s
cache:articles:list:{hash}           JSON string         120s
cache:recipes:list:{hash}            JSON string         120s
cache:homepage                       JSON string         300s
```

---

## 3. Cloudflare R2 Storage Structure

```
Bucket: healthwise-images
├── articles/
│   ├── {article-slug}-cover.webp
│   └── {article-slug}-{uid}.webp
├── recipes/
│   ├── {recipe-slug}-cover.webp
│   └── {recipe-slug}-{uid}-{n}.webp
├── users/
│   └── avatars/
│       └── {user-id}.webp
└── uploads/
    └── food-labels/              ← AI food label analysis (temp)
        └── {session-id}-{ts}.webp
```

**R2 Public Access URL:**
```
https://images.healthwiseusa.com/{path}
```

---

## 4. TypeScript Types

```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'editor' | 'admin';
  status: 'active' | 'suspended' | 'deleted';
  avatarUrl?: string;
  dietaryPrefs: string[];
  measurementUnit: 'us' | 'metric';
  newsletterOptIn: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
}

// types/article.ts
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  categoryId: number;
  category?: Category;
  tags: string[];
  authorName: string;
  medicalReviewer?: string;
  metaTitle?: string;
  metaDescription?: string;
  readingTimeMin: number;
  viewCount: number;
  status: 'draft' | 'review' | 'published' | 'archived';
  publishedAt?: string;
  lastReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// types/recipe.ts
export interface RecipeIngredient {
  id: number;
  amountUs: string;
  amountMetric?: string;
  ingredient: string;
  notes?: string;
  sortOrder: number;
  groupName?: string;
}

export interface RecipeInstruction {
  id: number;
  stepNumber: number;
  instruction: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  categoryId: number;
  category?: Category;
  dietaryTags: string[];
  allergens: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prepTimeMin: number;
  cookTimeMin: number;
  totalTimeMin: number;
  baseServings: number;
  costPerServing?: number;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  fiberG?: number;
  sodiumMg?: number;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// types/mealPlan.ts
export interface MealDay {
  day: string;
  meals: {
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
    snack: MealItem;
  };
  totalCalories: number;
}

export interface MealItem {
  name: string;
  calories: number;
  recipeId?: string;
}

export interface MealPlan {
  id: string;
  userId?: string;
  title: string;
  weekOf?: string;
  dietaryPrefs: string[];
  allergies: string[];
  calorieGoal?: number;
  weeklyBudget?: number;
  servings: number;
  planData: {
    days: MealDay[];
    weeklyAvgCalories: number;
    estimatedWeeklyCost?: number;
  };
  status: 'active' | 'archived';
  createdAt: string;
}
```

---

## 5. Database Migrations

```sql
-- migrations/0001_initial.sql (the schema above)

-- migrations/0002_add_article_views.sql
ALTER TABLE articles ADD COLUMN share_count INTEGER DEFAULT 0;

-- migrations/0003_add_recipe_ratings.sql
CREATE TABLE recipe_ratings (
  id          INTEGER   PRIMARY KEY AUTOINCREMENT,
  recipe_id   TEXT      NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id     TEXT      REFERENCES users(id),
  rating      INTEGER   NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at  DATETIME  NOT NULL DEFAULT (datetime('now')),
  UNIQUE(recipe_id, user_id)
);
```

---

## 6. Key Query Patterns

```sql
-- Homepage: Featured articles (published, ordered by views)
SELECT id, title, slug, excerpt, cover_image_url, 
       reading_time_min, published_at,
       c.name as category_name, c.slug as category_slug
FROM articles a
LEFT JOIN categories c ON a.category_id = c.id
WHERE a.status = 'published'
ORDER BY a.view_count DESC
LIMIT 6;

-- Recipe search with all filters
SELECT r.*, c.name as category_name
FROM recipes r
LEFT JOIN categories c ON r.category_id = c.id
WHERE r.status = 'published'
  AND (? IS NULL OR r.total_time_min <= ?)
  AND (? IS NULL OR r.calories <= ?)
  AND (? IS NULL OR r.cost_per_serving <= ?)
  AND (? IS NULL OR r.category_id = ?)
  AND (? = '[]' OR r.dietary_tags LIKE ?)
ORDER BY r.published_at DESC
LIMIT ? OFFSET ?;

-- Full-text search (simplified)
SELECT 'article' as type, id, title, slug, excerpt as description
FROM articles
WHERE status = 'published'
  AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)
UNION ALL
SELECT 'recipe' as type, id, title, slug, description
FROM recipes
WHERE status = 'published'
  AND (title LIKE ? OR description LIKE ?)
ORDER BY title
LIMIT 20;

-- AI usage stats for admin
SELECT 
  tool,
  COUNT(*) as total_requests,
  SUM(input_tokens + output_tokens) as total_tokens,
  SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) as errors,
  AVG(duration_ms) as avg_duration_ms,
  DATE(created_at) as date
FROM ai_usage_logs
WHERE created_at >= DATE('now', '-30 days')
GROUP BY tool, DATE(created_at)
ORDER BY date DESC;
```

---

## 7. Environment Variables

```bash
# Cloudflare Worker Secrets (set via: wrangler secret put KEY_NAME)
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=random-64-char-string

# Cloudflare Worker Vars (in wrangler.toml [vars])
ENVIRONMENT=production
FRONTEND_URL=https://healthwiseusa.com
JWT_EXPIRY=7d
AI_RATE_LIMIT_GUEST=10
AI_RATE_LIMIT_USER=50
MAX_FILE_SIZE_MB=5

# Cloudflare Bindings (in wrangler.toml)
DB           # D1 database binding
KV           # KV namespace binding
IMAGES       # R2 bucket binding
```

---

*Document Owner: Backend Engineering*  
*Version: 1.0 — October 2026*
