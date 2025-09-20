/**
 * Advanced Analytics System
 * Tracks detailed learning metrics and provides insights
 */

class AdvancedAnalytics {
    constructor() {
        this.metrics = {
            totalSessions: 0,
            totalQuestions: 0,
            totalCorrectAnswers: 0,
            averageResponseTime: 0,
            learningStreak: 0,
            lastSessionDate: null,
            gameModeStats: {},
            vocabularyProgress: {},
            timeSpent: 0,
            performanceMetrics: {
                lcp: 0,
                fid: 0,
                cls: 0
            }
        };
        
        this.sessionStartTime = Date.now();
        this.questionStartTime = 0;
        this.responseTimes = [];
        
        this.initializeAnalytics();
    }
    
    initializeAnalytics() {
        // Load existing analytics data
        this.loadAnalyticsData();
        
        // Start session tracking
        this.startSession();
        
        // Set up performance monitoring
        this.setupPerformanceMonitoring();
        
        console.log('📊 Advanced Analytics initialized');
    }
    
    loadAnalyticsData() {
        try {
            const savedData = localStorage.getItem('advancedAnalytics');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                this.metrics = { ...this.metrics, ...parsed };
            }
        } catch (error) {
            console.error('Error loading analytics data:', error);
        }
    }
    
    saveAnalyticsData() {
        try {
            localStorage.setItem('advancedAnalytics', JSON.stringify(this.metrics));
        } catch (error) {
            console.error('Error saving analytics data:', error);
        }
    }
    
    startSession() {
        this.sessionStartTime = Date.now();
        this.metrics.totalSessions++;
        this.metrics.lastSessionDate = new Date().toISOString();
        
        // Check for learning streak
        this.updateLearningStreak();
        
        this.saveAnalyticsData();
    }
    
    endSession() {
        const sessionDuration = Date.now() - this.sessionStartTime;
        this.metrics.timeSpent += sessionDuration;
        
        this.saveAnalyticsData();
        
        console.log(`📊 Session ended. Duration: ${Math.round(sessionDuration / 1000)}s`);
    }
    
    recordQuestionStart(gameMode, questionData) {
        this.questionStartTime = Date.now();
        
        // Initialize game mode stats if not exists
        if (!this.metrics.gameModeStats[gameMode]) {
            this.metrics.gameModeStats[gameMode] = {
                totalQuestions: 0,
                correctAnswers: 0,
                averageResponseTime: 0,
                lastPlayed: null
            };
        }
        
        this.metrics.gameModeStats[gameMode].totalQuestions++;
        this.metrics.gameModeStats[gameMode].lastPlayed = new Date().toISOString();
        
        this.metrics.totalQuestions++;
    }
    
    recordAnswer(gameMode, isCorrect, word = null) {
        const responseTime = Date.now() - this.questionStartTime;
        this.responseTimes.push(responseTime);
        
        // Update game mode stats
        if (this.metrics.gameModeStats[gameMode]) {
            if (isCorrect) {
                this.metrics.gameModeStats[gameMode].correctAnswers++;
                this.metrics.totalCorrectAnswers++;
            }
            
            // Update average response time
            const totalResponseTime = this.metrics.gameModeStats[gameMode].averageResponseTime * 
                (this.metrics.gameModeStats[gameMode].totalQuestions - 1) + responseTime;
            this.metrics.gameModeStats[gameMode].averageResponseTime = 
                totalResponseTime / this.metrics.gameModeStats[gameMode].totalQuestions;
        }
        
        // Update overall average response time
        const totalResponseTime = this.metrics.averageResponseTime * (this.metrics.totalQuestions - 1) + responseTime;
        this.metrics.averageResponseTime = totalResponseTime / this.metrics.totalQuestions;
        
        // Track vocabulary progress
        if (word) {
            if (!this.metrics.vocabularyProgress[word]) {
                this.metrics.vocabularyProgress[word] = {
                    attempts: 0,
                    correct: 0,
                    lastSeen: null,
                    difficulty: 'unknown'
                };
            }
            
            this.metrics.vocabularyProgress[word].attempts++;
            this.metrics.vocabularyProgress[word].lastSeen = new Date().toISOString();
            
            if (isCorrect) {
                this.metrics.vocabularyProgress[word].correct++;
            }
        }
        
        this.saveAnalyticsData();
    }
    
    recordLearningEvent(eventType, data = {}) {
        const event = {
            type: eventType,
            timestamp: new Date().toISOString(),
            data: data
        };
        
        // Store recent events (keep last 100)
        if (!this.metrics.recentEvents) {
            this.metrics.recentEvents = [];
        }
        
        this.metrics.recentEvents.push(event);
        if (this.metrics.recentEvents.length > 100) {
            this.metrics.recentEvents = this.metrics.recentEvents.slice(-100);
        }
        
        this.saveAnalyticsData();
    }
    
    updateLearningStreak() {
        const today = new Date().toDateString();
        const lastSessionDate = this.metrics.lastSessionDate ? 
            new Date(this.metrics.lastSessionDate).toDateString() : null;
        
        if (lastSessionDate === today) {
            // Same day, maintain streak
            return;
        } else if (lastSessionDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
            // Consecutive day, increment streak
            this.metrics.learningStreak++;
        } else {
            // Streak broken, reset
            this.metrics.learningStreak = 1;
        }
    }
    
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // LCP (Largest Contentful Paint)
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.performanceMetrics.lcp = lastEntry.startTime;
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // FID (First Input Delay)
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    this.metrics.performanceMetrics.fid = entry.processingStart - entry.startTime;
                });
            }).observe({ entryTypes: ['first-input'] });
            
            // CLS (Cumulative Layout Shift)
            new PerformanceObserver((list) => {
                let clsValue = 0;
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.metrics.performanceMetrics.cls = clsValue;
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    getAnalyticsReport() {
        const accuracy = this.metrics.totalQuestions > 0 ? 
            (this.metrics.totalCorrectAnswers / this.metrics.totalQuestions) * 100 : 0;
        
        const averageSessionTime = this.metrics.totalSessions > 0 ? 
            this.metrics.timeSpent / this.metrics.totalSessions : 0;
        
        return {
            overview: {
                totalSessions: this.metrics.totalSessions,
                totalQuestions: this.metrics.totalQuestions,
                accuracy: Math.round(accuracy * 100) / 100,
                averageResponseTime: Math.round(this.metrics.averageResponseTime),
                learningStreak: this.metrics.learningStreak,
                averageSessionTime: Math.round(averageSessionTime / 1000),
                totalTimeSpent: Math.round(this.metrics.timeSpent / 1000)
            },
            gameModeStats: this.metrics.gameModeStats,
            vocabularyProgress: this.metrics.vocabularyProgress,
            performanceMetrics: this.metrics.performanceMetrics,
            recentEvents: this.metrics.recentEvents || []
        };
    }
    
    getWeakestWords(limit = 10) {
        const words = Object.entries(this.metrics.vocabularyProgress)
            .filter(([word, data]) => data.attempts >= 3)
            .map(([word, data]) => ({
                word,
                accuracy: (data.correct / data.attempts) * 100,
                attempts: data.attempts,
                lastSeen: data.lastSeen
            }))
            .sort((a, b) => a.accuracy - b.accuracy)
            .slice(0, limit);
        
        return words;
    }
    
    getStrongestWords(limit = 10) {
        const words = Object.entries(this.metrics.vocabularyProgress)
            .filter(([word, data]) => data.attempts >= 3)
            .map(([word, data]) => ({
                word,
                accuracy: (data.correct / data.attempts) * 100,
                attempts: data.attempts,
                lastSeen: data.lastSeen
            }))
            .sort((a, b) => b.accuracy - a.accuracy)
            .slice(0, limit);
        
        return words;
    }
    
    exportData() {
        return {
            metrics: this.metrics,
            report: this.getAnalyticsReport(),
            exportDate: new Date().toISOString()
        };
    }
    
    resetAnalytics() {
        this.metrics = {
            totalSessions: 0,
            totalQuestions: 0,
            totalCorrectAnswers: 0,
            averageResponseTime: 0,
            learningStreak: 0,
            lastSessionDate: null,
            gameModeStats: {},
            vocabularyProgress: {},
            timeSpent: 0,
            performanceMetrics: {
                lcp: 0,
                fid: 0,
                cls: 0
            }
        };
        
        localStorage.removeItem('advancedAnalytics');
        console.log('📊 Analytics data reset');
    }
}

// Global instance
window.advancedAnalytics = new AdvancedAnalytics();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAnalytics;
}
