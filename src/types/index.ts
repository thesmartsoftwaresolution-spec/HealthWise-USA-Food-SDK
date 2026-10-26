export type UserRole = 'user' | 'editor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'deleted';
  avatarUrl?: string;
  dietaryPrefs: string[];
  measurementUnit: 'us' | 'metric';
  newsletterOptIn: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  type: 'article' | 'recipe' | 'both';
  description?: string;
  icon?: string;
  sortOrder?: number;
}

export interface ArticleReference {
  id: number;
  title: string;
  url: string;
  source: string; // e.g., "CDC", "USDA", "NIH", "Harvard Health"
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML or structured Markdown
  coverImageUrl: string;
  categoryId: number;
  categoryName?: string;
  tags: string[];
  authorName: string;
  medicalReviewer?: string;
  metaTitle?: string;
  metaDescription?: string;
  readingTimeMin: number;
  viewCount: number;
  status: 'draft' | 'review' | 'published' | 'archived';
  publishedAt: string;
  lastReviewedAt?: string;
  keyTakeaways: string[];
  references: ArticleReference[];
}

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
  description: string;
  coverImageUrl: string;
  categoryId: number;
  categoryName?: string;
  dietaryTags: string[]; // e.g. ["Vegetarian", "High-Protein", "Gluten-Free", "Budget"]
  allergens: string[]; // e.g. ["dairy", "nuts", "eggs"]
  difficulty: 'easy' | 'medium' | 'hard';
  prepTimeMin: number;
  cookTimeMin: number;
  totalTimeMin: number;
  baseServings: number;
  costPerServing: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  status: 'draft' | 'published' | 'archived';
  publishedAt: string;
  viewCount: number;
  saveCount: number;
  rating?: number;
  ratingCount?: number;
}

export interface RecipeRating {
  id: string;
  recipeId: string;
  userId?: string;
  userName: string;
  rating: number; // 1 to 5
  review?: string;
  createdAt: string;
}

export interface MealItem {
  name: string;
  calories: number;
  recipeId?: string;
  notes?: string;
}

export interface MealDay {
  day: string; // "Monday", "Tuesday", etc.
  date?: string;
  meals: {
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
    snack: MealItem;
  };
  totalCalories: number;
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
    estimatedWeeklyCost: number;
  };
  status: 'active' | 'archived';
  createdAt: string;
}

export interface GroceryItem {
  id: string;
  item: string;
  amount: string;
  checked: boolean;
  estimatedCost: number;
}

export interface GroceryList {
  id: string;
  userId?: string;
  mealPlanId?: string;
  title: string;
  categories: {
    produce: GroceryItem[];
    dairy: GroceryItem[];
    proteins: GroceryItem[];
    pantry: GroceryItem[];
    frozen: GroceryItem[];
  };
  estimatedTotal: number;
  createdAt: string;
}

export interface Habit {
  id: number;
  userId: string;
  name: string;
  category: 'hydration' | 'nutrition' | 'activity' | 'sleep' | 'general';
  icon: string;
  targetPerDay: number;
  unit: string;
  isActive: boolean;
  streakCount: number;
}

export interface HabitLog {
  id: number;
  habitId: number;
  userId: string;
  loggedDate: string; // "YYYY-MM-DD"
  completed: boolean;
}

export interface AIUsageLog {
  id: number;
  userId?: string;
  sessionIp: string;
  tool: 'wellness' | 'mealPlan' | 'recipe' | 'nutrition' | 'grocery';
  promptPreview: string;
  modelUsed: string;
  durationMs: number;
  status: 'success' | 'error' | 'rate_limited' | 'flagged';
  createdAt: string;
}

export interface SiteSettings {
  heroHeadline: string;
  heroSubtext: string;
  heroCtaText: string;
  dailyTip: string;
  healthyFoodOfDay: {
    name: string;
    benefits: string;
    calorieSnippet: string;
    imageUrl: string;
  };
  featuredArticleIds: string[];
  featuredRecipeIds: string[];
  rateLimitGuest: number;
  rateLimitUser: number;
  highThinkingEnabled: boolean;
}
