// Keeps a copy of the admin page (and its sign-in library) on the device so
// wheelerfs.com/admin opens with no signal. With a connection the newest
// version is always fetched first; the saved copy is used after a few seconds
// without an answer.
const CACHE = 'wfs-admin-v2';
const FILES = ['./', './supabase.js'];
const WAIT_MS = 4000;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;   // API calls go straight to Supabase
  const scope = new URL(self.registration.scope).pathname;
  if (!url.pathname.startsWith(scope)) return;
  const key = url.pathname === scope || url.pathname === scope + 'index.html' ? './' : e.request;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // Always the newest copy: the extra query gets past GitHub's server cache, no-store past the browser's.
    const fresh = new URL(url); fresh.searchParams.set('fresh', Date.now());
    const network = fetch(fresh, { cache: 'no-store', credentials: 'same-origin' }).then(res => {
      if (res.ok) cache.put(key, res.clone());
      return res;
    });
    const timeout = new Promise(resolve => setTimeout(resolve, WAIT_MS));
    try {
      const res = await Promise.race([network, timeout]);
      if (res) return res;
    } catch { /* offline */ }
    const saved = await cache.match(key, { ignoreSearch: true });
    return saved || network;
  })());
});
