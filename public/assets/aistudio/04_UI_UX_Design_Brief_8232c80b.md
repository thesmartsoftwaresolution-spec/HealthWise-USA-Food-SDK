# HealthWise USA — UI/UX Design Brief

**Version:** 1.0  
**Date:** October 2026  
**Purpose:** Visual design direction, component system, and UX principles  
**Audience:** UI Designer, Frontend Developer

---

## 1. Brand Identity

### Brand Personality
HealthWise USA is **approachable, trustworthy, and energizing** — like a knowledgeable friend who happens to know a lot about healthy living. It is NOT clinical, cold, or intimidating. It talks to regular Americans, not doctors.

**Brand Voice:** Warm, encouraging, practical, honest

**Brand Promise:** "Real food, real health — made simple for everyday Americans."

---

## 2. Color System

### Primary Palette

```
Primary Green  #2D7D46    ← Main brand color (trust, health, nature)
Light Green    #E8F5EC    ← Backgrounds, hover states
Dark Green     #1A5C31    ← Hover, active states

Accent Orange  #E07B39    ← CTAs, highlights, energy
Light Orange   #FDF0E6    ← Accent backgrounds

Neutral Dark   #1C2B20    ← Primary text (near-black, green-tinted)
Neutral Mid    #5A7060    ← Secondary text, captions
Neutral Light  #F4F8F5    ← Page background (very light green-tint)
White          #FFFFFF    ← Cards, panels
Border         #D4E6D9    ← Dividers, input borders
```

### Semantic Colors
```
Success   #2D7D46    ← Same as Primary Green
Warning   #E07B39    ← Same as Accent Orange
Error     #C0392B    ← Red for errors
Info      #2E86AB    ← Blue for informational notices
```

### Dark Mode
```
Background    #0F1A12    ← Very dark green
Surface       #1A2D1E    ← Cards, panels
Border        #2A4030    ← Dividers
Text Primary  #E8F5EC    ← Primary text
Text Muted    #7FAB88    ← Secondary text
```

**Why this palette:** Avoids the cliché cream-with-terracotta AI-default. The green is purposeful — it reads as fresh, organic, and trustworthy for health content, without feeling like a pharmacy.

---

## 3. Typography

### Type System

```
Display / Hero:  DM Serif Display (serif)
                 — For hero headlines, article titles, recipe names
                 — Weight: Regular (400)
                 — Use: Large, warm, editorial feel

Body Text:       Inter (sans-serif)
                 — For all UI, paragraphs, labels, buttons
                 — Weights: 400 (body), 500 (medium), 600 (semibold)
                 — Use: Everything readable and functional
```

### Type Scale
```
text-xs:    12px / 16px line-height  → Labels, captions, disclaimers
text-sm:    14px / 20px             → UI labels, nav, metadata
text-base:  16px / 26px             → Body paragraphs (generous line-height)
text-lg:    18px / 28px             → Lead paragraphs, card descriptions
text-xl:    20px / 30px             → Section headings H3
text-2xl:   24px / 34px             → Page section headings H2
text-3xl:   30px / 40px             → Page titles H1
text-4xl:   36px / 48px             → Article titles, recipe names
text-5xl:   48px / 58px             → Hero headline
```

### Typography Rules
- Max line length: 72 characters for body text
- Article body: Inter 16px, 26px line-height, max 680px wide column
- Never use all-caps labels (a design cliché)
- No tracked-out letter spacing on headings
- Avoid single word accent highlights (another cliché)
- DM Serif Display only for large display text (24px+)

---

## 4. Spacing System

```
Base unit: 4px

space-1:   4px
space-2:   8px
space-3:   12px
space-4:   16px
space-5:   20px
space-6:   24px
space-8:   32px
space-10:  40px
space-12:  48px
space-16:  64px
space-20:  80px
space-24:  96px
```

**Section spacing:** 80–96px between major page sections on desktop, 48–64px on mobile.

---

## 5. Component Specifications

### 5.1 Buttons

```
PRIMARY BUTTON
Background:  #2D7D46 (green)
Text:        #FFFFFF
Hover:       #1A5C31 (darker green)
Border:      none
Border-radius: 8px
Padding:     12px 24px
Font:        Inter 15px, 600 weight
Min-width:   120px

SECONDARY BUTTON  
Background:  transparent
Text:        #2D7D46
Border:      2px solid #2D7D46
Hover:       Background #E8F5EC
Border-radius: 8px

CTA/ACCENT BUTTON (AI tools, key actions)
Background:  #E07B39 (orange)
Text:        #FFFFFF
Hover:       slightly darker orange
Use sparingly — one per screen section max
```

### 5.2 Cards

