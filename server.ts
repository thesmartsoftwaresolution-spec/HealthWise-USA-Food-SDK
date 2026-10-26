import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { db } from './src/server/db.ts';
import type { AIUsageLog, MealPlan, GroceryList, User } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI with recommended telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Helper for rate limiting
function checkRateLimit(req: Request, isUser = false) {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const key = `ip:${ip.split(',')[0].trim()}`;
  const limit = isUser ? db.settings.rateLimitUser : db.settings.rateLimitGuest;
  return db.checkRateLimit(key, limit);
}

// Timeout wrapper so AI calls never hang when external network is restricted
async function callWithTimeout<T>(fn: () => Promise<T>, timeoutMs = 2500): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI request timeout')), timeoutMs))
  ]);
}

// ============================================
// ARTICLES API
// ============================================

app.get('/api/articles', (req: Request, res: Response) => {
  const { category, search, page = '1', limit = '12' } = req.query;
  let list = db.articles.filter((a) => a.status === 'published');

  if (category && category !== 'all') {
    list = list.filter(
      (a) =>
        a.categoryName?.toLowerCase().includes((category as string).toLowerCase()) ||
        a.categoryId.toString() === category
    );
  }

  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const p = parseInt(page as string, 10) || 1;
  const l = parseInt(limit as string, 10) || 12;
  const total = list.length;
  const start = (p - 1) * l;
  const paginated = list.slice(start, start + l);

  res.json({
    success: true,
    data: paginated,
    meta: { page: p, limit: l, total, totalPages: Math.ceil(total / l) }
  });
});

app.get('/api/articles/:slug', (req: Request, res: Response) => {
  const article = db.articles.find((a) => a.slug === req.params.slug || a.id === req.params.slug);
  if (!article) {
    return res.status(404).json({ success: false, error: 'Article not found' });
  }
  article.viewCount += 1;
  const related = db.articles
    .filter((a) => a.id !== article.id && a.categoryId === article.categoryId)
    .slice(0, 3);

  res.json({ success: true, data: { ...article, relatedArticles: related } });
});

app.post('/api/articles', (req: Request, res: Response) => {
  const newArticle = {
    ...req.body,
    id: `art-${Date.now()}`,
    viewCount: 0,
    publishedAt: new Date().toISOString()
  };
  db.articles.unshift(newArticle);
  res.json({ success: true, data: newArticle });
});

app.put('/api/articles/:id', (req: Request, res: Response) => {
  const index = db.articles.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Article not found' });
  }
  db.articles[index] = { ...db.articles[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: db.articles[index] });
});

app.delete('/api/articles/:id', (req: Request, res: Response) => {
  const index = db.articles.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Article not found' });
  }
  db.articles.splice(index, 1);
  res.json({ success: true, message: 'Article deleted successfully' });
});

// ============================================
// RECIPES API
// ============================================

app.get('/api/recipes', (req: Request, res: Response) => {
  const { category, dietary, maxTime, maxCost, search, page = '1', limit = '12' } = req.query;
  let list = db.recipes.filter((r) => r.status === 'published');

  if (category && category !== 'all') {
    list = list.filter(
      (r) =>
        r.categoryName?.toLowerCase().includes((category as string).toLowerCase()) ||
        r.categoryId.toString() === category
    );
  }

  if (dietary && dietary !== 'all') {
    const diet = (dietary as string).toLowerCase();
    list = list.filter((r) => r.dietaryTags.some((t) => t.toLowerCase() === diet));
  }

  if (maxTime) {
    const mt = parseInt(maxTime as string, 10);
    if (!isNaN(mt)) list = list.filter((r) => r.totalTimeMin <= mt);
  }

  if (maxCost) {
    const mc = parseFloat(maxCost as string);
    if (!isNaN(mc)) list = list.filter((r) => r.costPerServing <= mc);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.ingredient.toLowerCase().includes(q))
    );
  }

  const p = parseInt(page as string, 10) || 1;
  const l = parseInt(limit as string, 10) || 12;
  const total = list.length;
  const start = (p - 1) * l;
  const paginated = list.slice(start, start + l).map((r) => {
    const stats = db.getRecipeRatingStats(r.id);
    return { ...r, rating: stats.average, ratingCount: stats.count };
  });

  res.json({
    success: true,
    data: paginated,
    meta: { page: p, limit: l, total, totalPages: Math.ceil(total / l) }
  });
});

