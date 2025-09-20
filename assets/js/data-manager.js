// WordMaster Pro - Data Manager
// Handles all data operations, vocabulary loading, and storage

class DataManager {
    constructor() {
        // Use WeakMap for better memory management
        this.vocabulary = new Map();
        this.userProgress = new Map();
        this.gameStatistics = new Map();
        this.achievements = new Map();
        this.isLoaded = false;
        
        // Memory optimization
        this.memoryConfig = {
            maxVocabularyCache: 100, // Keep only 100 most used words in memory
            maxProgressEntries: 1000,
            memoryCheckInterval: 60000, // 1 minute
            gcThreshold: 50 * 1024 * 1024 // 50MB
        };
        
        this.usageTracker = new Map(); // Track word usage frequency
        this.lastMemoryCheck = Date.now();
        
        this.startMemoryMonitoring();
        
        this.storageKeys = {
            progress: 'wordmaster-progress',
            statistics: 'wordmaster-statistics',
            achievements: 'wordmaster-achievements',
            settings: 'wordmaster-settings'
        };
        
        this.init();
    }
    
    startMemoryMonitoring() {
        // Clear existing interval to prevent duplicates
        if (this.memoryInterval) {
            clearInterval(this.memoryInterval);
        }
        
        this.memoryInterval = setInterval(() => {
            this.checkMemoryUsage();
        }, this.memoryConfig.memoryCheckInterval);
    }
    
    checkMemoryUsage() {
        if (performance.memory) {
            const usedMemory = performance.memory.usedJSHeapSize;
            
            if (usedMemory > this.memoryConfig.gcThreshold) {
                console.warn(`💾 High memory usage detected: ${Math.round(usedMemory / 1024 / 1024)}MB`);
                this.optimizeMemoryUsage();
            }
        }
    }
    
    optimizeMemoryUsage() {
        // Clear least used vocabulary from memory
        this.clearLeastUsedVocabulary();
        
        // Clean old progress entries
        this.cleanOldProgressEntries();
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }
    
    clearLeastUsedVocabulary() {
        if (this.vocabulary.size <= this.memoryConfig.maxVocabularyCache) {
            return;
        }
        
        // Sort by usage frequency
        const sortedWords = Array.from(this.usageTracker.entries())
            .sort(([,a], [,b]) => b - a)
            .slice(this.memoryConfig.maxVocabularyCache);
        
        // Remove least used words from memory (but keep in persistent storage)
        sortedWords.forEach(([word]) => {
            this.vocabulary.delete(word);
            this.usageTracker.delete(word);
        });
        
        console.log(`🧹 Cleared ${sortedWords.length} vocabulary entries from memory`);
    }
    
    cleanOldProgressEntries() {
        // Keep only recent progress entries in memory
        const cutoffDate = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days ago
        
        let cleanedCount = 0;
        for (const [key, entry] of this.userProgress) {
            if (entry.timestamp && entry.timestamp < cutoffDate) {
                this.userProgress.delete(key);
                cleanedCount++;
            }
        }
        
        if (cleanedCount > 0) {
            console.log(`🧹 Cleaned ${cleanedCount} old progress entries`);
        }
    }
    
    async init() {
        console.log('📊 Initializing Data Manager...');
        
        try {
            // Load vocabulary from CSV
            await this.loadVocabulary();
            
            // Load user data from localStorage
            this.loadUserProgress();
            this.loadGameStatistics();
            this.loadAchievements();
            
            this.isLoaded = true;
            console.log('✅ Data Manager initialized successfully');
            
            // Notify app that data is ready
            this.notifyDataReady();
            
        } catch (error) {
            console.error('❌ Data Manager initialization failed:', error);
            this.handleDataError(error);
        }
    }
    
