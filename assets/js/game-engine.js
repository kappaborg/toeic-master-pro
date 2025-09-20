// WordMaster Pro - Game Engine
// Core game logic and mechanics

// Base Game Class (to be extended by specific game modes)
class BaseGame {
    constructor() {
        this.currentQuestionData = null;
        this.isInitialized = false;
    }
    
    async initialize(options = {}) {
        window.logger?.debug(`Initializing ${this.constructor.name}...`);
        this.isInitialized = true;
    }
    
    start(options = {}) {
        window.logger?.debug(`Starting ${this.constructor.name}...`);
        this.isActive = true;
        this.startTime = Date.now();
        
        // Start the first question
        this.nextQuestion();
    }
    
    async nextQuestion() {
        try {
            const questionData = await this.generateQuestion(0);
            this.currentQuestionData = questionData;
            await this.displayQuestion(questionData);
        } catch (error) {
            console.error('❌ Failed to generate question:', error);
            this.handleQuestionError(error);
        }
    }
    
    end() {
        window.logger?.debug(`Ending ${this.constructor.name}...`);
        this.isActive = false;
        
        if (window.gameEngine) {
            window.gameEngine.endGame();
        }
    }
    
    handleQuestionError(error) {
        console.error('Question generation failed', error);
        if (window.uiManager) {
            window.uiManager.showToast('Failed to load question. Please try again.', 'error');
        }
    }
    
    async generateQuestion(questionNumber) {
        throw new Error('generateQuestion must be implemented by subclass');
    }
    
    async checkAnswer(answer, responseTime) {
        throw new Error('checkAnswer must be implemented by subclass');
    }
    
    getHint() {
        return { text: 'Think carefully about the word meaning.' };
    }
    
    pause() {
        // Pause the current game state
        this.isPaused = true;
        console.log('⏸️ Game paused');
    }
    
    resume() {
        // Resume the game state
        this.isPaused = false;
        console.log('▶️ Game resumed');
    }
    
    getHTML() {
        return '<div class="text-center p-8">Game mode not implemented yet.</div>';
    }
    
    async displayQuestion(questionData) {
        this.currentQuestionData = questionData;
        
        // Add progress toggle and home button to every game
        if (typeof this.addGlobalControls === 'function') {
            this.addGlobalControls();
        } else {
            console.warn('⚠️ addGlobalControls method not available');
        }
    }
    
    getCurrentWord() {
        return this.currentQuestionData?.word || null;
    }
    
    /**
     * Add global controls (progress toggle + home button) to every game
     */
    addGlobalControls() {
        // Remove existing controls first
        const existingControls = document.getElementById('globalControls');
        if (existingControls) {
            existingControls.remove();
        }
        
        // Remove existing individual buttons
        const existingProgressBtn = document.getElementById('progressControlBtn');
        const existingHomeBtn = document.getElementById('homeControlBtn');
        if (existingProgressBtn) existingProgressBtn.remove();
        if (existingHomeBtn) existingHomeBtn.remove();
        
        // Create floating layer container for better organization
        let floatingLayer = document.getElementById('floatingControlsLayer');
        if (!floatingLayer) {
            floatingLayer = document.createElement('div');
            floatingLayer.id = 'floatingControlsLayer';
            floatingLayer.className = 'fixed inset-0 pointer-events-none z-[9999]';
            document.body.appendChild(floatingLayer);
        }
        
        // Create floating independent controls in dedicated layer
        // Progress Toggle Button - Floating Independent Draggable
        const progressBtn = document.createElement('div');
        progressBtn.id = 'progressControlBtn';
        progressBtn.className = 'floating-control-btn progress-btn independent-draggable';
        progressBtn.innerHTML = `
            <i data-lucide="bar-chart-3" class="w-5 h-5 text-white"></i>
        `;
        progressBtn.title = window.languageManager ? window.languageManager.getText('control.progress') : 'Toggle Progress Panel (Drag to move)';
        progressBtn.onclick = () => this.toggleProgressPanel();
        
        // Home Button - Floating Independent Draggable
        const homeBtn = document.createElement('div');
        homeBtn.id = 'homeControlBtn';
        homeBtn.className = 'floating-control-btn home-btn independent-draggable';
        homeBtn.innerHTML = `
            <i data-lucide="home" class="w-5 h-5 text-white"></i>
        `;
        homeBtn.title = window.languageManager ? window.languageManager.getText('control.home') : 'Go to Home (Drag to move)';
        homeBtn.onclick = () => this.goToHome();
        
        // Add to floating layer for better organization
        floatingLayer.appendChild(progressBtn);
        floatingLayer.appendChild(homeBtn);
        
        // Make each button independently draggable with enhanced system
        this.makeButtonDraggable(progressBtn, 'progressControlPosition');
        this.makeButtonDraggable(homeBtn, 'homeControlPosition');
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        console.log('✅ Floating independent draggable controls added to dedicated layer');
    }
    
    /**
     * Make individual button draggable with UI boundaries
     */
    makeButtonDraggable(button, storageKey) {
        let isDragging = false;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        
        // Apply transform helper function
        const applyTransform = (element, x, y) => {
            // Force remove any existing transforms and positioning
            element.style.transform = '';
            element.style.left = '';
            element.style.top = '';
            element.style.margin = '';
            element.style.padding = '';
            
            // Apply new transform using translate3d for better performance
            element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            
            // Force reflow for visual consistency
            element.offsetHeight;
            
            // Debug transform application
            console.log(`🎯 Transform applied to ${storageKey}:`, {
                x, y, 
                transform: element.style.transform,
                computedStyle: window.getComputedStyle(element).transform
            });
        };
        
        // Load saved position for this specific button
        const savedPos = localStorage.getItem(storageKey);
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                xOffset = pos.x;
                yOffset = pos.y;
                applyTransform(button, xOffset, yOffset);
                console.log(`📍 Button ${storageKey} position restored:`, {x: xOffset, y: yOffset});
            } catch (error) {
                console.error(`⚠️ Error loading saved position for ${storageKey}:`, error);
                localStorage.removeItem(storageKey);
                xOffset = 0;
                yOffset = 0;
            }
        }
        
        const dragStart = (e) => {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            
            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
            
            button.classList.add('dragging');
            button.style.cursor = 'grabbing';
            button.style.userSelect = 'none';
            button.style.zIndex = '1001';
            
            console.log(`🎯 Started dragging ${storageKey} from:`, {x: initialX, y: initialY});
        };
        
        const drag = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            let newX, newY;
            
            if (e.type === 'touchmove') {
                newX = e.touches[0].clientX - initialX;
                newY = e.touches[0].clientY - initialY;
            } else {
                newX = e.clientX - initialX;
                newY = e.clientY - initialY;
            }
            
            // Enhanced UI Boundaries - Keep buttons within viewport with better padding
            const buttonRect = button.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Calculate boundaries with enhanced padding
            const padding = 50; // Increased padding for better UX
            const minX = -buttonRect.left + padding;
            const maxX = viewportWidth - buttonRect.right - padding;
            const minY = -buttonRect.top + padding;
            const maxY = viewportHeight - buttonRect.bottom - padding;
            
            // Apply boundaries
            newX = Math.max(minX, Math.min(maxX, newX));
            newY = Math.max(minY, Math.min(maxY, newY));
            
            // Update position
            xOffset = newX;
            yOffset = newY;
            
            // Apply transform using helper function
            applyTransform(button, newX, newY);
            
            // Enhanced debugging for position tracking
            if (Math.random() < 0.1) { // Log 10% of drag events for debugging
                console.log(`🔄 Dragging ${storageKey} to:`, {x: newX, y: newY, transform: button.style.transform});
            }
        };
        
        const dragEnd = (e) => {
            if (!isDragging) return;
            
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            isDragging = false;
            button.classList.remove('dragging');
            button.style.cursor = 'grab';
            button.style.userSelect = 'auto';
            button.style.zIndex = '1000';
            
            // Save position immediately
            const positionData = {
                x: xOffset,
                y: yOffset,
                timestamp: Date.now()
            };
            localStorage.setItem(storageKey, JSON.stringify(positionData));
            console.log(`💾 Button ${storageKey} position saved:`, positionData);
        };
        
        // Enhanced event handling with better performance
        button.addEventListener('mousedown', dragStart, { passive: false });
        document.addEventListener('mousemove', drag, { passive: false });
        document.addEventListener('mouseup', dragEnd, { passive: false });
        document.addEventListener('mouseleave', dragEnd, { passive: false });
        
        // Touch events with better performance - attach to button, not document
        button.addEventListener('touchstart', dragStart, { passive: false });
        button.addEventListener('touchmove', drag, { passive: false });
        button.addEventListener('touchend', dragEnd, { passive: false });
        
        // Set initial cursor and make sure button is draggable
        button.style.cursor = 'grab';
        button.style.userSelect = 'none';
        button.setAttribute('draggable', 'false'); // Prevent default HTML5 dragging
        
        // Force position update on next frame to ensure visual consistency
        requestAnimationFrame(() => {
            if (xOffset !== 0 || yOffset !== 0) {
                applyTransform(button, xOffset, yOffset);
                console.log(`🎯 Position applied via requestAnimationFrame:`, {x: xOffset, y: yOffset});
            }
        });
        
        // Enhanced debugging and validation
        console.log(`✅ Button ${storageKey} made independently draggable with enhanced UI boundaries`);
        console.log(`🔍 Button element:`, button);
        console.log(`🔍 Button classes:`, button.className);
        console.log(`🔍 Button style:`, button.style.cssText);
        
        // Debug: Log current position
        console.log(`📍 Button ${storageKey} current position:`, {
            x: xOffset,
            y: yOffset,
            transform: button.style.transform,
            computedStyle: window.getComputedStyle(button).transform
        });
        
        // Add global debugging function
        if (!window.debugDragging) {
            window.debugDragging = (storageKey) => {
                const btn = document.getElementById(storageKey === 'progressControlPosition' ? 'progressControlBtn' : 'homeControlBtn');
                if (btn) {
                    console.log(`🔍 Debug ${storageKey}:`, {
                        element: btn,
                        classes: btn.className,
                        style: btn.style.cssText,
                        computedStyle: window.getComputedStyle(btn).transform,
                        rect: btn.getBoundingClientRect()
                    });
                }
            };
        }
    }
    
    /**
     * Get saved position for a draggable element
     */
    getSavedPosition(storageKey) {
        try {
            const savedPos = localStorage.getItem(storageKey);
            if (savedPos) {
                return JSON.parse(savedPos);
            }
        } catch (error) {
            console.error(`⚠️ Error getting saved position for ${storageKey}:`, error);
        }
        return null;
    }
    
    /**
     * Clear saved position for a draggable element
     */
    clearSavedPosition(storageKey) {
        localStorage.removeItem(storageKey);
        console.log(`🗑️ Cleared saved position for ${storageKey}`);
    }
    
    /**
     * Reset all draggable elements to default positions
     */
    resetAllDraggablePositions() {
        const keys = ['progressControlPosition', 'homeControlPosition', 'draggableProgressTogglePosition'];
        keys.forEach(key => {
            localStorage.removeItem(key);
        });
        console.log('🔄 All draggable positions reset to default');
        
        // Force page reload to apply reset
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    
    /**
     * Toggle progress panel visibility
     */
    toggleProgressPanel() {
        if (window.gamificationSystem) {
            window.gamificationSystem.toggleProgressPanel();
        } else {
            console.warn('⚠️ Gamification system not found');
        }
    }
    
    /**
     * Navigate back to home screen
     */
    goToHome() {
        if (window.app) {
            window.app.showWelcomeScreen();
        } else {
            console.warn('⚠️ App instance not found');
        }
    }
}

// Multiple Choice Game Implementation
class MultipleChoiceGame extends BaseGame {
    constructor() {
        super();
        this.currentWord = null;
        this.choices = [];
        this.correctAnswerIndex = 0;
        this.usedWords = new Set();
        this.wordHistory = [];
        this.maxHistorySize = 100;
    }
    
    async initialize(options = {}) {
        await super.initialize(options);
        console.log('🎯 Multiple Choice Game initialized');
    }
    
    async generateQuestion(questionNumber) {
        if (!window.dataManager || !window.dataManager.vocabulary) {
            throw new Error('Data manager not available');
        }
        
        // Enhanced question types with more variety
        const questionTypes = [
            'meaning', 'synonym', 'antonym', 'word_form', 'collocation',
            'idiom', 'phrasal_verb', 'word_family', 'pronunciation', 'etymology',
            'context', 'definition', 'usage', 'category', 'level'
        ];
        const selectedType = questionTypes[questionNumber % questionTypes.length];
        
        // Get available words (not used recently)
        const words = Array.from(window.dataManager.vocabulary.values());
        const eligibleWords = words.filter(word => 
            word.examples && word.examples.length > 0 &&
            !this.usedWords.has(word.word)
        );
        
        // If all words have been used, reset the used set
        if (eligibleWords.length === 0) {
            this.usedWords.clear();
            console.log('🔄 All words used, resetting for new cycle');
            // Get all words again
            const allEligibleWords = words.filter(word => 
                word.examples && word.examples.length > 0
            );
            this.currentWord = allEligibleWords[Math.floor(Math.random() * allEligibleWords.length)];
        } else {
            // Select random word from available words
            this.currentWord = eligibleWords[Math.floor(Math.random() * eligibleWords.length)];
        }
        
        // Mark word as used
        this.usedWords.add(this.currentWord.word);
        
        // Add to history
        this.wordHistory.push({
            word: this.currentWord.word,
            type: selectedType,
            timestamp: Date.now()
        });
        
        // Keep history size manageable
        if (this.wordHistory.length > this.maxHistorySize) {
            this.wordHistory = this.wordHistory.slice(-this.maxHistorySize);
        }
        
        console.log(`🎯 Used word: ${this.currentWord.word} (${this.usedWords.size} used, type: ${selectedType})`);
        
        // Generate question based on type
        let questionData;
        switch (selectedType) {
            case 'meaning':
                questionData = this.generateMeaningQuestion();
                break;
            case 'synonym':
                questionData = this.generateSynonymQuestion();
                break;
            case 'antonym':
                questionData = this.generateAntonymQuestion();
                break;
            case 'word_form':
                questionData = this.generateWordFormQuestion();
                break;
            case 'collocation':
                questionData = this.generateCollocationQuestion();
                break;
            case 'idiom':
                questionData = this.generateIdiomQuestion();
                break;
            case 'phrasal_verb':
                questionData = this.generatePhrasalVerbQuestion();
                break;
            case 'word_family':
                questionData = this.generateWordFamilyQuestion();
                break;
            case 'pronunciation':
                questionData = this.generatePronunciationQuestion();
                break;
            case 'etymology':
                questionData = this.generateEtymologyQuestion();
                break;
            case 'context':
                questionData = this.generateContextQuestion();
                break;
            case 'definition':
                questionData = this.generateDefinitionQuestion();
                break;
            case 'usage':
                questionData = this.generateUsageQuestion();
                break;
            case 'category':
                questionData = this.generateCategoryQuestion();
                break;
            case 'level':
                questionData = this.generateLevelQuestion();
                break;
            default:
                questionData = this.generateMeaningQuestion();
        }
        
        return questionData;
    }
    
