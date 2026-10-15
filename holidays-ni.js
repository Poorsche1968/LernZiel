(function(root){
'use strict';
// Official Niedersachsen school calendar, checked 2026-10-15:
// https://www.mk.niedersachsen.de/download/190058/Ferienuebersicht_2024_bis_2030.pdf
// Both endpoints are inclusive. Christmas ranges cross calendar years.
const ranges=[
 ['Weihnachtsferien','2024-12-23','2025-01-04'],
 ['Halbjahresferien','2025-02-03','2025-02-04'],['Osterferien','2025-04-07','2025-04-19'],
 ['Schulfrei · Kirchentag','2025-04-30'],['Schulfrei · nach dem 1. Mai','2025-05-02'],['Schulfrei · nach Himmelfahrt','2025-05-30'],['Pfingstferien','2025-06-10'],
 ['Sommerferien','2025-07-03','2025-08-13'],['Herbstferien','2025-10-13','2025-10-25'],['Weihnachtsferien','2025-12-22','2026-01-05'],
 ['Halbjahresferien','2026-02-02','2026-02-03'],['Osterferien','2026-03-23','2026-04-07'],['Schulfrei · nach Himmelfahrt','2026-05-15'],['Pfingstferien','2026-05-26'],
 ['Sommerferien','2026-07-02','2026-08-12'],['Herbstferien','2026-10-12','2026-10-24'],['Weihnachtsferien','2026-12-23','2027-01-09'],
 ['Halbjahresferien','2027-02-01','2027-02-02'],['Osterferien','2027-03-22','2027-04-03'],['Schulfrei · nach Himmelfahrt','2027-05-07'],['Pfingstferien','2027-05-18'],
 ['Sommerferien','2027-07-08','2027-08-18'],['Herbstferien','2027-10-16','2027-10-30'],['Weihnachtsferien','2027-12-23','2028-01-08'],
 ['Halbjahresferien','2028-01-31','2028-02-01'],['Osterferien','2028-04-10','2028-04-22'],['Schulfrei · nach Himmelfahrt','2028-05-26'],['Pfingstferien','2028-06-06'],
 ['Sommerferien','2028-07-20','2028-08-30'],['Schulfrei · vor dem 3. Oktober','2028-10-02'],['Herbstferien','2028-10-23','2028-11-04'],['Weihnachtsferien','2028-12-27','2029-01-06'],
 ['Halbjahresferien','2029-02-01','2029-02-02'],['Osterferien','2029-03-19','2029-04-03'],['Schulfrei · vor dem 1. Mai','2029-04-30'],['Schulfrei · nach Himmelfahrt','2029-05-11'],['Pfingstferien','2029-05-22'],
 ['Sommerferien','2029-07-19','2029-08-29'],['Schulfrei · nach dem 3. Oktober','2029-10-04','2029-10-05'],['Herbstferien','2029-10-22','2029-11-02'],['Weihnachtsferien','2029-12-21','2030-01-05'],
 ['Halbjahresferien','2030-01-31','2030-02-01'],['Osterferien','2030-04-08','2030-04-23'],['Schulfrei · nach Himmelfahrt','2030-05-31'],['Pfingstferien','2030-06-11'],['Sommerferien','2030-07-11','2030-08-21']
].map(([title,start,end=start])=>({title,start,end,kind:'vacation'}));
const key=d=>d.toISOString().slice(0,10),cache=new Map();
function holidays(year){
 if(cache.has(year))return cache.get(year);
 // Gregorian Easter (Meeus/Jones/Butcher); UTC avoids daylight-saving offsets.
 const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),n=h+l-7*m+114;
 const easter=new Date(Date.UTC(year,Math.floor(n/31)-1,n%31+1));
 const list=[['Neujahr',`${year}-01-01`],['Tag der Arbeit',`${year}-05-01`],['Tag der Deutschen Einheit',`${year}-10-03`],['Reformationstag',`${year}-10-31`],['1. Weihnachtstag',`${year}-12-25`],['2. Weihnachtstag',`${year}-12-26`]];
 for(const [title,offset] of [['Karfreitag',-2],['Ostermontag',1],['Christi Himmelfahrt',39],['Pfingstmontag',50]]){const date=new Date(easter);date.setUTCDate(date.getUTCDate()+offset);list.push([title,key(date)]);}
 const result=list.map(([title,start])=>({title,start,end:start,kind:'holiday'}));cache.set(year,result);return result;
}
function forDate(date){const year=Number(date.slice(0,4));return [...(year>=2025&&year<=2100?holidays(year).filter(h=>h.start===date):[]),...ranges.filter(r=>r.start<=date&&r.end>=date)];}
const api={ranges,holidays,forDate,coverageStart:'2025-01-01',coverageEnd:'2030-08-21'};
if(typeof module!=='undefined')module.exports=api;root.NiedersachsenCalendar=api;
})(globalThis);
