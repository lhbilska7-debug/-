import React, { useState, useRef } from "react";
import { Upload, Camera, Image as ImageIcon, Sparkles, Wand2, RefreshCw, FileText, CheckCircle2 } from "lucide-react";

interface OcrHandwritingModeProps {
  onOcrComplete: (extractedText: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
}

export const OcrHandwritingMode: React.FC<OcrHandwritingModeProps> = ({
  onOcrComplete,
  isLoading,
  setIsLoading,
  setError,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [ocrPrompt, setOcrPrompt] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample handwritten/document notes for instant testing
  const sampleNotes = [
    {
      title: "ملاحظات اجتماع مكتوبة باليد",
      description: "عينة صورة لملاحظات ورقية سريعة بخط اليد",
      svgBg: "bg-amber-50 text-amber-900 border-amber-200",
      textSimulation: "ملاحظات بخط اليد: مراجعة خطة التسويق لشهر أغسطس، التواصل مع الموردين لحل تأخير البضائع، تحديد موعد مع المدير.",
    },
    {
      title: "صورة مستند أو تقرير مطبوع",
      description: "عينة صفحة تقرير بفقرات ومستند رسمى",
      svgBg: "bg-sky-50 text-sky-900 border-sky-200",
      textSimulation: "المستند الرسمي: تقرير الربع الثاني - بلغت نسبة النمو 24% مقارنة بالعام الماضي مع تحسن ملحوظ في الأداء العملياتي.",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("الرجاء اختيار صورة صالحة (PNG, JPG, WEBM).");
      return;
    }

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunOcr = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ocr-handwriting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType,
          prompt: ocrPrompt,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء قراءة الصورة.");
      }

      onOcrComplete(data.extractedText);
    } catch (err: any) {
      setError(err.message || "تعذر قراءة الصورة حالياً.");
    } finally {
      setIsLoading(false);
    }
  };

  const createSampleCanvasImage = (text: string, title: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#fffbeb";
      ctx.fillRect(0, 0, 600, 300);

      // Lines like a notebook
      ctx.strokeStyle = "#fde68a";
      ctx.lineWidth = 1;
      for (let y = 50; y < 300; y += 35) {
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(580, y);
        ctx.stroke();
      }

      ctx.font = "bold 20px 'Cairo', sans-serif";
      ctx.fillStyle = "#1e3a8a";
      ctx.direction = "rtl";
      ctx.fillText(`✍️ ${title}`, 560, 40);

      ctx.font = "16px 'Tajawal', cursive, sans-serif";
      ctx.fillStyle = "#1e293b";

      // Wrap text
      const words = text.split(" ");
      let line = "";
      let y = 90;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 500 && n > 0) {
          ctx.fillText(line, 560, y);
          line = words[n] + " ";
          y += 40;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 560, y);
    }
    return canvas.toDataURL("image/jpeg");
  };

  const handleSelectSample = (sample: typeof sampleNotes[0]) => {
    const dataUrl = createSampleCanvasImage(sample.textSimulation, sample.title);
    setSelectedImage(dataUrl);
    setMimeType("image/jpeg");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold font-['Cairo'] text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-600" />
            <span>تحويل الخط اليدوي والمستندات الضوئية (OCR)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ارفع صورة لملاحظات مكتوبة بخط اليد، سبورة، أو مستند مطبوع وسيقوم النظام باستخراج النص وتنسيقه بدقة.
          </p>
        </div>
      </div>

      {/* Upload Zone or Image Preview */}
      {!selectedImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 text-center bg-slate-50/60 hover:bg-indigo-50/30 transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">انقر هنا لرفع صورة أو اسحب الصورة وأفلتها هنا</p>
            <p className="text-xs text-slate-500 mt-1">يدعم صيغ PNG, JPG, JPEG, WEBP حتى 20 ميجابايت</p>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-white text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-xs hover:bg-slate-50"
          >
            تصفح الملفات
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 flex justify-center items-center max-h-96 p-2">
            <img src={selectedImage} alt="Uploaded note" className="max-h-88 object-contain rounded-xl" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 left-3 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تغيير الصورة</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">توجيه إضافي لقارئ النصوص (اختياري):</label>
            <input
              type="text"
              value={ocrPrompt}
              onChange={(e) => setOcrPrompt(e.target.value)}
              placeholder="مثال: ركز على القائمة العلوية، أو قم بتشكيل الكلمات المعقدة..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <button
            onClick={handleRunOcr}
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl font-bold font-['Cairo'] text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري التعرف على الخط اليدوي والنص...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>استخراج وتحويل النص من الصورة</span>
              </>
            )}
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Sample presets for fast test */}
      <div className="pt-4 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-700 mb-2">أو جرب مع عينات اختبارية سريعة للخط اليدوي:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sampleNotes.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-xs flex items-center justify-between ${sample.svgBg}`}
            >
              <div>
                <div className="text-xs font-bold">{sample.title}</div>
                <div className="text-[10px] opacity-80 mt-0.5">{sample.description}</div>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-white/80 border border-current">تجربة</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
