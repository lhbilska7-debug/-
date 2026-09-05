import React, { useState, useRef } from "react";
import { BookOpen, Sparkles, Upload, FileText, CheckCircle2, Eraser, Layers, HelpCircle, FileCheck, Image as ImageIcon } from "lucide-react";
import { TransformResult } from "../types";

interface LessonSummarizerModeProps {
  onSummarizeComplete: (result: TransformResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
}

export const LessonSummarizerMode: React.FC<LessonSummarizerModeProps> = ({
  onSummarizeComplete,
  isLoading,
  setIsLoading,
  setError,
}) => {
  const [text, setText] = useState<string>("");
  const [subject, setSubject] = useState<string>("عام");
  const [level, setLevel] = useState<string>("ثانوي/بكالوريا");
  const [summaryStyle, setSummaryStyle] = useState<string>("comprehensive");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleLessons = [
    {
      title: "درس الاجتماعيات والظواهر الاقتصادية",
      subject: "اجتماعيات/تاريخ",
      text: "تُعتبر الثورة الصناعية في أوروبا نقطة تحول جذرية في تاريخ الاقتصاد العالمي، حيث انتقلت المجتمعات من الاعتماد على الزراعة والعمل اليدوي إلى الصناعة والمصانع الآلية. أدى ذلك إلى نمو المدن بشكل غير مسبوق وزيادة الإنتاجية الاقتصادية، ولكنه خلق أيضاً تحديات اجتماعية مثل ظروف العمل الصعبة وحاجة العمال إلى التنظيم والتأمين الاجتماعي.",
    },
    {
      title: "درس الفلسفة: الإشكالية الأخلاقية",
      subject: "فلسفة",
      text: "تتراوح النظريات الأخلاقية بين المذهب النفعي الذي يربط قيمة الفعل بنتائجه ومقدار السعادة المستحصلة، والمذهب الواجبي (الكانطي) الذي يعتبر أن الفعل الأخلاقي يستمد قيمته من الإرادة الخيرة والواجب النقي بغض النظر عن النتائج والمصالح الشخصية.",
    },
    {
      title: "درس العلوم الطبيعية: الخلية والتركيب الضوئي",
      subject: "علوم طبيعية",
      text: "التركيب الضوئي هو عملية حيوية تحول فيها النباتات الخضراء الطاقة الضوئية من الشمس إلى طاقة كيميائية مخزنة في جزيئات الجلوكوز. تتم هذه العملية في البلاستيدات الخضراء باستخدام الماء وتاني أكسيد الكربون، مع إطلاق الأكسجين كناتج ثنائي أساسي لاستمرار الحياة على الأرض.",
    },
  ];

  const subjects = [
    "عام",
    "فلسفة",
    "اجتماعيات وتاريخ",
    "علوم طبيعية وأحياء",
    "فيزياء وكيمياء",
    "رياضيات",
    "لغة عربية وآدابها",
    "لغات أجنبية",
    "قانون واقتصاد",
  ];

  const levels = ["ابتدائي", "إعدادي/متوسط", "ثانوي/بكالوريا", "جامعي وتخصصي"];

  const summaryStyles = [
    {
      id: "comprehensive",
      title: "ملخص دراسي شامل ومخطط",
      desc: "تقسيم الدرس إلى أفكار جوهرية، تعريفات، وشرح تبسيطي مُركّز.",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "flashcards",
      title: "بطاقات مراجعة سريعة (سؤال وجواب)",
      desc: "بطاقات مختصرة وقوية لتسهيل الحفظ والاستذكار السريع قبل الامتحان.",
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: "mindmap",
      title: "خريطة ذهنية وهيكلية نصية",
      desc: "عرض العلاقات بين المفاهيم الرئيسية والفرعية بشجرة مفاهيم واضحة.",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: "qa",
      title: "أهم الأسئلة المتوقعة في الامتحان",
      desc: "دليل مراجعة يحتوي على أهم الأسئلة النموذجية المحتملة مع إجاباتها.",
      icon: <HelpCircle className="w-4 h-4" />,
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("الرجاء رفع صورة صالحة للدرس (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateSummary = async () => {
    if (!text.trim() && !imagePreview) {
      setError("الرجاء إدخال نص الدرس أو رفع صورة الصفحة المراد تلخيصها.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/summarize-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          subject,
          level,
          summaryStyle,
          imageData: imagePreview,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل تلخيص الدرس.");
      }

      const styleNames: Record<string, string> = {
        comprehensive: "ملخص دراسي شامل",
        flashcards: "بطاقات مراجعة سريعة",
        mindmap: "خريطة ذهنية هيكلية",
        qa: "دليل أسئلة الامتحان المتوقعة",
      };

      const newResult: TransformResult = {
        id: "summary-" + Date.now(),
        originalText: text || "درس مأخوذ من صورة رفعت للتحليل",
        transformedText: data.summaryText,
        notes: `مادة: ${subject} | مستوى: ${level} | نمط التلخيص: ${styleNames[summaryStyle] || "شامل"}`,
        tone: "academic",
        action: "summarize",
        timestamp: Date.now(),
        sourceType: imagePreview ? "ocr" : "text",
      };

      onSummarizeComplete(newResult);
      window.scrollTo({ top: 400, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "تعذر تلخيص الدرس حالياً. الرجاء المحاولة مجدداً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
      {/* Title & Description */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold font-['Cairo'] text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>استوديو تلخيص الدروس والمذكرات الدراسية</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            قم بتلخيص أي درس أو فصل كتاب أو محتوى تعليمي في ثوانٍ، واصنع مذكرات مراجعة، بطاقات حفظ، أو أسئلة متوقعة.
          </p>
        </div>
      </div>

      {/* Preset Lesson Cards */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">عينات دروس للتجربة السريعة:</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {sampleLessons.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setText(sample.text);
                setSubject(sample.subject);
              }}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all text-right space-y-1"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>{sample.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">{sample.subject}</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{sample.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Text Area & Image Upload */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="lessonInput" className="block text-xs font-bold text-slate-700">
            أدخل نص الدرس أو قم برفع صورة لصفحة الدرس الورقية:
          </label>
          {text && (
            <button
              onClick={() => {
                setText("");
                setImagePreview(null);
              }}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>مسح المدخلات</span>
            </button>
          )}
        </div>

        <textarea
          id="lessonInput"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ألصق نص الدرس، المحاضرة، أو الفصل التعليمي هنا..."
          rows={6}
          className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-800 text-sm leading-relaxed resize-y font-normal"
        />

        {/* Image Attachment Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>إرفاق صورة صفحة الدرس (OCR)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            {imagePreview && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                تمت إضافة صورة الدرس
              </span>
            )}
          </div>
          {imagePreview && (
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="text-xs text-rose-600 hover:underline font-bold"
            >
              إلغاء الصورة
            </button>
          )}
        </div>

        {/* Image Thumbnail Preview */}
        {imagePreview && (
          <div className="p-2 bg-slate-100 rounded-xl max-w-xs border border-slate-200">
            <img src={imagePreview} alt="صفحة الدرس" className="w-full max-h-40 object-cover rounded-lg" />
          </div>
        )}
      </div>

      {/* Options: Subject, Level, & Summary Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        {/* Subject & Level Selectors */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">المادة الدراسية:</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-bold focus:ring-2 focus:ring-indigo-100"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">المستوى التعليمي:</label>
            <div className="grid grid-cols-2 gap-2">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                    level === lvl
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Style Selectors */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">شكل التلخيص المطلوب:</label>
          <div className="grid grid-cols-1 gap-2">
            {summaryStyles.map((style) => {
              const active = summaryStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSummaryStyle(style.id)}
                  className={`p-3 rounded-xl border text-right transition-all flex items-start gap-3 ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg ${active ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700"}`}>
                    {style.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{style.title}</div>
                    <div className={`text-[11px] mt-0.5 ${active ? "text-indigo-100" : "text-slate-500"}`}>{style.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleGenerateSummary}
        disabled={isLoading || (!text.trim() && !imagePreview)}
        className={`w-full py-4 rounded-xl font-bold font-['Cairo'] text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
          isLoading || (!text.trim() && !imagePreview)
            ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>جاري تحليل وتلخيص الدرس بالذكاء الاصطناعي...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-indigo-200" />
            <span>توليد الملخص والمذكرة الدراسية</span>
          </>
        )}
      </button>
    </div>
  );
};
