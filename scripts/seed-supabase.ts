import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { SEED_ARTICLES, SEED_CATEGORIES, SEED_RECIPES, SEED_SETTINGS } from '../src/data/seedData.ts';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  throw new Error('Set SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) in your local environment. Never use this key in VITE_* variables or commit it.');
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function main() {
  const categoryRows = SEED_CATEGORIES.map((category, index) => ({
    name: category.name,
    slug: category.slug,
    type: category.type,
    description: category.description || null,
    icon: category.icon || null,
    sort_order: category.sortOrder ?? index,
  }));
  const { data: categories, error: categoryError } = await supabase
    .from('categories').upsert(categoryRows, { onConflict: 'slug' }).select('id,slug');
  if (categoryError) throw categoryError;
  const categoryIds = new Map(SEED_CATEGORIES.map((category) => [
    category.id,
    categories?.find((row) => row.slug === category.slug)?.id ?? category.id,
  ]));

  const articles = SEED_ARTICLES.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: item.content,
    cover_image_url: item.coverImageUrl,
    category_id: categoryIds.get(item.categoryId) ?? null,
    category_name: item.categoryName ?? null,
    tags: item.tags ?? [],
    author_name: item.authorName,
    medical_reviewer: item.medicalReviewer ?? null,
    meta_title: item.metaTitle ?? null,
    meta_description: item.metaDescription ?? null,
    reading_time_min: item.readingTimeMin ?? 5,
    view_count: item.viewCount ?? 0,
    status: item.status,
    published_at: item.publishedAt ?? new Date().toISOString(),
    last_reviewed_at: item.lastReviewedAt ?? null,
    key_takeaways: item.keyTakeaways ?? [],
    references_json: item.references ?? [],
  }));
  const { error: articleError } = await supabase.from('articles').upsert(articles, { onConflict: 'id' });
  if (articleError) throw articleError;

  const recipes = SEED_RECIPES.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description,
    cover_image_url: item.coverImageUrl,
    category_id: categoryIds.get(item.categoryId) ?? null,
    category_name: item.categoryName ?? null,
    dietary_tags: item.dietaryTags ?? [],
    allergens: item.allergens ?? [],
    difficulty: item.difficulty ?? 'easy',
    prep_time_min: item.prepTimeMin ?? 0,
    cook_time_min: item.cookTimeMin ?? 0,
    total_time_min: item.totalTimeMin ?? 0,
    servings: item.baseServings ?? 1,
    cost_per_serving: item.costPerServing ?? null,
    calories: item.calories ?? null,
    protein_g: item.proteinG ?? null,
    carbs_g: item.carbsG ?? null,
    fat_g: item.fatG ?? null,
    fiber_g: item.fiberG ?? null,
    sodium_mg: item.sodiumMg ?? null,
    ingredients: item.ingredients ?? [],
    instructions: item.instructions ?? [],
    tags: item.dietaryTags ?? [],
    status: item.status,
    published_at: item.publishedAt ?? new Date().toISOString(),
    view_count: item.viewCount ?? 0,
    save_count: item.saveCount ?? 0,
  }));
  const { error: recipeError } = await supabase.from('recipes').upsert(recipes, { onConflict: 'id' });
  if (recipeError) throw recipeError;

  const { error: settingsError } = await supabase.from('site_settings').upsert({
    id: true,
    site_name: 'HealthWise USA',
    daily_tip: SEED_SETTINGS.dailyTip,
    settings: SEED_SETTINGS,
  }, { onConflict: 'id' });
  if (settingsError) throw settingsError;

  console.log('Supabase seed complete:', {
    categories: categoryRows.length,
    articles: articles.length,
    recipes: recipes.length,
    settings: 1,
  });
}

main().catch((error) => {
  console.error('Supabase seed failed:', error);
  process.exitCode = 1;
});
