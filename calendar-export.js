'use strict';
(()=>{
 const STORE='lernzeit-calendar-export-v1',get=id=>document.getElementById(id),X=CalendarExport;
 let prefs={auto:true,before:1440,confirmed:{},versions:{}};
 try{const p=JSON.parse(localStorage.getItem(STORE)||'{}');prefs={auto:p.auto!==false,before:[-1,0,60,1440,10080].includes(p.before)?p.before:1440,confirmed:p.confirmed||{},versions:p.versions||{}};}catch{}
 let batch=[],offered='',handedOff=false,autoTimer;
 function persist(){localStorage.setItem(STORE,JSON.stringify(prefs));}
 function events(){let changed=false;for(const e of state.exams||[])if(!e.calendarUid){e.calendarUid=C.uid()+'@lernzeit.local';changed=true;}if(changed)save();return state.exams||[];}
 function pending(){return events().filter(e=>prefs.confirmed[e.calendarUid]!==X.signature(e,prefs.before));}
 function message(s){get('cal-export-status').textContent=s;}
 function prepare(all=false){
  batch=(all?events():pending()).map(e=>({...e}));handedOff=false;get('cal-export-followup').hidden=true;get('cal-export-title').textContent=all?'Kalendereinträge übernehmen':'Es gibt neue Einträge';
  get('cal-export-confirm').disabled=true;get('cal-export-share').disabled=!batch.length;get('cal-export-download').disabled=!batch.length;
  get('cal-export-summary').textContent=batch.length?`Möchtest du ${batch.length} ${all?'eigene':'neue oder geänderte'} Einträge in deinen Apple-Kalender übernehmen?`:'Alle aktuellen Termine wurden bereits von dir als übernommen bestätigt.';
  get('cal-export-list').replaceChildren();
  for(const e of batch){const li=document.createElement('li');li.textContent=`${e.date}${e.time?' · '+e.time:''} – ${e.title}${prefs.confirmed[e.calendarUid]?' (geändert / erneut exportiert)':''}`;get('cal-export-list').append(li);}
  const ids=new Set(events().map(e=>e.calendarUid));const removed=Object.keys(prefs.confirmed).filter(id=>!ids.has(id)).length;
  get('cal-export-warning').textContent=(batch.some(e=>prefs.confirmed[e.calendarUid])?'Geänderte oder erneut exportierte Termine können je nach Kalender doppelt angelegt werden. Prüfe bestehende Einträge vor dem Import. ':'')+(removed?`${removed} zuvor bestätigte Termine wurden in Lernzeit entfernt. Lösche sie bei Bedarf selbst im Handy-Kalender.`:'');
  message('Mit „Übernehmen“ öffnest du den Kalenderexport. Das Hinzufügen bestätigst du anschließend im Kalender.');
 }
 function open(all=false){prepare(all);if(!get('cal-export-dialog').open)get('cal-export-dialog').showModal();}
 function file(){
  for(const e of batch){const sig=X.signature(e,prefs.before),old=prefs.versions[e.calendarUid];if(!old||old.signature!==sig)prefs.versions[e.calendarUid]={signature:sig,sequence:old?(Number(old.sequence)||0)+1:0};}
  persist();return new File([X.build(batch,prefs.before,prefs.versions)],'Lernzeit-Termine.ics',{type:'text/calendar;charset=utf-8'});
 }
 function handed(){get('cal-export-followup').hidden=false;handedOff=true;get('cal-export-confirm').disabled=false;message('Datei bereitgestellt – das bedeutet noch nicht, dass sie importiert ist. Nach erfolgreichem Import im Kalender hier bestätigen.');}
 function download(){try{const f=file(),url=URL.createObjectURL(f),a=document.createElement('a');a.href=url;a.download=f.name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);handed();}catch(e){message('Export fehlgeschlagen: '+e.message);}}
 get('cal-export-share').onclick=async()=>{try{const f=file();if(navigator.canShare?.({files:[f]})){await navigator.share({files:[f],title:'Lernzeit-Termine'});handed();}else{download();}}catch(e){if(e.name!=='AbortError'){get('cal-export-followup').hidden=false;message('Teilen ist hier nicht möglich. Nutze „ICS herunterladen“.');}}};
 get('cal-export-download').onclick=download;
 get('cal-export-confirm').onclick=()=>{if(!handedOff)return;try{for(const e of batch)prefs.confirmed[e.calendarUid]=X.signature(e,prefs.before);persist();get('cal-export-dialog').close();toast('Übernahme bestätigt. Unveränderte Termine werden nicht erneut angeboten.');refresh();}catch{message('Bestätigung konnte nicht gespeichert werden. Browser-Speicher prüfen.');}};
 get('cal-export-later').onclick=()=>get('cal-export-dialog').close();
 get('cal-export-open').onclick=()=>open(false);get('cal-export-all').onclick=()=>open(true);
 function refresh(){const n=pending().length;get('cal-export-count').textContent=`${events().length} eigene Termine · ${n} neu oder geändert`;}
 get('cal-export-auto').checked=prefs.auto;get('cal-export-before').value=String(prefs.before);
 get('cal-export-auto').onchange=e=>{prefs.auto=e.target.checked;persist();};
 get('cal-export-before').onchange=e=>{prefs.before=Number(e.target.value);persist();refresh();};
 function auto(){refresh();if(!prefs.auto||!navigator.onLine||document.hidden||document.querySelector('dialog[open]'))return;const changes=pending();const sig=JSON.stringify(changes.map(e=>[e.calendarUid,X.signature(e,prefs.before)]));if(changes.length&&sig!==offered){offered=sig;open(false);}}
 function schedule(){clearTimeout(autoTimer);autoTimer=setTimeout(auto,800);}
 addEventListener('online',schedule);document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});addEventListener('lernzeit-data-changed',schedule);
 addEventListener('storage',e=>{if(e.key===KEY){if(get('cal-export-dialog').open)get('cal-export-dialog').close();schedule();}});
 schedule();
})();
