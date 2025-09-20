// TOEIC Grammar System - Comprehensive grammar practice for TOEIC exam
// Covers all essential grammar patterns tested in TOEIC

class TOEICGrammarSystem {
    constructor() {
        this.grammarRules = new Map();
        this.practiceQuestions = new Map();
        this.userProgress = new Map();
        this.currentSession = null;
        this.sessionStats = {
            totalQuestions: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            timeSpent: 0,
            startTime: null
        };
        
        this.grammarCategories = {
            'tenses': {
                name: 'Tenses',
                description: 'Present, Past, Future, Perfect tenses',
                icon: 'clock',
                color: 'blue',
                difficulty: 'B1'
            },
            'passive_voice': {
                name: 'Passive Voice',
                description: 'Active and passive voice constructions',
                icon: 'shield',
                color: 'green',
                difficulty: 'B2'
            },
            'conditionals': {
                name: 'Conditionals',
                description: 'If clauses and conditional sentences',
                icon: 'git-branch',
                color: 'purple',
                difficulty: 'B2'
            },
            'modals': {
                name: 'Modal Verbs',
                description: 'Can, could, should, must, might, etc.',
                icon: 'zap',
                color: 'yellow',
                difficulty: 'B1'
            },
            'prepositions': {
                name: 'Prepositions',
                description: 'In, on, at, by, for, with, etc.',
                icon: 'map-pin',
                color: 'red',
                difficulty: 'A2'
            },
            'articles': {
                name: 'Articles',
                description: 'A, an, the usage',
                icon: 'bookmark',
                color: 'indigo',
                difficulty: 'A2'
            },
            'relative_clauses': {
                name: 'Relative Clauses',
                description: 'Who, which, that, where, when',
                icon: 'link',
                color: 'pink',
                difficulty: 'B2'
            },
            'gerunds_infinitives': {
                name: 'Gerunds & Infinitives',
                description: 'Verb patterns and forms',
                icon: 'arrow-right',
                color: 'teal',
                difficulty: 'B1'
            },
            'comparatives': {
                name: 'Comparatives',
                description: 'More, most, -er, -est forms',
                icon: 'trending-up',
                color: 'orange',
                difficulty: 'A2'
            },
            'conjunctions': {
                name: 'Conjunctions',
                description: 'And, but, or, so, because, etc.',
                icon: 'plus',
                color: 'cyan',
                difficulty: 'A2'
            }
        };
        
        this.loadGrammarRules();
        this.loadPracticeQuestions();
        this.loadUserProgress();
        
        console.log('📚 TOEIC Grammar System initialized');
    }
    
