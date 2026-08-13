const CACHE_NAME = "hris-v2";

const urlsToCache = [
    "/",
    "/build/assets/app.js",
    "/build/assets/app.css"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});