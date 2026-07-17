// Main Application Controller for TOEIC Master Pro
// Orchestrates all components and manages application state

class App {
    constructor() {
        this.version = '3.0.0';
        this.isInitialized = false;
        this.currentTOEICModule = null;
        this.sessionData = [];
        this.startTime = Date.now();
        this.isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        
        window.logger?.system(`TOEIC Master Pro v${this.version} - Starting...`);
        
        // Production optimizations
        if (this.isProduction) {
            this.enableProductionMode();
        }
        
        // Wait for DOM to be ready before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initialize();
            });
        } else {
        this.initialize();
        }
    }
    
    // Enable production mode optimizations
    enableProductionMode() {
        console.log('🚀 Production mode enabled');
        
        // Disable debug logging in production
        if (window.logger) {
            window.logger.setLevel('error');
        }
        
        // Optimize performance monitoring
        if (window.performanceOptimizer && typeof window.performanceOptimizer.enableProductionMode === 'function') {
            window.performanceOptimizer.enableProductionMode();
        }
        
        // Set production environment flag
        window.isProduction = true;
        
        // Production configuration
        window.productionConfig = {
            enableAdminDashboard: true,
            enableRealTimeTracking: true,
            enableAnalytics: true,
            enablePWA: true,
            cacheDuration: 31536000,
            realTimeUpdateInterval: 2000,
            maxStudentActivities: 50,
            sessionTimeout: 3600000,
            maxLoginAttempts: 5
        };
        
        // Apply production optimizations
        this.applyProductionOptimizations();
    }
    
    // Apply production-specific optimizations
    applyProductionOptimizations() {
        // Optimize admin dashboard for production
        if (window.adminDashboard) {
            window.adminDashboard.setProductionMode(true);
        }
        
        // Optimize real-time tracking
        if (window.adminDashboard && window.productionConfig) {
            window.adminDashboard.updateInterval = window.productionConfig.realTimeUpdateInterval;
        }
        
        // Enable service worker for PWA (http/https only - the desktop app
        // shell serves over a custom protocol where SWs are unsupported)
        if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && window.productionConfig.enablePWA) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered in production');
                })
                .catch(error => {
                    console.log('⚠️ Service Worker registration failed:', error);
                });
        }
    }
    
    // Check user authentication
    checkAuthentication() {
        // If we're on the login page, don't check authentication
        if (window.location.pathname === '/login.html' || window.location.pathname.includes('login.html')) {
            return true;
        }
        
        // Wait for login system to be available
        if (!window.loginSystem) {
            console.log('⏳ Waiting for login system to load...');
            // Wait a bit and try again
            setTimeout(() => {
                if (!window.loginSystem) {
                    console.error('❌ Login system not available after timeout');
                    // Redirect to login page
                    window.location.href = 'login.html';
                } else {
                    this.checkAuthentication();
                }
            }, 500);
            return false;
        }
        
        // Check if user is logged in
        if (!window.loginSystem.isLoggedIn()) {
            console.log('🔐 User not authenticated, redirecting to login...');
            window.location.href = 'login.html';
            return false;
        }
        
        // User is authenticated, show welcome message
        this.showWelcomeMessage();
        return true;
    }
    
    // Show welcome message for authenticated user
    showWelcomeMessage() {
        const welcomeInfo = window.loginSystem.getWelcomeMessage();
        console.log('👋 Welcome message:', welcomeInfo.greeting);
        
        // Show welcome notification
        this.showWelcomeNotification(welcomeInfo);
        
        // Update UI with user info
        this.updateUserInterface(welcomeInfo);
    }
    
    // Show welcome notification
    showWelcomeNotification(welcomeInfo) {
        // Create welcome notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-4 rounded-xl shadow-lg transform transition-all duration-500 ease-out';
        notification.style.transform = 'translateX(100%)';
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="text-2xl">👋</div>
                <div>
                    <div class="font-semibold text-lg">${welcomeInfo.greeting}</div>
                    <div class="text-sm opacity-90">${t('welcome.ready')}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-white/80 hover:text-white text-xl ml-2">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 5000);
    }
    
    // Update UI with user information
    updateUserInterface(welcomeInfo) {
        // Update page title with user name
        document.title = `TOEIC Master Pro - Welcome ${welcomeInfo.name}`;
        
        // Add user info INSIDE the navbar flex row — appending to the
        // <nav> itself created a second row that made the fixed navbar
        // taller than the main content's top padding, hiding buttons
        const navbar = document.querySelector('nav .navbar-content') || document.querySelector('nav');
        if (navbar) {
            const userInfo = document.createElement('div');
            userInfo.className = 'navbar-user-info flex items-center space-x-2 text-white/90';
            
            // Add admin dashboard button if user is admin
            const adminButton = welcomeInfo.isAdmin ? `
                <button id="adminDashboardBtn" class="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-xs transition-colors flex items-center space-x-1">
                    <span>👨‍💼</span>
                    <span data-i18n="common.adminPanel">${t('common.adminPanel')}</span>
                </button>
            ` : '';
            
            userInfo.innerHTML = `
                <span class="text-sm" data-i18n="common.welcome">${t('common.welcome')}</span>
                <span class="font-semibold">${welcomeInfo.name}</span>
                <span class="px-2 py-1 text-xs rounded-full ${welcomeInfo.isAdmin ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}">
                    ${welcomeInfo.role}
                </span>
                ${adminButton}
                <button onclick="window.app.logout()" class="text-white/70 hover:text-white text-sm underline" data-i18n="common.logout">${t('common.logout')}</button>
            `;
            navbar.appendChild(userInfo);
            
            // Add admin dashboard functionality
            if (welcomeInfo.isAdmin) {
                const adminBtn = document.getElementById('adminDashboardBtn');
                if (adminBtn) {
                    adminBtn.addEventListener('click', () => {
                        this.showAdminDashboard();
                    });
                }
            }
        }
    }
    
    // Show admin dashboard
    showAdminDashboard() {
        if (!window.loginSystem || !window.loginSystem.isAdmin()) {
            console.error('❌ Admin access required');
            return;
        }
        
        if (window.adminDashboard) {
            window.adminDashboard.showDashboard();
        } else {
            console.error('❌ Admin dashboard not available');
        }
    }
    
    // Track student activity (called throughout the app)
    trackStudentActivity(activityType, data = {}) {
        if (!window.loginSystem || !window.loginSystem.isLoggedIn()) {
            return;
        }
        
        const currentUser = window.loginSystem.getCurrentUser();
        if (!currentUser) return;
        
        // Only track if admin dashboard is available
        if (window.adminDashboard) {
            window.adminDashboard.trackStudentActivity(
                currentUser.username,
                activityType,
                {
                    ...data,
                    name: currentUser.displayName,
                    role: currentUser.role
                }
            );
        }
    }
    
    // Track session updates
    trackSessionUpdate(sessionType, status, data = {}) {
        if (!window.loginSystem || !window.loginSystem.isLoggedIn()) {
            return;
        }
        
        const currentUser = window.loginSystem.getCurrentUser();
        if (!currentUser) return;
        
        if (window.adminDashboard) {
            window.adminDashboard.trackSessionUpdate(
                currentUser.username,
                sessionType,
                status,
                data
            );
        }
    }
    
    // Track performance updates
    trackPerformanceUpdate(scores, completionRate) {
        if (!window.loginSystem || !window.loginSystem.isLoggedIn()) {
            return;
        }
        
        const currentUser = window.loginSystem.getCurrentUser();
        if (!currentUser) return;
        
        if (window.adminDashboard) {
            window.adminDashboard.trackPerformanceUpdate(
                currentUser.username,
                scores,
                completionRate
            );
        }
    }
    
    // Logout user
    logout() {
        if (window.loginSystem) {
            window.loginSystem.logout();
        }
        // Redirect to login page
        window.location.href = 'login.html';
    }
    
    async initialize() {
        let initTimeout;
        try {
            // Set a timeout for initialization to prevent hanging
            initTimeout = setTimeout(() => {
                console.error('❌ Initialization timeout - forcing app to load');
                this.forceAppLoad();
            }, 30000); // 30 second timeout
            
            // Check authentication first
            if (!this.checkAuthentication()) {
                clearTimeout(initTimeout);
                return;
            }
            
            // Show loading screen
            this.updateLoadingProgress(5, 'Initializing application...');
            
            // Initialize core systems
            await this.initializePWA();
            this.updateLoadingProgress(15, 'Setting up offline support...');

            // Initialize TOEIC systems
            await this.initializeTOEICSystems();
            this.updateLoadingProgress(40, 'Setting up TOEIC modules...');
            
            // Initialize new advanced systems
            await this.initializeSpacedRepetition();
            this.updateLoadingProgress(45, 'Setting up learning algorithms...');
            
            await this.initializeAudioSystem();
            this.updateLoadingProgress(55, 'Configuring audio features...');
            
            // await this.initializeGamificationSystem(); // Removed - system deleted
            this.updateLoadingProgress(70, 'Setting up advanced features...');
            
            await this.initializeAdvancedAnalytics();
            this.updateLoadingProgress(75, 'Setting up analytics...');
            
            await this.initializeTimeTracking();
            this.updateLoadingProgress(77, 'Setting up time tracking...');
            
            await this.initializeEnhancedProgress();
            this.updateLoadingProgress(80, 'Setting up progress tracking...');

            this.initializeUIManager();
            this.updateLoadingProgress(95, 'Finalizing setup...');
            
            // Setup global event listeners and complete initialization
            this.setupGlobalEventListeners();
            this.applyUserSettings();
            this.updateGameStatistics();
            this.setupPerformanceMonitoring();
            
            this.updateLoadingProgress(100, 'Ready to learn!');
            
            // Hide loading screen and show app
            setTimeout(() => {
                this.hideLoadingScreen();
                this.showWelcomeScreen();
                this.isInitialized = true;
                window.logger?.success('WordMaster Pro initialized successfully!');
            }, 500);
            
            // Emergency timeout to prevent infinite loading
            setTimeout(() => {
                if (!this.isInitialized) {
                    console.warn('⚠️ Emergency: Force hiding loading screen');
                    this.hideLoadingScreen();
                    this.showWelcomeScreen();
                    this.isInitialized = true;
                }
            }, 2000);
            
            // ULTRA EMERGENCY: Force show after 1 second regardless
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
                    console.warn('🚨 ULTRA EMERGENCY: Destroying loading screen!');
                    loadingScreen.remove();
                    const welcomeScreen = document.getElementById('welcomeScreen');
                    if (welcomeScreen) {
                        welcomeScreen.classList.remove('hidden');
                    }
                }
            }, 1000);

        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.handleInitializationError(error);
        } finally {
            // Clear the timeout
            if (initTimeout) {
                clearTimeout(initTimeout);
            }
        }
    }

    forceAppLoad() {
        console.log('🚀 Force loading app...');
        // Hide loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }

        // Show main content
        const mainContent = document.getElementById('app');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        // Initialize basic functionality
        this.showWelcomeScreen();
        console.log('✅ App force loaded successfully');
    }
    
    async initializePWA() {
        console.log('📱 Initializing PWA...');
        try {
            if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
                // Set timeout to prevent hanging
                const registrationPromise = navigator.serviceWorker.register('./sw.js');
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Service Worker timeout')), 3000)
                );
                
                await Promise.race([registrationPromise, timeoutPromise]);
                console.log('✅ Service Worker registered');
            }
        } catch (error) {
            console.warn('⚠️ PWA initialization failed (continuing anyway):', error);
            // Don't block app initialization for PWA issues
        }
    }
    
    async initializeTOEICSystems() {
        window.logger?.info('Initializing TOEIC Systems...');
        
        // Initialize TOEIC Vocabulary System
        if (window.TOEICVocabularySystem) {
            window.toeicVocabulary = new window.TOEICVocabularySystem();
            window.logger?.debug('TOEIC Vocabulary System initialized');
        }
        
        // Initialize TOEIC Reading System
        if (window.TOEICReadingSystem) {
            window.toeicReading = new window.TOEICReadingSystem();
            window.logger?.debug('TOEIC Reading System initialized');
        }
        

        
        // Initialize TOEIC Test Simulator
        if (window.TOEICTestSimulator) {
            window.toeicTestSimulator = new window.TOEICTestSimulator();
            window.logger?.debug('TOEIC Test Simulator initialized');
        }
        
        // Initialize TOEIC Grammar System
        if (window.TOEICGrammarSystem) {
            window.toeicGrammar = new window.TOEICGrammarSystem();
            window.logger?.debug('TOEIC Grammar System initialized');
        }
        
        // TOEIC Study Strategies removed - not used in current implementation
        
        // Initialize Advanced Analytics System
        if (window.advancedAnalytics) {
            window.logger?.debug('Advanced Analytics System initialized');
        } else {
            console.warn('⚠️ Advanced Analytics not available, continuing without it');
        }
        
        // Initialize Analytics Dashboard
        if (window.AnalyticsDashboard) {
            window.analyticsDashboard = new window.AnalyticsDashboard();
            await window.analyticsDashboard.init();
            window.logger?.debug('Analytics Dashboard initialized');
        }
        
        // TOEIC Progress Analytics removed - not used in current implementation
    }
    
    async initializeSpacedRepetition() {
        window.logger?.info('Initializing Spaced Repetition System...');
        
        // Optimized waiting with reduced timeout and intervals
        const maxAttempts = 20;  // Reduced from 50
        const interval = 50;      // Reduced from 100ms
        
        for (let attempts = 0; attempts < maxAttempts; attempts++) {
            if (window.SpacedRepetitionSystem) {
                this.spacedRepetition = new window.SpacedRepetitionSystem();
                window.spacedRepetition = this.spacedRepetition;
                window.logger?.debug('Spaced Repetition System initialized');
                return;
            }
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        
        console.warn('⚠️ Spaced Repetition System not available, continuing without it');
    }
    
    async initializeAudioSystem() {
        window.logger?.info('Initializing Audio System...');
        
        // Optimized waiting
        const maxAttempts = 20;
        const interval = 50;
        
        for (let attempts = 0; attempts < maxAttempts; attempts++) {
            if (window.AudioSystem) break;
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        
        if (window.AudioSystem) {
            this.audioSystem = new window.AudioSystem();
            window.audioSystem = this.audioSystem;
            console.log('✅ Audio System initialized');
            
            // Setup keyboard shortcuts for audio
            document.addEventListener('keydown', (event) => {
                this.audioSystem.handleKeyboardShortcuts(event);
            });
        } else {
            console.warn('⚠️ Audio System not available, continuing without it');
        }
    }
    
    // async initializeGamificationSystem() {
    //     // Removed - gamification system was deleted
    //     console.log('🎮 Gamification System removed');
    // }
    
    async initializeAdvancedAnalytics() {
        console.log('📊 Initializing Advanced Analytics...');
        
        // Wait for advancedAnalytics to be available
        for (let attempts = 0; attempts < 20; attempts++) {
            if (window.advancedAnalytics) break;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        if (window.advancedAnalytics) {
            this.advancedAnalytics = window.advancedAnalytics;
            console.log('✅ Advanced Analytics initialized');
        } else {
            console.warn('⚠️ Advanced Analytics not available, continuing without it');
        }
    }
    
    async initializeTimeTracking() {
        console.log('🕐 Initializing Time Tracking...');
        
        // Wait for time tracking system to be available
        for (let attempts = 0; attempts < 20; attempts++) {
            if (window.timeTracker) break;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        if (window.timeTracker) {
            this.timeTracker = window.timeTracker;
            console.log('✅ Time Tracking initialized');
            
            // Add time displays to key areas
            this.addTimeDisplays();
            
            // Track app initialization
            this.timeTracker.addToTimeline('app_initialized', {
                version: '3.0.0',
                userAgent: navigator.userAgent
            });
        } else {
            console.warn('⚠️ Time Tracking not available, continuing without it');
        }
    }
    
    addTimeDisplays() {
        // Time displays are now handled in the HTML template
        // This method is kept for compatibility but the main time display is in the navbar
        console.log('✅ Time displays are integrated in the navbar');
    }
    
    async initializeEnhancedProgress() {
        console.log('📈 Initializing Enhanced Progress...');
        
        // Wait for EnhancedProgress to be available
        for (let attempts = 0; attempts < 20; attempts++) {
            if (window.EnhancedProgress) break;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        if (window.EnhancedProgress) {
            this.enhancedProgress = new window.EnhancedProgress();
            window.enhancedProgress = this.enhancedProgress;
            console.log('✅ Enhanced Progress initialized');
        } else {
            console.warn('⚠️ Enhanced Progress not available, continuing without it');
        }
    }
    
    initializeUIManager() {
        console.log('🎨 UI Manager ready');
        if (window.UIManager) {
            window.uiManager = new window.UIManager();
        }

        // These modules wait for App to instantiate them (no auto-init)
        if (window.SettingsPanel && !window.settingsPanel) {
            window.settingsPanel = new window.SettingsPanel();
            console.log('⚙️ Settings panel initialized');
        }
        if (window.PWAManager && !window.pwaManager) {
            window.pwaManager = new window.PWAManager();
            console.log('📱 PWA manager initialized');
        }
    }
    
    updateLoadingProgress(percentage, text) {
        const progressBar = document.getElementById('loadingProgress');
        const loadingText = document.getElementById('loadingText');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            // Update ARIA attributes for accessibility
            const container = progressBar.parentElement;
            if (container) {
                container.setAttribute('aria-valuenow', percentage);
            }
        }
        
        if (loadingText && text) {
            loadingText.textContent = text;
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const app = document.getElementById('app');
        
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        if (app) {
            app.classList.remove('hidden');
        }
    }
    
    showWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.classList.remove('hidden');
        }
        
        // Hide all other screens
        document.querySelectorAll('[id$="Screen"]:not(#welcomeScreen)').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Initialize carousels
        this.initializeCarousels();
        
        // Force remove any old buttons that might be cached
        const oldButtons = document.querySelectorAll('button[onclick*="startGame"], button[onclick*="viewAnalytics"]');
        oldButtons.forEach(btn => {
            if (btn.textContent.includes('Start Learning Journey') || btn.textContent.includes('View Analytics')) {
                btn.remove();
                console.log('🗑️ Removed old cached button:', btn.textContent);
            }
        });
        
        console.log('🏠 Welcome screen shown');
    }

    /**
     * Initialize the study dashboard in the hero area (replaces the
     * old decorative hero carousel, which duplicated the module grid)
     */
    initializeCarousels() {
        if (window.studyDashboard && typeof window.studyDashboard.init === 'function') {
            window.studyDashboard.init();
            console.log('📊 Study dashboard rendered');
        } else {
            console.warn('⚠️ Study dashboard not available');
        }
    }
    
    applyUserSettings() {
        // Apply saved user preferences
        const settings = window.safeParseStorage('userSettings', {});
        
        // Apply theme, language, etc.
        if (settings.theme) {
            document.body.className = settings.theme;
        }
        
        console.log('⚙️ Default settings applied');
    }
    
    updateGameStatistics() {
        // Update various statistics displays
        const stats = this.getGameStatistics();
        
        // Update status bar if visible
        if (window.uiManager) {
            window.uiManager.updateStatusBar({
                score: stats.totalScore,
                level: stats.currentLevel,
                streak: stats.currentStreak
            });
        }
        
        console.log('📊 Statistics updated');
    }
    
    getGameStatistics() {
        const sessions = window.safeParseStorage('studySessions', []);
        const totalSessions = sessions.length;
        const totalScore = sessions.reduce((sum, session) => sum + (session.score || 0), 0);
        const currentStreak = this.calculateCurrentStreak(sessions);
        
        return {
            totalSessions,
            totalScore,
            currentStreak,
            currentLevel: 'A1' // This should come from adaptive learning
        };
    }
    
    calculateCurrentStreak(sessions) {
        // Calculate current daily study streak over unique study days,
        // so multiple sessions on the same day don't break the count
        const uniqueDays = [...new Set(sessions.map(s => new Date(s.date).toDateString()))];
        let streak = 0;

        for (let i = uniqueDays.length - 1; i >= 0; i--) {
            const expectedDate = new Date(Date.now() - (streak * 24 * 60 * 60 * 1000)).toDateString();

            if (uniqueDays[i] === expectedDate) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }
    
    setupGlobalEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.handleConnectionChange(true);
        });
        
        window.addEventListener('offline', () => {
            this.handleConnectionChange(false);
        });
        
        console.log('🔗 Global event listeners set up');
    }
    
    handleGlobalKeyboard(event) {
        // Global keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'h':
                    event.preventDefault();
                    this.showHelp();
                    break;
                case 's':
                    event.preventDefault();
                    this.showSettings();
                    break;
                case 'p':
                    event.preventDefault();
                    // Progress dashboard removed
                    break;
            }
        }
        
        // ESC key handling
        if (event.key === 'Escape') {
            this.handleEscapeKey();
        }
    }

    handleEscapeKey() {
        // Modals close themselves; TOEIC modules use their own back buttons.
    }

    handleConnectionChange(isOnline) {
        if (window.uiManager) {
            const message = isOnline ? 
                'Connection restored! All features available.' : 
                'Working offline. Some features may be limited.';
            
            const type = isOnline ? 'success' : 'warning';
            window.uiManager.showToast(message, type);
        }
    }
    
    // TOEIC Module Management
    startTOEICModule(moduleType, options = {}) {
        console.log(`🎯 Starting TOEIC module: ${moduleType}`);

        return safeExecute(() => {
            // The vocabulary CSV loads async at boot; clicking Vocabulary/
            // Flashcards before it resolves used to start an empty session
            // (instant "Session Complete" on 0 words). Retry shortly —
            // either the CSV or the built-in fallback set always arrives.
            if ((moduleType === 'vocabulary' || moduleType === 'flashcards') &&
                window.toeicVocabulary && window.toeicVocabulary.vocabulary.size === 0) {
                setTimeout(() => this.startTOEICModule(moduleType, options), 400);
                return;
            }

            // Remember the last used module for the dashboard's
            // "Continue Learning" card
            try {
                localStorage.setItem('toeicLastModule', JSON.stringify({
                    type: moduleType,
                    timestamp: Date.now()
                }));
            } catch (e) { /* storage full — continue card just won't update */ }

            // Track student activity
            this.trackStudentActivity(`${moduleType}_session_start`, {
                moduleType: moduleType,
                options: options
            });
            
            // Track session update
            this.trackSessionUpdate(moduleType, 'started', options);
            
            // Track time
            if (this.timeTracker) {
                this.timeTracker.addToTimeline('toeic_module_started', {
                    moduleType: moduleType,
                    options: options
                });
            }
            
            // Initialize TOEIC module
            this.currentTOEICModule = moduleType;
            
            switch(moduleType) {
                case 'vocabulary':
                    if (window.toeicVocabulary) {
                        const session = window.toeicVocabulary.startSession({ wordCount: options.wordCount || 20 });
                        this.showTOEICVocabularyInterface(session);
                    }
                    break;
                    
                case 'reading':
                    if (window.toeicReading) {
                        const session = window.toeicReading.startSession({ count: options.count || 20 });
                        this.showTOEICReadingInterface(session);
                    }
                    break;
                    
                    
                case 'test':
                    if (options.type) {
                        // Explicit type requested — start that test directly
                        if (window.toeicTestSimulator) {
                            const test = window.toeicTestSimulator.startTest({ type: options.type });
                            this.showTOEICTestInterface(test);
                        }
                    } else {
                        // Show the test menu (Full / Listening / Reading +
                        // history) instead of dropping the student straight
                        // into a 2-hour full test
                        this.showTOEICModuleScreen('test');
                    }
                    break;
                    
                case 'listening':
                    // Until a dedicated listening practice module ships,
                    // the Listening card runs the listening section of the
                    // test simulator (previously this card did nothing)
                    this.showTOEICModuleScreen('test');
                    this.startListeningTOEICTest();
                    break;

                case 'flashcards':
                    if (window.toeicVocabulary) {
                        this.showTOEICFlashcardInterface();
                    }
                    break;

                case 'grammar':
                    this.showTOEICGrammarInterface();
                    break;

                default:
                    console.warn(`Unknown TOEIC module: ${moduleType}`);
            }
            
            // Track session start
            this.sessionData = [];
            this.sessionStartTime = Date.now();
            
            // Trigger haptic feedback on mobile
            if (window.triggerHaptic) {
                window.triggerHaptic('light');
            }
            
        }, null, 'Failed to start TOEIC module');
    }
    
    // TOEIC Interface Methods
    showTOEICVocabularyInterface(session) {
        console.log('📚 Showing TOEIC Vocabulary Interface');
        
        // Track analytics
        if (window.advancedAnalytics && typeof window.advancedAnalytics.trackEvent === 'function') {
            window.advancedAnalytics.trackEvent('module', 'vocabulary_started', {
                sessionId: session.id,
                wordCount: session.length
            });
        } else {
            console.warn('⚠️ Advanced Analytics not available or trackEvent method missing');
        }
        
        // Hide welcome screen and show vocabulary interface
        this.hideWelcomeScreen();
        this.showVocabularyLearningInterface(session);
    }
    
    showTOEICReadingInterface(session) {
        console.log('📖 Showing TOEIC Reading Interface');
        
        // Track analytics
        if (window.advancedAnalytics && typeof window.advancedAnalytics.trackEvent === 'function') {
            window.advancedAnalytics.trackEvent('module', 'reading_started', {
                sessionId: session.id,
                questionCount: session.length
            });
        } else {
            console.warn('⚠️ Advanced Analytics not available or trackEvent method missing');
        }
        
        this.hideWelcomeScreen();
        this.showTOEICModuleScreen('reading', session);
    }
    
    showTOEICTestInterface(test) {
        console.log('📝 Showing TOEIC Test Interface', test);
        this.hideWelcomeScreen();
        this.showTestInterface(test, test.type);
    }
    
    showTOEICFlashcardInterface() {
        console.log('🃏 Showing TOEIC Flashcard Interface');
        this.hideWelcomeScreen();
        this.showTOEICModuleScreen('flashcards');
    }
    
    showTOEICGrammarInterface() {
        console.log('📚 Showing TOEIC Grammar Interface');
        this.hideWelcomeScreen();
        this.showTOEICModuleScreen('grammar');
    }
    
    showVocabularyLearningInterface(session) {
        // Create or show vocabulary learning screen
        let screen = document.getElementById('vocabularyLearningScreen');
        if (!screen) {
            screen = document.createElement('div');
            screen.id = 'vocabularyLearningScreen';
            screen.className = 'screen';
            const main = document.querySelector('main');
            if (main) {
                main.appendChild(screen);
            } else {
                console.error('❌ Main element not found');
                return;
            }
        }
        
        screen.innerHTML = this.generateVocabularyLearningHTML(session);
        screen.classList.remove('hidden');
        
        // Initialize vocabulary learning functionality
        this.initializeVocabularyLearning();
    }
    
    generateVocabularyLearningHTML(session) {
        return `
            <div class="module-shell">
                <div class="flex items-center justify-between mb-4">
                    <button onclick="window.app.endCurrentSession()" class="module-back-btn" style="margin-bottom: 0;">
                        ← <span data-i18n="common.exitSession">${t('common.exitSession')}</span>
                    </button>
                    <span class="text-sm text-white/60" id="totalVocabularyCount">${t('vocab.loadingVocabulary')}</span>
                </div>

                <!-- Compact session strip: progress + inline counters -->
                <div class="vocab-session-bar">
                    <span class="vocab-counter"><i data-lucide="layers" class="w-4 h-4"></i> <strong id="wordsRemaining">${session.length}</strong></span>
                    <div class="quiz-progress-track"><div class="quiz-progress-fill" id="vocabProgressFill" style="width: 0%"></div></div>
                    <span class="vocab-counter good">✓ <strong id="correctCount">0</strong></span>
                    <span class="vocab-counter bad">✗ <strong id="incorrectCount">0</strong></span>
                    <span class="vocab-counter"><strong id="sessionAccuracy">0%</strong></span>
                </div>

                <!-- The card IS the reveal target -->
                <div id="vocabularyCard" class="flashcard-surface vocab-card" onclick="window.app.revealVocabularyCard()">
                    <div class="vocab-chips">
                        <span class="dashboard-chip" id="wordLevel">B1</span>
                        <span class="dashboard-chip" id="wordCategory">business</span>
                        <span class="dashboard-chip" id="wordFrequency">high</span>
                    </div>
                    <div class="vocab-word-row">
                        <h2 class="flashcard-word" id="currentWord" style="margin-bottom: 0;">${t('quiz.loading')}</h2>
                        <button class="vocab-speak-btn" aria-label="Pronounce"
                                onclick="event.stopPropagation(); window.app.speakCurrentVocabularyWord();">
                            <i data-lucide="volume-2" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <p class="flashcard-definition" id="wordMeaning">${t('vocab.clickToReveal')}</p>

                    <div id="wordExamples" class="hidden vocab-examples">
                        <p class="vocab-examples-title" data-i18n="vocab.exampleSentences">${t('vocab.exampleSentences')}</p>
                        <div class="space-y-3" id="examplesList"></div>
                    </div>

                    <p class="vocab-tap-hint" id="showMeaningBtn">
                        <span data-i18n="vocab.tapHint">${t('vocab.tapHint')}</span>
                        <span class="key-hint">Space</span>
                    </p>
                </div>

                <!-- Know / Don't know: one decision, two big targets, key hints -->
                <div id="answerButtons" class="hidden">
                    <div class="flashcard-actions">
                        <button onclick="window.app.recordVocabularyAnswer(true)" class="flashcard-btn know">
                            <i data-lucide="check" class="w-5 h-5"></i>
                            <span data-i18n="vocab.iKnowIt">${t('vocab.iKnowIt')}</span>
                            <span class="key-hint">→</span>
                        </button>
                        <button onclick="window.app.recordVocabularyAnswer(false)" class="flashcard-btn dont-know">
                            <i data-lucide="x" class="w-5 h-5"></i>
                            <span data-i18n="vocab.iDontKnow">${t('vocab.iDontKnow')}</span>
                            <span class="key-hint">←</span>
                        </button>
                    </div>
                </div>

                <div id="sessionComplete" class="hidden text-center">
                    <div class="quiz-card">
                        <div class="module-header" style="margin-bottom: 16px;">
                            <div class="module-header-icon" aria-hidden="true">🎉</div>
                            <h2 class="module-header-title" data-i18n="vocab.sessionComplete">${t('vocab.sessionComplete')}</h2>
                            <p class="module-header-subtitle" data-i18n="vocab.sessionCompleteDesc">${t('vocab.sessionCompleteDesc')}</p>
                        </div>
                        <div class="module-actions" style="margin-bottom: 0;">
                            <button onclick="window.app.startNewVocabularySession()" class="module-action-btn primary">
                                <span class="module-action-icon"><i data-lucide="refresh-cw" class="w-5 h-5"></i></span>
                                <span class="module-action-text"><span class="module-action-title" data-i18n="vocab.startNewSession">${t('vocab.startNewSession')}</span></span>
                                <i data-lucide="chevron-right" class="w-5 h-5 module-action-chevron"></i>
                            </button>
                            <button onclick="window.app.endCurrentSession()" class="module-action-btn">
                                <span class="module-action-icon"><i data-lucide="home" class="w-5 h-5"></i></span>
                                <span class="module-action-text"><span class="module-action-title" data-i18n="common.backToHome">${t('common.backToHome')}</span></span>
                                <i data-lucide="chevron-right" class="w-5 h-5 module-action-chevron"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    initializeReadingModule() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        content.innerHTML = `
            <div class="module-shell">
                <button class="module-back-btn" onclick="goHome()">
                    <span aria-hidden="true">←</span>
                    <span data-i18n="quiz.backToMenu">${t('quiz.backToMenu')}</span>
                </button>

                <div class="module-header">
                    <span class="toeic-part-badge">READING · PART 7</span>
                    <div class="module-header-icon" aria-hidden="true">📖</div>
                    <h2 class="module-header-title" data-i18n="module.reading.title">${t('module.reading.title')}</h2>
                    <p class="module-header-subtitle" data-i18n="module.reading.desc">${t('module.reading.desc')}</p>
                </div>

                <div class="module-stats">
                    <div class="module-stat">
                        <span class="module-stat-value" id="passagesRead">0</span>
                        <span class="module-stat-label" data-i18n="reading.passagesRead">${t('reading.passagesRead')}</span>
                    </div>
                    <div class="module-stat">
                        <span class="module-stat-value" id="readingAccuracy">0%</span>
                        <span class="module-stat-label" data-i18n="quiz.accuracy">${t('quiz.accuracy')}</span>
                    </div>
                    <div class="module-stat">
                        <span class="module-stat-value" id="readingSpeed">0 WPM</span>
                        <span class="module-stat-label" data-i18n="reading.speed">${t('reading.speed')}</span>
                    </div>
                </div>

                <div class="module-actions">
                    <button onclick="window.startReadingSession()" class="module-action-btn primary">
                        <span class="module-action-icon" aria-hidden="true">📖</span>
                        <div class="module-action-text">
                            <div class="module-action-title" data-i18n="reading.startSession">${t('reading.startSession')}</div>
                            <div class="module-action-desc" data-i18n="reading.comprehensionDesc">${t('reading.comprehensionDesc')}</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                    <button onclick="window.app.showReadingPractice()" class="module-action-btn">
                        <span class="module-action-icon" aria-hidden="true">📝</span>
                        <div class="module-action-text">
                            <div class="module-action-title" data-i18n="reading.practiceMode">${t('reading.practiceMode')}</div>
                            <div class="module-action-desc" data-i18n="reading.quickPracticeDesc">${t('reading.quickPracticeDesc')}</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                </div>
            </div>
        `;
        
        this.updateReadingStats();
    }
    
    showReadingPractice() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        // Start a reading session (10 questions now that the bank is
        // large enough for real variety)
        if (window.toeicReading) {
            const session = window.toeicReading.startSession({ count: 10 });
            this.showReadingInterface(session);
        } else {
            console.error('❌ TOEIC Reading system not available');
        }
    }
    
    // Human label for the document type shown above a passage,
    // matching how real TOEIC labels its Part 7 texts
    getReadingDocLabel(passage) {
        if (!passage) return t('reading.docType.text');
        const title = passage.title || '';
        if (/^memo/i.test(title)) return t('reading.docType.memo');
        if (/^letter/i.test(title)) return t('reading.docType.letter');
        if (/^schedule/i.test(title)) return t('reading.docType.form');
        if (passage.type === 'business_email') return t('reading.docType.email');
        if (passage.type === 'news_article') return t('reading.docType.article');
        if (passage.type === 'advertisement') return t('reading.docType.ad');
        return t('reading.docType.text');
    }

    showReadingInterface(session) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) {
            console.error('❌ toeicModuleContent element not found!');
            return;
        }
        content.classList.remove('hidden');

        const reading = window.toeicReading;
        const question = reading ? reading.peekNextQuestion() : null;

        if (!question) {
            content.innerHTML = `
                <div class="text-center">
                    <h3 class="text-xl font-bold text-white mb-4">${t('reading.noMaterials')}</h3>
                    <p class="text-white/80 mb-6">${t('reading.checkBackLater')}</p>
                    <button onclick="window.app.initializeReadingModule()" class="btn btn-primary">
                        ${t('reading.backToReadingModule')}
                    </button>
                </div>
            `;
            return;
        }

        const pos = reading.getSessionPosition();
        const range = reading.getQuestionGroupRange(reading.currentQuestionIndex);
        const passage = question.passage;
        const companion = question.companionPassage;

        const partBadge = question.type === 'incomplete_sentences'
            ? 'PART 5 · INCOMPLETE SENTENCES'
            : question.type === 'text_completion'
                ? 'PART 6 · TEXT COMPLETION'
                : companion
                    ? 'PART 7 · DOUBLE PASSAGE'
                    : 'PART 7 · READING COMPREHENSION';

        // "Questions 3–6 refer to the following e-mail." — or the part
        // instruction when there is no passage (Part 5 grammar items)
        const referLine = passage
            ? (range && range.end > range.start
                ? t('reading.questionsRefer', { start: range.start, end: range.end })
                : t('reading.questionRefers', { n: pos.current }))
            : t('reading.instrPart5');

        const renderDoc = (p, tag) => `
            <article class="reading-doc">
                <header class="reading-doc-head">
                    ${tag ? `<span class="reading-doc-tag">${tag}</span>` : ''}
                    <span class="reading-doc-type">${this.getReadingDocLabel(p)}</span>
                    ${p.wordCount ? `<span class="reading-doc-words">${t('reading.words', { count: p.wordCount })}</span>` : ''}
                </header>
                <div class="reading-doc-body">${p.content}</div>
            </article>`;

        content.innerHTML = `
            <div class="module-shell reading-shell">
                <div class="quiz-card reading-topbar">
                    <div class="reading-topbar-row">
                        <span class="toeic-part-badge" style="margin-bottom: 0;">${partBadge}</span>
                        <span class="reading-progress-label">${t('quiz.questionOf', { current: pos.current, total: pos.total })}</span>
                        <span class="reading-chip good">✓ <strong id="readingCorrectCount">0</strong></span>
                        <span class="reading-chip bad">✗ <strong id="readingIncorrectCount">0</strong></span>
                        <button onclick="window.app.endCurrentSession()" class="module-back-btn" style="margin-bottom: 0;">
                            <span aria-hidden="true">⏹</span>
                            ${t('common.endSession')}
                        </button>
                    </div>
                    <div class="quiz-progress-track">
                        <div class="quiz-progress-fill" style="width: ${(pos.current / pos.total) * 100}%"></div>
                    </div>
                </div>

                <div class="reading-layout${passage ? '' : ' no-passage'}">
                    ${passage ? `
                    <div class="quiz-card reading-passage-panel">
                        <p class="reading-refer-line">${referLine}</p>
                        ${renderDoc(passage, companion ? t('reading.text1') : '')}
                        ${companion ? renderDoc(companion, t('reading.text2')) : ''}
                    </div>` : ''}

                    <div class="quiz-card reading-question-panel">
                        ${passage ? '' : `<p class="reading-refer-line">${referLine}</p>`}
                        <p class="reading-question-number">${t('status.question')} ${pos.current}</p>
                        <p class="reading-question-text">${question.question}</p>

                        <div class="reading-options" id="questionOptions">
                            ${question.options.map((option, index) => `
                                <label class="reading-option">
                                    <input type="radio" name="answer" value="${index}">
                                    <span class="reading-option-letter">${String.fromCharCode(65 + index)}</span>
                                    <span class="reading-option-text">${option}</span>
                                    <span class="reading-option-mark" aria-hidden="true"></span>
                                </label>
                            `).join('')}
                        </div>

                        <div id="readingFeedback"></div>

                        <div class="reading-actions">
                            <button onclick="window.app.submitReadingAnswer()" class="btn btn-primary" id="submitBtn" disabled>
                                ${t('reading.submitAnswer')}
                            </button>
                            <button onclick="window.app.goToNextReadingQuestion()" class="btn btn-primary hidden" id="nextQuestionBtn">
                                ${pos.current >= pos.total ? t('reading.seeResults') : t('quiz.nextQuestion')} →
                            </button>
                            <span class="reading-kbd-hint">${t('reading.kbdHint')}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Selection state: highlight the chosen option, enable submit
        content.querySelectorAll('input[name="answer"]').forEach(radio => {
            radio.addEventListener('change', () => {
                content.querySelectorAll('.reading-option').forEach(o => o.classList.remove('selected'));
                radio.closest('.reading-option').classList.add('selected');
                const submitBtn = document.getElementById('submitBtn');
                if (submitBtn) submitBtn.disabled = false;
            });
        });

        this.updateReadingSessionStats();
        this.bindReadingKeyboard();
    }

    // Keyboard shortcuts for the reading session: A–D / 1–4 select an
    // option, Enter submits or advances. The handler no-ops when the
    // reading question UI is not on screen.
    bindReadingKeyboard() {
        if (this._readingKeyHandler) {
            document.removeEventListener('keydown', this._readingKeyHandler);
        }
        this._readingKeyHandler = (e) => {
            const options = document.getElementById('questionOptions');
            if (!options) return;
            const tag = e.target && e.target.tagName;
            if ((tag === 'INPUT' && e.target.type !== 'radio') || tag === 'TEXTAREA' || tag === 'SELECT') return;

            const key = e.key.toLowerCase();
            let index = ['a', 'b', 'c', 'd'].indexOf(key);
            if (index === -1) index = ['1', '2', '3', '4'].indexOf(e.key);
            if (index !== -1) {
                const radio = options.querySelector(`input[value="${index}"]`);
                if (radio && !radio.disabled) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change'));
                }
                return;
            }
            if (e.key === 'Enter') {
                const nextBtn = document.getElementById('nextQuestionBtn');
                const submitBtn = document.getElementById('submitBtn');
                if (nextBtn && !nextBtn.classList.contains('hidden')) {
                    e.preventDefault();
                    nextBtn.click();
                } else if (submitBtn && !submitBtn.disabled && !submitBtn.classList.contains('hidden')) {
                    e.preventDefault();
                    submitBtn.click();
                }
            }
        };
        document.addEventListener('keydown', this._readingKeyHandler);
    }

    unbindReadingKeyboard() {
        if (this._readingKeyHandler) {
            document.removeEventListener('keydown', this._readingKeyHandler);
            this._readingKeyHandler = null;
        }
    }
    
    submitReadingAnswer() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) return;

        const reading = window.toeicReading;
        const question = reading ? reading.peekNextQuestion() : null;
        if (!question) return;

        const answerIndex = parseInt(selectedAnswer.value);
        const isCorrect = answerIndex === question.correctAnswer;

        // Track time
        if (this.timeTracker) {
            this.timeTracker.addToTimeline('reading_answer_submitted', {
                answerIndex: answerIndex,
                isCorrect: isCorrect,
                questionId: question.id,
                passageId: question.passageId
            });
        }

        // Track analytics
        if (window.advancedAnalytics && typeof window.advancedAnalytics.trackLearningProgress === 'function') {
            window.advancedAnalytics.trackLearningProgress('reading', {
                questionId: question.id,
                isCorrect: isCorrect,
                answerIndex: answerIndex,
                correctAnswer: question.correctAnswer
            });
        }

        // Record the answer (recordAnswer owns session stats) and
        // remember the choice for the end-of-session review screen
        reading.recordAnswer(question.id, answerIndex, 0);
        const progress = reading.userProgress.get(question.id);
        if (progress) {
            progress.lastAnswer = answerIndex;
            progress.lastCorrect = isCorrect;
            reading.userProgress.set(question.id, progress);
        }

        // Color-coded option feedback plus the question's explanation,
        // so students learn why, not just what
        this.showReadingAnswerFeedback(answerIndex, question.correctAnswer, isCorrect, question.explanation);

        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.classList.add('hidden');
        const nextBtn = document.getElementById('nextQuestionBtn');
        if (nextBtn) {
            nextBtn.classList.remove('hidden');
            nextBtn.focus();
        }

        this.updateReadingSessionStats();
    }

    showReadingAnswerFeedback(selectedIndex, correctIndex, isCorrect, explanation = '') {
        document.querySelectorAll('#questionOptions .reading-option').forEach((option, index) => {
            const input = option.querySelector('input');
            if (input) input.disabled = true;
            option.classList.remove('selected');

            const mark = option.querySelector('.reading-option-mark');
            if (index === correctIndex) {
                option.classList.add('reading-answer-correct');
                if (mark) mark.textContent = '✓';
            } else if (index === selectedIndex && !isCorrect) {
                option.classList.add('reading-answer-incorrect');
                if (mark) mark.textContent = '✗';
            } else {
                option.classList.add('reading-answer-disabled');
            }
        });

        this.showReadingFeedbackMessage(isCorrect, correctIndex, explanation);
    }

    showReadingFeedbackMessage(isCorrect, correctIndex, explanation = '') {
        const container = document.getElementById('readingFeedback');
        if (!container) return;

        const correctAnswerLetter = String.fromCharCode(65 + correctIndex);
        container.innerHTML = `
            <div class="reading-feedback-message ${isCorrect ? 'is-correct' : 'is-incorrect'}">
                <div class="reading-feedback-title">${isCorrect ? `✅ ${t('quiz.correct')}` : `❌ ${t('quiz.incorrect')}`}</div>
                ${!isCorrect ? `<p class="reading-feedback-line">${t('quiz.correctAnswerIs')} <strong>${correctAnswerLetter}</strong></p>` : ''}
                ${explanation ? `<p class="reading-feedback-line"><strong>${t('quiz.explanation')}:</strong> ${explanation}</p>` : ''}
            </div>
        `;
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    goToNextReadingQuestion() {
        const hasNext = window.toeicReading.moveToNextQuestion();

        if (hasNext) {
            this.showReadingInterface(window.toeicReading.currentSession);
        } else {
            this.showReadingSessionComplete();
        }
    }
    
    showReadingSessionComplete() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;

        this.unbindReadingKeyboard();

        const stats = window.toeicReading.getSessionStats();
        const answered = stats.correctAnswers + stats.incorrectAnswers;
        const accuracy = answered > 0 ?
            Math.round((stats.correctAnswers / answered) * 100) : 0;
        const minutes = Math.floor((stats.timeSpent || 0) / 60000);
        const seconds = Math.round(((stats.timeSpent || 0) % 60000) / 1000);

        // Collect per-question results BEFORE endSession clears the session
        const sessionResults = this.getSessionResults();
        const mistakes = sessionResults.filter(r => !r.isCorrect && r.selectedAnswer !== undefined && r.selectedAnswer !== -1);

        content.innerHTML = `
            <div class="module-shell">
                <div class="quiz-card text-center">
                    <h3 class="text-2xl font-bold text-white mb-6">📚 ${t('reading.sessionComplete')}</h3>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-green-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-green-400">${stats.correctAnswers || 0}</div>
                            <div class="text-white/80">${t('common.correct')}</div>
                        </div>
                        <div class="bg-red-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-red-400">${stats.incorrectAnswers || 0}</div>
                            <div class="text-white/80">${t('common.incorrect')}</div>
                        </div>
                        <div class="bg-blue-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-blue-400">${accuracy}%</div>
                            <div class="text-white/80">${t('quiz.accuracy')}</div>
                        </div>
                        <div class="bg-purple-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-purple-400">${minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}</div>
                            <div class="text-white/80">${t('common.time')}</div>
                        </div>
                    </div>

                    <div class="flex justify-center gap-4 flex-wrap">
                        <button onclick="window.app.initializeReadingModule()" class="btn btn-primary">
                            <i data-lucide="book-open" class="w-5 h-5 mr-2"></i>
                            ${t('reading.backToReading')}
                        </button>
                        <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                            <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                            ${t('common.mainMenu')}
                        </button>
                    </div>
                </div>

                ${mistakes.length > 0 ? `
                <div class="quiz-card">
                    <h3 class="text-xl font-bold text-white mb-6">📚 ${t('reading.answerReview')}</h3>
                    <div class="space-y-4">
                        ${mistakes.map(result => `
                            <div class="reading-review-item">
                                <p class="reading-review-question">${result.question}</p>
                                <p class="reading-review-line wrong">✗ ${String.fromCharCode(65 + result.selectedAnswer)}. ${result.options[result.selectedAnswer] ?? ''}</p>
                                <p class="reading-review-line right">✓ ${String.fromCharCode(65 + result.correctAnswer)}. ${result.options[result.correctAnswer]}</p>
                                ${result.explanation ? `<p class="reading-review-expl">💡 ${result.explanation}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;

        if (window.lucide) {
            window.lucide.createIcons();
        }

        // End the reading session
        window.toeicReading.endSession();

        console.log('📚 Reading session completed successfully');
    }

    updateReadingSessionStats() {
        if (!window.toeicReading) return;

        const stats = window.toeicReading.getSessionStats();
        const correctElement = document.getElementById('readingCorrectCount');
        const incorrectElement = document.getElementById('readingIncorrectCount');

        if (correctElement) correctElement.textContent = stats.correctAnswers;
        if (incorrectElement) incorrectElement.textContent = stats.incorrectAnswers;
    }
    
    initializeFlashcardModule() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        const progressSummary = window.toeicVocabulary ? window.toeicVocabulary.getProgressSummary() : null;
        
        content.innerHTML = `
            <div class="module-shell">
                <button class="module-back-btn" onclick="goHome()">
                    <span aria-hidden="true">←</span>
                    <span data-i18n="quiz.backToMenu">${t('quiz.backToMenu')}</span>
                </button>

                <div class="module-header">
                    <span class="toeic-part-badge">PARTS 1–7 · VOCABULARY</span>
                    <div class="module-header-icon" aria-hidden="true">🃏</div>
                    <h2 class="module-header-title" data-i18n="module.flashcards.title">${t('module.flashcards.title')}</h2>
                    <p class="module-header-subtitle" data-i18n="module.flashcards.desc">${t('module.flashcards.desc')}</p>
                </div>

                ${progressSummary ? `
                <div class="module-stats">
                    <div class="module-stat">
                        <span class="module-stat-value">${progressSummary.totalWords}</span>
                        <span class="module-stat-label" data-i18n="flashcards.totalWords">${t('flashcards.totalWords')}</span>
                    </div>
                    <div class="module-stat">
                        <span class="module-stat-value">${progressSummary.masteredWords}</span>
                        <span class="module-stat-label" data-i18n="flashcards.mastered">${t('flashcards.mastered')}</span>
                    </div>
                    <div class="module-stat">
                        <span class="module-stat-value">${progressSummary.learningWords}</span>
                        <span class="module-stat-label" data-i18n="flashcards.learning">${t('flashcards.learning')}</span>
                    </div>
                    <div class="module-stat">
                        <span class="module-stat-value">${Math.round(progressSummary.masteryPercentage)}%</span>
                        <span class="module-stat-label" data-i18n="flashcards.mastery">${t('flashcards.mastery')}</span>
                    </div>
                </div>
                ` : ''}

                <div class="module-actions">
                    <button onclick="window.app.startFlashcardReview('spaced_repetition')" class="module-action-btn primary">
                        <span class="module-action-icon" aria-hidden="true">▶</span>
                        <div class="module-action-text">
                            <div class="module-action-title" data-i18n="flashcards.startLearning">${t('flashcards.startLearning')}</div>
                            <div class="module-action-desc">${t('flashcards.step1')} · ${t('flashcards.step2')}</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                    <button onclick="window.app.showVocabularyProgress()" class="module-action-btn">
                        <span class="module-action-icon" aria-hidden="true">📊</span>
                        <div class="module-action-text">
                            <div class="module-action-title" data-i18n="flashcards.viewProgress">${t('flashcards.viewProgress')}</div>
                            <div class="module-action-desc" data-i18n="flashcards.step3">${t('flashcards.step3')}</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                    <button onclick="window.app.showFlashcardSettings()" class="module-action-btn">
                        <span class="module-action-icon" aria-hidden="true">⚙️</span>
                        <div class="module-action-text">
                            <div class="module-action-title" data-i18n="settings.title">${t('settings.title')}</div>
                            <div class="module-action-desc" data-i18n="flashcards.settingsDesc">${t('flashcards.settingsDesc')}</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                </div>
            </div>
        `;
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    initializeGrammarModule() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        const categories = window.toeicGrammar ? window.toeicGrammar.getGrammarCategories() : {};
        const progressSummary = window.toeicGrammar ? window.toeicGrammar.getUserProgressSummary() : null;
        
        content.innerHTML = `
            <div class="module-shell">
                <button class="module-back-btn" onclick="goHome()">
                    <span aria-hidden="true">←</span>
                    <span data-i18n="quiz.backToMenu">${t('quiz.backToMenu')}</span>
                </button>

                <div class="module-header">
                    <span class="toeic-part-badge">READING · PARTS 5–6</span>
                    <div class="module-header-icon" aria-hidden="true">📝</div>
                    <h2 class="module-header-title" data-i18n="module.grammar.title">${t('module.grammar.title')}</h2>
                    <p class="module-header-subtitle" data-i18n="module.grammar.desc">${t('module.grammar.desc')}</p>
                </div>

                ${progressSummary ? `
                <div class="module-stats">
                    <div class="module-stat">
                        <span class="module-stat-value">${progressSummary.masteredCategories}</span>
                        <span class="module-stat-label" data-i18n="grammar.masteredCategories">${t('grammar.masteredCategories')}</span>
                    </div>
                    <div class="module-stat">
                        <span class="module-stat-value">${progressSummary.totalCategories}</span>
                        <span class="module-stat-label" data-i18n="grammar.totalCategories">${t('grammar.totalCategories')}</span>
                    </div>
                    <div class="module-stat">
                        <span class="module-stat-value">${Math.round((progressSummary.masteredCategories / progressSummary.totalCategories) * 100)}%</span>
                        <span class="module-stat-label" data-i18n="grammar.completion">${t('grammar.completion')}</span>
                    </div>
                </div>
                ` : ''}

                <div class="module-actions">
                    <button onclick="window.app.startGrammarPractice('all')" class="module-action-btn primary">
                        <span class="module-action-icon" aria-hidden="true">📝</span>
                        <div class="module-action-text">
                            <div class="module-action-title" data-i18n="grammar.practiceAll">${t('grammar.practiceAll')}</div>
                            <div class="module-action-desc" data-i18n="grammar.practiceAllDesc">${t('grammar.practiceAllDesc')}</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                    <button onclick="window.app.startGrammarPractice('mixed')" class="module-action-btn">
                        <span class="module-action-icon" aria-hidden="true">🔀</span>
                        <div class="module-action-text">
                            <div class="module-action-title" data-i18n="grammar.mixedPractice">${t('grammar.mixedPractice')}</div>
                            <div class="module-action-desc" data-i18n="grammar.mixedPracticeDesc">${t('grammar.mixedPracticeDesc')}</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                    <button onclick="window.app.showGrammarRules()" class="module-action-btn">
                        <span class="module-action-icon" aria-hidden="true">📖</span>
                        <div class="module-action-text">
                            <div class="module-action-title" data-i18n="grammar.viewRules">${t('grammar.viewRules')}</div>
                            <div class="module-action-desc" data-i18n="grammar.viewRulesDesc">${t('grammar.viewRulesDesc')}</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                </div>

                <div class="module-actions">
                    ${Object.entries(categories).map(([key, category]) => {
                        const progress = progressSummary ? progressSummary.categoryDetails[key] : null;
                        const isMastered = progress ? progress.isMastered : false;
                        const accuracy = progress ? progress.accuracy : 0;

                        return `
                            <button onclick="window.app.startGrammarCategory('${key}')" class="module-action-btn">
                                <span class="module-action-icon">
                                    <i data-lucide="${category.icon}" class="w-6 h-6 text-${category.color}-400"></i>
                                </span>
                                <div class="module-action-text">
                                    <div class="module-action-title">${category.name} ${isMastered ? '✅' : ''}</div>
                                    <div class="module-action-desc">${category.difficulty} · ${category.description}</div>
                                    ${progress ? `
                                    <div class="quiz-progress-track">
                                        <div class="quiz-progress-fill" style="width: ${accuracy}%"></div>
                                    </div>
                                    <div class="module-action-desc"><span data-i18n="quiz.accuracy">${t('quiz.accuracy')}</span>: ${accuracy}%</div>
                                    ` : ''}
                                </div>
                                <span class="module-action-chevron" aria-hidden="true">›</span>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    hideWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.classList.add('hidden');
        }
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Update statistics methods
    updateReadingStats() {
        if (window.toeicReading) {
            const stats = window.toeicReading.getOverallStats();
            const passagesEl = document.getElementById('passagesRead');
            const accuracyEl = document.getElementById('readingAccuracy');
            const speedEl = document.getElementById('readingSpeed');
            
            if (passagesEl) passagesEl.textContent = stats.answeredQuestions;
            if (accuracyEl) accuracyEl.textContent = stats.overallAccuracy + '%';
            if (speedEl) speedEl.textContent = '120 WPM'; // Placeholder
        }
    }
    
    getLevelFromScore(score) {
        if (score >= 900) return 'C1';
        if (score >= 800) return 'B2+';
        if (score >= 700) return 'B2';
        if (score >= 600) return 'B1+';
        if (score >= 500) return 'B1';
        if (score >= 400) return 'A2';
        return 'A1';
    }
    
    makeButtonDraggable(button, storageKey) {
        // Delegates to the shared pointer-capture utility in
        // floating-drag.js (single implementation for all floating
        // buttons; see that file for the click-vs-drag rules)
        if (window.makeFloatingDraggable) {
            window.makeFloatingDraggable(button, storageKey);
        } else {
            console.warn('makeFloatingDraggable utility not loaded; button will not be draggable');
        }
    }

    // Settings and Help
    showSettings() {
        // Single settings UI: the modern drawer owned by SettingsPanel.
        // (The old read-only modal with unwired checkboxes is gone.)
        if (window.settingsPanel) {
            window.settingsPanel.openPanel();
        }
    }

    showHelp() {
        if (window.uiManager) {
            const helpContent = this.generateHelpContent();
            window.uiManager.showModal(helpContent, {
                title: t('help.title'),
                actions: `<button class="px-4 py-2 bg-accent rounded-lg text-white" onclick="this.closest('.modal-overlay').remove()">${t('help.gotIt')}</button>`
            });
        }
    }
    
    generateHelpContent() {
        return `
            <div class="space-y-4 text-sm">
                <div>
                    <h4 class="font-semibold mb-2">🎮 ${t('help.gameControls')}</h4>
                    <ul class="space-y-1 text-white/80">
                        <li>• ${t('help.control1')}</li>
                        <li>• ${t('help.control2')}</li>
                        <li>• ${t('help.control3')}</li>
                        <li>• ${t('help.control4')}</li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-semibold mb-2">📚 ${t('help.learningSystem')}</h4>
                    <ul class="space-y-1 text-white/80">
                        <li>• ${t('help.learning1')}</li>
                        <li>• ${t('help.learning2')}</li>
                        <li>• ${t('help.learning3')}</li>
                        <li>• ${t('help.learning4')}</li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-semibold mb-2">🏆 ${t('help.scoring')}</h4>
                    <ul class="space-y-1 text-white/80">
                        <li>• ${t('help.scoring1')}</li>
                        <li>• ${t('help.scoring2')}</li>
                        <li>• ${t('help.scoring3')}</li>
                        <li>• ${t('help.scoring4')}</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    setupPerformanceMonitoring() {
        // Monitor app performance
        if ('performance' in window) {
            const loadTime = Date.now() - this.startTime;
            console.log(`⚡ App loaded in ${loadTime.toFixed(2)}ms`);
            
            // Record load time in analytics
            if (window.advancedAnalytics && typeof window.advancedAnalytics.trackEvent === 'function') {
                window.advancedAnalytics.trackEvent('system', 'app_loaded', {
                    loadTime: loadTime,
                    timestamp: new Date().toISOString()
                });
            }
        }
        
        // Monitor memory usage
        if ('memory' in performance) {
            const memory = performance.memory;
            console.log(`💾 Memory: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB used`);
        }
        
        // Setup periodic performance monitoring
        setInterval(() => {
            this.monitorPerformance();
        }, 30000); // Every 30 seconds
        
        console.log('📊 Performance monitoring enabled');
    }
    
    monitorPerformance() {
        // Check memory usage
        if ('memory' in performance) {
            const memory = performance.memory;
            const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
            
            if (memoryUsage > 0.8) { // 80% memory usage
                console.warn('⚠️ High memory usage detected:', Math.round(memoryUsage * 100) + '%');
                
                // Trigger cleanup if available
                if (window.performanceOptimizer && window.performanceOptimizer.optimizeMemoryUsage) {
                    window.performanceOptimizer.optimizeMemoryUsage();
                }
            }
        }
    }

    handleInitializationError(error) {
        console.error('❌ Initialization failed:', error);
        
        // Show error screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="text-center text-white">
                    <i data-lucide="alert-circle" class="w-20 h-20 mx-auto mb-8 text-red-400"></i>
                    <h1 class="text-4xl font-bold mb-4">${t('error.title')}</h1>
                    <p class="text-xl mb-8">${t('error.desc')}</p>
                    <button onclick="location.reload()" class="px-6 py-3 bg-accent hover:bg-accent/80 rounded-lg transition-colors duration-300">
                        ${t('error.tryAgain')}
                    </button>
                </div>
            `;
        }
    }
    
    // Debug mode
    enableDebugMode() {
        window.debug = {
            app: this,
            sessionData: this.sessionData,

            // Debug utilities
            resetProgress: () => {
                localStorage.clear();
                location.reload();
            }
        };
        
        console.log('🔧 Debug mode enabled. Access via window.debug');
    }
    
    // Vocabulary Learning Functions
    initializeVocabularyLearning() {
        this.currentVocabularyWord = null;
        this.vocabularyAnswerPending = false;
        this.vocabularySessionStats = {
            correct: 0,
            incorrect: 0,
            total: 0
        };
        this.vocabularySessionSize = window.toeicVocabulary && window.toeicVocabulary.currentSession
            ? window.toeicVocabulary.currentSession.length
            : 20;

        // Update vocabulary count display
        this.updateVocabularyCountDisplay();

        // Keyboard flow: Space/Enter reveals, → = I know it, ← = I don't.
        // Registered once for the app's lifetime; guarded by screen state.
        if (!this.vocabKeyboardBound) {
            this.vocabKeyboardBound = true;
            document.addEventListener('keydown', (e) => {
                const screen = document.getElementById('vocabularyLearningScreen');
                if (!screen || screen.classList.contains('hidden')) return;
                const tag = (e.target.tagName || '').toLowerCase();
                if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

                const answerButtons = document.getElementById('answerButtons');
                const revealed = answerButtons && !answerButtons.classList.contains('hidden');

                if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
                    e.preventDefault();
                    this.revealVocabularyCard();
                } else if (revealed && (e.key === 'ArrowRight' || e.key === '1')) {
                    e.preventDefault();
                    this.recordVocabularyAnswer(true);
                } else if (revealed && (e.key === 'ArrowLeft' || e.key === '2')) {
                    e.preventDefault();
                    this.recordVocabularyAnswer(false);
                }
            });
        }

        // Load first word
        this.loadNextVocabularyWord();
    }

    revealVocabularyCard() {
        // Ignore taps once the card is already revealed
        const answerButtons = document.getElementById('answerButtons');
        if (answerButtons && !answerButtons.classList.contains('hidden')) return;

        this.showWordMeaning();

        const card = document.getElementById('vocabularyCard');
        if (card) card.classList.add('revealed');
    }

    speakCurrentVocabularyWord() {
        if (this.currentVocabularyWord && window.audioSystem &&
            typeof window.audioSystem.speakWord === 'function') {
            window.audioSystem.speakWord(this.currentVocabularyWord.word);
        }
    }
    
    updateVocabularyCountDisplay() {
        const countElement = document.getElementById('totalVocabularyCount');
        if (countElement && window.toeicVocabulary) {
            const totalWords = window.toeicVocabulary.vocabulary.size;
            if (totalWords > 0) {
                countElement.textContent = t('vocab.totalVocabulary', { count: totalWords });
                countElement.className = 'text-sm text-green-400';
            } else {
                countElement.textContent = t('vocab.fallbackVocabulary');
                countElement.className = 'text-sm text-yellow-400';
            }
        }
    }
    
    loadNextVocabularyWord() {
        if (!window.toeicVocabulary) {
            console.error('❌ TOEIC Vocabulary system not available');
            return;
        }
        
        const wordData = window.toeicVocabulary.getNextWord();
        if (!wordData) {
            // Session complete
            this.showSessionComplete();
            return;
        }
        
        this.currentVocabularyWord = wordData;
        this.updateVocabularyCard(wordData);
        this.updateSessionStats();
        
        // Reset UI state for new word
        const showMeaningBtn = document.getElementById('showMeaningBtn');
        const answerButtons = document.getElementById('answerButtons');
        const wordExamples = document.getElementById('wordExamples');
        const card = document.getElementById('vocabularyCard');

        if (showMeaningBtn) showMeaningBtn.classList.remove('hidden');
        if (answerButtons) answerButtons.classList.add('hidden');
        if (wordExamples) wordExamples.classList.add('hidden');
        if (card) card.classList.remove('revealed');
    }
    
    updateVocabularyCard(wordData) {
        const currentWordEl = document.getElementById('currentWord');
        const wordLevelEl = document.getElementById('wordLevel');
        const wordCategoryEl = document.getElementById('wordCategory');
        const wordFrequencyEl = document.getElementById('wordFrequency');
        const wordMeaningEl = document.getElementById('wordMeaning');
        const wordExamplesEl = document.getElementById('wordExamples');
        const answerButtonsEl = document.getElementById('answerButtons');
        const showMeaningBtnEl = document.getElementById('showMeaningBtn');
        
        if (currentWordEl) currentWordEl.textContent = wordData.word;
        if (wordLevelEl) wordLevelEl.textContent = wordData.level || 'B1';
        if (wordCategoryEl) wordCategoryEl.textContent = wordData.category || 'business';
        if (wordFrequencyEl) wordFrequencyEl.textContent = wordData.frequency || 'medium';
        if (wordMeaningEl) wordMeaningEl.textContent = t('vocab.clickToReveal');
        
        // Hide examples and answer buttons initially
        if (wordExamplesEl) wordExamplesEl.classList.add('hidden');
        if (answerButtonsEl) answerButtonsEl.classList.add('hidden');
        if (showMeaningBtnEl) showMeaningBtnEl.classList.remove('hidden');
    }
    
    showWordMeaning() {
        if (!this.currentVocabularyWord) return;
        
        const wordData = this.currentVocabularyWord;
        const wordMeaningEl = document.getElementById('wordMeaning');
        const showMeaningBtnEl = document.getElementById('showMeaningBtn');
        const examplesList = document.getElementById('examplesList');
        const wordExamplesEl = document.getElementById('wordExamples');
        const answerButtonsEl = document.getElementById('answerButtons');
        
        if (wordMeaningEl) wordMeaningEl.textContent = wordData.meaning;
        if (showMeaningBtnEl) showMeaningBtnEl.classList.add('hidden');
        
        // Show examples
        if (examplesList) {
            examplesList.innerHTML = '';
            if (wordData.examples && Array.isArray(wordData.examples)) {
                wordData.examples.forEach((example, index) => {
                    const exampleDiv = document.createElement('div');
                    exampleDiv.className = 'bg-white/5 rounded-lg p-4 text-left border border-white/10';
                    exampleDiv.innerHTML = `
                        <div class="flex items-start gap-3">
                            <div class="bg-blue-500/20 text-blue-300 text-sm font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
                                ${index + 1}
                            </div>
                            <p class="text-white/90 leading-relaxed">${example}</p>
                        </div>
                    `;
                    examplesList.appendChild(exampleDiv);
                });
            }
        }
        if (wordExamplesEl) wordExamplesEl.classList.remove('hidden');
        
        // Show answer buttons
        if (answerButtonsEl) answerButtonsEl.classList.remove('hidden');
    }
    
    recordVocabularyAnswer(isCorrect) {
        if (!this.currentVocabularyWord || !window.toeicVocabulary) return;

        // Answer lock: a second click or arrow-key press during the 1s
        // advance window used to record the same word twice AND queue a
        // second advance that silently skipped the next word
        if (this.vocabularyAnswerPending) return;
        this.vocabularyAnswerPending = true;

        // Record answer in vocabulary system
        window.toeicVocabulary.recordAnswer(this.currentVocabularyWord.word, isCorrect);

        // Track analytics
        if (window.advancedAnalytics && typeof window.advancedAnalytics.trackLearningProgress === 'function') {
            window.advancedAnalytics.trackLearningProgress('vocabulary', {
                word: this.currentVocabularyWord.word,
                isCorrect: isCorrect,
                level: this.currentVocabularyWord.level,
                category: this.currentVocabularyWord.category
            });
        }

        // Update session stats
        this.vocabularySessionStats.total++;
        if (isCorrect) {
            this.vocabularySessionStats.correct++;
        } else {
            this.vocabularySessionStats.incorrect++;
        }

        this.updateSessionStats();

        // Load next word
        setTimeout(() => {
            this.vocabularyAnswerPending = false;
            this.loadNextVocabularyWord();
        }, 1000);
    }
    
    updateSessionStats() {
        if (!window.toeicVocabulary) return;
        
        const stats = window.toeicVocabulary.getSessionStats();
        const wordsRemainingEl = document.getElementById('wordsRemaining');
        const correctCountEl = document.getElementById('correctCount');
        const incorrectCountEl = document.getElementById('incorrectCount');
        const sessionAccuracyEl = document.getElementById('sessionAccuracy');
        
        if (wordsRemainingEl) wordsRemainingEl.textContent = stats.wordsRemaining || 0;
        if (correctCountEl) correctCountEl.textContent = this.vocabularySessionStats.correct;
        if (incorrectCountEl) incorrectCountEl.textContent = this.vocabularySessionStats.incorrect;

        const accuracy = this.vocabularySessionStats.total > 0 ?
            Math.round((this.vocabularySessionStats.correct / this.vocabularySessionStats.total) * 100) : 0;
        if (sessionAccuracyEl) sessionAccuracyEl.textContent = `${accuracy}%`;

        // Session progress bar
        const fill = document.getElementById('vocabProgressFill');
        if (fill && this.vocabularySessionSize > 0) {
            const done = this.vocabularySessionStats.total;
            fill.style.width = `${Math.min(100, Math.round((done / this.vocabularySessionSize) * 100))}%`;
        }
    }
    
    showSessionComplete() {
        const vocabularyCard = document.getElementById('vocabularyCard');
        const sessionComplete = document.getElementById('sessionComplete');
        
        if (vocabularyCard) vocabularyCard.classList.add('hidden');
        if (sessionComplete) sessionComplete.classList.remove('hidden');
    }
    
    startNewVocabularySession() {
        if (window.toeicVocabulary) {
            const session = window.toeicVocabulary.startSession({ wordCount: 20 });
            this.showVocabularyLearningInterface(session);
        } else {
            console.error('❌ TOEIC Vocabulary system not available');
        }
    }
    
    async forceReloadVocabulary() {
        console.log('🔄 Force reloading vocabulary...');
        if (window.toeicVocabulary && typeof window.toeicVocabulary.forceReloadVocabulary === 'function') {
            try {
                const newCount = await window.toeicVocabulary.forceReloadVocabulary();
                console.log(`✅ Vocabulary reloaded successfully! Now have ${newCount} words`);
                
                // Update the display
                const countElement = document.getElementById('totalVocabularyCount');
                if (countElement) {
                    countElement.textContent = t('vocab.totalVocabulary', { count: newCount });
                    countElement.className = 'text-sm text-green-400';
                }

                // Show success message
                this.showNotification(t('vocab.reloadSuccess', { count: newCount }), 'success');

            } catch (error) {
                console.error('❌ Error reloading vocabulary:', error);
                this.showNotification(t('vocab.reloadFailed'), 'error');
            }
        } else {
            console.error('❌ TOEIC Vocabulary system not available or forceReloadVocabulary method missing');
            this.showNotification(t('vocab.systemUnavailable'), 'error');
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // End current session and return to main menu
    endCurrentSession() {
        console.log('🔄 Ending current session...');

        // Stop any in-flight TTS (listening test audio) — goHome() routes here too
        window.audioSystem?.cancelSpeech?.();

        // Hide the TOEIC module container (un-hidden by showTOEICModuleScreen)
        const moduleContent = document.getElementById('toeicModuleContent');
        if (moduleContent) {
            moduleContent.classList.add('hidden');
        }

        // Remove the dynamically created vocabulary screen entirely so its
        // duplicate element IDs can't hijack later getElementById lookups
        const vocabScreen = document.getElementById('vocabularyLearningScreen');
        if (vocabScreen) {
            vocabScreen.remove();
        }

        // Show main menu AND the welcome screen inside it — the welcome
        // screen is hidden separately by hideWelcomeScreen(), so restoring
        // only the parent left students on a blank page after "Exit Session"
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.classList.remove('hidden');
        }
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.classList.remove('hidden');
        }

        // Reset current module
        this.currentTOEICModule = null;

        // Clear any active sessions
        if (window.toeicVocabulary && window.toeicVocabulary.currentSession) {
            window.toeicVocabulary.endSession();
        }
        if (window.toeicReading && window.toeicReading.currentSession) {
            window.toeicReading.endSession();
        }
        this.unbindReadingKeyboard();

        // Clear timers
        if (this.readingTimer) {
            clearInterval(this.readingTimer);
            this.readingTimer = null;
        }
        this.readingSessionStartTime = null;
        this.readingSessionActive = null;
        if (this.questionCountdownTimer) {
            clearInterval(this.questionCountdownTimer);
            this.questionCountdownTimer = null;
        }
        if (this.testTimer) {
            clearInterval(this.testTimer);
            this.testTimer = null;
        }
        this.testTimerSeconds = 0;
        if (this.flashcardContinueTimer) {
            clearTimeout(this.flashcardContinueTimer);
            this.flashcardContinueTimer = null;
        }
        if (this.grammarAdvanceTimer) {
            clearTimeout(this.grammarAdvanceTimer);
            this.grammarAdvanceTimer = null;
        }
        
        // Remove any immediate feedback
        const existingFeedback = document.getElementById('immediateFeedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Remove the flashcard checkpoint overlay if it's open — its
        // auto-continue timer was cleared above, but the overlay itself
        // would otherwise sit on top of the welcome screen
        const flashcardOverlay = document.getElementById('flashcardProgressNotification');
        if (flashcardOverlay) {
            flashcardOverlay.remove();
        }
        
        console.log('✅ Session ended successfully');
    }
    
    // Flashcard Functions
    startFlashcardReview(mode = 'spaced_repetition') {
        if (!window.toeicVocabulary) {
            console.error('❌ TOEIC Vocabulary system not available');
            return;
        }
        
        console.log('🃏 Flashcard review started:', mode);
        
        // Store the current mode for later use
        this.currentFlashcardMode = mode;
        
        // Track analytics
        if (window.advancedAnalytics && typeof window.advancedAnalytics.recordLearningEvent === 'function') {
            window.advancedAnalytics.recordLearningEvent('flashcard_review_started', {
                mode: mode,
                timestamp: new Date().toISOString()
            });
        }
        
        const session = window.toeicVocabulary.startSession({
            mode: mode,
            wordCount: this.getWordCountForMode(mode)
        });
        
        if (session) {
            this.showFlashcardInterface(session, mode);
        }
    }
    
    getWordCountForMode(mode) {
        const wordCounts = {
            'spaced_repetition': 20,
            'new_words': 15,
            'difficulty_review': 15,
            'category_review': 20,
            'quick_review': 10,
            'exam_prep': 25
        };
        return wordCounts[mode] || 20;
    }
    
    showFlashcardInterface(session, mode) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        const currentWord = window.toeicVocabulary.getCurrentWord();
        if (!currentWord) {
            console.error('❌ No word available');
            return;
        }
        
        const modeInfo = this.getModeInfo(mode);
        
        // Get session stats from vocabulary system
        const sessionStats = window.toeicVocabulary.getSessionStats();
        const totalWords = sessionStats.totalWords;
        const currentIndex = totalWords - session.length; // Calculate current position
        
        content.innerHTML = `
            <div class="module-shell">
                <!-- Progress Header -->
                <div class="quiz-card">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold text-white">${modeInfo.title}</h3>
                            <p class="text-white/60">${modeInfo.description}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-sm text-white/80">${t('quiz.progress')}</div>
                            <div class="text-lg font-bold text-white">${currentIndex + 1}/${totalWords}</div>
                        </div>
                    </div>

                    <div class="quiz-progress-track">
                        <div class="quiz-progress-fill" style="width: ${((currentIndex + 1) / totalWords) * 100}%"></div>
                    </div>
                </div>

                <!-- Flashcard -->
                <div id="flashcard" class="flashcard-surface">
                    <span class="flashcard-level">
                        <span class="px-3 py-1 bg-${currentWord.difficulty.toLowerCase() === 'b2' ? 'yellow' : currentWord.difficulty.toLowerCase() === 'b1' ? 'blue' : 'green'}-500/20 text-${currentWord.difficulty.toLowerCase() === 'b2' ? 'yellow' : currentWord.difficulty.toLowerCase() === 'b1' ? 'blue' : 'green'}-400 rounded-full text-sm font-semibold inline-block">
                            ${currentWord.difficulty}
                        </span>
                    </span>
                    <h2 class="flashcard-word">${currentWord.word}</h2>
                    <p class="flashcard-category">${currentWord.category}</p>

                    <div id="flashcardContent" class="hidden">
                        <div class="flashcard-definition">
                            <strong>${t('flashcards.definition')}:</strong> ${currentWord.definition}
                        </div>
                        <div class="flashcard-example">
                            <strong>${t('flashcards.example')}:</strong> ${currentWord.example}
                        </div>
                        ${currentWord.synonyms ? `
                        <div class="flashcard-example">
                            <strong>${t('flashcards.synonyms')}:</strong> ${currentWord.synonyms}
                        </div>
                        ` : ''}
                    </div>
                </div>

                <button id="showAnswerBtn" onclick="window.app.showFlashcardAnswer()" class="flashcard-reveal-btn">
                    👁 ${t('quiz.showAnswer')}
                </button>

                <div id="flashcardAnswerButtons" class="flashcard-actions hidden">
                    <button onclick="window.app.answerFlashcard('correct')" class="flashcard-btn know">
                        ✓ ${t('vocab.iKnowIt')}
                    </button>
                    <button onclick="window.app.answerFlashcard('incorrect')" class="flashcard-btn dont-know">
                        ✗ ${t('vocab.iDontKnow')}
                    </button>
                </div>

                <!-- Session Stats -->
                <div class="module-stats" style="margin-top: 20px;">
                    <div class="module-stat">
                        <span class="module-stat-value">${sessionStats.correctAnswers}</span>
                        <span class="module-stat-label">${t('common.correct')}</span>
                    </div>
                    <div class="module-stat">
                        <span class="module-stat-value">${sessionStats.incorrectAnswers}</span>
                        <span class="module-stat-label">${t('common.incorrect')}</span>
                    </div>
                    <div class="module-stat">
                        <span class="module-stat-value">${Math.round((sessionStats.correctAnswers / (sessionStats.correctAnswers + sessionStats.incorrectAnswers)) * 100) || 0}%</span>
                        <span class="module-stat-label">${t('quiz.accuracy')}</span>
                    </div>
                </div>

                <div class="flex justify-center">
                    <button onclick="window.app.endFlashcardSession()" class="module-back-btn">
                        <span aria-hidden="true">⏹</span>
                        ${t('common.endSession')}
                    </button>
                </div>
            </div>
        `;
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    getModeInfo(mode) {
        const modeInfo = {
            'spaced_repetition': {
                title: t('flashcards.mode.spacedRepetition.title'),
                description: t('flashcards.mode.spacedRepetition.desc')
            },
            'new_words': {
                title: t('flashcards.mode.newWords.title'),
                description: t('flashcards.mode.newWords.desc')
            },
            'difficulty_review': {
                title: t('flashcards.mode.difficultyReview.title'),
                description: t('flashcards.mode.difficultyReview.desc')
            },
            'category_review': {
                title: t('flashcards.mode.categoryReview.title'),
                description: t('flashcards.mode.categoryReview.desc')
            },
            'quick_review': {
                title: t('flashcards.mode.quickReview.title'),
                description: t('flashcards.mode.quickReview.desc')
            },
            'exam_prep': {
                title: t('flashcards.mode.examPrep.title'),
                description: t('flashcards.mode.examPrep.desc')
            }
        };
        return modeInfo[mode] || modeInfo['spaced_repetition'];
    }
    
    showFlashcardAnswer() {
        const content = document.getElementById('flashcardContent');
        const showBtn = document.getElementById('showAnswerBtn');
        // Distinct id: this used to be "answerButtons", colliding with the
        // vocabulary screen's id and breaking its reveal after a stale
        // flashcard screen was left in the hidden module container
        const answerButtons = document.getElementById('flashcardAnswerButtons');

        if (content && showBtn && answerButtons) {
            content.classList.remove('hidden');
            showBtn.classList.add('hidden');
            answerButtons.classList.remove('hidden');
        }
    }
    
    answerFlashcard(result) {
        if (!window.toeicVocabulary) return;
        
        const isCorrect = result === 'correct';
        window.toeicVocabulary.answerWord(isCorrect);
        
        // Track time
        if (this.timeTracker) {
            const currentWord = window.toeicVocabulary.getCurrentWord();
            this.timeTracker.addToTimeline('flashcard_answer_submitted', {
                result: result,
                isCorrect: isCorrect,
                word: currentWord?.word,
                difficulty: currentWord?.difficulty,
                mode: this.currentFlashcardMode
            });
        }
        
        // Track analytics
        if (window.advancedAnalytics && typeof window.advancedAnalytics.recordLearningEvent === 'function') {
            window.advancedAnalytics.recordLearningEvent('flashcard_answer', {
                isCorrect: isCorrect,
                result: result,
                timestamp: new Date().toISOString()
            });
        }
        
        // Check if we've completed 20 words
        const sessionStats = window.toeicVocabulary.getSessionStats();
        const totalAnswered = sessionStats.correctAnswers + sessionStats.incorrectAnswers;
        
        if (totalAnswered > 0 && totalAnswered % 20 === 0) {
            // Show completion notification
            this.showFlashcardProgressNotification(totalAnswered);
            return;
        }
        
        // Move to next word
        const hasNext = window.toeicVocabulary.nextWord();
        if (hasNext) {
            const session = window.toeicVocabulary.currentSession;
            // Get the current mode from the session or use default
            const currentMode = this.currentFlashcardMode || 'spaced_repetition';
            this.showFlashcardInterface(session, currentMode);
        } else {
            this.endFlashcardSession();
        }
    }
    
    showFlashcardProgressNotification(completedWords) {
        // Create progress notification overlay
        const notificationOverlay = document.createElement('div');
        notificationOverlay.id = 'flashcardProgressNotification';
        notificationOverlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        notificationOverlay.innerHTML = `
            <div class="glass-effect rounded-xl p-8 max-w-2xl mx-4 text-center">
                <div class="mb-6">
                    <div class="text-6xl mb-4">🎉</div>
                    <h3 class="text-2xl font-bold text-blue-400 mb-2">${t('flashcards.greatProgress')}</h3>
                    <p class="text-white/90 text-lg">${t('flashcards.completedWords', { count: completedWords })}</p>
                </div>

                <div class="mb-6">
                    <div class="bg-blue-500/10 rounded-lg p-6">
                        <h4 class="text-blue-400 font-semibold mb-3">${t('flashcards.whatsNext')}</h4>
                        <p class="text-white/80 mb-4">
                            ${t('flashcards.nextWordsDesc')}
                        </p>
                        <div class="flex justify-center items-center gap-4 text-sm text-white/60">
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span>${t('flashcards.keepLearning')}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span>${t('flashcards.newWords')}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span>${t('flashcards.buildVocabulary')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-center gap-4">
                    <button onclick="window.app.continueFlashcardSession()" class="btn btn-primary">
                        <i data-lucide="arrow-right" class="w-5 h-5 mr-2"></i>
                        ${t('flashcards.continueLearning')}
                    </button>
                    <button onclick="window.app.endFlashcardSession()" class="btn btn-secondary">
                        <i data-lucide="flag" class="w-5 h-5 mr-2"></i>
                        ${t('common.endSession')}
                    </button>
                </div>

                <div class="text-white/60 text-sm mt-4">
                    ${t('common.autoContinuing', { seconds: 5 })}
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notificationOverlay);
        
        // Auto-continue after 5 seconds (cancelled if the user acts first)
        this.flashcardContinueTimer = setTimeout(() => {
            this.flashcardContinueTimer = null;
            this.continueFlashcardSession();
        }, 5000);
    }

    continueFlashcardSession() {
        // Cancel a pending auto-continue so it can't fire twice
        if (this.flashcardContinueTimer) {
            clearTimeout(this.flashcardContinueTimer);
            this.flashcardContinueTimer = null;
        }

        // Remove notification overlay
        const existingOverlay = document.getElementById('flashcardProgressNotification');
        if (existingOverlay && existingOverlay.parentNode) {
            existingOverlay.parentNode.removeChild(existingOverlay);
        }

        // Nothing to continue if the session has already ended
        if (!window.toeicVocabulary || !window.toeicVocabulary.currentSession) {
            return;
        }

        // Continue with next word
        const hasNext = window.toeicVocabulary.nextWord();
        if (hasNext) {
            const session = window.toeicVocabulary.currentSession;
            const currentMode = this.currentFlashcardMode || 'spaced_repetition';
            this.showFlashcardInterface(session, currentMode);
        } else {
            this.endFlashcardSession();
        }
    }

    endFlashcardSession() {
        if (!window.toeicVocabulary) return;

        // Cancel a pending auto-continue so it can't run on the ended session
        if (this.flashcardContinueTimer) {
            clearTimeout(this.flashcardContinueTimer);
            this.flashcardContinueTimer = null;
        }

        const results = window.toeicVocabulary.completeSession();
        this.showFlashcardResults(results);
    }

    showFlashcardResults(results) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;

        if (!results) {
            // Session was already completed elsewhere — go back to the module screen
            this.showTOEICModuleScreen('flashcards');
            return;
        }

        // completeSession() already computes accuracy over answered words
        const accuracy = results.accuracy || 0;
        
        content.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="glass-effect rounded-xl p-8 mb-6">
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-bold text-white mb-4">${t('flashcards.sessionComplete')}</h3>
                        <div class="text-4xl font-bold text-blue-400 mb-2">${accuracy}%</div>
                        <p class="text-white/80">${t('common.overallAccuracy')}</p>
                    </div>

                    <div class="grid grid-cols-3 gap-6 mb-6">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-400">${results.correctAnswers}</div>
                            <div class="text-white/80">${t('common.correct')}</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-red-400">${results.incorrectAnswers}</div>
                            <div class="text-white/80">${t('common.incorrect')}</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-400">${results.totalWords}</div>
                            <div class="text-white/80">${t('flashcards.totalWords')}</div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-center gap-4">
                    <button onclick="window.app.startFlashcardReview('spaced_repetition')" class="btn btn-primary">
                        <i data-lucide="refresh-cw" class="w-5 h-5 mr-2"></i>
                        ${t('flashcards.reviewAgain')}
                    </button>
                    <button onclick="window.app.showTOEICModuleScreen('flashcards')" class="btn btn-secondary">
                        <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                        ${t('flashcards.backToFlashcards')}
                    </button>
                </div>
            </div>
        `;
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    showFlashcardSettings() {
        console.log('⚙️ Flashcard settings');
        this.showTOEICModuleScreen('flashcards', { mode: 'settings' });
    }
    
    showVocabularyProgress() {
        console.log('📊 Vocabulary progress');
        this.showTOEICModuleScreen('flashcards', { mode: 'progress' });
    }
    
    // Grammar Functions
    startGrammarPractice(category = 'all') {
        console.log('📚 Grammar practice started:', category);
        
        if (!window.toeicGrammar) {
            console.error('❌ Grammar system not available');
            return;
        }
        
        // Track analytics
        if (window.advancedAnalytics && typeof window.advancedAnalytics.recordLearningEvent === 'function') {
            window.advancedAnalytics.recordLearningEvent('grammar_practice_started', {
                category: category,
                timestamp: new Date().toISOString()
            });
        }
        
        const session = window.toeicGrammar.startSession({
            category: category,
            questionCount: 20
        });
        
        if (session) {
            this.showGrammarPracticeInterface(session);
        }
    }
    
    startGrammarCategory(category) {
        console.log('📚 Starting grammar category:', category);
        this.startGrammarPractice(category);
    }
    
    showGrammarPracticeInterface(session) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        const question = window.toeicGrammar.getCurrentQuestion();
        if (!question) {
            console.error('❌ No question available');
            return;
        }
        
        this.grammarAwaitingContinue = false;
        this.bindGrammarKeyboard();

        content.innerHTML = `
            <div class="module-shell" id="grammarPracticeRoot">
                <!-- Progress Header -->
                <div class="quiz-card">
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-bold text-white">${t('grammar.practice')}</h3>
                        <div class="text-right">
                            <div class="text-sm text-white/80">${t('quiz.progress')}</div>
                            <div class="text-lg font-bold text-white">${question.progress.current}/${question.progress.total}</div>
                        </div>
                    </div>

                    <div class="quiz-progress-track">
                        <div class="quiz-progress-fill" style="width: ${(question.progress.current / question.progress.total) * 100}%"></div>
                    </div>
                </div>

                <!-- Question -->
                <div class="quiz-card">
                    <div class="mb-6">
                        <div class="flex items-center gap-2 mb-4 flex-wrap">
                            <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                                ${question.category.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            ${question.grammarRule && question.grammarRule.title ? `
                            <span class="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                                ${question.grammarRule.title}
                            </span>` : ''}
                            <span class="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">
                                ${question.difficulty}
                            </span>
                        </div>

                        <p class="text-white/90 text-lg mb-6">${question.question}</p>

                        <!-- One click answers: picking an option submits it -->
                        <div>
                            ${question.options.map((option, index) => `
                                <label class="quiz-option-btn cursor-pointer"
                                       onclick="this.querySelector('input').checked = true; window.app.submitGrammarAnswer();">
                                    <input type="radio" name="grammarAnswer" value="${index}" class="sr-only" style="position:absolute;opacity:0;">
                                    <span class="quiz-option-letter">${String.fromCharCode(65 + index)}</span>
                                    <span class="text-white/90">${option}</span>
                                    <span class="key-hint" style="margin-left:auto;">${index + 1}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="flex justify-between items-center">
                        <button onclick="window.app.previousGrammarQuestion()" class="btn btn-secondary" ${question.progress.current <= 1 ? 'disabled' : ''}>
                            <i data-lucide="chevron-left" class="w-5 h-5 mr-2"></i>
                            ${t('quiz.previousQuestion')}
                        </button>
                        <span class="text-white/40 text-xs">${t('grammar.keyboardHint')}</span>
                    </div>
                </div>

                <div class="flex justify-center mt-6">
                    <button onclick="window.app.completeGrammarSession()" class="module-back-btn">
                        <span aria-hidden="true">⏹</span>
                        ${t('grammar.completeSession')}
                    </button>
                </div>
            </div>
        `;

        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    bindGrammarKeyboard() {
        // Keyboard flow, registered once: 1-4 answers the question,
        // Enter/ArrowRight continues after feedback, ArrowLeft goes back
        if (this.grammarKeyboardBound) return;
        this.grammarKeyboardBound = true;

        document.addEventListener('keydown', (e) => {
            if (!document.getElementById('grammarPracticeRoot')) return;
            const tag = (e.target.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

            if (this.grammarAwaitingContinue) {
                if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === ' ') {
                    e.preventDefault();
                    this.continueToNextGrammarQuestion();
                }
                return;
            }

            if (['1', '2', '3', '4'].includes(e.key)) {
                const radios = document.querySelectorAll('input[name="grammarAnswer"]');
                const idx = parseInt(e.key, 10) - 1;
                if (radios[idx]) {
                    e.preventDefault();
                    radios[idx].checked = true;
                    this.submitGrammarAnswer();
                }
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousGrammarQuestion();
            }
        });
    }
    
    submitGrammarAnswer() {
        if (!window.toeicGrammar) return;

        // Ignore repeat submits while feedback is on screen
        if (this.grammarAwaitingContinue) return;

        // Get current answer if selected
        const selectedAnswer = document.querySelector('input[name="grammarAnswer"]:checked');
        if (!selectedAnswer) {
            // Options submit on click, so this only happens via keyboard misuse
            return;
        }

        this.grammarAwaitingContinue = true;
        const answerIndex = parseInt(selectedAnswer.value);
        const isCorrect = window.toeicGrammar.answerQuestion(answerIndex);
        
        // Track time
        if (this.timeTracker) {
            this.timeTracker.addToTimeline('grammar_answer_submitted', {
                answerIndex: answerIndex,
                isCorrect: isCorrect,
                questionId: window.toeicGrammar.getCurrentQuestion()?.id
            });
        }
        
        // Show immediate feedback inline
        this.showGrammarAnswerFeedbackInline(answerIndex, isCorrect);
        
        // Track analytics
        if (window.advancedAnalytics && typeof window.advancedAnalytics.recordLearningEvent === 'function') {
            window.advancedAnalytics.recordLearningEvent('grammar_answer', {
                answerIndex: answerIndex,
                isCorrect: isCorrect,
                timestamp: new Date().toISOString()
            });
        }
        
        // No auto-advance: students control the pace and read the
        // explanation as long as they need. Continue via button, Enter,
        // or the right-arrow key.
    }
    
    showGrammarAnswerFeedbackInline(selectedIndex, isCorrect) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        const currentQuestion = window.toeicGrammar.getCurrentQuestion();
        if (!currentQuestion) return;
        
        // Update the interface to show feedback
        const feedbackHTML = `
            <div class="module-shell" id="grammarPracticeRoot">
                <!-- Progress Header -->
                <div class="quiz-card">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold text-white">${t('grammar.practice')}</h3>
                            <p class="text-white/60">${t('quiz.questionOf', { current: currentQuestion.progress.current, total: currentQuestion.progress.total })}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-sm text-white/80">${t('quiz.progress')}</div>
                            <div class="text-lg font-bold text-white">${currentQuestion.progress.current}/${currentQuestion.progress.total}</div>
                        </div>
                    </div>

                    <div class="quiz-progress-track">
                        <div class="quiz-progress-fill" style="width: ${(currentQuestion.progress.current / currentQuestion.progress.total) * 100}%"></div>
                    </div>
                </div>

                <!-- Question with Feedback -->
                <div class="quiz-card">
                    <div class="mb-6">
                        <div class="flex items-center gap-2 mb-4">
                            <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                                ${currentQuestion.category.replace('_', ' ').toUpperCase()}
                            </span>
                            <span class="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">
                                ${currentQuestion.difficulty}
                            </span>
                        </div>

                        <h4 class="text-lg font-semibold text-white mb-4">${t('status.question')} ${currentQuestion.progress.current}</h4>
                        <p class="text-white/90 text-lg mb-6">${currentQuestion.question}</p>

                        <!-- Answer Options with Feedback -->
                        <div class="mb-2">
                            ${currentQuestion.options.map((option, index) => {
                                let optionClass = 'quiz-option-btn';
                                let icon = '';

                                if (index === selectedIndex) {
                                    optionClass += isCorrect ? ' is-correct' : ' is-wrong';
                                    icon = isCorrect ? '✅' : '❌';
                                } else if (index === currentQuestion.correctAnswer) {
                                    optionClass += ' is-correct';
                                    icon = '✅';
                                }

                                return `
                                    <div class="${optionClass}">
                                        <span class="quiz-option-letter">${String.fromCharCode(65 + index)}</span>
                                        <span class="text-white/90">${option} ${icon}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>

                        <!-- Feedback -->
                        <div class="quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}">
                            <div class="flex items-center gap-3 mb-2">
                                ${isCorrect ?
                                    `<div class="text-2xl">✅</div><h3 class="text-xl font-bold text-green-400">${t('quiz.correct')}</h3>` :
                                    `<div class="text-2xl">❌</div><h3 class="text-xl font-bold text-red-400">${t('quiz.incorrect')}</h3>`
                                }
                            </div>

                            ${currentQuestion.explanation ? `
                                <div class="mt-2">
                                    <h4 class="text-blue-400 font-semibold mb-1">${t('quiz.explanation')}:</h4>
                                    <p class="text-white/80">${currentQuestion.explanation}</p>
                                </div>
                            ` : ''}

                            ${currentQuestion.grammarRule ? `
                                <div class="mt-3">
                                    <h4 class="text-purple-400 font-semibold mb-1">${t('grammar.rule')}: ${currentQuestion.grammarRule.title}</h4>
                                    <p class="text-white/80 text-sm">${currentQuestion.grammarRule.description}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="flex justify-center">
                        <button onclick="window.app.continueToNextGrammarQuestion()" class="dashboard-primary-btn" id="grammarContinueBtn" style="min-width: 240px;">
                            ${t('grammar.continueNext')}
                            <i data-lucide="arrow-right" class="w-5 h-5"></i>
                            <span class="key-hint">Enter</span>
                        </button>
                    </div>
                </div>

                <!-- Session Stats -->
                <div class="module-stats">
                    <div class="module-stat">
                        <span class="module-stat-value">${window.toeicGrammar.getSessionStats().correctAnswers}</span>
                        <span class="module-stat-label">${t('common.correct')}</span>
                    </div>
                    <div class="module-stat">
                        <span class="module-stat-value">${window.toeicGrammar.getSessionStats().incorrectAnswers}</span>
                        <span class="module-stat-label">${t('common.incorrect')}</span>
                    </div>
                    <div class="module-stat">
                        <span class="module-stat-value">${Math.round((window.toeicGrammar.getSessionStats().correctAnswers / (window.toeicGrammar.getSessionStats().correctAnswers + window.toeicGrammar.getSessionStats().incorrectAnswers)) * 100) || 0}%</span>
                        <span class="module-stat-label">${t('quiz.accuracy')}</span>
                    </div>
                </div>

                <div class="flex justify-center">
                    <button onclick="window.app.completeGrammarSession()" class="module-back-btn">
                        <span aria-hidden="true">⏹</span>
                        ${t('grammar.completeSession')}
                    </button>
                </div>
            </div>
        `;
        
        content.innerHTML = feedbackHTML;
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    continueToNextGrammarQuestion() {
        // Cancel a pending auto-advance so it can't skip an extra question
        if (this.grammarAdvanceTimer) {
            clearTimeout(this.grammarAdvanceTimer);
            this.grammarAdvanceTimer = null;
        }
        this.grammarAwaitingContinue = false;

        if (!window.toeicGrammar || !window.toeicGrammar.currentSession) {
            return;
        }

        // Move to next question
        const hasNext = window.toeicGrammar.nextQuestion();
        if (hasNext) {
            const session = window.toeicGrammar.currentSession;
            this.showGrammarPracticeInterface(session);
        } else {
            this.completeGrammarSession();
        }
    }
    
    previousGrammarQuestion() {
        if (!window.toeicGrammar) return;
        this.grammarAwaitingContinue = false;

        const hasPrevious = window.toeicGrammar.previousQuestion();
        if (hasPrevious) {
            const session = window.toeicGrammar.currentSession;
            this.showGrammarPracticeInterface(session);
        }
    }
    
    completeGrammarSession() {
        if (!window.toeicGrammar) return;
        
        // Get current answer if selected
        const selectedAnswer = document.querySelector('input[name="grammarAnswer"]:checked');
        if (selectedAnswer) {
            const answerIndex = parseInt(selectedAnswer.value);
            window.toeicGrammar.answerQuestion(answerIndex);
        }
        
        const results = window.toeicGrammar.completeSession();
        this.showGrammarResults(results);
    }
    
    showGrammarResults(results) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        content.innerHTML = `
            <div class="module-shell">
                <div class="module-header">
                    <span class="toeic-part-badge">READING · PARTS 5–6</span>
                    <div class="module-header-icon" aria-hidden="true">📝</div>
                    <h2 class="module-header-title">${t('grammar.practiceComplete')}</h2>
                    <p class="module-header-subtitle">${t('common.overallAccuracy')}: ${results.accuracy}%</p>
                </div>

                <div class="module-stats">
                    <div class="module-stat">
                        <span class="module-stat-value">${results.correctAnswers}</span>
                        <span class="module-stat-label">${t('common.correct')}</span>
                    </div>
                    <div class="module-stat">
                        <span class="module-stat-value">${results.incorrectAnswers}</span>
                        <span class="module-stat-label">${t('common.incorrect')}</span>
                    </div>
                    <div class="module-stat">
                        <span class="module-stat-value">${results.totalQuestions}</span>
                        <span class="module-stat-label">${t('common.total')}</span>
                    </div>
                </div>

                <div class="module-actions">
                    <button onclick="window.app.startGrammarPractice('all')" class="module-action-btn primary">
                        <span class="module-action-icon" aria-hidden="true">🔄</span>
                        <div class="module-action-text">
                            <div class="module-action-title">${t('common.practiceAgain')}</div>
                            <div class="module-action-desc" data-i18n="grammar.practiceAllDesc">${t('grammar.practiceAllDesc')}</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                    <button onclick="window.app.showTOEICModuleScreen('grammar')" class="module-action-btn">
                        <span class="module-action-icon" aria-hidden="true">🏠</span>
                        <div class="module-action-text">
                            <div class="module-action-title">${t('grammar.backToGrammar')}</div>
                            <div class="module-action-desc" data-i18n="module.grammar.desc">${t('module.grammar.desc')}</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                </div>
            </div>
        `;
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    showGrammarRules() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        const categories = window.toeicGrammar ? window.toeicGrammar.getGrammarCategories() : {};
        
        content.innerHTML = `
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-white mb-4" data-i18n="grammar.rulesReference">${t('grammar.rulesReference')}</h2>
                    <p class="text-white/80 text-lg" data-i18n="grammar.practiceSubtitle">${t('grammar.practiceSubtitle')}</p>
                </div>
                
                <div class="space-y-6">
                    ${Object.entries(categories).map(([key, category]) => `
                        <div class="glass-effect rounded-xl p-6">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-12 h-12 rounded-lg bg-${category.color}-500/20 flex items-center justify-center">
                                    <i data-lucide="${category.icon}" class="w-6 h-6 text-${category.color}-400"></i>
                                </div>
                                <div>
                                    <h3 class="text-xl font-semibold text-white">${category.name}</h3>
                                    <p class="text-white/60">${category.description}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="flex justify-center mt-8">
                    <button onclick="window.app.showTOEICModuleScreen('grammar')" class="btn btn-primary">
                        <i data-lucide="arrow-left" class="w-5 h-5 mr-2"></i>
                        <span data-i18n="grammar.backToPractice">${t('grammar.backToPractice')}</span>
                    </button>
                </div>
            </div>
        `;
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    // Generic TOEIC Module Screen Handler
    showTOEICModuleScreen(moduleType, options = {}) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        // Hide main menu
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.classList.add('hidden');
        }
        
        // Show module content
        content.classList.remove('hidden');
        
        // Set current module
        this.currentTOEICModule = moduleType;
        
        // Generate module-specific content
        switch (moduleType) {
            case 'vocabulary':
                this.showVocabularyModule(options);
                break;
            case 'reading':
                // If we have a session, show the reading interface, otherwise show module selection
                if (options && options.length) {
                    this.showReadingInterface(options);
                } else {
                    this.showReadingModule(options);
                }
                break;
            case 'test':
                this.showTestModule(options);
                break;
            case 'flashcards':
                this.showFlashcardModule(options);
                break;
            case 'grammar':
                this.showGrammarModule(options);
                break;
            default:
                content.innerHTML = `
                    <div class="text-center">
                        <h3 class="text-xl font-bold text-white mb-4" data-i18n="common.moduleNotAvailable">${t('common.moduleNotAvailable')}</h3>
                        <p class="text-white/80 mb-6" data-i18n="common.underDevelopment">${t('common.underDevelopment')}</p>
                        <button onclick="window.app.endCurrentSession()" class="btn btn-primary" data-i18n="common.backToMainMenu">${t('common.backToMainMenu')}</button>
                    </div>
                `;
        }
    }
    
    // Module-specific screen handlers
    showVocabularyModule(options = {}) {
        const content = document.getElementById('toeicModuleContent');
        content.innerHTML = `
            <div class="text-center">
                <h3 class="text-xl font-bold text-white mb-4" data-i18n="vocab.practiceTitle">${t('vocab.practiceTitle')}</h3>
                <p class="text-white/80 mb-6">${t('common.mode')}: ${options.mode || 'Practice'}</p>
                <div class="flex justify-center gap-4">
                    <button onclick="window.startVocabularySession()" class="btn btn-primary">
                        <i data-lucide="book-open" class="w-5 h-5 mr-2"></i>
                        <span data-i18n="vocab.startSession">${t('vocab.startSession')}</span>
                    </button>
                    <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                        <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                        <span data-i18n="common.backToMainMenu">${t('common.backToMainMenu')}</span>
                    </button>
                </div>
            </div>
        `;
    }
    
    showReadingModule(options = {}) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        // Get reading statistics
        const readingStats = window.toeicReading ? window.toeicReading.getOverallStats() : null;
        const totalPassages = window.toeicReading ? window.toeicReading.passages.size : 0;
        const totalQuestions = window.toeicReading ? window.toeicReading.questions.size : 0;
        
        content.innerHTML = `
            <div class="max-w-6xl mx-auto">
                <!-- Header Section -->
                <div class="glass-effect rounded-2xl p-8 mb-8">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h2 class="text-3xl font-bold text-white mb-2">📖 <span data-i18n="reading.comprehensionTitle">${t('reading.comprehensionTitle')}</span></h2>
                            <p class="text-white/80 text-lg" data-i18n="reading.comprehensionSubtitle">${t('reading.comprehensionSubtitle')}</p>
                        </div>
                        <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                            <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                            <span data-i18n="common.backToMainMenu">${t('common.backToMainMenu')}</span>
                        </button>
                    </div>

                    <!-- Progress Overview -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 text-center">
                            <div class="text-2xl font-bold text-blue-300">${totalPassages}</div>
                            <div class="text-white/80 text-sm" data-i18n="reading.passagesCount">${t('reading.passagesCount')}</div>
                        </div>
                        <div class="bg-green-500/20 border border-green-400/30 rounded-xl p-4 text-center">
                            <div class="text-2xl font-bold text-green-300">${totalQuestions}</div>
                            <div class="text-white/80 text-sm" data-i18n="reading.practiceQuestions">${t('reading.practiceQuestions')}</div>
                        </div>
                        <div class="bg-purple-500/20 border border-purple-400/30 rounded-xl p-4 text-center">
                            <div class="text-2xl font-bold text-purple-300">${readingStats ? readingStats.accuracy.toFixed(1) : '0'}%</div>
                            <div class="text-white/80 text-sm" data-i18n="reading.averageAccuracy">${t('reading.averageAccuracy')}</div>
                        </div>
                        <div class="bg-orange-500/20 border border-orange-400/30 rounded-xl p-4 text-center">
                            <div class="text-2xl font-bold text-orange-300">${readingStats ? readingStats.totalAnswered : '0'}</div>
                            <div class="text-white/80 text-sm" data-i18n="reading.questionsAnswered">${t('reading.questionsAnswered')}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Reading Practice Options -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <!-- Quick Practice -->
                    <div class="glass-effect rounded-2xl p-8">
                        <div class="text-center mb-6">
                            <div class="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="zap" class="w-8 h-8 text-blue-400"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-2" data-i18n="reading.quickPractice">${t('reading.quickPractice')}</h3>
                            <p class="text-white/80" data-i18n="reading.quickPracticeDesc">${t('reading.quickPracticeDesc')}</p>
                        </div>
                        <div class="space-y-4">
                            <button onclick="window.app.startReadingSession({ count: 5 })" class="btn btn-primary w-full">
                                <i data-lucide="play" class="w-5 h-5 mr-2"></i>
                                <span data-i18n="reading.practice5">${t('reading.practice5')}</span>
                            </button>
                            <button onclick="window.app.startReadingSession({ count: 10 })" class="btn btn-secondary w-full">
                                <i data-lucide="clock" class="w-5 h-5 mr-2"></i>
                                <span data-i18n="reading.practice10">${t('reading.practice10')}</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Full Practice -->
                    <div class="glass-effect rounded-2xl p-8">
                        <div class="text-center mb-6">
                            <div class="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="book-open" class="w-8 h-8 text-green-400"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-2" data-i18n="reading.fullPractice">${t('reading.fullPractice')}</h3>
                            <p class="text-white/80" data-i18n="reading.fullPracticeDesc">${t('reading.fullPracticeDesc')}</p>
                        </div>
                        <div class="space-y-4">
                            <button onclick="window.app.startReadingSession({ count: 20 })" class="btn btn-primary w-full">
                                <i data-lucide="target" class="w-5 h-5 mr-2"></i>
                                <span data-i18n="reading.practice20">${t('reading.practice20')}</span>
                            </button>
                            <button onclick="window.app.startReadingSession({ count: 25 })" class="btn btn-secondary w-full">
                                <i data-lucide="award" class="w-5 h-5 mr-2"></i>
                                <span data-i18n="reading.practice25">${t('reading.practice25')}</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Reading Skills Focus -->
                <div class="glass-effect rounded-2xl p-8 mb-8">
                    <h3 class="text-2xl font-bold text-white mb-6 text-center">🎯 <span data-i18n="reading.focusSkills">${t('reading.focusSkills')}</span></h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-white/5 rounded-xl p-6 text-center">
                            <div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="file-text" class="w-6 h-6 text-yellow-400"></i>
                            </div>
                            <h4 class="text-lg font-semibold text-white mb-2" data-i18n="reading.incompleteSentences">${t('reading.incompleteSentences')}</h4>
                            <p class="text-white/70 text-sm mb-4" data-i18n="reading.incompleteSentencesDesc">${t('reading.incompleteSentencesDesc')}</p>
                            <button onclick="window.app.startReadingSession({ type: 'incomplete_sentences' })" class="btn btn-outline w-full" data-i18n="quiz.startPractice">${t('quiz.startPractice')}</button>
                        </div>

                        <div class="bg-white/5 rounded-xl p-6 text-center">
                            <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="align-left" class="w-6 h-6 text-blue-400"></i>
                            </div>
                            <h4 class="text-lg font-semibold text-white mb-2" data-i18n="reading.textCompletion">${t('reading.textCompletion')}</h4>
                            <p class="text-white/70 text-sm mb-4" data-i18n="reading.textCompletionDesc">${t('reading.textCompletionDesc')}</p>
                            <button onclick="window.app.startReadingSession({ type: 'text_completion' })" class="btn btn-outline w-full" data-i18n="quiz.startPractice">${t('quiz.startPractice')}</button>
                        </div>

                        <div class="bg-white/5 rounded-xl p-6 text-center">
                            <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="book" class="w-6 h-6 text-purple-400"></i>
                            </div>
                            <h4 class="text-lg font-semibold text-white mb-2" data-i18n="reading.comprehension">${t('reading.comprehension')}</h4>
                            <p class="text-white/70 text-sm mb-4" data-i18n="reading.comprehensionDesc">${t('reading.comprehensionDesc')}</p>
                            <button onclick="window.app.startReadingSession({ type: 'reading_comprehension' })" class="btn btn-outline w-full" data-i18n="quiz.startPractice">${t('quiz.startPractice')}</button>
                        </div>
                    </div>
                </div>
                
                <!-- Recent Performance -->
                ${readingStats && readingStats.recentSessions ? `
                <div class="glass-effect rounded-2xl p-8">
                    <h3 class="text-2xl font-bold text-white mb-6">📊 <span data-i18n="reading.recentPerformance">${t('reading.recentPerformance')}</span></h3>
                    <div class="space-y-4">
                        ${readingStats.recentSessions.slice(0, 3).map(session => `
                            <div class="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-full flex items-center justify-center ${session.accuracy >= 80 ? 'bg-green-500/20' : session.accuracy >= 60 ? 'bg-yellow-500/20' : 'bg-red-500/20'}">
                                        <span class="text-sm font-bold ${session.accuracy >= 80 ? 'text-green-400' : session.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'}">
                                            ${session.accuracy.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div>
                                        <div class="text-white font-semibold">${t('reading.nQuestions', { count: session.questionCount })}</div>
                                        <div class="text-white/60 text-sm">${new Date(session.date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-white/80 text-sm">${t('reading.correctRatio', { correct: session.correctAnswers, total: session.questionCount })}</div>
                                    <div class="text-white/60 text-xs">${t('common.minutes', { count: Math.round(session.timeSpent / 60) })}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    startReadingSession(options = {}) {
        if (!window.toeicReading) {
            console.error('❌ TOEIC Reading system not available');
            return;
        }
        
        const session = window.toeicReading.startSession({
            count: options.count || 10,
            type: options.type || 'mixed'
        });
        
        if (session) {
            this.showTOEICReadingInterface(session);
        } else {
            console.error('❌ Failed to start reading session');
        }
    }
    
    getSessionResults() {
        const reading = window.toeicReading;
        if (!reading || !Array.isArray(reading.sessionAnswers)) {
            return [];
        }

        return reading.sessionAnswers
            .map(answer => {
                const question = reading.questions.get(answer.questionId);
                if (!question) return null;
                return {
                    questionId: answer.questionId,
                    questionType: reading.questionTypes[question.type]?.name || question.type,
                    question: question.question,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    selectedAnswer: answer.selectedAnswer,
                    isCorrect: answer.isCorrect,
                    explanation: question.explanation
                };
            })
            .filter(Boolean);
    }

    showTestModule(options = {}) {
        const content = document.getElementById('toeicModuleContent');
        content.innerHTML = `
            <div class="module-shell">
                <button class="module-back-btn" onclick="window.app.endCurrentSession()">
                    <span aria-hidden="true">←</span>
                    <span data-i18n="common.backToMainMenu">${t('common.backToMainMenu')}</span>
                </button>

                <div class="module-header">
                    <span class="toeic-part-badge">FULL TEST · PARTS 1–7</span>
                    <div class="module-header-icon" aria-hidden="true">📋</div>
                    <h2 class="module-header-title" data-i18n="test.simulatorTitle">${t('test.simulatorTitle')}</h2>
                    <p class="module-header-subtitle" data-i18n="test.chooseType">${t('test.chooseType')}</p>
                </div>

                <div class="module-actions">
                    <button onclick="window.app.startFullTOEICTest()" class="module-action-btn primary">
                        <span class="module-action-icon" aria-hidden="true">📋</span>
                        <div class="module-action-text">
                            <div class="module-action-title" data-i18n="test.fullTest">${t('test.fullTest')}</div>
                            <div class="module-action-desc" data-i18n="test.fullTestDesc">${t('test.fullTestDesc')}</div>
                            <div class="module-action-desc">⏱️ <span data-i18n="test.durationFull">${t('test.durationFull')}</span> · 📊 ${t('test.questions')}: 200 · 🎯 ${t('test.score')}: 10-990</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                    <button onclick="window.app.startListeningTOEICTest()" class="module-action-btn">
                        <span class="module-action-icon" aria-hidden="true">🎧</span>
                        <div class="module-action-text">
                            <div class="module-action-title" data-i18n="test.listeningTest">${t('test.listeningTest')}</div>
                            <div class="module-action-desc" data-i18n="test.listeningParts">${t('test.listeningParts')}</div>
                            <div class="module-action-desc">⏱️ <span data-i18n="test.durationListening">${t('test.durationListening')}</span> · 📊 ${t('test.questions')}: 100 · 🎯 ${t('test.score')}: 5-495</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                    <button onclick="window.app.startReadingTOEICTest()" class="module-action-btn">
                        <span class="module-action-icon" aria-hidden="true">📖</span>
                        <div class="module-action-text">
                            <div class="module-action-title" data-i18n="test.readingTest">${t('test.readingTest')}</div>
                            <div class="module-action-desc" data-i18n="test.readingParts">${t('test.readingParts')}</div>
                            <div class="module-action-desc">⏱️ <span data-i18n="test.durationReading">${t('test.durationReading')}</span> · 📊 ${t('test.questions')}: 100 · 🎯 ${t('test.score')}: 5-495</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                </div>

                <!-- Test History -->
                <div class="quiz-card">
                    <h4 class="text-lg font-semibold text-white mb-4">📊 <span data-i18n="module.history.title">${t('module.history.title')}</span></h4>
                    <div id="testHistory" class="space-y-3">
                        <div class="text-center text-white/60 py-4">
                            ${t('test.noHistory')}
                        </div>
                    </div>
                </div>

                <div class="module-actions">
                    <button onclick="window.app.showTestSettings()" class="module-action-btn">
                        <span class="module-action-icon" aria-hidden="true">⚙️</span>
                        <div class="module-action-text">
                            <div class="module-action-title" data-i18n="test.settings">${t('test.settings')}</div>
                        </div>
                        <span class="module-action-chevron" aria-hidden="true">›</span>
                    </button>
                </div>
            </div>
        `;
        
        // Load test history
        this.loadTestHistory();
    }
    
    // Test Simulation Functions
    startFullTOEICTest() {
        console.log('🎯 Starting Full TOEIC Test...');
        
        if (!window.TOEICTestSimulator) {
            console.error('❌ TOEIC Test Simulator not available');
            return;
        }
        
        if (!window.toeicTestSimulator) {
            window.toeicTestSimulator = new window.TOEICTestSimulator();
        }
        const testSession = window.toeicTestSimulator.startTest({ type: 'full' });
        this.testTimerSeconds = 0; // fresh clock for a new test
        this.testAudioPlays = {}; // fresh replay counters

        this.showTestInterface(testSession, 'full');
    }
    
    startListeningTOEICTest() {
        console.log('🎧 Starting Listening TOEIC Test...');
        
        if (!window.TOEICTestSimulator) {
            console.error('❌ TOEIC Test Simulator not available');
            return;
        }
        
        if (!window.toeicTestSimulator) {
            window.toeicTestSimulator = new window.TOEICTestSimulator();
        }
        const testSession = window.toeicTestSimulator.startTest({ type: 'listening' });
        this.testTimerSeconds = 0; // fresh clock for a new test
        this.testAudioPlays = {}; // fresh replay counters

        this.showTestInterface(testSession, 'listening');
    }
    
    startReadingTOEICTest() {
        console.log('📚 Starting Reading TOEIC Test...');
        
        if (!window.TOEICTestSimulator) {
            console.error('❌ TOEIC Test Simulator not available');
            return;
        }
        
        if (!window.toeicTestSimulator) {
            window.toeicTestSimulator = new window.TOEICTestSimulator();
        }
        const testSession = window.toeicTestSimulator.startTest({ type: 'reading' });
        this.testTimerSeconds = 0; // fresh clock for a new test
        this.testAudioPlays = {}; // fresh replay counters

        this.showTestInterface(testSession, 'reading');
    }
    
    showTestInterface(testSession, testType) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        content.classList.remove('hidden'); // deep links may arrive with the container hidden

        const testInfo = this.getTestInfo(testType);
        const currentQuestion = window.toeicTestSimulator?.getCurrentQuestion?.() || null;
        // Real exam numbering (reading starts at 101) + per-part label
        const questionHeading = currentQuestion
            ? `${t('status.question')} ${currentQuestion.number}`
            : `${t('status.question')} ${(testSession.currentQuestion || 0) + 1}`;
        const partBadge = currentQuestion?.part
            ? `<span class="text-xs font-semibold text-blue-300 bg-blue-500/20 rounded-full px-3 py-1 ml-3 align-middle">${t('test.partLabel', { part: currentQuestion.part })}</span>`
            : '';

        content.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="glass-effect rounded-xl p-6 mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-white">${testInfo.title}</h3>
                        <div class="text-right">
                            <div class="text-sm text-white/80">${t('test.timeRemaining')}</div>
                            <div id="testTimer" class="text-lg font-bold text-blue-400">${testInfo.duration}</div>
                        </div>
                    </div>

                    ${(() => {
                        // Real TOEIC never reveals right/wrong mid-test; the
                        // old Correct/Incorrect tiles read properties that
                        // don't exist and always showed 0. Show answered/
                        // remaining computed from the real answer sheets —
                        // also correct across the listening→reading boundary
                        // of a full test (the old per-section index made the
                        // progress bar restart at 50%).
                        const answeredCount = Object.values(testSession.sections || {})
                            .reduce((sum, s) => sum + Object.keys(s.answers || {}).length, 0);
                        const totalCount = testInfo.totalQuestions || 1;
                        return `
                    <div class="grid grid-cols-3 gap-4 mb-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-400">${answeredCount}</div>
                            <div class="text-sm text-white/80">${t('test.answered')}</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-yellow-400">${totalCount - answeredCount}</div>
                            <div class="text-sm text-white/80">${t('test.remaining')}</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-400">${answeredCount}/${totalCount}</div>
                            <div class="text-sm text-white/80">${t('quiz.progress')}</div>
                        </div>
                    </div>

                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div id="progressBar" class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: ${(answeredCount / totalCount) * 100}%"></div>
                    </div>`;
                    })()}
                </div>

                <div class="glass-effect rounded-xl p-6">
                    <div id="testQuestion" class="mb-6">
                        <h4 class="text-lg font-semibold text-white mb-4">${questionHeading}${partBadge}</h4>
                        <div class="text-white/90 mb-6">
                            ${this.generateTestQuestion(testSession, testType)}
                        </div>
                        
                        <div id="testOptions" class="space-y-3">
                            ${this.generateTestOptions(testSession, testType)}
                        </div>
                    </div>
                    
                    <div class="flex justify-between">
                        <button id="prevBtn" onclick="window.app.previousTestQuestion()" class="btn btn-secondary" ${(testSession.currentQuestion || 0) < 1 ? 'disabled' : ''}>
                            <i data-lucide="chevron-left" class="w-5 h-5 mr-2"></i>
                            ${t('quiz.previousQuestion')}
                        </button>

                        <button id="nextBtn" onclick="window.app.nextTestQuestion()" class="btn btn-primary">
                            ${t('common.next')}
                            <i data-lucide="chevron-right" class="w-5 h-5 ml-2"></i>
                        </button>
                    </div>
                </div>

                <div class="flex justify-center mt-6">
                    <button onclick="window.app.submitTest()" class="btn btn-danger">
                        <i data-lucide="flag" class="w-5 h-5 mr-2"></i>
                        ${t('test.submitTest')}
                    </button>
                </div>
            </div>
        `;

        // Restore a previously selected answer (e.g. after Previous)
        if (currentQuestion) {
            const section = window.toeicTestSimulator?.currentTest?.sections?.[currentQuestion.section];
            const savedAnswer = section?.answers?.[currentQuestion.number];
            if (savedAnswer && Number.isInteger(savedAnswer.answer)) {
                const input = content.querySelector(`input[name="testAnswer"][value="${savedAnswer.answer}"]`);
                if (input) input.checked = true;
            }
        }

        // Start test timer
        this.startTestTimer(testInfo.duration);
    }

    getTestInfo(testType) {
        // Use the simulator's configured section limits (45 min listening +
        // 75 min reading), not a hardcoded duration
        const config = window.toeicTestSimulator?.testConfig;
        const listeningMs = config?.listening?.timeLimit ?? 45 * 60 * 1000;
        const readingMs = config?.reading?.timeLimit ?? 75 * 60 * 1000;
        const formatDuration = (ms) => {
            const totalSeconds = Math.round(ms / 1000);
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        };

        const testInfo = {
            full: {
                title: t('test.fullTest'),
                duration: formatDuration(listeningMs + readingMs),
                totalQuestions: (config?.listening?.totalQuestions ?? 100) + (config?.reading?.totalQuestions ?? 100)
            },
            listening: {
                title: t('test.listeningTitle'),
                duration: formatDuration(listeningMs),
                totalQuestions: config?.listening?.totalQuestions ?? 100
            },
            reading: {
                title: t('test.readingTitle'),
                duration: formatDuration(readingMs),
                totalQuestions: config?.reading?.totalQuestions ?? 100
            }
        };

        return testInfo[testType] || testInfo.full;
    }
    
    // Audio player card for listening questions. The spoken content is
    // NEVER rendered as text — the student presses Play and listens.
    buildTestAudioCard(question) {
        this.testAudioPlays = this.testAudioPlays || {};
        const played = this.testAudioPlays[question.number] || 0;
        const replaysLeft = played <= 1 ? 2 : Math.max(0, 3 - played);
        const exhausted = played >= 3;

        return `
            <div class="bg-gray-800/60 border border-white/10 rounded-xl p-6 mb-4 text-center">
                <p class="text-white/60 text-sm mb-4">🎧 ${t('test.listenCarefully')}</p>
                <button id="testPlayBtn" onclick="window.app.playTestAudio()"
                        class="btn btn-primary text-lg px-8 py-3" ${exhausted ? 'disabled' : ''}>
                    ▶ ${played === 0 ? t('test.play') : t('test.replay')}
                </button>
                <div id="testReplayInfo" class="text-white/50 text-sm mt-3">
                    ${exhausted ? t('test.noReplays') : t('test.replaysLeft', { count: replaysLeft })}
                </div>
            </div>
        `;
    }

    // Scrollable passage panel for Parts 6/7 (companion text for double passages)
    buildTestPassagePanel(question) {
        const renderText = (p) => {
            if (!p) return '';
            if (typeof p === 'string') return p;
            return (p.title ? p.title + '\n\n' : '') + (p.content || '');
        };
        const main = renderText(question.passage);
        const companion = renderText(question.companionPassage);
        return `
            <div class="bg-gray-800 rounded-lg p-6 mb-4 max-h-96 overflow-y-auto text-left">
                <p class="text-white/90 whitespace-pre-line">${main}</p>
                ${companion ? `
                    <hr class="border-white/20 my-4">
                    <p class="text-white/90 whitespace-pre-line">${companion}</p>
                ` : ''}
            </div>
        `;
    }

    generateTestQuestion(testSession, testType) {
        if (!window.toeicTestSimulator) {
            return `<p class="text-red-400">${t('test.simulatorUnavailable')}</p>`;
        }

        const question = window.toeicTestSimulator.getCurrentQuestion();
        if (!question) {
            return `<p class="text-yellow-400">${t('test.noQuestion')}</p>`;
        }

        // Types come from toeic-test-simulator.js: photographs (P1),
        // questionResponse (P2), conversations (P3), talks (P4),
        // incompleteSentences (P5), textCompletion (P6), readingComprehension (P7)
        if (question.type === 'photographs') {
            // Emoji scene stands in for the photograph; the 4 statements are audio-only
            return `
                <div class="text-center mb-6">
                    <p class="text-white/70 mb-4">${t('test.part1Instr')}</p>
                    <div class="bg-gray-800 rounded-xl p-8 mb-4">
                        <div class="text-6xl mb-3" role="img" aria-label="${question.caption || ''}">${question.scene || '🖼️'}</div>
                        ${question.caption ? `<p class="text-white/60 text-sm italic">${question.caption}</p>` : ''}
                    </div>
                    ${this.buildTestAudioCard(question)}
                </div>
            `;
        } else if (question.type === 'questionResponse') {
            return `
                <div class="text-center mb-6">
                    <p class="text-white/70 mb-4">${t('test.part2Instr')}</p>
                    ${this.buildTestAudioCard(question)}
                </div>
            `;
        } else if (question.type === 'conversations') {
            // The conversation itself is audio-only; question + options are shown
            return `
                <div class="mb-6">
                    <p class="text-white/70 mb-4">${t('test.part3Instr')}</p>
                    ${this.buildTestAudioCard(question)}
                    <p class="text-white/90 text-lg mb-4">${question.question}</p>
                </div>
            `;
        } else if (question.type === 'talks') {
            return `
                <div class="mb-6">
                    <p class="text-white/70 mb-4">${t('test.part4Instr')}</p>
                    ${this.buildTestAudioCard(question)}
                    <p class="text-white/90 text-lg mb-4">${question.question}</p>
                </div>
            `;
        } else if (question.type === 'incompleteSentences') {
            return `
                <div class="mb-6">
                    <p class="text-white/70 mb-4">${t('test.part5Instr')}</p>
                    <p class="text-white/90 text-lg mb-4">${question.sentence || question.question}</p>
                </div>
            `;
        } else if (question.type === 'textCompletion') {
            return `
                <div class="mb-6">
                    <p class="text-white/70 mb-4">${t('test.part6Instr')}</p>
                    ${this.buildTestPassagePanel(question)}
                    ${question.question ? `<p class="text-white/90 mb-4">${question.question}</p>` : ''}
                </div>
            `;
        } else if (question.type === 'readingComprehension') {
            return `
                <div class="mb-6">
                    <p class="text-white/70 mb-4">${t('test.part7Instr')}</p>
                    ${this.buildTestPassagePanel(question)}
                    <p class="text-white/90 mb-4">${question.question}</p>
                </div>
            `;
        }

        return `<p class="text-red-400">${t('test.unknownType')}</p>`;
    }

    generateTestOptions(testSession, testType) {
        if (!window.toeicTestSimulator) {
            return `<p class="text-red-400">${t('test.simulatorUnavailable')}</p>`;
        }

        const question = window.toeicTestSimulator.getCurrentQuestion();
        if (!question || !question.options) {
            return `<p class="text-yellow-400">${t('test.noOptions')}</p>`;
        }

        // Parts 1 & 2: audio-only — render letter-only answer buttons
        // (the spoken statements/responses are never displayed)
        if (question.lettersOnly) {
            const letterButtons = question.options.map((_, index) => {
                const optionLetter = String.fromCharCode(65 + index);
                return `
                    <label class="flex items-center justify-center w-16 h-16 bg-gray-800/40 rounded-xl cursor-pointer hover:bg-gray-700/60 transition-colors text-white text-xl font-bold">
                        <input type="radio" name="testAnswer" value="${index}" class="mr-2">${optionLetter}
                    </label>
                `;
            }).join('');
            return `<div class="flex gap-4 justify-center">${letterButtons}</div>`;
        }

        // Written options (A, B, C, D)
        let options = '';
        question.options.forEach((option, index) => {
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
            options += `
                <label class="flex items-center p-3 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                    <input type="radio" name="testAnswer" value="${index}" class="mr-3">
                    <span class="text-white/90">${optionLetter}. ${option}</span>
                </label>
            `;
        });
        return options;
    }

    // Build the spoken TTS sequence for the current listening question
    buildTestAudioSequence(question) {
        const parts = [];
        const letters = ['A', 'B', 'C', 'D'];

        if (question.type === 'photographs') {
            (question.spokenStatements || []).forEach((statement, i) => {
                parts.push({ text: `${letters[i]}. ${statement}`, voiceHint: null, pauseAfterMs: 700 });
            });
        } else if (question.type === 'questionResponse') {
            if (question.spokenQuestion) {
                parts.push({ text: question.spokenQuestion, voiceHint: 'M', pauseAfterMs: 900 });
            }
            (question.spokenResponses || []).forEach((response, i) => {
                parts.push({ text: `${letters[i]}. ${response}`, voiceHint: 'W', pauseAfterMs: 700 });
            });
        } else if (question.type === 'conversations') {
            (question.conversation || []).forEach(line => {
                if (!line || !line.text) return;
                const speaker = (line.speaker || 'M').charAt(0).toUpperCase() === 'W' ? 'W' : 'M';
                parts.push({ text: line.text, voiceHint: speaker, pauseAfterMs: 350 });
            });
        } else if (question.type === 'talks') {
            if (question.talk) {
                parts.push({ text: question.talk, voiceHint: 'M', pauseAfterMs: 0 });
            }
        }

        return parts;
    }

    playTestAudio() {
        const question = window.toeicTestSimulator?.getCurrentQuestion?.();
        const audio = window.audioSystem;
        if (!question || !audio || typeof audio.speakSequence !== 'function') return;

        this.testAudioPlays = this.testAudioPlays || {};
        const played = this.testAudioPlays[question.number] || 0;
        if (played >= 3) return; // first play + 2 replays max

        const parts = this.buildTestAudioSequence(question);
        if (parts.length === 0) return;

        this.testAudioPlays[question.number] = played + 1;
        const playsSoFar = played + 1;
        const questionNumber = question.number;

        const playBtn = document.getElementById('testPlayBtn');
        const replayInfo = document.getElementById('testReplayInfo');
        if (playBtn) {
            playBtn.disabled = true;
            playBtn.innerHTML = `🔊 ${t('test.playing')}`;
        }
        if (replayInfo) {
            const replaysLeft = Math.max(0, 3 - playsSoFar);
            replayInfo.textContent = replaysLeft > 0
                ? t('test.replaysLeft', { count: replaysLeft })
                : t('test.noReplays');
        }

        audio.speakSequence(parts, {
            onEnd: () => {
                // Only touch the DOM if the same question is still shown
                const current = window.toeicTestSimulator?.getCurrentQuestion?.();
                if (!current || current.number !== questionNumber) return;
                const btn = document.getElementById('testPlayBtn');
                if (btn) {
                    if (playsSoFar >= 3) {
                        btn.disabled = true;
                        btn.innerHTML = `▶ ${t('test.replay')}`;
                    } else {
                        btn.disabled = false;
                        btn.innerHTML = `▶ ${t('test.replay')}`;
                    }
                }
            }
        });
    }
    
    startTestTimer(duration) {
        // Never stack timers: re-rendering the interface calls this again
        if (this.testTimer) {
            clearInterval(this.testTimer);
            this.testTimer = null;
        }

        // Keep the remaining time across re-renders; only parse the full
        // duration when a new test starts (no simulator session in progress
        // resets it via startFullTOEICTest et al. clearing testTimerSeconds)
        let totalSeconds;
        if (typeof this.testTimerSeconds === 'number' && this.testTimerSeconds > 0) {
            totalSeconds = this.testTimerSeconds;
        } else {
            // Parse duration (e.g., "2:30:00" or "0:45:00")
            const parts = duration.split(':');
            totalSeconds = 0;
            if (parts.length === 3) {
                totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
            } else if (parts.length === 2) {
                totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
            }
        }
        this.testTimerSeconds = totalSeconds;

        this.testTimer = setInterval(() => {
            totalSeconds--;
            this.testTimerSeconds = totalSeconds;

            if (totalSeconds <= 0) {
                clearInterval(this.testTimer);
                this.testTimer = null;
                this.submitTest();
                return;
            }
            
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            const timeString = hours > 0 ? 
                `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` :
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            const timerElement = document.getElementById('testTimer');
            if (timerElement) {
                timerElement.textContent = timeString;
                
                // Change color when time is running low
                if (totalSeconds < 300) { // Less than 5 minutes
                    timerElement.className = 'text-lg font-bold text-red-400';
                } else if (totalSeconds < 900) { // Less than 15 minutes
                    timerElement.className = 'text-lg font-bold text-yellow-400';
                }
            }
        }, 1000);
    }
    
    nextTestQuestion() {
        console.log('➡️ Moving to next question');

        if (!window.toeicTestSimulator) {
            console.error('❌ Test simulator not available');
            return;
        }

        // Never let the previous question's audio bleed into the next one
        window.audioSystem?.cancelSpeech?.();

        // Record the answer if selected — answerQuestion() advances the
        // question pointer internally, so don't also call nextQuestion()
        const selectedAnswer = document.querySelector('input[name="testAnswer"]:checked');
        let hasNext;
        if (selectedAnswer) {
            const answerIndex = parseInt(selectedAnswer.value);
            window.toeicTestSimulator.answerQuestion(answerIndex);
            console.log(`📝 Answered question with: ${answerIndex}`);
            hasNext = window.toeicTestSimulator.getCurrentQuestion() !== null;
        } else {
            // nextQuestion() returns false at a section boundary even when
            // the next section auto-started (full test: listening → reading),
            // so trust getCurrentQuestion(), not the boolean — otherwise an
            // unanswered last listening question submits the whole test
            window.toeicTestSimulator.nextQuestion();
            hasNext = window.toeicTestSimulator.getCurrentQuestion() !== null;
        }

        if (hasNext) {
            // Refresh the test interface
            const currentTest = window.toeicTestSimulator.currentTest;
            this.showTestInterface(currentTest, currentTest.type);
        } else {
            // Test completed
            this.submitTest();
        }
    }
    
    previousTestQuestion() {
        console.log('⬅️ Moving to previous question');
        
        if (!window.toeicTestSimulator) {
            console.error('❌ Test simulator not available');
            return;
        }

        // Stop any in-flight listening audio before navigating
        window.audioSystem?.cancelSpeech?.();

        // Move to previous question
        const hasPrevious = window.toeicTestSimulator.previousQuestion();
        if (hasPrevious) {
            // Refresh the test interface
            const currentTest = window.toeicTestSimulator.currentTest;
            this.showTestInterface(currentTest, currentTest.type);
        }
    }
    
    submitTest() {
        console.log('📝 Submitting test...');
        
        if (!window.toeicTestSimulator) {
            console.error('❌ Test simulator not available');
            return;
        }

        // Stop any in-flight listening audio
        window.audioSystem?.cancelSpeech?.();

        // Get current answer if selected
        const selectedAnswer = document.querySelector('input[name="testAnswer"]:checked');
        if (selectedAnswer) {
            const answerIndex = parseInt(selectedAnswer.value);
            window.toeicTestSimulator.answerQuestion(answerIndex);
        }
        
        // Stop timer
        if (this.testTimer) {
            clearInterval(this.testTimer);
        }
        
        // Submit the test
        const results = window.toeicTestSimulator.submitTest();
        console.log('📊 Test results:', results);
        this.testTimerSeconds = 0;

        // Track analytics using the real result shape
        if (results && window.advancedAnalytics && typeof window.advancedAnalytics.trackTestScore === 'function') {
            const sectionScores = Object.values(results.sections || {}).map(s => s.score).filter(Boolean);
            window.advancedAnalytics.trackTestScore('toeic_test', results.overall?.total || 0, {
                correctAnswers: sectionScores.reduce((sum, s) => sum + s.correct, 0),
                totalQuestions: sectionScores.reduce((sum, s) => sum + s.total, 0),
                accuracy: sectionScores.length > 0
                    ? Math.round(sectionScores.reduce((sum, s) => sum + s.accuracy, 0) / sectionScores.length)
                    : 0
            });
        }

        // Show test results
        this.showTestResults(results);
    }
    
    showTestResults(results) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;

        // Derive real numbers from the simulator's result shape
        const sectionScores = Object.values(results?.sections || {}).map(s => s.score).filter(Boolean);
        const correctAnswers = sectionScores.reduce((sum, s) => sum + s.correct, 0);
        const totalQuestions = sectionScores.reduce((sum, s) => sum + s.total, 0);
        const incorrectAnswers = Math.max(0, totalQuestions - correctAnswers);
        const toeicScore = results?.overall?.total ?? 0;
        const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        const level = results?.overall?.level;

        content.innerHTML = `
            <div class="max-w-2xl mx-auto text-center">
                <div class="glass-effect rounded-xl p-8 mb-6">
                    <h3 class="text-2xl font-bold text-white mb-6">🎉 ${t('test.complete')}</h3>
                    ${level ? `<p class="text-white/80 mb-6">${t('test.estimatedLevel')}: <span class="font-bold text-white">${level.level}</span> — ${level.description}</p>` : ''}

                    <div class="grid grid-cols-2 gap-6 mb-6">
                        <div class="bg-green-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-green-400">${correctAnswers}</div>
                            <div class="text-white/80">${t('quiz.correctAnswers')}</div>
                        </div>
                        <div class="bg-red-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-red-400">${incorrectAnswers}</div>
                            <div class="text-white/80">${t('common.incorrectAnswers')}</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-6 mb-6">
                        <div class="bg-blue-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-blue-400">${toeicScore}</div>
                            <div class="text-white/80">${t('test.toeicScore')}</div>
                        </div>
                        <div class="bg-purple-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-purple-400">${accuracy}%</div>
                            <div class="text-white/80">${t('quiz.accuracy')}</div>
                        </div>
                    </div>

                    <div class="flex justify-center gap-4">
                        <button onclick="window.app.showTestModule()" class="btn btn-primary">
                            <i data-lucide="clipboard-list" class="w-5 h-5 mr-2"></i>
                            ${t('test.takeAnother')}
                        </button>
                        <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                            <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                            ${t('common.mainMenu')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    loadTestHistory() {
        // Load test history from localStorage
        const testHistory = window.safeParseStorage('toeicTestHistory', []);
        const historyContainer = document.getElementById('testHistory');
        
        if (!historyContainer) return;
        
        if (testHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="text-center text-white/60 py-4">
                    ${t('test.noHistory')}
                </div>
            `;
            return;
        }
        
        historyContainer.innerHTML = testHistory.map(test => `
            <div class="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <div>
                    <div class="text-white font-medium">${test.type} Test</div>
                    <div class="text-white/60 text-sm">${new Date(test.date || test.completedAt).toLocaleDateString()}</div>
                </div>
                <div class="text-right">
                    <div class="text-green-400 font-bold">${test.score?.total ?? '—'}</div>
                    <div class="text-white/60 text-sm">${typeof test.accuracy === 'number' ? test.accuracy + '%' : ''}</div>
                </div>
            </div>
        `).join('');
    }
    
    showTestSettings() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        content.innerHTML = `
            <div class="max-w-2xl mx-auto">
                <div class="glass-effect rounded-xl p-6">
                    <h3 class="text-xl font-bold text-white mb-6">⚙️ ${t('test.settings')}</h3>

                    <div class="space-y-6">
                        <div>
                            <label class="block text-white/80 mb-2">${t('test.durationSetting')}</label>
                            <select class="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white">
                                <option value="standard">${t('test.optStandard')}</option>
                                <option value="extended">${t('test.optExtended')}</option>
                                <option value="practice">${t('test.optPractice')}</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-white/80 mb-2">${t('test.questionOrder')}</label>
                            <select class="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white">
                                <option value="sequential">${t('test.optSequential')}</option>
                                <option value="random">${t('test.optRandom')}</option>
                                <option value="difficulty">${t('test.optByDifficulty')}</option>
                            </select>
                        </div>

                        <div>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-3" checked>
                                <span class="text-white/80">${t('test.showExplanations')}</span>
                            </label>
                        </div>

                        <div>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-3">
                                <span class="text-white/80">${t('test.allowBack')}</span>
                            </label>
                        </div>
                    </div>

                    <div class="flex justify-center gap-4 mt-8">
                        <button onclick="window.app.showTestModule()" class="btn btn-primary">
                            ${t('test.saveSettings')}
                        </button>
                        <button onclick="window.app.showTestModule()" class="btn btn-secondary">
                            ${t('common.cancel')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    showFlashcardModule(options = {}) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        // If mode is 'review', start flashcard review
        if (options.mode === 'review') {
            this.startFlashcardReview('spaced_repetition');
            return;
        }
        
        // Otherwise show the flashcard interface
        this.initializeFlashcardModule();
    }
    
    showGrammarModule(options = {}) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        // If mode is 'practice', start grammar practice
        if (options.mode === 'practice') {
            this.startGrammarPractice('all');
            return;
        }
        
        // Otherwise show the grammar interface
        this.initializeGrammarModule();
    }
    
    showProgressModule(options = {}) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        // Track analytics
        if (window.advancedAnalytics && typeof window.advancedAnalytics.trackEvent === 'function') {
            window.advancedAnalytics.trackEvent('module', 'progress_viewed', {
                mode: options.mode || 'analytics'
            });
        }
        
        // Show analytics dashboard
        if (window.analyticsDashboard) {
            window.analyticsDashboard.showDashboard();
        } else {
            // Fallback if dashboard is not available
            content.innerHTML = `
                <div class="text-center">
                    <h3 class="text-xl font-bold text-white mb-4" data-i18n="progress.title">${t('progress.title')}</h3>
                    <p class="text-white/80 mb-6">${t('common.mode')}: ${options.mode || 'Analytics'}</p>
                    <div class="bg-yellow-500/20 rounded-lg p-4 mb-6">
                        <p class="text-yellow-400">⚠️ ${t('progress.loading')}</p>
                    </div>
                    <button onclick="window.app.endCurrentSession()" class="btn btn-primary" data-i18n="common.backToMainMenu">${t('common.backToMainMenu')}</button>
                </div>
            `;
        }
    }
    
    showSettingsModule(options = {}) {
        const content = document.getElementById('toeicModuleContent');
        content.innerHTML = `
            <div class="text-center">
                <h3 class="text-xl font-bold text-white mb-4" data-i18n="settings.toeicTitle">${t('settings.toeicTitle')}</h3>
                <p class="text-white/80 mb-6">${t('common.mode')}: ${options.mode || 'General'}</p>
                <div class="bg-gray-500/20 rounded-lg p-4 mb-6">
                    <p class="text-gray-400">⚙️ ${t('settings.underDevelopment')}</p>
                </div>
                <button onclick="window.app.endCurrentSession()" class="btn btn-primary" data-i18n="common.backToMainMenu">${t('common.backToMainMenu')}</button>
            </div>
        `;
    }
}

// TOEIC Module Functions
window.startTOEICModule = function(moduleType, options = {}) {
    if (window.app && window.app.startTOEICModule) {
        window.app.startTOEICModule(moduleType, options);
    } else {
        console.error('❌ App not initialized');
    }
};

// TOEIC Session Functions
window.startVocabularySession = function() {
    if (window.app && window.toeicVocabulary) {
        const session = window.toeicVocabulary.startSession({ wordCount: 20 });
        console.log('📚 Vocabulary session started');
        // Show vocabulary interface
        window.app.showTOEICVocabularyInterface(session);
    } else {
        console.error('❌ TOEIC Vocabulary system not available');
    }
};

window.startReadingSession = function() {
    if (window.app && window.toeicReading) {
        const session = window.toeicReading.startSession({ count: 20 });
        console.log('📖 Reading session started');
        window.app.showReadingInterface(session);
    } else {
        console.error('❌ TOEIC Reading system not available');
    }
};


window.showSettings = function() {
    if (window.app && window.app.showSettings) {
        window.app.showSettings();
    }
};

// Initialize the application when DOM is ready - BULLETPROOF PREVENTION
document.addEventListener('DOMContentLoaded', () => {
    // CRITICAL: Multiple checks for race conditions
    if (window.app && window.app.isInitialized) {
        console.warn('🛑 App ALREADY FULLY INITIALIZED, blocking duplicate');
        return;
    }
    
    if (window.appInitializing === true) {
        console.warn('🛑 App INITIALIZATION IN PROGRESS, blocking duplicate');
        return;
    }
    
    if (window.app && !window.app.isInitialized) {
        console.warn('🔄 App EXISTS but not initialized, forcing fresh start...');
        window.app = null;
        // Clear all app states
        window.appInitializing = false;
        document.body.removeAttribute('data-app-initializing');
        document.body.removeAttribute('data-app-ready');
    }
    
    // Set multiple locks to prevent race conditions
    window.appInitializing = true;
    document.body.setAttribute('data-app-initializing', 'true');
    
    console.log('🚀 STARTING SINGLE APP INITIALIZATION');
    window.app = new App();
    
    // Enable debug mode in development
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        window.app.enableDebugMode();
    }
    
    // Mark as completed
    window.appInitializing = false;
    document.body.setAttribute('data-app-initializing', 'false');
    document.body.setAttribute('data-app-ready', 'true');
    
    // Initialize floating home button
    initializeFloatingHomeButton();
});

// Floating Home Button Functionality
function initializeFloatingHomeButton() {
    const floatingBtn = document.getElementById('floatingHomeButton');
    if (!floatingBtn) return;

    // Shared pointer-capture drag utility (floating-drag.js): drag to
    // move, click to activate; the two can no longer interfere
    if (window.makeFloatingDraggable) {
        window.makeFloatingDraggable(floatingBtn, 'floatingHomeButtonPosition');
    }
}

// Global function to go home
window.goHome = function() {
    window.logger?.info('🏠 Going home...');

    try {
        // Full session/timer cleanup first — exiting via Home used to
        // leave the test timer running (which later auto-submitted the
        // abandoned test) and vocabulary/flashcard sessions dangling
        if (window.app && typeof window.app.endCurrentSession === 'function') {
            window.app.endCurrentSession();
        }

        // Hide all module content
        const moduleContent = document.getElementById('toeicModuleContent');
        if (moduleContent) {
            moduleContent.classList.add('hidden');
        }

        // Show main menu
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.classList.remove('hidden');
        }

        // Hide status bar
        const statusBar = document.getElementById('statusBar');
        if (statusBar) {
            statusBar.classList.add('hidden');
            console.log('✅ Hidden status bar');
        }
        
        // Hide any active session screens
        const sessionScreens = document.querySelectorAll('.screen');
        sessionScreens.forEach(screen => {
            if (!screen.classList.contains('hidden')) {
                screen.classList.add('hidden');
                console.log('✅ Hidden session screen:', screen.id || 'unnamed');
            }
        });
        
        // Show welcome screen
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.classList.remove('hidden');
            console.log('✅ Showed welcome screen');
        }
        
        // Reset any active sessions
        if (window.app && window.app.currentTOEICModule) {
            window.app.currentTOEICModule = null;
            console.log('✅ Reset active sessions');
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('✅ Scrolled to top');
        
        // Add pulse animation to home button for feedback
        const homeBtn = document.querySelector('.home-btn');
        if (homeBtn) {
            homeBtn.classList.add('pulse');
            setTimeout(() => {
                homeBtn.classList.remove('pulse');
            }, 2000);
            console.log('✅ Added pulse animation');
        }
        
        window.logger?.success('✅ Returned to home screen');
        console.log('🎉 goHome function completed successfully');
        
    } catch (error) {
        console.error('❌ Error in goHome function:', error);
        window.logger?.error('Error in goHome function:', error);
    }
};

// Also define it as a direct function for compatibility
function goHome() {
    window.goHome();
}

// Export for global use
window.App = App;
// Force deployment update - Sun Sep 21 00:17:25 CEST 2025
// Version: 1758407038 - Force cache bust
// Cache bust: 1758407358
// Force refresh: Sun Sep 21 00:42:00 CEST 2025
