/**
 * Centralized Logging System for TOEIC Master Pro
 * Controls console output levels and reduces noise
 */

class Logger {
    constructor() {
        this.levels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3
        };
        
        // Set default log level (only errors and warnings)
        this.currentLevel = this.levels.WARN;
        
        // Check if debug mode is enabled
        if (localStorage.getItem('toeic_debug_mode') === 'true') {
            this.currentLevel = this.levels.DEBUG;
        }
        
        // Check URL parameter for debug mode
        if (new URLSearchParams(window.location.search).get('debug') === 'true') {
            this.currentLevel = this.levels.DEBUG;
        }
    }
    
    error(message, ...args) {
        if (this.currentLevel >= this.levels.ERROR) {
            console.error(`❌ ${message}`, ...args);
        }
    }
    
    warn(message, ...args) {
        if (this.currentLevel >= this.levels.WARN) {
            console.warn(`⚠️ ${message}`, ...args);
        }
    }
    
    info(message, ...args) {
        if (this.currentLevel >= this.levels.INFO) {
            console.log(`ℹ️ ${message}`, ...args);
        }
    }
    
    debug(message, ...args) {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.log(`🐛 ${message}`, ...args);
        }
    }
    
    success(message, ...args) {
        if (this.currentLevel >= this.levels.INFO) {
            console.log(`✅ ${message}`, ...args);
        }
    }
    
    // System initialization logs (always show)
    system(message, ...args) {
        console.log(`🚀 ${message}`, ...args);
    }
    
    // Critical errors (always show)
    critical(message, ...args) {
        console.error(`🚨 ${message}`, ...args);
    }
    
    // Set log level
    setLevel(level) {
        if (typeof level === 'string') {
            this.currentLevel = this.levels[level.toUpperCase()] || this.levels.WARN;
        } else {
            this.currentLevel = level;
        }
    }
    
    // Enable debug mode
    enableDebug() {
        this.currentLevel = this.levels.DEBUG;
        localStorage.setItem('toeic_debug_mode', 'true');
    }
    
    // Disable debug mode
    disableDebug() {
        this.currentLevel = this.levels.WARN;
        localStorage.removeItem('toeic_debug_mode');
    }
}

// Create global logger instance
window.logger = new Logger();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Logger;
}

console.log('📝 Logger system initialized');


