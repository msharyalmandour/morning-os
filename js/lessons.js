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
  { key:'social',     emoji:'🤝', hue:'blush' }
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

social: [
{
  action:{en:"Have one real, voice or in-person conversation today — not text — even 5 minutes.",
           ar:"اسوِ محادثة حقيقية اليوم — مكالمة أو وجهاً لوجه، مو نص — حتى لو 5 دقايق بس."},
  why:{en:"Voice and face carry tone and pace that text strips out entirely — hearing a real voice measurably lowers stress hormones in a way reading a message doesn't.",
        ar:"الصوت والوجه ينقلون نبرة وإيقاع النص ما يقدر ينقلهم أبداً — سماع صوت حقيقي ينزّل هرمونات التوتر بشكل ملموس، وهذا ما يصير بقراءة رسالة."},
  positive:{en:"A real mood lift the same day — bigger than any amount of texting produces.",
             ar:"تحسّن حقيقي بمزاجك نفس اليوم — أكبر من أي كمية مسجات."},
  negative:{en:"Substituting texting for voice or in-person contact leaves the calming effect of real connection largely untapped, even while you feel \"in touch.\"",
             ar:"استبدال التواصل الصوتي أو المباشر بالنص يخلّي أثر التواصل الحقيقي المهدّئ غير مستخدم غالباً، حتى لو حاسس إنك \"متواصل\"."}
},
{
  action:{en:"Notice one moment today you reach for your phone from boredom or unease, not need — and wait 10 seconds before opening it.",
           ar:"لاحظ لحظة وحدة اليوم تمد إيدك فيها للموبايل من الملل أو القلق مو من حاجة فعلية — واستنى 10 ثواني قبل ما تفتحه."},
  why:{en:"That short pause interrupts the automatic dopamine-seeking loop that habitual checking builds, giving you a real moment of choice instead of autopilot.",
        ar:"هالوقفة القصيرة توقف حلقة البحث التلقائي عن الدوبامين اللي يبنيها تفقّد الموبايل المتكرر، وتديك لحظة اختيار حقيقية بدل ما تصير عادة آلية."},
  positive:{en:"Awareness alone starts loosening the automatic grip within days.",
             ar:"مجرد الانتباه يبدأ يخفف القبضة التلقائية خلال كم يوم."},
  negative:{en:"Unexamined automatic checking reinforces itself a little more each time, making the habit progressively harder to even notice.",
             ar:"التفقّد التلقائي اللي ما تنتبه له يعزز نفسه شوي كل مرة، ويصير أصعب حتى تلاحظه مع الوقت."}
},
{
  action:{en:"Turn off non-essential notifications for a two-hour block today.",
           ar:"سكّر الإشعارات الغير ضرورية لمدة ساعتين اليوم."},
  why:{en:"Each notification carries a small attention-switching cost and an anticipatory dopamine hit that fragments focus and quietly primes low-grade anxiety, regardless of its content.",
        ar:"كل إشعار يحمل كلفة صغيرة بتبديل الانتباه ودفعة دوبامين ترقّبية تفتّت تركيزك وتحضّر لقلق خفيف بهدوء، بغض النظر عن محتواه."},
  positive:{en:"Noticeably deeper focus and a calmer background hum during that block.",
             ar:"تركيز أعمق بشكل ملحوظ وهدوء خلفي أثناء هالفترة."},
  negative:{en:"Constant interruption keeps your nervous system in a low-grade \"waiting\" state that drains energy without registering as fatigue.",
             ar:"المقاطعة المستمرة تخلّي جهازك العصبي بحالة \"انتظار\" خفيفة تستنزف طاقتك بدون ما تحس فيها كتعب واضح."}
},
{
  action:{en:"Eat one meal today with no phone at the table — alone or with others.",
           ar:"كل وجبة اليوم بدون موبايل عالطاولة — لحالك أو مع ناس."},
  why:{en:"A screen-free meal supports digestion (it lets your nervous system stay in \"rest and digest\" mode) and, when shared, a documented bonding effect that a phone at the table measurably blunts.",
        ar:"الوجبة بدون شاشة تدعم الهضم (تخلّي جهازك العصبي بوضع \"الراحة والهضم\") وتدعم — لو كانت مشتركة — رابطة اجتماعية موثّقة، والموبايل عالطاولة يضعفها بشكل ملموس."},
  positive:{en:"Better digestion, and if shared, a warmer sense of connection afterward.",
             ar:"هضم أفضل، ولو كانت الوجبة مشتركة، إحساس ألطف بالتواصل بعدها."},
  negative:{en:"A screen at the table splits attention enough to blunt both the digestive and social benefit of the meal, even if no one mentions it.",
             ar:"الشاشة عالطاولة تقسّم الانتباه لدرجة تضعف فايدة الهضم والتواصل الاجتماعي للوجبة، حتى لو محد قال شي."}
},
{
  action:{en:"Reach out first to one person you've been meaning to talk to — don't wait for them to text first.",
           ar:"تواصل أنت أول مع شخص تنوي تكلمه من فترة — لا تستنى إنه يبدأ هو."},
  why:{en:"Most people significantly underestimate how much others appreciate being reached out to — this well-documented gap keeps many real connections dormant simply because everyone is waiting.",
        ar:"أغلب الناس يقلّلون من تقدير الطرف الثاني لمن يتواصل معه أول — هالفجوة الموثّقة تخلّي علاقات حقيقية كثيرة نايمة بس لأن الكل مستني."},
  positive:{en:"You'll likely find the contact is warmer and easier than you expected.",
             ar:"غالباً بتلاقي التواصل أدفى وأسهل مما توقعت."},
  negative:{en:"Waiting indefinitely for others to initiate quietly narrows your circle over time — not because people don't care, but because everyone is waiting on someone else.",
             ar:"انتظار الطرف الثاني بلا نهاية يضيّق دائرتك بهدوء مع الوقت — مو لأن الناس ما تهتم، بس لأن الكل مستني الثاني."}
},
{
  action:{en:"Set one specific window today when your phone is fully out of reach — not just silenced.",
           ar:"حدد فترة معينة اليوم يكون فيها موبايلك بعيد عن إيدك تماماً — مو بس صامت."},
  why:{en:"Just having your phone visible or within reach measurably reduces available attention, even switched off — this is a separate effect from notifications entirely.",
        ar:"مجرد وجود موبايلك أمام عينك أو بمتناول إيدك يقلل انتباهك المتاح بشكل ملموس، حتى لو مقفول — وهذا تأثير منفصل تماماً عن الإشعارات."},
  positive:{en:"A window of genuinely undistracted presence — in conversation or in your own thoughts.",
             ar:"فترة حضور حقيقي غير مشتت — بمحادثة أو بأفكارك أنت."},
  negative:{en:"A visible phone keeps a small share of your attention permanently reserved for it, even during conversations that deserve your full presence.",
             ar:"الموبايل المرئي يحجز جزء صغير من انتباهك بشكل دائم له، حتى بمحادثات تستاهل حضورك الكامل."}
},
{
  action:{en:"Ask someone a real follow-up question today about something they mentioned before — show you remembered.",
           ar:"اسأل حد اليوم سؤال متابعة حقيقي عن شي ذكره لك قبل — خلّه يحس إنك تتذكر."},
  why:{en:"Being remembered and followed up on is one of the strongest, cheapest signals of care in a relationship — and it's rarer than people think in a distracted culture.",
        ar:"إحساس الطرف الثاني إنك تتذكره وتتابع معه من أقوى وأرخص إشارات الاهتمام بأي علاقة — وهي أندر مما تتوقع بثقافة مليانة تشتت."},
  positive:{en:"Relationships measurably deepen through small remembered details more than through grand gestures.",
             ar:"العلاقات تعمّق بشكل ملموس بالتفاصيل الصغيرة المتذكَّرة أكثر من اللفتات الكبيرة."},
  negative:{en:"Conversations that never follow up on what mattered to the other person tend to stay surface-level indefinitely, however frequent they are.",
             ar:"المحادثات اللي ما تتابع اللي كان مهم للطرف الثاني تضل سطحية بلا نهاية، مهما كانت متكررة."}
},
{
  action:{en:"Notice — without judging either — which of your relationships feel energizing versus draining lately.",
           ar:"لاحظ — بدون ما تحكم على أي منهم — أي علاقاتك تحس إنها تعطيك طاقة وأيها تستنزفك مؤخراً."},
  why:{en:"Not all social contact is equally restorative — distinguishing the two lets you invest attention where it actually replenishes you, not just where it's most available (like a group chat).",
        ar:"مو كل تواصل اجتماعي يجدّد طاقتك بنفس القدر — التمييز بينهم يخليك تصرف انتباهك بمكان يعوّضك فعلاً، مو بس بأسهل مكان متاح (زي قروب دردشة)."},
  positive:{en:"You start protecting time for what genuinely recharges you.",
             ar:"تبدأ تحمي وقتك للي فعلاً يشحنك."},
  negative:{en:"Treating all social contact as interchangeable means the most available (often shallowest) contact crowds out what would actually help.",
             ar:"معاملة كل تواصل اجتماعي كأنه متشابه يخلّي أسهل تواصل متاح (غالباً الأسطحي) ياخذ مكان اللي كان يفيدك فعلاً."}
},
{
  action:{en:"Do an honest check of today: how much of your social time was real presence versus parallel scrolling next to people?",
           ar:"سوِّ مراجعة صادقة لليوم: قد إيش من وقتك الاجتماعي كان حضور حقيقي، وقد إيش كان تصفح موازي جنب ناس؟"},
  why:{en:"\"Phubbing\" (phone-snubbing during shared time) is linked to lower relationship satisfaction even when the people involved don't consciously register the cause.",
        ar:"\"التجاهل بسبب الموبايل\" وقت التواصل المشترك مرتبط برضا أقل بالعلاقة، حتى لو الطرفين ما ربطوا السبب بوعي."},
  positive:{en:"Awareness of the pattern is the first and biggest step to closing the gap between time spent together and time truly connected.",
             ar:"الوعي بهالنمط هو أول وأكبر خطوة تقفل بيها الفجوة بين الوقت اللي تقضيه مع ناس والوقت اللي فعلاً متواصل فيه."},
  negative:{en:"An unexamined pattern of parallel scrolling can leave you feeling lonely even while surrounded by people, without a clear reason why.",
             ar:"نمط التصفح الموازي اللي ما تنتبه له ممكن يخليك تحس بالوحدة حتى وأنت محاط بناس، بدون ما تعرف السبب بوضوح."}
}
]

};

