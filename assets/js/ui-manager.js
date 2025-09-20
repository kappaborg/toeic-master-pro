// UI Manager for WordMaster Pro
// Handles notifications, loading states, and UI animations

class UIManager {
    constructor() {
        this.isLoading = false;
        this.currentToast = null;
        this.initialize();
    }
    
    initialize() {
        console.log('🎨 Initializing UI Manager...');
        this.setupGlobalStyles();
        this.setupLoadingSystem();
        this.setupToastSystem();
        console.log('✅ UI Manager initialized');
    }
    
    setupGlobalStyles() {
        // Add any additional global styles if needed
        const style = document.createElement('style');
        style.textContent = `
            .animate-bounce-soft {
                animation: bounce-soft 2s infinite;
            }
            
            @keyframes bounce-soft {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            .fade-in {
                animation: fadeIn 0.3s ease-in;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .slide-up {
                animation: slideUp 0.4s ease-out;
            }
            
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .pulse-glow {
                animation: pulseGlow 2s infinite;
            }
            
            @keyframes pulseGlow {
                0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
                50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupLoadingSystem() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.loadingProgress = document.getElementById('loadingProgress');
        this.loadingText = document.getElementById('loadingText');
    }
    
    setupToastSystem() {
        // Create toast container if it doesn't exist
        if (!document.getElementById('toastContainer')) {
            const container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
        }
    }
    
    // Loading Management
    showLoading(text = 'Loading...') {
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
            if (this.loadingText) {
                this.loadingText.textContent = text;
            }
        }
        this.isLoading = true;
    }
    
    hideLoading() {
        if (this.loadingScreen) {
            setTimeout(() => {
                this.loadingScreen.classList.add('hidden');
            }, 500);
        }
        this.isLoading = false;
    }
    
    updateLoadingProgress(percentage, text = '') {
        if (this.loadingProgress) {
            this.loadingProgress.style.width = `${percentage}%`;
        }
        if (text && this.loadingText) {
            this.loadingText.textContent = text;
        }
    }
    
    // Toast Notifications
    showToast(message, type = 'info', duration = 3000) {
        const toast = this.createToast(message, type);
        const container = document.getElementById('toastContainer');
        
        if (container) {
            container.appendChild(toast);
            
            // Animate in
            setTimeout(() => toast.classList.add('show'), 100);
            
            // Auto remove
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
        
        return toast;
    }
    
    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast glass-effect rounded-lg p-4 max-w-sm transform translate-x-full transition-transform duration-300 ${this.getToastTypeClass(type)}`;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <div class="flex items-center">
                <i data-lucide="${icon}" class="w-5 h-5 mr-3"></i>
                <span class="flex-1 text-white">${message}</span>
                <button class="ml-3 text-white/70 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        
        return toast;
    }
    
    getToastTypeClass(type) {
        const classes = {
            success: 'border-l-4 border-green-400 bg-green-500/20',
            error: 'border-l-4 border-red-400 bg-red-500/20',
            warning: 'border-l-4 border-yellow-400 bg-yellow-500/20',
            info: 'border-l-4 border-blue-400 bg-blue-500/20'
        };
        return classes[type] || classes.info;
    }
    
    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'alert-circle',
            warning: 'alert-triangle',
            info: 'info'
        };
        return icons[type] || icons.info;
    }
    
    // Status Bar Management
    showStatusBar() {
        const statusBar = document.getElementById('statusBar');
        if (statusBar) {
            statusBar.classList.remove('hidden');
        }
    }
    
    hideStatusBar() {
        const statusBar = document.getElementById('statusBar');
        if (statusBar) {
            statusBar.classList.add('hidden');
        }
    }
    
    updateStatusBar(data) {
        const elements = {
            score: document.getElementById('currentScore'),
            level: document.getElementById('currentLevel'),
            progress: document.getElementById('gameProgress'),
            streak: document.getElementById('currentStreak')
        };
        
        if (data.score !== undefined && elements.score) {
            elements.score.textContent = data.score;
        }
        
        if (data.level && elements.level) {
            elements.level.textContent = data.level;
        }
        
        if (data.progress !== undefined && elements.progress) {
            elements.progress.style.width = `${data.progress}%`;
        }
        
        if (data.streak !== undefined && elements.streak) {
            elements.streak.textContent = data.streak;
        }
    }
    
    // Screen Management
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('[id$="Screen"]').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('fade-in');
        }
        
        // Update navigation state
        this.updateNavigationState(screenId);
    }
    
    updateNavigationState(screenId) {
        // This could be expanded to highlight current navigation item
        console.log(`📱 Navigated to: ${screenId}`);
    }
    
    // Animation Helpers
    animateElement(element, animationClass, duration = 300) {
        if (!element) return;
        
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }
    
    flashElement(element, color = 'bg-white/20', duration = 200) {
        if (!element) return;
        
        const originalClass = element.className;
        element.classList.add(color);
        
        setTimeout(() => {
            element.className = originalClass;
        }, duration);
    }
    
    // Modal Management
    showModal(content, options = {}) {
        const modal = this.createModal(content, options);
        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('show');
        }, 50);
        
        return modal;
    }
    
    createModal(content, options) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 opacity-0 transition-opacity duration-300';
        
        modal.innerHTML = `
            <div class="modal-content glass-effect rounded-2xl max-w-lg w-full transform scale-95 transition-transform duration-300">
                <div class="p-6">
                    ${options.title ? `<h3 class="text-xl font-bold text-white mb-4">${options.title}</h3>` : ''}
                    <div class="text-white">${content}</div>
                    ${options.actions ? `
                        <div class="flex justify-end space-x-3 mt-6">
                            ${options.actions}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        return modal;
    }
    
    closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    // Feedback Animations
    showCorrectFeedback(element) {
        if (!element) return;
        
        element.classList.add('bg-green-500/30', 'border-green-400');
        this.animateElement(element, 'pulse-glow', 1000);
        
        setTimeout(() => {
            element.classList.remove('bg-green-500/30', 'border-green-400');
        }, 2000);
    }
    
    showIncorrectFeedback(element) {
        if (!element) return;
        
        element.classList.add('bg-red-500/30', 'border-red-400');
        this.animateElement(element, 'animate-pulse', 1000);
        
        setTimeout(() => {
            element.classList.remove('bg-red-500/30', 'border-red-400');
        }, 2000);
    }
    
    // Utility Methods
    createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }
    
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        return `${remainingSeconds}s`;
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Add CSS for toast animations
const toastCSS = `
    .toast.show {
        transform: translateX(0);
    }
    
    .modal-overlay.show {
        opacity: 1;
    }
    
    .modal-overlay.show .modal-content {
        transform: scale(1);
    }
    
    .glass-effect {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
`;

// Inject CSS
const toastStyle = document.createElement('style');
toastStyle.textContent = toastCSS;
document.head.appendChild(toastStyle);

// Export for global use
window.UIManager = UIManager;
