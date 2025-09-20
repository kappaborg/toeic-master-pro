/**
 * Initialization Manager for WordMaster Pro
 * Manages component dependencies and sequential loading
 */

class InitializationManager {
    constructor() {
        this.components = new Map();
        this.dependencies = new Map();
        this.initialized = new Set();
        this.loading = new Set();
        this.failed = new Set();
        this.retryAttempts = new Map();
        this.maxRetries = 3;
        
        this.initializeComponentDependencies();
    }
    
    initializeComponentDependencies() {
        // Define component dependencies
        this.dependencies.set('errorBoundary', []);
        this.dependencies.set('performanceOptimizer', ['errorBoundary']);
        this.dependencies.set('dataManager', ['errorBoundary', 'performanceOptimizer']);
        this.dependencies.set('spacedRepetition', ['dataManager']);
        this.dependencies.set('audioSystem', ['errorBoundary']);
        this.dependencies.set('advancedAnalytics', ['dataManager']);
        this.dependencies.set('gamificationSystem', ['dataManager']);
        this.dependencies.set('enhancedProgress', ['dataManager', 'gamificationSystem']);
        this.dependencies.set('gameEngine', ['dataManager', 'spacedRepetition', 'advancedAnalytics']);
        this.dependencies.set('uiManager', ['gameEngine']);
        this.dependencies.set('app', ['uiManager']);
    }
    
    registerComponent(name, initFunction, config = {}) {
        this.components.set(name, {
            initFunction,
            config,
            priority: config.priority || 0,
            critical: config.critical || false,
            timeout: config.timeout || 10000
        });
    }
    
    async initializeAll() {
        console.log('🚀 Starting sequential component initialization...');
        
        try {
            const initOrder = this.getInitializationOrder();
            
            for (const componentName of initOrder) {
                await this.initializeComponent(componentName);
            }
            
            console.log('✅ All components initialized successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Component initialization failed:', error);
            return false;
        }
    }
    
    getInitializationOrder() {
        const visited = new Set();
        const order = [];
        
        const visit = (componentName) => {
            if (visited.has(componentName)) return;
            visited.add(componentName);
            
            const deps = this.dependencies.get(componentName) || [];
            deps.forEach(dep => visit(dep));
            
            if (this.components.has(componentName)) {
                order.push(componentName);
            }
        };
        
        // Visit all components
        this.components.forEach((_, name) => visit(name));
        
        return order;
    }
    
    async initializeComponent(name) {
        if (this.initialized.has(name)) {
            return this.getComponent(name);
        }
        
        if (this.loading.has(name)) {
            // Wait for current initialization
            return this.waitForComponent(name);
        }
        
        if (this.failed.has(name)) {
            const attempts = this.retryAttempts.get(name) || 0;
            if (attempts >= this.maxRetries) {
                throw new Error(`Component ${name} failed to initialize after ${this.maxRetries} attempts`);
            }
        }
        
        this.loading.add(name);
        const component = this.components.get(name);
        
        if (!component) {
            throw new Error(`Component ${name} not registered`);
        }
        
        try {
            console.log(`🔧 Initializing ${name}...`);
            
            // Check dependencies first
            await this.waitForDependencies(name);
            
            // Initialize with timeout
            const result = await Promise.race([
                component.initFunction(),
                this.createTimeoutPromise(component.timeout, name)
            ]);
            
            this.initialized.add(name);
            this.loading.delete(name);
            this.failed.delete(name);
            this.retryAttempts.delete(name);
            
            // Store component instance globally if needed
            if (result && typeof result === 'object') {
                window[name] = result;
            }
            
            console.log(`✅ ${name} initialized successfully`);
            return result;
            
        } catch (error) {
            this.loading.delete(name);
            this.failed.add(name);
            
            const attempts = this.retryAttempts.get(name) || 0;
            this.retryAttempts.set(name, attempts + 1);
            
            console.error(`❌ Failed to initialize ${name}:`, error);
            
            if (component.critical) {
                throw error;
            }
            
            // Return null for non-critical components
            return null;
        }
    }
    
    async waitForDependencies(componentName) {
        const deps = this.dependencies.get(componentName) || [];
        
        for (const dep of deps) {
            if (!this.initialized.has(dep)) {
                await this.initializeComponent(dep);
            }
        }
    }
    
    async waitForComponent(name, timeout = 30000) {
        const startTime = Date.now();
        
        while (!this.initialized.has(name) && (Date.now() - startTime) < timeout) {
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (this.failed.has(name)) {
                throw new Error(`Component ${name} failed to initialize`);
            }
        }
        
        if (!this.initialized.has(name)) {
            throw new Error(`Timeout waiting for component ${name}`);
        }
        
        return this.getComponent(name);
    }
    
    createTimeoutPromise(timeout, componentName) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Component ${componentName} initialization timeout (${timeout}ms)`));
            }, timeout);
        });
    }
    
    getComponent(name) {
        return window[name] || null;
    }
    
    isInitialized(name) {
        return this.initialized.has(name);
    }
    
    getInitializationStatus() {
        return {
            initialized: Array.from(this.initialized),
            loading: Array.from(this.loading),
            failed: Array.from(this.failed),
            total: this.components.size
        };
    }
    
    // Safe component getter with fallback
    safeGet(componentName, fallback = null) {
        if (this.initialized.has(componentName)) {
            return this.getComponent(componentName);
        }
        
        console.warn(`⚠️ Component ${componentName} not initialized, using fallback`);
        return fallback;
    }
    
    // Emergency reinitialize
    async reinitialize(componentName) {
        this.initialized.delete(componentName);
        this.loading.delete(componentName);
        this.failed.delete(componentName);
        this.retryAttempts.delete(componentName);
        
        return this.initializeComponent(componentName);
    }
}

// Global instance - Initialize only if not exists
if (!window.initManager) {
    window.initManager = new InitializationManager();
}

console.log('🎯 Initialization Manager loaded');
