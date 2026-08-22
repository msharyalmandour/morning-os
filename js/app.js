/* ============================= STATE ============================= */
const DEFAULT_STATE = {
  user: null,               // { name }
  goal: null,
  onboarded: false,
  dark: false,
  waterGoal: 8,
  water: { date: null, count: 0 },
  ritual: { history: {} },  // { 'YYYY-MM-DD': {weather, energy, intention, gratitude, completedAt} }
  journal: [],               // [{id, date, ts, mood, text}]
  scoreHistory: {},          // { 'YYYY-MM-DD': {total, breakdown} }
  streak: 0,
  chatLog: []                // [{who:'ai'|'user', text, ts}]
};
let state = loadState();
function loadState(){
  try{
    const raw = localStorage.getItem('morningOS_state');
    if(raw){
      const parsed = JSON.parse(raw);
      const merged = JSON.parse(JSON.stringify(DEFAULT_STATE));
      Object.assign(merged, parsed);
      merged.water = Object.assign({}, DEFAULT_STATE.water, parsed.water);
      merged.ritual = Object.assign({history:{}}, parsed.ritual);
      return merged;
    }
  }catch(e){}
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}
function saveState(){ try{ localStorage.setItem('morningOS_state', JSON.stringify(state)); }catch(e){} }
function todayKey(){ return new Date().toISOString().slice(0,10); }
function dateKeyOffset(n){ const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); }

const WEATHER = [
  { key:'sunny',  emoji:'☀️' },
  { key:'cloudy', emoji:'☁️' },
  { key:'rainy',  emoji:'🌧️' },
  { key:'stormy', emoji:'⛈️' }
];
function weatherEmoji(key){ const w = WEATHER.find(w=>w.key===key); return w ? w.emoji : '🌤️'; }

/* ============================= LANGUAGE ============================= */
function setLang(newLang){
  lang = newLang;
  localStorage.setItem('morningOS_lang', lang);
  applyLanguage();
}
function applyLanguage(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{ el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{ el.placeholder = t(el.dataset.i18nPh); });
  document.getElementById('langToggle').textContent = lang === 'ar' ? 'EN' : 'عربي';
  buildGoalOptions();
  buildWeatherGrid();
  renderSettingsUI();
  initHero();
  renderHome();
  renderJournal();
  renderInsights();
  renderMemoryChips();
  renderChat();
  if(document.getElementById('ritualOverlay') && !document.getElementById('ritualOverlay').classList.contains('hidden')){
    refreshRitualStepText();
  }
}

/* ============================= HERO ============================= */
function getTimePhase(){
  const h = new Date().getHours();
  if(h>=21 || h<5) return 'night';
  if(h<12) return 'morning';
  if(h<18) return 'afternoon';
  return 'evening';
}
let heroDecorated=false, starsDone=false;
function initHero(){
  const phase = getTimePhase();
  const name = state.user ? state.user.name : (lang==='ar'?'صديقي':'friend');
  const sky=document.getElementById('heroSky'), eyebrow=document.getElementById('heroEyebrow'),
        greeting=document.getElementById('heroGreeting'), sub=document.getElementById('heroSub'),
        sun=document.getElementById('heroSun'), moon=document.getElementById('heroMoon'), rays=document.getElementById('heroRays');
  const map = {
    morning:{sky:'sky-morning', pos:{top:'56px', insetInlineStart:'26px'}},
    afternoon:{sky:'sky-afternoon', pos:{top:'22px', insetInlineStart:'50%'}},
    evening:{sky:'sky-evening', pos:{top:'34px', insetInlineEnd:'30px'}},
    night:{sky:'sky-night', pos:{top:'30px', insetInlineEnd:'34px'}}
  };
  const m = map[phase];
  sky.className = 'hero-sky ' + m.sky;
  eyebrow.textContent = t('greet_'+phase+'_eyebrow');
  greeting.textContent = t('greet_'+phase+'_title_name')(name);
  sub.textContent = t('greet_'+phase+'_sub');

  if(phase==='night'){
    sun.style.display='none'; moon.style.display='block';
    Object.assign(moon.style, {top:'',insetInlineEnd:'',insetInlineStart:''}, m.pos);
    rays.classList.add('dim');
    ensureStars();
  } else {
    sun.style.display='block'; moon.style.display='none'; rays.classList.remove('dim');
    Object.assign(sun.style, {top:'',insetInlineStart:'',insetInlineEnd:''}, m.pos);
    if(phase==='evening'){
      sun.style.background='radial-gradient(circle at 35% 35%,#F4E9D8,#E8DCC0 60%,transparent 100%)';
      sun.style.boxShadow='0 0 50px 16px rgba(230,220,190,0.35)'; sun.style.width='64px'; sun.style.height='64px';
    } else { sun.style.background=''; sun.style.boxShadow=''; sun.style.width='110px'; sun.style.height='110px'; }
  }

  if(!heroDecorated){
    heroDecorated=true;
    const field=document.getElementById('particleField');
    for(let i=0;i<12;i++){
      const p=document.createElement('div'); p.className='particle';
      p.style.left=(Math.random()*100)+'%'; p.style.bottom=(Math.random()*36)+'px';
      p.style.animationDuration=(6+Math.random()*6)+'s'; p.style.animationDelay=(Math.random()*6)+'s';
      field.appendChild(p);
    }
    const leafRow=document.getElementById('leafRow'); const leaves=['🍃','🌿','🍃'];
    for(let i=0;i<6;i++){
      const l=document.createElement('span'); l.className='leaf'; l.textContent=leaves[i%leaves.length];
      l.style.left=(i*17+2)+'%'; l.style.animationDelay=(i*0.4)+'s';
      leafRow.appendChild(l);
    }
  }
}
function ensureStars(){
  if(starsDone) return; starsDone=true;
  const wrap=document.getElementById('heroStars');
  for(let i=0;i<24;i++){
    const s=document.createElement('i');
    s.style.left=(Math.random()*100)+'%'; s.style.top=(Math.random()*60)+'%'; s.style.animationDelay=(Math.random()*4)+'s';
    wrap.appendChild(s);
  }
}

