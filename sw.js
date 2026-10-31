// Nix Calc service worker: network-first for this site's own files, so updates appear right away.
// Price services (other domains) are never cached, so prices are always live.
var C='nix-shell-v1';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(C).then(function(c){return c.addAll(['./','index.html','logo.png','icon-192.png'])}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r).then(function(res){
    var copy=res.clone();caches.open(C).then(function(c){c.put(r,copy)});return res;
  }).catch(function(){return caches.match(r).then(function(m){return m||caches.match('index.html')})}));
});
