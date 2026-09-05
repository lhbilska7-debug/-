import React, { useState } from "react";
import { Settings, Eye, Check, DollarSign, Layout, ShieldCheck, Copy, Code, Sparkles, X } from "lucide-react";

interface AdManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  showTopAd: boolean;
  setShowTopAd: (show: boolean) => void;
  showSidebarAd: boolean;
  setShowSidebarAd: (show: boolean) => void;
  showNativeAd: boolean;
  setShowNativeAd: (show: boolean) => void;
  showStickyFooterAd: boolean;
  setShowStickyFooterAd: (show: boolean) => void;
}

export const AdManagerModal: React.FC<AdManagerModalProps> = ({
  isOpen,
  onClose,
  showTopAd,
  setShowTopAd,
  showSidebarAd,
  setShowSidebarAd,
  showNativeAd,
  setShowNativeAd,
  showStickyFooterAd,
  setShowStickyFooterAd,
}) => {
  const [adSenseId, setAdSenseId] = useState<string>("pub-1234567890123456");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sampleAdCode = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}"
     crossorigin="anonymous"></script>
<!-- Qalam App Banner Slot -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${adSenseId}"
     data-ad-slot="9876543210"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleAdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto font-['Tajawal']">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
              <Layout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Cairo'] text-slate-900">
                إدارة المساحات الإعلانية (Ad Placement Center)
              </h3>
              <p className="text-xs text-slate-500">
                تخصيص وتفعيل إعلانات Google AdSense لزيادة عائدات واستدامة الموقع.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ad Placements Toggles */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-indigo-600" />
            <span>مواقع ظهور الإعلانات في التطبيق:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Top Leaderboard */}
            <div
              onClick={() => setShowTopAd(!showTopAd)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                showTopAd ? "bg-amber-50/60 border-amber-300 text-amber-950" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <div>
                <strong className="block text-xs font-bold">إعلان أعلى الصفحة (Header Banner 728x90)</strong>
                <span className="text-[11px] text-slate-500">يظهر فوق أدوات الصياغة مباشرة</span>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                  showTopAd ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"
                }`}
              >
                {showTopAd ? <Check className="w-3.5 h-3.5" /> : null}
              </div>
            </div>

            {/* Native In-Content Ad */}
            <div
              onClick={() => setShowNativeAd(!showNativeAd)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                showNativeAd ? "bg-amber-50/60 border-amber-300 text-amber-950" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <div>
                <strong className="block text-xs font-bold">إعلان مدمج بالمحتوى (Native Banner)</strong>
                <span className="text-[11px] text-slate-500">يظهر تحت النتيجة المستخرجة مباشرة</span>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                  showNativeAd ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"
                }`}
              >
                {showNativeAd ? <Check className="w-3.5 h-3.5" /> : null}
              </div>
            </div>

            {/* Sidebar Ad */}
            <div
              onClick={() => setShowSidebarAd(!showSidebarAd)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                showSidebarAd ? "bg-amber-50/60 border-amber-300 text-amber-950" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <div>
                <strong className="block text-xs font-bold">إعلان جانبي (Sidebar Box 300x250)</strong>
                <span className="text-[11px] text-slate-500">يظهر بجانب لوحة العمل</span>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                  showSidebarAd ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"
                }`}
              >
                {showSidebarAd ? <Check className="w-3.5 h-3.5" /> : null}
              </div>
            </div>

            {/* Sticky Footer Ad */}
            <div
              onClick={() => setShowStickyFooterAd(!showStickyFooterAd)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                showStickyFooterAd ? "bg-amber-50/60 border-amber-300 text-amber-950" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <div>
                <strong className="block text-xs font-bold">إعلان عائم أسفل الشاشة (Sticky Footer)</strong>
                <span className="text-[11px] text-slate-500">شريط ثابت يعظم نسبة النقر (CTR)</span>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                  showStickyFooterAd ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"
                }`}
              >
                {showStickyFooterAd ? <Check className="w-3.5 h-3.5" /> : null}
              </div>
            </div>
          </div>
        </div>

        {/* AdSense Publisher Code Integration */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800">
            معرف الناشر لـ Google AdSense (Publisher ID):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={adSenseId}
              onChange={(e) => setAdSenseId(e.target.value)}
              placeholder="pub-XXXXXXXXXXXXXXXX"
              className="flex-1 p-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-mono font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-indigo-600" />
                كود الإعلان الجاهز للربط المباشر:
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? "تم النسخ!" : "نسخ كود AdSense"}</span>
              </button>
            </div>

            <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 text-[10px] font-mono overflow-x-auto dir-ltr text-left border border-slate-800">
              {sampleAdCode}
            </pre>
          </div>
        </div>

        {/* Save & Close Button */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs font-['Cairo'] transition-colors shadow-sm"
          >
            حفظ واستعراض الإعلانات
          </button>
        </div>
      </div>
    </div>
  );
};
