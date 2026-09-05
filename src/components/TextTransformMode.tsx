import React, { useState } from "react";
import { TransformConfig, ToneType, ActionType, TashkeelType, PresetExample } from "../types";
import { PRESET_EXAMPLES } from "../data/presets";
import {
  Wand2,
  SlidersHorizontal,
  Eraser,
  Sparkles,
  BookOpen,
  Send,
  MessageSquare,
  CheckCircle2,
  FileCheck,
  Zap,
  Globe2,
  ChevronDown,
  FileSpreadsheet,
} from "lucide-react";

interface TextTransformModeProps {
  onTransform: (text: string, config: TransformConfig) => void;
  isLoading: boolean;
}

export const TextTransformMode: React.FC<TextTransformModeProps> = ({
  onTransform,
  isLoading,
}) => {
  const [inputText, setInputText] = useState("");
  const [config, setConfig] = useState<TransformConfig>({
    tone: "formal",
    action: "rewrite",
    tashkeel: "none",
    convertToMsa: true,
    customInstructions: "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const tones: { id: ToneType; label: string; desc: string; icon: string }[] = [
    { id: "formal", label: "رسمي وإداري", desc: "مناسب للمخاطبات والشركات", icon: "🏢" },
    { id: "academic", label: "أكاديمي وعلمي", desc: "مصطلحات دقيقة وموثقة", icon: "🎓" },
    { id: "persuasive", label: "إقناعي وتسويقي", desc: "مؤثر وجاذب للانتباه", icon: "🚀" },
    { id: "creative", label: "إبداعي وأدبي", desc: "بلاغة وصور بيانية راقية", icon: "✍️" },
    { id: "concise", label: "موجز ومباشر", desc: "تركيز بدون حشو أو إسهاب", icon: "🎯" },
    { id: "diplomatic", label: "دبلوماسي وودود", desc: "لطيف ومراعٍ للمشاعر", icon: "🤝" },
  ];

  const actions: { id: ActionType; label: string; desc: string }[] = [
    { id: "rewrite", label: "إعادة صياغة شاملة", desc: "تحسين الأسلوب ورفع البلاغة" },
    { id: "proofread", label: "تصحيح لغوي وإملاء", desc: "إصلاح الأخطاء مع ثبات المعنى" },
    { id: "email", label: "بريد إلكتروني رسمي", desc: "تحويل النص لإيميل مهيكل" },
    { id: "report", label: "تقرير تنفيذي", desc: "تنظيم كتقرير برؤوس أقلام" },
    { id: "summarize", label: "تلخيص مكثف", desc: "استخلاص النقاط الجوهرية" },
    { id: "expand", label: "توسع وتفصيل", desc: "إثراء النص والتوسع بالأفكار" },
  ];

  const tashkeelOptions: { id: TashkeelType; label: string }[] = [
    { id: "none", label: "بدون تشكيل" },
    { id: "smart", label: "تشكيل ذكي (أواخر الكلمات والمبهم)" },
    { id: "full", label: "تشكيل كامل لجميع الحروف" },
  ];

  const handleApplyPreset = (preset: PresetExample) => {
    setInputText(preset.originalText);
    setSelectedPresetId(preset.id);
    if (preset.suggestedConfig) {
      setConfig((prev) => ({ ...prev, ...preset.suggestedConfig }));
    }
  };

  const handleClear = () => {
    setInputText("");
    setSelectedPresetId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onTransform(inputText, config);
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Presets Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-300" />
              <h2 className="text-lg font-bold font-['Cairo']">أمثلة سريعة للتجربة الفورية:</h2>
            </div>
            <span className="text-xs text-indigo-200">انقر على أي نموذج لتجربته بنقرة واحدة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {PRESET_EXAMPLES.slice(0, 3).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`text-right p-3 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                  selectedPresetId === preset.id
                    ? "bg-indigo-600/90 border-indigo-300 text-white shadow-md ring-2 ring-indigo-400"
                    : "bg-white/10 border-white/10 hover:bg-white/20 text-indigo-50"
                }`}
              >
                <div className="font-semibold text-sm text-indigo-100 mb-1">{preset.title}</div>
                <div className="text-indigo-200/80 line-clamp-2 text-[11px] mb-2">{preset.description}</div>
                <div className="flex items-center gap-1 text-[10px] text-indigo-300 font-medium pt-1 border-t border-white/10">
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>تطبيق هذا المثال</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Text Input Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="inputText" className="flex items-center gap-2 text-base font-bold text-slate-800 font-['Cairo']">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>أدخل أو ألصق النص المطلوب تحويله:</span>
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{wordCount} كلمة</span>
              <span>•</span>
              <span>{charCount} حرف</span>
              {inputText && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium transition-colors border-r border-slate-200 pr-3 mr-1"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>مسح النص</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="inputText"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setSelectedPresetId(null);
              }}
              placeholder="اكتب هنا نصك الأصلي، مسودتك، أو أفكارك المشتتة... وسنقوم بإعادة صياغتها وتحويلها إلى نص احترافي راقٍ..."
              rows={6}
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-800 placeholder-slate-400 text-base leading-relaxed resize-y font-normal transition-all"
            />
          </div>

          {/* Action Type Selector */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-700">نوع التحويل المطلوب:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {actions.map((act) => {
                const active = config.action === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, action: act.id }))}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      active
                        ? "bg-indigo-50 border-indigo-500 text-indigo-950 font-semibold shadow-xs ring-1 ring-indigo-500"
                        : "bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-xs font-bold">{act.label}</span>
                    <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">{act.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tone and Style Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-['Cairo']">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>اختر النبرة والأسلوب الأنسب للجمهور:</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {tones.map((t) => {
              const active = config.tone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, tone: t.id }))}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-600 font-semibold shadow-md"
                      : "bg-white border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{t.icon}</span>
                    {active && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-xs font-bold">{t.label}</span>
                  <span className={`text-[10px] mt-0.5 ${active ? "text-indigo-100" : "text-slate-500"}`}>
                    {t.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tashkeel & Dialect Toggle Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            {/* Tashkeel Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">ضبط التشكيل (الحركات):</label>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {tashkeelOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, tashkeel: opt.id }))}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all text-center ${
                      config.tashkeel === opt.id
                        ? "bg-white text-indigo-700 font-bold shadow-xs border border-slate-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MSA Conversion Toggle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">الفصاحة واللغة:</label>
              <div
                onClick={() => setConfig((prev) => ({ ...prev, convertToMsa: !prev.convertToMsa }))}
                className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl cursor-pointer hover:bg-slate-200/70 transition-colors border border-slate-200/60"
              >
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-800">تحويل العامية إلى فصحى مشرقة</span>
                </div>
                <div
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                    config.convertToMsa ? "bg-indigo-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      config.convertToMsa ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Options Accordion */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
              <span>إضافة تعليمات خاصة ومحددة (اختياري)</span>
            </button>

            {showAdvanced && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label htmlFor="customInst" className="block text-xs font-semibold text-slate-700">
                  تعليمات إضافية للصائغ الآلي:
                </label>
                <input
                  id="customInst"
                  type="text"
                  value={config.customInstructions}
                  onChange={(e) => setConfig((prev) => ({ ...prev, customInstructions: e.target.value }))}
                  placeholder="مثال: اجعل النص ينتهي بجدول ملخص، أو أضف استشهاد بأرقام، أو اجعل البداية بسلام رسمي..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold font-['Cairo'] text-base shadow-lg transition-all flex items-center justify-center gap-3 ${
              isLoading || !inputText.trim()
                ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.99]"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري صياغة وتحويل النص بأعلى جودة...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 text-indigo-200" />
                <span>تحويل النص إلى أسلوب احترافي</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
