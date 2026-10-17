/* Gemeinsamer, vereinfachter Wiederholungsplaner (kein Anki-FSRS). */
(function(root){
'use strict';
const DAY=86400000, grades=['again','hard','good','easy'];
function validate(s){
 if(!s||!['learning','review'].includes(s.phase)||!Number.isSafeInteger(s.due)||s.due<0||!Number.isFinite(s.interval)||s.interval<0||s.interval>36500||!Number.isFinite(s.ease)||s.ease<1.3||s.ease>4||!Number.isSafeInteger(s.reviews)||s.reviews<0||!Number.isSafeInteger(s.lapses)||s.lapses<0)throw Error('Ungültiger Wiederholungsplan.');
 return {phase:s.phase,due:s.due,interval:s.interval,ease:s.ease,reviews:s.reviews,lapses:s.lapses};
}
function legacy(due=0,reviews=0){return {phase:reviews?'review':'learning',due:due||0,interval:reviews?1:0,ease:2.5,reviews,lapses:0};}
function next(old,grade,now=Date.now()){
 if(!grades.includes(grade))throw Error('Ungültige Bewertung.');
 const s=validate(old||legacy()), review=s.phase==='review';let delay;
 if(grade==='again'){s.phase='learning';s.interval=0;delay=60000;s.lapses+=review?1:0;s.ease=Math.max(1.3,s.ease-.2);}
 else if(!review){if(grade==='hard'){delay=600000;}else{s.phase='review';s.interval=grade==='easy'?4:1;delay=s.interval*DAY;}}
 else{const base=Math.max(1,s.interval),hard=Math.max(base+1,Math.round(base*1.2)),good=Math.max(hard+1,Math.round(base*s.ease));s.interval=Math.min(36500,grade==='hard'?hard:grade==='good'?good:Math.max(good+1,Math.round(base*s.ease*1.3)));s.ease=Math.max(1.3,Math.min(4,s.ease+(grade==='hard'?-.15:grade==='easy'?.15:0)));delay=s.interval*DAY;}
 s.due=now+delay;s.reviews++;return s;
}
const label=(s,g)=>{const delay=next(s,g,0).due;return delay<DAY?Math.round(delay/60000)+' Min.':Math.round(delay/DAY)+' Tage';};
const field=v=>'"'+String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\r\n?|\n/g,'<br>').replace(/\t/g,'    ').replace(/"/g,'""')+'"';
function anki(rows){return '#separator:Tab\n#html:true\n#deck column:3\n#columns:Vorderseite\tRückseite\tStapel\n'+rows.map(r=>[field(r.q),field(r.a),'"'+String(r.deck).replace(/[\r\n\t]/g,' ').replace(/"/g,'""')+'"'].join('\t')).join('\n')+'\n';}
function download(rows,title){if(!rows.length){alert('Keine Karteikarten zum Exportieren vorhanden.');return;}const url=URL.createObjectURL(new Blob([anki(rows)],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=(title.replace(/[^\p{L}\p{N}_-]/gu,'_')||'Karten')+'-Anki.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
const api={validate,legacy,next,label,anki,download,grades};root.CardSRS=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
