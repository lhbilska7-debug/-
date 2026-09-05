import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { TextTransformMode } from "./components/TextTransformMode";
import { TextToSpeechMode } from "./components/TextToSpeechMode";
import { LessonSummarizerMode } from "./components/LessonSummarizerMode";
import { ExamSolverMode } from "./components/ExamSolverMode";
import { OcrHandwritingMode } from "./components/OcrHandwritingMode";
import { VoiceToTextMode } from "./components/VoiceToTextMode";
import { TemplatesMode } from "./components/TemplatesMode";
import { OutputViewer } from "./components/OutputViewer";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { AdBanner } from "./components/AdBanner";
import { AdManagerModal } from "./components/AdManagerModal";
import { ServiceNavigationGrid } from "./components/ServiceNavigationGrid";
import { AppMode, TransformConfig, TransformResult } from "./types";
import { Sparkles, AlertCircle, ShieldCheck, Zap, BookOpen, Layers } from "lucide-react";

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>("transform");
  const [currentResult, setCurrentResult] = useState<TransformResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Ad placement state
  const [showTopAd, setShowTopAd] = useState(true);
  const [showSidebarAd, setShowSidebarAd] = useState(true);
  const [showNativeAd, setShowNativeAd] = useState(true);
  const [showStickyFooterAd, setShowStickyFooterAd] = useState(true);
  const [isAdManagerOpen, setIsAdManagerOpen] = useState(false);

  // History state in localStorage
  const [history, setHistory] = useState<TransformResult[]>(() => {
    try {
      const saved = localStorage.getItem("qalam_saved_results_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("qalam_saved_results_v1", JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  }, [history]);

  // Handle Main Text Transform Request
  const handleTransform = async (text: string, config: TransformConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/transform-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          tone: config.tone,
          action: config.action,
          tashkeel: config.tashkeel,
          targetDialect: config.convertToMsa ? "msa" : "original",
          customInstructions: config.customInstructions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء معالجة النص.");
      }

      const newResult: TransformResult = {
        id: "tr-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        originalText: text,
        transformedText: data.transformedText,
        notes: data.notes,
        tone: config.tone,
        action: config.action,
        timestamp: Date.now(),
        sourceType: "text",
      };

      setCurrentResult(newResult);
      setHistory((prev) => [newResult, ...prev]);

      // Scroll smoothly down to the result viewer
      window.scrollTo({ top: 400, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "فشلت عملية صياغة النص. الرجاء إعادة المحاولة.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OCR Extraction & Transform
  const handleOcrComplete = (extractedText: string) => {
    // Automatically trigger transform on extracted text or set it
    const config: TransformConfig = {
      tone: "formal",
      action: "rewrite",
      tashkeel: "none",
      convertToMsa: true,
      customInstructions: "نسق النص المستخرج كفقرات مرتبة وأزِل أي رموز طابعة خاطئة.",
    };
    handleTransform(extractedText, config);
  };

  // Handle Audio Transcribe & Transform
  const handleAudioTranscribed = (transcribedText: string) => {
    const config: TransformConfig = {
      tone: "formal",
      action: "rewrite",
      tashkeel: "none",
      convertToMsa: true,
      customInstructions: "قم بتنسيق المقطع المفرغ هجائياً ونحوياً بأسلوب بليغ.",
    };
    handleTransform(transcribedText, config);
  };

  const handleToggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    if (currentResult && currentResult.id === id) {
      setCurrentResult((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("هل أنت تأكد من رغبتك في مسح كافة النصوص المحفوظة بالسجل؟")) {
      setHistory([]);
    }
  };

  const handleDeleteResult = (id: string) => {
    setHistory((prev) => prev.filter((i) => i.id !== id));
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Tajawal'] pb-12">
      {/* Top Navigation */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          setError(null);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAdManager={() => setIsAdManagerOpen(true)}
        savedCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Leaderboard Ad Slot (728x90) */}
        {showTopAd && <AdBanner type="leaderboard" />}

        {/* Easy Service Navigation Grid */}
        <ServiceNavigationGrid
          currentMode={currentMode}
          onSelectMode={(mode) => {
            setCurrentMode(mode);
            setError(null);
          }}
        />

        {/* Error Alert Box */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-xs animate-shake">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* Workspace Layout Grid (Content + Sidebar Ad) */}
        <div className={`grid grid-cols-1 ${showSidebarAd ? "lg:grid-cols-4" : ""} gap-6 items-start`}>
          {/* Primary Workspace (Takes 3 columns when sidebar is active) */}
          <div className={`${showSidebarAd ? "lg:col-span-3" : ""} space-y-6`}>
            {/* Mode Renderer */}
            <div className="grid grid-cols-1 gap-8">
              {currentMode === "transform" && (
                <TextTransformMode onTransform={handleTransform} isLoading={isLoading} />
              )}

              {currentMode === "lesson_summary" && (
                <LessonSummarizerMode
                  onSummarizeComplete={(res) => {
                    setCurrentResult(res);
                    setHistory((prev) => [res, ...prev]);
                  }}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
              )}

              {currentMode === "exam_solver" && (
                <ExamSolverMode
                  onSolveComplete={(res) => {
                    setCurrentResult(res);
                    setHistory((prev) => [res, ...prev]);
                  }}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
              )}

              {currentMode === "tts" && (
                <TextToSpeechMode
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
              )}

              {currentMode === "ocr" && (
                <OcrHandwritingMode
                  onOcrComplete={handleOcrComplete}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
              )}

              {currentMode === "voice" && (
                <VoiceToTextMode
                  onAudioTranscribed={handleAudioTranscribed}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
              )}

              {currentMode === "templates" && (
                <TemplatesMode onGenerateDocument={handleTransform} isLoading={isLoading} />
              )}
            </div>

            {/* Transformed Output Viewer */}
            {currentResult && (
              <div className="pt-2 animate-fadeIn space-y-4">
                <OutputViewer
                  result={currentResult}
                  onToggleFavorite={handleToggleFavorite}
                />
                {/* Native Sponsored Ad below result */}
                {showNativeAd && <AdBanner type="native" />}
              </div>
            )}
          </div>

          {/* Sidebar Column (Ad Slot & Quick Widgets) */}
          {showSidebarAd && (
            <div className="space-y-4">
              {/* Sidebar Medium Rectangle Ad (300x250) */}
              <AdBanner type="sidebar" />

              {/* Monitization Info Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1 text-indigo-700 font-bold">
                    إعلانات الصفحة
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAdManagerOpen(true)}
                    className="text-[11px] text-indigo-600 hover:underline font-bold"
                  >
                    تعديل الإعلانات
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  تم إعداد هذا الموقع بتصميم عصري وجاهز لربط حساب Google AdSense ومساحات الرعاية لزيادة دخل الموقع.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Platform Feature Highlights */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 font-['Cairo'] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>مميزات محول وصانع النصوص قَلَمْ:</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <strong className="font-bold text-slate-900 block text-xs">صياغة لغوية بليغة وصحيحة</strong>
              <p className="text-slate-500">تحسين التراكيب اللغوية والارتقاء بالمفردات مع مطابقة قواعد النحو العربي والمخاطبات الإدارية.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <strong className="font-bold text-slate-900 block text-xs">تلخيص الدروس وحل الامتحانات</strong>
              <p className="text-slate-500">استخراج الإجابات النموذجية المفصلة وتلخيص الدروس فواً مع دعم الصور والخط اليدوي.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <strong className="font-bold text-slate-900 block text-xs">تصدير متعدد ومساحات إعلانية</strong>
              <p className="text-slate-500">تصدير النتائج فوراً إلى ملفات Word أو TXT، مع تصميم محسّن لدعم الإعلانات وتحقيق الأرباح.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Bottom Ad Banner */}
      {showStickyFooterAd && <AdBanner type="footer_sticky" />}

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(res) => setCurrentResult(res)}
        onToggleFavorite={handleToggleFavorite}
        onClearHistory={handleClearHistory}
        onDeleteResult={handleDeleteResult}
      />

      {/* Ad Manager Settings Modal */}
      <AdManagerModal
        isOpen={isAdManagerOpen}
        onClose={() => setIsAdManagerOpen(false)}
        showTopAd={showTopAd}
        setShowTopAd={setShowTopAd}
        showSidebarAd={showSidebarAd}
        setShowSidebarAd={setShowSidebarAd}
        showNativeAd={showNativeAd}
        setShowNativeAd={setShowNativeAd}
        showStickyFooterAd={showStickyFooterAd}
        setShowStickyFooterAd={setShowStickyFooterAd}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 قَلَمْ - منصة تحويل وتنسيق الكتابة والنصوص بالذكاء الاصطناعي.</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdManagerOpen(true)}
              className="text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1 text-xs"
            >
              <span>إعدادات المساحات الإعلانية</span>
            </button>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>نظام الذكاء الاصطناعي متصل وجاهز</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
