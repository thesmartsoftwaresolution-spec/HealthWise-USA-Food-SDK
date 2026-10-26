# HealthWise USA — App Flow Document
## User & Admin Experience

**Version:** 1.0  
**Date:** October 2026  
**Purpose:** Define every user journey and admin workflow on the platform

---

## PART A — USER FLOWS

---

### Flow 1: First-Time Visitor (Guest)

```
User lands on Website
        │
        ▼
┌───────────────────┐
│    HOME PAGE      │
│  - Hero Banner    │
│  - Daily Health   │
│    Tip            │
│  - Healthy Food   │
│    of the Day     │
│  - Popular        │
│    Recipes        │
│  - Trending       │
│    Articles       │
│  - AI Tools CTA   │
└────────┬──────────┘
         │
    User explores
         │
    ┌────┴────────────────────────────┐
    │                                 │
    ▼                                 ▼
Reads an Article              Browses Recipes
    │                                 │
    ▼                                 ▼
Article Detail Page           Recipe Detail Page
- Full content                - Ingredients list
- Table of contents           - Instructions
- Key takeaways               - Nutrition info
- Related articles            - Save / Print
- Share buttons               - Similar recipes
    │                                 │
    ▼                                 ▼
Sees "Save this article"      Sees "Save this recipe"
CTA → Prompted to Register    CTA → Prompted to Register
```

**Key Principle:** Guest users can read everything. Account is needed only to save or personalize.

---

### Flow 2: Registration & Login

```
User clicks "Sign Up"
        │
        ▼
┌─────────────────────────┐
│   REGISTRATION PAGE     │
│  - First Name           │
│  - Email Address        │
│  - Password             │
│  - Confirm Password     │
│  - Dietary Preferences  │
│    (optional)           │
│  - Newsletter opt-in    │
└────────┬────────────────┘
         │
    ┌────┴────────────────┐
    │                     │
    ▼                     ▼
Email Valid &         Validation Error
Password OK           → Show error message
    │                 → Highlight field
    ▼
Verification Email Sent
(if email verification enabled)
    │
    ▼
┌─────────────────────────┐
│  ACCOUNT CREATED ✓      │
│  Welcome message shown  │
│  Redirect to Dashboard  │
└─────────────────────────┘

---

LOGIN FLOW:
User clicks "Log In"
    │
    ▼
┌─────────────────────────┐
│     LOGIN PAGE          │
│  - Email                │
│  - Password             │
│  - Remember Me          │
│  - Forgot Password link │
└────────┬────────────────┘
         │
    ┌────┴──────────────┐
    │                   │
    ▼                   ▼
Credentials OK      Wrong Password
    │               → Error: "Email or password incorrect"
    ▼               → After 5 attempts: 30-min lockout
JWT Token Issued
    │
    ▼
Redirected to:
- Previous page (if came from saved article)
- Dashboard (if came from Login link)
```

---

### Flow 3: Health Tips & Articles

```
User navigates to Health Tips
        │
        ▼
┌───────────────────────────────┐
│      HEALTH TIPS PAGE         │
│  - Category filter bar        │
│    [All] [Sleep] [Fitness]    │
│    [Nutrition] [Heart]        │
│    [Weight] [Stress]          │
│  - Article cards grid         │
│    (Title, Category, Time)    │
│  - Pagination / Load More     │
└──────────────┬────────────────┘
               │
        User clicks article
               │
               ▼
┌───────────────────────────────┐
│     ARTICLE DETAIL PAGE       │
│                               │
│  [Category Badge]             │
│  H1: Article Title            │
│  Author • Date • Read Time    │
│  Cover Image                  │
│  Table of Contents            │
│  ── Article Body ──           │
│  Key Takeaways box            │
│  References / Sources         │
│  Medical Disclaimer           │
│  ── Related Articles ──       │
│  Share: Twitter/FB/Copy Link  │
│  ── Bookmark / Save ──        │
│  (guests: prompted to sign up)│
└───────────────────────────────┘
```

---

### Flow 4: Recipe Discovery & Use

