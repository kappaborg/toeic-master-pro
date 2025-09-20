/**
 * Unified Data Layer for WordMaster Pro
 * Centralized data management with transaction support and sync
 */

class UnifiedDataLayer {
    constructor() {
        this.stores = new Map();
        this.cache = new Map();
        this.transactions = new Map();
        this.syncQueue = [];
        this.isOnline = navigator.onLine;
        this.config = {
            maxCacheSize: 50 * 1024 * 1024, // 50MB
            syncInterval: 30000, // 30 seconds
            compressionEnabled: true,
            encryptionEnabled: false
        };
        
        this.initializeStores();
        this.setupEventListeners();
        this.startSyncScheduler();
    }
    
    initializeStores() {
        // Define data stores with their configurations
        const storeConfigs = {
            vocabulary: {
                persistent: true,
                cached: true,
                maxSize: 1000,
                ttl: 24 * 60 * 60 * 1000, // 24 hours
                compression: true
            },
            userProgress: {
                persistent: true,
                cached: true,
                maxSize: 10000,
                ttl: 0, // Never expire
                sync: true,
                backup: true
            },
            gameStatistics: {
                persistent: true,
                cached: true,
                maxSize: 5000,
                ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
                sync: true
            },
            achievements: {
                persistent: true,
                cached: true,
                maxSize: 1000,
                ttl: 0,
                sync: true
            },
            settings: {
                persistent: true,
                cached: true,
                maxSize: 100,
                ttl: 0
            },
            analytics: {
                persistent: true,
                cached: false,
                maxSize: 10000,
                ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
                sync: true,
                compress: true
            }
        };
        
        Object.entries(storeConfigs).forEach(([name, config]) => {
            this.stores.set(name, {
                data: new Map(),
                config,
                dirty: false,
                lastSync: 0,
                lastAccess: Date.now()
            });
        });
    }
    
