/**
 * Centralized Logging Configuration
 * Controls what gets logged across all systems
 */

class LoggingConfig {
    constructor() {
        this.config = {
            // System initialization logs
            systemInit: false,
            
            // Feature registration logs
            featureRegistration: false,
            
            // Data loading logs
            dataLoading: false,
            
            // Performance logs (keep only warnings/errors)
            performance: {
                enabled: true,
                level: 'error' // Only show performance errors
            },
            
            // Analytics logs
            analytics: false,
            
            // Game engine logs
            gameEngine: false,
            
            // Audio system logs
            audio: false,
            
            // Time tracking logs
            timeTracking: false,
            
            // Carousel logs
            carousel: false,
            
            // Language manager logs
            languageManager: false,
            
            // Mobile optimization logs
            mobileOptimization: false,
            
            // Error boundary logs (keep enabled)
            errorBoundary: {
                enabled: true,
                level: 'error'
            },
            
            // Real-time monitor logs (keep only errors)
            realTimeMonitor: {
                enabled: true,
                level: 'error'
            },
            
            // Debug mode (can be enabled via URL parameter ?debug=true)
            debug: this.isDebugMode()
        };
        
        this.originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info
        };
        
        this.setupConsoleOverrides();
        
        // Show debug indicator if debug mode is already enabled
        if (this.config.debug) {
            this.showDebugIndicator(true);
        }
    }
    
    isDebugMode() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('debug') === 'true' || localStorage.getItem('debugMode') === 'true';
    }
    
    setupConsoleOverrides() {
        // Override console methods to respect our configuration
        console.log = (...args) => {
            if (this.shouldLog('log', args)) {
                this.originalConsole.log(...args);
            }
        };
        
        console.info = (...args) => {
            if (this.shouldLog('info', args)) {
                this.originalConsole.info(...args);
            }
        };
        
        console.warn = (...args) => {
            if (this.shouldLog('warn', args)) {
                this.originalConsole.warn(...args);
            }
        };
        
        console.error = (...args) => {
            // Always show errors
            this.originalConsole.error(...args);
        };
    }
    
    shouldLog(level, args) {
        const message = args.join(' ');
        
        // Always show errors
        if (level === 'error') return true;
        
        // Check debug mode
        if (this.config.debug) return true;
        
        // Check specific system logs
        if (this.isSystemInitLog(message) && !this.config.systemInit) return false;
        if (this.isFeatureRegistrationLog(message) && !this.config.featureRegistration) return false;
        if (this.isDataLoadingLog(message) && !this.config.dataLoading) return false;
        if (this.isAnalyticsLog(message) && !this.config.analytics) return false;
        if (this.isGameEngineLog(message) && !this.config.gameEngine) return false;
        if (this.isAudioLog(message) && !this.config.audio) return false;
        if (this.isTimeTrackingLog(message) && !this.config.timeTracking) return false;
        if (this.isCarouselLog(message) && !this.config.carousel) return false;
        if (this.isLanguageManagerLog(message) && !this.config.languageManager) return false;
        if (this.isMobileOptimizationLog(message) && !this.config.mobileOptimization) return false;
        
        // Performance logs
        if (this.isPerformanceLog(message)) {
            if (!this.config.performance.enabled) return false;
            if (this.config.performance.level === 'error' && level !== 'error') return false;
            if (this.config.performance.level === 'warn' && level === 'info') return false;
        }
        
        // Real-time monitor logs
        if (this.isRealTimeMonitorLog(message)) {
            if (!this.config.realTimeMonitor.enabled) return false;
            if (this.config.realTimeMonitor.level === 'error' && level !== 'error') return false;
        }
        
        // Error boundary logs
        if (this.isErrorBoundaryLog(message)) {
            if (!this.config.errorBoundary.enabled) return false;
            if (this.config.errorBoundary.level === 'error' && level !== 'error') return false;
        }
        
        return true;
    }
    
    // Log type detection methods
    isSystemInitLog(message) {
        return message.includes('initialized') || 
               message.includes('system loaded') || 
               message.includes('System loaded') ||
               message.includes('✅') ||
               message.includes('🚀') ||
               message.includes('📱 Initializing') ||
               message.includes('📚 Initializing') ||
               message.includes('🎮 Initializing') ||
               message.includes('📊 Initializing') ||
               message.includes('🕐 Initializing') ||
               message.includes('📈 Initializing') ||
               message.includes('🎨 Initializing') ||
               message.includes('🔧') ||
               message.includes('🎯') ||
               message.includes('📝') ||
               message.includes('💡') ||
               message.includes('🎵') ||
               message.includes('🎧') ||
               message.includes('🔊') ||
               message.includes('🧠') ||
               message.includes('📚') ||
               message.includes('📖') ||
               message.includes('🎠') ||
               message.includes('🌍') ||
               message.includes('⚙️') ||
               message.includes('🎛️') ||
               message.includes('🛡️') ||
               message.includes('⚡') ||
               message.includes('💾') ||
               message.includes('📦') ||
               message.includes('🎯') ||
               message.includes('🔗') ||
               message.includes('🏠') ||
               message.includes('🗑️') ||
               message.includes('🔄') ||
               message.includes('📄') ||
               message.includes('📍') ||
               message.includes('💾 Timezone') ||
               message.includes('📊 Session') ||
               message.includes('🗣️ Selected voice') ||
               message.includes('Device type changed') ||
               message.includes('Autoplay started') ||
               message.includes('Language applied') ||
               message.includes('Navbar language') ||
               message.includes('Service Worker') ||
               message.includes('Cache cleared') ||
               message.includes('LocalStorage cleared') ||
               message.includes('Memory:') ||
               message.includes('Performance monitoring') ||
               message.includes('App loaded in') ||
               message.includes('Default settings') ||
               message.includes('Statistics updated') ||
               message.includes('Global event listeners') ||
               message.includes('UI Manager ready') ||
               message.includes('Game count text') ||
               message.includes('Welcome screen') ||
               message.includes('carousel initialized') ||
               message.includes('moved to slide');
    }
    
    isFeatureRegistrationLog(message) {
        return message.includes('Feature registered') || 
               message.includes('✅ Feature registered');
    }
    
    isDataLoadingLog(message) {
        return message.includes('Loading') || 
               message.includes('Loaded') || 
               message.includes('📚 Loading') ||
               message.includes('📄 CSV') ||
               message.includes('📊 Total') ||
               message.includes('✅ Loaded');
    }
    
    isAnalyticsLog(message) {
        return message.includes('📊 Analytics') || 
               message.includes('Analytics Dashboard') ||
               message.includes('Advanced Analytics');
    }
    
    isGameEngineLog(message) {
        return message.includes('🎮 Game') || 
               message.includes('Game Engine') ||
               message.includes('Game initialized');
    }
    
    isAudioLog(message) {
        return message.includes('🔊 Audio') || 
               message.includes('Audio System') ||
               message.includes('🎵 Audio') ||
               message.includes('🗣️ Selected voice');
    }
    
    isTimeTrackingLog(message) {
        return message.includes('🕐 Time') || 
               message.includes('Time Tracking') ||
               message.includes('📍 Location') ||
               message.includes('🌍 Detected timezone') ||
               message.includes('💾 Timezone data');
    }
    
    isCarouselLog(message) {
        return message.includes('🎠 Carousel') || 
               message.includes('Carousel System') ||
               message.includes('Autoplay started');
    }
    
    isLanguageManagerLog(message) {
        return message.includes('🌍 Language') || 
               message.includes('Language Manager') ||
               message.includes('Language applied');
    }
    
    isMobileOptimizationLog(message) {
        return message.includes('📱 Mobile') || 
               message.includes('Mobile Optimization') ||
               message.includes('Device type changed');
    }
    
    isPerformanceLog(message) {
        return message.includes('📊 TTFB') || 
               message.includes('📊 CLS') ||
               message.includes('📊 FCP') ||
               message.includes('📊 LCP') ||
               message.includes('Performance') ||
               message.includes('⚡ Performance') ||
               message.includes('📦 Module loaded') ||
               message.includes('LCP:') ||
               message.includes('TTFB:') ||
               message.includes('CLS:') ||
               message.includes('FCP:') ||
               message.includes('is slow') ||
               message.includes('optimizing') ||
               message.includes('needs-improvement') ||
               message.includes('good') ||
               message.includes('Performance Alert') ||
               message.includes('threshold:');
    }
    
    isRealTimeMonitorLog(message) {
        return message.includes('📊 Real-Time') || 
               message.includes('Real-Time Monitor') ||
               message.includes('Performance Alert');
    }
    
    isErrorBoundaryLog(message) {
        return message.includes('🛡️ Error Boundary') || 
               message.includes('Error Boundary');
    }
    
    // Public methods to control logging
    enableDebugMode() {
        this.config.debug = true;
        localStorage.setItem('debugMode', 'true');
        console.log('🐛 Debug mode enabled - All logs will now be visible');
        this.showDebugIndicator(true);
    }
    
    disableDebugMode() {
        this.config.debug = false;
        localStorage.removeItem('debugMode');
        console.log('🐛 Debug mode disabled - Only errors and warnings will be shown');
        this.showDebugIndicator(false);
    }
    
    showDebugIndicator(show) {
        // Create or update debug indicator
        let indicator = document.getElementById('debugModeIndicator');
        if (show && !indicator) {
            indicator = document.createElement('div');
            indicator.id = 'debugModeIndicator';
            indicator.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(255, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: bold;
                z-index: 10000;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            `;
            indicator.innerHTML = '🐛 DEBUG MODE';
            document.body.appendChild(indicator);
        } else if (!show && indicator) {
            indicator.remove();
        }
    }
    
    enableSystemLogs() {
        this.config.systemInit = true;
        this.config.featureRegistration = true;
        this.config.dataLoading = true;
    }
    
    disableSystemLogs() {
        this.config.systemInit = false;
        this.config.featureRegistration = false;
        this.config.dataLoading = false;
    }
    
    // Restore original console
    restoreConsole() {
        console.log = this.originalConsole.log;
        console.info = this.originalConsole.info;
        console.warn = this.originalConsole.warn;
        console.error = this.originalConsole.error;
    }
}

// Initialize logging configuration
window.loggingConfig = new LoggingConfig();

// Add global functions for easy access
window.enableDebugMode = () => window.loggingConfig.enableDebugMode();
window.disableDebugMode = () => window.loggingConfig.disableDebugMode();
window.enableSystemLogs = () => window.loggingConfig.enableSystemLogs();
window.disableSystemLogs = () => window.loggingConfig.disableSystemLogs();

console.log('🔧 Logging configuration loaded - Only errors and warnings will be shown');
