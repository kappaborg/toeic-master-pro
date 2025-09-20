// Performance Optimizer for WordMaster Pro
// Handles lazy loading, caching, and performance optimizations

class PerformanceOptimizer {
    constructor() {
        this.loadedModules = new Set();
        this.imageCache = new Map();
        this.preloadQueue = [];
        this.isOptimizing = false;
        
        this.init();
        console.log('⚡ Performance Optimizer initialized');
    }
    
    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupResourcePreloading();
        this.setupMemoryManagement();
        this.setupPerformanceMonitoring();
    }
    
    setupLazyLoading() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.1
            });
            
            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                this.imageObserver.observe(img);
            });
        }
        
        // Lazy load non-critical modules
        this.setupCodeSplitting();
    }
    
    setupCodeSplitting() {
        // Dynamic imports for better performance
        this.lazyModules = {
            'settings': () => import('./settings-panel.js'),
            // 'gamification': () => import('./gamification-system.js'), // Removed - file deleted
            'spaced-repetition': () => import('./spaced-repetition.js'),
            'adaptive-learning': () => import('./adaptive-learning.js')
        };
        
        // Preload critical modules
        this.preloadCriticalModules();
    }
    
    async preloadCriticalModules() {
        const criticalModules = ['settings'];
        
        for (const moduleName of criticalModules) {
            try {
                await this.preloadModule(moduleName);
            } catch (error) {
                console.warn(`Failed to preload ${moduleName}:`, error);
            }
        }
    }
    
    async loadModule(src) {
        if (this.loadedModules.has(src)) {
            return Promise.resolve();
        }
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            
            script.onload = () => {
                this.loadedModules.add(src);
                console.log(`📦 Module loaded: ${src}`);
                resolve();
            };
            
            script.onerror = () => {
                console.error(`❌ Failed to load module: ${src}`);
                reject(new Error(`Failed to load module: ${src}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    async preloadModule(moduleName) {
        // Map module names to their actual file paths
        const moduleMap = {
            'settings': 'assets/js/settings-panel.js',
            // 'gamification': 'assets/js/gamification-system.js', // Removed - file deleted
            'vocabulary': 'assets/js/toeic-vocabulary-system.js',
            'reading': 'assets/js/toeic-reading-system.js',
            'listening': 'assets/js/toeic-listening-system.js',
            'test': 'assets/js/toeic-test-simulator.js',
            // 'progress': 'assets/js/toeic-progress-analytics.js', // Removed - not used
            // 'strategies': 'assets/js/toeic-study-strategies.js' // Removed - not used
        };
        
        const modulePath = moduleMap[moduleName];
        if (!modulePath) {
            throw new Error(`Unknown module: ${moduleName}`);
        }
        
        // Check if module is already loaded
        if (this.loadedModules.has(modulePath)) {
            return Promise.resolve();
        }
        
        // Preload the module
        return this.loadModule(modulePath);
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            // Create a new image element to preload
            const imageLoader = new Image();
            imageLoader.onload = () => {
                img.src = src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
            };
            imageLoader.onerror = () => {
                img.classList.add('error');
                console.warn(`Failed to load image: ${src}`);
            };
            imageLoader.src = src;
        }
    }
    
    setupImageOptimization() {
        // Add loading="lazy" to images automatically
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.loading = 'lazy';
        });
        
        // Optimize image sizes based on device pixel ratio
        this.optimizeImageSizes();
    }
    
    optimizeImageSizes() {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const viewportWidth = window.innerWidth;
        
        document.querySelectorAll('img[data-sizes]').forEach(img => {
            const sizes = JSON.parse(img.dataset.sizes);
            let bestSize = sizes.default;
            
            // Choose best size based on viewport and pixel ratio
            if (viewportWidth <= 480 && sizes.small) {
                bestSize = sizes.small;
            } else if (viewportWidth <= 768 && sizes.medium) {
                bestSize = sizes.medium;
            } else if (sizes.large) {
                bestSize = sizes.large;
            }
            
            // Adjust for high DPI displays
            if (devicePixelRatio > 1.5 && sizes.retina) {
                bestSize = sizes.retina;
            }
            
            if (img.dataset.src) {
                img.dataset.src = bestSize;
            } else {
                img.src = bestSize;
            }
        });
    }
    
    setupResourcePreloading() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup intelligent preloading based on user behavior
        this.setupIntelligentPreloading();
    }
    
    preloadCriticalResources() {
        const criticalResources = [
            { href: './assets/css/tailwind-custom.css', as: 'style' },
            { href: './assets/css/professional-ui.css', as: 'style' }
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.crossOrigin) {
                link.crossOrigin = resource.crossOrigin;
            }
            document.head.appendChild(link);
        });
    }
    
    setupIntelligentPreloading() {
        // Preload game assets when hovering over game cards
        document.addEventListener('mouseenter', (event) => {
            try {
                // Ensure event.target is an Element and has closest method
                if (event.target && 
                    event.target.nodeType === Node.ELEMENT_NODE && 
                    typeof event.target.closest === 'function') {
                    
                    const gameCard = event.target.closest('.game-card');
                    if (gameCard) {
                        const gameMode = this.extractGameMode(gameCard);
                        if (gameMode && !this.preloadQueue.includes(gameMode)) {
                            this.preloadQueue.push(gameMode);
                            this.preloadGameAssets(gameMode);
                        }
                    }
                }
            } catch (error) {
                // Silently handle any errors to prevent console spam
                console.debug('Preloading hover event error:', error);
            }
        }, true);
        
        // Preload next likely content based on user patterns
        this.setupPredictivePreloading();
    }
    
    extractGameMode(gameCard) {
        const onclick = gameCard.getAttribute('onclick');
        if (onclick) {
            const match = onclick.match(/startGame\(['"](.+?)['"]\)/);
            return match ? match[1] : null;
        }
        return null;
    }
    
    async preloadGameAssets(gameMode) {
        console.log(`🎯 Preloading assets for: ${gameMode}`);
        
        // Preload game-specific resources
        const gameAssets = this.getGameAssets(gameMode);
        
        for (const asset of gameAssets) {
            try {
                await this.preloadAsset(asset);
            } catch (error) {
                console.warn(`Failed to preload asset: ${asset}`, error);
            }
        }
    }
    
    getGameAssets(gameMode) {
        const assetMap = {
            'multipleChoice': [
                './assets/audio/correct.mp3',
                './assets/audio/incorrect.mp3'
            ],
            'conversation': [
                './assets/images/conversation-restaurant.jpg',
                './assets/audio/conversation-examples.mp3'
            ],
            'visualLearning': [
                './assets/images/vocabulary-words.jpg',
                './assets/images/students-learning.jpg'
            ],
            'timeTelling': [
                './assets/images/clock-time.jpg'
            ]
        };
        
        return assetMap[gameMode] || [];
    }
    
    async preloadAsset(url) {
        if (this.imageCache.has(url)) {
            return this.imageCache.get(url);
        }
        
        const promise = fetch(url, { 
            method: 'HEAD',
            mode: 'no-cors'
        }).then(() => {
            console.log(`✅ Preloaded: ${url}`);
        }).catch(error => {
            console.warn(`❌ Failed to preload: ${url}`, error);
        });
        
        this.imageCache.set(url, promise);
        return promise;
    }
    
    setupPredictivePreloading() {
        // Track user patterns and preload likely next content
        let userPattern = JSON.parse(localStorage.getItem('userPattern') || '[]');
        
        // Analyze patterns and preload accordingly
        if (userPattern.length > 3) {
            const commonSequences = this.analyzeUserPatterns(userPattern);
            this.preloadBasedOnPatterns(commonSequences);
        }
    }
    
    analyzeUserPatterns(patterns) {
        // Simple pattern analysis - find common sequences
        const sequences = {};
        
        for (let i = 0; i < patterns.length - 1; i++) {
            const current = patterns[i];
            const next = patterns[i + 1];
            const key = `${current}->${next}`;
            
            sequences[key] = (sequences[key] || 0) + 1;
        }
        
        return Object.entries(sequences)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([key]) => key.split('->')[1]);
    }
    
    preloadBasedOnPatterns(predictedGames) {
        predictedGames.forEach(gameMode => {
            setTimeout(() => {
                this.preloadGameAssets(gameMode);
            }, 1000);
        });
    }
    
    setupMemoryManagement() {
        // Clear existing interval to prevent duplicates
        if (this.memoryCleanupInterval) {
            clearInterval(this.memoryCleanupInterval);
        }
        
        // Clean up unused resources periodically
        this.memoryCleanupInterval = setInterval(() => {
            this.cleanupUnusedResources();
        }, 60000); // Every minute
        
        // Monitor memory usage
        this.monitorMemoryUsage();
    }
    
    cleanupUnusedResources() {
        // Remove old cache entries
        if (this.imageCache.size > 50) {
            const entries = Array.from(this.imageCache.entries());
            const toRemove = entries.slice(0, entries.length - 30);
            
            toRemove.forEach(([key]) => {
                this.imageCache.delete(key);
            });
            
            console.log(`🧹 Cleaned up ${toRemove.length} cache entries`);
        }
        
        // Clean up unused DOM elements
        this.cleanupUnusedDOMElements();
        
        // Clean up unused event listeners
        this.cleanupUnusedEventListeners();
        
        // Clear old user patterns
        let userPattern = JSON.parse(localStorage.getItem('userPattern') || '[]');
        if (userPattern.length > 100) {
            userPattern = userPattern.slice(-50);
            localStorage.setItem('userPattern', JSON.stringify(userPattern));
        }
    }
    
    cleanupUnusedDOMElements() {
        // Remove hidden elements that are no longer needed
        const hiddenElements = document.querySelectorAll('.hidden[data-cleanup="true"]');
        hiddenElements.forEach(element => {
            if (element.dataset.cleanupTime && 
                Date.now() - parseInt(element.dataset.cleanupTime) > 300000) { // 5 minutes
                element.remove();
            }
        });
        
        // Clean up old notifications
        const oldNotifications = document.querySelectorAll('#notificationContainer .notification[data-timestamp]');
        oldNotifications.forEach(notification => {
            const timestamp = parseInt(notification.dataset.timestamp);
            if (Date.now() - timestamp > 10000) { // 10 seconds
                notification.remove();
            }
        });
    }
    
    cleanupUnusedEventListeners() {
        // Clean up old event listeners that might be causing memory leaks
        if (window.gameEngine && window.gameEngine.cleanup) {
            window.gameEngine.cleanup();
        }
        
        if (window.audioSystem && window.audioSystem.cleanup) {
            window.audioSystem.cleanup();
        }
        
        if (window.realTimeMonitor && window.realTimeMonitor.cleanup) {
            window.realTimeMonitor.cleanup();
        }
    }
    
    optimizeMemoryUsage() {
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        // Clear unused caches
        if (window.caches) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    if (cacheName.includes('old-') || cacheName.includes('temp-')) {
                        caches.delete(cacheName);
                    }
                });
            });
        }
        
        // Clear unused localStorage entries
        this.cleanupLocalStorage();
    }
    
    cleanupLocalStorage() {
        const keysToCheck = [
            'oldAnalytics',
            'tempData',
            'cachedImages',
            'oldProgress'
        ];
        
        keysToCheck.forEach(key => {
            if (localStorage.getItem(key)) {
                const data = JSON.parse(localStorage.getItem(key));
                if (data.timestamp && Date.now() - data.timestamp > 86400000) { // 24 hours
                    localStorage.removeItem(key);
                }
            }
        });
    }
    
    monitorMemoryUsage() {
        if ('memory' in performance) {
            const checkMemory = () => {
                const memory = performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
                const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
                
                // Warn if memory usage is high
                if (usedMB > 100) {
                    console.warn(`💾 High memory usage: ${usedMB}MB / ${totalMB}MB`);
                    this.optimizeMemoryUsage();
                }
            };
            
            // Clear existing interval to prevent duplicates
            if (this.memoryCheckInterval) {
                clearInterval(this.memoryCheckInterval);
            }
            this.memoryCheckInterval = setInterval(checkMemory, 30000); // Check every 30 seconds
        }
    }
    
    optimizeMemoryUsage() {
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        // Clean up large objects
        this.cleanupUnusedResources();
        
        // Reduce image quality temporarily
        this.temporaryReduceImageQuality();
    }
    
    temporaryReduceImageQuality() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.classList.contains('quality-reduced')) {
                img.style.imageRendering = 'pixelated';
                img.classList.add('quality-reduced');
                
                // Restore quality after 10 seconds
                setTimeout(() => {
                    img.style.imageRendering = 'auto';
                    img.classList.remove('quality-reduced');
                }, 10000);
            }
        });
    }
    
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Monitor custom performance metrics
        this.monitorCustomMetrics();
    }
    
    monitorCoreWebVitals() {
        // Monitor Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log(`📊 LCP: ${entry.startTime.toFixed(2)}ms`);
                
                if (entry.startTime > 2500) {
                    console.warn('⚠️ LCP is slow, optimizing...');
                    this.optimizeLCP();
                }
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Monitor First Input Delay (FID)
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log(`📊 FID: ${entry.processingStart - entry.startTime}ms`);
            }
        }).observe({ entryTypes: ['first-input'] });
        
        // Monitor Cumulative Layout Shift (CLS)
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    console.log(`📊 CLS: ${entry.value}`);
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }
    
    monitorCustomMetrics() {
        // Monitor game load times
        window.addEventListener('gameStarted', (event) => {
            const startTime = performance.now();
            
            window.addEventListener('gameReady', () => {
                const loadTime = performance.now() - startTime;
                console.log(`🎮 Game load time: ${loadTime.toFixed(2)}ms`);
                
                if (loadTime > 1000) {
                    console.warn('⚠️ Game loading is slow');
                }
            }, { once: true });
        });
    }
    
    optimizeLCP() {
        // Preload hero images
        const heroImages = document.querySelectorAll('.hero img, .game-card img');
        heroImages.forEach(img => {
            if (img.dataset.src) {
                this.loadImage(img);
            }
        });
        
        // Defer non-critical resources
        this.deferNonCriticalResources();
    }
    
    deferNonCriticalResources() {
        // Defer loading of non-critical scripts
        const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
        nonCriticalScripts.forEach(script => {
            setTimeout(() => {
                script.removeAttribute('data-defer');
            }, 2000);
        });
    }
    
    // Public API
    preloadGame(gameMode) {
        return this.preloadGameAssets(gameMode);
    }
    
    clearCache() {
        this.imageCache.clear();
        this.loadedModules.clear();
        console.log('🧹 Performance cache cleared');
    }
    
    getPerformanceStats() {
        return {
            loadedModules: Array.from(this.loadedModules),
            cacheSize: this.imageCache.size,
            preloadQueueLength: this.preloadQueue.length,
            memory: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            } : null
        };
    }
    
    enableProductionMode() {
        console.log('⚡ Production mode enabled for Performance Optimizer');
        this.isProduction = true;
        this.enableAdvancedOptimizations();
    }
}

// Utility functions for bundle optimization
window.optimizeBundle = function() {
    // Remove unused CSS
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(sheet => {
        if (sheet.sheet && sheet.sheet.cssRules) {
            // Simple unused CSS detection (can be enhanced)
            let usedRules = 0;
            for (let rule of sheet.sheet.cssRules) {
                if (rule.selectorText && document.querySelector(rule.selectorText)) {
                    usedRules++;
                }
            }
            
            if (usedRules === 0) {
                console.log(`🗑️ Removing unused stylesheet: ${sheet.href}`);
                sheet.remove();
            }
        }
    });
};

// Initialize Performance Optimizer immediately
if (!window.performanceOptimizer) {
    window.performanceOptimizer = new PerformanceOptimizer();
}

// Export for use in modules
window.PerformanceOptimizer = PerformanceOptimizer;

console.log('⚡ Performance Optimizer system loaded');