```
User goes to Recipes section
        │
        ▼
┌─────────────────────────────────────┐
│         RECIPES PAGE                │
│                                     │
│  Search bar: "Search recipes..."    │
│                                     │
│  Filters:                           │
│  [Category ▼] [Diet ▼] [Time ▼]   │
│  [Budget ▼] [Calories ▼]           │
│                                     │
│  Recipe Cards:                      │
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ Image  │ │ Image  │ │ Image  │  │
│  │ Title  │ │ Title  │ │ Title  │  │
│  │30 min  │ │15 min  │ │45 min  │  │
│  │350 cal │ │280 cal │ │420 cal │  │
│  │Vegan   │ │High-P  │ │Budget  │  │
│  └────────┘ └────────┘ └────────┘  │
└─────────────────┬───────────────────┘
                  │
           User clicks recipe
                  │
                  ▼
┌─────────────────────────────────────┐
│         RECIPE DETAIL PAGE          │
│                                     │
│  Recipe Title + Cover Photo         │
│  ⏱ 15 min prep  🍳 30 min cook     │
│  👥 Servings: [2] [4] [6]  ← adjust│
│  💰 $2.50 per serving               │
│  🏷 [Vegetarian] [High-Fiber]       │
│                                     │
│  ── Ingredients ──                  │
│  □ 2 cups oatmeal                   │
│  □ 1 cup milk                       │
│  □ 2 tbsp honey                     │
│                                     │
│  ── Instructions ──                 │
│  Step 1: ...                        │
│  Step 2: ...                        │
│                                     │
│  ── Nutrition Per Serving ──        │
│  Cal: 350 | Protein: 12g            │
│  Carbs: 45g | Fat: 8g | Fiber: 5g  │
│                                     │
│  [🖨 Print Recipe] [💾 Save]        │
│  [📋 Add to Meal Plan]              │
│  [🛒 Add to Grocery List]           │
└─────────────────────────────────────┘
```

---

### Flow 5: AI Wellness Assistant

```
User clicks "AI Health Assistant"
        │
        ▼
┌─────────────────────────────────────┐
│        AI WELLNESS ASSISTANT        │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 👋 Hi! I'm your HealthWise  │    │
│  │ wellness assistant. Ask me  │    │
│  │ about healthy eating, meal  │    │
│  │ ideas, or wellness tips!    │    │
│  │                             │    │
│  │ ⚠️ I'm an AI tool, not a   │    │
│  │ doctor. For medical issues, │    │
│  │ please see a healthcare     │    │
│  │ professional.               │    │
│  └─────────────────────────────┘    │
│                                     │
│  Suggested questions:               │
│  "What foods are high in protein?"  │
│  "How can I eat healthy on $50/wk?" │
│  "What should I eat for breakfast?" │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Type your question...       │    │
│  │                      [Send] │    │
│  └─────────────────────────────┘    │
│  Requests used: 3/10 this hour      │
└─────────────────────────────────────┘
        │
   User asks question
        │
        ▼
AI responds → Response shown
        │
   ┌────┴─────────────────┐
   │                      │
   ▼                      ▼
Follow-up question    User satisfied
asked                 → Sees related articles
        │             → Sees "Try Meal Planner"
        ▼
Conversation continues
(stored in session only)
```

---

### Flow 6: AI Meal Planner

