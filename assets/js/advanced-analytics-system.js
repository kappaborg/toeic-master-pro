/**
 * Advanced Analytics System for TOEIC Master Pro
 * Comprehensive user behavior tracking, performance analysis, and learning insights
 */

class AdvancedAnalyticsSystem {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        this.userId = this.generateUserId();
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        
        // Analytics data storage
        this.userBehavior = {
            sessions: [],
            interactions: [],
            learningPatterns: [],
            performanceMetrics: [],
            errors: [],
            preferences: {}
        };
        
        // Performance tracking
        this.performanceMetrics = {
            pageLoadTime: 0,
            interactionLatency: [],
            memoryUsage: [],
            networkLatency: [],
            errorRate: 0,
            userEngagement: 0
        };
        
        // Learning analytics
        this.learningAnalytics = {
            vocabularyProgress: [],
            readingProgress: [],
            listeningProgress: [],
            testScores: [],
            studyTime: [],
            weakAreas: [],
            strongAreas: [],
            learningVelocity: 0,
            retentionRate: 0
        };
        
        // Real-time tracking
        this.realTimeData = {
            currentActivity: null,
            activeTime: 0,
            lastInteraction: Date.now(),
            focusTime: 0,
            distractionEvents: []
        };
        
        console.log(`📊 Advanced Analytics System v${this.version} initialized`);
    }
    
    /**
     * Initialize the analytics system
     */
    async init() {
        try {
            // Load existing user data
            await this.loadUserData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start performance monitoring
            this.startPerformanceMonitoring();
            
            // Start real-time tracking
            this.startRealTimeTracking();
            
            // Initialize data collection
            this.initializeDataCollection();
            
            this.isInitialized = true;
            console.log('✅ Advanced Analytics System initialized successfully');
            
            // Track initialization
            this.trackEvent('system', 'analytics_initialized', {
                version: this.version,
                timestamp: Date.now()
            });
            
        } catch (error) {
            console.error('❌ Failed to initialize Advanced Analytics System:', error);
            this.trackError('analytics_init_error', error);
        }
    }
    
    /**
     * Generate unique user ID
     */
    generateUserId() {
        let userId = localStorage.getItem('toeic_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('toeic_user_id', userId);
        }
        return userId;
    }
    
    /**
     * Generate session ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Load existing user data
     */
    async loadUserData() {
        try {
            const storedData = localStorage.getItem('toeic_analytics_data');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                this.userBehavior = { ...this.userBehavior, ...parsedData };
            }
            
            // Load performance metrics
            const storedMetrics = localStorage.getItem('toeic_performance_metrics');
            if (storedMetrics) {
                const parsedMetrics = JSON.parse(storedMetrics);
                this.performanceMetrics = { ...this.performanceMetrics, ...parsedMetrics };
            }
            
            // Load learning analytics
            const storedLearning = localStorage.getItem('toeic_learning_analytics');
            if (storedLearning) {
                const parsedLearning = JSON.parse(storedLearning);
                this.learningAnalytics = { ...this.learningAnalytics, ...parsedLearning };
            }
            
        } catch (error) {
            console.error('❌ Failed to load user data:', error);
        }
    }
    
    /**
     * Save user data to localStorage
     */
    async saveUserData() {
        try {
            localStorage.setItem('toeic_analytics_data', JSON.stringify(this.userBehavior));
            localStorage.setItem('toeic_performance_metrics', JSON.stringify(this.performanceMetrics));
            localStorage.setItem('toeic_learning_analytics', JSON.stringify(this.learningAnalytics));
        } catch (error) {
            console.error('❌ Failed to save user data:', error);
        }
    }
    
    /**
     * Setup event listeners for user behavior tracking
     */
    setupEventListeners() {
        // Page visibility tracking
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('user', 'page_hidden', { timestamp: Date.now() });
            } else {
                this.trackEvent('user', 'page_visible', { timestamp: Date.now() });
            }
        });
        
        // Click tracking
        document.addEventListener('click', (event) => {
            this.trackInteraction('click', {
                element: event.target.tagName,
                id: event.target.id,
                className: event.target.className,
                text: event.target.textContent?.substring(0, 50),
                timestamp: Date.now()
            });
        });
        
        // Scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackInteraction('scroll', {
                    scrollY: window.scrollY,
                    scrollX: window.scrollX,
                    timestamp: Date.now()
                });
            }, 100);
        });
        
        // Keyboard tracking
        document.addEventListener('keydown', (event) => {
            this.trackInteraction('keydown', {
                key: event.key,
                code: event.code,
                timestamp: Date.now()
            });
        });
        
        // Focus tracking
        document.addEventListener('focusin', (event) => {
            this.trackInteraction('focus', {
                element: event.target.tagName,
                id: event.target.id,
                timestamp: Date.now()
            });
        });
        
        // Before unload tracking
        window.addEventListener('beforeunload', () => {
            this.trackEvent('user', 'session_end', {
                sessionDuration: Date.now() - this.startTime,
                timestamp: Date.now()
            });
            this.saveUserData();
        });
    }
    
    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        // Page load time
        window.addEventListener('load', () => {
            this.performanceMetrics.pageLoadTime = performance.now();
            this.trackEvent('performance', 'page_load', {
                loadTime: this.performanceMetrics.pageLoadTime,
                timestamp: Date.now()
            });
        });
        
        // Memory usage monitoring
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.performanceMetrics.memoryUsage.push({
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit,
                    timestamp: Date.now()
                });
                
                // Keep only last 100 entries
                if (this.performanceMetrics.memoryUsage.length > 100) {
                    this.performanceMetrics.memoryUsage.shift();
                }
            }, 5000);
        }
        
        // Network latency monitoring
        setInterval(() => {
            this.measureNetworkLatency();
        }, 10000);
    }
    
    /**
     * Start real-time tracking
     */
    startRealTimeTracking() {
        setInterval(() => {
            this.updateRealTimeData();
        }, 1000);
    }
    
    /**
     * Initialize data collection
     */
    initializeDataCollection() {
        // Track session start
        this.trackEvent('user', 'session_start', {
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        });
    }
    
    /**
     * Track user events
     */
    trackEvent(category, action, data = {}) {
        const event = {
            category,
            action,
            data,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId
        };
        
        this.userBehavior.interactions.push(event);
        
        // Keep only last 1000 events
        if (this.userBehavior.interactions.length > 1000) {
            this.userBehavior.interactions.shift();
        }
        
        console.log(`📊 Event tracked: ${category}.${action}`, data);
    }
    
    /**
     * Track user interactions
     */
    trackInteraction(type, data) {
        this.realTimeData.lastInteraction = Date.now();
        
        const interaction = {
            type,
            data,
            timestamp: Date.now(),
            sessionId: this.sessionId
        };
        
        this.userBehavior.interactions.push(interaction);
        
        // Update active time
        this.realTimeData.activeTime += 1;
    }
    
    /**
     * Track learning progress
     */
    trackLearningProgress(module, data) {
        const progress = {
            module,
            data,
            timestamp: Date.now(),
            sessionId: this.sessionId
        };
        
        this.learningAnalytics[`${module}Progress`].push(progress);
        
        // Keep only last 500 entries per module
        if (this.learningAnalytics[`${module}Progress`].length > 500) {
            this.learningAnalytics[`${module}Progress`].shift();
        }
        
        // Update learning velocity
        this.updateLearningVelocity();
        
        console.log(`📚 Learning progress tracked: ${module}`, data);
    }
    
    /**
     * Track test scores
     */
    trackTestScore(testType, score, details = {}) {
        const testResult = {
            testType,
            score,
            details,
            timestamp: Date.now(),
            sessionId: this.sessionId
        };
        
        this.learningAnalytics.testScores.push(testResult);
        
        // Keep only last 100 test scores
        if (this.learningAnalytics.testScores.length > 100) {
            this.learningAnalytics.testScores.shift();
        }
        
        // Update performance metrics
        this.updatePerformanceMetrics();
        
        console.log(`🎯 Test score tracked: ${testType} - ${score}`, details);
    }
    
    /**
     * Track errors
     */
    trackError(errorType, error, context = {}) {
        const errorData = {
            type: errorType,
            message: error.message || error,
            stack: error.stack,
            context,
            timestamp: Date.now(),
            sessionId: this.sessionId
        };
        
        this.userBehavior.errors.push(errorData);
        
        // Update error rate
        this.performanceMetrics.errorRate = this.userBehavior.errors.length / 
            (this.userBehavior.interactions.length || 1);
        
        console.error(`❌ Error tracked: ${errorType}`, error);
    }
    
    /**
     * Update real-time data
     */
    updateRealTimeData() {
        const now = Date.now();
        const timeSinceLastInteraction = now - this.realTimeData.lastInteraction;
        
        // Track focus time
        if (timeSinceLastInteraction < 5000) { // 5 seconds
            this.realTimeData.focusTime += 1;
        } else {
            this.realTimeData.distractionEvents.push({
                timestamp: now,
                duration: timeSinceLastInteraction
            });
        }
        
        // Update user engagement
        this.performanceMetrics.userEngagement = 
            this.realTimeData.focusTime / (this.realTimeData.focusTime + this.realTimeData.distractionEvents.length);
    }
    
    /**
     * Update learning velocity
     */
    updateLearningVelocity() {
        const recentProgress = this.learningAnalytics.vocabularyProgress.slice(-10);
        if (recentProgress.length > 1) {
            const timeDiff = recentProgress[recentProgress.length - 1].timestamp - recentProgress[0].timestamp;
            const progressDiff = recentProgress.length;
            this.learningAnalytics.learningVelocity = progressDiff / (timeDiff / 1000 / 60); // per minute
        }
    }
    
    /**
     * Update performance metrics
     */
    updatePerformanceMetrics() {
        // Calculate average test score
        if (this.learningAnalytics.testScores.length > 0) {
            const avgScore = this.learningAnalytics.testScores.reduce((sum, test) => sum + test.score, 0) / 
                this.learningAnalytics.testScores.length;
            
            // Update retention rate based on score improvement
            if (this.learningAnalytics.testScores.length > 1) {
                const firstScore = this.learningAnalytics.testScores[0].score;
                const lastScore = this.learningAnalytics.testScores[this.learningAnalytics.testScores.length - 1].score;
                this.learningAnalytics.retentionRate = (lastScore - firstScore) / firstScore;
            }
        }
    }
    
    /**
     * Measure network latency
     */
    measureNetworkLatency() {
        const start = Date.now();
        fetch('/api/ping', { method: 'HEAD' })
            .then(() => {
                const latency = Date.now() - start;
                this.performanceMetrics.networkLatency.push({
                    latency,
                    timestamp: Date.now()
                });
                
                // Keep only last 50 entries
                if (this.performanceMetrics.networkLatency.length > 50) {
                    this.performanceMetrics.networkLatency.shift();
                }
            })
            .catch(() => {
                // Fallback: measure local performance
                const latency = Date.now() - start;
                this.performanceMetrics.networkLatency.push({
                    latency,
                    timestamp: Date.now()
                });
            });
    }
    
    /**
     * Get comprehensive analytics report
     */
    getAnalyticsReport() {
        return {
            user: {
                userId: this.userId,
                sessionId: this.sessionId,
                totalSessions: this.userBehavior.sessions.length,
                totalInteractions: this.userBehavior.interactions.length,
                totalErrors: this.userBehavior.errors.length
            },
            performance: {
                pageLoadTime: this.performanceMetrics.pageLoadTime,
                averageMemoryUsage: this.getAverageMemoryUsage(),
                averageNetworkLatency: this.getAverageNetworkLatency(),
                errorRate: this.performanceMetrics.errorRate,
                userEngagement: this.performanceMetrics.userEngagement
            },
            learning: {
                vocabularyProgress: this.learningAnalytics.vocabularyProgress.length,
                readingProgress: this.learningAnalytics.readingProgress.length,
                listeningProgress: this.learningAnalytics.listeningProgress.length,
                testScores: this.learningAnalytics.testScores.length,
                averageTestScore: this.getAverageTestScore(),
                learningVelocity: this.learningAnalytics.learningVelocity,
                retentionRate: this.learningAnalytics.retentionRate
            },
            realTime: {
                currentActivity: this.realTimeData.currentActivity,
                activeTime: this.realTimeData.activeTime,
                focusTime: this.realTimeData.focusTime,
                distractionEvents: this.realTimeData.distractionEvents.length
            }
        };
    }
    
    /**
     * Get average memory usage
     */
    getAverageMemoryUsage() {
        if (this.performanceMetrics.memoryUsage.length === 0) return 0;
        
        const total = this.performanceMetrics.memoryUsage.reduce((sum, entry) => sum + entry.used, 0);
        return total / this.performanceMetrics.memoryUsage.length;
    }
    
    /**
     * Get average network latency
     */
    getAverageNetworkLatency() {
        if (this.performanceMetrics.networkLatency.length === 0) return 0;
        
        const total = this.performanceMetrics.networkLatency.reduce((sum, entry) => sum + entry.latency, 0);
        return total / this.performanceMetrics.networkLatency.length;
    }
    
    /**
     * Get average test score
     */
    getAverageTestScore() {
        if (this.learningAnalytics.testScores.length === 0) return 0;
        
        const total = this.learningAnalytics.testScores.reduce((sum, test) => sum + test.score, 0);
        return total / this.learningAnalytics.testScores.length;
    }
    
    /**
     * Get learning insights
     */
    getLearningInsights() {
        const insights = {
            strengths: this.identifyStrengths(),
            weaknesses: this.identifyWeaknesses(),
            recommendations: this.generateRecommendations(),
            progressTrend: this.analyzeProgressTrend(),
            studyPatterns: this.analyzeStudyPatterns()
        };
        
        return insights;
    }
    
    /**
     * Identify user strengths
     */
    identifyStrengths() {
        const strengths = [];
        
        // Analyze test scores by module
        const moduleScores = this.analyzeModuleScores();
        for (const [module, score] of Object.entries(moduleScores)) {
            if (score > 80) {
                strengths.push({
                    module,
                    score,
                    description: `Strong performance in ${module}`
                });
            }
        }
        
        return strengths;
    }
    
    /**
     * Identify user weaknesses
     */
    identifyWeaknesses() {
        const weaknesses = [];
        
        // Analyze test scores by module
        const moduleScores = this.analyzeModuleScores();
        for (const [module, score] of Object.entries(moduleScores)) {
            if (score < 60) {
                weaknesses.push({
                    module,
                    score,
                    description: `Needs improvement in ${module}`
                });
            }
        }
        
        return weaknesses;
    }
    
    /**
     * Generate recommendations
     */
    generateRecommendations() {
        const recommendations = [];
        const insights = this.getLearningInsights();
        
        // Based on weaknesses
        insights.weaknesses.forEach(weakness => {
            recommendations.push({
                type: 'improvement',
                module: weakness.module,
                action: `Focus more on ${weakness.module} practice`,
                priority: 'high'
            });
        });
        
        // Based on study patterns
        if (this.learningAnalytics.learningVelocity < 0.5) {
            recommendations.push({
                type: 'study_habit',
                action: 'Increase study frequency for better retention',
                priority: 'medium'
            });
        }
        
        return recommendations;
    }
    
    /**
     * Analyze progress trend
     */
    analyzeProgressTrend() {
        if (this.learningAnalytics.testScores.length < 2) {
            return { trend: 'insufficient_data', change: 0 };
        }
        
        const scores = this.learningAnalytics.testScores.map(test => test.score);
        const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
        const secondHalf = scores.slice(Math.floor(scores.length / 2));
        
        const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
        
        const change = ((secondAvg - firstAvg) / firstAvg) * 100;
        
        let trend = 'stable';
        if (change > 10) trend = 'improving';
        else if (change < -10) trend = 'declining';
        
        return { trend, change: Math.round(change) };
    }
    
    /**
     * Analyze study patterns
     */
    analyzeStudyPatterns() {
        const patterns = {
            mostActiveTime: this.getMostActiveTime(),
            averageSessionLength: this.getAverageSessionLength(),
            studyFrequency: this.getStudyFrequency(),
            preferredModules: this.getPreferredModules()
        };
        
        return patterns;
    }
    
    /**
     * Analyze module scores
     */
    analyzeModuleScores() {
        const moduleScores = {};
        
        this.learningAnalytics.testScores.forEach(test => {
            if (!moduleScores[test.testType]) {
                moduleScores[test.testType] = [];
            }
            moduleScores[test.testType].push(test.score);
        });
        
        const averages = {};
        for (const [module, scores] of Object.entries(moduleScores)) {
            averages[module] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        }
        
        return averages;
    }
    
    /**
     * Get most active time
     */
    getMostActiveTime() {
        const hourCounts = {};
        
        this.userBehavior.interactions.forEach(interaction => {
            const hour = new Date(interaction.timestamp).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        
        const mostActiveHour = Object.keys(hourCounts).reduce((a, b) => 
            hourCounts[a] > hourCounts[b] ? a : b
        );
        
        return mostActiveHour ? `${mostActiveHour}:00` : 'Unknown';
    }
    
    /**
     * Get average session length
     */
    getAverageSessionLength() {
        if (this.userBehavior.sessions.length === 0) return 0;
        
        const totalLength = this.userBehavior.sessions.reduce((sum, session) => 
            sum + (session.endTime - session.startTime), 0
        );
        
        return totalLength / this.userBehavior.sessions.length;
    }
    
    /**
     * Get study frequency
     */
    getStudyFrequency() {
        const studyDays = new Set();
        
        this.userBehavior.interactions.forEach(interaction => {
            const date = new Date(interaction.timestamp).toDateString();
            studyDays.add(date);
        });
        
        return studyDays.size;
    }
    
    /**
     * Get preferred modules
     */
    getPreferredModules() {
        const moduleCounts = {};
        
        this.userBehavior.interactions.forEach(interaction => {
            if (interaction.data && interaction.data.module) {
                const module = interaction.data.module;
                moduleCounts[module] = (moduleCounts[module] || 0) + 1;
            }
        });
        
        return Object.keys(moduleCounts).sort((a, b) => moduleCounts[b] - moduleCounts[a]);
    }
    
    /**
     * Export analytics data
     */
    exportAnalyticsData() {
        const data = {
            userBehavior: this.userBehavior,
            performanceMetrics: this.performanceMetrics,
            learningAnalytics: this.learningAnalytics,
            realTimeData: this.realTimeData,
            report: this.getAnalyticsReport(),
            insights: this.getLearningInsights(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `toeic_analytics_${this.userId}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * Clear analytics data
     */
    clearAnalyticsData() {
        this.userBehavior = {
            sessions: [],
            interactions: [],
            learningPatterns: [],
            performanceMetrics: [],
            errors: [],
            preferences: {}
        };
        
        this.performanceMetrics = {
            pageLoadTime: 0,
            interactionLatency: [],
            memoryUsage: [],
            networkLatency: [],
            errorRate: 0,
            userEngagement: 0
        };
        
        this.learningAnalytics = {
            vocabularyProgress: [],
            readingProgress: [],
            listeningProgress: [],
            testScores: [],
            studyTime: [],
            weakAreas: [],
            strongAreas: [],
            learningVelocity: 0,
            retentionRate: 0
        };
        
        this.saveUserData();
        console.log('🗑️ Analytics data cleared');
    }
}

// Export to global scope
window.AdvancedAnalyticsSystem = AdvancedAnalyticsSystem;

// Initialize analytics system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (!window.advancedAnalytics) {
        window.advancedAnalytics = new AdvancedAnalyticsSystem();
        window.advancedAnalytics.init();
    }
});

console.log('📊 Advanced Analytics System loaded');


