// Main Application Controller for TOEIC Master Pro
// Orchestrates all components and manages application state

class App {
    constructor() {
        this.version = '3.0.0';
        this.isInitialized = false;
        this.currentGame = null;
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
        if (window.performanceOptimizer) {
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
        
        // Enable service worker for PWA
        if ('serviceWorker' in navigator && window.productionConfig.enablePWA) {
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
        // Wait for login system to be available
        if (!window.loginSystem) {
            console.log('⏳ Waiting for login system to load...');
            // Wait a bit and try again
            setTimeout(() => {
                if (!window.loginSystem) {
                    console.error('❌ Login system not available after timeout');
                    // Redirect to login page
                    if (window.location.pathname !== '/login.html' && !window.location.pathname.includes('login.html')) {
                        window.location.href = 'login.html';
                    }
                } else {
                    this.checkAuthentication();
                }
            }, 500);
            return false;
        }
        
        // Check if user is logged in
        if (!window.loginSystem.isLoggedIn()) {
            console.log('🔐 User not authenticated, redirecting to login...');
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login.html' && !window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html';
            }
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
                    <div class="text-sm opacity-90">Ready to master TOEIC?</div>
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
        
        // Add user info to navbar if it exists
        const navbar = document.querySelector('nav');
        if (navbar) {
            const userInfo = document.createElement('div');
            userInfo.className = 'flex items-center space-x-2 text-white/90';
            
            // Add admin dashboard button if user is admin
            const adminButton = welcomeInfo.isAdmin ? `
                <button id="adminDashboardBtn" class="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-xs transition-colors flex items-center space-x-1">
                    <span>👨‍💼</span>
                    <span>Admin Panel</span>
                </button>
            ` : '';
            
            userInfo.innerHTML = `
                <span class="text-sm">Welcome,</span>
                <span class="font-semibold">${welcomeInfo.name}</span>
                <span class="px-2 py-1 text-xs rounded-full ${welcomeInfo.isAdmin ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}">
                    ${welcomeInfo.role}
                </span>
                ${adminButton}
                <button onclick="window.app.logout()" class="text-white/70 hover:text-white text-sm underline">
                    Logout
                </button>
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
        try {
            // Check authentication first
            if (!this.checkAuthentication()) {
                return;
            }
            
            // Show loading screen
            this.updateLoadingProgress(5, 'Initializing application...');
            
            // Initialize core systems
            await this.initializePWA();
            this.updateLoadingProgress(15, 'Setting up offline support...');
            
            await this.initializeDataManager();
            this.updateLoadingProgress(30, 'Loading TOEIC vocabulary database...');
            
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
            
            await this.initializeRealTimeMonitor();
            this.updateLoadingProgress(82, 'Setting up performance monitoring...');
            
            // await this.initializeProgressDashboard(); // Removed - file doesn't exist
            this.updateLoadingProgress(85, 'Setting up dashboard...');
            
            await this.initializeGameEngine();
            this.updateLoadingProgress(90, 'Preparing game modes...');
            
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

            // FORCE CACHE CLEAR: Clear all cached data
            setTimeout(() => {
                if ('caches' in window) {
                    caches.keys().then(names => {
                        names.forEach(name => {
                            caches.delete(name);
                            console.log('🗑️ Cache cleared:', name);
                        });
                    });
                }
                // Clear localStorage for fresh start
                localStorage.clear();
                console.log('🗑️ LocalStorage cleared for fresh start');
            }, 500);
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.handleInitializationError(error);
        }
    }
    
    async initializePWA() {
        console.log('📱 Initializing PWA...');
        try {
            if ('serviceWorker' in navigator) {
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
    
    async initializeDataManager() {
        console.log('📚 Initializing Data Manager...');
        
        // Initialize data manager with timeout fallback
        const dataManagerPromise = new Promise((resolve, reject) => {
            if (window.DataManager) {
                window.dataManager = new window.DataManager();
                resolve();
            } else {
                reject(new Error('DataManager not available'));
            }
        });
        
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Data manager timeout')), 5000);
        });
        
        try {
            await Promise.race([dataManagerPromise, timeoutPromise]);
        } catch (error) {
            console.warn('⚠️ Data manager timeout, continuing with fallback');
            this.initializeFallbackData();
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
    
    async initializeRealTimeMonitor() {
        console.log('📊 Initializing Real-Time Monitor...');
        
        // Wait for RealTimeMonitor to be available
        for (let attempts = 0; attempts < 20; attempts++) {
            if (window.RealTimeMonitor) break;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        if (window.RealTimeMonitor) {
            this.realTimeMonitor = new window.RealTimeMonitor();
            window.realTimeMonitor = this.realTimeMonitor;
            console.log('✅ Real-Time Monitor initialized');
        } else {
            console.warn('⚠️ Real-Time Monitor not available, continuing without it');
        }
    }
    
    // async initializeProgressDashboard() {
    //     // Removed - progress dashboard file doesn't exist
    //     console.log('📊 Progress Dashboard removed - not used in current implementation');
    // }
    
    async initializeGameEngine() {
        console.log('🎮 Initializing Game Engine...');
        
        // Wait for GameEngine to be available
        let attempts = 0;
        for (attempts = 0; attempts < 10; attempts++) {
            if (window.GameEngine) break;
            console.log(`⏳ Waiting for GameEngine... (attempt ${attempts + 1})`);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        if (window.GameEngine) {
            window.gameEngine = new window.GameEngine();
            console.log('✅ Game Engine initialized');
        } else {
            throw new Error('GameEngine not available after waiting');
        }
    }
    
    initializeUIManager() {
        console.log('🎨 UI Manager ready');
        if (window.UIManager) {
            window.uiManager = new window.UIManager();
        }
    }
    
    initializeFallbackData() {
        // Provide minimal fallback data if data manager fails
        window.dataManager = {
            vocabulary: new Map([
                ['hello', { word: 'hello', level: 'A1', examples: ['Hello, how are you?'] }],
                ['goodbye', { word: 'goodbye', level: 'A1', examples: ['Goodbye, see you later!'] }],
                ['thank you', { word: 'thank you', level: 'A1', examples: ['Thank you for your help.'] }]
            ]),
            isReady: true
        };
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
        
        // Also remove any old text content that might be cached
        const oldTexts = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
        oldTexts.forEach(text => {
            if (text.textContent.includes('10 interactive game modes')) {
                text.textContent = text.textContent.replace('10 interactive game modes', '12 interactive game modes');
                console.log('🔄 Updated game count text');
            }
        });
        
        console.log('🏠 Welcome screen shown');
    }
    
    /**
     * Show game selection screen
     */
    showGameSelection() {
        // Hide welcome screen
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.classList.add('hidden');
        }
        
        // Show game selection screen
        const gameSelectionScreen = document.getElementById('gameSelectionScreen');
        if (gameSelectionScreen) {
            gameSelectionScreen.classList.remove('hidden');
        }
        
        console.log('🎮 Game selection screen shown');
    }
    
    /**
     * Initialize carousels for welcome screen
     */
    initializeCarousels() {
        // Enhanced retry mechanism for carousel system
        if (!window.carouselSystem) {
            console.log('⏳ Waiting for carousel system...');
            // Try multiple times with increasing delays
            let retryCount = 0;
            const maxRetries = 10;
            
            const retryCarousel = () => {
                retryCount++;
                if (window.carouselSystem) {
                    console.log('✅ Carousel system found after', retryCount, 'retries');
                    this.createMainHeroCarousel();
                } else if (retryCount < maxRetries) {
                    console.log(`⏳ Retry ${retryCount}/${maxRetries} for carousel system...`);
                    setTimeout(retryCarousel, 200 * retryCount);
                } else {
                    console.error('❌ Carousel system failed to load after', maxRetries, 'retries');
                    this.createFallbackHeroSection();
                }
            };
            
            retryCarousel();
            return;
        }
        
        this.createMainHeroCarousel();
    }
    
    /**
     * Create main hero carousel
     */
    createMainHeroCarousel() {
        if (!window.carouselSystem) return;
        
        // Main Hero Carousel - Replaces the main card
        const mainHeroItems = [
            {
                type: 'hero',
                key: 'toeicVocabulary',
                icon: '📚',
                title: 'TOEIC Vocabulary',
                description: 'Master essential TOEIC vocabulary with spaced repetition and interactive flashcards',
                highlight: '620+ Words',
                action: 'Start Vocabulary'
            },
            {
                type: 'hero',
                key: 'toeicReading',
                icon: '📖',
                title: 'TOEIC Reading',
                description: 'Practice reading comprehension with real TOEIC-style passages and questions',
                highlight: '25 Questions',
                action: 'Start Reading'
            },

            {
                type: 'hero',
                key: 'toeicGrammar',
                icon: '📝',
                title: 'TOEIC Grammar',
                description: 'Master essential grammar patterns with 22 practice questions and explanations',
                highlight: '8 Categories',
                action: 'Start Grammar'
            },
            {
                type: 'hero',
                key: 'toeicTestSimulator',
                icon: '📋',
                title: 'TOEIC Test Simulator',
                description: 'Take full-length practice tests to simulate the real TOEIC exam experience',
                highlight: 'Full Test',
                action: 'Start Test'
            },
            {
                type: 'hero',
                key: 'toeicFlashcards',
                icon: '🃏',
                title: 'TOEIC Flashcards',
                description: 'Review vocabulary with intelligent flashcards and spaced repetition system',
                highlight: 'Smart Learning',
                action: 'Start Flashcards'
            }
        ];
        
        try {
            if (window.carouselSystem && typeof window.carouselSystem.createCarousel === 'function') {
                window.carouselSystem.createCarousel('mainHeroCarousel', mainHeroItems, {
                    autoplay: true,
                    autoplaySpeed: 5000,
                    showDots: true,
                    showArrows: true,
                    infinite: true,
                    touchSwipe: true
                });
                console.log('🎠 Main hero carousel initialized successfully');
                
                // Listen for language changes to update carousel
                window.addEventListener('languageChanged', () => {
                    console.log('🌍 Language changed, updating carousel...');
                    // Reinitialize carousel with new language
                    setTimeout(() => {
                        this.initializeCarousels();
                    }, 100);
                });
            } else {
                console.warn('⚠️ Carousel system not available, using fallback');
                this.createFallbackHeroSection();
            }
        } catch (error) {
            console.error('❌ Failed to create carousel:', error);
            this.createFallbackHeroSection();
        }
    }
    
    /**
     * Create fallback hero section if carousel fails
     */
    createFallbackHeroSection() {
        const carouselContainer = document.getElementById('mainHeroCarousel');
        if (!carouselContainer) return;
        
        console.log('🔄 Creating fallback hero section...');
        
        carouselContainer.innerHTML = `
            <div class="hero-fallback glass-effect rounded-2xl p-8 text-center">
                <div class="text-6xl mb-4">🎓</div>
                <h1 class="text-4xl font-bold text-white mb-4">Master English Vocabulary</h1>
                <p class="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                    Professional ESL learning platform with 12 interactive game modes and 731+ vocabulary words across all levels
                </p>
                <div class="flex flex-wrap gap-4 justify-center">
                    <button onclick="startGame('multipleChoice')" class="btn-primary glass-effect px-8 py-3 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300">
                        <i data-lucide="play" class="w-5 h-5 inline mr-2"></i>
                        Start Learning
                    </button>
                    <button onclick="startGame('vocabularyLearning')" class="btn-secondary glass-effect px-8 py-3 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300">
                        <i data-lucide="library" class="w-5 h-5 inline mr-2"></i>
                        Vocabulary Mode
                    </button>
                </div>
            </div>
        `;
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    applyUserSettings() {
        // Apply saved user preferences
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        
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
        const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
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
        // Calculate current daily study streak
        let streak = 0;
        const today = new Date().toDateString();
        
        for (let i = sessions.length - 1; i >= 0; i--) {
            const sessionDate = new Date(sessions[i].date).toDateString();
            const expectedDate = new Date(Date.now() - (streak * 24 * 60 * 60 * 1000)).toDateString();
            
            if (sessionDate === expectedDate) {
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
        
        // Window focus/blur for pause/resume
        window.addEventListener('focus', () => {
            if (this.currentGame && typeof this.currentGame.resume === 'function') {
                this.currentGame.resume();
            }
        });
        
        window.addEventListener('blur', () => {
            if (this.currentGame && typeof this.currentGame.pause === 'function') {
                this.currentGame.pause();
            }
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
        
        // Number keys for game choices (when in game)
        if (this.currentGame && /^[1-9]$/.test(event.key)) {
            const number = parseInt(event.key);
            if (this.currentGame.handleNumberKey) {
                this.currentGame.handleNumberKey(number);
            }
        }
    }
    
    handleEscapeKey() {
        // Close any open modals or return to main menu
        if (this.currentGame) {
            this.endCurrentGame();
        }
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
            
            // Start adaptive learning session
            if (window.adaptiveLearning) {
                window.adaptiveLearning.startSession();
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
                    if (window.toeicTestSimulator) {
                        const test = window.toeicTestSimulator.startTest({ type: options.type || 'full' });
                        this.showTOEICTestInterface(test);
                    }
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
    
    // Game Management (Legacy support)
    startGame(gameMode, options = {}) {
        console.log(`🎯 Starting legacy game: ${gameMode}`);
        
        return safeExecute(() => {
            // Start adaptive learning session
            if (window.adaptiveLearning) {
                window.adaptiveLearning.startSession();
            }
            
            // Initialize game through game engine
            if (window.gameEngine && window.gameEngine.startGame) {
                this.currentGame = window.gameEngine.startGame(gameMode, options);
                
                // Add global controls if not already added
                if (!document.getElementById('globalControls') && !document.getElementById('progressControlBtn')) {
                    if (window.gameEngine && typeof window.gameEngine.addGlobalControls === 'function') {
                        window.gameEngine.addGlobalControls();
                    } else {
                        console.warn('⚠️ addGlobalControls method not available, creating fallback controls');
                        this.createFallbackGlobalControls();
                    }
                }
            } else {
                throw new Error('Game engine not available');
            }
            
            // Track session start
            this.sessionData = [];
            this.sessionStartTime = Date.now();
            
            // Trigger haptic feedback on mobile
            if (window.triggerHaptic) {
                window.triggerHaptic('light');
            }
            
        }, null, 'Failed to start game');
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
            <div class="max-w-4xl mx-auto">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-white mb-2">TOEIC Vocabulary Learning</h1>
                        <p class="text-white/80">Master business English vocabulary with spaced repetition</p>
                        <div class="flex items-center gap-4 mt-2">
                            <span class="text-sm text-white/60" id="totalVocabularyCount">Loading vocabulary...</span>
                            <button onclick="window.app.forceReloadVocabulary()" class="text-xs bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1 rounded-full text-blue-300 transition-colors">
                                <i data-lucide="refresh-cw" class="w-3 h-3 mr-1"></i>
                                Reload Vocabulary
                            </button>
                        </div>
                    </div>
                    <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                        <i data-lucide="x" class="w-5 h-5 mr-2"></i>
                        Exit Session
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-blue-500/20 rounded-xl p-4 text-center">
                        <h3 class="text-sm font-semibold text-white mb-1">Words Remaining</h3>
                        <p class="text-2xl font-bold text-blue-300" id="wordsRemaining">${session.length}</p>
                    </div>
                    <div class="bg-green-500/20 rounded-xl p-4 text-center">
                        <h3 class="text-sm font-semibold text-white mb-1">Correct</h3>
                        <p class="text-2xl font-bold text-green-300" id="correctCount">0</p>
                    </div>
                    <div class="bg-red-500/20 rounded-xl p-4 text-center">
                        <h3 class="text-sm font-semibold text-white mb-1">Incorrect</h3>
                        <p class="text-2xl font-bold text-red-300" id="incorrectCount">0</p>
                    </div>
                    <div class="bg-purple-500/20 rounded-xl p-4 text-center">
                        <h3 class="text-sm font-semibold text-white mb-1">Accuracy</h3>
                        <p class="text-2xl font-bold text-purple-300" id="sessionAccuracy">0%</p>
                    </div>
                </div>
                
                <div id="vocabularyCard" class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
                    <div class="text-center">
                        <div class="mb-6">
                            <div class="flex items-center justify-center gap-3 mb-4">
                                <div class="bg-blue-500/20 px-3 py-1 rounded-full">
                                    <span class="text-blue-300 text-sm font-medium" id="wordLevel">B1</span>
                                </div>
                                <div class="bg-purple-500/20 px-3 py-1 rounded-full">
                                    <span class="text-purple-300 text-sm font-medium" id="wordCategory">business</span>
                                </div>
                                <div class="bg-green-500/20 px-3 py-1 rounded-full">
                                    <span class="text-green-300 text-sm font-medium" id="wordFrequency">high</span>
                                </div>
                            </div>
                            <h2 class="text-5xl font-bold text-white mb-4 tracking-wide" id="currentWord">Loading...</h2>
                            <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                        </div>
                        
                        <div class="mb-8">
                            <div class="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
                                <p class="text-white/80 text-lg mb-4" id="wordMeaning">Click "Show Meaning" to reveal the definition</p>
                                <button onclick="window.app.showWordMeaning()" class="btn btn-primary btn-lg" id="showMeaningBtn">
                                    <i data-lucide="eye" class="w-5 h-5 mr-2"></i>
                                    Show Meaning
                                </button>
                            </div>
                        </div>
                        
                        <div id="wordExamples" class="hidden mb-8">
                            <div class="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                                    <i data-lucide="book-open" class="w-5 h-5 mr-2 text-blue-400"></i>
                                    Example Sentences
                                </h3>
                                <div class="space-y-4" id="examplesList"></div>
                            </div>
                        </div>
                        
                        <div id="answerButtons" class="hidden">
                            <div class="bg-white/5 rounded-xl p-6 border border-white/10">
                                <p class="text-white/80 mb-6 text-center text-lg">Did you know this word?</p>
                                <div class="flex gap-6 justify-center">
                                    <button onclick="window.app.recordVocabularyAnswer(true)" class="btn btn-success btn-lg px-8 py-4 text-lg">
                                        <i data-lucide="check" class="w-6 h-6 mr-3"></i>
                                        I Know It
                                    </button>
                                    <button onclick="window.app.recordVocabularyAnswer(false)" class="btn btn-danger btn-lg px-8 py-4 text-lg">
                                        <i data-lucide="x" class="w-6 h-6 mr-3"></i>
                                        I Don't Know
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="sessionComplete" class="hidden text-center">
                    <div class="bg-green-500/20 rounded-2xl p-8">
                        <h2 class="text-3xl font-bold text-white mb-4">Session Complete!</h2>
                        <p class="text-white/80 mb-6">Great job! You've completed this vocabulary session.</p>
                        <div class="flex gap-4 justify-center">
                            <button onclick="window.app.startNewVocabularySession()" class="btn btn-primary">
                                <i data-lucide="refresh-cw" class="w-5 h-5 mr-2"></i>
                                Start New Session
                            </button>
                            <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                                <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    showTOEICModuleScreen(moduleType, data = null) {
        // Create or show TOEIC module screen
        let screen = document.getElementById('toeicModuleScreen');
        if (!screen) {
            screen = document.createElement('div');
            screen.id = 'toeicModuleScreen';
            screen.className = 'screen';
            document.querySelector('main').appendChild(screen);
        }
        
        screen.innerHTML = this.generateTOEICModuleHTML(moduleType, data);
        screen.classList.remove('hidden');
        
        // Initialize module-specific functionality
        this.initializeTOEICModuleFunctionality(moduleType);
    }
    
    generateTOEICModuleHTML(moduleType, data) {
        const baseHTML = `
            <div class="max-w-6xl mx-auto">
                <div class="flex items-center justify-between mb-8">
                    <button onclick="window.app.showWelcomeScreen()" class="btn btn-glass">
                        <i data-lucide="arrow-left" class="w-5 h-5 mr-2"></i>
                        Back to Home
                    </button>
                    <h1 class="text-3xl font-bold text-white">TOEIC ${this.capitalizeFirst(moduleType)}</h1>
                    <div class="w-24"></div>
                </div>
                
                <div id="toeicModuleContent" class="glass-effect rounded-2xl p-8">
                    <!-- Module content will be loaded here -->
                </div>
            </div>
        `;
        
        return baseHTML;
    }
    
    initializeTOEICModuleFunctionality(moduleType) {
        // Initialize module-specific functionality
        switch(moduleType) {
            case 'vocabulary':
                this.initializeVocabularyModule();
                break;
            case 'reading':
                this.initializeReadingModule();
                break;
            case 'listening':
                this.initializeListeningModule();
                break;
            case 'test':
                this.initializeTestModule();
                break;
            case 'flashcards':
                this.initializeFlashcardModule();
                break;
            case 'grammar':
                this.initializeGrammarModule();
                break;
        }
    }
    
    initializeVocabularyModule() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        content.innerHTML = `
            <div class="text-center">
                <h2 class="text-2xl font-bold text-white mb-4">TOEIC Vocabulary Practice</h2>
                <p class="text-white/80 mb-6">Master 3000+ business English words with spaced repetition</p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-blue-500/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-2">Words Studied</h3>
                        <p class="text-3xl font-bold text-blue-300" id="wordsStudied">0</p>
                    </div>
                    <div class="bg-green-500/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-2">Accuracy</h3>
                        <p class="text-3xl font-bold text-green-300" id="vocabularyAccuracy">0%</p>
                    </div>
                    <div class="bg-purple-500/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-2">Mastery Level</h3>
                        <p class="text-3xl font-bold text-purple-300" id="masteryLevel">A1</p>
                    </div>
                </div>
                
                <button onclick="window.startVocabularySession()" class="btn btn-primary btn-lg">
                    <i data-lucide="play" class="w-6 h-6 mr-2"></i>
                    Start Vocabulary Session
                </button>
            </div>
        `;
        
        // Update stats
        this.updateVocabularyStats();
    }
    
    initializeReadingModule() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        content.innerHTML = `
            <div class="text-center">
                <h2 class="text-2xl font-bold text-white mb-4">TOEIC Reading Practice</h2>
                <p class="text-white/80 mb-6">Practice reading comprehension with business texts and passages</p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-green-500/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-2">Passages Read</h3>
                        <p class="text-3xl font-bold text-green-300" id="passagesRead">0</p>
                    </div>
                    <div class="bg-blue-500/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-2">Accuracy</h3>
                        <p class="text-3xl font-bold text-blue-300" id="readingAccuracy">0%</p>
                    </div>
                    <div class="bg-orange-500/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-2">Reading Speed</h3>
                        <p class="text-3xl font-bold text-orange-300" id="readingSpeed">0 WPM</p>
                    </div>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onclick="window.startReadingSession()" class="btn btn-primary btn-lg">
                        <i data-lucide="book-open" class="w-6 h-6 mr-2"></i>
                        Start Reading Session
                    </button>
                    <button onclick="window.app.showReadingPractice()" class="btn btn-secondary btn-lg">
                        <i data-lucide="file-text" class="w-6 h-6 mr-2"></i>
                        Practice Mode
                    </button>
                </div>
            </div>
        `;
        
        this.updateReadingStats();
    }
    
    showReadingPractice() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        // Start a reading session
        if (window.toeicReading) {
            const session = window.toeicReading.startSession({ count: 5 });
            this.showReadingInterface(session);
        } else {
            console.error('❌ TOEIC Reading system not available');
        }
    }
    
    showReadingInterface(session) {
        console.log('🔍 showReadingInterface called with session:', session);
        
        const content = document.getElementById('toeicModuleContent');
        console.log('🔍 toeicModuleContent element:', content);
        
        if (!content) {
            console.error('❌ toeicModuleContent element not found!');
            return;
        }
        
        // Show the content area
        content.classList.remove('hidden');
        console.log('🔍 Content area made visible');
        
        // Get passage and question without removing from session
        const passage = window.toeicReading.getNextPassage();
        const question = window.toeicReading.peekNextQuestion();
        
        console.log('🔍 Passage:', passage);
        console.log('🔍 Question:', question);
        
        if (!passage || !question) {
            console.log('❌ No passage or question available');
            content.innerHTML = `
                <div class="text-center">
                    <h3 class="text-xl font-bold text-white mb-4">No Reading Materials Available</h3>
                    <p class="text-white/80 mb-6">Please check back later for new reading passages.</p>
                    <button onclick="window.app.initializeReadingModule()" class="btn btn-primary">
                        Back to Reading Module
                    </button>
                </div>
            `;
            return;
        }
        
        content.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-white">Reading Comprehension</h3>
                    <div class="flex items-center gap-4">
                        <span class="text-white/80">Question ${(session.currentQuestionIndex || 0) + 1} of ${session.length}</span>
                        <button onclick="window.app.endCurrentSession()" class="btn btn-glass btn-sm">
                            End Session
                        </button>
                    </div>
                </div>
                
                <div class="glass-effect rounded-xl p-6 mb-6">
                    <h4 class="text-lg font-semibold text-white mb-4">Passage</h4>
                    <div class="text-white/90 leading-relaxed" id="passageContent">
                        ${passage.content}
                    </div>
                </div>
                
                <div class="glass-effect rounded-xl p-6">
                    <h4 class="text-lg font-semibold text-white mb-4">Question</h4>
                    <p class="text-white/90 mb-4">${question.question}</p>
                    
                    <div class="space-y-3" id="questionOptions">
                        ${question.options.map((option, index) => `
                            <label class="flex items-center p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                <input type="radio" name="answer" value="${index}" class="mr-3">
                                <span class="text-white/90">${String.fromCharCode(65 + index)}. ${option}</span>
                            </label>
                        `).join('')}
                    </div>
                    
                    <div class="flex justify-between items-center mt-6">
                        <button onclick="window.app.submitReadingAnswer()" class="btn btn-primary" id="submitBtn" disabled>
                            Submit Answer
                        </button>
                        <div class="text-white/80">
                            <span id="sessionStats">Correct: 0 | Incorrect: 0 | Time: 0s</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners for radio buttons
        const radioButtons = content.querySelectorAll('input[name="answer"]');
        const submitBtn = document.getElementById('submitBtn');
        
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                submitBtn.disabled = false;
            });
        });
        
        // Update session stats
        this.updateReadingSessionStats();
    }
    
    submitReadingAnswer() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) return;

        const answerIndex = parseInt(selectedAnswer.value);
        const question = window.toeicReading.peekNextQuestion();

        if (!question) return;

        // Debug logging
        console.log('🔍 Reading Answer Debug:');
        console.log('🔍 Question ID:', question.id);
        console.log('🔍 Question:', question.question);
        console.log('🔍 Options:', question.options);
        console.log('🔍 Selected answer index:', answerIndex);
        console.log('🔍 Correct answer index:', question.correctAnswer);
        console.log('🔍 Selected answer text:', question.options[answerIndex]);
        console.log('🔍 Correct answer text:', question.options[question.correctAnswer]);
        
        window.logger?.debug(`Question data:`, question);
        window.logger?.debug(`Answer index: ${answerIndex}, Correct answer: ${question.correctAnswer}`);

        // Check answer without recording yet
        const isCorrect = answerIndex === question.correctAnswer;
        console.log('🔍 Is correct:', isCorrect);

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
                correctAnswer: question.correctAnswer,
                timeSpent: Date.now() - (question.startTime || Date.now())
            });
        }

        // Record the answer in the reading system
        if (window.toeicReading && typeof window.toeicReading.recordAnswer === 'function') {
            window.toeicReading.recordAnswer(question.id, answerIndex, 0);
            console.log(`📝 Recorded answer: ${answerIndex} for question ${question.id}, correct: ${isCorrect}`);
        }

        // Show enhanced feedback with color-coded buttons
        this.showReadingAnswerFeedback(answerIndex, question.correctAnswer, isCorrect);

        // Disable submit button and show next question button
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.style.display = 'none';

        // Show next question button
        this.showNextQuestionButton();

        // Record the answer
        window.toeicReading.recordAnswer(question.id, answerIndex, 0);

        // Update stats
        this.updateReadingSessionStats();
    }

    showReadingAnswerFeedback(selectedIndex, correctIndex, isCorrect) {
        // Debug logging
        console.log('🎯 Answer Feedback Debug:');
        console.log('🎯 Selected index:', selectedIndex);
        console.log('🎯 Correct index:', correctIndex);
        console.log('🎯 Is correct:', isCorrect);
        
        window.logger?.debug(`Answer feedback - selectedIndex: ${selectedIndex}, correctIndex: ${correctIndex}, isCorrect: ${isCorrect}`);
        
        const options = document.querySelectorAll('input[name="answer"]');
        console.log('🎯 Found options:', options.length);
        
        options.forEach((option, index) => {
            const label = option.closest('label');
            const optionText = label.querySelector('span');
            
            console.log(`🎯 Processing option ${index}:`, {
                isCorrect: index === correctIndex,
                isSelected: index === selectedIndex,
                isSelectedAndWrong: index === selectedIndex && !isCorrect
            });
            
            // Remove any existing feedback classes
            label.classList.remove('reading-answer-correct', 'reading-answer-incorrect', 'reading-answer-disabled', 'bg-green-500/20', 'border-green-500', 'bg-red-500/20', 'border-red-500', 'bg-blue-500/20', 'border-blue-500');
            
            // Disable all radio buttons
            option.disabled = true;
            
            if (index === correctIndex) {
                // Correct answer - always green
                console.log(`🎯 Marking option ${index} as CORRECT`);
                label.classList.add('reading-answer-correct');
                optionText.innerHTML = `${String.fromCharCode(65 + index)}. ${optionText.textContent.split('. ')[1]} <span class="text-green-400 font-semibold">✓ Correct</span>`;
            } else if (index === selectedIndex && !isCorrect) {
                // Wrong selected answer - red
                console.log(`🎯 Marking option ${index} as WRONG (selected but incorrect)`);
                label.classList.add('reading-answer-incorrect');
                optionText.innerHTML = `${String.fromCharCode(65 + index)}. ${optionText.textContent.split('. ')[1]} <span class="text-red-400 font-semibold">✗ Wrong</span>`;
            } else {
                // Other options - subtle styling
                console.log(`🎯 Marking option ${index} as DISABLED`);
                label.classList.add('reading-answer-disabled');
            }
        });

        // Show feedback message
        this.showReadingFeedbackMessage(isCorrect, correctIndex);
    }

    showReadingFeedbackMessage(isCorrect, correctIndex) {
        const feedbackContainer = document.querySelector('.glass-effect .space-y-3');
        if (!feedbackContainer) return;

        // Debug logging
        window.logger?.debug(`Feedback message - isCorrect: ${isCorrect}, correctIndex: ${correctIndex}`);

        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `mt-4 p-4 rounded-lg border-2 reading-feedback-message ${
            isCorrect 
                ? 'bg-green-500/10 border-green-500 text-green-300' 
                : 'bg-red-500/10 border-red-500 text-red-300'
        }`;
        
        // Generate the correct answer letter
        const correctAnswerLetter = String.fromCharCode(65 + correctIndex);
        window.logger?.debug(`Correct answer letter: ${correctAnswerLetter}`);
        
        feedbackDiv.innerHTML = `
            <div class="flex items-center gap-2">
                <i data-lucide="${isCorrect ? 'check-circle' : 'x-circle'}" class="w-5 h-5"></i>
                <span class="font-semibold">
                    ${isCorrect ? 'Correct!' : 'Incorrect!'}
                </span>
            </div>
            ${!isCorrect ? `<p class="mt-2 text-sm">The correct answer is <strong>${correctAnswerLetter}</strong></p>` : ''}
        `;
        
        feedbackContainer.appendChild(feedbackDiv);
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    showNextQuestionButton() {
        const buttonContainer = document.querySelector('.flex.justify-between.items-center.mt-6');
        if (!buttonContainer) return;

        // Check if next question button already exists
        if (document.getElementById('nextQuestionBtn')) return;

        const nextBtn = document.createElement('button');
        nextBtn.id = 'nextQuestionBtn';
        nextBtn.className = 'btn btn-primary';
        nextBtn.innerHTML = '<i data-lucide="arrow-right" class="w-4 h-4 mr-2"></i>Next Question';
        nextBtn.onclick = () => this.goToNextReadingQuestion();

        // Insert next to the submit button position
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.parentNode.insertBefore(nextBtn, submitBtn.nextSibling);
        } else {
            buttonContainer.appendChild(nextBtn);
        }

        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    goToNextReadingQuestion() {
        // Move to next question in session
        const hasNext = window.toeicReading.moveToNextQuestion();

        if (hasNext) {
            // Show next question
            this.showReadingInterface(window.toeicReading.currentSession);
        } else {
            // Session completed
            this.showReadingSessionComplete();
        }
    }
    
    showReadingSessionComplete() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        const stats = window.toeicReading.getSessionStats();
        const accuracy = stats.correctAnswers > 0 ? 
            Math.round((stats.correctAnswers / (stats.correctAnswers + stats.incorrectAnswers)) * 100) : 0;
        
        content.innerHTML = `
            <div class="max-w-2xl mx-auto text-center">
                <div class="glass-effect rounded-xl p-8 mb-6">
                    <h3 class="text-2xl font-bold text-white mb-6">📚 Reading Session Complete!</h3>
                    
                    <div class="grid grid-cols-2 gap-6 mb-6">
                        <div class="bg-green-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-green-400">${stats.correctAnswers || 0}</div>
                            <div class="text-white/80">Correct</div>
                        </div>
                        <div class="bg-red-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-red-400">${stats.incorrectAnswers || 0}</div>
                            <div class="text-white/80">Incorrect</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-6 mb-6">
                        <div class="bg-blue-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-blue-400">${accuracy}%</div>
                            <div class="text-white/80">Accuracy</div>
                        </div>
                        <div class="bg-purple-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-purple-400">${Math.round((stats.timeSpent || 0) / 1000)}s</div>
                            <div class="text-white/80">Time</div>
                        </div>
                    </div>
                    
                    <div class="flex justify-center gap-4">
                        <button onclick="window.app.initializeReadingModule()" class="btn btn-primary">
                            <i data-lucide="book-open" class="w-5 h-5 mr-2"></i>
                            Back to Reading
                        </button>
                        <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                            <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                            Main Menu
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // End the reading session
        window.toeicReading.endSession();
        
        console.log('📚 Reading session completed successfully');
    }
    
    updateReadingSessionStats() {
        if (!window.toeicReading) return;
        
        const stats = window.toeicReading.getSessionStats();
        const statsElement = document.getElementById('sessionStats');
        
        if (statsElement) {
            statsElement.textContent = `Correct: ${stats.correctAnswers} | Incorrect: ${stats.incorrectAnswers} | Time: ${Math.round(stats.timeSpent / 1000)}s`;
        }
    }
    
    updateReadingStats() {
        if (!window.toeicReading) return;
        
        const stats = window.toeicReading.getOverallStats();
        
        // Update passages read
        const passagesReadElement = document.getElementById('passagesRead');
        if (passagesReadElement) {
            passagesReadElement.textContent = stats.answeredQuestions || 0;
        }
        
        // Update accuracy
        const accuracyElement = document.getElementById('readingAccuracy');
        if (accuracyElement) {
            accuracyElement.textContent = `${stats.overallAccuracy || 0}%`;
        }
        
        // Update reading speed (placeholder)
        const speedElement = document.getElementById('readingSpeed');
        if (speedElement) {
            speedElement.textContent = '120 WPM'; // Placeholder
        }
    }
    
    initializeListeningModule() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        content.innerHTML = `
            <div class="text-center">
                <h2 class="text-2xl font-bold text-white mb-4">TOEIC Listening Practice</h2>
                <p class="text-white/80 mb-6">Practice listening skills with business conversations and talks</p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-purple-500/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-2">Exercises Completed</h3>
                        <p class="text-3xl font-bold text-purple-300" id="exercisesCompleted">0</p>
                    </div>
                    <div class="bg-cyan-500/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-2">Accuracy</h3>
                        <p class="text-3xl font-bold text-cyan-300" id="listeningAccuracy">0%</p>
                    </div>
                    <div class="bg-pink-500/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-2">Response Time</h3>
                        <p class="text-3xl font-bold text-pink-300" id="responseTime">0s</p>
                    </div>
                </div>
                
                <button onclick="" class="btn btn-primary btn-lg">
                    <i data-lucide="headphones" class="w-6 h-6 mr-2"></i>
                    
                </button>
            </div>
        `;
        
        this.updateListeningStats();
    }
    
    initializeTestModule() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        content.innerHTML = `
            <div class="text-center">
                <h2 class="text-2xl font-bold text-white mb-4">TOEIC Test Simulation</h2>
                <p class="text-white/80 mb-6">Take full-length TOEIC practice tests with real timing</p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-yellow-500/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-2">Tests Completed</h3>
                        <p class="text-3xl font-bold text-yellow-300" id="testsCompleted">0</p>
                    </div>
                    <div class="bg-red-500/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-2">Best Score</h3>
                        <p class="text-3xl font-bold text-red-300" id="bestScore">0</p>
                    </div>
                    <div class="bg-indigo-500/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-2">Average Score</h3>
                        <p class="text-3xl font-bold text-indigo-300" id="averageScore">0</p>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <button onclick="window.app.startFullTest()" class="btn btn-primary btn-lg w-full">
                        <i data-lucide="clipboard-check" class="w-6 h-6 mr-2"></i>
                        Start Full TOEIC Test (2 hours)
                    </button>
                    <button onclick="window.app.startListeningTest()" class="btn btn-secondary btn-lg w-full">
                        <i data-lucide="headphones" class="w-6 h-6 mr-2"></i>
                        Listening Section Only (45 min)
                    </button>
                    <button onclick="window.app.startReadingTest()" class="btn btn-secondary btn-lg w-full">
                        <i data-lucide="book-open" class="w-6 h-6 mr-2"></i>
                        Reading Section Only (75 min)
                    </button>
                </div>
            </div>
        `;
        
        this.updateTestStats();
    }
    
    initializeFlashcardModule() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        const progressSummary = window.toeicVocabulary ? window.toeicVocabulary.getProgressSummary() : null;
        
        content.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <!-- Header -->
                <div class="glass-effect rounded-xl p-6 mb-6">
                    <h2 class="text-2xl font-bold text-white mb-2">TOEIC Vocabulary Flashcards</h2>
                    <p class="text-white/60">Master TOEIC vocabulary with intelligent spaced repetition</p>
                </div>
                
                <!-- Progress Summary -->
                ${progressSummary ? `
                <div class="glass-effect rounded-xl p-6 mb-6">
                    <h3 class="text-xl font-bold text-white mb-4">Your Progress</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-400">${progressSummary.totalWords}</div>
                            <div class="text-white/80 text-sm">Total Words</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-400">${progressSummary.masteredWords}</div>
                            <div class="text-white/80 text-sm">Mastered</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-yellow-400">${progressSummary.learningWords}</div>
                            <div class="text-white/80 text-sm">Learning</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-400">${Math.round(progressSummary.masteryPercentage)}%</div>
                            <div class="text-white/80 text-sm">Mastery</div>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <!-- Main Flashcard App -->
                <div class="glass-effect rounded-xl p-8 mb-6 text-center">
                    <div class="mb-6">
                        <div class="text-6xl mb-4">🃏</div>
                        <h3 class="text-2xl font-bold text-white mb-2">Smart Vocabulary Learning</h3>
                        <p class="text-white/80 text-lg mb-4">
                            Our intelligent system adapts to your learning pace and shows you the right words at the right time.
                        </p>
                    </div>
                    
                    <div class="bg-white/5 rounded-lg p-6 mb-6">
                        <h4 class="text-lg font-semibold text-white mb-3">How it works:</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/80">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                                <span>Study 20 words at a time</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                                <span>Mark words you know or don't know</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                                <span>Get new words every 20 completed</span>
                            </div>
                        </div>
                    </div>
                    
                    <button onclick="window.app.startFlashcardReview('spaced_repetition')" class="btn btn-primary text-lg px-8 py-4">
                        <i data-lucide="play" class="w-6 h-6 mr-3"></i>
                        Start Learning
                    </button>
                </div>
                
                <!-- Quick Actions -->
                <div class="glass-effect rounded-xl p-6">
                    <h3 class="text-xl font-bold text-white mb-4">Quick Actions</h3>
                    <div class="flex flex-wrap gap-4">
                        <button onclick="window.app.showVocabularyProgress()" class="btn btn-secondary">
                            <i data-lucide="bar-chart-3" class="w-5 h-5 mr-2"></i>
                            View Progress
                        </button>
                        <button onclick="window.app.showFlashcardSettings()" class="btn btn-secondary">
                            <i data-lucide="settings" class="w-5 h-5 mr-2"></i>
                            Settings
                        </button>
                    </div>
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
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-white mb-4">TOEIC Grammar Practice</h2>
                    <p class="text-white/80 text-lg">Master essential grammar patterns for TOEIC success</p>
                </div>
                
                <!-- Progress Overview -->
                ${progressSummary ? `
                <div class="glass-effect rounded-xl p-6 mb-8">
                    <h3 class="text-xl font-bold text-white mb-4">Your Progress</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="text-center">
                            <div class="text-3xl font-bold text-blue-400">${progressSummary.masteredCategories}</div>
                            <div class="text-white/80">Mastered Categories</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-green-400">${progressSummary.totalCategories}</div>
                            <div class="text-white/80">Total Categories</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-purple-400">${Math.round((progressSummary.masteredCategories / progressSummary.totalCategories) * 100)}%</div>
                            <div class="text-white/80">Completion</div>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <!-- Grammar Categories -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    ${Object.entries(categories).map(([key, category]) => {
                        const progress = progressSummary ? progressSummary.categoryDetails[key] : null;
                        const isMastered = progress ? progress.isMastered : false;
                        const accuracy = progress ? progress.accuracy : 0;
                        
                        return `
                            <div class="glass-effect rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform" 
                                 onclick="window.app.startGrammarCategory('${key}')">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 rounded-lg bg-${category.color}-500/20 flex items-center justify-center">
                                            <i data-lucide="${category.icon}" class="w-6 h-6 text-${category.color}-400"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-semibold text-white">${category.name}</h3>
                                            <p class="text-sm text-white/60">${category.difficulty}</p>
                                        </div>
                                    </div>
                                    ${isMastered ? '<i data-lucide="check-circle" class="w-6 h-6 text-green-400"></i>' : ''}
                                </div>
                                <p class="text-white/80 text-sm mb-4">${category.description}</p>
                                ${progress ? `
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-white/60">Accuracy</span>
                                    <span class="text-sm font-semibold text-${accuracy >= 80 ? 'green' : accuracy >= 60 ? 'yellow' : 'red'}-400">${accuracy}%</span>
                                </div>
                                <div class="w-full bg-gray-700 rounded-full h-2 mt-2">
                                    <div class="bg-${category.color}-500 h-2 rounded-full transition-all duration-300" 
                                         style="width: ${accuracy}%"></div>
                                </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <!-- Quick Actions -->
                <div class="flex flex-wrap gap-4 justify-center">
                    <button onclick="window.app.startGrammarPractice('all')" class="btn btn-primary btn-lg">
                        <i data-lucide="book-text" class="w-6 h-6 mr-2"></i>
                        Practice All Categories
                    </button>
                    <button onclick="window.app.startGrammarPractice('mixed')" class="btn btn-secondary btn-lg">
                        <i data-lucide="shuffle" class="w-6 h-6 mr-2"></i>
                        Mixed Practice
                    </button>
                    <button onclick="window.app.showGrammarRules()" class="btn btn-outline btn-lg">
                        <i data-lucide="book-open" class="w-6 h-6 mr-2"></i>
                        View Grammar Rules
                    </button>
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
    updateVocabularyStats() {
        if (window.toeicVocabulary) {
            const stats = window.toeicVocabulary.getOverallStats();
            const wordsStudiedEl = document.getElementById('wordsStudied');
            const accuracyEl = document.getElementById('vocabularyAccuracy');
            const masteryEl = document.getElementById('masteryLevel');
            
            if (wordsStudiedEl) wordsStudiedEl.textContent = stats.reviewedWords;
            if (accuracyEl) accuracyEl.textContent = stats.overallAccuracy + '%';
            if (masteryEl) masteryEl.textContent = this.getLevelFromScore(stats.estimatedTOEICScore);
        }
    }
    
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
    
    
    updateTestStats() {
        if (window.toeicTestSimulator) {
            const stats = window.toeicTestSimulator.getProgressStats();
            const testsEl = document.getElementById('testsCompleted');
            const bestEl = document.getElementById('bestScore');
            const avgEl = document.getElementById('averageScore');
            
            if (testsEl) testsEl.textContent = stats.totalTests;
            if (bestEl) bestEl.textContent = stats.bestScore;
            if (avgEl) avgEl.textContent = stats.averageScore;
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
    
    endCurrentGame() {
        if (!this.currentGame && !this.currentTOEICModule) return;
        
        console.log('🏁 Ending current session...');
        
        try {
            // Calculate session stats
            const sessionStats = this.calculateSessionStats();
            
            // End adaptive learning session
            if (window.adaptiveLearning) {
                window.adaptiveLearning.endSession(this.sessionData);
            }
            
            // Check for new achievements
            this.checkAchievements(sessionStats);
            
            // Save session data
            this.saveSessionData(sessionStats);
            
            // Clean up
            this.currentGame = null;
            this.currentTOEICModule = null;
            this.sessionData = [];
            
            // Return to main menu
            this.showWelcomeScreen();
            
            console.log('✅ Session ended successfully');
            
        } catch (error) {
            console.error('❌ Error ending session:', error);
        }
    }
    
    calculateSessionStats() {
        const now = Date.now();
        const duration = now - (this.sessionStartTime || now);
        const totalQuestions = this.sessionData.length;
        const correctAnswers = this.sessionData.filter(q => q.isCorrect).length;
        const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
        
        return {
            duration,
            totalQuestions,
            correctAnswers,
            accuracy,
            score: correctAnswers * 10, // Simple scoring
            date: new Date().toISOString()
        };
    }
    
    checkAchievements(sessionStats) {
        if (!window.achievementSystem) return;
        
        try {
            const userStats = this.getGameStatistics();
            const newAchievements = window.achievementSystem.checkAchievements(
                this.sessionData, 
                userStats
            );
            
            // Show achievement notifications
            newAchievements.forEach(achievement => {
                if (window.achievementNotification) {
                    window.achievementNotification.show(achievement);
                }
            });
            
        } catch (error) {
            console.error('❌ Error checking achievements:', error);
        }
    }
    
    createFallbackGlobalControls() {
        console.log('🔧 Creating fallback global controls...');
        
        // Remove existing controls first
        const existingControls = document.getElementById('globalControls');
        if (existingControls) {
            existingControls.remove();
        }
        
        // Remove existing individual buttons
        const existingProgressBtn = document.getElementById('progressControlBtn');
        const existingHomeBtn = document.getElementById('homeControlBtn');
        if (existingProgressBtn) existingProgressBtn.remove();
        if (existingHomeBtn) existingHomeBtn.remove();
        
        // Create floating independent controls
        const progressBtn = document.createElement('div');
        progressBtn.id = 'progressControlBtn';
        progressBtn.className = 'floating-control-btn progress-btn independent-draggable';
        progressBtn.innerHTML = `
            <i data-lucide="bar-chart-3" class="w-5 h-5 text-white"></i>
        `;
        progressBtn.title = 'Toggle Progress Panel (Drag to move)';
        progressBtn.onclick = () => {
            // Progress dashboard removed
            console.log('Progress dashboard has been removed');
        };
        
        const homeBtn = document.createElement('div');
        homeBtn.id = 'homeControlBtn';
        homeBtn.className = 'floating-control-btn home-btn independent-draggable';
        homeBtn.title = 'Go to Home (Drag to move)';
        homeBtn.innerHTML = `
            <i data-lucide="home" class="w-5 h-5 text-white"></i>
        `;
        homeBtn.onclick = () => this.showWelcomeScreen();
        
        // Add directly to body
        document.body.appendChild(progressBtn);
        document.body.appendChild(homeBtn);
        
        // Make draggable
        this.makeButtonDraggable(progressBtn, 'progressControlPosition');
        this.makeButtonDraggable(homeBtn, 'homeControlPosition');
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        console.log('✅ Fallback global controls created');
    }
    
    makeButtonDraggable(button, storageKey) {
        let isDragging = false;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        
        // Load saved position
        const savedPos = localStorage.getItem(storageKey);
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                xOffset = pos.x;
                yOffset = pos.y;
                button.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            } catch (error) {
                console.error(`⚠️ Error loading saved position for ${storageKey}:`, error);
                localStorage.removeItem(storageKey);
            }
        }
        
        const dragStart = (e) => {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            
            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
            
            button.classList.add('dragging');
            button.style.cursor = 'grabbing';
            button.style.zIndex = '1001';
        };
        
        const drag = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            let newX, newY;
            
            if (e.type === 'touchmove') {
                newX = e.touches[0].clientX - initialX;
                newY = e.touches[0].clientY - initialY;
            } else {
                newX = e.clientX - initialX;
                newY = e.clientY - initialY;
            }
            
            // Enhanced boundaries
            const buttonRect = button.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            const padding = 50;
            const minX = -buttonRect.left + padding;
            const maxX = viewportWidth - buttonRect.right - padding;
            const minY = -buttonRect.top + padding;
            const maxY = viewportHeight - buttonRect.bottom - padding;
            
            newX = Math.max(minX, Math.min(maxX, newX));
            newY = Math.max(minY, Math.min(maxY, newY));
            
            xOffset = newX;
            yOffset = newY;
            
            button.style.transform = `translate(${newX}px, ${yOffset}px)`;
        };
        
        const dragEnd = (e) => {
            if (!isDragging) return;
            
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            isDragging = false;
            button.classList.remove('dragging');
            button.style.cursor = 'grab';
            button.style.zIndex = '1000';
            
            // Save position
            const positionData = {
                x: xOffset,
                y: yOffset,
                timestamp: Date.now()
            };
            localStorage.setItem(storageKey, JSON.stringify(positionData));
        };
        
        // Event listeners
        button.addEventListener('mousedown', dragStart, { passive: false });
        document.addEventListener('mousemove', drag, { passive: false });
        document.addEventListener('mouseup', dragEnd, { passive: false });
        document.addEventListener('mouseleave', dragEnd, { passive: false });
        
        button.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', dragEnd, { passive: false });
        
        button.style.cursor = 'grab';
        button.style.userSelect = 'none';
        button.setAttribute('draggable', 'false');
        
        console.log(`✅ Button ${storageKey} made draggable in fallback mode`);
    }
    
    saveSessionData(sessionStats) {
        try {
            const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
            sessions.push(sessionStats);
            
            // Keep only last 100 sessions to prevent storage bloat
            if (sessions.length > 100) {
                sessions.splice(0, sessions.length - 100);
            }
            
            localStorage.setItem('studySessions', JSON.stringify(sessions));
            
        } catch (error) {
            console.error('❌ Error saving session data:', error);
        }
    }
    
    // Answer tracking for adaptive learning
    recordAnswer(word, isCorrect, responseTime, gameMode) {
        const answerData = {
            word,
            isCorrect,
            responseTime,
            gameMode,
            timestamp: Date.now()
        };
        
        this.sessionData.push(answerData);
        
        // Update adaptive learning
        if (window.adaptiveLearning) {
            window.adaptiveLearning.updateWordMastery(word, isCorrect, responseTime);
        }
    }
    
    // Settings and Help
    showSettings() {
        if (window.uiManager) {
            const settingsContent = this.generateSettingsContent();
            window.uiManager.showModal(settingsContent, {
                title: 'Settings',
                actions: '<button class="px-4 py-2 bg-accent rounded-lg text-white" onclick="this.closest(\'.modal-overlay\').remove()">Close</button>'
            });
        }
    }
    
    generateSettingsContent() {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-white/80 mb-2">Difficulty Level</label>
                    <select class="w-full p-2 rounded bg-white/20 text-white">
                        <option value="easy">Easy</option>
                        <option value="normal" selected>Normal</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>
                
                <div>
                    <label class="flex items-center text-white/80">
                        <input type="checkbox" class="mr-2" checked>
                        Sound Effects
                    </label>
                </div>
                
                <div>
                    <label class="flex items-center text-white/80">
                        <input type="checkbox" class="mr-2" checked>
                        Adaptive Difficulty
                    </label>
                </div>
                
                <div>
                    <label class="flex items-center text-white/80">
                        <input type="checkbox" class="mr-2" checked>
                        Achievement Notifications
                    </label>
                </div>
            </div>
        `;
    }
    
    showHelp() {
        if (window.uiManager) {
            const helpContent = this.generateHelpContent();
            window.uiManager.showModal(helpContent, {
                title: 'How to Play',
                actions: '<button class="px-4 py-2 bg-accent rounded-lg text-white" onclick="this.closest(\'.modal-overlay\').remove()">Got it!</button>'
            });
        }
    }
    
    generateHelpContent() {
        return `
            <div class="space-y-4 text-sm">
                <div>
                    <h4 class="font-semibold mb-2">🎮 Game Controls</h4>
                    <ul class="space-y-1 text-white/80">
                        <li>• Use mouse/touch to select answers</li>
                        <li>• Press 1-4 keys for quick selection</li>
                        <li>• ESC key to exit games</li>
                        <li>• Ctrl+P to open Progress Dashboard</li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-2">📚 Learning System</h4>
                    <ul class="space-y-1 text-white/80">
                        <li>• Words are reviewed based on spaced repetition</li>
                        <li>• Difficulty adapts to your performance</li>
                        <li>• Track progress in the dashboard</li>
                        <li>• Earn achievements for milestones</li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-2">🏆 Scoring</h4>
                    <ul class="space-y-1 text-white/80">
                        <li>• Correct answers: +10 points</li>
                        <li>• Fast answers: bonus points</li>
                        <li>• Consecutive correct: streak bonus</li>
                        <li>• Daily practice: streak rewards</li>
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
        
        // Check for performance issues
        if (window.realTimeMonitor) {
            const metrics = window.realTimeMonitor.getMetrics();
            
            // Alert if performance is poor
            if (metrics.performance.lcp > 4000) {
                console.warn('⚠️ Poor LCP performance detected:', metrics.performance.lcp + 'ms');
            }
            
            if (metrics.performance.fid > 200) {
                console.warn('⚠️ Poor FID performance detected:', metrics.performance.fid + 'ms');
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
                    <h1 class="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
                    <p class="text-xl mb-8">We're having trouble starting the app.</p>
                    <button onclick="location.reload()" class="px-6 py-3 bg-accent hover:bg-accent/80 rounded-lg transition-colors duration-300">
                        Try Again
                    </button>
                </div>
            `;
        }
    }
    
    // Debug mode
    enableDebugMode() {
        window.debug = {
            app: this,
            gameEngine: window.gameEngine,
            dataManager: window.dataManager,
            adaptiveLearning: window.adaptiveLearning,
            achievementSystem: window.achievementSystem,
            // progressDashboard: removed
            sessionData: this.sessionData,
            
            // Debug utilities
            skipToGame: (gameMode) => this.startGame(gameMode),
            unlockAllAchievements: () => {
                if (window.achievementSystem) {
                    window.achievementSystem.achievements.forEach((_, id) => {
                        window.achievementSystem.unlockedAchievements.add(id);
                    });
                    window.achievementSystem.saveProgress();
                }
            },
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
        this.vocabularySessionStats = {
            correct: 0,
            incorrect: 0,
            total: 0
        };
        
        // Update vocabulary count display
        this.updateVocabularyCountDisplay();
        
        // Load first word
        this.loadNextVocabularyWord();
    }
    
    updateVocabularyCountDisplay() {
        const countElement = document.getElementById('totalVocabularyCount');
        if (countElement && window.toeicVocabulary) {
            const totalWords = window.toeicVocabulary.vocabulary.size;
            if (totalWords > 0) {
                countElement.textContent = `Total vocabulary: ${totalWords} words`;
                countElement.className = 'text-sm text-green-400';
            } else {
                countElement.textContent = 'Using fallback vocabulary (2 words) - Click "Reload Vocabulary" to load CSV';
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
        
        if (showMeaningBtn) showMeaningBtn.classList.remove('hidden');
        if (answerButtons) answerButtons.classList.add('hidden');
        if (wordExamples) wordExamples.classList.add('hidden');
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
        if (wordMeaningEl) wordMeaningEl.textContent = 'Click "Show Meaning" to reveal the definition';
        
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
                    countElement.textContent = `Total vocabulary: ${newCount} words`;
                    countElement.className = 'text-sm text-green-400';
                }
                
                // Show success message
                this.showNotification(`Vocabulary reloaded! Now using ${newCount} words from CSV file.`, 'success');
                
            } catch (error) {
                console.error('❌ Error reloading vocabulary:', error);
                this.showNotification('Failed to reload vocabulary. Check console for details.', 'error');
            }
        } else {
            console.error('❌ TOEIC Vocabulary system not available or forceReloadVocabulary method missing');
            this.showNotification('Vocabulary system not available', 'error');
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
        
        // Hide any active modules
        const activeModules = document.querySelectorAll('.toeic-module-screen');
        activeModules.forEach(module => {
            module.classList.add('hidden');
        });
        
        // Show main menu
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.classList.remove('hidden');
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
        
        // Clear reading timers
        if (this.readingTimer) {
            clearInterval(this.readingTimer);
            this.readingTimer = null;
        }
        if (this.questionCountdownTimer) {
            clearInterval(this.questionCountdownTimer);
            this.questionCountdownTimer = null;
        }
        
        // Remove any immediate feedback
        const existingFeedback = document.getElementById('immediateFeedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        console.log('✅ Session ended successfully');
    }
    
    // TOEIC Test Simulator Functions
    startFullTest() {
        if (window.toeicTestSimulator) {
            const test = window.toeicTestSimulator.startTest({ type: 'full' });
            console.log('📝 Full TOEIC test started');
            this.showTOEICTestInterface(test);
        } else {
            console.error('❌ TOEIC Test Simulator not available');
        }
    }
    
    startListeningTest() {
        if (window.toeicTestSimulator) {
            const test = window.toeicTestSimulator.startTest({ type: 'listening' });
            console.log('🎧 Listening test started');
            this.showTOEICTestInterface(test);
        } else {
            console.error('❌ TOEIC Test Simulator not available');
        }
    }
    
    startReadingTest() {
        if (window.toeicTestSimulator) {
            const test = window.toeicTestSimulator.startTest({ type: 'reading' });
            console.log('📖 Reading test started');
            this.showTOEICTestInterface(test);
        } else {
            console.error('❌ TOEIC Test Simulator not available');
        }
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
            <div class="max-w-4xl mx-auto">
                <!-- Progress Header -->
                <div class="glass-effect rounded-xl p-6 mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-white">${modeInfo.title}</h3>
                            <p class="text-white/60">${modeInfo.description}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-sm text-white/80">Progress</div>
                            <div class="text-lg font-bold text-blue-400">${currentIndex + 1}/${totalWords}</div>
                        </div>
                    </div>
                    
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                             style="width: ${((currentIndex + 1) / totalWords) * 100}%"></div>
                    </div>
                </div>
                
                <!-- Flashcard -->
                <div class="glass-effect rounded-xl p-8 mb-6">
                    <div id="flashcard" class="min-h-64 flex flex-col justify-center items-center text-center">
                        <div class="mb-6">
                            <span class="px-3 py-1 bg-${currentWord.difficulty.toLowerCase() === 'b2' ? 'yellow' : currentWord.difficulty.toLowerCase() === 'b1' ? 'blue' : 'green'}-500/20 text-${currentWord.difficulty.toLowerCase() === 'b2' ? 'yellow' : currentWord.difficulty.toLowerCase() === 'b1' ? 'blue' : 'green'}-400 rounded-full text-sm font-semibold mb-4 inline-block">
                                ${currentWord.difficulty}
                            </span>
                            <h2 class="text-3xl font-bold text-white mb-4">${currentWord.word}</h2>
                            <p class="text-white/60 text-lg">${currentWord.category}</p>
                        </div>
                        
                        <div id="flashcardContent" class="hidden">
                            <div class="space-y-4">
                                <div class="text-xl text-white/90">
                                    <strong>Definition:</strong> ${currentWord.definition}
                                </div>
                                <div class="text-lg text-white/80">
                                    <strong>Example:</strong> ${currentWord.example}
                                </div>
                                ${currentWord.synonyms ? `
                                <div class="text-lg text-white/80">
                                    <strong>Synonyms:</strong> ${currentWord.synonyms}
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <button id="showAnswerBtn" onclick="window.app.showFlashcardAnswer()" class="btn btn-primary mt-6">
                            <i data-lucide="eye" class="w-5 h-5 mr-2"></i>
                            Show Answer
                        </button>
                        
                        <div id="answerButtons" class="hidden mt-6 space-x-4">
                            <button onclick="window.app.answerFlashcard('correct')" class="btn btn-success">
                                <i data-lucide="check" class="w-5 h-5 mr-2"></i>
                                I Know This
                            </button>
                            <button onclick="window.app.answerFlashcard('incorrect')" class="btn btn-danger">
                                <i data-lucide="x" class="w-5 h-5 mr-2"></i>
                                I Don't Know
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Session Stats -->
                <div class="glass-effect rounded-xl p-6">
                    <div class="grid grid-cols-3 gap-6 text-center">
                        <div>
                            <div class="text-2xl font-bold text-green-400">${sessionStats.correctAnswers}</div>
                            <div class="text-white/80">Correct</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-red-400">${sessionStats.incorrectAnswers}</div>
                            <div class="text-white/80">Incorrect</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-blue-400">${Math.round((sessionStats.correctAnswers / (sessionStats.correctAnswers + sessionStats.incorrectAnswers)) * 100) || 0}%</div>
                            <div class="text-white/80">Accuracy</div>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-center mt-6">
                    <button onclick="window.app.endFlashcardSession()" class="btn btn-secondary">
                        <i data-lucide="flag" class="w-5 h-5 mr-2"></i>
                        End Session
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
                title: 'Spaced Repetition',
                description: 'AI-powered review based on your learning progress'
            },
            'new_words': {
                title: 'New Words',
                description: 'Learning fresh vocabulary'
            },
            'difficulty_review': {
                title: 'Difficulty Review',
                description: 'Focusing on challenging words'
            },
            'category_review': {
                title: 'Category Review',
                description: 'Studying by business topic'
            },
            'quick_review': {
                title: 'Quick Review',
                description: 'Fast 5-minute session'
            },
            'exam_prep': {
                title: 'Exam Preparation',
                description: 'High-frequency TOEIC words'
            }
        };
        return modeInfo[mode] || modeInfo['spaced_repetition'];
    }
    
    showFlashcardAnswer() {
        const content = document.getElementById('flashcardContent');
        const showBtn = document.getElementById('showAnswerBtn');
        const answerButtons = document.getElementById('answerButtons');
        
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
                    <h3 class="text-2xl font-bold text-blue-400 mb-2">Great Progress!</h3>
                    <p class="text-white/90 text-lg">You've completed ${completedWords} words!</p>
                </div>
                
                <div class="mb-6">
                    <div class="bg-blue-500/10 rounded-lg p-6">
                        <h4 class="text-blue-400 font-semibold mb-3">What's Next?</h4>
                        <p class="text-white/80 mb-4">
                            You're doing great! The next 20 words will be new vocabulary to continue your learning journey.
                        </p>
                        <div class="flex justify-center items-center gap-4 text-sm text-white/60">
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span>Keep Learning</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span>New Words</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span>Build Vocabulary</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-center gap-4">
                    <button onclick="window.app.continueFlashcardSession()" class="btn btn-primary">
                        <i data-lucide="arrow-right" class="w-5 h-5 mr-2"></i>
                        Continue Learning
                    </button>
                    <button onclick="window.app.endFlashcardSession()" class="btn btn-secondary">
                        <i data-lucide="flag" class="w-5 h-5 mr-2"></i>
                        End Session
                    </button>
                </div>
                
                <div class="text-white/60 text-sm mt-4">
                    Auto-continuing in 5 seconds...
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notificationOverlay);
        
        // Auto-continue after 5 seconds
        setTimeout(() => {
            this.continueFlashcardSession();
        }, 5000);
    }
    
    continueFlashcardSession() {
        // Remove notification overlay
        const existingOverlay = document.getElementById('flashcardProgressNotification');
        if (existingOverlay && existingOverlay.parentNode) {
            existingOverlay.parentNode.removeChild(existingOverlay);
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
        
        const results = window.toeicVocabulary.completeSession();
        this.showFlashcardResults(results);
    }
    
    showFlashcardResults(results) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        const accuracy = results.totalWords > 0 ? Math.round((results.correctAnswers / results.totalWords) * 100) : 0;
        
        content.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="glass-effect rounded-xl p-8 mb-6">
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-bold text-white mb-4">Flashcard Session Complete!</h3>
                        <div class="text-4xl font-bold text-blue-400 mb-2">${accuracy}%</div>
                        <p class="text-white/80">Overall Accuracy</p>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-6 mb-6">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-400">${results.correctAnswers}</div>
                            <div class="text-white/80">Correct</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-red-400">${results.incorrectAnswers}</div>
                            <div class="text-white/80">Incorrect</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-400">${results.totalWords}</div>
                            <div class="text-white/80">Total Words</div>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-center gap-4">
                    <button onclick="window.app.startFlashcardReview('spaced_repetition')" class="btn btn-primary">
                        <i data-lucide="refresh-cw" class="w-5 h-5 mr-2"></i>
                        Review Again
                    </button>
                    <button onclick="window.app.showTOEICModuleScreen('flashcards')" class="btn btn-secondary">
                        <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                        Back to Flashcards
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
        
        content.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <!-- Progress Header -->
                <div class="glass-effect rounded-xl p-6 mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-white">Grammar Practice</h3>
                        <div class="text-right">
                            <div class="text-sm text-white/80">Progress</div>
                            <div class="text-lg font-bold text-blue-400">${question.progress.current}/${question.progress.total}</div>
                        </div>
                    </div>
                    
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                             style="width: ${(question.progress.current / question.progress.total) * 100}%"></div>
                    </div>
                </div>
                
                <!-- Question -->
                <div class="glass-effect rounded-xl p-6 mb-6">
                    <div class="mb-6">
                        <div class="flex items-center gap-2 mb-4">
                            <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                                ${question.category.replace('_', ' ').toUpperCase()}
                            </span>
                            <span class="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">
                                ${question.difficulty}
                            </span>
                        </div>
                        
                        <h4 class="text-lg font-semibold text-white mb-4">Question ${question.progress.current}</h4>
                        <p class="text-white/90 text-lg mb-6">${question.question}</p>
                        
                        <div class="space-y-3">
                            ${question.options.map((option, index) => `
                                <label class="flex items-center p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                    <input type="radio" name="grammarAnswer" value="${index}" class="mr-4">
                                    <span class="text-white/90">${String.fromCharCode(65 + index)}. ${option}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="flex justify-between">
                        <button onclick="window.app.previousGrammarQuestion()" class="btn btn-secondary" ${question.progress.current <= 1 ? 'disabled' : ''}>
                            <i data-lucide="chevron-left" class="w-5 h-5 mr-2"></i>
                            Previous
                        </button>
                        
                        <button onclick="window.app.submitGrammarAnswer()" class="btn btn-primary">
                            <i data-lucide="check" class="w-5 h-5 mr-2"></i>
                            Submit Answer
                        </button>
                    </div>
                </div>
                
                <div class="flex justify-center mt-6">
                    <button onclick="window.app.completeGrammarSession()" class="btn btn-danger">
                        <i data-lucide="flag" class="w-5 h-5 mr-2"></i>
                        Complete Session
                    </button>
                </div>
            </div>
        `;
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    submitGrammarAnswer() {
        if (!window.toeicGrammar) return;
        
        // Get current answer if selected
        const selectedAnswer = document.querySelector('input[name="grammarAnswer"]:checked');
        if (!selectedAnswer) {
            // Show alert if no answer selected
            alert('Please select an answer before submitting.');
            return;
        }
        
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
        
        // Wait 10 seconds before moving to next question to show feedback
        setTimeout(() => {
            this.continueToNextGrammarQuestion();
        }, 10000);
    }
    
    nextGrammarQuestion() {
        if (!window.toeicGrammar) return;
        
        // Get current answer if selected
        const selectedAnswer = document.querySelector('input[name="grammarAnswer"]:checked');
        if (selectedAnswer) {
            const answerIndex = parseInt(selectedAnswer.value);
            const isCorrect = window.toeicGrammar.answerQuestion(answerIndex);
            
            // Show immediate feedback
            this.showGrammarAnswerFeedback(answerIndex, isCorrect);
            
            // Track analytics
            if (window.advancedAnalytics && typeof window.advancedAnalytics.recordLearningEvent === 'function') {
                window.advancedAnalytics.recordLearningEvent('grammar_answer', {
                    answerIndex: answerIndex,
                    isCorrect: isCorrect,
                    timestamp: new Date().toISOString()
                });
            }
            
            // Track student activity
            this.trackStudentActivity('grammar_answer_submitted', {
                answerIndex: answerIndex,
                isCorrect: isCorrect,
                questionType: 'grammar'
            });
            
            // Wait 2 seconds before moving to next question to show feedback
            setTimeout(() => {
                // Move to next question
                console.log('🔍 Debug: Moving to next grammar question...');
                const hasNext = window.toeicGrammar.nextQuestion();
                console.log('🔍 Debug: hasNext result:', hasNext);
                if (hasNext) {
                    const session = window.toeicGrammar.currentSession;
                    console.log('🔍 Debug: Showing next question interface');
                    this.showGrammarPracticeInterface(session);
                } else {
                    console.log('🔍 Debug: No more questions, completing session');
                    this.completeGrammarSession();
                }
            }, 2000);
        } else {
            // No answer selected, just move to next question
            console.log('🔍 Debug: No answer selected, moving to next question...');
            const hasNext = window.toeicGrammar.nextQuestion();
            console.log('🔍 Debug: hasNext result (no answer):', hasNext);
            if (hasNext) {
                const session = window.toeicGrammar.currentSession;
                console.log('🔍 Debug: Showing next question interface (no answer)');
                this.showGrammarPracticeInterface(session);
            } else {
                console.log('🔍 Debug: No more questions, completing session (no answer)');
                this.completeGrammarSession();
            }
        }
    }
    
    showGrammarAnswerFeedbackInline(selectedIndex, isCorrect) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        const currentQuestion = window.toeicGrammar.getCurrentQuestion();
        if (!currentQuestion) return;
        
        // Update the interface to show feedback
        const feedbackHTML = `
            <div class="max-w-4xl mx-auto">
                <!-- Progress Header -->
                <div class="glass-effect rounded-xl p-6 mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-white">Grammar Practice</h3>
                            <p class="text-white/60">Question ${currentQuestion.progress.current} of ${currentQuestion.progress.total}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-sm text-white/80">Progress</div>
                            <div class="text-lg font-bold text-blue-400">${currentQuestion.progress.current}/${currentQuestion.progress.total}</div>
                        </div>
                    </div>
                    
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                             style="width: ${(currentQuestion.progress.current / currentQuestion.progress.total) * 100}%"></div>
                    </div>
                </div>
                
                <!-- Question with Feedback -->
                <div class="glass-effect rounded-xl p-8 mb-6">
                    <div class="mb-6">
                        <div class="flex items-center gap-2 mb-4">
                            <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                                ${currentQuestion.category.replace('_', ' ').toUpperCase()}
                            </span>
                            <span class="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">
                                ${currentQuestion.difficulty}
                            </span>
                        </div>
                        
                        <h4 class="text-lg font-semibold text-white mb-4">Question ${currentQuestion.progress.current}</h4>
                        <p class="text-white/90 text-lg mb-6">${currentQuestion.question}</p>
                        
                        <!-- Feedback Result -->
                        <div class="mb-6 p-4 rounded-lg ${isCorrect ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'}">
                            <div class="flex items-center gap-3 mb-2">
                                ${isCorrect ? 
                                    '<div class="text-2xl">✅</div><h3 class="text-xl font-bold text-green-400">Correct!</h3>' :
                                    '<div class="text-2xl">❌</div><h3 class="text-xl font-bold text-red-400">Incorrect</h3>'
                                }
                            </div>
                        </div>
                        
                        <!-- Answer Options with Feedback -->
                        <div class="space-y-3 mb-6">
                            ${currentQuestion.options.map((option, index) => {
                                let optionClass = 'p-4 rounded-lg border-2';
                                let icon = '';
                                
                                if (index === selectedIndex) {
                                    optionClass += isCorrect ? ' bg-green-500/20 border-green-500' : ' bg-red-500/20 border-red-500';
                                    icon = isCorrect ? '✅' : '❌';
                                } else if (index === currentQuestion.correctAnswer) {
                                    optionClass += ' bg-green-500/20 border-green-500';
                                    icon = '✅';
                                } else {
                                    optionClass += ' bg-white/5 border-white/10';
                                }
                                
                                return `
                                    <div class="${optionClass}">
                                        <span class="text-white/90">${String.fromCharCode(65 + index)}. ${option} ${icon}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        
                        <!-- Explanation -->
                        ${currentQuestion.explanation ? `
                            <div class="bg-blue-500/10 rounded-lg p-4 mb-4">
                                <h4 class="text-blue-400 font-semibold mb-2">Explanation:</h4>
                                <p class="text-white/80">${currentQuestion.explanation}</p>
                            </div>
                        ` : ''}
                        
                        <!-- Grammar Rule -->
                        ${currentQuestion.grammarRule ? `
                            <div class="bg-purple-500/10 rounded-lg p-4">
                                <h4 class="text-purple-400 font-semibold mb-2">Grammar Rule: ${currentQuestion.grammarRule.title}</h4>
                                <p class="text-white/80 text-sm">${currentQuestion.grammarRule.description}</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="flex justify-center">
                        <button onclick="window.app.continueToNextGrammarQuestion()" class="btn btn-primary">
                            <i data-lucide="arrow-right" class="w-5 h-5 mr-2"></i>
                            Continue to Next Question
                        </button>
                    </div>
                    
                    <div class="text-center mt-4">
                        <div class="text-white/60 text-sm">
                            Auto-continuing in 10 seconds...
                        </div>
                    </div>
                </div>
                
                <!-- Session Stats -->
                <div class="glass-effect rounded-xl p-6">
                    <div class="grid grid-cols-3 gap-6 text-center">
                        <div>
                            <div class="text-2xl font-bold text-green-400">${window.toeicGrammar.getSessionStats().correctAnswers}</div>
                            <div class="text-white/80">Correct</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-red-400">${window.toeicGrammar.getSessionStats().incorrectAnswers}</div>
                            <div class="text-white/80">Incorrect</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-blue-400">${Math.round((window.toeicGrammar.getSessionStats().correctAnswers / (window.toeicGrammar.getSessionStats().correctAnswers + window.toeicGrammar.getSessionStats().incorrectAnswers)) * 100) || 0}%</div>
                            <div class="text-white/80">Accuracy</div>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-center mt-6">
                    <button onclick="window.app.completeGrammarSession()" class="btn btn-danger">
                        <i data-lucide="flag" class="w-5 h-5 mr-2"></i>
                        Complete Session
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
    
    showGrammarAnswerFeedback(selectedIndex, isCorrect) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        const currentQuestion = window.toeicGrammar.getCurrentQuestion();
        if (!currentQuestion) return;
        
        // Create feedback overlay
        const feedbackOverlay = document.createElement('div');
        feedbackOverlay.id = 'grammarFeedbackOverlay';
        feedbackOverlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        feedbackOverlay.innerHTML = `
            <div class="glass-effect rounded-xl p-8 max-w-2xl mx-4 text-center">
                <div class="mb-6">
                    ${isCorrect ? 
                        '<div class="text-6xl mb-4">✅</div><h3 class="text-2xl font-bold text-green-400 mb-2">Correct!</h3>' :
                        '<div class="text-6xl mb-4">❌</div><h3 class="text-2xl font-bold text-red-400 mb-2">Incorrect</h3>'
                    }
                </div>
                
                <div class="mb-6">
                    <p class="text-white/90 text-lg mb-4">${currentQuestion.question}</p>
                    
                    <div class="space-y-2 mb-4">
                        ${currentQuestion.options.map((option, index) => {
                            let optionClass = 'p-3 rounded-lg text-left';
                            let icon = '';
                            
                            if (index === selectedIndex) {
                                optionClass += isCorrect ? ' bg-green-500/20 border-2 border-green-500' : ' bg-red-500/20 border-2 border-red-500';
                                icon = isCorrect ? '✅' : '❌';
                            } else if (index === currentQuestion.correctAnswer) {
                                optionClass += ' bg-green-500/20 border-2 border-green-500';
                                icon = '✅';
                            } else {
                                optionClass += ' bg-white/5 border border-white/10';
                            }
                            
                            return `
                                <div class="${optionClass}">
                                    <span class="text-white/90">${String.fromCharCode(65 + index)}. ${option} ${icon}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    
                    ${currentQuestion.explanation ? `
                        <div class="bg-blue-500/10 rounded-lg p-4 mb-4">
                            <h4 class="text-blue-400 font-semibold mb-2">Explanation:</h4>
                            <p class="text-white/80">${currentQuestion.explanation}</p>
                        </div>
                    ` : ''}
                    
                    ${currentQuestion.grammarRule ? `
                        <div class="bg-purple-500/10 rounded-lg p-4">
                            <h4 class="text-purple-400 font-semibold mb-2">Grammar Rule: ${currentQuestion.grammarRule.title}</h4>
                            <p class="text-white/80 text-sm">${currentQuestion.grammarRule.description}</p>
                        </div>
                    ` : ''}
                </div>
                
                <div class="flex justify-center gap-4">
                    <button onclick="window.app.continueToNextGrammarQuestion()" class="btn btn-primary">
                        <i data-lucide="arrow-right" class="w-5 h-5 mr-2"></i>
                        Continue
                    </button>
                </div>
                
                <div class="text-white/60 text-sm mt-4">
                    Auto-continuing in 3 seconds...
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(feedbackOverlay);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (feedbackOverlay.parentNode) {
                feedbackOverlay.parentNode.removeChild(feedbackOverlay);
                this.continueToNextGrammarQuestion();
            }
        }, 3000);
    }
    
    continueToNextGrammarQuestion() {
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
            <div class="max-w-4xl mx-auto">
                <div class="glass-effect rounded-xl p-8 mb-6">
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-bold text-white mb-4">Grammar Practice Complete!</h3>
                        <div class="text-4xl font-bold text-blue-400 mb-2">${results.accuracy}%</div>
                        <p class="text-white/80">Overall Accuracy</p>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-6 mb-6">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-400">${results.correctAnswers}</div>
                            <div class="text-white/80">Correct</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-red-400">${results.incorrectAnswers}</div>
                            <div class="text-white/80">Incorrect</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-400">${results.totalQuestions}</div>
                            <div class="text-white/80">Total</div>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-center gap-4">
                    <button onclick="window.app.startGrammarPractice('all')" class="btn btn-primary">
                        <i data-lucide="refresh-cw" class="w-5 h-5 mr-2"></i>
                        Practice Again
                    </button>
                    <button onclick="window.app.showTOEICModuleScreen('grammar')" class="btn btn-secondary">
                        <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                        Back to Grammar
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
                    <h2 class="text-3xl font-bold text-white mb-4">Grammar Rules Reference</h2>
                    <p class="text-white/80 text-lg">Essential grammar patterns for TOEIC success</p>
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
                        Back to Grammar Practice
                    </button>
                </div>
            </div>
        `;
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    // Stats and Settings Functions
    showStats() {
        // Progress dashboard removed - show test history instead
        this.showTOEICTestHistory();
    }
    
    showSettings() {
        // Settings module removed - show main menu instead
        this.showWelcomeScreen();
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
                // If we have a session, show practice interface, otherwise show module selection
                if (options && options.length) {
                    this.showReadingPracticeInterface(options);
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
                        <h3 class="text-xl font-bold text-white mb-4">Module Not Available</h3>
                        <p class="text-white/80 mb-6">This module is under development.</p>
                        <button onclick="window.app.endCurrentSession()" class="btn btn-primary">
                            Back to Main Menu
                        </button>
                    </div>
                `;
        }
    }
    
    // Module-specific screen handlers
    showVocabularyModule(options) {
        const content = document.getElementById('toeicModuleContent');
        content.innerHTML = `
            <div class="text-center">
                <h3 class="text-xl font-bold text-white mb-4">TOEIC Vocabulary Practice</h3>
                <p class="text-white/80 mb-6">Mode: ${options.mode || 'Practice'}</p>
                <div class="flex justify-center gap-4">
                    <button onclick="window.startVocabularySession()" class="btn btn-primary">
                        <i data-lucide="book-open" class="w-5 h-5 mr-2"></i>
                        Start Vocabulary Session
                    </button>
                    <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                        <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                        Back to Main Menu
                    </button>
                </div>
            </div>
        `;
    }
    
    showReadingModule(options) {
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
                            <h2 class="text-3xl font-bold text-white mb-2">📖 TOEIC Reading Comprehension</h2>
                            <p class="text-white/80 text-lg">Master reading skills with authentic TOEIC-style passages and questions</p>
                        </div>
                        <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                            <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                            Back to Main Menu
                        </button>
                    </div>
                    
                    <!-- Progress Overview -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 text-center">
                            <div class="text-2xl font-bold text-blue-300">${totalPassages}</div>
                            <div class="text-white/80 text-sm">Reading Passages</div>
                        </div>
                        <div class="bg-green-500/20 border border-green-400/30 rounded-xl p-4 text-center">
                            <div class="text-2xl font-bold text-green-300">${totalQuestions}</div>
                            <div class="text-white/80 text-sm">Practice Questions</div>
                        </div>
                        <div class="bg-purple-500/20 border border-purple-400/30 rounded-xl p-4 text-center">
                            <div class="text-2xl font-bold text-purple-300">${readingStats ? readingStats.accuracy.toFixed(1) : '0'}%</div>
                            <div class="text-white/80 text-sm">Average Accuracy</div>
                        </div>
                        <div class="bg-orange-500/20 border border-orange-400/30 rounded-xl p-4 text-center">
                            <div class="text-2xl font-bold text-orange-300">${readingStats ? readingStats.totalAnswered : '0'}</div>
                            <div class="text-white/80 text-sm">Questions Answered</div>
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
                            <h3 class="text-2xl font-bold text-white mb-2">Quick Practice</h3>
                            <p class="text-white/80">Start with 5-10 questions for a quick reading practice session</p>
                        </div>
                        <div class="space-y-4">
                            <button onclick="window.app.startReadingSession({ count: 5 })" class="btn btn-primary w-full">
                                <i data-lucide="play" class="w-5 h-5 mr-2"></i>
                                Practice 5 Questions
                            </button>
                            <button onclick="window.app.startReadingSession({ count: 10 })" class="btn btn-secondary w-full">
                                <i data-lucide="clock" class="w-5 h-5 mr-2"></i>
                                Practice 10 Questions
                            </button>
                        </div>
                    </div>
                    
                    <!-- Full Practice -->
                    <div class="glass-effect rounded-2xl p-8">
                        <div class="text-center mb-6">
                            <div class="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="book-open" class="w-8 h-8 text-green-400"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-2">Full Practice</h3>
                            <p class="text-white/80">Complete reading practice with 20-25 questions like the real TOEIC test</p>
                        </div>
                        <div class="space-y-4">
                            <button onclick="window.app.startReadingSession({ count: 20 })" class="btn btn-primary w-full">
                                <i data-lucide="target" class="w-5 h-5 mr-2"></i>
                                Practice 20 Questions
                            </button>
                            <button onclick="window.app.startReadingSession({ count: 25 })" class="btn btn-secondary w-full">
                                <i data-lucide="award" class="w-5 h-5 mr-2"></i>
                                Practice 25 Questions
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Reading Skills Focus -->
                <div class="glass-effect rounded-2xl p-8 mb-8">
                    <h3 class="text-2xl font-bold text-white mb-6 text-center">🎯 Focus on Specific Skills</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-white/5 rounded-xl p-6 text-center">
                            <div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="file-text" class="w-6 h-6 text-yellow-400"></i>
                            </div>
                            <h4 class="text-lg font-semibold text-white mb-2">Incomplete Sentences</h4>
                            <p class="text-white/70 text-sm mb-4">Practice grammar and vocabulary in context</p>
                            <button onclick="window.app.startReadingSession({ type: 'incomplete_sentences' })" class="btn btn-outline w-full">
                                Start Practice
                            </button>
                        </div>
                        
                        <div class="bg-white/5 rounded-xl p-6 text-center">
                            <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="align-left" class="w-6 h-6 text-blue-400"></i>
                            </div>
                            <h4 class="text-lg font-semibold text-white mb-2">Text Completion</h4>
                            <p class="text-white/70 text-sm mb-4">Fill in the blanks in reading passages</p>
                            <button onclick="window.app.startReadingSession({ type: 'text_completion' })" class="btn btn-outline w-full">
                                Start Practice
                            </button>
                        </div>
                        
                        <div class="bg-white/5 rounded-xl p-6 text-center">
                            <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="book" class="w-6 h-6 text-purple-400"></i>
                            </div>
                            <h4 class="text-lg font-semibold text-white mb-2">Reading Comprehension</h4>
                            <p class="text-white/70 text-sm mb-4">Answer questions about reading passages</p>
                            <button onclick="window.app.startReadingSession({ type: 'reading_comprehension' })" class="btn btn-outline w-full">
                                Start Practice
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Recent Performance -->
                ${readingStats && readingStats.recentSessions ? `
                <div class="glass-effect rounded-2xl p-8">
                    <h3 class="text-2xl font-bold text-white mb-6">📊 Recent Performance</h3>
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
                                        <div class="text-white font-semibold">${session.questionCount} Questions</div>
                                        <div class="text-white/60 text-sm">${new Date(session.date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-white/80 text-sm">${session.correctAnswers}/${session.questionCount} correct</div>
                                    <div class="text-white/60 text-xs">${Math.round(session.timeSpent / 60)} min</div>
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
    
    showReadingPracticeInterface(session) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        // Get current question
        const currentQuestion = window.toeicReading ? window.toeicReading.getCurrentQuestion() : null;
        const currentIndex = window.toeicReading ? window.toeicReading.currentQuestionIndex : 0;
        const totalQuestions = session.length;
        const progress = ((currentIndex + 1) / totalQuestions) * 100;
        
        content.innerHTML = `
            <div class="max-w-6xl mx-auto">
                <!-- Header with Progress -->
                <div class="glass-effect rounded-2xl p-6 mb-8">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h2 class="text-2xl font-bold text-white mb-2">📖 TOEIC Reading Practice</h2>
                            <p class="text-white/80">Question ${currentIndex + 1} of ${totalQuestions}</p>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <div class="text-white/80 text-sm">Time</div>
                                <div class="text-white font-bold" id="readingTimer">00:00</div>
                            </div>
                            <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                                <i data-lucide="x" class="w-5 h-5 mr-2"></i>
                                Exit
                            </button>
                        </div>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div class="w-full bg-white/10 rounded-full h-3 mb-4">
                        <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500" 
                             style="width: ${progress}%"></div>
                    </div>
                    
                    <!-- Session Stats -->
                    <div class="grid grid-cols-3 gap-4 text-center">
                        <div class="bg-green-500/20 rounded-lg p-3">
                            <div class="text-lg font-bold text-green-300" id="correctCount">0</div>
                            <div class="text-white/80 text-sm">Correct</div>
                        </div>
                        <div class="bg-red-500/20 rounded-lg p-3">
                            <div class="text-lg font-bold text-red-300" id="incorrectCount">0</div>
                            <div class="text-white/80 text-sm">Incorrect</div>
                        </div>
                        <div class="bg-blue-500/20 rounded-lg p-3">
                            <div class="text-lg font-bold text-blue-300" id="accuracy">0%</div>
                            <div class="text-white/80 text-sm">Accuracy</div>
                        </div>
                    </div>
                </div>
                
                <!-- Question Content -->
                <div class="glass-effect rounded-2xl p-8 mb-8">
                    ${currentQuestion ? this.generateReadingQuestionHTML(currentQuestion, currentIndex) : `
                        <div class="text-center">
                            <div class="text-6xl mb-4">📚</div>
                            <h3 class="text-2xl font-bold text-white mb-4">Loading Question...</h3>
                            <p class="text-white/80">Please wait while we prepare your reading question.</p>
                        </div>
                    `}
                </div>
                
                <!-- Navigation -->
                <div class="flex justify-between items-center mb-4">
                    <button onclick="window.app.previousReadingQuestion()" 
                            class="btn btn-secondary ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${currentIndex === 0 ? 'disabled' : ''}>
                        <i data-lucide="chevron-left" class="w-5 h-5 mr-2"></i>
                        Previous
                    </button>
                    
                    <div class="text-center">
                        <div class="text-white/80 text-sm">Question ${currentIndex + 1} of ${totalQuestions}</div>
                    </div>
                    
                    <button onclick="window.app.nextReadingQuestion()" 
                            class="btn btn-primary" id="nextBtnNav" disabled>
                        Next
                        <i data-lucide="chevron-right" class="w-5 h-5 ml-2"></i>
                    </button>
                </div>
                
                <!-- Next Button - Fixed Position -->
                <div class="fixed bottom-6 right-6 z-50">
                    <button onclick="window.app.nextReadingQuestion()" 
                            class="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 text-lg font-semibold" 
                            id="nextBtn" disabled>
                        <span class="hidden sm:inline">Next Question</span>
                        <i data-lucide="chevron-right" class="w-5 h-5 sm:ml-2"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Initialize reading session
        this.initializeReadingSession(session);
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    generateReadingQuestionHTML(question, index) {
        const questionType = question.type || 'reading_comprehension';
        const typeInfo = window.toeicReading ? window.toeicReading.questionTypes[questionType] : null;
        
        // Get the passage for this question
        let passage = null;
        if (question.passageId && window.toeicReading) {
            passage = window.toeicReading.passages.get(question.passageId);
        }
        
        return `
            <div class="space-y-6">
                <!-- Question Header -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <span class="text-blue-300 font-bold">${index + 1}</span>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-white">${typeInfo ? typeInfo.name : 'Reading Question'}</h3>
                            <p class="text-white/60 text-sm">${typeInfo ? typeInfo.description : ''}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-white/80 text-sm">Time Limit</div>
                        <div class="text-white font-bold" id="questionTimer">${typeInfo ? typeInfo.timeLimit : 60}s</div>
                    </div>
                </div>
                
                <!-- Reading Passage -->
                ${passage ? `
                <div class="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 class="text-lg font-semibold text-white mb-4">📖 Reading Passage</h4>
                    <div class="text-white/90 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">${passage.content}</div>
                </div>
                ` : question.passage ? `
                <div class="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 class="text-lg font-semibold text-white mb-4">📖 Reading Passage</h4>
                    <div class="text-white/90 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">${question.passage}</div>
                </div>
                ` : ''}
                
                <!-- Question Text -->
                <div class="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 class="text-lg font-semibold text-white mb-4">❓ Question</h4>
                    <p class="text-white/90 text-lg leading-relaxed">${question.question}</p>
                </div>
                
                <!-- Answer Options -->
                <div class="space-y-3">
                    <h4 class="text-lg font-semibold text-white mb-4">📝 Choose your answer:</h4>
                    ${question.options ? question.options.map((option, optionIndex) => `
                        <label class="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors answer-option" 
                               data-option="${optionIndex}">
                            <input type="radio" name="readingAnswer" value="${optionIndex}" 
                                   class="sr-only" onchange="window.app.selectReadingAnswer(${optionIndex})">
                            <div class="w-6 h-6 rounded-full border-2 border-white/30 mr-4 flex items-center justify-center option-indicator">
                                <div class="w-3 h-3 rounded-full bg-transparent option-dot"></div>
                            </div>
                            <span class="text-white/90 flex-1">${option}</span>
                        </label>
                    `).join('') : ''}
                </div>
                
                <!-- Question Info -->
                <div class="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                    <div class="flex items-center gap-2 text-blue-300">
                        <i data-lucide="info" class="w-5 h-5"></i>
                        <span class="text-sm font-medium">Tip: Read the passage carefully and choose the best answer based on the information provided.</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    initializeReadingSession(session) {
        // Initialize selected answer
        this.selectedReadingAnswer = undefined;
        
        // Start session timer
        this.readingSessionStartTime = Date.now();
        this.readingTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.readingSessionStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const timerElement = document.getElementById('readingTimer');
            if (timerElement) {
                timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
        
        // Start question countdown timer
        this.startQuestionCountdown();
        
        // Update session stats
        this.updateReadingSessionStats();
        
        // Ensure next buttons are properly initialized
        const nextBtn = document.getElementById('nextBtn');
        const nextBtnNav = document.getElementById('nextBtnNav');
        
        if (nextBtn) {
            nextBtn.disabled = true; // Start disabled until answer is selected
            console.log('🔘 Fixed next button initialized and disabled');
        } else {
            console.log('❌ Fixed next button not found during initialization!');
        }
        
        if (nextBtnNav) {
            nextBtnNav.disabled = true; // Start disabled until answer is selected
            console.log('🔘 Navigation next button initialized and disabled');
        } else {
            console.log('❌ Navigation next button not found during initialization!');
        }
    }
    
    startQuestionCountdown() {
        // Clear any existing question timer
        if (this.questionCountdownTimer) {
            clearInterval(this.questionCountdownTimer);
        }
        
        // Get current question time limit
        const currentQuestion = window.toeicReading ? window.toeicReading.getCurrentQuestion() : null;
        const timeLimit = currentQuestion ? 
            (window.toeicReading.questionTypes[currentQuestion.type]?.timeLimit || 60) : 60;
        
        let timeRemaining = timeLimit;
        const timerElement = document.getElementById('questionTimer');
        
        // Update timer display immediately
        if (timerElement) {
            timerElement.textContent = `${timeRemaining}s`;
            timerElement.className = timeRemaining <= 10 ? 'text-red-400 font-bold' : 'text-white font-bold';
        }
        
        // Start countdown
        this.questionCountdownTimer = setInterval(() => {
            timeRemaining--;
            
            if (timerElement) {
                timerElement.textContent = `${timeRemaining}s`;
                
                // Change color when time is running low
                if (timeRemaining <= 10) {
                    timerElement.className = 'text-red-400 font-bold';
                } else if (timeRemaining <= 30) {
                    timerElement.className = 'text-yellow-400 font-bold';
                } else {
                    timerElement.className = 'text-white font-bold';
                }
            }
            
            // Auto-submit when time runs out
            if (timeRemaining <= 0) {
                this.autoSubmitQuestion();
            }
        }, 1000);
    }
    
    autoSubmitQuestion() {
        // Clear the countdown timer
        if (this.questionCountdownTimer) {
            clearInterval(this.questionCountdownTimer);
        }
        
        // If no answer was selected, mark as incorrect and show timeout feedback
        if (this.selectedReadingAnswer === undefined) {
            this.selectedReadingAnswer = -1; // Mark as no answer
            
            if (!window.toeicReading) {
                console.error('❌ TOEIC Reading system not available');
                return;
            }
            
            // Record the timeout as incorrect
            window.toeicReading.answerQuestion(-1);
            
            // Show correct answer
            const currentQuestion = window.toeicReading.getCurrentQuestion();
            if (currentQuestion) {
                document.querySelectorAll('.answer-option').forEach((option, index) => {
                    const indicator = option.querySelector('.option-indicator');
                    const dot = option.querySelector('.option-dot');
                    
                    if (index === currentQuestion.correctAnswer) {
                        // Highlight correct answer
                        indicator.classList.add('border-green-400', 'bg-green-500/30');
                        dot.classList.add('bg-green-400');
                        option.classList.add('bg-green-500/20', 'border-green-400/50', 'ring-2', 'ring-green-400/30');
                    }
                });
            }
            
            // Enable next buttons
            const nextBtn = document.getElementById('nextBtn');
            const nextBtnNav = document.getElementById('nextBtnNav');
            
            if (nextBtn) {
                nextBtn.disabled = false;
            }
            if (nextBtnNav) {
                nextBtnNav.disabled = false;
            }
            
            // Update session stats
            this.updateReadingSessionStats();
            
            // Show timeout feedback
            this.showImmediateFeedback(false, true);
            
            // Highlight answer in passage for timeout
            this.highlightAnswerInPassage(currentQuestion, -1, false);
        }
    }
    
    updateReadingSessionStats() {
        if (!window.toeicReading) return;
        
        const stats = window.toeicReading.getSessionStats();
        const correctElement = document.getElementById('correctCount');
        const incorrectElement = document.getElementById('incorrectCount');
        const accuracyElement = document.getElementById('accuracy');
        
        if (correctElement) correctElement.textContent = stats.correctAnswers;
        if (incorrectElement) incorrectElement.textContent = stats.incorrectAnswers;
        if (accuracyElement) {
            const total = stats.correctAnswers + stats.incorrectAnswers;
            const accuracy = total > 0 ? Math.round((stats.correctAnswers / total) * 100) : 0;
            accuracyElement.textContent = `${accuracy}%`;
        }
    }
    
    selectReadingAnswer(optionIndex) {
        // Clear the countdown timer
        if (this.questionCountdownTimer) {
            clearInterval(this.questionCountdownTimer);
        }
        
        if (!window.toeicReading) {
            console.error('❌ TOEIC Reading system not available');
            return;
        }
        
        // Get current question
        const currentQuestion = window.toeicReading.getCurrentQuestion();
        if (!currentQuestion) {
            console.error('❌ No current question available');
            return;
        }
        
        // Check if answer is correct
        const isCorrect = optionIndex === currentQuestion.correctAnswer;
        
        // Record the answer
        window.toeicReading.answerQuestion(optionIndex);
        
        // Track student activity
        this.trackStudentActivity('reading_answer_submitted', {
            answerIndex: optionIndex,
            isCorrect: isCorrect,
            questionType: 'reading_comprehension'
        });
        
        // Update UI to show correct/incorrect answers immediately
        document.querySelectorAll('.answer-option').forEach((option, index) => {
            const indicator = option.querySelector('.option-indicator');
            const dot = option.querySelector('.option-dot');
            
            if (index === optionIndex) {
                // Selected answer
                if (isCorrect) {
                    indicator.classList.add('border-green-400', 'bg-green-500/30');
                    dot.classList.add('bg-green-400');
                    option.classList.add('bg-green-500/20', 'border-green-400/50', 'ring-2', 'ring-green-400/30');
                } else {
                    indicator.classList.add('border-red-400', 'bg-red-500/30');
                    dot.classList.add('bg-red-400');
                    option.classList.add('bg-red-500/20', 'border-red-400/50', 'ring-2', 'ring-red-400/30');
                }
            } else if (index === currentQuestion.correctAnswer) {
                // Correct answer (highlight if wrong answer was selected)
                if (!isCorrect) {
                    indicator.classList.add('border-green-400', 'bg-green-500/30');
                    dot.classList.add('bg-green-400');
                    option.classList.add('bg-green-500/20', 'border-green-400/50', 'ring-2', 'ring-green-400/30');
                }
            }
        });
        
        // Enable next buttons
        const nextBtn = document.getElementById('nextBtn');
        const nextBtnNav = document.getElementById('nextBtnNav');
        
        if (nextBtn) {
            nextBtn.disabled = false;
            console.log('✅ Fixed next button enabled');
        } else {
            console.log('❌ Fixed next button not found!');
        }
        
        if (nextBtnNav) {
            nextBtnNav.disabled = false;
            console.log('✅ Navigation next button enabled');
        } else {
            console.log('❌ Navigation next button not found!');
        }
        
        // Update session stats
        this.updateReadingSessionStats();
        
        // Show immediate feedback
        this.showImmediateFeedback(isCorrect);
        
        // Highlight answer in passage
        console.log('🎯 Attempting to highlight answer in passage for question:', currentQuestion.id);
        this.highlightAnswerInPassage(currentQuestion, optionIndex, isCorrect);
        
        // Store selected answer
        this.selectedReadingAnswer = optionIndex;
    }
    
    showImmediateFeedback(isCorrect, isTimeout = false) {
        // Create immediate feedback message
        let feedbackMessage, feedbackIcon, feedbackTitle;
        
        if (isTimeout) {
            feedbackMessage = '⏰ Time\'s up! The correct answer has been highlighted.';
            feedbackIcon = '⏰';
            feedbackTitle = 'Time\'s Up!';
        } else if (isCorrect) {
            feedbackMessage = '✅ Correct! Well done!';
            feedbackIcon = '✅';
            feedbackTitle = 'Correct!';
        } else {
            feedbackMessage = '❌ Incorrect. The correct answer has been highlighted.';
            feedbackIcon = '❌';
            feedbackTitle = 'Incorrect';
        }
        
        // Create feedback element
        const feedbackElement = document.createElement('div');
        feedbackElement.id = 'immediateFeedback';
        feedbackElement.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg transition-all duration-500 ${
            isCorrect ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
        }`;
        feedbackElement.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-2xl">${feedbackIcon}</div>
                <div>
                    <div class="font-semibold">${feedbackTitle}</div>
                    <div class="text-sm opacity-90">${feedbackMessage}</div>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(feedbackElement);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (feedbackElement && feedbackElement.parentNode) {
                feedbackElement.style.opacity = '0';
                feedbackElement.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (feedbackElement.parentNode) {
                        feedbackElement.parentNode.removeChild(feedbackElement);
                    }
                }, 500);
            }
        }, 3000);
    }
    
    highlightAnswerInPassage(question, selectedAnswer, isCorrect) {
        // Get the passage element - try multiple selectors
        let passageElement = document.querySelector('.text-white\\/90.leading-relaxed.whitespace-pre-line');
        if (!passageElement) {
            passageElement = document.querySelector('[class*="text-white"][class*="leading-relaxed"]');
        }
        if (!passageElement) {
            passageElement = document.querySelector('.max-h-96.overflow-y-auto');
        }
        if (!passageElement) {
            // Try to find any div containing the passage text
            const allDivs = document.querySelectorAll('div');
            for (let div of allDivs) {
                if (div.textContent && div.textContent.includes('Sarah Williams') && div.textContent.includes('Innovation Solutions')) {
                    passageElement = div;
                    break;
                }
            }
        }
        if (!passageElement) {
            console.log('❌ Could not find passage element for highlighting');
            return;
        }
        
        // Get the passage content
        const passageContent = passageElement.textContent;
        if (!passageContent) return;
        
        // Define answer highlighting patterns based on question type and content
        const highlightingPatterns = this.getAnswerHighlightingPatterns(question, selectedAnswer, isCorrect);
        console.log('🎨 Highlighting patterns found:', highlightingPatterns.length);
        
        if (highlightingPatterns.length === 0) {
            console.log('⚠️ No highlighting patterns found for question:', question.id);
            return;
        }
        
        // Apply highlighting to the passage
        let highlightedContent = passageContent;
        
        highlightingPatterns.forEach(pattern => {
            const regex = new RegExp(pattern.text, 'gi');
            highlightedContent = highlightedContent.replace(regex, (match) => {
                // Make highlighting more prominent if user got it wrong
                let enhancedClass = pattern.class;
                if (!isCorrect) {
                    // Make it even more visible for wrong answers
                    enhancedClass = enhancedClass.replace('bg-', 'bg-').replace('300', '200');
                    enhancedClass += ' animate-bounce ring-4 ring-white/50';
                }
                return `<span class="${enhancedClass}">${match}</span>`;
            });
        });
        
        // Update the passage content with highlighting
        passageElement.innerHTML = highlightedContent;
    }
    
    getAnswerHighlightingPatterns(question, selectedAnswer, isCorrect) {
        const patterns = [];
        const correctAnswer = question.options[question.correctAnswer];
        
        console.log('🎯 Getting highlighting patterns for question:', question.id);
        console.log('📝 Correct answer:', correctAnswer);
        console.log('❓ Question:', question.question);
        
        // Enhanced highlighting based on specific question content and correct answer
        if (question.id === 'q_email_001_1') {
            // "What is the main purpose of this email?"
            if (correctAnswer.includes('meeting') || correctAnswer.includes('discuss')) {
                patterns.push({
                    text: 'meeting',
                    class: 'bg-lime-300 text-black px-4 py-3 rounded-xl underline decoration-lime-800 decoration-4 font-black border-4 border-lime-500 shadow-2xl animate-pulse'
                });
                patterns.push({
                    text: 'discuss',
                    class: 'bg-lime-300 text-black px-4 py-3 rounded-xl underline decoration-lime-800 decoration-4 font-black border-4 border-lime-500 shadow-2xl animate-pulse'
                });
                patterns.push({
                    text: 'present our findings',
                    class: 'bg-lime-300 text-black px-4 py-3 rounded-xl underline decoration-lime-800 decoration-4 font-black border-4 border-lime-500 shadow-2xl animate-pulse'
                });
            }
        } else if (question.id === 'q_email_001_2') {
            // "According to the email, what do the preliminary results show?"
            if (correctAnswer.includes('opportunities') || correctAnswer.includes('technology sector')) {
                patterns.push({
                    text: 'preliminary results show significant opportunities',
                    class: 'bg-yellow-300 text-black px-4 py-3 rounded-xl underline decoration-yellow-800 decoration-4 font-black border-4 border-yellow-500 shadow-2xl animate-pulse'
                });
                patterns.push({
                    text: 'European market',
                    class: 'bg-cyan-300 text-black px-4 py-3 rounded-xl underline decoration-cyan-800 decoration-4 font-black border-4 border-cyan-500 shadow-2xl animate-pulse'
                });
                patterns.push({
                    text: 'technology sector',
                    class: 'bg-pink-300 text-black px-4 py-3 rounded-xl underline decoration-pink-800 decoration-4 font-black border-4 border-pink-500 shadow-2xl animate-pulse'
                });
            }
        } else if (question.id === 'q_email_001_3') {
            // "When is Sarah available for a meeting?"
            if (correctAnswer.includes('Tuesday') || correctAnswer.includes('Wednesday')) {
                patterns.push({
                    text: 'Tuesday or Wednesday afternoon',
                    class: 'bg-orange-300 text-black px-4 py-3 rounded-xl underline decoration-orange-800 decoration-4 font-black border-4 border-orange-500 shadow-2xl animate-pulse'
                });
                patterns.push({
                    text: 'available for a meeting',
                    class: 'bg-emerald-300 text-black px-4 py-3 rounded-xl underline decoration-emerald-800 decoration-4 font-black border-4 border-emerald-500 shadow-2xl animate-pulse'
                });
            }
        } else if (question.id === 'q_email_003_1' || question.id === 'q_email_003_2' || question.id === 'q_email_003_3') {
            // Delivery email questions
            if (correctAnswer.includes('delay') || correctAnswer.includes('delivery')) {
                patterns.push({
                    text: 'delivery delay',
                    class: 'bg-red-300 text-black px-4 py-3 rounded-xl underline decoration-red-800 decoration-4 font-black border-4 border-red-500 shadow-2xl animate-pulse'
                });
            }
            if (correctAnswer.includes('compensation')) {
                patterns.push({
                    text: 'compensation',
                    class: 'bg-indigo-300 text-black px-4 py-3 rounded-xl underline decoration-indigo-800 decoration-4 font-black border-4 border-indigo-500 shadow-2xl animate-pulse'
                });
            }
        } else if (question.id === 'q_email_004_1' || question.id === 'q_email_004_2' || question.id === 'q_email_004_3' || question.id === 'q_email_004_4') {
            // Website project questions
            if (correctAnswer.includes('website') || correctAnswer.includes('redesign')) {
                patterns.push({
                    text: 'website redesign',
                    class: 'bg-violet-300 text-black px-4 py-3 rounded-xl underline decoration-violet-800 decoration-4 font-black border-4 border-violet-500 shadow-2xl animate-pulse'
                });
            }
            if (correctAnswer.includes('checkout')) {
                patterns.push({
                    text: 'checkout process',
                    class: 'bg-teal-300 text-black px-4 py-3 rounded-xl underline decoration-teal-800 decoration-4 font-black border-4 border-teal-500 shadow-2xl animate-pulse'
                });
            }
            if (correctAnswer.includes('database')) {
                patterns.push({
                    text: 'database migration',
                    class: 'bg-amber-300 text-black px-4 py-3 rounded-xl underline decoration-amber-800 decoration-4 font-black border-4 border-amber-500 shadow-2xl animate-pulse'
                });
            }
        } else if (question.id === 'q_email_005_1' || question.id === 'q_email_005_2' || question.id === 'q_email_005_3' || question.id === 'q_email_005_4') {
            // Professional development questions
            if (correctAnswer.includes('development') || correctAnswer.includes('program')) {
                patterns.push({
                    text: 'professional development program',
                    class: 'bg-sky-300 text-black px-4 py-3 rounded-xl underline decoration-sky-800 decoration-4 font-black border-4 border-sky-500 shadow-2xl animate-pulse'
                });
            }
            if (correctAnswer.includes('modules')) {
                patterns.push({
                    text: 'modules',
                    class: 'bg-rose-300 text-black px-4 py-3 rounded-xl underline decoration-rose-800 decoration-4 font-black border-4 border-rose-500 shadow-2xl animate-pulse'
                });
            }
            if (correctAnswer.includes('participants')) {
                patterns.push({
                    text: 'participants',
                    class: 'bg-fuchsia-300 text-black px-4 py-3 rounded-xl underline decoration-fuchsia-800 decoration-4 font-black border-4 border-fuchsia-500 shadow-2xl animate-pulse'
                });
            }
        } else if (question.id === 'q_news_001_1' || question.id === 'q_news_001_2') {
            // News questions
            if (correctAnswer.includes('GDP') || correctAnswer.includes('growth')) {
                patterns.push({
                    text: 'global GDP growth',
                    class: 'bg-green-300 text-black px-4 py-3 rounded-xl underline decoration-green-800 decoration-4 font-black border-4 border-green-500 shadow-2xl animate-pulse'
                });
            }
            if (correctAnswer.includes('technology')) {
                patterns.push({
                    text: 'technology sector',
                    class: 'bg-blue-300 text-black px-4 py-3 rounded-xl underline decoration-blue-800 decoration-4 font-black border-4 border-blue-500 shadow-2xl animate-pulse'
                });
            }
        }
        
        // Enhanced generic highlighting for common question types
        if (question.question.toLowerCase().includes('main purpose')) {
            patterns.push({
                text: 'purpose',
                class: 'bg-yellow-300 text-black px-4 py-3 rounded-xl underline decoration-yellow-800 decoration-4 font-black border-4 border-yellow-500 shadow-2xl animate-pulse'
            });
        }
        
        if (question.question.toLowerCase().includes('when')) {
            patterns.push({
                text: 'Tuesday|Wednesday|Monday|Thursday|Friday|Saturday|Sunday|morning|afternoon|evening|next week|tomorrow|today',
                class: 'bg-green-300 text-black px-4 py-3 rounded-xl underline decoration-green-800 decoration-4 font-black border-4 border-green-500 shadow-2xl animate-pulse'
            });
        }
        
        // Intelligent answer-based highlighting
        if (patterns.length === 0) {
            console.log('🔍 No specific patterns found, using intelligent highlighting');
            this.addIntelligentHighlighting(patterns, correctAnswer, question);
        }
        
        console.log('🎨 Final highlighting patterns:', patterns.length);
        return patterns;
    }
    
    addIntelligentHighlighting(patterns, correctAnswer, question) {
        // Extract key words from the correct answer
        const answerWords = correctAnswer.toLowerCase()
            .replace(/[^\w\s]/g, ' ') // Remove punctuation
            .split(/\s+/)
            .filter(word => word.length > 3); // Only words longer than 3 characters
        
        console.log('🔍 Key words from answer:', answerWords);
        
        // Add patterns for each significant word
        answerWords.forEach(word => {
            if (word.length > 3) {
                patterns.push({
                    text: word,
                    class: 'bg-green-300 text-black px-4 py-3 rounded-xl underline decoration-green-800 decoration-4 font-black border-4 border-green-500 shadow-2xl animate-pulse'
                });
            }
        });
        
        // Add patterns for common phrases in the answer
        const commonPhrases = [
            'significant opportunities',
            'European market',
            'technology sector',
            'preliminary results',
            'market analysis',
            'project proposal',
            'meeting room',
            'professional development',
            'website redesign',
            'checkout process',
            'database migration',
            'delivery delay',
            'compensation',
            'global GDP growth'
        ];
        
        commonPhrases.forEach(phrase => {
            if (correctAnswer.toLowerCase().includes(phrase.toLowerCase())) {
                patterns.push({
                    text: phrase,
                    class: 'bg-blue-300 text-black px-4 py-3 rounded-xl underline decoration-blue-800 decoration-4 font-black border-4 border-blue-500 shadow-2xl animate-pulse'
                });
            }
        });
    }
    
    nextReadingQuestion() {
        if (!window.toeicReading) return;
        
        // Remove any existing immediate feedback
        const existingFeedback = document.getElementById('immediateFeedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        const hasNext = window.toeicReading.nextQuestion();
        if (hasNext) {
            this.showReadingPracticeInterface(window.toeicReading.currentSession);
            // Restart countdown timer for new question
            this.startQuestionCountdown();
        } else {
            this.completeReadingSession();
        }
    }
    
    previousReadingQuestion() {
        if (!window.toeicReading) return;
        
        // Remove any existing immediate feedback
        const existingFeedback = document.getElementById('immediateFeedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        const hasPrevious = window.toeicReading.previousQuestion();
        if (hasPrevious) {
            this.showReadingPracticeInterface(window.toeicReading.currentSession);
            // Restart countdown timer for the question
            this.startQuestionCountdown();
        }
    }
    
    completeReadingSession() {
        if (!window.toeicReading) return;
        
        // Clear timers
        if (this.readingTimer) {
            clearInterval(this.readingTimer);
        }
        if (this.questionCountdownTimer) {
            clearInterval(this.questionCountdownTimer);
        }
        
        const stats = window.toeicReading.getSessionStats();
        const accuracy = stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;
        
        // Get session results for review
        const sessionResults = this.getSessionResults();
        
        const content = document.getElementById('toeicModuleContent');
        if (content) {
            content.innerHTML = `
                <div class="max-w-6xl mx-auto">
                    <!-- Results Summary -->
                    <div class="glass-effect rounded-2xl p-8 text-center mb-8">
                        <div class="text-6xl mb-6">🎉</div>
                        <h2 class="text-3xl font-bold text-white mb-4">Reading Practice Complete!</h2>
                        <p class="text-white/80 text-lg mb-8">Great job on completing your TOEIC reading practice session.</p>
                        
                        <!-- Results Summary -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div class="bg-green-500/20 border border-green-400/30 rounded-xl p-6">
                                <div class="text-3xl font-bold text-green-300">${stats.correctAnswers}</div>
                                <div class="text-white/80">Correct Answers</div>
                            </div>
                            <div class="bg-red-500/20 border border-red-400/30 rounded-xl p-6">
                                <div class="text-3xl font-bold text-red-300">${stats.incorrectAnswers}</div>
                                <div class="text-white/80">Incorrect Answers</div>
                            </div>
                            <div class="bg-blue-500/20 border border-blue-400/30 rounded-xl p-6">
                                <div class="text-3xl font-bold text-blue-300">${accuracy}%</div>
                                <div class="text-white/80">Accuracy</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Detailed Answer Review -->
                    <div class="glass-effect rounded-2xl p-8 mb-8">
                        <h3 class="text-2xl font-bold text-white mb-6 text-center">📚 Answer Review - Learn from Your Mistakes</h3>
                        <div class="space-y-6">
                            ${sessionResults.map((result, index) => `
                                <div class="bg-white/5 rounded-xl p-6 border border-white/10">
                                    <div class="flex items-center justify-between mb-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-full flex items-center justify-center ${result.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}">
                                                <span class="text-sm font-bold ${result.isCorrect ? 'text-green-400' : 'text-red-400'}">${index + 1}</span>
                                            </div>
                                            <div>
                                                <h4 class="text-lg font-semibold text-white">Question ${index + 1}</h4>
                                                <p class="text-white/60 text-sm">${result.questionType}</p>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <div class="text-2xl">${result.isCorrect ? '✅' : '❌'}</div>
                                            <div class="text-white/60 text-sm">${result.isCorrect ? 'Correct' : 'Incorrect'}</div>
                                        </div>
                                    </div>
                                    
                                    ${result.passage ? `
                                    <div class="bg-white/5 rounded-xl p-4 mb-4">
                                        <h5 class="text-sm font-semibold text-white mb-2">📖 Passage:</h5>
                                        <div class="text-white/80 text-sm leading-relaxed max-h-32 overflow-y-auto">${result.passage}</div>
                                    </div>
                                    ` : ''}
                                    
                                    <div class="bg-white/5 rounded-xl p-4 mb-4">
                                        <h5 class="text-sm font-semibold text-white mb-2">❓ Question:</h5>
                                        <p class="text-white/80 text-sm">${result.question}</p>
                                    </div>
                                    
                                    <div class="space-y-2">
                                        <h5 class="text-sm font-semibold text-white mb-2">📝 Answer Options:</h5>
                                        ${result.options.map((option, optionIndex) => `
                                            <div class="flex items-center p-3 rounded-lg ${optionIndex === result.selectedAnswer ? 
                                                (result.isCorrect ? 'bg-green-500/20 border border-green-400/30' : 'bg-red-500/20 border border-red-400/30') :
                                                (optionIndex === result.correctAnswer ? 'bg-green-500/10 border border-green-400/20' : 'bg-white/5')
                                            }">
                                                <div class="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${optionIndex === result.selectedAnswer ? 
                                                    (result.isCorrect ? 'border-green-400 bg-green-500/20' : 'border-red-400 bg-red-500/20') :
                                                    (optionIndex === result.correctAnswer ? 'border-green-400 bg-green-500/20' : 'border-white/30')
                                                }">
                                                    <div class="w-2 h-2 rounded-full ${optionIndex === result.selectedAnswer ? 
                                                        (result.isCorrect ? 'bg-green-400' : 'bg-red-400') :
                                                        (optionIndex === result.correctAnswer ? 'bg-green-400' : 'bg-transparent')
                                                    }"></div>
                                                </div>
                                                <span class="text-white/90 text-sm flex-1">${option}</span>
                                                ${optionIndex === result.correctAnswer ? '<span class="text-green-400 text-xs font-semibold">✓ Correct</span>' : ''}
                                                ${optionIndex === result.selectedAnswer && !result.isCorrect ? '<span class="text-red-400 text-xs font-semibold">✗ Your Answer</span>' : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                    
                                    ${result.explanation ? `
                                    <div class="bg-blue-500/10 rounded-xl p-4 mt-4">
                                        <h5 class="text-sm font-semibold text-blue-300 mb-2">💡 Explanation:</h5>
                                        <p class="text-white/80 text-sm">${result.explanation}</p>
                                    </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="flex gap-4 justify-center">
                        <button onclick="window.app.showReadingModule()" class="btn btn-primary">
                            <i data-lucide="refresh-cw" class="w-5 h-5 mr-2"></i>
                            Practice Again
                        </button>
                        <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                            <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                            Back to Main Menu
                        </button>
                    </div>
                </div>
            `;
            
            // Re-initialize Lucide icons
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    }
    
    getSessionResults() {
        if (!window.toeicReading || !window.toeicReading.currentSession) {
            return [];
        }
        
        const results = [];
        const session = window.toeicReading.currentSession;
        
        for (let i = 0; i < session.length; i++) {
            const questionId = session[i];
            const question = window.toeicReading.questions.get(questionId);
            
            if (question) {
                // Get passage if available
                let passage = null;
                if (question.passageId) {
                    const passageData = window.toeicReading.passages.get(question.passageId);
                    if (passageData) {
                        passage = passageData.content;
                    }
                }
                
                // Get user's answer from session stats or user progress
                const userProgress = window.toeicReading.userProgress.get(questionId);
                const selectedAnswer = userProgress ? userProgress.lastAnswer : -1;
                const isCorrect = selectedAnswer === question.correctAnswer;
                
                results.push({
                    questionId: questionId,
                    questionType: window.toeicReading.questionTypes[question.type]?.name || question.type,
                    question: question.question,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    selectedAnswer: selectedAnswer,
                    isCorrect: isCorrect,
                    passage: passage,
                    explanation: question.explanation
                });
            }
        }
        
        return results;
    }

    showTestSimulatorModule(options) {
        const content = document.getElementById('toeicModuleContent');
        content.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-8">
                    <h3 class="text-2xl font-bold text-white mb-4">TOEIC Test Simulator</h3>
                    <p class="text-white/80 mb-6">Take full-length practice tests to simulate the real TOEIC exam</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="glass-effect rounded-xl p-6">
                        <div class="text-center">
                            <div class="text-4xl mb-4">📋</div>
                            <h4 class="text-xl font-bold text-white mb-2">Full TOEIC Test</h4>
                            <p class="text-white/80 mb-4">Complete 200-question test with listening and reading sections</p>
                            <button onclick="window.startFullTest()" class="btn btn-primary w-full">
                                <i data-lucide="play" class="w-5 h-5 mr-2"></i>
                                Start Full Test
                            </button>
                        </div>
                    </div>
                    
                    <div class="glass-effect rounded-xl p-6">
                        <div class="text-center">
                            <div class="text-4xl mb-4">🎧</div>
                            <h4 class="text-xl font-bold text-white mb-2">Listening Test</h4>
                            <p class="text-white/80 mb-4">Practice listening comprehension with 100 questions</p>
                            <button onclick="window.startListeningTest()" class="btn btn-primary w-full">
                                <i data-lucide="headphones" class="w-5 h-5 mr-2"></i>
                                Start Listening Test
                            </button>
                        </div>
                    </div>
                    
                    <div class="glass-effect rounded-xl p-6">
                        <div class="text-center">
                            <div class="text-4xl mb-4">📖</div>
                            <h4 class="text-xl font-bold text-white mb-2">Reading Test</h4>
                            <p class="text-white/80 mb-4">Practice reading comprehension with 100 questions</p>
                            <button onclick="window.startReadingTest()" class="btn btn-primary w-full">
                                <i data-lucide="book-open" class="w-5 h-5 mr-2"></i>
                                Start Reading Test
                            </button>
                        </div>
                    </div>
                    
                    <div class="glass-effect rounded-xl p-6">
                        <div class="text-center">
                            <div class="text-4xl mb-4">📊</div>
                            <h4 class="text-xl font-bold text-white mb-2">Test Results</h4>
                            <p class="text-white/80 mb-4">View your previous test scores and progress</p>
                            <button onclick="window.app.showTestResults()" class="btn btn-secondary w-full">
                                <i data-lucide="bar-chart" class="w-5 h-5 mr-2"></i>
                                View Results
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="text-center mt-8">
                    <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                        <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                        Back to Main Menu
                    </button>
                </div>
            </div>
        `;
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    showTestModule(options) {
        const content = document.getElementById('toeicModuleContent');
        content.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-8">
                    <h3 class="text-2xl font-bold text-white mb-4">TOEIC Test Simulator</h3>
                    <p class="text-white/80 mb-6">Choose your test type and start practicing</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <!-- Full Test -->
                    <div class="glass-effect rounded-xl p-6 text-center">
                        <div class="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <i data-lucide="clipboard-list" class="w-8 h-8 text-blue-400"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-white mb-2">Full TOEIC Test</h4>
                        <p class="text-white/70 text-sm mb-4">Complete 200-question test (Listening + Reading)</p>
                        <div class="text-xs text-white/60 mb-4">
                            <div>⏱️ Duration: 2 hours 30 minutes</div>
                            <div>📊 Questions: 200</div>
                            <div>🎯 Score: 10-990</div>
                        </div>
                        <button onclick="window.app.startFullTOEICTest()" class="btn btn-primary w-full">
                            Start Full Test
                        </button>
                    </div>
                    
                    <!-- Listening Test -->
                    <div class="glass-effect rounded-xl p-6 text-center">
                        <div class="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                            <i data-lucide="headphones" class="w-8 h-8 text-green-400"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-white mb-2">Listening Test</h4>
                        <p class="text-white/70 text-sm mb-4">100 listening questions (Parts 1-4)</p>
                        <div class="text-xs text-white/60 mb-4">
                            <div>⏱️ Duration: 45 minutes</div>
                            <div>📊 Questions: 100</div>
                            <div>🎯 Score: 5-495</div>
                        </div>
                        <button onclick="window.app.startListeningTOEICTest()" class="btn btn-secondary w-full">
                            Start Listening Test
                        </button>
                    </div>
                    
                    <!-- Reading Test -->
                    <div class="glass-effect rounded-xl p-6 text-center">
                        <div class="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <i data-lucide="file-text" class="w-8 h-8 text-purple-400"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-white mb-2">Reading Test</h4>
                        <p class="text-white/70 text-sm mb-4">100 reading questions (Parts 5-7)</p>
                        <div class="text-xs text-white/60 mb-4">
                            <div>⏱️ Duration: 75 minutes</div>
                            <div>📊 Questions: 100</div>
                            <div>🎯 Score: 5-495</div>
                        </div>
                        <button onclick="window.app.startReadingTOEICTest()" class="btn btn-secondary w-full">
                            Start Reading Test
                        </button>
                    </div>
                </div>
                
                <!-- Test History -->
                <div class="glass-effect rounded-xl p-6 mb-6">
                    <h4 class="text-lg font-semibold text-white mb-4">📊 Test History</h4>
                    <div id="testHistory" class="space-y-3">
                        <div class="text-center text-white/60 py-4">
                            No test history available
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-center gap-4">
                    <button onclick="window.app.showTestSettings()" class="btn btn-secondary">
                        <i data-lucide="settings" class="w-5 h-5 mr-2"></i>
                        Test Settings
                    </button>
                    <button onclick="window.app.endCurrentSession()" class="btn btn-primary">
                        <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                        Back to Main Menu
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
        
        const testSimulator = new window.TOEICTestSimulator();
        const testSession = testSimulator.startFullTest();
        
        this.showTestInterface(testSession, 'full');
    }
    
    startListeningTOEICTest() {
        console.log('🎧 Starting Listening TOEIC Test...');
        
        if (!window.TOEICTestSimulator) {
            console.error('❌ TOEIC Test Simulator not available');
            return;
        }
        
        const testSimulator = new window.TOEICTestSimulator();
        const testSession = testSimulator.startListeningTest();
        
        this.showTestInterface(testSession, 'listening');
    }
    
    startReadingTOEICTest() {
        console.log('📚 Starting Reading TOEIC Test...');
        
        if (!window.TOEICTestSimulator) {
            console.error('❌ TOEIC Test Simulator not available');
            return;
        }
        
        const testSimulator = new window.TOEICTestSimulator();
        const testSession = testSimulator.startReadingTest();
        
        this.showTestInterface(testSession, 'reading');
    }
    
    showTestInterface(testSession, testType) {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        const testInfo = this.getTestInfo(testType);
        
        content.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="glass-effect rounded-xl p-6 mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-white">${testInfo.title}</h3>
                        <div class="text-right">
                            <div class="text-sm text-white/80">Time Remaining</div>
                            <div id="testTimer" class="text-lg font-bold text-blue-400">${testInfo.duration}</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-4 mb-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-400">${testSession.correctAnswers || 0}</div>
                            <div class="text-sm text-white/80">Correct</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-red-400">${testSession.incorrectAnswers || 0}</div>
                            <div class="text-sm text-white/80">Incorrect</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-400">${testSession.currentQuestion || 1}/${testInfo.totalQuestions}</div>
                            <div class="text-sm text-white/80">Progress</div>
                        </div>
                    </div>
                    
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div id="progressBar" class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: ${((testSession.currentQuestion || 1) / testInfo.totalQuestions) * 100}%"></div>
                    </div>
                </div>
                
                <div class="glass-effect rounded-xl p-6">
                    <div id="testQuestion" class="mb-6">
                        <h4 class="text-lg font-semibold text-white mb-4">Question ${testSession.currentQuestion || 1}</h4>
                        <div class="text-white/90 mb-6">
                            ${this.generateTestQuestion(testSession, testType)}
                        </div>
                        
                        <div id="testOptions" class="space-y-3">
                            ${this.generateTestOptions(testSession, testType)}
                        </div>
                    </div>
                    
                    <div class="flex justify-between">
                        <button id="prevBtn" onclick="window.app.previousTestQuestion()" class="btn btn-secondary" ${testSession.currentQuestion <= 1 ? 'disabled' : ''}>
                            <i data-lucide="chevron-left" class="w-5 h-5 mr-2"></i>
                            Previous
                        </button>
                        
                        <button id="nextBtn" onclick="window.app.nextTestQuestion()" class="btn btn-primary">
                            Next
                            <i data-lucide="chevron-right" class="w-5 h-5 ml-2"></i>
                        </button>
                    </div>
                </div>
                
                <div class="flex justify-center mt-6">
                    <button onclick="window.app.submitTest()" class="btn btn-danger">
                        <i data-lucide="flag" class="w-5 h-5 mr-2"></i>
                        Submit Test
                    </button>
                </div>
            </div>
        `;
        
        // Start test timer
        this.startTestTimer(testInfo.duration);
    }
    
    getTestInfo(testType) {
        const testInfo = {
            full: {
                title: 'Full TOEIC Test',
                duration: '2:30:00',
                totalQuestions: 200
            },
            listening: {
                title: 'TOEIC Listening Test',
                duration: '0:45:00',
                totalQuestions: 100
            },
            reading: {
                title: 'TOEIC Reading Test',
                duration: '1:15:00',
                totalQuestions: 100
            }
        };
        
        return testInfo[testType] || testInfo.full;
    }
    
    generateTestQuestion(testSession, testType) {
        if (!window.toeicTestSimulator) {
            return '<p class="text-red-400">Test simulator not available</p>';
        }
        
        const question = window.toeicTestSimulator.getCurrentQuestion();
        if (!question) {
            return '<p class="text-yellow-400">No question available</p>';
        }
        
        // Generate question based on type
        if (question.type === 'photograph') {
            return `
                <div class="text-center mb-6">
                    <p class="text-lg mb-4">Look at the photograph.</p>
                    <div class="bg-gray-800 rounded-lg p-8 mb-4">
                        <p class="text-white/60">[Photograph would be displayed here]</p>
                    </div>
                </div>
            `;
        } else if (question.type === 'question_response') {
            return `
                <div class="text-center mb-6">
                    <p class="text-lg mb-4">Listen to the question.</p>
                    <div class="bg-gray-800 rounded-lg p-8 mb-4">
                        <p class="text-white/60">[Audio would be played here]</p>
                    </div>
                </div>
            `;
        } else if (question.type === 'conversation') {
            return `
                <div class="mb-6">
                    <p class="text-lg mb-4">Listen to the conversation.</p>
                    <div class="bg-gray-800 rounded-lg p-8 mb-4">
                        <p class="text-white/60">[Conversation audio would be played here]</p>
                    </div>
                    <p class="text-white/90 mb-4">${question.question}</p>
                </div>
            `;
        } else if (question.type === 'talk') {
            return `
                <div class="mb-6">
                    <p class="text-lg mb-4">Listen to the talk.</p>
                    <div class="bg-gray-800 rounded-lg p-8 mb-4">
                        <p class="text-white/60">[Talk audio would be played here]</p>
                    </div>
                    <p class="text-white/90 mb-4">${question.question}</p>
                </div>
            `;
        } else if (question.type === 'incomplete_sentences') {
            return `
                <div class="mb-6">
                    <p class="text-white/90 mb-4">${question.question}</p>
                </div>
            `;
        } else if (question.type === 'text_completion') {
            return `
                <div class="mb-6">
                    <div class="bg-gray-800 rounded-lg p-6 mb-4">
                        <p class="text-white/90 whitespace-pre-line">${question.passage}</p>
                    </div>
                    <p class="text-white/90 mb-4">${question.question}</p>
                </div>
            `;
        } else if (question.type === 'reading_comprehension') {
            return `
                <div class="mb-6">
                    <div class="bg-gray-800 rounded-lg p-6 mb-4">
                        <p class="text-white/90 whitespace-pre-line">${question.passage}</p>
                    </div>
                    <p class="text-white/90 mb-4">${question.question}</p>
                </div>
            `;
        }
        
        return '<p class="text-red-400">Unknown question type</p>';
    }
    
    generateTestOptions(testSession, testType) {
        if (!window.toeicTestSimulator) {
            return '<p class="text-red-400">Test simulator not available</p>';
        }
        
        const question = window.toeicTestSimulator.getCurrentQuestion();
        if (!question || !question.options) {
            return '<p class="text-yellow-400">No options available</p>';
        }
        
        // Generate answer options (A, B, C, D)
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
    
    startTestTimer(duration) {
        // Parse duration (e.g., "2:30:00" or "0:45:00")
        const parts = duration.split(':');
        let totalSeconds = 0;
        
        if (parts.length === 3) {
            totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        } else if (parts.length === 2) {
            totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        
        this.testTimer = setInterval(() => {
            totalSeconds--;
            
            if (totalSeconds <= 0) {
                clearInterval(this.testTimer);
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
        
        // Get current answer if selected
        const selectedAnswer = document.querySelector('input[name="testAnswer"]:checked');
        if (selectedAnswer) {
            const answerIndex = parseInt(selectedAnswer.value);
            window.toeicTestSimulator.answerQuestion(answerIndex);
            console.log(`📝 Answered question with: ${answerIndex}`);
        }
        
        // Move to next question
        const hasNext = window.toeicTestSimulator.nextQuestion();
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
        
        // Track analytics
        if (window.advancedAnalytics && typeof window.advancedAnalytics.trackTestScore === 'function') {
            window.advancedAnalytics.trackTestScore('toeic_test', results.totalScore, {
                correctAnswers: results.correctAnswers,
                incorrectAnswers: results.incorrectAnswers,
                totalQuestions: results.totalQuestions,
                timeSpent: results.timeSpent,
                accuracy: results.accuracy
            });
        }
        
        // Show test results
        this.showTestResults(results);
    }
    
    getTestStats() {
        // This would calculate actual test statistics
        // For now, return sample data
        return {
            score: 850,
            correct: 85,
            incorrect: 15,
            total: 100,
            timeSpent: 7200000, // 2 hours in milliseconds
            accuracy: 85
        };
    }
    
    showTestResults() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        content.innerHTML = `
            <div class="max-w-2xl mx-auto text-center">
                <div class="glass-effect rounded-xl p-8 mb-6">
                    <h3 class="text-2xl font-bold text-white mb-6">🎉 Test Complete!</h3>
                    
                    <div class="grid grid-cols-2 gap-6 mb-6">
                        <div class="bg-green-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-green-400">85</div>
                            <div class="text-white/80">Correct Answers</div>
                        </div>
                        <div class="bg-red-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-red-400">15</div>
                            <div class="text-white/80">Incorrect Answers</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-6 mb-6">
                        <div class="bg-blue-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-blue-400">850</div>
                            <div class="text-white/80">TOEIC Score</div>
                        </div>
                        <div class="bg-purple-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-purple-400">85%</div>
                            <div class="text-white/80">Accuracy</div>
                        </div>
                    </div>
                    
                    <div class="flex justify-center gap-4">
                        <button onclick="window.app.showTestModule()" class="btn btn-primary">
                            <i data-lucide="clipboard-list" class="w-5 h-5 mr-2"></i>
                            Take Another Test
                        </button>
                        <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                            <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                            Main Menu
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    loadTestHistory() {
        // Load test history from localStorage
        const testHistory = JSON.parse(localStorage.getItem('toeicTestHistory') || '[]');
        const historyContainer = document.getElementById('testHistory');
        
        if (!historyContainer) return;
        
        if (testHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="text-center text-white/60 py-4">
                    No test history available
                </div>
            `;
            return;
        }
        
        historyContainer.innerHTML = testHistory.map(test => `
            <div class="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <div>
                    <div class="text-white font-medium">${test.type} Test</div>
                    <div class="text-white/60 text-sm">${new Date(test.date).toLocaleDateString()}</div>
                </div>
                <div class="text-right">
                    <div class="text-green-400 font-bold">${test.score}</div>
                    <div class="text-white/60 text-sm">${test.accuracy}%</div>
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
                    <h3 class="text-xl font-bold text-white mb-6">⚙️ Test Settings</h3>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-white/80 mb-2">Test Duration</label>
                            <select class="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white">
                                <option value="standard">Standard (Official TOEIC timing)</option>
                                <option value="extended">Extended (+25% time)</option>
                                <option value="practice">Practice (No time limit)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-white/80 mb-2">Question Order</label>
                            <select class="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white">
                                <option value="sequential">Sequential (1-200)</option>
                                <option value="random">Random</option>
                                <option value="difficulty">By Difficulty</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-3" checked>
                                <span class="text-white/80">Show explanations after each question</span>
                            </label>
                        </div>
                        
                        <div>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-3">
                                <span class="text-white/80">Allow going back to previous questions</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="flex justify-center gap-4 mt-8">
                        <button onclick="window.app.showTestModule()" class="btn btn-primary">
                            Save Settings
                        </button>
                        <button onclick="window.app.showTestModule()" class="btn btn-secondary">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    showFlashcardModule(options) {
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
    
    showGrammarModule(options) {
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
    
    showProgressModule(options) {
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
                    <h3 class="text-xl font-bold text-white mb-4">TOEIC Progress Analytics</h3>
                    <p class="text-white/80 mb-6">Mode: ${options.mode || 'Analytics'}</p>
                    <div class="bg-yellow-500/20 rounded-lg p-4 mb-6">
                        <p class="text-yellow-400">⚠️ Analytics dashboard is loading...</p>
                    </div>
                    <button onclick="window.app.endCurrentSession()" class="btn btn-primary">
                        Back to Main Menu
                    </button>
                </div>
            `;
        }
    }
    
    showSettingsModule(options) {
        const content = document.getElementById('toeicModuleContent');
        content.innerHTML = `
            <div class="text-center">
                <h3 class="text-xl font-bold text-white mb-4">TOEIC Settings</h3>
                <p class="text-white/80 mb-6">Mode: ${options.mode || 'General'}</p>
                <div class="bg-gray-500/20 rounded-lg p-4 mb-6">
                    <p class="text-gray-400">⚙️ Settings panel is under development</p>
                </div>
                <button onclick="window.app.endCurrentSession()" class="btn btn-primary">
                    Back to Main Menu
                </button>
            </div>
        `;
    }
}

// Global helper functions
window.startGame = function(gameMode) {
    console.log(`🎯 Starting legacy game: ${gameMode}`);
    if (window.app && window.app.startGame) {
        window.app.startGame(gameMode);
    } else {
        console.error('❌ App not initialized');
    }
};

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



window.startFullTest = function() {
    if (window.app && window.toeicTestSimulator) {
        const test = window.toeicTestSimulator.startTest({ type: 'full' });
        console.log('📝 Full TOEIC test started');
    }
};

window.startListeningTest = function() {
    if (window.app && window.toeicTestSimulator) {
        const test = window.toeicTestSimulator.startTest({ type: 'listening' });
        console.log('🎧 Listening test started');
    }
};

window.startReadingTest = function() {
    if (window.app && window.toeicTestSimulator) {
        const test = window.toeicTestSimulator.startTest({ type: 'reading' });
        console.log('📖 Reading test started');
    }
};

window.startFlashcardReview = function() {
    if (window.app && window.toeicVocabulary) {
        console.log('🃏 Flashcard review started');
        // Implement flashcard review functionality
    }
};

window.showFlashcardSettings = function() {
    console.log('⚙️ Flashcard settings');
    // Implement flashcard settings
};

window.startGrammarPractice = function() {
    console.log('📚 Grammar practice started');
    // Implement grammar practice
};

window.showStats = function() {
    if (window.app && window.app.showStats) {
        window.app.showStats();
    }
};

window.showSettings = function() {
    if (window.app && window.app.showSettings) {
        window.app.showSettings();
    }
};

window.toggleMobileMenu = function() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
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
    
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    // Make button draggable
    floatingBtn.addEventListener('mousedown', startDrag);
    floatingBtn.addEventListener('touchstart', startDrag);
    
    function startDrag(e) {
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        
        startX = clientX;
        startY = clientY;
        
        const rect = floatingBtn.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        // Don't prevent default immediately - wait to see if it's a drag or click
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }
    
    function drag(e) {
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        
        // Only start dragging if moved more than 5 pixels
        if (!isDragging && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
            isDragging = true;
            floatingBtn.classList.add('dragging');
            e.preventDefault();
        }
        
        if (!isDragging) return;
        
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;
        
        // Constrain to viewport
        const maxLeft = window.innerWidth - floatingBtn.offsetWidth;
        const maxTop = window.innerHeight - floatingBtn.offsetHeight;
        
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));
        
        floatingBtn.style.left = newLeft + 'px';
        floatingBtn.style.top = newTop + 'px';
        floatingBtn.style.right = 'auto';
        floatingBtn.style.transform = 'none';
        
        e.preventDefault();
    }
    
    function endDrag() {
        // Always clean up event listeners
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
        
        if (isDragging) {
            // It was a drag - save position
            isDragging = false;
            floatingBtn.classList.remove('dragging');
            
            const rect = floatingBtn.getBoundingClientRect();
            localStorage.setItem('floatingHomeButtonPosition', JSON.stringify({
                left: rect.left,
                top: rect.top
            }));
            
            console.log('🖱️ Drag completed - position saved');
        } else {
            // It was just a click - let the onclick event fire
            console.log('🖱️ Click detected - allowing onclick to fire');
        }
    }
    
    // Load saved position
    const savedPosition = localStorage.getItem('floatingHomeButtonPosition');
    if (savedPosition) {
        try {
            const position = JSON.parse(savedPosition);
            floatingBtn.style.left = position.left + 'px';
            floatingBtn.style.top = position.top + 'px';
            floatingBtn.style.right = 'auto';
            floatingBtn.style.transform = 'none';
        } catch (e) {
            window.logger?.warn('Failed to load floating button position:', e);
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const rect = floatingBtn.getBoundingClientRect();
        const maxLeft = window.innerWidth - floatingBtn.offsetWidth;
        const maxTop = window.innerHeight - floatingBtn.offsetHeight;
        
        if (rect.left > maxLeft || rect.top > maxTop) {
            // Reset to default position if out of bounds
            floatingBtn.style.left = 'auto';
            floatingBtn.style.top = '50%';
            floatingBtn.style.right = '20px';
            floatingBtn.style.transform = 'translateY(-50%)';
            localStorage.removeItem('floatingHomeButtonPosition');
        }
    });
}

// Global function to go home
window.goHome = function() {
    console.log('🏠 goHome function called!');
    window.logger?.info('🏠 Going home...');
    
    try {
        // Hide all module content
        const moduleContent = document.getElementById('toeicModuleContent');
        if (moduleContent) {
            moduleContent.classList.add('hidden');
            console.log('✅ Hidden module content');
        } else {
            console.log('⚠️ Module content element not found');
        }
        
        // Show main menu
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.classList.remove('hidden');
            console.log('✅ Showed main menu');
        } else {
            console.log('⚠️ Main menu element not found');
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
