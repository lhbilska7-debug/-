import React from "react";
import { AppMode } from "../types";
import { PenTool, Image, Mic, FileText, History, Sparkles, BookmarkCheck, Volume2, BookOpen, CheckSquare, DollarSign } from "lucide-react";

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
  onOpenAdManager,
  savedCount,
}) => {
  const modes: { id: AppMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "transform", label: "صياغة وتحسين النص", icon: <PenTool className="w-4 h-4" /> },
    { id: "lesson_summary", label: "تلخيص الدروس", icon: <BookOpen className="w-4 h-4" />, badge: "هام" },
    { id: "exam_solver", label: "حل الامتحانات", icon: <CheckSquare className="w-4 h-4" />, badge: "نموذجي" },
    { id: "tts", label: "تحويل النص لصوت", icon: <Volume2 className="w-4 h-4" /> },
    { id: "ocr", label: "خط يد وصور", icon: <Image className="w-4 h-4" /> },
    { id: "voice", label: "تفريغ الصوت", icon: <Mic className="w-4 h-4" /> },
    { id: "templates", label: "صانع المستندات", icon: <FileText className="w-4 h-4" /> },
  ];

  return (

    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
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
                  قَلَمْ <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">ذكاء النص</span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                تحويل الكتابة والصوت والخط اليدوي إلى نص احترافي راقٍ
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            {modes.map((mode) => {
              const active = currentMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => onSelectMode(mode.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-white text-indigo-600 shadow-xs border border-slate-200/60 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  {mode.icon}
                  <span>{mode.label}</span>
                  {mode.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                      {mode.badge}
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
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
              title="السجل والنصوص المحفوظة"
            >
              <History className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline font-bold">السجل والنصوص المحفوظة</span>
              {savedCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded-full min-w-[20px]">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {modes.map((mode) => {
            const active = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                  active
                    ? "bg-indigo-600 text-white font-semibold shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