```
User clicks "Create My Meal Plan"
        │
        ▼
┌─────────────────────────────────────┐
│        STEP 1: PREFERENCES          │
│                                     │
│  Dietary Preferences:               │
│  ☐ Vegetarian  ☐ Vegan             │
│  ☐ Gluten-Free ☐ Dairy-Free        │
│  ☐ No restrictions                 │
│                                     │
│  Allergies (multi-select):          │
│  ☐ Nuts  ☐ Shellfish  ☐ Eggs       │
│                                     │
│  [Next →]                           │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│        STEP 2: GOALS & BUDGET       │
│                                     │
│  Calorie Goal:                      │
│  ○ 1,500 cal (weight loss)          │
│  ○ 2,000 cal (maintenance)          │
│  ○ 2,500 cal (active/muscle gain)   │
│                                     │
│  Weekly Grocery Budget:             │
│  $[50] per week  ← slider          │
│                                     │
│  Cooking Time Available:            │
│  ○ Under 30 min  ○ 30-60 min       │
│  ○ Over 60 min (weekends only)      │
│                                     │
│  Servings: [1] [2] [4]             │
│                                     │
│  [← Back] [Generate Plan →]        │
└─────────────────────────────────────┘
        │
        ▼
   AI generates plan
   (loading spinner ~5 sec)
        │
        ▼
┌─────────────────────────────────────┐
│       7-DAY MEAL PLAN               │
│                                     │
│  [Mon] [Tue] [Wed] [Thu]           │
│  [Fri] [Sat] [Sun]                 │
│                                     │
│  Monday:                            │
│  🌅 Breakfast: Oatmeal with berries │
│     350 cal | 12g protein           │
│  ☀️ Lunch: Grilled chicken salad    │
│     420 cal | 35g protein           │
│  🌙 Dinner: Salmon with vegetables  │
│     520 cal | 40g protein           │
│  🍎 Snack: Greek yogurt + almonds   │
│     200 cal | 15g protein           │
│     ─────────────────              │
│     Daily Total: ~1,490 cal        │
│                                     │
│  [↻ Swap Meal] for each meal       │
│                                     │
│  [📥 Save Plan] [🛒 Get Grocery List]│
└─────────────────────────────────────┘
```

---

### Flow 7: User Dashboard (Logged In)

```
User logs in → Redirected to Dashboard
        │
        ▼
┌─────────────────────────────────────────┐
│           PERSONAL DASHBOARD            │
│                                         │
│  👋 Welcome back, Sarah!               │
│                                         │
│  Quick Actions:                         │
│  [🥗 New Meal Plan] [💬 AI Chat]       │
│  [📖 Continue Reading]                 │
│                                         │
│  ── This Week's Plan ──                │
│  [Mon ✓][Tue ✓][Wed][Thu][Fri]        │
│  (click day to see meals)               │
│                                         │
│  ── Saved Recipes (12) ──              │
│  [Recipe 1] [Recipe 2] [Recipe 3] →    │
│                                         │
│  ── Saved Articles (5) ──              │
│  [Article 1] [Article 2] →             │
│                                         │
│  ── Grocery List ──                    │
│  ☐ Chicken breast (2 lbs)              │
│  ☑ Spinach (1 bag)                    │
│  ☐ Greek yogurt (32 oz)               │
│  [View Full List]                       │
│                                         │
│  ── Habit Tracker ──                   │
│  💧 Drink 8 glasses water: ☐☐☐☐☐     │
│  🥗 Eat vegetables: ☐☐☐☐☐            │
│  🚶 Walk 30 minutes: ☐☐☐☐☐           │
└─────────────────────────────────────────┘
```

---

### Flow 8: Search Experience

```
User types in search bar (any page)
        │
        ▼
Live search preview appears (after 2+ chars):
┌─────────────────────────┐
│ 🔍 "healthy break..."   │
├─────────────────────────┤
│ Articles:               │
│ • 10 Healthy Breakfast  │
│   Ideas for Americans   │
│ • Best Breakfast Foods  │
│   for Weight Loss       │
├─────────────────────────┤
│ Recipes:                │
│ • Quick Oatmeal Bowl    │
│ • Veggie Egg Muffins    │
├─────────────────────────┤
│ See all results →       │
└─────────────────────────┘
        │
   User presses Enter
        │
        ▼
┌─────────────────────────────────────┐
│     SEARCH RESULTS PAGE             │
│                                     │
│  Results for: "healthy breakfast"   │
│  Showing 24 results                 │
│                                     │
│  Filter by: [All▼] [Articles]       │
│             [Recipes] [Sort by▼]    │
│                                     │
│  [Article cards and recipe cards]   │
│  [Pagination]                       │
└─────────────────────────────────────┘
```

---

## PART B — ADMIN FLOWS

---

### Admin Flow 1: Login & Dashboard

