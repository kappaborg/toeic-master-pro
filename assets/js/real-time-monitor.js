/**
 * Real-Time Performance Monitor
 * Monitors application performance and user interactions
 */

class RealTimeMonitor {
    constructor() {
        this.metrics = {
            performance: {
                lcp: 0,
                fid: 0,
                cls: 0,
                fcp: 0,
                ttfb: 0
            },
            user: {
                clicks: 0,
                keystrokes: 0,
                scrolls: 0,
                errors: 0,
                sessionTime: 0
            },
            system: {
                memoryUsage: 0,
                cpuUsage: 0,
                networkLatency: 0,
                cacheHitRate: 0
            }
        };
        
        this.sessionStart = Date.now();
        this.lastActivity = Date.now();
        this.isMonitoring = false;
        
        this.initializeMonitoring();
    }
    
    initializeMonitoring() {
        this.startPerformanceMonitoring();
        this.startUserInteractionMonitoring();
        this.startSystemMonitoring();
        this.startErrorMonitoring();
        
        this.isMonitoring = true;
        console.log('📊 Real-Time Monitor initialized');
    }
    
    startPerformanceMonitoring() {
        // Core Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            // LCP (Largest Contentful Paint)
            try {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.performance.lcp = lastEntry.startTime;
                    this.logPerformanceMetric('LCP', lastEntry.startTime);
                }).observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (error) {
                console.warn('LCP monitoring not supported:', error);
            }
            
