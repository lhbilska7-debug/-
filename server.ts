import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase JSON body payload limit for image & audio uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Helper to instantiate GenAI server-side with User-Agent
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Text Transformation API (Rewriting, Styling, Tashkeel, Grammar, Dialect conversion)
app.post("/api/transform-text", async (req, res) => {
  try {
    const {
      text,
      tone = "formal",
      tashkeel = "none",
      format = "preserve",
      targetDialect = "msa",
      customInstructions = "",
      action = "rewrite", // rewrite, summarize, expand, proofread, email, report
    } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "الرجاء تقديم نص صالح للتحويل." });
    }

    const ai = getGenAI();

    let systemPrompt = `أنت خبير محترف في تحرير، تحسين، وإعادة صياغة النصوص باللغة العربية واللغات الأخرى بأعلى معايير البلاغة والفصاحة والدقة الإدارية والأكاديمية.
شعارك هو تحويل الكتابة إلى نص راقٍ، متناسق، احترافي، خالي تماماً من الأخطاء الإملائية والنحوية.

إرشادات التحويل:
1. حافظ على المعنى الأساسي والأفكار الجوهرية.
2. استخدم صياغة قوية، ثرية بالمفردات المناسبة للنبرة المطلوبة.
3. قم بتنظيم الفقرات وتنسيق العناوين أو القوائم إن كان ذلك يحسن من مقروئية النص.
4. إذا طُلِب التشكيل، قم بتطبيق قواعد التشكيل بدقة دون إفراط يسبب التشويش.
`;

    let userPrompt = `النص الأصلي المراد تحويله:\n"""\n${text}\n"""\n\n`;

    if (action === "proofread") {
      userPrompt += `المطلوب: تصحيح الأخطاء اللغوية والنحوية والإملائية فقط مع الحفاظ على الأسلوب، وتحسين الصياغة طفيفاً لتصبح سليمة 100%.\n`;
    } else if (action === "summarize") {
      userPrompt += `المطلوب: تلخيص النص بشكل احترافي في نقاط رئيسية مركزة مع فقرة مقتضبة للملخص التنفيذي.\n`;
    } else if (action === "expand") {
      userPrompt += `المطلوب: التوسع في شرح النقاط وتطوير الأفكار بأسلوب رصين وغني بالتفاصيل والشروحات التوضيحية.\n`;
    } else if (action === "email") {
      userPrompt += `المطلوب: صياغة النص على شكل بريد إلكتروني رسمي احترافي يتضمن موضوعاً مناسباً (Subject)، تحية لائقة، صلب الموضوع، وخاتمة إدارية.\n`;
    } else if (action === "report") {
      userPrompt += `المطلوب: إعادة صياغة النص كتقرير إداري/تنفيذي مهيكل يحتوي على مقدمة، أهداف، أفكار رئيسية، وتوصيات ختامية.\n`;
    } else {
      userPrompt += `المطلوب: إعادة صياغة وتحسين النص بأسلوب احترافي.\n`;
    }

    // Apply Tone
    const toneMap: Record<string, string> = {
      formal: "نبرة رسمية إدارية راقية مناسبة للمخاطبات الحكومية والشركات.",
      academic: "نبرة أكاديمية علمية دقيقة وموثقة المصطلحات.",
      persuasive: "نبرة إقناعية تسويقية جاذبة ومؤثرة.",
      creative: "نبرة إبداعية أدبية بليغة واستعارات بيانية راقية.",
      concise: "نبرة موجزة ومباشرة جداً دون إسهاب.",
      diplomatic: "نبرة دبلوماسية ودودة ولطيفة جداً.",
    };
    if (toneMap[tone]) {
      userPrompt += `النبرة والأسلوب: ${toneMap[tone]}\n`;
    }

    // Handle Dialect
    if (targetDialect === "msa") {
      userPrompt += `التحويل اللغوي: تحويل أي كلمات عامية أو تعبيرات شفهية إلى اللغة العربية الفصحى الحديثة والمشرقة.\n`;
    }

    // Handle Tashkeel
    if (tashkeel === "full") {
      userPrompt += `التشكيل: إضافة التشكيل الكامل على جميع حروف الكلمات.\n`;
    } else if (tashkeel === "smart") {
      userPrompt += `التشكيل: تشكيل أواخر الكلمات والكلمات المحتملة للالتباس فقط (تشكيل ذكي للحفاظ على الانسيابية).\n`;
    }

    // Custom instructions
    if (customInstructions && customInstructions.trim()) {
      userPrompt += `تعليمات إضافية خاصة من المستخدم: ${customInstructions.trim()}\n`;
    }

    userPrompt += `\nالرجاء تقديم النص النهائي المطور مباشرة، متبوعاً بقسم قصير جداً في النهاية بعنوان "[ملاحظات التحسين]" يشرح بأيجاز (2-3 أسطر) التحسينات الرئيسية التي تم إجراؤها.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      },
    });

    const fullResponse = response.text || "";
    let transformedText = fullResponse;
    let notes = "";

    if (fullResponse.includes("[ملاحظات التحسين]")) {
      const parts = fullResponse.split("[ملاحظات التحسين]");
      transformedText = parts[0].trim();
      notes = parts[1].trim();
    }

    return res.json({
      originalText: text,
      transformedText,
      notes,
    });
  } catch (error: any) {
    console.error("Error in /api/transform-text:", error);
    return res.status(500).json({
      error: error.message || "حدث خطأ أثناء تحويل النص. الرجاء المحاولة مرة أخرى.",
    });
  }
});

// 2. OCR Handwriting & Image to Text API
app.post("/api/ocr-handwriting", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", prompt = "" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "الرجاء رفع صورة تحتوي على كتابة أو خط يدوي." });
    }

    const ai = getGenAI();

    // Clean base64 string if data URL prefix exists
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const imagePart = {
      inlineData: {
        mimeType,
        data: cleanBase64,
      },
    };

    const textPrompt = `أنت خبير في التعرف الضوئي على الحروف (OCR) والخطوط اليدوية باللغة العربية والإنجليزية.
