'use strict';
(()=>{
 const STORE='lernzeit-push-v1',el=id=>document.getElementById(id);
 let settings={server:'',token:'',active:false,daily:true,time:'18:00',calendar:true,before:1440,lastSync:0};
 try{settings={...settings,...JSON.parse(localStorage.getItem(STORE)||'{}')};}catch{}
 let ready=null,busy=false,syncTimer=null,syncRunning=false,syncAgain=false;
 const supported=()=>isSecureContext&&'serviceWorker'in navigator&&'PushManager'in window&&'Notification'in window;
 function persist(){localStorage.setItem(STORE,JSON.stringify(settings));}
 function status(message){el('push-status').textContent=message;}
 function ui(){
  el('push-server-url').value=settings.server;
  el('push-daily').checked=settings.daily;el('push-time').value=settings.time;
  el('push-calendar').checked=settings.calendar;el('push-before').value=String(settings.before);
  el('push-enable').disabled=busy||!supported()||!ready||settings.active;
  el('push-test').disabled=busy||!settings.active;el('push-disable').disabled=busy||!settings.token;
  el('push-connect').disabled=busy||settings.active;
  el('push-server-url').disabled=settings.active;
  el('push-last-sync').textContent=settings.lastSync?'Letzter Abgleich: '+new Date(settings.lastSync).toLocaleString('de-DE'):'';
 }
 function base(value){const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash)throw Error('Bitte die HTTPS-Adresse deines Push-Dienstes eingeben.');return u.href.replace(/\/$/,'');}
 async function request(path,body,extra={}){
  const res=await fetch(settings.server+path,{method:body===undefined?'GET':'POST',headers:{...(body!==undefined?{'Content-Type':'application/json'}:{}),...(settings.token?{Authorization:'Bearer '+settings.token}:{}),...extra},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(15000),cache:'no-store'});
  const result=await res.json();if(!res.ok)throw Error(result.error||'Push-Dienst nicht erreichbar.');return result;
 }
 async function connect(){
  if(!supported()){status('Web-Push ist hier nicht verfügbar. Öffne die App über das Symbol auf deinem iPhone-Home-Bildschirm.');return;}
  busy=true;ready=null;ui();status('Verbindung wird geprüft …');
  try{const server=base(el('push-server-url').value);if(settings.token&&settings.server!==server)throw Error('Bitte die bisherige Verbindung zuerst ausschalten.');settings.server=server;const config=await request('/config');if(typeof config.publicKey!=='string'||!/^[\w-]{80,100}$/.test(config.publicKey))throw Error('Ungültige Antwort des Push-Dienstes.');
   const reg=await navigator.serviceWorker.register('./sw.js');
   const worker=reg.installing||reg.waiting;
   if(worker&&worker.state!=='activated')await new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(Error('App bitte schließen und erneut öffnen, um das Push-Update zu laden.')),15000);
    const check=()=>{if(worker.state==='installed')worker.postMessage({type:'ACTIVATE_PUSH_UPDATE'});if(worker.state==='activated'){clearTimeout(timeout);worker.removeEventListener('statechange',check);resolve();}if(worker.state==='redundant'){clearTimeout(timeout);reject(Error('App-Update fehlgeschlagen. Bitte neu laden.'));}};
    worker.addEventListener('statechange',check);check();
   });
   await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('Bitte die App schließen und erneut öffnen, damit das Update aktiv wird.')),15000))]);
   ready={reg,publicKey:config.publicKey};persist();status('Verbunden. Jetzt auf „Push aktivieren“ tippen und Mitteilungen erlauben.');
  }catch(e){status(e.message);}finally{busy=false;ui();}
 }
 const keyBytes=value=>Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
 el('push-connect').onclick=connect;
 el('push-enable').onclick=async()=>{
  if(!ready||busy)return;
  // Vor jedem await: iOS verlangt die unmittelbare Berührung des Buttons.
  const permission=Notification.permission==='default'?Notification.requestPermission():Promise.resolve(Notification.permission);
  busy=true;ui();let subscription;
  try{
   if(await permission!=='granted')throw Error('Mitteilungen sind nicht erlaubt. Aktiviere sie in den iPhone-Einstellungen für diese App.');
   subscription=await ready.reg.pushManager.getSubscription()||await ready.reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:keyBytes(ready.publicKey)});
   if(!settings.token){settings.token=crypto.randomUUID()+crypto.randomUUID();persist();}
   await request('/subscribe',{subscription:subscription.toJSON(),plan:PushPlan.payload(state,settings)},{'X-Pairing-Code':el('push-pairing').value.trim()});
   settings.active=true;settings.lastSync=Date.now();persist();el('push-pairing').value='';status('Push ist aktiviert. Sende jetzt eine Testnachricht.');
  }catch(e){status(e.message);}finally{busy=false;ui();}
 };
 async function sync(){
  if(!settings.active)return;
  if(syncRunning){syncAgain=true;return;}syncRunning=true;
  try{await request('/plan',{plan:PushPlan.payload(state,settings)});settings.lastSync=Date.now();persist();el('push-last-sync').textContent='Letzter Abgleich: '+new Date(settings.lastSync).toLocaleString('de-DE');status('Push aktiv. Erinnerungen sind abgeglichen.');}
  catch(e){status('Erinnerungen noch nicht aktualisiert: '+e.message+' Öffne die App mit Internet erneut.');}
  finally{syncRunning=false;if(syncAgain){syncAgain=false;sync();}}
 }
 el('push-save').onclick=async()=>{
  settings.daily=el('push-daily').checked;settings.time=el('push-time').value||'18:00';settings.calendar=el('push-calendar').checked;settings.before=Number(el('push-before').value);persist();status(settings.active?'Einstellungen gespeichert. Abgleich läuft …':'Einstellungen gespeichert. Push ist noch nicht aktiviert.');await sync();ui();
 };
 el('push-test').onclick=async()=>{busy=true;ui();try{await request('/test',{});status('Test an den Push-Dienst übergeben. Die Nachricht sollte gleich auf deinem Handy erscheinen.');}catch(e){status(e.message);}finally{busy=false;ui();}};
 el('push-disable').onclick=async()=>{
  busy=true;ui();try{await request('/unsubscribe',{});const reg=await navigator.serviceWorker.getRegistration();const sub=await reg?.pushManager.getSubscription();if(sub)await sub.unsubscribe();settings.active=false;settings.token='';settings.lastSync=0;persist();ready=null;status('Push ausgeschaltet. Die Erinnerungsdaten wurden beim Dienst gelöscht.');}catch(e){status('Ausschalten nicht abgeschlossen: '+e.message+' Versuche es mit Internet erneut.');}finally{busy=false;ui();}
 };
 addEventListener('lernzeit-data-changed',()=>{if(!settings.active)return;clearTimeout(syncTimer);syncTimer=setTimeout(sync,1500);});
 addEventListener('online',sync);addEventListener('storage',e=>{if(e.key===KEY)sync();});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync();});
 ui();status(!supported()?'Öffne die App auf dem Home-Bildschirm in einem Browser mit Web-Push-Unterstützung.':settings.active?'Push ist eingerichtet. Die Erinnerungsdaten werden abgeglichen.':'Noch nicht verbunden. Für Push wird ein eingerichteter Push-Dienst benötigt.');
 if(settings.active)sync();
})();
