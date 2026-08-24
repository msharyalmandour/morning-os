/* ============================= STATE ============================= */
const DEFAULT_STATE = {
  user: null,               // { name, thesisTitle }
  onboarded: false,
  dark: false,
  sections: JSON.parse(JSON.stringify(SEED_SECTIONS)),
  gap: JSON.parse(JSON.stringify(SEED_GAP)),
  aim: JSON.parse(JSON.stringify(SEED_AIM)),
  methodology: JSON.parse(JSON.stringify(SEED_METHODOLOGY)),
  studies: JSON.parse(JSON.stringify(SEED_STUDIES)),
  tasks: JSON.parse(JSON.stringify(SEED_TASKS))
};
let state = loadState();
function loadState(){
  try{
    const raw = localStorage.getItem('bahthi_state');
    if(raw){
      const parsed = JSON.parse(raw);
      const merged = JSON.parse(JSON.stringify(DEFAULT_STATE));
      Object.assign(merged, parsed);
      merged.user = parsed.user || null;
      const sections = {};
      PROPOSAL_SECTIONS.forEach(s=>{
        sections[s.key] = Object.assign({status:'pending', note:''}, DEFAULT_STATE.sections[s.key], parsed.sections && parsed.sections[s.key]);
      });
      merged.sections = sections;
      merged.gap = Object.assign({}, DEFAULT_STATE.gap, parsed.gap);
      merged.aim = Object.assign({statement:'', questions:['','','']}, parsed.aim);
      merged.methodology = Object.assign({}, DEFAULT_STATE.methodology, parsed.methodology, { dataCollection: (parsed.methodology && Array.isArray(parsed.methodology.dataCollection)) ? parsed.methodology.dataCollection : [] });
      merged.studies = Array.isArray(parsed.studies) ? parsed.studies : DEFAULT_STATE.studies;
      merged.tasks = Array.isArray(parsed.tasks) ? parsed.tasks : DEFAULT_STATE.tasks;
      return merged;
    }
  }catch(e){}
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}
function saveState(){ try{ localStorage.setItem('bahthi_state', JSON.stringify(state)); }catch(e){} }
function todayKey(){ return new Date().toISOString().slice(0,10); }
function newId(){ return Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7); }
function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function fmtDate(dateStr){
  if(!dateStr) return '';
  const d = new Date(dateStr+'T00:00:00');
  return new Intl.DateTimeFormat('ar', {day:'numeric', month:'long', calendar:'gregory'}).format(d);
}
function daysUntil(dateStr){
  const d = new Date(dateStr+'T00:00:00'), now = new Date(todayKey()+'T00:00:00');
  return Math.round((d-now)/86400000);
}

