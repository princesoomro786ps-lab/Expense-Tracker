const CACHE='exp-v3';
const ASSETS=['./','./index.html','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.hostname==='cdnjs.cloudflare.com'){
    e.respondWith(caches.open(CACHE).then(async c=>{const h=await c.match(e.request);if(h)return h;const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}));
    return;
  }
  if(u.origin===location.origin){
    e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{if(r.ok){const k=r.clone();caches.open(CACHE).then(c=>c.put(e.request,k))}return r})
      .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
  }
});
