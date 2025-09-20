/**
 * Answer Feedback System
 * Universal feedback system for all game modes
 */

class AnswerFeedback {
    constructor() {
        this.feedbackActive = false;
        this.nextButtonAdded = false;
    }

    /**
     * Show visual feedback for selected answer
     * @param {number} selectedIndex - Index of selected answer
     * @param {number} correctIndex - Index of correct answer
     * @param {string} buttonSelector - CSS selector for choice buttons
     */
    showFeedback(selectedIndex, correctIndex, buttonSelector = '.choice-btn') {
        console.log(`🎯 FEEDBACK DEBUG: Selected ${selectedIndex}, Correct ${correctIndex}, Selector: '${buttonSelector}'`);
        if (this.feedbackActive) return;
        this.feedbackActive = true;

        const buttons = document.querySelectorAll(buttonSelector);
        console.log(`🔍 Found ${buttons.length} buttons with selector '${buttonSelector}'`);
        
        buttons.forEach((btn, i) => {
            btn.style.pointerEvents = 'none';
            btn.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            if (i === selectedIndex) {
                this.styleSelectedButton(btn, i === correctIndex);
            } else if (i === correctIndex) {
                this.styleCorrectButton(btn);
            } else {
                this.styleIncorrectButton(btn);
            }
        });

        // Add next button after feedback
        setTimeout(() => {
            console.log('⏰ Timeout reached - calling addNextButton()');
            this.addNextButton();
        }, 600);

        // Trigger haptic feedback
        if (window.triggerHaptic) {
            window.triggerHaptic(selectedIndex === correctIndex ? 'success' : 'error');
        }
    }

    /**
     * Style the selected button based on correctness (keeping original shape)
     */
    styleSelectedButton(btn, isCorrect) {
        // Preserve original button structure and shape
        if (isCorrect) {
            btn.style.backgroundColor = '#22c55e'; // green-500
            btn.style.borderColor = '#16a34a'; // green-600
            btn.style.color = 'white';
            btn.style.boxShadow = '0 10px 25px rgba(34, 197, 94, 0.5)';
            btn.style.transform = 'scale(1.05)';
            
            // Add checkmark without changing structure
            const icon = btn.querySelector('i') || btn.querySelector('.w-8');
            if (icon) {
                icon.setAttribute('data-lucide', 'check-circle');
                icon.style.color = 'white';
            }
        } else {
            btn.style.backgroundColor = '#ef4444'; // red-500
            btn.style.borderColor = '#dc2626'; // red-600
            btn.style.color = 'white';
            btn.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.5)';
            btn.style.transform = 'scale(1.05)';
            
            // Add X mark without changing structure
            const icon = btn.querySelector('i') || btn.querySelector('.w-8');
            if (icon) {
                icon.setAttribute('data-lucide', 'x-circle');
                icon.style.color = 'white';
            }
        }

        // Smooth animation
        btn.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        btn.style.animation = 'pulse 0.6s ease-in-out';
        
