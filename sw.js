// sw.js — Service Worker: แคชไฟล์แอปไว้ใช้งานออฟไลน์
// เปลี่ยน CACHE_VERSION ทุกครั้งที่แก้ไฟล์ในแอป เพื่อให้ผู้ใช้ได้เวอร์ชันใหม่
const CACHE_VERSION = 'myday-v1.1.0';

const APP_SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/storage.js',
  'js/expenses.js',
  'js/habits.js',
  'js/todos.js',
  'js/notes.js',
  'js/app.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-64.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: ตอบจากแคชทันที แล้วอัปเดตแคชเบื้องหลัง
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_VERSION).then(async (cache) => {
      const cacheKey = req.mode === 'navigate' ? 'index.html' : req;
      const cached = await cache.match(cacheKey, { ignoreSearch: true });
      const network = fetch(req)
        .then(res => {
          if (res && res.ok) cache.put(cacheKey, res.clone());
          return res;
        })
        .catch(() => cached);
      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      return network;
    })
  );
});
