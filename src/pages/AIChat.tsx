import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Article } from '../types/index.ts';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer.tsx';
import {
  Sparkles,
  Send,
  Brain,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  User as UserIcon,
  Bot,
  RefreshCw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  relatedArticles?: Article[];
  timestamp: string;
}

export const AIChat: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 Hi! I'm your HealthWise USA Wellness Assistant.

I can answer complex questions about whole-food nutrition, metabolic health, dietary fiber, vitamin timing, and budget-friendly meal preparation.

⚠️ *Please note: I am an AI wellness tool, not a doctor. For clinical conditions or medications, always consult a licensed medical provider.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState<number>(10);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'How does potassium lower blood pressure in the vascular smooth muscle?',
    'What foods are high in protein on a budget of $50 per week?',
    'Why does fiber in the gut reduce cortisol and stress?',
    'What should I eat 1 hour before a morning workout?'
  ];

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageText: string = input) => {
    const text = messageText.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          userId: user?.id
        })
      });

      const data = await res.json();
      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          relatedArticles: data.relatedArticles || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (data.remainingRequests !== undefined) {
          setRemainingRequests(data.remainingRequests);
        }
      } else {
        showToast(data.error || 'Unable to process query', 'error');
      }
    } catch {
      showToast('Network error while connecting to AI assistant.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4 text-left">
      {/* Top AI Bar with High Thinking indicator */}
      <div className="bg-white border border-[#D4E6D9] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D7D46] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-[#1C2B20]">AI Wellness Assistant</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5EC] text-[#2D7D46] border border-[#D4E6D9]">
                <Brain className="w-3 h-3 text-[#2D7D46]" /> High Thinking Active
              </span>
            </div>
            <p className="text-xs text-[#5A7060]">Gemini 4 Argon • Deep nutritional reasoning</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#5A7060]">
          <span className="bg-[#F4F8F5] px-3 py-1.5 rounded-lg border border-[#D4E6D9] font-medium">
            Requests: <strong className="text-[#2D7D46]">{remainingRequests}</strong> remaining
          </span>
          <button
            onClick={() => {
              setMessages([messages[0]]);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition text-[#5A7060]"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div
        ref={chatContainerRef}
        className="bg-[#F4F8F5] border border-[#D4E6D9] rounded-3xl p-4 sm:p-6 min-h-[420px] max-h-[500px] overflow-y-auto space-y-4 shadow-inner"
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}>
              <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[78%]">
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#2D7D46] text-white flex items-center justify-center shrink-0 mt-1 text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    isUser
                      ? 'bg-[#2D7D46] text-white rounded-br-xs'
                      : 'bg-white border border-[#D4E6D9] text-[#1C2B20] rounded-bl-xs'
                  }`}
                >
                  {msg.content}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#E07B39] text-white flex items-center justify-center shrink-0 mt-1 text-xs font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>

              {/* Related on-site articles attached to assistant answer */}
              {!isUser && msg.relatedArticles && msg.relatedArticles.length > 0 && (
                <div className="ml-10 bg-white border border-[#D4E6D9] rounded-xl p-3 max-w-[85%] sm:max-w-[78%] space-y-2">
                  <span className="text-[11px] font-bold text-[#2D7D46] uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> Related HealthWise Guides
                  </span>
                  <div className="space-y-1.5">
                    {msg.relatedArticles.map((art) => (
                      <a
                        key={art.id}
                        href={`/health-tips/${art.slug}`}
                        className="text-xs font-semibold text-[#1C2B20] hover:text-[#2D7D46] flex items-center justify-between p-1.5 rounded-lg hover:bg-[#E8F5EC] transition"
                      >
                        <span className="truncate">{art.title}</span>
                        <ArrowRight className="w-3 h-3 text-[#2D7D46] shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5 max-w-[75%]">
            <div className="w-7 h-7 rounded-full bg-[#2D7D46] text-white flex items-center justify-center shrink-0 text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-[#D4E6D9] p-4 rounded-2xl rounded-bl-xs text-xs text-[#5A7060] flex items-center gap-2 shadow-xs">
              <Brain className="w-4 h-4 text-[#2D7D46] animate-pulse" />
              <span>Thinking & reasoning over nutritional evidence...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Starter Questions */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-[#5A7060]">Suggested questions:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-xs bg-white border border-[#D4E6D9] hover:border-[#2D7D46] hover:bg-[#E8F5EC] text-[#1C2B20] px-3 py-1.5 rounded-xl transition text-left cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a health, food, or nutrition question..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] placeholder:text-[#5A7060]/70 focus:outline-none focus:border-[#2D7D46] focus:ring-2 focus:ring-[#2D7D46]/20 transition shadow-xs"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-3 bg-[#2D7D46] hover:bg-[#1A5C31] text-white font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          aria-label="Send question"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Inline Medical Safety & FDA Disclaimer */}
      <MedicalDisclaimer
        variant="inline"
        sourceCitation="USDA Dietary Guidelines for Americans / Peer-Reviewed Clinical Nutrition"
      />
    </div>
  );
};