    loadGrammarRules() {
        // Tenses
        this.grammarRules.set('present_simple', {
            id: 'present_simple',
            category: 'tenses',
            title: 'Present Simple',
            description: 'Used for habits, general truths, and scheduled events',
            formula: 'Subject + Verb (base form) + Object',
            examples: [
                'I work at a bank.',
                'She speaks three languages.',
                'The train leaves at 8 AM.'
            ],
            commonMistakes: [
                'Don\'t use "be" with main verbs',
                'Add -s/-es for third person singular',
                'Use "do/does" for questions and negatives'
            ],
            toeicTips: [
                'Often tested in Part 5 (Incomplete Sentences)',
                'Look for time expressions like "every day", "usually", "always"',
                'Check subject-verb agreement'
            ]
        });
        
        this.grammarRules.set('present_continuous', {
            id: 'present_continuous',
            category: 'tenses',
            title: 'Present Continuous',
            description: 'Used for actions happening now or temporary situations',
            formula: 'Subject + am/is/are + Verb-ing + Object',
            examples: [
                'I am working on a project.',
                'She is studying for the TOEIC.',
                'They are building a new office.'
            ],
            commonMistakes: [
                'Don\'t use with stative verbs (know, like, want)',
                'Remember to use "be" verb',
                'Use -ing form of main verb'
            ],
            toeicTips: [
                'Often appears in business contexts',
                'Look for "now", "currently", "at the moment"',
                'Check for "be" verb agreement'
            ]
        });
        
        this.grammarRules.set('past_simple', {
            id: 'past_simple',
            category: 'tenses',
            title: 'Past Simple',
            description: 'Used for completed actions in the past',
            formula: 'Subject + Verb (past form) + Object',
            examples: [
                'I worked yesterday.',
                'She finished the report.',
                'The meeting ended at 5 PM.'
            ],
            commonMistakes: [
                'Use past form for regular verbs (-ed)',
                'Memorize irregular verb forms',
                'Don\'t use with "be" verb'
            ],
            toeicTips: [
                'Look for past time expressions',
                'Check irregular verb forms',
                'Often in business correspondence'
            ]
        });
        
        this.grammarRules.set('present_perfect', {
            id: 'present_perfect',
            category: 'tenses',
            title: 'Present Perfect',
            description: 'Used for actions that started in the past and continue to present',
            formula: 'Subject + have/has + Past Participle + Object',
            examples: [
                'I have worked here for 5 years.',
                'She has completed the project.',
                'They have never been to Japan.'
            ],
            commonMistakes: [
                'Use "have" for I/you/we/they',
                'Use "has" for he/she/it',
                'Use past participle form'
            ],
            toeicTips: [
                'Look for "for", "since", "already", "yet"',
                'Often in business achievements',
                'Check past participle forms'
            ]
        });
        
        // Passive Voice
        this.grammarRules.set('passive_voice', {
            id: 'passive_voice',
            category: 'passive_voice',
            title: 'Passive Voice',
            description: 'Used when the action is more important than the doer',
            formula: 'Subject + be + Past Participle + (by + Object)',
            examples: [
                'The report was written by John.',
                'The meeting will be held tomorrow.',
                'The project has been completed.'
            ],
            commonMistakes: [
                'Always use "be" verb',
                'Use past participle form',
                'Don\'t forget "by" for the doer'
            ],
            toeicTips: [
                'Common in business documents',
                'Look for past participles',
                'Check "be" verb tense'
            ]
        });
        
        // Conditionals
        this.grammarRules.set('first_conditional', {
            id: 'first_conditional',
            category: 'conditionals',
            title: 'First Conditional',
            description: 'Used for real future possibilities',
            formula: 'If + Present Simple, will + base verb',
            examples: [
                'If it rains, we will cancel the meeting.',
                'If you study hard, you will pass the TOEIC.',
                'If the price is right, we will buy it.'
            ],
            commonMistakes: [
                'Use present simple after "if"',
                'Use "will" in the main clause',
                'Don\'t use "will" after "if"'
            ],
            toeicTips: [
                'Common in business negotiations',
                'Look for "if" + present tense',
                'Check "will" in main clause'
            ]
        });
        
        // Modal Verbs
        this.grammarRules.set('modal_verbs', {
            id: 'modal_verbs',
            category: 'modals',
            title: 'Modal Verbs',
            description: 'Used to express ability, possibility, necessity, etc.',
            formula: 'Subject + Modal + Base Verb + Object',
            examples: [
                'You must submit the report by Friday.',
                'She can speak French fluently.',
                'We should consider all options.'
            ],
            commonMistakes: [
                'Use base form after modals',
                'Don\'t add -s/-es after modals',
                'Use "not" for negatives'
            ],
            toeicTips: [
                'Common in business communication',
                'Check meaning of each modal',
                'Look for base verb form'
            ]
        });
        
        // Prepositions
        this.grammarRules.set('time_prepositions', {
            id: 'time_prepositions',
            category: 'prepositions',
            title: 'Time Prepositions',
            description: 'Used to indicate when something happens',
            formula: 'Preposition + Time Expression',
            examples: [
                'The meeting is at 3 PM.',
                'I work on Mondays.',
                'The project starts in January.'
            ],
            commonMistakes: [
                'Use "at" for specific times',
                'Use "on" for days',
                'Use "in" for months/years'
            ],
            toeicTips: [
                'Very common in TOEIC',
                'Memorize common patterns',
                'Check context carefully'
            ]
        });
        
        console.log(`✅ Loaded ${this.grammarRules.size} grammar rules`);
    }
    
