(function(root){
'use strict';
function payload(events,before,target){
 return {version:1,ziel:target,termine:events.map(e=>{
  const start=new Date(e.date+'T'+(e.time||'09:00')+':00');
  let end=new Date((e.endDate||e.date)+'T'+(e.endTime||e.time||'09:00')+':00');
  if(!e.time){end.setDate(end.getDate()+1);end.setHours(0,0,0,0);}
  else if(end<=start)end=new Date(start.getTime()+3600000);
  const alarm=before>=0?new Date(start.getTime()-before*60000).toISOString():'';
  return {id:e.calendarUid,titel:e.title,start:start.toISOString(),ende:end.toISOString(),ganztags:!e.time,datum:e.date,enddatum:e.endDate||e.date,ort:e.place||'',notizen:'Termin: '+e.date+' '+(e.time||'ganztägig')+'\n'+(e.notes||'')+'\n[Lernzeit-ID: '+e.calendarUid+']',erinnerung:alarm,mitErinnerung:before>=0};
 })};
}
function url(target,data){const name=target==='calendar'?'Lernzeit Kalender':'Lernzeit Erinnerungen';return 'shortcuts://run-shortcut?name='+encodeURIComponent(name)+(data===null?'&input=clipboard':'&input=text&text='+encodeURIComponent(JSON.stringify(data)));}
const api={payload,url};root.ShortcutBridge=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
