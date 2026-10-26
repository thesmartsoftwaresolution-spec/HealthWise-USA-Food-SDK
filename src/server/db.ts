import {
  Article,
  Category,
  Recipe,
  SiteSettings,
  User,
  MealPlan,
  GroceryList,
  Habit,
  HabitLog,
  AIUsageLog,
  RecipeRating
} from '../types/index.ts';
import {
  SEED_CATEGORIES,
  SEED_ARTICLES,
  SEED_RECIPES,
  SEED_SETTINGS,
  SEED_USERS
} from '../data/seedData.ts';

/**
 * In-memory / file-synced database layer for HealthWise USA.
 * Structured cleanly to mirror Cloudflare D1 SQL semantics.
 */
class HealthWiseDatabase {
  public categories: Category[] = [...SEED_CATEGORIES];
  public articles: Article[] = [...SEED_ARTICLES];
  public recipes: Recipe[] = [...SEED_RECIPES];
  public settings: SiteSettings = { ...SEED_SETTINGS };
  public users: User[] = [...SEED_USERS];
  public savedItems: { userId: string; itemType: 'article' | 'recipe'; itemId: string; savedAt: string }[] = [
    { userId: 'user-demo-1', itemType: 'recipe', itemId: 'rec-1', savedAt: '2026-10-18T12:00:00Z' },
    { userId: 'user-demo-1', itemType: 'recipe', itemId: 'rec-2', savedAt: '2026-10-18T12:05:00Z' },
    { userId: 'user-demo-1', itemType: 'article', itemId: 'art-1', savedAt: '2026-10-18T12:10:00Z' }
  ];
  public mealPlans: MealPlan[] = [
    {
      id: 'plan-demo-1',
      userId: 'user-demo-1',
      title: 'High-Protein Metabolic Vitality Week',
      weekOf: '2026-10-19',
      dietaryPrefs: ['High-Protein'],
      allergies: [],
      calorieGoal: 2000,
      weeklyBudget: 75,
      servings: 2,
      planData: {
        days: [
          {
            day: 'Monday',
            meals: {
              breakfast: { name: 'Antioxidant Berry Overnight Oats', calories: 360, recipeId: 'rec-1' },
              lunch: { name: 'Grilled Chicken & Quinoa Power Bowl', calories: 490, recipeId: 'rec-4' },
              dinner: { name: 'Sheet-Pan Lemon Herb Wild Salmon', calories: 420, recipeId: 'rec-2' },
              snack: { name: 'Crispy Turmeric Spiced Chickpeas', calories: 180, recipeId: 'rec-6' }
            },
            totalCalories: 1450
          },
          {
            day: 'Tuesday',
            meals: {
              breakfast: { name: 'Crustless Garden Veggie Egg Muffins (2)', calories: 320, recipeId: 'rec-5' },
              lunch: { name: 'Tuscan White Bean & Kale Bowl', calories: 290, recipeId: 'rec-9' },
              dinner: { name: '15-Minute Skillet Turkey & Black Bean Tacos', calories: 410, recipeId: 'rec-7' },
              snack: { name: 'Greek Yogurt with 1 oz Walnuts', calories: 210 }
            },
            totalCalories: 1230
          },
          {
            day: 'Wednesday',
            meals: {
              breakfast: { name: 'Antioxidant Berry Overnight Oats', calories: 360, recipeId: 'rec-1' },
              lunch: { name: 'Grilled Chicken & Quinoa Power Bowl', calories: 490, recipeId: 'rec-4' },
              dinner: { name: 'Zesty Lime Cilantro Shrimp with Sweet Potato', calories: 380, recipeId: 'rec-10' },
              snack: { name: 'Apple slices with almond butter', calories: 190 }
            },
            totalCalories: 1420
          },
          {
            day: 'Thursday',
            meals: {
              breakfast: { name: 'Crustless Garden Veggie Egg Muffins (2)', calories: 320, recipeId: 'rec-5' },
              lunch: { name: 'Mediterranean Lentil & Spinach Soup', calories: 280, recipeId: 'rec-3' },
              dinner: { name: 'Sheet-Pan Lemon Herb Wild Salmon', calories: 420, recipeId: 'rec-2' },
              snack: { name: 'Crispy Turmeric Spiced Chickpeas', calories: 180, recipeId: 'rec-6' }
            },
            totalCalories: 1200
          },
          {
            day: 'Friday',
            meals: {
              breakfast: { name: 'Greek Yogurt with Chia & Sliced Strawberries', calories: 260 },
              lunch: { name: '15-Minute Skillet Turkey Tacos', calories: 410, recipeId: 'rec-7' },
              dinner: { name: 'Mediterranean Lentil & Spinach Soup with Sourdough', calories: 420, recipeId: 'rec-3' },
              snack: { name: 'Creamy Avocado Cacao Mousse', calories: 240, recipeId: 'rec-8' }
            },
            totalCalories: 1330
          },
          {
            day: 'Saturday',
            meals: {
              breakfast: { name: 'Pasture-Raised Eggs with Sautéed Spinach & Avocado', calories: 380 },
              lunch: { name: 'Tuscan White Bean & Kale Skillet Stew', calories: 290, recipeId: 'rec-9' },
              dinner: { name: 'Zesty Lime Cilantro Shrimp & Roasted Veggies', calories: 360, recipeId: 'rec-10' },
              snack: { name: 'Handful of raw almonds & dark chocolate (85%)', calories: 200 }
            },
            totalCalories: 1230
          },
          {
            day: 'Sunday',
            meals: {
              breakfast: { name: 'Antioxidant Berry Overnight Oats', calories: 360, recipeId: 'rec-1' },
              lunch: { name: 'Grilled Chicken Salad with Olive Oil & Balsamic', calories: 440 },
              dinner: { name: 'Slow-Cooked Vegetable Bean Chili', calories: 410 },
              snack: { name: 'Carrot sticks with homemade hummus', calories: 160 }
            },
            totalCalories: 1370
          }
        ],
        weeklyAvgCalories: 1347,
        estimatedWeeklyCost: 68.50
      },
      status: 'active',
      createdAt: '2026-10-18T10:00:00Z'
    }
  ];

