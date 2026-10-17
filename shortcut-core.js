/* Textformat für den angepassten Apple-Galerie-Kurzbefehl. */
(function(root){
'use strict';
const clean=v=>String(v||'').replace(/\|/g,'｜').replace(/[\r\n\t]+/g,' ').trim();
function text(events,before){
 if(![-1,0,60,1440,10080].includes(before))throw Error('Ungültige Erinnerungszeit.');
 return events.map(e=>{
  const start=new Date(e.date+'T'+(e.time||'09:00')+':00');
  const alarm=before<0?'KEINE':new Date(start.getTime()-before*60000).toISOString();
  const notes=`Termin: ${e.date} ${e.time||'ganztägig'}; Ort: ${e.place||'–'}; ${e.notes||''} [Lernzeit-ID: ${e.calendarUid}]`;
  return [clean(e.title),alarm,clean(notes)].join('|');
 }).join('\n');
}
function url(data){return 'shortcuts://run-shortcut?name='+encodeURIComponent('Lernzeit Erinnerungen')+(data===null?'&input=clipboard':'&input=text&text='+encodeURIComponent(data));}
const api={text,url};root.ShortcutBridge=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
