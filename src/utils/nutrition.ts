/**
 * Pure business logic for HealthWise USA calculations, recipe adjustments,
 * nutrition analysis, and habit streak aggregation.
 */

import type { MealDay, RecipeIngredient } from '../types/index.ts';

/**
 * Scales an ingredient quantity string (e.g., "2 cups", "1.5 lbs", "1/2 tsp", "4")
 * by the ratio of targetServings to baseServings.
 */
export function scaleIngredientQuantity(
  amountUs: string,
  baseServings: number,
  targetServings: number
): string {
  if (!baseServings || baseServings <= 0 || !targetServings || targetServings <= 0) {
    return amountUs;
  }
  const ratio = targetServings / baseServings;
  if (ratio === 1) return amountUs;

  // Match numbers or fractions at the start of the string
  // Examples: "2 cups", "1/2 tbsp", "1 1/2 lbs", "0.75 oz"
  const fractionMatch = amountUs.match(/^(\d+)\s*\/\s*(\d+)(.*)$/);
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1]);
    const den = parseFloat(fractionMatch[2]);
    const unit = fractionMatch[3];
    const val = (num / den) * ratio;
    return `${formatScaledNumber(val)}${unit}`;
  }

  const mixedMatch = amountUs.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)(.*)$/);
  if (mixedMatch) {
    const whole = parseFloat(mixedMatch[1]);
    const num = parseFloat(mixedMatch[2]);
    const den = parseFloat(mixedMatch[3]);
    const unit = mixedMatch[4];
    const val = (whole + num / den) * ratio;
    return `${formatScaledNumber(val)}${unit}`;
  }

  const decimalMatch = amountUs.match(/^([\d.]+)(.*)$/);
  if (decimalMatch) {
    const val = parseFloat(decimalMatch[1]) * ratio;
    const unit = decimalMatch[2];
    return `${formatScaledNumber(val)}${unit}`;
  }

  return amountUs;
}

export function formatScaledNumber(num: number): string {
  if (isNaN(num)) return '1';
  // Round to nearest quarter or 1 decimal place
  if (Math.abs(num - Math.round(num)) < 0.05) {
    return Math.round(num).toString();
  }
  // Check common cooking fractions
  const whole = Math.floor(num);
  const frac = num - whole;
  if (Math.abs(frac - 0.5) < 0.06) return whole > 0 ? `${whole} 1/2` : '1/2';
  if (Math.abs(frac - 0.25) < 0.06) return whole > 0 ? `${whole} 1/4` : '1/4';
  if (Math.abs(frac - 0.75) < 0.06) return whole > 0 ? `${whole} 3/4` : '3/4';
  if (Math.abs(frac - 0.33) < 0.06) return whole > 0 ? `${whole} 1/3` : '1/3';
  if (Math.abs(frac - 0.67) < 0.06) return whole > 0 ? `${whole} 2/3` : '2/3';

  return (Math.round(num * 10) / 10).toString();
}

/**
 * Calculates macro percentages from grams (protein 4 kcal/g, carbs 4 kcal/g, fat 9 kcal/g).
 */
export function calculateMacroPercentages(proteinG: number, carbsG: number, fatG: number) {
  const proteinKcal = Math.max(0, proteinG) * 4;
  const carbsKcal = Math.max(0, carbsG) * 4;
  const fatKcal = Math.max(0, fatG) * 9;
  const total = proteinKcal + carbsKcal + fatKcal;

  if (total === 0) {
    return { proteinPct: 0, carbsPct: 0, fatPct: 0, totalKcal: 0 };
  }

  return {
    proteinPct: Math.round((proteinKcal / total) * 100),
    carbsPct: Math.round((carbsKcal / total) * 100),
    fatPct: Math.round((fatKcal / total) * 100),
    totalKcal: Math.round(total)
  };
}

/**
 * Computes average daily calories and total weekly budget estimate for a meal plan.
 */
export function computeMealPlanTotals(days: MealDay[], budgetPerDay = 7.5) {
  if (!days || days.length === 0) {
    return { avgDailyCalories: 0, totalWeeklyCost: 0 };
  }
  const totalCals = days.reduce((acc, d) => {
    const dayCal =
      d.totalCalories ||
      (d.meals.breakfast?.calories || 0) +
        (d.meals.lunch?.calories || 0) +
        (d.meals.dinner?.calories || 0) +
        (d.meals.snack?.calories || 0);
    return acc + dayCal;
  }, 0);

  const avgDailyCalories = Math.round(totalCals / days.length);
  const totalWeeklyCost = Math.round(budgetPerDay * days.length * 100) / 100;
  return { avgDailyCalories, totalWeeklyCost };
}

/**
 * Categorizes an ingredient item into supermarket sections:
 * Produce, Dairy & Eggs, Lean Proteins, Pantry & Grains, or Frozen.
 */
export function categorizeSupermarketItem(
  name: string
): 'produce' | 'dairy' | 'proteins' | 'pantry' | 'frozen' {
  const lower = name.toLowerCase();

  const produceKeywords = [
    'spinach', 'kale', 'lettuce', 'tomato', 'onion', 'garlic', 'apple', 'banana',
    'berry', 'berries', 'lemon', 'lime', 'avocado', 'carrot', 'broccoli', 'pepper',
    'cucumber', 'herb', 'cilantro', 'parsley', 'mushroom', 'ginger', 'zucchini', 'potato'
  ];
  const dairyKeywords = [
    'milk', 'cheese', 'yogurt', 'butter', 'egg', 'eggs', 'cream', 'parmesan', 'feta'
  ];
  const proteinKeywords = [
    'chicken', 'turkey', 'beef', 'salmon', 'tuna', 'shrimp', 'fish', 'pork', 'tofu',
    'tempeh', 'steak', 'edamame'
  ];
  const frozenKeywords = [
    'frozen', 'ice cream', 'peas frozen', 'mixed berries frozen'
  ];

  if (frozenKeywords.some((k) => lower.includes(k))) return 'frozen';
  if (produceKeywords.some((k) => lower.includes(k))) return 'produce';
  if (dairyKeywords.some((k) => lower.includes(k))) return 'dairy';
  if (proteinKeywords.some((k) => lower.includes(k))) return 'proteins';
  return 'pantry';
}

/**
 * Calculates current consecutive day streak for a habit from logs.
 */
export function calculateHabitStreak(
  logDates: string[], // YYYY-MM-DD format
  todayStr: string = new Date().toISOString().split('T')[0]
): number {
  if (!logDates || logDates.length === 0) return 0;
  const set = new Set(logDates);

  let streak = 0;
  const curr = new Date(todayStr);

  // If completed today, count today and step back
  if (set.has(todayStr)) {
    streak++;
    curr.setDate(curr.getDate() - 1);
  } else {
    // If not completed today yet, check if completed yesterday to maintain active streak
    curr.setDate(curr.getDate() - 1);
  }

  while (true) {
    const dStr = curr.toISOString().split('T')[0];
    if (set.has(dStr)) {
      streak++;
      curr.setDate(curr.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Formats a number to USD currency ($X.XX).
 */
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
