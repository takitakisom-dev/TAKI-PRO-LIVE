const CACHE_NAME='taki-pro-live-v2-7-fix-2';
const urlsToCache=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urlsToCache)));
  self.skipWaiting();
});
self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>{
      if(e.request.destination==='document') return caches.match('./index.html');
    }))
  );
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(ns=>Promise.all(ns.map(n=>{
      if(n!==CACHE_NAME) return caches.delete(n);
    })))
  );
  self.clients.claim();
});
