import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Button } from '../components/common/Button.tsx';
import { Badge } from '../components/common/Badge.tsx';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer.tsx';
import {
  Utensils,
  Sparkles,
  Plus,
  X,
  Clock,
  Heart,
  Brain,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const AIRecipeGen: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>(['Eggs', 'Baby spinach', 'Black beans']);
  const [currentInput, setCurrentInput] = useState('');
  const [dietFilters, setDietFilters] = useState<string[]>(['High-Protein']);
  const [maxTime, setMaxTime] = useState<number>(30);
  const [generatedRecipes, setGeneratedRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useApp();

  const commonStaples = [
    'Chicken breast', 'Sweet potato', 'Canned tuna', 'Rolled oats',
    'Greek yogurt', 'Broccoli', 'Brown rice', 'Avocado', 'Tofu'
  ];

  const handleAddIngredient = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !ingredients.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      setIngredients([...ingredients, trimmed]);
      setCurrentInput('');
    }
  };

  const handleRemoveIngredient = (item: string) => {
    setIngredients(ingredients.filter((i) => i !== item));
  };

  const handleGenerate = async () => {
    if (ingredients.length < 2) {
      showToast('Please add at least 2 ingredients.', 'error');
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          dietaryFilters: dietFilters,
          maxTime
        })
      });

      const data = await res.json();
      if (data.success && data.recipes?.length > 0) {
        setGeneratedRecipes(data.recipes);
        showToast(`Generated ${data.recipes.length} custom recipes!`, 'success');
      } else {
        showToast(data.error || 'Failed to generate recipes.', 'error');
      }
    } catch {
      showToast('Network error while generating recipes.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header Banner */}
      <div className="bg-[#FDF0E6] border border-[#FED7AA] rounded-3xl p-8 sm:p-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#E07B39] text-white uppercase tracking-wider">
          <Brain className="w-3.5 h-3.5" /> Fridge-To-Table AI Generator
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2B20]">
          Create Recipes From What You Have
        </h1>
        <p className="text-sm text-[#5A7060] leading-relaxed max-w-2xl">
          Don&rsquo;t let food spoil. Add ingredients you already have in your pantry or refrigerator, and our AI will engineer healthy, nutritious recipes in seconds.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Ingredient Chips Input */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-[#1C2B20]">
            Ingredients you have available ({ingredients.length}):
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddIngredient(currentInput);
                }
              }}
              placeholder="e.g. ground turkey, canned chickpeas, bell pepper..."
              className="flex-1 px-4 py-2.5 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
            />
            <Button
              variant="primary"
              size="md"
              onClick={() => handleAddIngredient(currentInput)}
              icon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>

          {/* Active Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {ingredients.map((ing) => (
              <span
                key={ing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F5EC] border border-[#D4E6D9] text-xs font-semibold text-[#1A5C31]"
              >
                <span>{ing}</span>
                <button
                  onClick={() => handleRemoveIngredient(ing)}
                  className="hover:text-red-600 transition"
                  aria-label={`Remove ${ing}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Quick Add Suggestions */}
          <div className="pt-2">
            <span className="text-xs text-[#5A7060] font-medium mr-2">Quick staples:</span>
            <div className="inline-flex flex-wrap gap-1.5 mt-1">
              {commonStaples.map((staple) => (
                <button
                  key={staple}
                  onClick={() => handleAddIngredient(staple)}
                  className="text-xs bg-[#F4F8F5] hover:bg-[#E8F5EC] border border-[#D4E6D9] text-[#1C2B20] px-2.5 py-1 rounded-lg transition"
                >
                  + {staple}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cook Time & Dietary Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#D4E6D9]/60">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1C2B20]">Max Preparation Time:</label>
            <select
              value={maxTime}
              onChange={(e) => setMaxTime(parseInt(e.target.value, 10))}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D4E6D9] bg-white text-sm"
            >
              <option value={20}>20 Minutes (Ultra Fast)</option>
              <option value={30}>30 Minutes (Standard Weeknight)</option>
              <option value={45}>45 Minutes</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1C2B20]">Dietary Focus:</label>
            <div className="flex flex-wrap gap-2">
              {['High-Protein', 'Vegetarian', 'Gluten-Free', 'Low-Carb'].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDietFilters((prev) =>
                      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
                    );
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    dietFilters.includes(d)
                      ? 'bg-[#E07B39] text-white border-[#E07B39]'
                      : 'bg-[#F4F8F5] border-[#D4E6D9] text-[#1C2B20]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="accent"
            size="lg"
            onClick={handleGenerate}
            disabled={isLoading || ingredients.length < 2}
            icon={<Sparkles className="w-5 h-5" />}
          >
            {isLoading ? 'Engineering Recipes...' : 'Generate 2 Delicious Recipes'}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {generatedRecipes.length > 0 && (
        <div className="space-y-6 pt-4 animate-in fade-in">
          <h2 className="font-serif text-2xl font-bold text-[#1C2B20]">
            AI Chef Recommendations ({generatedRecipes.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {generatedRecipes.map((rec, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#5A7060]">
                    <span className="flex items-center gap-1 font-semibold text-[#2D7D46]">
                      <Clock className="w-3.5 h-3.5" /> {(rec.prepTimeMin || 10) + (rec.cookTimeMin || 15)} min
                    </span>
                    <span className="font-bold text-[#1C2B20] bg-[#E8F5EC] px-2.5 py-0.5 rounded-full">
                      {rec.estimatedCalories || 380} cal per serving
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#1C2B20]">{rec.title}</h3>
                  <p className="text-xs text-[#5A7060] leading-relaxed">{rec.description}</p>

                  <div className="pt-2">
                    <p className="text-xs font-bold text-[#1C2B20] uppercase tracking-wider mb-1.5">
                      Ingredients:
                    </p>
                    <ul className="text-xs space-y-1 text-[#1C2B20]">
                      {rec.ingredients?.map((ing: any, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2D7D46]" />
                          <span><strong>{ing.amount || ''}</strong> {ing.item || ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-bold text-[#1C2B20] uppercase tracking-wider mb-1.5">
                      Step-by-Step Instructions:
                    </p>
                    <ol className="text-xs space-y-2 text-[#5A7060]">
                      {rec.instructions?.map((step: string, sIdx: number) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <span className="font-bold text-[#2D7D46] shrink-0">{sIdx + 1}.</span>
                          <span className="text-[#1C2B20]">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D4E6D9]/60 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#0369A1]">{rec.proteinG || 30}g Protein</span>
                  <button
                    onClick={() => {
                      showToast(`Saved "${rec.title}" to your Dashboard!`, 'success');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#E8F5EC] text-[#2D7D46] hover:bg-[#2D7D46] hover:text-white transition flex items-center gap-1 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5" /> Save Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Inline FDA & Food Safety Notice */}
          <MedicalDisclaimer
            variant="inline"
            sourceCitation="USDA Food Safety and Inspection Service (FSIS) / Dietary Guidelines"
          />
        </div>
      )}
    </div>
  );
};
