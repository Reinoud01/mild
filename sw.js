const API = "https://wzsxhtgligpoxrmsrgax.supabase.co/functions/v1/mild";
const CACHE = "mild-v2";
const SCOPE = self.registration.scope;
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  const url = e.request.url;
  if (e.request.method !== "GET" || !url.startsWith(SCOPE)) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Mild", {
    body: d.body || "", icon: API + "/icon-180.png", badge: API + "/icon-180.png", tag: d.tag || "mild", data: { url: SCOPE + "index.html" }
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || SCOPE;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if (c.url.startsWith(SCOPE) && "focus" in c) return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
