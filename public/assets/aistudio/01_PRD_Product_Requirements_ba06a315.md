# HealthWise USA — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** October 2026  
**Status:** Approved for Development  
**Audience:** Product, Design, Engineering, Stakeholders

---

## 1. Executive Summary

HealthWise USA is a health & nutrition web platform built for the American audience. It provides evidence-based health tips, healthy recipes, and AI-powered wellness tools — all in one destination. The platform's goal is to become a trusted daily resource for Americans looking to improve their health through practical food choices, meal planning, and lifestyle guidance.

---

## 2. Problem Statement

American adults struggle to find reliable, actionable, and personalized health & nutrition information in one place. Existing platforms are either:

- Too clinical and hard to understand
- Generic and not personalized to US food culture
- Missing practical AI tools for meal planning
- Desktop-only and not mobile-friendly
- Overloaded with medical jargon

**HealthWise USA** solves this by combining trustworthy health content with practical AI tools in a clean, mobile-first experience.

---

## 3. Target Audience

### Primary Users
| Segment | Description |
|---|---|
| Health-conscious adults | Ages 25–55, interested in wellness and better eating |
| Busy parents | Need quick, budget-friendly family meal ideas |
| Beginners | People starting their health journey, need simple guidance |
| Fitness enthusiasts | Looking for high-protein, nutrition-optimized meals |

### Secondary Users
| Segment | Description |
|---|---|
| Vegetarians / Vegans | Need plant-based recipe and nutrition options |
| Budget shoppers | Need affordable healthy eating plans |
| Seniors | Interested in healthy aging and preventive wellness |

### Geographic Focus
- United States (primary)
- English-speaking global users (secondary)

---

## 4. Goals & Success Metrics

### Business Goals
- Build a sustainable health content platform monetized through ads, affiliates, and premium AI features
- Establish domain authority in US health & nutrition content
- Grow newsletter subscriber base

### Product Goals
- Provide free, trustworthy health information to all visitors
- Offer AI meal planning tools that drive return visits
- Enable user personalization via optional accounts

### KPIs (Key Performance Indicators)

| Metric | Target (Month 6) | Target (Month 12) |
|---|---|---|
| Monthly Unique Visitors | 10,000 | 50,000 |
| Newsletter Subscribers | 500 | 3,000 |
| AI Tool Interactions / Month | 1,000 | 8,000 |
| Avg. Session Duration | 2.5 min | 4 min |
| Bounce Rate | < 65% | < 55% |
| Google Search Impressions | 50,000 | 300,000 |

---

## 5. Core Features — Prioritized

### Priority 1 — Must Have (Phase 1)

| Feature | Description |
|---|---|
| Home Page | Hero section, daily tip, featured recipes, categories |
| Health Articles | Browsable, searchable articles with categories |
| Recipe Library | Filterable recipes with nutrition info |
| Search | Global search across articles and recipes |
| Static Pages | About, Contact, Privacy Policy, Medical Disclaimer |
| Responsive Design | Mobile-first, works on all screen sizes |
| Admin Panel | Basic content management for articles and recipes |
| SEO Foundation | Meta tags, sitemap, schema markup |

### Priority 2 — Should Have (Phase 2)

| Feature | Description |
|---|---|
| AI Wellness Assistant | Conversational chatbot for health questions |
| AI Meal Planner | 7-day personalized meal plan generator |
| AI Recipe Generator | Recipes from available ingredients |
| AI Nutrition Analyzer | Calorie/macro calculator for recipes |
| AI Grocery List | Auto-generated shopping list from meal plans |
| Rate Limiting | AI usage protection |

### Priority 3 — Nice to Have (Phase 3)

| Feature | Description |
|---|---|
| User Accounts | Sign up, login, save favorites |
| Personal Dashboard | Saved plans, favorite recipes, history |
| Habit Tracker | Daily wellness habit check-ins |
| Meal Calendar | Weekly food planning calendar |
| Newsletter System | Email subscription and delivery |

### Priority 4 — Future (Phase 4)

| Feature | Description |
|---|---|
| Google AdSense | Display advertising |
| Affiliate Links | Kitchen tool recommendations |
| Premium AI Tier | Advanced AI features behind paywall |
| AI Food Label Reader | Photo-based nutrition label analysis |
| AI Habit Coach | Personalized habit building guidance |

---

## 6. Feature Details

### 6.1 Health Articles System

Each article page must include:
- Title, category, cover image
- Estimated reading time
- Table of contents
- Author name and credentials (when applicable)
- Medical reviewer (when applicable)
- Key takeaways section
- Research references / trusted sources
- Published date + last updated date
- Social sharing buttons
- Related articles
- Health disclaimer at footer
- Bookmark / save option (logged-in users)

**Content Standards:**
- Written in plain American English (8th grade reading level)
- Technical terms explained inline
- Based on CDC, USDA, NIH, or peer-reviewed sources
- No diagnosis, treatment, or prescription language

### 6.2 Recipe System

Each recipe page must include:
- Recipe title, category, cover photo
- Prep time, cook time, total time
- Servings (adjustable)
- Difficulty level (Easy / Medium / Hard)
- Ingredients with US measurements (cups, oz, tbsp, °F)
- Step-by-step instructions
- Estimated nutrition per serving: calories, protein, carbs, fat, fiber
- Dietary labels: vegetarian, vegan, gluten-free, high-protein, etc.
- Allergen information
- Estimated cost per serving (USD)
- Print-friendly view
- Favorite / save button (logged-in users)

