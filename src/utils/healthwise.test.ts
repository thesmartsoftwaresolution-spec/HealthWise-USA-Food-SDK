import test from 'node:test';
import assert from 'node:assert/strict';
import {
  scaleIngredientQuantity,
  formatScaledNumber,
  calculateMacroPercentages,
  computeMealPlanTotals,
  categorizeSupermarketItem,
  calculateHabitStreak,
  formatUsd
} from './nutrition.ts';

test('scaleIngredientQuantity scales whole numbers correctly', () => {
  assert.equal(scaleIngredientQuantity('2 cups', 2, 4), '4 cups');
  assert.equal(scaleIngredientQuantity('1 tbsp', 4, 2), '1/2 tbsp');
});

test('scaleIngredientQuantity scales fractions correctly', () => {
  assert.equal(scaleIngredientQuantity('1/2 cup', 2, 4), '1 cup');
  assert.equal(scaleIngredientQuantity('1 1/2 lbs', 2, 4), '3 lbs');
});

test('calculateMacroPercentages calculates correct percentages', () => {
  // 25g protein = 100 kcal, 50g carbs = 200 kcal, 11g fat = 99 kcal. Total ~399 kcal
  const res = calculateMacroPercentages(25, 50, 11);
  assert.ok(res.proteinPct >= 24 && res.proteinPct <= 26);
  assert.ok(res.carbsPct >= 49 && res.carbsPct <= 52);
  assert.ok(res.fatPct >= 23 && res.fatPct <= 26);
  assert.equal(res.totalKcal, 399);
});

test('computeMealPlanTotals calculates average calories and weekly budget', () => {
  const mockDays = [
    {
      day: 'Monday',
      meals: {
        breakfast: { name: 'Eggs', calories: 300 },
        lunch: { name: 'Salad', calories: 400 },
        dinner: { name: 'Salmon', calories: 600 },
        snack: { name: 'Yogurt', calories: 200 }
      },
      totalCalories: 1500
    },
    {
      day: 'Tuesday',
      meals: {
        breakfast: { name: 'Oats', calories: 350 },
        lunch: { name: 'Turkey Wrap', calories: 450 },
        dinner: { name: 'Chicken Bowl', calories: 550 },
        snack: { name: 'Almonds', calories: 150 }
      },
      totalCalories: 1500
    }
  ];

  const totals = computeMealPlanTotals(mockDays, 10);
  assert.equal(totals.avgDailyCalories, 1500);
  assert.equal(totals.totalWeeklyCost, 20);
});

test('categorizeSupermarketItem correctly categorizes items', () => {
  assert.equal(categorizeSupermarketItem('Baby Spinach (5 oz)'), 'produce');
  assert.equal(categorizeSupermarketItem('Greek Yogurt'), 'dairy');
  assert.equal(categorizeSupermarketItem('Boneless Chicken Breast'), 'proteins');
  assert.equal(categorizeSupermarketItem('Frozen Blueberries'), 'frozen');
  assert.equal(categorizeSupermarketItem('Rolled Oats'), 'pantry');
});

test('calculateHabitStreak tracks consecutive daily achievements', () => {
  const today = '2026-10-19';
  const logs = ['2026-10-19', '2026-10-18', '2026-10-17'];
  assert.equal(calculateHabitStreak(logs, today), 3);

  const brokenLogs = ['2026-10-19', '2026-10-17'];
  assert.equal(calculateHabitStreak(brokenLogs, today), 1);

  const yesterdayOnly = ['2026-10-18', '2026-10-17'];
  assert.equal(calculateHabitStreak(yesterdayOnly, today), 2);
});

test('formatUsd formats currency properly', () => {
  assert.equal(formatUsd(2.5), '$2.50');
  assert.equal(formatUsd(45), '$45.00');
});
