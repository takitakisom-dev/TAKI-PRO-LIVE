const CACHE_NAME='taki-pro-live-v3-ultimate-10-temas-bkp-vs-playback';
const urlsToCache=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urlsToCache)).catch(err=>console.log('Cache fail',err)));
  self.skipWaiting();
});
self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(r=>{
      if(r) return r;
      return fetch(e.request).then(resp=>{
        if(e.request.url.includes('qrcode') || e.request.url.includes('github')){
          let clone=resp.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(e.request, clone));
        }
        return resp;
      }).catch(()=>{
        if(e.request.destination==='document') return caches.match('./index.html');
        if(e.request.url.includes('manifest')) return caches.match('./manifest.json');
      });
    })
  );
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(ns=>Promise.all(ns.map(n=>{
      if(n!==CACHE_NAME){
        console.log('Removendo cache antigo',n);
        return caches.delete(n);
      }
    })))
  );
  self.clients.claim();
});
self.addEventListener('message',e=>{
  if(e.data && e.data.type==='SKIP_WAITING'){self.skipWaiting();}
});
