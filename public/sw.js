// Минимальный Service Worker для регистрации приложения
const CACHE_NAME = "ingphrase-v1";

// Установка service worker
self.addEventListener("install", (event) => {
	console.log("Service Worker: Installing...");
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("Service Worker: Cache opened");
			return cache;
		})
	);
});

// Активация service worker
self.addEventListener("activate", (event) => {
	console.log("Service Worker: Activating...");
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						console.log("Service Worker: Deleting old cache", cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

// Перехват fetch запросов
self.addEventListener("fetch", (event) => {
	// Для API запросов используем network-first стратегию
	if (event.request.url.includes("/api/")) {
		event.respondWith(
			fetch(event.request).catch(() => {
				return caches.match(event.request);
			})
		);
		return;
	}

	// Для остальных запросов используем cache-first стратегию
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});