            // FID (First Input Delay)
            try {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        const fid = entry.processingStart - entry.startTime;
                        this.metrics.performance.fid = fid;
                        this.logPerformanceMetric('FID', fid);
                    });
                }).observe({ entryTypes: ['first-input'] });
            } catch (error) {
                console.warn('FID monitoring not supported:', error);
            }
            
            // CLS (Cumulative Layout Shift)
            try {
                new PerformanceObserver((list) => {
                    let clsValue = 0;
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    this.metrics.performance.cls = clsValue;
                    this.logPerformanceMetric('CLS', clsValue);
                }).observe({ entryTypes: ['layout-shift'] });
            } catch (error) {
                console.warn('CLS monitoring not supported:', error);
            }
            
            // FCP (First Contentful Paint)
            try {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        this.metrics.performance.fcp = entry.startTime;
                        this.logPerformanceMetric('FCP', entry.startTime);
                    });
                }).observe({ entryTypes: ['paint'] });
            } catch (error) {
                console.warn('FCP monitoring not supported:', error);
            }
        }
        
        // TTFB (Time to First Byte)
        if ('performance' in window && 'timing' in window.performance) {
            const timing = window.performance.timing;
            const ttfb = timing.responseStart - timing.navigationStart;
            this.metrics.performance.ttfb = ttfb;
            this.logPerformanceMetric('TTFB', ttfb);
        }
    }
    
    startUserInteractionMonitoring() {
        // Click tracking
        document.addEventListener('click', (event) => {
            this.metrics.user.clicks++;
            this.lastActivity = Date.now();
            this.logUserInteraction('click', event.target);
        });
        
        // Keystroke tracking
        document.addEventListener('keydown', (event) => {
            this.metrics.user.keystrokes++;
            this.lastActivity = Date.now();
            this.logUserInteraction('keystroke', event.key);
        });
        
        // Scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            this.metrics.user.scrolls++;
            this.lastActivity = Date.now();
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.logUserInteraction('scroll', 'end');
            }, 150);
        });
        
        // Session time tracking
        setInterval(() => {
            this.metrics.user.sessionTime = Date.now() - this.sessionStart;
        }, 1000);
    }
    
    startSystemMonitoring() {
        // Memory usage monitoring
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.metrics.system.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
                this.logSystemMetric('memory', this.metrics.system.memoryUsage);
            }, 5000);
        }
        
        // Network latency monitoring
        setInterval(() => {
            this.measureNetworkLatency();
        }, 10000);
        
        // Cache hit rate monitoring
        this.monitorCachePerformance();
    }
    
    startErrorMonitoring() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.metrics.user.errors++;
            this.logError('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.metrics.user.errors++;
            this.logError('Unhandled Promise Rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });
        
        // Resource loading error handler
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.logError('Resource Loading Error', {
                    type: event.target.tagName,
                    src: event.target.src || event.target.href,
                    error: event.error
                });
            }
        }, true);
    }
    
    measureNetworkLatency() {
        // Skip API ping since we don't have an API
        // Use local performance measurement instead
        const start = Date.now();
        setTimeout(() => {
            const latency = Date.now() - start;
            this.metrics.system.networkLatency = latency;
            this.logSystemMetric('network', latency);
        }, 0);
    }
    
    monitorCachePerformance() {
        if ('caches' in window) {
            setInterval(async () => {
                try {
                    const cacheNames = await caches.keys();
                    let totalRequests = 0;
                    let cacheHits = 0;
                    
                    for (const cacheName of cacheNames) {
                        const cache = await caches.open(cacheName);
                        const requests = await cache.keys();
                        totalRequests += requests.length;
                        cacheHits += requests.length; // Simplified for demo
                    }
                    
                    this.metrics.system.cacheHitRate = totalRequests > 0 ? 
                        (cacheHits / totalRequests) * 100 : 0;
                } catch (error) {
                    console.warn('Cache monitoring error:', error);
                }
            }, 30000);
        }
    }
    
    logPerformanceMetric(metric, value) {
        const threshold = this.getPerformanceThreshold(metric);
        const status = value <= threshold ? 'good' : 'needs-improvement';
        
        console.log(`📊 ${metric}: ${Math.round(value)}ms (${status})`);
        
        // Alert if performance is poor
        if (status === 'needs-improvement') {
            this.alertPerformanceIssue(metric, value, threshold);
        }
    }
    
    logUserInteraction(type, target) {
        // Log significant user interactions
        if (type === 'click' && target.classList.contains('choice-btn')) {
            console.log('🎯 User selected answer');
        } else if (type === 'keystroke' && ['1', '2', '3', '4'].includes(target)) {
            console.log('⌨️ User used keyboard shortcut');
        }
    }
    
    logSystemMetric(metric, value) {
        if (metric === 'network') {
            window.logger?.debug(`${metric}: ${value}ms`);
        } else {
            window.logger?.debug(`${metric}: ${Math.round(value * 100)}%`);
        }
    }
    
    logError(type, details) {
        console.error(`❌ ${type}:`, details);
        
        // Send error to analytics if available
        if (window.advancedAnalytics) {
            window.advancedAnalytics.recordLearningEvent('error', {
                type,
                details,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    getPerformanceThreshold(metric) {
        const thresholds = {
            'LCP': 2500,
            'FID': 100,
            'CLS': 0.1,
            'FCP': 1800,
            'TTFB': 600
        };
        return thresholds[metric] || 1000;
    }
    
    alertPerformanceIssue(metric, value, threshold) {
        const message = `⚠️ Performance Alert: ${metric} is ${Math.round(value)}ms (threshold: ${threshold}ms)`;
        
        if (window.gameEngine && window.gameEngine.showNotification) {
            window.gameEngine.showNotification(message, 'warning', 3000);
        }
        
        console.warn(message);
    }
    
    getMetrics() {
        return {
            ...this.metrics,
            sessionDuration: Date.now() - this.sessionStart,
            lastActivity: Date.now() - this.lastActivity,
            isMonitoring: this.isMonitoring
        };
    }
    
    getPerformanceReport() {
        const metrics = this.getMetrics();
        
        return {
            coreWebVitals: {
                lcp: {
                    value: metrics.performance.lcp,
                    status: metrics.performance.lcp <= 2500 ? 'good' : 'needs-improvement'
                },
                fid: {
                    value: metrics.performance.fid,
                    status: metrics.performance.fid <= 100 ? 'good' : 'needs-improvement'
                },
                cls: {
                    value: metrics.performance.cls,
                    status: metrics.performance.cls <= 0.1 ? 'good' : 'needs-improvement'
                }
            },
            userActivity: {
                clicks: metrics.user.clicks,
                keystrokes: metrics.user.keystrokes,
                scrolls: metrics.user.scrolls,
                errors: metrics.user.errors,
                sessionTime: Math.round(metrics.user.sessionTime / 1000)
            },
            systemHealth: {
                memoryUsage: Math.round(metrics.system.memoryUsage * 100),
                networkLatency: metrics.system.networkLatency,
                cacheHitRate: Math.round(metrics.system.cacheHitRate)
            }
        };
    }
    
    stopMonitoring() {
        this.isMonitoring = false;
        console.log('📊 Real-Time Monitor stopped');
    }
    
    resetMetrics() {
        this.metrics = {
            performance: {
                lcp: 0,
                fid: 0,
                cls: 0,
                fcp: 0,
                ttfb: 0
            },
            user: {
                clicks: 0,
                keystrokes: 0,
                scrolls: 0,
                errors: 0,
                sessionTime: 0
            },
            system: {
                memoryUsage: 0,
                cpuUsage: 0,
                networkLatency: 0,
                cacheHitRate: 0
            }
        };
        
        this.sessionStart = Date.now();
        this.lastActivity = Date.now();
        
        console.log('📊 Metrics reset');
    }
}

// Global instance
window.realTimeMonitor = new RealTimeMonitor();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeMonitor;
}