    loadPracticeQuestions() {
        // Tenses Questions
        this.practiceQuestions.set('q_tenses_001', {
            id: 'q_tenses_001',
            category: 'tenses',
            difficulty: 'B1',
            question: 'The company _____ its annual report every December.',
            options: [
                'publish',
                'publishes',
                'is publishing',
                'has published'
            ],
            correctAnswer: 1,
            explanation: 'Present simple is used for regular, scheduled events. "Publishes" is correct for third person singular.',
            grammarRule: 'present_simple'
        });
        
        this.practiceQuestions.set('q_tenses_002', {
            id: 'q_tenses_002',
            category: 'tenses',
            difficulty: 'B1',
            question: 'I _____ for this company since 2018.',
            options: [
                'work',
                'am working',
                'have worked',
                'worked'
            ],
            correctAnswer: 2,
            explanation: 'Present perfect is used with "since" to show duration from past to present.',
            grammarRule: 'present_perfect'
        });
        
        this.practiceQuestions.set('q_tenses_003', {
            id: 'q_tenses_003',
            category: 'tenses',
            difficulty: 'B1',
            question: 'The meeting _____ at 2 PM yesterday.',
            options: [
                'starts',
                'started',
                'is starting',
                'has started'
            ],
            correctAnswer: 1,
            explanation: 'Past simple is used for completed actions in the past. "Yesterday" indicates past time.',
            grammarRule: 'past_simple'
        });
        
        this.practiceQuestions.set('q_tenses_004', {
            id: 'q_tenses_004',
            category: 'tenses',
            difficulty: 'B2',
            question: 'Right now, the team _____ on the new project.',
            options: [
                'works',
                'worked',
                'is working',
                'has worked'
            ],
            correctAnswer: 2,
            explanation: 'Present continuous is used for actions happening now. "Right now" indicates current action.',
            grammarRule: 'present_continuous'
        });
        
        this.practiceQuestions.set('q_tenses_005', {
            id: 'q_tenses_005',
            category: 'tenses',
            difficulty: 'A2',
            question: 'I _____ to the gym every morning before work.',
            options: [
                'go',
                'am going',
                'have gone',
                'will go'
            ],
            correctAnswer: 0,
            explanation: 'Present simple tense is used for habitual actions and routines.',
            grammarRule: 'present_simple'
        });
        
        this.practiceQuestions.set('q_tenses_006', {
            id: 'q_tenses_006',
            category: 'tenses',
            difficulty: 'B1',
            question: 'She _____ her presentation when the power went out.',
            options: [
                'was giving',
                'gave',
                'has given',
                'gives'
            ],
            correctAnswer: 0,
            explanation: 'Past continuous tense is used for actions that were in progress when another action happened.',
            grammarRule: 'past_continuous'
        });
        
        this.practiceQuestions.set('q_tenses_007', {
            id: 'q_tenses_007',
            category: 'tenses',
            difficulty: 'C1',
            question: 'The company _____ its profits by 20% by the end of this quarter.',
            options: [
                'will have increased',
                'will increase',
                'increases',
                'is increasing'
            ],
            correctAnswer: 0,
            explanation: 'Future perfect tense is used for actions that will be completed before a specific future time.',
            grammarRule: 'future_perfect'
        });
        
        this.practiceQuestions.set('q_tenses_008', {
            id: 'q_tenses_008',
            category: 'tenses',
            difficulty: 'B2',
            question: 'We _____ this project for three months now.',
            options: [
                'have been working on',
                'are working on',
                'work on',
                'worked on'
            ],
            correctAnswer: 0,
            explanation: 'Present perfect continuous tense is used for actions that started in the past and continue to the present.',
            grammarRule: 'present_perfect_continuous'
        });
        
        this.practiceQuestions.set('q_tenses_009', {
            id: 'q_tenses_009',
            category: 'tenses',
            difficulty: 'A2',
            question: 'Yesterday, I _____ a new restaurant downtown.',
            options: [
                'tried',
                'try',
                'am trying',
                'will try'
            ],
            correctAnswer: 0,
            explanation: 'Past simple tense is used for completed actions in the past.',
            grammarRule: 'past_simple'
        });
        
        this.practiceQuestions.set('q_tenses_010', {
            id: 'q_tenses_010',
            category: 'tenses',
            difficulty: 'C1',
            question: 'By next year, she _____ in this company for ten years.',
            options: [
                'will have been working',
                'will work',
                'works',
                'is working'
            ],
            correctAnswer: 0,
            explanation: 'Future perfect continuous tense is used for actions that will be ongoing up to a specific future time.',
            grammarRule: 'future_perfect_continuous'
        });
        
        // Passive Voice Questions
        this.practiceQuestions.set('q_passive_001', {
            id: 'q_passive_001',
            category: 'passive_voice',
            difficulty: 'B2',
            question: 'The contract _____ by the legal department.',
            options: [
                'is reviewing',
                'is being reviewed',
                'has reviewed',
                'will review'
            ],
            correctAnswer: 1,
            explanation: 'Passive voice is used when the action is more important than the doer. "Is being reviewed" is present continuous passive.',
            grammarRule: 'passive_voice'
        });
        
        this.practiceQuestions.set('q_passive_002', {
            id: 'q_passive_002',
            category: 'passive_voice',
            difficulty: 'B2',
            question: 'The new policy _____ next month.',
            options: [
                'will implement',
                'will be implemented',
                'is implementing',
                'has implemented'
            ],
            correctAnswer: 1,
            explanation: 'Future passive voice is used for future actions. "Will be implemented" is correct.',
            grammarRule: 'passive_voice'
        });
        
        this.practiceQuestions.set('q_passive_003', {
            id: 'q_passive_003',
            category: 'passive_voice',
            difficulty: 'B1',
            question: 'The report _____ by the manager yesterday.',
            options: [
                'was reviewed',
                'reviewed',
                'is reviewing',
                'has reviewed'
            ],
            correctAnswer: 0,
            explanation: 'Past passive voice is used for past actions. "Was reviewed" is correct.',
            grammarRule: 'passive_voice'
        });
        
        this.practiceQuestions.set('q_passive_004', {
            id: 'q_passive_004',
            category: 'passive_voice',
            difficulty: 'C1',
            question: 'The building _____ for over a year now.',
            options: [
                'has been constructed',
                'is constructing',
                'constructs',
                'constructed'
            ],
            correctAnswer: 0,
            explanation: 'Present perfect passive voice is used for actions that started in the past and continue to the present.',
            grammarRule: 'passive_voice'
        });
        
        this.practiceQuestions.set('q_passive_005', {
            id: 'q_passive_005',
            category: 'passive_voice',
            difficulty: 'A2',
            question: 'English _____ in many countries around the world.',
            options: [
                'speaks',
                'is spoken',
                'speaking',
                'spoke'
            ],
            correctAnswer: 1,
            explanation: 'Present passive voice is used for general facts. "Is spoken" is correct.',
            grammarRule: 'passive_voice'
        });
        
        this.practiceQuestions.set('q_passive_006', {
            id: 'q_passive_006',
            category: 'passive_voice',
            difficulty: 'B2',
            question: 'The meeting _____ by the CEO next week.',
            options: [
                'will be chaired',
                'will chair',
                'chairs',
                'is chairing'
            ],
            correctAnswer: 0,
            explanation: 'Future passive voice is used for future actions. "Will be chaired" is correct.',
            grammarRule: 'passive_voice'
        });
        
        this.practiceQuestions.set('q_passive_007', {
            id: 'q_passive_007',
            category: 'passive_voice',
            difficulty: 'B1',
            question: 'The documents _____ to the client last Friday.',
            options: [
                'were sent',
                'sent',
                'are sending',
                'send'
            ],
            correctAnswer: 0,
            explanation: 'Past passive voice is used for completed actions in the past. "Were sent" is correct.',
            grammarRule: 'passive_voice'
        });
        
        this.practiceQuestions.set('q_passive_008', {
            id: 'q_passive_008',
            category: 'passive_voice',
            difficulty: 'C1',
            question: 'The project _____ by the team for six months.',
            options: [
                'has been developed',
                'is developing',
                'develops',
                'developed'
            ],
            correctAnswer: 0,
            explanation: 'Present perfect passive voice is used for actions that started in the past and continue to the present.',
            grammarRule: 'passive_voice'
        });
        
        this.practiceQuestions.set('q_passive_009', {
            id: 'q_passive_009',
            category: 'passive_voice',
            difficulty: 'A2',
            question: 'The door _____ by the security guard every night.',
            options: [
                'locks',
                'is locked',
                'locking',
                'locked'
            ],
            correctAnswer: 1,
            explanation: 'Present passive voice is used for habitual actions. "Is locked" is correct.',
            grammarRule: 'passive_voice'
        });
        
        this.practiceQuestions.set('q_passive_010', {
            id: 'q_passive_010',
            category: 'passive_voice',
            difficulty: 'B2',
            question: 'The proposal _____ by the board of directors tomorrow.',
            options: [
                'will be discussed',
                'will discuss',
                'discusses',
                'is discussing'
            ],
            correctAnswer: 0,
            explanation: 'Future passive voice is used for future actions. "Will be discussed" is correct.',
            grammarRule: 'passive_voice'
        });
        
        // Modal Verbs Questions
        this.practiceQuestions.set('q_modals_001', {
            id: 'q_modals_001',
            category: 'modals',
            difficulty: 'B1',
            question: 'All employees _____ attend the safety training.',
            options: [
                'can',
                'should',
                'must',
                'might'
            ],
            correctAnswer: 2,
            explanation: '"Must" expresses strong obligation or necessity, which is appropriate for mandatory training.',
            grammarRule: 'modal_verbs'
        });
        
        this.practiceQuestions.set('q_modals_002', {
            id: 'q_modals_002',
            category: 'modals',
            difficulty: 'B1',
            question: 'You _____ submit your application by the deadline.',
            options: [
                'can',
                'should',
                'must',
                'could'
            ],
            correctAnswer: 2,
            explanation: '"Must" is used for strong obligation, especially with deadlines.',
            grammarRule: 'modal_verbs'
        });
        
        // Prepositions Questions
        this.practiceQuestions.set('q_prepositions_001', {
            id: 'q_prepositions_001',
            category: 'prepositions',
            difficulty: 'A2',
            question: 'The conference will be held _____ March 15th.',
            options: [
                'at',
                'on',
                'in',
                'by'
            ],
            correctAnswer: 1,
            explanation: '"On" is used for specific dates. "March 15th" is a specific date.',
            grammarRule: 'time_prepositions'
        });
        
        this.practiceQuestions.set('q_prepositions_002', {
            id: 'q_prepositions_002',
            category: 'prepositions',
            difficulty: 'A2',
            question: 'The meeting starts _____ 9:00 AM.',
            options: [
                'at',
                'on',
                'in',
                'by'
            ],
            correctAnswer: 0,
            explanation: '"At" is used for specific times. "9:00 AM" is a specific time.',
            grammarRule: 'time_prepositions'
        });
        
        // Conditionals Questions
        this.practiceQuestions.set('q_conditionals_001', {
            id: 'q_conditionals_001',
            category: 'conditionals',
            difficulty: 'B2',
            question: 'If the budget is approved, we _____ the project next month.',
            options: [
                'start',
                'will start',
                'would start',
                'started'
            ],
            correctAnswer: 1,
            explanation: 'First conditional uses "if + present simple, will + base verb" for real future possibilities.',
            grammarRule: 'first_conditional'
        });
        
        this.practiceQuestions.set('q_conditionals_002', {
            id: 'q_conditionals_002',
            category: 'conditionals',
            difficulty: 'B2',
            question: 'If you _____ the report by Friday, you will miss the deadline.',
            options: [
                'don\'t finish',
                'won\'t finish',
                'didn\'t finish',
                'haven\'t finished'
            ],
            correctAnswer: 0,
            explanation: 'In first conditional, use present simple after "if". "Don\'t finish" is present simple negative.',
            grammarRule: 'first_conditional'
        });
        
        // Articles Questions
        this.practiceQuestions.set('q_articles_001', {
            id: 'q_articles_001',
            category: 'articles',
            difficulty: 'A2',
            question: 'I need _____ information about the new policy.',
            options: [
                'a',
                'an',
                'the',
                'no article'
            ],
            correctAnswer: 3,
            explanation: '"Information" is an uncountable noun and doesn\'t take an article.',
            grammarRule: 'articles'
        });
        
        this.practiceQuestions.set('q_articles_002', {
            id: 'q_articles_002',
            category: 'articles',
            difficulty: 'A2',
            question: '_____ meeting scheduled for tomorrow has been postponed.',
            options: [
                'A',
                'An',
                'The',
                'No article'
            ],
            correctAnswer: 2,
            explanation: '"The" is used when referring to a specific meeting that was previously mentioned or is known.',
            grammarRule: 'articles'
        });
        
        // Relative Clauses Questions
        this.practiceQuestions.set('q_relative_001', {
            id: 'q_relative_001',
            category: 'relative_clauses',
            difficulty: 'B2',
            question: 'The employee _____ won the award is from our marketing department.',
            options: [
                'who',
                'which',
                'that',
                'where'
            ],
            correctAnswer: 0,
            explanation: '"Who" is used for people. "Which" is for things, "where" is for places.',
            grammarRule: 'relative_clauses'
        });
        
        this.practiceQuestions.set('q_relative_002', {
            id: 'q_relative_002',
            category: 'relative_clauses',
            difficulty: 'B2',
            question: 'The office _____ I work is located downtown.',
            options: [
                'who',
                'which',
                'that',
                'where'
            ],
            correctAnswer: 3,
            explanation: '"Where" is used for places. "The office" is a place.',
            grammarRule: 'relative_clauses'
        });
        
        // Gerunds and Infinitives Questions
        this.practiceQuestions.set('q_gerunds_001', {
            id: 'q_gerunds_001',
            category: 'gerunds_infinitives',
            difficulty: 'B1',
            question: 'I enjoy _____ to business conferences.',
            options: [
                'go',
                'going',
                'to go',
                'went'
            ],
            correctAnswer: 1,
            explanation: '"Enjoy" is followed by a gerund (-ing form). "Going" is the gerund form.',
            grammarRule: 'gerunds_infinitives'
        });
        
        this.practiceQuestions.set('q_gerunds_002', {
            id: 'q_gerunds_002',
            category: 'gerunds_infinitives',
            difficulty: 'B1',
            question: 'We decided _____ the proposal.',
            options: [
                'accept',
                'accepting',
                'to accept',
                'accepted'
            ],
            correctAnswer: 2,
            explanation: '"Decide" is followed by an infinitive (to + base verb). "To accept" is correct.',
            grammarRule: 'gerunds_infinitives'
        });
        
        // Comparatives Questions
        this.practiceQuestions.set('q_comparatives_001', {
            id: 'q_comparatives_001',
            category: 'comparatives',
            difficulty: 'A2',
            question: 'This year\'s sales are _____ than last year\'s.',
            options: [
                'high',
                'higher',
                'highest',
                'more high'
            ],
            correctAnswer: 1,
            explanation: 'Comparative form of "high" is "higher" (one syllable adjective + -er).',
            grammarRule: 'comparatives'
        });
        
        this.practiceQuestions.set('q_comparatives_002', {
            id: 'q_comparatives_002',
            category: 'comparatives',
            difficulty: 'A2',
            question: 'This is the _____ presentation I\'ve ever seen.',
            options: [
                'good',
                'better',
                'best',
                'most good'
            ],
            correctAnswer: 2,
            explanation: 'Superlative form of "good" is "best". "The best" is used for superlative.',
            grammarRule: 'comparatives'
        });
        
        // Conjunctions Questions
        this.practiceQuestions.set('q_conjunctions_001', {
            id: 'q_conjunctions_001',
            category: 'conjunctions',
            difficulty: 'A2',
            question: 'The project is behind schedule _____ we need more resources.',
            options: [
                'and',
                'but',
                'or',
                'because'
            ],
            correctAnswer: 3,
            explanation: '"Because" shows reason. The second clause explains why the project is behind schedule.',
            grammarRule: 'conjunctions'
        });
        
        this.practiceQuestions.set('q_conjunctions_002', {
            id: 'q_conjunctions_002',
            category: 'conjunctions',
            difficulty: 'A2',
            question: 'We can meet today _____ tomorrow morning.',
            options: [
                'and',
                'but',
                'or',
                'so'
            ],
            correctAnswer: 2,
            explanation: '"Or" shows alternatives. We can meet either today or tomorrow morning.',
            grammarRule: 'conjunctions'
        });
        
        console.log(`✅ Loaded ${this.practiceQuestions.size} practice questions`);
    }
    
