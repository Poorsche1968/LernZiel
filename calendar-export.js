'use strict';
(()=>{
 const STORE='lernzeit-calendar-export-v1',get=id=>document.getElementById(id),X=CalendarExport;
 let prefs={auto:true,before:1440,target:'both',confirmed:{},remindersConfirmed:{},versions:{}};
 try{const p=JSON.parse(localStorage.getItem(STORE)||'{}');prefs={...prefs,...p};if(!['calendar','reminders','both'].includes(prefs.target))prefs.target='both';if(![-1,0,60,1440,10080].includes(prefs.before))prefs.before=1440;}catch{}
 let batch=[],offered='',allMode=false,autoTimer,handed={calendar:[],reminders:[]},clipTarget=null,completed={calendar:false,reminders:false};
 const targets=()=>prefs.target==='both'?['calendar','reminders']:[prefs.target];
 const map=t=>t==='calendar'?prefs.confirmed:prefs.remindersConfirmed;
 function persist(){localStorage.setItem(STORE,JSON.stringify(prefs));}
 function events(){let changed=false;for(const e of state.exams||[])if(!e.calendarUid){e.calendarUid=C.uid()+'@lernzeit.local';changed=true;}if(changed)save();return state.exams||[];}
 const missing=(e,t)=>map(t)[e.calendarUid]!==X.signature(e,prefs.before);
 function pending(){return events().filter(e=>targets().some(t=>missing(e,t)));}
 const forTarget=t=>batch.filter(e=>allMode?!completed[t]:missing(e,t));
 function message(s){get('cal-export-status').textContent=s;}
 function controls(){
  for(const t of ['calendar','reminders']){
   get('handoff-'+t).hidden=!targets().includes(t);
   if(t==='reminders')get('shortcut-reminders').disabled=!forTarget(t).length||!get('shortcut-ready').checked;
   get('confirm-'+t).disabled=!handed[t].length;
  }
  get('cal-export-download').hidden=!targets().includes('calendar');
  get('cal-export-download').disabled=!forTarget('calendar').length;get('reminders-download').disabled=!forTarget('reminders').length;
 }
 function prepare(all=false){
  allMode=all;batch=(all?events():pending()).map(e=>({...e}));handed={calendar:[],reminders:[]};completed={calendar:false,reminders:false};clipTarget=null;
  get('cal-export-followup').hidden=true;get('shortcut-clipboard').hidden=true;get('cal-export-target').value=prefs.target;
  get('cal-export-title').textContent=batch.length?'Es gibt neue Einträge':'Keine neuen Einträge';
  const name={calendar:'deinen Apple-Kalender',reminders:'Apple Erinnerungen',both:'Apple Kalender und Erinnerungen'}[prefs.target];
  get('cal-export-summary').textContent=batch.length?`Möchtest du ${batch.length} ${all?'eigene':'neue oder geänderte'} Einträge in ${name} übernehmen?`:'Für das gewählte Ziel hast du die Übernahme aller aktuellen Einträge bereits bestätigt.';
  get('cal-export-share').disabled=!batch.length;get('cal-export-list').replaceChildren();
  for(const e of batch){const li=document.createElement('li');li.textContent=`${e.date}${e.time?' · '+e.time:''} – ${e.title}`;get('cal-export-list').append(li);}
  const ids=new Set(events().map(e=>e.calendarUid));const removed=new Set(targets().flatMap(t=>Object.keys(map(t)).filter(id=>!ids.has(id)))).size;
  get('cal-export-warning').textContent=(batch.some(e=>targets().some(t=>map(t)[e.calendarUid]))?'Geänderte oder erneut exportierte Einträge können doppelt angelegt werden. Bestehende Einträge vor dem Hinzufügen prüfen. ':'')+(removed?`${removed} bestätigte Einträge wurden hier entfernt. Entferne diese bei Bedarf auch in den Apple-Apps.`:'');
  message('Kalender: ICS-Datei. Erinnerungen: Text für deinen angepassten Galerie-Kurzbefehl.');controls();
 }
 function open(all=false){prepare(all);if(!get('cal-export-dialog').open)get('cal-export-dialog').showModal();}
 function markHanded(t,list){handed[t]=list.map(e=>({...e}));controls();message('Übergabe gestartet. Prüfe die Einträge in der Apple-App und bestätige anschließend hier das jeweilige Ziel.');}
 function launch(t){
  const list=forTarget(t);if(!list.length||!get('shortcut-ready').checked)return;
  const data=ShortcutBridge.text(list,prefs.before),url=ShortcutBridge.url(data);
  if(url.length>12000){clipTarget={target:t,list,data};get('shortcut-manual-copy').hidden=true;get('shortcut-text').value=data;get('shortcut-clipboard').hidden=false;get('shortcut-clipboard-run').disabled=true;message('Für diese große Auswahl zuerst die Daten kopieren, dann den Kurzbefehl starten.');return;}
  markHanded(t,list);location.href=url;
 }
 for(const t of ['calendar','reminders']){
  if(t==='reminders')get('shortcut-reminders').onclick=()=>launch(t);
  get('confirm-'+t).onclick=()=>{if(!handed[t].length)return;for(const e of handed[t])map(t)[e.calendarUid]=X.signature(e,prefs.before);persist();handed[t]=[];completed[t]=true;controls();refresh();message((t==='calendar'?'Kalender':'Erinnerungen')+' als übernommen bestätigt.');if(targets().every(t=>!forTarget(t).length)){get('cal-export-dialog').close();toast('Übernahme für die gewählten Ziele bestätigt.');}};
 }
 get('shortcut-copy').onclick=async()=>{if(!clipTarget)return;try{await navigator.clipboard.writeText(clipTarget.data);get('shortcut-clipboard-run').disabled=false;message('Kopiert. Jetzt den Kurzbefehl starten.');}catch{message('Kopieren nicht erlaubt. Text unten vollständig auswählen und kopieren.');get('shortcut-manual-copy').hidden=false;}};
 get('shortcut-manual-copy').onclick=()=>{get('shortcut-clipboard-run').disabled=false;};
 get('shortcut-clipboard-run').onclick=()=>{if(!clipTarget)return;markHanded(clipTarget.target,clipTarget.list);location.href=ShortcutBridge.url(null);};
 get('shortcut-ready').onchange=controls;
 get('cal-export-share').onclick=()=>{get('cal-export-followup').hidden=false;controls();message('Kalenderdatei importieren und Erinnerungen über den angepassten Kurzbefehl hinzufügen. Jedes Ziel anschließend getrennt bestätigen.');};
 get('cal-export-download').onclick=()=>{
  try{const list=forTarget('calendar');if(!list.length)return;
   for(const e of list){const sig=X.signature(e,prefs.before),old=prefs.versions[e.calendarUid];if(!old||old.signature!==sig)prefs.versions[e.calendarUid]={signature:sig,sequence:old?(Number(old.sequence)||0)+1:0};}persist();
   const url=URL.createObjectURL(new Blob([X.build(list,prefs.before,prefs.versions)],{type:'text/calendar;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='Lernzeit-Termine.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);markHanded('calendar',list);
  }catch(e){message('Export fehlgeschlagen: '+e.message);}
 };
 get('reminders-download').onclick=()=>{
  try{const list=forTarget('reminders');if(!list.length)return;const url=URL.createObjectURL(new Blob([ShortcutBridge.text(list,prefs.before)],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='Lernzeit-Erinnerungen.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);markHanded('reminders',list);message('Textdatei gespeichert. Inhalt an den angepassten Kurzbefehl übergeben; erst nach tatsächlicher Anlage bestätigen.');}catch(e){message('Export fehlgeschlagen: '+e.message);}
 };
 get('cal-export-target').onchange=e=>{prefs.target=e.target.value;persist();prepare(allMode);refresh();};
 get('cal-export-later').onclick=()=>get('cal-export-dialog').close();get('cal-export-open').onclick=()=>open(false);get('cal-export-all').onclick=()=>open(true);
 function refresh(){get('cal-export-count').textContent=`${events().length} eigene Termine · ${pending().length} neu oder geändert für ${prefs.target==='both'?'Kalender / Erinnerungen':prefs.target==='calendar'?'Kalender':'Erinnerungen'}`;}
 get('cal-export-auto').checked=prefs.auto;get('cal-export-before').value=String(prefs.before);
 get('cal-export-auto').onchange=e=>{prefs.auto=e.target.checked;persist();};get('cal-export-before').onchange=e=>{prefs.before=Number(e.target.value);persist();refresh();};
 function auto(){refresh();if(!prefs.auto||!navigator.onLine||document.hidden||document.querySelector('dialog[open]'))return;const changes=pending(),sig=JSON.stringify([prefs.target,changes.map(e=>[e.calendarUid,X.signature(e,prefs.before)])]);if(changes.length&&sig!==offered){offered=sig;open(false);}}
 function schedule(){clearTimeout(autoTimer);autoTimer=setTimeout(auto,800);}
 addEventListener('online',schedule);document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});addEventListener('lernzeit-data-changed',schedule);addEventListener('storage',e=>{if(e.key===KEY){if(get('cal-export-dialog').open)get('cal-export-dialog').close();schedule();}});schedule();
})();
