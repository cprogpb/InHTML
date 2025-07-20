// sw.js
const CACHE_NAME = 'my-site-cache-v1';

// 动态获取仓库名前缀（如果有）
const repoPrefix = self.location.pathname.split('/')[1];
const baseUrl = repoPrefix ? `/${repoPrefix}` : '';

const urlsToCache = [
  `${baseUrl}/`,
  `${baseUrl}/index.html`,
  `${baseUrl}/img/头像180.png`,
  `${baseUrl}/img/头像icon32.ico`,
  `${baseUrl}/img/头像icon16.ico`
];

// 安装时缓存资源（带错误处理）
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache with prefix:', baseUrl);
        return Promise.all(
          urlsToCache.map(url => {
            return fetch(url)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch ${url}`);
                }
                return cache.put(url, response);
              })
              .catch(err => console.error(`Failed to cache ${url}:`, err));
          })
        );
      })
  );
});

// 拦截请求并返回缓存资源
self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);
  
  // 只处理同源请求
  if (requestUrl.origin !== self.origin) {
    return;
  }
  
  // 构建带前缀的请求路径
  const cacheKey = requestUrl.pathname.startsWith(baseUrl) 
    ? requestUrl.pathname 
    : `${baseUrl}${requestUrl.pathname}`;
  
  event.respondWith(
    caches.match(cacheKey)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});

// 激活时清理旧缓存
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
