const CACHE='taki-pro-live-v28';
const FILES=['./','./index.html','./manifest.json','./agenda.html'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>{if(k!==CACHE)return caches.delete(k)}))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./index.html'))));
});
