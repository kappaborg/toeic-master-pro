// Adaptive Learning Engine for WordMaster Pro
// Manages difficulty adaptation, spaced repetition, and personalized learning paths

class AdaptiveLearningEngine {
    constructor() {
        this.userProfile = {
            level: 'A1',
            strongAreas: [],
            weakAreas: [],
            learningSpeed: 'normal', // slow, normal, fast
            preferredGameModes: [],
            totalPlayTime: 0,
            lastSessionDate: null
        };
        
        this.difficultySettings = {
            easy: { timeBonus: 1.5, hintAvailable: true, optionsCount: 3 },
            normal: { timeBonus: 1.0, hintAvailable: true, optionsCount: 4 },
            hard: { timeBonus: 0.8, hintAvailable: false, optionsCount: 4 },
            expert: { timeBonus: 0.6, hintAvailable: false, optionsCount: 5 }
        };
        
        this.spaceRepetitionIntervals = [1, 3, 7, 14, 30, 90]; // days
        this.wordMastery = new Map(); // word -> { level, lastSeen, nextReview, attempts, successes }
        
        this.loadUserProfile();
        this.initializeSpacedRepetition();
    }
    
    // Adaptive Difficulty Management
    adaptDifficulty(gameMode, recentPerformance) {
        const accuracy = this.calculateAccuracy(recentPerformance);
        const responseTime = this.calculateAverageResponseTime(recentPerformance);
        
        let newDifficulty = this.getCurrentDifficulty(gameMode);
        
        // Increase difficulty if performing well
        if (accuracy > 0.85 && responseTime < 3000) {
            newDifficulty = this.increaseDifficulty(newDifficulty);
        }
        // Decrease difficulty if struggling
        else if (accuracy < 0.6 || responseTime > 8000) {
            newDifficulty = this.decreaseDifficulty(newDifficulty);
        }
        
        this.setDifficulty(gameMode, newDifficulty);
        return newDifficulty;
    }
    
    calculateAccuracy(recentPerformance) {
        if (!recentPerformance || recentPerformance.length === 0) return 0.7;
        
        const correct = recentPerformance.filter(p => p.isCorrect).length;
        return correct / recentPerformance.length;
    }
    
    calculateAverageResponseTime(recentPerformance) {
        if (!recentPerformance || recentPerformance.length === 0) return 5000;
        
        const totalTime = recentPerformance.reduce((sum, p) => sum + p.responseTime, 0);
        return totalTime / recentPerformance.length;
    }
    
    getCurrentDifficulty(gameMode) {
        return localStorage.getItem(`difficulty_${gameMode}`) || 'normal';
    }
    
    setDifficulty(gameMode, difficulty) {
        localStorage.setItem(`difficulty_${gameMode}`, difficulty);
    }
    
    increaseDifficulty(current) {
        const levels = ['easy', 'normal', 'hard', 'expert'];
        const index = levels.indexOf(current);
        return index < levels.length - 1 ? levels[index + 1] : current;
    }
    
    decreaseDifficulty(current) {
        const levels = ['easy', 'normal', 'hard', 'expert'];
        const index = levels.indexOf(current);
        return index > 0 ? levels[index - 1] : current;
    }
    
    // Spaced Repetition System
    initializeSpacedRepetition() {
        const stored = localStorage.getItem('wordMastery');
        if (stored) {
            const data = JSON.parse(stored);
            this.wordMastery = new Map(Object.entries(data));
        }
    }
    
    updateWordMastery(word, isCorrect, responseTime) {
        const now = Date.now();
        let wordData = this.wordMastery.get(word) || {
            level: 0,
            lastSeen: now,
            nextReview: now,
            attempts: 0,
            successes: 0,
            averageTime: responseTime
        };
        
        wordData.attempts++;
        wordData.lastSeen = now;
        wordData.averageTime = (wordData.averageTime + responseTime) / 2;
        
        if (isCorrect) {
            wordData.successes++;
            wordData.level = Math.min(wordData.level + 1, this.spaceRepetitionIntervals.length - 1);
        } else {
            wordData.level = Math.max(0, wordData.level - 1);
        }
        
        // Calculate next review date
        const intervalDays = this.spaceRepetitionIntervals[wordData.level];
        wordData.nextReview = now + (intervalDays * 24 * 60 * 60 * 1000);
        
        this.wordMastery.set(word, wordData);
        this.saveWordMastery();
        
        return wordData;
    }
    
