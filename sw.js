const CACHE = 'v1';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/app.js',
        '/gemini.js',
        '/dglab.js',
        '/achievements.js',
        'https://cdn.jsdelivr.net/npm/winwheel@1.0.1/Winwheel.min.js'
      ])
    )
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
