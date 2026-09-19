const CACHE_NAME = 'qingying-plan-v2';
const APP_SHELL = [
  './login.html',
  './index.html',
  './meal-plan.html',
  './daily-plan.html',
  './exercise.html',
  './profile.html',
  './recipes.html',
  './recipe-detail.html',
  './app.css',
  './app.js',
  './manifest.webmanifest',
  './app-icon-180.png',
  './app-icon-192.png',
  './app-icon-512.png',
  './app-icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
