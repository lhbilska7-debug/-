import React, { useState, useRef } from "react";
import { HelpCircle, CheckCircle, Sparkles, Upload, FileCheck, Eraser, Check, AlertCircle, BookOpen, Layers, CheckSquare } from "lucide-react";
import { TransformResult } from "../types";

interface ExamSolverModeProps {
  onSolveComplete: (result: TransformResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
}

export const ExamSolverMode: React.FC<ExamSolverModeProps> = ({
  onSolveComplete,
  isLoading,
  setIsLoading,
  setError,
}) => {
  const [questionText, setQuestionText] = useState<string>("");
  const [subject, setSubject] = useState<string>("عام");
  const [educationLevel, setEducationLevel] = useState<string>("ثانوي/بكالوريا");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleExamQuestions = [
    {
      title: "مسألة رياضيات وفضاء",
      subject: "رياضيات",
      text: "احسب مشتقة الدالة f(x) = (3x^2 + 2x)(x - 5)، ثم حدد النقط الحتمية والدراسة التغيرية للدالة في المجال [0, 10].",
    },
    {
      title: "سؤال فلسفي واختبار المقال",
      subject: "فلسفة",
      text: "هل الإدراك الحسي يتوقف على فاعلية الذات أم على بنية الموضوع والمثيرات المادية؟ دافع عن إجابتك بطرح أطروحتين وحجج فلسفية مقنعة.",
    },
    {
      title: "تمرين علوم طبيعية وجينات",
      subject: "علوم وحياة",
      text: "إذا كانت نسبة الأدينين A في شريط DNA تساوي 28%، فما هي نسب باقي القواعد النيتروجينية T, C, G؟ وضح قانون الشارغاف المعتمد.",
    },
    {
      title: "سؤال قواعد النحو والإعراب",
      subject: "لغة عربية",
      text: "أعرب الجملة التالية إعراباً مفصلاً: «إنّ المعلمين المخلصين يرسخون قواعد المعرفة في عقول الناشئة».",
    },
  ];

  const subjects = [
    "عام",
    "رياضيات",
    "فيزياء وكيمياء",
    "علوم أحياء وطبيعة",
    "فلسفة ومنطق",
    "لغة عربية ونحو",
    "تاريخ وجغرافيا",
    "لغات أجنبية (English/Français)",
    "قانون واقتصاد",
  ];

  const levels = ["إعدادي/متوسط", "ثانوي/بكالوريا", "جامعي وتخصصي", "مسابقات واختبارات قياس"];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("الرجاء رفع صورة صالحة لورقة الامتحان (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSolveExam = async () => {
    if (!questionText.trim() && !imagePreview) {
      setError("الرجاء إدخال نص السؤال أو رفع صورة ورقة الامتحان.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/solve-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText,
          subject,
          educationLevel,
          imageData: imagePreview,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل استخراج إجابة وحل الامتحان.");
      }

      const newResult: TransformResult = {
        id: "exam-" + Date.now(),
        originalText: questionText || "أسئلة امتحان مستخرجة من صورة ورقة الاختبار",
        transformedText: data.solutionText,
        notes: `إجابة امتحان | مادة: ${subject} | مستوى: ${educationLevel}`,
        tone: "academic",
        action: "proofread",
        timestamp: Date.now(),
        sourceType: imagePreview ? "ocr" : "text",
      };

      onSolveComplete(newResult);
      window.scrollTo({ top: 400, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "تعذر حل الامتحان حالياً. الرجاء المحاولة مجدداً.");
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
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            <span>استوديو حل وتفكيك الامتحانات والأسئلة (Exam Solver)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            احصل على الإجابات النموذجية المفصلة خطوة بخطوة لأي امتحان أو تمرين مع الشرح والقوانين العلمية وحالات التطبيق.
          </p>
        </div>
      </div>

      {/* Quick Preset Sample Exam Questions */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">أسئلة اختبارات نموذجية للتجربة:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {sampleExamQuestions.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuestionText(sample.text);
                setSubject(sample.subject);
              }}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all text-right space-y-1"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>{sample.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{sample.subject}</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{sample.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Exam Question Input & Image Upload */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="examInput" className="block text-xs font-bold text-slate-700">
            أدخل نص الأسئلة أو ارفع صورة ورقة الاختبار/الواجب:
          </label>
          {questionText && (
            <button
              onClick={() => {
                setQuestionText("");
                setImagePreview(null);
              }}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>مسح</span>
            </button>
          )}
        </div>

        <textarea
          id="examInput"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="اكتب أو ألصق سؤال الامتحان، المسألة الرياضية، أو الموضوع الفلسفي/التعليمي هنا..."
          rows={5}
          className="w-full p-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-800 text-sm leading-relaxed resize-y font-normal"
        />

        {/* Upload Exam Sheet */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>رفع صورة ورقة الامتحان (Exam OCR)</span>
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
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                تمت إضافة صورة ورقة الاختبار
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

        {/* Image Thumbnail */}
        {imagePreview && (
          <div className="p-2 bg-slate-100 rounded-xl max-w-xs border border-slate-200">
            <img src={imagePreview} alt="ورقة الامتحان" className="w-full max-h-40 object-cover rounded-lg" />
          </div>
        )}
      </div>

      {/* Selectors for Subject & Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">تخصص / مادة الامتحان:</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-bold focus:ring-2 focus:ring-emerald-100"
          >
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">المستوى الدراسي المطلوب:</label>
          <div className="grid grid-cols-2 gap-2">
            {levels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setEducationLevel(lvl)}
                className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                  educationLevel === lvl
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features Included Box */}
      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
        <strong className="font-bold flex items-center gap-1.5 text-emerald-900">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          يتضمن حل الامتحان:
        </strong>
        <p className="text-emerald-800">
          إجابة نموذجية دقيقة + شرح خطوات الحل بالتفصيل + القاعدة والقوانين المستند عليها + سؤال تطبيقي إضافي لتأكيد الفهم.
        </p>
      </div>

      {/* Solve Button */}
      <button
        type="button"
        onClick={handleSolveExam}
        disabled={isLoading || (!questionText.trim() && !imagePreview)}
        className={`w-full py-4 rounded-xl font-bold font-['Cairo'] text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
          isLoading || (!questionText.trim() && !imagePreview)
            ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:shadow-emerald-300"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>جاري استخراج حل الامتحان وإعداد الشرح المباشر...</span>
          </>
        ) : (
          <>
            <CheckSquare className="w-5 h-5 text-emerald-200" />
            <span>توليد حل الامتحان الإجابة النموذجية</span>
          </>
        )}
      </button>
    </div>
  );
};