    async loadVocabulary() {
        try {
            console.log('📚 Loading vocabulary...');
            
            const response = await fetch('./assets/data/words.csv');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const csvText = await response.text();
            this.parseVocabularyCSV(csvText);
            
            console.log(`✅ Loaded ${this.vocabulary.size} vocabulary words`);
            
        } catch (error) {
            console.warn('⚠️ Loading vocabulary from server failed, using fallback data');
            this.loadFallbackVocabulary();
        }
    }
    
    parseVocabularyCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Expected headers: word,level,example1,example2,example3
        const wordIndex = headers.indexOf('word');
        const levelIndex = headers.indexOf('level');
        const example1Index = headers.indexOf('example1');
        const example2Index = headers.indexOf('example2');
        const example3Index = headers.indexOf('example3');
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Handle CSV parsing with potential commas in examples
            const values = this.parseCSVLine(line);
            
            if (values.length >= 5) {
                const word = values[wordIndex].trim();
                const level = values[levelIndex].trim();
                const examples = [
                    values[example1Index]?.trim() || '',
                    values[example2Index]?.trim() || '',
                    values[example3Index]?.trim() || ''
                ].filter(ex => ex.length > 0);
                
                if (word && level) {
                    this.vocabulary.set(word.toLowerCase(), {
                        word: word,
                        level: level,
                        examples: examples,
                        difficulty: this.calculateDifficulty(level, word),
                        category: this.determineCategory(word, examples),
                        phonetic: this.generatePhonetic(word),
                        meaning: this.extractMeaning(examples[0] || ''),
                        lastReviewed: null,
                        masteryLevel: 0,
                        correctAttempts: 0,
                        totalAttempts: 0
                    });
                }
            }
        }
        
        this.organizeVocabularyByLevel();
        this.generateWordRelationships();
    }
    
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }
    
    calculateDifficulty(level, word) {
        const baseDifficulty = {
            'A1': 1,
            'A2': 2,
            'B1': 3,
            'B2': 4,
            'C1': 5,
            'C2': 6
        };
        
        let difficulty = baseDifficulty[level] || 1;
        
        // Adjust based on word length
        if (word.length > 8) difficulty += 0.5;
        if (word.length > 12) difficulty += 0.5;
        
        // Adjust for common prefixes/suffixes
        const complexPatterns = ['un', 'dis', 'pre', 'tion', 'ness', 'ment'];
        if (complexPatterns.some(pattern => word.includes(pattern))) {
            difficulty += 0.3;
        }
        
        return Math.min(6, difficulty);
    }
    
    determineCategory(word, examples) {
        const categories = {
            'Animals': ['animal', 'pet', 'cat', 'dog', 'bird', 'fish', 'zoo'],
            'Food': ['food', 'eat', 'drink', 'meal', 'cook', 'restaurant', 'kitchen'],
            'Travel': ['travel', 'trip', 'hotel', 'airport', 'train', 'car', 'vacation'],
            'Daily Life': ['home', 'house', 'work', 'school', 'family', 'friend', 'time'],
            'Body': ['body', 'head', 'hand', 'foot', 'health', 'doctor', 'hospital'],
            'Nature': ['tree', 'flower', 'water', 'sun', 'moon', 'weather', 'season'],
            'Technology': ['computer', 'phone', 'internet', 'digital', 'online', 'app'],
            'Sports': ['sport', 'game', 'play', 'run', 'swim', 'ball', 'team'],
            'Education': ['learn', 'study', 'school', 'teacher', 'book', 'test', 'exam'],
            'Emotions': ['happy', 'sad', 'angry', 'love', 'fear', 'excited', 'worried']
        };
        
        const text = (word + ' ' + examples.join(' ')).toLowerCase();
        
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return category;
            }
        }
        
        return 'General';
    }
    
    generatePhonetic(word) {
        // Simple phonetic generation - in a real app, you'd use a phonetic dictionary
        const phoneticMap = {
            'a': 'ə', 'e': 'ɛ', 'i': 'ɪ', 'o': 'ɔ', 'u': 'ʌ',
            'th': 'θ', 'ch': 'tʃ', 'sh': 'ʃ', 'ng': 'ŋ'
        };
        
        let phonetic = word.toLowerCase();
        for (const [pattern, sound] of Object.entries(phoneticMap)) {
            phonetic = phonetic.replace(new RegExp(pattern, 'g'), sound);
        }
        
        return `/${phonetic}/`;
    }
    
    extractMeaning(example) {
        // Extract the most likely meaning from the first example
        if (!example) return '';
        
        // Look for patterns like "A ... that ..." or "Something that ..."
        const patterns = [
            /^(A|An)\s+(.+?)\s+that\s+(.+)$/i,
            /^(.+?)\s+that\s+(.+)$/i,
            /^Something\s+(.+)$/i,
            /^When\s+(.+)$/i
        ];
        
        for (const pattern of patterns) {
            const match = example.match(pattern);
            if (match) {
                return match[2] || match[1] || example.substring(0, 50);
            }
        }
        
        return example.substring(0, 60) + (example.length > 60 ? '...' : '');
    }
    
    organizeVocabularyByLevel() {
        this.vocabularyByLevel = {
            'A1': [],
            'A2': [],
            'B1': [],
            'B2': [],
            'C1': [],
            'C2': []
        };
        
        for (const [word, data] of this.vocabulary) {
            if (this.vocabularyByLevel[data.level]) {
                this.vocabularyByLevel[data.level].push(data);
            }
        }
        
        // Sort by difficulty within each level
        for (const level in this.vocabularyByLevel) {
            this.vocabularyByLevel[level].sort((a, b) => a.difficulty - b.difficulty);
        }
    }
    
    generateWordRelationships() {
        // Create relationships between words for smarter question generation
        this.wordRelationships = new Map();
        
        for (const [word, data] of this.vocabulary) {
            const related = [];
            
            // Find words in the same category
            for (const [otherWord, otherData] of this.vocabulary) {
                if (word !== otherWord && data.category === otherData.category) {
                    related.push(otherWord);
                }
            }
            
            // Find words with similar difficulty
            for (const [otherWord, otherData] of this.vocabulary) {
                if (word !== otherWord && 
                    Math.abs(data.difficulty - otherData.difficulty) < 0.5) {
                    related.push(otherWord);
                }
            }
            
            this.wordRelationships.set(word, [...new Set(related)]);
        }
    }
    
    loadFallbackVocabulary() {
        // Fallback vocabulary data for offline use
        const fallbackWords = [
            { word: 'cat', level: 'A1', examples: ['A small furry animal that says meow', 'Pet that catches mice', 'Animal with whiskers'] },
            { word: 'dog', level: 'A1', examples: ['Loyal animal that barks', 'Man\'s best friend', 'Pet that wags its tail'] },
            { word: 'book', level: 'A1', examples: ['You read this to learn', 'Paper with words and pictures', 'Stories and information inside'] },
            { word: 'house', level: 'A1', examples: ['Building where people live', 'Place with rooms and roof', 'Your home where you sleep'] },
            { word: 'water', level: 'A1', examples: ['Clear liquid you drink', 'Comes from taps and rivers', 'Falls from clouds as rain'] }
        ];
        
        fallbackWords.forEach(item => {
            this.vocabulary.set(item.word.toLowerCase(), {
                word: item.word,
                level: item.level,
                examples: item.examples,
                difficulty: this.calculateDifficulty(item.level, item.word),
                category: this.determineCategory(item.word, item.examples),
                phonetic: this.generatePhonetic(item.word),
                meaning: this.extractMeaning(item.examples[0]),
                lastReviewed: null,
                masteryLevel: 0,
                correctAttempts: 0,
                totalAttempts: 0
            });
        });
        
        this.organizeVocabularyByLevel();
    }
    
    // User Progress Management
    loadUserProgress() {
        try {
            const progressData = localStorage.getItem(this.storageKeys.progress);
            if (progressData) {
                const parsed = JSON.parse(progressData);
                this.userProgress = new Map(Object.entries(parsed));
                console.log('📈 User progress loaded');
            }
        } catch (error) {
            console.warn('⚠️ Failed to load user progress:', error);
        }
    }
    
    saveUserProgress() {
        try {
            const progressObj = Object.fromEntries(this.userProgress);
            localStorage.setItem(this.storageKeys.progress, JSON.stringify(progressObj));
        } catch (error) {
            console.error('❌ Failed to save user progress:', error);
        }
    }
    
    updateWordProgress(word, isCorrect, gameMode, timeSpent = 0) {
        const wordData = this.vocabulary.get(word.toLowerCase());
        if (!wordData) return;
        
        // Update word statistics
        wordData.totalAttempts++;
        if (isCorrect) {
            wordData.correctAttempts++;
            wordData.masteryLevel = Math.min(5, wordData.masteryLevel + 0.1);
        } else {
            wordData.masteryLevel = Math.max(0, wordData.masteryLevel - 0.05);
        }
        wordData.lastReviewed = new Date().toISOString();
        
        // Update user progress
        const progressKey = `${word.toLowerCase()}_${gameMode}`;
        const existing = this.userProgress.get(progressKey) || {
            attempts: 0,
            correct: 0,
            totalTime: 0,
            lastAttempt: null,
            streak: 0,
            bestTime: null
        };
        
        existing.attempts++;
        existing.totalTime += timeSpent;
        existing.lastAttempt = new Date().toISOString();
        
        if (isCorrect) {
            existing.correct++;
            existing.streak++;
            if (!existing.bestTime || timeSpent < existing.bestTime) {
                existing.bestTime = timeSpent;
            }
        } else {
            existing.streak = 0;
        }
        
        this.userProgress.set(progressKey, existing);
        this.saveUserProgress();
        
        // Check for achievements
        this.checkAchievements(word, isCorrect, gameMode);
    }
    
    // Game Statistics
    loadGameStatistics() {
        try {
            const statsData = localStorage.getItem(this.storageKeys.statistics);
            if (statsData) {
                const parsed = JSON.parse(statsData);
                this.gameStatistics = new Map(Object.entries(parsed));
                console.log('📊 Game statistics loaded');
            }
        } catch (error) {
            console.warn('⚠️ Failed to load game statistics:', error);
        }
    }
    
    saveGameStatistics() {
        try {
            const statsObj = Object.fromEntries(this.gameStatistics);
            localStorage.setItem(this.storageKeys.statistics, JSON.stringify(statsObj));
        } catch (error) {
            console.error('❌ Failed to save game statistics:', error);
        }
    }
    
    updateGameStatistics(gameMode, score, accuracy, timeSpent, questionsAnswered) {
        const statsKey = `${gameMode}_stats`;
        const existing = this.gameStatistics.get(statsKey) || {
            gamesPlayed: 0,
            totalScore: 0,
            totalAccuracy: 0,
            totalTime: 0,
            totalQuestions: 0,
            bestScore: 0,
            bestAccuracy: 0,
            averageTime: 0
        };
        
        existing.gamesPlayed++;
        existing.totalScore += score;
        existing.totalAccuracy += accuracy;
        existing.totalTime += timeSpent;
        existing.totalQuestions += questionsAnswered;
        
        if (score > existing.bestScore) existing.bestScore = score;
        if (accuracy > existing.bestAccuracy) existing.bestAccuracy = accuracy;
        
        existing.averageTime = existing.totalTime / existing.gamesPlayed;
        
        this.gameStatistics.set(statsKey, existing);
        this.saveGameStatistics();
    }
    
    // Achievement System
    loadAchievements() {
        try {
            const achievementData = localStorage.getItem(this.storageKeys.achievements);
            if (achievementData) {
                const parsed = JSON.parse(achievementData);
                this.achievements = new Map(Object.entries(parsed));
                console.log('🏆 Achievements loaded');
            }
        } catch (error) {
            console.warn('⚠️ Failed to load achievements:', error);
        }
    }
    
    saveAchievements() {
        try {
            const achievementObj = Object.fromEntries(this.achievements);
            localStorage.setItem(this.storageKeys.achievements, JSON.stringify(achievementObj));
        } catch (error) {
            console.error('❌ Failed to save achievements:', error);
        }
    }
    
    checkAchievements(word, isCorrect, gameMode) {
        const achievementChecks = [
            () => this.checkFirstCorrectAnswer(isCorrect),
            () => this.checkPerfectScore(gameMode),
            () => this.checkWordsLearned(),
            () => this.checkStreak(),
            () => this.checkGameModeCompletion(gameMode),
            () => this.checkSpeedAchievements(),
            () => this.checkConsistencyAchievements()
        ];
        
        achievementChecks.forEach(check => {
            try {
                check();
            } catch (error) {
                console.warn('Achievement check failed:', error);
            }
        });
    }
    
    checkFirstCorrectAnswer(isCorrect) {
        if (isCorrect && !this.achievements.has('first_correct')) {
            this.unlockAchievement('first_correct', 'First Success!', 'Got your first answer correct');
        }
    }
    
    checkWordsLearned() {
        const masteredWords = Array.from(this.vocabulary.values()).filter(word => word.masteryLevel >= 4).length;
        
        const milestones = [
            { count: 10, id: 'words_10', title: 'Word Explorer', description: 'Mastered 10 words' },
            { count: 50, id: 'words_50', title: 'Vocabulary Builder', description: 'Mastered 50 words' },
            { count: 100, id: 'words_100', title: 'Word Master', description: 'Mastered 100 words' },
            { count: 250, id: 'words_250', title: 'Vocabulary Expert', description: 'Mastered 250 words' }
        ];
        
        milestones.forEach(milestone => {
            if (masteredWords >= milestone.count && !this.achievements.has(milestone.id)) {
                this.unlockAchievement(milestone.id, milestone.title, milestone.description);
            }
        });
    }
    
    unlockAchievement(id, title, description) {
        this.achievements.set(id, {
            id,
            title,
            description,
            unlockedAt: new Date().toISOString(),
            isNew: true
        });
        
        this.saveAchievements();
        this.notifyAchievementUnlocked(title, description);
    }
    
    notifyAchievementUnlocked(title, description) {
        // Dispatch custom event for UI to handle
        const event = new CustomEvent('achievementUnlocked', {
            detail: { title, description }
        });
        document.dispatchEvent(event);
    }
    
    notifyDataReady() {
        const event = new CustomEvent('dataManagerReady', {
            detail: {
                vocabularyCount: this.vocabulary.size,
                progressCount: this.userProgress.size,
                achievementCount: this.achievements.size
            }
        });
        document.dispatchEvent(event);
    }
    
    handleDataError(error) {
        const event = new CustomEvent('dataManagerError', {
            detail: { error: error.message }
        });
        document.dispatchEvent(event);
    }
    
    // Public API Methods
    getVocabularyByLevel(level) {
        return this.vocabularyByLevel[level] || [];
    }
    
    getRandomWords(count, level = null, category = null) {
        let pool = Array.from(this.vocabulary.values());
        
        if (level) {
            pool = pool.filter(word => word.level === level);
        }
        
        if (category) {
            pool = pool.filter(word => word.category === category);
        }
        
        // Enhanced shuffling with better randomness
        const shuffled = this.shuffleArray(pool);
        return shuffled.slice(0, count);
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    getWordsByDifficulty(minDifficulty = 1, maxDifficulty = 6) {
        return Array.from(this.vocabulary.values())
            .filter(word => word.difficulty >= minDifficulty && word.difficulty <= maxDifficulty);
    }
    
    getWordsByCategory(category) {
        return Array.from(this.vocabulary.values())
            .filter(word => word.category === category);
    }
    
    getWordsByLevel(level) {
        return Array.from(this.vocabulary.values())
            .filter(word => word.level === level);
    }
    
    getRandomWordFromCategory(category, excludeWords = []) {
        const categoryWords = this.getWordsByCategory(category)
            .filter(word => !excludeWords.includes(word.word));
        
        if (categoryWords.length === 0) {
            return null;
        }
        
        return categoryWords[Math.floor(Math.random() * categoryWords.length)];
    }
    
    getRandomWordFromLevel(level, excludeWords = []) {
        const levelWords = this.getWordsByLevel(level)
            .filter(word => !excludeWords.includes(word.word));
        
        if (levelWords.length === 0) {
            return null;
        }
        
        return levelWords[Math.floor(Math.random() * levelWords.length)];
    }
    
    getRelatedWords(word, count = 5) {
        const wordData = this.vocabulary.get(word.toLowerCase());
        if (!wordData) return [];
        
        const related = [];
        
        // Find words in the same category
        const sameCategory = this.getWordsByCategory(wordData.category)
            .filter(w => w.word !== word)
            .slice(0, Math.ceil(count / 2));
        related.push(...sameCategory);
        
        // Find words with similar difficulty
        const similarDifficulty = Array.from(this.vocabulary.values())
            .filter(w => w.word !== word && 
                Math.abs(w.difficulty - wordData.difficulty) < 0.5)
            .slice(0, Math.ceil(count / 2));
        related.push(...similarDifficulty);
        
        // Remove duplicates and shuffle
        const uniqueRelated = related.filter((word, index, self) => 
            index === self.findIndex(w => w.word === word.word)
        );
        
        return this.shuffleArray(uniqueRelated).slice(0, count);
    }
    
    getWordStatistics() {
        const stats = {
            total: this.vocabulary.size,
            byLevel: {},
            byCategory: {},
            byDifficulty: {}
        };
        
        // Count by level
        for (const [word, data] of this.vocabulary) {
            stats.byLevel[data.level] = (stats.byLevel[data.level] || 0) + 1;
            stats.byCategory[data.category] = (stats.byCategory[data.category] || 0) + 1;
            stats.byDifficulty[data.difficulty] = (stats.byDifficulty[data.difficulty] || 0) + 1;
        }
        
        return stats;
    }
    
    getWord(word) {
        return this.vocabulary.get(word.toLowerCase());
    }
    
    getAllCategories() {
        const categories = new Set();
        this.vocabulary.forEach(word => categories.add(word.category));
        return Array.from(categories);
    }
    
    getStatistics() {
        return Object.fromEntries(this.gameStatistics);
    }
    
    getAchievements() {
        return Object.fromEntries(this.achievements);
    }
    
    exportUserData() {
        return {
            progress: Object.fromEntries(this.userProgress),
            statistics: Object.fromEntries(this.gameStatistics),
            achievements: Object.fromEntries(this.achievements),
            exportDate: new Date().toISOString()
        };
    }
    
    importUserData(data) {
        try {
            if (data.progress) {
                this.userProgress = new Map(Object.entries(data.progress));
                this.saveUserProgress();
            }
            
            if (data.statistics) {
                this.gameStatistics = new Map(Object.entries(data.statistics));
                this.saveGameStatistics();
            }
            
            if (data.achievements) {
                this.achievements = new Map(Object.entries(data.achievements));
                this.saveAchievements();
            }
            
            console.log('✅ User data imported successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to import user data:', error);
            return false;
        }
    }
}

// Global data manager instance
window.dataManager = null;

// Export for global use
window.DataManager = DataManager;
console.log('📚 DataManager exported to window.DataManager');

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}

