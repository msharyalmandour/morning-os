/* ============================= STATE ============================= */
function defaultPerformance(){
  const p = {};
  DOMAINS.forEach(d=>{ p[d.key] = { history: {} }; });
  return p;
}
const DEFAULT_STATE = {
  user: null,               // { name }
  goal: null,
  onboarded: false,
  dark: true,
  waterGoal: 8,
  water: { date: null, count: 0 },
  ritual: { history: {} },  // { 'YYYY-MM-DD': {weather, energy, intention, gratitude, completedAt} }
  journal: [],               // [{id, date, ts, mood, text, trigger}]
  scoreHistory: {},          // { 'YYYY-MM-DD': {total, breakdown} }
  streak: 0,                 // momentum score, 0-100 (name kept for storage back-compat)
  chatLog: [],               // [{who:'ai'|'user', text, ts}]
  performance: defaultPerformance(), // { [domainKey]: { history: {'YYYY-MM-DD': true} } }
  digital: { entries: [] },  // urge log: [{id, ts, date, trigger, urgeType, response, alternative}]
  premium: false
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
      const perf = defaultPerformance();
      DOMAINS.forEach(d=>{ perf[d.key] = Object.assign({history:{}}, parsed.performance && parsed.performance[d.key]); });
      // migrate old 'nervous' domain history to the new 'social' domain
      if(parsed.performance && parsed.performance.nervous && !(parsed.performance.social && Object.keys(parsed.performance.social.history||{}).length)){
        perf.social = Object.assign({history:{}}, parsed.performance.nervous);
      }
      merged.performance = perf;
      if(parsed.digital && Array.isArray(parsed.digital.entries)){
        merged.digital = { entries: parsed.digital.entries };
      } else if(parsed.digital && parsed.digital.history){
        // migrate the old single-daily-rating format into urge-log entries
        merged.digital = { entries: Object.keys(parsed.digital.history).map(dateStr=>{
          const old = parsed.digital.history[dateStr];
          const response = old.awareness>=4 ? 'resisted' : old.awareness<=2 ? 'gave_in' : 'partial';
          return { id:newId(), ts:new Date(dateStr+'T12:00:00').getTime(), date:dateStr, trigger:'', urgeType:'digital', response, alternative: old.note||'' };
        }) };
      } else {
        merged.digital = { entries: [] };
      }
      merged.premium = !!parsed.premium;
      return merged;
    }
  }catch(e){}
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}
function saveState(){ try{ localStorage.setItem('morningOS_state', JSON.stringify(state)); }catch(e){} }
function todayKey(){ return new Date().toISOString().slice(0,10); }
function newId(){ return Date.now()+'-'+Math.random().toString(36).slice(2,7); }
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
  if(currentDomainKey && document.getElementById('screen-domain').classList.contains('active')){
    renderDomainScreen();
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
const HERO_PHASE_STYLE = {
  morning:{ bento:'bento-mustard', icon:'☀️' },
  afternoon:{ bento:'bento-sage', icon:'🌤️' },
  evening:{ bento:'bento-coral', icon:'🌇' },
  night:{ bento:'bento-lavender', icon:'🌙' }
};
function initHero(){
  const phase = getTimePhase();
  const name = state.user ? state.user.name : (lang==='ar'?'صديقي':'friend');
  const bento=document.getElementById('heroBento'), icon=document.getElementById('heroIcon'),
        eyebrow=document.getElementById('heroEyebrow'), greeting=document.getElementById('heroGreeting'),
        sub=document.getElementById('heroSub');
  const style = HERO_PHASE_STYLE[phase];
  bento.className = 'bento full clickable ' + style.bento;
  icon.textContent = style.icon;
  eyebrow.textContent = t('greet_'+phase+'_eyebrow');
  greeting.textContent = t('greet_'+phase+'_title_name')(name);
  sub.textContent = t('greet_'+phase+'_sub');
}

/* ============================= MICRO-INTERACTIONS ============================= */
function animateNumber(el, to, suffix){
  if(!el) return;
  suffix = suffix || '';
  const from = parseInt(el.textContent,10); const fromVal = isNaN(from) ? 0 : from;
  if(fromVal === to){ el.textContent = to+suffix; return; }
  const start = performance.now(), duration = 650;
  function tick(now){
    const p = Math.min(1, (now-start)/duration);
    const eased = 1 - Math.pow(1-p, 3);
    el.textContent = Math.round(fromVal + (to-fromVal)*eased) + (p<1 ? '' : suffix);
    if(p<1) requestAnimationFrame(tick); else el.textContent = to+suffix;
  }
  requestAnimationFrame(tick);
}
function pulse(el){
  if(!el) return;
  el.classList.remove('pulse-success');
  void el.offsetWidth;
  el.classList.add('pulse-success');
}

/* ============================= REVEAL ANIMATION ============================= */
function staggerReveal(selector, root){
  const els = (root||document).querySelectorAll(selector);
  els.forEach((el,i)=>{
    el.classList.add('reveal');
    el.classList.remove('in');
    setTimeout(()=> el.classList.add('in'), 40 + i*55);
  });
}

/* ============================= NAV ============================= */
document.querySelectorAll('.nav-btn').forEach(btn=> btn.addEventListener('click', ()=> showScreen(btn.dataset.screen)));
function showScreen(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-'+name).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.screen===name));
  document.getElementById('screens').scrollTop = 0;
  window.scrollTo(0, 0);
  if(name==='journal') renderJournal();
  if(name==='memory'){ renderMemoryChips(); renderChat(); }
  if(name==='insights') renderInsights();
  if(name==='home') staggerReveal('.card, .bento', document.getElementById('screen-home'));
  if(name==='journal') staggerReveal('.journal-entry', document.getElementById('journalList'));
  if(name==='insights') staggerReveal('.rh-row', document.getElementById('ritualHistoryList'));
}

/* ============================= VIEW MODAL ============================= */
const viewOverlay=document.getElementById('viewOverlay'), viewBody=document.getElementById('viewBody');
function openView(html){ viewBody.innerHTML=html; viewOverlay.classList.add('active'); }
function closeView(){ viewOverlay.classList.remove('active'); }
document.getElementById('viewClose').addEventListener('click', closeView);
viewOverlay.addEventListener('click', e=>{ if(e.target===viewOverlay) closeView(); });

/* ============================= LIFE SCORE ============================= */
/* Momentum: builds with consistency, dips gently on a missed day instead of
   resetting to zero — replaces the old hard streak-count concept. */
function calcMomentum(hist, windowDays){
  windowDays = windowDays || 30;
  let m = 0;
  for(let i=windowDays-1;i>=0;i--){
    const key = dateKeyOffset(-i);
    m = hist[key] ? Math.min(100, m+14) : Math.max(0, m-7);
  }
  return Math.round(m);
}
function calcLongestRun(hist, windowDays){
  windowDays = windowDays || 60;
  let longest=0, run=0;
  for(let i=windowDays-1;i>=0;i--){ if(hist[dateKeyOffset(-i)]){ run++; longest=Math.max(longest,run); } else run=0; }
  return longest;
}
/* ============================= PERFORMANCE DOMAINS ============================= */
function domainCompletedCount(key){ return Object.keys(state.performance[key].history).length; }
function domainDoneToday(key){ return !!state.performance[key].history[todayKey()]; }
function domainMomentum(key){ return calcMomentum(state.performance[key].history); }
function domainLessonIndex(key){ return domainCompletedCount(key) % LESSONS[key].length; }
function domainLesson(key){ return LESSONS[key][domainLessonIndex(key)]; }
function domainJustCycled(key){
  const count = domainCompletedCount(key);
  return count > 0 && count % LESSONS[key].length === 0;
}
function markDomainDone(key){
  if(domainDoneToday(key)) return;
  state.performance[key].history[todayKey()] = true;
  saveState();
  recalcLifeScore();
}

/* Life Score = the 4 external pillars (sleep/nutrition/movement/social) +
   the internal layer (mood, journal+trigger, digital boundaries) = 100 */
const LIFE_SCORE_MAXES = {sleep:15,nutrition:15,movement:15,social:15,mood:15,journal:15,digital:10};
function factorLabel(key){
  return DOMAINS.some(d=>d.key===key) ? t('dom_'+key+'_name') : t('factor_'+key);
}
function recalcLifeScore(){
  const dateStr = todayKey();
  const ritualEntry = state.ritual.history[dateStr];
  const journalToday = state.journal.some(e=>e.date===dateStr);
  const journalPts = journalToday ? 15 : 0;
  const digitalPts = digitalPointsForDate(dateStr);
  const recentEnergies=[];
  for(let i=0;i<7 && recentEnergies.length<3;i++){
    const e = state.ritual.history[dateKeyOffset(-i)];
    if(e) recentEnergies.push(e.energy);
  }
  const moodAvg = recentEnergies.length ? recentEnergies.reduce((a,b)=>a+b,0)/recentEnergies.length : (ritualEntry ? ritualEntry.energy : 2.5);
  const moodPts = Math.round(moodAvg/5*15);
  const breakdown = {mood:moodPts, journal:journalPts, digital:digitalPts};
  DOMAINS.forEach(d=>{ breakdown[d.key] = domainDoneToday(d.key) ? 15 : 0; });
  const total = Object.values(breakdown).reduce((a,b)=>a+b,0);
  state.scoreHistory[dateStr] = { total, breakdown };
  state.streak = calcMomentum(state.ritual.history);
  saveState();
}

function renderHome(){
  initHero();
  recalcLifeScore();
  const dateStr = todayKey();
  const today = state.scoreHistory[dateStr] || {total:0, breakdown:{mood:0,journal:0,digital:0}};
  const ritualEntry = state.ritual.history[dateStr];

  ['scoreRing','scoreRing2'].forEach(id=>{ const el=document.getElementById(id); if(el) el.style.setProperty('--pct', today.total); });
  animateNumber(document.getElementById('scoreVal'), today.total);
  animateNumber(document.getElementById('scoreVal2'), today.total);

  document.getElementById('statMood').textContent = ritualEntry ? weatherEmoji(ritualEntry.weather) : '–';
  document.getElementById('statWater').textContent = `${state.water.count}/${state.waterGoal}`;
  animateNumber(document.getElementById('statMomentum'), state.streak, '%');

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
  renderCalStrip();
  renderSparkline('weekSparkline', 7);
  renderPerformanceGrid();
  renderLifeMap();
  renderDigitalCard();
  renderWhatsNewCard();
}
function renderCalStrip(){
  const wrap = document.getElementById('calStrip'); if(!wrap) return;
  const fmt = lang==='ar'
    ? new Intl.DateTimeFormat('ar', {weekday:'narrow'})
    : new Intl.DateTimeFormat('en', {weekday:'short'});
  wrap.innerHTML='';
  for(let i=6;i>=0;i--){
    const key = dateKeyOffset(-i);
    const d = new Date(); d.setDate(d.getDate()-i);
    const done = !!state.ritual.history[key];
    const label = lang==='ar' ? fmt.format(d) : fmt.format(d).slice(0,2);
    const day = document.createElement('div');
    day.className = 'cal-day' + (i===0?' active':'') + (done?' done':'');
    day.innerHTML = `<span class="cd-lbl">${label}</span><span class="cd-dot num">${d.getDate()}</span>`;
    wrap.appendChild(day);
  }
}
function renderSparkline(svgId, days){
  const svg = document.getElementById(svgId); if(!svg) return;
  const w=300, h=60, pad=6;
  const pts=[];
  for(let i=days-1;i>=0;i--){
    const rec = state.scoreHistory[dateKeyOffset(-i)];
    pts.push(rec ? rec.total : 0);
  }
  const stepX = (w-pad*2)/(pts.length-1||1);
  const coords = pts.map((v,i)=>{
    const x = pad + i*stepX;
    const y = h - pad - (Math.max(0,Math.min(100,v))/100)*(h-pad*2);
    return [x,y];
  });
  const linePath = coords.map((c,i)=> (i===0?'M':'L')+c[0].toFixed(1)+','+c[1].toFixed(1)).join(' ');
  const fillPath = linePath + ` L${coords[coords.length-1][0].toFixed(1)},${h} L${coords[0][0].toFixed(1)},${h} Z`;
  svg.innerHTML = `
    <path class="fill" d="${fillPath}" fill="currentColor" stroke="none"></path>
    <path d="${linePath}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <circle cx="${coords[coords.length-1][0].toFixed(1)}" cy="${coords[coords.length-1][1].toFixed(1)}" r="4" fill="currentColor"></circle>
  `;
  svg.style.color = 'var(--lavender-deep)';
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

/* ============================= PERFORMANCE UI ============================= */
function renderPerformanceGrid(){
  const grid = document.getElementById('performanceGrid'); if(!grid) return;
  grid.innerHTML = DOMAINS.map(d=>{
    const done = domainDoneToday(d.key);
    const count = domainCompletedCount(d.key);
    return `
      <button class="bento clickable" data-domain="${d.key}" style="background:var(--${d.hue});box-shadow:var(--shadow-soft), inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 34px -14px var(--${d.hue}-deep);">
        <span class="bento-icon">${d.emoji}</span>
        <span class="bento-status ${done?'done':''} num">${done ? '✓' : t('day_n')(count+1)}</span>
        <div class="bento-title">${t('dom_'+d.key+'_name')}</div>
        <div class="bento-sub">${t('dom_'+d.key+'_tag')}</div>
      </button>`;
  }).join('');
  grid.querySelectorAll('.bento[data-domain]').forEach(card=>{
    card.addEventListener('click', ()=> openDomainScreen(card.dataset.domain));
  });
}

/* ============================= LIFE MAP (radar of the 4 external pillars) ============================= */
function renderLifeMap(){
  const svg = document.getElementById('lifeMapSvg'); if(!svg) return;
  const cx=100, cy=100, R=72;
  function pt(r, angle){ const rad=(angle-90)*Math.PI/180; return [cx+r*Math.cos(rad), cy+r*Math.sin(rad)]; }
  const values = DOMAINS.map(d=> domainMomentum(d.key));
  let html = '';
  [0.33,0.66,1].forEach(f=> html += `<circle class="lm-grid" cx="${cx}" cy="${cy}" r="${(R*f).toFixed(1)}"></circle>`);
  DOMAINS.forEach((d,i)=>{ const [x,y]=pt(R, i*90); html += `<line class="lm-axis" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"></line>`; });
  const poly = DOMAINS.map((d,i)=>{ const [x,y]=pt(R*(values[i]/100), i*90); return `${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
  html += `<polygon class="lm-fill" points="${poly}"></polygon>`;
  DOMAINS.forEach((d,i)=>{ const [x,y]=pt(R*(values[i]/100), i*90); html += `<circle class="lm-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"></circle>`; });
  DOMAINS.forEach((d,i)=>{ const [x,y]=pt(R+18, i*90); html += `<text class="lm-label" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle">${d.emoji}</text>`; });
  svg.innerHTML = html;

  const today = state.scoreHistory[todayKey()] || {breakdown:{mood:0,journal:0,digital:0}};
  const internalPct = Math.round(((today.breakdown.mood||0)+(today.breakdown.journal||0)+(today.breakdown.digital||0))/(15+15+10)*100);
  animateNumber(document.getElementById('lifeMapCenterVal'), internalPct, '%');
}

/* ============================= URGE LOG (CBT-lite) ============================= */
const URGE_TRIGGERS = [
  {key:'boredom', emoji:'😐'}, {key:'stress', emoji:'😣'}, {key:'fatigue', emoji:'😴'},
  {key:'sadness', emoji:'😔'}, {key:'habit', emoji:'🔁'}, {key:'other', emoji:'➕'}
];
const URGE_TYPES = [ {key:'phone', emoji:'📱'}, {key:'food', emoji:'🍬'}, {key:'other', emoji:'➕'} ];
const URGE_RESPONSES = [ {key:'resisted', emoji:'✅'}, {key:'partial', emoji:'➗'}, {key:'gave_in', emoji:'🔁'} ];
const URGE_ALT_SUGGESTIONS = {
  boredom:{en:"Try a 2-minute walk instead", ar:"جرب مشية دقيقتين بدلها"},
  stress:{en:"Try 4-6 breathing for one minute", ar:"جرب تنفس 4-6 لدقيقة"},
  fatigue:{en:"Drink a glass of water and stretch", ar:"اشرب كاس مويه وتمدد شوي"},
  sadness:{en:"Text one person who makes you feel good", ar:"راسل شخص يخليك تحس حلو"},
  habit:{en:"Pause 10 seconds and name the urge out loud", ar:"توقف 10 ثواني وسمّي الرغبة بصوت عالي"},
  other:{en:"Notice the urge without acting on it for one minute", ar:"لاحظ الرغبة بدون ما تتصرف فيها لدقيقة"}
};
function digitalPointsForDate(dateStr){
  const entries = state.digital.entries.filter(e=>e.date===dateStr);
  if(!entries.length) return 0;
  const resisted = entries.filter(e=>e.response==='resisted').length;
  const partial = entries.filter(e=>e.response==='partial').length;
  const ratio = (resisted + partial*0.5) / entries.length;
  return Math.round(6 + ratio*4);
}
function renderDigitalCard(){
  const badge = document.getElementById('digitalBadge'); if(!badge) return;
  const todayEntries = state.digital.entries.filter(e=>e.date===todayKey());
  if(!todayEntries.length){ badge.textContent=''; return; }
  const resisted = todayEntries.filter(e=>e.response==='resisted').length;
  badge.textContent = t('digital_card_logged')(todayEntries.length, resisted);
}
let urgeSelected = { trigger:null, type:null, response:null };
function buildUrgeOptGrid(items, groupKey, i18nPrefix){
  return `<div class="weather-grid" style="grid-template-columns:repeat(3,1fr);" data-group="${groupKey}">${
    items.map(it=>`<button type="button" class="weather-opt" data-val="${it.key}">${it.emoji}<small>${t(i18nPrefix+'_'+it.key)}</small></button>`).join('')
  }</div>`;
}
function buildUrgeAltSuggestion(){
  const row = document.getElementById('urgeAltSuggestRow'); if(!row || !urgeSelected.trigger) return;
  const s = URGE_ALT_SUGGESTIONS[urgeSelected.trigger]; if(!s) return;
  row.innerHTML = `<button type="button" class="suggest-chip">${escapeHtml(s[lang])}</button>`;
  row.querySelector('.suggest-chip').addEventListener('click', ()=>{ document.getElementById('urgeAltInput').value = s[lang]; });
}
function openDigitalModal(){
  urgeSelected = { trigger:null, type:null, response:null };
  openView(`
    <h2 style="margin-bottom:4px;">${t('digital_modal_title')}</h2>
    <p style="color:var(--ink-soft);font-size:12.5px;margin:0 0 16px;">${t('digital_modal_sub')}</p>
    <p style="font-size:12px;font-weight:800;color:var(--ink-soft);margin:0 0 8px;">${t('urge_step_trigger')}</p>
    ${buildUrgeOptGrid(URGE_TRIGGERS,'trigger','urge_trigger')}
    <p style="font-size:12px;font-weight:800;color:var(--ink-soft);margin:16px 0 8px;">${t('urge_step_type')}</p>
    ${buildUrgeOptGrid(URGE_TYPES,'type','urge_type')}
    <p style="font-size:12px;font-weight:800;color:var(--ink-soft);margin:16px 0 8px;">${t('urge_step_response')}</p>
    ${buildUrgeOptGrid(URGE_RESPONSES,'response','urge_response')}
    <p style="font-size:12px;font-weight:800;color:var(--ink-soft);margin:16px 0 8px;">${t('urge_alt_label')}</p>
    <div class="suggest-row" id="urgeAltSuggestRow" style="margin-bottom:8px;"></div>
    <textarea id="urgeAltInput" class="jq-input" placeholder="${t('digital_note_ph')}" style="min-height:56px;"></textarea>
    <button class="pill-btn gold" id="urgeSaveBtn" style="margin-top:16px;">${t('digital_save')}</button>
  `);
  document.querySelectorAll('#viewBody .weather-grid').forEach(grid=>{
    grid.querySelectorAll('.weather-opt').forEach(btn=> btn.addEventListener('click', ()=>{
      const group = grid.dataset.group;
      urgeSelected[group] = btn.dataset.val;
      grid.querySelectorAll('.weather-opt').forEach(b=> b.classList.toggle('selected', b===btn));
      if(group==='trigger') buildUrgeAltSuggestion();
    }));
  });
  document.getElementById('urgeSaveBtn').addEventListener('click', ()=>{
    if(!urgeSelected.trigger || !urgeSelected.type || !urgeSelected.response) return;
    state.digital.entries.push({
      id:newId(), ts:Date.now(), date:todayKey(),
      trigger:urgeSelected.trigger, urgeType:urgeSelected.type, response:urgeSelected.response,
      alternative: document.getElementById('urgeAltInput').value.trim()
    });
    saveState();
    closeView();
    recalcLifeScore(); renderHome();
    pulse(document.getElementById('digitalBento'));
  });
}
document.getElementById('digitalBento').addEventListener('click', openDigitalModal);

/* ============================= WHAT'S NEW (premium research digest) ============================= */
function todayWhatsNewItem(){
  const start = new Date(new Date().getFullYear(),0,0);
  const dayOfYear = Math.floor((new Date()-start)/86400000);
  return WHATS_NEW[dayOfYear % WHATS_NEW.length];
}
function renderWhatsNewCard(){
  const el = document.getElementById('whatsNewHeadline'); if(!el) return;
  el.textContent = todayWhatsNewItem().headline[lang];
  document.getElementById('whatsNewBadgeText').textContent = state.premium ? t('whats_new_premium_badge') : t('whats_new_free_badge');
}
function wnItemHtml(item){
  return `<div class="wn-card">
    <span class="wn-topic-tag">${t('whats_new_topic_'+item.topic)}</span>
    <p class="wn-headline">${escapeHtml(item.headline[lang])}</p>
    <div class="lesson-card lesson-action" style="margin:0;padding:12px;">
      <div class="lesson-kicker">${t('whats_new_try_btn')}</div>
      <p class="lesson-text" style="font-size:13px;">${escapeHtml(item.experiment[lang])}</p>
    </div>
  </div>`;
}
function openWhatsNewModal(){
  const today = todayWhatsNewItem();
  const restHtml = WHATS_NEW.filter(i=>i.id!==today.id).map(wnItemHtml).join('');
  openView(`
    <div class="screen-eyebrow"><span class="dot"></span><span>${t('whats_new_eyebrow')}</span></div>
    <h2 style="margin:0 0 14px;">${t('whats_new_title')}</h2>
    ${wnItemHtml(today)}
    ${state.premium ? `
      <div class="section-title" style="margin:18px 4px 8px;padding:0;"><span>${t('whats_new_eyebrow')}</span></div>
      ${restHtml}
    ` : `
      <div style="position:relative;margin-top:8px;">
        <div class="wn-locked">${restHtml}</div>
        <div class="lock-overlay">
          <span class="lo-emoji">🔒</span>
          <b style="font-size:14px;">${t('whats_new_locked_title')}</b>
          <p style="font-size:12px;color:var(--ink-soft);max-width:260px;margin:0;">${t('whats_new_locked_sub')}</p>
          <button class="pill-btn gold" id="wnUnlockBtn" style="max-width:220px;margin-top:6px;">${t('whats_new_unlock_btn')}</button>
        </div>
      </div>
    `}
  `);
  const unlockBtn = document.getElementById('wnUnlockBtn');
  if(unlockBtn) unlockBtn.addEventListener('click', openPremiumModal);
}
function openPremiumModal(){
  openView(`
    <h2 style="margin-bottom:8px;">${t('whats_new_modal_title')}</h2>
    <p style="font-size:12.5px;color:var(--ink-soft);line-height:1.6;margin:0 0 18px;">${t('whats_new_modal_body')}</p>
    <button class="pill-btn gold" id="premiumDemoToggle">${t('whats_new_demo_toggle')}</button>
  `);
  document.getElementById('premiumDemoToggle').addEventListener('click', ()=>{
    state.premium = true;
    saveState();
    closeView();
    renderWhatsNewCard();
  });
}
document.getElementById('whatsNewCard').addEventListener('click', openWhatsNewModal);

let currentDomainKey = null;
function openDomainScreen(key){
  currentDomainKey = key;
  renderDomainScreen();
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-domain').classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.screen==='home'));
  document.getElementById('screens').scrollTop = 0;
  window.scrollTo(0, 0);
  staggerReveal('.lesson-card', document.getElementById('screen-domain'));
}
function renderDomainScreen(){
  if(!currentDomainKey) return;
  const key = currentDomainKey;
  const d = DOMAINS.find(x=>x.key===key);
  const lesson = domainLesson(key);
  const count = domainCompletedCount(key);
  const momentum = domainMomentum(key);
  const done = domainDoneToday(key);
  const screen = document.getElementById('screen-domain');
  screen.style.setProperty('--acc', `var(--${d.hue}-deep)`);
  screen.style.setProperty('--acc-pale', `var(--${d.hue})`);
  document.getElementById('domainEmoji').textContent = d.emoji;
  document.getElementById('domainName').textContent = t('dom_'+key+'_name');
  document.getElementById('domainTag').textContent = t('dom_'+key+'_tag');
  document.getElementById('domainDayBadge').textContent = t('day_n')(count+1);
  document.getElementById('domainStreakBadge').textContent = momentum>=15 ? `⚡ ${t('momentum_pct')(momentum)}` : '';
  document.getElementById('domainActionText').textContent = lesson.action[lang];
  document.getElementById('domainWhyText').textContent = lesson.why[lang];
  document.getElementById('domainPositiveText').textContent = lesson.positive[lang];
  document.getElementById('domainNegativeText').textContent = lesson.negative[lang];
  const btn = document.getElementById('domainDoneBtn');
  btn.textContent = done ? t('domain_done_today') : t('domain_mark_done');
  btn.classList.toggle('done', done);
  btn.disabled = done;
  const cycleNote = document.getElementById('domainCycleNote');
  cycleNote.style.display = domainJustCycled(key) ? 'block' : 'none';
  cycleNote.textContent = t('domain_cycle_note');
  const dotsWrap = document.getElementById('domainDots');
  dotsWrap.innerHTML='';
  for(let i=6;i>=0;i--){
    const k = dateKeyOffset(-i);
    const on = !!state.performance[key].history[k];
    const dot = document.createElement('span');
    dot.className = 'domain-dot' + (on?' on':'') + (i===0?' today':'');
    dotsWrap.appendChild(dot);
  }
}
document.getElementById('domainBack').addEventListener('click', ()=> showScreen('home'));
document.getElementById('domainDoneBtn').addEventListener('click', ()=>{
  if(!currentDomainKey) return;
  const wasDone = domainDoneToday(currentDomainKey);
  markDomainDone(currentDomainKey);
  renderDomainScreen();
  renderHome();
  if(!wasDone) pulse(document.getElementById('domainDoneBtn'));
});

/* ============================= INSIGHTS ============================= */
let insightsHistoryDays = 7;
function renderInsights(){
  const dateStr = todayKey();
  const today = state.scoreHistory[dateStr] || {total:0, breakdown:{mood:0,journal:0,digital:0}};
  document.getElementById('insightsTodayText').textContent = lang==='ar'
    ? `نقاطك اليوم ${today.total} من 100.`
    : `Your score today is ${today.total} out of 100.`;

  const card = document.getElementById('breakdownCard');
  card.innerHTML = Object.keys(LIFE_SCORE_MAXES).map(k=>{
    const val = today.breakdown[k]||0, max=LIFE_SCORE_MAXES[k];
    return `<div class="bd-row"><span class="bd-label">${factorLabel(k)}</span><span class="bd-track"><i class="bd-fill" style="width:${Math.round(val/max*100)}%"></i></span><span class="bd-val">${val}/${max}</span></div>`;
  }).join('');

  const last7 = [];
  for(let i=0;i<7;i++){ const rec = state.scoreHistory[dateKeyOffset(-i)]; if(rec) last7.push(rec.total); }
  document.getElementById('statAvg').textContent = last7.length ? Math.round(last7.reduce((a,b)=>a+b,0)/last7.length) : '–';
  document.getElementById('statBest').textContent = last7.length ? Math.max(...last7) : '–';
  let longest=0, run=0;
  for(let i=59;i>=0;i--){ if(state.ritual.history[dateKeyOffset(-i)]){ run++; longest=Math.max(longest,run); } else run=0; }
  document.getElementById('statLongStreak').textContent = longest;

  renderWeekBars('weekBars2', insightsHistoryDays);

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

document.getElementById('historyTabs').querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=>{
  insightsHistoryDays = parseInt(b.dataset.days,10);
  document.getElementById('historyTabs').querySelectorAll('button').forEach(x=>x.classList.toggle('active', x===b));
  renderInsights();
}));

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
  const momentum = state.streak;
  document.getElementById('rsDoneSub').textContent = lang==='ar'
    ? 'حفظنا نيتك على جهازك. رجعلها أي وقت من صفحة التحليلات.'
    : "We've saved your intention on this device. You can revisit it anytime from Insights.";
  document.getElementById('rsStreakCard').innerHTML = `<div class="tip-card"><div class="tip-icon">⚡</div><div class="tip-text"><b>${t('momentum_pct')(momentum)}</b><p>${lang==='ar'?'زخم طقس الصباح':'morning ritual momentum'}</p></div></div>`;
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
const JOURNAL_PROMPTS = {
  en: ["What's on my mind right now?", "One thing I'm grateful for", "What's stressing me out?", "A small win from today"],
  ar: ["شو في بالي هلأ؟", "شي وحد أنا ممتن له", "شو ضاغط علي؟", "انتصار صغير من اليوم"]
};
function buildJournalSuggestRow(){
  const row = document.getElementById('journalSuggestRow'); if(!row) return;
  row.innerHTML='';
  JOURNAL_PROMPTS[lang].forEach(p=>{
    const c=document.createElement('button'); c.className='suggest-chip'; c.textContent=p;
    c.addEventListener('click', ()=>{
      const input=document.getElementById('journalInput');
      input.value = input.value.trim() ? input.value.trim()+'\n'+p+' ' : p+' ';
      input.focus();
    });
    row.appendChild(c);
  });
}
document.getElementById('journalSaveBtn').addEventListener('click', ()=>{
  const val = document.getElementById('journalInput').value.trim();
  if(!val) return;
  const trigger = document.getElementById('journalTriggerInput').value.trim();
  state.journal.push({ id: Date.now()+'-'+Math.random().toString(36).slice(2,7), date: todayKey(), ts: Date.now(), mood: journalSelectedMood, text: val, trigger });
  saveState();
  document.getElementById('journalInput').value='';
  document.getElementById('journalTriggerInput').value='';
  journalSelectedMood=null; buildJournalMoodRow();
  const btn=document.getElementById('journalSaveBtn'); const old=btn.textContent;
  btn.textContent = t('journal_saved_toast');
  setTimeout(()=>{ btn.textContent = t('journal_save'); }, 1200);
  recalcLifeScore(); renderHome(); renderJournal(); renderMemoryChips();
});
document.getElementById('journalSearch').addEventListener('input', renderJournal);
function renderJournal(){
  buildJournalMoodRow();
  buildJournalSuggestRow();
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
      ${e.trigger ? `<div class="je-text" style="margin-top:6px;color:var(--ink-faint);font-size:11.5px;">${lang==='ar'?'المحفز':'Trigger'}: ${escapeHtml(e.trigger)}</div>` : ''}
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
  if(state.streak>=15) chips.push(`⚡ ${t('momentum_pct')(state.streak)}`);
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
    `That's genuinely good to hear — let it land.${n>=40?` Your ${t('momentum_pct')(n)} shows you're building something consistent.`:''}`,
    `Love that for you. Little wins like this add up more than they feel like they do.`,
    `That's worth savoring for a second before the day pulls you forward.`
  ],
  ar: n=>[
    `حلو جداً — استمتع فيه.${n>=40?` وزخمك ${t('momentum_pct')(n)} يشهد إنك تبني شي ثابت.`:''}`,
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
      ? `نقاطك اليوم ${scoreTxt}/100، وزخمك ${t('momentum_pct')(state.streak)}. ${state.journal.length?`كتبت ${state.journal.length} مذكرة لهلق.`:'جرب تكتب أول مذكرة، بتساعدك تشوف نفسك أوضح.'}`
      : `You're at ${scoreTxt}/100 today, with ${t('momentum_pct')(state.streak)}. ${state.journal.length?`You've written ${state.journal.length} journal entries so far.`:'Try writing your first journal entry — it helps patterns show up faster.'}`;
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
  renderPerformanceGrid();
  if(currentDomainKey && document.getElementById('screen-domain').classList.contains('active')) renderDomainScreen();
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
  staggerReveal('.card, .bento', document.getElementById('screen-home'));
  setInterval(initHero, 5*60*1000);
}
bootApp();

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
}
