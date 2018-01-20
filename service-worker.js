let mainCache;
self.oninstall = event => {
    event.waitUntil(
        Promise.all([
            self.skipWaiting(),
            caches.open('Main').then(cache => {
                mainCache = cache;
            })
        ])
    );
};
self.onactivate = event => {
    event.waitUntil(
        self.clients.claim()
    );
};
self.onfetch = event => {
    let request = event.request;
    let url = new URL(request.url);
    let pathname = url.pathname;
    if(pathname === '/') {
        request = new Request('/main.html');
    }
    event.respondWith(
        caches.match(request).then(response => {
            return response || fetch(request.clone()).then(response => {
                mainCache.put(request, response.clone());
                return response;
            });
        })
    );
};