    loadUserProgress() {
        try {
            const savedProgress = localStorage.getItem('toeic_grammar_progress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                this.userProgress = new Map(Object.entries(progress));
                console.log('✅ Loaded user grammar progress');
            }
        } catch (error) {
            console.error('❌ Error loading grammar progress:', error);
        }
    }
    
    saveUserProgress() {
        try {
            const progressObj = Object.fromEntries(this.userProgress);
            localStorage.setItem('toeic_grammar_progress', JSON.stringify(progressObj));
        } catch (error) {
            console.error('❌ Error saving grammar progress:', error);
        }
    }
    
    // Start a grammar practice session
    startSession(options = {}) {
        const sessionId = 'grammar_' + Date.now();
        const category = options.category || 'all';
        const difficulty = options.difficulty || 'all';
        const questionCount = options.questionCount || 20;
        
        // Filter questions based on options
        let availableQuestions = Array.from(this.practiceQuestions.values());
        
        if (category !== 'all') {
            availableQuestions = availableQuestions.filter(q => q.category === category);
        }
        
        if (difficulty !== 'all') {
            availableQuestions = availableQuestions.filter(q => q.difficulty === difficulty);
        }
        
        // Shuffle and select questions
        const shuffledQuestions = this.shuffleArray([...availableQuestions]);
        const selectedQuestions = shuffledQuestions.slice(0, questionCount);
        
        console.log(`🔍 Debug: Available questions: ${availableQuestions.length}`);
        console.log(`🔍 Debug: Requested question count: ${questionCount}`);
        console.log(`🔍 Debug: Selected questions: ${selectedQuestions.length}`);
        console.log(`🔍 Debug: Selected question IDs:`, selectedQuestions.map(q => q.id));
        
        this.currentSession = {
            id: sessionId,
            category: category,
            difficulty: difficulty,
            questions: selectedQuestions,
            currentQuestionIndex: 0,
            answers: [],
            startTime: Date.now(),
            endTime: null,
            status: 'active'
        };
        
        this.sessionStats = {
            totalQuestions: selectedQuestions.length,
            correctAnswers: 0,
            incorrectAnswers: 0,
            timeSpent: 0,
            startTime: Date.now()
        };
        
        console.log(`📚 Started grammar session: ${category} (${selectedQuestions.length} questions)`);
        return this.currentSession;
    }
    
