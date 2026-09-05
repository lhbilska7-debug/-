import React from "react";
import { AppMode } from "../types";
import { History, Sparkles, BookOpen, CheckSquare, Bot } from "lucide-react";

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenHistory: () => void;
  onOpenAdManager?: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  onOpenHistory,
  savedCount,
}) => {
  const pages: { id: AppMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "lesson_summary", label: "تلخيص الدروس", icon: <BookOpen className="w-4 h-4" />, badge: "شامل" },
    { id: "exam_solver", label: "حل الامتحانات", icon: <CheckSquare className="w-4 h-4" />, badge: "نموذجي" },
    { id: "ask_ai", label: "اسأل الذكاء الاصطناعي", icon: <Bot className="w-4 h-4" />, badge: "تفاعلي" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-['Cairo'] tracking-tight text-slate-900">
                  المساعد التعليمي الذكي
                </h1>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                تلخيص المناهج، حل الامتحانات، والمعلم التفاعلي الذكي للطلاب
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
            {pages.map((page) => {
              const active = currentMode === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => onSelectMode(page.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    active
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "text-slate-600 hover:text-indigo-900 hover:bg-white"
                  }`}
                >
                  {page.icon}
                  <span>{page.label}</span>
                  {page.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      {page.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: History & Saved Texts */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHistory}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
              title="السجل والنصوص المحفوظة"
            >
              <History className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">السجل والمحفوظات</span>
              {savedCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded-full min-w-[20px]">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center justify-around gap-2 py-2 border-t border-slate-100">
          {pages.map((page) => {
            const active = currentMode === page.id;
            return (
              <button
                key={page.id}
                onClick={() => onSelectMode(page.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {page.icon}
                <span className="truncate">{page.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