    generateMeaningQuestion() {
        // Generate 4 choices (1 correct + 3 wrong)
        this.choices = [this.currentWord.examples[0]]; // Correct answer
        this.correctAnswerIndex = 0;
        
        // Get 3 wrong answers
        const eligibleWords = Array.from(window.dataManager.vocabulary.values());
        const wrongWords = eligibleWords.filter(w => w.word !== this.currentWord.word);
        for (let i = 0; i < 3 && i < wrongWords.length; i++) {
            const randomWrong = wrongWords[Math.floor(Math.random() * wrongWords.length)];
            if (randomWrong.examples && randomWrong.examples[0]) {
                this.choices.push(randomWrong.examples[0]);
            }
        }
        
        // Shuffle choices but remember correct position
        const correctAnswer = this.choices[0];
        this.choices = this.shuffleArray(this.choices);
        this.correctAnswerIndex = this.choices.indexOf(correctAnswer);
        
        return {
            type: 'meaning',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `What does "${this.currentWord.word}" mean?`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generateSynonymQuestion() {
        const synonyms = this.getSynonyms(this.currentWord.word);
        const wrongAnswers = this.getRandomWrongAnswers(3);
        
        this.choices = [synonyms[0] || this.currentWord.word, ...wrongAnswers];
        this.correctAnswerIndex = 0;
        
        // Shuffle choices
        const correctAnswer = this.choices[0];
        this.choices = this.shuffleArray(this.choices);
        this.correctAnswerIndex = this.choices.indexOf(correctAnswer);
        
        return {
            type: 'synonym',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `Find a synonym for "${this.currentWord.word}":`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generateAntonymQuestion() {
        const antonyms = this.getAntonyms(this.currentWord.word);
        const wrongAnswers = this.getRandomWrongAnswers(3);
        
        this.choices = [antonyms[0] || 'opposite', ...wrongAnswers];
        this.correctAnswerIndex = 0;
        
        // Shuffle choices
        const correctAnswer = this.choices[0];
        this.choices = this.shuffleArray(this.choices);
        this.correctAnswerIndex = this.choices.indexOf(correctAnswer);
        
        return {
            type: 'antonym',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `Find an antonym for "${this.currentWord.word}":`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generateWordFormQuestion() {
        const forms = this.getWordForms(this.currentWord.word);
        const wrongAnswers = this.getRandomWrongAnswers(3);
        
        this.choices = [forms[0] || this.currentWord.word, ...wrongAnswers];
        this.correctAnswerIndex = 0;
        
        // Shuffle choices
        const correctAnswer = this.choices[0];
        this.choices = this.shuffleArray(this.choices);
        this.correctAnswerIndex = this.choices.indexOf(correctAnswer);
        
        return {
            type: 'word_form',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `What is the correct form of "${this.currentWord.word}"?`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generateCollocationQuestion() {
        const collocations = this.getCollocations(this.currentWord.word);
        const wrongAnswers = this.getRandomWrongAnswers(3);
        
        this.choices = [collocations[0] || this.currentWord.word, ...wrongAnswers];
        this.correctAnswerIndex = 0;
        
        // Shuffle choices
        const correctAnswer = this.choices[0];
        this.choices = this.shuffleArray(this.choices);
        this.correctAnswerIndex = this.choices.indexOf(correctAnswer);
        
        return {
            type: 'collocation',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `Which word commonly goes with "${this.currentWord.word}"?`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generateIdiomQuestion() {
        const idioms = this.getIdioms(this.currentWord.word);
        const wrongAnswers = this.getRandomWrongAnswers(3);
        
        this.choices = [idioms[0] || this.currentWord.word, ...wrongAnswers];
        this.correctAnswerIndex = 0;
        
        // Shuffle choices
        const correctAnswer = this.choices[0];
        this.choices = this.shuffleArray(this.choices);
        this.correctAnswerIndex = this.choices.indexOf(correctAnswer);
        
        return {
            type: 'idiom',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `What does the idiom "${this.currentWord.word}" mean?`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generatePhrasalVerbQuestion() {
        const phrasals = this.getPhrasalVerbs(this.currentWord.word);
        const wrongAnswers = this.getRandomWrongAnswers(3);
        
        this.choices = [phrasals[0] || this.currentWord.word, ...wrongAnswers];
        this.correctAnswerIndex = 0;
        
        // Shuffle choices
        const correctAnswer = this.choices[0];
        this.choices = this.shuffleArray(this.choices);
        this.correctAnswerIndex = this.choices.indexOf(correctAnswer);
        
        return {
            type: 'phrasal_verb',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `What does the phrasal verb "${this.currentWord.word}" mean?`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generateWordFamilyQuestion() {
        const family = this.getWordFamily(this.currentWord.word);
        const wrongAnswers = this.getRandomWrongAnswers(3);
        
        this.choices = [family[0] || this.currentWord.word, ...wrongAnswers];
        this.correctAnswerIndex = 0;
        
        // Shuffle choices
        const correctAnswer = this.choices[0];
        this.choices = this.shuffleArray(this.choices);
        this.correctAnswerIndex = this.choices.indexOf(correctAnswer);
        
        return {
            type: 'word_family',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `Which word belongs to the same family as "${this.currentWord.word}"?`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generatePronunciationQuestion() {
        const pronunciations = this.getPronunciations(this.currentWord.word);
        const wrongAnswers = this.getRandomWrongAnswers(3);
        
        this.choices = [pronunciations[0] || this.currentWord.word, ...wrongAnswers];
        this.correctAnswerIndex = 0;
        
        // Shuffle choices
        const correctAnswer = this.choices[0];
        this.choices = this.shuffleArray(this.choices);
        this.correctAnswerIndex = this.choices.indexOf(correctAnswer);
        
        return {
            type: 'pronunciation',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `How do you pronounce "${this.currentWord.word}"?`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generateEtymologyQuestion() {
        const etymologies = this.getEtymologies(this.currentWord.word);
        const wrongAnswers = this.getRandomWrongAnswers(3);
        
        this.choices = [etymologies[0] || this.currentWord.word, ...wrongAnswers];
        this.correctAnswerIndex = 0;
        
        // Shuffle choices
        const correctAnswer = this.choices[0];
        this.choices = this.shuffleArray(this.choices);
        this.correctAnswerIndex = this.choices.indexOf(correctAnswer);
        
        return {
            type: 'etymology',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `What is the origin of "${this.currentWord.word}"?`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generateContextQuestion() {
        const contexts = [
            'In a business meeting',
            'At a restaurant',
            'In a classroom',
            'At a hospital',
            'At an airport',
            'In a shopping mall',
            'At a library',
            'In a gym',
            'At a bank',
            'In a park'
        ];
        
        this.choices = contexts;
        this.correctAnswerIndex = Math.floor(Math.random() * contexts.length);
        
        return {
            type: 'context',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `In which context would you use "${this.currentWord.word}"?`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generateDefinitionQuestion() {
        const definitions = [
            'A person who...',
            'An action that...',
            'A thing that...',
            'A quality that...',
            'A place where...',
            'A time when...',
            'A way to...',
            'A reason why...',
            'A result of...',
            'A part of...'
        ];
        
        this.choices = definitions;
        this.correctAnswerIndex = Math.floor(Math.random() * definitions.length);
        
        return {
            type: 'definition',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `What is the definition of "${this.currentWord.word}"?`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generateUsageQuestion() {
        const usages = [
            'As a noun',
            'As a verb',
            'As an adjective',
            'As an adverb',
            'As a preposition',
            'As a conjunction',
            'As an interjection',
            'As a pronoun',
            'As an article',
            'As a determiner'
        ];
        
        this.choices = usages;
        this.correctAnswerIndex = Math.floor(Math.random() * usages.length);
        
        return {
            type: 'usage',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `How is "${this.currentWord.word}" used in a sentence?`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generateCategoryQuestion() {
        const categories = [
            'Food and Drinks',
            'Family and Relationships',
            'Work and Business',
            'Travel and Transportation',
            'Health and Medicine',
            'Education and Learning',
            'Sports and Recreation',
            'Technology and Science',
            'Arts and Entertainment',
            'Nature and Environment'
        ];
        
        this.choices = categories;
        this.correctAnswerIndex = Math.floor(Math.random() * categories.length);
        
        return {
            type: 'category',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `Which category does "${this.currentWord.word}" belong to?`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    generateLevelQuestion() {
        const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        
        this.choices = levels;
        this.correctAnswerIndex = levels.indexOf(this.currentWord.level || 'Intermediate');
        
        return {
            type: 'level',
            word: this.currentWord.word,
            level: this.currentWord.level,
            question: `What is the difficulty level of "${this.currentWord.word}"?`,
            choices: this.choices,
            correctIndex: this.correctAnswerIndex
        };
    }
    
    getRandomWrongAnswers(count) {
        if (!window.dataManager) {
            return ['Option 1', 'Option 2', 'Option 3'];
        }
        
        // Get wrong answers from different categories and levels
        const wrongAnswers = [];
        const usedWords = new Set([this.currentWord.word]);
        
        // Try to get wrong answers from different categories
        const categories = window.dataManager.getAllCategories();
        const shuffledCategories = window.dataManager.shuffleArray(categories);
        
        for (const category of shuffledCategories) {
            if (wrongAnswers.length >= count) break;
            
            const categoryWord = window.dataManager.getRandomWordFromCategory(category, Array.from(usedWords));
            if (categoryWord && categoryWord.examples && categoryWord.examples[0]) {
                wrongAnswers.push(categoryWord.examples[0]);
                usedWords.add(categoryWord.word);
            }
        }
        
        // Fill remaining slots with random words
        while (wrongAnswers.length < count) {
            const randomWord = window.dataManager.getRandomWords(1)[0];
            if (randomWord && !usedWords.has(randomWord.word) && randomWord.examples && randomWord.examples[0]) {
                wrongAnswers.push(randomWord.examples[0]);
                usedWords.add(randomWord.word);
            }
        }
        
        return wrongAnswers.slice(0, count);
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    async checkAnswer(answerIndex, responseTime) {
        const isCorrect = answerIndex === this.correctAnswerIndex;
        
        return {
            isCorrect: isCorrect,
            correctAnswer: this.choices[this.correctAnswerIndex],
            explanation: isCorrect ? 
                `Correct! "${this.currentWord.word}" means: ${this.choices[this.correctAnswerIndex]}` :
                `Wrong. "${this.currentWord.word}" means: ${this.choices[this.correctAnswerIndex]}`,
            points: isCorrect ? 10 : 0,
            word: this.currentWord.word,
            feedbackDuration: 2000
        };
    }
    
    getHint() {
        return {
            text: `This word is ${this.currentWord.level} level. Think about: ${this.currentWord.category || 'general vocabulary'}`
        };
    }
    
    getCurrentWord() {
        return this.currentWord?.word || null;
    }
    
    async displayQuestion(questionData) {
        await super.displayQuestion(questionData);
        
        const container = document.getElementById('multipleChoiceContainer');
        if (!container) return;
        
        // Update question display
        const questionElement = container.querySelector('#questionText');
        if (questionElement) {
            questionElement.textContent = questionData.question || `What does "${questionData.word}" mean?`;
            questionElement.className = `text-xl font-semibold text-white mb-4 text-center`;
        }
        
        // Update word display
        const wordElement = container.querySelector('#questionWord');
        if (wordElement) {
            wordElement.textContent = questionData.word;
            wordElement.className = `text-4xl font-bold text-accent mb-6 animate-pulse`;
        }
        
        // Update question type indicator
        const typeElement = container.querySelector('#questionType');
        if (typeElement) {
            const typeLabels = {
                'meaning': 'Meaning',
                'synonym': 'Synonym',
                'antonym': 'Antonym',
                'word_form': 'Word Form',
                'collocation': 'Collocation',
                'idiom': 'Idiom',
                'phrasal_verb': 'Phrasal Verb',
                'word_family': 'Word Family',
                'pronunciation': 'Pronunciation',
                'etymology': 'Etymology',
                'context': 'Context',
                'definition': 'Definition',
                'usage': 'Usage',
                'category': 'Category',
                'level': 'Level'
            };
            typeElement.textContent = typeLabels[questionData.type] || 'Question';
            typeElement.className = `inline-block bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm font-medium mb-2`;
        }
        
        // Update choices
        const choicesContainer = container.querySelector('#choicesContainer');
        if (choicesContainer) {
            choicesContainer.innerHTML = '';
            
            questionData.choices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.className = 'choice-btn glass-effect p-4 rounded-xl text-left hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer';
                button.innerHTML = `
                    <div class="flex items-center">
                        <span class="w-8 h-8 bg-primary/30 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                            ${String.fromCharCode(65 + index)}
                        </span>
                        <span class="text-white flex-grow">${choice}</span>
                    </div>
                `;
                
                button.onclick = () => this.selectChoice(index);
                choicesContainer.appendChild(button);
            });
        }
    }
    
    async selectChoice(index) {
        // Use new feedback system
        if (window.answerFeedback) {
            window.answerFeedback.showFeedback(index, this.correctAnswerIndex, '.choice-btn');
        }
        
        // Submit answer through game engine
        if (window.gameEngine) {
            await window.gameEngine.submitAnswer(index);
        }
    }
    
    handleNumberKey(number) {
        if (number >= 1 && number <= 4) {
            this.selectChoice(number - 1);
        }
    }
    
    getHTML() {
        return `
            <div class="max-w-4xl mx-auto p-6">
                <div id="multipleChoiceContainer" class="space-y-6">
                    <div class="text-center">
                        <h2 class="text-2xl font-bold text-white mb-4">
                            <i data-lucide="check-circle-2" class="w-8 h-8 inline mr-2"></i>
                            Enhanced Multiple Choice Challenge
                        </h2>
                        <p class="text-white/80 mb-6">Test your knowledge with various question types</p>
                        
                        <!-- Question Type Indicator -->
                        <div id="questionType" class="inline-block bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm font-medium mb-2">
                            Question Type
                        </div>
                        
                        <!-- Question Text -->
                        <div id="questionText" class="text-xl font-semibold text-white mb-4 text-center">
                            What does this word mean?
                        </div>
                        
                        <!-- Word Display -->
                        <div id="questionWord" class="text-4xl font-bold text-accent mb-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 inline-block">
                            Loading...
                        </div>
                    </div>
                    <div id="choicesContainer" class="grid gap-3 max-w-2xl mx-auto">
                        <!-- Choices will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }
}

class ConversationGame extends BaseGame {
    constructor() {
        super();
        this.usedConversations = new Set();
        this.conversationHistory = [];
        this.maxHistorySize = 50;
        this.conversations = [
            // Restaurant & Food
            {
                context: "At a restaurant",
                question: "What would you say when you want to order food?",
                choices: [
                    "I would like to order the chicken, please.",
                    "Where is the bathroom?", 
                    "Can you give me the bill?",
                    "What time do you close?"
                ],
                correctIndex: 0,
                explanation: "When ordering food, you should politely state what you want."
            },
            {
                context: "At a restaurant",
                question: "How do you ask for the bill?",
                choices: [
                    "Can I have the menu?",
                    "Where is the bathroom?",
                    "Could I have the bill, please?",
                    "What do you recommend?"
                ],
                correctIndex: 2,
                explanation: "Politely ask for the bill using 'Could I have' or 'May I have'."
            },
            {
                context: "At a restaurant",
                question: "What do you say when you want to make a reservation?",
                choices: [
                    "I want to eat now.",
                    "Do you have a table for two at 7 PM?",
                    "What's on the menu?",
                    "How much does it cost?"
                ],
                correctIndex: 1,
                explanation: "Be specific about the number of people and time when making a reservation."
            },
            
            // Hotel & Travel
            {
                context: "At a hotel reception",
                question: "How do you check in to your hotel room?",
                choices: [
                    "I want to complain about the noise.",
                    "I have a reservation under the name Smith.",
                    "Can you call me a taxi?",
                    "Where is the restaurant?"
                ],
                correctIndex: 1,
                explanation: "When checking in, you should mention your reservation."
            },
            {
                context: "At a hotel reception",
                question: "How do you ask for room service?",
                choices: [
                    "I want to go out.",
                    "Can you bring breakfast to my room?",
                    "Where is the gym?",
                    "What time is checkout?"
                ],
                correctIndex: 1,
                explanation: "Ask politely for what you need from room service."
            },
            {
                context: "At a hotel reception",
                question: "What do you say when you want to extend your stay?",
                choices: [
                    "I'm leaving tomorrow.",
                    "Can I extend my reservation for two more nights?",
                    "Where is the nearest restaurant?",
                    "What's the weather like?"
                ],
                correctIndex: 1,
                explanation: "Be specific about how many additional nights you need."
            },
            
            // Shopping & Retail
            {
                context: "Shopping at a store",
                question: "What do you ask when looking for something specific?",
                choices: [
                    "How much does this cost?",
                    "Do you have this in a different size?",
                    "Can you help me find the electronics section?",
                    "What time do you close?"
                ],
                correctIndex: 2,
                explanation: "When looking for something specific, ask for help finding it."
            },
            {
                context: "Shopping at a store",
                question: "How do you ask about the price of an item?",
                choices: [
                    "I want to buy this.",
                    "How much does this cost?",
                    "Where is the cashier?",
                    "Do you accept credit cards?"
                ],
                correctIndex: 1,
                explanation: "Use 'How much does this cost?' to ask about prices."
            },
            {
                context: "Shopping at a store",
                question: "What do you say when you want to try on clothes?",
                choices: [
                    "I want to buy this.",
                    "Can I try this on?",
                    "Where is the bathroom?",
                    "How much is it?"
                ],
                correctIndex: 1,
                explanation: "Ask politely 'Can I try this on?' when you want to test clothes."
            },
            
            // Social & Introductions
            {
                context: "Meeting someone new",
                question: "How do you introduce yourself politely?",
                choices: [
                    "Hello, my name is John. Nice to meet you.",
                    "Hey, what's up?",
                    "I'm busy right now.",
                    "See you later."
                ],
                correctIndex: 0,
                explanation: "A polite introduction includes your name and a greeting."
            },
            {
                context: "Meeting someone new",
                question: "What do you say when someone introduces themselves?",
                choices: [
                    "I don't care.",
                    "Nice to meet you too. I'm Sarah.",
                    "Where are you from?",
                    "What do you do?"
                ],
                correctIndex: 1,
                explanation: "Respond with 'Nice to meet you too' and introduce yourself."
            },
            {
                context: "Meeting someone new",
                question: "How do you ask someone's name politely?",
                choices: [
                    "What's your name?",
                    "Excuse me, what's your name?",
                    "Who are you?",
                    "Tell me your name."
                ],
                correctIndex: 1,
                explanation: "Start with 'Excuse me' to be polite when asking for someone's name."
            },
            
            // Directions & Navigation
            {
                context: "Asking for directions",
                question: "How do you politely ask for directions?",
                choices: [
                    "I'm lost.",
                    "Excuse me, could you tell me how to get to the train station?",
                    "Where am I?",
                    "This place is confusing."
                ],
                correctIndex: 1,
                explanation: "Start with 'Excuse me' and be specific about where you want to go."
            },
            {
                context: "Asking for directions",
                question: "What do you say when you want to confirm directions?",
                choices: [
                    "I don't understand.",
                    "Could you repeat that, please?",
                    "I'm still lost.",
                    "This is too complicated."
                ],
                correctIndex: 1,
                explanation: "Politely ask for clarification if you don't understand the directions."
            },
            {
                context: "Asking for directions",
                question: "How do you thank someone for giving you directions?",
                choices: [
                    "I'm still lost.",
                    "That's not helpful.",
                    "Thank you very much for your help.",
                    "I'll find it myself."
                ],
                correctIndex: 2,
                explanation: "Always thank people who help you with directions."
            },
            
            // Business & Work
            {
                context: "In a business meeting",
                question: "How do you start a business presentation?",
                choices: [
                    "Let's get this over with.",
                    "Good morning everyone, thank you for coming today.",
                    "I'm tired of meetings.",
                    "What time is lunch?"
                ],
                correctIndex: 1,
                explanation: "Start with a greeting and thank people for their time."
            },
            {
                context: "In a business meeting",
                question: "What do you say when you disagree with someone?",
                choices: [
                    "You're wrong.",
                    "I see your point, but I have a different perspective.",
                    "This is stupid.",
                    "I don't care."
                ],
                correctIndex: 1,
                explanation: "Express disagreement politely and respectfully."
            },
            {
                context: "In a business meeting",
                question: "How do you ask for clarification?",
                choices: [
                    "I don't understand anything.",
                    "Could you clarify what you mean by that?",
                    "This makes no sense.",
                    "I'm confused."
                ],
                correctIndex: 1,
                explanation: "Ask politely for clarification when you need more information."
            },
            
            // Healthcare & Medical
            {
                context: "At a doctor's office",
                question: "How do you describe your symptoms?",
                choices: [
                    "I feel terrible.",
                    "I've been experiencing headaches for the past week.",
                    "I'm sick.",
                    "I need medicine."
                ],
                correctIndex: 1,
                explanation: "Be specific about your symptoms and how long you've had them."
            },
            {
                context: "At a doctor's office",
                question: "What do you say when making an appointment?",
                choices: [
                    "I want to see a doctor.",
                    "I'd like to make an appointment for a check-up.",
                    "I'm sick.",
                    "When can you see me?"
                ],
                correctIndex: 1,
                explanation: "Be specific about the type of appointment you need."
            },
            {
                context: "At a doctor's office",
                question: "How do you ask about medication side effects?",
                choices: [
                    "Will this make me sick?",
                    "What are the possible side effects of this medication?",
                    "I don't want to take medicine.",
                    "Is this safe?"
                ],
                correctIndex: 1,
                explanation: "Ask specifically about side effects to understand the medication."
            },
            
            // Education & Learning
            {
                context: "In a classroom",
                question: "How do you ask a question in class?",
                choices: [
                    "I don't understand.",
                    "Excuse me, could you explain that again?",
                    "This is too hard.",
                    "I'm confused."
                ],
                correctIndex: 1,
                explanation: "Start with 'Excuse me' and ask your question politely."
            },
            {
                context: "In a classroom",
                question: "What do you say when you need help with homework?",
                choices: [
                    "I can't do this.",
                    "Could you help me understand this problem?",
                    "This is impossible.",
                    "I give up."
                ],
                correctIndex: 1,
                explanation: "Ask politely for help with specific problems."
            },
            {
                context: "In a classroom",
                question: "How do you ask to go to the bathroom?",
                choices: [
                    "I need to go to the bathroom.",
                    "May I be excused to use the restroom?",
                    "I have to pee.",
                    "Can I leave?"
                ],
                correctIndex: 1,
                explanation: "Use polite language when asking to leave the classroom."
            },
            {
                context: "In a classroom",
                question: "What do you say when you don't understand the lesson?",
                choices: [
                    "This makes no sense.",
                    "I'm sorry, but I don't understand. Could you explain it differently?",
                    "This is stupid.",
                    "I'm lost."
                ],
                correctIndex: 1,
                explanation: "Politely express confusion and ask for clarification."
            },
            
            // Transportation & Travel
            {
                context: "At a train station",
                question: "How do you ask about train schedules?",
                choices: [
                    "When does the train come?",
                    "Excuse me, what time does the next train to London leave?",
                    "I need to go now.",
                    "Is the train late?"
                ],
                correctIndex: 1,
                explanation: "Be specific about your destination when asking about schedules."
            },
            {
                context: "At a train station",
                question: "What do you say when buying a ticket?",
                choices: [
                    "I want a ticket.",
                    "I'd like a one-way ticket to Manchester, please.",
                    "Give me a ticket.",
                    "How much is it?"
                ],
                correctIndex: 1,
                explanation: "Be specific about the type of ticket and destination."
            },
            {
                context: "At a train station",
                question: "How do you ask about platform information?",
                choices: [
                    "Where is my train?",
                    "Excuse me, which platform does the train to Birmingham leave from?",
                    "I'm lost.",
                    "Where do I go?"
                ],
                correctIndex: 1,
                explanation: "Ask specifically about platform numbers for your destination."
            },
            {
                context: "At an airport",
                question: "How do you ask about flight delays?",
                choices: [
                    "Is my flight delayed?",
                    "Excuse me, is flight BA123 delayed?",
                    "I'm going to miss my flight.",
                    "What's happening?"
                ],
                correctIndex: 1,
                explanation: "Provide your flight number when asking about delays."
            },
            {
                context: "At an airport",
                question: "What do you say when checking in luggage?",
                choices: [
                    "I have bags.",
                    "I'd like to check in two bags, please.",
                    "Take my luggage.",
                    "How much does it cost?"
                ],
                correctIndex: 1,
                explanation: "Be specific about the number of bags you want to check in."
            },
            {
                context: "At an airport",
                question: "How do you ask about gate information?",
                choices: [
                    "Where is my gate?",
                    "Could you tell me which gate flight AA456 is departing from?",
                    "I'm lost.",
                    "Where do I go?"
                ],
                correctIndex: 1,
                explanation: "Provide your flight number when asking about gate information."
            },
            
            // Technology & Communication
            {
                context: "Using a smartphone",
                question: "How do you ask someone to help with your phone?",
                choices: [
                    "My phone is broken.",
                    "Could you help me set up my new phone?",
                    "I don't know how to use this.",
                    "This is too complicated."
                ],
                correctIndex: 1,
                explanation: "Ask politely for help with specific tasks."
            },
            {
                context: "Using a smartphone",
                question: "What do you say when you can't connect to WiFi?",
                choices: [
                    "The internet doesn't work.",
                    "Excuse me, could you help me connect to the WiFi?",
                    "I can't get online.",
                    "This is frustrating."
                ],
                correctIndex: 1,
                explanation: "Ask politely for help with technical issues."
            },
            {
                context: "Using a smartphone",
                question: "How do you ask for someone's phone number?",
                choices: [
                    "What's your number?",
                    "Could I have your phone number, please?",
                    "Give me your number.",
                    "I need to call you."
                ],
                correctIndex: 1,
                explanation: "Ask politely for contact information."
            },
            
            // Entertainment & Leisure
            {
                context: "At a movie theater",
                question: "How do you ask about movie times?",
                choices: [
                    "When is the movie?",
                    "What time does the new action movie start?",
                    "I want to see a movie.",
                    "Is it playing now?"
                ],
                correctIndex: 1,
                explanation: "Be specific about which movie you're interested in."
            },
            {
                context: "At a movie theater",
                question: "What do you say when buying tickets?",
                choices: [
                    "I want tickets.",
                    "I'd like two tickets for the 7 PM showing, please.",
                    "Give me tickets.",
                    "How much is it?"
                ],
                correctIndex: 1,
                explanation: "Be specific about the number of tickets and showtime."
            },
            {
                context: "At a movie theater",
                question: "How do you ask about seat selection?",
                choices: [
                    "Where do I sit?",
                    "Could I have seats in the middle section, please?",
                    "I want good seats.",
                    "What seats are available?"
                ],
                correctIndex: 1,
                explanation: "Be specific about your seating preferences."
            },
            {
                context: "At a concert",
                question: "How do you ask about the concert schedule?",
                choices: [
                    "When does it start?",
                    "What time does the concert begin?",
                    "I want to know the time.",
                    "Is it starting soon?"
                ],
                correctIndex: 1,
                explanation: "Ask directly about the start time."
            },
            {
                context: "At a concert",
                question: "What do you say when you can't see the stage?",
                choices: [
                    "I can't see.",
                    "Excuse me, could you move a little so I can see the stage?",
                    "You're blocking my view.",
                    "I can't see anything."
                ],
                correctIndex: 1,
                explanation: "Ask politely for people to move so you can see."
            },
            
            // Health & Fitness
            {
                context: "At a gym",
                question: "How do you ask for help with equipment?",
                choices: [
                    "I don't know how to use this.",
                    "Excuse me, could you show me how to use this machine?",
                    "This is too hard.",
                    "I need help."
                ],
                correctIndex: 1,
                explanation: "Ask politely for instruction on how to use gym equipment."
            },
            {
                context: "At a gym",
                question: "What do you say when you want to join a class?",
                choices: [
                    "I want to join.",
                    "Could I sign up for the yoga class, please?",
                    "I need to exercise.",
                    "When is the class?"
                ],
                correctIndex: 1,
                explanation: "Be specific about which class you want to join."
            },
            {
                context: "At a gym",
                question: "How do you ask about membership fees?",
                choices: [
                    "How much does it cost?",
                    "Could you tell me about your membership rates?",
                    "I want to know the price.",
                    "Is it expensive?"
                ],
                correctIndex: 1,
                explanation: "Ask politely about membership pricing."
            },
            
            // Weather & Environment
            {
                context: "Talking about weather",
                question: "How do you ask about the weather forecast?",
                choices: [
                    "What's the weather like?",
                    "Could you tell me what the weather will be like tomorrow?",
                    "Is it going to rain?",
                    "I need to know the weather."
                ],
                correctIndex: 1,
                explanation: "Be specific about which day you want to know about."
            },
            {
                context: "Talking about weather",
                question: "What do you say when it's raining?",
                choices: [
                    "It's raining.",
                    "It looks like it's going to rain. Should we bring an umbrella?",
                    "I hate rain.",
                    "The weather is bad."
                ],
                correctIndex: 1,
                explanation: "Make suggestions about how to handle the weather."
            },
            {
                context: "Talking about weather",
                question: "How do you ask someone about their weather preferences?",
                choices: [
                    "Do you like rain?",
                    "What kind of weather do you prefer?",
                    "I like sunny weather.",
                    "Weather is important."
                ],
                correctIndex: 1,
                explanation: "Ask about someone's weather preferences politely."
            },
            
            // Food & Cooking
            {
                context: "At a grocery store",
                question: "How do you ask for help finding an item?",
                choices: [
                    "I can't find it.",
                    "Excuse me, could you help me find the organic vegetables?",
                    "Where is everything?",
                    "I'm lost in here."
                ],
                correctIndex: 1,
                explanation: "Be specific about what you're looking for."
            },
            {
                context: "At a grocery store",
                question: "What do you say when asking about product freshness?",
                choices: [
                    "Is this fresh?",
                    "Could you tell me when this bread was baked?",
                    "I want fresh food.",
                    "How old is this?"
                ],
                correctIndex: 1,
                explanation: "Ask specifically about the product's freshness or date."
            },
            {
                context: "At a grocery store",
                question: "How do you ask about special offers?",
                choices: [
                    "Are there any deals?",
                    "Do you have any special offers on meat today?",
                    "I want cheap food.",
                    "What's on sale?"
                ],
                correctIndex: 1,
                explanation: "Be specific about which products you're interested in."
            },
            {
                context: "In a kitchen",
                question: "How do you ask for cooking advice?",
                choices: [
                    "How do I cook this?",
                    "Could you give me some tips on how to prepare this fish?",
                    "I don't know how to cook.",
                    "This is too difficult."
                ],
                correctIndex: 1,
                explanation: "Ask for specific cooking advice politely."
            },
            {
                context: "In a kitchen",
                question: "What do you say when you need cooking ingredients?",
                choices: [
                    "I need ingredients.",
                    "Could you help me find the ingredients for this recipe?",
                    "I don't have what I need.",
                    "This recipe is impossible."
                ],
                correctIndex: 1,
                explanation: "Ask for help finding specific ingredients."
            },
            
            // Family & Relationships
            {
                context: "Talking about family",
                question: "How do you ask about someone's family?",
                choices: [
                    "Tell me about your family.",
                    "Do you have any siblings?",
                    "I want to know about your family.",
                    "Family is important."
                ],
                correctIndex: 1,
                explanation: "Ask specific questions about family members."
            },
            {
                context: "Talking about family",
                question: "What do you say when talking about your children?",
                choices: [
                    "I have kids.",
                    "My daughter is studying at university.",
                    "Children are expensive.",
                    "Kids are difficult."
                ],
                correctIndex: 1,
                explanation: "Share specific information about your children."
            },
            {
                context: "Talking about family",
                question: "How do you ask about family traditions?",
                choices: [
                    "What do you do for holidays?",
                    "Could you tell me about your family's holiday traditions?",
                    "I want to know your traditions.",
                    "Traditions are important."
                ],
                correctIndex: 1,
                explanation: "Ask politely about family customs and traditions."
            },
            
            // Hobbies & Interests
            {
                context: "Talking about hobbies",
                question: "How do you ask about someone's hobbies?",
                choices: [
                    "What do you do for fun?",
                    "What hobbies do you enjoy in your free time?",
                    "I want to know your hobbies.",
                    "Hobbies are interesting."
                ],
                correctIndex: 1,
                explanation: "Ask specifically about leisure activities."
            },
            {
                context: "Talking about hobbies",
                question: "What do you say when sharing your interests?",
                choices: [
                    "I like things.",
                    "I'm really interested in photography and hiking.",
                    "I have many hobbies.",
                    "Interests are important."
                ],
                correctIndex: 1,
                explanation: "Be specific about your interests and hobbies."
            },
            {
                context: "Talking about hobbies",
                question: "How do you ask someone to join your activity?",
                choices: [
                    "Come with me.",
                    "Would you like to join me for a photography walk this weekend?",
                    "I want you to come.",
                    "It would be fun."
                ],
                correctIndex: 1,
                explanation: "Invite someone politely to join your activity."
            },
            
            // In a classroom
            {
                context: "In a classroom",
                question: "How do you participate in a class discussion?",
                choices: [
                    "I have nothing to say.",
                    "I'd like to share my thoughts on this topic.",
                    "This is boring.",
                    "I don't care."
                ],
                correctIndex: 1,
                explanation: "Express your interest in participating politely."
            },
            
            // Transportation & Travel
            {
                context: "At an airport",
                question: "How do you check in for your flight?",
                choices: [
                    "I want to go home.",
                    "I'd like to check in for my flight to London.",
                    "Where is my plane?",
                    "I'm late."
                ],
                correctIndex: 1,
                explanation: "Be specific about your destination when checking in."
            },
            {
                context: "At an airport",
                question: "What do you say when going through security?",
                choices: [
                    "I don't want to do this.",
                    "I have nothing to declare.",
                    "This is taking too long.",
                    "I'm in a hurry."
                ],
                correctIndex: 1,
                explanation: "Declare that you have nothing to declare when going through security."
            },
            {
                context: "At an airport",
                question: "How do you ask about flight delays?",
                choices: [
                    "Why is my flight late?",
                    "Excuse me, is my flight delayed?",
                    "I'm angry about this.",
                    "When will we leave?"
                ],
                correctIndex: 1,
                explanation: "Ask politely about flight status and delays."
            }
        ];
        this.currentConversation = null;
    }
    
    async generateQuestion(questionNumber) {
        // Get available conversations (not used recently)
        const availableConversations = this.conversations.filter((conv, index) => 
            !this.usedConversations.has(index)
        );
        
        // If all conversations have been used, reset the used set
        if (availableConversations.length === 0) {
            this.usedConversations.clear();
            console.log('🔄 All conversations used, resetting for new cycle');
        }
        
        // Select from available conversations
        const availableIndices = this.conversations
            .map((conv, index) => this.usedConversations.has(index) ? -1 : index)
            .filter(index => index !== -1);
        
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        this.currentConversation = this.conversations[randomIndex];
        
        // Mark this conversation as used
        this.usedConversations.add(randomIndex);
        
        // Add to history
        this.conversationHistory.push({
            index: randomIndex,
            context: this.currentConversation.context,
            question: this.currentConversation.question,
            timestamp: Date.now()
        });
        
        // Keep history size manageable
        if (this.conversationHistory.length > this.maxHistorySize) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistorySize);
        }
        
        console.log(`🎯 Selected conversation ${randomIndex + 1}/${this.conversations.length} (${this.usedConversations.size} used)`);
        
        return {
            context: this.currentConversation.context,
            question: this.currentConversation.question,
            choices: this.currentConversation.choices,
            correctIndex: this.currentConversation.correctIndex,
            conversationIndex: randomIndex,
            totalConversations: this.conversations.length,
            usedCount: this.usedConversations.size
        };
    }
    
    async checkAnswer(answerIndex, responseTime) {
        const isCorrect = answerIndex === this.currentConversation.correctIndex;
        
        return {
            isCorrect: isCorrect,
            correctAnswer: this.currentConversation.choices[this.currentConversation.correctIndex],
            explanation: this.currentConversation.explanation,
            points: isCorrect ? 10 : 0,
            word: this.currentConversation.context,
            feedbackDuration: 3000
        };
    }
    
    getHint() {
        return {
            text: `Think about what would be most appropriate in this situation: ${this.currentConversation.context}`
        };
    }
    
    async displayQuestion(questionData) {
        await super.displayQuestion(questionData);
        
        const container = document.getElementById('conversationContainer');
        if (!container) return;
        
        const content = container.querySelector('#conversationContent');
        if (content) {
            content.innerHTML = `
                <div class="space-y-6">
                    <div class="context-card bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                        <h3 class="text-lg font-semibold text-blue-200 mb-2">
                            <i data-lucide="map-pin" class="w-5 h-5 inline mr-2"></i>
                            Situation
                        </h3>
                        <p class="text-white">${questionData.context}</p>
                    </div>
                    
                    <div class="question-card bg-white/10 rounded-xl p-4">
                        <h3 class="text-lg font-semibold text-white mb-3">
                            <i data-lucide="help-circle" class="w-5 h-5 inline mr-2"></i>
                            ${questionData.question}
                        </h3>
                    </div>
                    
                    <div class="choices-grid grid gap-3">
                        ${questionData.choices.map((choice, index) => `
                            <button class="conversation-choice glass-effect p-4 rounded-xl text-left hover:bg-white/20 transition-all duration-300 cursor-pointer" onclick="window.gameEngine.gameModes.conversation.selectChoice(${index})">
                                <div class="flex items-start">
                                    <span class="w-8 h-8 bg-primary/30 rounded-full flex items-center justify-center mr-4 text-white font-bold flex-shrink-0 mt-1">
                                        ${String.fromCharCode(65 + index)}
                                    </span>
                                    <span class="text-white">${choice}</span>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    async selectChoice(index) {
        // Use new feedback system
        if (window.answerFeedback) {
            window.answerFeedback.showFeedback(index, this.currentConversation.correctIndex, '.conversation-choice');
        }
        
        if (window.gameEngine) {
            await window.gameEngine.submitAnswer(index);
        }
    }
    
    handleNumberKey(number) {
        if (number >= 1 && number <= 4) {
            this.selectChoice(number - 1);
        }
    }
    
    getHTML() {
        return `
            <div class="max-w-4xl mx-auto p-6">
                <div id="conversationContainer" class="space-y-6">
                    <div class="text-center">
                        <h2 class="text-2xl font-bold text-white mb-4">
                            <i data-lucide="message-circle" class="w-8 h-8 inline mr-2"></i>
                            Conversation Practice
                        </h2>
                        <p class="text-white/80 mb-6">Practice real-world conversations and responses</p>
                    </div>
                    <div id="conversationContent" class="glass-effect rounded-2xl p-6">
                        <!-- Conversation content will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }
}

class ModalVerbsGame extends BaseGame {
    constructor() {
        super();
        this.usedQuestions = new Set();
        this.questionHistory = [];
        this.maxHistorySize = 50;
        this.modalQuestions = [
            {
                sentence: "I _____ visit my grandmother this weekend.",
                options: ["am going to", "am planning to", "am supposed to", "might"],
                correct: 0,
                explanation: "We use 'going to' for definite plans or intentions.",
                type: "going to"
            },
            {
                sentence: "We _____ have a meeting tomorrow at 3 PM.",
                options: ["are supposed to", "might", "are going to", "should"],
                correct: 0,
                explanation: "We use 'supposed to' for scheduled obligations or expectations.",
                type: "supposed to"
            },
            {
                sentence: "They _____ buy a new car next month.",
                options: ["might", "are planning to", "are supposed to", "will"],
                correct: 1,
                explanation: "We use 'planning to' for thought-out intentions or arrangements.",
                type: "planning to"
            },
            {
                sentence: "She _____ finish her homework before dinner.",
                options: ["is going to", "is planning to", "is supposed to", "must"],
                correct: 2,
                explanation: "We use 'supposed to' for expected or required actions.",
                type: "supposed to"
            }
        ];
        this.currentQuestion = null;
    }
    
    async generateQuestion(questionNumber) {
        // Get available questions (not used recently)
        const availableQuestions = this.modalQuestions.filter((question, index) => 
            !this.usedQuestions.has(index)
        );
        
        // If all questions have been used, reset the used set
        if (availableQuestions.length === 0) {
            this.usedQuestions.clear();
            console.log('🔄 All modal questions used, resetting for new cycle');
        }
        
        // Select from available questions
        const availableIndices = this.modalQuestions
            .map((question, index) => this.usedQuestions.has(index) ? -1 : index)
            .filter(index => index !== -1);
        
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        this.currentQuestion = this.modalQuestions[randomIndex];
        
        // Mark this question as used
        this.usedQuestions.add(randomIndex);
        
        // Add to history
        this.questionHistory.push({
            index: randomIndex,
            sentence: this.currentQuestion.sentence,
            timestamp: Date.now()
        });
        
        // Keep history size manageable
        if (this.questionHistory.length > this.maxHistorySize) {
            this.questionHistory = this.questionHistory.slice(-this.maxHistorySize);
        }
        
        console.log(`🎯 Selected modal question ${randomIndex + 1}/${this.modalQuestions.length} (${this.usedQuestions.size} used)`);
        
        return {
            sentence: this.currentQuestion.sentence,
            options: this.currentQuestion.options,
            correctIndex: this.currentQuestion.correct,
            type: this.currentQuestion.type,
            questionIndex: randomIndex,
            totalQuestions: this.modalQuestions.length,
            usedCount: this.usedQuestions.size
        };
    }
    
    async checkAnswer(answerIndex, responseTime) {
        const isCorrect = answerIndex === this.currentQuestion.correct;
        
        return {
            isCorrect: isCorrect,
            correctAnswer: this.currentQuestion.options[this.currentQuestion.correct],
            explanation: this.currentQuestion.explanation,
            points: isCorrect ? 10 : 0,
            word: this.currentQuestion.type,
            feedbackDuration: 3000
        };
    }
    
    getHint() {
        return {
            text: `Think about ${this.currentQuestion.type}: ${this.getModalHint(this.currentQuestion.type)}`
        };
    }
    
    getModalHint(type) {
        const hints = {
            "going to": "Used for definite plans and intentions",
            "planning to": "Used for thought-out arrangements",
            "supposed to": "Used for obligations and expectations"
        };
        return hints[type] || "Think about the context of the sentence";
    }
    
    async displayQuestion(questionData) {
        await super.displayQuestion(questionData);
        
        const container = document.getElementById('modalVerbsContainer');
        if (!container) return;
        
        const content = container.querySelector('#modalVerbsContent');
        if (content) {
            content.innerHTML = `
                <div class="space-y-6">
                    <div class="sentence-card bg-indigo-500/20 border border-indigo-400/30 rounded-xl p-6 text-center">
                        <h3 class="text-xl font-semibold text-white mb-4">Complete the sentence:</h3>
                        <p class="text-2xl text-indigo-200 font-medium">${questionData.sentence}</p>
                    </div>
                    
                    <div class="options-grid grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${questionData.options.map((option, index) => `
                            <button class="modal-choice glass-effect p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300 cursor-pointer" onclick="window.gameEngine.gameModes.modalVerbs.selectChoice(${index})">
                                <div class="flex items-center justify-center">
                                    <span class="w-8 h-8 bg-indigo-500/30 rounded-full flex items-center justify-center mr-3 text-white font-bold">
                                        ${String.fromCharCode(65 + index)}
                                    </span>
                                    <span class="text-white font-medium">${option}</span>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    async selectChoice(index) {
        // Use new feedback system
        if (window.answerFeedback) {
            window.answerFeedback.showFeedback(index, this.currentQuestion.correct, '.modal-choice');
        }
        
        if (window.gameEngine) {
            await window.gameEngine.submitAnswer(index);
        }
    }
    
    handleNumberKey(number) {
        if (number >= 1 && number <= 4) {
            this.selectChoice(number - 1);
        }
    }
    
    getHTML() {
        return `
            <div class="max-w-4xl mx-auto p-6">
                <div id="modalVerbsContainer" class="space-y-6">
                    <div class="text-center">
                        <h2 class="text-2xl font-bold text-white mb-4">
                            <i data-lucide="arrow-right-left" class="w-8 h-8 inline mr-2"></i>
                            Modal Verbs Practice
                        </h2>
                        <p class="text-white/80 mb-6">Master "going to", "planning to", and "supposed to"</p>
                    </div>
                    <div id="modalVerbsContent" class="glass-effect rounded-2xl p-6">
                        <!-- Modal verbs content will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }
}

class TimeTellingGame extends BaseGame {
    constructor() {
        super();
        this.currentTime = null;
        this.currentQuestion = null; // Store current question data
        this.timeExpressions = [
            { time: "3:00", expressions: ["three o'clock", "3 o'clock", "three"] },
            { time: "3:15", expressions: ["quarter past three", "fifteen past three", "three fifteen"] },
            { time: "3:30", expressions: ["half past three", "thirty past three", "three thirty"] },
            { time: "3:45", expressions: ["quarter to four", "fifteen to four", "three forty-five"] },
            { time: "2:10", expressions: ["ten past two", "two ten", "ten after two"] },
            { time: "4:50", expressions: ["ten to five", "four fifty", "ten before five"] },
            { time: "7:25", expressions: ["twenty-five past seven", "seven twenty-five"] },
            { time: "9:35", expressions: ["twenty-five to ten", "nine thirty-five"] },
            { time: "12:00", expressions: ["twelve o'clock", "noon", "midday"] },
            { time: "6:05", expressions: ["five past six", "six oh five"] }
        ];
    }
    
    async generateQuestion(questionNumber) {
        // If we already have a current question and this is not a new question, return it
        if (this.currentQuestion && questionNumber === 0) {
            return this.currentQuestion;
        }
        
        // Reset for new question
        this.currentQuestion = null;
        
        const timeData = this.timeExpressions[Math.floor(Math.random() * this.timeExpressions.length)];
        this.currentTime = timeData;
        
        const questionTypes = ['digital_to_words', 'words_to_digital', 'clock_reading'];
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        let questionData;
        
        if (questionType === 'digital_to_words') {
            const wrongAnswers = this.getRandomExpressions(3, timeData.expressions[0]);
            const choices = [timeData.expressions[0], ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            questionData = {
                type: 'digital_to_words',
                digitalTime: timeData.time,
                question: 'How do you say this time?',
                choices: shuffled,
                correctIndex: shuffled.indexOf(timeData.expressions[0]),
                clockDisplay: this.generateClockSVG(timeData.time)
            };
        } else if (questionType === 'words_to_digital') {
            const wrongTimes = this.getRandomTimes(3, timeData.time);
            const choices = [timeData.time, ...wrongTimes];
            const shuffled = this.shuffleArray(choices);
            
            questionData = {
                type: 'words_to_digital',
                timeExpression: timeData.expressions[0],
                question: 'What time is this?',
                choices: shuffled,
                correctIndex: shuffled.indexOf(timeData.time)
            };
        } else {
            const wrongAnswers = this.getRandomExpressions(3, timeData.expressions[0]);
            const choices = [timeData.expressions[0], ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            questionData = {
                type: 'clock_reading',
                question: 'Read the time on the clock:',
                choices: shuffled,
                correctIndex: shuffled.indexOf(timeData.expressions[0]),
                clockDisplay: this.generateClockSVG(timeData.time)
            };
        }
        
        // Store current question for consistent access
        this.currentQuestion = questionData;
        return questionData;
    }
    
    generateClockSVG(time) {
        const [hours, minutes] = time.split(':').map(Number);
        const hourAngle = (hours % 12) * 30 + minutes * 0.5; // 30 degrees per hour + minute adjustment
        const minuteAngle = minutes * 6; // 6 degrees per minute
        
        return `
            <svg width="200" height="200" viewBox="0 0 200 200" class="mx-auto">
                <!-- Clock face -->
                <circle cx="100" cy="100" r="90" fill="white" stroke="#333" stroke-width="2"/>
                
                <!-- Hour markers -->
                ${Array.from({length: 12}, (_, i) => {
                    const angle = i * 30 - 90;
                    const x1 = 100 + 75 * Math.cos(angle * Math.PI / 180);
                    const y1 = 100 + 75 * Math.sin(angle * Math.PI / 180);
                    const x2 = 100 + 85 * Math.cos(angle * Math.PI / 180);
                    const y2 = 100 + 85 * Math.sin(angle * Math.PI / 180);
                    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#333" stroke-width="2"/>`;
                }).join('')}
                
                <!-- Numbers -->
                ${Array.from({length: 12}, (_, i) => {
                    const num = i === 0 ? 12 : i;
                    const angle = i * 30 - 90;
                    const x = 100 + 65 * Math.cos(angle * Math.PI / 180);
                    const y = 100 + 65 * Math.sin(angle * Math.PI / 180);
                    return `<text x="${x}" y="${y}" text-anchor="middle" dy="5" font-size="14" font-weight="bold">${num}</text>`;
                }).join('')}
                
                <!-- Hour hand -->
                <line x1="100" y1="100" 
                      x2="${100 + 50 * Math.cos((hourAngle - 90) * Math.PI / 180)}" 
                      y2="${100 + 50 * Math.sin((hourAngle - 90) * Math.PI / 180)}" 
                      stroke="#333" stroke-width="6" stroke-linecap="round"/>
                
                <!-- Minute hand -->
                <line x1="100" y1="100" 
                      x2="${100 + 70 * Math.cos((minuteAngle - 90) * Math.PI / 180)}" 
                      y2="${100 + 70 * Math.sin((minuteAngle - 90) * Math.PI / 180)}" 
                      stroke="#333" stroke-width="4" stroke-linecap="round"/>
                
                <!-- Center dot -->
                <circle cx="100" cy="100" r="5" fill="#333"/>
            </svg>
        `;
    }
    
    getRandomExpressions(count, exclude) {
        const allExpressions = this.timeExpressions.flatMap(t => t.expressions);
        const filtered = allExpressions.filter(exp => exp !== exclude);
        const result = [];
        
        for (let i = 0; i < count && i < filtered.length; i++) {
            const randomExp = filtered[Math.floor(Math.random() * filtered.length)];
            if (!result.includes(randomExp)) {
                result.push(randomExp);
            }
        }
        return result;
    }
    
    getRandomTimes(count, exclude) {
        const allTimes = this.timeExpressions.map(t => t.time);
        const filtered = allTimes.filter(time => time !== exclude);
        const result = [];
        
        for (let i = 0; i < count && i < filtered.length; i++) {
            const randomTime = filtered[Math.floor(Math.random() * filtered.length)];
            if (!result.includes(randomTime)) {
                result.push(randomTime);
            }
        }
        return result;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    async checkAnswer(answerIndex, responseTime) {
        // Use stored current question data for consistency
        if (!this.currentQuestion) {
            console.error('❌ No current question data available for TimeTelling');
            return { isCorrect: false, error: 'No question data' };
        }
        
        const isCorrect = answerIndex === this.currentQuestion.correctIndex;
        
        return {
            isCorrect: isCorrect,
            correctAnswer: this.currentQuestion.choices[this.currentQuestion.correctIndex],
            explanation: isCorrect ? 
                `Perfect! "${this.currentTime.time}" is correctly expressed as "${this.currentQuestion.choices[this.currentQuestion.correctIndex]}"` :
                `Not quite. "${this.currentTime.time}" should be "${this.currentQuestion.choices[this.currentQuestion.correctIndex]}"`,
            points: isCorrect ? 10 : 0,
            word: this.currentTime.time,
            feedbackDuration: 3000
        };
    }
    
    getHint() {
        return {
            text: `Remember: quarter = 15 minutes, half = 30 minutes. "Past" for first 30 minutes, "to" for last 30 minutes.`
        };
    }
    
    async nextQuestion() {
        // Reset current question for new generation
        this.currentQuestion = null;
        this.currentTime = null;
        
        // Generate and display new question
        const questionData = await this.generateQuestion(1); // Use 1 to force new question
        await this.displayQuestion(questionData);
        
        console.log('🕐 New time telling question generated');
    }
    
    async displayQuestion(questionData) {
        await super.displayQuestion(questionData);
        
        const container = document.getElementById('timeTellingContainer');
        if (!container) return;
        
        const content = container.querySelector('#timeTellingContent');
        if (content) {
            content.innerHTML = `
                <div class="space-y-6">
                    <div class="question-card bg-yellow-400/20 border border-yellow-400/30 rounded-xl p-6 text-center">
                        <h3 class="text-xl font-semibold text-white mb-4">${questionData.question}</h3>
                        
                        <!-- Clock Image Background -->
                        <div class="clock-background mb-6 flex justify-center">
                            <img src="assets/images/clock-time.jpg" alt="Clock" 
                                 class="rounded-xl shadow-lg w-48 h-48 object-cover border-2 border-yellow-400/30 opacity-80"
                                 onerror="this.style.display='none';">
                        </div>
                        
                        ${questionData.clockDisplay ? `
                            <div class="clock-display mb-6">
                                ${questionData.clockDisplay}
                            </div>
                        ` : ''}
                        
                        ${questionData.digitalTime ? `
                            <div class="digital-time text-4xl font-bold text-yellow-200 mb-4 bg-black/30 rounded-lg p-4 inline-block">
                                ${questionData.digitalTime}
                            </div>
                        ` : ''}
                        
                        ${questionData.timeExpression ? `
                            <div class="time-expression text-2xl font-semibold text-yellow-200 mb-4">
                                "${questionData.timeExpression}"
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="choices-grid grid gap-3">
                        ${questionData.choices.map((choice, index) => `
                            <button class="time-choice glass-effect p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300 cursor-pointer" onclick="window.gameEngine.gameModes.timeTelling.selectChoice(${index})">
                                <div class="flex items-center justify-center">
                                    <span class="w-8 h-8 bg-yellow-400/30 rounded-full flex items-center justify-center mr-3 text-white font-bold">
                                        ${String.fromCharCode(65 + index)}
                                    </span>
                                    <span class="text-white font-medium">${choice}</span>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    async selectChoice(index) {
        // Use new unified feedback system
        if (window.answerFeedback && this.currentQuestion) {
            window.answerFeedback.showFeedback(index, this.currentQuestion.correctIndex, '.time-choice');
        }
        
        if (window.gameEngine) {
            await window.gameEngine.submitAnswer(index);
        }
    }
    
    handleNumberKey(number) {
        if (number >= 1 && number <= 4) {
            this.selectChoice(number - 1);
        }
    }
    
    getHTML() {
        return `
            <div class="max-w-4xl mx-auto p-6">
                <div id="timeTellingContainer" class="space-y-6">
                    <div class="text-center">
                        <h2 class="text-2xl font-bold text-white mb-4">
                            <i data-lucide="clock" class="w-8 h-8 inline mr-2"></i>
                            Time Telling Practice
                        </h2>
                        <p class="text-white/80 mb-6">Master time expressions with interactive clocks</p>
                    </div>
                    <div id="timeTellingContent" class="glass-effect rounded-2xl p-6">
                        <!-- Time telling content will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }
}

class CategorySortGame extends BaseGame {
    constructor() {
        super();
        this.categories = {
            "Colors": ["red", "blue", "green", "yellow", "purple", "orange", "pink", "black", "white", "gray"],
            "Animals": ["cat", "dog", "elephant", "lion", "tiger", "bird", "fish", "horse", "cow", "sheep"],
            "Food": ["apple", "banana", "bread", "cheese", "chicken", "rice", "pasta", "pizza", "cake", "soup"],
            "Body Parts": ["head", "hand", "foot", "eye", "nose", "mouth", "ear", "arm", "leg", "finger"],
            "Weather": ["sunny", "rainy", "cloudy", "windy", "stormy", "snowy", "hot", "cold", "warm", "cool"],
            "Transportation": ["car", "bus", "train", "plane", "bicycle", "boat", "motorcycle", "truck", "taxi", "subway"],
            "Emotions": ["happy", "sad", "angry", "excited", "nervous", "calm", "surprised", "confused", "proud", "scared"],
            "Time": ["morning", "afternoon", "evening", "night", "today", "tomorrow", "yesterday", "week", "month", "year"]
        };
        this.currentWords = [];
        this.correctCategories = {};
        this.userAssignments = {};
        this.draggedElement = null;
    }
    
    async generateQuestion(questionNumber) {
        // Select 3 random categories
        const categoryNames = Object.keys(this.categories);
        const selectedCategories = [];
        
        for (let i = 0; i < 3 && i < categoryNames.length; i++) {
            let randomCategory;
            do {
                randomCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)];
            } while (selectedCategories.includes(randomCategory));
            selectedCategories.push(randomCategory);
        }
        
        // Get 2-3 words from each category
        this.currentWords = [];
        this.correctCategories = {};
        
        selectedCategories.forEach(category => {
            const wordsInCategory = this.categories[category];
            const selectedWords = [];
            
            for (let i = 0; i < 3; i++) {
                let randomWord;
                do {
                    randomWord = wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)];
                } while (selectedWords.includes(randomWord));
                selectedWords.push(randomWord);
                this.correctCategories[randomWord] = category;
            }
            
            this.currentWords.push(...selectedWords);
        });
        
        // Shuffle the words
        this.currentWords = this.shuffleArray(this.currentWords);
        this.userAssignments = {};
        
        return {
            type: 'category_sort',
            categories: selectedCategories,
            words: this.currentWords,
            question: 'Drag each word to its correct category'
        };
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    async checkAnswer(answerIndex, responseTime) {
        // Check if all words are assigned correctly
        let correctCount = 0;
        let totalWords = this.currentWords.length;
        
        for (const word of this.currentWords) {
            if (this.userAssignments[word] === this.correctCategories[word]) {
                correctCount++;
            }
        }
        
        const accuracy = Math.round((correctCount / totalWords) * 100);
        const isCorrect = correctCount === totalWords;
        
        return {
            isCorrect: isCorrect,
            correctAnswer: `${correctCount}/${totalWords} correct`,
            explanation: isCorrect ? 
                'Perfect! All words are in their correct categories!' :
                `You got ${correctCount} out of ${totalWords} words correct. ${accuracy}% accuracy.`,
            points: correctCount * 2,
            word: 'category sorting',
            feedbackDuration: 3000
        };
    }
    
    getHint() {
        const categories = Object.keys(this.correctCategories);
        return {
            text: `Think about what each word represents. Categories: ${categories.join(', ')}`
        };
    }
    
    async displayQuestion(questionData) {
        await super.displayQuestion(questionData);
        
        const container = document.getElementById('categorySortContainer');
        if (!container) return;
        
        const content = container.querySelector('#categorySortContent');
        if (content) {
            content.innerHTML = `
                <div class="space-y-6">
                    <div class="question-card bg-purple-500/20 border border-purple-400/30 rounded-xl p-6 text-center">
                        <h3 class="text-xl font-semibold text-white mb-4">${questionData.question}</h3>
                        <p class="text-purple-200">Drag and drop words into their correct categories</p>
                    </div>
                    
                    <!-- Words to sort -->
                    <div class="words-container">
                        <h4 class="text-lg font-semibold text-white mb-3">Words to Sort:</h4>
                        <div class="words-grid grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            ${questionData.words.map((word, index) => `
                                <div class="word-item glass-effect p-3 rounded-lg text-center cursor-move hover:bg-white/20 transition-all duration-300" 
                                     draggable="true" 
                                     data-word="${word}"
                                     ondragstart="window.gameEngine.gameModes.categorySort.handleDragStart(event)"
                                     ondragend="window.gameEngine.gameModes.categorySort.handleDragEnd(event)">
                                    <span class="text-white font-medium">${word}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Category containers -->
                    <div class="categories-container">
                        <h4 class="text-lg font-semibold text-white mb-3">Categories:</h4>
                        <div class="categories-grid grid md:grid-cols-3 gap-4">
                            ${questionData.categories.map(category => `
                                <div class="category-container glass-effect p-4 rounded-xl border-2 border-dashed border-white/30 min-h-[200px] transition-all duration-300"
                                     data-category="${category}"
                                     ondrop="window.gameEngine.gameModes.categorySort.handleDrop(event)"
                                     ondragover="window.gameEngine.gameModes.categorySort.handleDragOver(event)"
                                     ondragenter="window.gameEngine.gameModes.categorySort.handleDragEnter(event)"
                                     ondragleave="window.gameEngine.gameModes.categorySort.handleDragLeave(event)">
                                    <h5 class="text-center text-lg font-bold text-white mb-3 bg-purple-500/30 rounded-lg p-2">
                                        ${category}
                                    </h5>
                                    <div class="dropped-words space-y-2" data-category="${category}">
                                        <!-- Dropped words will appear here -->
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <button class="check-answers-btn glass-effect px-8 py-3 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300" onclick="window.gameEngine.gameModes.categorySort.checkAnswers()">
                            <i data-lucide="check-circle" class="w-5 h-5 inline mr-2"></i>
                            Check My Answers
                        </button>
                    </div>
                </div>
            `;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    handleDragStart(event) {
        this.draggedElement = event.target;
        event.target.style.opacity = '0.5';
        event.dataTransfer.setData('text/plain', event.target.dataset.word);
    }
    
    handleDragEnd(event) {
        event.target.style.opacity = '1';
        this.draggedElement = null;
    }
    
    handleDragOver(event) {
        event.preventDefault();
    }
    
    handleDragEnter(event) {
        event.preventDefault();
        if (event.target.classList.contains('category-container')) {
            event.target.style.borderColor = '#a855f7';
            event.target.style.backgroundColor = 'rgba(168, 85, 247, 0.1)';
        }
    }
    
    handleDragLeave(event) {
        if (event.target.classList.contains('category-container')) {
            event.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            event.target.style.backgroundColor = 'transparent';
        }
    }
    
    handleDrop(event) {
        event.preventDefault();
        
        const categoryContainer = event.target.closest('.category-container');
        if (!categoryContainer) return;
        
        const category = categoryContainer.dataset.category;
        const word = event.dataTransfer.getData('text/plain');
        
        // Reset container styles
        categoryContainer.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        categoryContainer.style.backgroundColor = 'transparent';
        
        // Remove word from previous category if exists
        this.removeWordFromCategories(word);
        
        // Add word to this category
        this.userAssignments[word] = category;
        
        // Update UI
        const droppedWordsContainer = categoryContainer.querySelector('.dropped-words');
        const wordElement = document.createElement('div');
        wordElement.className = 'dropped-word bg-white/20 p-2 rounded text-center text-white text-sm cursor-pointer hover:bg-white/30 transition-all duration-300';
        wordElement.dataset.word = word;
        wordElement.textContent = word;
        wordElement.onclick = () => this.removeWordFromCategory(word);
        
        droppedWordsContainer.appendChild(wordElement);
        
        // Hide the original word
        const originalWord = document.querySelector(`[data-word="${word}"].word-item`);
        if (originalWord) {
            originalWord.style.display = 'none';
        }
    }
    
    removeWordFromCategories(word) {
        // Remove from user assignments
        delete this.userAssignments[word];
        
        // Remove from UI
        const existingDropped = document.querySelector(`[data-word="${word}"].dropped-word`);
        if (existingDropped) {
            existingDropped.remove();
        }
        
        // Show original word
        const originalWord = document.querySelector(`[data-word="${word}"].word-item`);
        if (originalWord) {
            originalWord.style.display = 'block';
        }
    }
    
    removeWordFromCategory(word) {
        this.removeWordFromCategories(word);
    }
    
    checkAnswers() {
        if (window.gameEngine) {
            window.gameEngine.submitAnswer(0);
        }
    }
    
    getHTML() {
        return `
            <div class="max-w-6xl mx-auto p-6">
                <div id="categorySortContainer" class="space-y-6">
                    <div class="text-center">
                        <h2 class="text-2xl font-bold text-white mb-4">
                            <i data-lucide="layers" class="w-8 h-8 inline mr-2"></i>
                            Category Sort Challenge
                        </h2>
                        <p class="text-white/80 mb-6">Drag and drop words into their correct categories</p>
                    </div>
                    <div id="categorySortContent" class="space-y-6">
                        <!-- Category sort content will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }
}

class VisualLearningGame extends BaseGame {
    constructor() {
        super();
        this.currentWord = null;
        this.visualScenarios = [
            {
                scenario: "Restaurant Scene",
                description: "You are at a busy restaurant during lunch time",
                image: "assets/images/conversation-restaurant.jpg",
                words: ["menu", "waiter", "order", "table", "customer", "food", "drink", "bill"],
                context: "A customer is sitting at a table, looking at the menu while a waiter approaches"
            },
            {
                scenario: "Kitchen & Cooking",
                description: "You are in a modern kitchen preparing food",
                image: "assets/images/kitchen-cooking.jpg",
                words: ["cook", "recipe", "ingredient", "stove", "knife", "pan", "spice", "chef"],
                context: "A chef is preparing ingredients and cooking delicious meals in a professional kitchen"
            },
            {
                scenario: "Shopping Store",
                description: "You are at a busy retail store",
                image: "assets/images/shopping-store.jpg",
                words: ["store", "cashier", "receipt", "shopping", "customer", "price", "discount", "payment"],
                context: "People are browsing items in stores and making purchases at checkout counters"
            },
            {
                scenario: "Study & Learning",
                description: "You are in a library or study environment",
                image: "assets/images/books-study.jpg",
                words: ["book", "study", "library", "knowledge", "reading", "research", "notes", "learning"],
                context: "Students are studying with books and taking notes in a quiet library setting"
            },
            {
                scenario: "Classroom Learning",
                description: "You are in a classroom with students",
                image: "assets/images/students-learning.jpg",
                words: ["student", "teacher", "lesson", "classroom", "education", "homework", "exam", "grade"],
                context: "Students are actively participating in a classroom discussion with their teacher"
            }
        ];
    }
    
    async generateQuestion(questionNumber) {
        const scenario = this.visualScenarios[Math.floor(Math.random() * this.visualScenarios.length)];
        const targetWord = scenario.words[Math.floor(Math.random() * scenario.words.length)];
        this.currentWord = targetWord;
        
        // Get wrong answers from other scenarios
        const allWords = this.visualScenarios.flatMap(s => s.words);
        const wrongWords = allWords.filter(w => w !== targetWord && !scenario.words.includes(w));
        const wrongAnswers = [];
        
        for (let i = 0; i < 3 && i < wrongWords.length; i++) {
            let randomWrong;
            do {
                randomWrong = wrongWords[Math.floor(Math.random() * wrongWords.length)];
            } while (wrongAnswers.includes(randomWrong));
            wrongAnswers.push(randomWrong);
        }
        
        const choices = [targetWord, ...wrongAnswers];
        const shuffled = this.shuffleArray(choices);
        
        return {
            type: 'visual_learning',
            scenario: scenario.scenario,
            description: scenario.description,
            context: scenario.context,
            image: scenario.image,
            question: `In this ${scenario.scenario.toLowerCase()}, which word best fits the context?`,
            choices: shuffled,
            correctIndex: shuffled.indexOf(targetWord)
        };
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    async checkAnswer(answerIndex, responseTime) {
        const questionData = await this.generateQuestion(0);
        const isCorrect = answerIndex === questionData.correctIndex;
        
        return {
            isCorrect: isCorrect,
            correctAnswer: questionData.choices[questionData.correctIndex],
            explanation: isCorrect ? 
                `Perfect! "${this.currentWord}" fits perfectly in this context.` :
                `Not quite. "${questionData.choices[questionData.correctIndex]}" is more appropriate for this scenario.`,
            points: isCorrect ? 10 : 0,
            word: this.currentWord,
            feedbackDuration: 3000
        };
    }
    
    getHint() {
        return {
            text: `Think about what you would typically find or use in this scenario.`
        };
    }
    
    async displayQuestion(questionData) {
        await super.displayQuestion(questionData);
        
        const container = document.getElementById('visualLearningContainer');
        if (!container) return;
        
        const content = container.querySelector('#visualLearningContent');
        if (content) {
            content.innerHTML = `
                <div class="space-y-6">
                    <div class="scenario-card bg-teal-500/20 border border-teal-400/30 rounded-xl p-6">
                        <h3 class="text-2xl font-bold text-white mb-3 text-center">
                            <i data-lucide="image" class="w-6 h-6 inline mr-2"></i>
                            ${questionData.scenario}
                        </h3>
                        <p class="text-teal-200 text-center mb-4">${questionData.description}</p>
                        
                        ${questionData.image ? `
                            <div class="scenario-image mb-4 flex justify-center">
                                <img src="${questionData.image}" alt="${questionData.scenario}" 
                                     class="rounded-xl shadow-lg max-w-md w-full h-48 object-cover border-2 border-teal-400/30"
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <div class="bg-teal-500/20 rounded-xl p-8 text-center text-white hidden">
                                    <i data-lucide="image" class="w-16 h-16 mx-auto mb-2 text-teal-400"></i>
                                    <p class="text-teal-200">Image Loading...</p>
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="context-box bg-white/10 rounded-lg p-4">
                            <p class="text-white text-center italic">"${questionData.context}"</p>
                        </div>
                    </div>
                    
                    <div class="question-card bg-white/10 rounded-xl p-4 text-center">
                        <h4 class="text-lg font-semibold text-white">${questionData.question}</h4>
                    </div>
                    
                    <div class="choices-grid grid grid-cols-2 gap-3">
                        ${questionData.choices.map((choice, index) => `
                            <button class="visual-choice glass-effect p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300 cursor-pointer" onclick="window.gameEngine.gameModes.visualLearning.selectChoice(${index})">
                                <div class="flex items-center justify-center">
                                    <span class="w-8 h-8 bg-teal-500/30 rounded-full flex items-center justify-center mr-3 text-white font-bold">
                                        ${String.fromCharCode(65 + index)}
                                    </span>
                                    <span class="text-white font-medium">${choice}</span>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    async selectChoice(index) {
        // Use new unified feedback system
        if (window.answerFeedback && this.currentQuestion) {
            window.answerFeedback.showFeedback(index, this.currentQuestion.correctIndex, '.visual-choice');
        }
        
        if (window.gameEngine) {
            await window.gameEngine.submitAnswer(index);
        }
    }
    
    handleNumberKey(number) {
        if (number >= 1 && number <= 4) {
            this.selectChoice(number - 1);
        }
    }
    
    getHTML() {
        return `
            <div class="max-w-4xl mx-auto p-6">
                <div id="visualLearningContainer" class="space-y-6">
                    <div class="text-center">
                        <h2 class="text-2xl font-bold text-white mb-4">
                            <i data-lucide="eye" class="w-8 h-8 inline mr-2"></i>
                            Visual Learning
                        </h2>
                        <p class="text-white/80 mb-6">Learn vocabulary through real-world scenarios</p>
                    </div>
                    <div id="visualLearningContent" class="glass-effect rounded-2xl p-6">
                        <!-- Visual learning content will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }
}

class ConversationBuilderGame extends BaseGame {
    constructor() {
        super();
        this.conversationSteps = [
            {
                situation: "At a Restaurant",
                steps: [
                    { speaker: "Waiter", text: "Good evening! Welcome to our restaurant. How many people are you?" },
                    { speaker: "You", choices: ["Table for two, please.", "I have a reservation.", "Just one person."] },
                    { speaker: "Waiter", text: "Right this way. Here's your table and the menu." },
                    { speaker: "You", choices: ["Thank you.", "Could we have a different table?", "This looks great."] }
                ]
            },
            {
                situation: "At the Store",
                steps: [
                    { speaker: "Cashier", text: "Hi! Did you find everything you needed today?" },
                    { speaker: "You", choices: ["Yes, thank you.", "Actually, I'm looking for something.", "I need help finding an item."] },
                    { speaker: "Cashier", text: "Great! Your total comes to $25.50." },
                    { speaker: "You", choices: ["I'll pay with cash.", "Card, please.", "Do you accept mobile payments?"] }
                ]
            }
        ];
        this.currentConversation = null;
        this.currentStep = 0;
        this.userChoices = [];
    }
    
    async generateQuestion(questionNumber) {
        if (questionNumber === 0 || !this.currentConversation) {
            this.currentConversation = this.conversationSteps[Math.floor(Math.random() * this.conversationSteps.length)];
            this.currentStep = 0;
            this.userChoices = [];
        }
        
        const step = this.currentConversation.steps[this.currentStep];
        
        if (step.speaker === "You" && step.choices) {
            return {
                type: 'conversation_builder',
                situation: this.currentConversation.situation,
                previousText: this.currentStep > 0 ? this.currentConversation.steps[this.currentStep - 1].text : null,
                question: "What would you say?",
                choices: step.choices,
                correctIndex: 0, // All choices are valid in conversation building
                step: this.currentStep
            };
        } else {
            // This is a speaker line, advance automatically
            this.currentStep++;
            return this.generateQuestion(questionNumber);
        }
    }
    
    async checkAnswer(answerIndex, responseTime) {
        const step = this.currentConversation.steps[this.currentStep];
        const selectedChoice = step.choices[answerIndex];
        
        this.userChoices.push(selectedChoice);
        this.currentStep++;
        
        // Check if conversation is complete
        const isComplete = this.currentStep >= this.currentConversation.steps.length;
        
        return {
            isCorrect: true, // All choices are valid
            correctAnswer: selectedChoice,
            explanation: isComplete ? 
                "Great conversation! You've completed this scenario." :
                "Good choice! Let's continue the conversation.",
            points: 10,
            word: 'conversation',
            feedbackDuration: 2000,
            isComplete: isComplete
        };
    }
    
    async displayQuestion(questionData) {
        await super.displayQuestion(questionData);
        
        const container = document.getElementById('conversationBuilderContainer');
        if (!container) return;
        
        const content = container.querySelector('#conversationBuilderContent');
        if (content) {
            content.innerHTML = `
                <div class="space-y-6">
                    <div class="conversation-header text-center">
                        <h3 class="text-xl font-semibold text-white mb-2">
                            <i data-lucide="map-pin" class="w-5 h-5 inline mr-2"></i>
                            ${questionData.situation}
                        </h3>
                        <div class="progress-bar bg-white/20 rounded-full h-2 overflow-hidden">
                            <div class="bg-blue-400 h-full transition-all duration-500" style="width: ${(questionData.step / 4) * 100}%"></div>
                        </div>
                    </div>
                    
                    ${questionData.previousText ? `
                        <div class="speaker-bubble other-speaker glass-effect p-4 rounded-xl">
                            <div class="speaker-name text-blue-300 font-semibold mb-1">Other Person:</div>
                            <div class="text-white">"${questionData.previousText}"</div>
                        </div>
                    ` : ''}
                    
                    <div class="question-section">
                        <div class="question-prompt text-center mb-4">
                            <h4 class="text-lg font-semibold text-white">${questionData.question}</h4>
                        </div>
                        
                        <div class="choices-container space-y-3">
                            ${questionData.choices.map((choice, index) => `
                                <button class="conversation-builder-choice w-full glass-effect p-4 rounded-xl text-left hover:bg-white/20 transition-all duration-300 cursor-pointer" onclick="window.gameEngine.gameModes.conversationBuilder.selectChoice(${index})">
                                    <div class="flex items-center">
                                        <span class="w-8 h-8 bg-blue-400/30 rounded-full flex items-center justify-center mr-3 text-white font-bold">
                                            ${String.fromCharCode(65 + index)}
                                        </span>
                                        <span class="text-white font-medium">"${choice}"</span>
                                    </div>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    async selectChoice(index) {
        // Use new unified feedback system
        if (window.answerFeedback && this.currentQuestion) {
            window.answerFeedback.showFeedback(index, this.currentQuestion.correctIndex, '.conversation-builder-choice');
        }
        
        if (window.gameEngine) {
            await window.gameEngine.submitAnswer(index);
        }
    }
    
    getHTML() {
        return `
            <div class="max-w-4xl mx-auto p-6">
                <div id="conversationBuilderContainer" class="space-y-6">
                    <div class="text-center">
                        <h2 class="text-2xl font-bold text-white mb-4">
                            <i data-lucide="messages-square" class="w-8 h-8 inline mr-2"></i>
                            Conversation Builder
                        </h2>
                        <p class="text-white/80 mb-6">Practice building real conversations step by step</p>
                    </div>
                    <div id="conversationBuilderContent" class="glass-effect rounded-2xl p-6">
                        <!-- Conversation builder content will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }
}

class PrefixSuffixGame extends BaseGame {
    constructor() {
        super();
        this.wordFormationRules = {
            prefixes: [
                { prefix: "un-", meaning: "not, opposite", examples: ["happy → unhappy", "like → unlike", "able → unable"] },
                { prefix: "re-", meaning: "again, back", examples: ["do → redo", "write → rewrite", "build → rebuild"] },
                { prefix: "pre-", meaning: "before", examples: ["view → preview", "heat → preheat", "school → preschool"] },
                { prefix: "dis-", meaning: "not, opposite", examples: ["agree → disagree", "like → dislike", "honest → dishonest"] },
                { prefix: "mis-", meaning: "wrongly, badly", examples: ["understand → misunderstand", "use → misuse", "lead → mislead"] }
            ],
            suffixes: [
                { suffix: "-ful", meaning: "full of", examples: ["help → helpful", "care → careful", "wonder → wonderful"] },
                { suffix: "-less", meaning: "without", examples: ["care → careless", "hope → hopeless", "use → useless"] },
                { suffix: "-ness", meaning: "state of being", examples: ["happy → happiness", "dark → darkness", "kind → kindness"] },
                { suffix: "-ly", meaning: "in a manner", examples: ["quick → quickly", "careful → carefully", "slow → slowly"] },
                { suffix: "-er", meaning: "person who", examples: ["teach → teacher", "work → worker", "play → player"] }
            ]
        };
        this.currentRule = null;
        this.currentWord = null;
    }
    
    async generateQuestion(questionNumber) {
        const ruleType = Math.random() < 0.5 ? 'prefixes' : 'suffixes';
        const rules = this.wordFormationRules[ruleType];
        this.currentRule = rules[Math.floor(Math.random() * rules.length)];
        
        // Get a random example from the rule
        const example = this.currentRule.examples[Math.floor(Math.random() * this.currentRule.examples.length)];
        const [baseWord, formedWord] = example.split(' → ');
        
        const questionTypes = ['form_word', 'identify_meaning', 'choose_prefix_suffix'];
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        let questionData;
        
        if (questionType === 'form_word') {
            // Give base word, ask for formed word
            const wrongAnswers = this.getWrongFormations(baseWord, ruleType);
            const choices = [formedWord, ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            questionData = {
                type: 'form_word',
                baseWord: baseWord,
                affix: ruleType === 'prefixes' ? this.currentRule.prefix : this.currentRule.suffix,
                affixType: ruleType,
                question: `Add ${this.currentRule[ruleType.slice(0, -1)]} to "${baseWord}" to form a new word:`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(formedWord),
                explanation: `${this.currentRule[ruleType.slice(0, -1)]} means "${this.currentRule.meaning}"`
            };
        } else if (questionType === 'identify_meaning') {
            // Give formed word, ask for meaning
            const wrongMeanings = this.getWrongMeanings(this.currentRule.meaning);
            const choices = [this.currentRule.meaning, ...wrongMeanings];
            const shuffled = this.shuffleArray(choices);
            
            questionData = {
                type: 'identify_meaning',
                formedWord: formedWord,
                affix: ruleType === 'prefixes' ? this.currentRule.prefix : this.currentRule.suffix,
                question: `What does the ${ruleType.slice(0, -1)} in "${formedWord}" mean?`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(this.currentRule.meaning)
            };
        } else {
            // Give definition, ask for correct prefix/suffix
            const allAffixes = ruleType === 'prefixes' ? 
                this.wordFormationRules.prefixes.map(p => p.prefix) :
                this.wordFormationRules.suffixes.map(s => s.suffix);
            
            const wrongAffixes = allAffixes.filter(a => a !== this.currentRule[ruleType.slice(0, -1)]);
            const wrongAnswers = wrongAffixes.slice(0, 3);
            const choices = [this.currentRule[ruleType.slice(0, -1)], ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            questionData = {
                type: 'choose_affix',
                meaning: this.currentRule.meaning,
                question: `Which ${ruleType.slice(0, -1)} means "${this.currentRule.meaning}"?`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(this.currentRule[ruleType.slice(0, -1)])
            };
        }
        
        // Store current question for consistent access
        this.currentQuestion = questionData;
        return questionData;
    }
    
    getWrongFormations(baseWord, ruleType) {
        const wrongAffixes = ruleType === 'prefixes' ? 
            this.wordFormationRules.prefixes.map(p => p.prefix) :
            this.wordFormationRules.suffixes.map(s => s.suffix);
        
        return wrongAffixes
            .filter(affix => affix !== this.currentRule[ruleType.slice(0, -1)])
            .slice(0, 3)
            .map(affix => ruleType === 'prefixes' ? affix + baseWord : baseWord + affix);
    }
    
    getWrongMeanings(correctMeaning) {
        const allMeanings = [
            ...this.wordFormationRules.prefixes.map(p => p.meaning),
            ...this.wordFormationRules.suffixes.map(s => s.meaning)
        ];
        
        return allMeanings
            .filter(meaning => meaning !== correctMeaning)
            .slice(0, 3);
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    async checkAnswer(answerIndex, responseTime) {
        const questionData = await this.generateQuestion(0);
        const isCorrect = answerIndex === questionData.correctIndex;
        
        return {
            isCorrect: isCorrect,
            correctAnswer: questionData.choices[questionData.correctIndex],
            explanation: isCorrect ? 
                `Excellent! ${questionData.explanation || 'You understand word formation well!'}` :
                `Not quite. ${questionData.explanation || 'Try to remember the meaning of this affix.'}`,
            points: isCorrect ? 10 : 0,
            word: 'word formation',
            feedbackDuration: 3000
        };
    }
    
    getHint() {
        return {
            text: `Remember: ${this.currentRule[this.currentRule.prefix ? 'prefix' : 'suffix']} means "${this.currentRule.meaning}"`
        };
    }
    
    async displayQuestion(questionData) {
        await super.displayQuestion(questionData);
        
        const container = document.getElementById('prefixSuffixContainer');
        if (!container) return;
        
        const content = container.querySelector('#prefixSuffixContent');
        if (content) {
            content.innerHTML = `
                <div class="space-y-6">
                    <div class="rule-card bg-green-500/20 border border-green-400/30 rounded-xl p-6 text-center">
                        <h3 class="text-xl font-semibold text-white mb-3">
                            <i data-lucide="puzzle" class="w-6 h-6 inline mr-2"></i>
                            Word Formation Challenge
                        </h3>
                        ${questionData.explanation ? `
                            <div class="explanation-box bg-white/10 rounded-lg p-3 mb-4">
                                <p class="text-green-200 text-sm">${questionData.explanation}</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="question-card bg-white/10 rounded-xl p-6 text-center">
                        <h4 class="text-lg font-semibold text-white mb-4">${questionData.question}</h4>
                        
                        ${questionData.baseWord ? `
                            <div class="word-display mb-4">
                                <span class="text-2xl font-bold text-green-200 bg-white/10 rounded-lg px-4 py-2">
                                    ${questionData.baseWord}
                                </span>
                                <span class="text-white mx-2">+</span>
                                <span class="text-xl font-semibold text-green-300">
                                    ${questionData.affix}
                                </span>
                                <span class="text-white mx-2">=</span>
                                <span class="text-white">?</span>
                            </div>
                        ` : ''}
                        
                        ${questionData.formedWord ? `
                            <div class="word-display mb-4">
                                <span class="text-2xl font-bold text-green-200 bg-white/10 rounded-lg px-4 py-2">
                                    ${questionData.formedWord}
                                </span>
                            </div>
                        ` : ''}
                        
                        ${questionData.meaning && questionData.type === 'choose_affix' ? `
                            <div class="meaning-display mb-4">
                                <p class="text-lg text-green-200">Meaning: "${questionData.meaning}"</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="choices-grid grid grid-cols-2 gap-3">
                        ${questionData.choices.map((choice, index) => `
                            <button class="formation-choice glass-effect p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300 cursor-pointer" onclick="window.gameEngine.gameModes.prefixSuffix.selectChoice(${index})">
                                <div class="flex items-center justify-center">
                                    <span class="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center mr-3 text-white font-bold">
                                        ${String.fromCharCode(65 + index)}
                                    </span>
                                    <span class="text-white font-medium">${choice}</span>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    async selectChoice(index) {
        // Use new unified feedback system
        if (window.answerFeedback && this.currentQuestion) {
            window.answerFeedback.showFeedback(index, this.currentQuestion.correctIndex, '.formation-choice');
        }
        
        if (window.gameEngine) {
            await window.gameEngine.submitAnswer(index);
        }
    }
    
    handleNumberKey(number) {
        if (number >= 1 && number <= 4) {
            this.selectChoice(number - 1);
        }
    }
    
    getHTML() {
        return `
            <div class="max-w-4xl mx-auto p-6">
                <div id="prefixSuffixContainer" class="space-y-6">
                    <div class="text-center">
                        <h2 class="text-2xl font-bold text-white mb-4">
                            <i data-lucide="zap" class="w-8 h-8 inline mr-2"></i>
                            Word Formation Practice
                        </h2>
                        <p class="text-white/80 mb-6">Master prefixes and suffixes to build new words</p>
                    </div>
                    <div id="prefixSuffixContent" class="glass-effect rounded-2xl p-6">
                        <!-- Prefix/suffix content will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }
}

class ReadingComprehensionGame extends BaseGame {
    constructor() {
        super();
        this.readingTexts = [
            {
                title: "Daily Life: Shopping at the Grocery Store",
                text: "Sarah went to the grocery store on Saturday morning. She needed to buy ingredients for dinner. First, she picked up some fresh vegetables like tomatoes, onions, and carrots from the produce section. Then she went to the meat counter and bought chicken for the main dish. At the dairy section, she got milk, cheese, and eggs. Finally, she went to the bakery and bought a loaf of fresh bread. Sarah paid at the checkout counter and took her groceries home.",
                questions: [
                    {
                        question: "When did Sarah go shopping?",
                        choices: ["Friday evening", "Saturday morning", "Sunday afternoon", "Monday morning"],
                        correct: 1,
                        explanation: "The text clearly states 'Sarah went to the grocery store on Saturday morning.'"
                    },
                    {
                        question: "What was Sarah's main purpose for shopping?",
                        choices: ["To buy snacks", "To buy ingredients for dinner", "To buy cleaning supplies", "To buy birthday gifts"],
                        correct: 1,
                        explanation: "The text says 'She needed to buy ingredients for dinner.'"
                    },
                    {
                        question: "Where did Sarah buy the chicken?",
                        choices: ["Produce section", "Dairy section", "Meat counter", "Bakery"],
                        correct: 2,
                        explanation: "The text mentions 'she went to the meat counter and bought chicken.'"
                    }
                ]
            },
            {
                title: "Communication: Making a Phone Call",
                text: "John needed to call his doctor's office to make an appointment. He dialed the number and waited for someone to answer. The receptionist greeted him politely and asked how she could help. John explained that he needed a check-up appointment and preferred sometime next week. The receptionist checked the schedule and offered him Tuesday at 2:00 PM or Thursday at 10:00 AM. John chose Tuesday because it was more convenient for his work schedule. The receptionist confirmed the appointment and reminded him to bring his insurance card.",
                questions: [
                    {
                        question: "Why did John call the doctor's office?",
                        choices: ["To cancel an appointment", "To make a check-up appointment", "To ask about medication", "To complain about service"],
                        correct: 1,
                        explanation: "John 'explained that he needed a check-up appointment.'"
                    },
                    {
                        question: "Which appointment time did John choose?",
                        choices: ["Monday at 3:00 PM", "Tuesday at 2:00 PM", "Thursday at 10:00 AM", "Friday at 1:00 PM"],
                        correct: 1,
                        explanation: "John 'chose Tuesday' when offered Tuesday at 2:00 PM or Thursday at 10:00 AM."
                    },
                    {
                        question: "What did the receptionist remind John to bring?",
                        choices: ["His appointment card", "His medical records", "His insurance card", "His prescription"],
                        correct: 2,
                        explanation: "The receptionist 'reminded him to bring his insurance card.'"
                    }
                ]
            },
            {
                title: "Travel: At the Airport",
                text: "Maria arrived at the airport two hours before her international flight. First, she went to the check-in counter to get her boarding pass and drop off her large suitcase. The airline staff weighed her luggage and gave her a baggage claim ticket. Next, she went through security screening, where she had to remove her shoes and put her carry-on bag through the X-ray machine. After passing security, she found her departure gate and sat down to wait. She bought a coffee and a sandwich while waiting for the boarding announcement.",
                questions: [
                    {
                        question: "How early did Maria arrive at the airport?",
                        choices: ["One hour early", "Two hours early", "Three hours early", "Thirty minutes early"],
                        correct: 1,
                        explanation: "Maria 'arrived at the airport two hours before her international flight.'"
                    },
                    {
                        question: "What did Maria have to remove during security screening?",
                        choices: ["Her jacket", "Her belt", "Her shoes", "Her watch"],
                        correct: 2,
                        explanation: "She 'had to remove her shoes' during security screening."
                    },
                    {
                        question: "What did Maria do while waiting at the gate?",
                        choices: ["Read a book", "Made phone calls", "Bought coffee and a sandwich", "Slept"],
                        correct: 2,
                        explanation: "She 'bought a coffee and a sandwich while waiting for the boarding announcement.'"
                    }
                ]
            },
            {
                title: "Technology: Using Smartphones",
                text: "Smartphones have become essential tools in modern life. People use them for communication, navigation, entertainment, and work. Many apps help users stay organized with calendars, reminders, and note-taking features. Social media apps allow people to connect with friends and family around the world. However, it's important to use smartphones responsibly and not let them interfere with face-to-face conversations or sleep.",
                questions: [
                    {
                        question: "What are smartphones used for according to the text?",
                        choices: ["Only making calls", "Communication, navigation, entertainment, and work", "Just playing games", "Only taking photos"],
                        correct: 1,
                        explanation: "The text mentions smartphones are used for 'communication, navigation, entertainment, and work.'"
                    },
                    {
                        question: "What do social media apps allow people to do?",
                        choices: ["Make phone calls", "Connect with friends and family around the world", "Play games", "Take photos"],
                        correct: 1,
                        explanation: "Social media apps 'allow people to connect with friends and family around the world.'"
                    },
                    {
                        question: "What should people be careful about when using smartphones?",
                        choices: ["The battery life", "Not letting them interfere with face-to-face conversations", "The screen size", "The storage space"],
                        correct: 1,
                        explanation: "People should 'not let them interfere with face-to-face conversations or sleep.'"
                    }
                ]
            },
            {
                title: "Health: Exercise and Fitness",
                text: "Regular exercise is important for maintaining good health. Physical activity helps strengthen muscles, improve cardiovascular health, and boost mental well-being. There are many types of exercise, including walking, running, swimming, and cycling. Even simple activities like taking the stairs instead of the elevator can make a difference. It's recommended to get at least 30 minutes of moderate exercise most days of the week.",
                questions: [
                    {
                        question: "What does regular exercise help with?",
                        choices: ["Only weight loss", "Strengthening muscles, improving cardiovascular health, and boosting mental well-being", "Only building muscles", "Only improving sleep"],
                        correct: 1,
                        explanation: "Exercise 'helps strengthen muscles, improve cardiovascular health, and boost mental well-being.'"
                    },
                    {
                        question: "What is an example of simple physical activity?",
                        choices: ["Running a marathon", "Taking the stairs instead of the elevator", "Lifting heavy weights", "Playing video games"],
                        correct: 1,
                        explanation: "The text mentions 'taking the stairs instead of the elevator' as a simple activity."
                    },
                    {
                        question: "How much exercise is recommended?",
                        choices: ["10 minutes daily", "30 minutes most days of the week", "2 hours daily", "Only on weekends"],
                        correct: 1,
                        explanation: "It's recommended to get 'at least 30 minutes of moderate exercise most days of the week.'"
                    }
                ]
            },
            {
                title: "Education: Learning New Languages",
                text: "Learning a new language opens many opportunities for personal and professional growth. It helps people communicate with others from different cultures and can improve job prospects. There are various methods to learn languages, including classes, online courses, language exchange programs, and immersion experiences. Practice is essential for language learning, and using the language in real conversations helps build confidence and fluency.",
                questions: [
                    {
                        question: "What benefits does learning a new language provide?",
                        choices: ["Only better grades", "Opportunities for personal and professional growth", "Only travel opportunities", "Only making friends"],
                        correct: 1,
                        explanation: "Learning a new language 'opens many opportunities for personal and professional growth.'"
                    },
                    {
                        question: "What methods are mentioned for learning languages?",
                        choices: ["Only books", "Classes, online courses, language exchange programs, and immersion experiences", "Only watching TV", "Only listening to music"],
                        correct: 1,
                        explanation: "Methods include 'classes, online courses, language exchange programs, and immersion experiences.'"
                    },
                    {
                        question: "What is essential for language learning?",
                        choices: ["Having a good teacher", "Practice", "Expensive materials", "Living in another country"],
                        correct: 1,
                        explanation: "The text states that 'Practice is essential for language learning.'"
                    }
                ]
            },
            {
                title: "Environment: Recycling and Conservation",
                text: "Recycling is an important way to protect our environment and conserve natural resources. When we recycle materials like paper, plastic, and metal, we reduce waste and save energy. Many communities have recycling programs that make it easy for residents to participate. People can also help by reducing their consumption, reusing items when possible, and choosing products with less packaging. Small actions can make a big difference in environmental protection.",
                questions: [
                    {
                        question: "What does recycling help protect?",
                        choices: ["Only money", "Our environment and natural resources", "Only time", "Only space"],
                        correct: 1,
                        explanation: "Recycling is 'an important way to protect our environment and conserve natural resources.'"
                    },
                    {
                        question: "What materials are mentioned for recycling?",
                        choices: ["Only paper", "Paper, plastic, and metal", "Only plastic", "Only metal"],
                        correct: 1,
                        explanation: "The text mentions recycling 'materials like paper, plastic, and metal.'"
                    },
                    {
                        question: "How can people help with environmental protection?",
                        choices: ["Only by recycling", "By reducing consumption, reusing items, and choosing products with less packaging", "Only by buying more products", "Only by using more energy"],
                        correct: 1,
                        explanation: "People can help 'by reducing their consumption, reusing items when possible, and choosing products with less packaging.'"
                    }
                ]
            }
        ];
        this.currentText = null;
        this.currentQuestionIndex = 0;
    }
    
    async generateQuestion(questionNumber) {
        if (questionNumber === 0 || !this.currentText) {
            // Select a new reading text
            this.currentText = this.readingTexts[Math.floor(Math.random() * this.readingTexts.length)];
            this.currentQuestionIndex = 0;
        }
        
        const question = this.currentText.questions[this.currentQuestionIndex];
        
        return {
            type: 'reading_comprehension',
            title: this.currentText.title,
            text: this.currentText.text,
            question: question.question,
            choices: question.choices,
            correctIndex: question.correct,
            explanation: question.explanation,
            isFirstQuestion: this.currentQuestionIndex === 0
        };
    }
    
    async checkAnswer(answerIndex, responseTime) {
        const question = this.currentText.questions[this.currentQuestionIndex];
        const isCorrect = answerIndex === question.correct;
        
        // Move to next question for next time
        this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.currentText.questions.length;
        
        return {
            isCorrect: isCorrect,
            correctAnswer: question.choices[question.correct],
            explanation: question.explanation,
            points: isCorrect ? 10 : 0,
            word: 'reading comprehension',
            feedbackDuration: 4000
        };
    }
    
    getHint() {
        return {
            text: "Read the text carefully and look for specific details that answer the question."
        };
    }
    
    async displayQuestion(questionData) {
        await super.displayQuestion(questionData);
        
        const container = document.getElementById('readingComprehensionContainer');
        if (!container) return;
        
        const content = container.querySelector('#readingComprehensionContent');
        if (content) {
            content.innerHTML = `
                <div class="space-y-6">
                    <div class="reading-passage bg-blue-500/20 border border-blue-400/30 rounded-xl p-6">
                        <h3 class="text-xl font-bold text-white mb-4 text-center">
                            <i data-lucide="book-open" class="w-6 h-6 inline mr-2"></i>
                            ${questionData.title}
                        </h3>
                        <div class="passage-text bg-white/10 rounded-lg p-6 mb-4">
                            <p class="text-white leading-relaxed text-lg">${questionData.text}</p>
                        </div>
                    </div>
                    
                    <div class="question-section bg-white/10 rounded-xl p-6">
                        <h4 class="text-lg font-semibold text-white mb-4 text-center">
                            <i data-lucide="help-circle" class="w-5 h-5 inline mr-2"></i>
                            ${questionData.question}
                        </h4>
                        
                        <div class="choices-grid grid gap-3">
                            ${questionData.choices.map((choice, index) => `
                                <button class="reading-choice glass-effect p-4 rounded-xl text-left hover:bg-white/20 transition-all duration-300 cursor-pointer" onclick="window.gameEngine.gameModes.readingComprehension.selectChoice(${index})">
                                    <div class="flex items-start">
                                        <span class="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center mr-4 text-white font-bold flex-shrink-0 mt-1">
                                            ${String.fromCharCode(65 + index)}
                                        </span>
                                        <span class="text-white">${choice}</span>
                                    </div>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    async selectChoice(index) {
        // Use new unified feedback system
        if (window.answerFeedback && this.currentQuestion) {
            window.answerFeedback.showFeedback(index, this.currentQuestion.correctIndex, '.reading-choice');
        }
        
        if (window.gameEngine) {
            await window.gameEngine.submitAnswer(index);
        }
    }
    
    handleNumberKey(number) {
        if (number >= 1 && number <= 4) {
            this.selectChoice(number - 1);
        }
    }
    
    getHTML() {
        return `
            <div class="max-w-5xl mx-auto p-6">
                <div id="readingComprehensionContainer" class="space-y-6">
                    <div class="text-center">
                        <h2 class="text-2xl font-bold text-white mb-4">
                            <i data-lucide="glasses" class="w-8 h-8 inline mr-2"></i>
                            Reading Comprehension
                        </h2>
                        <p class="text-white/80 mb-6">Practice reading skills with real-world scenarios</p>
                    </div>
                    <div id="readingComprehensionContent" class="glass-effect rounded-2xl p-6">
                        <!-- Reading comprehension content will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }
}

class VocabularyLearningGame extends BaseGame {
    constructor() {
        super();
        this.currentWord = null;
        this.currentStep = 'learn'; // 'learn', 'practice', 'test'
        this.studiedWords = [];
        this.practiceType = 'meaning'; // 'meaning', 'example', 'sentence'
        this.usedWords = new Set();
        this.wordHistory = [];
        this.maxHistorySize = 100;
    }
    
    async initialize(options = {}) {
        await super.initialize(options);
        this.currentStep = 'learn';
        console.log('🎯 Vocabulary Learning Game initialized');
    }
    
    async generateQuestion(questionNumber) {
        if (!window.dataManager || !window.dataManager.vocabulary) {
            throw new Error('Data manager not available');
        }
        
        const words = Array.from(window.dataManager.vocabulary.values());
        const availableWords = words.filter(word => 
            word.examples && word.examples.length > 0 &&
            !this.usedWords.has(word.word)
        );
        
        if (availableWords.length === 0) {
            // Reset if all words studied
            this.usedWords.clear();
            console.log('🔄 All words used, resetting for new cycle');
            const allEligibleWords = words.filter(word => 
                word.examples && word.examples.length > 0
            );
            this.currentWord = allEligibleWords[Math.floor(Math.random() * allEligibleWords.length)];
        } else {
            // Select word based on current step
            this.currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        }
        
        // Mark word as used
        this.usedWords.add(this.currentWord.word);
        
        // Add to history
        this.wordHistory.push({
            word: this.currentWord.word,
            step: this.currentStep,
            practiceType: this.practiceType,
            timestamp: Date.now()
        });
        
        // Keep history size manageable
        if (this.wordHistory.length > this.maxHistorySize) {
            this.wordHistory = this.wordHistory.slice(-this.maxHistorySize);
        }
        
        console.log(`🎯 Used word: ${this.currentWord.word} (${this.usedWords.size} used, step: ${this.currentStep})`);
        
        if (this.currentStep === 'learn') {
            return {
                type: 'learn',
                word: this.currentWord.word,
                level: this.currentWord.level,
                examples: this.currentWord.examples,
                step: this.currentStep
            };
        } else if (this.currentStep === 'practice') {
            // Generate practice question
            return this.generatePracticeQuestion();
        } else {
            // Generate test question
            return this.generateTestQuestion();
        }
    }
    
    generatePracticeQuestion() {
        const practiceTypes = [
            'meaning', 'example', 'complete', 'synonym', 'antonym', 
            'word_form', 'collocation', 'idiom', 'phrasal_verb', 
            'word_family', 'pronunciation', 'etymology', 'context_clue'
        ];
        this.practiceType = practiceTypes[Math.floor(Math.random() * practiceTypes.length)];
        
        if (this.practiceType === 'meaning') {
            // Show word, ask for meaning
            const wrongAnswers = this.getRandomExamples(3, this.currentWord.word);
            const choices = [this.currentWord.examples[0], ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            return {
                type: 'practice-meaning',
                word: this.currentWord.word,
                question: `What does "${this.currentWord.word}" mean?`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(this.currentWord.examples[0]),
                step: this.currentStep
            };
        } else if (this.practiceType === 'example') {
            // Show meaning, ask for word
            const wrongWords = this.getRandomWords(3, this.currentWord.word);
            const choices = [this.currentWord.word, ...wrongWords];
            const shuffled = this.shuffleArray(choices);
            
            return {
                type: 'practice-word',
                meaning: this.currentWord.examples[0],
                question: `Which word means: "${this.currentWord.examples[0]}"?`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(this.currentWord.word),
                step: this.currentStep
            };
        } else if (this.practiceType === 'complete') {
            // Complete the sentence
            return {
                type: 'practice-complete',
                word: this.currentWord.word,
                sentence: this.createBlankSentence(),
                question: 'Complete the sentence:',
                step: this.currentStep
            };
        } else if (this.practiceType === 'synonym') {
            // Find synonym
            const synonyms = this.getSynonyms(this.currentWord.word);
            const wrongAnswers = this.getRandomExamples(3, this.currentWord.word);
            const choices = [synonyms[0] || this.currentWord.word, ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            return {
                type: 'practice-synonym',
                word: this.currentWord.word,
                question: `Find a synonym for "${this.currentWord.word}":`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(synonyms[0] || this.currentWord.word),
                step: this.currentStep
            };
        } else if (this.practiceType === 'antonym') {
            // Find antonym
            const antonyms = this.getAntonyms(this.currentWord.word);
            const wrongAnswers = this.getRandomExamples(3, this.currentWord.word);
            const choices = [antonyms[0] || 'opposite', ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            return {
                type: 'practice-antonym',
                word: this.currentWord.word,
                question: `Find an antonym for "${this.currentWord.word}":`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(antonyms[0] || 'opposite'),
                step: this.currentStep
            };
        } else if (this.practiceType === 'word_form') {
            // Word form (noun, verb, adjective, adverb)
            const forms = this.getWordForms(this.currentWord.word);
            const wrongAnswers = this.getRandomExamples(3, this.currentWord.word);
            const choices = [forms[0] || this.currentWord.word, ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            return {
                type: 'practice-word-form',
                word: this.currentWord.word,
                question: `What is the correct form of "${this.currentWord.word}"?`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(forms[0] || this.currentWord.word),
                step: this.currentStep
            };
        } else if (this.practiceType === 'collocation') {
            // Word collocation
            const collocations = this.getCollocations(this.currentWord.word);
            const wrongAnswers = this.getRandomExamples(3, this.currentWord.word);
            const choices = [collocations[0] || this.currentWord.word, ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            return {
                type: 'practice-collocation',
                word: this.currentWord.word,
                question: `Which word commonly goes with "${this.currentWord.word}"?`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(collocations[0] || this.currentWord.word),
                step: this.currentStep
            };
        } else if (this.practiceType === 'idiom') {
            // Idiom usage
            const idioms = this.getIdioms(this.currentWord.word);
            const wrongAnswers = this.getRandomExamples(3, this.currentWord.word);
            const choices = [idioms[0] || this.currentWord.word, ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            return {
                type: 'practice-idiom',
                word: this.currentWord.word,
                question: `What does the idiom "${this.currentWord.word}" mean?`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(idioms[0] || this.currentWord.word),
                step: this.currentStep
            };
        } else if (this.practiceType === 'phrasal_verb') {
            // Phrasal verb
            const phrasals = this.getPhrasalVerbs(this.currentWord.word);
            const wrongAnswers = this.getRandomExamples(3, this.currentWord.word);
            const choices = [phrasals[0] || this.currentWord.word, ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            return {
                type: 'practice-phrasal-verb',
                word: this.currentWord.word,
                question: `What does the phrasal verb "${this.currentWord.word}" mean?`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(phrasals[0] || this.currentWord.word),
                step: this.currentStep
            };
        } else if (this.practiceType === 'word_family') {
            // Word family
            const family = this.getWordFamily(this.currentWord.word);
            const wrongAnswers = this.getRandomExamples(3, this.currentWord.word);
            const choices = [family[0] || this.currentWord.word, ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            return {
                type: 'practice-word-family',
                word: this.currentWord.word,
                question: `Which word belongs to the same family as "${this.currentWord.word}"?`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(family[0] || this.currentWord.word),
                step: this.currentStep
            };
        } else if (this.practiceType === 'pronunciation') {
            // Pronunciation
            const pronunciations = this.getPronunciations(this.currentWord.word);
            const wrongAnswers = this.getRandomExamples(3, this.currentWord.word);
            const choices = [pronunciations[0] || this.currentWord.word, ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            return {
                type: 'practice-pronunciation',
                word: this.currentWord.word,
                question: `How do you pronounce "${this.currentWord.word}"?`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(pronunciations[0] || this.currentWord.word),
                step: this.currentStep
            };
        } else if (this.practiceType === 'etymology') {
            // Etymology
            const etymologies = this.getEtymologies(this.currentWord.word);
            const wrongAnswers = this.getRandomExamples(3, this.currentWord.word);
            const choices = [etymologies[0] || this.currentWord.word, ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            return {
                type: 'practice-etymology',
                word: this.currentWord.word,
                question: `What is the origin of "${this.currentWord.word}"?`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(etymologies[0] || this.currentWord.word),
                step: this.currentStep
            };
        } else {
            // Context clue
            return {
                type: 'practice-context-clue',
                word: this.currentWord.word,
                context: this.createContextClue(),
                question: 'Use context clues to understand the word:',
                step: this.currentStep
            };
        }
    }
    
    generateTestQuestion() {
        const testTypes = ['meaning', 'usage'];
        const testType = testTypes[Math.floor(Math.random() * testTypes.length)];
        
        if (testType === 'meaning') {
            const wrongAnswers = this.getRandomExamples(3, this.currentWord.word);
            const choices = [this.currentWord.examples[0], ...wrongAnswers];
            const shuffled = this.shuffleArray(choices);
            
            return {
                type: 'test-meaning',
                word: this.currentWord.word,
                question: `What does "${this.currentWord.word}" mean?`,
                choices: shuffled,
                correctIndex: shuffled.indexOf(this.currentWord.examples[0]),
                step: this.currentStep
            };
        } else {
            const wrongWords = this.getRandomWords(3, this.currentWord.word);
            const choices = [this.currentWord.word, ...wrongWords];
            const shuffled = this.shuffleArray(choices);
            
            return {
                type: 'test-usage',
                context: this.currentWord.examples[0],
                question: 'Which word fits this context?',
                choices: shuffled,
                correctIndex: shuffled.indexOf(this.currentWord.word),
                step: this.currentStep
            };
        }
    }
    
    getRandomWords(count, exclude) {
        if (!window.dataManager) {
            return ['word1', 'word2', 'word3', 'word4'];
        }
        
        const words = window.dataManager.getRandomWords(count * 2, null, null)
            .filter(w => w.word !== exclude)
            .map(w => w.word);
        
        // Remove duplicates and return requested count
        const uniqueWords = [...new Set(words)];
        return uniqueWords.slice(0, count);
    }
    
    getRandomExamples(count, exclude) {
        if (!window.dataManager) {
            return ['Example 1', 'Example 2', 'Example 3', 'Example 4'];
        }
        
        const words = window.dataManager.getRandomWords(count * 2, null, null)
            .filter(w => w.word !== exclude && w.examples && w.examples.length > 0);
        
        const examples = words.map(w => w.examples[0]).filter(ex => ex);
        
        // Remove duplicates and return requested count
        const uniqueExamples = [...new Set(examples)];
        return uniqueExamples.slice(0, count);
    }
    
    createBlankSentence() {
        if (this.currentWord.examples.length > 1) {
            return this.currentWord.examples[1].replace(new RegExp(this.currentWord.word, 'gi'), '______');
        }
        return `The ______ is very important in this context.`;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Enhanced helper methods for new question types
    getSynonyms(word) {
        const synonyms = {
            'happy': ['joyful', 'cheerful', 'glad', 'pleased'],
            'big': ['large', 'huge', 'enormous', 'massive'],
            'small': ['tiny', 'little', 'miniature', 'petite'],
            'good': ['excellent', 'great', 'wonderful', 'fantastic'],
            'bad': ['terrible', 'awful', 'horrible', 'dreadful'],
            'fast': ['quick', 'rapid', 'swift', 'speedy'],
            'slow': ['sluggish', 'leisurely', 'gradual', 'unhurried'],
            'beautiful': ['gorgeous', 'stunning', 'lovely', 'attractive'],
            'ugly': ['hideous', 'repulsive', 'unattractive', 'unsightly'],
            'smart': ['intelligent', 'clever', 'bright', 'brilliant']
        };
        return synonyms[word.toLowerCase()] || [word];
    }
    
    getAntonyms(word) {
        const antonyms = {
            'happy': ['sad', 'unhappy', 'miserable', 'depressed'],
            'big': ['small', 'tiny', 'little', 'miniature'],
            'good': ['bad', 'terrible', 'awful', 'horrible'],
            'fast': ['slow', 'sluggish', 'gradual', 'unhurried'],
            'beautiful': ['ugly', 'hideous', 'repulsive', 'unsightly'],
            'smart': ['stupid', 'foolish', 'ignorant', 'dumb'],
            'hot': ['cold', 'freezing', 'chilly', 'cool'],
            'light': ['dark', 'dim', 'gloomy', 'shadowy'],
            'rich': ['poor', 'poverty-stricken', 'destitute', 'needy'],
            'young': ['old', 'elderly', 'aged', 'senior']
        };
        return antonyms[word.toLowerCase()] || ['opposite'];
    }
    
    getWordForms(word) {
        const forms = {
            'happy': ['happiness', 'happily', 'unhappy'],
            'beautiful': ['beauty', 'beautifully', 'beautify'],
            'strong': ['strength', 'strongly', 'strengthen'],
            'quick': ['quickness', 'quickly', 'quicken'],
            'careful': ['care', 'carefully', 'careless'],
            'successful': ['success', 'successfully', 'succeed'],
            'peaceful': ['peace', 'peacefully', 'peacemaker'],
            'hopeful': ['hope', 'hopefully', 'hopeless'],
            'powerful': ['power', 'powerfully', 'empower'],
            'wonderful': ['wonder', 'wonderfully', 'wondrous']
        };
        return forms[word.toLowerCase()] || [word];
    }
    
    getCollocations(word) {
        const collocations = {
            'make': ['decision', 'mistake', 'effort', 'plan'],
            'take': ['break', 'chance', 'risk', 'photo'],
            'do': ['homework', 'exercise', 'work', 'favor'],
            'have': ['breakfast', 'lunch', 'dinner', 'meeting'],
            'get': ['married', 'divorced', 'promoted', 'fired'],
            'go': ['shopping', 'swimming', 'running', 'home'],
            'come': ['home', 'back', 'early', 'late'],
            'keep': ['secret', 'promise', 'quiet', 'calm'],
            'break': ['record', 'promise', 'law', 'news'],
            'catch': ['bus', 'train', 'cold', 'thief']
        };
        return collocations[word.toLowerCase()] || [word];
    }
    
    getIdioms(word) {
        const idioms = {
            'break': ['break a leg', 'break the ice', 'break even'],
            'make': ['make ends meet', 'make up your mind', 'make a difference'],
            'take': ['take it easy', 'take care', 'take your time'],
            'get': ['get along', 'get over it', 'get the hang of'],
            'come': ['come across', 'come up with', 'come to terms'],
            'go': ['go with the flow', 'go the extra mile', 'go back on'],
            'keep': ['keep in touch', 'keep your cool', 'keep an eye on'],
            'put': ['put up with', 'put your foot down', 'put two and two together'],
            'turn': ['turn over a new leaf', 'turn the tables', 'turn a blind eye'],
            'look': ['look down on', 'look up to', 'look forward to']
        };
        return idioms[word.toLowerCase()] || [word];
    }
    
    getPhrasalVerbs(word) {
        const phrasals = {
            'look': ['look up', 'look after', 'look forward to', 'look down on'],
            'get': ['get up', 'get along', 'get over', 'get by'],
            'take': ['take off', 'take up', 'take after', 'take care of'],
            'put': ['put off', 'put up with', 'put down', 'put on'],
            'come': ['come up', 'come across', 'come back', 'come down'],
            'go': ['go on', 'go off', 'go through', 'go back'],
            'make': ['make up', 'make out', 'make for', 'make off'],
            'break': ['break down', 'break up', 'break in', 'break out'],
            'turn': ['turn on', 'turn off', 'turn up', 'turn down'],
            'set': ['set up', 'set off', 'set out', 'set back']
        };
        return phrasals[word.toLowerCase()] || [word];
    }
    
    getWordFamily(word) {
        const families = {
            'happy': ['happiness', 'happily', 'unhappy', 'happier'],
            'beautiful': ['beauty', 'beautifully', 'beautify', 'beautician'],
            'strong': ['strength', 'strongly', 'strengthen', 'stronger'],
            'quick': ['quickness', 'quickly', 'quicken', 'quicker'],
            'careful': ['care', 'carefully', 'careless', 'carelessness'],
            'successful': ['success', 'successfully', 'succeed', 'successor'],
            'peaceful': ['peace', 'peacefully', 'peacemaker', 'peaceful'],
            'hopeful': ['hope', 'hopefully', 'hopeless', 'hopefulness'],
            'powerful': ['power', 'powerfully', 'empower', 'powerless'],
            'wonderful': ['wonder', 'wonderfully', 'wondrous', 'wonderment']
        };
        return families[word.toLowerCase()] || [word];
    }
    
    getPronunciations(word) {
        const pronunciations = {
            'schedule': ['/ˈʃedjuːl/', '/ˈskedjuːl/'],
            'either': ['/ˈaɪðər/', '/ˈiːðər/'],
            'neither': ['/ˈnaɪðər/', '/ˈniːðər/'],
            'tomato': ['/təˈmeɪtoʊ/', '/təˈmɑːtoʊ/'],
            'caramel': ['/ˈkærəməl/', '/ˈkɑːrməl/'],
            'pecan': ['/pɪˈkæn/', '/ˈpiːkæn/'],
            'route': ['/ruːt/', '/raʊt/'],
            'vase': ['/veɪs/', '/vɑːz/'],
            'aunt': ['/ænt/', '/ɑːnt/'],
            'creek': ['/kriːk/', '/krɪk/']
        };
        return pronunciations[word.toLowerCase()] || [word];
    }
    
    getEtymologies(word) {
        const etymologies = {
            'alphabet': ['From Greek "alpha" + "beta"', 'Ancient writing system'],
            'telephone': ['From Greek "tele" (far) + "phone" (sound)', 'Distance communication'],
            'photograph': ['From Greek "photo" (light) + "graph" (writing)', 'Light writing'],
            'democracy': ['From Greek "demos" (people) + "kratos" (power)', 'People power'],
            'philosophy': ['From Greek "philo" (love) + "sophia" (wisdom)', 'Love of wisdom'],
            'psychology': ['From Greek "psyche" (soul) + "logos" (study)', 'Study of soul'],
            'geography': ['From Greek "geo" (earth) + "graphia" (writing)', 'Earth writing'],
            'biology': ['From Greek "bios" (life) + "logos" (study)', 'Study of life'],
            'technology': ['From Greek "techne" (art) + "logos" (study)', 'Study of art'],
            'mathematics': ['From Greek "mathema" (learning)', 'Study of learning']
        };
        return etymologies[word.toLowerCase()] || [word];
    }
    
    createContextClue() {
        const contextClues = [
            'The word appears in a sentence with other words that give hints about its meaning.',
            'Look at the words around the target word for clues about its definition.',
            'The context provides information that helps understand the word\'s meaning.',
            'Use surrounding words and phrases to figure out what the word means.',
            'The sentence structure and other words give context for understanding.'
        ];
        return contextClues[Math.floor(Math.random() * contextClues.length)];
    }
    
    async checkAnswer(answerIndex, responseTime) {
        if (this.currentStep === 'learn') {
            // Learning step - just continue
            this.studiedWords.push(this.currentWord.word);
            this.currentStep = 'practice';
            
            return {
                isCorrect: true,
                correctAnswer: 'Learned!',
                explanation: `Great! You've learned "${this.currentWord.word}". Now let's practice it.`,
                points: 5,
                word: this.currentWord.word,
                feedbackDuration: 2000
            };
        } else {
            // Practice/Test step - use stored current question data
            if (!this.currentQuestionData) {
                console.error('❌ No current question data available for answer checking');
                return { isCorrect: false, error: 'No question data' };
            }
            
            const isCorrect = answerIndex === this.currentQuestionData.correctIndex;
            
            if (isCorrect && this.currentStep === 'practice') {
                this.currentStep = 'test';
            } else if (isCorrect && this.currentStep === 'test') {
                this.currentStep = 'learn'; // Move to next word
            }
            
            return {
                isCorrect: isCorrect,
                correctAnswer: this.currentQuestionData.choices ? this.currentQuestionData.choices[this.currentQuestionData.correctIndex] : 'Correct',
                explanation: isCorrect ? 
                    `Excellent! You ${this.currentStep === 'practice' ? 'practiced' : 'mastered'} "${this.currentWord.word}"` :
                    `Not quite. "${this.currentWord.word}" means: ${this.currentWord.examples[0]}`,
                points: isCorrect ? (this.currentStep === 'test' ? 15 : 10) : 0,
                word: this.currentWord.word,
                feedbackDuration: 3000
            };
        }
    }
    
    getHint() {
        if (this.currentStep === 'learn') {
            return { text: `Focus on the meaning and examples of "${this.currentWord.word}"` };
        } else {
            return { text: `Think about the meaning: ${this.currentWord.examples[0]}` };
        }
    }
    
    async displayQuestion(questionData) {
        await super.displayQuestion(questionData);
        
        const container = document.getElementById('vocabularyLearningContainer');
        if (!container) return;
        
        const content = container.querySelector('#vocabularyLearningContent');
        if (!content) return;
        
        if (questionData.type === 'learn') {
            content.innerHTML = this.renderLearningContent(questionData);
        } else if (questionData.type.startsWith('practice-')) {
            content.innerHTML = this.renderPracticeContent(questionData);
        } else if (questionData.type.startsWith('test-')) {
            content.innerHTML = this.renderTestContent(questionData);
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    renderLearningContent(data) {
        return `
            <div class="space-y-6">
                <!-- Background Image -->
                <div class="vocabulary-background absolute inset-0 rounded-2xl overflow-hidden -z-10 opacity-10">
                    <img src="assets/images/vocabulary-words.jpg" alt="Vocabulary Learning" 
                         class="w-full h-full object-cover"
                         onerror="this.style.display='none';">
                </div>
                
                <div class="step-indicator flex justify-center mb-6">
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <span class="text-white">Learn</span>
                        <div class="w-4 h-0.5 bg-gray-600"></div>
                        <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <span class="text-gray-400">Practice</span>
                        <div class="w-4 h-0.5 bg-gray-600"></div>
                        <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <span class="text-gray-400">Test</span>
                    </div>
                </div>
                
                <div class="word-card bg-blue-500/20 border border-blue-400/30 rounded-2xl p-8 text-center">
                    <div class="mb-4">
                        <span class="inline-block px-3 py-1 bg-blue-500/30 rounded-full text-xs font-semibold text-blue-200 mb-4">
                            ${data.level} Level
                        </span>
                    </div>
                    <h3 class="text-5xl font-bold text-white mb-6">${data.word}</h3>
                    <div class="meanings space-y-3">
                        ${data.examples.map((example, index) => `
                            <div class="meaning-item bg-white/10 rounded-xl p-4">
                                <p class="text-lg text-white">${example}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="text-center">
                    <button class="vocab-continue-btn glass-effect px-8 py-3 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300" onclick="window.gameEngine.continueVocabularyLearning()">
                        <i data-lucide="check-circle" class="w-5 h-5 inline mr-2"></i>
                        I've Learned This Word
                    </button>
                </div>
            </div>
        `;
    }
    
    renderPracticeContent(data) {
        return `
            <div class="space-y-6">
                <div class="step-indicator flex justify-center mb-6">
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                        <span class="text-green-400">Learn</span>
                        <div class="w-4 h-0.5 bg-green-500"></div>
                        <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <span class="text-white">Practice</span>
                        <div class="w-4 h-0.5 bg-gray-600"></div>
                        <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <span class="text-gray-400">Test</span>
                    </div>
                </div>
                
                <div class="question-card bg-orange-500/20 border border-orange-400/30 rounded-xl p-6 text-center">
                    <h3 class="text-xl font-semibold text-white mb-4">${data.question}</h3>
                    ${data.word ? `<div class="text-3xl font-bold text-orange-200 mb-4">${data.word}</div>` : ''}
                    ${data.meaning ? `<div class="text-lg text-orange-200 mb-4">"${data.meaning}"</div>` : ''}
                    ${data.sentence ? `<div class="text-lg text-orange-200 mb-4">${data.sentence}</div>` : ''}
                </div>
                
                <div class="choices-grid grid gap-3">
                    ${data.choices ? data.choices.map((choice, index) => `
                        <button class="vocab-choice glass-effect p-4 rounded-xl text-left hover:bg-white/20 transition-all duration-300 cursor-pointer" onclick="window.gameEngine.gameModes.vocabularyLearning.selectChoice(${index})">
                            <div class="flex items-center">
                                <span class="w-8 h-8 bg-orange-500/30 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                                    ${String.fromCharCode(65 + index)}
                                </span>
                                <span class="text-white">${choice}</span>
                            </div>
                        </button>
                    `).join('') : ''}
                </div>
            </div>
        `;
    }
    
    renderTestContent(data) {
        return `
            <div class="space-y-6">
                <div class="step-indicator flex justify-center mb-6">
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                        <span class="text-green-400">Learn</span>
                        <div class="w-4 h-0.5 bg-green-500"></div>
                        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                        <span class="text-green-400">Practice</span>
                        <div class="w-4 h-0.5 bg-green-500"></div>
                        <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <span class="text-white">Test</span>
                    </div>
                </div>
                
                <div class="question-card bg-red-500/20 border border-red-400/30 rounded-xl p-6 text-center">
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="target" class="w-6 h-6 text-red-400 mr-2"></i>
                        <span class="text-red-200 font-semibold">Final Test</span>
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-4">${data.question}</h3>
                    ${data.word ? `<div class="text-3xl font-bold text-red-200 mb-4">${data.word}</div>` : ''}
                    ${data.context ? `<div class="text-lg text-red-200 mb-4">"${data.context}"</div>` : ''}
                </div>
                
                <div class="choices-grid grid gap-3">
                    ${data.choices.map((choice, index) => `
                        <button class="vocab-choice glass-effect p-4 rounded-xl text-left hover:bg-white/20 transition-all duration-300 cursor-pointer" onclick="window.gameEngine.gameModes.vocabularyLearning.selectChoice(${index})">
                            <div class="flex items-center">
                                <span class="w-8 h-8 bg-red-500/30 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                                    ${String.fromCharCode(65 + index)}
                                </span>
                                <span class="text-white">${choice}</span>
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    async continueToNext() {
        if (window.gameEngine) {
            await window.gameEngine.submitAnswer(0); // Just continue
        }
    }
    
    async selectChoice(index) {
        // Use new unified feedback system
        if (window.answerFeedback && this.currentQuestion) {
            window.answerFeedback.showFeedback(index, this.currentQuestion.correctIndex, '.vocab-choice');
        }
        
        if (window.gameEngine) {
            await window.gameEngine.submitAnswer(index);
        }
    }
    
    handleNumberKey(number) {
        if (number >= 1 && number <= 4) {
            this.selectChoice(number - 1);
        }
    }
    
    getHTML() {
        return `
            <div class="max-w-4xl mx-auto p-6">
                <div id="vocabularyLearningContainer" class="space-y-6">
                    <div class="text-center">
                        <h2 class="text-2xl font-bold text-white mb-4">
                            <i data-lucide="book-open" class="w-8 h-8 inline mr-2"></i>
                            Vocabulary Learning
                        </h2>
                        <p class="text-white/80 mb-6">Learn → Practice → Test each word systematically</p>
                    </div>
                    <div id="vocabularyLearningContent" class="glass-effect rounded-2xl p-6">
                        <!-- Vocabulary learning content will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }
}

// Grammar Challenge Game - Tests grammar rules and structures
class GrammarChallengeGame extends BaseGame {
    constructor() {
        super();
        this.currentGrammarRule = null;
        this.grammarRules = [
            {
                rule: "Present Simple vs Present Continuous",
                question: "I ___ coffee every morning.",
                choices: ["drink", "am drinking", "drinks", "drinking"],
                correctIndex: 0,
                explanation: "Use Present Simple for daily habits and routines."
            },
            {
                rule: "Past Simple vs Past Continuous", 
                question: "She ___ when the phone rang.",
                choices: ["studied", "was studying", "is studying", "studies"],
                correctIndex: 1,
                explanation: "Use Past Continuous for actions in progress when interrupted."
            },
            {
                rule: "Articles (a, an, the)",
                question: "___ apple a day keeps the doctor away.",
                choices: ["A", "An", "The", "No article"],
                correctIndex: 1,
                explanation: "Use 'an' before words starting with vowel sounds."
            },
            {
                rule: "Comparatives and Superlatives",
                question: "This is ___ book I've ever read.",
                choices: ["the better", "the best", "better", "best"],
                correctIndex: 1,
                explanation: "Use 'the + superlative' when comparing more than two items."
            },
            {
                rule: "Prepositions of Time",
                question: "I was born ___ 1990.",
                choices: ["in", "on", "at", "during"],
                correctIndex: 0,
                explanation: "Use 'in' with years, months, and seasons."
            }
        ];
    }

    async generateQuestion(questionNumber) {
        const rule = this.grammarRules[Math.floor(Math.random() * this.grammarRules.length)];
        this.currentGrammarRule = rule;
        
        return {
            type: 'grammar',
            rule: rule.rule,
            question: rule.question,
            choices: rule.choices,
            correctIndex: rule.correctIndex,
            explanation: rule.explanation
        };
    }

    async checkAnswer(answerIndex, responseTime) {
        const isCorrect = answerIndex === this.currentGrammarRule.correctIndex;
        
        return {
            isCorrect: isCorrect,
            correctAnswer: this.currentGrammarRule.choices[this.currentGrammarRule.correctIndex],
            explanation: this.currentGrammarRule.explanation,
            points: isCorrect ? 15 : 0,
            word: this.currentGrammarRule.rule,
            feedbackDuration: 3000
        };
    }

    async displayQuestion(questionData) {
        await super.displayQuestion(questionData);
        
        const container = document.getElementById('grammarChallengeContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="space-y-6">
                <div class="grammar-card bg-purple-400/20 border border-purple-400/30 rounded-xl p-6 text-center">
                    <h3 class="text-lg font-semibold text-purple-200 mb-4">${questionData.rule}</h3>
                    <div class="question-text text-2xl font-bold text-white mb-6 bg-black/30 rounded-lg p-4">
                        ${questionData.question}
                    </div>
                </div>
                
                <div class="choices-grid grid gap-3">
                    ${questionData.choices.map((choice, index) => `
                        <button class="grammar-choice glass-effect p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300 cursor-pointer" onclick="window.gameEngine.gameModes.grammarChallenge.selectChoice(${index})">
                            <div class="flex items-center justify-center">
                                <span class="w-8 h-8 bg-purple-400/30 rounded-full flex items-center justify-center mr-3 text-white font-bold">
                                    ${String.fromCharCode(65 + index)}
                                </span>
                                <span class="text-white font-medium">${choice}</span>
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    async selectChoice(index) {
        if (window.answerFeedback) {
            window.answerFeedback.showFeedback(index, this.currentGrammarRule.correctIndex, '.grammar-choice');
        }
        
        if (window.gameEngine) {
            await window.gameEngine.submitAnswer(index);
        }
    }

    getHTML() {
        return `
            <div class="max-w-4xl mx-auto p-6">
                <div id="grammarChallengeContainer" class="space-y-6">
                    <div class="text-center">
                        <h2 class="text-2xl font-bold text-white mb-4">
                            <i data-lucide="book-text" class="w-8 h-8 inline mr-2"></i>
                            Grammar Challenge
                        </h2>
                        <p class="text-white/80 mb-6">Master English grammar rules and structures</p>
                    </div>
                    <!-- Grammar content will be populated here -->
                </div>
            </div>
        `;
    }
}

// Listening Practice Game - Audio-based learning 
class ListeningPracticeGame extends BaseGame {
    constructor() {
        super();
        this.currentAudio = null;
        this.listeningExercises = [
            {
                text: "Hello, my name is Sarah. I am 25 years old.",
                question: "What is the speaker's name?",
                choices: ["Sara", "Sarah", "Sally", "Susan"],
                correctIndex: 1,
                speed: "normal"
            },
            {
                text: "The weather today is sunny and warm. Perfect for a picnic!",
                question: "How is the weather described?",
                choices: ["Cold and rainy", "Sunny and warm", "Cloudy and cool", "Windy and cold"],
                correctIndex: 1,
                speed: "normal"
            },
            {
                text: "I work at a hospital. I help doctors take care of patients.",
                question: "Where does the speaker work?",
                choices: ["School", "Office", "Hospital", "Restaurant"],
                correctIndex: 2,
                speed: "normal"
            },
            {
                text: "My favorite food is pizza. I like it with cheese and tomatoes.",
                question: "What is the speaker's favorite food?",
                choices: ["Burger", "Pizza", "Pasta", "Sandwich"],
                correctIndex: 1,
                speed: "slow"
            }
        ];
    }

    async generateQuestion(questionNumber) {
        const exercise = this.listeningExercises[Math.floor(Math.random() * this.listeningExercises.length)];
        this.currentAudio = exercise;
        
        return {
            type: 'listening',
            text: exercise.text,
            question: exercise.question,
            choices: exercise.choices,
            correctIndex: exercise.correctIndex,
            speed: exercise.speed
        };
    }

    async checkAnswer(answerIndex, responseTime) {
        const isCorrect = answerIndex === this.currentAudio.correctIndex;
        
        return {
            isCorrect: isCorrect,
            correctAnswer: this.currentAudio.choices[this.currentAudio.correctIndex],
            explanation: isCorrect ? 
                `Correct! You understood the audio well.` :
                `The correct answer was: ${this.currentAudio.choices[this.currentAudio.correctIndex]}`,
            points: isCorrect ? 20 : 0,
            word: this.currentAudio.question,
            feedbackDuration: 3000
        };
    }

    playAudio(text, speed = 'normal') {
        if (window.audioSystem && typeof window.audioSystem.speakText === 'function') {
            const rate = speed === 'slow' ? 0.7 : 1.0;
            window.audioSystem.speakText(text, rate);
        } else {
            console.warn('Audio system not available for listening practice');
        }
    }

    async displayQuestion(questionData) {
        await super.displayQuestion(questionData);
        
        const container = document.getElementById('listeningPracticeContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="space-y-6">
                <div class="listening-card bg-blue-400/20 border border-blue-400/30 rounded-xl p-6 text-center">
                    <h3 class="text-xl font-semibold text-white mb-4">Listen Carefully</h3>
                    
                    <!-- Audio Controls -->
                    <div class="audio-controls mb-6">
                        <img src="assets/images/students-learning.jpg" alt="Listening Practice" 
                             class="rounded-xl shadow-lg w-48 h-32 object-cover mx-auto mb-4 border-2 border-blue-400/30 opacity-80"
                             onerror="this.style.display='none';">
                        
                        <button onclick="window.gameEngine.gameModes.listeningPractice.playAudio('${questionData.text}', '${questionData.speed}')" 
                                class="audio-play-btn glass-effect px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-all duration-300 mx-2">
                            <i data-lucide="play" class="w-5 h-5 inline mr-2"></i>
                            Play Audio
                        </button>
                        
                        <button onclick="window.gameEngine.gameModes.listeningPractice.playAudio('${questionData.text}', 'slow')" 
                                class="audio-slow-btn glass-effect px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-all duration-300 mx-2">
                            <i data-lucide="rewind" class="w-5 h-5 inline mr-2"></i>
                            Play Slow
                        </button>
                    </div>
                    
                    <div class="question-text text-lg font-semibold text-white mb-4">
                        ${questionData.question}
                    </div>
                </div>
                
                <div class="choices-grid grid gap-3">
                    ${questionData.choices.map((choice, index) => `
                        <button class="listening-choice glass-effect p-4 rounded-xl text-center hover:bg-white/20 transition-all duration-300 cursor-pointer" onclick="window.gameEngine.gameModes.listeningPractice.selectChoice(${index})">
                            <div class="flex items-center justify-center">
                                <span class="w-8 h-8 bg-blue-400/30 rounded-full flex items-center justify-center mr-3 text-white font-bold">
                                    ${String.fromCharCode(65 + index)}
                                </span>
                                <span class="text-white font-medium">${choice}</span>
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    async selectChoice(index) {
        if (window.answerFeedback) {
            window.answerFeedback.showFeedback(index, this.currentAudio.correctIndex, '.listening-choice');
        }
        
        if (window.gameEngine) {
            await window.gameEngine.submitAnswer(index);
        }
    }

    getHTML() {
        return `
            <div class="max-w-4xl mx-auto p-6">
                <div id="listeningPracticeContainer" class="space-y-6">
                    <div class="text-center">
                        <h2 class="text-2xl font-bold text-white mb-4">
                            <i data-lucide="headphones" class="w-8 h-8 inline mr-2"></i>
                            Listening Practice
                        </h2>
                        <p class="text-white/80 mb-6">Improve your listening skills with audio exercises</p>
                    </div>
                    <!-- Listening content will be populated here -->
                </div>
            </div>
        `;
    }
}

// Main Game Engine Class
class GameEngine {
    constructor() {
        this.currentGame = null;
        this.currentGameMode = null;
        this.gameModes = {
            multipleChoice: new MultipleChoiceGame(),
            conversation: new ConversationGame(),
            modalVerbs: new ModalVerbsGame(),
            timeTelling: new TimeTellingGame(),
            categorySort: new CategorySortGame(),
            visualLearning: new VisualLearningGame(),
            conversationBuilder: new ConversationBuilderGame(),
            prefixSuffix: new PrefixSuffixGame(),
            readingComprehension: new ReadingComprehensionGame(),
            vocabularyLearning: new VocabularyLearningGame(),
            grammarChallenge: new GrammarChallengeGame(),
            listeningPractice: new ListeningPracticeGame()
        };
        
        this.sessionData = [];
        this.isGameActive = false;
        
        console.log('🎮 Initializing Game Engine...');
        this.initializeGames();
        console.log('✅ Game Engine initialized');
    }
    
    async initializeGames() {
        // Initialize all game modes
        for (const [mode, game] of Object.entries(this.gameModes)) {
            try {
                if (game.initialize) {
                    await game.initialize();
                }
            } catch (error) {
                console.warn(`⚠️ Failed to initialize ${mode}:`, error);
            }
        }
    }
    
    startGame(gameMode, options = {}) {
        console.log(`🎯 Starting game: ${gameMode}`);
        
        // Check if game mode exists
        if (!this.gameModes || !this.gameModes[gameMode]) {
            console.error(`❌ Game mode '${gameMode}' not found. Available modes:`, Object.keys(this.gameModes || {}));
            
            // Fallback to multiple choice if available
            if (this.gameModes && this.gameModes.multipleChoice) {
                console.log('🔄 Falling back to Multiple Choice game');
                gameMode = 'multipleChoice';
            } else {
                throw new Error(`Game mode '${gameMode}' not found and no fallback available`);
            }
        }
        
        this.currentGame = this.gameModes[gameMode];
        this.currentGameMode = gameMode;
        this.sessionData = [];
        this.isGameActive = true;
        this.questionStartTime = Date.now();
        this.currentDifficulty = options.difficulty || 'medium';
        
        // Record game mode switch in analytics
        if (window.advancedAnalytics && typeof window.advancedAnalytics.recordLearningEvent === 'function') {
            try {
                window.advancedAnalytics.recordLearningEvent('game_mode_switched', {
                    gameMode: gameMode,
                    difficulty: this.currentDifficulty,
                    timestamp: Date.now()
                });
            } catch (error) {
                console.warn('⚠️ Analytics recording failed:', error);
            }
        }
        
        // Notify gamification system
        if (window.gamificationSystem && typeof window.gamificationSystem.onGameStart === 'function') {
            try {
                window.gamificationSystem.onGameStart(gameMode);
            } catch (error) {
                console.warn('⚠️ Gamification notification failed:', error);
            }
        }
        
        // Show game screen
        this.showGameScreen(gameMode);
        
        // Start the game safely
        try {
            if (this.currentGame && typeof this.currentGame.start === 'function') {
                this.currentGame.start(options);
            } else {
                console.warn('⚠️ Game start method not available');
            }
        } catch (error) {
            console.error('❌ Error starting game:', error);
        }
        
        // Reset timer for first question
        this.questionStartTime = Date.now();
        
        console.log(`✅ Game ${gameMode} started successfully`);
        return this.currentGame;
    }
    
    showGameScreen(gameMode) {
        // Hide all screens
        document.querySelectorAll('[id$="Screen"]').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show specific game screen
        const screenId = this.getScreenId(gameMode);
        const gameScreen = document.getElementById(screenId);
        
        if (gameScreen) {
            gameScreen.classList.remove('hidden');
            
            // Inject game HTML if needed
            if (this.currentGame.getHTML) {
                const gameContent = gameScreen.querySelector('.game-content') || gameScreen;
                gameContent.innerHTML = this.currentGame.getHTML();
            }
        } else {
            console.warn(`⚠️ Game screen not found: ${screenId}`);
        }
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    getScreenId(gameMode) {
        const screenMap = {
            multipleChoice: 'multipleChoiceScreen',
            conversation: 'conversationScreen',
            modalVerbs: 'modalVerbsScreen',
            timeTelling: 'timeTellingScreen',
            categorySort: 'categorySortScreen',
            visualLearning: 'visualLearningScreen',
            conversationBuilder: 'conversationBuilderScreen',
            prefixSuffix: 'prefixSuffixScreen',
            readingComprehension: 'readingComprehensionScreen',
            vocabularyLearning: 'vocabularyLearningScreen',
            grammarChallenge: 'grammarChallengeScreen',
            listeningPractice: 'listeningPracticeScreen'
        };
        
        return screenMap[gameMode] || `${gameMode}Screen`;
    }
    
    async submitAnswer(answerIndex, responseTime = Date.now()) {
        if (!this.currentGame || !this.isGameActive) {
            console.warn('⚠️ No active game to submit answer to');
            return;
        }
        
        try {
            const startTime = this.questionStartTime || Date.now();
            const actualResponseTime = Date.now() - startTime;
            
            const result = await this.currentGame.checkAnswer(answerIndex, actualResponseTime);
            this.recordAnswer(result);
            
            // Record for spaced repetition system
            if (window.spacedRepetition && result.word) {
                window.spacedRepetition.recordReview(
                    result.word, 
                    result.isCorrect, 
                    actualResponseTime
                );
            }
            
            // Record for advanced analytics
            if (window.advancedAnalytics) {
                window.advancedAnalytics.recordLearningEvent('question_answered', {
                    word: result.word,
                    isCorrect: result.isCorrect,
                    responseTime: actualResponseTime,
                    gameMode: this.currentGame.constructor.name,
                    difficulty: this.currentDifficulty || 'medium'
                });
            }
            
            // Update gamification system
            if (window.gamificationSystem) {
                window.gamificationSystem.onQuestionAnswered(result.isCorrect, actualResponseTime, result.word);
            }
            
            // Update enhanced progress
            if (window.enhancedProgress && typeof window.enhancedProgress.updateProgress === 'function') {
                window.enhancedProgress.updateProgress('word_learned', {
                    word: result.word,
                    isCorrect: result.isCorrect,
                    responseTime: actualResponseTime,
                    category: this.currentGame.constructor.name
                });
            }
            
            // Show feedback
            this.showAnswerFeedback(result);
            
            // Audio feedback
            if (window.audioSystem && result.word) {
                if (result.isCorrect) {
                    // Speak correct word for reinforcement
                    setTimeout(() => {
                        window.audioSystem.speakWord(result.word, true);
                    }, 1000);
                } else {
                    // Speak correct answer for learning
                    setTimeout(() => {
                        window.audioSystem.speakWord(result.correctAnswer || result.word, true);
                    }, 1500);
                }
            }
            
            // Button creation now handled by AnswerFeedback system
            console.log('✅ Answer processed - AnswerFeedback will handle button');
            
            return result;
        } catch (error) {
            console.error('❌ Error submitting answer:', error);
            return { isCorrect: false, error: error.message };
        }
    }
    
    nextQuestion() {
        if (!this.currentGame || !this.isGameActive) {
            console.warn('⚠️ No active game for next question');
            return;
        }
        
        console.log('➡️ Moving to next question...');
        
        // Hide next question button
        this.hideNextQuestionButton();
        
        // Re-enable choice buttons
        this.resetChoiceButtons();
        
        // Generate and display next question
        if (this.currentGame.nextQuestion) {
            this.currentGame.nextQuestion();
        } else {
            console.log('🔄 Generating new question...');
            // Fallback: generate new question
            this.currentGame.nextQuestion();
        }
    }
    
    resetChoiceButtons() {
        // Re-enable all choice buttons and reset their appearance
        const allChoiceButtons = document.querySelectorAll('.choice-btn, .conversation-choice, .modal-choice, .time-choice, .visual-choice, .formation-choice, .reading-choice, .vocab-choice, .conversation-builder-choice');
        
        allChoiceButtons.forEach(btn => {
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
            
            // Remove feedback classes
            btn.classList.remove('bg-green-500/30', 'bg-red-500/30', 'bg-green-500/20', 'bg-blue-500/30');
            
            // Reset hover effects
            btn.classList.add('hover:bg-white/20');
        });
    }
    
    showNextQuestionButton() {
        // DISABLED: AnswerFeedback system handles all buttons now
        console.log('🚫 GameEngine button creation DISABLED - Using unified AnswerFeedback system');
        
        // Remove any existing GameEngine button to prevent conflicts
        const existingBtn = document.getElementById('nextQuestionBtn');
        if (existingBtn) {
            existingBtn.remove();
            console.log('🧹 Removed existing GameEngine button');
        }
        
        // Let AnswerFeedback system handle button creation
        return;
    }
    
    hideNextQuestionButton() {
        const nextBtn = document.getElementById('nextQuestionBtn');
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
    }
    
    recordAnswer(result) {
        this.sessionData.push({
            ...result,
            timestamp: Date.now(),
            gameMode: this.currentGame.constructor.name
        });
        
        // Record in app if available
        if (window.app && window.app.recordAnswer) {
            window.app.recordAnswer(
                result.word,
                result.isCorrect,
                result.responseTime || 0,
                this.currentGame.constructor.name
            );
        }
    }
    
    showAnswerFeedback(result) {
        // This should be implemented to show visual feedback
        console.log(result.isCorrect ? '✅ Correct!' : '❌ Incorrect!');
        
        if (window.uiManager) {
            const message = result.explanation || (result.isCorrect ? 'Correct!' : 'Try again!');
            const type = result.isCorrect ? 'success' : 'error';
            window.uiManager.showToast(message, type, 3000);
        }
    }
    
    endGame() {
        if (!this.currentGame) return;
        
        console.log('🏁 Ending game...');
        
        try {
            // Calculate session stats
            const stats = this.calculateSessionStats();
            
            // End current game
            if (this.currentGame.end) {
                this.currentGame.end();
            }
            
            // Reset state
            this.currentGame = null;
            this.isGameActive = false;
            
            // Show results or return to menu
            this.showGameResults(stats);
            
            console.log('✅ Game ended, stats:', stats);
            
        } catch (error) {
            console.error('❌ Error ending game:', error);
        }
    }
    
    calculateSessionStats() {
        const totalQuestions = this.sessionData.length;
        const correctAnswers = this.sessionData.filter(a => a.isCorrect).length;
        const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
        
        return {
            gameMode: this.currentGame?.constructor.name || 'unknown',
            totalQuestions,
            correctAnswers,
            accuracy,
            score: correctAnswers * 10,
            sessionData: this.sessionData
        };
    }
    
    showGameResults(stats) {
        // Return to welcome screen for now
        // This could be enhanced with a results modal
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            document.querySelectorAll('[id$="Screen"]').forEach(screen => {
                screen.classList.add('hidden');
            });
            welcomeScreen.classList.remove('hidden');
        }
    }
    
    // Utility methods
    getGameMode(gameMode) {
        return this.gameModes[gameMode];
    }
    
    isGameRunning() {
        return this.isGameActive && this.currentGame !== null;
    }
    
    getCurrentGame() {
        return this.currentGame;
    }
    
    getSessionData() {
        return this.sessionData;
    }
    
    /**
     * Proceed to next question
     */
    nextQuestion() {
        if (!this.currentGame) {
            console.warn('No active game for next question');
            return;
        }

        // Reset feedback system with safety wrapper
        try {
            if (window.answerFeedback && typeof window.answerFeedback.reset === 'function') {
                window.answerFeedback.reset();
            }
        } catch (error) {
            console.error('🚨 Error during answer feedback reset:', error);
        }

        // Store current game type before generating next question
        const currentGameType = this.currentGame.gameType || this.currentGameMode;
        
        // Generate next question for current game
        if (this.currentGame.generateNextQuestion) {
            this.currentGame.generateNextQuestion();
        } else if (currentGameType) {
            // Default behavior - restart the game mode
            this.startGame(currentGameType);
        } else {
            console.warn('Cannot determine current game type for next question');
            // Fallback to multiple choice
            this.startGame('multipleChoice');
        }
    }

    /**
     * Continue vocabulary learning progression
     */
    continueVocabularyLearning() {
        console.log('📚 Continuing vocabulary learning...');
        
        if (!this.currentGame || this.currentGameMode !== 'vocabularyLearning') {
            console.warn('No active vocabulary learning session');
            return;
        }

        const vocabGame = this.gameModes.vocabularyLearning;
        if (vocabGame && typeof vocabGame.continueToNext === 'function') {
            vocabGame.continueToNext();
        } else {
            // Fallback to next question
            this.nextQuestion();
        }
    }

    /**
     * Comprehensive game system validation
     */
    validateAllGames() {
        console.log('🔍 VALIDATING ALL GAME SYSTEMS...');
        
        const results = {
            totalGames: 0,
            workingGames: 0,
            brokenGames: [],
            missingMethods: [],
            summary: {}
        };

        for (const [gameMode, game] of Object.entries(this.gameModes)) {
            results.totalGames++;
            console.log(`\n🎮 Testing ${gameMode}...`);
            
            const gameStatus = {
                hasGenerateQuestion: typeof game.generateQuestion === 'function',
                hasCheckAnswer: typeof game.checkAnswer === 'function',
                hasDisplayQuestion: typeof game.displayQuestion === 'function',
                hasGetHTML: typeof game.getHTML === 'function',
                hasSelectChoice: typeof game.selectChoice === 'function'
            };

            const working = Object.values(gameStatus).every(status => status);
            
            if (working) {
                results.workingGames++;
                console.log(`✅ ${gameMode} - All methods present`);
            } else {
                results.brokenGames.push(gameMode);
                console.log(`❌ ${gameMode} - Missing methods:`, 
                    Object.entries(gameStatus).filter(([method, exists]) => !exists).map(([method]) => method)
                );
            }

            results.summary[gameMode] = gameStatus;
        }

        console.log('\n📊 GAME VALIDATION SUMMARY:');
        console.log(`Total Games: ${results.totalGames}`);
        console.log(`Working Games: ${results.workingGames}`);
        console.log(`Broken Games: ${results.brokenGames.length}`);
        
        if (results.brokenGames.length > 0) {
            console.log(`❌ Broken Games: ${results.brokenGames.join(', ')}`);
        }

        // Test screen mapping
        console.log('\n🖥️ TESTING SCREEN MAPPING...');
        for (const gameMode of Object.keys(this.gameModes)) {
            const screenId = this.getScreenId(gameMode);
            const screenExists = document.getElementById(screenId) !== null;
            console.log(`${screenExists ? '✅' : '❌'} ${gameMode} → ${screenId} ${screenExists ? 'EXISTS' : 'MISSING'}`);
        }

        return results;
    }
}

// Global game engine instance
window.gameEngine = null;

// Export for global use
window.GameEngine = GameEngine;
console.log('🎮 GameEngine exported to window.GameEngine');

// Global debug functions
window.validateAllGames = function() {
    if (window.gameEngine && typeof window.gameEngine.validateAllGames === 'function') {
        return window.gameEngine.validateAllGames();
    } else {
        console.warn('⚠️ Game Engine not initialized. Please wait for full loading.');
        return null;
    }
};

window.testGameMode = function(gameMode) {
    if (window.gameEngine && window.gameEngine.gameModes[gameMode]) {
        console.log(`🎯 Testing ${gameMode}...`);
        try {
            window.gameEngine.startGame(gameMode);
            console.log(`✅ ${gameMode} started successfully`);
            return true;
        } catch (error) {
            console.error(`❌ ${gameMode} failed to start:`, error);
            return false;
        }
    } else {
        console.warn(`⚠️ Game mode '${gameMode}' not found`);
        return false;
    }
};

console.log('🔧 Global debug functions added: validateAllGames(), testGameMode()');

// Add cleanup methods to BaseGame
BaseGame.prototype.cleanup = function() {
    console.log(`🧹 Cleaning up ${this.constructor.name}...`);
    
    // Clear any timers
    if (this.timers) {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers = [];
    }
    
    // Clear any intervals
    if (this.intervals) {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
    }
    
    // Clear any event listeners
    if (this.eventListeners) {
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
    }
    
    // Clear any cached data
    if (this.cache) {
        this.cache.clear();
    }
    
    // Reset state
    this.currentQuestion = null;
    this.currentQuestionData = null;
    this.isActive = false;
    
    console.log(`✅ ${this.constructor.name} cleaned up`);
};

// Add cleanup methods to GameEngine
GameEngine.prototype.cleanup = function() {
    console.log('🧹 Cleaning up GameEngine...');
    
    // Clean up all game modes
    Object.values(this.gameModes).forEach(gameMode => {
        if (gameMode && typeof gameMode.cleanup === 'function') {
            gameMode.cleanup();
        }
    });
    
    // Clear current game
    this.currentGame = null;
    this.currentGameMode = null;
    
    // Clear any global controls
    const globalControls = document.getElementById('globalControls');
    if (globalControls) {
        globalControls.remove();
    }
    
    // Clear floating controls
    const floatingLayer = document.getElementById('floatingControlsLayer');
    if (floatingLayer) {
        floatingLayer.remove();
    }
    
    // Clear any timers
    if (this.timers) {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers = [];
    }
    
    // Clear any intervals
    if (this.intervals) {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
    }
    
    console.log('✅ GameEngine cleaned up');
};

// Add cleanup methods to AudioSystem
if (window.AudioSystem) {
    AudioSystem.prototype.cleanup = function() {
        console.log('🧹 Cleaning up AudioSystem...');
        
        // Stop all audio
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        // Clear audio cache
        if (this.audioCache) {
            this.audioCache.clear();
        }
        
        // Clear any timers
        if (this.timers) {
            this.timers.forEach(timer => clearTimeout(timer));
            this.timers = [];
        }
        
        console.log('✅ AudioSystem cleaned up');
    };
}

// Add cleanup methods to RealTimeMonitor
if (window.RealTimeMonitor) {
    RealTimeMonitor.prototype.cleanup = function() {
        console.log('🧹 Cleaning up RealTimeMonitor...');
        
        // Stop monitoring
        this.stopMonitoring();
        
        // Clear any timers
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        // Reset metrics
        this.resetMetrics();
        
        console.log('✅ RealTimeMonitor cleaned up');
    };
}

// Global cleanup function
window.cleanupApplication = function() {
    console.log('🧹 Starting application cleanup...');
    
    // Clean up all major systems
    if (window.gameEngine && typeof window.gameEngine.cleanup === 'function') {
        window.gameEngine.cleanup();
    }
    
    if (window.audioSystem && typeof window.audioSystem.cleanup === 'function') {
        window.audioSystem.cleanup();
    }
    
    if (window.realTimeMonitor && typeof window.realTimeMonitor.cleanup === 'function') {
        window.realTimeMonitor.cleanup();
    }
    
    if (window.performanceOptimizer && typeof window.performanceOptimizer.cleanup === 'function') {
        window.performanceOptimizer.cleanup();
    }
    
    // Clear global variables
    window.gameEngine = null;
    window.audioSystem = null;
    window.realTimeMonitor = null;
    window.performanceOptimizer = null;
    
    // Clear localStorage if needed
    if (confirm('Do you want to clear all saved data?')) {
        localStorage.clear();
        console.log('🗑️ LocalStorage cleared');
    }
    
    console.log('✅ Application cleanup completed');
};

console.log('🧹 Cleanup methods added to all systems');

// Enhanced testing functions for CSV integration
window.testCSVIntegration = function() {
    console.log('🧪 Testing CSV Integration...');
    
    const results = {
        dataManager: false,
        vocabulary: false,
        gameModes: false,
        questionGeneration: false,
        wordUsage: false
    };
    
    // Test Data Manager
    if (window.dataManager && window.dataManager.vocabulary) {
        results.dataManager = true;
        console.log('✅ Data Manager loaded');
        
        // Test vocabulary loading
        if (window.dataManager.vocabulary.size > 0) {
            results.vocabulary = true;
            console.log(`✅ Vocabulary loaded: ${window.dataManager.vocabulary.size} words`);
            
            // Test word statistics
            const stats = window.dataManager.getWordStatistics();
            console.log('📊 Word Statistics:', stats);
        } else {
            console.log('❌ No vocabulary loaded');
        }
    } else {
        console.log('❌ Data Manager not available');
    }
    
    // Test Game Modes
    if (window.gameEngine && window.gameEngine.gameModes) {
        const gameModes = Object.keys(window.gameEngine.gameModes);
        if (gameModes.length > 0) {
            results.gameModes = true;
            console.log(`✅ Game modes available: ${gameModes.length}`);
            console.log('🎮 Game modes:', gameModes);
        } else {
            console.log('❌ No game modes available');
        }
    } else {
        console.log('❌ Game Engine not available');
    }
    
    // Test Question Generation
    if (window.gameEngine && window.gameEngine.gameModes.multipleChoice) {
        try {
            const question = window.gameEngine.gameModes.multipleChoice.generateQuestion(1);
            if (question && question.choices && question.choices.length > 0) {
                results.questionGeneration = true;
                console.log('✅ Question generation working');
                console.log('📝 Sample question:', question);
            } else {
                console.log('❌ Question generation failed');
            }
        } catch (error) {
            console.log('❌ Question generation error:', error);
        }
    }
    
    // Test Word Usage
    if (window.dataManager && window.dataManager.vocabulary) {
        const sampleWords = window.dataManager.getRandomWords(5);
        if (sampleWords.length > 0) {
            results.wordUsage = true;
            console.log('✅ Word usage working');
            console.log('📚 Sample words:', sampleWords.map(w => w.word));
        } else {
            console.log('❌ Word usage failed');
        }
    }
    
    // Summary
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n📊 CSV Integration Test Results: ${passedTests}/${totalTests} passed`);
    console.log('Results:', results);
    
    return results;
};

window.testAllGameModes = async function() {
    console.log('🧪 Testing All Game Modes...');
    
    if (!window.gameEngine) {
        console.log('❌ Game Engine not available');
        return;
    }
    
    const gameModes = Object.keys(window.gameEngine.gameModes);
    const results = {};
    
    for (const mode of gameModes) {
        try {
            console.log(`🎮 Testing ${mode}...`);
            const gameMode = window.gameEngine.gameModes[mode];
            
            if (gameMode && typeof gameMode.generateQuestion === 'function') {
                const question = await gameMode.generateQuestion(1);
                if (question) {
                    results[mode] = 'PASS';
                    console.log(`✅ ${mode} - Question generated successfully`);
                } else {
                    results[mode] = 'FAIL - No question generated';
                    console.log(`❌ ${mode} - No question generated`);
                }
            } else {
                results[mode] = 'FAIL - No generateQuestion method';
                console.log(`❌ ${mode} - No generateQuestion method`);
            }
        } catch (error) {
            results[mode] = `FAIL - Error: ${error.message}`;
            console.log(`❌ ${mode} - Error:`, error);
        }
    }
    
    const passed = Object.values(results).filter(r => r === 'PASS').length;
    const total = Object.keys(results).length;
    
    console.log(`\n📊 Game Mode Test Results: ${passed}/${total} passed`);
    console.log('Results:', results);
    
    return results;
};

window.testVocabularyUsage = function() {
    console.log('🧪 Testing Vocabulary Usage...');
    
    if (!window.dataManager) {
        console.log('❌ Data Manager not available');
        return;
    }
    
    const results = {
        totalWords: 0,
        byLevel: {},
        byCategory: {},
        sampleWords: [],
        wordRelationships: 0
    };
    
    // Get total word count
    results.totalWords = window.dataManager.vocabulary.size;
    console.log(`📚 Total words: ${results.totalWords}`);
    
    // Get statistics
    const stats = window.dataManager.getWordStatistics();
    results.byLevel = stats.byLevel;
    results.byCategory = stats.byCategory;
    
    console.log('📊 By Level:', results.byLevel);
    console.log('📊 By Category:', results.byCategory);
    
    // Get sample words
    const sampleWords = window.dataManager.getRandomWords(10);
    results.sampleWords = sampleWords.map(w => ({
        word: w.word,
        level: w.level,
        category: w.category,
        difficulty: w.difficulty
    }));
    
    console.log('📝 Sample words:', results.sampleWords);
    
    // Test word relationships
    if (sampleWords.length > 0) {
        const relatedWords = window.dataManager.getRelatedWords(sampleWords[0].word, 3);
        results.wordRelationships = relatedWords.length;
        console.log(`🔗 Related words for "${sampleWords[0].word}":`, relatedWords.map(w => w.word));
    }
    
    return results;
};

window.testQuestionVariety = async function() {
    console.log('🧪 Testing Question Variety...');
    
    if (!window.gameEngine || !window.gameEngine.gameModes.multipleChoice) {
        console.log('❌ Multiple Choice game not available');
        return;
    }
    
    const questionTypes = new Set();
    const sampleQuestions = [];
    const usedWords = new Set();
    
    // Generate multiple questions to test variety
    for (let i = 0; i < 20; i++) {
        try {
            const question = await window.gameEngine.gameModes.multipleChoice.generateQuestion(i + 1);
            if (question && question.type) {
                questionTypes.add(question.type);
                sampleQuestions.push({
                    type: question.type,
                    question: question.question || question.sentence || 'N/A',
                    choices: question.choices ? question.choices.length : 0,
                    word: question.word || 'N/A'
                });
                
                if (question.word) {
                    usedWords.add(question.word);
                }
            }
        } catch (error) {
            console.log(`❌ Error generating question ${i + 1}:`, error);
        }
    }
    
    console.log(`📊 Question types found: ${questionTypes.size}`);
    console.log(`📚 Unique words used: ${usedWords.size}`);
    console.log('🎯 Question types:', Array.from(questionTypes));
    console.log('📝 Sample questions:', sampleQuestions.slice(0, 5));
    
    return {
        questionTypes: Array.from(questionTypes),
        totalQuestions: sampleQuestions.length,
        uniqueWords: usedWords.size,
        sampleQuestions: sampleQuestions
    };
};

window.testNoRepeatQuestions = async function() {
    console.log('🧪 Testing No Repeat Questions...');
    
    if (!window.gameEngine) {
        console.log('❌ Game Engine not available');
        return;
    }
    
    const results = {};
    
    // Test each game mode for question repetition
    for (const [modeName, gameMode] of Object.entries(window.gameEngine.gameModes)) {
        console.log(`🎮 Testing ${modeName} for question repetition...`);
        
        const questions = [];
        const usedItems = new Set();
        let hasRepeats = false;
        
        try {
            // Generate 10 questions to test for repeats
            for (let i = 0; i < 10; i++) {
                const question = await gameMode.generateQuestion(i + 1);
                if (question) {
                    // Create a unique identifier for the question
                    const questionId = question.question || question.sentence || question.context || JSON.stringify(question);
                    
                    if (usedItems.has(questionId)) {
                        hasRepeats = true;
                        console.log(`❌ ${modeName}: Repeat found at question ${i + 1}`);
                    } else {
                        usedItems.add(questionId);
                    }
                    
                    questions.push({
                        id: questionId,
                        type: question.type || 'unknown',
                        index: i + 1
                    });
                }
            }
            
            results[modeName] = {
                status: hasRepeats ? 'FAIL' : 'PASS',
                totalQuestions: questions.length,
                uniqueQuestions: usedItems.size,
                hasRepeats: hasRepeats
            };
            
            console.log(`${hasRepeats ? '❌' : '✅'} ${modeName}: ${usedItems.size}/${questions.length} unique questions`);
            
        } catch (error) {
            results[modeName] = {
                status: 'ERROR',
                error: error.message
            };
            console.log(`❌ ${modeName}: Error - ${error.message}`);
        }
    }
    
    const passed = Object.values(results).filter(r => r.status === 'PASS').length;
    const total = Object.keys(results).length;
    
    console.log(`\n📊 No Repeat Test Results: ${passed}/${total} passed`);
    console.log('Results:', results);
    
    return results;
};

console.log('🧪 Enhanced testing functions added: testCSVIntegration(), testAllGameModes(), testVocabularyUsage(), testQuestionVariety()');

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameEngine, BaseGame };
}