/* ============================= NAV ============================= */
document.querySelectorAll('.nav-btn').forEach(btn=> btn.addEventListener('click', ()=> showScreen(btn.dataset.screen)));
function showScreen(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-'+name).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.screen===name));
  document.getElementById('screens').scrollTop = 0;
  if(name==='journal') renderJournal();
  if(name==='memory'){ renderMemoryChips(); renderChat(); }
  if(name==='insights') renderInsights();
}

/* ============================= VIEW MODAL ============================= */
const viewOverlay=document.getElementById('viewOverlay'), viewBody=document.getElementById('viewBody');
function openView(html){ viewBody.innerHTML=html; viewOverlay.classList.add('active'); }
function closeView(){ viewOverlay.classList.remove('active'); }
document.getElementById('viewClose').addEventListener('click', closeView);
viewOverlay.addEventListener('click', e=>{ if(e.target===viewOverlay) closeView(); });

/* ============================= LIFE SCORE ============================= */
function calcStreak(){
  const hist = state.ritual.history;
  let streak = 0;
  let cursor = new Date();
  if(!hist[todayKey()]) cursor.setDate(cursor.getDate()-1);
  while(true){
    const key = cursor.toISOString().slice(0,10);
    if(hist[key]){ streak++; cursor.setDate(cursor.getDate()-1); } else break;
  }
  return streak;
}
function recalcLifeScore(){
  const dateStr = todayKey();
  const ritualEntry = state.ritual.history[dateStr];
  const ritualPts = ritualEntry ? Math.round(15 + ritualEntry.energy*3) : 0;
  const hydrationPts = Math.round(Math.min(state.water.count/state.waterGoal, 1) * 20);
  const journalToday = state.journal.some(e=>e.date===dateStr);
  const journalPts = journalToday ? 20 : 0;
  const streak = calcStreak();
  const streakPts = Math.round(Math.min(streak,10)/10*15);
  const recentEnergies=[];
  for(let i=0;i<7 && recentEnergies.length<3;i++){
    const e = state.ritual.history[dateKeyOffset(-i)];
    if(e) recentEnergies.push(e.energy);
  }
  const moodAvg = recentEnergies.length ? recentEnergies.reduce((a,b)=>a+b,0)/recentEnergies.length : 2.5;
  const moodPts = Math.round(moodAvg/5*15);
  const total = ritualPts+hydrationPts+journalPts+streakPts+moodPts;
  state.scoreHistory[dateStr] = { total, breakdown:{ritual:ritualPts,hydration:hydrationPts,journal:journalPts,streak:streakPts,mood:moodPts} };
  state.streak = streak;
  saveState();
}

