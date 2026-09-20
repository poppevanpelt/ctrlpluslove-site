// LEGACY SERVICE WORKER RETIREMENT 2026-09-20 / FINAL
self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    (async function () {
      const keys = await caches.keys();
      await Promise.all(
        keys.map(function (key) {
          return caches.delete(key);
        })
      );

      await self.registration.unregister();
    })()
  );
});
