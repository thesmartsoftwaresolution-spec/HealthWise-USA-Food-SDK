import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { AppProvider } from './context/AppContext.tsx';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { MobileBottomNav } from './components/layout/MobileBottomNav.tsx';
import { ToastContainer } from './components/common/Toast.tsx';

// Pages
import { Home } from './pages/Home.tsx';
import { HealthTips } from './pages/HealthTips.tsx';
import { ArticleDetail } from './pages/ArticleDetail.tsx';
import { Recipes } from './pages/Recipes.tsx';
import { RecipeDetail } from './pages/RecipeDetail.tsx';
import { AITools } from './pages/AITools.tsx';
import { AIChat } from './pages/AIChat.tsx';
import { AIMealPlanner } from './pages/AIMealPlanner.tsx';
import { AIRecipeGen } from './pages/AIRecipeGen.tsx';
import { AINutritionAnalyzer } from './pages/AINutritionAnalyzer.tsx';
import { AIGroceryList } from './pages/AIGroceryList.tsx';
import { Search } from './pages/Search.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';

// Static Pages
import { About } from './pages/static/About.tsx';
import { Contact } from './pages/static/Contact.tsx';
import { Disclaimer } from './pages/static/Disclaimer.tsx';
import { Privacy } from './pages/static/Privacy.tsx';
import { Terms } from './pages/static/Terms.tsx';
import { CookiePolicy } from './pages/static/CookiePolicy.tsx';
import { AffiliateDisclosure } from './pages/static/AffiliateDisclosure.tsx';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#F4F8F5] text-[#1C2B20] font-sans antialiased">
            <ToastContainer />
            <Header />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/health-tips" element={<HealthTips />} />
                <Route path="/health-tips/:slug" element={<ArticleDetail />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:slug" element={<RecipeDetail />} />

                {/* AI Tools */}
                <Route path="/ai-tools" element={<AITools />} />
                <Route path="/ai-tools/chat" element={<AIChat />} />
                <Route path="/ai-tools/meal-planner" element={<AIMealPlanner />} />
                <Route path="/ai-tools/recipe" element={<AIRecipeGen />} />
                <Route path="/ai-tools/nutrition" element={<AINutritionAnalyzer />} />
                <Route path="/ai-tools/grocery" element={<AIGroceryList />} />

                {/* User & Discovery */}
                <Route path="/search" element={<Search />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Static & Compliance */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />

                {/* Fallback */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            <Footer />
            <MobileBottomNav />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