قم بقراءة واستخراج جميع النصوص المكتوبة باليد أو المطبوعة في هذه الصورة بدقة فائقة.
ثم قم بتنسيقها وتنظيمها ونقلها إلى نص مطبوع احترافي واضح ومقسم إلى فقرات وعناوين إن وجدت.

تعليمات:
1. استخرج النص كما هو مع تصحيح الكلمات المعوجة أو غير الواضحة بناءً على سياق الجملة.
2. نسّق القوائم والجداول إذا كانت الصورة تحتوي على رؤوس أقلام أو جداول.
3. ${prompt ? `تعليمات إضافية: ${prompt}` : "قم بصياغة النص بشكل منظم ورصين."}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [imagePart, { text: textPrompt }],
      },
    });

    return res.json({
      extractedText: response.text || "",
    });
  } catch (error: any) {
    console.error("Error in /api/ocr-handwriting:", error);
    return res.status(500).json({
      error: error.message || "فشل التعرف على النص من الصورة. الرجاء التأكد من وضوح الخط والمحاولة مجدداً.",
    });
  }
});

// 3. Audio / Speech to Text API
app.post("/api/audio-to-text", async (req, res) => {
  try {
    const { audioBase64, mimeType = "audio/wav", prompt = "" } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: "الرجاء تسجيل أو رفع ملف صوتي." });
    }

    const ai = getGenAI();

    const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, "");

    const audioPart = {
      inlineData: {
        mimeType,
        data: cleanBase64,
      },
    };

    const textPrompt = `قم بتفريغ التسجيل الصوتي بدقة عالية وتحويل الكلمات الملفوظة إلى نص مكتوب احترافي باللغة العربية الفصحى.
- ضع علامات الترقيم المناسبة (نقاط، فواصل، علامات استفهام).
- قسم الكلام إلى فقرات مقروءة ومرتبة.
- صحح العثرات التعبيرية أو التكرارات اللفظية السريعة مع الحفاظ التام على أفكار المتحدث.
${prompt ? `تعليمات خاصة: ${prompt}` : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [audioPart, { text: textPrompt }],
      },
    });

    return res.json({
      transcribedText: response.text || "",
    });
  } catch (error: any) {
    console.error("Error in /api/audio-to-text:", error);
    return res.status(500).json({
      error: error.message || "فشل تحويل الصوت إلى نص. الرجاء التأكد من جودة التسجيل والمحاولة مرة أخرى.",
    });
  }
});

// Helper to wrap raw 16-bit mono PCM into a standard WAV audio container
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1): Buffer {
  const wavHeader = Buffer.alloc(44);
  const dataSize = pcmBuffer.length;
  const fileSize = 36 + dataSize;

  // RIFF header
  wavHeader.write("RIFF", 0);
  wavHeader.writeUInt32LE(fileSize, 4);
  wavHeader.write("WAVE", 8);

  // fmt chunk
  wavHeader.write("fmt ", 12);
  wavHeader.writeUInt32LE(16, 16); // Subchunk1Size
  wavHeader.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(sampleRate * numChannels * 2, 28); // ByteRate
  wavHeader.writeUInt16LE(numChannels * 2, 32); // BlockAlign
  wavHeader.writeUInt16LE(16, 34); // BitsPerSample

  // data chunk
  wavHeader.write("data", 36);
  wavHeader.writeUInt32LE(dataSize, 40);

  return Buffer.concat([wavHeader, pcmBuffer]);
}

// 4. Text-to-Speech API using Gemini TTS
app.post("/api/text-to-speech", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "الرجاء تقديم نص للاستماع إليه." });
    }

    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `اقرأ النص التالي بصوت واضح ونطق فصيح ومخارج حروف سليمة:\n\n${text.slice(0, 800)}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;

    if (!inlineData || !inlineData.data) {
      return res.status(500).json({ error: "تعذر توليد المقطع الصوتي." });
    }

    let audioBuffer = Buffer.from(inlineData.data, "base64");
    let mimeType = inlineData.mimeType || "audio/wav";

    // If Gemini returned raw PCM, convert it to standard RIFF/WAV for browser compatibility
    if (
      mimeType.includes("pcm") ||
      mimeType.includes("raw") ||
      (!mimeType.includes("mp3") && !mimeType.includes("wav") && !mimeType.includes("ogg"))
    ) {
      let sampleRate = 24000;
      const rateMatch = mimeType.match(/rate=(\d+)/);
      if (rateMatch) {
        sampleRate = parseInt(rateMatch[1], 10);
      }
      audioBuffer = pcmToWav(audioBuffer, sampleRate);
      mimeType = "audio/wav";
    }

    return res.json({
      audioBase64: audioBuffer.toString("base64"),
      mimeType,
    });
  } catch (error: any) {
    console.error("Error in /api/text-to-speech:", error);
    return res.status(500).json({
      error: error.message || "تعذر تشغيل الصوت للنص حالياً.",
    });
  }
});

