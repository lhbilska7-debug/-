import React, { useState, useRef } from "react";
import { Sparkles, Send, Upload, Copy, Check, Lightbulb, Bot, User, Trash2 } from "lucide-react";
import { TransformResult } from "../types";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  image?: string;
  timestamp: number;
}

interface AskAiModeProps {
  onSaveToHistory?: (result: TransformResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
}

// Simple bold text renderer for markdown-like **bold** segments
function renderWithBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-indigo-950 bg-indigo-50/60 px-1 py-0.5 rounded">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Clean custom markdown formatter
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-2 text-slate-800 leading-relaxed text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 font-['Cairo'] text-sm mt-3 pt-1 border-b border-slate-100 pb-1 text-indigo-900">
              {trimmed.replace("### ", "")}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="font-bold text-slate-900 font-['Cairo'] text-base mt-4 text-indigo-950 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
              <span>{trimmed.replace("## ", "")}</span>
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={idx} className="font-bold text-slate-900 font-['Cairo'] text-lg mt-4 text-indigo-950">
              {trimmed.replace("# ", "")}
            </h2>
          );
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <span>{renderWithBold(trimmed.substring(2))}</span>
            </div>
          );
        }
        // Numbered list items like "1. ", "2. "
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pr-1">
              <span className="font-bold text-indigo-700 text-xs px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 shrink-0">
                {numMatch[1]}
              </span>
              <span>{renderWithBold(numMatch[2])}</span>
            </div>
          );
        }
        return (
          <p key={idx} className="leading-relaxed">
            {renderWithBold(line)}
          </p>
        );
      })}
    </div>
  );
}