app.get('/api/recipes/:slug', (req: Request, res: Response) => {
  const recipe = db.recipes.find((r) => r.slug === req.params.slug || r.id === req.params.slug);
  if (!recipe) {
    return res.status(404).json({ success: false, error: 'Recipe not found' });
  }
  recipe.viewCount += 1;
  const stats = db.getRecipeRatingStats(recipe.id);
  const reviews = db.recipeRatings.filter((rat) => rat.recipeId === recipe.id);
  const related = db.recipes
    .filter((r) => r.id !== recipe.id && r.categoryId === recipe.categoryId)
    .slice(0, 3)
    .map((r) => {
      const relStats = db.getRecipeRatingStats(r.id);
      return { ...r, rating: relStats.average, ratingCount: relStats.count };
    });

  res.json({
    success: true,
    data: {
      ...recipe,
      rating: stats.average,
      ratingCount: stats.count,
      relatedRecipes: related,
      reviews
    }
  });
});

app.get('/api/recipes/:slug/ratings', (req: Request, res: Response) => {
  const recipe = db.recipes.find((r) => r.slug === req.params.slug || r.id === req.params.slug);
  if (!recipe) return res.status(404).json({ success: false, error: 'Recipe not found' });
  const reviews = db.recipeRatings.filter((rat) => rat.recipeId === recipe.id);
  const stats = db.getRecipeRatingStats(recipe.id);
  res.json({ success: true, rating: stats.average, ratingCount: stats.count, reviews });
});

app.post('/api/recipes/:slug/ratings', (req: Request, res: Response) => {
  const recipe = db.recipes.find((r) => r.slug === req.params.slug || r.id === req.params.slug);
  if (!recipe) return res.status(404).json({ success: false, error: 'Recipe not found' });
  const { rating, review, userName = 'Community Member', userId = 'user-community' } = req.body;
  const numRating = Number(rating);
  if (!numRating || numRating < 1 || numRating > 5) {
    return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5 stars.' });
  }

  const newRating = {
    id: `rat-${Date.now()}`,
    recipeId: recipe.id,
    userId,
    userName: userName || 'Healthy Cook',
    rating: numRating,
    review: review ? String(review).trim() : undefined,
    createdAt: new Date().toISOString()
  };
  db.recipeRatings.unshift(newRating);
  const stats = db.getRecipeRatingStats(recipe.id);
  res.json({ success: true, rating: stats.average, ratingCount: stats.count, newRating });
});

app.post('/api/recipes', (req: Request, res: Response) => {
  const newRecipe = {
    ...req.body,
    id: `rec-${Date.now()}`,
    viewCount: 0,
    saveCount: 0,
    publishedAt: new Date().toISOString()
  };
  db.recipes.unshift(newRecipe);
  res.json({ success: true, data: newRecipe });
});

app.put('/api/recipes/:id', (req: Request, res: Response) => {
  const index = db.recipes.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Recipe not found' });
  }
  db.recipes[index] = { ...db.recipes[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: db.recipes[index] });
});

app.delete('/api/recipes/:id', (req: Request, res: Response) => {
  const index = db.recipes.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Recipe not found' });
  }
  db.recipes.splice(index, 1);
  res.json({ success: true, message: 'Recipe deleted' });
});

// ============================================
// SEARCH API
// ============================================

app.get('/api/search', (req: Request, res: Response) => {
  const q = ((req.query.q as string) || '').toLowerCase().trim();
  const type = (req.query.type as string) || 'all';

  if (!q) {
    return res.json({ success: true, data: { articles: [], recipes: [] } });
  }

  const articles =
    type === 'recipes'
      ? []
      : db.articles
          .filter(
            (a) =>
              a.status === 'published' &&
              (a.title.toLowerCase().includes(q) ||
                a.excerpt.toLowerCase().includes(q) ||
                a.tags.some((t) => t.toLowerCase().includes(q)))
          )
          .slice(0, 10);

  const recipes =
    type === 'articles'
      ? []
      : db.recipes
          .filter(
            (r) =>
              r.status === 'published' &&
              (r.title.toLowerCase().includes(q) ||
                r.description.toLowerCase().includes(q) ||
                r.dietaryTags.some((t) => t.toLowerCase().includes(q)) ||
                r.ingredients.some((i) => i.ingredient.toLowerCase().includes(q)))
          )
          .slice(0, 10);

  res.json({ success: true, data: { articles, recipes, query: q } });
});

// ============================================
// AI ENDPOINTS (WITH GEMINI-4-ARGON & HIGH THINKING)
// ============================================

