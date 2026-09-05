import React from "react";
import { AppMode } from "../types";
import { BookOpen, CheckSquare, PenTool, Volume2, Image, Mic, FileText, Sparkles, ChevronLeft } from "lucide-react";

interface ServiceNavigationGridProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const ServiceNavigationGrid: React.FC<ServiceNavigationGridProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const services = [
    {
      id: "lesson_summary" as AppMode,
      title: "تلخيص الدروس والمذكرات",
      desc: "تلخيص شامل، بطاقات حفظ سريعة، وأسئلة متوقعة",
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
      badge: "الرئيسية",
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
      accent: "from-indigo-500/10 to-indigo-600/5 hover:border-indigo-400",
    },
    {
      id: "exam_solver" as AppMode,
      title: "حل الامتحانات والأسئلة",
      desc: "إجابة نموذجية، شرح مفصل للقوانين، وسؤال تطبيقي",
      icon: <CheckSquare className="w-5 h-5 text-emerald-600" />,
      badge: "نموذجي",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      accent: "from-emerald-500/10 to-emerald-600/5 hover:border-emerald-400",
    },
    {
      id: "transform" as AppMode,
      title: "صياغة وتحسين النص",
      desc: "تصحيح إملائي، ضبط الأسلوب، وتصحيح التراكيب",
      icon: <PenTool className="w-5 h-5 text-sky-600" />,
      badge: "أساسي",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
      accent: "from-sky-500/10 to-sky-600/5 hover:border-sky-400",
    },
    {
      id: "tts" as AppMode,
      title: "تحويل النص إلى صوت",
      desc: "قراءة فصيحة ومسموعة للنصوص والملخصات",
      icon: <Volume2 className="w-5 h-5 text-amber-600" />,
      badge: "صوتي",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      accent: "from-amber-500/10 to-amber-600/5 hover:border-amber-400",
    },
    {
      id: "ocr" as AppMode,
      title: "قراءة خط اليد والصور",
      desc: "استخراج النص من دفاتر الطلاب، الكتب، والسبورة",
      icon: <Image className="w-5 h-5 text-purple-600" />,
      badge: "كاميرا",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      accent: "from-purple-500/10 to-purple-600/5 hover:border-purple-400",
    },
    {
      id: "voice" as AppMode,
      title: "تفريغ الصوت لنص",
      desc: "تسجيل صوتي أو رفع ملفات صوتية وتحويلها لنص",
      icon: <Mic className="w-5 h-5 text-rose-600" />,
      badge: "تسجيل",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
      accent: "from-rose-500/10 to-rose-600/5 hover:border-rose-400",
    },
    {
      id: "templates" as AppMode,
      title: "صانع المستندات والقوالب",
      desc: "إعداد تقارير، مذكرات، ورسائل رسمية منسقة",
      icon: <FileText className="w-5 h-5 text-teal-600" />,
      badge: "قوالب",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
      accent: "from-teal-500/10 to-teal-600/5 hover:border-teal-400",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-bold font-['Cairo'] text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>اختر الخيار أو الخدمة التي تريدها من الموقع:</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            اضغط على أي خدمة أدناه للتنقل المباشر والبدء في استخدامها بنقرة واحدة
          </p>
        </div>
      </div>

      {/* Grid of Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {services.map((item) => {
          const isActive = currentMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectMode(item.id)}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between space-y-2 relative group ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200"
                  : "bg-slate-50/80 border-slate-200 text-slate-800 hover:bg-white hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div
                  className={`p-2 rounded-lg ${
                    isActive ? "bg-white/20 text-white" : "bg-white border border-slate-200 shadow-xs"
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    isActive ? "bg-white/20 text-white border-white/20" : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              </div>

              <div>
                <h3 className={`text-xs font-bold font-['Cairo'] leading-tight ${isActive ? "text-white" : "text-slate-900"}`}>
                  {item.title}
                </h3>
                <p className={`text-[10px] mt-1 line-clamp-2 leading-relaxed ${isActive ? "text-indigo-100" : "text-slate-500"}`}>
                  {item.desc}
                </p>
              </div>

              {isActive && (
                <div className="w-full pt-1 border-t border-white/20 flex items-center justify-between text-[10px] font-bold text-indigo-100">
                  <span>الخدمة الحالية</span>
                  <ChevronLeft className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
