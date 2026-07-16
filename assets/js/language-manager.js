/**
 * Language Manager - Multilingual Support System
 * Supports English and Simplified Chinese with instant switching
 *
 * Static HTML opts in via data-i18n="key" attributes.
 * Dynamically rendered UI (game engine, TOEIC modules) uses
 * window.languageManager.getText(key) and re-renders on the
 * 'languageChanged' window event.
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.supportedLanguages = ['en', 'zh-CN'];
        this.translations = {
            en: {
                // Welcome Screen
                'welcome.title': 'Master the',
                'welcome.subtitle': 'TOEIC Test',
                'welcome.description': 'Complete TOEIC test preparation platform with vocabulary, reading, listening practice, and full test simulations. Achieve your target score with 3000+ business English words and comprehensive study materials.',

                // Study Modules Grid
                'modules.heading': 'TOEIC Study Modules',
                'module.vocabulary.title': 'TOEIC Vocabulary',
                'module.vocabulary.desc': 'Master 3000+ business English words with spaced repetition',
                'module.vocabulary.badge1': '3000+ Words',
                'module.vocabulary.badge2': 'Spaced Repetition',
                'module.reading.title': 'TOEIC Reading',
                'module.reading.desc': 'Practice reading comprehension with business texts and passages',
                'module.reading.badge1': 'Business Texts',
                'module.reading.badge2': 'Comprehension',
                'module.listening.title': 'TOEIC Listening',
                'module.listening.desc': 'Practice listening skills with business conversations and talks',
                'module.listening.badge1': 'Audio Practice',
                'module.listening.badge2': 'Business English',
                'module.test.title': 'TOEIC Test Simulation',
                'module.test.desc': 'Take full-length TOEIC practice tests with real timing',
                'module.test.badge1': 'Full Test',
                'module.test.badge2': 'Real Timing',
                'module.strategies.title': 'Study Strategies',
                'module.strategies.desc': 'Learn effective TOEIC test-taking strategies and tips',
                'module.strategies.badge1': 'Tips',
                'module.strategies.badge2': 'Strategies',
                'module.flashcards.title': 'Flashcard System',
                'module.flashcards.desc': 'Review TOEIC vocabulary with intelligent flashcards',
                'module.flashcards.badge1': 'Smart Review',
                'module.flashcards.badge2': 'Adaptive',
                'module.grammar.title': 'Grammar Practice',
                'module.grammar.desc': 'Master TOEIC grammar patterns and structures',
                'module.grammar.badge1': 'Grammar',
                'module.grammar.badge2': 'Patterns',
                'module.history.title': 'Test History',
                'module.history.desc': 'View your TOEIC practice test results and progress',
                'module.history.badge1': 'History',
                'module.history.badge2': 'Results',
                'module.dailyConversation.title': 'Daily Conversation',
                'module.dailyConversation.desc': 'Practice everyday English conversations with real-life dialogues',
                'module.dailyConversation.badge1': 'Real Dialogues',
                'module.dailyConversation.badge2': 'Speaking Practice',

                // Status Bar
                'status.question': 'Question',
                'status.score': 'Score:',

                // Floating Game Controls (game-engine tooltips)
                'control.progress': 'Toggle Progress Panel (Drag to move)',
                'control.home': 'Go to Home (Drag to move)',

                // Settings Drawer
                'settings.audioSection': 'Audio',
                'settings.enableAudio': 'Enable Audio',
                'settings.autoPlay': 'Auto-play Pronunciation',
                'settings.audioFeedback': 'Answer Sound Effects',
                'settings.speechRate': 'Speech Rate',
                'settings.volume': 'Volume',
                'settings.gameSection': 'Practice',
                'settings.showHints': 'Show Hints',
                'settings.autoNext': 'Auto Next Question',
                'settings.animations': 'Animations',
                'settings.adaptive': 'Adaptive',
                'settings.fixed': 'Fixed',
                'settings.progressive': 'Progressive',
                'settings.interfaceSection': 'Interface',
                'settings.fontSize': 'Font Size',
                'settings.small': 'Small',
                'settings.medium': 'Medium',
                'settings.large': 'Large',
                'settings.highContrast': 'High Contrast',
                'settings.reducedMotion': 'Reduced Motion',
                'settings.resetDefaults': 'Reset to Defaults',
                'settings.resetConfirm': 'Reset all settings to defaults?',

                // Study Dashboard
                'dashboard.continueLearning': 'Continue Learning',
                'dashboard.continue': 'Continue',
                'dashboard.startLearning': 'Start Learning',
                'dashboard.newHere': 'Ready to start?',
                'dashboard.pickUp': 'Pick up where you left off',
                'dashboard.suggestion': 'Vocabulary is a great first step',
                'dashboard.wordOfTheDay': 'Word of the Day',
                'dashboard.practiceWord': 'Practice Vocabulary',
                'dashboard.yourProgress': 'Your Progress',
                'dashboard.streakDays': 'Day Streak',
                'dashboard.wordsStudied': 'Words Studied',
                'dashboard.testsTaken': 'Tests Taken',
                'dashboard.bestScore': 'Best',
                'dashboard.conversationsDone': 'Conversations',
                'listening.startPractice': 'Start Listening Practice',
                'vocab.tapHint': 'Tap the card or press Space to reveal the meaning',
                'grammar.keyboardHint': 'Keys 1-4 answer · Enter continues',
                'reading.doublePassage': 'DOUBLE PASSAGE',
                'reading.text1': 'TEXT 1',
                'reading.text2': 'TEXT 2',
                'reading.questionsRefer': 'Questions {start}–{end} refer to the following text.',
                'reading.questionRefers': 'Question {n} refers to the following text.',
                'reading.instrPart5': 'Select the best word or phrase to complete the sentence.',
                'reading.words': '{count} words',
                'reading.seeResults': 'See Results',
                'reading.kbdHint': 'A–D to select · Enter to confirm',
                'reading.docType.email': 'E-MAIL',
                'reading.docType.article': 'ARTICLE',
                'reading.docType.ad': 'ADVERTISEMENT',
                'reading.docType.memo': 'MEMO',
                'reading.docType.letter': 'LETTER',
                'reading.docType.form': 'SCHEDULE',
                'reading.docType.text': 'TEXT',
                'listening.practiceDesc': 'Answer TOEIC-style listening questions with full transcripts',
                'flashcards.settingsDesc': 'Adjust your flashcard review preferences',
                'grammar.practiceAllDesc': 'Work through questions from every grammar category',
                'grammar.mixedPracticeDesc': 'A shuffled mix of questions across categories',
                'grammar.viewRulesDesc': 'Browse the grammar rules reference',

                // Shared Quiz Chrome
                'quiz.checkAnswer': 'Check Answer',
                'quiz.nextQuestion': 'Next Question',
                'quiz.previousQuestion': 'Previous',
                'quiz.submit': 'Submit',
                'quiz.finish': 'Finish',
                'quiz.correct': 'Correct!',
                'quiz.incorrect': 'Incorrect',
                'quiz.correctAnswerIs': 'The correct answer is:',
                'quiz.explanation': 'Explanation',
                'quiz.score': 'Score',
                'quiz.accuracy': 'Accuracy',
                'quiz.progress': 'Progress',
                'quiz.questionOf': 'Question {current} of {total}',
                'quiz.backToMenu': 'Back to Menu',
                'quiz.playAgain': 'Play Again',
                'quiz.startPractice': 'Start Practice',
                'quiz.continue': 'Continue',
                'quiz.showAnswer': 'Show Answer',
                'quiz.results': 'Results',
                'quiz.completed': 'Practice Complete!',
                'quiz.correctAnswers': 'Correct Answers',
                'quiz.totalQuestions': 'Total Questions',
                'quiz.timeSpent': 'Time Spent',
                'quiz.loading': 'Loading...',

                // Daily Conversation Practice
                'conversation.title': 'Daily Conversation Practice',
                'conversation.subtitle': 'Practice real-life English conversations',
                'conversation.chooseScenario': 'Choose a Scenario',
                'conversation.listenAndRead': 'Read the conversation, then answer the questions',
                'conversation.dialogue': 'Dialogue',
                'conversation.questions': 'Questions',
                'conversation.usefulPhrases': 'Useful Phrases',
                'conversation.nextScenario': 'Next Scenario',
                'conversation.scenarioComplete': 'Scenario Complete!',
                'conversation.yourTurn': 'Your Turn',
                'conversation.yourTurnDesc': 'Play the conversation yourself — choose what to say',
                'conversation.answerQuestions': 'Answer Questions',
                'conversation.answerQuestionsDesc': 'Check how well you understood the dialogue',
                'conversation.chooseReply': 'What do you say next? Choose the reply that fits the conversation.',
                'conversation.chooseOpener': 'You speak first! How do you start this conversation?',
                'conversation.contextTip': 'Context tip',
                'conversation.you': 'You',
                'conversation.youArePlaying': 'You are playing',
                'conversation.conversationStarts': 'The conversation is starting...',
                'conversation.practiceComplete': 'Conversation Complete!',
                'conversation.firstTryNote': 'Score counts replies you chose correctly on the first try.',

                // Common UI
                'common.backToHome': 'Back to Home',
                'common.backToMainMenu': 'Back to Main Menu',
                'common.mainMenu': 'Main Menu',
                'common.exit': 'Exit',
                'common.exitSession': 'Exit Session',
                'common.endSession': 'End Session',
                'common.next': 'Next',
                'common.cancel': 'Cancel',
                'common.close': 'Close',
                'common.time': 'Time',
                'common.correct': 'Correct',
                'common.incorrect': 'Incorrect',
                'common.incorrectAnswers': 'Incorrect Answers',
                'common.total': 'Total',
                'common.mode': 'Mode',
                'common.yourProgress': 'Your Progress',
                'common.overallAccuracy': 'Overall Accuracy',
                'common.practiceAgain': 'Practice Again',
                'common.autoContinuing': 'Auto-continuing in {seconds} seconds...',
                'common.minutes': '{count} min',
                'common.welcome': 'Welcome,',
                'common.logout': 'Logout',
                'common.adminPanel': 'Admin Panel',
                'common.moduleNotAvailable': 'Module Not Available',
                'common.underDevelopment': 'This module is under development.',
                'welcome.ready': 'Ready to master TOEIC?',

                // Quiz feedback marks
                'quiz.correctMark': '✓ Correct',
                'quiz.wrongMark': '✗ Wrong',
                'quiz.yourAnswerMark': '✗ Your Answer',

                // Immediate feedback
                'feedback.timeUp': "Time's Up!",
                'feedback.timeUpMsg': "Time's up! The correct answer has been highlighted.",
                'feedback.correctMsg': 'Correct! Well done!',
                'feedback.incorrectMsg': 'Incorrect. The correct answer has been highlighted.',

                // Hero Carousel
                'hero.vocabulary.title': 'TOEIC Vocabulary',
                'hero.vocabulary.desc': 'Master essential TOEIC vocabulary with spaced repetition and interactive flashcards',
                'hero.vocabulary.highlight': '620+ Words',
                'hero.vocabulary.action': 'Start Vocabulary',
                'hero.reading.title': 'TOEIC Reading',
                'hero.reading.desc': 'Practice reading comprehension with real TOEIC-style passages and questions',
                'hero.reading.highlight': '25 Questions',
                'hero.reading.action': 'Start Reading',
                'hero.grammar.title': 'TOEIC Grammar',
                'hero.grammar.desc': 'Master essential grammar patterns with 22 practice questions and explanations',
                'hero.grammar.highlight': '8 Categories',
                'hero.grammar.action': 'Start Grammar',
                'hero.test.title': 'TOEIC Test Simulator',
                'hero.test.desc': 'Take full-length practice tests to simulate the real TOEIC exam experience',
                'hero.test.highlight': 'Full Test',
                'hero.test.action': 'Start Test',
                'hero.flashcards.title': 'TOEIC Flashcards',
                'hero.flashcards.desc': 'Review vocabulary with intelligent flashcards and spaced repetition system',
                'hero.flashcards.highlight': 'Smart Learning',
                'hero.flashcards.action': 'Start Flashcards',
                'hero.fallback.title': 'Master English Vocabulary',
                'hero.fallback.desc': 'Professional ESL learning platform with 12 interactive game modes and 731+ vocabulary words across all levels',
                'hero.fallback.startLearning': 'Start Learning',
                'hero.fallback.vocabularyMode': 'Vocabulary Mode',

                // Vocabulary Module
                'vocab.practiceTitle': 'TOEIC Vocabulary Practice',
                'vocab.learningTitle': 'TOEIC Vocabulary Learning',
                'vocab.learningSubtitle': 'Master business English vocabulary with spaced repetition',
                'vocab.loadingVocabulary': 'Loading vocabulary...',
                'vocab.reloadVocabulary': 'Reload Vocabulary',
                'vocab.totalVocabulary': 'Total vocabulary: {count} words',
                'vocab.fallbackVocabulary': 'Using fallback vocabulary (2 words) - Click "Reload Vocabulary" to load CSV',
                'vocab.reloadSuccess': 'Vocabulary reloaded! Now using {count} words from CSV file.',
                'vocab.reloadFailed': 'Failed to reload vocabulary. Check console for details.',
                'vocab.systemUnavailable': 'Vocabulary system not available',
                'vocab.wordsRemaining': 'Words Remaining',
                'vocab.wordsStudied': 'Words Studied',
                'vocab.masteryLevel': 'Mastery Level',
                'vocab.startSession': 'Start Vocabulary Session',
                'vocab.showMeaning': 'Show Meaning',
                'vocab.clickToReveal': 'Click "Show Meaning" to reveal the definition',
                'vocab.exampleSentences': 'Example Sentences',
                'vocab.didYouKnow': 'Did you know this word?',
                'vocab.iKnowIt': 'I Know It',
                'vocab.iDontKnow': "I Don't Know",
                'vocab.sessionComplete': 'Session Complete!',
                'vocab.sessionCompleteDesc': "Great job! You've completed this vocabulary session.",
                'vocab.startNewSession': 'Start New Session',

                // Reading Module
                'reading.practiceTitle': 'TOEIC Reading Practice',
                'reading.comprehensionTitle': 'TOEIC Reading Comprehension',
                'reading.comprehensionSubtitle': 'Master reading skills with authentic TOEIC-style passages and questions',
                'reading.comprehension': 'Reading Comprehension',
                'reading.comprehensionDesc': 'Answer questions about reading passages',
                'reading.passagesRead': 'Passages Read',
                'reading.speed': 'Reading Speed',
                'reading.startSession': 'Start Reading Session',
                'reading.practiceMode': 'Practice Mode',
                'reading.passage': 'Passage',
                'reading.readingPassage': 'Reading Passage',
                'reading.questionDefault': 'Reading Question',
                'reading.timeLimit': 'Time Limit',
                'reading.chooseAnswer': 'Choose your answer:',
                'reading.tip': 'Tip: Read the passage carefully and choose the best answer based on the information provided.',
                'reading.submitAnswer': 'Submit Answer',
                'reading.sessionStats': 'Correct: {correct} | Incorrect: {incorrect} | Time: {time}s',
                'reading.noMaterials': 'No Reading Materials Available',
                'reading.checkBackLater': 'Please check back later for new reading passages.',
                'reading.backToReadingModule': 'Back to Reading Module',
                'reading.backToReading': 'Back to Reading',
                'reading.sessionComplete': 'Reading Session Complete!',
                'reading.practiceComplete': 'Reading Practice Complete!',
                'reading.practiceCompleteDesc': 'Great job on completing your TOEIC reading practice session.',
                'reading.answerReview': 'Answer Review - Learn from Your Mistakes',
                'reading.answerOptions': 'Answer Options:',
                'reading.passagesCount': 'Reading Passages',
                'reading.practiceQuestions': 'Practice Questions',
                'reading.averageAccuracy': 'Average Accuracy',
                'reading.questionsAnswered': 'Questions Answered',
                'reading.quickPractice': 'Quick Practice',
                'reading.quickPracticeDesc': 'Start with 5-10 questions for a quick reading practice session',
                'reading.fullPractice': 'Full Practice',
                'reading.fullPracticeDesc': 'Complete reading practice with 20-25 questions like the real TOEIC test',
                'reading.practice5': 'Practice 5 Questions',
                'reading.practice10': 'Practice 10 Questions',
                'reading.practice20': 'Practice 20 Questions',
                'reading.practice25': 'Practice 25 Questions',
                'reading.focusSkills': 'Focus on Specific Skills',
                'reading.incompleteSentences': 'Incomplete Sentences',
                'reading.incompleteSentencesDesc': 'Practice grammar and vocabulary in context',
                'reading.textCompletion': 'Text Completion',
                'reading.textCompletionDesc': 'Fill in the blanks in reading passages',
                'reading.recentPerformance': 'Recent Performance',
                'reading.nQuestions': '{count} Questions',
                'reading.correctRatio': '{correct}/{total} correct',
                'reading.loadingQuestion': 'Loading Question...',
                'reading.loadingQuestionDesc': 'Please wait while we prepare your reading question.',

                // Listening Module
                'listening.practiceTitle': 'TOEIC Listening Practice',
                'listening.exercisesCompleted': 'Exercises Completed',
                'listening.responseTime': 'Response Time',

                // Test Module
                'test.simulatorTitle': 'TOEIC Test Simulator',
                'test.chooseType': 'Choose your test type and start practicing',
                'test.testsCompleted': 'Tests Completed',
                'test.bestScore': 'Best Score',
                'test.averageScore': 'Average Score',
                'test.startFullTimed': 'Start Full TOEIC Test (2 hours)',
                'test.listeningOnly': 'Listening Section Only (45 min)',
                'test.readingOnly': 'Reading Section Only (75 min)',
                'test.fullTest': 'Full TOEIC Test',
                'test.fullTestDesc': 'Complete 200-question test (Listening + Reading)',
                'test.listeningTest': 'Listening Test',
                'test.listeningTestDesc': 'Practice listening comprehension with 100 questions',
                'test.readingTest': 'Reading Test',
                'test.readingTestDesc': 'Practice reading comprehension with 100 questions',
                'test.listeningParts': '100 listening questions (Parts 1-4)',
                'test.readingParts': '100 reading questions (Parts 5-7)',
                'test.startFull': 'Start Full Test',
                'test.startListening': 'Start Listening Test',
                'test.startReading': 'Start Reading Test',
                'test.results': 'Test Results',
                'test.resultsDesc': 'View your previous test scores and progress',
                'test.viewResults': 'View Results',
                'test.durationFull': 'Duration: 2 hours 30 minutes',
                'test.durationListening': 'Duration: 45 minutes',
                'test.durationReading': 'Duration: 75 minutes',
                'test.questions': 'Questions',
                'test.score': 'Score',
                'test.noHistory': 'No test history available',
                'test.settings': 'Test Settings',
                'test.listeningTitle': 'TOEIC Listening Test',
                'test.readingTitle': 'TOEIC Reading Test',
                'test.timeRemaining': 'Time Remaining',
                'test.submitTest': 'Submit Test',
                'test.lookAtPhoto': 'Look at the photograph.',
                'test.transcript': 'Transcript (audio text)',
                'test.photoPlaceholder': '[Photograph would be displayed here]',
                'test.listenQuestion': 'Listen to the question.',
                'test.audioPlaceholder': '[Audio would be played here]',
                'test.listenConversation': 'Listen to the conversation.',
                'test.conversationPlaceholder': '[Conversation audio would be played here]',
                'test.listenTalk': 'Listen to the talk.',
                'test.talkPlaceholder': '[Talk audio would be played here]',
                'test.simulatorUnavailable': 'Test simulator not available',
                'test.noQuestion': 'No question available',
                'test.noOptions': 'No options available',
                'test.unknownType': 'Unknown question type',
                'test.complete': 'Test Complete!',
                'test.estimatedLevel': 'Estimated level',
                'test.toeicScore': 'TOEIC Score',
                'test.takeAnother': 'Take Another Test',
                'test.durationSetting': 'Test Duration',
                'test.optStandard': 'Standard (Official TOEIC timing)',
                'test.optExtended': 'Extended (+25% time)',
                'test.optPractice': 'Practice (No time limit)',
                'test.questionOrder': 'Question Order',
                'test.optSequential': 'Sequential (1-200)',
                'test.optRandom': 'Random',
                'test.optByDifficulty': 'By Difficulty',
                'test.showExplanations': 'Show explanations after each question',
                'test.allowBack': 'Allow going back to previous questions',
                'test.saveSettings': 'Save Settings',

                // Flashcards Module
                'flashcards.title': 'TOEIC Vocabulary Flashcards',
                'flashcards.subtitle': 'Master TOEIC vocabulary with intelligent spaced repetition',
                'flashcards.totalWords': 'Total Words',
                'flashcards.mastered': 'Mastered',
                'flashcards.learning': 'Learning',
                'flashcards.mastery': 'Mastery',
                'flashcards.smartLearning': 'Smart Vocabulary Learning',
                'flashcards.smartLearningDesc': 'Our intelligent system adapts to your learning pace and shows you the right words at the right time.',
                'flashcards.howItWorks': 'How it works:',
                'flashcards.step1': 'Study 20 words at a time',
                'flashcards.step2': "Mark words you know or don't know",
                'flashcards.step3': 'Get new words every 20 completed',
                'flashcards.startLearning': 'Start Learning',
                'flashcards.quickActions': 'Quick Actions',
                'flashcards.viewProgress': 'View Progress',
                'flashcards.definition': 'Definition',
                'flashcards.example': 'Example',
                'flashcards.synonyms': 'Synonyms',
                'flashcards.greatProgress': 'Great Progress!',
                'flashcards.completedWords': "You've completed {count} words!",
                'flashcards.whatsNext': "What's Next?",
                'flashcards.nextWordsDesc': "You're doing great! The next 20 words will be new vocabulary to continue your learning journey.",
                'flashcards.keepLearning': 'Keep Learning',
                'flashcards.newWords': 'New Words',
                'flashcards.buildVocabulary': 'Build Vocabulary',
                'flashcards.continueLearning': 'Continue Learning',
                'flashcards.sessionComplete': 'Flashcard Session Complete!',
                'flashcards.reviewAgain': 'Review Again',
                'flashcards.backToFlashcards': 'Back to Flashcards',
                'flashcards.mode.spacedRepetition.title': 'Spaced Repetition',
                'flashcards.mode.spacedRepetition.desc': 'AI-powered review based on your learning progress',
                'flashcards.mode.newWords.title': 'New Words',
                'flashcards.mode.newWords.desc': 'Learning fresh vocabulary',
                'flashcards.mode.difficultyReview.title': 'Difficulty Review',
                'flashcards.mode.difficultyReview.desc': 'Focusing on challenging words',
                'flashcards.mode.categoryReview.title': 'Category Review',
                'flashcards.mode.categoryReview.desc': 'Studying by business topic',
                'flashcards.mode.quickReview.title': 'Quick Review',
                'flashcards.mode.quickReview.desc': 'Fast 5-minute session',
                'flashcards.mode.examPrep.title': 'Exam Preparation',
                'flashcards.mode.examPrep.desc': 'High-frequency TOEIC words',

                // Grammar Module
                'grammar.practiceTitle': 'TOEIC Grammar Practice',
                'grammar.practiceSubtitle': 'Master essential grammar patterns for TOEIC success',
                'grammar.masteredCategories': 'Mastered Categories',
                'grammar.totalCategories': 'Total Categories',
                'grammar.completion': 'Completion',
                'grammar.practiceAll': 'Practice All Categories',
                'grammar.mixedPractice': 'Mixed Practice',
                'grammar.viewRules': 'View Grammar Rules',
                'grammar.practice': 'Grammar Practice',
                'grammar.completeSession': 'Complete Session',
                'grammar.selectAnswer': 'Please select an answer before submitting.',
                'grammar.continueNext': 'Continue to Next Question',
                'grammar.rule': 'Grammar Rule',
                'grammar.practiceComplete': 'Grammar Practice Complete!',
                'grammar.backToGrammar': 'Back to Grammar',
                'grammar.rulesReference': 'Grammar Rules Reference',
                'grammar.backToPractice': 'Back to Grammar Practice',

                // Settings & Help
                'settings.title': 'Settings',
                'settings.difficulty': 'Difficulty Level',
                'settings.easy': 'Easy',
                'settings.normal': 'Normal',
                'settings.hard': 'Hard',
                'settings.expert': 'Expert',
                'settings.soundEffects': 'Sound Effects',
                'settings.adaptiveDifficulty': 'Adaptive Difficulty',
                'settings.achievementNotifications': 'Achievement Notifications',
                'settings.toeicTitle': 'TOEIC Settings',
                'settings.underDevelopment': 'Settings panel is under development',
                'help.title': 'How to Play',
                'help.gotIt': 'Got it!',
                'help.gameControls': 'Game Controls',
                'help.control1': 'Use mouse/touch to select answers',
                'help.control2': 'Press 1-4 keys for quick selection',
                'help.control3': 'ESC key to exit games',
                'help.control4': 'Ctrl+P to open Progress Dashboard',
                'help.learningSystem': 'Learning System',
                'help.learning1': 'Words are reviewed based on spaced repetition',
                'help.learning2': 'Difficulty adapts to your performance',
                'help.learning3': 'Track progress in the dashboard',
                'help.learning4': 'Earn achievements for milestones',
                'help.scoring': 'Scoring',
                'help.scoring1': 'Correct answers: +10 points',
                'help.scoring2': 'Fast answers: bonus points',
                'help.scoring3': 'Consecutive correct: streak bonus',
                'help.scoring4': 'Daily practice: streak rewards',

                // Errors & Progress
                'error.title': 'Oops! Something went wrong',
                'error.desc': "We're having trouble starting the app.",
                'error.tryAgain': 'Try Again',
                'progress.title': 'TOEIC Progress Analytics',
                'progress.loading': 'Analytics dashboard is loading...',

                // Language Switcher
                'language.english': 'English',
                'language.chinese': '中文',
                'language.switch': 'Switch Language'
            },
            'zh-CN': {
                // Welcome Screen
                'welcome.title': '征服',
                'welcome.subtitle': '托业考试',
                'welcome.description': '完整的托业考试备考平台，涵盖词汇、阅读、听力练习和全真模拟测试。通过3000+商务英语词汇和全面的学习材料达到您的目标分数。',

                // Study Modules Grid
                'modules.heading': '托业学习模块',
                'module.vocabulary.title': '托业词汇',
                'module.vocabulary.desc': '通过间隔重复法掌握3000+商务英语词汇',
                'module.vocabulary.badge1': '3000+词汇',
                'module.vocabulary.badge2': '间隔重复',
                'module.reading.title': '托业阅读',
                'module.reading.desc': '通过商务文本和文章练习阅读理解',
                'module.reading.badge1': '商务文本',
                'module.reading.badge2': '阅读理解',
                'module.listening.title': '托业听力',
                'module.listening.desc': '通过商务对话和讲话练习听力技能',
                'module.listening.badge1': '音频练习',
                'module.listening.badge2': '商务英语',
                'module.test.title': '托业模拟考试',
                'module.test.desc': '参加与真实考试计时一致的全长托业模拟测试',
                'module.test.badge1': '全真测试',
                'module.test.badge2': '真实计时',
                'module.strategies.title': '学习策略',
                'module.strategies.desc': '学习有效的托业应试策略和技巧',
                'module.strategies.badge1': '技巧',
                'module.strategies.badge2': '策略',
                'module.flashcards.title': '闪卡系统',
                'module.flashcards.desc': '使用智能闪卡复习托业词汇',
                'module.flashcards.badge1': '智能复习',
                'module.flashcards.badge2': '自适应',
                'module.grammar.title': '语法练习',
                'module.grammar.desc': '掌握托业语法模式和结构',
                'module.grammar.badge1': '语法',
                'module.grammar.badge2': '模式',
                'module.history.title': '测试历史',
                'module.history.desc': '查看您的托业模拟测试成绩和进度',
                'module.history.badge1': '历史',
                'module.history.badge2': '成绩',
                'module.dailyConversation.title': '日常会话',
                'module.dailyConversation.desc': '通过真实生活对话练习日常英语会话',
                'module.dailyConversation.badge1': '真实对话',
                'module.dailyConversation.badge2': '口语练习',

                // Status Bar
                'status.question': '题目',
                'status.score': '得分:',

                // Floating Game Controls (game-engine tooltips)
                'control.progress': '切换进度面板（拖拽移动）',
                'control.home': '返回首页（拖拽移动）',

                // Settings Drawer
                'settings.audioSection': '音频',
                'settings.enableAudio': '启用音频',
                'settings.autoPlay': '自动播放发音',
                'settings.audioFeedback': '答题音效',
                'settings.speechRate': '语速',
                'settings.volume': '音量',
                'settings.gameSection': '练习',
                'settings.showHints': '显示提示',
                'settings.autoNext': '自动下一题',
                'settings.animations': '动画效果',
                'settings.adaptive': '自适应',
                'settings.fixed': '固定',
                'settings.progressive': '渐进式',
                'settings.interfaceSection': '界面',
                'settings.fontSize': '字体大小',
                'settings.small': '小',
                'settings.medium': '中',
                'settings.large': '大',
                'settings.highContrast': '高对比度',
                'settings.reducedMotion': '减少动画',
                'settings.resetDefaults': '恢复默认设置',
                'settings.resetConfirm': '确定要将所有设置恢复为默认值吗？',

                // Study Dashboard
                'dashboard.continueLearning': '继续学习',
                'dashboard.continue': '继续',
                'dashboard.startLearning': '开始学习',
                'dashboard.newHere': '准备好开始了吗？',
                'dashboard.pickUp': '从上次停下的地方继续',
                'dashboard.suggestion': '从词汇开始是个好选择',
                'dashboard.wordOfTheDay': '每日单词',
                'dashboard.practiceWord': '练习词汇',
                'dashboard.yourProgress': '我的进度',
                'dashboard.streakDays': '连续天数',
                'dashboard.wordsStudied': '已学单词',
                'dashboard.testsTaken': '已完成测试',
                'dashboard.bestScore': '最佳',
                'dashboard.conversationsDone': '会话场景',
                'listening.startPractice': '开始听力练习',
                'vocab.tapHint': '点击卡片或按空格键显示词义',
                'grammar.keyboardHint': '按 1-4 键作答 · 回车键继续',
                'reading.doublePassage': '双篇阅读',
                'reading.text1': '短文一',
                'reading.text2': '短文二',
                'reading.questionsRefer': '第 {start}–{end} 题基于以下短文。',
                'reading.questionRefers': '第 {n} 题基于以下短文。',
                'reading.instrPart5': '选择最能完成句子的单词或短语。',
                'reading.words': '{count} 词',
                'reading.seeResults': '查看结果',
                'reading.kbdHint': '按 A–D 选择 · Enter 确认',
                'reading.docType.email': '电子邮件',
                'reading.docType.article': '新闻文章',
                'reading.docType.ad': '广告',
                'reading.docType.memo': '备忘录',
                'reading.docType.letter': '信函',
                'reading.docType.form': '日程表',
                'reading.docType.text': '短文',
                'listening.practiceDesc': '通过带完整文本的托业听力题进行练习',
                'flashcards.settingsDesc': '调整闪卡复习偏好设置',
                'grammar.practiceAllDesc': '练习所有语法类别的题目',
                'grammar.mixedPracticeDesc': '跨类别随机混合练习题目',
                'grammar.viewRulesDesc': '浏览语法规则参考',

                // Shared Quiz Chrome
                'quiz.checkAnswer': '检查答案',
                'quiz.nextQuestion': '下一题',
                'quiz.previousQuestion': '上一题',
                'quiz.submit': '提交',
                'quiz.finish': '完成',
                'quiz.correct': '正确！',
                'quiz.incorrect': '错误',
                'quiz.correctAnswerIs': '正确答案是：',
                'quiz.explanation': '解析',
                'quiz.score': '得分',
                'quiz.accuracy': '正确率',
                'quiz.progress': '进度',
                'quiz.questionOf': '第 {current} 题 / 共 {total} 题',
                'quiz.backToMenu': '返回菜单',
                'quiz.playAgain': '再玩一次',
                'quiz.startPractice': '开始练习',
                'quiz.continue': '继续',
                'quiz.showAnswer': '显示答案',
                'quiz.results': '成绩',
                'quiz.completed': '练习完成！',
                'quiz.correctAnswers': '答对题数',
                'quiz.totalQuestions': '总题数',
                'quiz.timeSpent': '用时',
                'quiz.loading': '加载中...',

                // Daily Conversation Practice
                'conversation.title': '日常会话练习',
                'conversation.subtitle': '练习真实生活中的英语对话',
                'conversation.chooseScenario': '选择场景',
                'conversation.listenAndRead': '阅读对话，然后回答问题',
                'conversation.dialogue': '对话',
                'conversation.questions': '问题',
                'conversation.usefulPhrases': '常用短语',
                'conversation.nextScenario': '下一个场景',
                'conversation.scenarioComplete': '场景完成！',
                'conversation.yourTurn': '轮到你了',
                'conversation.yourTurnDesc': '亲自参与对话——选择你要说的话',
                'conversation.answerQuestions': '回答问题',
                'conversation.answerQuestionsDesc': '检验你对对话的理解程度',
                'conversation.chooseReply': '接下来你该说什么？选择最符合对话情境的回答。',
                'conversation.chooseOpener': '由你先开口！你会怎样开始这段对话？',
                'conversation.contextTip': '语境提示',
                'conversation.you': '你',
                'conversation.youArePlaying': '你扮演的角色是',
                'conversation.conversationStarts': '对话即将开始……',
                'conversation.practiceComplete': '对话完成！',
                'conversation.firstTryNote': '得分只计算第一次就选对的回答。',

                // Common UI
                'common.backToHome': '返回主页',
                'common.backToMainMenu': '返回主菜单',
                'common.mainMenu': '主菜单',
                'common.exit': '退出',
                'common.exitSession': '退出练习',
                'common.endSession': '结束练习',
                'common.next': '下一题',
                'common.cancel': '取消',
                'common.close': '关闭',
                'common.time': '时间',
                'common.correct': '正确',
                'common.incorrect': '错误',
                'common.incorrectAnswers': '答错题数',
                'common.total': '总数',
                'common.mode': '模式',
                'common.yourProgress': '你的进度',
                'common.overallAccuracy': '总正确率',
                'common.practiceAgain': '再次练习',
                'common.autoContinuing': '{seconds}秒后自动继续...',
                'common.minutes': '{count} 分钟',
                'common.welcome': '欢迎，',
                'common.logout': '退出登录',
                'common.adminPanel': '管理面板',
                'common.moduleNotAvailable': '模块不可用',
                'common.underDevelopment': '该模块正在开发中。',
                'welcome.ready': '准备好征服托业了吗？',

                // Quiz feedback marks
                'quiz.correctMark': '✓ 正确',
                'quiz.wrongMark': '✗ 错误',
                'quiz.yourAnswerMark': '✗ 你的答案',

                // Immediate feedback
                'feedback.timeUp': '时间到！',
                'feedback.timeUpMsg': '时间到！正确答案已高亮显示。',
                'feedback.correctMsg': '回答正确！干得漂亮！',
                'feedback.incorrectMsg': '回答错误。正确答案已高亮显示。',

                // Hero Carousel
                'hero.vocabulary.title': '托业词汇',
                'hero.vocabulary.desc': '通过间隔重复和互动闪卡掌握托业核心词汇',
                'hero.vocabulary.highlight': '620+词汇',
                'hero.vocabulary.action': '开始词汇学习',
                'hero.reading.title': '托业阅读',
                'hero.reading.desc': '通过真实托业风格的文章和题目练习阅读理解',
                'hero.reading.highlight': '25道题',
                'hero.reading.action': '开始阅读',
                'hero.grammar.title': '托业语法',
                'hero.grammar.desc': '通过22道练习题和详细解析掌握核心语法模式',
                'hero.grammar.highlight': '8个类别',
                'hero.grammar.action': '开始语法',
                'hero.test.title': '托业模拟考试',
                'hero.test.desc': '参加全长模拟测试，体验真实托业考试',
                'hero.test.highlight': '全真测试',
                'hero.test.action': '开始测试',
                'hero.flashcards.title': '托业闪卡',
                'hero.flashcards.desc': '使用智能闪卡和间隔重复系统复习词汇',
                'hero.flashcards.highlight': '智能学习',
                'hero.flashcards.action': '开始闪卡',
                'hero.fallback.title': '掌握英语词汇',
                'hero.fallback.desc': '专业英语学习平台，提供12种互动游戏模式和731+各级别词汇',
                'hero.fallback.startLearning': '开始学习',
                'hero.fallback.vocabularyMode': '词汇模式',

                // Vocabulary Module
                'vocab.practiceTitle': '托业词汇练习',
                'vocab.learningTitle': '托业词汇学习',
                'vocab.learningSubtitle': '通过间隔重复法掌握商务英语词汇',
                'vocab.loadingVocabulary': '词汇加载中...',
                'vocab.reloadVocabulary': '重新加载词汇',
                'vocab.totalVocabulary': '词汇总量：{count} 个单词',
                'vocab.fallbackVocabulary': '正在使用备用词汇（2个单词）——点击"重新加载词汇"加载CSV文件',
                'vocab.reloadSuccess': '词汇已重新加载！现在使用CSV文件中的 {count} 个单词。',
                'vocab.reloadFailed': '重新加载词汇失败。请查看控制台了解详情。',
                'vocab.systemUnavailable': '词汇系统不可用',
                'vocab.wordsRemaining': '剩余单词',
                'vocab.wordsStudied': '已学单词',
                'vocab.masteryLevel': '掌握程度',
                'vocab.startSession': '开始词汇练习',
                'vocab.showMeaning': '显示词义',
                'vocab.clickToReveal': '点击"显示词义"查看释义',
                'vocab.exampleSentences': '例句',
                'vocab.didYouKnow': '你认识这个单词吗？',
                'vocab.iKnowIt': '我认识',
                'vocab.iDontKnow': '我不认识',
                'vocab.sessionComplete': '练习完成！',
                'vocab.sessionCompleteDesc': '太棒了！你已完成本次词汇练习。',
                'vocab.startNewSession': '开始新练习',

                // Reading Module
                'reading.practiceTitle': '托业阅读练习',
                'reading.comprehensionTitle': '托业阅读理解',
                'reading.comprehensionSubtitle': '通过地道的托业风格文章和题目提升阅读技能',
                'reading.comprehension': '阅读理解',
                'reading.comprehensionDesc': '回答关于阅读文章的问题',
                'reading.passagesRead': '已读文章',
                'reading.speed': '阅读速度',
                'reading.startSession': '开始阅读练习',
                'reading.practiceMode': '练习模式',
                'reading.passage': '文章',
                'reading.readingPassage': '阅读文章',
                'reading.questionDefault': '阅读题',
                'reading.timeLimit': '时间限制',
                'reading.chooseAnswer': '选择你的答案：',
                'reading.tip': '提示：仔细阅读文章，根据文中信息选择最佳答案。',
                'reading.submitAnswer': '提交答案',
                'reading.sessionStats': '正确：{correct} | 错误：{incorrect} | 用时：{time}秒',
                'reading.noMaterials': '暂无阅读材料',
                'reading.checkBackLater': '请稍后再来查看新的阅读文章。',
                'reading.backToReadingModule': '返回阅读模块',
                'reading.backToReading': '返回阅读',
                'reading.sessionComplete': '阅读练习完成！',
                'reading.practiceComplete': '阅读练习完成！',
                'reading.practiceCompleteDesc': '恭喜你完成了本次托业阅读练习！',
                'reading.answerReview': '答案回顾——从错误中学习',
                'reading.answerOptions': '答案选项：',
                'reading.passagesCount': '阅读文章',
                'reading.practiceQuestions': '练习题目',
                'reading.averageAccuracy': '平均正确率',
                'reading.questionsAnswered': '已答题数',
                'reading.quickPractice': '快速练习',
                'reading.quickPracticeDesc': '从5-10道题开始，进行快速阅读练习',
                'reading.fullPractice': '完整练习',
                'reading.fullPracticeDesc': '完成20-25道题的完整阅读练习，如同真实托业考试',
                'reading.practice5': '练习5道题',
                'reading.practice10': '练习10道题',
                'reading.practice20': '练习20道题',
                'reading.practice25': '练习25道题',
                'reading.focusSkills': '专项技能训练',
                'reading.incompleteSentences': '句子填空',
                'reading.incompleteSentencesDesc': '在语境中练习语法和词汇',
                'reading.textCompletion': '段落填空',
                'reading.textCompletionDesc': '填补阅读文章中的空缺',
                'reading.recentPerformance': '近期表现',
                'reading.nQuestions': '{count} 道题',
                'reading.correctRatio': '答对 {correct}/{total}',
                'reading.loadingQuestion': '题目加载中...',
                'reading.loadingQuestionDesc': '请稍候，我们正在准备你的阅读题目。',

                // Listening Module
                'listening.practiceTitle': '托业听力练习',
                'listening.exercisesCompleted': '已完成练习',
                'listening.responseTime': '反应时间',

                // Test Module
                'test.simulatorTitle': '托业模拟考试',
                'test.chooseType': '选择测试类型并开始练习',
                'test.testsCompleted': '已完成测试',
                'test.bestScore': '最佳成绩',
                'test.averageScore': '平均成绩',
                'test.startFullTimed': '开始完整托业测试（2小时）',
                'test.listeningOnly': '仅听力部分（45分钟）',
                'test.readingOnly': '仅阅读部分（75分钟）',
                'test.fullTest': '完整托业测试',
                'test.fullTestDesc': '包含听力和阅读部分的200题完整测试',
                'test.listeningTest': '听力测试',
                'test.listeningTestDesc': '通过100道题练习听力理解',
                'test.readingTest': '阅读测试',
                'test.readingTestDesc': '通过100道题练习阅读理解',
                'test.listeningParts': '100道听力题（第1-4部分）',
                'test.readingParts': '100道阅读题（第5-7部分）',
                'test.startFull': '开始完整测试',
                'test.startListening': '开始听力测试',
                'test.startReading': '开始阅读测试',
                'test.results': '测试成绩',
                'test.resultsDesc': '查看你以往的测试成绩和进度',
                'test.viewResults': '查看成绩',
                'test.durationFull': '时长：2小时30分钟',
                'test.durationListening': '时长：45分钟',
                'test.durationReading': '时长：75分钟',
                'test.questions': '题数',
                'test.score': '分数',
                'test.noHistory': '暂无测试历史',
                'test.settings': '测试设置',
                'test.listeningTitle': '托业听力测试',
                'test.readingTitle': '托业阅读测试',
                'test.timeRemaining': '剩余时间',
                'test.submitTest': '提交测试',
                'test.lookAtPhoto': '请看照片。',
                'test.transcript': '听力原文',
                'test.photoPlaceholder': '[照片将在此处显示]',
                'test.listenQuestion': '请听问题。',
                'test.audioPlaceholder': '[音频将在此处播放]',
                'test.listenConversation': '请听对话。',
                'test.conversationPlaceholder': '[对话音频将在此处播放]',
                'test.listenTalk': '请听讲话。',
                'test.talkPlaceholder': '[讲话音频将在此处播放]',
                'test.simulatorUnavailable': '测试模拟器不可用',
                'test.noQuestion': '暂无题目',
                'test.noOptions': '暂无选项',
                'test.unknownType': '未知题型',
                'test.complete': '测试完成！',
                'test.estimatedLevel': '预估等级',
                'test.toeicScore': '托业分数',
                'test.takeAnother': '再测一次',
                'test.durationSetting': '测试时长',
                'test.optStandard': '标准（官方托业计时）',
                'test.optExtended': '延长（+25%时间）',
                'test.optPractice': '练习（不限时）',
                'test.questionOrder': '题目顺序',
                'test.optSequential': '顺序（1-200）',
                'test.optRandom': '随机',
                'test.optByDifficulty': '按难度',
                'test.showExplanations': '每题后显示解析',
                'test.allowBack': '允许返回之前的题目',
                'test.saveSettings': '保存设置',

                // Flashcards Module
                'flashcards.title': '托业词汇闪卡',
                'flashcards.subtitle': '通过智能间隔重复掌握托业词汇',
                'flashcards.totalWords': '单词总数',
                'flashcards.mastered': '已掌握',
                'flashcards.learning': '学习中',
                'flashcards.mastery': '掌握率',
                'flashcards.smartLearning': '智能词汇学习',
                'flashcards.smartLearningDesc': '我们的智能系统会适应你的学习节奏，在合适的时间为你呈现合适的单词。',
                'flashcards.howItWorks': '学习流程：',
                'flashcards.step1': '每次学习20个单词',
                'flashcards.step2': '标记你认识或不认识的单词',
                'flashcards.step3': '每完成20个单词即可获得新词',
                'flashcards.startLearning': '开始学习',
                'flashcards.quickActions': '快捷操作',
                'flashcards.viewProgress': '查看进度',
                'flashcards.definition': '释义',
                'flashcards.example': '例句',
                'flashcards.synonyms': '同义词',
                'flashcards.greatProgress': '进步显著！',
                'flashcards.completedWords': '你已完成 {count} 个单词！',
                'flashcards.whatsNext': '接下来做什么？',
                'flashcards.nextWordsDesc': '你做得很好！接下来的20个单词将是新词汇，助你继续学习之旅。',
                'flashcards.keepLearning': '坚持学习',
                'flashcards.newWords': '新单词',
                'flashcards.buildVocabulary': '积累词汇',
                'flashcards.continueLearning': '继续学习',
                'flashcards.sessionComplete': '闪卡练习完成！',
                'flashcards.reviewAgain': '再次复习',
                'flashcards.backToFlashcards': '返回闪卡',
                'flashcards.mode.spacedRepetition.title': '间隔重复',
                'flashcards.mode.spacedRepetition.desc': '基于你的学习进度的智能复习',
                'flashcards.mode.newWords.title': '新单词',
                'flashcards.mode.newWords.desc': '学习全新词汇',
                'flashcards.mode.difficultyReview.title': '难点复习',
                'flashcards.mode.difficultyReview.desc': '专注攻克难词',
                'flashcards.mode.categoryReview.title': '分类复习',
                'flashcards.mode.categoryReview.desc': '按商务主题学习',
                'flashcards.mode.quickReview.title': '快速复习',
                'flashcards.mode.quickReview.desc': '5分钟快速练习',
                'flashcards.mode.examPrep.title': '考试备考',
                'flashcards.mode.examPrep.desc': '托业高频词汇',

                // Grammar Module
                'grammar.practiceTitle': '托业语法练习',
                'grammar.practiceSubtitle': '掌握托业成功必备的核心语法',
                'grammar.masteredCategories': '已掌握类别',
                'grammar.totalCategories': '类别总数',
                'grammar.completion': '完成度',
                'grammar.practiceAll': '练习全部类别',
                'grammar.mixedPractice': '混合练习',
                'grammar.viewRules': '查看语法规则',
                'grammar.practice': '语法练习',
                'grammar.completeSession': '完成练习',
                'grammar.selectAnswer': '请先选择一个答案再提交。',
                'grammar.continueNext': '继续下一题',
                'grammar.rule': '语法规则',
                'grammar.practiceComplete': '语法练习完成！',
                'grammar.backToGrammar': '返回语法',
                'grammar.rulesReference': '语法规则参考',
                'grammar.backToPractice': '返回语法练习',

                // Settings & Help
                'settings.title': '设置',
                'settings.difficulty': '难度级别',
                'settings.easy': '简单',
                'settings.normal': '普通',
                'settings.hard': '困难',
                'settings.expert': '专家',
                'settings.soundEffects': '音效',
                'settings.adaptiveDifficulty': '自适应难度',
                'settings.achievementNotifications': '成就通知',
                'settings.toeicTitle': '托业设置',
                'settings.underDevelopment': '设置面板正在开发中',
                'help.title': '使用指南',
                'help.gotIt': '知道了！',
                'help.gameControls': '游戏操作',
                'help.control1': '使用鼠标/触摸选择答案',
                'help.control2': '按1-4数字键快速选择',
                'help.control3': '按ESC键退出游戏',
                'help.control4': '按Ctrl+P打开进度面板',
                'help.learningSystem': '学习系统',
                'help.learning1': '单词根据间隔重复法安排复习',
                'help.learning2': '难度会根据你的表现自动调整',
                'help.learning3': '在面板中跟踪学习进度',
                'help.learning4': '达成里程碑可获得成就',
                'help.scoring': '计分规则',
                'help.scoring1': '答对：+10分',
                'help.scoring2': '快速作答：奖励分',
                'help.scoring3': '连续答对：连击奖励',
                'help.scoring4': '每日练习：连续打卡奖励',

                // Errors & Progress
                'error.title': '哎呀！出错了',
                'error.desc': '应用启动遇到问题。',
                'error.tryAgain': '重试',
                'progress.title': '托业进度分析',
                'progress.loading': '分析面板加载中...',

                // Language Switcher
                'language.english': 'English',
                'language.chinese': '中文',
                'language.switch': '切换语言'
            }
        };

        this.initialize();
        console.log('🌍 Language Manager initialized');
    }

    initialize() {
        // Load saved language preference
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        }

        // Create language switcher
        this.createLanguageSwitcher();

        // Apply current language
        this.applyLanguage(this.currentLanguage);
    }

    createLanguageSwitcher() {
        // Update navbar language toggle only
        this.updateNavbarLanguageToggle();
    }

    updateNavbarLanguageToggle() {
        const navbarToggle = document.getElementById('navbarLanguageToggle');
        if (navbarToggle) {
            const languageText = navbarToggle.querySelector('.language-text');
            if (languageText) {
                languageText.textContent = this.currentLanguage === 'en' ? 'EN' : '中';
            }

            // Add click event if not already added
            if (!navbarToggle.hasAttribute('data-language-bound')) {
                navbarToggle.setAttribute('data-language-bound', 'true');
                navbarToggle.addEventListener('click', () => this.toggleLanguage());
            }
        }

        // Update mobile language text
        const mobileLanguageText = document.querySelector('.mobile-language-text');
        if (mobileLanguageText) {
            mobileLanguageText.textContent = this.currentLanguage === 'en' ? 'Switch to 中文' : 'Switch to English';
        }
    }

    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'en' ? 'zh-CN' : 'en';
        this.switchLanguage(newLanguage);
    }

    switchLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.error(`❌ Unsupported language: ${language}`);
            return;
        }

        console.log(`🌍 Switching language from ${this.currentLanguage} to ${language}`);

        this.currentLanguage = language;
        localStorage.setItem('preferredLanguage', language);

        // Apply new language
        this.applyLanguage(language);

        // Update language switcher
        this.createLanguageSwitcher();

        // Trigger language change event so dynamically rendered views
        // (game engine, TOEIC modules) can re-render themselves
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
    }

    applyLanguage(language) {
        const translations = this.translations[language];
        if (!translations) {
            console.error(`❌ Translations not found for language: ${language}`);
            return;
        }

        // Update all elements tagged with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key] !== undefined) {
                element.textContent = translations[key];
            }
        });

        // Keep the document language attribute in sync (screen readers, fonts)
        document.documentElement.setAttribute('lang', language);

        console.log(`✅ Language applied: ${language}`);
    }

    /**
     * Look up a translation for dynamically rendered content.
     * Supports {placeholder} interpolation:
     *   getText('quiz.questionOf', { current: 3, total: 10 })
     */
    getText(key, params = null) {
        const translations = this.translations[this.currentLanguage];
        let text = translations[key] !== undefined ? translations[key] : key;
        if (params) {
            Object.keys(params).forEach(name => {
                text = text.replace(new RegExp(`\\{${name}\\}`, 'g'), params[name]);
            });
        }
        return text;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    isEnglish() {
        return this.currentLanguage === 'en';
    }

    isChinese() {
        return this.currentLanguage === 'zh-CN';
    }
}

// Initialize language manager
window.LanguageManager = LanguageManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.languageManager = new LanguageManager();
    });
} else {
    window.languageManager = new LanguageManager();
}

console.log('🌍 Language Manager system loaded');

// Add global mobile toggle function
window.toggleLanguageFromMobile = () => {
    if (window.languageManager) {
        window.languageManager.toggleLanguage();
    }
};

// Convenience shorthand for dynamically rendered UI
window.t = (key, params) => {
    return window.languageManager ? window.languageManager.getText(key, params) : key;
};