    // Get current question
    getCurrentQuestion() {
        if (!this.currentSession || this.currentSession.questions.length === 0) {
            return null;
        }
        
        const questionIndex = this.currentSession.currentQuestionIndex;
        if (questionIndex < 0 || questionIndex >= this.currentSession.questions.length) {
            return null;
        }
        
        const question = this.currentSession.questions[questionIndex];
        if (!question) {
            return null;
        }
        
        const grammarRule = question.grammarRule ? this.grammarRules.get(question.grammarRule) : null;
        
        return {
            ...question,
            grammarRule: grammarRule,
            progress: {
                current: questionIndex + 1,
                total: this.currentSession.questions.length
            }
        };
    }
    
    // Answer current question
    answerQuestion(selectedAnswer, timeSpent = 0) {
        if (!this.currentSession) return false;
        
        const currentQuestion = this.getCurrentQuestion();
        if (!currentQuestion) return false;
        
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        
        // Record answer
        this.currentSession.answers.push({
            questionId: currentQuestion.id,
            selectedAnswer: selectedAnswer,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect: isCorrect,
            timeSpent: timeSpent,
            timestamp: Date.now()
        });
        
        // Update stats
        if (isCorrect) {
            this.sessionStats.correctAnswers++;
        } else {
            this.sessionStats.incorrectAnswers++;
        }
        
        // Update user progress
        this.updateUserProgress(currentQuestion.id, isCorrect);
        
        console.log(`📝 Answered question: ${isCorrect ? 'Correct' : 'Incorrect'}`);
        return isCorrect;
    }
    