/* ============================================================
   "الجديد" — What's New: rotating research-digest pool.
   Not tied to specific citations — plain-language, well-established
   findings, each turned into a one-tap experiment. One item "features"
   per day (deterministic by day-of-year), premium unlocks browsing
   the full pool.
   ============================================================ */
const WHATS_NEW = [
  { id:'wn1', topic:'sleep',
    headline:{en:"A short afternoon nap (under 30 minutes) raises alertness without hurting nighttime sleep — a longer nap does the opposite.",
               ar:"غفوة قصيرة بعد الظهر (أقل من 30 دقيقة) ترفع يقظتك بدون ما تأثر على نوم الليل — الغفوة الطويلة تسوي العكس."},
    experiment:{en:"If you nap today, set an alarm for 15-20 minutes.",
                 ar:"لو بتغفى اليوم، حط منبه لـ15-20 دقيقة بس."} },
  { id:'wn2', topic:'nutrition',
    headline:{en:"Eating order matters almost as much as content — vegetables and protein before refined carbs measurably flattens the after-meal blood-sugar spike.",
               ar:"ترتيب الأكل يأثر بقد نوعه تقريباً — أكل الخضار والبروتين قبل الكارب المكرر يخفف ارتفاع السكر بعد الوجبة بشكل ملموس."},
    experiment:{en:"At your next meal, eat the vegetables and protein first, carbs last.",
                 ar:"بوجبتك الجاية، كل الخضار والبروتين أول، والكارب آخر شي."} },
  { id:'wn3', topic:'movement',
    headline:{en:"Short movement breaks (2-3 minutes) spread through the day give cardiovascular benefit close to one longer session, for the same total time.",
               ar:"فترات حركة قصيرة (2-3 دقايق) موزعة باليوم تعطي فايدة قلبية-وعائية قريبة من جلسة تمرين وحدة أطول، لو كان مجموع الوقت متشابه."},
    experiment:{en:"Today, stand and move for 2 minutes every hour of sitting instead of one long session.",
                 ar:"اليوم، قوم وتحرك دقيقتين كل ساعة قعود بدل جلسة تمرين وحدة طويلة."} },
  { id:'wn4', topic:'social',
    headline:{en:"Just having a phone visible on the table (even face-down, even off) measurably lowers how present a conversation feels.",
               ar:"مجرد وجود الموبايل على الطاولة (حتى مقلوب أو مقفول) يقلل بشكل ملموس إحساس الحضور بالمحادثة."},
    experiment:{en:"In your first conversation today, put your phone in your pocket or another room.",
                 ar:"بأول محادثة تجيك اليوم، حط الموبايل بجيبك أو غرفة ثانية."} },
  { id:'wn5', topic:'sleep',
    headline:{en:"Blue-toned light before bed delays your body clock more than warm-toned light at the same brightness.",
               ar:"الضوء الأزرق قبل النوم يأخّر ساعتك الداخلية أكثر من الضوء الدافي بنفس السطوع."},
    experiment:{en:"Switch your screen to warm/night mode starting at 8pm tonight.",
                 ar:"فعّل وضع الإضاءة الدافية على شاشتك من الساعة 8 مساءً الليلة."} },
  { id:'wn6', topic:'nutrition',
    headline:{en:"A full glass of water 10 minutes before a meal raises fullness and reduces how much you eat, without feeling like restriction.",
               ar:"كاس مويه كامل قبل الوجبة بعشر دقايق يرفع إحساس الشبع ويقلل كمية الأكل، بدون ما تحس بحرمان."},
    experiment:{en:"Drink a full glass of water 10 minutes before your next meal.",
                 ar:"اشرب كاس مويه كامل قبل وجبتك الجاية بعشر دقايق."} },
  { id:'wn7', topic:'movement',
    headline:{en:"A short walk right after a meal blunts the post-meal blood-sugar spike more than the same walk at any other time of day.",
               ar:"مشية قصيرة بعد الأكل مباشرة تخفف ارتفاع السكر بعد الوجبة أكثر من نفس المشية بأي وقت ثاني باليوم."},
    experiment:{en:"Walk for 10 minutes right after your largest meal today.",
                 ar:"امشِ 10 دقايق بعد أكبر وجبة عندك اليوم مباشرة."} },
  { id:'wn8', topic:'social',
    headline:{en:"A voice call lowers stress hormones more than a text conversation with identical content.",
               ar:"المكالمة الصوتية تخفض هرمونات التوتر أكثر من محادثة نصية بنفس المحتوى بالضبط."},
    experiment:{en:"Call one person today instead of texting them.",
                 ar:"اتصل بشخص وحد اليوم بدل ما ترسله رسالة."} },
  { id:'wn9', topic:'sleep',
    headline:{en:"A cluttered bedroom is linked to lower sleep quality, independent of noise or temperature.",
               ar:"غرفة النوم الفوضوية مرتبطة بجودة نوم أقل، بشكل مستقل عن الضجة أو الحرارة."},
    experiment:{en:"Clear just one surface in your bedroom before you sleep tonight.",
                 ar:"رتب سطح واحد بس بغرفة نومك قبل ما تنام الليلة."} },
  { id:'wn10', topic:'movement',
    headline:{en:"A short resistance-movement set raises insulin sensitivity for hours afterward — not just during the movement itself.",
                ar:"مجموعة تمارين مقاومة قصيرة ترفع حساسية الإنسولين لساعات بعدها — مو بس أثناء التمرين نفسه."},
    experiment:{en:"Do one set of squats or push-ups today, even a short one.",
                 ar:"اسوِ سيت واحد سكوات أو ضغط اليوم — حتى لو قصير."} }
];
