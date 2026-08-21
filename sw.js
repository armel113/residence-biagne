// ─────────────────────────────────────────────────────────────
// Résidence Biagné — mise en cache de l'application
//
// But : que l'app s'ouvre même sans réseau. Les données (clients,
// dépenses) sont gérées séparément par la mémoire locale de Firebase.
//
// Règle appliquée :
//  - les pages HTML : on essaie TOUJOURS le réseau d'abord, pour que
//    une nouvelle version publiée sur GitHub arrive immédiatement ;
//    le cache ne sert que si le réseau ne répond pas.
//  - les icônes et le manifeste : servis depuis le cache, plus rapides.
// ─────────────────────────────────────────────────────────────

const CACHE = 'rb-v1';
const FICHIERS = [
  './',
  './index.html',
  './checkin.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './logo-it.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(FICHIERS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // On ne touche jamais aux appels Firebase, Google ou Anthropic.
  if (url.origin !== self.location.origin) return;

  const estPage = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (estPage) {
    // Réseau d'abord : une mise à jour publiée est vue tout de suite.
    e.respondWith(
      fetch(req)
        .then(rep => {
          const copie = rep.clone();
          caches.open(CACHE).then(c => c.put(req, copie)).catch(() => {});
          return rep;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Images, manifeste : cache d'abord.
  e.respondWith(
    caches.match(req).then(r => r || fetch(req).then(rep => {
      const copie = rep.clone();
      caches.open(CACHE).then(c => c.put(req, copie)).catch(() => {});
      return rep;
    }))
  );
});