  public groceryLists: GroceryList[] = [
    {
      id: 'grocery-demo-1',
      userId: 'user-demo-1',
      mealPlanId: 'plan-demo-1',
      title: "Sarah's Weekly Supermarket Checklist",
      categories: {
        produce: [
          { id: 'g-1', item: 'Baby Spinach (16 oz organic tub)', amount: '1 tub', checked: true, estimatedCost: 4.99 },
          { id: 'g-2', item: 'Fresh Asparagus spears', amount: '1 lb', checked: false, estimatedCost: 3.49 },
          { id: 'g-3', item: 'Sweet Potatoes (orange/garnet)', amount: '3 medium', checked: false, estimatedCost: 2.50 },
          { id: 'g-4', item: 'Limes and Lemons', amount: '4 whole', checked: true, estimatedCost: 2.00 },
          { id: 'g-5', item: 'English Cucumbers', amount: '2 whole', checked: false, estimatedCost: 2.50 }
        ],
        dairy: [
          { id: 'g-6', item: 'Plain Non-Fat Greek Yogurt (32 oz)', amount: '1 tub', checked: true, estimatedCost: 4.79 },
          { id: 'g-7', item: 'Pasture-Raised Large Eggs', amount: '1 dozen', checked: false, estimatedCost: 4.99 },
          { id: 'g-8', item: 'Crumbled Goat Cheese or Feta', amount: '4 oz', checked: false, estimatedCost: 3.99 }
        ],
        proteins: [
          { id: 'g-9', item: 'Wild Alaskan Salmon fillets (fresh or frozen)', amount: '1.5 lbs', checked: false, estimatedCost: 16.99 },
          { id: 'g-10', item: 'Boneless Skinless Chicken Breasts', amount: '2 lbs', checked: true, estimatedCost: 7.99 },
          { id: 'g-11', item: '93% Lean Ground Turkey', amount: '1 lb', checked: false, estimatedCost: 4.49 },
          { id: 'g-12', item: 'Raw Jumbo Shrimp (peeled/deveined)', amount: '1 lb frozen', checked: false, estimatedCost: 8.99 }
        ],
        pantry: [
          { id: 'g-13', item: 'Old-Fashioned Rolled Oats', amount: '1 canister (32 oz)', checked: true, estimatedCost: 3.99 },
          { id: 'g-14', item: 'Dry Tri-Color Quinoa', amount: '1 bag (16 oz)', checked: false, estimatedCost: 3.49 },
          { id: 'g-15', item: 'Black Beans & Cannellini Beans', amount: '4 cans', checked: true, estimatedCost: 3.60 },
          { id: 'g-16', item: 'Chia Seeds', amount: '1 bag', checked: true, estimatedCost: 4.29 }
        ],
        frozen: [
          { id: 'g-17', item: 'Wild Blueberries (frozen)', amount: '1 bag (16 oz)', checked: false, estimatedCost: 3.99 }
        ]
      },
      estimatedTotal: 82.08,
      createdAt: '2026-10-18T10:15:00Z'
    }
  ];

