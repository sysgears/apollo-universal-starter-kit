/*global self*/
self.addEventListener('install', function() {
  console.log('install');
});

self.addEventListener('activate', function() {
  console.log('activate');
});

self.addEventListener('fetch', function(event) {
  console.log('event', event);
});