    getWordsForReview() {
        const now = Date.now();
        const wordsForReview = [];
        
        for (const [word, data] of this.wordMastery.entries()) {
            if (data.nextReview <= now) {
                wordsForReview.push({
                    word,
                    priority: this.calculatePriority(data, now)
                });
            }
        }
        
        return wordsForReview.sort((a, b) => b.priority - a.priority);
    }
    
    calculatePriority(wordData, now) {
        const daysSinceReview = (now - wordData.nextReview) / (24 * 60 * 60 * 1000);
        const accuracyRate = wordData.successes / Math.max(wordData.attempts, 1);
        
        // Higher priority for overdue words and words with low accuracy
        return daysSinceReview * 10 + (1 - accuracyRate) * 5;
    }
    
    saveWordMastery() {
        const data = Object.fromEntries(this.wordMastery);
        localStorage.setItem('wordMastery', JSON.stringify(data));
    }
    
    // User Profile Management
    loadUserProfile() {
        const stored = localStorage.getItem('userProfile');
        if (stored) {
            this.userProfile = { ...this.userProfile, ...JSON.parse(stored) };
        }
    }
    
    saveUserProfile() {
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    }
    
    updateUserProfile(updates) {
        this.userProfile = { ...this.userProfile, ...updates };
        this.saveUserProfile();
    }
    
    // Learning Analytics
    generateLearningInsights() {
        const insights = {
            overallProgress: this.calculateOverallProgress(),
            strongestAreas: this.identifyStrongAreas(),
            areasForImprovement: this.identifyWeakAreas(),
            recommendedStudyTime: this.recommendStudyTime(),
            nextReviewWords: this.getWordsForReview().slice(0, 10),
            streakData: this.calculateStreak(),
            levelProgression: this.calculateLevelProgression()
        };
        
        return insights;
    }
    
    calculateOverallProgress() {
        const totalWords = this.wordMastery.size;
        const masteredWords = Array.from(this.wordMastery.values()).filter(
            data => data.level >= 3 && data.successes / data.attempts >= 0.8
        ).length;
        
        return {
            totalWords,
            masteredWords,
            percentage: totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0
        };
    }
    
    identifyStrongAreas() {
        // Implementation based on game mode performance
        return this.userProfile.strongAreas || [];
    }
    
    identifyWeakAreas() {
        // Implementation based on game mode performance
        return this.userProfile.weakAreas || [];
    }
    
    recommendStudyTime() {
        const reviewWords = this.getWordsForReview().length;
        const estimatedMinutes = Math.ceil(reviewWords * 0.5); // 30 seconds per word
        
        return {
            recommended: estimatedMinutes,
            wordsToReview: reviewWords,
            focus: reviewWords > 20 ? 'Review overdue words' : 'Learn new vocabulary'
        };
    }
    
    calculateStreak() {
        const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
        let currentStreak = 0;
        let longestStreak = 0;
        
        // Calculate based on daily sessions
        for (let i = sessions.length - 1; i >= 0; i--) {
            const sessionDate = new Date(sessions[i].date).toDateString();
            const expectedDate = new Date(Date.now() - (currentStreak * 24 * 60 * 60 * 1000)).toDateString();
            
            if (sessionDate === expectedDate) {
                currentStreak++;
            } else {
                break;
            }
        }
        
        longestStreak = Math.max(...sessions.map((_, index) => {
            let streak = 0;
            for (let j = index; j < sessions.length; j++) {
                if (new Date(sessions[j].date).toDateString() === 
                    new Date(sessions[index].date).getTime() + (streak * 24 * 60 * 60 * 1000)) {
                    streak++;
                } else {
                    break;
                }
            }
            return streak;
        }), currentStreak);
        
        return { currentStreak, longestStreak };
    }
    
