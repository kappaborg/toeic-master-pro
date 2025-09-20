// WordMaster Pro - Spaced Repetition System
// Scientific algorithm for optimal memory retention

class SpacedRepetitionSystem {
    constructor() {
        this.wordSchedules = new Map(); // word -> schedule data
        this.reviewQueue = [];
        this.intervals = [1, 3, 7, 15, 30, 90]; // days
        this.easeFactor = 2.5;
        this.minEaseFactor = 1.3;
        this.maxEaseFactor = 4.0;
        
        this.loadSchedules();
        console.log('🧠 Spaced Repetition System initialized');
    }
    
    // Main SRS calculation based on SM-2 algorithm
    calculateNextReview(word, quality, previousInterval = 1, easeFactor = 2.5) {
        // Quality: 0=forgot, 1=hard, 2=good, 3=easy, 4=perfect
        
        let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        newEaseFactor = Math.max(this.minEaseFactor, Math.min(this.maxEaseFactor, newEaseFactor));
        
        let newInterval;
        
        if (quality < 2) {
            // Failed recall - reset to beginning
            newInterval = 1;
            newEaseFactor = Math.max(1.3, easeFactor - 0.2);
        } else {
            if (previousInterval === 1) {
                newInterval = 3;
            } else if (previousInterval === 3) {
                newInterval = 7;
            } else {
                newInterval = Math.round(previousInterval * newEaseFactor);
            }
        }
        
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
        
        return {
            interval: newInterval,
            easeFactor: newEaseFactor,
            nextReviewDate: nextReviewDate.toISOString(),
            lastReviewed: new Date().toISOString(),
            quality: quality,
            reviewCount: (this.wordSchedules.get(word)?.reviewCount || 0) + 1
        };
    }
    
    // Record a review session
    recordReview(word, isCorrect, responseTime = 0, difficulty = 'medium') {
        let quality;
        
        // Convert performance to quality score
        if (!isCorrect) {
            quality = 0; // Forgot
        } else {
            // Quality based on response time and difficulty
            if (responseTime < 2000) {
                quality = difficulty === 'easy' ? 4 : 3; // Perfect or Easy
            } else if (responseTime < 5000) {
                quality = 2; // Good
            } else {
                quality = 1; // Hard
            }
        }
        
        const currentSchedule = this.wordSchedules.get(word) || {
            interval: 1,
            easeFactor: 2.5,
            reviewCount: 0,
            successRate: 0,
            averageTime: 0
        };
        
        const newSchedule = this.calculateNextReview(
            word, 
            quality, 
            currentSchedule.interval, 
            currentSchedule.easeFactor
        );
        
        // Update statistics
        newSchedule.successRate = this.calculateSuccessRate(word, isCorrect);
        newSchedule.averageTime = this.calculateAverageTime(word, responseTime);
        newSchedule.difficulty = this.calculateWordDifficulty(word, quality);
        
        this.wordSchedules.set(word, newSchedule);
        this.saveSchedules();
        
        console.log(`📅 SRS: ${word} -> Next review in ${newSchedule.interval} days`);
        
        return newSchedule;
    }
    
    // Get words due for review
    getWordsForReview(limit = 20) {
        const now = new Date();
        const dueWords = [];
        
        for (const [word, schedule] of this.wordSchedules) {
            const reviewDate = new Date(schedule.nextReviewDate);
            if (reviewDate <= now) {
                dueWords.push({
                    word: word,
                    schedule: schedule,
                    priority: this.calculatePriority(schedule, now)
                });
            }
        }
        
        // Sort by priority (most urgent first)
        dueWords.sort((a, b) => b.priority - a.priority);
        
        return dueWords.slice(0, limit);
    }
    
    // Calculate word priority for review
    calculatePriority(schedule, now) {
        const reviewDate = new Date(schedule.nextReviewDate);
        const daysOverdue = Math.max(0, (now - reviewDate) / (1000 * 60 * 60 * 24));
        
        let priority = 100;
        
        // Overdue words get higher priority
        priority += daysOverdue * 10;
        
        // Difficult words get higher priority
        if (schedule.difficulty === 'hard') priority += 30;
        else if (schedule.difficulty === 'medium') priority += 10;
        
        // Low success rate words get higher priority
        if (schedule.successRate < 0.5) priority += 20;
        else if (schedule.successRate < 0.7) priority += 10;
        
        // New words (low review count) get medium priority
        if (schedule.reviewCount < 3) priority += 15;
        
        return priority;
    }
    