function renderHome(){
  initHero();
  recalcLifeScore();
  const dateStr = todayKey();
  const today = state.scoreHistory[dateStr] || {total:0, breakdown:{ritual:0,hydration:0,journal:0,streak:0,mood:0}};
  const ritualEntry = state.ritual.history[dateStr];

  ['scoreRing','scoreRing2'].forEach(id=>{ const el=document.getElementById(id); if(el) el.style.setProperty('--pct', today.total); });
  const v1=document.getElementById('scoreVal'); if(v1) v1.textContent = today.total;
  const v2=document.getElementById('scoreVal2'); if(v2) v2.textContent = today.total;

  document.getElementById('statMood').textContent = ritualEntry ? weatherEmoji(ritualEntry.weather) : '–';
  document.getElementById('statWater').textContent = `${state.water.count}/${state.waterGoal}`;
  document.getElementById('statStreak').textContent = state.streak;

  const whyCard=document.getElementById('scoreWhyCard'), whyText=document.getElementById('scoreWhyText');
  const yesterday = state.scoreHistory[dateKeyOffset(-1)];
  if(yesterday){
    const delta = today.total - yesterday.total;
    let msg;
    if(delta > 4) msg = lang==='ar' ? `ارتفعت نقاطك ${delta} نقطة عن أمس — استمر كذا.` : `Your score is up ${delta} points from yesterday — keep it going.`;
    else if(delta < -4) msg = lang==='ar' ? `نقاطك نزلت ${Math.abs(delta)} نقطة عن أمس. جرب تكمل طقس الصباح أو تشرب مويه أكثر.` : `Your score dipped ${Math.abs(delta)} points from yesterday. A finished ritual or a bit more water can help.`;
    else msg = lang==='ar' ? 'نقاطك ثابتة تقريباً زي أمس.' : "Your score is holding steady with yesterday.";
    whyText.textContent = msg; whyCard.style.display='block';
  } else { whyCard.style.display='none'; }

  const ctaIcon=document.getElementById('ritualCtaIcon'), ctaTitle=document.getElementById('ritualCtaTitle'), ctaSub=document.getElementById('ritualCtaSub');
  if(ritualEntry){ ctaIcon.textContent='✅'; ctaTitle.textContent=t('ritual_cta_done_title'); ctaSub.textContent=t('ritual_cta_done_sub'); }
  else { ctaIcon.textContent='☀️'; ctaTitle.textContent=t('ritual_cta_todo_title'); ctaSub.textContent=t('ritual_cta_todo_sub'); }

  renderWaterRow();
  renderWeekBars('weekBars', 7);
}
document.getElementById('ritualCta').addEventListener('click', ()=>{
  const entry = state.ritual.history[todayKey()];
  if(entry){
    openView(`
      <h2 data-i18n-skip>${t('ritual_cta_done_title')}</h2>
      <div class="meta-row" style="margin:10px 0 16px;">
        <span class="mem-chip">${weatherEmoji(entry.weather)} ${t('weather_'+entry.weather)}</span>
        <span class="mem-chip">⚡ ${entry.energy}/5</span>
      </div>
      ${entry.intention ? `<p style="font-size:13px;color:var(--ink-soft);line-height:1.6;"><b style="color:var(--ink);">${t('ritual_intention_title')}:</b><br>${escapeHtml(entry.intention)}</p>` : ''}
      ${entry.gratitude ? `<p style="font-size:13px;color:var(--ink-soft);line-height:1.6;"><b style="color:var(--ink);">${t('ritual_gratitude_title')}:</b><br>${escapeHtml(entry.gratitude)}</p>` : ''}
    `);
  } else {
    startRitual();
  }
});

/* ============================= WATER ============================= */
function ensureWaterDay(){
  if(state.water.date !== todayKey()){ state.water = {date: todayKey(), count:0}; saveState(); }
}
function renderWaterRow(){
  ensureWaterDay();
  const row = document.getElementById('waterRow'); row.innerHTML='';
  for(let i=0;i<state.waterGoal;i++){
    const d = document.createElement('span');
    d.className = 'water-drop' + (i<state.water.count ? ' filled' : '');
    d.textContent = '💧';
    row.appendChild(d);
  }
  document.getElementById('waterCount').textContent = state.water.count;
  document.getElementById('waterGoalLabel').textContent = t('water_of')(state.waterGoal);
}
document.getElementById('waterPlus').addEventListener('click', ()=>{
  ensureWaterDay();
  if(state.water.count < state.waterGoal){ state.water.count++; saveState(); renderHome(); renderMemoryChips(); }
});
document.getElementById('waterMinus').addEventListener('click', ()=>{
  ensureWaterDay();
  if(state.water.count > 0){ state.water.count--; saveState(); renderHome(); renderMemoryChips(); }
});

/* ============================= WEEK BARS ============================= */
function renderWeekBars(elId, days){
  const wrap = document.getElementById(elId); wrap.innerHTML='';
  const fmt = new Intl.DateTimeFormat(lang==='ar'?'ar':'en', {weekday:'narrow'});
  for(let i=days-1;i>=0;i--){
    const key = dateKeyOffset(-i);
    const rec = state.scoreHistory[key];
    const pct = rec ? Math.max(rec.total,3) : 3;
    const bar = document.createElement('div');
    bar.className = 'bar' + (i===0 ? ' today' : '');
    const d = new Date(); d.setDate(d.getDate()-i);
    bar.innerHTML = `<i style="height:${pct}%"></i><span class="lbl">${fmt.format(d)}</span>`;
    wrap.appendChild(bar);
  }
}

