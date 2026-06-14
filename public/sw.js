self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    Promise.all([
      self.registration.unregister(),
      caches.keys().then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            return caches.delete(key);
          })
        );
      }),
      self.clients.matchAll().then(function (clients) {
        return Promise.all(
          clients.map(function (client) {
            return client.navigate(client.url);
          })
        );
      }),
    ])
  );
});
