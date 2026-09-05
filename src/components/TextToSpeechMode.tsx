import React, { useState, useRef } from "react";
import { Volume2, Play, Pause, Download, Wand2, Sparkles, RefreshCw, VolumeX, Eraser, CheckCircle2, Music, Radio, FastForward } from "lucide-react";

interface TextToSpeechModeProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
}

export const TextToSpeechMode: React.FC<TextToSpeechModeProps> = ({
  isLoading,
  setIsLoading,
  setError,
}) => {
  const [text, setText] = useState<string>("");
  const [voice, setVoice] = useState<string>("Kore");
  const [autoTashkeel, setAutoTashkeel] = useState<boolean>(true);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string>("audio/wav");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sampleTexts = [
    {
      title: "إعلان رسمي إداري",
      text: "يسُرّ إدارة الشركة أن تُحيّي كافة الموظفين والعملاء الكرام، ونُحيطكم علماً ببدء تطبيق نظام العمل الجديد بدءاً من الأسبوع القادم.",
      category: "إداري",
    },
    {
      title: "مقدمة تقرير أكاديمي",
      text: "تُعدّ تقنيات الذكاء الاصطناعي والتوليد الصوتي من أسرع التقنيات تطوراً في العصر الحديث، حيث تُسهم بشكل مباشر في دعم ذوي الإعاقة البصرية وتسهيل وصول المعلومات للجميع.",
      category: "أكاديمي",
    },
    {
      title: "نص أدبي وبلاغي",
      text: "في هدوء الليل وفيض السكون، تهمسُ الأفكار في الأوراق رسمًا، وترتقي الكلمات صرحًا من الفصاحة والجمال.",
      category: "أدبي",
    },
  ];

  const voices = [
    { id: "Kore", name: "صوت كوري (Kore)", gender: "أنثوي هادئ", desc: "نطق واضح وفصيح للمخاطبات والأخبار" },
    { id: "Fenrir", name: "صوت فينرير (Fenrir)", gender: "ذكوري عميق", desc: "أسلوب رصين للتقارير والخطابات الرسمية" },
    { id: "Aoede", name: "صوت أيودي (Aoede)", gender: "أنثوي دافئ", desc: "نبرة ودودة للمحتوى التعليمي والتوعوي" },
    { id: "Puck", name: "صوت بوك (Puck)", gender: "ذكوري حيوي", desc: "نبرة سريعة ومشوقة للإعلانات والتسويق" },
  ];

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      setError("الرجاء كتابة أو إدخال النص المطلوب تحويله إلى صوت.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAudioBase64(null);
    setIsPlaying(false);

    try {
      let finalSpeechText = text.trim();

      // If auto-tashkeel is enabled, preprocess for better pronunciation
      if (autoTashkeel) {
        try {
          const transformRes = await fetch("/api/transform-text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: finalSpeechText,
              tashkeel: "smart",
              action: "proofread",
            }),
          });
          if (transformRes.ok) {
            const transformData = await transformRes.json();
            if (transformData.transformedText) {
              finalSpeechText = transformData.transformedText;
            }
          }
        } catch {
          // fallback to original text if pre-transform fails
        }
      }

      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: finalSpeechText,
          voice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل توليد الصوت من النص.");
      }

      if (data.audioBase64) {
        setAudioBase64(data.audioBase64);
        setAudioMimeType(data.mimeType || "audio/wav");
      } else {
        throw new Error("لم يتم استلام مقطع صوتي صالح.");
      }
    } catch (err: any) {
      // Browser SpeechSynthesis Fallback
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ar-SA";
        utterance.rate = speechRate;
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setError(err.message || "تعذر تحويل النص إلى صوت حالياً.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = speechRate;
      audioRef.current.play().catch((e) => {
        console.warn("Audio play error, falling back to speech synthesis:", e);
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "ar-SA";
          utterance.rate = speechRate;
          utterance.onstart = () => setIsPlaying(true);
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
        }
      });
      setIsPlaying(true);
    }
  };

  const handleDownloadAudio = () => {
    if (!audioBase64) return;
    const ext = audioMimeType.includes("mp3") ? "mp3" : "wav";
    const link = document.createElement("a");
    link.href = `data:${audioMimeType};base64,${audioBase64}`;
    link.download = `مقطع_صوتي_قلم_${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
      {/* Title & Description */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold font-['Cairo'] text-slate-900 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-600" />
            <span>استوديو تحويل النص إلى صوت (Text-to-Speech)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تحويل أي نص مكتوب إلى مقطع صوتي فصيح بنبرة طبيعية ونطق متقن مع إمكانية التحميل والاستماع المباشر.
          </p>
        </div>
      </div>

      {/* Preset Text Pills for Quick Testing */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">عينات نصوص جاهزة للاستماع السريع:</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {sampleTexts.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setText(sample.text)}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all text-right space-y-1"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>{sample.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">{sample.category}</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{sample.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Text Input Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="ttsInput" className="block text-xs font-bold text-slate-700">
            أدخل النص المراد قراءته وتحويله إلى مقطع صوتي:
          </label>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{wordCount} كلمة</span>
            <span>•</span>
            <span>{charCount} حرف</span>
            {text && (
              <button
                onClick={() => setText("")}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium transition-colors"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>مسح النص</span>
              </button>
            )}
          </div>
        </div>

        <textarea
          id="ttsInput"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب أو ألصق النص هنا (مثلاً: أهلاً بكم في منصة قلم لتحويل الكتابة إلى صوت واحتراف)..."
          rows={5}
          className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-800 text-base leading-relaxed resize-y font-normal"
        />
      </div>

      {/* Voice Selection & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        {/* Voice selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">اختر صوت القارئ الآلي:</label>
          <div className="grid grid-cols-2 gap-2">
            {voices.map((v) => {
              const active = voice === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVoice(v.id)}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md font-semibold"
                      : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-xs font-bold">{v.name}</div>
                  <div className={`text-[10px] mt-1 ${active ? "text-indigo-100" : "text-slate-500"}`}>{v.gender}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Speed & Tashkeel Settings */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">التشكيل التلقائي للنطق الصحيح:</label>
            <div
              onClick={() => setAutoTashkeel(!autoTashkeel)}
              className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl cursor-pointer hover:bg-slate-200/70 transition-colors border border-slate-200/60"
            >
              <span className="text-xs font-semibold text-slate-800">تشكيل أواخر الكلمات تلقائياً قبل القراءة</span>
              <div
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  autoTashkeel ? "bg-indigo-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoTashkeel ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>سرعة القراءة الصوتية:</span>
              <span className="text-indigo-600 font-mono">{speechRate}x</span>
            </div>
            <div className="flex items-center gap-2">
              {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setSpeechRate(rate)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    speechRate === rate
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleGenerateSpeech}
        disabled={isLoading || !text.trim()}
        className={`w-full py-4 rounded-xl font-bold font-['Cairo'] text-base shadow-lg transition-all flex items-center justify-center gap-3 ${
          isLoading || !text.trim()
            ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>جاري معالجة ونطق النص بالذكاء الاصطناعي...</span>
          </>
        ) : (
          <>
            <Volume2 className="w-5 h-5 text-indigo-200" />
            <span>توليد وقراءة النص صوتياً</span>
          </>
        )}
      </button>

      {/* Generated Audio Player Box */}
      {audioBase64 && (
        <div className="p-5 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl text-white space-y-4 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
              <span className="text-sm font-bold font-['Cairo'] text-indigo-100">المقطع الصوتي الجاهز</span>
            </div>
            <button
              onClick={handleDownloadAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل MP3</span>
            </button>
          </div>

          <audio
            ref={audioRef}
            src={`data:${audioMimeType};base64,${audioBase64}`}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onError={(e) => {
              console.warn("Audio element error:", e);
              setIsPlaying(false);
            }}
            className="hidden"
          />

          {/* Custom Player Controls */}
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10">
            <button
              onClick={handleTogglePlay}
              className="w-12 h-12 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 shrink-0"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 mr-0.5" />}
            </button>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-xs text-indigo-200">
                <span>{isPlaying ? "جاري الاستماع التشغيلي..." : "جاهز للتشغيل"}</span>
                <span>السرعة: {speechRate}x</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-indigo-400 transition-all ${
                    isPlaying ? "w-full duration-10000 ease-linear" : "w-0"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