        // Update Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Style the correct answer button (keeping original shape)
     */
    styleCorrectButton(btn) {
        // Preserve original button structure and add green styling
        btn.style.backgroundColor = '#4ade80'; // green-400
        btn.style.borderColor = '#22c55e'; // green-500
        btn.style.color = 'white';
        btn.style.boxShadow = '0 0 20px rgba(74, 222, 128, 0.6)';
        btn.style.transform = 'scale(1.02)';
        btn.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Add subtle check icon without changing structure
        const icon = btn.querySelector('i') || btn.querySelector('.w-8');
        if (icon) {
            icon.setAttribute('data-lucide', 'check');
            icon.style.color = 'white';
        }
        
        // Update Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Style incorrect buttons
     */
    styleIncorrectButton(btn) {
        btn.style.opacity = '0.3';
        btn.style.transform = 'scale(0.95)';
        btn.style.filter = 'grayscale(0.5)';
    }

    /**
     * Add next question button - BULLETPROOF SINGLE SYSTEM
     */
    addNextButton() {
        // EMERGENCY: Reset flag if stuck
        if (window.nextQuestionButtonExists && !document.getElementById('nextQuestionButton')) {
            console.log('🔄 EMERGENCY: Flag stuck but no button exists, resetting...');
            window.nextQuestionButtonExists = false;
            this.nextButtonAdded = false;
        }
        
        // CRITICAL: Check global flag first to prevent any duplicate
        if (window.nextQuestionButtonExists) {
            console.log('🛑 GLOBAL FLAG: Next Question button already exists, blocking duplicate');
            return;
        }
        
        if (this.nextButtonAdded) {
            console.log('🛑 INSTANCE FLAG: Button already added by this instance');
            return;
        }
        
        // Remove any existing buttons first (aggressive cleanup)
        const existingGameEngineBtn = document.getElementById('nextQuestionBtn');
        const existingFeedbackBtn = document.getElementById('nextQuestionButton');
        const anyNextButton = document.querySelector('button[onclick*="nextQuestion"]');
        
        if (existingGameEngineBtn) {
            existingGameEngineBtn.remove();
            console.log('🧹 Removed GameEngine button');
        }
        
        if (existingFeedbackBtn) {
            console.log('✅ AnswerFeedback button already exists, blocking duplicate');
            return;
        }
        
        if (anyNextButton) {
            console.log('🛑 ANY next button found, blocking duplicate creation');
            return;
        }
        
        // Set BOTH flags to prevent race conditions
        this.nextButtonAdded = true;
        window.nextQuestionButtonExists = true;

        // Find the best container for the button with better detection
        let gameContainer = null;
        
        // Try multiple container strategies - PRIORITIZE VISIBLE CONTAINERS
        const containerSelectors = [
            // Visual Learning specific containers
            '#visualLearningContainer',
            '#visualLearningContent',
            '#visualLearningScreen',
            // Multiple Choice containers
            '#multipleChoiceContainer',
            '#multipleChoiceContent',
            '#multipleChoiceScreen',
            // Conversation containers
            '#conversationContainer',
            '#conversationContent',
            '#conversationScreen',
            // Modal Verbs containers
            '#modalVerbsContainer',
            '#modalVerbsContent',
            '#modalVerbsScreen',
            // Time Telling containers
            '#timeTellingContainer',
            '#timeTellingContent',
            '#timeTellingScreen',
            // Vocabulary Learning containers
            '#vocabularyLearningContainer',
            '#vocabularyLearningContent',
            '#vocabularyLearningScreen',
            // Generic visible containers
            '.screen:not(.hidden)',  // PRIORITY: Visible screens first
            '[id$="Content"]:not(.hidden)',
            '[id$="Container"]:not(.hidden)',
            '.max-w-4xl:not(.hidden)',
            '.game-container:not(.hidden)',
            'main:not(.hidden)',
            '#app'
        ];
        
        // DEBUG: List all available containers first
        console.log('🔍 DEBUG: Checking all available containers...');
        containerSelectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`✅ Found: ${selector}`, {
                    id: element.id,
                    className: element.className,
                    hidden: element.classList.contains('hidden'),
                    visible: element.offsetWidth > 0 && element.offsetHeight > 0,
                    display: window.getComputedStyle(element).display,
                    visibility: window.getComputedStyle(element).visibility
                });
            } else {
                console.log(`❌ Not found: ${selector}`);
            }
        });

        for (const selector of containerSelectors) {
            gameContainer = document.querySelector(selector);
            if (gameContainer && !gameContainer.classList.contains('hidden')) {
                console.log(`📍 Selected container: ${selector}`);
                console.log(`🔍 Container details:`, {
                    id: gameContainer.id,
                    className: gameContainer.className,
                    visible: gameContainer.offsetWidth > 0 && gameContainer.offsetHeight > 0,
                    display: window.getComputedStyle(gameContainer).display,
                    visibility: window.getComputedStyle(gameContainer).visibility
                });
                break;
            }
        }
        
        // Fallback to body
        if (!gameContainer) {
            gameContainer = document.body;
            console.log('📍 Using fallback container: body');
        }

        const nextButton = document.createElement('div');
        nextButton.id = 'nextQuestionButton';
        nextButton.className = 'text-center mt-8 animate-fadeIn';
        nextButton.style.cssText = `
            display: block !important; 
            visibility: visible !important; 
            opacity: 1 !important; 
            z-index: 1000 !important;
            position: relative !important;
            width: 100% !important;
            margin: 2rem auto !important;
            padding: 1rem !important;
        `;
        nextButton.innerHTML = `
            <button class="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold
                         bg-gradient-to-r from-blue-500 to-purple-600 
                         hover:from-blue-600 hover:to-purple-700
                         transform hover:scale-105 transition-all duration-300
                         shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40
                         rounded-xl"
                    onclick="window.gameEngine ? window.gameEngine.nextQuestion() : window.answerFeedback.nextQuestion()"
                    style="
                        min-width: 200px !important;
                        display: inline-block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        position: relative !important;
                        z-index: 1001 !important;
                    ">
                <i data-lucide="arrow-right" class="w-5 h-5 inline mr-2"></i>
                Next Question
            </button>
        `;

        // CRITICAL: Ensure container is ready before appending
        if (!gameContainer) {
            console.error('❌ No container found for Next Question button!');
            return;
        }

        console.log(`🎯 Appending button to container:`, {
            containerId: gameContainer.id,
            containerTag: gameContainer.tagName,
            containerClasses: gameContainer.className
        });

        // Try to append to the container
        try {
            gameContainer.appendChild(nextButton);
            console.log('✅ Button appended successfully');
        } catch (error) {
            console.error('❌ Failed to append button:', error);
            // Emergency fallback - append to body
            console.log('🚨 EMERGENCY: Appending to body instead');
            document.body.appendChild(nextButton);
            nextButton.style.position = 'fixed !important';
            nextButton.style.bottom = '20px !important';
            nextButton.style.left = '50% !important';
            nextButton.style.transform = 'translateX(-50%) !important';
            nextButton.style.zIndex = '9999 !important';
        }

        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // DEBUG: Verify button is actually visible
        setTimeout(() => {
            const createdButton = document.getElementById('nextQuestionButton');
            if (createdButton) {
                const rect = createdButton.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(createdButton);
                console.log('🔍 Button visibility check:', {
                    exists: !!createdButton,
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    opacity: computedStyle.opacity,
                    zIndex: computedStyle.zIndex,
                    position: computedStyle.position,
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left
                });
                
                // Force visibility if hidden
                if (rect.width === 0 || rect.height === 0 || computedStyle.display === 'none') {
                    console.log('🚨 Button not visible, forcing visibility...');
                    createdButton.style.display = 'block !important';
                    createdButton.style.visibility = 'visible !important';
                    createdButton.style.opacity = '1 !important';
                    createdButton.style.position = 'relative !important';
                    createdButton.style.zIndex = '1000 !important';
                    
                    // EMERGENCY: Try moving to body if still not visible
                    setTimeout(() => {
                        const stillHidden = createdButton.getBoundingClientRect().width === 0;
                        if (stillHidden) {
                            console.log('🚨 EMERGENCY: Moving button to body...');
                            document.body.appendChild(createdButton);
                            createdButton.style.position = 'fixed !important';
                            createdButton.style.bottom = '20px !important';
                            createdButton.style.left = '50% !important';
                            createdButton.style.transform = 'translateX(-50%) !important';
                            createdButton.style.zIndex = '9999 !important';
                        }
                    }, 200);
                }
            } else {
                console.log('❌ Button not found after creation!');
            }
        }, 100);
        
        console.log('✅ Single Next Question button created');
    }

    /**
     * Proceed to next question
     */
    nextQuestion() {
        // Reset feedback state
        this.feedbackActive = false;
        this.nextButtonAdded = false;

        // Remove next button
        const nextBtn = document.getElementById('nextQuestionButton');
        if (nextBtn) {
            nextBtn.remove();
        }

        // Trigger next question through game engine
        if (window.gameEngine && window.gameEngine.nextQuestion) {
            window.gameEngine.nextQuestion();
        } else {
            console.warn('No next question method available');
        }
    }

    /**
     * Reset feedback system for new question - BULLETPROOF CLEANUP
     */
    reset() {
        this.feedbackActive = false;
        this.nextButtonAdded = false;
        
        // CRITICAL: Clear global flag
        window.nextQuestionButtonExists = false;
        
        // Aggressive button cleanup - remove ALL possible next buttons
        const feedbackBtn = document.getElementById('nextQuestionButton');
        const gameEngineBtn = document.getElementById('nextQuestionBtn');
        const anyNextButtons = document.querySelectorAll('button[onclick*="nextQuestion"], [id*="nextQuestion"], [class*="next-question"]');
        
        if (feedbackBtn) {
            feedbackBtn.remove();
            console.log('🧹 Removed AnswerFeedback next button');
        }
        
        if (gameEngineBtn) {
            gameEngineBtn.remove();
            console.log('🧹 Removed GameEngine next button');
        }
        
        // Remove any other next buttons
        anyNextButtons.forEach(btn => {
            if (btn && btn.parentNode) {
                btn.parentNode.remove();
                console.log('🧹 Removed orphan next button');
            }
        });

        // CRITICAL: Re-enable ALL buttons (fix stuck issue)
        const allChoiceButtons = document.querySelectorAll(`
            button[onclick*="selectChoice"], 
            .choice-btn, .conversation-choice, .modal-choice, 
            .time-choice, .visual-choice, .formation-choice, 
            .reading-choice, .vocab-choice, .conversation-builder-choice,
            button[onclick*="multipleChoice"], button[onclick*="conversation"],
            button[onclick*="modalVerbs"], button[onclick*="timeTelling"]
        `);
        
        allChoiceButtons.forEach(btn => {
            try {
                if (typeof this.resetButtonStyle === 'function') {
                    this.resetButtonStyle(btn);
                } else {
                    // Fallback manual reset
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    btn.style.color = '';
                    btn.style.boxShadow = '';
                    btn.style.transform = '';
                    btn.style.filter = '';
                    btn.style.opacity = '';
                }
                
                // FORCE re-enable pointer events
                btn.style.pointerEvents = 'auto';
                btn.style.cursor = 'pointer';
                btn.disabled = false;
                console.log('🔓 Button re-enabled:', btn.textContent?.slice(0, 20) + '...');
            } catch (error) {
                console.error('⚠️ Button reset error:', error);
                // Emergency fallback
                btn.style.pointerEvents = 'auto';
                btn.style.cursor = 'pointer';
                btn.disabled = false;
            }
        });
        
        console.log(`✅ Reset complete: ${allChoiceButtons.length} buttons re-enabled`);
    }

    /**
     * Reset button to original style
     */
    resetButtonStyle(btn) {
        // Remove all feedback styles
        btn.style.backgroundColor = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.style.boxShadow = '';
        btn.style.transform = '';
        btn.style.filter = '';
        btn.style.opacity = '';
        btn.style.pointerEvents = 'auto';
        btn.style.cursor = 'pointer';
        btn.disabled = false;
        
        // Reset any icon changes
        const icon = btn.querySelector('i') || btn.querySelector('.w-8');
        if (icon) {
            icon.removeAttribute('data-lucide');
            icon.style.color = '';
        }
    }

    /**
     * Show explanation modal (optional)
     */
    showExplanation(explanation, word = '') {
        if (!explanation) return;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-2xl p-8 max-w-md mx-4 animate-slideUp">
                <div class="text-center">
                    <i data-lucide="lightbulb" class="w-12 h-12 text-yellow-400 mx-auto mb-4"></i>
                    <h3 class="text-xl font-bold text-white mb-4">
                        ${word ? `About "${word}"` : 'Explanation'}
                    </h3>
                    <p class="text-gray-300 mb-6 leading-relaxed">${explanation}</p>
                    <button class="btn btn-primary px-6 py-2" onclick="this.closest('.fixed').remove()">
                        <i data-lucide="check" class="w-4 h-4 inline mr-2"></i>
                        Got it!
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Auto-close after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);
    }
}

// CSS animations for feedback
const feedbackStyles = `
    @keyframes pulse {
        0%, 100% { transform: scale(1.05); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(50px) scale(0.9); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
    }
    
    .animate-slideUp {
        animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = feedbackStyles;
document.head.appendChild(styleSheet);

// Global instance - Initialize only if not exists
if (!window.answerFeedback) {
    window.answerFeedback = new AnswerFeedback();
}

console.log('🎯 Answer Feedback System loaded');