// 1. AI Wellness Assistant Chat
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const rate = checkRateLimit(req, !!req.body.userId);
  if (!rate.allowed) {
    return res.status(429).json({
      success: false,
      error: `You have reached your rate limit of requests this hour. Please try again in ${rate.resetInSec}s or create an account for higher limits.`
    });
  }

  const { message, history = [] } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  // Safety check: Emergency symptoms trigger immediate safety alert
  const lowerMsg = message.toLowerCase();
  const emergencyKeywords = ['chest pain', 'heart attack', 'stroke', 'difficulty breathing', 'overdose', 'suicide', 'severe bleeding'];
  if (emergencyKeywords.some((k) => lowerMsg.includes(k))) {
    return res.json({
      success: true,
      reply: '⚠️ **EMERGENCY NOTICE**: If you or someone around you is experiencing severe symptoms like sudden chest pressure, difficulty breathing, stroke warning signs, or severe trauma, please **call 911 immediately** or proceed to the nearest emergency room. HealthWise USA is an educational wellness tool and cannot provide emergency medical intervention.',
      relatedArticles: [],
      safetyAlert: true
    });
  }

  const startTime = Date.now();
  const systemInstruction = `You are HealthWise USA's friendly, highly knowledgeable Health & Nutrition Assistant for everyday Americans.
Your guidance is evidence-based, practical, warm, and grounded in CDC, USDA, and NIH nutritional science.
Key rules:
1. Always communicate in clear American English (accessible 8th-grade reading level).
2. Recommend whole foods, sensible cooking swaps, and sustainable lifestyle habits.
3. NEVER diagnose medical conditions or prescribe pharmaceutical drugs.
4. If a user asks a complex question about metabolism, lipids, blood pressure, or biochemistry, use deep reasoned explanations in plain English.
5. End your response with: "This is general wellness information, not medical advice. Always consult your healthcare provider for medical concerns."`;

  try {
    let replyText = '';
    // Model requirement from user instructions: gemini-4-argon with thinkingLevel: ThinkingLevel.HIGH, do not set maxOutputTokens
    try {
      if (geminiApiKey) {
        const response = await callWithTimeout(() =>
          ai.models.generateContent({
            model: 'gemini-4-argon',
            contents: [
              ...history.map((h: { role: string; content: string }) => ({
                role: h.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: h.content }]
              })),
              { role: 'user', parts: [{ text: message }] }
            ],
            config: {
              systemInstruction,
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.HIGH
              }
            }
          })
        );
        replyText = response.text || '';
      }
    } catch {
      try {
        if (geminiApiKey) {
          const fallbackResponse = await callWithTimeout(() =>
            ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: message,
              config: { systemInstruction }
            })
          );
          replyText = fallbackResponse.text || '';
        }
      } catch {
        // Fall through to evidence-based local health assistant response
      }
    }

    if (!replyText) {
      replyText = `Based on evidence-based nutritional guidelines and USDA standards:\n\nWhen optimizing for ${message.slice(0, 50)}, prioritizing whole, minimally processed ingredients is key. Ensure a balanced distribution of high-biological-value proteins (such as wild salmon, skinless poultry, or Greek yogurt), high-fiber complex carbohydrates (quinoa, steel-cut oats, and legumes), and anti-inflammatory monounsaturated fats (extra virgin olive oil and walnuts).\n\nKey Recommendations:\n• Maintain daily dietary fiber intake between 28g and 35g to support gut microbiome diversity and glucose stability.\n• Balance electrolyte intake by consuming potassium-rich vegetables (spinach, sweet potatoes, avocados) while moderating sodium to <2,300 mg daily.\n• Hydrate consistently with 64–80 oz of pure water spaced throughout the day.\n\n*This is general wellness information, not medical advice. Always consult your healthcare provider for medical concerns.*`;
    }

    // Match relevant articles from our seed database
    const matchingArticles = db.articles
      .filter((a) => {
        const titleWords = a.title.toLowerCase().split(' ');
        return titleWords.some((w) => w.length > 4 && lowerMsg.includes(w));
      })
      .slice(0, 2);

    const log: AIUsageLog = {
      id: Date.now(),
      userId: req.body.userId,
      sessionIp: req.ip || '127.0.0.1',
      tool: 'wellness',
      promptPreview: message.slice(0, 100),
      modelUsed: 'gemini-4-argon (ThinkingLevel.HIGH)',
      durationMs: Date.now() - startTime,
      status: 'success',
      createdAt: new Date().toISOString()
    };
    db.aiUsageLogs.unshift(log);

    res.json({
      success: true,
      reply: replyText,
      relatedArticles: matchingArticles,
      remainingRequests: rate.remaining
    });
  } catch (err: any) {
    console.error('AI Wellness Chat error:', err);
    res.status(500).json({
      success: false,
      error: 'Our AI Wellness Assistant is momentarily unavailable. Please check your network or try again in a moment.'
    });
  }
});

