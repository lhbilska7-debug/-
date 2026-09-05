import React, { useState } from "react";
import { DOCUMENT_TEMPLATES } from "../data/presets";
import { DocumentTemplate, TransformConfig } from "../types";
import { FileText, Briefcase, TrendingUp, UserMinus, Wand2, ArrowRight } from "lucide-react";

interface TemplatesModeProps {
  onGenerateDocument: (constructedText: string, config: TransformConfig) => void;
  isLoading: boolean;
}

export const TemplatesMode: React.FC<TemplatesModeProps> = ({
  onGenerateDocument,
  isLoading,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(DOCUMENT_TEMPLATES[0]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setFormValues({});
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Briefcase":
        return <Briefcase className="w-5 h-5 text-indigo-600" />;
      case "TrendingUp":
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case "UserMinus":
        return <UserMinus className="w-5 h-5 text-rose-600" />;
      default:
        return <FileText className="w-5 h-5 text-indigo-600" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    // Construct raw text from fields
    let constructedText = `نوع المستند المطلوب صياغته بشكل متكامل: ${selectedTemplate.title}\n\n`;
    selectedTemplate.fields.forEach((field) => {
      const val = formValues[field.id] || "";
      if (val.trim()) {
        constructedText += `${field.label}:\n${val.trim()}\n\n`;
      }
    });

    const config: TransformConfig = {
      tone: "formal",
      action: selectedTemplate.id === "proposal-pitch" ? "rewrite" : "email",
      tashkeel: "none",
      convertToMsa: true,
      customInstructions: `قم بتوليد وسرد المستند الكامل جاهزاً للطباعة والاستخدام الفوري مع إضافة المكونات الشكلية الرسمية المناسبة لنوع المستند: (${selectedTemplate.title}).`,
    };

    onGenerateDocument(constructedText, config);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold font-['Cairo'] text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>صانع الخطابات والمستندات الرسمية المباشر</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          اختر نوع القالب الرسمي، وأدخل البيانات الأساسية فقط وسيتكفل الذكاء الاصطناعي بصياغة مستند كامل ومحترف.
        </p>
      </div>

      {/* Template selector pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DOCUMENT_TEMPLATES.map((tmpl) => {
          const active = selectedTemplate?.id === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                active
                  ? "bg-indigo-50/90 border-indigo-500 shadow-xs ring-1 ring-indigo-500"
                  : "bg-slate-50/60 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-xs">
                  {getIcon(tmpl.iconName)}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{tmpl.title}</h3>
                  <span className="text-[10px] text-indigo-600 font-semibold">{tmpl.category}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{tmpl.description}</p>
            </div>
          );
        })}
      </div>

      {/* Selected Template Form */}
      {selectedTemplate && (
        <form onSubmit={handleSubmit} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 font-['Cairo'] border-b border-slate-200 pb-3">
            <span>تعبئة بيانات:</span>
            <span className="text-indigo-600">{selectedTemplate.title}</span>
          </div>

          <div className="space-y-3">
            {selectedTemplate.fields.map((field) => (
              <div key={field.id} className="space-y-1">
                <label htmlFor={field.id} className="block text-xs font-bold text-slate-700">
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    required={field.required}
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden"
                  />
                ) : (
                  <input
                    id={field.id}
                    type="text"
                    required={field.required}
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
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
                <span>جاري بناء وصياغة المستند بالكامل...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-indigo-200" />
                <span>توليد وصياغة المستند الآن</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
