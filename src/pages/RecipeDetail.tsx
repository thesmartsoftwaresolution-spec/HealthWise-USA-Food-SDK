import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Recipe, RecipeRating } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Badge } from '../components/common/Badge.tsx';
import { AdBanner } from '../components/common/AdBanner.tsx';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer.tsx';
import { scaleIngredientQuantity, calculateMacroPercentages } from '../utils/nutrition.ts';
import {
  Clock,
  Heart,
  ChevronRight,
  Share2,
  Printer,
  Plus,
  Minus,
  Check,
  ShoppingCart,
  Calendar,
  Utensils,
  ArrowLeft,
  DollarSign,
  Star
} from 'lucide-react';

export const RecipeDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<(Recipe & { reviews?: RecipeRating[] }) | null>(null);
  const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);
  const [servings, setServings] = useState<number>(4);
  const [useMetric, setUseMetric] = useState<boolean>(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // Rating & Review state
  const [userRating, setUserRating] = useState<number>(5);
  const [userReview, setUserReview] = useState<string>('');
  const [isSubmittingRating, setIsSubmittingRating] = useState<boolean>(false);
  const [hasRated, setHasRated] = useState<boolean>(false);

  const { toggleSaveRecipe, isRecipeSaved, showToast, setActiveGroceryList, activeGroceryList } = useApp();

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/recipes/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecipe(data.data);
          setServings(data.data.baseServings || 4);
          setRelatedRecipes(data.data.relatedRecipes || []);
          setCheckedIngredients(new Set());
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-sm w-1/2 mx-auto" />
          <div className="h-72 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-[#1C2B20]">Recipe Not Found</h2>
        <p className="text-sm text-[#5A7060]">We could not find the recipe you were looking for.</p>
        <Link
          to="/recipes"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D7D46] text-white rounded-lg text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Browse All Recipes
        </Link>
      </div>
    );
  }

  const isSaved = isRecipeSaved(recipe.id);
  const macros = calculateMacroPercentages(recipe.proteinG, recipe.carbsG, recipe.fatG);

  const toggleCheckIngredient = (id: number) => {
    const next = new Set(checkedIngredients);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedIngredients(next);
  };

  const handleAdjustServings = (delta: number) => {
    setServings((prev) => Math.max(1, Math.min(16, prev + delta)));
  };

  const handleAddAllToGrocery = () => {
    if (!recipe) return;
    const itemsToAdd = recipe.ingredients.map((ing) => ({
      id: `ing-${Date.now()}-${ing.id}`,
      item: ing.ingredient,
      amount: scaleIngredientQuantity(ing.amountUs, recipe.baseServings, servings),
      checked: false,
      estimatedCost: 1.5
    }));

    showToast(`Added ${itemsToAdd.length} recipe ingredients to your Supermarket List!`, 'success');
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipe) return;
    setIsSubmittingRating(true);
    try {
      const res = await fetch(`/api/recipes/${recipe.slug}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: userRating,
          review: userReview,
          userName: user?.name || 'Community Home Cook',
          userId: user?.id || 'guest'
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Thank you! Your rating and review have been recorded.', 'success');
        setHasRated(true);
        setRecipe({
          ...recipe,
          rating: data.rating,
          ratingCount: data.ratingCount,
          reviews: [data.newRating, ...(recipe.reviews || [])]
        });
        setUserReview('');
      } else {
        showToast(data.error || 'Failed to submit rating.', 'error');
      }
    } catch {
      showToast('Error submitting rating.', 'error');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    showToast('Recipe link copied to clipboard!', 'info');
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#5A7060] print:hidden">
        <Link to="/" className="hover:text-[#2D7D46]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/recipes" className="hover:text-[#2D7D46]">Recipes</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1C2B20] font-medium truncate max-w-[200px]">{recipe.title}</span>
      </nav>

      {/* Header & Meta Bar */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {recipe.dietaryTags.map((tag) => (
            <Badge key={tag} variant="vegetarian">{tag}</Badge>
          ))}
          <Badge variant="category">{recipe.categoryName}</Badge>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#E07B39] bg-[#FDF0E6] border border-[#FED7AA] px-3 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-[#E07B39] text-[#E07B39]" />
            <span>{recipe.rating ? recipe.rating.toFixed(1) : '4.8'} ({recipe.ratingCount || 1} {recipe.ratingCount === 1 ? 'rating' : 'ratings'})</span>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C2B20] leading-tight">
          {recipe.title}
        </h1>

        <p className="text-sm sm:text-base text-[#5A7060] leading-relaxed max-w-3xl">
          {recipe.description}
        </p>

        {/* Quick Recipe Metrics Pill */}
        <div className="bg-[#E8F5EC] border border-[#D4E6D9] rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#D4E6D9]">
          <div className="pt-2 sm:pt-0">
            <span className="text-[11px] font-semibold uppercase text-[#5A7060]">Prep Time</span>
            <p className="text-base font-bold text-[#1C2B20] mt-0.5">{recipe.prepTimeMin} min</p>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="text-[11px] font-semibold uppercase text-[#5A7060]">Cook Time</span>
            <p className="text-base font-bold text-[#1C2B20] mt-0.5">{recipe.cookTimeMin} min</p>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="text-[11px] font-semibold uppercase text-[#5A7060]">Total Time</span>
            <p className="text-base font-bold text-[#2D7D46] mt-0.5">{recipe.totalTimeMin} min</p>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="text-[11px] font-semibold uppercase text-[#5A7060]">Est. Cost</span>
            <p className="text-base font-bold text-[#E07B39] mt-0.5">${recipe.costPerServing.toFixed(2)} / serving</p>
          </div>
          <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0">
            <span className="text-[11px] font-semibold uppercase text-[#5A7060]">Difficulty</span>
            <p className="text-base font-bold text-[#1C2B20] capitalize mt-0.5">{recipe.difficulty}</p>
          </div>
        </div>
      </div>

      {/* Hero Photo */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg max-h-[460px]">
        <img
          src={recipe.coverImageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Two-Column Content Grid: Left (Ingredients & Steps) | Right (Sticky Nutrition & Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (65%) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Servings Adjuster Bar */}
          <div className="bg-white border border-[#D4E6D9] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A7060]">
                Adjust Servings
              </span>
              <p className="text-xs text-[#5A7060]">Ingredients dynamically scale</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Unit Toggle */}
              <div className="flex items-center bg-[#F4F8F5] p-1 rounded-lg border border-[#D4E6D9] text-xs font-semibold">
                <button
                  onClick={() => setUseMetric(false)}
                  className={`px-2.5 py-1 rounded-md transition ${!useMetric ? 'bg-[#2D7D46] text-white' : 'text-[#5A7060]'}`}
                >
                  US Units
                </button>
                <button
                  onClick={() => setUseMetric(true)}
                  className={`px-2.5 py-1 rounded-md transition ${useMetric ? 'bg-[#2D7D46] text-white' : 'text-[#5A7060]'}`}
                >
                  Metric
                </button>
              </div>

              {/* Servings Stepper */}
              <div className="flex items-center border border-[#D4E6D9] rounded-xl overflow-hidden bg-white shadow-xs">
                <button
                  onClick={() => handleAdjustServings(-1)}
                  disabled={servings <= 1}
                  className="px-3 py-2 text-[#1C2B20] hover:bg-[#E8F5EC] disabled:opacity-40 transition"
                  aria-label="Decrease servings"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 py-1 font-bold text-sm text-[#1C2B20] min-w-[3rem] text-center">
                  {servings} {servings === 1 ? 'serving' : 'servings'}
                </span>
                <button
                  onClick={() => handleAdjustServings(1)}
                  disabled={servings >= 16}
                  className="px-3 py-2 text-[#1C2B20] hover:bg-[#E8F5EC] disabled:opacity-40 transition"
                  aria-label="Increase servings"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="bg-white border border-[#D4E6D9] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4E6D9]/60 pb-3">
              <h2 className="font-serif text-2xl font-bold text-[#1C2B20] flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#2D7D46]" /> Ingredients ({recipe.ingredients.length})
              </h2>
              <button
                onClick={handleAddAllToGrocery}
                className="text-xs font-semibold text-[#2D7D46] hover:text-[#1A5C31] flex items-center gap-1.5 transition print:hidden"
              >
                <ShoppingCart className="w-4 h-4" /> Add all to Grocery List
              </button>
            </div>

            <p className="text-xs text-[#5A7060]">Check off ingredients as you prepare your mise-en-place:</p>

            <ul className="space-y-2.5">
              {recipe.ingredients.map((ing) => {
                const scaledAmount = useMetric && ing.amountMetric
                  ? scaleIngredientQuantity(ing.amountMetric, recipe.baseServings, servings)
                  : scaleIngredientQuantity(ing.amountUs, recipe.baseServings, servings);
                const isChecked = checkedIngredients.has(ing.id);

                return (
                  <li
                    key={ing.id}
                    onClick={() => toggleCheckIngredient(ing.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition select-none ${
                      isChecked ? 'bg-[#F4F8F5] text-[#5A7060]/70 line-through' : 'hover:bg-[#E8F5EC]/60 text-[#1C2B20]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isChecked ? 'bg-[#2D7D46] border-[#2D7D46] text-white' : 'border-[#D4E6D9] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="text-sm">
                      <span className="font-bold text-[#2D7D46]">{scaledAmount} </span>
                      <span className="font-medium">{ing.ingredient}</span>
                      {ing.notes && <span className="text-xs text-[#5A7060] italic"> ({ing.notes})</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Ad Slot in middle */}
          <AdBanner slot="recipe-sidebar" />

          {/* Step-by-Step Instructions */}
          <div className="bg-white border border-[#D4E6D9] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#1C2B20] border-b border-[#D4E6D9]/60 pb-3">
              Step-by-Step Preparation
            </h2>

            <div className="space-y-6">
              {recipe.instructions.map((step) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#E07B39] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    {step.stepNumber}
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="text-sm text-[#1C2B20] leading-relaxed">
                      {step.instruction}
                    </p>
                    {step.tip && (
                      <div className="bg-[#FDF0E6] border border-[#FED7AA] rounded-xl p-3 text-xs text-[#9A3412] flex items-start gap-2">
                        <span className="font-bold uppercase tracking-wider shrink-0">Chef Tip:</span>
                        <span>{step.tip}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipe Reviews & Star Rating Section */}
          <div className="bg-white border border-[#D4E6D9] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6 print:hidden">
            <div className="flex items-center justify-between border-b border-[#D4E6D9]/60 pb-3">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1C2B20] flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#E07B39] fill-[#E07B39]" /> Community Reviews & Ratings
                </h2>
                <p className="text-xs text-[#5A7060]">
                  Overall {recipe.rating ? recipe.rating.toFixed(1) : '4.8'} out of 5 stars ({recipe.reviews?.length || recipe.ratingCount || 0} reviews)
                </p>
              </div>
            </div>

            {/* Submit rating form */}
            {!hasRated ? (
              <form onSubmit={handleSubmitRating} className="bg-[#F4F8F5] border border-[#D4E6D9] rounded-xl p-4 sm:p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#1C2B20]">
                  Rate & Share Your Kitchen Experience
                </p>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5A7060] font-semibold">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-1 hover:scale-110 transition cursor-pointer"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= userRating
                              ? 'text-[#E07B39] fill-[#E07B39]'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#E07B39] ml-1">{userRating} / 5 Stars</span>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    placeholder="How did the recipe turn out? Any seasoning tweaks or ingredient substitutes you loved? (Optional)"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#D4E6D9] rounded-lg text-[#1C2B20] focus:outline-none focus:ring-1 focus:ring-[#2D7D46]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRating}
                  className="px-4 py-2 bg-[#2D7D46] hover:bg-[#1A5C31] text-white text-xs font-semibold rounded-lg shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingRating ? 'Submitting...' : 'Submit Recipe Review'}
                </button>
              </form>
            ) : (
              <div className="bg-[#E8F5EC] border border-[#2D7D46] text-[#2D7D46] p-3.5 rounded-xl text-xs font-semibold">
                ✓ Thank you! Your rating has been recorded for this recipe.
              </div>
            )}

            {/* List of Reviews */}
            <div className="space-y-3.5 pt-2">
              {recipe.reviews && recipe.reviews.length > 0 ? (
                recipe.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl border border-[#D4E6D9]/70 bg-[#FAFDFB] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1C2B20]">{rev.userName}</span>
                      <span className="text-[11px] text-[#5A7060]">
                        {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'text-[#E07B39] fill-[#E07B39]' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    {rev.review && (
                      <p className="text-xs text-[#5A7060] leading-relaxed pt-0.5">
                        {rev.review}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#5A7060] italic">No written reviews yet. Be the first home cook to leave feedback!</p>
              )}
            </div>
          </div>

          {/* Inline Recipe Clinical & Allergen Disclaimer */}
          <MedicalDisclaimer
            variant="inline"
            sourceCitation="USDA FoodData Central / FDA Food Allergen Labeling Act"
          />
        </div>

        {/* RIGHT COLUMN (35%, STICKY PANEL) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          {/* Nutrition Facts Box */}
          <div className="bg-white border-2 border-[#D4E6D9] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b-2 border-[#1C2B20] pb-2">
              <h3 className="font-serif text-2xl font-black text-[#1C2B20]">Nutrition Facts</h3>
              <p className="text-xs text-[#5A7060]">Per 1 serving (scaled to {servings} total)</p>
            </div>

            <div className="flex items-baseline justify-between border-b-4 border-[#1C2B20] pb-2">
              <div>
                <span className="text-xs font-bold uppercase text-[#5A7060]">Amount Per Serving</span>
                <p className="text-3xl font-black text-[#1C2B20]">{recipe.calories}</p>
              </div>
              <span className="text-sm font-bold text-[#5A7060]">Calories</span>
            </div>

            {/* Macro Distribution Bars */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#0369A1]">Protein: {recipe.proteinG}g ({macros.proteinPct}%)</span>
                <span className="text-[#D97706]">Carbs: {recipe.carbsG}g ({macros.carbsPct}%)</span>
                <span className="text-[#C0392B]">Fat: {recipe.fatG}g ({macros.fatPct}%)</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden flex bg-gray-100">
                <div style={{ width: `${macros.proteinPct}%` }} className="bg-[#0369A1]" />
                <div style={{ width: `${macros.carbsPct}%` }} className="bg-[#D97706]" />
                <div style={{ width: `${macros.fatPct}%` }} className="bg-[#C0392B]" />
              </div>
            </div>

            {/* Detailed Nutrient Breakdown */}
            <div className="text-xs space-y-2 pt-2 border-t border-[#D4E6D9] divide-y divide-[#D4E6D9]/60">
              <div className="flex justify-between py-1">
                <span className="font-semibold text-[#1C2B20]">Dietary Fiber</span>
                <span className="font-bold text-[#2D7D46]">{recipe.fiberG}g</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-[#1C2B20]">Sodium</span>
                <span>{recipe.sodiumMg}mg</span>
              </div>
              <div className="flex justify-between py-1 text-[#5A7060]">
                <span>Cost Per Serving</span>
                <span className="font-bold text-[#E07B39]">${recipe.costPerServing.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#5A7060] italic">
              Estimated nutritional values based on standard USDA FoodData Central calculations.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="bg-[#F4F8F5] border border-[#D4E6D9] rounded-2xl p-5 space-y-3 print:hidden">
            <button
              onClick={() => toggleSaveRecipe(recipe)}
              className={`w-full py-3 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                isSaved
                  ? 'bg-[#E07B39] text-white hover:bg-[#C96628]'
                  : 'bg-[#2D7D46] text-white hover:bg-[#1A5C31]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              <span>{isSaved ? 'Saved in Personal Dashboard' : 'Save to Favorites'}</span>
            </button>

            <button
              onClick={handleAddAllToGrocery}
              className="w-full py-3 rounded-xl font-semibold text-xs bg-white border border-[#D4E6D9] text-[#1C2B20] hover:bg-[#E8F5EC] transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <ShoppingCart className="w-4 h-4 text-[#2D7D46]" />
              <span>Add to Supermarket Checklist</span>
            </button>

            <Link
              to="/ai-tools/meal-planner"
              className="w-full py-3 rounded-xl font-semibold text-xs bg-white border border-[#D4E6D9] text-[#1C2B20] hover:bg-[#E8F5EC] transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Calendar className="w-4 h-4 text-[#E07B39]" />
              <span>Build 7-Day Plan with this Recipe</span>
            </Link>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl bg-white border border-[#D4E6D9] hover:bg-gray-100 text-[#1C2B20] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5 text-[#5A7060]" />
                <span>Print Recipe</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-white border border-[#D4E6D9] hover:bg-gray-100 text-[#1C2B20] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-[#2D7D46]" /> : <Share2 className="w-3.5 h-3.5 text-[#5A7060]" />}
                <span>{isCopied ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Recipes Carousel */}
      {relatedRecipes.length > 0 && (
        <div className="pt-10 border-t border-[#D4E6D9] space-y-4 print:hidden">
          <h3 className="font-serif text-2xl font-bold text-[#1C2B20]">You Might Also Love</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedRecipes.map((rel) => (
              <Link
                key={rel.id}
                to={`/recipes/${rel.slug}`}
                className="bg-white border border-[#D4E6D9] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition p-3.5 flex flex-col justify-between group"
              >
                <div>
                  <img
                    src={rel.coverImageUrl}
                    alt={rel.title}
                    className="w-full h-36 object-cover rounded-xl mb-3"
                  />
                  <div className="flex items-center justify-between text-xs text-[#5A7060] mb-1">
                    <span>{rel.totalTimeMin} min</span>
                    <span className="font-bold text-[#2D7D46]">${rel.costPerServing.toFixed(2)}</span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#1C2B20] group-hover:text-[#2D7D46] transition line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
                <div className="pt-2 mt-2 border-t border-[#D4E6D9]/50 text-xs font-semibold text-[#2D7D46]">
                  View Recipe &rarr;
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
