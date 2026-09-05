import React, { useState, useRef } from "react";
import { Mic, MicOff, Square, Play, Pause, Upload, Wand2, Volume2, Sparkles } from "lucide-react";

interface VoiceToTextModeProps {
  onAudioTranscribed: (transcribedText: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
}

export const VoiceToTextMode: React.FC<VoiceToTextModeProps> = ({
  onAudioTranscribed,
  isLoading,
  setIsLoading,
  setError,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("audio/webm");
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setMimeType("audio/webm");

        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioBase64(base64data);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setError("تعذر الوصول إلى الميكروفون. الرجاء السماح بالإذن في المتصفح أو رفع ملف صوتي.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/") && !file.type.startsWith("video/")) {
      setError("الرجاء اختيار ملف صوتي صالح (MP3, WAV, WEBM, M4A).");
      return;
    }

    setMimeType(file.type || "audio/mp3");
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    const reader = new FileReader();
    reader.onload = () => {
      setAudioBase64(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleTranscribe = async () => {
    if (!audioBase64) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/audio-to-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64,
          mimeType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء تفريغ التسجيل الصوتي.");
      }

      onAudioTranscribed(data.transcribedText);
    } catch (err: any) {
      setError(err.message || "فشل تحويل الصوت لنص حالياً.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold font-['Cairo'] text-slate-900 flex items-center gap-2">
            <Mic className="w-5 h-5 text-indigo-600" />
            <span>تحويل الصوت والتسجيلات إلى نص محرر</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            سجل صوتك مباشرة أو ارفع ملف تسجيلي وسيقوم النظام بتفريغه وتدقيقه وصياغته بنص احترافي.
          </p>
        </div>
      </div>

      {/* Recording & Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Live Mic Recording Card */}
        <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-sm font-bold text-slate-800">التسجيل الصوتي المباشر</div>

          <div className="relative">
            {isRecording && (
              <div className="absolute -inset-3 bg-rose-500/20 rounded-full animate-ping pointer-events-none" />
            )}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
                isRecording
                  ? "bg-rose-600 hover:bg-rose-700 scale-105 ring-4 ring-rose-200"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
              }`}
            >
              {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          <div>
            {isRecording ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-rose-600 animate-pulse">جاري التسجيل الان...</p>
                <p className="text-lg font-mono font-bold text-slate-800">{formatTime(recordingTime)}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">انقر للبدء في تحدث أفكارك أو ملاحظاتك</p>
            )}
          </div>
        </div>

        {/* Upload Audio File Card */}
        <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-sm font-bold text-slate-800">رفع ملف صوتي مخزن</div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl cursor-pointer bg-white transition-all space-y-2"
          >
            <Upload className="w-8 h-8 mx-auto text-indigo-600" />
            <p className="text-xs font-bold text-slate-700">رفع تسجيل (MP3, WAV, M4A, WEBM)</p>
            <p className="text-[11px] text-slate-500">سعة تصل حتى 30 ميجابايت</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Audio Player Preview & Transcribe Button */}
      {audioUrl && (
        <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>المقطع الصوتي الجاهز للتفريغ:</span>
            </span>
          </div>

          <audio
            key={audioUrl}
            src={audioUrl}
            controls
            onError={(e) => console.warn("VoiceToText audio source error:", e)}
            className="w-full h-10 rounded-lg"
          />

          <button
            onClick={handleTranscribe}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold font-['Cairo'] text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري تحويل التسجيل الصوتي إلى نص...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>تفريغ الصوت وتحويله إلى نص احترافي</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
