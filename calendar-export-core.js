(function(root){
'use strict';
const esc=v=>String(v||'').replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
const stamp=t=>new Date(t).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
const compact=d=>d.replace(/-/g,'');
function nextDay(date){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10);}
function fold(line){let parts=[],part='',bytes=0;for(const ch of line){const n=new TextEncoder().encode(ch).length;if(bytes+n>75){parts.push(part);part=' ';bytes=1;}part+=ch;bytes+=n;}parts.push(part);return parts.join('\r\n');}
function signature(e,before){return JSON.stringify([e.title,e.date,e.endDate||e.date,e.time||'',e.endTime||'',e.place||'',e.notes||'',before]);}
function build(events,before=1440,versions={},now=Date.now()){
 if(![-1,0,60,1440,10080].includes(before))throw Error('Ungültige Erinnerungszeit.');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Lernzeit//Kalenderexport//DE','CALSCALE:GREGORIAN','X-WR-CALNAME:Lernzeit'];
 for(const e of events){
  if(!/^[a-zA-Z0-9-]{1,100}@lernzeit\.local$/.test(e.calendarUid))throw Error('Termin ohne gültige Kalenderkennung.');
  let start=new Date(e.date+'T'+(e.time||'09:00')+':00').getTime();
  lines.push('BEGIN:VEVENT','UID:'+e.calendarUid,'DTSTAMP:'+stamp(now),'SEQUENCE:'+(versions[e.calendarUid]?.sequence||0));
  if(e.time){let end=new Date((e.endDate||e.date)+'T'+(e.endTime||e.time)+':00').getTime();if(end<=start)end=start+3600000;lines.push('DTSTART:'+stamp(start),'DTEND:'+stamp(end));}
  else lines.push('DTSTART;VALUE=DATE:'+compact(e.date),'DTEND;VALUE=DATE:'+compact(nextDay(e.endDate||e.date)));
  lines.push('SUMMARY:'+esc(e.title),'LOCATION:'+esc(e.place),'DESCRIPTION:'+esc(e.notes),'STATUS:CONFIRMED');
  if(before>=0)lines.push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+esc('Erinnerung: '+e.title),'TRIGGER;VALUE=DATE-TIME:'+stamp(start-before*60000),'END:VALARM');
  lines.push('END:VEVENT');
 }
 lines.push('END:VCALENDAR');return lines.map(fold).join('\r\n')+'\r\n';
}
const api={build,signature,fold,nextDay};root.CalendarExport=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
