/* ============================================================
   بحثي — بيانات لوحة إدارة البحث
   رحلة البحث، أقسام المقترح، الموضوعات، والبيانات الافتراضية
   (تُستخدم فقط أول مرة، بعدها الطالب/ة يعدّلها من الواجهة)
   ============================================================ */

/* رحلة البحث الكاملة — 8 مراحل */
const JOURNEY = [
  { key:'proposal',      label:'المقترح البحثي',    emoji:'📝' },
  { key:'litreview',     label:'مراجعة الأدبيات',   emoji:'📚' },
  { key:'gap',           label:'الفجوة البحثية',    emoji:'🔍' },
  { key:'aim',           label:'الهدف والأسئلة',    emoji:'🎯' },
  { key:'methodology',   label:'المنهجية',          emoji:'🧪' },
  { key:'datacollection',label:'جمع البيانات',      emoji:'📋' },
  { key:'analysis',      label:'تحليل البيانات',    emoji:'📊' },
  { key:'final',         label:'البحث النهائي',     emoji:'🎓' }
];

/* أقسام المقترح السبعة — كل قسم له حالة: done / progress / pending */
const PROPOSAL_SECTIONS = [
  { key:'background',  label:'خلفية البحث',      en:'Background',              hue:'mustard' },
  { key:'litreview',   label:'مراجعة الأدبيات',  en:'Literature Review',       hue:'sage' },
  { key:'problem',     label:'مشكلة البحث',      en:'Statement of Problem',    hue:'blush' },
  { key:'gap',         label:'الفجوة المعرفية',  en:'Gap of Knowledge',        hue:'lavender' },
  { key:'aim',         label:'هدف الدراسة',      en:'Purpose / Aim',           hue:'coral' },
  { key:'questions',   label:'أسئلة البحث',      en:'Research Questions',      hue:'mustard' },
  { key:'methodology', label:'المنهجية',         en:'Methodology',             hue:'sage' }
];

/* الموضوعات البحثية المستخدمة بمكتبة الأدبيات */
const THEMES = ['Delirium', 'Nursing Knowledge', 'Detection Tools', 'Tool Utilization', 'Patient Outcomes'];

/* فلاتر مكتبة الأدبيات */
const LIT_FILTERS = [
  { key:'all',         label:'الكل' },
  { key:'background',  label:'خلفية' },
  { key:'litreview',   label:'مراجعة الأدبيات' },
  { key:'gap',          label:'الفجوة' },
  { key:'methodology', label:'المنهجية' },
  { key:'other',       label:'أخرى' }
];

/* ============================= بيانات افتراضية أول تشغيل ============================= */

const SEED_SECTIONS = {
  background:  { status:'done',     note:'تمت صياغة خلفية البحث حول انتشار الدليريوم بوحدات العناية المركزة وأثره على سلامة المريض.' },
  litreview:   { status:'done',     note:'تمت مراجعة 5 من أصل 8 دراسات تم جمعها.' },
  problem:     { status:'done',     note:'مشكلة البحث محددة: ضعف اكتشاف الدليريوم من قبل الممرضين بسبب نقص المعرفة بأدوات الفحص.' },
  gap:         { status:'progress',note:'الفجوة قيد الصياغة — بانتظار ربطها بوضوح مع هدف الدراسة.' },
  aim:         { status:'pending', note:'' },
  questions:   { status:'pending', note:'' },
  methodology: { status:'pending', note:'' }
};

const SEED_GAP = {
  known:      'الدراسات السابقة أثبتت أن الدليريوم شائع لدى مرضى العناية المركزة ويرتبط بزيادة مدة الإقامة ومعدل الوفيات، وأن أدوات فحص معتمدة مثل CAM-ICU متوفرة وفعالة.',
  unknown:    'القليل معروف عن مدى معرفة الممرضين الفعلية بهذه الأدوات، ومدى استخدامهم لها بانتظام في الممارسة اليومية داخل مستشفياتنا المحلية.',
  gapStatement: 'لا توجد دراسات كافية تقيس مستوى معرفة الممرضين واستخدامهم الفعلي لأدوات فحص الدليريوم في بيئة العناية المركزة المحلية.',
  yourStudy:  ''
};

const SEED_AIM = {
  statement: '',
  questions: ['', '', '']
};

const SEED_METHODOLOGY = {
  design:'', setting:'', population:'',
  inclusion:'', exclusion:'', sampleSize:'', samplingTechnique:'',
  dataCollection: [], studyTool:''
};