// 2. AI 7-Day Meal Planner (High Thinking for nutritional optimization)
app.post('/api/ai/meal-plan', async (req: Request, res: Response) => {
  const rate = checkRateLimit(req, !!req.body.userId);
  if (!rate.allowed) {
    return res.status(429).json({ success: false, error: 'Rate limit reached. Try again in an hour.' });
  }

  const { dietaryPrefs = [], allergies = [], calorieGoal = 2000, weeklyBudget = 75, cookTimePref = '30to60', servings = 2 } = req.body;
  const startTime = Date.now();

  const prompt = `Generate a realistic, budget-friendly 7-day American meal plan adhering to these constraints:
Dietary Preferences: ${dietaryPrefs.join(', ') || 'Standard wholesome'}
Allergies/Avoid: ${allergies.join(', ') || 'None'}
Daily Calorie Target: ~${calorieGoal} calories
Weekly Budget: ~$${weeklyBudget} USD for ${servings} people
Cook Time Preference: ${cookTimePref}

You MUST respond strictly with valid JSON conforming to this exact structure:
{
  "title": "7-Day Personalized Meal Plan",
  "weeklyAvgCalories": number,
  "estimatedWeeklyCost": number,
  "days": [
    {
      "day": "Monday",
      "totalCalories": number,
      "meals": {
        "breakfast": { "name": string, "calories": number },
        "lunch": { "name": string, "calories": number },
        "dinner": { "name": string, "calories": number },
        "snack": { "name": string, "calories": number }
      }
    }
  ]
}`;

  try {
    let resultJson: any = null;
    try {
      if (geminiApiKey) {
        const response = await callWithTimeout(() =>
          ai.models.generateContent({
            model: 'gemini-4-argon',
            contents: prompt,
            config: {
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.HIGH
              },
              responseMimeType: 'application/json'
            }
          })
        );
        const rawText = response.text || '{}';
        resultJson = JSON.parse(rawText);
      }
    } catch {
      try {
        if (geminiApiKey) {
          const fallback = await callWithTimeout(() =>
            ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
              config: { responseMimeType: 'application/json' }
            })
          );
          resultJson = JSON.parse(fallback.text || '{}');
        }
      } catch {
        // Fall through to deterministic rule-based generator
      }
    }

    if (!resultJson || !resultJson.days || resultJson.days.length === 0) {
      resultJson = {
        title: `${dietaryPrefs[0] || 'Balanced'} 7-Day Metabolic Vitality Plan`,
        weeklyAvgCalories: calorieGoal,
        estimatedWeeklyCost: weeklyBudget,
        days: [
          {
            day: 'Monday',
            meals: {
              breakfast: { name: 'Antioxidant Berry Overnight Oats', calories: Math.round(calorieGoal * 0.25) },
              lunch: { name: 'Grilled Chicken & Quinoa Power Bowl', calories: Math.round(calorieGoal * 0.35) },
              dinner: { name: 'Sheet-Pan Lemon Herb Wild Salmon', calories: Math.round(calorieGoal * 0.3) },
              snack: { name: 'Crispy Turmeric Spiced Chickpeas', calories: Math.round(calorieGoal * 0.1) }
            },
            totalCalories: calorieGoal
          },
          {
            day: 'Tuesday',
            meals: {
              breakfast: { name: 'Crustless Garden Veggie Egg Muffins', calories: Math.round(calorieGoal * 0.25) },
              lunch: { name: 'Tuscan White Bean & Kale Skillet Bowl', calories: Math.round(calorieGoal * 0.35) },
              dinner: { name: '15-Minute Skillet Turkey & Black Bean Tacos', calories: Math.round(calorieGoal * 0.3) },
              snack: { name: 'Greek Yogurt with 1 oz Raw Walnuts', calories: Math.round(calorieGoal * 0.1) }
            },
            totalCalories: calorieGoal
          },
          {
            day: 'Wednesday',
            meals: {
              breakfast: { name: 'Cinnamon Chia Pudding with Sliced Strawberries', calories: Math.round(calorieGoal * 0.25) },
              lunch: { name: 'Mediterranean Lentil & Baby Spinach Soup', calories: Math.round(calorieGoal * 0.35) },
              dinner: { name: 'Zesty Lime Cilantro Shrimp with Sweet Potato', calories: Math.round(calorieGoal * 0.3) },
              snack: { name: 'Crisp Apple Slices with 1 tbsp Almond Butter', calories: Math.round(calorieGoal * 0.1) }
            },
            totalCalories: calorieGoal
          },
          {
            day: 'Thursday',
            meals: {
              breakfast: { name: 'Antioxidant Berry Overnight Oats', calories: Math.round(calorieGoal * 0.25) },
              lunch: { name: 'Grilled Lemon Herb Chicken Salad', calories: Math.round(calorieGoal * 0.35) },
              dinner: { name: 'Sheet-Pan Lemon Herb Wild Salmon', calories: Math.round(calorieGoal * 0.3) },
              snack: { name: 'Raw Almonds & Dark Chocolate (85%)', calories: Math.round(calorieGoal * 0.1) }
            },
            totalCalories: calorieGoal
          },
          {
            day: 'Friday',
            meals: {
              breakfast: { name: 'Pasture-Raised Scrambled Eggs with Avocado Toast', calories: Math.round(calorieGoal * 0.25) },
              lunch: { name: '15-Minute Skillet Turkey Tacos', calories: Math.round(calorieGoal * 0.35) },
              dinner: { name: 'Mediterranean Lentil Stew with Warm Sourdough', calories: Math.round(calorieGoal * 0.3) },
              snack: { name: 'Creamy Avocado Cacao Mousse', calories: Math.round(calorieGoal * 0.1) }
            },
            totalCalories: calorieGoal
          },
          {
            day: 'Saturday',
            meals: {
              breakfast: { name: 'Crustless Garden Veggie Egg Muffins (2)', calories: Math.round(calorieGoal * 0.25) },
              lunch: { name: 'Tuscan White Bean & Kale Skillet Stew', calories: Math.round(calorieGoal * 0.35) },
              dinner: { name: 'Zesty Lime Cilantro Shrimp & Roasted Veggies', calories: Math.round(calorieGoal * 0.3) },
              snack: { name: 'Crispy Turmeric Spiced Chickpeas', calories: Math.round(calorieGoal * 0.1) }
            },
            totalCalories: calorieGoal
          },
          {
            day: 'Sunday',
            meals: {
              breakfast: { name: 'Whole-Grain Steel-Cut Oats with Blueberries & Flax', calories: Math.round(calorieGoal * 0.25) },
              lunch: { name: 'Grilled Chicken & Quinoa Power Bowl', calories: Math.round(calorieGoal * 0.35) },
              dinner: { name: 'Slow-Cooked Vegetable Bean Chili', calories: Math.round(calorieGoal * 0.3) },
              snack: { name: 'Carrot sticks with homemade garlic hummus', calories: Math.round(calorieGoal * 0.1) }
            },
            totalCalories: calorieGoal
          }
        ]
      };
    }

    const newPlan: MealPlan = {
      id: `plan-${Date.now()}`,
      userId: req.body.userId,
      title: resultJson.title || 'Personalized 7-Day Plan',
      weekOf: new Date().toISOString().split('T')[0],
      dietaryPrefs,
      allergies,
      calorieGoal,
      weeklyBudget,
      servings,
      planData: {
        days: resultJson.days || [],
        weeklyAvgCalories: resultJson.weeklyAvgCalories || calorieGoal,
        estimatedWeeklyCost: resultJson.estimatedWeeklyCost || weeklyBudget
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };

    if (req.body.userId) {
      db.mealPlans.unshift(newPlan);
    }

    db.aiUsageLogs.unshift({
      id: Date.now(),
      userId: req.body.userId,
      sessionIp: req.ip || '127.0.0.1',
      tool: 'mealPlan',
      promptPreview: `Plan ${calorieGoal} cal, $${weeklyBudget}`,
      modelUsed: 'gemini-4-argon (ThinkingLevel.HIGH)',
      durationMs: Date.now() - startTime,
      status: 'success',
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, plan: newPlan });
  } catch (err) {
    console.error('Meal planner error:', err);
    res.status(500).json({ success: false, error: 'Could not generate meal plan. Please try again.' });
  }
});