/* ============================= REVEAL ANIMATION ============================= */
function staggerReveal(selector, root){
  const els = (root||document).querySelectorAll(selector);
  els.forEach((el,i)=>{
    el.classList.add('reveal');
    el.classList.remove('in');
    setTimeout(()=> el.classList.add('in'), 40 + i*45);
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
  if(name==='home') renderHome();
  if(name==='proposal') renderProposal();
  if(name==='literature') renderLiterature();
  if(name==='tasks') renderTasks();
  if(name==='home') staggerReveal('.card, .bento', document.getElementById('screen-home'));
  if(name==='proposal') staggerReveal('.section-row, .card', document.getElementById('screen-proposal'));
  if(name==='literature') staggerReveal('.study-card', document.getElementById('screen-literature'));
  if(name==='tasks') staggerReveal('.task-row', document.getElementById('screen-tasks'));
}

/* ============================= VIEW MODAL ============================= */
const viewOverlay=document.getElementById('viewOverlay'), viewBody=document.getElementById('viewBody');
function openView(html){ viewBody.innerHTML=html; viewOverlay.classList.add('active'); }
function closeView(){ viewOverlay.classList.remove('active'); }
document.getElementById('viewClose').addEventListener('click', closeView);
viewOverlay.addEventListener('click', e=>{ if(e.target===viewOverlay) closeView(); });

/* ============================= DERIVED PROGRESS ============================= */
function calcProgress(){
  const statuses = PROPOSAL_SECTIONS.map(s=>state.sections[s.key].status);
  const done = statuses.filter(s=>s==='done').length;
  const prog = statuses.filter(s=>s==='progress').length;
  const secScore = (done + prog*0.5) / statuses.length;
  const tasksDone = state.tasks.filter(t=>t.status==='done').length;
  const taskScore = state.tasks.length ? tasksDone/state.tasks.length : 0;
  return Math.max(0, Math.min(100, Math.round(secScore*70 + taskScore*30)));
}
function journeyGates(){
  return [
    state.sections.background.status==='done' && state.sections.problem.status==='done',
    state.sections.litreview.status==='done',
    state.sections.gap.status==='done',
    state.sections.aim.status==='done' && state.sections.questions.status==='done',
    state.sections.methodology.status==='done',
    false, false, false
  ];
}
function getCurrentStageIndex(){
  const gates = journeyGates();
  const idx = gates.findIndex(g=>!g);
  return idx===-1 ? JOURNEY.length-1 : idx;
}
function getCurrentTask(){
  return state.tasks.find(t=>t.status==='progress')
      || state.tasks.slice().sort((a,b)=>a.deadline.localeCompare(b.deadline)).find(t=>t.status==='not_started')
      || null;
}
function getNextPendingSection(){
  return PROPOSAL_SECTIONS.find(s=>state.sections[s.key].status==='pending') || null;
}
function getNextDeadlineTask(){
  return state.tasks.filter(t=>t.status!=='done').slice().sort((a,b)=>a.deadline.localeCompare(b.deadline))[0] || null;
}

/* ============================= JOURNEY STEPPER ============================= */
function renderJourneyStepper(elId){
  const wrap = document.getElementById(elId); if(!wrap) return;
  const gates = journeyGates();
  const currentIdx = getCurrentStageIndex();
  wrap.innerHTML = JOURNEY.map((s,i)=>{
    const done = gates[i];
    const isCurrent = i===currentIdx && !done;
    return `<div class="step-item ${done?'done':''} ${isCurrent?'current':''}">
      <div class="step-line"></div>
      <div class="step-icon">${done?'✓':s.emoji}</div>
      <div class="step-label">${s.label}</div>
    </div>`;
  }).join('');
}

/* ============================= SECTION STATUS BADGE ============================= */
function statusPillHtml(status){
  return `<span class="status-pill ${status}">${SECTION_STATUS_LABEL[status]}</span>`;
}
function sectionDotStyle(hue){ return `background:var(--${hue});`; }

/* ============================= HOME ============================= */
function renderHome(){
  const name = state.user ? state.user.name : 'صديق/ة البحث';
  document.getElementById('heroGreeting').textContent = `أهلاً، ${name}`;
  document.getElementById('heroThesisTitle').textContent = (state.user && state.user.thesisTitle) ? state.user.thesisTitle : 'أضف عنوان دراستك من الإعدادات لاحقاً';

  const progress = calcProgress();
  const ring = document.getElementById('progressRing');
  if(ring) ring.style.setProperty('--pct', progress);
  document.getElementById('progressVal').textContent = progress;

  const stageIdx = getCurrentStageIndex();
  document.getElementById('currentStageLabel').textContent = JOURNEY[stageIdx].emoji+' '+JOURNEY[stageIdx].label;

  const curTask = getCurrentTask();
  document.getElementById('currentTaskText').textContent = curTask ? curTask.title : 'كل مهامك مكتملة — أضف مهمة جديدة!';

  const nextSection = getNextPendingSection();
  document.getElementById('nextStepText').textContent = nextSection ? `ابدأ: ${nextSection.label}` : 'راجع مقترحك بشكل نهائي';

  const nextTask = getNextDeadlineTask();
  const dTitle = document.getElementById('nextDeadlineTitle'), dSub = document.getElementById('nextDeadlineSub');
  if(nextTask){
    const days = daysUntil(nextTask.deadline);
    dTitle.textContent = nextTask.title;
    dSub.textContent = days < 0 ? `متأخر ${Math.abs(days)} يوم — ${fmtDate(nextTask.deadline)}` : days===0 ? `اليوم — ${fmtDate(nextTask.deadline)}` : `بعد ${days} يوم — ${fmtDate(nextTask.deadline)}`;
  } else {
    dTitle.textContent = 'ما في مواعيد قادمة';
    dSub.textContent = 'خلّصت كل مهامك المجدولة.';
  }

  renderJourneyStepper('journeyStepper');

  const doneCount = PROPOSAL_SECTIONS.filter(s=>state.sections[s.key].status==='done').length;
  document.getElementById('proposalCountLabel').textContent = `${doneCount}/${PROPOSAL_SECTIONS.length}`;
  const grid = document.getElementById('proposalGridHome');
  grid.innerHTML = PROPOSAL_SECTIONS.map(s=>{
    const st = state.sections[s.key].status;
    return `<button class="bento clickable" data-section="${s.key}" style="${sectionDotStyle(s.hue)}">
      <span class="bento-status ${st==='done'?'done':''}">${SECTION_STATUS_LABEL[st]}</span>
      <div class="bento-title" style="font-size:13.5px;margin-top:26px;">${s.label}</div>
      <div class="bento-sub">${s.en}</div>
    </button>`;
  }).join('');
  grid.querySelectorAll('[data-section]').forEach(b=> b.addEventListener('click', ()=> openSectionModal(b.dataset.section)));

  document.getElementById('statCollected').textContent = state.studies.length;
  document.getElementById('statReviewed').textContent = state.studies.filter(s=>s.reviewed).length;
  document.getElementById('statRemaining').textContent = state.studies.filter(s=>!s.reviewed).length;
}
document.getElementById('nextStepCard').addEventListener('click', ()=> showScreen('proposal'));
document.getElementById('nextDeadlineCard').addEventListener('click', ()=> showScreen('tasks'));
document.getElementById('litSummaryCard').addEventListener('click', ()=> showScreen('literature'));

/* ============================= PROPOSAL SCREEN ============================= */
function renderProposal(){
  renderJourneyStepper('journeyStepper2');

  const list = document.getElementById('sectionsList');
  list.innerHTML = PROPOSAL_SECTIONS.map(s=>{
    const st = state.sections[s.key].status;
    return `<div class="section-row" data-section="${s.key}">
      <span class="section-row-dot" style="${sectionDotStyle(s.hue)}"></span>
      <div class="section-row-text">
        <div class="section-row-title">${s.label}</div>
        <div class="section-row-sub">${s.en}</div>
      </div>
      ${statusPillHtml(st)}
    </div>`;
  }).join('');
  list.querySelectorAll('[data-section]').forEach(r=> r.addEventListener('click', ()=> openSectionModal(r.dataset.section)));

  document.getElementById('gapKnown').value = state.gap.known;
  document.getElementById('gapUnknown').value = state.gap.unknown;
  document.getElementById('gapStatement').value = state.gap.gapStatement;
  document.getElementById('gapYourStudy').value = state.gap.yourStudy;
  const gapLinked = state.sections.aim.status !== 'pending';
  const gapHasContent = state.gap.gapStatement.trim().length > 0;
  document.getElementById('gapWarning').style.display = (gapHasContent && !gapLinked) ? 'flex' : 'none';

  document.getElementById('aimStatement').value = state.aim.statement;
  const qWrap = document.getElementById('aimQuestionsList');
  qWrap.innerHTML = [0,1,2].map(i=>`
    <div class="aim-question-row">
      <span class="aim-q-num">${i+1}</span>
      <input class="aim-q-input" data-q="${i}" value="${escapeHtml(state.aim.questions[i]||'')}" placeholder="سؤال بحث رقم ${i+1}">
    </div>`).join('');

  document.getElementById('methodSetting').value = state.methodology.setting;
  document.getElementById('methodPopulation').value = state.methodology.population;
  document.getElementById('methodInclusion').value = state.methodology.inclusion;
  document.getElementById('methodExclusion').value = state.methodology.exclusion;
  document.getElementById('methodSampleSize').value = state.methodology.sampleSize;
  document.getElementById('methodSamplingTech').value = state.methodology.samplingTechnique;
  document.getElementById('designChips').querySelectorAll('.chip-toggle').forEach(c=> c.classList.toggle('selected', c.dataset.val===state.methodology.design));
  document.getElementById('studyToolChips').querySelectorAll('.chip-toggle').forEach(c=> c.classList.toggle('selected', c.dataset.val===state.methodology.studyTool));
  document.getElementById('dataCollectionChips').querySelectorAll('.chip-toggle').forEach(c=> c.classList.toggle('selected', state.methodology.dataCollection.includes(c.dataset.val)));
}

/* gap + aim autosave on blur */
['gapKnown','gapUnknown','gapStatement','gapYourStudy'].forEach(id=>{
  const map = {gapKnown:'known', gapUnknown:'unknown', gapStatement:'gapStatement', gapYourStudy:'yourStudy'};
  document.getElementById(id).addEventListener('change', e=>{
    state.gap[map[id]] = e.target.value;
    saveState();
    renderHome(); renderProposal();
  });
});
document.getElementById('aimStatement').addEventListener('change', e=>{ state.aim.statement = e.target.value; saveState(); });
document.getElementById('aimQuestionsList').addEventListener('change', e=>{
  if(e.target.dataset.q===undefined) return;
  state.aim.questions[parseInt(e.target.dataset.q,10)] = e.target.value;
  saveState();
});
['methodSetting','methodPopulation','methodInclusion','methodExclusion','methodSampleSize','methodSamplingTech'].forEach(id=>{
  const map = {methodSetting:'setting', methodPopulation:'population', methodInclusion:'inclusion', methodExclusion:'exclusion', methodSampleSize:'sampleSize', methodSamplingTech:'samplingTechnique'};
  document.getElementById(id).addEventListener('change', e=>{ state.methodology[map[id]] = e.target.value; saveState(); });
});
document.getElementById('designChips').addEventListener('click', e=>{
  const chip = e.target.closest('.chip-toggle'); if(!chip) return;
  state.methodology.design = state.methodology.design===chip.dataset.val ? '' : chip.dataset.val;
  saveState();
  document.getElementById('designChips').querySelectorAll('.chip-toggle').forEach(c=> c.classList.toggle('selected', c.dataset.val===state.methodology.design));
});
document.getElementById('studyToolChips').addEventListener('click', e=>{
  const chip = e.target.closest('.chip-toggle'); if(!chip) return;
  state.methodology.studyTool = state.methodology.studyTool===chip.dataset.val ? '' : chip.dataset.val;
  saveState();
  document.getElementById('studyToolChips').querySelectorAll('.chip-toggle').forEach(c=> c.classList.toggle('selected', c.dataset.val===state.methodology.studyTool));
});
document.getElementById('dataCollectionChips').addEventListener('click', e=>{
  const chip = e.target.closest('.chip-toggle'); if(!chip) return;
  const v = chip.dataset.val;
  const i = state.methodology.dataCollection.indexOf(v);
  if(i===-1) state.methodology.dataCollection.push(v); else state.methodology.dataCollection.splice(i,1);
  saveState();
  chip.classList.toggle('selected', state.methodology.dataCollection.includes(v));
});

/* ============================= SECTION EDIT MODAL ============================= */
function openSectionModal(key){
  const s = PROPOSAL_SECTIONS.find(x=>x.key===key);
  const cur = state.sections[key];
  openView(`
    <h2 style="margin-bottom:2px;">${s.label}</h2>
    <p style="color:var(--ink-faint);font-size:12px;margin:0 0 16px;">${s.en}</p>
    <div class="chip-toggle-row" id="modalStatusChips" style="margin-bottom:16px;">
      <button class="chip-toggle ${cur.status==='pending'?'selected':''}" data-st="pending">لم يبدأ</button>
      <button class="chip-toggle ${cur.status==='progress'?'selected':''}" data-st="progress">قيد العمل</button>
      <button class="chip-toggle ${cur.status==='done'?'selected':''}" data-st="done">مكتمل</button>
    </div>
    <div class="form-field">
      <label>ملاحظات</label>
      <textarea id="modalSectionNote" placeholder="أي ملاحظات حول هذا القسم...">${escapeHtml(cur.note)}</textarea>
    </div>
    ${key==='litreview' ? `<button class="pill-btn ghost" id="modalGoLit" style="margin-bottom:10px;">فتح مكتبة الأدبيات</button>` : ''}
    <button class="pill-btn" id="modalSaveSection" style="background:var(--btn-bg);color:var(--btn-ink);">حفظ</button>
  `);
  let pickedStatus = cur.status;
  document.getElementById('modalStatusChips').querySelectorAll('.chip-toggle').forEach(c=>{
    c.addEventListener('click', ()=>{
      pickedStatus = c.dataset.st;
      document.getElementById('modalStatusChips').querySelectorAll('.chip-toggle').forEach(x=>x.classList.toggle('selected', x===c));
    });
  });
  const goLit = document.getElementById('modalGoLit');
  if(goLit) goLit.addEventListener('click', ()=>{ closeView(); showScreen('literature'); });
  document.getElementById('modalSaveSection').addEventListener('click', ()=>{
    state.sections[key].status = pickedStatus;
    state.sections[key].note = document.getElementById('modalSectionNote').value.trim();
    saveState();
    closeView();
    renderHome(); renderProposal();
  });
}

/* ============================= LITERATURE ============================= */
let litFilterKey = 'all';
function renderLiterature(){
  document.getElementById('litStatCollected').textContent = state.studies.length;
  document.getElementById('litStatReviewed').textContent = state.studies.filter(s=>s.reviewed).length;
  document.getElementById('litStatRemaining').textContent = state.studies.filter(s=>!s.reviewed).length;

  const filterRow = document.getElementById('litFilterRow');
  filterRow.innerHTML = LIT_FILTERS.map(f=>`<button class="filter-chip ${f.key===litFilterKey?'active':''}" data-filter="${f.key}">${f.label}</button>`).join('');
  filterRow.querySelectorAll('.filter-chip').forEach(c=> c.addEventListener('click', ()=>{
    litFilterKey = c.dataset.filter;
    renderLiterature();
  }));

  const filtered = state.studies.filter(s=> litFilterKey==='all' || s.theme_tag===litFilterKey);
  const wrap = document.getElementById('studiesByTheme');
  document.getElementById('studiesEmpty').style.display = filtered.length ? 'none' : 'block';
  wrap.innerHTML = THEMES.map(theme=>{
    const inTheme = filtered.filter(s=>s.theme===theme);
    if(!inTheme.length) return '';
    return `<div class="theme-header"><b>${theme}</b><span class="theme-count">${inTheme.length} دراسة</span></div>` +
      inTheme.map(studyCardHtml).join('');
  }).join('');
  wrap.querySelectorAll('.study-tag.toggle-reviewed').forEach(t=> t.addEventListener('click', e=>{
    e.stopPropagation();
    const id = t.dataset.id;
    const study = state.studies.find(s=>s.id===id);
    study.reviewed = !study.reviewed;
    saveState();
    renderLiterature(); renderHome();
  }));
  wrap.querySelectorAll('.study-del').forEach(b=> b.addEventListener('click', e=>{
    e.stopPropagation();
    if(!confirm('حذف هذه الدراسة؟')) return;
    state.studies = state.studies.filter(s=>s.id!==b.dataset.id);
    saveState();
    renderLiterature(); renderHome();
  }));
}
function studyCardHtml(s){
  const filterLabel = (LIT_FILTERS.find(f=>f.key===s.theme_tag)||{}).label || '';
  return `<div class="study-card">
    <button class="study-del" data-id="${s.id}">✕</button>
    <div class="study-title">${escapeHtml(s.title)}</div>
    <div class="study-meta">${escapeHtml(s.authors)} · ${s.year}</div>
    <div class="study-tags">
      <span class="study-tag">${escapeHtml(s.theme)}</span>
      <span class="study-tag">${filterLabel}</span>
      <span class="study-tag toggle-reviewed ${s.reviewed?'reviewed':'not-reviewed'}" data-id="${s.id}">${s.reviewed?'تمت المراجعة':'لم تُراجع بعد'}</span>
    </div>
    <div class="study-row-label">أهم النتائج</div>
    <div class="study-text">${escapeHtml(s.keyFinding)}</div>
    ${s.relevance ? `<div class="study-row-label">الصلة بدراستك</div><div class="study-text">${escapeHtml(s.relevance)}</div>` : ''}
    <div class="study-ref">${escapeHtml(s.reference)}</div>
  </div>`;
}
document.getElementById('addStudyBtn').addEventListener('click', ()=>{
  openView(`
    <h2 style="margin-bottom:14px;">إضافة دراسة</h2>
    <div class="form-field"><label>العنوان</label><input id="fsTitle" placeholder="عنوان الدراسة"></div>
    <div class="form-field"><label>الباحثون</label><input id="fsAuthors" placeholder="مثال: Al-Harbi et al."></div>
    <div class="form-field"><label>السنة</label><input id="fsYear" type="number" placeholder="2024"></div>
    <div class="form-field"><label>الموضوع البحثي — Theme</label>
      <select id="fsTheme">${THEMES.map(t=>`<option value="${t}">${t}</option>`).join('')}</select>
    </div>
    <div class="form-field"><label>القسم المرتبط</label>
      <select id="fsSectionTag">${LIT_FILTERS.filter(f=>f.key!=='all').map(f=>`<option value="${f.key}">${f.label}</option>`).join('')}</select>
    </div>
    <div class="form-field"><label>أهم النتائج</label><textarea id="fsKeyFinding" placeholder="أبرز ما توصلت له الدراسة"></textarea></div>
    <div class="form-field"><label>الصلة بدراستك</label><textarea id="fsRelevance" placeholder="كيف تخدم دراستك؟"></textarea></div>
    <div class="form-field"><label>المرجع</label><input id="fsReference" placeholder="مثال: J Clin Nurs. 2023;32(4):612-620"></div>
    <div class="chip-toggle-row" style="margin-bottom:16px;">
      <button class="chip-toggle" id="fsReviewedToggle" data-on="0">لم تُراجع بعد</button>
    </div>
    <button class="pill-btn" id="fsSave" style="background:var(--btn-bg);color:var(--btn-ink);">حفظ الدراسة</button>
  `);
  const reviewedBtn = document.getElementById('fsReviewedToggle');
  reviewedBtn.addEventListener('click', ()=>{
    const on = reviewedBtn.dataset.on==='1';
    reviewedBtn.dataset.on = on ? '0' : '1';
    reviewedBtn.textContent = on ? 'لم تُراجع بعد' : 'تمت المراجعة';
    reviewedBtn.classList.toggle('selected', !on);
  });
  document.getElementById('fsSave').addEventListener('click', ()=>{
    const title = document.getElementById('fsTitle').value.trim();
    if(!title) return;
    state.studies.push({
      id: newId(),
      title,
      authors: document.getElementById('fsAuthors').value.trim(),
      year: parseInt(document.getElementById('fsYear').value,10) || new Date().getFullYear(),
      theme: document.getElementById('fsTheme').value,
      theme_tag: document.getElementById('fsSectionTag').value,
      keyFinding: document.getElementById('fsKeyFinding').value.trim(),
      relevance: document.getElementById('fsRelevance').value.trim(),
      reference: document.getElementById('fsReference').value.trim(),
      reviewed: reviewedBtn.dataset.on==='1'
    });
    saveState();
    closeView();
    renderLiterature(); renderHome();
  });
});

/* ============================= TASKS ============================= */
function renderTasks(){
  const total = state.tasks.length;
  const done = state.tasks.filter(t=>t.status==='done').length;
  document.getElementById('tasksSummaryText').textContent = `${done} من ${total} مهمة مكتملة.`;

  const open = state.tasks.filter(t=>t.status!=='done').slice().sort((a,b)=>a.deadline.localeCompare(b.deadline));
  const doneList = state.tasks.filter(t=>t.status==='done').slice().sort((a,b)=>b.deadline.localeCompare(a.deadline));

  document.getElementById('tasksOpenList').innerHTML = open.map(taskRowHtml).join('') || `<p class="empty-note">ما في مهام مفتوحة — أضف مهمة جديدة.</p>`;
  document.getElementById('tasksDoneEmpty').style.display = doneList.length ? 'none' : 'block';
  document.getElementById('tasksDoneList').innerHTML = doneList.map(taskRowHtml).join('');

  document.querySelectorAll('.task-status-btn').forEach(b=> b.addEventListener('click', ()=>{
    const task = state.tasks.find(t=>t.id===b.dataset.id);
    const order = ['not_started','progress','done'];
    task.status = order[(order.indexOf(task.status)+1) % order.length];
    saveState();
    renderTasks(); renderHome();
  }));
  document.querySelectorAll('.task-del').forEach(b=> b.addEventListener('click', ()=>{
    if(!confirm('حذف هذه المهمة؟')) return;
    state.tasks = state.tasks.filter(t=>t.id!==b.dataset.id);
    saveState();
    renderTasks(); renderHome();
  }));
}
function taskRowHtml(t){
  const overdue = t.status!=='done' && daysUntil(t.deadline) < 0;
  const icon = t.status==='done' ? '✓' : '';
  return `<div class="task-row ${t.status==='done'?'is-done':''}">
    <button class="task-status-btn ${t.status}" data-id="${t.id}">${icon}</button>
    <div class="task-text">
      <div class="task-title">${escapeHtml(t.title)}</div>
      <div class="task-meta">
        <span class="priority-badge ${t.priority}">${PRIORITY_LABEL[t.priority]}</span>
        <span class="task-deadline ${overdue?'overdue':''}">${fmtDate(t.deadline)}</span>
      </div>
    </div>
    <button class="task-del" data-id="${t.id}">✕</button>
  </div>`;
}
document.getElementById('addTaskBtn').addEventListener('click', ()=>{
  openView(`
    <h2 style="margin-bottom:14px;">مهمة جديدة</h2>
    <div class="form-field"><label>عنوان المهمة</label><input id="ftTitle" placeholder="مثال: كتابة Ethical Considerations"></div>
    <div class="form-field"><label>الأولوية</label>
      <div class="chip-toggle-row" id="ftPriorityChips">
        <button class="chip-toggle selected" data-val="medium">متوسطة</button>
        <button class="chip-toggle" data-val="high">عالية</button>
        <button class="chip-toggle" data-val="low">منخفضة</button>
      </div>
    </div>
    <div class="form-field"><label>الموعد النهائي</label><input id="ftDeadline" type="date" value="${todayKey()}"></div>
    <button class="pill-btn" id="ftSave" style="background:var(--btn-bg);color:var(--btn-ink);">إضافة المهمة</button>
  `);
  let priority = 'medium';
  document.getElementById('ftPriorityChips').querySelectorAll('.chip-toggle').forEach(c=> c.addEventListener('click', ()=>{
    priority = c.dataset.val;
    document.getElementById('ftPriorityChips').querySelectorAll('.chip-toggle').forEach(x=>x.classList.toggle('selected', x===c));
  }));
  document.getElementById('ftSave').addEventListener('click', ()=>{
    const title = document.getElementById('ftTitle').value.trim();
    if(!title) return;
    state.tasks.push({ id:newId(), title, priority, deadline: document.getElementById('ftDeadline').value || todayKey(), status:'not_started' });
    saveState();
    closeView();
    renderTasks(); renderHome();
  });
});

/* ============================= ONBOARDING ============================= */
document.getElementById('obNameNext').addEventListener('click', ()=>{
  const name = document.getElementById('obNameInput').value.trim();
  state.user = { name: name || 'صديق/ة البحث', thesisTitle: '' };
  saveState();
  document.getElementById('obStepName').classList.remove('active');
  document.getElementById('obStepTitle').classList.add('active');
  document.querySelectorAll('.ob-progress i')[1].classList.add('on');
});
document.getElementById('obTitleNext').addEventListener('click', ()=>{
  state.user.thesisTitle = document.getElementById('obTitleInput').value.trim();
  state.onboarded = true;
  saveState();
  document.getElementById('onboardOverlay').classList.add('hidden');
  renderHome();
});

/* ============================= SETTINGS ============================= */
const settingsOverlay=document.getElementById('settingsOverlay');
document.getElementById('settingsBtn').addEventListener('click', ()=>{ renderSettingsUI(); settingsOverlay.classList.add('active'); });
document.getElementById('settingsClose').addEventListener('click', ()=> settingsOverlay.classList.remove('active'));
settingsOverlay.addEventListener('click', e=>{ if(e.target===settingsOverlay) settingsOverlay.classList.remove('active'); });
document.getElementById('darkToggle').addEventListener('click', ()=>{
  state.dark=!state.dark; saveState(); document.body.classList.toggle('dark', state.dark); renderSettingsUI();
});
document.getElementById('exportBtn').addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(state,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='bahthi-data.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});
document.getElementById('resetBtn').addEventListener('click', ()=>{
  if(!confirm('هذا بيمسح كل بيانات بحثك المحفوظة على جهازك. ما ينرجع بعدين. تكمل؟')) return;
  localStorage.removeItem('bahthi_state');
  location.reload();
});
function renderSettingsUI(){
  document.getElementById('darkToggle').classList.toggle('on', !!state.dark);
}

/* ============================= BOOT ============================= */
function bootApp(){
  document.body.classList.toggle('dark', !!state.dark);
  if(!state.onboarded){
    document.getElementById('onboardOverlay').classList.remove('hidden');
  } else {
    document.getElementById('onboardOverlay').classList.add('hidden');
  }
  renderHome();
  staggerReveal('.card, .bento', document.getElementById('screen-home'));
}
bootApp();

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
}
