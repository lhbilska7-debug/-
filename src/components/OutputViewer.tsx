import React, { useState } from "react";
import { TransformResult } from "../types";
import {
  Copy,
  Check,
  Download,
  Volume2,
  VolumeX,
  Sparkles,
  Share2,
  Bookmark,
  BookmarkCheck,
  Eye,
  Columns,
  Info,
  Clock,
  BarChart2,
  Printer,
  FileText,
} from "lucide-react";

interface OutputViewerProps {
  result: TransformResult;
  onToggleFavorite: (id: string) => void;
  onReTransformWithNewTone?: (newTone: any) => void;
}

export const OutputViewer: React.FC<OutputViewerProps> = ({
  result,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"sideBySide" | "transformedOnly">("transformedOnly");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.transformedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([result.transformedText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `نص_محول_قلم_${result.id.slice(0, 6)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadDoc = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>مستند قلم</title></head><body dir='rtl' style='font-family: Arial, sans-serif;'>";
    const footer = "</body></html>";
    const html = header + "<div>" + result.transformedText.replace(/\n/g, "<br>") + "</div>" + footer;

    const blob = new Blob(["\ufeff", html], {
      type: "application/msword",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `مستند_قلم_${result.id.slice(0, 6)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>طباعة النص - قَلَمْ</title>
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 40px; line-height: 1.8; color: #1e293b; }
            h1 { font-family: 'Cairo', sans-serif; border-bottom: 2px solid #6366f1; padding-bottom: 10px; color: #4338ca; }
            .content { font-size: 18px; white-space: pre-wrap; margin-top: 20px; }
            .footer { margin-top: 50px; font-size: 12px; color: #64748b; border-t: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>مُصاغ بواسطة قَلَمْ | منصة النص الاحترافي</h1>
          <div class="content">${result.transformedText}</div>
          <div class="footer">تاريخ التوليد: ${new Date(result.timestamp).toLocaleDateString("ar-SA")}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const fallbackSpeechSynthesis = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(result.transformedText);
      utterance.lang = "ar-SA";
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setAudioError("خاصية الاستماع الصوتي غير مدعومة في متصفحك.");
      setIsPlayingAudio(false);
    }
  };

  const handlePlayTTS = async () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    setAudioError(null);

    try {
      // First try Gemini TTS endpoint
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: result.transformedText }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioBase64) {
          const mime = data.mimeType || "audio/wav";
          const snd = new Audio(`data:${mime};base64,${data.audioBase64}`);
          snd.onended = () => setIsPlayingAudio(false);
          snd.onerror = () => {
            console.warn("Gemini audio player error, falling back to Web Speech API");
            fallbackSpeechSynthesis();
          };
          
          try {
            await snd.play();
            return;
          } catch (playErr) {
            console.warn("snd.play() rejected, falling back to Web Speech API", playErr);
            fallbackSpeechSynthesis();
            return;
          }
        }
      }

      // Fallback to Web Speech Synthesis API
      fallbackSpeechSynthesis();
    } catch (err: any) {
      console.warn("TTS error, trying Web Speech API", err);
      fallbackSpeechSynthesis();
    }
  };

  const wordsCount = result.transformedText.trim().split(/\s+/).length;
  const charCount = result.transformedText.length;
  const readingTime = Math.max(1, Math.ceil(wordsCount / 180));

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-md p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Cairo'] flex items-center gap-2">
              <span>النص الاحترافي الناتج</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {result.tone === "formal"
                  ? "رسمي"
                  : result.tone === "academic"
                  ? "أكاديمي"
                  : result.tone === "persuasive"
                  ? "إقناعي"
                  : result.tone === "creative"
                  ? "إبداعي"
                  : result.tone === "concise"
                  ? "موجز"
                  : "دبلوماسي"}
              </span>
            </h3>
            <p className="text-xs text-slate-500">تم صياغته وتدقيقه وفق أعلى معايير الجودة والبلاغة</p>
          </div>
        </div>

        {/* View Switcher & Favorite */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("transformedOnly")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "transformedOnly"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>النص المحول</span>
            </button>
            <button
              onClick={() => setViewMode("sideBySide")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "sideBySide"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>مقارنة مع النص الأصلي</span>
            </button>
          </div>

          <button
            onClick={() => onToggleFavorite(result.id)}
            className={`p-2 rounded-xl border transition-colors ${
              result.isFavorite
                ? "bg-amber-50 text-amber-600 border-amber-200"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800"
            }`}
            title="حفظ في المفضلة"
          >
            {result.isFavorite ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "sideBySide" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original Text */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">النص الأصلي (قبل التحويل):</div>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
              {result.originalText}
            </div>
          </div>

          {/* Transformed Text */}
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/80 space-y-2">
            <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">النص المحول والمصاغ:</div>
            <div className="text-base text-slate-900 leading-relaxed whitespace-pre-wrap font-medium">
              {result.transformedText}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-50/30 to-slate-50 border border-indigo-100/80 shadow-xs">
          <div className="text-base sm:text-lg text-slate-900 leading-relaxed whitespace-pre-wrap font-normal selection:bg-indigo-200">
            {result.transformedText}
          </div>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            <BarChart2 className="w-4 h-4 text-indigo-600" />
            <strong className="text-slate-800">{wordsCount}</strong> كلمة
          </span>
          <span>•</span>
          <span>
            <strong className="text-slate-800">{charCount}</strong> حرف
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-indigo-600" />
            زمن القراءة المتوقع: <strong className="text-slate-800">{readingTime} دقيقة</strong>
          </span>
        </div>

        {/* AI Transformation Notes */}
        {result.notes && (
          <div className="w-full pt-2 border-t border-slate-200 text-xs text-indigo-900 bg-indigo-50/60 p-2.5 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">ملاحظات الصائغ الذكي:</strong> {result.notes}
            </div>
          </div>
        )}
      </div>

      {/* Primary Actions Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopy}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              copied
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "تم النسخ بنجاح!" : "نسخ النص المحوّل"}</span>
          </button>

          <button
            onClick={handlePlayTTS}
            disabled={isPlayingAudio}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-2"
          >
            <Volume2 className={`w-4 h-4 text-indigo-600 ${isPlayingAudio ? "animate-pulse" : ""}`} />
            <span>{isPlayingAudio ? "جاري الاستماع للنص..." : "استماع صوتي للنص"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5"
            title="طباعة النص"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>طباعة</span>
          </button>
        </div>

        {/* Export Formats Dropdown */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadDoc}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5"
            title="تصدير كملف Word"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>ملف Word</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5"
            title="تصدير كملف نصي TXT"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>نص TXT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
