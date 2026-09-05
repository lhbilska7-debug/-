import React, { useState } from "react";
import { TransformResult } from "../types";
import { X, Search, Trash2, Bookmark, BookmarkCheck, Copy, ArrowLeft, History, Check, Calendar } from "lucide-react";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: TransformResult[];
  onSelectResult: (result: TransformResult) => void;
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
  onDeleteResult: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onToggleFavorite,
  onClearHistory,
  onDeleteResult,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.transformedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorite = filterFavorites ? item.isFavorite : true;
    return matchesSearch && matchesFavorite;
  });

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold font-['Cairo'] text-slate-900">سجل النصوص التحويلية</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
              {history.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 border-b border-slate-100 space-y-2 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث في النصوص السابقة..."
              className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setFilterFavorites(!filterFavorites)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-semibold transition-all ${
                filterFavorites
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <BookmarkCheck className={`w-3.5 h-3.5 ${filterFavorites ? "fill-amber-500" : ""}`} />
              <span>المفضلة فقط</span>
            </button>

            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-rose-600 hover:text-rose-700 text-xs font-semibold hover:underline"
              >
                مسح الكل
              </button>
            )}
          </div>
        </div>

        {/* List of saved results */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <History className="w-10 h-10 mx-auto stroke-1" />
              <p className="text-xs font-bold text-slate-600">لا توجد نصوص سابقة محفوظة</p>
              <p className="text-[11px]">أي نص تقوم بصياغته سيتم حفظه تلقائياً للرجوع إليه وقتما تشاء.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs bg-white transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {item.tone === "formal" ? "رسمي" : item.tone === "academic" ? "أكاديمي" : "صياغة احترافية"}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleDateString("ar-SA")}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className="text-slate-400 hover:text-amber-500"
                    >
                      {item.isFavorite ? (
                        <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteResult(item.id);
                      }}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-relaxed">
                  {item.transformedText}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span className="truncate max-w-[200px]">الأصل: {item.originalText}</span>
                  <button
                    onClick={(e) => handleCopy(e, item.transformedText, item.id)}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold"
                  >
                    {copiedId === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === item.id ? "تم النسخ" : "نسخ"}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