    setupEventListeners() {
        // Online/offline detection
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processSyncQueue();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
        
        // Page visibility for background sync
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.processSyncQueue();
            }
        });
        
        // Before unload - emergency save
        window.addEventListener('beforeunload', () => {
            this.emergencySave();
        });
    }
    
    // Transaction support for atomic operations
    async transaction(storeNames, callback) {
        const transactionId = `tx_${Date.now()}_${Math.random()}`;
        const snapshot = {};
        
        try {
            // Create snapshot
            storeNames.forEach(storeName => {
                const store = this.stores.get(storeName);
                if (store) {
                    snapshot[storeName] = new Map(store.data);
                }
            });
            
            this.transactions.set(transactionId, { storeNames, snapshot });
            
            // Execute transaction
            const result = await callback(this);
            
            // Commit - mark stores as dirty
            storeNames.forEach(storeName => {
                const store = this.stores.get(storeName);
                if (store) {
                    store.dirty = true;
                    store.lastAccess = Date.now();
                }
            });
            
            this.transactions.delete(transactionId);
            return result;
            
        } catch (error) {
            // Rollback
            storeNames.forEach(storeName => {
                if (snapshot[storeName]) {
                    const store = this.stores.get(storeName);
                    if (store) {
                        store.data = snapshot[storeName];
                    }
                }
            });
            
            this.transactions.delete(transactionId);
            throw error;
        }
    }
    
    // Data operations with intelligent caching
    async set(storeName, key, value, options = {}) {
        const store = this.stores.get(storeName);
        if (!store) {
            throw new Error(`Store ${storeName} not found`);
        }
        
        // Size check
        const serializedSize = this.getDataSize(value);
        if (serializedSize > store.config.maxSize * 1024) {
            throw new Error(`Data too large for store ${storeName}`);
        }
        
        // Cache management
        if (store.config.cached) {
            await this.manageCacheSize(storeName);
        }
        
        // Set data
        const entry = {
            value,
            timestamp: Date.now(),
            ttl: options.ttl || store.config.ttl,
            metadata: options.metadata || {}
        };
        
        store.data.set(key, entry);
        store.dirty = true;
        store.lastAccess = Date.now();
        
        // Cache if enabled
        if (store.config.cached) {
            this.cache.set(`${storeName}:${key}`, entry);
        }
        
        // Schedule sync if needed
        if (store.config.sync && this.isOnline) {
            this.scheduleSyncOperation(storeName, 'set', key, value);
        }
        
        // Auto-persist for critical data
        if (options.immediate || storeName === 'userProgress') {
            await this.persist(storeName);
        }
    }
    
    async get(storeName, key, defaultValue = null) {
        const store = this.stores.get(storeName);
        if (!store) {
            return defaultValue;
        }
        
        // Check cache first
        const cacheKey = `${storeName}:${key}`;
        if (store.config.cached && this.cache.has(cacheKey)) {
            const entry = this.cache.get(cacheKey);
            if (this.isEntryValid(entry)) {
                store.lastAccess = Date.now();
                return entry.value;
            } else {
                this.cache.delete(cacheKey);
            }
        }
        
        // Check store
        const entry = store.data.get(key);
        if (entry && this.isEntryValid(entry)) {
            store.lastAccess = Date.now();
            
            // Update cache
            if (store.config.cached) {
                this.cache.set(cacheKey, entry);
            }
            
            return entry.value;
        }
        
        // Try to load from persistent storage
        if (store.config.persistent) {
            const persistedValue = await this.loadFromPersistent(storeName, key);
            if (persistedValue !== null) {
                await this.set(storeName, key, persistedValue);
                return persistedValue;
            }
        }
        
        return defaultValue;
    }
    
    async getAll(storeName, filter = null) {
        const store = this.stores.get(storeName);
        if (!store) {
            return new Map();
        }
        
        const result = new Map();
        
        for (const [key, entry] of store.data) {
            if (this.isEntryValid(entry)) {
                if (!filter || filter(key, entry.value)) {
                    result.set(key, entry.value);
                }
            }
        }
        
        store.lastAccess = Date.now();
        return result;
    }
    
    async delete(storeName, key) {
        const store = this.stores.get(storeName);
        if (!store) {
            return false;
        }
        
        const deleted = store.data.delete(key);
        if (deleted) {
            store.dirty = true;
            store.lastAccess = Date.now();
            
            // Remove from cache
            this.cache.delete(`${storeName}:${key}`);
            
            // Schedule sync
            if (store.config.sync && this.isOnline) {
                this.scheduleSyncOperation(storeName, 'delete', key);
            }
        }
        
        return deleted;
    }
    
    // Memory management
    async manageCacheSize() {
        const currentSize = this.getCurrentCacheSize();
        
        if (currentSize > this.config.maxCacheSize) {
            console.log('🧹 Cache size limit reached, cleaning up...');
            
            // Sort by last access time
            const entries = Array.from(this.cache.entries())
                .map(([key, entry]) => ({ key, entry, lastAccess: entry.metadata?.lastAccess || 0 }))
                .sort((a, b) => a.lastAccess - b.lastAccess);
            
            // Remove 25% of least recently used entries
            const toRemove = Math.floor(entries.length * 0.25);
            for (let i = 0; i < toRemove; i++) {
                this.cache.delete(entries[i].key);
            }
            
            console.log(`🧹 Removed ${toRemove} cache entries`);
        }
    }
    
    getCurrentCacheSize() {
        let totalSize = 0;
        for (const [key, entry] of this.cache) {
            totalSize += this.getDataSize(entry);
        }
        return totalSize;
    }
    
    getDataSize(data) {
        return new Blob([JSON.stringify(data)]).size;
    }
    
    isEntryValid(entry) {
        if (!entry.ttl) return true;
        return (Date.now() - entry.timestamp) < entry.ttl;
    }
    
    // Persistence layer
    async persist(storeName) {
        const store = this.stores.get(storeName);
        if (!store || !store.config.persistent || !store.dirty) {
            return;
        }
        
        try {
            const data = Object.fromEntries(store.data);
            const key = `wordmaster_${storeName}`;
            
            if (store.config.compression) {
                // Compress large data
                const compressed = await this.compressData(data);
                localStorage.setItem(key, compressed);
            } else {
                localStorage.setItem(key, JSON.stringify(data));
            }
            
            store.dirty = false;
            
        } catch (error) {
            console.error(`❌ Failed to persist ${storeName}:`, error);
        }
    }
    
    async loadFromPersistent(storeName, key = null) {
        try {
            const storageKey = `wordmaster_${storeName}`;
            const stored = localStorage.getItem(storageKey);
            
            if (!stored) return null;
            
            const store = this.stores.get(storeName);
            let data;
            
            if (store?.config.compression) {
                data = await this.decompressData(stored);
            } else {
                data = JSON.parse(stored);
            }
            
            if (key) {
                return data[key]?.value || null;
            }
            
            // Load all data into store
            Object.entries(data).forEach(([k, entry]) => {
                store.data.set(k, entry);
            });
            
            return data;
            
        } catch (error) {
            console.error(`❌ Failed to load ${storeName} from storage:`, error);
            return null;
        }
    }
    
    // Compression helpers
    async compressData(data) {
        // Simple JSON compression - in production, use proper compression
        const jsonString = JSON.stringify(data);
        return btoa(jsonString); // Base64 encoding as simple compression
    }
    
    async decompressData(compressedData) {
        try {
            const jsonString = atob(compressedData);
            return JSON.parse(jsonString);
        } catch (error) {
            // Fallback to uncompressed data
            return JSON.parse(compressedData);
        }
    }
    
    // Sync operations
    scheduleSyncOperation(storeName, operation, key, value = null) {
        this.syncQueue.push({
            storeName,
            operation,
            key,
            value,
            timestamp: Date.now()
        });
    }
    
    async processSyncQueue() {
        if (!this.isOnline || this.syncQueue.length === 0) {
            return;
        }
        
        console.log(`🔄 Processing ${this.syncQueue.length} sync operations...`);
        
        const operations = [...this.syncQueue];
        this.syncQueue = [];
        
        for (const op of operations) {
            try {
                await this.syncOperation(op);
            } catch (error) {
                console.error('❌ Sync operation failed:', error);
                // Re-queue failed operations
                this.syncQueue.push(op);
            }
        }
    }
    
    async syncOperation(operation) {
        // Mock sync operation - in production, this would sync with backend
        console.log(`🔄 Syncing ${operation.operation} for ${operation.storeName}:${operation.key}`);
        return Promise.resolve();
    }
    
    startSyncScheduler() {
        // Clear existing interval to prevent duplicates
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        this.syncInterval = setInterval(() => {
            this.processSyncQueue();
            this.persistDirtyStores();
        }, this.config.syncInterval);
    }
    
    async persistDirtyStores() {
        for (const [storeName, store] of this.stores) {
            if (store.dirty && store.config.persistent) {
                await this.persist(storeName);
            }
        }
    }
    
    emergencySave() {
        // Synchronous save for critical data
        for (const [storeName, store] of this.stores) {
            if (store.dirty && store.config.persistent && (storeName === 'userProgress' || storeName === 'achievements')) {
                try {
                    const data = Object.fromEntries(store.data);
                    localStorage.setItem(`wordmaster_${storeName}`, JSON.stringify(data));
                } catch (error) {
                    console.error(`❌ Emergency save failed for ${storeName}:`, error);
                }
            }
        }
    }
    
    // Utility methods
    getStats() {
        const stats = {
            stores: this.stores.size,
            totalEntries: 0,
            cacheSize: this.cache.size,
            memoryUsage: 0,
            syncQueueLength: this.syncQueue.length
        };
        
        for (const [name, store] of this.stores) {
            stats.totalEntries += store.data.size;
            stats.memoryUsage += this.getDataSize(store.data);
        }
        
        return stats;
    }
    
    async clearStore(storeName) {
        const store = this.stores.get(storeName);
        if (store) {
            store.data.clear();
            store.dirty = true;
            
            // Clear related cache entries
            for (const key of this.cache.keys()) {
                if (key.startsWith(`${storeName}:`)) {
                    this.cache.delete(key);
                }
            }
            
            // Clear persistent storage
            localStorage.removeItem(`wordmaster_${storeName}`);
        }
    }
    
    async exportData() {
        const exportData = {};
        
        for (const [storeName, store] of this.stores) {
            exportData[storeName] = Object.fromEntries(store.data);
        }
        
        return {
            data: exportData,
            metadata: {
                version: '2.0.0',
                exportDate: new Date().toISOString(),
                stats: this.getStats()
            }
        };
    }
    
    async importData(importData) {
        if (!importData.data) {
            throw new Error('Invalid import data format');
        }
        
        for (const [storeName, storeData] of Object.entries(importData.data)) {
            const store = this.stores.get(storeName);
            if (store) {
                store.data.clear();
                Object.entries(storeData).forEach(([key, entry]) => {
                    store.data.set(key, entry);
                });
                store.dirty = true;
            }
        }
        
        await this.persistDirtyStores();
    }
}

// Global instance
window.dataLayer = new UnifiedDataLayer();

console.log('💾 Unified Data Layer loaded');
