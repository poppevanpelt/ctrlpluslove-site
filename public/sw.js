// LEGACY SERVICE WORKER RETIREMENT 2026-09-20 / v2
self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    (async function () {
      await self.clients.claim();

      const keys = await caches.keys();
      await Promise.all(keys.map(function (key) {
        return caches.delete(key);
      }));

      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      await self.registration.unregister();

      await Promise.all(
        clients.map(function (client) {
          return client.navigate(client.url);
        })
      );
    })()
  );
});
