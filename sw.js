// sw.js
const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',           // 缓存首页
  'index.html',  // 缓存 HTML 文件
  'img/头像180.png',  // 缓存头像图片
  'img/头像icon32.ico',
  'img/头像icon16.ico'
  // 可以添加更多需要缓存的资源（CSS、JS 等）
];

// 安装 Service Worker 时缓存资源
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 拦截请求并返回缓存的资源
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 如果资源在缓存中，直接返回；否则从网络获取
        return response || fetch(event.request);
      })
  );
});

// 激活时清理旧缓存（可选）
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('my-') && cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});