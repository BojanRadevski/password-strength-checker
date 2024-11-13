const CACHE_NAME = "hacker-news-cache-v2";
let ASSETS_TO_CACHE = ["/", "/index.html"];

/**
 * The env variables are sent to this event from the main.js since they cant be accessed through  this directory
 */
self.addEventListener("message", (event) => {
  if (event.data && event.data.env === "production") {
    ASSETS_TO_CACHE = [
      "/",
      "/index.html",
      "/css/app.3b282f01.css",
      "/js/app.0da213bd.js",
      "/js/chunk-vendors.53326599.js",
      "/favicon.ico",
      "/assets/logo.png",
    ];
    console.log("Service Worker in Production Mode");
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log("Caching static assets", ASSETS_TO_CACHE);
        return cache.addAll(ASSETS_TO_CACHE);
      })
    );
  } else {
    console.log("Service Worker in Development Mode");
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

/**
 * This is an event listener that basically intercepts all fetch calls and checks if the
 * request url has v0 in it if it does it caches the response of the api
 */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (event.request.url.includes("/v0/")) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === "document") {
            return caches.match("/offline.html");
          }
        });
    })
  );
});