// 5. Lesson Summarizer API
app.post("/api/summarize-lesson", async (req, res) => {
  try {
    const {
      text,
      subject = "عام",
      level = "متوسط/ثانوي",
      summaryStyle = "comprehensive", // comprehensive, flashcards, mindmap, qa
      imageData, // optional base64 image of lesson page
    } = req.body;

    if ((!text || typeof text !== "string" || text.trim().length === 0) && !imageData) {
      return res.status(400).json({ error: "الرجاء كتابة نص الدرس أو رفع صورة الصفحة المراد تلخيصها." });
    }

    const ai = getGenAI();
    let promptText = `أنت أستاذ وخبير تربوي متخصص في تلخيص الدروس والمناهج التعليمية وإعداد المذكرات الدراسية الشاملة والمبسطة للطلاب.
المادة الدراسية: ${subject}
المستوى التعليمي: ${level}

طبيعة التلخيص المطلوبة: `;

    if (summaryStyle === "flashcards") {
      promptText += `إعداد بطاقات مراجعة سريعة (سؤال وجواب قصير وجامع) لتسهيل الحفظ السريع قبل الامتحان.\n`;
    } else if (summaryStyle === "mindmap") {
      promptText += `إعداد مخطط هيكلي (شجرة مفاهيم / خريطة ذهنية نصية) يُظهر العلاقات بين المفاهيم الرئيسية والفرعية.\n`;
    } else if (summaryStyle === "qa") {
      promptText += `إصدار دليل مراجعة يحتوي على أهم 5 إلى 10 أسئلة متوقعة في الامتحان مع إجاباتها النموذجية.\n`;
    } else {
      promptText += `تلخيص دراسي شامل ومبسط يشمل:\n1. الأفكار والرؤوس الأقلام الجوهرية.\n2. المصطلحات والتعريفات الهامة.\n3. الشرح التبسيطي.\n4. ملخص مقتضب في 3 أسطر لتسهيل الاستيعاب السريع.\n`;
    }

    const contents: any[] = [];
    if (imageData) {
      const cleanedBase64 = imageData.replace(/^data:image\/\w+;base64,/, "");
      contents.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanedBase64,
        },
      });
      promptText += `ملاحظة: النص أو المادة مأخوذة من صورة الدرس المرفقة، يرجى قراءتها بدقة وتلخيصها.\n`;
    }

    if (text && text.trim().length > 0) {
      promptText += `نص الدرس المراد تلخيصها:\n"""\n${text}\n"""\n`;
    }

    contents.push(promptText);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const summary = response.text || "تعذر إكمال تلخيص الدرس.";

    return res.json({
      summaryText: summary,
      subject,
      level,
      summaryStyle,
    });
  } catch (error: any) {
    console.error("Error in /api/summarize-lesson:", error);
    return res.status(500).json({
      error: error.message || "حدث خطأ أثناء تلخيص الدرس.",
    });
  }
});

