/**
 * Daily Conversation Practice System
 *
 * Everyday English conversation scenarios for students: read a real-life
 * dialogue, study the useful phrases, then answer comprehension questions.
 *
 * Self-contained: owns its data, state, and rendering. Renders into
 * #toeicModuleContent like the other TOEIC modules. UI chrome is
 * translated via window.t(); dialogue/questions stay in English on
 * purpose — they are the learning material. Scenario titles carry an
 * inline Chinese translation so the menu is readable in both languages.
 */

class DailyConversationSystem {
    constructor() {
        this.scenarios = this.loadScenarios();
        this.currentScenario = null;
        this.currentQuestionIndex = 0;
        this.sessionCorrect = 0;
        this.answered = false;
        this.view = 'menu'; // 'menu' | 'dialogue' | 'questions' | 'complete'
        this.progress = this.loadProgress();

        // Re-render the current view when the language switches so all
        // chrome picks up the new translations
        window.addEventListener('languageChanged', () => {
            if (document.getElementById('dailyConversationRoot')) {
                this.render();
            }
        });

        console.log('💬 Daily Conversation System initialized');
    }

    // ---------------------------------------------------------------
    // Data
    // ---------------------------------------------------------------

    loadScenarios() {
        return [
            {
                id: 'restaurant',
                icon: '🍽️',
                title: 'At the Restaurant',
                titleZh: '在餐厅',
                level: 'A2',
                dialogue: [
                    { speaker: 'Waiter', text: 'Good evening! Do you have a reservation?' },
                    { speaker: 'Anna', text: 'Yes, a table for two under the name Anna Chen.' },
                    { speaker: 'Waiter', text: 'Perfect. Right this way, please. Here are your menus.' },
                    { speaker: 'Anna', text: 'Thank you. Could we get a few more minutes to decide?' },
                    { speaker: 'Waiter', text: 'Of course. Can I bring you something to drink while you look?' },
                    { speaker: 'Anna', text: 'Two glasses of water, please. And what do you recommend today?' },
                    { speaker: 'Waiter', text: 'The grilled salmon is very popular, and today\'s soup is mushroom.' },
                    { speaker: 'Anna', text: 'Great, we\'ll take one salmon and one soup to start.' }
                ],
                usefulPhrases: [
                    { phrase: 'Do you have a reservation?', meaning: '您有预订吗？' },
                    { phrase: 'A table for two, please.', meaning: '请给我们一张两人桌。' },
                    { phrase: 'What do you recommend?', meaning: '您有什么推荐？' },
                    { phrase: 'Could we have the bill, please?', meaning: '请给我们账单，好吗？' }
                ],
                questions: [
                    {
                        question: 'Why does the waiter say "Right this way, please"?',
                        options: [
                            'He is showing them to their table.',
                            'He is asking them to leave.',
                            'He wants them to pay first.',
                            'He is pointing at the menu.'
                        ],
                        correctAnswer: 0,
                        explanation: '"Right this way" means "follow me" — the waiter is leading them to their reserved table.'
                    },
                    {
                        question: 'What does Anna ask for before ordering food?',
                        options: [
                            'The bill',
                            'A few more minutes to decide',
                            'A different table',
                            'The manager'
                        ],
                        correctAnswer: 1,
                        explanation: 'Anna says: "Could we get a few more minutes to decide?"'
                    },
                    {
                        question: 'What does the waiter recommend?',
                        options: [
                            'The chicken salad',
                            'The beef steak',
                            'The grilled salmon',
                            'The pasta'
                        ],
                        correctAnswer: 2,
                        explanation: 'The waiter says: "The grilled salmon is very popular."'
                    }
                ]
            },
            {
                id: 'directions',
                icon: '🗺️',
                title: 'Asking for Directions',
                titleZh: '问路',
                level: 'A2',
                dialogue: [
                    { speaker: 'Tom', text: 'Excuse me, could you tell me how to get to the central train station?' },
                    { speaker: 'Local', text: 'Sure! Go straight down this street for two blocks, then turn left at the bank.' },
                    { speaker: 'Tom', text: 'Left at the bank, got it. Is it far from there?' },
                    { speaker: 'Local', text: 'Not at all — about a five-minute walk. You\'ll see it right across from the big shopping mall.' },
                    { speaker: 'Tom', text: 'That\'s very helpful. Is there a bus that goes there too?' },
                    { speaker: 'Local', text: 'Yes, the number 12 bus stops right in front of it, but honestly, walking is faster at this hour.' },
                    { speaker: 'Tom', text: 'I\'ll walk then. Thanks so much for your help!' },
                    { speaker: 'Local', text: 'No problem. Have a good trip!' }
                ],
                usefulPhrases: [
                    { phrase: 'Excuse me, could you tell me how to get to...?', meaning: '打扰一下，请问去……怎么走？' },
                    { phrase: 'Go straight for two blocks.', meaning: '直走两个街区。' },
                    { phrase: 'Turn left / right at...', meaning: '在……左转/右转' },
                    { phrase: 'Is it far from here?', meaning: '离这里远吗？' }
                ],
                questions: [
                    {
                        question: 'Where should Tom turn left?',
                        options: [
                            'At the shopping mall',
                            'At the bank',
                            'At the bus stop',
                            'At the train station'
                        ],
                        correctAnswer: 1,
                        explanation: 'The local says: "turn left at the bank."'
                    },
                    {
                        question: 'How long is the walk to the station?',
                        options: [
                            'About five minutes',
                            'About fifteen minutes',
                            'About two minutes',
                            'About half an hour'
                        ],
                        correctAnswer: 0,
                        explanation: 'The local says it is "about a five-minute walk."'
                    },
                    {
                        question: 'Why does Tom decide to walk instead of taking the bus?',
                        options: [
                            'The bus is too expensive.',
                            'There is no bus to the station.',
                            'The local says walking is faster at this hour.',
                            'He wants to see the shopping mall.'
                        ],
                        correctAnswer: 2,
                        explanation: 'The local says: "walking is faster at this hour," so Tom replies "I\'ll walk then."'
                    }
                ]
            },
            {
                id: 'shopping',
                icon: '🛍️',
                title: 'Shopping for Clothes',
                titleZh: '买衣服',
                level: 'A2',
                dialogue: [
                    { speaker: 'Clerk', text: 'Hi there! Can I help you find anything?' },
                    { speaker: 'Mia', text: 'Yes, I\'m looking for a jacket for the winter. Something warm but not too heavy.' },
                    { speaker: 'Clerk', text: 'We have these new ones over here. What size do you wear?' },
                    { speaker: 'Mia', text: 'Medium, usually. Oh, I like this blue one. Can I try it on?' },
                    { speaker: 'Clerk', text: 'Of course, the fitting rooms are just behind you.' },
                    { speaker: 'Mia', text: 'It fits well, but do you have it in black?' },
                    { speaker: 'Clerk', text: 'Let me check... yes, one black medium left. It\'s also on sale — 20% off this week.' },
                    { speaker: 'Mia', text: 'Perfect, I\'ll take it. Can I pay by card?' }
                ],
                usefulPhrases: [
                    { phrase: 'I\'m looking for...', meaning: '我想买……' },
                    { phrase: 'Can I try it on?', meaning: '我可以试穿吗？' },
                    { phrase: 'Do you have it in black / a smaller size?', meaning: '这个有黑色的/小一号的吗？' },
                    { phrase: 'I\'ll take it.', meaning: '我买了。' }
                ],
                questions: [
                    {
                        question: 'What is Mia looking for?',
                        options: [
                            'A summer dress',
                            'A warm winter jacket',
                            'A pair of shoes',
                            'A gift for a friend'
                        ],
                        correctAnswer: 1,
                        explanation: 'Mia says: "I\'m looking for a jacket for the winter. Something warm but not too heavy."'
                    },
                    {
                        question: 'What does "Can I try it on?" mean?',
                        options: [
                            'Can I buy it?',
                            'Can I return it?',
                            'Can I put it on to see if it fits?',
                            'Can I get a discount?'
                        ],
                        correctAnswer: 2,
                        explanation: '"To try on" clothes means to put them on to check the size and look before buying.'
                    },
                    {
                        question: 'Why is the black jacket a good deal?',
                        options: [
                            'It is the last winter jacket in the shop.',
                            'It comes with a free scarf.',
                            'It is handmade.',
                            'It is on sale with 20% off.'
                        ],
                        correctAnswer: 3,
                        explanation: 'The clerk says: "It\'s also on sale — 20% off this week."'
                    }
                ]
            },
            {
                id: 'doctor',
                icon: '🏥',
                title: 'At the Doctor\'s Office',
                titleZh: '看医生',
                level: 'B1',
                dialogue: [
                    { speaker: 'Doctor', text: 'Good morning. What seems to be the problem?' },
                    { speaker: 'Ken', text: 'I\'ve had a sore throat and a slight fever since Monday.' },
                    { speaker: 'Doctor', text: 'I see. Any cough or headache?' },
                    { speaker: 'Ken', text: 'A little cough, especially at night. No headache though.' },
                    { speaker: 'Doctor', text: 'Let me have a look... Your throat is quite red. It looks like a mild infection.' },
                    { speaker: 'Ken', text: 'Is it serious? I have an important presentation on Friday.' },
                    { speaker: 'Doctor', text: 'You should be fine by then. Take this medicine twice a day and drink plenty of warm water.' },
                    { speaker: 'Ken', text: 'Twice a day, understood. Thank you, doctor.' }
                ],
                usefulPhrases: [
                    { phrase: 'What seems to be the problem?', meaning: '哪里不舒服？' },
                    { phrase: 'I\'ve had a sore throat since Monday.', meaning: '我从周一开始嗓子疼。' },
                    { phrase: 'Take this medicine twice a day.', meaning: '这个药一天吃两次。' },
                    { phrase: 'Get plenty of rest.', meaning: '多休息。' }
                ],
                questions: [
                    {
                        question: 'What symptoms does Ken have?',
                        options: [
                            'A sore throat, slight fever, and a little cough',
                            'A headache and back pain',
                            'A stomachache and fever',
                            'Only a strong cough'
                        ],
                        correctAnswer: 0,
                        explanation: 'Ken mentions a sore throat, a slight fever, and later "a little cough, especially at night." He says he has no headache.'
                    },
                    {
                        question: 'How often should Ken take the medicine?',
                        options: [
                            'Once a day',
                            'Twice a day',
                            'Three times a day',
                            'Only when he coughs'
                        ],
                        correctAnswer: 1,
                        explanation: 'The doctor says: "Take this medicine twice a day."'
                    },
                    {
                        question: 'Why is Ken worried about being sick?',
                        options: [
                            'He has a flight on Friday.',
                            'He has an exam next week.',
                            'He has an important presentation on Friday.',
                            'He has a job interview tomorrow.'
                        ],
                        correctAnswer: 2,
                        explanation: 'Ken says: "I have an important presentation on Friday."'
                    }
                ]
            },
            {
                id: 'hotel',
                icon: '🏨',
                title: 'Hotel Check-in',
                titleZh: '酒店入住',
                level: 'A2',
                dialogue: [
                    { speaker: 'Receptionist', text: 'Welcome to the Grand Plaza Hotel. How may I help you?' },
                    { speaker: 'Laura', text: 'Hi, I\'d like to check in. I have a booking under Laura Kim.' },
                    { speaker: 'Receptionist', text: 'Let me see... yes, a double room for three nights, is that right?' },
                    { speaker: 'Laura', text: 'That\'s right. Is breakfast included in the rate?' },
                    { speaker: 'Receptionist', text: 'Yes, breakfast is served from 6:30 to 10:00 on the second floor.' },
                    { speaker: 'Laura', text: 'Great. And what time is check-out?' },
                    { speaker: 'Receptionist', text: 'Check-out is at noon. Here\'s your key card — room 815 on the eighth floor.' },
                    { speaker: 'Laura', text: 'Thank you very much!' }
                ],
                usefulPhrases: [
                    { phrase: 'I\'d like to check in / check out.', meaning: '我想办理入住/退房。' },
                    { phrase: 'I have a booking under (name).', meaning: '我用（名字）预订了房间。' },
                    { phrase: 'Is breakfast included?', meaning: '含早餐吗？' },
                    { phrase: 'What time is check-out?', meaning: '几点退房？' }
                ],
                questions: [
                    {
                        question: 'How many nights will Laura stay?',
                        options: [
                            'One night',
                            'Two nights',
                            'Three nights',
                            'Four nights'
                        ],
                        correctAnswer: 2,
                        explanation: 'The receptionist confirms "a double room for three nights."'
                    },
                    {
                        question: 'Where is breakfast served?',
                        options: [
                            'In the lobby',
                            'On the second floor',
                            'On the eighth floor',
                            'In the room'
                        ],
                        correctAnswer: 1,
                        explanation: 'The receptionist says breakfast "is served from 6:30 to 10:00 on the second floor."'
                    },
                    {
                        question: 'What time must guests check out?',
                        options: [
                            'At 10:00 a.m.',
                            'At noon',
                            'At 2:00 p.m.',
                            'At 6:30 a.m.'
                        ],
                        correctAnswer: 1,
                        explanation: 'The receptionist says: "Check-out is at noon."'
                    }
                ]
            },
            {
                id: 'phone',
                icon: '📞',
                title: 'A Phone Call at Work',
                titleZh: '工作电话',
                level: 'B1',
                dialogue: [
                    { speaker: 'Receptionist', text: 'Good afternoon, Brightline Consulting. How can I help you?' },
                    { speaker: 'David', text: 'Hello, this is David Park from Novatech. Could I speak to Ms. Rivera, please?' },
                    { speaker: 'Receptionist', text: 'I\'m afraid she\'s in a meeting at the moment. Would you like to leave a message?' },
                    { speaker: 'David', text: 'Yes, please. Could you ask her to call me back about tomorrow\'s contract review?' },
                    { speaker: 'Receptionist', text: 'Certainly. Does she have your number?' },
                    { speaker: 'David', text: 'She does, but just in case — it\'s 555-0192.' },
                    { speaker: 'Receptionist', text: 'Got it. I\'ll make sure she gets the message as soon as she\'s free.' },
                    { speaker: 'David', text: 'I appreciate it. Have a good day!' }
                ],
                usefulPhrases: [
                    { phrase: 'Could I speak to..., please?', meaning: '请问……在吗？/ 我可以和……通话吗？' },
                    { phrase: 'I\'m afraid she\'s in a meeting.', meaning: '恐怕她正在开会。' },
                    { phrase: 'Would you like to leave a message?', meaning: '您要留言吗？' },
                    { phrase: 'Could you ask her to call me back?', meaning: '能请她给我回电话吗？' }
                ],
                questions: [
                    {
                        question: 'Why can\'t Ms. Rivera take the call?',
                        options: [
                            'She is on vacation.',
                            'She is in a meeting.',
                            'She left the office early.',
                            'She is on another call.'
                        ],
                        correctAnswer: 1,
                        explanation: 'The receptionist says: "I\'m afraid she\'s in a meeting at the moment."'
                    },
                    {
                        question: 'What does David want Ms. Rivera to do?',
                        options: [
                            'Email him the contract',
                            'Meet him for lunch',
                            'Call him back about the contract review',
                            'Cancel tomorrow\'s meeting'
                        ],
                        correctAnswer: 2,
                        explanation: 'David says: "Could you ask her to call me back about tomorrow\'s contract review?"'
                    },
                    {
                        question: 'What does "I\'m afraid..." mean in this conversation?',
                        options: [
                            'The receptionist is scared.',
                            'It is a polite way to give bad news.',
                            'The receptionist is not sure.',
                            'It means "maybe."'
                        ],
                        correctAnswer: 1,
                        explanation: '"I\'m afraid..." is a polite English expression used to deliver disappointing news, not an expression of fear.'
                    }
                ]
            },
            {
                id: 'airport',
                icon: '✈️',
                title: 'At the Airport',
                titleZh: '在机场',
                level: 'B1',
                dialogue: [
                    { speaker: 'Agent', text: 'Good morning. May I see your passport and ticket, please?' },
                    { speaker: 'Sara', text: 'Here you are. I\'m on the 11:40 flight to Singapore.' },
                    { speaker: 'Agent', text: 'Thank you. Are you checking any bags today?' },
                    { speaker: 'Sara', text: 'Just this one suitcase. And I\'d like a window seat if possible.' },
                    { speaker: 'Agent', text: 'Let me check... yes, I can give you 23A, a window seat near the wing.' },
                    { speaker: 'Sara', text: 'That works. Which gate does the flight leave from?' },
                    { speaker: 'Agent', text: 'Gate B7. Boarding starts at 11:00, and the gate closes 20 minutes before departure.' },
                    { speaker: 'Sara', text: 'Understood. Thank you for your help!' }
                ],
                usefulPhrases: [
                    { phrase: 'Are you checking any bags?', meaning: '您有要托运的行李吗？' },
                    { phrase: 'I\'d like a window / aisle seat.', meaning: '我想要靠窗/靠过道的座位。' },
                    { phrase: 'Which gate does the flight leave from?', meaning: '航班从哪个登机口出发？' },
                    { phrase: 'Boarding starts at 11:00.', meaning: '11点开始登机。' }
                ],
                questions: [
                    {
                        question: 'What kind of seat does Sara ask for?',
                        options: [
                            'An aisle seat',
                            'A window seat',
                            'A seat near the exit',
                            'A seat in business class'
                        ],
                        correctAnswer: 1,
                        explanation: 'Sara says: "I\'d like a window seat if possible."'
                    },
                    {
                        question: 'When does boarding start?',
                        options: [
                            'At 11:00',
                            'At 11:20',
                            'At 11:40',
                            'At 10:40'
                        ],
                        correctAnswer: 0,
                        explanation: 'The agent says: "Boarding starts at 11:00."'
                    },
                    {
                        question: 'What happens 20 minutes before departure?',
                        options: [
                            'The plane takes off.',
                            'Check-in opens.',
                            'The gate closes.',
                            'Bags are loaded.'
                        ],
                        correctAnswer: 2,
                        explanation: 'The agent says: "the gate closes 20 minutes before departure."'
                    }
                ]
            },
            {
                id: 'smalltalk',
                icon: '☕',
                title: 'Small Talk with a Colleague',
                titleZh: '与同事闲聊',
                level: 'B1',
                dialogue: [
                    { speaker: 'Emma', text: 'Morning, Jake! How was your weekend?' },
                    { speaker: 'Jake', text: 'Pretty good, thanks. I finally tried that new hiking trail by the lake.' },
                    { speaker: 'Emma', text: 'Oh nice! I\'ve been meaning to go. Was it crowded?' },
                    { speaker: 'Jake', text: 'Not too bad in the morning, but it got busy after lunch. How about you?' },
                    { speaker: 'Emma', text: 'Mostly relaxed at home. I did watch that new documentary everyone\'s talking about.' },
                    { speaker: 'Jake', text: 'The one about deep-sea creatures? I heard it\'s amazing.' },
                    { speaker: 'Emma', text: 'It really is. You should check it out. Anyway, ready for the 10 o\'clock meeting?' },
                    { speaker: 'Jake', text: 'Almost — just grabbing a coffee first. See you in there!' }
                ],
                usefulPhrases: [
                    { phrase: 'How was your weekend?', meaning: '你周末过得怎么样？' },
                    { phrase: 'I\'ve been meaning to go.', meaning: '我一直想去（还没去成）。' },
                    { phrase: 'How about you?', meaning: '你呢？' },
                    { phrase: 'You should check it out.', meaning: '你应该去看看/试试。' }
                ],
                questions: [
                    {
                        question: 'What did Jake do on the weekend?',
                        options: [
                            'He watched a documentary.',
                            'He went hiking by the lake.',
                            'He worked overtime.',
                            'He went swimming in the lake.'
                        ],
                        correctAnswer: 1,
                        explanation: 'Jake says: "I finally tried that new hiking trail by the lake."'
                    },
                    {
                        question: 'What does "I\'ve been meaning to go" tell us about Emma?',
                        options: [
                            'She has already been there.',
                            'She never wants to go.',
                            'She has wanted to go for a while but hasn\'t yet.',
                            'She is going there today.'
                        ],
                        correctAnswer: 2,
                        explanation: '"I\'ve been meaning to..." expresses an intention you have had for some time but have not acted on yet.'
                    },
                    {
                        question: 'What will Jake do before the meeting?',
                        options: [
                            'Get a coffee',
                            'Call a client',
                            'Watch a documentary',
                            'Go for a walk'
                        ],
                        correctAnswer: 0,
                        explanation: 'Jake says: "just grabbing a coffee first."'
                    }
                ]
            }
        ];
    }

