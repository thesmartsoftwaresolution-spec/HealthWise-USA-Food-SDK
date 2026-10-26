# HealthWise USA — End-to-End Audit & Platform Polish Plan

A comprehensive engineering plan to audit, polish, and finalize HealthWise USA into a production-grade, evidence-based nutrition and wellness web application tailored for American households.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed by the user in Phase 1:
> - **Primary Focus**: Full end-to-end audit and polish of all existing features (all 5 AI health tools, editorial catalog, recipe engine, user dashboard, admin suite, and static compliance pages).
> - **State & Persistence**: In-memory backend preloaded with authentic, rich American nutritional and clinical data (USDA/CDC dietary standards, DASH & Mediterranean meal templates, nutrition fact panels).
> - **Medical Disclaimers**: Inline FDA/FTC disclaimers directly integrated under every AI-generated response, recipe card, and health article.

---

## 1. Overview & Core Concept

- **What It Does**: HealthWise USA is an evidence-based digital health and nutrition platform. It pairs vetted editorial articles and chef-curated recipes with 5 intelligent AI tools (Wellness Chat, 7-Day Meal Planner, Recipe Generator, Nutrition Analyzer, and Supermarket Grocery Organizers) to help everyday Americans achieve realistic, sustainable health goals.
- **Target Audience / Persona**: Health-conscious Americans, families balancing busy schedules with healthy home cooking, individuals managing dietary constraints (diabetic-friendly, low-sodium, heart-healthy, high-protein), and caregivers.
- **Key Value**: Replaces contradictory online diet fads with calm, peer-reviewed nutritional guidance, realistic American supermarket ingredient availability, and reliable clinical guardrails.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Discovery & Exploration Flow**:
   - Visitors land on the warm editorial hero, browse trending health articles or search by condition/category (Heart Health, Weight Management, Diabetes-Friendly, Longevity).
   - Article reading experience includes estimated reading time, medical review attribution (e.g., "Reviewed by Sarah Jenkins, MS, RD"), drop caps, key takeaways callout, and inline FDA medical notices.

2. **Recipe & Interactive Cooking Flow**:
   - Filter recipes by meal type, prep time, dietary tags, and caloric targets.
   - Interactive recipe page with dynamic serving-size scalar, ingredient checkbox checklist, step-by-step cooking directions, full FDA nutrition facts panel, and verified user ratings/reviews.

3. **5 Intelligent Wellness Tools Flow**:
   - **AI Wellness Chat**: Evidence-based nutrition and lifestyle guidance with predefined prompts, streaming responses, and prominent inline clinical notices.
   - **7-Day Meal Planner**: Generates full weekly breakfasts, lunches, dinners, and snacks based on calorie targets and dietary restrictions, with "Add all ingredients to Grocery List" and print capabilities.
   - **Smart Recipe Generator**: Converts pantry ingredients on hand into creative, wholesome dishes.
   - **Nutrition Analyzer**: Calculates macro/micronutrient breakdown from plain food descriptions.
   - **Smart Grocery List**: Groups ingredients by standard American supermarket aisles (Produce, Dairy, Meat/Seafood, Pantry, Frozen) with check-off functionality.

4. **Account & Habit Dashboard**:
   - Log daily water intake, fruit/veggie servings, sleep hours, and physical activity.
   - Access saved recipes, bookmarked health articles, and active meal plans.

5. **Editorial & Admin Management**:
   - Admin view to curate articles, publish recipes, moderate community reviews, and inspect platform analytics.

### Visual Identity & Theme

- **Aesthetic Direction**: Curatorial Editorial & Warm Institutional. Evoking high-end wellness publications and trustworthy clinical journals without sterile hospital coldness.
- **Color Palette**:
  - Primary Forest Ink: `#1D4A2B` / `#2D7D46` (vitality, organic nature, trust)
  - Warm Paper Canvas: `#FAF8F5` / `#F3EFEA` (archival paper reading atmosphere)
  - Editorial Charcoal: `#1F2421` (high-contrast, strain-free body text)
  - Terracotta Accent: `#D95D39` (warm accents, active badges, call-to-actions)
  - Muted Borders: `#E2DDD5` (delicate 1px borders)
- **Typography & Hierarchy**:
  - Headings: `DM Serif Display` / `Fraunces` for editorial authority and elegance.
  - Body & Data: `Inter` / `Plus Jakarta Sans` for crisp legibility across macro tables and ingredient lists.
  - Metadata: Quiet unboxed inline text with typographic middle-dot separators (`·`), eliminating noisy candy pill boxes.
