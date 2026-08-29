/* ============================================================
   PERFORMANCE — daily curriculum content
   Four domains, each a set of lessons that deepen tier by tier
   (foundational -> building -> advanced), then cycle to keep
   reinforcing the advanced practices. Index = days completed so
   far in that domain, so each day genuinely builds on the last.
   ============================================================ */
const DOMAINS = [
  { key:'sleep',      emoji:'🌙', hue:'lavender' },
  { key:'nutrition',  emoji:'🍽️', hue:'mustard' },
  { key:'movement',   emoji:'🏃', hue:'sage' },
  { key:'nervous',    emoji:'🫁', hue:'blush' }
];

const LESSONS = {

sleep: [
{
  action:{en:"Wake up at the same time every day — yes, even on weekends.",
           ar:"استيقظ بنفس الوقت كل يوم — حتى بعطلة الأسبوع."},
  why:{en:"Your body clock (in a brain region called the SCN) resets itself based on when you wake, not when you sleep — consistency here anchors your cortisol and melatonin timing for the whole day.",
        ar:"ساعتك الداخلية (بمنطقة بالمخ تُسمى SCN) تنضبط على وقت استيقاظك مو وقت نومك — الثبات هنا يحدد توقيت الكورتيزول والميلاتونين طول يومك."},
  positive:{en:"Within days, falling asleep gets easier and your energy through the day feels steadier.",
             ar:"خلال كم يوم، بينام أسهل وطاقتك طول اليوم بتصير أثبت."},
  negative:{en:"Shifting your wake time around gives you a mild jet lag from your own schedule — grogginess that coffee only partly fixes.",
             ar:"تغيير وقت الاستيقاظ يعطيك نوع خفيف من \"جيت لاغ\" من جدولك نفسه — خمول ما تصلحه القهوة كامل."}
},
{
  action:{en:"Get outside light within the first 30-60 minutes of waking — no sunglasses, just 5-10 minutes.",
           ar:"اطلع تحت ضوء النهار خلال أول 30-60 دقيقة من استيقاظك — بدون نظارة شمس، بس 5-10 دقايق."},
  why:{en:"Morning light hits cells in your eyes that signal your brain's clock directly — it stops melatonin, starts your cortisol awakening response, and sets a ~14-16 hour timer for melatonin to return tonight.",
        ar:"ضوء الصباح يوصل لخلايا بعينك تكلّم ساعة مخك على طول — يوقف الميلاتونين، يبدأ استجابة الكورتيزول للاستيقاظ، ويضبط مؤقّت طوله ١٤-١٦ ساعة لرجوع الميلاتونين الليلة."},
  positive:{en:"Better sleep onset tonight, and noticeably sharper alertness this morning.",
             ar:"نوم أسهل الليلة، ووعي أوضح هالصبح."},
  negative:{en:"Skip it and your melatonin timer starts late — which quietly pushes your natural bedtime later too.",
             ar:"لو تتجاهله، مؤقّت الميلاتونين يبدأ متأخر — وهذا بهدوء يأخّر وقت نومك الطبيعي كمان."}
},
{
  action:{en:"Have your last caffeine before early afternoon — about 8-10 hours before bed.",
           ar:"آخر كافيين تشربه قبل بعد الظهر بشوي — تقريباً 8-10 ساعات قبل نومك."},
  why:{en:"Caffeine works by blocking adenosine, the chemical that builds your \"sleep pressure\" all day — blocking it delays sleepiness even if you don't feel wired.",
        ar:"الكافيين يشتغل بمنع الأدينوسين، المادة اللي تبني \"ضغط النوم\" طول اليوم — منعها يأخّر النعاس حتى لو ما تحس إنك مشحون."},
  positive:{en:"Falling asleep comes easier, and the sleep itself is deeper.",
             ar:"النوم بيجي أسهل، والنوم نفسه بيصير أعمق."},
  negative:{en:"Afternoon coffee can quietly fragment your sleep later — even on nights you don't remember any trouble falling asleep.",
             ar:"قهوة بعد الظهر ممكن تفتّت نومك بهدوء بالليل — حتى بليالي ما تتذكر فيها إنك تعبت بالنوم."}
},
{
  action:{en:"Dim the lights and step back from screens 60-90 minutes before bed.",
           ar:"خفّف الإضاءة وابعد عن الشاشات 60-90 دقيقة قبل النوم."},
  why:{en:"Blue-toned light hits the same eye cells as morning sunlight — late at night, it tells your brain it's still daytime and suppresses melatonin right when you need it rising.",
        ar:"الضوء الأزرق يوصل لنفس خلايا العين اللي يوصلها ضوء الصباح — بالليل، يقول لمخك إنه لسا نهار ويوقف الميلاتونين بالضبط وقت ما تحتاجه يرتفع."},
  positive:{en:"Melatonin rises on schedule and sleep comes on time.",
             ar:"الميلاتونين يرتفع بوقته والنوم يجي بموعده."},
  negative:{en:"Bright light late in the evening can push your natural sleep onset back by one to three hours.",
             ar:"الضوء القوي بآخر المسا ممكن يأخّر بداية نومك الطبيعي ساعة لثلاث ساعات."}
},
{
  action:{en:"Keep your bedroom cool — around 18-20°C if you can.",
           ar:"خلّي غرفة نومك باردة — حوالي 18-20 درجة إذا تقدر."},
  why:{en:"Your core body temperature needs to drop by about a degree to fall into and stay in deep sleep — a cool room helps that drop happen.",
        ar:"حرارة جسمك الداخلية لازم تنزل تقريباً درجة علشان تدخل وتضل بنوم عميق — الغرفة الباردة تساعد هالنزول يصير."},
  positive:{en:"Deeper, less interrupted sleep.",
             ar:"نوم أعمق وأقل انقطاع."},
  negative:{en:"A warm room keeps your core temperature up, which shows up as lighter, more restless sleep.",
             ar:"الغرفة الحارة تخلّي حرارتك الداخلية مرتفعة، وهذا يبين كنوم خفيف وقلق أكثر."}
},
{
  action:{en:"Build a short, consistent wind-down — 15-20 minutes of the same calm routine before bed.",
           ar:"اسوِ روتين تهدئة قصير وثابت — 15-20 دقيقة من نفس الطقوس الهادئة قبل النوم."},
  why:{en:"Repeating the same cues trains your nervous system to shift from alert to relaxed — a conditioned signal that sleep is coming.",
        ar:"تكرار نفس الإشارات يدرّب جهازك العصبي إنه ينتقل من التيقّظ للاسترخاء — إشارة متعلَّمة إن النوم جاي."},
  positive:{en:"Over time, the routine itself becomes a trigger and you fall asleep faster.",
             ar:"مع الوقت، الروتين نفسه يصير محفّز وبتنام أسرع."},
  negative:{en:"Jumping straight from screens or stress into bed leaves your nervous system still activated, so sleep takes longer to arrive.",
             ar:"القفز على طول من الشاشات أو التوتر للسرير يخلّي جهازك العصبي لسا مفعّل، فالنوم ياخذ وقت أطول يجي."}
},
{
  action:{en:"Notice your sleep debt — don't count on weekends to fully \"pay it back.\"",
           ar:"انتبه لدَين نومك — لا تعتمد على عطلة الأسبوع إنها \"تسدده\" كامل."},
  why:{en:"Sleep debt builds up, and weekend catch-up sleep doesn't fully reverse the cognitive and metabolic cost of short nights — it also throws off your body clock further.",
        ar:"دين النوم يتراكم، ونوم عطلة الأسبوع ما يرجّع كامل الكلفة الذهنية والأيضية لليالي القصيرة — وكمان يخربط ساعتك الداخلية أكثر."},
  positive:{en:"Stable energy through the week without the Sunday-night \"reset\" crash.",
             ar:"طاقة ثابتة طول الأسبوع بدون انهيار \"إعادة الضبط\" ليلة الأحد."},
  negative:{en:"Chronic short nights slowly wear down mood, focus, and even blood sugar regulation over weeks — quietly, not all at once.",
             ar:"الليالي القصيرة المتكررة تنهك المزاج والتركيز وحتى تنظيم السكر بالدم على مدى أسابيع — بهدوء، مو دفعة وحدة."}
},
{
  action:{en:"If you nap, keep it before 3pm and under 20-30 minutes.",
           ar:"إذا بتغفى، خلّيها قبل الساعة 3 العصر وتحت 20-30 دقيقة."},
  why:{en:"A short nap clears some sleep pressure without dropping into deep sleep — long enough to help, short enough to not compete with tonight's sleep.",
        ar:"الغفوة القصيرة تفرّغ شوي من ضغط النوم بدون ما تدخل نوم عميق — كافية تساعد، وقصيرة بحيث ما تنافس نوم الليلة."},
  positive:{en:"An afternoon reset that doesn't cost you tonight's sleep.",
             ar:"إعادة ضبط بعد الظهر ما تكلّفك نوم الليلة."},
  negative:{en:"Long or late naps burn off the very sleep pressure you need to fall asleep on time that night.",
             ar:"الغفوة الطويلة أو المتأخرة تحرق بالضبط ضغط النوم اللي تحتاجه تنام بوقته الليلة."}
},
{
  action:{en:"Avoid alcohol and heavy meals within about 3 hours of bed.",
           ar:"تجنّب الكحول والوجبات الثقيلة قبل النوم بحوالي 3 ساعات."},
  why:{en:"As alcohol is processed overnight it fragments sleep in the second half of the night; a heavy late meal raises your core temperature and pulls energy into digestion right when your body should be cooling down.",
        ar:"الكحول وقت ما يتفكك بالليل يفتّت نومك بالنص الثاني من الليل؛ والوجبة الثقيلة المتأخرة ترفع حرارتك الداخلية وتسحب طاقة للهضم بالضبط وقت ما جسمك المفروض يبرد."},
  positive:{en:"Fewer 3am wake-ups, more consolidated deep sleep.",
             ar:"صحيان أقل بمنتصف الليل، ونوم عميق أكثر تماسكاً."},
  negative:{en:"You can wake up with what feels like \"enough hours\" but low-quality, fragmented sleep that doesn't actually restore you.",
             ar:"ممكن تصحى تحس إن عندك \"ساعات كافية\" بس نوم منقطع رديء ما يريحك فعلياً."}
}
],

nutrition: [
{
  action:{en:"Include 20-30g of protein at your first meal of the day.",
           ar:"حط 20-30 غرام بروتين بأول وجبة باليوم."},
  why:{en:"Protein blunts the blood-sugar spike a meal causes and raises fullness hormones more than carbs alone do.",
        ar:"البروتين يخفف ارتفاع السكر اللي تسببه الوجبة، ويرفع هرمونات الشبع أكثر من الكارب لحاله."},
  positive:{en:"Steadier energy, fewer mid-morning cravings.",
             ar:"طاقة أثبت، ورغبة أقل بالأكل منتصف الصباح."},
  negative:{en:"A carb-only breakfast often sets up a spike-then-crash by mid-morning.",
             ar:"فطور كله كارب غالباً يسوّي ارتفاع بالسكر وبعدها انهيار منتصف الصباح."}
},
{
  action:{en:"Drink a full glass of water before your first meal, and between meals.",
           ar:"اشرب كاس مويه كامل قبل أول وجبة، وبين الوجبات."},
  why:{en:"Mild dehydration is often misread by your brain as hunger, and it slows digestion and lowers energy on its own.",
        ar:"قلة المويه الخفيفة مخك أحياناً يفسّرها كجوع، وهي لحالها تبطّئ الهضم وتنزّل الطاقة."},
  positive:{en:"Clearer hunger signals, more stable energy.",
             ar:"إشارات جوع أوضح، وطاقة أثبت."},
  negative:{en:"Chronic under-hydration shows up as tiredness and \"hunger\" that food doesn't actually resolve.",
             ar:"قلة المويه المستمرة تبين كتعب و\"جوع\" الأكل ما يحلّه فعلياً."}
},
{
  action:{en:"Front-load most of your calories earlier in the day; keep late-night meals light.",
           ar:"ركّز أغلب وجباتك بأول اليوم؛ وخلّي وجبة آخر الليل خفيفة."},
  why:{en:"Insulin sensitivity is generally higher earlier in the day and drops in the evening — the same meal spikes blood sugar more at night.",
        ar:"حساسية الإنسولين أعلى بأول اليوم وتنزل بالمسا — نفس الوجبة ترفع السكر أكثر بالليل."},
  positive:{en:"Better blood sugar control, and sleep that isn't competing with digestion.",
             ar:"تحكم أفضل بالسكر، ونوم مو منافس للهضم."},
  negative:{en:"Large late meals raise nighttime blood sugar and body temperature, disrupting sleep quality.",
             ar:"الوجبات الكبيرة المتأخرة ترفع سكر الليل وحرارة الجسم، وتخرّب جودة النوم."}
},
{
  action:{en:"Eat vegetables or fiber before or with the refined carbs in a meal.",
           ar:"كل الخضار أو الألياف قبل أو مع الكارب المكرر بالوجبة."},
  why:{en:"Fiber slows how fast your stomach empties and sugar gets absorbed, flattening the whole meal's blood-sugar curve.",
        ar:"الألياف تبطّئ تفريغ المعدة وامتصاص السكر، وتخفف منحنى السكر لكل الوجبة."},
  positive:{en:"Sustained energy for hours, instead of a spike and a dip.",
             ar:"طاقة مستمرة لساعات، بدل ارتفاع وانهيار."},
  negative:{en:"Refined carbs eaten alone digest fast, spike blood sugar, then crash it an hour or two later — often felt as fatigue or irritability.",
             ar:"الكارب المكرر لحاله يتهضم بسرعة، يرفع السكر، وبعدها يوقّعه بعد ساعة أو ساعتين — غالباً تحس فيه كتعب أو نرفزة."}
},
{
  action:{en:"Build most meals around protein + fiber + healthy fat, with carbs as a supporting player.",
           ar:"بني أغلب وجباتك حول بروتين + ألياف + دهون صحية، والكارب دور مساند مو أساسي."},
  why:{en:"This combination slows digestion, giving a broader, longer release of energy and fullness signals.",
        ar:"هالتركيبة تبطّئ الهضم، وتعطي إطلاق أطول وأوسع للطاقة وإشارات الشبع."},
  positive:{en:"Fewer cravings, steadier mood for hours after eating.",
             ar:"رغبة أقل بالأكل، ومزاج أثبت لساعات بعد الأكل."},
  negative:{en:"Carb-only meals digest quickly and leave you hungry and low-energy again within an hour or two.",
             ar:"الوجبات اللي كلها كارب تتهضم بسرعة وترجعك جوعان وطاقتك واطية خلال ساعة أو ساعتين."}
},
{
  action:{en:"Slow down when you eat — no screens sometimes, chew fully.",
           ar:"بطّئ وقت أكلك — بدون شاشات أحياناً، وامضغ زين."},
  why:{en:"Fullness hormones take about 15-20 minutes to signal your brain — eating fast outruns that signal entirely.",
        ar:"هرمونات الشبع تاخذ تقريباً 15-20 دقيقة توصل إشارتها لمخك — الأكل السريع يفوّت هالإشارة كامل."},
  positive:{en:"You naturally eat the right amount, with less heaviness after.",
             ar:"تاكل الكمية المناسبة بشكل طبيعي، وثقل أقل بعدها."},
  negative:{en:"Eating fast reliably leads to overeating before the \"full\" signal catches up.",
             ar:"الأكل السريع دايم يودّي لأكل زيادة قبل ما توصل إشارة \"الشبع\"."}
},
{
  action:{en:"Try to eat your main meals around similar times most days.",
           ar:"حاول تاكل وجباتك الأساسية بأوقات متقاربة أغلب الأيام."},
  why:{en:"Your digestive system partly runs on anticipatory rhythms tied to your usual eating schedule — enzymes and gut motility ramp up around when you normally eat.",
        ar:"جهازك الهضمي جزء منه يشتغل على إيقاع متوقّع مرتبط بجدولك المعتاد للأكل — الإنزيمات وحركة الأمعاء تنشط حوالي وقت أكلك العادي."},
  positive:{en:"Better digestion, more predictable hunger and energy cues.",
             ar:"هضم أفضل، وإشارات جوع وطاقة أوضح توقّعها."},
  negative:{en:"Erratic meal timing confuses your hunger signals — you feel hungry at odd times, or not hungry when you should eat.",
             ar:"أوقات الأكل غير المنتظمة تخربط إشارات جوعك — تحس بالجوع بأوقات غريبة، أو ما تحس فيه وقت لازم تاكل."}
},
{
  action:{en:"Notice which meals reliably lead to an energy crash an hour or two later, and adjust their balance.",
           ar:"لاحظ أي وجبات دايماً توديك لانهيار طاقة بعدها بساعة أو ساعتين، وعدّل توازنها."},
  why:{en:"This pattern is almost always a fast blood-sugar spike followed by an insulin-driven drop.",
        ar:"هالنمط غالباً يكون ارتفاع سريع بالسكر يتبعه هبوط بسبب الإنسولين."},
  positive:{en:"You learn your own patterns and can fix them meal by meal.",
             ar:"تتعرف على نمطك الخاص وتقدر تصلحه وجبة وجبة."},
  negative:{en:"Ignoring the pattern means repeating the same afternoon slump daily, often reaching for more sugar or caffeine to fix it.",
             ar:"تجاهل النمط يعني تكرار نفس خمول العصر يومياً، وغالباً تلجأ لسكر أو كافيين أكثر تصلحه."}
},
{
  action:{en:"Notice — don't necessarily eliminate — how alcohol and added sugar affect your next-day energy and sleep.",
           ar:"لاحظ — مو بالضرورة تلغي — كيف يأثر الكحول والسكر المضاف على طاقتك ونومك باليوم اللي بعده."},
  why:{en:"Alcohol impairs sleep architecture and added sugar amplifies blood-sugar swings — awareness lets you choose when it's worth the tradeoff.",
        ar:"الكحول يخرّب بنية النوم والسكر المضاف يزيد تذبذب السكر بالدم — الوعي يخليك تختار متى الصفقة تستاهل."},
  positive:{en:"You make informed tradeoffs instead of default habits quietly running your evenings.",
             ar:"تسوّي صفقات واعية بدل ما عادات تلقائية تتحكم بأمسياتك بهدوء."},
  negative:{en:"Unexamined nightly habits quietly compound into daily low energy that starts to feel like \"just how you are.\"",
             ar:"العادات الليلية اللي ما تُراجَع تتراكم بهدوء لطاقة منخفضة يومية توصل تحس إنها \"طبيعتك بس\"."}
}
],

movement: [
{
  action:{en:"Move a little within the first hour of waking — a walk or stretch, even 5-10 minutes.",
           ar:"تحرّك شوي بأول ساعة من استيقاظك — مشي أو تمدد، حتى لو 5-10 دقايق."},
  why:{en:"Light movement raises your core temperature and gently activates your nervous system, working alongside morning light to set your body clock and raise alertness.",
        ar:"الحركة الخفيفة ترفع حرارتك الداخلية وتنشّط جهازك العصبي بهدوء، وتشتغل مع ضوء الصباح تضبط ساعتك الداخلية وترفع وعيك."},
  positive:{en:"Sharper focus and mood earlier in the day.",
             ar:"تركيز ومزاج أوضح بأول اليوم."},
  negative:{en:"Staying still right after waking leaves you groggier for longer, leaning on caffeine to do what movement would do naturally.",
             ar:"البقاء ساكن بعد الاستيقاظ يخلّيك خامل لفترة أطول، وتعتمد على القهوة تسوّي اللي الحركة تسوّيه طبيعياً."}
},
{
  action:{en:"Stand or move for 2-3 minutes every 45-60 minutes of sitting.",
           ar:"قوم أو تحرّك 2-3 دقايق كل 45-60 دقيقة قعود."},
  why:{en:"Long sitting suppresses an enzyme involved in fat processing and lowers insulin sensitivity within hours — regardless of how much you exercised earlier.",
        ar:"القعود الطويل يثبّط إنزيم يدخل بمعالجة الدهون وينزّل حساسية الإنسولين خلال ساعات — بغض النظر عن كم تمرّنت قبل كذا."},
  positive:{en:"More stable energy and blood sugar across the day.",
             ar:"طاقة وسكر أثبت طول اليوم."},
  negative:{en:"Long unbroken sitting brings on that familiar afternoon heaviness and brain fog, even after a good morning workout.",
             ar:"القعود الطويل المتواصل يجيب هالثقل وضباب التركيز المعروف بالعصر، حتى بعد تمرين صباحي زين."}
},
{
  action:{en:"Take a 10-15 minute walk after your largest meal.",
           ar:"امشِ 10-15 دقيقة بعد أكبر وجبة عندك."},
  why:{en:"Muscle contraction during walking pulls glucose out of your bloodstream directly, blunting the post-meal blood-sugar spike.",
        ar:"انقباض العضلات وقت المشي يسحب السكر من دمك مباشرة، ويخفف ارتفاع السكر بعد الأكل."},
  positive:{en:"Less post-meal sluggishness, better blood sugar control.",
             ar:"خمول أقل بعد الأكل، وتحكم أفضل بالسكر."},
  negative:{en:"Sitting or lying down right after a big meal leaves that spike unmanaged — often felt as heaviness or a dip in energy.",
             ar:"القعود أو التمدد على طول بعد وجبة كبيرة يخلّي الارتفاع بدون معالجة — غالباً تحس فيه كثقل أو نزول بالطاقة."}
},
{
  action:{en:"Add some resistance movement 2-3 times a week — bodyweight is enough.",
           ar:"ضيف شوي تمارين مقاومة 2-3 مرات بالأسبوع — وزن جسمك يكفي."},
  why:{en:"Muscle is metabolically active tissue — more of it improves your baseline insulin sensitivity and resting metabolism, and it stimulates a protein linked to mood and cognition.",
        ar:"العضل نسيج نشط أيضياً — كل ما زاد حسّن حساسية الإنسولين الأساسية وأيضك بالراحة، وينشّط بروتين مرتبط بالمزاج والتفكير."},
  positive:{en:"More stable energy and mood, body composition improves over weeks.",
             ar:"طاقة ومزاج أثبت، وتركيب الجسم يتحسن خلال أسابيع."},
  negative:{en:"With no strength stimulus, muscle mass and the metabolic benefits it provides slowly decline — especially with age.",
             ar:"بدون أي محفّز للقوة، الكتلة العضلية وفوائدها الأيضية تقل بهدوء — خصوصاً مع العمر."}
},
{
  action:{en:"Aim for some easy-paced, sustained movement most weeks — you should be able to hold a conversation.",
           ar:"استهدف شوي حركة مستمرة بوتيرة خفيفة أغلب الأسابيع — لازم تقدر تسولف وأنت تتحرك."},
  why:{en:"This intensity specifically builds the density and efficiency of your mitochondria — the part of your cells that produce usable energy.",
        ar:"هالشدة تحديداً تبني كثافة وكفاءة الميتوكوندريا — الجزء بخلاياك اللي ينتج الطاقة المستخدمة."},
  positive:{en:"Better baseline energy and stamina in daily life, not just during exercise.",
             ar:"طاقة وقدرة تحمل أفضل بحياتك اليومية، مو بس وقت التمرين."},
  negative:{en:"Without it, your aerobic base slowly narrows, making everyday exertion feel more effortful over time.",
             ar:"بدونها، قاعدتك الهوائية تضيق بهدوء، وأي مجهود يومي يصير أثقل مع الوقت."}
},
{
  action:{en:"Spend a few minutes on stretching or mobility, especially where you sit on/in most (hips, shoulders, spine).",
           ar:"اصرف كم دقيقة بتمدد أو تحريك المفاصل، خصوصاً المناطق اللي تقعد عليها أكثر (الورك، الكتف، العمود الفقري)."},
  why:{en:"Static positions shorten connective tissue over time; regular range-of-motion work maintains joint health and prevents compensatory strain elsewhere.",
        ar:"الوضعيات الثابتة تقصّر الأنسجة الضامة مع الوقت؛ تحريك المفاصل بانتظام يحافظ على صحتها ويمنع إجهاد تعويضي بمناطق ثانية."},
  positive:{en:"Less stiffness, fewer aches from daily posture.",
             ar:"تصلّب أقل، وآلام أقل من وضعية الجسم اليومية."},
  negative:{en:"Neglected mobility compounds slowly into tightness and small nagging pains that feel like \"just getting older.\"",
             ar:"إهمال حركة المفاصل يتراكم بهدوء لتصلّب وآلام مزعجة بسيطة توصل تحس إنها \"بس الكبر\"."}
},
{
  action:{en:"Notice your natural energy dip and place a short walk there instead of reaching for caffeine.",
           ar:"لاحظ نزول طاقتك الطبيعي وحط مشيه قصيرة هناك بدل ما تروح للكافيين."},
  why:{en:"Movement raises alertness chemicals and blood flow directly, addressing the actual cause of the dip instead of just masking it.",
        ar:"الحركة ترفع مواد اليقظة وتدفق الدم مباشرة، وتعالج سبب النزول الحقيقي بدل ما تغطيه بس."},
  positive:{en:"A sustainable afternoon strategy that doesn't stack into evening jitteriness or worse sleep.",
             ar:"استراتيجية عصر مستدامة ما تتراكم لتوتر مسائي أو نوم أسوأ."},
  negative:{en:"Relying only on caffeine for the dip stacks a sleep-disrupting habit onto a root cause that's still unaddressed.",
             ar:"الاعتماد بس على الكافيين للنزول يضيف عادة تخرّب النوم فوق سبب أصلي لسا ما اتعالج."}
},
{
  action:{en:"When you can, take one movement session outdoors instead of indoors.",
           ar:"لما تقدر، خلّي جلسة حركة وحدة برا بدل جوّا."},
  why:{en:"Outdoor movement stacks light exposure, mild nature exposure, and often slightly harder terrain — three benefits from one session.",
        ar:"الحركة برا تجمع التعرض للضوء، والتعرض الخفيف للطبيعة، وغالباً أرض أصعب شوي — ثلاث فوائد بجلسة وحدة."},
  positive:{en:"A bigger mood and alertness return for the same time invested.",
             ar:"عائد أكبر بالمزاج واليقظة بنفس الوقت المصروف."},
  negative:{en:"Nothing lost — indoor movement is still good, you just leave a free benefit on the table.",
             ar:"ما تخسر شي — الحركة بالداخل زينة برضه، بس تفوّت فايدة مجانية."}
},
{
  action:{en:"Plan at least one lower-intensity or rest day — don't treat rest as wasted time.",
           ar:"خطّط ليوم واحد على الأقل خفيف أو راحة — لا تعامل الراحة كوقت ضايع."},
  why:{en:"Getting stronger or fitter actually happens during recovery, not during the stress of the session itself — without recovery, the stimulus never converts into progress.",
        ar:"القوة واللياقة فعلياً تصير وقت التعافي، مو وقت إجهاد الجلسة نفسها — بدون تعافي، المحفّز ما يتحول لتقدم أبداً."},
  positive:{en:"Consistent progress without burnout or injury.",
             ar:"تقدم مستمر بدون احتراق أو إصابة."},
  negative:{en:"Skipping recovery consistently leads to a plateau at best, and nagging injuries or persistent fatigue at worst.",
             ar:"تجاهل التعافي بشكل مستمر يوديك لثبات بأحسن الأحوال، وإصابات مزعجة أو تعب مستمر بأسوأها."}
}
],

nervous: [
{
  action:{en:"Spend a few minutes breathing with a longer exhale than inhale — in for 4, out for 6-8.",
           ar:"اصرف كم دقيقة تتنفس بزفير أطول من الشهيق — شهيق 4، زفير 6-8."},
  why:{en:"A longer exhale specifically activates the vagus nerve, shifting you from \"fight or flight\" toward \"rest and digest\" — it's the fastest lever you have.",
        ar:"الزفير الأطول تحديداً ينشّط العصب المبهم، وينقلك من \"الكر أو الفر\" لـ \"الراحة والهضم\" — أسرع أداة عندك."},
  positive:{en:"A measurable drop in heart rate and felt tension within minutes.",
             ar:"نزول ملموس بضربات القلب والتوتر المحسوس خلال دقايق."},
  negative:{en:"Staying in shallow, fast breathing under stress keeps your body activated longer than the actual stressor requires.",
             ar:"البقاء بتنفس سريع وسطحي وقت التوتر يخلّي جسمك مفعّل أطول مما يحتاجه سبب التوتر الفعلي."}
},
{
  action:{en:"Pause and name what you're feeling in one or two words — \"tense,\" \"wired,\" \"flat.\"",
           ar:"توقف وسمّي اللي تحس فيه بكلمة أو كلمتين — \"متوتر\"، \"مشحون\"، \"فاضي\"."},
  why:{en:"Naming a feeling engages your rational brain and measurably lowers the reactivity of your brain's alarm center — a documented effect called affect labeling.",
        ar:"تسمية الإحساس تنشّط الجزء العقلاني بمخك وتخفف بشكل ملموس تفاعل مركز الإنذار بمخك — تأثير موثّق يُسمى \"تسمية الانفعال\"."},
  positive:{en:"The feeling loses some intensity just from being named, and you respond more deliberately.",
             ar:"الإحساس يخف شوي بس من تسميته، وتتصرف بشكل أكثر وعياً."},
  negative:{en:"Unnamed, diffuse stress tends to leak out sideways — as irritability or tension you don't consciously connect to its source.",
             ar:"التوتر المنتشر اللي ما تسمّيه يميل يطلع بطرق جانبية — نرفزة أو توتر ما تربطه واعياً بمصدره."}
},
{
  action:{en:"Take a real 60-90 second pause between demanding tasks — not scrolling, just pausing.",
           ar:"خذ وقفة حقيقية 60-90 ثانية بين المهام المرهقة — مو تصفح، بس وقفة."},
  why:{en:"Switching tasks with no pause keeps your stress hormones and nervous system activated continuously, instead of letting them settle between demands.",
        ar:"تبديل المهام بدون وقفة يخلّي هرمونات التوتر وجهازك العصبي مفعّلين باستمرار، بدل ما تهدى بين كل مهمة وثانية."},
  positive:{en:"You meet the next task from a calmer baseline instead of a stacked one.",
             ar:"توصل للمهمة الجاية من نقطة أهدأ بدل نقطة متراكمة."},
  negative:{en:"Back-to-back demands with no recovery gap compound across the day — often peaking as evening irritability or feeling wired but tired at night.",
             ar:"المهام المتتالية بدون فجوة تعافي تتراكم طول اليوم — وغالباً توصل ذروتها كنرفزة مسائية أو إحساس \"مشحون بس تعبان\" بالليل."}
},
{
  action:{en:"A brief cool splash of water on your face or hands — or end your shower slightly cooler.",
           ar:"رشة مويه باردة سريعة على وجهك أو إيدك — أو خلّي آخر دشك أبرد شوي."},
  why:{en:"This triggers the \"dive reflex,\" a fast vagal response that slows your heart rate — one of the quickest known ways to interrupt acute stress.",
        ar:"هذا يحفّز \"منعكس الغوص\"، استجابة سريعة بالعصب المبهم تبطّئ ضربات قلبك — من أسرع الطرق المعروفة توقف التوتر الحاد."},
  positive:{en:"A quick, reliable reset when something has spiked your stress in the moment.",
             ar:"إعادة ضبط سريعة وموثوقة لما شي يرفع توترك باللحظة."},
  negative:{en:"Without an active reset tool, a stress spike just rides itself out slowly over the following 20-60+ minutes.",
             ar:"بدون أداة تعيد ضبطك فعلياً، ارتفاع التوتر ياخذ وقته يهدى لحاله على مدى 20-60 دقيقة أو أكثر."}
},
{
  action:{en:"A hand on your chest, or a slow self-hug for 20-30 seconds when overwhelmed.",
           ar:"حط إيدك على صدرك، أو احضن نفسك ببطء لمدة 20-30 ثانية لما تحس مثقّل."},
  why:{en:"Gentle, sustained pressure signals safety to your nervous system — the same mechanism behind why weighted blankets help some people.",
        ar:"الضغط الهادئ المستمر يرسل إشارة أمان لجهازك العصبي — نفس الآلية اللي تخلّي البطانيات الثقيلة تساعد بعض الناس."},
  positive:{en:"A fast, always-available way to calm down in the moment, anywhere.",
             ar:"طريقة سريعة ومتاحة دايماً تهدّي فيها نفسك باللحظة، بأي مكان."},
  negative:{en:"Without a physical tool, people often reach only for thoughts (\"just think positive\") — which work far less well when the body, not the mind, is the actual problem.",
             ar:"بدون أداة جسدية، الناس غالباً يلجأون بس للأفكار (\"بس فكّر إيجابي\") — وهذي تشتغل أضعف بكثير لما الجسم، مو العقل، هو المشكلة الفعلية."}
},
{
  action:{en:"Spend a few minutes looking at or being in a natural setting — trees, sky, plants; even a window view counts partially.",
           ar:"اصرف كم دقيقة تشوف أو تكون بمكان طبيعي — أشجار، سما، نباتات؛ حتى إطلالة من الشباك تفيد جزئياً."},
  why:{en:"Natural scenes engage a soft, low-effort form of attention that lets your brain's focus resources recover — unlike screens, which demand constant directed attention.",
        ar:"المناظر الطبيعية تشغّل انتباه هادي وخفيف الجهد يخلّي موارد التركيز بمخك تتعافى — عكس الشاشات اللي تطلب انتباه موجّه مستمر."},
  positive:{en:"Measurably restored focus and lower stress after even a short exposure.",
             ar:"تركيز يرجع بشكل ملموس وتوتر أقل حتى بعد تعرّض قصير."},
  negative:{en:"Attention that never gets this kind of break stays depleted — showing up as irritability and trouble concentrating by day's end.",
             ar:"الانتباه اللي ما ياخذ هالنوع من الراحة يضل مستنزف — ويبين كنرفزة وصعوبة تركيز آخر اليوم."}
},
{
  action:{en:"Notice your own early physical signs of stress — jaw clenching, shallow breath, tense shoulders — before they build up.",
           ar:"انتبه لعلاماتك الجسدية المبكرة للتوتر — شد الفك، تنفس ضحل، كتف متوتر — قبل ما تتراكم."},
  why:{en:"Noticing internal body signals lets you intervene while stress is still small and easy to shift, instead of only noticing once it's large.",
        ar:"ملاحظة إشارات جسدك الداخلية تخلّيك تتدخل والتوتر لسا صغير وسهل تغييره، بدل ما تلاحظه بس لما يصير كبير."},
  positive:{en:"You catch and defuse stress early, before it accumulates into a bad afternoon or a bad night's sleep.",
             ar:"تمسك التوتر وتفكّكه بدري، قبل ما يتراكم لعصر سيء أو نوم سيء."},
  negative:{en:"Without this awareness, stress often isn't noticed until it's already large, and takes much more to bring back down.",
             ar:"بدون هالوعي، التوتر غالباً ما يُلاحظ إلا وهو كبير، ويحتاج جهد أكبر بكثير يرجع يهدى."}
},
{
  action:{en:"Before a known stressful event, use one of these tools deliberately beforehand — not just after.",
           ar:"قبل موقف تعرف إنه بيوترك، استخدم إحدى هالأدوات بشكل مقصود قبله — مو بس بعده."},
  why:{en:"Your baseline arousal state going into a stressor determines how high it spikes you — starting calmer means peaking lower.",
        ar:"حالة تفعيلك الأساسية وأنت داخل على الموقف تحدد كم بيرفعك — تبدأ أهدأ يعني ذروتك أوطى."},
  positive:{en:"You go into hard moments from a steadier baseline and recover from them faster too.",
             ar:"تدخل اللحظات الصعبة من نقطة أثبت، وتتعافى منها أسرع كمان."},
  negative:{en:"Entering stressful events already keyed-up means the same event hits you harder and takes longer to recover from.",
             ar:"دخولك للموقف وأنت مشحون أصلاً يعني نفس الموقف يضربك أقوى وياخذ وقت أطول تتعافى منه."}
},
{
  action:{en:"Once a week, notice which tool actually worked for you, and lean into it more next week.",
           ar:"مرة بالأسبوع، لاحظ أي أداة اشتغلت معك فعلياً، واعتمد عليها أكثر الأسبوع الجاي."},
  why:{en:"Nervous system regulation is personal — what calms one person (movement) may not work as well for another (stillness). Tracking what actually works for you beats following a generic list.",
        ar:"تنظيم الجهاز العصبي شخصي — اللي يهدّي شخص (حركة) ممكن ما يشتغل نفس الشي لثاني (سكون). تتبع اللي يشتغل معك فعلاً أفضل من اتباع قائمة عامة."},
  positive:{en:"Your toolkit gets more effective over time instead of staying generic.",
             ar:"أدواتك تصير أفعل مع الوقت بدل ما تضل عامة."},
  negative:{en:"Never noticing what works means reaching for the same ineffective tool out of habit, again and again.",
             ar:"ما تلاحظ اللي يشتغل يعني ترجع لنفس الأداة الضعيفة من العادة، مرة بعد مرة."}
}
]

};