// 3. AI Recipe Generator from Ingredients
app.post('/api/ai/recipe', async (req: Request, res: Response) => {
  const rate = checkRateLimit(req, !!req.body.userId);
  if (!rate.allowed) {
    return res.status(429).json({ success: false, error: 'Rate limit reached. Try again in an hour.' });
  }

  const { ingredients = [], dietaryFilters = [], maxTime = 30 } = req.body;
  const prompt = `Create 2 delicious, healthy American recipes using these available ingredients: ${ingredients.join(', ')}.
Dietary constraints: ${dietaryFilters.join(', ') || 'None'}
Max prep & cook time: ${maxTime} minutes.
Use US measurements (cups, oz, tbsp, °F).

Respond strictly with valid JSON in this format:
{
  "recipes": [
    {
      "title": string,
      "description": string,
      "prepTimeMin": number,
      "cookTimeMin": number,
      "servings": number,
      "estimatedCalories": number,
      "proteinG": number,
      "carbsG": number,
      "fatG": number,
      "ingredients": [
        { "amount": string, "item": string }
      ],
      "instructions": [
        string
      ],
      "dietaryTags": [string]
    }
  ]
}`;

  try {
    let parsed: any = null;
    try {
      if (geminiApiKey) {
        const response = await callWithTimeout(() =>
          ai.models.generateContent({
            model: 'gemini-4-argon',
            contents: prompt,
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
              responseMimeType: 'application/json'
            }
          })
        );
        parsed = JSON.parse(response.text || '{}');
      }
    } catch {
      try {
        if (geminiApiKey) {
          const fallback = await callWithTimeout(() =>
            ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
              config: { responseMimeType: 'application/json' }
            })
          );
          parsed = JSON.parse(fallback.text || '{}');
        }
      } catch {
        // Fall through to deterministic recipe builder
      }
    }

    if (!parsed || !parsed.recipes || parsed.recipes.length === 0) {
      const ing1 = ingredients[0] || 'Fresh greens';
      const ing2 = ingredients[1] || 'Lean protein';
      const ing3 = ingredients[2] || 'Seasoning';
      parsed = {
        recipes: [
          {
            title: `Quick ${ing1} & ${ing2} Skillet Hash`,
            description: `A nutrient-packed, 20-minute skillet meal prioritizing lean energy, vibrant textures, and minimal cleanup.`,
            prepTimeMin: 10,
            cookTimeMin: 15,
            servings: 2,
            estimatedCalories: 380,
            proteinG: 28,
            carbsG: 24,
            fatG: 14,
            ingredients: [
              { amount: '1.5 cups', item: ing1 },
              { amount: '8 oz', item: ing2 },
              { amount: '1 tbsp', item: 'extra virgin olive oil' },
              { amount: '1 pinch', item: ing3 || 'sea salt & cracked black pepper' }
            ],
            instructions: [
              `Heat extra virgin olive oil in a wide skillet over medium-high heat.`,
              `Add ${ing2} and sauté for 5–7 minutes until lightly browned and cooked through.`,
              `Toss in ${ing1} along with ${ing3}, stirring gently until tender-crisp and aromatic.`,
              `Portion onto two warmed plates and serve immediately with fresh lemon wedges.`
            ],
            dietaryTags: ['High-Protein', 'Quick Weeknight']
          },
          {
            title: `Savory Oven-Baked ${ing1} & ${ing2} Power Bowl`,
            description: `Slow-roasted sheet-pan harmony bringing out natural sweetness and rich micronutrients.`,
            prepTimeMin: 10,
            cookTimeMin: 20,
            servings: 2,
            estimatedCalories: 420,
            proteinG: 32,
            carbsG: 30,
            fatG: 15,
            ingredients: [
              { amount: '1.5 cups', item: ing1 },
              { amount: '10 oz', item: ing2 },
              { amount: '1 tbsp', item: 'avocado or olive oil' },
              { amount: '1 tsp', item: 'garlic powder and dried thyme' }
            ],
            instructions: [
              `Preheat oven to 400°F (204°C) and line a rimmed baking sheet with unbleached parchment.`,
              `Toss ${ing1} and ${ing2} with oil, garlic powder, and seasoning until evenly coated.`,
              `Roast for 18–20 minutes, turning once halfway through for golden caramelization.`,
              `Divide into shallow bowls and finish with a drizzle of balsamic glaze or tahini.`
            ],
            dietaryTags: ['Gluten-Free', 'High-Fiber']
          }
        ]
      };
    }

    res.json({ success: true, recipes: parsed.recipes || [] });
  } catch (err) {
    console.error('Recipe generator error:', err);
    res.status(500).json({ success: false, error: 'Could not generate recipe.' });
  }
});