```
Admin navigates to /admin/login
        │
        ▼
Admin Login Page (separate from user login)
Enter email + password → verify admin role
        │
        ▼
┌────────────────────────────────────────┐
│          ADMIN DASHBOARD               │
│                                        │
│  ── Today's Overview ──               │
│  👥 Total Users: 1,234                │
│  👁 Pageviews Today: 3,456            │
│  🤖 AI Requests Today: 234           │
│  📝 Pending Review: 3 articles        │
│                                        │
│  ── Quick Actions ──                  │
│  [+ New Article] [+ New Recipe]       │
│  [View AI Logs] [Manage Users]        │
│                                        │
│  ── Recent Content ──                 │
│  [Table of latest articles/recipes]   │
│                                        │
│  ── AI Usage Chart ──                 │
│  [Bar chart: requests per day]        │
└────────────────────────────────────────┘
```

---

### Admin Flow 2: Create/Edit Article

```
Admin clicks "+ New Article"
        │
        ▼
┌────────────────────────────────────────┐
│         ARTICLE EDITOR                 │
│                                        │
│  Title: [                           ]  │
│  Slug:  [auto-generated from title ]   │
│  Category: [Select ▼]                 │
│  Author: [                          ]  │
│  Cover Image: [Upload / URL]           │
│                                        │
│  ── Rich Text Editor ──               │
│  [Bold][Italic][H2][H3][Link][Image]  │
│  ┌──────────────────────────────────┐  │
│  │ Write article content here...   │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ── SEO Section ──                    │
│  Meta Title: [                      ]  │
│  Meta Description: [max 160 chars   ]  │
│                                        │
│  ── Settings ──                       │
│  Status: ○ Draft  ○ Under Review      │
│          ○ Published                   │
│  Publish Date: [date picker]           │
│  Reading Time: [auto-calculated]       │
│                                        │
│  References: [+ Add Source Link]       │
│  Medical Reviewer: [optional]          │
│                                        │
│  [Save Draft]          [Publish]       │
└────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────┐
│    REVIEW WORKFLOW (if enabled)         │
│  Status changes: Draft → Under Review  │
│  → Editor/Admin reviews                │
│  → Approved → Published                │
│  → Rejected → Back to Draft with notes │
└────────────────────────────────────────┘
```

---

### Admin Flow 3: Manage AI Tools

```
Admin → Admin Panel → AI Management
        │
        ▼
┌────────────────────────────────────────┐
│         AI MANAGEMENT PANEL            │
│                                        │
│  ── Usage Overview ──                 │
│  API Calls This Month: 4,234          │
│  Estimated Cost: $0.84                 │
│  Top Tool: Meal Planner (45%)          │
│                                        │
│  ── Rate Limits ──                    │
│  Guest Users: [10] req/hour            │
│  Registered: [25] req/hour             │
│                                        │
│  ── System Prompts ──                 │
│  [Wellness Assistant ✏️ Edit]          │
│  [Meal Planner ✏️ Edit]               │
│  [Recipe Generator ✏️ Edit]           │
│  [Nutrition Analyzer ✏️ Edit]         │
│                                        │
│  ── Safety Filters ──                 │
│  ☑ Block medical diagnosis language   │
│  ☑ Block medication recommendations   │
│  ☑ Add disclaimer to all responses    │
│  ☑ Emergency redirect for symptoms    │
│                                        │
│  ── Recent AI Logs ──                 │
│  [Table: Time, IP, Tool, Query, Flag] │
│  [Flagged queries highlighted red]    │
│                                        │
│  [Export Logs] [Clear Old Logs]        │
└────────────────────────────────────────┘
```

---

### Admin Flow 4: User Management

```
Admin → Users Management
        │
        ▼
┌────────────────────────────────────────┐
│         USER MANAGEMENT                │
│                                        │
│  Search: [search by name/email      ]  │
│  Filter: [All ▼] [Active] [Inactive]  │
│                                        │
│  ┌───────────────────────────────────┐ │
│  │ Name  │Email│Role│Joined│Actions │ │
│  ├───────────────────────────────────┤ │
│  │ Sarah │...  │User│Oct 1 │[Edit]  │ │
│  │       │     │    │      │[Ban]   │ │
│  │ Mike  │...  │Edit│Sep 5 │[Edit]  │ │
│  │       │     │    │      │[Remove]│ │
│  └───────────────────────────────────┘ │
│  [Pagination]                          │
└────────────────────────────────────────┘
        │
   Admin clicks Edit User
        │
        ▼
┌────────────────────────────────────────┐
│         EDIT USER                      │
│  Name: [Sarah Johnson             ]    │
│  Email: [sarah@email.com          ]    │
│  Role: [User ▼] → [Editor] [Admin]    │
│  Status: ● Active  ○ Suspended         │
│  Account Created: October 1, 2026      │
│  Total Saved Recipes: 12               │
│  Total AI Requests (30 days): 45       │
│  [Save Changes] [Delete Account]       │
└────────────────────────────────────────┘
```