    // Calculate success rate for a word
    calculateSuccessRate(word, isCorrect) {
        const history = this.getWordHistory(word);
        history.push(isCorrect);
        
        // Keep last 20 attempts
        if (history.length > 20) {
            history.splice(0, history.length - 20);
        }
        
        this.saveWordHistory(word, history);
        
        const successes = history.filter(result => result).length;
        return successes / history.length;
    }
    
    // Calculate average response time
    calculateAverageTime(word, responseTime) {
        const times = this.getWordTimes(word);
        times.push(responseTime);
        
        // Keep last 10 times
        if (times.length > 10) {
            times.splice(0, times.length - 10);
        }
        
        this.saveWordTimes(word, times);
        
        return times.reduce((sum, time) => sum + time, 0) / times.length;
    }
    
    // Calculate word difficulty
    calculateWordDifficulty(word, quality) {
        const schedule = this.wordSchedules.get(word);
        
        if (!schedule) return 'medium';
        
        if (schedule.successRate < 0.5 || schedule.averageTime > 8000) {
            return 'hard';
        } else if (schedule.successRate > 0.8 && schedule.averageTime < 3000) {
            return 'easy';
        } else {
            return 'medium';
        }
    }
    
    // Get study statistics
    getStudyStatistics() {
        const now = new Date();
        let dueToday = 0;
        let dueThisWeek = 0;
        let totalWords = this.wordSchedules.size;
        let masteredWords = 0;
        let strugglingWords = 0;
        
        for (const [word, schedule] of this.wordSchedules) {
            const reviewDate = new Date(schedule.nextReviewDate);
            const daysDiff = (reviewDate - now) / (1000 * 60 * 60 * 24);
            
            if (daysDiff <= 0) dueToday++;
            if (daysDiff <= 7) dueThisWeek++;
            
            if (schedule.successRate > 0.8 && schedule.reviewCount > 5) {
                masteredWords++;
            } else if (schedule.successRate < 0.5) {
                strugglingWords++;
            }
        }
        
        return {
            totalWords,
            dueToday,
            dueThisWeek,
            masteredWords,
            strugglingWords,
            masteryRate: totalWords > 0 ? (masteredWords / totalWords) * 100 : 0
        };
    }
    
    // Storage methods
    loadSchedules() {
        try {
            const stored = localStorage.getItem('srs_schedules');
            if (stored) {
                const data = JSON.parse(stored);
                this.wordSchedules = new Map(Object.entries(data));
            }
        } catch (error) {
            console.warn('⚠️ Failed to load SRS schedules:', error);
        }
    }
    
    saveSchedules() {
        try {
            const data = Object.fromEntries(this.wordSchedules);
            localStorage.setItem('srs_schedules', JSON.stringify(data));
        } catch (error) {
            console.warn('⚠️ Failed to save SRS schedules:', error);
        }
    }
    
    getWordHistory(word) {
        try {
            const stored = localStorage.getItem(`srs_history_${word}`);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            return [];
        }
    }
    
    saveWordHistory(word, history) {
        try {
            localStorage.setItem(`srs_history_${word}`, JSON.stringify(history));
        } catch (error) {
            console.warn('⚠️ Failed to save word history:', error);
        }
    }
    
    getWordTimes(word) {
        try {
            const stored = localStorage.getItem(`srs_times_${word}`);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            return [];
        }
    }
    
    saveWordTimes(word, times) {
        try {
            localStorage.setItem(`srs_times_${word}`, JSON.stringify(times));
        } catch (error) {
            console.warn('⚠️ Failed to save word times:', error);
        }
    }
    
    // Reset all data (for testing)
    reset() {
        this.wordSchedules.clear();
        localStorage.removeItem('srs_schedules');
        console.log('🔄 SRS data reset');
    }
    
    // Export data for backup
    exportData() {
        const data = {
            schedules: Object.fromEntries(this.wordSchedules),
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        return JSON.stringify(data, null, 2);
    }
    
    // Import data from backup
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.wordSchedules = new Map(Object.entries(data.schedules));
            this.saveSchedules();
            console.log('✅ SRS data imported successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to import SRS data:', error);
            return false;
        }
    }
}

// Export for global use
window.SpacedRepetitionSystem = SpacedRepetitionSystem;
console.log('🧠 Spaced Repetition System loaded');