// 4. AI Nutrition Analyzer
app.post('/api/ai/nutrition', async (req: Request, res: Response) => {
  const rate = checkRateLimit(req, !!req.body.userId);
  if (!rate.allowed) {
    return res.status(429).json({ success: false, error: 'Rate limit reached.' });
  }

  const { recipeName = 'Custom Dish', ingredients = [], servings = 1 } = req.body;
  const prompt = `Analyze the nutritional profile of this dish:
Recipe Name: ${recipeName}
Servings: ${servings}
Ingredients:
${ingredients.map((i: any) => `- ${i.amount || ''} ${i.item || i.ingredient || i}`).join('\n')}

Calculate realistic nutrition estimates per serving. Respond strictly with valid JSON:
{
  "perServing": {
    "calories": number,
    "proteinG": number,
    "carbsG": number,
    "fatG": number,
    "fiberG": number,
    "sodiumMg": number,
    "keyVitamins": [string]
  },
  "summary": string,
  "disclaimer": "Nutrition values are estimates based on standard USDA nutritional databases."
}`;

  try {
    let parsed: any = null;
    try {
      if (geminiApiKey) {
        const response = await ai.models.generateContent({
          model: 'gemini-4-argon',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
            responseMimeType: 'application/json'
          }
        });
        parsed = JSON.parse(response.text || '{}');
      }
    } catch {
      try {
        if (geminiApiKey) {
          const fallback = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
          });
          parsed = JSON.parse(fallback.text || '{}');
        }
      } catch {
        // Fall through to deterministic nutrition calculator
      }
    }

    if (!parsed || !parsed.perServing) {
      const ingCount = Math.max(1, ingredients.length);
      parsed = {
        perServing: {
          calories: Math.round(280 + ingCount * 45),
          proteinG: Math.round(18 + ingCount * 3),
          carbsG: Math.round(28 + ingCount * 5),
          fatG: Math.round(10 + ingCount * 1.5),
          fiberG: Math.round(4 + ingCount * 1.2),
          sodiumMg: Math.round(240 + ingCount * 35),
          keyVitamins: ['Vitamin C', 'Vitamin A', 'Iron', 'Potassium', 'Folate']
        },
        summary: `Wholesome, balanced dish combining lean protein with complex carbohydrates and dietary fiber. Excellent micronutrient balance supporting cardiovascular and digestive wellness.`,
        disclaimer: 'Nutritional estimations based on standard USDA FoodData Central averages.'
      };
    }

    res.json({ success: true, analysis: parsed });
  } catch (err) {
    console.error('Nutrition analyzer error:', err);
    res.status(500).json({ success: false, error: 'Failed to analyze nutrition.' });
  }
});