/* ============================= INSIGHTS ============================= */
function renderInsights(){
  const dateStr = todayKey();
  const today = state.scoreHistory[dateStr] || {total:0, breakdown:{ritual:0,hydration:0,journal:0,streak:0,mood:0}};
  document.getElementById('insightsTodayText').textContent = lang==='ar'
    ? `نقاطك اليوم ${today.total} من 100.`
    : `Your score today is ${today.total} out of 100.`;

  const maxes = {ritual:30,hydration:20,journal:20,streak:15,mood:15};
  const card = document.getElementById('breakdownCard');
  card.innerHTML = Object.keys(maxes).map(k=>{
    const val = today.breakdown[k]||0, max=maxes[k];
    return `<div class="bd-row"><span class="bd-label">${t('factor_'+k)}</span><span class="bd-track"><i class="bd-fill" style="width:${Math.round(val/max*100)}%"></i></span><span class="bd-val">${val}/${max}</span></div>`;
  }).join('');

  renderWeekBars('weekBars2', 14);

  const hist = state.ritual.history;
  const keys = Object.keys(hist).sort().reverse().slice(0,30);
  const list = document.getElementById('ritualHistoryList');
  if(!keys.length){
    list.innerHTML = `<p class="empty-note">${t('ritual_history_empty')}</p>`;
  } else {
    const fmt = new Intl.DateTimeFormat(lang==='ar'?'ar':'en', {month:'short', day:'numeric'});
    list.innerHTML = keys.map(k=>{
      const e = hist[k];
      return `<div class="rh-row"><span class="rh-emoji">${weatherEmoji(e.weather)}</span><div><div class="rh-date">${fmt.format(new Date(k+'T00:00:00'))} · ⚡${e.energy}/5</div>${e.intention?`<div class="rh-text">${escapeHtml(e.intention)}</div>`:''}</div></div>`;
    }).join('');
  }
}

/* ============================= MORNING RITUAL ============================= */
let ritualSelectedWeather=null, breathTimers=[];
function showRitualStep(id){
  document.querySelectorAll('.ritual-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('rs-'+id).classList.add('active');
}
function refreshRitualStepText(){
  const phase = getTimePhase();
  const name = state.user ? state.user.name : (lang==='ar'?'صديقي':'friend');
  document.getElementById('rsWelcomeEmoji').textContent = phase==='night' ? '🌙' : phase==='evening' ? '🌇' : '☀️';
  document.getElementById('rsWelcomeTitle').textContent = t('greet_'+phase+'_title_name')(name);
  document.getElementById('rsWelcomeSub').textContent = t('ritual_welcome_sub');
  document.getElementById('rsBeginBtn').textContent = t('ritual_begin');
}
function startRitual(){
  ritualSelectedWeather=null;
  document.getElementById('energySlider').value=3; document.getElementById('energyVal').textContent='3';
  document.getElementById('intentionInput').value=''; document.getElementById('gratitudeInput').value='';
  document.querySelectorAll('.weather-opt').forEach(b=>b.classList.remove('selected'));
  refreshRitualStepText();
  document.getElementById('ritualOverlay').classList.remove('hidden');
  showRitualStep('welcome');
}
function buildWeatherGrid(){
  const grid = document.getElementById('weatherGrid'); grid.innerHTML='';
  WEATHER.forEach(w=>{
    const btn=document.createElement('button');
    btn.className='weather-opt'+(ritualSelectedWeather===w.key?' selected':'');
    btn.innerHTML = `${w.emoji}<small>${t('weather_'+w.key)}</small>`;
    btn.addEventListener('click', ()=>{ ritualSelectedWeather=w.key; document.querySelectorAll('.weather-opt').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); });
    grid.appendChild(btn);
  });
}
document.getElementById('rsBeginBtn').addEventListener('click', ()=>{ showRitualStep('breathe'); runRitualBreathing(); });
document.getElementById('ritualSkip').addEventListener('click', ()=>{ breathTimers.forEach(clearTimeout); document.getElementById('ritualOverlay').classList.add('hidden'); });
document.getElementById('rsBreatheContinue').addEventListener('click', ()=>{ breathTimers.forEach(clearTimeout); showRitualStep('weather'); });
document.getElementById('energySlider').addEventListener('input', e=>{ document.getElementById('energyVal').textContent = e.target.value; });
document.getElementById('rsWeatherNext').addEventListener('click', ()=>{
  if(!ritualSelectedWeather) ritualSelectedWeather='sunny';
  showRitualStep('intention');
});
document.getElementById('rsIntentionNext').addEventListener('click', ()=>{
  const entry = {
    weather: ritualSelectedWeather || 'sunny',
    energy: parseInt(document.getElementById('energySlider').value,10),
    intention: document.getElementById('intentionInput').value.trim(),
    gratitude: document.getElementById('gratitudeInput').value.trim(),
    completedAt: new Date().toISOString()
  };
  state.ritual.history[todayKey()] = entry;
  saveState();
  recalcLifeScore();
  const streak = state.streak;
  document.getElementById('rsDoneSub').textContent = lang==='ar'
    ? 'حفظنا نيتك على جهازك. رجعلها أي وقت من صفحة التحليلات.'
    : "We've saved your intention on this device. You can revisit it anytime from Insights.";
  document.getElementById('rsStreakCard').innerHTML = `<div class="tip-card"><div class="tip-icon">🔥</div><div class="tip-text"><b>${t('streak_days')(streak)}</b><p>${lang==='ar'?'سلسلة طقوس الصباح':'morning ritual streak'}</p></div></div>`;
  showRitualStep('done');
  renderHome(); renderInsights(); renderMemoryChips();
});
document.getElementById('rsEnterBtn').addEventListener('click', ()=>{
  document.getElementById('ritualOverlay').classList.add('hidden');
});
function runRitualBreathing(){
  breathTimers.forEach(clearTimeout);
  const circle=document.getElementById('breathCircle'), stage=document.getElementById('breathStage'), count=document.getElementById('breathCount');
  let breath=1;
  function cycle(){
    if(breath>3) return;
    count.textContent = breath;
    stage.textContent = t('breath_in'); circle.style.transform='scale(1.35)';
    breathTimers.push(setTimeout(()=>{
      stage.textContent = t('breath_hold');
      breathTimers.push(setTimeout(()=>{
        stage.textContent = t('breath_out'); circle.style.transform='scale(1)';
        breathTimers.push(setTimeout(()=>{ breath++; cycle(); }, 2200));
      }, 1200));
    }, 2200));
  }
  cycle();
}

