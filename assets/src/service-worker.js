var PAGES_CACHE_NAME = 'lighthouse-dashboard-cache--pages';
var API_CACHE_NAME = 'lighthouse-dashboard-cache--api';
var urlsToCache = [
    '/',
    '/dashboard',
    '/projects',
];

var urlRegex = [
    /\.(css|js|jpg)$/i,
    /\/(api.+)/gi,
];


function matchesUrlRegex(url) {
    return urlRegex.some((pattern) => {
        return pattern.test(url);
    });
}

function precheck(request) {
    return new Promise(function(resolve, reject) {
        const matches = matchesUrlRegex(request.url);
        if (!matches || request.method !== 'GET') {
            return resolve(request);
        }
        return reject();
    });
}

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(PAGES_CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// On serviceworker update, we remove all caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});


self.addEventListener('fetch', function(event) {
    event.respondWith(precheck(event)
        .then(function() {
            return fetch(event.request);
        })
        .then(function(resp) {
            // Check if we received a valid response
            if (!resp || resp.status !== 200 || resp.type !== 'basic') {
                return resp;
            }

            var responseToCache = resp.clone();

            caches.open(API_CACHE_NAME)
                // eslint-disable-next-line max-nested-callbacks
                .then(function(cache) {
                    cache.put(event.request, responseToCache);
                });

            return resp;
        })
        .catch(function() {
            return caches.match(event.request);
        })
    );
});