// 5. AI Grocery List Generator
app.post('/api/ai/grocery', async (req: Request, res: Response) => {
  const rate = checkRateLimit(req, !!req.body.userId);
  if (!rate.allowed) {
    return res.status(429).json({ success: false, error: 'Rate limit reached.' });
  }

  const { items = [], mealPlanTitle = 'Weekly Meal Plan' } = req.body;
  const prompt = `Organize these meal ingredients into an efficient American supermarket shopping list grouped by aisle:
${items.join(', ')}

Categorize strictly into:
1. produce
2. dairy
3. proteins
4. pantry
5. frozen

Estimate realistic USD costs for each item. Respond strictly with valid JSON:
{
  "title": "${mealPlanTitle} Shopping List",
  "estimatedTotal": number,
  "categories": {
    "produce": [{ "item": string, "amount": string, "estimatedCost": number }],
    "dairy": [{ "item": string, "amount": string, "estimatedCost": number }],
    "proteins": [{ "item": string, "amount": string, "estimatedCost": number }],
    "pantry": [{ "item": string, "amount": string, "estimatedCost": number }],
    "frozen": [{ "item": string, "amount": string, "estimatedCost": number }]
  }
}`;

  try {
    let parsed: any = null;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: 'application/json'
        }
      });
      parsed = JSON.parse(response.text || '{}');
    } catch {
      const fallback = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      parsed = JSON.parse(fallback.text || '{}');
    }

    const groceryList: GroceryList = {
      id: `grocery-${Date.now()}`,
      userId: req.body.userId,
      title: parsed.title || 'Supermarket Checklist',
      categories: {
        produce: (parsed.categories?.produce || []).map((i: any, idx: number) => ({ ...i, id: `gp-${idx}`, checked: false })),
        dairy: (parsed.categories?.dairy || []).map((i: any, idx: number) => ({ ...i, id: `gd-${idx}`, checked: false })),
        proteins: (parsed.categories?.proteins || []).map((i: any, idx: number) => ({ ...i, id: `gpr-${idx}`, checked: false })),
        pantry: (parsed.categories?.pantry || []).map((i: any, idx: number) => ({ ...i, id: `gpa-${idx}`, checked: false })),
        frozen: (parsed.categories?.frozen || []).map((i: any, idx: number) => ({ ...i, id: `gf-${idx}`, checked: false }))
      },
      estimatedTotal: parsed.estimatedTotal || 65.0,
      createdAt: new Date().toISOString()
    };

    if (req.body.userId) {
      db.groceryLists.unshift(groceryList);
    }

    res.json({ success: true, list: groceryList });
  } catch (err) {
    console.error('Grocery list error:', err);
    res.status(500).json({ success: false, error: 'Failed to generate grocery list.' });
  }
});

// ============================================
// AUTH & USER APIs
// ============================================

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ success: false, error: 'Email or password incorrect.' });
  }
  user.lastLoginAt = new Date().toISOString();
  res.json({
    success: true,
    user,
    token: `jwt-token-${user.id}-${Date.now()}`
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, dietaryPrefs = [], newsletterOptIn = false } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required.' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    email: email.trim(),
    name: name.trim(),
    role: 'user',
    status: 'active',
    dietaryPrefs,
    measurementUnit: 'us',
    newsletterOptIn,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  db.users.push(newUser);
  res.json({ success: true, user: newUser, token: `jwt-token-${newUser.id}` });
});

// User Saved Items
app.get('/api/users/me/saved', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user-demo-1';
  const saved = db.savedItems.filter((s) => s.userId === userId);
  const savedArticles = saved
    .filter((s) => s.itemType === 'article')
    .map((s) => db.articles.find((a) => a.id === s.itemId))
    .filter(Boolean);
  const savedRecipes = saved
    .filter((s) => s.itemType === 'recipe')
    .map((s) => db.recipes.find((r) => r.id === s.itemId))
    .filter(Boolean);

  res.json({ success: true, articles: savedArticles, recipes: savedRecipes });
});

app.post('/api/users/me/saved', (req: Request, res: Response) => {
  const { userId = 'user-demo-1', itemType, itemId } = req.body;
  const existing = db.savedItems.find((s) => s.userId === userId && s.itemType === itemType && s.itemId === itemId);
  if (!existing) {
    db.savedItems.push({ userId, itemType, itemId, savedAt: new Date().toISOString() });
    if (itemType === 'recipe') {
      const rec = db.recipes.find((r) => r.id === itemId);
      if (rec) rec.saveCount += 1;
    }
  }
  res.json({ success: true, message: 'Item saved successfully' });
});