    // ---------------------------------------------------------------
    // Progress persistence
    // ---------------------------------------------------------------

    loadProgress() {
        try {
            return JSON.parse(localStorage.getItem('dailyConversationProgress')) || {};
        } catch (e) {
            return {};
        }
    }

    saveProgress() {
        try {
            localStorage.setItem('dailyConversationProgress', JSON.stringify(this.progress));
        } catch (e) {
            console.warn('💬 Could not save conversation progress', e);
        }
    }

    recordScenarioResult(scenarioId, correct, total) {
        const entry = this.progress[scenarioId] || { attempts: 0, bestScore: 0, completed: false };
        entry.attempts++;
        entry.bestScore = Math.max(entry.bestScore, correct);
        entry.completed = true;
        entry.lastScore = correct;
        entry.totalQuestions = total;
        this.progress[scenarioId] = entry;
        this.saveProgress();
    }

    // ---------------------------------------------------------------
    // Translation helper (falls back to English if t() is missing)
    // ---------------------------------------------------------------

    t(key, params) {
        return window.t ? window.t(key, params) : key;
    }

    scenarioTitle(scenario) {
        const zh = window.languageManager && window.languageManager.isChinese();
        return zh && scenario.titleZh ? `${scenario.title} · ${scenario.titleZh}` : scenario.title;
    }

