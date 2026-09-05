import { PresetExample, DocumentTemplate } from "../types";

export const PRESET_EXAMPLES: PresetExample[] = [
  {
    id: "formal-email",
    title: "تحويل مسودة عامية إلى إيميل رسمى احترافي",
    category: "مخاطبات إدارية",
    description: "تحويل رسالة سريعة وغير مرتبة إلى بريد إلكتروني رسمي للشركة مع التحية والخاتمة.",
    originalText: "يا أستاذ محمد سلام عليكم، حبيت أذكرك بموضوع التقرير المالي حق المشروع، ترى الإدارة تطلبه منا بكرة ولازم نجهزه بسرعة. ياليت ترسل لي البيانات العصر إذا تقدر عشان نلحق نخلصه.",
    suggestedConfig: {
      action: "email",
      tone: "formal",
      convertToMsa: true,
      tashkeel: "none",
    },
  },
  {
    id: "academic-proofread",
    title: "تدقيق لغوي وتشكيل فقرة أكاديمية",
    category: "أكاديمي وكتب",
    description: "تصحيح الأخطاء النحوية والإملائية وتطبيق التشكيل الذكي لفقرة في بحث علمي.",
    originalText: "ان الذكاء الاصطناعي يعتبر من اهم التقنيات الحديثه التي تؤثر علا مجالات العمل المختلفه ويسهم بشكل كبير في تسهيل المهام اليوميه والارتقاء بإنتاجيه المؤسسات.",
    suggestedConfig: {
      action: "proofread",
      tone: "academic",
      tashkeel: "smart",
      convertToMsa: true,
    },
  },
  {
    id: "meeting-summary",
    title: "تحويل رؤوس أقلام اجتماع إلى تقرير تنفيذي",
    category: "تقارير أعمال",
    description: "تحويل نقاط سريعة تم تدوينها أثناء الاجتماع إلى تقرير منسق ذو أهداف وتوصيات.",
    originalText: "- حضر الاجتماع احمد وسارة وخالد\n- اتطرقنا لمشكلة تأخر شحنات البضائع\n- اتصلنا بالمورد وقال في عطل في الميناء\n- خالد اقترح نطلب من مورد ثاني مؤقتا\n- اتفقنا نراجع الميزانية ونعطي خبر للمدير يوم الخميس",
    suggestedConfig: {
      action: "report",
      tone: "formal",
      convertToMsa: true,
      tashkeel: "none",
    },
  },
  {
    id: "persuasive-pitch",
    title: "صياغة نص تسويقي إقناعي لمنتج جديد",
    category: "تسويق وإقناع",
    description: "إعادة صياغة وصف عادي لمنصة برمجية وجعله نصاً تسويقياً مشوقاً وجذاباً للعملاء.",
    originalText: "برنامجنا يسوي تنظيم للمهام ويساعد الموظفين يعرفون وش المتبقي عليهم وفيه تنبيهات للتذكير بالنهايات المحددة للمشاريع.",
    suggestedConfig: {
      action: "rewrite",
      tone: "persuasive",
      convertToMsa: true,
      tashkeel: "none",
    },
  },
  {
    id: "diplomatic-apology",
    title: "خطاب اعتذار وتوضيح دبلوماسي لعميل",
    category: "خدمة العملاء",
    description: "تحويل نص يحتوي على اعتذار عادي إلى خطاب دبلوماسي محترم يمتص غضب العميل ويضمن ولاءه.",
    originalText: "نعتذر منك على التأخير اللي صار في طلبك، كان عندنا زحمة طلبات والسيستم طفى ساعة، الحين طلبك بالדרך وبيوصلك.",
    suggestedConfig: {
      action: "rewrite",
      tone: "diplomatic",
      convertToMsa: true,
      tashkeel: "none",
    },
  },
];

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: "job-application",
    title: "خطاب تغطية لوظيفة (Cover Letter)",
    description: "صياغة خطاب رسمي متكامل للتقديم على وظيفة برصانة واحترافية عالية.",
    category: "توظيف ومسار مهني",
    iconName: "Briefcase",
    fields: [
      { id: "jobTitle", label: "المسمى الوظيفي المستهدف", placeholder: "مثال: مدير مشاريع تقنية / مهندس برمجيات", type: "text", required: true },
      { id: "companyName", label: "اسم الشركة / الجهة", placeholder: "مثال: شركة التقنيات المتقدمة", type: "text", required: true },
      { id: "experience", label: "موجز خبراتك ومهاراتك الرئيسية", placeholder: "مثال: خبرة 5 سنوات في إدارة المشاريع الذكية والتنسيق مع الفرق الكبيرة", type: "textarea", required: true },
      { id: "achievements", label: "أبرز الإنجازات أو سبب اهتمامك بالشركة", placeholder: "مثال: زيادة الإنتاجية بنسبة 30% وشغف بالابتكار", type: "textarea" },
    ],
  },
  {
    id: "official-memo",
    title: "تعميم أو مذكرة إدارية داخلية",
    description: "إعداد مذكرة رسمية موجهة لموظفي القسم أو الشركة بلغة إدارية حازمة وواضحة.",
    category: "مخاطبات إدارية",
    iconName: "FileText",
    fields: [
      { id: "subject", label: "موضوع المذكرة", placeholder: "مثال: تنظيم مواعيد العمل خلال شهر رمضان / سياسة العمل المكتبي الجديدة", type: "text", required: true },
      { id: "targetAudience", label: "الجهة الموجه إليها", placeholder: "مثال: جميع منسوبي الشركة / أعضاء قسم التسويق", type: "text", required: true },
      { id: "mainPoints", label: "النقاط أو القرارات الرئيسية", placeholder: "اكتب القرارات أو التوجيهات المراد إبلاغها...", type: "textarea", required: true },
    ],
  },
  {
    id: "proposal-pitch",
    title: "مقترح مشروع / طلب شراكة",
    description: "صياغة مقترح عمل جذاب ومقنع لتقديم فكرة مشروع لمدير أو مستثمر.",
    category: "أعمال واستثمار",
    iconName: "TrendingUp",
    fields: [
      { id: "projectTitle", label: "عنوان المشروع / الفكرة", placeholder: "مثال: تطوير نظام آلي لخدمة العملاء بالذكاء الاصطناعي", type: "text", required: true },
      { id: "problem", label: "المشكلة التي يحلها المشروع", placeholder: "مثال: ارتفاع تكاليف الدعم الفني وتأخر الرد على العملاء", type: "textarea", required: true },
      { id: "solution", label: "الحل المقترح والمزايا المكتسبة", placeholder: "مثال: منصة مجيبة تعمل على مدار 24 ساعة لتقليل وقت الانتظار بنسبة 80%", type: "textarea", required: true },
    ],
  },
  {
    id: "resignation-letter",
    title: "خطاب استقالة رسمي ودبلوماسي",
    description: "صياغة خطاب تقديم استقالة برصانة وتقدير لفترة العمل السابقة مع الحفاظ على العلاقة الإيجابية.",
    category: "توظيف ومسار مهني",
    iconName: "UserMinus",
    fields: [
      { id: "position", label: "منصبك الحالي", placeholder: "مثال: أخصائي تسويق رقمي", type: "text", required: true },
      { id: "managerName", label: "اسم المدير المباشر", placeholder: "مثال: سعادة المهندس خالد المحترم", type: "text", required: true },
      { id: "lastDay", label: "تاريخ آخر يوم عمل متوقع", placeholder: "مثال: 30 أغسطس 2026", type: "text", required: true },
      { id: "notes", label: "سبب مغادرة موجز أو مشاعر امتنان للشركة", placeholder: "مثال: للانتقال لمرحلة مهنية جديدة مع الشكر الجزيل لكل ما قدمتموه", type: "textarea" },
    ],
  },
];
