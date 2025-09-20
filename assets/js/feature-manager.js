/**
 * Feature Manager - Independent Feature Control System
 * Manages which features are enabled/disabled and where they can be used
 */

class FeatureManager {
    constructor() {
        this.features = new Map();
        this.featureStates = new Map();
        this.initialized = false;
        
        // Initialize default features
        this.initializeDefaultFeatures();
        
        console.log('🎛️ Feature Manager initialized');
    }
    
    /**
     * Initialize default features with their configurations
     */
    initializeDefaultFeatures() {
        // Progress Panel Feature
        this.registerFeature('progressPanel', {
            name: 'Progress Panel',
            description: 'Gamification and progress tracking panel',
            enabled: true,
            allowedIn: ['all'], // Can be used everywhere
            dependencies: ['gamificationSystem'],
            autoEnable: true
        });
        
        // Global Controls Feature
        this.registerFeature('globalControls', {
            name: 'Global Controls',
            description: 'Progress toggle and home buttons',
            enabled: true,
            allowedIn: ['game', 'welcome', 'settings'],
            dependencies: ['gameEngine'],
            autoEnable: true
        });
        
        // Draggable Elements Feature
        this.registerFeature('draggableElements', {
            name: 'Draggable Elements',
            description: 'Draggable UI elements with boundaries',
            enabled: true,
            allowedIn: ['all'],
            dependencies: [],
            autoEnable: true
        });
        
        // Audio System Feature
        this.registerFeature('audioSystem', {
            name: 'Audio System',
            description: 'Text-to-speech and sound effects',
            enabled: true,
            allowedIn: ['game', 'welcome'],
            dependencies: [],
            autoEnable: true
        });
        
        // Analytics Feature
        this.registerFeature('analytics', {
            name: 'Analytics',
            description: 'Learning progress analytics',
            enabled: true,
            allowedIn: ['all'],
            dependencies: [],
            autoEnable: true
        });
        
        // PWA Feature
        this.registerFeature('pwa', {
            name: 'PWA',
            description: 'Progressive Web App capabilities',
            enabled: true,
            allowedIn: ['all'],
            dependencies: [],
            autoEnable: true
        });
        
        // Mobile Optimization Feature
        this.registerFeature('mobileOptimization', {
            name: 'Mobile Optimization',
            description: 'Mobile-specific UI optimizations',
            enabled: true,
            allowedIn: ['all'],
            dependencies: [],
            autoEnable: true
        });
        
        // Error Boundary Feature
        this.registerFeature('errorBoundary', {
            name: 'Error Boundary',
            description: 'Global error handling and recovery',
            enabled: true,
            allowedIn: ['all'],
            dependencies: [],
            autoEnable: true
        });
        
        // Performance Optimization Feature
        this.registerFeature('performanceOptimization', {
            name: 'Performance Optimization',
            description: 'Performance monitoring and optimization',
            enabled: true,
            allowedIn: ['all'],
            dependencies: [],
            autoEnable: true
        });
        
        // Spaced Repetition Feature
        this.registerFeature('spacedRepetition', {
            name: 'Spaced Repetition',
            description: 'Intelligent learning algorithm',
            enabled: true,
            allowedIn: ['game', 'welcome'],
            dependencies: [],
            autoEnable: true
        });
        
        // Adaptive Learning Feature
        this.registerFeature('adaptiveLearning', {
            name: 'Adaptive Learning',
            description: 'Difficulty adjustment based on performance',
            enabled: true,
            allowedIn: ['game'],
            dependencies: ['analytics'],
            autoEnable: true
        });
        
        this.initialized = true;
        console.log('✅ Default features initialized');
    }
    
    /**
     * Register a new feature
     */
    registerFeature(featureId, config) {
        if (this.features.has(featureId)) {
            console.warn(`⚠️ Feature ${featureId} already registered, updating config`);
        }
        
        this.features.set(featureId, {
            id: featureId,
            ...config,
            createdAt: Date.now(),
            lastUsed: null,
            usageCount: 0
        });
        
        // Set initial state
        this.featureStates.set(featureId, {
            enabled: config.enabled,
            active: false,
            lastEnabled: config.enabled ? Date.now() : null
        });
        
        console.log(`✅ Feature registered: ${config.name} (${featureId})`);
    }
    
    /**
     * Check if a feature is enabled
     */
    isFeatureEnabled(featureId) {
        const feature = this.features.get(featureId);
        const state = this.featureStates.get(featureId);
        
        if (!feature || !state) {
            console.warn(`⚠️ Feature ${featureId} not found`);
            return false;
        }
        
        return state.enabled;
    }
    
