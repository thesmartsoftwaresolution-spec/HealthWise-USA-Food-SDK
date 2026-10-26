import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Button } from '../components/common/Button.tsx';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer.tsx';
import { calculateMacroPercentages } from '../utils/nutrition.ts';
import {
  Brain,
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  PieChart,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface IngredientRow {
  id: string;
  amount: string;
  item: string;
}

export const AINutritionAnalyzer: React.FC = () => {
  const [recipeName, setRecipeName] = useState('My Homemade Bowl');
  const [servings, setServings] = useState(2);
  const [rows, setRows] = useState<IngredientRow[]>([
    { id: '1', amount: '2 cups', item: 'cooked brown rice' },
    { id: '2', amount: '1 lb', item: 'skinless chicken breasts' },
    { id: '3', amount: '1 tbsp', item: 'extra virgin olive oil' },
    { id: '4', amount: '2 cups', item: 'steamed broccoli florets' }
  ]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useApp();

  const handleAddRow = () => {
    setRows([...rows, { id: `r-${Date.now()}`, amount: '', item: '' }]);
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((r) => r.id !== id));
  };

  const handleChangeRow = (id: string, field: 'amount' | 'item', val: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };

  const handleAnalyze = async () => {
    const validRows = rows.filter((r) => r.item.trim());
    if (validRows.length === 0) {
      showToast('Please add at least one ingredient with a name.', 'error');
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeName,
          servings,
          ingredients: validRows
        })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        showToast('Nutritional profile calculated successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to analyze nutrition.', 'error');
      }
    } catch {
      showToast('Network error while analyzing nutrition.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const macros = analysis?.perServing
    ? calculateMacroPercentages(
        analysis.perServing.proteinG || 0,
        analysis.perServing.carbsG || 0,
        analysis.perServing.fatG || 0
      )
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Banner */}
      <div className="bg-[#E0F2FE] border border-[#BAE6FD] rounded-3xl p-8 sm:p-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#0369A1] text-white uppercase tracking-wider">
          <Brain className="w-3.5 h-3.5" /> High Thinking Nutritional Calculator
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2B20]">
          AI Recipe Nutrition Analyzer
        </h1>
        <p className="text-sm text-[#5A7060] leading-relaxed max-w-2xl">
          Enter any recipe or meal ingredients to calculate estimated calories, macros (protein, carbs, fat), dietary fiber, and micronutrients per serving based on USDA databases.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2B20]">
              Recipe / Dish Name:
            </label>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D4E6D9] text-sm text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2B20]">
              Total Servings:
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value, 10) || 1)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D4E6D9] text-sm text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
            />
          </div>
        </div>

        {/* Ingredients Rows */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2B20]">
              Ingredients & Quantities:
            </label>
            <button
              onClick={handleAddRow}
              className="text-xs font-semibold text-[#2D7D46] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Ingredient
            </button>
          </div>

          <div className="space-y-2">
            {rows.map((row, idx) => (
              <div key={row.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={row.amount}
                  onChange={(e) => handleChangeRow(row.id, 'amount', e.target.value)}
                  placeholder="e.g. 1 cup, 4 oz"
                  className="w-32 px-3 py-2 rounded-xl border border-[#D4E6D9] text-xs text-[#1C2B20] bg-[#F4F8F5]"
                />
                <input
                  type="text"
                  value={row.item}
                  onChange={(e) => handleChangeRow(row.id, 'item', e.target.value)}
                  placeholder="e.g. skinless chicken breast, spinach, olive oil"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#D4E6D9] text-xs text-[#1C2B20]"
                />
                <button
                  onClick={() => handleRemoveRow(row.id)}
                  disabled={rows.length <= 1}
                  className="p-2 text-[#5A7060] hover:text-red-600 disabled:opacity-30 cursor-pointer"
                  aria-label="Remove ingredient"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleAnalyze}
            disabled={isLoading}
            icon={<Sparkles className="w-5 h-5" />}
          >
            {isLoading ? 'Calculating Nutritional Profile...' : 'Analyze Nutrition'}
          </Button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && analysis.perServing && macros && (
        <div className="bg-white border-2 border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#1C2B20] pb-3">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1C2B20]">{recipeName}</h2>
              <p className="text-xs text-[#5A7060]">Estimated per serving ({servings} total servings)</p>
            </div>
            <span className="text-3xl font-black text-[#1C2B20]">
              {analysis.perServing.calories} <span className="text-sm font-semibold text-[#5A7060]">Calories</span>
            </span>
          </div>

          {/* Macro Distribution Bars */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#0369A1]">Protein: {analysis.perServing.proteinG}g ({macros.proteinPct}%)</span>
              <span className="text-[#D97706]">Carbs: {analysis.perServing.carbsG}g ({macros.carbsPct}%)</span>
              <span className="text-[#C0392B]">Fat: {analysis.perServing.fatG}g ({macros.fatPct}%)</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex bg-gray-100">
              <div style={{ width: `${macros.proteinPct}%` }} className="bg-[#0369A1]" />
              <div style={{ width: `${macros.carbsPct}%` }} className="bg-[#D97706]" />
              <div style={{ width: `${macros.fatPct}%` }} className="bg-[#C0392B]" />
            </div>
          </div>

          {/* Micro nutrients grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-y border-[#D4E6D9]">
            <div className="p-3 bg-[#F4F8F5] rounded-xl text-center">
              <span className="text-[11px] text-[#5A7060] uppercase font-bold">Dietary Fiber</span>
              <p className="text-lg font-bold text-[#2D7D46]">{analysis.perServing.fiberG}g</p>
            </div>
            <div className="p-3 bg-[#F4F8F5] rounded-xl text-center">
              <span className="text-[11px] text-[#5A7060] uppercase font-bold">Sodium</span>
              <p className="text-lg font-bold text-[#1C2B20]">{analysis.perServing.sodiumMg}mg</p>
            </div>
            <div className="p-3 bg-[#F4F8F5] rounded-xl text-center">
              <span className="text-[11px] text-[#5A7060] uppercase font-bold">Net Carbs</span>
              <p className="text-lg font-bold text-[#1C2B20]">
                {Math.max(0, analysis.perServing.carbsG - analysis.perServing.fiberG)}g
              </p>
            </div>
            <div className="p-3 bg-[#F4F8F5] rounded-xl text-center">
              <span className="text-[11px] text-[#5A7060] uppercase font-bold">Protein Density</span>
              <p className="text-lg font-bold text-[#0369A1]">{macros.proteinPct}%</p>
            </div>
          </div>

          {analysis.summary && (
            <p className="text-sm text-[#1C2B20] leading-relaxed bg-[#E8F5EC] p-4 rounded-xl border border-[#D4E6D9]">
              {analysis.summary}
            </p>
          )}

          {/* Prominent FDA & USDA Nutritional Disclaimer */}
          <MedicalDisclaimer
            variant="inline"
            sourceCitation="USDA FoodData Central SR Legacy & Foundation Foods"
          />
        </div>
      )}
    </div>
  );
};
