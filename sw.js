// Bump CACHE_VERSION whenever you change app files so installed copies refresh.
const CACHE_VERSION = "habit-tracker-v3";
const ASSETS = [
    "./",
    "index.html",
    "style.css",
    "app.js",
    "manifest.webmanifest",
    "icon-192.png",
    "icon-512.png",
    "apple-touch-icon.png"
];

self.addEventListener("install", event => {
    event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// Stale-while-revalidate: open instantly from cache, refresh in the background.
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            const network = fetch(event.request)
                .then(response => {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_VERSION).then(cache => cache.put(event.request, copy));
                    }
                    return response;
                })
                .catch(() => cached);

            return cached || network;
        })
    );
});