    calculateLevelProgression() {
        const currentLevel = this.userProfile.level;
        const levels = ['A1', 'A2', 'B1', 'B2'];
        const currentIndex = levels.indexOf(currentLevel);
        
        const masteredWordsInLevel = Array.from(this.wordMastery.entries()).filter(
            ([word, data]) => {
                // Get word level from vocabulary database
                const wordLevel = this.getWordLevel(word);
                return wordLevel === currentLevel && data.level >= 3;
            }
        ).length;
        
        const totalWordsInLevel = this.getTotalWordsInLevel(currentLevel);
        const progressPercentage = Math.round((masteredWordsInLevel / totalWordsInLevel) * 100);
        
        return {
            currentLevel,
            nextLevel: currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null,
            progressPercentage,
            masteredWords: masteredWordsInLevel,
            totalWords: totalWordsInLevel
        };
    }
    
    getWordLevel(word) {
        // This should integrate with the main vocabulary database
        if (window.dataManager && window.dataManager.vocabulary) {
            const wordData = window.dataManager.vocabulary.get(word);
            return wordData ? wordData.level : 'A1';
        }
        return 'A1';
    }
    
    getTotalWordsInLevel(level) {
        if (window.dataManager && window.dataManager.vocabulary) {
            return Array.from(window.dataManager.vocabulary.values())
                .filter(word => word.level === level).length;
        }
        return 100; // fallback
    }
    
    // Session Management
    startSession() {
        this.sessionStartTime = Date.now();
    }
    
    endSession(gameResults) {
        if (!this.sessionStartTime) return;
        
        const sessionDuration = Date.now() - this.sessionStartTime;
        const sessionData = {
            date: new Date().toISOString(),
            duration: sessionDuration,
            results: gameResults,
            wordsStudied: gameResults.length,
            accuracy: this.calculateAccuracy(gameResults)
        };
        
        // Save session
        const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
        sessions.push(sessionData);
        localStorage.setItem('studySessions', JSON.stringify(sessions));
        
        // Update user profile
        this.userProfile.totalPlayTime += sessionDuration;
        this.userProfile.lastSessionDate = sessionData.date;
        this.saveUserProfile();
        
        // Adapt difficulty based on session performance
        const gameMode = gameResults[0]?.gameMode || 'general';
        this.adaptDifficulty(gameMode, gameResults);
    }
    
    // Recommendations
    generateRecommendations() {
        const insights = this.generateLearningInsights();
        const recommendations = [];
        
        if (insights.nextReviewWords.length > 10) {
            recommendations.push({
                type: 'review',
                priority: 'high',
                message: `You have ${insights.nextReviewWords.length} words ready for review. Focus on reviewing before learning new words.`,
                action: 'Start Review Session'
            });
        }
        
        if (insights.overallProgress.percentage < 50) {
            recommendations.push({
                type: 'practice',
                priority: 'medium',
                message: 'Increase your practice frequency to improve vocabulary retention.',
                action: 'Set Daily Goal'
            });
        }
        
        if (insights.areasForImprovement.length > 0) {
            recommendations.push({
                type: 'focus',
                priority: 'medium',
                message: `Focus on improving: ${insights.areasForImprovement.join(', ')}`,
                action: 'Practice Weak Areas'
            });
        }
        
        return recommendations;
    }
}

// Achievement System
class AchievementSystem {
    constructor() {
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.initializeAchievements();
        this.loadProgress();
    }
    
