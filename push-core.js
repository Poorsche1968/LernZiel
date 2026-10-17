/* Nur Erinnerungsdaten werden an den Push-Dienst übertragen. */
(function(root){
'use strict';
function payload(state,preferences,now=Date.now()){
 const due=[...state.decks.flatMap(d=>d.cards.map(c=>c.due||0)),...(state.workshops||[]).flatMap(w=>w.modules.flatMap((m,i)=>m.cards.map((c,j)=>w.progress.srs?.[`${i}-${j}`]?.due||(w.progress.due?.[`${i}-${j}`]?new Date(w.progress.due[`${i}-${j}`]+'T00:00:00').getTime():0))))];
 const reminders=preferences.calendar?(state.exams||[]).filter(e=>!e.done).map(e=>({id:e.id,title:e.title,at:new Date(e.date+'T'+(e.time||'09:00')+':00').getTime()-preferences.before*60000})).filter(e=>e.at>now&&e.at<now+366*86400000):[];
 return {daily:preferences.daily,time:preferences.time,zone:Intl.DateTimeFormat().resolvedOptions().timeZone,due:due.slice(0,50000),reminders};
}
root.PushPlan={payload};if(typeof module!=='undefined')module.exports=root.PushPlan;
})(globalThis);