// 5b. Generate Exam from Lesson API (امتحان مستخرج من محتوى الدرس)
app.post("/api/generate-lesson-exam", async (req, res) => {
  try {
    const {
      lessonText,
      subject = "عام",
      level = "ثانوي/بكالوريا",
      examFormat = "standard", // standard, qcm, express, challenging
      includeGradingScheme = true,
      questionCount = "standard",
      imageData,
    } = req.body;

    if ((!lessonText || typeof lessonText !== "string" || lessonText.trim().length === 0) && !imageData) {
      return res.status(400).json({ error: "الرجاء إدخال نص الدرس أو صورة صفحة الدرس لتوليد الامتحان." });
    }

    const ai = getGenAI();

    let formatDesc = "";
    if (examFormat === "qcm") {
      formatDesc = `اختبار بنظام الاختيار من متعدد (QCM): يتكون من 8 إلى 10 أسئلة دقيقة مستوحاة من تفاصيل ومفاهيم الدرس، مع 4 خيارات لكل سؤال (أ، ب، ج، د)، ثم ملحق للإجابات الصحيحة وتفسير سبب صحتها.`;
    } else if (examFormat === "express") {
      formatDesc = `اختبار سريع (Quick Quiz 10 دقائق): 4 إلى 5 أسئلة مباشرة وسريعة لقياس مدى الاستيعاب الفوري لنقاط الدرس الأساسية مع حلها النموذجي المختصر.`;
    } else if (examFormat === "challenging") {
      formatDesc = `امتحان متميز وتطبيقي متقدم: يركز على الفهم العميق، الاستنتاج، المقارنة، وتطبيق المعارف على وضعيات ومسائل غير مسبوقة مستخرجة من جوهر الدرس، مع سلم تنقيط دقيق.`;
    } else {
      formatDesc = `فرض / امتحان رسمي نموذجي شامل (على 20 نقطة) مقسم كالتالي:
- الجزء الأول: استرداد المعارف والتعريفات والمصطلحات الأساسية (6 نقاط).
- الجزء الثاني: أسئلة الفهم والتحليل والتطبيق المباشر على معطيات الدرس (8 نقاط).
- الجزء الثالث: سؤال تركيبي أو وضعية إدماجية / مسألة تقويمية (6 نقاط).
- ملحق نهائي: عناصر الإجابة النموذجية وسلم التنقيط المفصل خطوة بخطوة.`;
    }

    let promptText = `أنت مفتش تربوي وأستاذ أول متخصص في وضع الامتحانات الرسمية والاختبارات التقييمية لجميع المناهج والمستويات الدراسية.
المادة: ${subject}
المستوى الدراسي المستهدف: ${level}
طبيعة ونوع الامتحان المطلوب:
${formatDesc}

تعليمات مهمة لصياغة الامتحان:
1. استخرج الأسئلة حصرياً وبدقة من المعارف والأفكار والقوانين الواردة في هذا الدرس المرفق.
2. ضع وزناً عددياً (النقاط) بجانب كل سؤال ليحاكي الامتحانات الرسمية.
3. اكتب عنواناً واضحاً للامتحان (مثال: فرض تقويمي في مادة ${subject} - موضوع: [عنوان مستوحى من الدرس]).
4. ${includeGradingScheme ? "يجب أن ترفق في نهاية ورقة الامتحان قسماً مستقلاً بعنوان '## 📝 عناصر الإجابة النموذجية وسلم التنقيط' يوضح الإجابة الشافية لكل سؤال وكيفية توزيع النقاط." : "اقتصر على ورقة الأسئلة فقط دون إرفاق الحلول."}
5. نسق المحتوى بدقة وعناية باستخدام عناوين Markdown وقوائم منسقة لتسهيل الطباعة والمراجعة.`;

    const contents: any[] = [];
    if (imageData) {
      const cleanedBase64 = imageData.replace(/^data:image\/\w+;base64,/, "");
      contents.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanedBase64,
        },
      });
      promptText += `\nملاحظة: نص ومفردات الدرس مأخوذة من صورة الدرس المرفقة، اقرأها بدقة واصنع منها الامتحان المطلوب.\n`;
    }

    if (lessonText && lessonText.trim().length > 0) {
      promptText += `\nمحتوى الدرس المستند عليه في صياغة الامتحان:\n"""\n${lessonText}\n"""\n`;
    }

    contents.push(promptText);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        temperature: 0.3,
      },
    });

    const examPaper = response.text || "تعذر توليد الامتحان من هذا الدرس.";

    return res.json({
      examText: examPaper,
      subject,
      level,
      examFormat,
    });
  } catch (error: any) {
    console.error("Error in /api/generate-lesson-exam:", error);
    return res.status(500).json({
      error: error.message || "حدث خطأ أثناء توليد الامتحان من الدرس.",
    });
  }
});