```
ARTICLE CARD
┌─────────────────────────────┐
│ [Cover Image - 16:9 ratio]  │
│                             │
│ [CATEGORY] • [READ TIME]    │
│                             │
│ Article Title in DM Serif   │
│ 2 lines max                 │
│                             │
│ Brief excerpt 2 lines...    │
│                             │
│ [Author] [Date]             │
└─────────────────────────────┘

Background: #FFFFFF
Border: 1px solid #D4E6D9
Border-radius: 12px
Shadow: 0 2px 12px rgba(45,125,70,0.08)
Hover: shadow deepens + lift (transform: translateY(-2px))
Padding: 0 (image full-bleed top) + 20px sides/bottom

RECIPE CARD
┌─────────────────────────────┐
│ [Food Photo - 1:1 ratio]    │
│                             │
│ Recipe Name (DM Serif)      │
│                             │
│ ⏱ 25 min  🍽 4 servings   │
│                             │
│ [Vegetarian] [High-Protein] │
│                             │
│ 350 cal per serving  $2.50 │
└─────────────────────────────┘
```

### 5.3 Navigation

```
DESKTOP HEADER (fixed, 72px tall)
┌────────────────────────────────────────────────────────────┐
│ 🌿 HealthWise USA   [Health Tips] [Recipes] [AI Tools]    │
│                     [Search 🔍]  [Sign Up] [Log In]       │
└────────────────────────────────────────────────────────────┘

Background: white, border-bottom: 1px solid #D4E6D9
On scroll: add subtle shadow
Logo: "🌿 HealthWise" — DM Serif Display, green

MOBILE HEADER (56px)
┌──────────────────────────────┐
│ 🌿 HealthWise       🔍  ☰  │
└──────────────────────────────┘

MOBILE BOTTOM NAV
┌──────────────────────────────┐
│  🏠    📖    🥗    🤖    👤  │
│ Home Tips Recipes AI  You   │
└──────────────────────────────┘
```

### 5.4 AI Chat Interface

```
CHAT WIDGET (AI Assistant)
┌──────────────────────────────────────────┐
│  🤖 HealthWise AI                [✕]    │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────┐      │
│  │ AI Message bubble              │      │
│  │ (left aligned, light green bg) │      │
│  └────────────────────────────────┘      │
│                                          │
│           ┌────────────────────────────┐ │
│           │ User Message bubble        │ │
│           │ (right aligned, green bg)  │ │
│           └────────────────────────────┘ │
│                                          │
│  ⚠️ Not medical advice                   │
│  Requests: 3/10 per hour                 │
├──────────────────────────────────────────┤
│  [Type your question...         ] [→]   │
└──────────────────────────────────────────┘

AI bubble: #E8F5EC background, border 1px #D4E6D9
User bubble: #2D7D46 background, white text
Border-radius: 16px (all corners) except connecting corner: 4px
```

### 5.5 Form Elements

```
INPUT FIELD
Border: 1px solid #D4E6D9
Border-radius: 8px
Padding: 12px 16px
Font: Inter 15px
Focus: border-color #2D7D46, outline none, box-shadow green tint
Error: border-color #C0392B + red helper text below
Background: #FFFFFF

DROPDOWN / SELECT
Same as input, with chevron icon right
Custom styled (no native browser dropdown)

CHECKBOX
Custom checkbox: green tick on white, green border
Label: Inter 14px, #1C2B20

RADIO
Custom radio: green fill, white center, green border

SLIDER (for budget, calories)
Track: #D4E6D9 background
Filled: #2D7D46
Thumb: white circle, green border, drop shadow
```

### 5.6 Tags & Badges

```
CATEGORY BADGE
Background: #E8F5EC
Text: #2D7D46
Border-radius: 100px (pill)
Padding: 4px 12px
Font: Inter 12px, 600

DIETARY TAG (Vegetarian, Vegan, etc.)
Vegetarian: green pill
Vegan: dark green pill  
Gluten-Free: gold/amber pill
High-Protein: blue pill
Budget: light gray pill

READING TIME / DURATION TAG
Background: transparent
Text: #5A7060 (muted)
No border
Font: Inter 13px
```

---

## 6. Page Layout Specifications

### 6.1 Home Page Layout

```
FULL WIDTH: max 1280px centered

──────────────────────────────────────────
HERO SECTION (full-width, 500px tall)
  Background: food photography (blurred)
  Overlay: dark green gradient
  
  Left side:
  H1: "Eat Well. Feel Great.        "
      "Real Health Tips for          "
      "Everyday Americans.           "
  Subtext: 18px, #E8F5EC
  [Get My Free Meal Plan →] (orange CTA)
  
──────────────────────────────────────────
DAILY HIGHLIGHT BAR
  Background: #E8F5EC
  3 columns: [Daily Tip] [Healthy Food Today] [Quick Recipe]
  
──────────────────────────────────────────
TRENDING ARTICLES (3 columns)
  Section heading: "This Week's Top Health Tips"
  3 article cards in a row

──────────────────────────────────────────
AI TOOLS BANNER (full-width, #1C2B20 bg)
  "Try our Free AI Health Tools"
  4 tool cards: [Meal Planner] [Recipe Gen] [Chat] [Nutrition]

──────────────────────────────────────────
POPULAR RECIPES (4 per row, scrollable on mobile)
  "Healthy Recipes Americans Love"
  Recipe cards grid

──────────────────────────────────────────
NEWSLETTER SIGNUP (green section)
  "Join 10,000 Americans eating healthier"
  [Email input] [Subscribe button]
  
──────────────────────────────────────────
FOOTER
```

