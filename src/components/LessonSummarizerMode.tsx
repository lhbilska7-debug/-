import React, { useState, useRef } from "react";
import {
  BookOpen,
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  Eraser,
  Layers,
  HelpCircle,
  FileCheck,
  CheckSquare,
  Clock,
  Award,
  ListFilter,
  Check,
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"summarize" | "generate_exam">("summarize");
  const [text, setText] = useState<string>("");
  const [subject, setSubject] = useState<string>("عام");
  const [level, setLevel] = useState<string>("ثانوي/بكالوريا");
  const [summaryStyle, setSummaryStyle] = useState<string>("comprehensive");
  const [examFormat, setExamFormat] = useState<string>("standard");
  const [includeGradingScheme, setIncludeGradingScheme] = useState<boolean>(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleLessons = [
    {
      title: "درس الاجتماعيات والظواهر الاقتصادية",
      subject: "اجتماعيات وتاريخ",
      text: "تُعتبر الثورة الصناعية في أوروبا نقطة تحول جذرية في تاريخ الاقتصاد العالمي، حيث انتقلت المجتمعات من الاعتماد على الزراعة والعمل اليدوي إلى الصناعة والمصانع الآلية. أدى ذلك إلى نمو المدن بشكل غير مسبوق وزيادة الإنتاجية الاقتصادية، ولكنه خلق أيضاً تحديات اجتماعية مثل ظروف العمل الصعبة وحاجة العمال إلى التنظيم والتأمين الاجتماعي.",
    },
    {
      title: "درس الفلسفة: الإشكالية الأخلاقية",
      subject: "فلسفة",
      text: "تتراوح النظريات الأخلاقية بين المذهب النفعي الذي يربط قيمة الفعل بنتائجه ومقدار السعادة المستحصلة، والمذهب الواجبي (الكانطي) الذي يعتبر أن الفعل الأخلاقي يستمد قيمته من الإرادة الخيرة والواجب النقي بغض النظر عن النتائج والمصالح الشخصية.",
    },
    {
      title: "درس العلوم الطبيعية: الخلية والتركيب الضوئي",
      subject: "علوم طبيعية وأحياء",
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

  const examFormats = [
    {
      id: "standard",
      title: "فرض محروس / امتحان رسمي متكامل (على 20 نقطة)",
      desc: "ورقة امتحان نموذجية: أسئلة فهم ومصطلحات + تمارين تطبيقية + وضعية إدماجية وسلّم تنقيط.",
      icon: <FileCheck className="w-4 h-4" />,
      badge: "الأكثر طلباً",
    },
    {
      id: "qcm",
      title: "اختبار اختيار من متعدد (QCM)",
      desc: "من 8 إلى 10 أسئلة دقيقة من الدرس بأربعة خيارات (أ، ب، ج، د) مع تصحيح معلل لكل سؤال.",
      icon: <CheckSquare className="w-4 h-4" />,
      badge: "تقييم ذاتي سريع",
    },
    {
      id: "express",
      title: "اختبار سريع ومباشر في 10 دقائق",
      desc: "4 إلى 5 أسئلة مباشرة لاختبار استيعاب النقاط الجوهرية للدرس قبل الامتحان بثوانٍ.",
      icon: <Clock className="w-4 h-4" />,
      badge: "مراجعة خفيفة",
    },
    {
      id: "challenging",
      title: "امتحان تطبيقي متقدم للمتفوقين",
      desc: "أسئلة تحليلية واستنتاجية عميقة وتطبيقات غير مسبوقة تقيس الفهم والتميز.",
      icon: <Award className="w-4 h-4" />,
      badge: "مستوى متقدم",
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

  const handleGenerateExam = async () => {
    if (!text.trim() && !imagePreview) {
      setError("الرجاء إدخال نص الدرس أو رفع صورة الصفحة لتوليد الامتحان.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-lesson-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonText: text,
          subject,
          level,
          examFormat,
          includeGradingScheme,
          imageData: imagePreview,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل توليد الامتحان من الدرس.");
      }

      const formatNames: Record<string, string> = {
        standard: "فرض محروس رسمي متكامل (20 نقطة)",
        qcm: "اختبار اختيار من متعدد (QCM)",
        express: "اختبار سريع (10 دقائق)",
        challenging: "امتحان متقدم وتطبيقي",
      };

      const newResult: TransformResult = {
        id: "exam-gen-" + Date.now(),
        originalText: text || "درس مأخوذ من صورة ورقية للتحليل",
        transformedText: data.examText,
        notes: `امتحان تجريبي مستخرج من الدرس | مادة: ${subject} | مستوى: ${level} | النمط: ${formatNames[examFormat] || "رسمي"} ${includeGradingScheme ? "مع عناصر الإجابة وسلم التنقيط" : "أسئلة فقط"}`,
        tone: "academic",
        action: "expand",
        timestamp: Date.now(),
        sourceType: imagePreview ? "ocr" : "text",
      };

      onSummarizeComplete(newResult);
      window.scrollTo({ top: 400, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "تعذر توليد الامتحان من هذا الدرس. الرجاء المحاولة مجدداً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h2 className="text-lg font-bold font-['Cairo'] text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>استوديو تلخيص الدروس وصناعة الامتحانات</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            لخص دروسك في مذكرات وبطاقات حفظ، أو ولّد امتحانات واختبارات تجريبية حقيقية مستخرجة مباشرة من الدرس.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("summarize")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "summarize"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>تلخيص ومذكرات الدرس</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("generate_exam")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 relative ${
              activeTab === "generate_exam"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>توليد امتحان من الدرس</span>
            <span className={`text-[9px] px-1 py-0.2 rounded-full font-extrabold ${activeTab === "generate_exam" ? "bg-amber-300 text-amber-950" : "bg-amber-100 text-amber-800"}`}>
              جديد
            </span>
          </button>
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
            {activeTab === "summarize"
              ? "أدخل نص الدرس أو قم برفع صورة لصفحة الدرس لتلخيصها:"
              : "أدخل نص الدرس أو ارفع صورته، وسيصنع الذكاء الاصطناعي امتحاناً كاملاً مستخرجاً من معارفه:"}
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
          placeholder={
            activeTab === "summarize"
              ? "ألصق نص الدرس، المحاضرة، أو الفصل التعليمي هنا لتلخيصه..."
              : "ألصق نص الدرس هنا، وسيقوم النظام باستخراج الأسئلة التقييمية، التمارين التطبيقية، وسلم التنقيط..."
          }
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
                تمت إضافة صورة الدرس بنجاح
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

      {/* Options: Subject, Level & (Summary Style OR Exam Format) */}
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

          {/* If on Exam Generation tab, show additional options */}
          {activeTab === "generate_exam" && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
              <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                <span>خيارات عناصر الإجابة:</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={includeGradingScheme}
                  onChange={(e) => setIncludeGradingScheme(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>إرفاق عناصر الإجابة النموذجية وسلّم التنقيط في نهاية الامتحان</span>
              </label>
            </div>
          )}
        </div>

        {/* Right column: Either Summary Styles OR Exam Formats */}
        {activeTab === "summarize" ? (
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
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">نوع وهيكل الامتحان المراد توليده:</label>
            <div className="grid grid-cols-1 gap-2">
              {examFormats.map((format) => {
                const active = examFormat === format.id;
                return (
                  <button
                    key={format.id}
                    type="button"
                    onClick={() => setExamFormat(format.id)}
                    className={`p-3 rounded-xl border text-right transition-all flex items-start gap-3 ${
                      active
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg ${active ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700"}`}>
                      {format.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{format.title}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
                          {format.badge}
                        </span>
                      </div>
                      <div className={`text-[11px] mt-0.5 ${active ? "text-indigo-100" : "text-slate-500"}`}>{format.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Cross-Promo Prompt when on summarize tab */}
      {activeTab === "summarize" && (
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 flex items-center justify-between gap-3">
          <div className="text-xs text-indigo-950">
            <span className="font-bold">🎯 تريد اختبار استيعابك لهذا الدرس؟ </span>
            <span className="text-slate-600">يمكنك توليد فرض أو اختبار تجريبي حقيقي مستوحى من هذا الدرس فوراً.</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("generate_exam")}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 transition-colors flex items-center gap-1"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>الانتقال للامتحان</span>
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {activeTab === "summarize" ? (
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
      ) : (
        <button
          type="button"
          onClick={handleGenerateExam}
          disabled={isLoading || (!text.trim() && !imagePreview)}
          className={`w-full py-4 rounded-xl font-bold font-['Cairo'] text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
            isLoading || (!text.trim() && !imagePreview)
              ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
              : "bg-indigo-700 hover:bg-indigo-800 text-white shadow-indigo-200 hover:shadow-indigo-300"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>جاري استخراج الأسئلة وتوليد ورقة الامتحان وسلم التنقيط...</span>
            </>
          ) : (
            <>
              <FileCheck className="w-5 h-5 text-indigo-200" />
              <span>توليد ورقة الامتحان وسلم التنقيط من هذا الدرس</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