    initializeAchievements() {
        const achievements = [
            {
                id: 'first_steps',
                name: 'First Steps',
                description: 'Complete your first game session',
                icon: '🎯',
                category: 'milestone',
                requirement: { type: 'sessions', count: 1 }
            },
            {
                id: 'word_warrior',
                name: 'Word Warrior',
                description: 'Learn 50 new words',
                icon: '⚔️',
                category: 'vocabulary',
                requirement: { type: 'wordsLearned', count: 50 }
            },
            {
                id: 'speed_demon',
                name: 'Speed Demon',
                description: 'Answer 10 questions in under 2 seconds each',
                icon: '⚡',
                category: 'performance',
                requirement: { type: 'fastAnswers', count: 10, time: 2000 }
            },
            {
                id: 'perfectionist',
                name: 'Perfectionist',
                description: 'Get 100% accuracy in a 10-question session',
                icon: '💎',
                category: 'performance',
                requirement: { type: 'perfectSession', questions: 10 }
            },
            {
                id: 'streak_master',
                name: 'Streak Master',
                description: 'Maintain a 7-day study streak',
                icon: '🔥',
                category: 'consistency',
                requirement: { type: 'dailyStreak', days: 7 }
            },
            {
                id: 'game_explorer',
                name: 'Game Explorer',
                description: 'Try all available game modes',
                icon: '🗺️',
                category: 'exploration',
                requirement: { type: 'gameModesPlayed', count: 8 }
            },
            {
                id: 'time_master',
                name: 'Time Master',
                description: 'Complete Time Telling mode with 90% accuracy',
                icon: '⏰',
                category: 'mastery',
                requirement: { type: 'gameModeAccuracy', mode: 'timeTelling', accuracy: 0.9 }
            },
            {
                id: 'conversation_expert',
                name: 'Conversation Expert',
                description: 'Excel in Conversation Practice mode',
                icon: '💬',
                category: 'mastery',
                requirement: { type: 'gameModeAccuracy', mode: 'conversation', accuracy: 0.85 }
            }
        ];
        
        achievements.forEach(achievement => {
            this.achievements.set(achievement.id, achievement);
        });
    }
    
    loadProgress() {
        const unlocked = localStorage.getItem('unlockedAchievements');
        if (unlocked) {
            this.unlockedAchievements = new Set(JSON.parse(unlocked));
        }
    }
    
    saveProgress() {
        localStorage.setItem('unlockedAchievements', JSON.stringify([...this.unlockedAchievements]));
    }
    
    checkAchievements(sessionData, userStats) {
        const newAchievements = [];
        
        for (const [id, achievement] of this.achievements.entries()) {
            if (this.unlockedAchievements.has(id)) continue;
            
            if (this.checkRequirement(achievement.requirement, sessionData, userStats)) {
                this.unlockedAchievements.add(id);
                newAchievements.push(achievement);
            }
        }
        
        if (newAchievements.length > 0) {
            this.saveProgress();
        }
        
        return newAchievements;
    }
    
    checkRequirement(requirement, sessionData, userStats) {
        switch (requirement.type) {
            case 'sessions':
                return userStats.totalSessions >= requirement.count;
            
            case 'wordsLearned':
                return userStats.masteredWords >= requirement.count;
            
            case 'fastAnswers':
                const fastAnswers = sessionData.filter(result => 
                    result.responseTime < requirement.time
                );
                return fastAnswers.length >= requirement.count;
            
            case 'perfectSession':
                const accuracy = sessionData.filter(r => r.isCorrect).length / sessionData.length;
                return sessionData.length >= requirement.questions && accuracy === 1.0;
            
            case 'dailyStreak':
                return userStats.currentStreak >= requirement.days;
            
            case 'gameModesPlayed':
                return userStats.gameModesPlayed >= requirement.count;
            
            case 'gameModeAccuracy':
                const modeResults = sessionData.filter(r => r.gameMode === requirement.mode);
                if (modeResults.length === 0) return false;
                const modeAccuracy = modeResults.filter(r => r.isCorrect).length / modeResults.length;
                return modeAccuracy >= requirement.accuracy;
            
            default:
                return false;
        }
    }
    
    getProgress() {
        return {
            total: this.achievements.size,
            unlocked: this.unlockedAchievements.size,
            achievements: Array.from(this.achievements.values()).map(achievement => ({
                ...achievement,
                unlocked: this.unlockedAchievements.has(achievement.id)
            }))
        };
    }
}

// Global instances - Initialize only if not exists
if (!window.adaptiveLearning) {
    // Don't auto-initialize, let App handle it
    // window.adaptiveLearning = new AdaptiveLearningEngine();
}
if (!window.achievementSystem) {
    // window.achievementSystem = new AchievementSystem();
}

