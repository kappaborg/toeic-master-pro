/**
 * Enhanced Progress Tracking System
 * Advanced progress monitoring with detailed insights
 */

class EnhancedProgress {
    constructor() {
        this.progressData = {
            currentLevel: 1,
            totalXP: 0,
            currentXP: 0,
            xpToNextLevel: 100,
            dailyGoal: 100,
            weeklyGoal: 500,
            monthlyGoal: 2000,
            achievements: [],
            milestones: [],
            learningPath: [],
            skillProgress: {},
            timeTracking: {
                daily: 0,
                weekly: 0,
                monthly: 0,
                total: 0
            },
            streakData: {
                current: 0,
                longest: 0,
                lastActivity: null
            }
        };
        
        this.initializeProgress();
    }
    
    initializeProgress() {
        this.loadProgressData();
        this.updateStreak();
        this.calculateLevel();
        this.saveProgressData();
        
        console.log('📈 Enhanced Progress initialized');
    }
    
    loadProgressData() {
        try {
            const savedData = localStorage.getItem('enhancedProgress');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                this.progressData = { ...this.progressData, ...parsed };
            }
        } catch (error) {
            console.error('Error loading progress data:', error);
        }
    }
    
    saveProgressData() {
        try {
            localStorage.setItem('enhancedProgress', JSON.stringify(this.progressData));
        } catch (error) {
            console.error('Error saving progress data:', error);
        }
    }
    
    addXP(amount, source = 'general') {
        this.progressData.totalXP += amount;
        this.progressData.currentXP += amount;
        
        // Check for level up
        const leveledUp = this.checkLevelUp();
        
        // Update time tracking
        this.updateTimeTracking();
        
        // Check achievements
        this.checkAchievements();
        
        // Update streak
        this.updateStreak();
        
        this.saveProgressData();
        
        if (leveledUp) {
            this.triggerLevelUp();
        }
        
        return {
            leveledUp,
            newLevel: this.progressData.currentLevel,
            totalXP: this.progressData.totalXP,
            currentXP: this.progressData.currentXP,
            xpToNextLevel: this.progressData.xpToNextLevel
        };
    }
    
    calculateLevel() {
        const xp = this.progressData.totalXP;
        let level = 1;
        let xpForLevel = 100;
        let totalXPNeeded = 0;
        
        while (totalXPNeeded + xpForLevel <= xp) {
            totalXPNeeded += xpForLevel;
            level++;
            xpForLevel = Math.floor(xpForLevel * 1.2); // 20% increase per level
        }
        
        this.progressData.currentLevel = level;
        this.progressData.currentXP = xp - totalXPNeeded;
        this.progressData.xpToNextLevel = xpForLevel;
    }
    
    checkLevelUp() {
        const oldLevel = this.progressData.currentLevel;
        this.calculateLevel();
        return this.progressData.currentLevel > oldLevel;
    }
    
    triggerLevelUp() {
        const level = this.progressData.currentLevel;
        
        // Add milestone
        this.addMilestone(`Reached Level ${level}`, 'level_up', {
            level: level,
            totalXP: this.progressData.totalXP
        });
        
        // Trigger level up event
        if (window.gameEngine && window.gameEngine.showNotification) {
            window.gameEngine.showNotification(
                `🎉 Level Up! You're now Level ${level}!`,
                'success',
                5000
            );
        }
        
        // Play level up sound
        if (window.audioSystem) {
            window.audioSystem.playSound('level_up');
        }
        
        console.log(`🎉 Level up! New level: ${level}`);
    }
    
    updateStreak() {
        const today = new Date().toDateString();
        const lastActivity = this.progressData.streakData.lastActivity;
        
        if (lastActivity === today) {
            // Already counted today
            return;
        }
        
        if (lastActivity === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
            // Consecutive day
            this.progressData.streakData.current++;
        } else if (lastActivity && lastActivity !== today) {
            // Streak broken
            this.progressData.streakData.current = 1;
        } else {
            // First day
            this.progressData.streakData.current = 1;
        }
        
        this.progressData.streakData.lastActivity = today;
        
        // Update longest streak
        if (this.progressData.streakData.current > this.progressData.streakData.longest) {
            this.progressData.streakData.longest = this.progressData.streakData.current;
        }
    }
    
    updateTimeTracking() {
        const today = new Date().toDateString();

        // Compute period starts from fresh Date objects to avoid mutation bugs
        const weekStartDate = new Date();
        weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
        const weekStart = weekStartDate.toDateString();

        const monthNow = new Date();
        const monthStart = new Date(monthNow.getFullYear(), monthNow.getMonth(), 1).toDateString();

        const tracking = this.progressData.timeTracking;

        // Reset counters when a new period starts
        if (tracking.lastDailyReset !== today) {
            tracking.daily = 0;
            tracking.lastDailyReset = today;
        }
        if (tracking.lastWeeklyReset !== weekStart) {
            tracking.weekly = 0;
            tracking.lastWeeklyReset = weekStart;
        }
        if (tracking.lastMonthlyReset !== monthStart) {
            tracking.monthly = 0;
            tracking.lastMonthlyReset = monthStart;
        }

        // Update daily time (increment by 1 minute for each question)
        tracking.daily += 1;
        tracking.weekly += 1;
        tracking.monthly += 1;
        tracking.total += 1;
    }
    
    checkAchievements() {
        const achievements = [
            {
                id: 'first_question',
                name: 'First Steps',
                description: 'Answer your first question',
                condition: () => this.progressData.totalXP >= 10,
                reward: 50
            },
            {
                id: 'level_5',
                name: 'Rising Star',
                description: 'Reach level 5',
                condition: () => this.progressData.currentLevel >= 5,
                reward: 100
            },
            {
                id: 'level_10',
                name: 'Language Learner',
                description: 'Reach level 10',
                condition: () => this.progressData.currentLevel >= 10,
                reward: 200
            },
            {
                id: 'streak_7',
                name: 'Week Warrior',
                description: 'Maintain a 7-day learning streak',
                condition: () => this.progressData.streakData.current >= 7,
                reward: 150
            },
            {
                id: 'streak_30',
                name: 'Month Master',
                description: 'Maintain a 30-day learning streak',
                condition: () => this.progressData.streakData.current >= 30,
                reward: 500
            },
            {
                id: 'xp_1000',
                name: 'XP Collector',
                description: 'Earn 1000 XP',
                condition: () => this.progressData.totalXP >= 1000,
                reward: 100
            },
            {
                id: 'xp_5000',
                name: 'XP Master',
                description: 'Earn 5000 XP',
                condition: () => this.progressData.totalXP >= 5000,
                reward: 300
            }
        ];
        
        achievements.forEach(achievement => {
            if (!this.progressData.achievements.includes(achievement.id) && 
                achievement.condition()) {
                this.unlockAchievement(achievement);
            }
        });
    }
    
    unlockAchievement(achievement) {
        this.progressData.achievements.push(achievement.id);
        
        // Add XP reward
        this.addXP(achievement.reward, 'achievement');
        
        // Add milestone
        this.addMilestone(achievement.name, 'achievement', {
            description: achievement.description,
            reward: achievement.reward
        });
        
        // Show notification
        if (window.gameEngine && window.gameEngine.showNotification) {
            window.gameEngine.showNotification(
                `🏆 Achievement Unlocked: ${achievement.name}`,
                'success',
                5000
            );
        }
        
        console.log(`🏆 Achievement unlocked: ${achievement.name}`);
    }
    
    addMilestone(title, type, data = {}) {
        const milestone = {
            id: Date.now().toString(),
            title,
            type,
            data,
            timestamp: new Date().toISOString()
        };
        
        this.progressData.milestones.push(milestone);
        
        // Keep only last 50 milestones
        if (this.progressData.milestones.length > 50) {
            this.progressData.milestones = this.progressData.milestones.slice(-50);
        }
    }
    
    updateSkillProgress(skill, progress) {
        if (!this.progressData.skillProgress[skill]) {
            this.progressData.skillProgress[skill] = {
                level: 1,
                xp: 0,
                totalXP: 0
            };
        }
        
        this.progressData.skillProgress[skill].xp += progress;
        this.progressData.skillProgress[skill].totalXP += progress;
        
        // Check for skill level up
        const skillLevel = Math.floor(this.progressData.skillProgress[skill].totalXP / 100) + 1;
        if (skillLevel > this.progressData.skillProgress[skill].level) {
            this.progressData.skillProgress[skill].level = skillLevel;
            this.addMilestone(`${skill} skill leveled up to ${skillLevel}`, 'skill_level', {
                skill,
                level: skillLevel
            });
        }
        
        this.saveProgressData();
    }
    
    getProgressReport() {
        const dailyProgress = (this.progressData.timeTracking.daily / this.progressData.dailyGoal) * 100;
        const weeklyProgress = (this.progressData.timeTracking.weekly / this.progressData.weeklyGoal) * 100;
        const monthlyProgress = (this.progressData.timeTracking.monthly / this.progressData.monthlyGoal) * 100;
        
        return {
            level: this.progressData.currentLevel,
            totalXP: this.progressData.totalXP,
            currentXP: this.progressData.currentXP,
            xpToNextLevel: this.progressData.xpToNextLevel,
            levelProgress: (this.progressData.currentXP / this.progressData.xpToNextLevel) * 100,
            dailyProgress: Math.min(dailyProgress, 100),
            weeklyProgress: Math.min(weeklyProgress, 100),
            monthlyProgress: Math.min(monthlyProgress, 100),
            streak: this.progressData.streakData.current,
            longestStreak: this.progressData.streakData.longest,
            achievements: this.progressData.achievements.length,
            milestones: this.progressData.milestones.slice(-10), // Last 10 milestones
            skillProgress: this.progressData.skillProgress,
            timeTracking: this.progressData.timeTracking
        };
    }
    
    resetProgress() {
        this.progressData = {
            currentLevel: 1,
            totalXP: 0,
            currentXP: 0,
            xpToNextLevel: 100,
            dailyGoal: 100,
            weeklyGoal: 500,
            monthlyGoal: 2000,
            achievements: [],
            milestones: [],
            learningPath: [],
            skillProgress: {},
            timeTracking: {
                daily: 0,
                weekly: 0,
                monthly: 0,
                total: 0
            },
            streakData: {
                current: 0,
                longest: 0,
                lastActivity: null
            }
        };
        
        localStorage.removeItem('enhancedProgress');
        console.log('📈 Progress data reset');
    }
    
    /**
     * Update progress with new data
     * @param {string} type - Type of progress update
     * @param {object} data - Progress data
     */
    updateProgress(type, data) {
        try {
            switch (type) {
                case 'word_learned':
                    this.progressData.totalXP += data.isCorrect ? 10 : 2;
                    this.progressData.currentXP += data.isCorrect ? 10 : 2;
                    if (this.checkLevelUp()) {
                        this.triggerLevelUp();
                    }
                    break;
                case 'question_answered':
                    this.progressData.totalXP += data.isCorrect ? 5 : 1;
                    this.progressData.currentXP += data.isCorrect ? 5 : 1;
                    if (this.checkLevelUp()) {
                        this.triggerLevelUp();
                    }
                    break;
                case 'session_completed':
                    this.progressData.timeTracking.daily += data.duration || 0;
                    this.progressData.timeTracking.total += data.duration || 0;
                    break;
            }
            
            this.saveProgressData();
            console.log(`📈 Progress updated: ${type}`, data);
        } catch (error) {
            console.error('❌ Error updating progress:', error);
        }
    }

    exportProgress() {
        return {
            progressData: this.progressData,
            report: this.getProgressReport(),
            exportDate: new Date().toISOString()
        };
    }
}

// Global instance
window.enhancedProgress = new EnhancedProgress();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedProgress;
}
