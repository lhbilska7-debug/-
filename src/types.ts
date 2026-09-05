export type AppMode = "lesson_summary" | "exam_solver" | "ask_ai";

export type ToneType = "formal" | "academic" | "persuasive" | "creative" | "concise" | "diplomatic";

export type ActionType = "rewrite" | "proofread" | "summarize" | "expand" | "email" | "report";

export type TashkeelType = "none" | "smart" | "full";

export interface TransformConfig {
  tone: ToneType;
  action: ActionType;
  tashkeel: TashkeelType;
  convertToMsa: boolean;
  customInstructions: string;
}

export interface TransformResult {
  id: string;
  originalText: string;
  transformedText: string;
  notes?: string;
  tone: ToneType;
  action: ActionType;
  timestamp: number;
  isFavorite?: boolean;
  sourceType?: "text" | "ocr" | "voice" | "template";
}

export interface PresetExample {
  id: string;
  title: string;
  category: string;
  description: string;
  originalText: string;
  suggestedConfig: Partial<TransformConfig>;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
  fields: {
    id: string;
    label: string;
    placeholder: string;
    type: "text" | "textarea";
    required?: boolean;
  }[];
}
