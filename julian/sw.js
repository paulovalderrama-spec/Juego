// Service worker: caché para uso sin conexión + alarma de mejor esfuerzo en segundo plano.
const CACHE = 'julian-v1';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', './icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});

// ── Alarma de próxima toma ──
// Los navegadores no ofrecen notificaciones programadas sin servidor; mientras el SW siga vivo
// (Android suele mantenerlo un rato tras cerrar la app) estos temporizadores disparan el aviso.
let timers = [];
function clearTimers() { timers.forEach(clearTimeout); timers = []; }
async function notify(title, body) {
  await self.registration.showNotification(title, {
    body, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'julian-feed', renotify: true,
    vibrate: [300, 120, 300, 120, 500], requireInteraction: true
  });
  const cs = await self.clients.matchAll({ includeUncontrolled: true });
  cs.forEach(c => c.postMessage({ type: 'fired' }));
}
self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type !== 'schedule') return;
  clearTimers();
  if (!d.enabled || !d.due) return;
  const now = Date.now();
  const fmt = t => { const x = new Date(t); return String(x.getHours()).padStart(2, '0') + ':' + String(x.getMinutes()).padStart(2, '0'); };
  if (d.pre > 0 && !d.already.pre) {
    const at = d.due - d.pre * 60000;
    if (at > now) timers.push(setTimeout(() => notify(d.name + ' come en ' + d.pre + ' min', 'Próxima toma a las ' + fmt(d.due) + '. Le toca la ' + d.side + '.'), at - now));
  }
  if (!d.already.due && d.due > now) {
    timers.push(setTimeout(() => notify('¡Hora de comer! 🍼', d.name + ' debe comer ahora. Empieza por la ' + d.side + '.'), d.due - now));
  }
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const c = cs.find(x => 'focus' in x); if (c) return c.focus();
    return self.clients.openWindow('./');
  }));
});