export const AskAiMode: React.FC<AskAiModeProps> = ({
  onSaveToHistory,
  isLoading,
  setIsLoading,
  setError,
}) => {
  const [question, setQuestion] = useState<string>("");
  const [subject, setSubject] = useState<string>("عام");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      text: `مرحباً بك! 👋 أنا **معلمك ومساعدك الذكي**. 
اطرح عليّ أي سؤال أو مسألة دراسية في أي مادة، أو ارفع صورة تمرين، وسأشرح لك الفكرة خطوة بخطوة بطريقة مبسطة وممتعة. 

ما الذي تود فهمه اليوم؟ 📚✨`,
      timestamp: Date.now(),
    },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    {
      label: "فلسفة",
      q: "كيف أكتب مقدمة مقال فلسفي متكاملة تطرح الإشكالية بدقة؟",
    },
    {
      label: "رياضيات",
      q: "اشرح لي فكرة الاشتقاق والنهايات بمثال من الحياة اليومية.",
    },
    {
      label: "لغة عربية",
      q: "ما الفرق بين الاستعارة المكنية والتصريحية مع أمثلة شعرية؟",
    },
    {
      label: "فيزياء",
      q: "بسط لي قوانين نيوتن للحركة وكيف نطبقها في حل المسائل.",
    },
    {
      label: "علوم طبيعية",
      q: "كيف يعمل جهاز المناعة في التصدي للفيروسات بالتفصيل؟",
    },
    {
      label: "تنظيم وقت",
      q: "ما هي أفضل خطة لمراجعة المواد الدراسية قبل الامتحان بأسبوع؟",
    },
  ];

  const subjects = [
    "عام وتوجيه دراسي",
    "رياضيات",
    "فيزياء وكيمياء",
    "علوم أحياء وطبيعة",
    "فلسفة ومنطق",
    "لغة عربية ونحو",
    "تاريخ وجغرافيا",
    "لغات أجنبية",
    "قانون واقتصاد",
  ];

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("الرجاء رفع صورة صالحة (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || question).trim();
    if (!textToSend && !imagePreview) return;

    const userMessage: Message = {
      id: "user-" + Date.now(),
      role: "user",
      text: textToSend,
      image: imagePreview || undefined,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    const currentImg = imagePreview;
    setImagePreview(null);
    setIsLoading(true);
    setError(null);
    scrollToBottom();

    try {
      // Build conversation history for API
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          subject,
          history: historyPayload,
          imageData: currentImg,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل الحصول على إجابة من المعلم الذكي.");
      }

      const assistantMessage: Message = {
        id: "ai-" + Date.now(),
        role: "assistant",
        text: data.answer,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      scrollToBottom();

      // Save to global history if callback provided
      if (onSaveToHistory) {
        const historyItem: TransformResult = {
          id: "ask-" + Date.now(),
          originalText: textToSend || "سؤال مع صورة مرفقة",
          transformedText: data.answer,
          notes: `سؤال ذكاء اصطناعي | مادة: ${subject}`,
          tone: "academic",
          action: "expand",
          timestamp: Date.now(),
          sourceType: currentImg ? "ocr" : "text",
        };
        onSaveToHistory(historyItem);
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء التواصل مع المعلم الذكي.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        text: "مرحباً مجدداً! تم بدء محادثة دراسية جديدة. اطرح سؤالك وسأجيبك فوراً.",
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-6">
      {/* Title & Subject Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold font-['Cairo'] text-slate-900 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Bot className="w-5 h-5" />
            </span>
            <span>اسأل الذكاء الاصطناعي — المساعد والمعلم الدراسي الفوري</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            استفسر عن أي درس أو مفهوم غامض، واطلب توضيح المسائل المعقدة وشروحات خطوة بخطوة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold focus:ring-2 focus:ring-indigo-100"
          >
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {messages.length > 1 && (
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-600 transition-colors"
              title="بدء محادثة جديدة"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>أسئلة ومواضيع مقترحة للاستفسار:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(sq.q)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 hover:text-indigo-900 text-xs transition-all text-right flex items-center gap-1.5 shadow-2xs"
            >
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-indigo-600 border border-slate-200">
                {sq.label}
              </span>
              <span>{sq.q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
        {messages.map((msg) => {
          const isAi = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-sm leading-relaxed ${
                isAi ? "flex-row text-right" : "flex-row-reverse text-right"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  isAi
                    ? "bg-indigo-600 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2 shadow-xs ${
                  isAi
                    ? "bg-white border border-slate-200/90 text-slate-800"
                    : "bg-indigo-600 text-white border border-indigo-700"
                }`}
              >
                {msg.image && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-slate-200 max-w-xs">
                    <img src={msg.image} alt="صورة مرفقة" className="w-full h-auto max-h-48 object-cover" />
                  </div>
                )}

                {isAi ? (
                  <div className="max-w-none">
                    <MarkdownContent content={msg.text} />
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                )}

                {/* Footer of Bubble */}
                {isAi && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-bold text-indigo-600">
                      <Sparkles className="w-3 h-3" />
                      إجابة المعلم الذكي
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="hover:text-slate-700 font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>نسخ الإجابة</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 text-sm">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-slate-600 flex items-center gap-2 shadow-xs">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-indigo-900">المعلم الذكي يفكك السؤال ويُعد الشرح المبسط...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box & Attachment */}
      <div className="space-y-3">
        {imagePreview && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 border border-slate-200 max-w-sm">
            <div className="flex items-center gap-2">
              <img src={imagePreview} alt="مرفق" className="w-10 h-10 object-cover rounded-lg" />
              <span className="text-xs font-bold text-slate-700">صورة مرفقة مع السؤال</span>
            </div>
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="text-xs text-rose-600 hover:underline font-bold px-2 py-1"
            >
              إلغاء
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 bg-white rounded-2xl border border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 p-2 shadow-xs">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            title="إرفاق صورة سؤال أو تمرين (كتاب، دفتر، سبورة)"
          >
            <Upload className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="اكتب سؤالك هنا بالتفصيل (اضغط Enter للإرسال)..."
            rows={2}
            className="flex-1 p-2 bg-transparent text-slate-800 text-sm focus:outline-hidden resize-none leading-relaxed"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isLoading || (!question.trim() && !imagePreview)}
            className={`p-3 rounded-xl font-bold transition-all shrink-0 flex items-center justify-center ${
              isLoading || (!question.trim() && !imagePreview)
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
            }`}
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