### 6.2 Article Detail Layout

```
Max width: 800px, centered

[Breadcrumb: Home > Health Tips > Category]
[CATEGORY BADGE]
H1: Article Title (DM Serif, 36px)
[Author] [Date] [Updated] [Read time]
[Cover Image — full width]

[Table of Contents — sticky on desktop, collapsible]

Article body: 680px max, Inter 16px/26px

[Key Takeaways box — green background]

[References section]
[Medical Disclaimer — gray box]

[Share: Twitter, Facebook, Copy Link]
[Bookmark button (logged-in users)]

[Related Articles — 3 card grid]
```

### 6.3 Recipe Detail Layout

```
Max width: 900px, centered

[Breadcrumb]
H1: Recipe Name (DM Serif)
[Recipe Meta bar: Time | Servings | Difficulty | Cost]
[Hero Photo — full width, 400px tall]

Two-column layout:
LEFT (60%):           RIGHT (40%, sticky):
Ingredients           Nutrition Facts box
Instructions          [Save Recipe]
                      [Add to Meal Plan]
                      [Print Recipe]
                      [Share Recipe]

[Similar Recipes — horizontal scroll on mobile]
```

---

## 7. Mobile Design Principles

### Breakpoints
```
Mobile:  375px – 767px    (primary design target)
Tablet:  768px – 1023px
Desktop: 1024px+
```

### Mobile-Specific Rules
- Bottom navigation bar (5 icons) — always visible
- No hover states on mobile (touch-first)
- Recipe cards: full-width on mobile
- Article cards: full-width on mobile
- AI tools: single column, large tap targets
- Minimum touch target: 44×44px
- Grocery list: large checkboxes for easy tapping
- Meal planner: horizontal day scroll
- Forms: inputs minimum 48px tall

---

## 8. Accessibility Standards

| Standard | Requirement |
|---|---|
| Color Contrast | Text on bg: minimum 4.5:1 ratio |
| Focus Indicators | Green outline: 3px, visible on all interactive elements |
| Font Size | Minimum 14px for any readable text |
| Alt Text | All images have descriptive alt text |
| Keyboard Navigation | Full keyboard support (Tab, Enter, Escape, Arrow keys) |
| Screen Readers | ARIA labels on all icon-only buttons |
| Reduced Motion | Respect `prefers-reduced-motion` — no animations |
| Form Labels | Every input has an associated visible label |

---

## 9. Motion & Animation

**Principle: Motion is earned, not sprinkled.**

Allowed animations:
- Page transitions: fade-in 150ms ease-out (whole page, once)
- Modal open/close: scale + fade, 200ms
- Toast notifications: slide in from top, 250ms
- Button hover: background-color transition 150ms only
- Accordion (FAQ, TOC): height + opacity, 200ms

**Banned animations:**
- Scroll-triggered fade-in on every card (generic, distracting)
- Hover animations on recipe/article cards (only shadow/lift max)
- Loading spinners everywhere (use skeleton screens instead)
- Bouncing, pulsing, or attention-seeking motion

**Skeleton Screens** for:
- Article cards loading
- Recipe cards loading
- AI response loading
- User dashboard data loading

---

## 10. Imagery Guidelines

### Photo Style
- Bright, natural lighting — no dark moody food photography
- Real, accessible American ingredients and dishes
- Diverse people (when people shown) reflecting US demographics
- Top-down or 45° angle for food photos (most appetizing)

### Image Requirements
```
Hero images:      1280 × 720px minimum, WebP format
Article covers:   800 × 450px (16:9), WebP
Recipe cards:     600 × 600px (1:1), WebP
Recipe detail:    900 × 500px, WebP
```

### Placeholder / Fallback
When no image is available:
```
Background: #E8F5EC
Icon: vegetable/leaf emoji or SVG illustration
No broken image icons
```

---

## 11. Design Don'ts

| Avoid | Reason |
|---|---|
| All-caps section labels | Over-used AI-generated look |
| Excessive card shadows everywhere | Generic SaaS template feel |
| Warm cream (#F4F1EA) background | Too common in AI-generated sites |
| Terracotta/clay accent colors | Claude/Anthropic brand association |
| Middle-dot separators (A · B · C) | Design template cliché |
| Arrow emoji on every button (→) | Overused |
| Single word highlighted in headline | Amateur typographic look |
| 8 different font sizes on one page | No clear hierarchy |
| Green + white only palette | Pharmacy / medical look |

---

## 12. Design Inspiration References

| Reference | What to borrow |
|---|---|
| Serious Eats | Content-dense but approachable recipe layout |
| Healthline | Clear article hierarchy, medical-grade trust signals |
| NYT Cooking | Beautiful recipe presentation, clean typography |
| Whole Foods Market | Fresh, natural color energy without clinical feel |

---

*Document Owner: Design Lead*  
*Version: 1.0 — October 2026*