    // Move to next question
    nextQuestion() {
        if (!this.currentSession) {
            console.log('❌ Debug: No current session');
            return false;
        }
        
        console.log(`🔍 Debug: Current question index: ${this.currentSession.currentQuestionIndex}`);
        console.log(`🔍 Debug: Total questions in session: ${this.currentSession.questions.length}`);
        
        this.currentSession.currentQuestionIndex++;
        
        if (this.currentSession.currentQuestionIndex >= this.currentSession.questions.length) {
            console.log('🔍 Debug: Session completed, calling completeSession()');
            this.completeSession();
            return false;
        }
        
        console.log(`🔍 Debug: Moving to question ${this.currentSession.currentQuestionIndex + 1} of ${this.currentSession.questions.length}`);
        return true;
    }
    
    // Move to previous question
    previousQuestion() {
        if (!this.currentSession) return false;
        
        if (this.currentSession.currentQuestionIndex > 0) {
            this.currentSession.currentQuestionIndex--;
            return true;
        }
        
        return false;
    }
    
    // Complete session
    completeSession() {
        if (!this.currentSession) return null;
        
        this.currentSession.endTime = Date.now();
        this.currentSession.status = 'completed';
        this.sessionStats.timeSpent = this.currentSession.endTime - this.currentSession.startTime;
        
        const results = this.generateSessionResults();
        console.log('✅ Grammar session completed:', results);
        
        return results;
    }
    