- **Micro-Interactions**:
  - Smooth tab switching on the Dashboard without layout shifts.
  - Instant live filter updates on Recipes and Articles.
  - Toast confirmation notifications for bookmarking, saving meal plans, and submitting reviews.
  - Print-optimized CSS stylesheets for meal plans and recipes.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Inline Medical & FDA Disclaimers**:
  - *Chosen Approach*: Embed structured disclaimer banners immediately below generated tool outputs and recipes rather than hiding them in popups or distant footers.
  - *Why*: Satisfies strict FTC & FDA compliance requirements for American health publications while maintaining immediate visual reassurance for the user.
  - *Alternatives Considered*: Floating persistent modals (dismissed or intrusive on mobile) or static footer-only disclaimers (easy to overlook).

- **Decision 2: Rich In-Memory Server Database with Preloaded Health Data**:
  - *Chosen Approach*: Retain an Express in-memory mock store populated with realistic USDA/CDC data, verified recipes, and complete user state with automatic fallback logic.
  - *Why*: Instant sub-millisecond response times, zero external setup friction, seamless offline reliability, and deterministic testability.
  - *Alternatives Considered*: Browser-only localStorage (fails if switching devices or tabs) or heavy external SQL setup (unnecessary operational complexity for this scope).

- **Decision 3: Zero-Pill Editorial Design Constitution**:
  - *Chosen Approach*: Strip out cluttered gradient pills and static badges in favor of refined typographic hierarchies and functional segmented control buttons.
  - *Why*: Delivers an authentic journalistic feel matching prestigious health publications.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT ARCHITECTURE (REACT)                     │
├────────────────────────────────────────────────────────────────────────┤
│  Pages / Views:                                                        │
│  ├── Home, HealthTips, ArticleDetail                                   │
│  ├── Recipes, RecipeDetail (Dynamic Scaler, Review Submission)         │
│  ├── 5 AI Tools (Chat, Meal Planner, Recipe Gen, Analyzer, Grocery)    │
│  ├── Dashboard (Habits Tracker, Saved Items, 7-Day Plan Sync)          │
│  ├── AdminDashboard (Articles, Recipes CRUD, Moderation)               │
│  └── Compliance Pages (About, Contact, Disclaimer, Privacy, Terms)     │
│                                                                        │
│  Shared State & Context:                                               │
│  ├── AuthContext (User Session, Role, Habit Logs, Bookmarks)           │
│  └── UI Feedback (Toast notifications, Print media styles)             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST Fetch /api/*
┌───────────────────────────────────▼────────────────────────────────────┐
│                       EXPRESS BACKEND (server.ts)                      │
├────────────────────────────────────────────────────────────────────────┤
│  API Endpoints:                                                        │
│  ├── /api/articles (Search, category filtering, reading stats)         │
│  ├── /api/recipes (Macro filters, ingredient queries, review CRUD)     │
│  ├── /api/ai/* (Chat, Meal Planner, Recipe Gen, Nutrition, Grocery)    │
│  │   ├── Primary: Google GenAI SDK (@google/genai)                     │
│  │   └── Fallback: Rule-based nutritional heuristics engine           │
│  ├── /api/habits, /api/user/* (Bookmarks, Meal plans, Profiles)        │
│  └── /api/admin/* (Moderation, analytics, content publishing)          │
│                                                                        │
│  In-Memory Storage Layer (src/server/db.ts):                           │
│  └── Rich Preloaded Datasets: Articles, Recipes, Users, Reviews, Logs  │
└────────────────────────────────────────────────────────────────────────┘
```

### Component & State Mapping

- **Recipe Detail & Dynamic Serving Scaler**: Changing servings updates all ingredient quantities and macro totals proportionally without re-fetching.
- **Review Submission**: Submitting a review immediately adds the review to the thread, recalibrates the recipe's average star rating, and alerts the user via Toast.
- **Meal Plan to Grocery Sync**: Clicking "Export to Grocery List" in the 7-Day Meal Planner seamlessly merges ingredients into the user's active grocery checklist categorized by grocery store aisles.
- **Habit Tracker Sync**: Quick-logging water (oz), vegetable servings, or sleep hours persists across views and updates dashboard progress bars.
- **Print Optimization**: All recipe and meal plan views feature clean print stylesheets (`@media print`) stripping navigation bars, ads, and interactive buttons.

---

## 5. Verification & Acceptance Checklist

1. **Compilation & Type Safety**:
   - `compile_applet` succeeds with 0 errors and 0 type warnings.
2. **Unit Tests**:
   - Run `node --test src/utils/healthwise.test.ts` to verify utility functions (recipe scaling, macro calculation, grocery categorization, and habit scoring).
3. **End-to-End Visual Audit**:
   - Verify every tool and page operates with complete interactive handlers (no placeholder buttons).
   - Ensure inline FDA notices are consistently styled and present across all 5 AI tools and recipe details.
   - Confirm mobile navigation bar correctly toggles and navigates cleanly.
