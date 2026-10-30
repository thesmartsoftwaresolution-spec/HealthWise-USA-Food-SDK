import React, { createContext, useContext, useState, useEffect } from 'react';
import { Article, Recipe, MealPlan, GroceryList, Habit, HabitLog } from '../types/index.ts';
import { useAuth } from './AuthContext.tsx';
import { supabase } from '../lib/supabase.ts';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  savedArticles: Article[];
  savedRecipes: Recipe[];
  isArticleSaved: (id: string) => boolean;
  isRecipeSaved: (id: string) => boolean;
  toggleSaveArticle: (article: Article) => Promise<void>;
  toggleSaveRecipe: (recipe: Recipe) => Promise<void>;
  activeMealPlan: MealPlan | null;
  setActiveMealPlan: (plan: MealPlan) => void;
  activeGroceryList: GroceryList | null;
  setActiveGroceryList: (list: GroceryList) => void;
  toggleGroceryItem: (category: 'produce' | 'dairy' | 'proteins' | 'pantry' | 'frozen', itemId: string) => void;
  habits: Habit[];
  habitLogs: HabitLog[];
  toggleHabit: (habitId: number, date?: string) => Promise<void>;
  isHabitCompletedOnDate: (habitId: number, date: string) => boolean;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  measurementUnit: 'us' | 'metric';
  toggleMeasurementUnit: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [activeMealPlan, setActiveMealPlanState] = useState<MealPlan | null>(null);
  const [activeGroceryList, setActiveGroceryListState] = useState<GroceryList | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [measurementUnit, setMeasurementUnit] = useState<'us' | 'metric'>('us');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleMeasurementUnit = () => {
    setMeasurementUnit((prev) => (prev === 'us' ? 'metric' : 'us'));
  };

  const setActiveMealPlan = (plan: MealPlan) => {
    setActiveMealPlanState(plan);
    if (!user || !supabase) return;
    void supabase.from('meal_plans').upsert({
      id: plan.id,
      user_id: user.id,
      title: plan.title,
      week_of: plan.weekOf || null,
      dietary_prefs: plan.dietaryPrefs || [],
      allergies: plan.allergies || [],
      calorie_goal: plan.calorieGoal ?? null,
      weekly_budget: plan.weeklyBudget ?? null,
      servings: plan.servings || 1,
      plan_data: plan.planData,
      status: plan.status || 'active',
    }, { onConflict: 'id' }).then(({ error }) => {
      if (error) console.error('Unable to save meal plan:', error.message);
    });
  };

  const setActiveGroceryList = (list: GroceryList) => {
    setActiveGroceryListState(list);
    if (!user || !supabase) return;
    void supabase.from('grocery_lists').upsert({
      id: list.id,
      user_id: user.id,
      meal_plan_id: list.mealPlanId || null,
      title: list.title,
      categories: list.categories,
      estimated_total: list.estimatedTotal || 0,
    }, { onConflict: 'id' }).then(({ error }) => {
      if (error) console.error('Unable to save grocery list:', error.message);
    });
  };

  // Load user data on change
  useEffect(() => {
    const userId = user?.id;
    if (!userId) {
      setSavedArticles([]);
      setSavedRecipes([]);
      setActiveMealPlanState(null);
      setActiveGroceryListState(null);
      setHabits([]);
      setHabitLogs([]);
      return;
    }

    // Fetch saved items
    fetch(`/api/users/me/saved?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSavedArticles(data.articles || []);
          setSavedRecipes(data.recipes || []);
        }
      })
      .catch(() => {});

    // Fetch meal plans
    fetch(`/api/users/me/plans?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.plans?.length > 0) {
          setActiveMealPlanState(data.plans[0]);
        }
      })
      .catch(() => {});

    // Fetch grocery lists
    fetch(`/api/users/me/grocery?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.lists?.length > 0) {
          setActiveGroceryListState(data.lists[0]);
        }
      })
      .catch(() => {});

    // Fetch habits & logs
    fetch(`/api/users/me/habits?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHabits(data.habits || []);
          setHabitLogs(data.logs || []);
        }
      })
      .catch(() => {});
  }, [user]);

  const isArticleSaved = (id: string) => savedArticles.some((a) => a.id === id);
  const isRecipeSaved = (id: string) => savedRecipes.some((r) => r.id === id);

  const toggleSaveArticle = async (article: Article) => {
    if (!user) {
      showToast('Please sign in to save articles to your account.', 'error');
      return;
    }
    const userId = user.id;
    const isSaved = isArticleSaved(article.id);

    if (isSaved) {
      setSavedArticles((prev) => prev.filter((a) => a.id !== article.id));
      await fetch(`/api/users/me/saved/article/${article.id}?userId=${userId}`, { method: 'DELETE' });
      showToast('Article removed from bookmarks', 'info');
    } else {
      setSavedArticles((prev) => [article, ...prev]);
      await fetch('/api/users/me/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemType: 'article', itemId: article.id })
      });
      showToast('Article saved to your dashboard!', 'success');
    }
  };

  const toggleSaveRecipe = async (recipe: Recipe) => {
    if (!user) {
      showToast('Please sign in to save recipes to your account.', 'error');
      return;
    }
    const userId = user.id;
    const isSaved = isRecipeSaved(recipe.id);

    if (isSaved) {
      setSavedRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
      await fetch(`/api/users/me/saved/recipe/${recipe.id}?userId=${userId}`, { method: 'DELETE' });
      showToast('Recipe removed from saved collection', 'info');
    } else {
      setSavedRecipes((prev) => [recipe, ...prev]);
      await fetch('/api/users/me/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemType: 'recipe', itemId: recipe.id })
      });
      showToast('Recipe saved to your dashboard!', 'success');
    }
  };

  const toggleGroceryItem = (category: 'produce' | 'dairy' | 'proteins' | 'pantry' | 'frozen', itemId: string) => {
    if (!activeGroceryList) return;
    const catItems = activeGroceryList.categories[category];
    const updatedCat = catItems.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    setActiveGroceryList({
      ...activeGroceryList,
      categories: {
        ...activeGroceryList.categories,
        [category]: updatedCat
      }
    });
  };

  const isHabitCompletedOnDate = (habitId: number, date: string) => {
    return habitLogs.some((l) => l.habitId === habitId && l.loggedDate === date && l.completed);
  };

  const toggleHabit = async (habitId: number, date: string = new Date().toISOString().split('T')[0]) => {
    if (!user) {
      showToast('Please sign in to track your habits.', 'error');
      return;
    }
    const userId = user.id;
    const isCompleted = isHabitCompletedOnDate(habitId, date);

    if (isCompleted) {
      setHabitLogs((prev) => prev.filter((l) => !(l.habitId === habitId && l.loggedDate === date)));
    } else {
      setHabitLogs((prev) => [...prev, { id: Date.now(), habitId, userId, loggedDate: date, completed: true }]);
      showToast('Habit checked off for today! Keep up the momentum!', 'success');
    }

    try {
      await fetch(`/api/users/me/habits/${habitId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, date })
      });
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        savedArticles,
        savedRecipes,
        isArticleSaved,
        isRecipeSaved,
        toggleSaveArticle,
        toggleSaveRecipe,
        activeMealPlan,
        setActiveMealPlan,
        activeGroceryList,
        setActiveGroceryList,
        toggleGroceryItem,
        habits,
        habitLogs,
        toggleHabit,
        isHabitCompletedOnDate,
        toasts,
        showToast,
        removeToast,
        measurementUnit,
        toggleMeasurementUnit
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