    // Generate session results
    generateSessionResults() {
        if (!this.currentSession) return null;
        
        const totalQuestions = this.currentSession.questions.length;
        const correctAnswers = this.sessionStats.correctAnswers;
        const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        // Analyze performance by category
        const categoryPerformance = {};
        this.currentSession.answers.forEach(answer => {
            const question = this.practiceQuestions.get(answer.questionId);
            if (question) {
                if (!categoryPerformance[question.category]) {
                    categoryPerformance[question.category] = { correct: 0, total: 0 };
                }
                categoryPerformance[question.category].total++;
                if (answer.isCorrect) {
                    categoryPerformance[question.category].correct++;
                }
            }
        });
        
        // Calculate category accuracies
        Object.keys(categoryPerformance).forEach(category => {
            const perf = categoryPerformance[category];
            perf.accuracy = (perf.correct / perf.total) * 100;
        });
        
        return {
            sessionId: this.currentSession.id,
            totalQuestions: totalQuestions,
            correctAnswers: correctAnswers,
            incorrectAnswers: this.sessionStats.incorrectAnswers,
            accuracy: Math.round(accuracy),
            timeSpent: this.sessionStats.timeSpent,
            categoryPerformance: categoryPerformance,
            recommendations: this.generateRecommendations(categoryPerformance),
            completedAt: new Date().toISOString()
        };
    }
    
