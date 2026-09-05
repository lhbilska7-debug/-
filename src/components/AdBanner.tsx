import React, { useState } from "react";
import { ExternalLink, Sparkles, AlertCircle, Info, Settings, Eye, Check } from "lucide-react";

interface AdBannerProps {
  type: "leaderboard" | "sidebar" | "native" | "footer_sticky";
  customClass?: string;
  showAdControls?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, customClass = "", showAdControls = false }) => {
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) return null;

  // Leaderboard Top Banner (728x90 style)
  if (type === "leaderboard") {
    return (
      <div className={`w-full bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/10 border border-amber-300/60 rounded-2xl p-3 sm:p-4 text-slate-800 relative shadow-xs overflow-hidden ${customClass}`}>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
          <span className="flex items-center gap-1 text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
            <Info className="w-3 h-3" />
            إعلان راعٍ مميز
          </span>
          <span className="text-slate-400">Ad Space #728x90</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
              📚
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-['Cairo'] flex items-center gap-1.5">
                <span>أكاديمية المتفوقين — دورات الاستعداد للامتحانات والبكالوريا 2026</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">خصم 50%</span>
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                احصل على ملخصات حصرية وشروحات مرئية مباشرة مع أفضل الأساتذة لجميع المواد التعليمية.
              </p>
            </div>
          </div>

          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-700 hover:to-indigo-700 text-white text-xs font-bold shrink-0 transition-all shadow-md flex items-center gap-1.5 active:scale-95"
          >
            <span>زيارة الموقع ورؤية العرض</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Sidebar Ad Card (300x250 Medium Rectangle)
  if (type === "sidebar") {
    return (
      <div className={`bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-2xl border border-indigo-900/50 p-5 space-y-4 shadow-lg relative overflow-hidden ${customClass}`}>
        <div className="flex items-center justify-between text-[10px] text-indigo-300 font-bold border-b border-white/10 pb-2">
          <span className="bg-white/10 px-2 py-0.5 rounded text-amber-300">مساحة إعلانية مستهدفة</span>
          <span>Ad 300x250</span>
        </div>

        <div className="space-y-2 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-2xl shadow-xl animate-bounce">
            ⚡
          </div>
          <h4 className="text-sm font-bold font-['Cairo'] text-white">
            تطبيق الهاتف المحمول لمحول النصوص
          </h4>
          <p className="text-xs text-indigo-200 leading-relaxed">
            حمل النسخة الاحترافية على Android & iOS لتسجيل وتلخيص المحاضرات بدون إنترنت.
          </p>
        </div>

        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs font-['Cairo'] flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          <span>تنزيل التطبيق مجاناً</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  // Native In-Content Sponsored Ad
  if (type === "native") {
    return (
      <div className={`p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3 ${customClass}`}>
        <div className="flex items-center justify-between text-[10px] text-indigo-700 font-bold">
          <span className="bg-indigo-100 px-2 py-0.5 rounded flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            محتوى برعاية إعلانية
          </span>
          <span className="text-slate-400">Native Ad Unit</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1 text-right">
            <h5 className="text-xs font-bold text-slate-900">
              خدمة التدقيق اللغوي الاحترافي للمقالات والأطاريح الجامعية
            </h5>
            <p className="text-xs text-slate-600">
              فريق متكامل من المتخصصين لتدقيق الرسائل العلمية وضمان خلوها من الأخطاء الإملائية مع الترقيم المعياري.
            </p>
          </div>
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
          >
            اطلب الخدمة الآن
          </button>
        </div>
      </div>
    );
  }

  // Footer Sticky Ad (320x50 Mobile / 728x90 Desktop Floating Banner)
  if (type === "footer_sticky") {
    return (
      <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-2.5 px-4 shadow-2xl animate-slideUp">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-bold">
              إعلان
            </span>
            <p className="text-xs font-semibold text-slate-200 line-clamp-1">
              خصم خاص للطلاب والمدرسين: استمتع باشتراك سنوي مفتوح للخدمات الذكية بسعر رمزي!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition-colors"
            >
              استفد من العرض
            </button>
            <button
              type="button"
              onClick={() => setIsClosed(true)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              title="إغلاق الإعلان"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
