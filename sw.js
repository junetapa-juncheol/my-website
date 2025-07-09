// Service Worker for Junetapa IT Story
const CACHE_NAME = 'junetapa-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/experience-education.html',
  '/pages/experience-education-mobile.html',
  '/pages/jstudio.html',
  '/css/style.css',
  '/css/animations.css',
  '/css/responsive.css',
  '/js/main.js',
  '/js/gallery-main.js',
  '/js/gallery-styles.js',
  '/assets/images/common/favicon.png',
  '/assets/images/common/Profile_image.png',
  '/assets/images/common/Quick_Info.png',
  '/manifest.json'
];

// Service Worker 설치
self.addEventListener('install', event => {
  console.log('Service Worker 설치 중...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('캐시 열기 성공');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('캐시 추가 실패:', error);
      })
  );
});

// Service Worker 활성화
self.addEventListener('activate', event => {
  console.log('Service Worker 활성화');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('이전 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', event => {
  // GET 요청만 처리
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 있으면 캐시에서 반환
        if (response) {
          return response;
        }

        // 없으면 네트워크에서 가져오기
        return fetch(event.request).then(
          response => {
            // 유효한 응답인지 확인
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답을 복제하여 캐시에 저장
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(error => {
        console.error('Fetch 실패:', error);
        
        // 오프라인 시 기본 페이지 반환
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// 백그라운드 동기화
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('백그라운드 동기화 실행');
    // 필요시 백그라운드 작업 수행
  }
});

// 푸시 알림 처리
self.addEventListener('push', event => {
  console.log('푸시 메시지 수신:', event);
  
  const options = {
    body: event.data ? event.data.text() : '새로운 알림이 있습니다.',
    icon: '/assets/images/common/favicon.png',
    badge: '/assets/images/common/favicon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/assets/images/common/favicon.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/assets/images/common/favicon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Junetapa IT Story', options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', event => {
  console.log('알림 클릭됨:', event);
  event.notification.close();

  if (event.action === 'explore') {
    // 특정 페이지로 이동
    event.waitUntil(
      clients.openWindow('/pages/experience-education-mobile.html')
    );
  } else if (event.action === 'close') {
    // 알림만 닫기
    console.log('알림 닫기');
  } else {
    // 기본 동작: 메인 페이지로 이동
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// 앱 설치 배너 처리
self.addEventListener('beforeinstallprompt', event => {
  console.log('앱 설치 프롬프트 준비');
  event.preventDefault();
  
  // 나중에 사용하기 위해 이벤트 저장
  self.deferredPrompt = event;
  
  // 사용자에게 설치 옵션 표시
  return false;
});

// 앱 설치 완료 처리
self.addEventListener('appinstalled', event => {
  console.log('PWA 앱 설치 완료');
  
  // 설치 완료 이벤트 전송
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'APP_INSTALLED',
        message: 'PWA 앱이 성공적으로 설치되었습니다!'
      });
    });
  });
});

// 에러 처리
self.addEventListener('error', event => {
  console.error('Service Worker 에러:', event.error);
});

// 처리되지 않은 프로미스 거부 처리
self.addEventListener('unhandledrejection', event => {
  console.error('처리되지 않은 프로미스 거부:', event.reason);
});

// 캐시 정리 함수
function cleanupCaches() {
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7일
  const now = Date.now();

  caches.open(CACHE_NAME).then(cache => {
    cache.keys().then(requests => {
      requests.forEach(request => {
        cache.match(request).then(response => {
          if (response) {
            const cachedDate = new Date(response.headers.get('date')).getTime();
            if (now - cachedDate > maxAge) {
              cache.delete(request);
              console.log('오래된 캐시 삭제:', request.url);
            }
          }
        });
      });
    });
  });
}

// 주기적으로 캐시 정리 실행
setInterval(cleanupCaches, 24 * 60 * 60 * 1000); // 24시간마다 