**Recipe Categories:**
- Healthy Breakfast
- Lunch & Dinner
- Healthy Snacks
- Budget Meals
- Quick Meals (under 30 minutes)
- Vegetarian / Vegan
- High-Protein
- Family-Friendly

### 6.3 AI Tools

All AI tools share these requirements:
- Powered by Claude API (Anthropic) via Cloudflare Worker backend
- API key never exposed to frontend
- Rate limited: 10 AI requests per IP per hour (free tier)
- Clear "AI-generated content" disclaimer on all outputs
- "Not a substitute for medical advice" notice
- Error handling with user-friendly messages

**AI Wellness Assistant:**
- Chat interface
- Answers health, nutrition, and food questions
- Links to relevant articles on the website
- Suggests related questions
- Does NOT diagnose, prescribe, or replace doctor

**AI Meal Planner:**
- Input: dietary preferences, allergies, budget, cooking time, servings
- Output: full 7-day plan (breakfast, lunch, dinner, snacks)
- Includes estimated daily calories
- One-click grocery list generation
- Option to swap individual meals

**AI Recipe Generator:**
- Input: ingredients user has available
- Output: 2–3 recipe suggestions with full instructions
- Allergy filter (nut-free, gluten-free, dairy-free)
- Estimated nutrition per serving

**AI Nutrition Analyzer:**
- Input: recipe ingredients + quantities
- Output: estimated calories, protein, carbs, fat, fiber per serving
- Clearly labeled as "estimates, not medical data"

**AI Grocery List Generator:**
- Converts meal plan into categorized shopping list
- Categories: Produce, Dairy, Proteins, Pantry, Frozen
- Estimated total cost in USD
- Checkbox interface

### 6.4 Admin Panel

Admin users can:
- Create, edit, publish, unpublish articles
- Manage recipes (add, edit, delete)
- View all users and roles
- Moderate comments/ratings
- Manage newsletter subscribers
- Customize homepage featured content
- Edit SEO metadata
- View website traffic and AI usage reports
- Manage AI prompts and safety settings

---

## 7. User Roles

| Role | Access |
|---|---|
| Guest | Read articles, recipes, use basic AI tools |
| Registered User | All above + save plans, track habits, manage account |
| Editor | Create and edit content (no admin functions) |
| Admin | Full access to all features and settings |

---

## 8. Content Requirements

### Health Content Guidelines
- Minimum 800 words per article
- Maximum 2,500 words per article
- Sources cited with links
- Medical disclaimer on every article
- Author bio displayed
- Last reviewed date shown

### Recipe Content Guidelines
- Minimum 5 ingredients
- Complete nutrition information required
- At least 1 high-quality photo
- US measurement units (with metric option)

---

## 9. Legal & Compliance Requirements

### Required Pages
- About Us
- Contact Us
- Privacy Policy (CCPA compliant)
- Terms of Use
- Medical Disclaimer
- Nutrition Information Disclaimer
- Cookie Policy
- Affiliate Disclosure
- Advertising Policy
- Corrections & Editorial Policy

### Health & Safety Requirements
- AI must always identify itself as an AI tool, not a doctor
- No disease diagnosis language in AI outputs
- Emergency symptoms: AI must direct users to call 911 or seek care
- Food allergy warnings must be prominent and clear
- All AI health content must include appropriate disclaimers

### Data Privacy
- Minimum data collection
- No selling of user health data
- GDPR-lite compliance (for international visitors)
- Clear cookie consent
- User data download and deletion option

---

## 10. Non-Functional Requirements

| Requirement | Standard |
|---|---|
| Page Load Time | < 2.5 seconds on mobile (LCP) |
| Mobile Usability | 100% responsive, mobile-first |
| Accessibility | WCAG 2.1 AA compliant |
| Uptime | 99.5% (Cloudflare Pages guarantee) |
| Security | HTTPS, no exposed API keys, input validation |
| SEO | Core Web Vitals all green |
| Browser Support | Chrome, Safari, Firefox, Edge (last 2 versions) |

---

## 11. Out of Scope (v1.0)

The following features will NOT be built in version 1.0:

- Disease diagnosis tools
- Prescription or medication guidance
- Telehealth or doctor booking
- Fitness tracking (wearable integration)
- Social community / forums
- Mobile app (iOS / Android)
- Live video content
- Calorie tracking diary
- Clinical decision-making features

---

## 12. Assumptions & Dependencies

**Assumptions:**
- Anthropic Claude API access will be available
- Cloudflare free tier is sufficient for launch traffic
- Content will be manually seeded before launch (minimum 20 articles, 30 recipes)
- No native mobile app required at launch

**Dependencies:**
- Anthropic API key (Claude Haiku for AI tools)
- Cloudflare account (Pages, Workers, D1, R2)
- Domain registration (.com preferred)
- Google Analytics account
- Google Search Console account

---

## 13. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| AI API costs exceed budget | Medium | High | Rate limiting + usage monitoring |
| Health content accuracy issues | Medium | High | Editorial review process + disclaimers |
| Low initial traffic | High | Medium | SEO-first content strategy |
| AI generating harmful advice | Low | Very High | System prompts + output filtering |
| Cloudflare free tier limits hit | Medium | Medium | Monitor and upgrade plan if needed |

---

*Document Owner: Product Team*  
*Next Review: Phase 2 Kickoff*
