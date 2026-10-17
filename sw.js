const CACHE='lernzeit-v15';const FILES=['./','./index.html','./style.css','./shortcut-core.js','./KURZBEFEHLE.html','./calendar-export-core.js','./calendar-export.js','./srs.js','./core.js','./app.js','./importer.js','./calendar.js','./holidays-ni.js','./workshop-core.js','./workshop.js','./icon.svg','./icon.png','./manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('lernzeit-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(/^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(r=>{caches.open(CACHE).then(c=>c.put(event.request,r.clone())).catch(()=>{});return r;})));return;}if(url.origin!==self.location.origin)return;event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(hit=>hit||(event.request.mode==='navigate'?caches.match('./index.html'):Response.error()))));});

// Jede Push-Nachricht erzeugt eine sichtbare Mitteilung (auch unter iOS).
self.addEventListener('push',event=>{
 let data={};try{data=event.data?.json()||{};}catch{}
 const fallback=new URL('./#lernen',self.registration.scope).href;
 let target=fallback;try{const u=new URL(data.url||fallback);if(u.origin===self.location.origin&&u.pathname.startsWith(new URL(self.registration.scope).pathname))target=u.href;}catch{}
 event.waitUntil(self.registration.showNotification(String(data.title||'Lernzeit').slice(0,120),{
  body:String(data.body||'Zeit für deine Lernrunde.').slice(0,500),
  icon:new URL('./icon.png',self.registration.scope).href,
  tag:String(data.tag||'lernzeit').slice(0,180),data:{url:target}
 }));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const target=event.notification.data?.url||new URL('./#lernen',self.registration.scope).href;
 event.waitUntil((async()=>{
  const windows=await clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of windows){if(client.url.startsWith(self.registration.scope)){await client.navigate(target);await client.focus();return;}}
  await clients.openWindow(target);
 })());
});

self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_PUSH_UPDATE')event.waitUntil(self.skipWaiting());});