---

### Admin Flow 5: Homepage Customization

```
Admin → Content → Homepage Settings
        │
        ▼
┌────────────────────────────────────────┐
│       HOMEPAGE EDITOR                  │
│                                        │
│  ── Daily Health Tip ──               │
│  Today's Tip: [edit text field      ]  │
│  Schedule: ○ Manual  ○ Auto-rotate    │
│                                        │
│  ── Featured Recipes ──               │
│  [Drag to reorder]                    │
│  1. Oatmeal with Berries  [× Remove]  │
│  2. Grilled Chicken Bowl  [× Remove]  │
│  3. Veggie Stir Fry       [× Remove]  │
│  [+ Add Recipe]                        │
│                                        │
│  ── Featured Articles ──              │
│  [Same drag-and-drop interface]        │
│                                        │
│  ── Hero Section ──                   │
│  Headline: [                        ]  │
│  Subheading: [                      ]  │
│  CTA Button Text: [                 ]  │
│  CTA Button Link: [                 ]  │
│  Background Image: [Upload]            │
│                                        │
│  [Preview] [Save Changes]              │
└────────────────────────────────────────┘
```

---

## PART C — NAVIGATION MAP

```
PUBLIC ROUTES (No login required)
├── /                          Home
├── /health-tips               Article listing
├── /health-tips/:slug         Article detail
├── /recipes                   Recipe listing
├── /recipes/:slug             Recipe detail
├── /ai-tools                  AI Tools hub
│   ├── /ai-tools/chat         Wellness assistant
│   ├── /ai-tools/meal-planner AI meal planner
│   ├── /ai-tools/recipe       Recipe generator
│   ├── /ai-tools/nutrition    Nutrition analyzer
│   └── /ai-tools/grocery      Grocery list
├── /search                    Search results
├── /about                     About page
├── /contact                   Contact form
├── /privacy                   Privacy policy
├── /terms                     Terms of use
├── /disclaimer                Medical disclaimer
├── /login                     Login page
└── /register                  Registration page

PROTECTED ROUTES (Login required)
├── /dashboard                 Personal dashboard
├── /dashboard/saved           Saved items
├── /dashboard/plans           Meal plans
├── /dashboard/grocery         Grocery lists
├── /dashboard/habits          Habit tracker
└── /account/settings          Account settings

ADMIN ROUTES (Admin role required)
├── /admin                     Admin dashboard
├── /admin/articles            Article management
├── /admin/articles/new        Create article
├── /admin/articles/:id/edit   Edit article
├── /admin/recipes             Recipe management
├── /admin/recipes/new         Create recipe
├── /admin/users               User management
├── /admin/ai                  AI tools management
├── /admin/homepage            Homepage customization
├── /admin/newsletter          Newsletter management
└── /admin/analytics           Traffic and usage reports
```

---

## PART D — ERROR STATES

| Scenario | User Experience |
|---|---|
| 404 Page Not Found | Friendly page with search bar and popular articles |
| AI Rate Limit Hit | "You've used 10 free AI requests. Create an account for more." |
| AI API Error | "Oops! Our AI assistant is temporarily unavailable. Try again in a moment." |
| Login Failed | "Email or password is incorrect." (no specifics for security) |
| Network Error | Toast notification: "Connection lost. Check your internet and try again." |
| Recipe Not Found | 404 with link to browse all recipes |
| Empty Search | "No results for 'X'. Try different keywords." + suggestions |
| Admin Unauthorized | Redirect to /login with "You need admin access to view this page." |

---

*Document Owner: Product & Design Team*  
*Version: 1.0 — October 2026*