  public habits: Habit[] = [
    { id: 1, userId: 'user-demo-1', name: 'Drink 8 glasses of pure water', category: 'hydration', icon: '💧', targetPerDay: 8, unit: 'glasses', isActive: true, streakCount: 5 },
    { id: 2, userId: 'user-demo-1', name: 'Eat 3+ servings of colorful vegetables', category: 'nutrition', icon: '🥗', targetPerDay: 3, unit: 'servings', isActive: true, streakCount: 4 },
    { id: 3, userId: 'user-demo-1', name: 'Walk 30 minutes in outdoor daylight', category: 'activity', icon: '🚶‍♀️', targetPerDay: 30, unit: 'min', isActive: true, streakCount: 3 },
    { id: 4, userId: 'user-demo-1', name: 'Sleep 7+ hours with consistent bedtime', category: 'sleep', icon: '😴', targetPerDay: 7, unit: 'hours', isActive: true, streakCount: 7 }
  ];

  public habitLogs: HabitLog[] = [
    { id: 1, habitId: 1, userId: 'user-demo-1', loggedDate: '2026-10-19', completed: true },
    { id: 2, habitId: 1, userId: 'user-demo-1', loggedDate: '2026-10-18', completed: true },
    { id: 3, habitId: 1, userId: 'user-demo-1', loggedDate: '2026-10-17', completed: true },
    { id: 4, habitId: 1, userId: 'user-demo-1', loggedDate: '2026-10-16', completed: true },
    { id: 5, habitId: 1, userId: 'user-demo-1', loggedDate: '2026-10-15', completed: true },

    { id: 6, habitId: 2, userId: 'user-demo-1', loggedDate: '2026-10-19', completed: true },
    { id: 7, habitId: 2, userId: 'user-demo-1', loggedDate: '2026-10-18', completed: true },
    { id: 8, habitId: 2, userId: 'user-demo-1', loggedDate: '2026-10-17', completed: true },
    { id: 9, habitId: 2, userId: 'user-demo-1', loggedDate: '2026-10-16', completed: true },

    { id: 10, habitId: 3, userId: 'user-demo-1', loggedDate: '2026-10-19', completed: true },
    { id: 11, habitId: 3, userId: 'user-demo-1', loggedDate: '2026-10-18', completed: true },
    { id: 12, habitId: 3, userId: 'user-demo-1', loggedDate: '2026-10-17', completed: true },

    { id: 13, habitId: 4, userId: 'user-demo-1', loggedDate: '2026-10-19', completed: true },
    { id: 14, habitId: 4, userId: 'user-demo-1', loggedDate: '2026-10-18', completed: true },
    { id: 15, habitId: 4, userId: 'user-demo-1', loggedDate: '2026-10-17', completed: true },
    { id: 16, habitId: 4, userId: 'user-demo-1', loggedDate: '2026-10-16', completed: true },
    { id: 17, habitId: 4, userId: 'user-demo-1', loggedDate: '2026-10-15', completed: true },
    { id: 18, habitId: 4, userId: 'user-demo-1', loggedDate: '2026-10-14', completed: true },
    { id: 19, habitId: 4, userId: 'user-demo-1', loggedDate: '2026-10-13', completed: true }
  ];

  public aiUsageLogs: AIUsageLog[] = [
    {
      id: 1,
      userId: 'user-demo-1',
      sessionIp: '127.0.0.1',
      tool: 'mealPlan',
      promptPreview: '7-day high protein under $75',
      modelUsed: 'gemini-4-argon (ThinkingLevel.HIGH)',
      durationMs: 3420,
      status: 'success',
      createdAt: '2026-10-19T10:14:00Z'
    },
    {
      id: 2,
      userId: 'user-demo-1',
      sessionIp: '127.0.0.1',
      tool: 'wellness',
      promptPreview: 'How does potassium lower blood pressure in the vascular smooth muscle?',
      modelUsed: 'gemini-4-argon (ThinkingLevel.HIGH)',
      durationMs: 2890,
      status: 'success',
      createdAt: '2026-10-19T11:05:00Z'
    }
  ];

  public newsletterSubscribers: { id: string; email: string; name?: string; source: string; subscribedAt: string }[] = [
    { id: 'sub-1', email: 'sarah.johnson@example.com', name: 'Sarah', source: 'homepage', subscribedAt: '2026-10-01T12:00:00Z' },
    { id: 'sub-2', email: 'mark.wellness@example.com', name: 'Mark', source: 'article', subscribedAt: '2026-10-05T15:30:00Z' }
  ];

