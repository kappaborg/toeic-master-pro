// Mobile Optimization for WordMaster Pro
// Handles touch gestures, mobile-specific UI, and responsive behavior

class MobileOptimization {
    constructor() {
        this.isMobile = this.detectMobileDevice();
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.isSwipeEnabled = true;
        
        this.init();
        console.log(`📱 Mobile Optimization initialized (Mobile: ${this.isMobile})`);
    }
    
    init() {
        this.setupTouchEvents();
        this.setupResponsiveFeatures();
        this.setupMobileSpecificUI();
        this.setupKeyboardHandling();
        this.optimizeForMobile();
    }
    
    detectMobileDevice() {
        const userAgent = navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        
        return mobileRegex.test(userAgent) || 
               window.innerWidth <= 768 ||
               'ontouchstart' in window ||
               navigator.maxTouchPoints > 0;
    }
    
    setupTouchEvents() {
        // Add touch event listeners
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        
        // Prevent default touch behaviors on game area
        const gameArea = document.getElementById('gameScreens');
        if (gameArea) {
            gameArea.addEventListener('touchmove', (e) => {
                if (e.target.closest('.game-choice') || e.target.closest('.draggable')) {
                    e.preventDefault();
                }
            }, { passive: false });
        }
    }
    
    handleTouchStart(event) {
        if (event.touches && event.touches.length > 0) {
            this.touchStartX = event.touches[0].clientX;
            this.touchStartY = event.touches[0].clientY;
        }
        
        // Add visual feedback for touch
        const target = event.target.closest('button, .game-card, .choice-button');
        if (target) {
            target.classList.add('touch-active');
        }
    }
    
    handleTouchMove(event) {
        // Prevent scrolling on certain elements
        const target = event.target.closest('.game-area, .modal-content');
        if (target) {
            event.preventDefault();
        }
    }
    
    handleTouchEnd(event) {
        if (event.changedTouches && event.changedTouches.length > 0) {
            this.touchEndX = event.changedTouches[0].clientX;
            this.touchEndY = event.changedTouches[0].clientY;
        }
        
        // Remove visual feedback
        const target = event.target.closest('button, .game-card, .choice-button');
        if (target) {
            target.classList.remove('touch-active');
        }
        
        // Handle swipe gestures
        if (this.isSwipeEnabled) {
            this.handleSwipeGesture();
        }
    }
    
    handleSwipeGesture() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const minSwipeDistance = 50;
        
        // Horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.handleSwipeRight();
            } else {
                this.handleSwipeLeft();
            }
        }
        
        // Vertical swipes
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                this.handleSwipeDown();
            } else {
                this.handleSwipeUp();
            }
        }
    }
    
    handleSwipeRight() {
        // Navigate to previous question or back
        if (window.gameEngine && window.gameEngine.isGameActive) {
            this.triggerHapticFeedback('light');
            // Could implement previous question functionality
        }
        console.log('👉 Swipe right detected');
    }
    
    handleSwipeLeft() {
        // Navigate to next question or forward
        if (window.gameEngine && window.gameEngine.isGameActive) {
            this.triggerHapticFeedback('light');
            // Could implement next question functionality
        }
        console.log('👈 Swipe left detected');
    }
    
    handleSwipeUp() {
        // Show additional info or progress
        if (window.progressDashboard) {
            window.progressDashboard.show();
            this.triggerHapticFeedback('medium');
        }
        console.log('👆 Swipe up detected');
    }
    
    handleSwipeDown() {
        // Hide UI or go back
        const modals = document.querySelectorAll('.modal-overlay:not(.hidden)');
        if (modals.length > 0) {
            modals[modals.length - 1].classList.add('hidden');
            this.triggerHapticFeedback('light');
        }
        console.log('👇 Swipe down detected');
    }
    
    setupResponsiveFeatures() {
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Handle viewport changes
        window.addEventListener('resize', this.handleViewportChange.bind(this));
        
        // Prevent zoom on double tap for game elements
        document.addEventListener('touchend', this.preventDoubleTabZoom.bind(this));
    }
    
    handleOrientationChange() {
        console.log('📱 Orientation changed');
        
        // Adjust layout for new orientation
        const isPortrait = window.innerHeight > window.innerWidth;
        document.body.classList.toggle('orientation-portrait', isPortrait);
        document.body.classList.toggle('orientation-landscape', !isPortrait);
        
        // Update game layout if active
        if (window.gameEngine && window.gameEngine.isGameActive) {
            setTimeout(() => {
                this.optimizeGameLayoutForOrientation();
            }, 300);
        }
        
        this.triggerHapticFeedback('light');
    }
    
    handleViewportChange() {
        // Update mobile detection based on new size
        const wasMobile = this.isMobile;
        this.isMobile = this.detectMobileDevice();
        
        if (wasMobile !== this.isMobile) {
            console.log(`📱 Device type changed: ${this.isMobile ? 'Mobile' : 'Desktop'}`);
            this.optimizeForMobile();
        }
    }
    
    preventDoubleTabZoom(event) {
        const target = event.target.closest('.game-choice, .game-card, button');
        if (target) {
            event.preventDefault();
        }
    }
    
    setupMobileSpecificUI() {
        if (this.isMobile) {
            // Add mobile-specific classes
            document.body.classList.add('mobile-device');
            
            // Enhance button sizes for touch
            this.enhanceButtonsForTouch();
            
            // Add mobile navigation hints
            this.addMobileNavigationHints();
            
            // Setup pull-to-refresh (if needed)
            this.setupPullToRefresh();
        }
    }
    
    enhanceButtonsForTouch() {
        const style = document.createElement('style');
        style.textContent = `
            .mobile-device button,
            .mobile-device .game-card,
            .mobile-device .choice-button {
                min-height: 44px;
                min-width: 44px;
                padding: 12px 16px;
            }
            
            .mobile-device .touch-active {
                background-color: rgba(255, 255, 255, 0.1) !important;
                transform: scale(0.98);
                transition: all 0.1s ease;
            }
            
            .mobile-device .game-choice {
                margin: 8px 0;
                padding: 16px;
                border-radius: 12px;
            }
            
            @media (orientation: landscape) and (max-height: 500px) {
                .mobile-device .text-4xl { font-size: 2rem; }
                .mobile-device .text-3xl { font-size: 1.5rem; }
                .mobile-device .p-8 { padding: 1rem; }
            }
        `;
        document.head.appendChild(style);
    }
    
    addMobileNavigationHints() {
        // Add swipe hints for mobile users
        const hints = [
            { text: 'Swipe up for progress', icon: '👆' },
            { text: 'Swipe down to close', icon: '👇' },
            { text: 'Tap buttons to interact', icon: '👆' }
        ];
        
        // Show hints on first mobile visit
        if (!localStorage.getItem('mobileHintsShown')) {
            setTimeout(() => {
                this.showMobileHints(hints);
                localStorage.setItem('mobileHintsShown', 'true');
            }, 2000);
        }
    }
    
    showMobileHints(hints) {
        const hintContainer = document.createElement('div');
        hintContainer.className = 'mobile-hints fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black/80 backdrop-blur-sm rounded-xl p-6 text-white text-center';
        hintContainer.innerHTML = `
            <h3 class="text-lg font-bold mb-4">📱 Mobile Tips</h3>
            <div class="space-y-2 mb-4">
                ${hints.map(hint => `
                    <div class="flex items-center justify-center space-x-2">
                        <span class="text-xl">${hint.icon}</span>
                        <span class="text-sm">${hint.text}</span>
                    </div>
                `).join('')}
            </div>
            <button onclick="this.parentElement.remove()" 
                    class="bg-accent hover:bg-accent/80 px-4 py-2 rounded-lg font-semibold">
                Got it!
            </button>
        `;
        document.body.appendChild(hintContainer);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (hintContainer.parentElement) {
                hintContainer.remove();
            }
        }, 10000);
    }
    
    setupKeyboardHandling() {
        // Handle virtual keyboard on mobile
        if (this.isMobile) {
            let originalViewportHeight = window.innerHeight;
            
            window.addEventListener('resize', () => {
                const currentHeight = window.innerHeight;
                const heightDifference = originalViewportHeight - currentHeight;
                
                // Virtual keyboard is likely open if height decreased significantly
                if (heightDifference > 150) {
                    document.body.classList.add('keyboard-open');
                } else {
                    document.body.classList.remove('keyboard-open');
                }
            });
        }
    }
    
    setupPullToRefresh() {
        // Simple pull-to-refresh implementation
        let startY = 0;
        let isPulling = false;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (isPulling && window.scrollY === 0) {
                const currentY = e.touches[0].clientY;
                const pullDistance = currentY - startY;
                
                if (pullDistance > 100) {
                    // Show pull to refresh indicator
                    this.showPullToRefreshIndicator(true);
                }
            }
        });
        
        document.addEventListener('touchend', () => {
            if (isPulling) {
                const pullDistance = window.scrollY === 0 ? 1 : 0;
                if (pullDistance > 100) {
                    // Trigger refresh
                    this.triggerRefresh();
                }
                this.showPullToRefreshIndicator(false);
                isPulling = false;
            }
        });
    }
    
    showPullToRefreshIndicator(show) {
        let indicator = document.getElementById('pullToRefreshIndicator');
        
        if (show && !indicator) {
            indicator = document.createElement('div');
            indicator.id = 'pullToRefreshIndicator';
            indicator.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm z-50';
            indicator.innerHTML = '🔄 Release to refresh';
            document.body.appendChild(indicator);
        } else if (!show && indicator) {
            indicator.remove();
        }
    }
    
    triggerRefresh() {
        this.triggerHapticFeedback('medium');
        // Refresh app data instead of full page reload
        if (window.app && window.app.isInitialized) {
            window.app.updateGameStatistics();
            if (window.uiManager) {
                window.uiManager.showToast('Content refreshed!', 'success');
            }
        }
    }
    
    optimizeForMobile() {
        if (this.isMobile) {
            // Add mobile-specific optimizations
            this.reducedMotionForLowPowerMode();
            this.optimizeTouchTargets();
            this.improveScrollPerformance();
        }
    }
    
    optimizeGameLayoutForOrientation() {
        const gameScreens = document.getElementById('gameScreens');
        if (gameScreens && !gameScreens.classList.contains('hidden')) {
            // Adjust game layout based on orientation
            const isLandscape = window.innerWidth > window.innerHeight;
            gameScreens.classList.toggle('landscape-mode', isLandscape);
        }
    }
    
    reducedMotionForLowPowerMode() {
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }
    
    optimizeTouchTargets() {
        // Ensure all interactive elements are at least 44px
        const interactiveElements = document.querySelectorAll('button, a, input, [onclick]');
        interactiveElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.height < 44) {
                element.style.minHeight = '44px';
            }
            if (rect.width < 44) {
                element.style.minWidth = '44px';
            }
        });
    }
    
    improveScrollPerformance() {
        // Use passive scroll listeners for better performance
        document.addEventListener('scroll', () => {
            // Scroll handling logic
        }, { passive: true });
    }
    
    triggerHapticFeedback(type = 'light') {
        // Trigger haptic feedback on supported devices
        if ('vibrate' in navigator) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [30],
                success: [10, 50, 10],
                error: [100, 50, 100]
            };
            
            navigator.vibrate(patterns[type] || patterns.light);
        }
    }
    
    // Enable/disable swipe gestures
    enableSwipeGestures() {
        this.isSwipeEnabled = true;
    }
    
    disableSwipeGestures() {
        this.isSwipeEnabled = false;
    }
    
    // Get device info
    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
            touchSupport: 'ontouchstart' in window,
            maxTouchPoints: navigator.maxTouchPoints
        };
    }
}

// Global mobile utility functions
window.isMobileDevice = function() {
    return window.mobileOptimization ? window.mobileOptimization.isMobile : false;
};

window.triggerHaptic = function(type) {
    if (window.mobileOptimization) {
        window.mobileOptimization.triggerHapticFeedback(type);
    }
};

// Initialize Mobile Optimization immediately
if (!window.mobileOptimization) {
    window.mobileOptimization = new MobileOptimization();
}

// Export for use in modules
window.MobileOptimization = MobileOptimization;

console.log('📱 Mobile Optimization system loaded');
