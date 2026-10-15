'use strict';
state.exams??=[];
let calendarMonth=new Date(),calendarView='month',editingExam=null;
const daysUntil=date=>Math.round((Date.UTC(...date.split('-').map((v,i)=>Number(v)-(i===1?1:0)))-Date.UTC(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()))/86400000);
const eventEnd=e=>e.endDate||e.date;
const eventColor=e=>/^#[0-9a-f]{6}$/i.test(e.color||'')?e.color:'#95d1ad';
const dateLabel=date=>new Intl.DateTimeFormat('de-DE',{dateStyle:'medium'}).format(new Date(date+'T12:00:00'));
function eventInk(color){const c=color.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722>.179?'#14221e':'#ffffff';}
function examLabel(exam){const days=daysUntil(exam.date);return exam.done?'✓ Erledigt':days<=0&&daysUntil(eventEnd(exam))>=0?(eventEnd(exam)!==exam.date?'Läuft gerade':'Heute'):days===1?'Morgen':days<0?'Vergangen':`In ${days} Tagen`;}
function eventDetails(e){return `${dateLabel(e.date)}${eventEnd(e)!==e.date?' – '+dateLabel(eventEnd(e)):''} · ${e.time?e.time+' Uhr'+(e.endTime?' – '+e.endTime+' Uhr':''):'Ganztägig'}${e.place?' · '+e.place:''}`;}
function renderCalendar(){
 state.exams??=[];
 const appearance=C.calendarAppearance(state.calendarAppearance);
 $('calendar-event-style').value=appearance.style;
 $('calendar-event-background').checked=appearance.eventBackground;
 $('calendar-day-background').checked=appearance.dayBackground;
 $('kalender').dataset.eventStyle=appearance.style;
 $('kalender').classList.toggle('no-event-background',!appearance.eventBackground);
 $('kalender').classList.toggle('no-day-background',!appearance.dayBackground);
 const sorted=state.exams.slice().sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
 const next=sorted.find(e=>!e.done&&daysUntil(eventEnd(e))>=0);
 $('next-exam').hidden=!next;$('next-exam').textContent=next?`⌑ Nächster Termin: ${next.title} · ${examLabel(next)}`:'';
 const y=calendarMonth.getFullYear(),m=calendarMonth.getMonth();
 const start=new Date(calendarMonth);start.setHours(12,0,0,0);
 if(calendarView==='month')start.setDate(1);
 start.setDate(start.getDate()-(start.getDay()+6)%7);
 const count=calendarView==='week'?7:Math.ceil(((new Date(y,m,1).getDay()+6)%7+new Date(y,m+1,0).getDate())/7)*7;
 const end=new Date(start);end.setDate(end.getDate()+count-1);
 $('calendar-month').textContent=calendarView==='month'?new Intl.DateTimeFormat('de-DE',{month:'long',year:'numeric'}).format(calendarMonth):`${dateLabel(C.dayKey(start))} – ${dateLabel(C.dayKey(end))}`;
 $('calendar-jump').value=C.dayKey(calendarMonth);
 const outsideCoverage=C.dayKey(start)<NiedersachsenCalendar.coverageStart||C.dayKey(end)>NiedersachsenCalendar.coverageEnd;
 $('ni-coverage').hidden=!outsideCoverage;
 $('ni-coverage').textContent='Für Teile dieser Ansicht sind keine Schulferiendaten hinterlegt. Enthalten: Januar 2025 bis Sommerferien 2030. Gesetzliche Feiertage werden ab 2025 angezeigt.';
 $('month-prev').setAttribute('aria-label',calendarView==='month'?'Vorheriger Monat':'Vorherige Woche');
 $('month-next').setAttribute('aria-label',calendarView==='month'?'Nächster Monat':'Nächste Woche');
 ['month','week'].forEach(view=>{$('view-'+view).classList.toggle('selected',calendarView===view);$('view-'+view).setAttribute('aria-pressed',String(calendarView===view));});
 $('calendar-grid').classList.toggle('week-view',calendarView==='week');
 $('calendar-grid').innerHTML=['Mo','Di','Mi','Do','Fr','Sa','So'].map(d=>`<div class="weekday">${d}</div>`).join('')+Array.from({length:count},(_,i)=>{
  const day=new Date(start);day.setDate(day.getDate()+i);const date=C.dayKey(day),exams=sorted.filter(e=>e.date<=date&&eventEnd(e)>=date);
  const official=NiedersachsenCalendar.forDate(date);
  const markers=official.map(entry=>'<span class="ni-marker ni-'+entry.kind+'" title="'+escapeHTML((entry.kind==='holiday'?'Gesetzlicher Feiertag':'Schulferien / schulfrei')+' · Niedersachsen · '+dateLabel(entry.start)+(entry.end!==entry.start?' – '+dateLabel(entry.end):''))+'">'+escapeHTML(entry.title)+'</span>').join('');
  return `<div class="calendar-day ${official.some(e=>e.kind==='holiday')?'ni-holiday-day':''} ${official.some(e=>e.kind==='vacation')?'ni-vacation-day':''} ${date===C.dayKey()?'today':''} ${calendarView==='month'&&day.getMonth()!==m?'outside-month':''}" data-day="${date}"><button type="button" class="calendar-date" data-date="${date}" aria-label="${dateLabel(date)}: Termin anlegen" ${date===C.dayKey()?'aria-current="date"':''}><b>${day.getDate()}</b><span class="day-add" aria-hidden="true">+</span></button>${markers}${exams.map(e=>{const color=eventColor(e);return `<button type="button" class="calendar-event ${e.done?'done':''}" style="--event-color:${color};--event-ink:${eventInk(color)}" data-edit-exam="${escapeHTML(e.id)}" title="${escapeHTML(e.title+' · '+eventDetails(e))}">${e.date<date?'↤ ':''}${e.time&&e.date===date?escapeHTML(e.time)+' ':''}${escapeHTML(e.title)}${eventEnd(e)>date?' ↦':''}</button>`;}).join('')}</div>`;
 }).join('');
 $('exam-list').innerHTML=sorted.length?sorted.map(e=>`<article class="exam-item" style="border-left:4px solid ${eventColor(e)};padding-left:16px"><div><span class="badge">${examLabel(e)}</span><h3>${escapeHTML(e.title)}</h3><p>${escapeHTML(eventDetails(e))}</p><p class="notes">${escapeHTML(e.notes||'')}</p></div><div class="exam-actions"><button class="secondary" data-edit-exam="${escapeHTML(e.id)}">Bearbeiten</button><button class="quiet" data-done-exam="${escapeHTML(e.id)}">${e.done?'Wieder offen':'✓ Erledigt'}</button></div></article>`).join(''):'<p class="empty">Noch keine Termine. Klicke auf einen Tag oder auf „Termin eintragen“.</p>';
 $('calendar-grid').querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>openExam(null,b.dataset.date));
 $('calendar-grid').querySelectorAll('[data-day]').forEach(b=>b.onclick=ev=>{if(ev.target===b)openExam(null,b.dataset.day);});
 $('kalender').querySelectorAll('[data-edit-exam]').forEach(b=>b.onclick=()=>openExam(b.dataset.editExam));
 $('exam-list').querySelectorAll('[data-done-exam]').forEach(b=>b.onclick=()=>{const e=state.exams.find(e=>e.id===b.dataset.doneExam);e.done=!e.done;save();renderCalendar();});
}
for(const id of ['calendar-event-style','calendar-event-background','calendar-day-background'])$(id).onchange=()=>{
 state.calendarAppearance=C.calendarAppearance({style:$('calendar-event-style').value,eventBackground:$('calendar-event-background').checked,dayBackground:$('calendar-day-background').checked});
 save();renderCalendar();
};
const palette=[['Grün','#95d1ad'],['Blau','#94bfff'],['Lila','#ceb0f4'],['Rosa','#f4acc8'],['Orange','#ffc185'],['Gelb','#f0df88'],['Rot','#ef9292']];
function syncColors(){$('exam-colors').querySelectorAll('[data-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===$('exam-color').value)));}
function renderColorPresets(){
 const custom=C.customColors(state.customColors).filter(color=>!palette.some(p=>p[1]===color));
 const colors=palette.concat(custom.map(color=>['Eigene Farbe '+color,color]));
 $('exam-colors').innerHTML=colors.map(([name,color])=>`<button type="button" data-color="${color}" style="background:${color}" aria-label="${name}" title="${name}"></button>`).join('')+'<button type="button" id="exam-save-color" class="save-color" aria-label="Aktuelle Farbe als Vorlage speichern" title="Aktuelle Farbe als Vorlage speichern">+</button>';
 $('exam-colors').querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{$('exam-color').value=b.dataset.color;$('exam-color-status').textContent='';syncColors();});
 $('exam-save-color').onclick=()=>{
  const color=$('exam-color').value.toLowerCase();
  const existing=palette.some(p=>p[1]===color)||C.customColors(state.customColors).includes(color);
  if(existing){$('exam-color-status').textContent='Diese Farbe ist bereits als Vorlage vorhanden.';return;}
  state.customColors=C.customColors([...(C.customColors(state.customColors)),color]);save();renderColorPresets();
  $('exam-color-status').textContent='Farbe gespeichert. Du kannst jetzt eine weitere Farbe wählen und mit + speichern.';
  $('exam-save-color').focus();
 };
 syncColors();
}
$('exam-color').oninput=()=>{$('exam-color-status').textContent='';syncColors();};
renderColorPresets();
function openExam(id,date=C.dayKey()){
 editingExam=id;const exam=state.exams.find(e=>e.id===id);$('exam-form').reset();$('exam-error').textContent='';$('exam-color-status').textContent='';renderColorPresets();
 $('exam-dialog-title').textContent=exam?'Termin bearbeiten':'Termin planen';
 $('exam-title').value=exam?.title||'';$('exam-date').value=exam?.date||date;$('exam-end-date').value=exam?eventEnd(exam):date;
 $('exam-time').value=exam?.time||'';$('exam-end-time').value=exam?.endTime||'';$('exam-color').value=eventColor(exam||{});
 $('exam-place').value=exam?.place||'';$('exam-notes').value=exam?.notes||'';$('exam-delete').hidden=!id;syncColors();$('exam-dialog').showModal();
}
$('exam-date').onchange=()=>{if($('exam-end-date').value<$('exam-date').value)$('exam-end-date').value=$('exam-date').value;};
$('exam-time').onchange=()=>{if(!$('exam-time').value)$('exam-end-time').value='';};
$('exam-one-day').onclick=()=>{$('exam-end-date').value=$('exam-date').value;};
$('exam-one-week').onclick=()=>{if(!$('exam-date').value)return;const date=new Date($('exam-date').value+'T12:00:00');date.setDate(date.getDate()+6);$('exam-end-date').value=C.dayKey(date);};
$('new-exam').onclick=()=>openExam(null);$('exam-cancel').onclick=()=>$('exam-dialog').close();
function moveCalendar(amount){if(calendarView==='week')calendarMonth.setDate(calendarMonth.getDate()+7*amount);else{calendarMonth.setDate(1);calendarMonth.setMonth(calendarMonth.getMonth()+amount);}renderCalendar();}
$('month-prev').onclick=()=>moveCalendar(-1);$('month-next').onclick=()=>moveCalendar(1);
$('month-today').onclick=()=>{calendarMonth=new Date();renderCalendar();};
$('view-month').onclick=()=>{calendarView='month';renderCalendar();};$('view-week').onclick=()=>{calendarView='week';renderCalendar();};
$('calendar-jump').onchange=()=>{if($('calendar-jump').value&&$('calendar-jump').validity.valid){calendarMonth=new Date($('calendar-jump').value+'T12:00:00');renderCalendar();}};
$('exam-form').onsubmit=e=>{
 e.preventDefault();try{
 const old=state.exams.find(e=>e.id===editingExam);
 const exam=C.validateExams([{title:$('exam-title').value,date:$('exam-date').value,endDate:$('exam-end-date').value,time:$('exam-time').value,endTime:$('exam-end-time').value,color:$('exam-color').value,place:$('exam-place').value,notes:$('exam-notes').value,done:old?.done||false}])[0];
 exam.id=editingExam||C.uid();if(old)state.exams=state.exams.map(e=>e.id===editingExam?exam:e);else state.exams.push(exam);
 save();calendarMonth=new Date(exam.date+'T12:00:00');renderCalendar();$('exam-dialog').close();toast('Termin gespeichert.');
 }catch(error){$('exam-error').textContent=error.message;}
};
$('exam-delete').onclick=()=>{const removed=state.exams.find(e=>e.id===editingExam);if(!removed)return;state.exams=state.exams.filter(e=>e.id!==editingExam);save();renderCalendar();$('exam-dialog').close();$('undo-exam').hidden=false;$('undo-exam').onclick=()=>{if(!state.exams.some(e=>e.id===removed.id))state.exams.push(removed);save();renderCalendar();$('undo-exam').hidden=true;};toast('Termin entfernt. Du kannst ihn über „Löschen rückgängig“ zurückholen.');};
addEventListener('hashchange',renderCalendar);addEventListener('storage',renderCalendar);document.addEventListener('visibilitychange',()=>{if(!document.hidden)renderCalendar();});$('confirm-restore').addEventListener('click',renderCalendar);renderCalendar();