// 6. Exam & Quiz Solver API
app.post("/api/solve-exam", async (req, res) => {
  try {
    const {
      questionText,
      subject = "عام",
      educationLevel = "ثانوي/جامعي",
      imageData, // optional base64 image of exam paper
    } = req.body;

    if ((!questionText || typeof questionText !== "string" || questionText.trim().length === 0) && !imageData) {
      return res.status(400).json({ error: "الرجاء إدخال نص السؤال أو رفع صورة ورقة الامتحان." });
    }

    const ai = getGenAI();

    let systemInstructions = `أنت خبير ومعلم ألمعي متخصص في حل الامتحانات والاختبارات المدرسية والجامعية وتفكيك الأسئلة المعقدة بأسلوب تعليمي ودقيق جداً.
المادة: ${subject}
المستوى التعليمي: ${educationLevel}

المطلوب منك لتقديم حل استثنائي ومثالي:
1. تقديم الإجابة النموذجية المباشرة والنهائية بدقة متناهية (Model Answer).
2. الشرح والتفصيل خطوة بخطوة (Step-by-Step Solution) لتوضيح كيفية الوصول للنتيجة وتجنب أخطاء الفهم.
3. ذكر القاعدة العلمية أو القانون أو المفهوم الأساسي المستند عليه في الحل.
4. تقديم سؤال تطبيقي إضافي مشابه مع حله المختصر لمساعدة الطالب على تأكيد فهمه.

يرجى تنظيم الإجابة بعناوين واضحة ونسق جميل بالماركداون (Markdown).`;

    const contents: any[] = [];
    if (imageData) {
      const cleanedBase64 = imageData.replace(/^data:image\/\w+;base64,/, "");
      contents.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanedBase64,
        },
      });
      systemInstructions += `\nملاحظة: السؤال أو نموذج الاختبار مكتوب في صورة ورقة الامتحان المرفقة. استخرج جميع الأسئلة وأجب عليها بدقة.`;
    }

    if (questionText && questionText.trim().length > 0) {
      systemInstructions += `\nنص أسئلة الامتحان المطلوب حلها:\n"""\n${questionText}\n"""\n`;
    }

    contents.push(systemInstructions);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const solution = response.text || "تعذر استخراج حل الامتحان.";

    return res.json({
      solutionText: solution,
      subject,
      educationLevel,
    });
  } catch (error: any) {
    console.error("Error in /api/solve-exam:", error);
    return res.status(500).json({
      error: error.message || "حدث خطأ أثناء حل الامتحان.",
    });
  }
});