    // ---------------------------------------------------------------
    // Entry point + view plumbing
    // ---------------------------------------------------------------

    show() {
        this.view = 'menu';
        this.currentScenario = null;

        // Hide the main menu and other module content, show our container
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) mainMenu.classList.add('hidden');
        const gameScreens = document.getElementById('gameScreens');
        if (gameScreens) gameScreens.classList.add('hidden');
        const container = document.getElementById('toeicModuleContent');
        if (container) container.classList.remove('hidden');

        this.render();
    }

    goHome() {
        const container = document.getElementById('toeicModuleContent');
        if (container) {
            container.innerHTML = '';
            container.classList.add('hidden');
        }
        if (window.app && typeof window.app.showWelcomeScreen === 'function') {
            window.app.showWelcomeScreen();
        } else {
            const mainMenu = document.getElementById('mainMenu');
            if (mainMenu) mainMenu.classList.remove('hidden');
        }
    }

    render() {
        const container = document.getElementById('toeicModuleContent');
        if (!container) return;

        let body = '';
        if (this.view === 'menu') body = this.renderMenu();
        else if (this.view === 'dialogue') body = this.renderDialogue();
        else if (this.view === 'questions') body = this.renderQuestion();
        else if (this.view === 'complete') body = this.renderComplete();

        container.innerHTML = `
            <div id="dailyConversationRoot" class="max-w-4xl mx-auto px-4">
                <div class="flex items-center justify-between mb-8">
                    <button onclick="window.dailyConversation.goHome()"
                            class="glass-effect px-4 py-2 rounded-full text-white hover:bg-white/20 transition-colors">
                        ← <span data-i18n="quiz.backToMenu">${this.t('quiz.backToMenu')}</span>
                    </button>
                </div>
                ${body}
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    }

    // ---------------------------------------------------------------
    // Views
    // ---------------------------------------------------------------

    renderMenu() {
        const cards = this.scenarios.map(s => {
            const p = this.progress[s.id];
            const doneBadge = p && p.completed
                ? `<span class="bg-green-500/30 text-green-300 px-2 py-1 rounded-full text-xs">✓ ${p.bestScore}/${s.questions.length}</span>`
                : '';
            return `
                <div class="game-card glass-effect rounded-2xl p-6 card-hover cursor-pointer"
                     onclick="window.dailyConversation.startScenario('${s.id}')"
                     role="button" tabindex="0">
                    <div class="text-center">
                        <div class="text-5xl mb-4">${s.icon}</div>
                        <h3 class="text-lg font-semibold text-white mb-2">${this.scenarioTitle(s)}</h3>
                        <div class="flex flex-wrap gap-2 justify-center">
                            <span class="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">${s.level}</span>
                            <span class="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">${s.dialogue.length} ${this.t('conversation.dialogue')}</span>
                            ${doneBadge}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="text-center mb-10">
                <div class="text-6xl mb-4">💬</div>
                <h1 class="heading-2 mb-3" data-i18n="conversation.title">${this.t('conversation.title')}</h1>
                <p class="text-white/80" data-i18n="conversation.subtitle">${this.t('conversation.subtitle')}</p>
            </div>
            <h2 class="heading-5 text-center mb-6" data-i18n="conversation.chooseScenario">${this.t('conversation.chooseScenario')}</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">${cards}</div>
        `;
    }

    renderDialogue() {
        const s = this.currentScenario;
        const lines = s.dialogue.map((line, i) => {
            const left = i % 2 === 0;
            return `
                <div class="flex ${left ? 'justify-start' : 'justify-end'} mb-3">
                    <div class="max-w-[80%] ${left ? 'bg-white/10' : 'bg-purple-500/30'} rounded-2xl px-4 py-3">
                        <div class="text-xs text-white/60 mb-1">${line.speaker}</div>
                        <div class="text-white">${line.text}</div>
                    </div>
                </div>
            `;
        }).join('');

        const phrases = s.usefulPhrases.map(p => `
            <li class="flex items-start gap-2 mb-2">
                <span class="text-yellow-300 mt-0.5">★</span>
                <div>
                    <span class="text-white">${p.phrase}</span>
                    <span class="text-white/60 ml-2">${p.meaning}</span>
                </div>
            </li>
        `).join('');

        return `
            <div class="text-center mb-8">
                <div class="text-5xl mb-3">${s.icon}</div>
                <h1 class="heading-3 mb-2">${this.scenarioTitle(s)}</h1>
                <p class="text-white/70" data-i18n="conversation.listenAndRead">${this.t('conversation.listenAndRead')}</p>
            </div>

            <div class="glass-effect rounded-2xl p-6 mb-6">
                <h2 class="heading-6 mb-4" data-i18n="conversation.dialogue">${this.t('conversation.dialogue')}</h2>
                ${lines}
            </div>

            <div class="glass-effect rounded-2xl p-6 mb-8">
                <h2 class="heading-6 mb-4" data-i18n="conversation.usefulPhrases">${this.t('conversation.usefulPhrases')}</h2>
                <ul>${phrases}</ul>
            </div>

            <div class="text-center mb-12">
                <button onclick="window.dailyConversation.startQuestions()"
                        class="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
                    <span data-i18n="quiz.startPractice">${this.t('quiz.startPractice')}</span> →
                </button>
            </div>
        `;
    }

    renderQuestion() {
        const s = this.currentScenario;
        const q = s.questions[this.currentQuestionIndex];
        const total = s.questions.length;

        const options = q.options.map((opt, i) => `
            <button class="dc-option w-full text-left glass-effect rounded-xl px-5 py-4 mb-3 text-white hover:bg-white/20 transition-colors"
                    data-index="${i}"
                    onclick="window.dailyConversation.answerQuestion(${i})">
                <span class="inline-block w-7 h-7 rounded-full bg-white/15 text-center leading-7 mr-3">${String.fromCharCode(65 + i)}</span>
                ${opt}
            </button>
        `).join('');

        return `
            <div class="text-center mb-6">
                <div class="text-4xl mb-2">${s.icon}</div>
                <h1 class="heading-4 mb-2">${this.scenarioTitle(s)}</h1>
                <p class="text-white/70">${this.t('quiz.questionOf', { current: this.currentQuestionIndex + 1, total })}</p>
            </div>

            <div class="glass-effect rounded-2xl p-6 mb-6">
                <h2 class="text-xl text-white mb-6">${q.question}</h2>
                <div id="dcOptions">${options}</div>
                <div id="dcFeedback" class="hidden mt-4"></div>
            </div>
        `;
    }

    renderComplete() {
        const s = this.currentScenario;
        const total = s.questions.length;
        const pct = Math.round((this.sessionCorrect / total) * 100);
        const nextScenario = this.getNextScenarioId();

        return `
            <div class="text-center py-12">
                <div class="text-6xl mb-6">${pct >= 70 ? '🎉' : '💪'}</div>
                <h1 class="heading-2 mb-4" data-i18n="conversation.scenarioComplete">${this.t('conversation.scenarioComplete')}</h1>
                <p class="text-2xl text-white mb-2">${this.sessionCorrect} / ${total} (${pct}%)</p>
                <p class="text-white/70 mb-10">${this.scenarioTitle(s)}</p>
                <div class="flex flex-wrap gap-4 justify-center">
                    <button onclick="window.dailyConversation.startScenario('${s.id}')"
                            class="glass-effect px-6 py-3 rounded-full text-white hover:bg-white/20 transition-colors">
                        ↺ <span data-i18n="quiz.playAgain">${this.t('quiz.playAgain')}</span>
                    </button>
                    ${nextScenario ? `
                    <button onclick="window.dailyConversation.startScenario('${nextScenario}')"
                            class="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                        <span data-i18n="conversation.nextScenario">${this.t('conversation.nextScenario')}</span> →
                    </button>` : ''}
                    <button onclick="window.dailyConversation.show()"
                            class="glass-effect px-6 py-3 rounded-full text-white hover:bg-white/20 transition-colors">
                        <span data-i18n="quiz.backToMenu">${this.t('quiz.backToMenu')}</span>
                    </button>
                </div>
            </div>
        `;
    }

    // ---------------------------------------------------------------
    // Interaction
    // ---------------------------------------------------------------

    startScenario(id) {
        const scenario = this.scenarios.find(s => s.id === id);
        if (!scenario) return;
        this.currentScenario = scenario;
        this.currentQuestionIndex = 0;
        this.sessionCorrect = 0;
        this.answered = false;
        this.view = 'dialogue';
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    startQuestions() {
        this.view = 'questions';
        this.answered = false;
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    answerQuestion(index) {
        if (this.answered) return;
        this.answered = true;

        const q = this.currentScenario.questions[this.currentQuestionIndex];
        const isCorrect = index === q.correctAnswer;
        if (isCorrect) this.sessionCorrect++;

        // Color the options: green for correct, red for a wrong pick
        document.querySelectorAll('.dc-option').forEach(btn => {
            const i = parseInt(btn.dataset.index, 10);
            btn.disabled = true;
            btn.classList.remove('hover:bg-white/20');
            if (i === q.correctAnswer) {
                btn.classList.add('bg-green-500/30');
            } else if (i === index) {
                btn.classList.add('bg-red-500/30');
            }
        });

        const isLast = this.currentQuestionIndex >= this.currentScenario.questions.length - 1;
        const feedback = document.getElementById('dcFeedback');
        if (feedback) {
            feedback.classList.remove('hidden');
            feedback.innerHTML = `
                <div class="rounded-xl p-4 ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}">
                    <p class="font-semibold text-white mb-1">
                        ${isCorrect ? '✓ ' + this.t('quiz.correct') : '✗ ' + this.t('quiz.incorrect')}
                    </p>
                    <p class="text-white/80 text-sm">${q.explanation}</p>
                </div>
                <div class="text-center mt-4">
                    <button onclick="window.dailyConversation.nextQuestion()"
                            class="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
                        ${isLast ? this.t('quiz.finish') : this.t('quiz.nextQuestion')} →
                    </button>
                </div>
            `;
        }

        // Play the shared right/wrong sound if the audio system is loaded
        if (window.audioSystem && typeof window.audioSystem.playSound === 'function') {
            try { window.audioSystem.playSound(isCorrect ? 'correct' : 'incorrect'); } catch (e) { /* non-fatal */ }
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentScenario.questions.length - 1) {
            this.currentQuestionIndex++;
            this.answered = false;
            this.view = 'questions';
        } else {
            this.recordScenarioResult(
                this.currentScenario.id,
                this.sessionCorrect,
                this.currentScenario.questions.length
            );
            this.view = 'complete';
        }
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    getNextScenarioId() {
        const idx = this.scenarios.findIndex(s => s.id === this.currentScenario.id);
        const next = this.scenarios[idx + 1];
        return next ? next.id : null;
    }
}

// Initialize and expose globally
window.DailyConversationSystem = DailyConversationSystem;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.dailyConversation = new DailyConversationSystem();
    });
} else {
    window.dailyConversation = new DailyConversationSystem();
}

// Global entry point used by the module card in index.html
window.startDailyConversation = () => {
    if (window.dailyConversation) {
        window.dailyConversation.show();
    }
};

console.log('💬 Daily Conversation system loaded');
