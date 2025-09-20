// Error Boundary System for WordMaster Pro
// Handles errors gracefully and provides fallback UI

class ErrorBoundary {
    constructor() {
        this.errors = [];
        this.setupGlobalErrorHandlers();
        this.setupUnhandledRejectionHandler();
        console.log('🛡️ Error Boundary initialized');
    }
    
    setupGlobalErrorHandlers() {
        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError({
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error,
                type: 'javascript'
            });
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                message: event.reason?.message || 'Unhandled promise rejection',
                error: event.reason,
                type: 'promise'
            });
        });
    }
    
    setupUnhandledRejectionHandler() {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showErrorMessage('Something went wrong. Please try again.', 'error');
            event.preventDefault(); // Prevent the default browser behavior
        });
    }
    
    handleError(errorInfo) {
        console.error('🚨 Error caught by boundary:', errorInfo);
        
        // Log error
        this.errors.push({
            ...errorInfo,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        
        // Determine error severity and response
        if (this.isCriticalError(errorInfo)) {
            this.showCriticalErrorFallback(errorInfo);
        } else {
            this.showErrorToast(errorInfo);
        }
        
        // Report error (in production, this would go to error tracking service)
        this.reportError(errorInfo);
    }
    
    isCriticalError(errorInfo) {
        const criticalPatterns = [
            /cannot read property/i,
            /is not a function/i,
            /script error/i,
            /loading/i,
            /network/i,
            /resetButtonStyle/i,
            /TypeError/i,
            /ReferenceError/i
        ];
        
        return criticalPatterns.some(pattern => 
            pattern.test(errorInfo.message || '')
        );
    }
    
    showErrorToast(errorInfo) {
        if (window.uiManager) {
            const message = this.getFriendlyErrorMessage(errorInfo);
            window.uiManager.showToast(message, 'error');
        }
    }
    
    showCriticalErrorFallback(errorInfo) {
        const errorContainer = document.getElementById('errorFallback');
        if (errorContainer) {
            errorContainer.innerHTML = this.generateErrorFallbackHTML(errorInfo);
            errorContainer.classList.remove('hidden');
        } else {
            // Create error container if it doesn't exist
            this.createErrorFallbackContainer(errorInfo);
        }
    }
    
    createErrorFallbackContainer(errorInfo) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'errorFallback';
        errorDiv.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm';
        errorDiv.innerHTML = this.generateErrorFallbackHTML(errorInfo);
        document.body.appendChild(errorDiv);
    }
    
    generateErrorFallbackHTML(errorInfo) {
        return `
            <div class="glass-effect rounded-2xl p-8 max-w-md mx-4 text-center">
                <div class="mb-6">
                    <i data-lucide="alert-triangle" class="w-16 h-16 mx-auto text-red-400 mb-4"></i>
                    <h2 class="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
                    <p class="text-white/80">
                        ${this.getFriendlyErrorMessage(errorInfo)}
                    </p>
                </div>
                
                <div class="space-y-3">
                    <button onclick="location.reload()" 
                            class="w-full bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        <i data-lucide="refresh-cw" class="w-4 h-4 inline mr-2"></i>
                        Reload App
                    </button>
                    
                    <button onclick="this.closest('#errorFallback').classList.add('hidden')" 
                            class="w-full bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        <i data-lucide="x" class="w-4 h-4 inline mr-2"></i>
                        Continue Anyway
                    </button>
                    
                    <details class="mt-4">
                        <summary class="text-white/60 text-sm cursor-pointer hover:text-white/80">
                            Technical Details
                        </summary>
                        <div class="mt-2 p-3 bg-black/30 rounded text-left text-xs text-white/70 font-mono">
                            Error: ${errorInfo.message}<br>
                            Type: ${errorInfo.type}<br>
                            Time: ${new Date().toLocaleString()}
                        </div>
                    </details>
                </div>
            </div>
        `;
    }
    
    getFriendlyErrorMessage(errorInfo) {
        const friendlyMessages = {
            'network': 'Network connection problem. Please check your internet.',
            'loading': 'Failed to load resources. Please reload the page.',
            'javascript': 'An unexpected error occurred. Please try again.',
            'promise': 'Something went wrong while processing. Please try again.'
        };
        
        return friendlyMessages[errorInfo.type] || 
               'An unexpected error occurred. Please try refreshing the page.';
    }
    
    reportError(errorInfo) {
        // In production, send to error tracking service
        try {
            // Store locally for now
            const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
            errorLog.push(errorInfo);
            
            // Keep only last 50 errors
            if (errorLog.length > 50) {
                errorLog.splice(0, errorLog.length - 50);
            }
            
            localStorage.setItem('errorLog', JSON.stringify(errorLog));
        } catch (e) {
            console.warn('Failed to log error:', e);
        }
    }
    
    showErrorMessage(message, type = 'error') {
        if (window.uiManager) {
            window.uiManager.showToast(message, type);
        } else {
            // Fallback notification
            console.error(message);
        }
    }
    
    // Recovery methods
    recoverFromError() {
        // Hide error fallback
        const errorContainer = document.getElementById('errorFallback');
        if (errorContainer) {
            errorContainer.classList.add('hidden');
        }
        
        // Reset app state if possible
        if (window.app && window.app.isInitialized) {
            try {
                window.app.showWelcomeScreen();
                this.showErrorMessage('Recovered successfully!', 'success');
            } catch (e) {
                console.error('Failed to recover:', e);
            }
        }
    }
    
    // Get error statistics
    getErrorStats() {
        return {
            totalErrors: this.errors.length,
            errorsByType: this.errors.reduce((acc, error) => {
                acc[error.type] = (acc[error.type] || 0) + 1;
                return acc;
            }, {}),
            recentErrors: this.errors.slice(-10)
        };
    }
    
    // Clear error log
    clearErrorLog() {
        this.errors = [];
        localStorage.removeItem('errorLog');
        console.log('🧹 Error log cleared');
    }
}

// Safe wrapper for functions
function safeExecute(fn, fallback = null, errorMessage = 'Operation failed') {
    try {
        return fn();
    } catch (error) {
        console.error(`${errorMessage}:`, error);
        if (window.errorBoundary) {
            window.errorBoundary.handleError({
                message: error.message,
                error: error,
                type: 'javascript'
            });
        }
        return fallback;
    }
}

// Safe async wrapper
async function safeExecuteAsync(fn, fallback = null, errorMessage = 'Async operation failed') {
    try {
        return await fn();
    } catch (error) {
        console.error(`${errorMessage}:`, error);
        if (window.errorBoundary) {
            window.errorBoundary.handleError({
                message: error.message,
                error: error,
                type: 'promise'
            });
        }
        return fallback;
    }
}

// Initialize Error Boundary immediately
if (!window.errorBoundary) {
    window.errorBoundary = new ErrorBoundary();
}

// Export for use in modules
window.ErrorBoundary = ErrorBoundary;
window.safeExecute = safeExecute;
window.safeExecuteAsync = safeExecuteAsync;

console.log('🛡️ Error Boundary system loaded');
