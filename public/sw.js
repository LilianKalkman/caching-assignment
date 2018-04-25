const STATIC_VERSION = 'static-v2';
const DYNAMIC_VERSION = 'dynamic';

self.addEventListener('install', function(event){
  console.log('[SW] installing', event);
  event.waitUntill(
    caches.open(STATIC_VERSION)
    .then(function(cache){
      console.log('pre-caching static');
      cache.addAll([
        '/',
        '/index.html',
        '/src/js/main.js',
        '/src/js/material.min.js',
        '/src/css/app.css',
        '/src/css/main.css',
        'https://fonts.googleapis.com/css?family=Roboto:400,700',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
      ]);
    })
  )
});

self.addEventListener('activate', function(event){
  console.log('[SW] activating', event);
  event.waitUntill(
    caches.keys()
    .then(function(keyList){
      return Promise.all(
        keyList.map(function(key){
          if(key !== STATIC_VERSION && key !== DYNAMIC_VERSION){
            console.log('[SW] removing key with old version');
            return caches.delete(key);
          }
        })
      )
    })
  )
  return self.clients.claim();
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request)
      .then(function(response){
        if(response){
          return response;
        } else {
          return fetch(event.request)
          .then(function(res){
            return caches.open(DYNAMIC_VERSION)
            .then(function(cache){
              cache.put(event.request.url, res.clone());
              return res;
            })
          });
        }
      })
      .catch(function(err){
        console.log(err);
      })
  );
})