// 7. Ask AI (المعلم والمساعد الذكي للطلاب)
app.post("/api/ask-ai", async (req, res) => {
  try {
    const {
      question,
      subject = "عام",
      history = [],
      imageData,
    } = req.body;

    if ((!question || typeof question !== "string" || question.trim().length === 0) && !imageData) {
      return res.status(400).json({ error: "الرجاء كتابة سؤالك أو إرفاق صورة للاستفسار عنها." });
    }

    const ai = getGenAI();

    let systemPrompt = `أنت "معلم الذكاء الاصطناعي الذكي" (Smart AI Tutor)، رفيق تعليمي تفاعلي وودود ومتمكن جداً لجميع الطلاب والتلاميذ بمختلف المستويات والمناهج الدراسية.
المادة / المجال: ${subject}

إرشاداتك في الإجابة:
1. الشرح المبسط والواضح: بسّط المفاهيم المعقدة خطوة بخطوة مع أمثلة واقعية وسهلة الفهم.
2. الدقة العلمية والتربوية: تقديم معلومات صحيحة، مع إبراز القوانين أو القواعد أو المعطيات المهمة بخط عريض.
3. التفاعل والتشجيع: اختم إجابتك دائماً بسؤال تحفيزي أو نصيحة دراسية ذكية لتثبيت الفهم.
4. التنسيق: استخدم Markdown مع عناوين واضحة وقوائم نقطية لتسهيل القراءة السريعة.
إذا كان السؤال عن مسألة أو تمرين، اشرح طريقة التفكير قبل إعطاء النتيجة.`;

    const contents: any[] = [];

    // Add prior conversation turns if available
    if (Array.isArray(history) && history.length > 0) {
      // Add last few turns
      const recentTurns = history.slice(-6);
      for (const turn of recentTurns) {
        if (turn.text && turn.role) {
          contents.push({
            role: turn.role === "assistant" || turn.role === "model" ? "model" : "user",
            parts: [{ text: turn.text }],
          });
        }
      }
    }

    const userParts: any[] = [];
    if (imageData) {
      const cleanedBase64 = imageData.replace(/^data:image\/\w+;base64,/, "");
      userParts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanedBase64,
        },
      });
      userParts.push({
        text: `المرفق: صورة مرفقة مع السؤال.\n`,
      });
    }

    if (question && question.trim().length > 0) {
      userParts.push({
        text: question.trim(),
      });
    }

    contents.push({
      role: "user",
      parts: userParts,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.5,
      },
    });

    const answer = response.text || "عذراً، لم أتمكن من صياغة إجابة مناسبة حالياً.";

    return res.json({
      answer,
      subject,
    });
  } catch (error: any) {
    console.error("Error in /api/ask-ai:", error);
    return res.status(500).json({
      error: error.message || "حدث خطأ أثناء التواصل مع المعلم الذكي.",
    });
  }
});

// Setup Vite or production static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