/* ============================= JOURNAL ============================= */
let journalSelectedMood=null;
function buildJournalMoodRow(){
  const row = document.getElementById('journalMoodRow'); row.innerHTML='';
  WEATHER.forEach(w=>{
    const btn=document.createElement('button');
    btn.className='mood-btn'+(journalSelectedMood===w.key?' selected':'');
    btn.textContent=w.emoji; btn.title=t('weather_'+w.key);
    btn.addEventListener('click', ()=>{
      journalSelectedMood = journalSelectedMood===w.key ? null : w.key;
      buildJournalMoodRow();
    });
    row.appendChild(btn);
  });
}
document.getElementById('journalSaveBtn').addEventListener('click', ()=>{
  const val = document.getElementById('journalInput').value.trim();
  if(!val) return;
  state.journal.push({ id: Date.now()+'-'+Math.random().toString(36).slice(2,7), date: todayKey(), ts: Date.now(), mood: journalSelectedMood, text: val });
  saveState();
  document.getElementById('journalInput').value='';
  journalSelectedMood=null; buildJournalMoodRow();
  const btn=document.getElementById('journalSaveBtn'); const old=btn.textContent;
  btn.textContent = t('journal_saved_toast');
  setTimeout(()=>{ btn.textContent = t('journal_save'); }, 1200);
  recalcLifeScore(); renderHome(); renderJournal(); renderMemoryChips();
});
document.getElementById('journalSearch').addEventListener('input', renderJournal);
function renderJournal(){
  buildJournalMoodRow();
  const q = document.getElementById('journalSearch').value.trim().toLowerCase();
  const entries = state.journal.slice().sort((a,b)=>b.ts-a.ts).filter(e=> !q || e.text.toLowerCase().includes(q));
  document.getElementById('journalCount').textContent = state.journal.length ? ` (${state.journal.length})` : '';
  document.getElementById('journalEmpty').style.display = state.journal.length ? 'none' : 'block';
  const fmt = new Intl.DateTimeFormat(lang==='ar'?'ar':'en', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
  const list = document.getElementById('journalList');
  list.innerHTML = entries.map(e=>`
    <div class="journal-entry">
      <div class="je-meta">
        <span>${fmt.format(new Date(e.ts))}${e.mood?` · <span class="je-mood">${weatherEmoji(e.mood)}</span>`:''}</span>
        <button class="je-del" data-id="${e.id}">${lang==='ar'?'حذف':'delete'}</button>
      </div>
      <div class="je-text">${escapeHtml(e.text)}</div>
    </div>
  `).join('');
  list.querySelectorAll('.je-del').forEach(b=> b.addEventListener('click', ()=>{
    if(!confirm(lang==='ar' ? 'حذف هذه المذكرة؟' : 'Delete this entry?')) return;
    state.journal = state.journal.filter(e=>e.id!==b.dataset.id);
    saveState(); recalcLifeScore(); renderHome(); renderJournal(); renderMemoryChips();
  }));
}
function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ============================= AI MEMORY ============================= */
const STOPWORDS = new Set([
  'the','and','a','an','to','of','in','is','it','i','my','me','for','on','with','was','that','this','am',
  "i'm",'im','be','so','just','today','feel','feeling','felt','really','very','have','has had','but','not',
  'في','من','على','إلى','عن','هذا','هذه','أنا','انا','كان','كانت','مع','أو','او','لا','ما','هو','هي','بس','علشان','كل','يوم','اليوم','كنت','عشان','ليش','وايد','شوي'
]);
function extractTopKeyword(){
  const texts = [
    ...state.journal.map(e=>e.text),
    ...Object.values(state.ritual.history).map(e=>e.intention+' '+e.gratitude)
  ].join(' ');
  const words = texts.match(/[\p{L}]+/gu) || [];
  const counts = {};
  words.forEach(w=>{
    const lw = w.toLowerCase();
    if(lw.length<4 || STOPWORDS.has(lw)) return;
    counts[lw] = (counts[lw]||0)+1;
  });
  let top=null, max=1;
  Object.keys(counts).forEach(w=>{ if(counts[w]>max){ max=counts[w]; top=w; } });
  return top ? {word:top, count:max} : null;
}
function renderMemoryChips(){
  const wrap = document.getElementById('memoryChips'); if(!wrap) return;
  const chips=[];
  if(state.streak>=2) chips.push(`🔥 ${t('streak_days')(state.streak)}`);
  if(state.journal.length>0) chips.push(lang==='ar' ? `📝 ${state.journal.length} مذكرة مسجلة` : `📝 ${state.journal.length} entries written`);
  const kw = extractTopKeyword();
  if(kw) chips.push(lang==='ar' ? `💭 "${kw.word}" تكررت ${kw.count} مرات` : `💭 "${kw.word}" mentioned ${kw.count}×`);
  const energies=[];
  for(let i=0;i<6;i++){ const e=state.ritual.history[dateKeyOffset(-i)]; if(e) energies.push({i,e:e.energy}); }
  if(energies.length>=2){
    const recent = energies.slice(0, Math.ceil(energies.length/2)).reduce((a,b)=>a+b.e,0)/Math.ceil(energies.length/2);
    const older = energies.slice(Math.ceil(energies.length/2)).reduce((a,b)=>a+b.e,0)/Math.max(1,energies.length-Math.ceil(energies.length/2));
    if(recent-older>=0.6) chips.push(lang==='ar' ? '📈 طاقتك تحسّنت آخر كم يوم' : '📈 Your energy has been trending up');
    else if(older-recent>=0.6) chips.push(lang==='ar' ? '📉 طاقتك أقل شوي آخر كم يوم' : '📉 Your energy has dipped a bit lately');
  }
  if(!chips.length) chips.push(lang==='ar' ? '🌱 لسا بنتعرف على بعض' : "🌱 We're just getting to know each other");
  wrap.innerHTML = chips.map(c=>`<span class="mem-chip">${c}</span>`).join('');
}

const POS_WORDS = ['happy','good','great','grateful','proud','excited','calm','peace','love','amazing','عظيم','فرحان','ممتن','فخور','مبسوط','هادي','حلو','رائع'];
const NEG_WORDS = ['stress','stressed','anxious','tired','sad','angry','worried','overwhelmed','exhausted','lonely','متوتر','قلقان','تعبان','حزين','زعلان','خايف','مرهق','ضغط'];
function pickRandom(arr, avoid){
  if(arr.length===1) return arr[0];
  let choice = arr[Math.floor(Math.random()*arr.length)];
  if(avoid && choice===avoid){ const rest = arr.filter(x=>x!==avoid); choice = rest[Math.floor(Math.random()*rest.length)]; }
  return choice;
}
const NEG_BASES = {
  en: ["I hear you. That's a real feeling, and it's worth sitting with instead of pushing away.",
       "That sounds heavy. Thank you for naming it instead of brushing past it.",
       "It makes sense you'd feel that way — that's a lot to carry."],
  ar: ["سمعتك. هذا الإحساس مشروع، وما لازم تتجاهله.",
       "يبدو هذا ثقيل عليك. شكراً إنك سميته بدل ما تتجاوزه.",
       "طبيعي تحس كذا، خصوصاً مع كل اللي عندك."]
};
const NEG_NUDGES = {
  en: [" Want to try two minutes of slow breathing together?",
       " Sometimes writing it down in your journal helps it feel smaller.",
       " A short walk or a glass of water might take the edge off."],
  ar: [" تحب ناخذ دقيقتين تنفس هادي سوا؟",
       " أحياناً كتابتها بالمذكرة تخليها تحس أصغر.",
       " مشية قصيرة أو كاس مويه ممكن تخفف الحدة."]
};
const POS_REPLIES = {
  en: n=>[
    `That's genuinely good to hear — let it land.${n>=2?` Your ${t('streak_days')(n)} streak shows you're being consistent.`:''}`,
    `Love that for you. Little wins like this add up more than they feel like they do.`,
    `That's worth savoring for a second before the day pulls you forward.`
  ],
  ar: n=>[
    `حلو جداً — استمتع فيه.${n>=2?` وسلسلتك ${t('streak_days')(n)} تشهد إنك ثابت.`:''}`,
    `يسعدني هالشي فعلاً. الانتصارات الصغيرة زي هذي بتتراكم أكثر مما تحس.`,
    `يستاهل توقف عندها ثانية قبل ما اليوم يشدك قدام.`
  ]
};
const NEUTRAL_REPLIES = {
  en: ["Got it — tell me a bit more. What's taking up the most space in your mind right now?",
       "Thanks for sharing that. What would make the rest of today feel a little easier?",
       "Noted. Is this something you'd want to put in your journal too?"],
  ar: ["تمام، خلّيني أفهم أكثر — شو أكثر شي مركز عليه ذهنك هلأ؟",
       "شكراً إنك شاركتني. شو ممكن يخلي باقي يومك أسهل شوي؟",
       "تم. تحب تحطها بمذكرتك كمان؟"]
};
let lastAIReply=null;
const TIP_TEMPLATES = {
  en: [
    "Try a 10-minute walk outside — morning light is one of the fastest ways to steady your energy.",
    "Drink a full glass of water right now — mild dehydration shows up as low mood before you notice it.",
    "Two minutes of slow breathing (4 in, 4 hold, 6 out) can lower your heart rate almost immediately.",
    "Write down just one sentence in your journal — momentum matters more than length.",
    "Step away from your screen for five minutes and look at something far away.",
  ],
  ar: [
    "جرب تمشي 10 دقايق برا — ضوء الصبح من أسرع الطرق تثبّت طاقتك.",
    "اشرب كاس مويه كامل هلأ — قلة المويه تبين كمزاج منخفض قبل ما تحس فيها.",
    "دقيقتين تنفس بطيء (شهيق 4، حبس 4، زفير 6) بينزل نبضك تقريباً فوراً.",
    "اكتب جملة وحدة بس بمذكرتك — الاستمرارية أهم من الطول.",
    "ابعد عن الشاشة خمس دقايق وحدّق بشي بعيد.",
  ]
};
function detectSentiment(text){
  const lower = text.toLowerCase();
  const pos = POS_WORDS.some(w=>lower.includes(w));
  const neg = NEG_WORDS.some(w=>lower.includes(w));
  if(neg && !pos) return 'neg';
  if(pos && !neg) return 'pos';
  return 'neutral';
}
function wantsTip(text){ return /tip|advice|help|suggest|نصيح|ساعد|اقترح/i.test(text); }
function wantsProgress(text){ return /how am i|progress|doing|تقدم|كيف حال|كيف اداء/i.test(text); }
function generateAIReply(text){
  if(wantsProgress(text)){
    const today = state.scoreHistory[todayKey()];
    const scoreTxt = today ? today.total : 0;
    return lang==='ar'
      ? `نقاطك اليوم ${scoreTxt}/100، وعندك سلسلة ${t('streak_days')(state.streak)} من طقوس الصباح. ${state.journal.length?`كتبت ${state.journal.length} مذكرة لهلق.`:'جرب تكتب أول مذكرة، بتساعدك تشوف نفسك أوضح.'}`
      : `You're at ${scoreTxt}/100 today, with a ${t('streak_days')(state.streak)} morning-ritual streak. ${state.journal.length?`You've written ${state.journal.length} journal entries so far.`:'Try writing your first journal entry — it helps patterns show up faster.'}`;
  }
  if(wantsTip(text)){
    const list = TIP_TEMPLATES[lang];
    return list[Math.floor(Math.random()*list.length)];
  }
  const sentiment = detectSentiment(text);
  const kw = extractTopKeyword();
  let reply;
  if(sentiment==='neg'){
    const base = pickRandom(NEG_BASES[lang]);
    const ref = (kw && Math.random()<0.5) ? (lang==='ar' ? ` لاحظت إنك ذكرت "${kw.word}" أكثر من مرة — يمكن مرتبط بهذا.` : ` I've noticed "${kw.word}" has come up more than once for you — might be connected.`) : '';
    const nudge = pickRandom(NEG_NUDGES[lang]);
    reply = base+ref+nudge;
  } else if(sentiment==='pos'){
    reply = pickRandom(POS_REPLIES[lang](state.streak));
  } else {
    reply = pickRandom(NEUTRAL_REPLIES[lang]);
  }
  if(reply===lastAIReply){
    const pool = sentiment==='neg' ? NEG_BASES[lang].map(b=>b) : sentiment==='pos' ? POS_REPLIES[lang](state.streak) : NEUTRAL_REPLIES[lang];
    reply = pickRandom(pool, reply);
  }
  lastAIReply = reply;
  return reply;
}
const chatWrap = document.getElementById('chatWrap');
function addMsg(text, who){
  const div=document.createElement('div'); div.className='msg '+who; div.textContent=text; chatWrap.appendChild(div);
  chatWrap.scrollTop = chatWrap.scrollHeight;
  return div;
}
function addQuickReplies(){
  const wrap=document.createElement('div'); wrap.className='quick-replies';
  ['qr_stressed','qr_tip','qr_proud','qr_progress'].forEach(k=>{
    const c=document.createElement('button'); c.className='chip'; c.textContent=t(k);
    c.addEventListener('click', ()=>{ document.getElementById('chatInput').value=t(k); sendChat(); });
    wrap.appendChild(c);
  });
  chatWrap.appendChild(wrap);
}
function renderChat(){
  chatWrap.innerHTML='';
  if(!state.chatLog.length){
    addMsg(t('coach_welcome'), 'ai');
    addQuickReplies();
  } else {
    state.chatLog.forEach(m=> addMsg(m.text, m.who));
    const lastAi = [...state.chatLog].reverse().find(m=>m.who==='ai');
    if(lastAi) lastAIReply = lastAi.text;
  }
}
function sendChat(){
  const input=document.getElementById('chatInput');
  const val=input.value.trim(); if(!val) return;
  addMsg(val,'user'); state.chatLog.push({who:'user', text:val, ts:Date.now()});
  input.value='';
  const typing=document.createElement('div'); typing.className='typing'; typing.innerHTML='<span></span><span></span><span></span>';
  chatWrap.appendChild(typing); chatWrap.scrollTop=chatWrap.scrollHeight;
  setTimeout(()=>{
    typing.remove();
    const reply = generateAIReply(val);
    addMsg(reply,'ai'); state.chatLog.push({who:'ai', text:reply, ts:Date.now()});
    if(state.chatLog.length>60) state.chatLog = state.chatLog.slice(-60);
    saveState();
  }, 500+Math.random()*500);
}
document.getElementById('chatSend').addEventListener('click', sendChat);
document.getElementById('chatInput').addEventListener('keydown', e=>{ if(e.key==='Enter') sendChat(); });

/* ============================= ONBOARDING ============================= */
let obSelectedGoal=null;
const OB_GOALS = [
  {key:'calm', emoji:'🌿'}, {key:'habits', emoji:'🔁'}, {key:'journal', emoji:'📓'}, {key:'energy', emoji:'⚡'}
];
function buildGoalOptions(){
  const wrap=document.getElementById('obGoalOptions'); if(!wrap) return; wrap.innerHTML='';
  OB_GOALS.forEach(g=>{
    const b=document.createElement('button'); b.className='ob-opt'+(obSelectedGoal===g.key?' selected':'');
    b.innerHTML = `<span class="ob-emoji">${g.emoji}</span><span>${t('ob_goal_'+g.key)}</span>`;
    b.addEventListener('click', ()=>{ obSelectedGoal=g.key; buildGoalOptions(); });
    wrap.appendChild(b);
  });
}
document.getElementById('obNameNext').addEventListener('click', ()=>{
  const name = document.getElementById('obNameInput').value.trim();
  state.user = { name: name || (lang==='ar'?'صديقي':'Friend') };
  saveState();
  document.getElementById('obStepName').classList.remove('active');
  document.getElementById('obStepGoal').classList.add('active');
  document.querySelectorAll('.ob-progress i')[1].classList.add('on');
});
document.getElementById('obLangToggle').addEventListener('click', ()=> setLang(lang==='ar'?'en':'ar'));
document.getElementById('obGoalNext').addEventListener('click', ()=>{
  state.goal = obSelectedGoal;
  state.onboarded = true;
  saveState();
  document.getElementById('onboardOverlay').classList.add('hidden');
  renderHome();
  maybeShowRitual();
});
function maybeShowRitual(){
  if(!state.ritual.history[todayKey()]) startRitual();
  else document.getElementById('ritualOverlay').classList.add('hidden');
}

/* ============================= SETTINGS ============================= */
const settingsOverlay=document.getElementById('settingsOverlay');
document.getElementById('settingsBtn').addEventListener('click', ()=>{ renderSettingsUI(); settingsOverlay.classList.add('active'); });
document.getElementById('settingsClose').addEventListener('click', ()=> settingsOverlay.classList.remove('active'));
settingsOverlay.addEventListener('click', e=>{ if(e.target===settingsOverlay) settingsOverlay.classList.remove('active'); });
document.getElementById('langToggle').addEventListener('click', ()=> setLang(lang==='ar'?'en':'ar'));
document.getElementById('langSeg').querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=> setLang(b.dataset.lang)));
document.getElementById('darkToggle').addEventListener('click', ()=>{
  state.dark=!state.dark; saveState(); document.body.classList.toggle('dark', state.dark); renderSettingsUI();
});
document.getElementById('waterGoalSeg').querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=>{
  state.waterGoal = parseInt(b.dataset.val,10);
  if(state.water.count>state.waterGoal) state.water.count=state.waterGoal;
  saveState(); renderSettingsUI(); renderHome();
}));
document.getElementById('exportBtn').addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(state,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='morning-os-data.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});
document.getElementById('resetBtn').addEventListener('click', ()=>{
  if(!confirm(t('settings_reset_confirm'))) return;
  localStorage.removeItem('morningOS_state');
  location.reload();
});
function renderSettingsUI(){
  document.getElementById('langSeg').querySelectorAll('button').forEach(b=> b.classList.toggle('active', b.dataset.lang===lang));
  document.getElementById('darkToggle').classList.toggle('on', !!state.dark);
  document.getElementById('waterGoalSeg').querySelectorAll('button').forEach(b=> b.classList.toggle('active', parseInt(b.dataset.val,10)===state.waterGoal));
}

/* ============================= BOOT ============================= */
function bootApp(){
  document.body.classList.toggle('dark', !!state.dark);
  ensureWaterDay();
  buildJournalMoodRow();
  applyLanguage();
  if(!state.onboarded){
    document.getElementById('onboardOverlay').classList.remove('hidden');
  } else {
    document.getElementById('onboardOverlay').classList.add('hidden');
    maybeShowRitual();
  }
  setInterval(initHero, 5*60*1000);
}
bootApp();

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
}
