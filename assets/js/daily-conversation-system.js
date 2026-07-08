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
        this.view = 'menu'; // 'menu' | 'dialogue' | 'questions' | 'complete' | 'practice' | 'practiceComplete'
        this.progress = this.loadProgress();
        // "Your Turn" interactive practice state
        this.practiceState = null;
        this.practiceTimer = null;

        // Re-render the current view when the language switches so all
        // chrome picks up the new translations. Re-rendering rebuilds the
        // question options unanswered, so the answered flag must be reset
        // too or the question would be stuck with no Next button.
        window.addEventListener('languageChanged', () => {
            if (document.getElementById('dailyConversationRoot')) {
                this.answered = false;
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
                // In "Your Turn" practice the student plays this speaker and
                // must pick each of their lines from context-based options
                practiceRole: 'Anna',
                dialogue: [
                    { speaker: 'Waiter', text: 'Good evening! Do you have a reservation?' },
                    { speaker: 'Anna', text: 'Yes, a table for two under the name Anna Chen.', distractors: [
                        { text: 'The salmon looks delicious tonight.', why: 'The waiter asked about a reservation — ordering food now skips his question. Answer what was asked first.' },
                        { text: 'No thanks, I\'m just looking.', why: 'That\'s a reply for a shop assistant. In a restaurant, the waiter needs to know if you booked a table.' }
                    ] },
                    { speaker: 'Waiter', text: 'Perfect. Right this way, please. Here are your menus.' },
                    { speaker: 'Anna', text: 'Thank you. Could we get a few more minutes to decide?', distractors: [
                        { text: 'We\'ll have the bill, please.', why: 'You just received the menus — nothing has been ordered yet, so it\'s far too early to ask for the bill.' },
                        { text: 'Where is the train station?', why: 'This ignores the situation completely. The waiter just handed you menus, so respond about ordering.' }
                    ] },
                    { speaker: 'Waiter', text: 'Of course. Can I bring you something to drink while you look?' },
                    { speaker: 'Anna', text: 'Two glasses of water, please. And what do you recommend today?', distractors: [
                        { text: 'Yes, we have a reservation.', why: 'The reservation was already checked at the door. He is asking about DRINKS now — listen for the topic of the question.' },
                        { text: 'No, we\'re ready to leave.', why: 'You just sat down and asked for time to decide — leaving now contradicts what you said a moment ago.' }
                    ] },
                    { speaker: 'Waiter', text: 'The grilled salmon is very popular, and today\'s soup is mushroom.' },
                    { speaker: 'Anna', text: 'Great, we\'ll take one salmon and one soup to start.', distractors: [
                        { text: 'What do you recommend today?', why: 'You already asked this — and he just answered it. Respond to his recommendation instead of repeating yourself.' },
                        { text: 'Do you accept credit cards?', why: 'A payment question fits the END of the meal. Right now the natural step is to order the food he recommended.' }
                    ] }
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
                practiceRole: 'Tom',
                dialogue: [
                    { speaker: 'Tom', text: 'Excuse me, could you tell me how to get to the central train station?', distractors: [
                        { text: 'Hey you. Train station. Where?', why: 'Barking short commands at a stranger sounds rude. Start with a polite opener like "Excuse me, could you tell me..." when you need help.' },
                        { text: 'Hello! Lovely weather today, isn\'t it?', why: 'Small talk about the weather doesn\'t tell the stranger what you need. State your actual question politely so they can help you.' }
                    ] },
                    { speaker: 'Local', text: 'Sure! Go straight down this street for two blocks, then turn left at the bank.' },
                    { speaker: 'Tom', text: 'Left at the bank, got it. Is it far from there?', distractors: [
                        { text: 'Right at the supermarket, got it.', why: 'She said turn LEFT at the BANK. Repeating directions back is a great habit — but only if you repeat what was actually said.' },
                        { text: 'Thanks, I\'ll just take a taxi instead.', why: 'She is in the middle of giving you walking directions — nobody mentioned a taxi. Confirm the route or ask a follow-up about it.' }
                    ] },
                    { speaker: 'Local', text: 'Not at all — about a five-minute walk. You\'ll see it right across from the big shopping mall.' },
                    { speaker: 'Tom', text: 'That\'s very helpful. Is there a bus that goes there too?', distractors: [
                        { text: 'Is it far from there?', why: 'You just asked that, and she answered: about a five-minute walk. Asking again shows you weren\'t listening to her reply.' },
                        { text: 'One ticket to the city center, please.', why: 'This helpful stranger is a passer-by, not a ticket seller. You buy tickets at the station — right now you\'re still finding your way there.' }
                    ] },
                    { speaker: 'Local', text: 'Yes, the number 12 bus stops right in front of it, but honestly, walking is faster at this hour.' },
                    { speaker: 'Tom', text: 'I\'ll walk then. Thanks so much for your help!', distractors: [
                        { text: 'I\'ll take the bus then. Thanks!', why: '"Then" means you\'re following her advice — but she just said walking is FASTER at this hour. The logical response to her tip is to walk.' },
                        { text: 'Excuse me, how do I get to the train station?', why: 'This restarts the conversation from the beginning — she has already explained the whole route. Time to thank her and set off.' }
                    ] },
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
                practiceRole: 'Mia',
                dialogue: [
                    { speaker: 'Clerk', text: 'Hi there! Can I help you find anything?' },
                    { speaker: 'Mia', text: 'Yes, I\'m looking for a jacket for the winter. Something warm but not too heavy.', distractors: [
                        { text: 'I\'ll take it. Can I pay by card?', why: 'You just walked in and haven\'t chosen anything yet. Tell the clerk what you\'re looking for — paying comes at the very end.' },
                        { text: 'The fitting rooms are just behind you.', why: 'That\'s the CLERK\'s line — she works here, not you. As the customer, answer her offer by saying what you want to find.' }
                    ] },
                    { speaker: 'Clerk', text: 'We have these new ones over here. What size do you wear?' },
                    { speaker: 'Mia', text: 'Medium, usually. Oh, I like this blue one. Can I try it on?', distractors: [
                        { text: 'I usually pay in cash.', why: 'The clerk asked about your SIZE, not how you pay. Payment questions belong at the register, after you\'ve chosen a jacket.' },
                        { text: 'Black is my favorite color.', why: 'She asked for your size — this answers a question about color that hasn\'t been asked yet. Reply to the question she actually asked.' }
                    ] },
                    { speaker: 'Clerk', text: 'Of course, the fitting rooms are just behind you.' },
                    { speaker: 'Mia', text: 'It fits well, but do you have it in black?', distractors: [
                        { text: 'Where are the fitting rooms?', why: 'She just told you — right behind you — and you\'ve already used them to try the jacket on. Now report how it fits.' },
                        { text: 'I\'ll come back tomorrow to try it on.', why: 'You already tried it on — that\'s the whole point of going to the fitting room. This contradicts what just happened.' }
                    ] },
                    { speaker: 'Clerk', text: 'Let me check... yes, one black medium left. It\'s also on sale — 20% off this week.' },
                    { speaker: 'Mia', text: 'Perfect, I\'ll take it. Can I pay by card?', distractors: [
                        { text: 'That\'s too bad. When will you get more in stock?', why: 'She gave you GOOD news — the black medium is available and 20% off. "That\'s too bad" is a response to bad news.' },
                        { text: 'Do you have it in black?', why: 'You just asked that, and she found the last black medium for you. Respond to her answer instead of repeating the question.' }
                    ] }
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
                practiceRole: 'Ken',
                dialogue: [
                    { speaker: 'Doctor', text: 'Good morning. What seems to be the problem?' },
                    { speaker: 'Ken', text: 'I\'ve had a sore throat and a slight fever since Monday.', distractors: [
                        { text: 'Nothing at all — I feel great today!', why: 'You came to the doctor because you\'re sick. Saying you feel great contradicts the whole reason for your visit.' },
                        { text: 'Could you write me a prescription, please?', why: 'The doctor hasn\'t examined you yet. Describe your symptoms first — he decides about medicine after checking you.' }
                    ] },
                    { speaker: 'Doctor', text: 'I see. Any cough or headache?' },
                    { speaker: 'Ken', text: 'A little cough, especially at night. No headache though.', distractors: [
                        { text: 'I\'ve had them since Monday.', why: 'That answers "since when?" — a question you already answered. He is now asking WHICH other symptoms you have: cough or headache.' },
                        { text: 'Yes, twice a day after meals.', why: 'That\'s how you would take medicine — but no medicine has been prescribed yet. He\'s still asking about your symptoms.' }
                    ] },
                    { speaker: 'Doctor', text: 'Let me have a look... Your throat is quite red. It looks like a mild infection.' },
                    { speaker: 'Ken', text: 'Is it serious? I have an important presentation on Friday.', distractors: [
                        { text: 'What seems to be the problem?', why: 'That\'s the DOCTOR\'s opening question, not the patient\'s — and he just told you the problem: a mild throat infection.' },
                        { text: 'Great, so I don\'t need any treatment then!', why: 'An infection still needs treating, and the doctor hasn\'t given his advice yet. Don\'t end the visit before hearing it.' }
                    ] },
                    { speaker: 'Doctor', text: 'You should be fine by then. Take this medicine twice a day and drink plenty of warm water.' },
                    { speaker: 'Ken', text: 'Twice a day, understood. Thank you, doctor.', distractors: [
                        { text: 'Three times a day, got it. Thanks!', why: 'Listen carefully to medical instructions: he said TWICE a day, not three times. Repeating them back only helps if you repeat them correctly.' },
                        { text: 'Is it serious? I have a presentation on Friday.', why: 'You just asked this, and he answered: you should be fine by then. Confirm his instructions instead of repeating your worry.' }
                    ] }
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
                practiceRole: 'Laura',
                dialogue: [
                    { speaker: 'Receptionist', text: 'Welcome to the Grand Plaza Hotel. How may I help you?' },
                    { speaker: 'Laura', text: 'Hi, I\'d like to check in. I have a booking under Laura Kim.', distractors: [
                        { text: 'Hi, I\'d like to check out, please.', why: 'You\'re just ARRIVING at the hotel — check-out happens at the end of your stay. The word you need on arrival is check IN.' },
                        { text: 'Do you have any rooms available tonight?', why: 'You already booked a room — asking about availability sounds like you have no reservation. Give your booking name instead.' }
                    ] },
                    { speaker: 'Receptionist', text: 'Let me see... yes, a double room for three nights, is that right?' },
                    { speaker: 'Laura', text: 'That\'s right. Is breakfast included in the rate?', distractors: [
                        { text: 'No, I never booked a room here.', why: 'You just said you have a booking under Laura Kim — and he found it. Denying it now contradicts your own words.' },
                        { text: 'That\'s right. Which gate does my flight leave from?', why: 'A hotel receptionist doesn\'t handle flight gates — that\'s an airport question. Ask about the room or hotel services instead.' }
                    ] },
                    { speaker: 'Receptionist', text: 'Yes, breakfast is served from 6:30 to 10:00 on the second floor.' },
                    { speaker: 'Laura', text: 'Great. And what time is check-out?', distractors: [
                        { text: 'No thank you, I already ate breakfast.', why: 'He wasn\'t offering you food right now — he was explaining the hotel\'s breakfast hours for your stay. No need to refuse anything.' },
                        { text: 'Great. Is breakfast included in the rate?', why: 'You just asked that, and he answered yes and told you when and where it\'s served. Move on to a new question.' }
                    ] },
                    { speaker: 'Receptionist', text: 'Check-out is at noon. Here\'s your key card — room 815 on the eighth floor.' },
                    { speaker: 'Laura', text: 'Thank you very much!', distractors: [
                        { text: 'What time is check-out?', why: 'He literally just told you — check-out is at noon. Asking again shows you missed his answer.' },
                        { text: 'No, my room is on the second floor.', why: 'The second floor is where BREAKFAST is served. He just said your room is 815 on the EIGHTH floor — don\'t mix the two up.' }
                    ] }
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
                practiceRole: 'David',
                dialogue: [
                    { speaker: 'Receptionist', text: 'Good afternoon, Brightline Consulting. How can I help you?' },
                    { speaker: 'David', text: 'Hello, this is David Park from Novatech. Could I speak to Ms. Rivera, please?', distractors: [
                        { text: 'Who is this? Why are you calling me?', why: 'YOU made this call — the receptionist simply answered the company phone. Introduce yourself and say who you want to speak to.' },
                        { text: 'Hi! Are you free for lunch today?', why: 'You\'ve reached a receptionist at another company, not a friend. On a business call, give your name, your company, and the reason for calling.' }
                    ] },
                    { speaker: 'Receptionist', text: 'I\'m afraid she\'s in a meeting at the moment. Would you like to leave a message?' },
                    { speaker: 'David', text: 'Yes, please. Could you ask her to call me back about tomorrow\'s contract review?', distractors: [
                        { text: 'Great, please put me through to her now.', why: 'She just said Ms. Rivera is IN A MEETING and can\'t take the call. Respond to her offer to take a message instead.' },
                        { text: 'Yes — this is David Park from Novatech.', why: 'You already introduced yourself at the start of the call. She\'s asking WHAT message you want to leave, so give the message.' }
                    ] },
                    { speaker: 'Receptionist', text: 'Certainly. Does she have your number?' },
                    { speaker: 'David', text: 'She does, but just in case — it\'s 555-0192.', distractors: [
                        { text: 'Yes, I\'d like to leave a message.', why: 'You already left the message. She\'s now asking whether Ms. Rivera has your NUMBER — answer that question.' },
                        { text: 'No, I don\'t have her number.', why: 'She asked whether Ms. Rivera has YOUR number, not whether you have hers. Listen for who needs whose number for the call-back.' }
                    ] },
                    { speaker: 'Receptionist', text: 'Got it. I\'ll make sure she gets the message as soon as she\'s free.' },
                    { speaker: 'David', text: 'I appreciate it. Have a good day!', distractors: [
                        { text: 'Could I speak to Ms. Rivera, please?', why: 'That\'s where the call started — she\'s in a meeting, which is why you left a message. The call is finished now, so close politely.' },
                        { text: 'No, that won\'t be necessary.', why: 'She isn\'t asking a question — she\'s confirming she\'ll deliver your message, which is exactly what you wanted. Thank her instead of refusing.' }
                    ] }
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
                practiceRole: 'Sara',
                dialogue: [
                    { speaker: 'Agent', text: 'Good morning. May I see your passport and ticket, please?' },
                    { speaker: 'Sara', text: 'Here you are. I\'m on the 11:40 flight to Singapore.', distractors: [
                        { text: 'Which gate does the flight leave from?', why: 'The agent asked for your passport and ticket — hand them over first. The gate number usually comes at the END of check-in.' },
                        { text: 'Just this one suitcase.', why: 'That answers a question about BAGS, which she hasn\'t asked yet. Right now she needs your documents.' }
                    ] },
                    { speaker: 'Agent', text: 'Thank you. Are you checking any bags today?' },
                    { speaker: 'Sara', text: 'Just this one suitcase. And I\'d like a window seat if possible.', distractors: [
                        { text: 'Yes, here are my passport and ticket.', why: 'You already handed those over — she thanked you for them. Now she\'s asking about your LUGGAGE, so answer about bags.' },
                        { text: 'Yes, the flight leaves at 11:40.', why: 'She asked whether you\'re checking bags — the departure time answers a different question, and you already mentioned it anyway.' }
                    ] },
                    { speaker: 'Agent', text: 'Let me check... yes, I can give you 23A, a window seat near the wing.' },
                    { speaker: 'Sara', text: 'That works. Which gate does the flight leave from?', distractors: [
                        { text: 'Actually, I\'d prefer a window seat.', why: '23A IS a window seat — exactly what you asked for, and she found it. Accept it instead of requesting what you already have.' },
                        { text: 'Are you checking any bags today?', why: 'That\'s the AGENT\'s question, and it was already settled — you\'re checking one suitcase. Confirm the seat and move on.' }
                    ] },
                    { speaker: 'Agent', text: 'Gate B7. Boarding starts at 11:00, and the gate closes 20 minutes before departure.' },
                    { speaker: 'Sara', text: 'Understood. Thank you for your help!', distractors: [
                        { text: 'So boarding starts at 11:40, right?', why: '11:40 is the DEPARTURE time. She said boarding starts at 11:00 — mixing these up could make you miss your flight.' },
                        { text: 'Could I have a window seat, please?', why: 'Your seat was settled a moment ago — you have 23A by the window. Check-in is finished, so thank the agent and head to the gate.' }
                    ] }
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
                practiceRole: 'Emma',
                dialogue: [
                    { speaker: 'Emma', text: 'Morning, Jake! How was your weekend?', distractors: [
                        { text: 'You look really tired today, Jake.', why: 'Commenting on how tired someone looks can easily sound rude. Open with a friendly greeting and an easy question instead.' },
                        { text: 'Morning, Jake! How much money do you make?', why: 'Salary is far too personal for office small talk. Stick to safe, light topics like weekends, hobbies, or the weather.' }
                    ] },
                    { speaker: 'Jake', text: 'Pretty good, thanks. I finally tried that new hiking trail by the lake.' },
                    { speaker: 'Emma', text: 'Oh nice! I\'ve been meaning to go. Was it crowded?', distractors: [
                        { text: 'Oh, I hate hiking. Anyway, see you later.', why: 'Shutting the topic down kills the conversation. Small talk works by showing interest in what he said and asking a follow-up.' },
                        { text: 'How was your weekend?', why: 'You already asked that — he\'s answering it right now with his hiking story. React to what he just told you.' }
                    ] },
                    { speaker: 'Jake', text: 'Not too bad in the morning, but it got busy after lunch. How about you?' },
                    { speaker: 'Emma', text: 'Mostly relaxed at home. I did watch that new documentary everyone\'s talking about.', distractors: [
                        { text: 'Was it crowded?', why: 'He just answered that — not too bad in the morning. And "How about you?" hands the turn to YOU, so share your own weekend.' },
                        { text: 'Yes, I\'d love some coffee, thanks.', why: '"How about you?" here means "how was YOUR weekend?" — it\'s not an offer of coffee. Answer with what you did.' }
                    ] },
                    { speaker: 'Jake', text: 'The one about deep-sea creatures? I heard it\'s amazing.' },
                    { speaker: 'Emma', text: 'It really is. You should check it out. Anyway, ready for the 10 o\'clock meeting?', distractors: [
                        { text: 'No, I haven\'t seen it yet.', why: 'You just said you WATCHED it this weekend — saying you haven\'t seen it contradicts your own story.' },
                        { text: 'No, the meeting was moved to 3 o\'clock.', why: 'Jake didn\'t ask about a meeting — he\'s asking if the documentary is the deep-sea one. Answer his question first.' }
                    ] },
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
        this.clearPracticeTimer();
        this.view = 'menu';
        this.currentScenario = null;

        // Remember for the dashboard's "Continue Learning" card
        try {
            localStorage.setItem('toeicLastModule', JSON.stringify({
                type: 'dailyConversation',
                timestamp: Date.now()
            }));
        } catch (e) { /* non-fatal */ }

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
        this.clearPracticeTimer();
        const container = document.getElementById('toeicModuleContent');
        if (container) {
            container.innerHTML = '';
            container.classList.add('hidden');
        }
        // #mainMenu is the PARENT of #welcomeScreen — it must be unhidden
        // explicitly, or showWelcomeScreen() unhides a child inside a
        // display:none parent and the page stays blank
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) mainMenu.classList.remove('hidden');
        if (window.app && typeof window.app.showWelcomeScreen === 'function') {
            window.app.showWelcomeScreen();
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
        else if (this.view === 'practice') body = this.renderPractice();
        else if (this.view === 'practiceComplete') body = this.renderPracticeComplete();

        container.innerHTML = `
            <div id="dailyConversationRoot" class="module-shell">
                <button onclick="window.dailyConversation.goHome()" class="module-back-btn">
                    ← <span data-i18n="quiz.backToMenu">${this.t('quiz.backToMenu')}</span>
                </button>
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
            const practiceBadge = p && p.practice && p.practice.attempts > 0
                ? `<span class="bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full text-xs">🎭 ${p.practice.best}/${p.practice.total}</span>`
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
                            ${practiceBadge}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="text-center mb-10">
                <span class="toeic-part-badge">LISTENING · PARTS 2–3</span>
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
                    <div class="max-w-chat ${left ? 'bg-white/10' : 'bg-purple-500/30'} rounded-2xl px-4 py-3">
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

            <div class="module-actions mb-12" style="max-width: 560px; margin-left: auto; margin-right: auto;">
                ${s.practiceRole ? `
                <button onclick="window.dailyConversation.startPractice()" class="module-action-btn primary">
                    <span class="module-action-icon">🎭</span>
                    <span class="module-action-text">
                        <span class="module-action-title" data-i18n="conversation.yourTurn">${this.t('conversation.yourTurn')}</span>
                        <span class="module-action-desc" data-i18n="conversation.yourTurnDesc">${this.t('conversation.yourTurnDesc')}</span>
                    </span>
                    <i data-lucide="chevron-right" class="w-5 h-5 module-action-chevron"></i>
                </button>` : ''}
                <button onclick="window.dailyConversation.startQuestions()" class="module-action-btn ${s.practiceRole ? '' : 'primary'}">
                    <span class="module-action-icon">✅</span>
                    <span class="module-action-text">
                        <span class="module-action-title" data-i18n="conversation.answerQuestions">${this.t('conversation.answerQuestions')}</span>
                        <span class="module-action-desc" data-i18n="conversation.answerQuestionsDesc">${this.t('conversation.answerQuestionsDesc')}</span>
                    </span>
                    <i data-lucide="chevron-right" class="w-5 h-5 module-action-chevron"></i>
                </button>
            </div>
        `;
    }

    // ---------------------------------------------------------------
    // "Your Turn" — interactive dialogue practice.
    // The student plays scenario.practiceRole. The other speaker's
    // lines appear one by one; at each of the student's turns they
    // choose the contextually right line from shuffled options. A
    // wrong pick explains WHY it doesn't fit the surrounding context.
    // ---------------------------------------------------------------

    startPractice() {
        const s = this.currentScenario;
        if (!s || !s.practiceRole) return;

        this.clearPracticeTimer();
        this.practiceState = {
            lineIndex: 0,
            chat: [],                 // {speaker, text, isStudent}
            awaitingChoice: false,
            options: [],              // shuffled {text, why|null(correct)}
            wrongPicks: new Set(),    // indexes tried this turn
            lastWhy: null,
            choiceTurns: 0,
            firstTryCorrect: 0,
            turnHadMistake: false
        };
        this.view = 'practice';
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.advancePractice();
    }

    clearPracticeTimer() {
        if (this.practiceTimer) {
            clearTimeout(this.practiceTimer);
            this.practiceTimer = null;
        }
    }

    advancePractice() {
        const s = this.currentScenario;
        const st = this.practiceState;
        if (!s || !st) return;

        if (st.lineIndex >= s.dialogue.length) {
            this.finishPractice();
            return;
        }

        const line = s.dialogue[st.lineIndex];
        const isStudentTurn = line.speaker === s.practiceRole &&
            Array.isArray(line.distractors) && line.distractors.length > 0;

        if (!isStudentTurn) {
            // Reveal the line (partner's, or a student line with no options)
            st.chat.push({
                speaker: line.speaker,
                text: line.text,
                isStudent: line.speaker === s.practiceRole
            });
            st.lineIndex++;
            this.render();
            this.scrollPracticeChat();
            // Small beat before the next line so the conversation breathes
            this.practiceTimer = setTimeout(() => this.advancePractice(), 800);
            return;
        }

        // Student's turn: build shuffled options once for this turn
        const options = [
            { text: line.text, why: null },
            ...line.distractors.map(d => ({ text: d.text, why: d.why }))
        ];
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        st.awaitingChoice = true;
        st.options = options;
        st.wrongPicks = new Set();
        st.lastWhy = null;
        st.turnHadMistake = false;
        st.choiceTurns++;
        this.render();
        this.scrollPracticeChat();
    }

    choosePracticeOption(index) {
        const st = this.practiceState;
        if (!st || !st.awaitingChoice || st.wrongPicks.has(index)) return;

        const option = st.options[index];
        if (option.why === null) {
            // Correct — the line joins the conversation
            if (!st.turnHadMistake) st.firstTryCorrect++;
            st.chat.push({
                speaker: this.currentScenario.practiceRole,
                text: option.text,
                isStudent: true
            });
            st.awaitingChoice = false;
            st.options = [];
            st.lastWhy = null;
            st.lineIndex++;
            if (window.audioSystem && typeof window.audioSystem.playSound === 'function') {
                try { window.audioSystem.playSound('correct'); } catch (e) { /* non-fatal */ }
            }
            this.render();
            this.scrollPracticeChat();
            this.practiceTimer = setTimeout(() => this.advancePractice(), 600);
        } else {
            // Wrong — teach the contextual reasoning, allow another try
            st.turnHadMistake = true;
            st.wrongPicks.add(index);
            st.lastWhy = option.why;
            if (window.audioSystem && typeof window.audioSystem.playSound === 'function') {
                try { window.audioSystem.playSound('incorrect'); } catch (e) { /* non-fatal */ }
            }
            this.render();
            this.scrollPracticeChat();
        }
    }

    finishPractice() {
        const st = this.practiceState;
        const s = this.currentScenario;
        if (!st || !s) return;

        // Persist best first-try score for this scenario's practice mode
        const entry = this.progress[s.id] || { attempts: 0, bestScore: 0, completed: false };
        const practice = entry.practice || { attempts: 0, best: 0, total: st.choiceTurns };
        practice.attempts++;
        practice.best = Math.max(practice.best, st.firstTryCorrect);
        practice.total = st.choiceTurns;
        entry.practice = practice;
        this.progress[s.id] = entry;
        this.saveProgress();

        this.view = 'practiceComplete';
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    scrollPracticeChat() {
        const box = document.getElementById('dcPracticeChat');
        if (box) box.scrollTop = box.scrollHeight;
    }

    renderPractice() {
        const s = this.currentScenario;
        const st = this.practiceState;
        if (!s || !st) return '';

        const bubbles = st.chat.map(line => `
            <div class="flex ${line.isStudent ? 'justify-end' : 'justify-start'} mb-3">
                <div class="max-w-chat ${line.isStudent ? 'bg-purple-500/30' : 'bg-white/10'} rounded-2xl px-4 py-3">
                    <div class="text-xs text-white/60 mb-1">${line.isStudent ? this.t('conversation.you') : line.speaker}</div>
                    <div class="text-white">${line.text}</div>
                </div>
            </div>
        `).join('');

        let choicesBlock = '';
        if (st.awaitingChoice) {
            const isOpener = st.chat.length === 0;
            const buttons = st.options.map((o, i) => {
                const wrong = st.wrongPicks.has(i);
                return `
                    <button class="dc-option w-full text-left quiz-option-btn ${wrong ? 'is-wrong' : ''}"
                            ${wrong ? 'disabled' : ''}
                            onclick="window.dailyConversation.choosePracticeOption(${i})">
                        <span class="quiz-option-letter">${String.fromCharCode(65 + i)}</span>
                        ${o.text}
                    </button>
                `;
            }).join('');

            choicesBlock = `
                <div class="quiz-card" style="margin-top: 16px;">
                    <p class="text-white/80 mb-4">
                        🎭 ${isOpener ? this.t('conversation.chooseOpener') : this.t('conversation.chooseReply')}
                    </p>
                    ${buttons}
                    ${st.lastWhy ? `
                    <div class="quiz-feedback incorrect" style="margin-top: 6px;">
                        <p class="text-white/90 text-sm"><strong>${this.t('conversation.contextTip')}:</strong> ${st.lastWhy}</p>
                    </div>` : ''}
                </div>
            `;
        }

        return `
            <div class="text-center mb-6">
                <div class="text-4xl mb-2">${s.icon}</div>
                <h1 class="heading-4 mb-1">${this.scenarioTitle(s)}</h1>
                <p class="text-white/60 text-sm">
                    <span data-i18n="conversation.youArePlaying">${this.t('conversation.youArePlaying')}</span>
                    <strong class="text-white">${s.practiceRole}</strong>
                    · ${st.firstTryCorrect}/${st.choiceTurns > 0 ? st.choiceTurns : '–'}
                </p>
            </div>

            <div class="quiz-card">
                <div id="dcPracticeChat" style="max-height: 46vh; overflow-y: auto;">
                    ${bubbles || `<p class="text-white/50 text-sm text-center">${this.t('conversation.conversationStarts')}</p>`}
                </div>
            </div>
            ${choicesBlock}
        `;
    }

    renderPracticeComplete() {
        const s = this.currentScenario;
        const st = this.practiceState;
        const total = st ? st.choiceTurns : 0;
        const score = st ? st.firstTryCorrect : 0;
        const pct = total > 0 ? Math.round((score / total) * 100) : 0;
        const nextScenario = this.getNextScenarioId();
        const quizDone = this.progress[s.id] && this.progress[s.id].completed;

        return `
            <div class="text-center py-12">
                <div class="text-6xl mb-6">${pct >= 70 ? '🎉' : '💪'}</div>
                <h1 class="heading-2 mb-4" data-i18n="conversation.practiceComplete">${this.t('conversation.practiceComplete')}</h1>
                <p class="text-2xl text-white mb-2">${score} / ${total} (${pct}%)</p>
                <p class="text-white/70 mb-10" data-i18n="conversation.firstTryNote">${this.t('conversation.firstTryNote')}</p>
                <div class="flex flex-wrap gap-4 justify-center">
                    <button onclick="window.dailyConversation.startPractice()"
                            class="glass-effect px-6 py-3 rounded-full text-white hover:bg-white/20 transition-colors">
                        ↺ <span data-i18n="quiz.playAgain">${this.t('quiz.playAgain')}</span>
                    </button>
                    ${!quizDone ? `
                    <button onclick="window.dailyConversation.startQuestions()"
                            class="glass-effect px-6 py-3 rounded-full text-white hover:bg-white/20 transition-colors">
                        ✅ <span data-i18n="conversation.answerQuestions">${this.t('conversation.answerQuestions')}</span>
                    </button>` : ''}
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
        this.clearPracticeTimer();
        this.currentScenario = scenario;
        this.currentQuestionIndex = 0;
        this.sessionCorrect = 0;
        this.answered = false;
        this.view = 'dialogue';
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    startQuestions() {
        this.clearPracticeTimer();
        this.view = 'questions';
        this.currentQuestionIndex = 0;
        this.sessionCorrect = 0;
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
