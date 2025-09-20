// TOEIC Vocabulary System - Advanced vocabulary learning with spaced repetition
// Designed specifically for TOEIC test preparation

class TOEICVocabularySystem {
    constructor() {
        this.vocabulary = new Map();
        this.userProgress = new Map();
        this.spacedRepetition = new Map();
        this.currentSession = [];
        this.sessionStats = {
            totalWords: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            timeSpent: 0,
            startTime: null
        };
        
        this.difficultyLevels = {
            'A1': { minScore: 0, maxScore: 200, color: '#10B981' },
            'A2': { minScore: 201, maxScore: 400, color: '#3B82F6' },
            'B1': { minScore: 401, maxScore: 600, color: '#8B5CF6' },
            'B2': { minScore: 601, maxScore: 800, color: '#F59E0B' },
            'C1': { minScore: 801, maxScore: 990, color: '#EF4444' }
        };
        
        this.loadVocabulary();
        this.loadUserProgress();
        this.initializeSpacedRepetition();
        
        console.log('📚 TOEIC Vocabulary System initialized');
    }
    
    async loadVocabulary() {
        try {
            console.log('📚 Loading TOEIC vocabulary from CSV...');
            const response = await fetch('assets/data/toeic_vocabulary.csv');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const csvText = await response.text();
            console.log(`📄 CSV file loaded, size: ${csvText.length} characters`);
            const lines = csvText.split('\n');
            
            console.log(`📄 CSV file has ${lines.length} lines (including header)`);
            
            let loadedCount = 0;
            let skippedCount = 0;
            
            // Skip header line
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    try {
                        // Parse CSV line properly (handle commas in quoted fields)
                        const parts = this.parseCSVLine(line);
                        if (parts.length >= 8) {
                            const [word, level, meaning, example1, example2, category, frequency, partOfSpeech] = parts;
                            
                            if (word && word.trim()) {
                                this.vocabulary.set(word.trim(), {
                                    word: word.trim(),
                                    level: level ? level.trim() : 'B1',
                                    meaning: meaning ? meaning.trim() : 'No meaning provided',
                                    examples: [example1, example2].filter(ex => ex && ex.trim()),
                                    category: category ? category.trim() : 'general',
                                    frequency: frequency ? frequency.trim() : 'medium',
                                    partOfSpeech: partOfSpeech ? partOfSpeech.trim() : 'noun',
                                    masteryLevel: 0,
                                    lastReviewed: null,
                                    reviewCount: 0,
                                    correctCount: 0,
                                    incorrectCount: 0
                                });
                                loadedCount++;
                            } else {
                                skippedCount++;
                            }
                        } else {
                            console.warn(`⚠️ Skipping malformed line ${i + 1} (${parts.length} parts): ${line.substring(0, 100)}...`);
                            skippedCount++;
                        }
                    } catch (parseError) {
                        console.warn(`⚠️ Error parsing line ${i + 1}: ${parseError.message}`);
                        skippedCount++;
                    }
                }
            }
            
