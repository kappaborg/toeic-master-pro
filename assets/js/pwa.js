// WordMaster Pro - PWA Manager
// Progressive Web App functionality

class PWAManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.deferredPrompt = null;
        this.isInstalled = false;
        
        this.init();
    }
    
    init() {
        // Register Service Worker
        this.registerServiceWorker();
        
        // Setup PWA event listeners
        this.setupEventListeners();
        
        // Check if app is installed
        this.checkInstallStatus();
        
        // Setup install prompt
        this.setupInstallPrompt();
        
        // Monitor connection status
        this.monitorConnection();
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                console.log('🔧 Registering Service Worker...');
                
                const registration = await navigator.serviceWorker.register('./sw.js');
                
                console.log('✅ Service Worker registered successfully:', registration);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Show update available notification
                            this.showUpdateAvailable();
                        }
                    });
                });
                
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        } else {
            console.warn('⚠️ Service Worker not supported');
        }
    }
    
    setupEventListeners() {
        // Online/Offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showConnectionStatus('online');
            this.syncDataWhenOnline();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showConnectionStatus('offline');
        });
        
        // Before install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('💾 Install prompt available');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
        
        // App installed
        window.addEventListener('appinstalled', () => {
            console.log('🎉 App installed successfully');
            this.isInstalled = true;
            this.hideInstallButton();
            this.showNotification('App installed successfully!', 'success');
        });
        
        // Visibility change (for background sync)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isOnline) {
                this.syncDataWhenOnline();
            }
        });
    }
    
    checkInstallStatus() {
        // Check if running as PWA
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('📱 Running as installed PWA');
        } else if (window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('🍎 Running as iOS PWA');
        } else {
            console.log('🌐 Running in browser');
        }
    }
    
    setupInstallPrompt() {
        // Create install button (initially hidden)
        const installButton = document.createElement('button');
        installButton.id = 'installButton';
        installButton.className = 'fixed bottom-4 right-4 bg-accent text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 hidden';
        installButton.innerHTML = `
            <i data-lucide="download" class="w-5 h-5 inline mr-2"></i>
            Install App
        `;
        
        installButton.addEventListener('click', () => {
            this.promptInstall();
        });
        
        document.body.appendChild(installButton);
    }
    
    showInstallButton() {
        const installButton = document.getElementById('installButton');
        if (installButton && !this.isInstalled) {
            installButton.classList.remove('hidden');
            installButton.classList.add('animate-bounce-soft');
        }
    }
    
    hideInstallButton() {
        const installButton = document.getElementById('installButton');
        if (installButton) {
            installButton.classList.add('hidden');
        }
    }
    
    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('❌ Install prompt not available');
            return;
        }
        
        try {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for user response
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log(`👤 User response to install prompt: ${outcome}`);
            
            if (outcome === 'accepted') {
                this.showNotification('Installing app...', 'info');
            } else {
                this.showNotification('Install cancelled', 'warning');
            }
            
            // Clear the saved prompt
            this.deferredPrompt = null;
            this.hideInstallButton();
            
        } catch (error) {
            console.error('❌ Install prompt error:', error);
        }
    }
    
    monitorConnection() {
        // Initial status
        this.showConnectionStatus(this.isOnline ? 'online' : 'offline');
        
        // Periodic connection check
        setInterval(() => {
            if (navigator.onLine !== this.isOnline) {
                this.isOnline = navigator.onLine;
                this.showConnectionStatus(this.isOnline ? 'online' : 'offline');
            }
        }, 5000);
    }
    
    showConnectionStatus(status) {
        const statusElement = document.getElementById('connectionStatus');
        
        if (!statusElement) {
            // Create status indicator
            const indicator = document.createElement('div');
            indicator.id = 'connectionStatus';
            indicator.className = 'fixed top-4 left-4 px-3 py-1 rounded-full text-sm font-medium z-50 transition-all duration-300';
            document.body.appendChild(indicator);
        }
        
        const indicator = document.getElementById('connectionStatus');
        
        if (status === 'online') {
            indicator.className = 'fixed top-4 left-4 px-3 py-1 rounded-full text-sm font-medium z-50 transition-all duration-300 bg-green-500/20 text-green-400 border border-green-500/30';
            indicator.innerHTML = `
                <i data-lucide="wifi" class="w-4 h-4 inline mr-1"></i>
                Online
            `;
            
            // Hide after 3 seconds
            setTimeout(() => {
                indicator.classList.add('opacity-0');
            }, 3000);
        } else {
            indicator.className = 'fixed top-4 left-4 px-3 py-1 rounded-full text-sm font-medium z-50 transition-all duration-300 bg-red-500/20 text-red-400 border border-red-500/30';
            indicator.innerHTML = `
                <i data-lucide="wifi-off" class="w-4 h-4 inline mr-1"></i>
                Offline
            `;
            indicator.classList.remove('opacity-0');
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    async syncDataWhenOnline() {
        if (!this.isOnline) return;
        
        try {
            console.log('🔄 Syncing data...');
            
            // Sync progress data
            const progressData = localStorage.getItem('wordmaster-progress');
            if (progressData) {
                await this.syncProgress(JSON.parse(progressData));
            }
            
            // Sync achievements
            const achievementData = localStorage.getItem('wordmaster-achievements');
            if (achievementData) {
                await this.syncAchievements(JSON.parse(achievementData));
            }
            
            console.log('✅ Data sync completed');
            
        } catch (error) {
            console.error('❌ Data sync failed:', error);
        }
    }
    
    async syncProgress(progressData) {
        // This would sync with a real backend
        // For now, we'll just simulate the sync
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('📊 Progress synced');
                resolve();
            }, 1000);
        });
    }
    
    async syncAchievements(achievementData) {
        // This would sync with a real backend
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('🏆 Achievements synced');
                resolve();
            }, 1000);
        });
    }
    
    showUpdateAvailable() {
        const updateNotification = document.createElement('div');
        updateNotification.className = 'fixed bottom-4 left-4 bg-blue-500/90 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
        updateNotification.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <h4 class="font-semibold mb-1">Update Available</h4>
                    <p class="text-sm opacity-90">A new version is ready to install</p>
                </div>
                <button class="ml-4 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm" onclick="location.reload()">
                    Update
                </button>
            </div>
        `;
        
        document.body.appendChild(updateNotification);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            updateNotification.remove();
        }, 10000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: 'bg-green-500/90 text-white',
            error: 'bg-red-500/90 text-white',
            warning: 'bg-yellow-500/90 text-black',
            info: 'bg-blue-500/90 text-white'
        };
        
        notification.className = `fixed top-20 right-4 ${colors[type]} p-4 rounded-lg shadow-lg z-50 max-w-sm animate-slide-in`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i data-lucide="${this.getNotificationIcon(type)}" class="w-5 h-5 mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };
        return icons[type] || 'info';
    }
    
    // Cache management
    async getCacheSize() {
        if ('serviceWorker' in navigator && 'caches' in window) {
            try {
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
                
                return this.formatBytes(totalSize);
            } catch (error) {
                console.error('Error calculating cache size:', error);
                return 'Unknown';
            }
        }
        return 'Not available';
    }
    
    async clearCache() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            this.showNotification('Cache cleared successfully', 'success');
        }
    }
    
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    // Share API
    async shareApp() {
        const shareData = {
            title: 'WordMaster Pro',
            text: 'Check out this amazing ESL learning app!',
            url: window.location.href
        };
        
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                console.log('App shared successfully');
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareData.url);
                this.showNotification('Link copied to clipboard!', 'success');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            this.showNotification('Share failed', 'error');
        }
    }
}

// Global PWA manager instance
window.pwaManager = null;

// Initialize PWA Manager immediately (will be called by App)
if (!window.pwaManager) {
    // Don't auto-initialize, let App handle it
    // window.pwaManager = new PWAManager();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWAManager;
}

