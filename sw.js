// WordMaster Pro - Service Worker
// Version 2.0.0 - Professional ESL Learning Platform

const CACHE_NAME = 'toeic-master-pro-v3.0.0';
const DATA_CACHE_NAME = 'toeic-data-v3.0.0';

// Files to cache for offline use
const FILES_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './favicon.ico',
    // './assets/css/style.css', // Removed - file doesn't exist
    './assets/css/tailwind-custom.css',
    './assets/js/app.js',
    './assets/js/game-engine.js',
    './assets/js/ui-manager.js',
    './assets/js/data-manager.js',
    './assets/js/pwa.js',
    './assets/js/error-boundary.js',
    './assets/js/mobile-optimization.js',
    './assets/js/performance-optimizer.js',
    './assets/js/answer-feedback.js',
    './assets/js/initialization-manager.js',
    './assets/js/unified-data-layer.js',
    './assets/js/real-time-monitor.js',
    './assets/js/spaced-repetition.js',
    './assets/js/audio-system.js',
    './assets/js/advanced-analytics.js',
    // './assets/js/gamification-system.js', // Removed - file deleted
    './assets/js/enhanced-progress.js',
    './assets/js/adaptive-learning.js',
    // './assets/js/progress-dashboard.js', // Removed - file doesn't exist
    './assets/js/settings-panel.js',
    './assets/js/toeic-vocabulary-system.js',
    './assets/js/toeic-reading-system.js',
    // './assets/js/toeic-listening-system.js', // Removed - file deleted
    './assets/js/toeic-test-simulator.js',
    // './assets/js/toeic-study-strategies.js', // Removed - not used
    // './assets/js/toeic-progress-analytics.js', // Removed - not used
    // './assets/data/words.csv', // Removed - not used
    // './assets/data/vocabulary_complete.csv', // Removed - not used
    // './assets/data/student_practice_vocabulary.csv', // Removed - file doesn't exist
    './assets/data/toeic_vocabulary.csv',
    './assets/icons/icon-72.png',
    './assets/icons/icon-96.png',
    './assets/icons/icon-128.png',
    './assets/icons/icon-144.png',
    './assets/icons/icon-152.png',
    './assets/icons/icon-192.png',
    './assets/icons/icon-384.png',
    './assets/icons/icon-512.png',
    './assets/icons/vocab-icon.png',
    './assets/icons/reading-icon.png',
    './assets/icons/test-icon.png',
    './assets/screenshots/desktop-home.png',
    './assets/screenshots/mobile-toeic.png',
    // './assets/images/students-learning.jpg', // Removed - not used
    // API files removed - directory doesn't exist
    // External resources
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap',
    'https://unpkg.com/lucide@latest/dist/umd/lucide.js'
];

// Data URLs for dynamic caching
const DATA_URLS = [
    './api/progress.json',
    './api/statistics.json',
    './api/achievements.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    
    event.waitUntil(
        Promise.all([
            // Cache app shell
            caches.open(CACHE_NAME).then((cache) => {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(FILES_TO_CACHE);
            }),
            // Cache data
            caches.open(DATA_CACHE_NAME).then((cache) => {
                console.log('[ServiceWorker] Caching data');
                return cache.addAll(DATA_URLS);
            })
        ])
    );
    
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
                        console.log('[ServiceWorker] Removing old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Take control of all clients
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    console.log('[ServiceWorker] Fetch', event.request.url);
    
    // Handle API requests separately
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        // If the response is valid, clone and cache it
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(() => {
                        // If network fails, try to get from cache
                        return cache.match(event.request);
                    });
            })
        );
        return;
    }
    
    // Handle app shell requests
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached version or fetch from network
            return response || fetch(event.request).catch(() => {
                // If both cache and network fail, return offline page for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

// Background sync for data updates
self.addEventListener('sync', (event) => {
    console.log('[ServiceWorker] Background Sync', event.tag);
    
    if (event.tag === 'background-sync-progress') {
        event.waitUntil(syncProgress());
    }
    
    if (event.tag === 'background-sync-achievements') {
        event.waitUntil(syncAchievements());
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    console.log('[ServiceWorker] Push Received', event);
    
    const options = {
        body: event.data ? event.data.text() : 'New vocabulary challenge available!',
        icon: './assets/icons/icon-192.png',
        badge: './assets/icons/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        actions: [
            {
                action: 'explore',
                title: 'Start Learning',
                icon: './assets/icons/play-icon.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: './assets/icons/close-icon.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('WordMaster Pro', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('[ServiceWorker] Notification click Received');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        // Open the app and navigate to a specific game
        event.waitUntil(
            clients.openWindow('./?source=notification')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        event.notification.close();
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('./')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    console.log('[ServiceWorker] Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_WORDS') {
        event.waitUntil(
            cacheWordsData(event.data.words)
        );
    }
    
    if (event.data && event.data.type === 'GET_CACHE_SIZE') {
        event.waitUntil(
            getCacheSize().then((size) => {
                event.ports[0].postMessage({ cacheSize: size });
            })
        );
    }
});

// Helper functions
async function syncProgress() {
    try {
        // Get stored progress data
        const progressData = await getStoredData('progress');
        if (progressData) {
            // Send to server when online
            const response = await fetch('./api/progress.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(progressData)
            });
            
            if (response.ok) {
                // Clear stored data after successful sync
                await clearStoredData('progress');
            }
        }
    } catch (error) {
        console.log('[ServiceWorker] Progress sync failed', error);
    }
}

async function syncAchievements() {
    try {
        const achievementData = await getStoredData('achievements');
        if (achievementData) {
            const response = await fetch('./api/achievements.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(achievementData)
            });
            
            if (response.ok) {
                await clearStoredData('achievements');
            }
        }
    } catch (error) {
        console.log('[ServiceWorker] Achievement sync failed', error);
    }
}

async function cacheWordsData(words) {
    const cache = await caches.open(DATA_CACHE_NAME);
    const response = new Response(JSON.stringify(words), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=86400' // 24 hours
        }
    });
    await cache.put('/api/words', response);
}

async function getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
    }
    
    return totalSize;
}

async function getStoredData(key) {
    // This would typically use IndexedDB for larger data
    return new Promise((resolve) => {
        // Placeholder implementation
        resolve(null);
    });
}

async function clearStoredData(key) {
    // This would typically clear IndexedDB data
    return new Promise((resolve) => {
        // Placeholder implementation
        resolve();
    });
}

// Error handling
self.addEventListener('error', (event) => {
    console.error('[ServiceWorker] Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('[ServiceWorker] Unhandled rejection:', event.reason);
    event.preventDefault();
});

console.log('[ServiceWorker] Service Worker registered successfully');