    /**
     * Check if a feature can be used in current context
     */
    canUseFeature(featureId, context = 'all') {
        const feature = this.features.get(featureId);
        
        if (!feature) {
            return false;
        }
        
        if (!this.isFeatureEnabled(featureId)) {
            return false;
        }
        
        // Check if feature is allowed in current context
        if (feature.allowedIn.includes('all') || feature.allowedIn.includes(context)) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Enable/disable a feature
     */
    toggleFeature(featureId, forceState = null) {
        const feature = this.features.get(featureId);
        const state = this.featureStates.get(featureId);
        
        if (!feature || !state) {
            console.error(`❌ Feature ${featureId} not found`);
            return false;
        }
        
        const newState = forceState !== null ? forceState : !state.enabled;
        state.enabled = newState;
        state.lastEnabled = newState ? Date.now() : null;
        
        // Check dependencies
        if (newState && feature.dependencies) {
            const missingDeps = feature.dependencies.filter(dep => !this.isFeatureEnabled(dep));
            if (missingDeps.length > 0) {
                console.warn(`⚠️ Feature ${featureId} has missing dependencies: ${missingDeps.join(', ')}`);
                state.enabled = false;
                return false;
            }
        }
        
        console.log(`${newState ? '✅' : '❌'} Feature ${feature.name} ${newState ? 'enabled' : 'disabled'}`);
        return true;
    }
    
    /**
     * Get feature usage statistics
     */
    getFeatureStats(featureId) {
        const feature = this.features.get(featureId);
        const state = this.featureStates.get(featureId);
        
        if (!feature || !state) {
            return null;
        }
        
        return {
            id: featureId,
            name: feature.name,
            enabled: state.enabled,
            active: state.active,
            usageCount: feature.usageCount,
            lastUsed: feature.lastUsed,
            lastEnabled: state.lastEnabled,
            createdAt: feature.createdAt,
            allowedIn: feature.allowedIn,
            dependencies: feature.dependencies
        };
    }
    
    /**
     * Get all features summary
     */
    getAllFeaturesSummary() {
        const summary = [];
        
        for (const [featureId, feature] of this.features) {
            const state = this.featureStates.get(featureId);
            summary.push({
                id: featureId,
                name: feature.name,
                enabled: state.enabled,
                active: state.active,
                usageCount: feature.usageCount,
                allowedIn: feature.allowedIn
            });
        }
        
        return summary;
    }
    
    /**
     * Record feature usage
     */
    recordFeatureUsage(featureId, context = 'unknown') {
        const feature = this.features.get(featureId);
        
        if (!feature) {
            return false;
        }
        
        feature.usageCount++;
        feature.lastUsed = Date.now();
        
        const state = this.featureStates.get(featureId);
        if (state) {
            state.active = true;
        }
        
        console.log(`📊 Feature usage recorded: ${feature.name} in ${context}`);
        return true;
    }
    
    /**
     * Reset feature to default state
     */
    resetFeature(featureId) {
        const feature = this.features.get(featureId);
        const state = this.featureStates.get(featureId);
        
        if (!feature || !state) {
            return false;
        }
        
        state.enabled = feature.autoEnable;
        state.active = false;
        state.lastEnabled = feature.autoEnable ? Date.now() : null;
        
        feature.usageCount = 0;
        feature.lastUsed = null;
        
        console.log(`🔄 Feature ${feature.name} reset to default state`);
        return true;
    }
    
    /**
     * Export feature configuration
     */
    exportConfiguration() {
        const config = {
            version: '1.0.0',
            timestamp: Date.now(),
            features: Array.from(this.features.values()),
            states: Array.from(this.featureStates.entries())
        };
        
        return config;
    }
    
    /**
     * Import feature configuration
     */
    importConfiguration(config) {
        try {
            if (config.features) {
                for (const featureConfig of config.features) {
                    this.registerFeature(featureConfig.id, featureConfig);
                }
            }
            
            if (config.states) {
                for (const [featureId, state] of config.states) {
                    const currentState = this.featureStates.get(featureId);
                    if (currentState) {
                        Object.assign(currentState, state);
                    }
                }
            }
            
            console.log('✅ Feature configuration imported successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to import feature configuration:', error);
            return false;
        }
    }
}

// Export to global scope
window.FeatureManager = FeatureManager;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.featureManager = new FeatureManager();
    });
} else {
    window.featureManager = new FeatureManager();
}

console.log('🎛️ Feature Manager system loaded');

