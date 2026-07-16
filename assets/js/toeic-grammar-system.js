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
        
        // Rules for the remaining categories (referenced by practice
        // questions -- without these the feedback panel shows no rule)
        this.grammarRules.set('articles', {
            id: 'articles',
            category: 'articles',
            title: 'Articles (a / an / the)',
            description: 'Use a/an for one non-specific countable noun, the for something specific or already known, and no article for general plurals and uncountables',
            formula: 'a + consonant sound / an + vowel sound / the + specific noun',
            examples: [
                'We hired a new manager. The manager starts on Monday.',
                'She has an MBA from a top university.',
                'Information travels fast. (no article)'
            ],
            commonMistakes: [
                'Choose a/an by SOUND, not spelling: an hour, a university',
                'No article before uncountable nouns used generally (advice, equipment)',
                'Use the when both speakers know which one is meant'
            ],
            toeicTips: [
                'Part 5 often tests a vs. an before abbreviations (an HR issue)',
                'Watch for uncountable business nouns: information, feedback, research',
                'Superlatives almost always take the: the best solution'
            ]
        });

        this.grammarRules.set('relative_clauses', {
            id: 'relative_clauses',
            category: 'relative_clauses',
            title: 'Relative Clauses',
            description: 'Clauses starting with who, which, that, whose, where that describe a noun',
            formula: 'noun + who/which/that/whose/where + clause',
            examples: [
                'The candidate who interviewed on Friday accepted our offer.',
                'The proposal, which took weeks to prepare, was approved.',
                'The company whose shares rose fastest is based in Seoul.'
            ],
            commonMistakes: [
                'who = people, which = things, whose = possession',
                'that cannot follow a comma (non-restrictive clauses need which/who)',
                'Don\'t repeat the subject: "the report which it arrived" is wrong'
            ],
            toeicTips: [
                'Commas around the clause signal which, never that',
                'whose + noun tests possession -- look for an ownership meaning',
                'where replaces in which after place nouns'
            ]
        });

        this.grammarRules.set('gerunds_infinitives', {
            id: 'gerunds_infinitives',
            category: 'gerunds_infinitives',
            title: 'Gerunds & Infinitives',
            description: 'Some verbs take -ing (enjoy, avoid, consider), others take to + verb (decide, plan, agree); a few change meaning (remember, stop, try)',
            formula: 'verb + gerund (-ing) OR verb + to-infinitive',
            examples: [
                'We are considering opening a branch in Osaka.',
                'The board decided to postpone the vote.',
                'Please remember to lock the office.'
            ],
            commonMistakes: [
                'enjoy/avoid/finish/suggest/consider take a gerund, never to-infinitive',
                'decide/agree/plan/afford/refuse take to-infinitive',
                'remember/stop/forget change meaning: remember to do (future duty) vs. remember doing (past memory)'
            ],
            toeicTips: [
                'Memorize the governing verb -- the blank is decided by the verb BEFORE it',
                'Prepositions are always followed by a gerund: interested in joining',
                'look forward to + gerund is a classic TOEIC trap'
            ]
        });

        this.grammarRules.set('comparatives', {
            id: 'comparatives',
            category: 'comparatives',
            title: 'Comparatives & Superlatives',
            description: 'Comparing two things (-er / more) or three and more (-est / most), plus as...as and the double comparative',
            formula: 'adj-er + than / more + adj + than / the + adj-est / the most + adj',
            examples: [
                'This quarter\'s results are stronger than last year\'s.',
                'It was the most successful launch in company history.',
                'The sooner we ship, the happier the client will be.'
            ],
            commonMistakes: [
                'Never combine forms: "more faster" is wrong',
                'than follows a comparative; as...as needs the base form',
                'Superlatives need the: the largest supplier'
            ],
            toeicTips: [
                'See than in the sentence, the blank needs a comparative',
                'The double pattern "the more..., the more..." keeps the in both halves',
                'Irregulars: good/better/best, bad/worse/worst, far/further'
            ]
        });

        this.grammarRules.set('conjunctions', {
            id: 'conjunctions',
            category: 'conjunctions',
            title: 'Conjunctions & Connectors',
            description: 'Words that join clauses: although, because, while, unless, despite, however -- the choice depends on the logic AND the grammar that follows',
            formula: 'although/because/while + clause; despite/because of + noun; however + full sentence',
            examples: [
                'Although sales fell, profits rose.',
                'Despite the delay, the client renewed the contract.',
                'The launch was delayed; however, demand stayed strong.'
            ],
            commonMistakes: [
                'despite/because of take a NOUN, although/because take a CLAUSE',
                'however needs a semicolon or new sentence, not a comma splice',
                'unless means if not -- don\'t add another negative'
            ],
            toeicTips: [
                'First decide the logic (contrast? cause? condition?), then check what follows the blank',
                'Noun after the blank: despite / because of / during',
                'Both...and, either...or, neither...nor must stay paired'
            ]
        });

        // Tense rules referenced by individual questions
        this.grammarRules.set('past_continuous', {
            id: 'past_continuous',
            category: 'tenses',
            title: 'Past Continuous',
            description: 'An action in progress at a specific past moment, often interrupted by a past simple event',
            formula: 'Subject + was/were + verb-ing',
            examples: [
                'She was presenting when the fire alarm rang.',
                'We were reviewing the contract at 3 PM yesterday.'
            ],
            commonMistakes: [
                'Use past simple, not continuous, for the interrupting event',
                'State verbs (know, believe, own) rarely take continuous forms'
            ],
            toeicTips: [
                'while + past continuous, when + past simple is the classic pairing',
                'A specific past clock time often signals past continuous'
            ]
        });

        this.grammarRules.set('present_perfect_continuous', {
            id: 'present_perfect_continuous',
            category: 'tenses',
            title: 'Present Perfect Continuous',
            description: 'An activity that started in the past and is still running (or just stopped), emphasizing duration',
            formula: 'Subject + has/have been + verb-ing',
            examples: [
                'We have been negotiating with the supplier for three weeks.',
                'She has been working here since 2020.'
            ],
            commonMistakes: [
                'for + duration, since + starting point',
                'Don\'t use it for completed counts -- use present perfect: has written three reports'
            ],
            toeicTips: [
                'for/since plus an ongoing activity points here',
                'Emphasis on HOW LONG: continuous; on RESULT: simple perfect'
            ]
        });

        this.grammarRules.set('future_perfect', {
            id: 'future_perfect',
            category: 'tenses',
            title: 'Future Perfect',
            description: 'An action that will be completed before a specific future time',
            formula: 'Subject + will have + past participle',
            examples: [
                'By Friday, we will have shipped all outstanding orders.',
                'She will have finished the audit before the board meets.'
            ],
            commonMistakes: [
                'Needs a future deadline (by..., before...) to make sense',
                'Use the participle, not the base verb: will have written'
            ],
            toeicTips: [
                'By + future time is the strongest signal for future perfect',
                'Distinguish from future continuous (will be doing = in progress, not finished)'
            ]
        });

        this.grammarRules.set('future_perfect_continuous', {
            id: 'future_perfect_continuous',
            category: 'tenses',
            title: 'Future Perfect Continuous',
            description: 'How long an activity will have been in progress by a future point',
            formula: 'Subject + will have been + verb-ing',
            examples: [
                'By June, I will have been managing this team for five years.'
            ],
            commonMistakes: [
                'Requires both a future reference point AND a duration',
                'State verbs prefer future perfect simple'
            ],
            toeicTips: [
                'Look for by + future time together with for + duration'
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
        
        // Additional Modal Verbs Questions
        this.practiceQuestions.set('q_modals_003', {
            id: 'q_modals_003',
            category: 'modals',
            difficulty: 'B1',
            question: 'Visitors _____ wear an identification badge at all times while in the factory.',
            options: [
                'must',
                'might',
                'would',
                'may'
            ],
            correctAnswer: 0,
            explanation: 'The phrase "at all times" signals a strict rule, so the modal of obligation "must" is needed. "Might" and "may" express possibility or permission, not obligation.',
            grammarRule: 'modal_verbs'
        });

        this.practiceQuestions.set('q_modals_004', {
            id: 'q_modals_004',
            category: 'modals',
            difficulty: 'B1',
            question: 'Employees _____ to complete the compliance training before Friday.',
            options: [
                'must',
                'are required',
                'should',
                'can'
            ],
            correctAnswer: 1,
            explanation: 'The blank is followed by "to complete", and modals like "must", "should", and "can" take the base verb directly without "to". Only "are required" can be followed by a to-infinitive.',
            grammarRule: 'modal_verbs'
        });

        this.practiceQuestions.set('q_modals_005', {
            id: 'q_modals_005',
            category: 'modals',
            difficulty: 'A2',
            question: 'Ms. Chen _____ speak both Mandarin and English, so she will interpret at tomorrow\'s meeting.',
            options: [
                'can',
                'must',
                'should',
                'might'
            ],
            correctAnswer: 0,
            explanation: 'The sentence describes an ability (speaking two languages) that explains why she will interpret. "Can" is the modal of ability.',
            grammarRule: 'modal_verbs'
        });

        this.practiceQuestions.set('q_modals_006', {
            id: 'q_modals_006',
            category: 'modals',
            difficulty: 'B1',
            question: '_____ I leave the office early today? I have a doctor\'s appointment at four.',
            options: [
                'May',
                'Must',
                'Would',
                'Shall'
            ],
            correctAnswer: 0,
            explanation: 'The speaker is asking for permission, and "May I...?" is the polite way to request it. "Must I" asks about obligation, and "Would I" is not used to request permission for oneself.',
            grammarRule: 'modal_verbs'
        });

        this.practiceQuestions.set('q_modals_007', {
            id: 'q_modals_007',
            category: 'modals',
            difficulty: 'B2',
            question: 'The shipment _____ have been delayed by the storm; it normally arrives on Tuesdays.',
            options: [
                'must',
                'can',
                'will',
                'shall'
            ],
            correctAnswer: 0,
            explanation: '"Must + have + past participle" expresses a logical conclusion about the past — the missing shipment plus the storm makes the delay the most likely explanation. "Can have been" is not used for positive past deduction.',
            grammarRule: 'modal_verbs'
        });

        this.practiceQuestions.set('q_modals_008', {
            id: 'q_modals_008',
            category: 'modals',
            difficulty: 'B1',
            question: 'You _____ back up important files regularly in case the server fails.',
            options: [
                'should',
                'would',
                'shall',
                'used to'
            ],
            correctAnswer: 0,
            explanation: 'The sentence gives advice about a good habit, signaled by "regularly" and "in case". "Should" is the modal of advice; "used to" refers to a past habit that has stopped.',
            grammarRule: 'modal_verbs'
        });

        this.practiceQuestions.set('q_modals_009', {
            id: 'q_modals_009',
            category: 'modals',
            difficulty: 'B2',
            question: 'The technician says the printer _____ repaired by Wednesday afternoon.',
            options: [
                'can be',
                'can',
                'can to be',
                'can being'
            ],
            correctAnswer: 0,
            explanation: 'The printer receives the action, so the passive is needed: modal + be + past participle ("can be repaired"). Modals are never followed by "to" or an -ing form.',
            grammarRule: 'modal_verbs'
        });

        this.practiceQuestions.set('q_modals_010', {
            id: 'q_modals_010',
            category: 'modals',
            difficulty: 'A2',
            question: 'All visitors must _____ in at the front desk before entering the laboratory.',
            options: [
                'sign',
                'to sign',
                'signing',
                'signed'
            ],
            correctAnswer: 0,
            explanation: 'After a modal verb like "must", the base form of the verb is used — never "to + verb" or an -ing form.',
            grammarRule: 'modal_verbs'
        });

        // Additional Prepositions Questions
        this.practiceQuestions.set('q_prepositions_003', {
            id: 'q_prepositions_003',
            category: 'prepositions',
            difficulty: 'A2',
            question: 'Our fiscal year ends _____ December.',
            options: [
                'at',
                'on',
                'in',
                'by'
            ],
            correctAnswer: 2,
            explanation: '"In" is used with months and years. "On" is for specific dates and days, and "at" is for clock times.',
            grammarRule: 'time_prepositions'
        });

        this.practiceQuestions.set('q_prepositions_004', {
            id: 'q_prepositions_004',
            category: 'prepositions',
            difficulty: 'A2',
            question: 'The store remains closed _____ public holidays.',
            options: [
                'in',
                'on',
                'at',
                'for'
            ],
            correctAnswer: 1,
            explanation: '"On" is used with days and holidays, just as with days of the week ("on Mondays", "on public holidays").',
            grammarRule: 'time_prepositions'
        });

        this.practiceQuestions.set('q_prepositions_005', {
            id: 'q_prepositions_005',
            category: 'prepositions',
            difficulty: 'B1',
            question: 'Please submit your expense reports _____ Friday at the latest.',
            options: [
                'until',
                'by',
                'from',
                'since'
            ],
            correctAnswer: 1,
            explanation: 'The phrase "at the latest" signals a deadline, and "by" means "no later than". "Until" describes an action continuing up to a point, not a one-time submission.',
            grammarRule: 'time_prepositions'
        });

        this.practiceQuestions.set('q_prepositions_006', {
            id: 'q_prepositions_006',
            category: 'prepositions',
            difficulty: 'B1',
            question: 'The customer service line stays open _____ 8 P.M. on weekdays.',
            options: [
                'by',
                'until',
                'at',
                'in'
            ],
            correctAnswer: 1,
            explanation: '"Stays open" is a continuing state, so "until" marks the point when it ends. "By" is only for deadlines of completed actions, not ongoing states.',
            grammarRule: 'time_prepositions'
        });

        this.practiceQuestions.set('q_prepositions_007', {
            id: 'q_prepositions_007',
            category: 'prepositions',
            difficulty: 'B1',
            question: 'The warehouse renovation was completed _____ two weeks, well ahead of schedule.',
            options: [
                'during',
                'in',
                'for',
                'since'
            ],
            correctAnswer: 1,
            explanation: '"In + a period of time" tells how long something took to finish ("completed in two weeks"). "For" describes duration of an ongoing action, and "during" needs a named event, not a length of time.',
            grammarRule: 'time_prepositions'
        });

        this.practiceQuestions.set('q_prepositions_008', {
            id: 'q_prepositions_008',
            category: 'prepositions',
            difficulty: 'A2',
            question: 'Mr. Park has worked in the accounting department _____ 2019.',
            options: [
                'for',
                'since',
                'from',
                'in'
            ],
            correctAnswer: 1,
            explanation: 'With the present perfect, "since" marks the starting point (a year, a date), while "for" is used with a length of time ("for five years").',
            grammarRule: 'time_prepositions'
        });

        this.practiceQuestions.set('q_prepositions_009', {
            id: 'q_prepositions_009',
            category: 'prepositions',
            difficulty: 'A2',
            question: 'The training seminar lasted _____ three hours.',
            options: [
                'since',
                'for',
                'during',
                'at'
            ],
            correctAnswer: 1,
            explanation: '"For" is used with a length of time ("three hours"). "During" is followed by the name of an event ("during the seminar"), not a number of hours.',
            grammarRule: 'time_prepositions'
        });

        this.practiceQuestions.set('q_prepositions_010', {
            id: 'q_prepositions_010',
            category: 'prepositions',
            difficulty: 'B1',
            question: 'Please switch off your mobile phones _____ the presentation.',
            options: [
                'while',
                'during',
                'for',
                'since'
            ],
            correctAnswer: 1,
            explanation: '"During" is a preposition and takes a noun ("the presentation"), whereas "while" is a conjunction and must be followed by a full clause with a subject and verb.',
            grammarRule: 'time_prepositions'
        });

        // Additional Conditionals Questions
        this.practiceQuestions.set('q_conditionals_003', {
            id: 'q_conditionals_003',
            category: 'conditionals',
            difficulty: 'B1',
            question: 'If the client _____ the revised terms, we will sign the contract tomorrow.',
            options: [
                'accepts',
                'will accept',
                'accepted',
                'would accept'
            ],
            correctAnswer: 0,
            explanation: 'In the first conditional, the if-clause takes the present simple even though the meaning is future — "will" belongs only in the main clause.',
            grammarRule: 'first_conditional'
        });

        this.practiceQuestions.set('q_conditionals_004', {
            id: 'q_conditionals_004',
            category: 'conditionals',
            difficulty: 'B2',
            question: '_____ the invoice is paid by Friday, the order will not be shipped.',
            options: [
                'Unless',
                'If',
                'Because',
                'Although'
            ],
            correctAnswer: 0,
            explanation: '"Unless" means "if... not": the order will not ship if payment does not arrive. "If" would make the sentence illogical — paying the invoice would block the shipment.',
            grammarRule: 'first_conditional'
        });

        this.practiceQuestions.set('q_conditionals_005', {
            id: 'q_conditionals_005',
            category: 'conditionals',
            difficulty: 'B2',
            question: 'If demand continues to grow, the factory _____ a second production line.',
            options: [
                'will add',
                'adds',
                'added',
                'would add'
            ],
            correctAnswer: 0,
            explanation: 'The if-clause uses the present simple ("continues"), so this is a first conditional about a real future possibility, and the main clause needs "will + base verb". "Would add" belongs to the unreal second conditional.',
            grammarRule: 'first_conditional'
        });

        this.practiceQuestions.set('q_conditionals_006', {
            id: 'q_conditionals_006',
            category: 'conditionals',
            difficulty: 'B2',
            question: 'We will issue a full refund if the product _____ defective on arrival.',
            options: [
                'is',
                'will be',
                'were',
                'would be'
            ],
            correctAnswer: 0,
            explanation: 'The main clause "will issue" shows this is a first conditional, so the if-clause must stay in the present simple. Never use "will" or "would" directly after "if" in this pattern.',
            grammarRule: 'first_conditional'
        });

        this.practiceQuestions.set('q_conditionals_007', {
            id: 'q_conditionals_007',
            category: 'conditionals',
            difficulty: 'B2',
            question: 'If you _____ any questions during the webinar, please type them in the chat box.',
            options: [
                'have',
                'will have',
                'had',
                'would have'
            ],
            correctAnswer: 0,
            explanation: 'A real conditional with an imperative main clause ("please type") still takes the present simple in the if-clause. "Had" would signal an unreal, hypothetical situation.',
            grammarRule: 'first_conditional'
        });

        this.practiceQuestions.set('q_conditionals_008', {
            id: 'q_conditionals_008',
            category: 'conditionals',
            difficulty: 'B1',
            question: 'If the flight is delayed, the airline _____ passengers a meal voucher.',
            options: [
                'will give',
                'would give',
                'gave',
                'giving'
            ],
            correctAnswer: 0,
            explanation: 'The if-clause is in the present simple ("is delayed"), so the main clause of this first conditional needs "will + base verb" for the real future result.',
            grammarRule: 'first_conditional'
        });

        this.practiceQuestions.set('q_conditionals_009', {
            id: 'q_conditionals_009',
            category: 'conditionals',
            difficulty: 'B2',
            question: 'Provided that the samples _____ our quality standards, we will place a bulk order.',
            options: [
                'meet',
                'will meet',
                'met',
                'would meet'
            ],
            correctAnswer: 0,
            explanation: '"Provided that" works exactly like "if" in a first conditional, so the condition clause takes the present simple, and "will" stays in the main clause.',
            grammarRule: 'first_conditional'
        });

        this.practiceQuestions.set('q_conditionals_010', {
            id: 'q_conditionals_010',
            category: 'conditionals',
            difficulty: 'B2',
            question: 'If the elevator breaks down again, maintenance _____ immediately.',
            options: [
                'must be notified',
                'must notify',
                'must to notify',
                'must notifying'
            ],
            correctAnswer: 0,
            explanation: 'Maintenance receives the action (someone notifies them), so the passive "must be notified" is required. First conditionals can take a modal instead of "will" in the main clause.',
            grammarRule: 'first_conditional'
        });

        // Additional Articles Questions
        this.practiceQuestions.set('q_articles_003', {
            id: 'q_articles_003',
            category: 'articles',
            difficulty: 'A2',
            question: 'Ms. Rivera will give _____ presentation on the new marketing strategy.',
            options: [
                'a',
                'an',
                'the',
                'no article'
            ],
            correctAnswer: 0,
            explanation: '"Presentation" is a singular countable noun mentioned for the first time, so the indefinite article is needed, and it begins with a consonant sound, so "a" is correct.',
            grammarRule: 'articles'
        });

        this.practiceQuestions.set('q_articles_004', {
            id: 'q_articles_004',
            category: 'articles',
            difficulty: 'A2',
            question: 'We have _____ appointment with the supplier at noon.',
            options: [
                'a',
                'an',
                'the',
                'no article'
            ],
            correctAnswer: 1,
            explanation: '"Appointment" begins with a vowel sound, so the indefinite article "an" is required for this first mention of a singular countable noun.',
            grammarRule: 'articles'
        });

        this.practiceQuestions.set('q_articles_005', {
            id: 'q_articles_005',
            category: 'articles',
            difficulty: 'B1',
            question: 'He was promoted to _____ position of regional sales manager last month.',
            options: [
                'a',
                'an',
                'the',
                'no article'
            ],
            correctAnswer: 2,
            explanation: 'The noun is made specific by the phrase "of regional sales manager", which identifies exactly which position — so the definite article "the" is required.',
            grammarRule: 'articles'
        });

        this.practiceQuestions.set('q_articles_006', {
            id: 'q_articles_006',
            category: 'articles',
            difficulty: 'A2',
            question: 'The training session lasted _____ hour longer than expected.',
            options: [
                'a',
                'an',
                'the',
                'no article'
            ],
            correctAnswer: 1,
            explanation: 'Article choice depends on sound, not spelling: the "h" in "hour" is silent, so the word begins with a vowel sound and takes "an".',
            grammarRule: 'articles'
        });

        this.practiceQuestions.set('q_articles_007', {
            id: 'q_articles_007',
            category: 'articles',
            difficulty: 'B1',
            question: 'The technicians will bring _____ equipment needed for the installation.',
            options: [
                'a',
                'an',
                'the',
                'no article'
            ],
            correctAnswer: 2,
            explanation: '"Equipment" is uncountable, so "a/an" is impossible, but the phrase "needed for the installation" makes it specific — which calls for "the" rather than no article.',
            grammarRule: 'articles'
        });

        this.practiceQuestions.set('q_articles_008', {
            id: 'q_articles_008',
            category: 'articles',
            difficulty: 'A2',
            question: '_____ headquarters of the corporation is located in Singapore.',
            options: [
                'A',
                'An',
                'The',
                'No article'
            ],
            correctAnswer: 2,
            explanation: 'The phrase "of the corporation" identifies which headquarters is meant, so the definite article "the" is required for this specific reference.',
            grammarRule: 'articles'
        });

        this.practiceQuestions.set('q_articles_009', {
            id: 'q_articles_009',
            category: 'articles',
            difficulty: 'B1',
            question: 'She travels to Europe on business twice _____ year.',
            options: [
                'a',
                'an',
                'the',
                'no article'
            ],
            correctAnswer: 0,
            explanation: 'In frequency expressions like "twice a year" or "three times a week", the indefinite article "a" means "per".',
            grammarRule: 'articles'
        });

        this.practiceQuestions.set('q_articles_010', {
            id: 'q_articles_010',
            category: 'articles',
            difficulty: 'B1',
            question: 'Mr. Osei earned _____ MBA before joining the finance team.',
            options: [
                'a',
                'an',
                'the',
                'no article'
            ],
            correctAnswer: 1,
            explanation: 'Abbreviations follow the pronunciation rule: "MBA" starts with the vowel sound /em/, so it takes "an" even though the letter M is a consonant.',
            grammarRule: 'articles'
        });

        // Additional Relative Clauses Questions
        this.practiceQuestions.set('q_relative_003', {
            id: 'q_relative_003',
            category: 'relative_clauses',
            difficulty: 'B2',
            question: 'The consultant _____ report impressed the board will lead the next project.',
            options: [
                'who',
                'whose',
                'which',
                'whom'
            ],
            correctAnswer: 1,
            explanation: 'The report belongs to the consultant, so the possessive relative pronoun "whose" is needed. "Who" and "whom" cannot be followed directly by a noun in this way.',
            grammarRule: 'relative_clauses'
        });

        this.practiceQuestions.set('q_relative_004', {
            id: 'q_relative_004',
            category: 'relative_clauses',
            difficulty: 'B1',
            question: 'The proposal _____ was submitted last week has been approved by the committee.',
            options: [
                'which',
                'who',
                'whose',
                'where'
            ],
            correctAnswer: 0,
            explanation: 'The antecedent "proposal" is a thing acting as the subject of "was submitted", so "which" is correct. "Who" is only for people and "where" only for places.',
            grammarRule: 'relative_clauses'
        });

        this.practiceQuestions.set('q_relative_005', {
            id: 'q_relative_005',
            category: 'relative_clauses',
            difficulty: 'B2',
            question: 'The hotel _____ the annual conference will be held offers attendees a special rate.',
            options: [
                'which',
                'that',
                'where',
                'who'
            ],
            correctAnswer: 2,
            explanation: 'The clause after the blank is complete ("the conference will be held"), so a relative adverb of place is needed. "Which" or "that" would require a preposition ("at which").',
            grammarRule: 'relative_clauses'
        });

        this.practiceQuestions.set('q_relative_006', {
            id: 'q_relative_006',
            category: 'relative_clauses',
            difficulty: 'B2',
            question: 'The candidate _____ we interviewed yesterday has accepted our offer.',
            options: [
                'whom',
                'which',
                'whose',
                'where'
            ],
            correctAnswer: 0,
            explanation: 'The antecedent is a person who is the object of "interviewed" (we interviewed him/her), so the object pronoun "whom" is correct. "Which" is only for things.',
            grammarRule: 'relative_clauses'
        });

        this.practiceQuestions.set('q_relative_007', {
            id: 'q_relative_007',
            category: 'relative_clauses',
            difficulty: 'B2',
            question: 'Employees _____ complete the survey will be entered into a prize drawing.',
            options: [
                'who',
                'which',
                'whose',
                'whom'
            ],
            correctAnswer: 0,
            explanation: 'The pronoun refers to people and is the subject of "complete", so "who" is needed. "Whom" is only for objects, and "whose" must be followed by a noun.',
            grammarRule: 'relative_clauses'
        });

        this.practiceQuestions.set('q_relative_008', {
            id: 'q_relative_008',
            category: 'relative_clauses',
            difficulty: 'B1',
            question: '2019 was the year _____ the company expanded into overseas markets.',
            options: [
                'where',
                'which',
                'when',
                'who'
            ],
            correctAnswer: 2,
            explanation: 'The antecedent "the year" is a time expression followed by a complete clause, so the relative adverb "when" is needed. "Which" would require a preposition ("in which").',
            grammarRule: 'relative_clauses'
        });

        this.practiceQuestions.set('q_relative_009', {
            id: 'q_relative_009',
            category: 'relative_clauses',
            difficulty: 'C1',
            question: 'The merger, _____ was announced in May, will create the region\'s largest logistics firm.',
            options: [
                'that',
                'which',
                'who',
                'what'
            ],
            correctAnswer: 1,
            explanation: 'The commas show this is a non-restrictive clause adding extra information, and "that" can never introduce a non-restrictive clause — only "which" can here.',
            grammarRule: 'relative_clauses'
        });

        this.practiceQuestions.set('q_relative_010', {
            id: 'q_relative_010',
            category: 'relative_clauses',
            difficulty: 'C1',
            question: 'The firm hired two engineers, both of _____ have experience in renewable energy.',
            options: [
                'them',
                'whom',
                'which',
                'who'
            ],
            correctAnswer: 1,
            explanation: 'In the quantifier pattern "both of / all of / some of + relative pronoun", people take "whom" after the preposition "of". "Them" would create two independent clauses joined without a conjunction.',
            grammarRule: 'relative_clauses'
        });

        // Additional Gerunds and Infinitives Questions
        this.practiceQuestions.set('q_gerunds_003', {
            id: 'q_gerunds_003',
            category: 'gerunds_infinitives',
            difficulty: 'B1',
            question: 'The manager suggested _____ the deadline to give the team more time.',
            options: [
                'extend',
                'extending',
                'to extend',
                'extended'
            ],
            correctAnswer: 1,
            explanation: '"Suggest" belongs to the group of verbs (suggest, recommend, consider) that are followed by a gerund, never a to-infinitive.',
            grammarRule: 'gerunds_infinitives'
        });

        this.practiceQuestions.set('q_gerunds_004', {
            id: 'q_gerunds_004',
            category: 'gerunds_infinitives',
            difficulty: 'B1',
            question: 'We look forward to _____ with your team next quarter.',
            options: [
                'working',
                'work',
                'to work',
                'worked'
            ],
            correctAnswer: 0,
            explanation: 'In "look forward to", the word "to" is a preposition, not part of an infinitive, so it must be followed by a gerund.',
            grammarRule: 'gerunds_infinitives'
        });

        this.practiceQuestions.set('q_gerunds_005', {
            id: 'q_gerunds_005',
            category: 'gerunds_infinitives',
            difficulty: 'B1',
            question: 'The company plans _____ a new branch office in Shanghai next year.',
            options: [
                'opening',
                'to open',
                'open',
                'opened'
            ],
            correctAnswer: 1,
            explanation: '"Plan" belongs to the group of future-oriented verbs (plan, hope, intend, expect) that take a to-infinitive, not a gerund.',
            grammarRule: 'gerunds_infinitives'
        });

        this.practiceQuestions.set('q_gerunds_006', {
            id: 'q_gerunds_006',
            category: 'gerunds_infinitives',
            difficulty: 'B2',
            question: 'Please remember _____ the storage room when you leave this evening.',
            options: [
                'locking',
                'to lock',
                'lock',
                'locked'
            ],
            correctAnswer: 1,
            explanation: '"Remember + to-infinitive" refers to a duty still to be done (lock the room later tonight), while "remember + gerund" recalls a past action. The future context "when you leave" signals the infinitive.',
            grammarRule: 'gerunds_infinitives'
        });

        this.practiceQuestions.set('q_gerunds_007', {
            id: 'q_gerunds_007',
            category: 'gerunds_infinitives',
            difficulty: 'B1',
            question: 'The IT department has finished _____ the new software on all computers.',
            options: [
                'install',
                'to install',
                'installing',
                'installed'
            ],
            correctAnswer: 2,
            explanation: '"Finish" is always followed by a gerund (like "enjoy", "avoid", and "keep"), never by a to-infinitive.',
            grammarRule: 'gerunds_infinitives'
        });

        this.practiceQuestions.set('q_gerunds_008', {
            id: 'q_gerunds_008',
            category: 'gerunds_infinitives',
            difficulty: 'B1',
            question: 'Mr. Tanaka agreed _____ the training workshop next month.',
            options: [
                'leading',
                'to lead',
                'lead',
                'led'
            ],
            correctAnswer: 1,
            explanation: '"Agree" takes a to-infinitive (like "decide", "offer", and "promise"). A gerund after "agree" is never correct.',
            grammarRule: 'gerunds_infinitives'
        });

        this.practiceQuestions.set('q_gerunds_009', {
            id: 'q_gerunds_009',
            category: 'gerunds_infinitives',
            difficulty: 'B2',
            question: 'The new filing system helps staff avoid _____ important documents.',
            options: [
                'misplace',
                'to misplace',
                'misplacing',
                'misplaced'
            ],
            correctAnswer: 2,
            explanation: '"Avoid" is one of the verbs that must be followed by a gerund (avoid, deny, postpone, risk) — "avoid to do" is a classic error.',
            grammarRule: 'gerunds_infinitives'
        });

        this.practiceQuestions.set('q_gerunds_010', {
            id: 'q_gerunds_010',
            category: 'gerunds_infinitives',
            difficulty: 'A2',
            question: '_____ regular breaks improves concentration and productivity.',
            options: [
                'Take',
                'Taking',
                'To taking',
                'Taken'
            ],
            correctAnswer: 1,
            explanation: 'A verb acting as the subject of a sentence takes the gerund form: "Taking regular breaks" is the subject of "improves". A bare verb cannot be a subject.',
            grammarRule: 'gerunds_infinitives'
        });

        // Additional Comparatives Questions
        this.practiceQuestions.set('q_comparatives_003', {
            id: 'q_comparatives_003',
            category: 'comparatives',
            difficulty: 'A2',
            question: 'The new photocopier is much _____ than the old one.',
            options: [
                'fast',
                'faster',
                'fastest',
                'more fast'
            ],
            correctAnswer: 1,
            explanation: 'The word "than" signals a comparative, and one-syllable adjectives form it with -er ("faster"), not with "more".',
            grammarRule: 'comparatives'
        });

        this.practiceQuestions.set('q_comparatives_004', {
            id: 'q_comparatives_004',
            category: 'comparatives',
            difficulty: 'B1',
            question: 'The downtown branch is _____ than any other branch in the region.',
            options: [
                'busier',
                'more busy',
                'busiest',
                'busily'
            ],
            correctAnswer: 0,
            explanation: 'Two-syllable adjectives ending in -y change to -ier for the comparative ("busy" → "busier"). "Busily" is an adverb and cannot follow "is" here.',
            grammarRule: 'comparatives'
        });

        this.practiceQuestions.set('q_comparatives_005', {
            id: 'q_comparatives_005',
            category: 'comparatives',
            difficulty: 'B1',
            question: 'Of all our products, this model is the _____ popular with younger customers.',
            options: [
                'more',
                'most',
                'much',
                'many'
            ],
            correctAnswer: 1,
            explanation: 'The phrase "of all our products" compares one item with a whole group, which requires the superlative "the most". "The more" only compares two things.',
            grammarRule: 'comparatives'
        });

        this.practiceQuestions.set('q_comparatives_006', {
            id: 'q_comparatives_006',
            category: 'comparatives',
            difficulty: 'A2',
            question: 'The new office is more spacious _____ the previous one.',
            options: [
                'that',
                'than',
                'then',
                'as'
            ],
            correctAnswer: 1,
            explanation: 'A comparative form ("more spacious") must be completed with "than". "Then" refers to time and is a common spelling trap; "as" pairs only with "as... as".',
            grammarRule: 'comparatives'
        });

        this.practiceQuestions.set('q_comparatives_007', {
            id: 'q_comparatives_007',
            category: 'comparatives',
            difficulty: 'B1',
            question: 'The new packaging is just as _____ as the old design but costs less.',
            options: [
                'durable',
                'more durable',
                'most durable',
                'durably'
            ],
            correctAnswer: 0,
            explanation: 'The equality structure "as... as" takes the base (positive) form of the adjective — never a comparative or superlative between the two "as".',
            grammarRule: 'comparatives'
        });

        this.practiceQuestions.set('q_comparatives_008', {
            id: 'q_comparatives_008',
            category: 'comparatives',
            difficulty: 'B2',
            question: 'The more customers we attract, _____ our revenue will grow.',
            options: [
                'the faster',
                'faster',
                'the fastest',
                'fast'
            ],
            correctAnswer: 0,
            explanation: 'This is the double comparative pattern "the + comparative..., the + comparative...", so the second clause must also begin with "the" plus a comparative form.',
            grammarRule: 'comparatives'
        });

        this.practiceQuestions.set('q_comparatives_009', {
            id: 'q_comparatives_009',
            category: 'comparatives',
            difficulty: 'A2',
            question: 'This is _____ efficient machine in the entire plant.',
            options: [
                'the most',
                'the more',
                'most',
                'more'
            ],
            correctAnswer: 0,
            explanation: 'The phrase "in the entire plant" defines a group, which signals a superlative, and superlatives of long adjectives need "the most".',
            grammarRule: 'comparatives'
        });

        this.practiceQuestions.set('q_comparatives_010', {
            id: 'q_comparatives_010',
            category: 'comparatives',
            difficulty: 'B1',
            question: 'Road conditions got _____ after the storm, delaying several deliveries.',
            options: [
                'worse',
                'worst',
                'more bad',
                'badly'
            ],
            correctAnswer: 0,
            explanation: '"Bad" has the irregular comparative "worse" — "more bad" does not exist. The superlative "worst" would need "the" and a comparison group.',
            grammarRule: 'comparatives'
        });

        // Additional Conjunctions Questions
        this.practiceQuestions.set('q_conjunctions_003', {
            id: 'q_conjunctions_003',
            category: 'conjunctions',
            difficulty: 'A2',
            question: 'The venue was small, _____ the seminar was a great success.',
            options: [
                'and',
                'but',
                'so',
                'or'
            ],
            correctAnswer: 1,
            explanation: 'The two clauses contrast (a small venue versus a great success), so the contrast conjunction "but" is needed.',
            grammarRule: 'conjunctions'
        });

        this.practiceQuestions.set('q_conjunctions_004', {
            id: 'q_conjunctions_004',
            category: 'conjunctions',
            difficulty: 'A2',
            question: 'The flight was delayed, _____ we missed the connecting train.',
            options: [
                'so',
                'because',
                'but',
                'or'
            ],
            correctAnswer: 0,
            explanation: 'The second clause is the result of the first (delay → missed train), so "so" is correct. "Because" would reverse the logic, making the delay the result.',
            grammarRule: 'conjunctions'
        });

        this.practiceQuestions.set('q_conjunctions_005', {
            id: 'q_conjunctions_005',
            category: 'conjunctions',
            difficulty: 'B2',
            question: '_____ the high cost, the board approved the expansion plan.',
            options: [
                'Although',
                'Despite',
                'Because',
                'Even'
            ],
            correctAnswer: 1,
            explanation: 'The blank is followed by a noun phrase ("the high cost"), so the preposition "despite" is required. "Although" introduces a full clause with a subject and verb.',
            grammarRule: 'conjunctions'
        });

        this.practiceQuestions.set('q_conjunctions_006', {
            id: 'q_conjunctions_006',
            category: 'conjunctions',
            difficulty: 'B1',
            question: '_____ it was raining heavily, the outdoor event went ahead as planned.',
            options: [
                'Despite',
                'Although',
                'Because of',
                'However'
            ],
            correctAnswer: 1,
            explanation: 'The blank is followed by a full clause ("it was raining"), so the conjunction "although" fits. "Despite" and "because of" take only noun phrases, and "however" cannot join two clauses this way.',
            grammarRule: 'conjunctions'
        });

        this.practiceQuestions.set('q_conjunctions_007', {
            id: 'q_conjunctions_007',
            category: 'conjunctions',
            difficulty: 'A2',
            question: 'Both the manager _____ her assistant attended the trade fair in Osaka.',
            options: [
                'or',
                'and',
                'but',
                'nor'
            ],
            correctAnswer: 1,
            explanation: '"Both" always pairs with "and" in the correlative pattern "both... and". "Or" pairs with "either", and "nor" pairs with "neither".',
            grammarRule: 'conjunctions'
        });

        this.practiceQuestions.set('q_conjunctions_008', {
            id: 'q_conjunctions_008',
            category: 'conjunctions',
            difficulty: 'A2',
            question: 'You can pay either by credit card _____ by bank transfer.',
            options: [
                'and',
                'or',
                'nor',
                'but'
            ],
            correctAnswer: 1,
            explanation: 'The word "either" earlier in the sentence signals the correlative pair "either... or", which presents two alternatives.',
            grammarRule: 'conjunctions'
        });

        this.practiceQuestions.set('q_conjunctions_009', {
            id: 'q_conjunctions_009',
            category: 'conjunctions',
            difficulty: 'B1',
            question: 'The report must be finished today _____ the client meeting is early tomorrow morning.',
            options: [
                'since',
                'so that',
                'despite',
                'unless'
            ],
            correctAnswer: 0,
            explanation: 'The second clause gives the reason for the deadline, and "since" here means "because". "So that" introduces a purpose and would need a modal like "can" in its clause.',
            grammarRule: 'conjunctions'
        });

        this.practiceQuestions.set('q_conjunctions_010', {
            id: 'q_conjunctions_010',
            category: 'conjunctions',
            difficulty: 'A2',
            question: 'Please review the attached file _____ let me know if any changes are needed.',
            options: [
                'but',
                'or',
                'and',
                'so'
            ],
            correctAnswer: 2,
            explanation: 'The sentence joins two actions the reader should do in sequence, so the additive conjunction "and" is correct — there is no contrast or choice here.',
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
        
        // 'mixed' means all categories; no question carries a literal
        // 'mixed' category, so filtering by it produced an empty session
        if (category !== 'all' && category !== 'mixed') {
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
        
        // Record answer (keyed by question id so re-answering via
        // Previous navigation replaces the old answer instead of double-counting)
        const answerRecord = {
            questionId: currentQuestion.id,
            selectedAnswer: selectedAnswer,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect: isCorrect,
            timeSpent: timeSpent,
            timestamp: Date.now()
        };

        const existingIndex = this.currentSession.answers.findIndex(
            answer => answer.questionId === currentQuestion.id
        );

        if (existingIndex !== -1) {
            // Remove the previous answer's contribution to the stats
            const previousAnswer = this.currentSession.answers[existingIndex];
            if (previousAnswer.isCorrect) {
                this.sessionStats.correctAnswers--;
            } else {
                this.sessionStats.incorrectAnswers--;
            }
            this.currentSession.answers[existingIndex] = answerRecord;
        } else {
            this.currentSession.answers.push(answerRecord);
        }

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
        // Accuracy over answered questions - ending a 20-question session
        // early after 5/5 correct is 100%, not 25%
        const answeredCount = this.currentSession.answers.length;
        const accuracy = answeredCount > 0 ? (correctAnswers / answeredCount) * 100 : 0;
        
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