            console.log(`✅ Loaded ${loadedCount} TOEIC vocabulary words`);
            if (skippedCount > 0) {
                console.log(`⚠️ Skipped ${skippedCount} malformed lines`);
            }
            console.log(`📊 Total vocabulary size: ${this.vocabulary.size} words`);
            
        } catch (error) {
            console.error('❌ Error loading TOEIC vocabulary:', error);
            console.error('❌ Error details:', error.message);
            console.error('❌ Error stack:', error.stack);
            this.loadFallbackVocabulary();
        }
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
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add the last field
        result.push(current.trim());
        
        return result;
    }
    
    loadFallbackVocabulary() {
        // Fallback vocabulary for offline use
        const fallbackWords = [
            {
                word: 'accomplish',
                level: 'B2',
                meaning: 'To achieve or complete successfully',
                examples: ['We need to accomplish our goals by the end of the quarter.'],
                category: 'business',
                frequency: 'high',
                partOfSpeech: 'verb'
            },
            {
                word: 'acquisition',
                level: 'B2',
                meaning: 'The act of acquiring or gaining possession',
                examples: ['The company announced the acquisition of a new subsidiary.'],
                category: 'business',
                frequency: 'high',
                partOfSpeech: 'noun'
            }
        ];
        
        fallbackWords.forEach(word => {
            this.vocabulary.set(word.word, {
                ...word,
                masteryLevel: 0,
                lastReviewed: null,
                reviewCount: 0,
                correctCount: 0,
                incorrectCount: 0
            });
        });
        
        console.log('⚠️ Using fallback vocabulary - CSV loading failed');
        console.log('⚠️ Fallback vocabulary has only 2 words - this is why you see low word counts');
    }
    
    // Force reload vocabulary from CSV (bypass fallback)
    async forceReloadVocabulary() {
        console.log('🔄 Force reloading vocabulary from CSV...');
        this.vocabulary.clear(); // Clear existing vocabulary
        await this.loadVocabulary();
        return this.vocabulary.size;
    }
    
    loadUserProgress() {
        try {
            const savedProgress = localStorage.getItem('toeicVocabularyProgress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                this.userProgress = new Map(Object.entries(progress));
                console.log('✅ Loaded user progress');
            }
        } catch (error) {
            console.error('❌ Error loading user progress:', error);
        }
    }
    
    saveUserProgress() {
        try {
            const progressObj = Object.fromEntries(this.userProgress);
            localStorage.setItem('toeicVocabularyProgress', JSON.stringify(progressObj));
        } catch (error) {
            console.error('❌ Error saving user progress:', error);
        }
    }
    
    initializeSpacedRepetition() {
        // Initialize spaced repetition intervals (in days)
        this.reviewIntervals = [1, 3, 7, 14, 30, 60, 120];
        this.currentIntervalIndex = 0;
    }
    
    // Get words for review based on spaced repetition algorithm
    getWordsForReview(count = 20) {
        const now = Date.now();
        const wordsToReview = [];
        
        // Get words that need review
        for (const [word, data] of this.vocabulary) {
            const progress = this.userProgress.get(word) || {
                masteryLevel: 0,
                lastReviewed: null,
                reviewCount: 0,
                correctCount: 0,
                incorrectCount: 0
            };
            
            const daysSinceReview = progress.lastReviewed ? 
                (now - progress.lastReviewed) / (1000 * 60 * 60 * 24) : 999;
            
            const requiredInterval = this.reviewIntervals[Math.min(progress.masteryLevel, this.reviewIntervals.length - 1)];
            
            if (daysSinceReview >= requiredInterval || progress.masteryLevel === 0) {
                wordsToReview.push({
                    word: data.word,
                    data: data,
                    progress: progress,
                    priority: this.calculatePriority(data, progress)
                });
            }
        }
        
        // Sort by priority and return top words
        wordsToReview.sort((a, b) => b.priority - a.priority);
        return wordsToReview.slice(0, count).map(item => item.word);
    }
    
    calculatePriority(wordData, progress) {
        let priority = 0;
        
        // Higher frequency words get higher priority
        if (wordData.frequency === 'high') priority += 100;
        else if (wordData.frequency === 'medium') priority += 50;
        
        // Lower mastery level gets higher priority
        priority += (10 - progress.masteryLevel) * 10;
        
        // More incorrect answers get higher priority
        priority += progress.incorrectCount * 5;
        
        // Words not reviewed recently get higher priority
        if (!progress.lastReviewed) priority += 50;
        
        return priority;
    }
    
    // Start a vocabulary learning session
    startSession(options = {}) {
        this.sessionStats = {
            totalWords: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            timeSpent: 0,
            startTime: Date.now()
        };
        
        this.currentSession = this.getWordsForReview(options.wordCount || 20);
        this.sessionStats.totalWords = this.currentSession.length;
        
        console.log(`🎯 Started TOEIC vocabulary session with ${this.currentSession.length} words`);
        return this.currentSession;
    }
    
    // Get next word for review
    getCurrentWord() {
        if (!this.currentSession || this.currentSession.length === 0) {
            return null;
        }
        
        const word = this.currentSession[0];
        const wordData = this.vocabulary.get(word);
        
        return {
            word: word,
            definition: wordData.meaning,
            example: wordData.examples,
            difficulty: wordData.level,
            category: wordData.category,
            synonyms: wordData.synonyms,
            progress: this.userProgress.get(word) || {
                masteryLevel: 0,
                lastReviewed: null,
                reviewCount: 0,
                correctCount: 0,
                incorrectCount: 0
            }
        };
    }
    
    getNextWord() {
        if (this.currentSession.length === 0) {
            return null;
        }
        
        const word = this.currentSession.shift();
        const wordData = this.vocabulary.get(word);
        
        return {
            word: word,
            meaning: wordData.meaning,
            examples: wordData.examples,
            level: wordData.level,
            category: wordData.category,
            partOfSpeech: wordData.partOfSpeech,
            progress: this.userProgress.get(word) || {
                masteryLevel: 0,
                lastReviewed: null,
                reviewCount: 0,
                correctCount: 0,
                incorrectCount: 0
            }
        };
    }
    
    nextWord() {
        if (!this.currentSession || this.currentSession.length === 0) {
            return false;
        }
        
        this.currentSession.shift();
        return this.currentSession.length > 0;
    }
    
    answerWord(isCorrect) {
        if (!this.currentSession || this.currentSession.length === 0) {
            return false;
        }
        
        const word = this.currentSession[0];
        this.recordAnswer(word, isCorrect);
        return true;
    }
    
    completeSession() {
        if (!this.currentSession) {
            return null;
        }
        
        const stats = this.getSessionStats();
        this.endSession();
        
        return {
            totalWords: stats.totalWords,
            correctAnswers: stats.correctAnswers,
            incorrectAnswers: stats.incorrectAnswers,
            accuracy: stats.totalWords > 0 ? Math.round((stats.correctAnswers / stats.totalWords) * 100) : 0,
            timeSpent: stats.timeSpent
        };
    }
    
    // Record answer and update progress
    recordAnswer(word, isCorrect, responseTime = 0) {
        const wordData = this.vocabulary.get(word);
        if (!wordData) return;
        
        let progress = this.userProgress.get(word) || {
            masteryLevel: 0,
            lastReviewed: null,
            reviewCount: 0,
            correctCount: 0,
            incorrectCount: 0
        };
        
        // Update progress
        progress.reviewCount++;
        progress.lastReviewed = Date.now();
        
        if (isCorrect) {
            progress.correctCount++;
            progress.masteryLevel = Math.min(progress.masteryLevel + 1, 6);
            this.sessionStats.correctAnswers++;
        } else {
            progress.incorrectCount++;
            progress.masteryLevel = Math.max(progress.masteryLevel - 1, 0);
            this.sessionStats.incorrectAnswers++;
        }
        
        this.userProgress.set(word, progress);
        this.saveUserProgress();
        
        // Update session stats
        this.sessionStats.timeSpent += responseTime;
        
        console.log(`📝 Recorded answer for "${word}": ${isCorrect ? 'Correct' : 'Incorrect'}`);
    }
    
    // Get session statistics
    getSessionStats() {
        const accuracy = this.sessionStats.totalWords > 0 ? 
            (this.sessionStats.correctAnswers / this.sessionStats.totalWords) * 100 : 0;
        
        const timeSpent = this.sessionStats.startTime ? 
            Date.now() - this.sessionStats.startTime : 0;
        
        return {
            ...this.sessionStats,
            accuracy: Math.round(accuracy),
            timeSpent: timeSpent,
            wordsRemaining: this.currentSession.length
        };
    }
    
    // Get vocabulary loading statistics
    getVocabularyStats() {
        const totalWords = this.vocabulary.size;
        const categories = new Set();
        const levels = new Set();
        const frequencies = new Set();
        
        this.vocabulary.forEach(word => {
            categories.add(word.category);
            levels.add(word.level);
            frequencies.add(word.frequency);
        });
        
        return {
            totalWords,
            categories: Array.from(categories),
            levels: Array.from(levels),
            frequencies: Array.from(frequencies),
            categoryCount: categories.size,
            levelCount: levels.size
        };
    }
    
    // Get overall progress statistics
    getOverallStats() {
        const totalWords = this.vocabulary.size;
        const reviewedWords = this.userProgress.size;
        const masteredWords = Array.from(this.userProgress.values())
            .filter(progress => progress.masteryLevel >= 5).length;
        
        const totalCorrect = Array.from(this.userProgress.values())
            .reduce((sum, progress) => sum + progress.correctCount, 0);
        
        const totalIncorrect = Array.from(this.userProgress.values())
            .reduce((sum, progress) => sum + progress.incorrectCount, 0);
        
        const overallAccuracy = (totalCorrect + totalIncorrect) > 0 ? 
            (totalCorrect / (totalCorrect + totalIncorrect)) * 100 : 0;
        
        // Calculate TOEIC score estimate
        const estimatedScore = this.calculateTOEICScore();
        
        return {
            totalWords,
            reviewedWords,
            masteredWords,
            totalCorrect,
            totalIncorrect,
            overallAccuracy: Math.round(overallAccuracy),
            estimatedTOEICScore: estimatedScore,
            progressPercentage: Math.round((reviewedWords / totalWords) * 100)
        };
    }
    
    // Calculate estimated TOEIC score based on vocabulary mastery
    calculateTOEICScore() {
        const totalWords = this.vocabulary.size;
        const reviewedWords = this.userProgress.size;
        
        if (reviewedWords === 0) return 0;
        
        const averageMastery = Array.from(this.userProgress.values())
            .reduce((sum, progress) => sum + progress.masteryLevel, 0) / reviewedWords;
        
        const reviewPercentage = reviewedWords / totalWords;
        
        // Base score calculation
        let baseScore = (averageMastery / 6) * 400; // Max 400 for vocabulary
        let reviewBonus = reviewPercentage * 200; // Max 200 for coverage
        
        // Accuracy bonus
        const totalCorrect = Array.from(this.userProgress.values())
            .reduce((sum, progress) => sum + progress.correctCount, 0);
        const totalIncorrect = Array.from(this.userProgress.values())
            .reduce((sum, progress) => sum + progress.incorrectCount, 0);
        
        const accuracy = (totalCorrect + totalIncorrect) > 0 ? 
            totalCorrect / (totalCorrect + totalIncorrect) : 0;
        
        let accuracyBonus = accuracy * 200; // Max 200 for accuracy
        
        const estimatedScore = Math.min(Math.round(baseScore + reviewBonus + accuracyBonus), 990);
        
        return Math.max(estimatedScore, 10); // Minimum score of 10
    }
    
    // Get words by category
    getWordsByCategory(category) {
        return Array.from(this.vocabulary.values())
            .filter(word => word.category === category);
    }
    
    // Get words by level
    getWordsByLevel(level) {
        return Array.from(this.vocabulary.values())
            .filter(word => word.level === level);
    }
    
    // Get words by frequency
    getWordsByFrequency(frequency) {
        return Array.from(this.vocabulary.values())
            .filter(word => word.frequency === frequency);
    }
    
    // Search words
    searchWords(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        for (const [word, data] of this.vocabulary) {
            if (word.toLowerCase().includes(lowerQuery) || 
                data.meaning.toLowerCase().includes(lowerQuery) ||
                data.examples.some(ex => ex.toLowerCase().includes(lowerQuery))) {
                results.push({
                    word: word,
                    data: data,
                    progress: this.userProgress.get(word)
                });
            }
        }
        
        return results;
    }
    
    // Get flashcards for a specific word
    getFlashcard(word) {
        const wordData = this.vocabulary.get(word);
        if (!wordData) return null;
        
        return {
            front: {
                word: word,
                partOfSpeech: wordData.partOfSpeech,
                level: wordData.level,
                category: wordData.category
            },
            back: {
                meaning: wordData.meaning,
                examples: wordData.examples,
                frequency: wordData.frequency
            },
            progress: this.userProgress.get(word)
        };
    }
    
    // Get study recommendations
    getStudyRecommendations() {
        const stats = this.getOverallStats();
        const recommendations = [];
        
        if (stats.reviewedWords < stats.totalWords * 0.3) {
            recommendations.push({
                type: 'coverage',
                message: 'Focus on reviewing more vocabulary words to improve coverage',
                priority: 'high'
            });
        }
        
        if (stats.overallAccuracy < 70) {
            recommendations.push({
                type: 'accuracy',
                message: 'Work on improving accuracy by reviewing difficult words',
                priority: 'high'
            });
        }
        
        if (stats.masteredWords < stats.reviewedWords * 0.5) {
            recommendations.push({
                type: 'mastery',
                message: 'Review mastered words less frequently and focus on new words',
                priority: 'medium'
            });
        }
        
        // Get weak categories
        const categoryStats = this.getCategoryStats();
        const weakCategories = Object.entries(categoryStats)
            .filter(([category, stats]) => stats.accuracy < 70)
            .map(([category]) => category);
        
        if (weakCategories.length > 0) {
            recommendations.push({
                type: 'category',
                message: `Focus on these weak categories: ${weakCategories.join(', ')}`,
                priority: 'medium'
            });
        }
        
        return recommendations;
    }
    
    // Get statistics by category
    getCategoryStats() {
        const categories = {};
        
        for (const [word, data] of this.vocabulary) {
            if (!categories[data.category]) {
                categories[data.category] = {
                    total: 0,
                    reviewed: 0,
                    correct: 0,
                    incorrect: 0,
                    accuracy: 0
                };
            }
            
            categories[data.category].total++;
            
            const progress = this.userProgress.get(word);
            if (progress) {
                categories[data.category].reviewed++;
                categories[data.category].correct += progress.correctCount;
                categories[data.category].incorrect += progress.incorrectCount;
            }
        }
        
        // Calculate accuracy for each category
        for (const category in categories) {
            const stats = categories[category];
            const totalAnswers = stats.correct + stats.incorrect;
            stats.accuracy = totalAnswers > 0 ? (stats.correct / totalAnswers) * 100 : 0;
        }
        
        return categories;
    }
    
    // Reset progress (for testing or starting over)
    resetProgress() {
        this.userProgress.clear();
        this.saveUserProgress();
        console.log('🔄 Vocabulary progress reset');
    }
    
    // Export progress data
    exportProgress() {
        const progressData = {
            userProgress: Object.fromEntries(this.userProgress),
            overallStats: this.getOverallStats(),
            categoryStats: this.getCategoryStats(),
            exportDate: new Date().toISOString()
        };
        
        return JSON.stringify(progressData, null, 2);
    }
    
    // Import progress data
    importProgress(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.userProgress) {
                this.userProgress = new Map(Object.entries(data.userProgress));
                this.saveUserProgress();
                console.log('✅ Progress data imported successfully');
                return true;
            }
        } catch (error) {
            console.error('❌ Error importing progress data:', error);
            return false;
        }
    }
    
    // End current session
    endSession() {
        console.log('📚 Ending TOEIC Vocabulary session...');
        this.currentSession = null;
        this.currentWord = null;
        this.sessionStartTime = null;
        this.sessionStats = {
            correct: 0,
            incorrect: 0,
            total: 0,
            timeSpent: 0
        };
        console.log('✅ TOEIC Vocabulary session ended');
    }
    
    getProgressSummary() {
        const stats = this.getOverallStats();
        const totalWords = this.vocabulary.size;
        const masteredWords = stats.masteredWords;
        const learningWords = stats.learningWords;
        const newWords = totalWords - (masteredWords + learningWords);
        const strugglingWords = stats.strugglingWords;
        const masteryPercentage = totalWords > 0 ? (masteredWords / totalWords) * 100 : 0;
        
        return {
            totalWords: totalWords,
            masteredWords: masteredWords,
            learningWords: learningWords,
            newWords: newWords,
            strugglingWords: strugglingWords,
            masteryPercentage: masteryPercentage
        };
    }
}

// Export for global use
window.TOEICVocabularySystem = TOEICVocabularySystem;