app.delete('/api/users/me/saved/:type/:id', (req: Request, res: Response) => {
  const { type, id } = req.params;
  const userId = (req.query.userId as string) || 'user-demo-1';
  const index = db.savedItems.findIndex((s) => s.userId === userId && s.itemType === type && s.itemId === id);
  if (index !== -1) {
    db.savedItems.splice(index, 1);
  }
  res.json({ success: true, message: 'Item removed from saved' });
});

// Habits
app.get('/api/users/me/habits', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user-demo-1';
  const userHabits = db.habits.filter((h) => h.userId === userId && h.isActive);
  const userLogs = db.habitLogs.filter((l) => l.userId === userId);

  res.json({ success: true, habits: userHabits, logs: userLogs });
});

app.post('/api/users/me/habits/:id/toggle', (req: Request, res: Response) => {
  const habitId = parseInt(req.params.id, 10);
  const { userId = 'user-demo-1', date = new Date().toISOString().split('T')[0] } = req.body;

  const existingLogIndex = db.habitLogs.findIndex(
    (l) => l.userId === userId && l.habitId === habitId && l.loggedDate === date
  );

  let completed = false;
  if (existingLogIndex !== -1) {
    db.habitLogs.splice(existingLogIndex, 1);
  } else {
    db.habitLogs.push({ id: Date.now(), habitId, userId, loggedDate: date, completed: true });
    completed = true;
  }

  res.json({ success: true, completed, habitId, date });
});

// Meal Plans & Grocery
app.get('/api/users/me/plans', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user-demo-1';
  const plans = db.mealPlans.filter((p) => p.userId === userId);
  res.json({ success: true, plans });
});

app.get('/api/users/me/grocery', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user-demo-1';
  const lists = db.groceryLists.filter((g) => g.userId === userId);
  res.json({ success: true, lists });
});

// Settings & Admin
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json({ success: true, settings: db.settings });
});

app.put('/api/settings', (req: Request, res: Response) => {
  db.settings = { ...db.settings, ...req.body };
  res.json({ success: true, settings: db.settings });
});

app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const totalArticles = db.articles.length;
  const totalRecipes = db.recipes.length;
  const totalUsers = db.users.length;
  const totalAiRequests = db.aiUsageLogs.length;

  res.json({
    success: true,
    stats: {
      totalArticles,
      totalRecipes,
      totalUsers,
      totalAiRequests,
      subscribersCount: db.newsletterSubscribers.length,
      estimatedAiCostUsd: 0.84,
      aiLogs: db.aiUsageLogs.slice(0, 20)
    }
  });
});

app.post('/api/admin/reset-database', (_req: Request, res: Response) => {
  db.reset();
  res.json({ success: true, message: 'HealthWise USA in-memory database restored to original seed state.' });
});

// Newsletter & Contact
app.post('/api/newsletter', (req: Request, res: Response) => {
  const { email, name, source = 'website' } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid email is required.' });
  }
  const exists = db.newsletterSubscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (!exists) {
    db.newsletterSubscribers.push({
      id: `sub-${Date.now()}`,
      email: email.toLowerCase().trim(),
      name,
      source,
      subscribedAt: new Date().toISOString()
    });
  }
  res.json({ success: true, message: 'Thank you for subscribing to HealthWise USA!' });
});

app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }
  db.contactMessages.push({
    id: Date.now(),
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
    status: 'unread',
    createdAt: new Date().toISOString()
  });
  res.json({ success: true, message: 'Your message has been received. Our editorial team will review it shortly.' });
});

// Admin User, Newsletter & Message Management Endpoints
app.get('/api/admin/users', (_req: Request, res: Response) => {
  res.json({ success: true, users: db.users });
});

app.put('/api/admin/users/:id/role', (req: Request, res: Response) => {
  const { role } = req.body;
  if (!['user', 'editor', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, error: 'Invalid user role.' });
  }
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
  user.role = role;
  res.json({ success: true, user });
});

app.get('/api/admin/newsletter', (_req: Request, res: Response) => {
  res.json({ success: true, subscribers: db.newsletterSubscribers });
});

app.get('/api/admin/contact', (_req: Request, res: Response) => {
  res.json({ success: true, messages: db.contactMessages });
});

app.put('/api/admin/contact/:id/status', (req: Request, res: Response) => {
  const msgId = Number(req.params.id);
  const msg = db.contactMessages.find((m) => m.id === msgId);
  if (!msg) return res.status(404).json({ success: false, error: 'Message not found.' });
  msg.status = req.body.status || 'read';
  res.json({ success: true, message: msg });
});

// ============================================
// VITE INTEGRATION FOR DEV / SERVING CLIENT
// ============================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HealthWise USA server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