const SEED_STUDIES = [
  { id:'s1', title:'Nurses\' Knowledge and Practice Regarding ICU Delirium Assessment', year:2023, authors:'Al-Harbi et al.', theme:'Nursing Knowledge', keyFinding:'أظهرت الدراسة أن أقل من 40% من الممرضين يستخدمون أداة فحص معتمدة بانتظام رغم توفرها.', relevance:'يدعم مباشرة مشكلة البحث المتعلقة بضعف الاستخدام الفعلي للأدوات.', reference:'J Clin Nurs. 2023;32(4):612-620', theme_tag:'litreview', reviewed:true },
  { id:'s2', title:'Validity and Reliability of the CAM-ICU in Critical Care Settings', year:2021, authors:'Ely et al.', theme:'Detection Tools', keyFinding:'أداة CAM-ICU أظهرت حساسية ونوعية عالية لاكتشاف الدليريوم عند استخدامها بشكل صحيح.', relevance:'يؤسس لاختيار أداة الدراسة المحتملة.', reference:'Crit Care Med. 2021;49(2):210-219', theme_tag:'methodology', reviewed:true },
  { id:'s3', title:'Barriers to Delirium Screening in Intensive Care: A Qualitative Study', year:2022, authors:'Thompson & Reid', theme:'Nursing Knowledge', keyFinding:'نقص التدريب وضيق الوقت من أهم الحواجز التي ذكرها الممرضون لعدم تطبيق الفحص الروتيني.', relevance:'يفسر جزءاً من الفجوة بين المعرفة النظرية والتطبيق العملي.', reference:'Intensive Crit Care Nurs. 2022;68:103120', theme_tag:'gap', reviewed:true },
  { id:'s4', title:'Prevalence and Outcomes of Delirium in Critically Ill Patients', year:2020, authors:'Pandharipande et al.', theme:'Patient Outcomes', keyFinding:'الدليريوم غير المكتشف يرتبط بزيادة مدة الإقامة بوحدة العناية المركزة بمعدل 3 أيام إضافية بالمتوسط.', relevance:'يبرر أهمية الكشف المبكر ضمن خلفية البحث.', reference:'N Engl J Med. 2020;383(15):1451-1460', theme_tag:'background', reviewed:true },
  { id:'s5', title:'Educational Interventions to Improve Delirium Detection Among ICU Nurses', year:2019, authors:'Rood et al.', theme:'Nursing Knowledge', keyFinding:'برامج التدريب القصيرة رفعت معدل استخدام أدوات الفحص من 45% إلى 78% خلال 3 أشهر.', relevance:'يدعم التوصيات المحتملة للدراسة بعد جمع البيانات.', reference:'BMC Nurs. 2019;18:34', theme_tag:'litreview', reviewed:true },
  { id:'s6', title:'Utilization Patterns of Delirium Screening Tools: A Multi-Center Survey', year:2022, authors:'Chen & Alavi', theme:'Tool Utilization', keyFinding:'التباين كبير بين الأقسام في معدل استخدام أدوات الفحص، حتى داخل المستشفى الواحد.', relevance:'يدعم أهمية دراسة محلية تقيس هذا التباين تحديداً.', reference:'Aust Crit Care. 2022;35(3):301-309', theme_tag:'litreview', reviewed:false },
  { id:'s7', title:'Nurse-Perceived Confidence in Delirium Assessment: A Cross-Sectional Study', year:2021, authors:'Novak et al.', theme:'Nursing Knowledge', keyFinding:'الثقة الذاتية للممرضين بقدرتهم على تقييم الدليريوم كانت أقل من مستوى معرفتهم النظرية الفعلي.', relevance:'زاوية مهمة يمكن قياسها ضمن أداة الدراسة.', reference:'J Adv Nurs. 2021;77(6):2790-2799', theme_tag:'litreview', reviewed:false },
  { id:'s8', title:'Impact of Delirium Detection Tool Training on Patient Length of Stay', year:2023, authors:'Osei-Bonsu et al.', theme:'Patient Outcomes', keyFinding:'المستشفيات التي طبّقت برامج تدريب منتظمة سجّلت انخفاضاً ملحوظاً بمضاعفات الدليريوم غير المكتشف.', relevance:'يدعم القيمة العملية المتوقعة من نتائج الدراسة.', reference:'Worldviews Evid Based Nurs. 2023;20(1):45-53', theme_tag:'other', reviewed:false }
];

const SEED_TASKS = [
  { id:'t1',  title:'البحث عن الدراسات السابقة',            priority:'high',   deadline:'2026-07-20', status:'done' },
  { id:'t2',  title:'قراءة الدراسات وتصنيفها',              priority:'high',   deadline:'2026-08-10', status:'done' },
  { id:'t3',  title:'كتابة Background',                     priority:'high',   deadline:'2026-08-15', status:'done' },
  { id:'t4',  title:'تحديد Statement of Problem',           priority:'medium', deadline:'2026-08-20', status:'done' },
  { id:'t5',  title:'صياغة Research Gap',                   priority:'high',   deadline:'2026-08-30', status:'progress' },
  { id:'t6',  title:'كتابة Aim',                             priority:'high',   deadline:'2026-09-05', status:'not_started' },
  { id:'t7',  title:'صياغة Research Questions',             priority:'medium', deadline:'2026-09-08', status:'not_started' },
  { id:'t8',  title:'تحديد Study Design',                    priority:'medium', deadline:'2026-09-15', status:'not_started' },
  { id:'t9',  title:'تحديد Sampling Criteria',               priority:'low',    deadline:'2026-09-18', status:'not_started' },
  { id:'t10', title:'اختيار Study Tool',                      priority:'medium', deadline:'2026-09-22', status:'not_started' },
  { id:'t11', title:'إعداد Data Collection Method',          priority:'low',    deadline:'2026-09-25', status:'not_started' },
  { id:'t12', title:'مراجعة Ethical Considerations',         priority:'medium', deadline:'2026-09-28', status:'not_started' }
];

const PRIORITY_LABEL = { high:'عالية', medium:'متوسطة', low:'منخفضة' };
const TASK_STATUS_LABEL = { not_started:'لم يبدأ', progress:'قيد العمل', done:'مكتمل' };
const SECTION_STATUS_LABEL = { done:'مكتمل', progress:'قيد العمل', pending:'لم يبدأ' };