    // Get current session statistics
    getSessionStats() {
        if (!this.sessionStats) {
            return {
                totalQuestions: 0,
                correctAnswers: 0,
                incorrectAnswers: 0,
                timeSpent: 0
            };
        }
        
        return {
            totalQuestions: this.sessionStats.totalQuestions,
            correctAnswers: this.sessionStats.correctAnswers,
            incorrectAnswers: this.sessionStats.incorrectAnswers,
            timeSpent: this.sessionStats.timeSpent
        };
    }
    
    // Generate recommendations based on performance
    generateRecommendations(categoryPerformance) {
        const recommendations = [];
        
        Object.keys(categoryPerformance).forEach(category => {
            const perf = categoryPerformance[category];
            if (perf.accuracy < 70) {
                const categoryInfo = this.grammarCategories[category];
                if (categoryInfo) {
                    recommendations.push({
                        category: category,
                        categoryName: categoryInfo.name,
                        accuracy: Math.round(perf.accuracy),
                        suggestion: `Focus on ${categoryInfo.name} - accuracy is ${Math.round(perf.accuracy)}%`
                    });
                }
            }
        });
        
        return recommendations;
    }
    
    // Update user progress
    updateUserProgress(questionId, isCorrect) {
        const question = this.practiceQuestions.get(questionId);
        if (!question) return;
        
        const progressKey = `${question.category}_${question.grammarRule}`;
        let progress = this.userProgress.get(progressKey) || {
            totalAttempts: 0,
            correctAttempts: 0,
            lastAttempted: null,
            masteryLevel: 0
        };
        
        progress.totalAttempts++;
        progress.lastAttempted = Date.now();
        
        if (isCorrect) {
            progress.correctAttempts++;
            progress.masteryLevel = Math.min(progress.masteryLevel + 1, 5);
        } else {
            progress.masteryLevel = Math.max(progress.masteryLevel - 1, 0);
        }
        
        this.userProgress.set(progressKey, progress);
        this.saveUserProgress();
    }
    
    // Get grammar rule by ID
    getGrammarRule(ruleId) {
        return this.grammarRules.get(ruleId);
    }
    
    // Get all grammar categories
    getGrammarCategories() {
        return this.grammarCategories;
    }
    
    // Get questions by category
    getQuestionsByCategory(category) {
        return Array.from(this.practiceQuestions.values()).filter(q => q.category === category);
    }
    
    // Get user progress summary
    getUserProgressSummary() {
        const summary = {
            totalCategories: Object.keys(this.grammarCategories).length,
            masteredCategories: 0,
            categoryDetails: {}
        };
        
        Object.keys(this.grammarCategories).forEach(category => {
            const categoryProgress = Array.from(this.userProgress.entries())
                .filter(([key]) => key.startsWith(category))
                .map(([, progress]) => progress);
            
            if (categoryProgress.length > 0) {
                const totalAttempts = categoryProgress.reduce((sum, p) => sum + p.totalAttempts, 0);
                const correctAttempts = categoryProgress.reduce((sum, p) => sum + p.correctAttempts, 0);
                const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
                const avgMastery = categoryProgress.reduce((sum, p) => sum + p.masteryLevel, 0) / categoryProgress.length;
                
                summary.categoryDetails[category] = {
                    accuracy: Math.round(accuracy),
                    masteryLevel: Math.round(avgMastery),
                    totalAttempts: totalAttempts,
                    isMastered: avgMastery >= 4 && accuracy >= 80
                };
                
                if (summary.categoryDetails[category].isMastered) {
                    summary.masteredCategories++;
                }
            } else {
                summary.categoryDetails[category] = {
                    accuracy: 0,
                    masteryLevel: 0,
                    totalAttempts: 0,
                    isMastered: false
                };
            }
        });
        
        return summary;
    }
    
    // Utility function to shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TOEICGrammarSystem;
} else {
    window.TOEICGrammarSystem = TOEICGrammarSystem;
}