  public recipeRatings: RecipeRating[] = [
    {
      id: 'rat-1',
      recipeId: 'rec-1',
      userId: 'user-demo-1',
      userName: 'Sarah Johnson',
      rating: 5,
      review: 'My go-to breakfast every weekday! The blueberries and chia keep me full until lunch.',
      createdAt: '2026-10-18T14:20:00Z'
    },
    {
      id: 'rat-2',
      recipeId: 'rec-1',
      userId: 'user-community-1',
      userName: 'Dave K.',
      rating: 5,
      review: 'Super easy to meal prep on Sunday evenings. Kids love it too.',
      createdAt: '2026-10-17T09:15:00Z'
    },
    {
      id: 'rat-3',
      recipeId: 'rec-2',
      userId: 'user-demo-1',
      userName: 'Sarah Johnson',
      rating: 5,
      review: 'The lemon herb garlic marinade makes the salmon so flaky and tender. Cleanup is a breeze on one sheet pan!',
      createdAt: '2026-10-19T18:40:00Z'
    },
    {
      id: 'rat-4',
      recipeId: 'rec-2',
      userId: 'user-community-2',
      userName: 'Emily R., Registered Dietitian',
      rating: 5,
      review: 'Outstanding source of omega-3 EPA/DHA fatty acids and prebiotic fiber from the asparagus. Highly recommended for cardiovascular wellness.',
      createdAt: '2026-10-18T20:10:00Z'
    },
    {
      id: 'rat-5',
      recipeId: 'rec-3',
      userId: 'user-community-3',
      userName: 'Michael T.',
      rating: 4,
      review: 'Comforting, healthy, and high fiber. I added a pinch of smoked paprika for extra depth.',
      createdAt: '2026-10-15T12:00:00Z'
    },
    {
      id: 'rat-6',
      recipeId: 'rec-4',
      userId: 'user-community-4',
      userName: 'Jessica P.',
      rating: 5,
      review: 'Packed with lean protein! Perfect post-workout lunch that stores well in glass containers for 4 days.',
      createdAt: '2026-10-16T13:30:00Z'
    }
  ];

  public getRecipeRatingStats(recipeId: string): { average: number; count: number } {
    const ratings = this.recipeRatings.filter((r) => r.recipeId === recipeId);
    if (ratings.length === 0) return { average: 4.8, count: 12 }; // Default pleasant baseline
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return {
      average: Number((sum / ratings.length).toFixed(1)),
      count: ratings.length
    };
  }

  public contactMessages: { id: number; name: string; email: string; subject: string; message: string; createdAt: string; status: string }[] = [
    {
      id: 1,
      name: 'Robert Miller',
      email: 'robert.miller@example.com',
      subject: 'Editorial Question',
      message: 'Can you recommend any whole-grain replacements for someone with celiac disease trying the Mediterranean diet?',
      createdAt: '2026-10-19T08:30:00Z',
      status: 'unread'
    }
  ];

  // IP/User rate limit tracking: key -> array of timestamps
  private rateLimits: Map<string, number[]> = new Map();

  public checkRateLimit(key: string, limit: number, windowMs = 3600000): { allowed: boolean; remaining: number; resetInSec: number } {
    const now = Date.now();
    const timestamps = (this.rateLimits.get(key) || []).filter((t) => now - t < windowMs);
    if (timestamps.length >= limit) {
      const oldest = timestamps[0];
      const resetInSec = Math.ceil((oldest + windowMs - now) / 1000);
      return { allowed: false, remaining: 0, resetInSec };
    }
    timestamps.push(now);
    this.rateLimits.set(key, timestamps);
    return { allowed: true, remaining: limit - timestamps.length, resetInSec: 3600 };
  }

  public reset(): void {
    this.categories = [...SEED_CATEGORIES];
    this.articles = [...SEED_ARTICLES];
    this.recipes = [...SEED_RECIPES];
    this.settings = { ...SEED_SETTINGS };
    this.users = [...SEED_USERS];
    this.recipeRatings = [
      {
        id: 'rating-1',
        recipeId: 'rec-1',
        userId: 'user-demo-1',
        userName: 'Eleanor Vance',
        rating: 5,
        review: 'Incredible texture and keeps me satisfied well into the afternoon! The touch of cinnamon really balances the berries.',
        createdAt: '2026-10-18T14:20:00Z'
      },
      {
        id: 'rating-2',
        recipeId: 'rec-1',
        userId: 'user-demo-2',
        userName: 'Marcus Sterling',
        rating: 5,
        review: 'Substituted almond milk for oat milk and it worked beautifully. Great macro profile for my training days.',
        createdAt: '2026-10-19T09:15:00Z'
      },
      {
        id: 'rating-3',
        recipeId: 'rec-2',
        userId: 'user-demo-1',
        userName: 'Eleanor Vance',
        rating: 5,
        review: 'The garlic Dijon marinade elevated the wild salmon without adding excess sodium. A staple weeknight dinner!',
        createdAt: '2026-10-19T18:40:00Z'
      }
    ];
    this.aiUsageLogs = [];
    this.rateLimits.clear();
  }
}

export const db = new HealthWiseDatabase();
