import React from "react";
import { AppMode } from "../types";
import { BookOpen, CheckSquare, Bot, Sparkles, ArrowLeft } from "lucide-react";

interface ServiceNavigationGridProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const ServiceNavigationGrid: React.FC<ServiceNavigationGridProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const pages = [
    {
      id: "lesson_summary" as AppMode,
      title: "1. تلخيص الدروس والمذكرات",
      shortDesc: "ملخصات شاملة، بطاقات حفظ ومراجعة سريعة، وأسئلة متوقعة",
      icon: <BookOpen className="w-5 h-5" />,
      tag: "المناهج والدروس",
    },
    {
      id: "exam_solver" as AppMode,
      title: "2. حل الامتحانات والمسائل",
      shortDesc: "حل نموذجي مفصل خطوة بخطوة مع القوانين وسؤال تطبيقي",
      icon: <CheckSquare className="w-5 h-5" />,
      tag: "الاختبارات والتمارين",
    },
    {
      id: "ask_ai" as AppMode,
      title: "3. اسأل الذكاء الاصطناعي",
      shortDesc: "معلم ومساعد دراسي ذكي وتفاعلي لأي سؤال أو استفسار مع دعم الصور",
      icon: <Bot className="w-5 h-5" />,
      tag: "المعلم التفاعلي",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-slate-100">
        <h2 className="text-sm sm:text-base font-bold font-['Cairo'] text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>اختر الصفحة أو الخدمة التي تريدها:</span>
        </h2>
        <span className="text-xs text-slate-500">
          انقر على أي صفحة للانتقال الفوري
        </span>
      </div>

      {/* 3 Prominent Page Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {pages.map((page) => {
          const isActive = currentMode === page.id;
          return (
            <button
              key={page.id}
              onClick={() => onSelectMode(page.id)}
              className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between gap-3 text-start relative group cursor-pointer ${
                isActive
                  ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200 scale-[1.01]"
                  : "bg-slate-50/80 border-slate-200 text-slate-800 hover:bg-white hover:border-indigo-200 hover:shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div
                  className={`p-2.5 rounded-xl ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white border border-slate-200 text-indigo-600 shadow-2xs group-hover:border-indigo-300"
                  }`}
                >
                  {page.icon}
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                    isActive
                      ? "bg-white/20 text-white border-white/20"
                      : "bg-indigo-50 text-indigo-700 border-indigo-100"
                  }`}
                >
                  {page.tag}
                </span>
              </div>

              <div>
                <h3
                  className={`text-sm sm:text-base font-bold font-['Cairo'] leading-snug ${
                    isActive ? "text-white" : "text-slate-900 group-hover:text-indigo-600"
                  }`}
                >
                  {page.title}
                </h3>
                <p
                  className={`text-xs mt-1.5 leading-relaxed ${
                    isActive ? "text-indigo-100" : "text-slate-500"
                  }`}
                >
                  {page.shortDesc}
                </p>
              </div>

              <div
                className={`w-full pt-2 border-t flex items-center justify-between text-xs font-bold ${
                  isActive
                    ? "border-white/20 text-white"
                    : "border-slate-100 text-slate-400 group-hover:text-indigo-600"
                }`}
              >
                <span>{isActive ? "الصفحة المفتوحة حالياً" : "انتقال إلى هذه الصفحة"}</span>
                <ArrowLeft className={`w-3.5 h-3.5 transition-transform ${isActive ? "" : "group-hover:-translate-x-1"}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
