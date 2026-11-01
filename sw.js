// Argus Zero service worker — bump AZ_CACHE on every release so phones pick up the new build.
var AZ_CACHE = 'argus-zero-v3';
var AZ_FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(AZ_CACHE).then(function(c){ return c.addAll(AZ_FILES); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ return k === AZ_CACHE ? null : caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function(resp){
      var copy = resp.clone();
      caches.open(AZ_CACHE).then(function(c){ c.put(e.request, copy); });
      return resp;
    }).catch(function(){ return caches.match(e.request, { ignoreSearch: true }); })
  );
});
