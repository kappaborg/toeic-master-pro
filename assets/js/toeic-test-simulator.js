// TOEIC Test Simulator - Complete TOEIC test simulation with scoring
// Simulates the actual TOEIC test format and timing

// ============================================================
// Question banks
// Every item has a FIXED correctAnswer index (0=A, 1=B, 2=C, 3=D)
// that genuinely matches its content, so grading is deterministic.
// Generators cycle through each bank with bank[i % bank.length].
// Listening items include a `transcript` field describing what
// "was heard" so the UI can display it in place of real audio.
// ============================================================

// Part 1: Photographs (bank of 10 - one per question)
const TOEIC_PHOTOGRAPH_BANK = [
    {
        transcript: 'Several people are seated around a conference table, reviewing documents together.',
        options: [
            'A) The people are having a meeting.',
            'B) The people are eating lunch.',
            'C) The people are waiting for a bus.',
            'D) The people are shopping for clothes.'
        ],
        correctAnswer: 0
    },
    {
        transcript: 'A woman is typing on a laptop computer at a desk by a window.',
        options: [
            'A) She is writing on a whiteboard.',
            'B) She is talking on the phone.',
            'C) She is using a computer.',
            'D) She is filing some folders.'
        ],
        correctAnswer: 2
    },
    {
        transcript: 'Two men are shaking hands in an office lobby.',
        options: [
            'A) The men are carrying boxes.',
            'B) The men are greeting each other.',
            'C) The men are repairing a door.',
            'D) The men are boarding an elevator.'
        ],
        correctAnswer: 1
    },
    {
        transcript: 'A worker wearing a helmet is climbing a ladder next to a building.',
        options: [
            'A) He is painting a wall.',
            'B) He is driving a truck.',
            'C) He is sweeping the sidewalk.',
            'D) He is climbing a ladder.'
        ],
        correctAnswer: 3
    },
    {
        transcript: 'Passengers are boarding a train at a station platform.',
        options: [
            'A) People are getting on a train.',
            'B) People are buying tickets.',
            'C) The platform is empty.',
            'D) A train is being repaired.'
        ],
        correctAnswer: 0
    },
    {
        transcript: 'A chef is arranging plates of food on a counter in a kitchen.',
        options: [
            'A) The man is washing dishes.',
            'B) The man is taking an order.',
            'C) The man is preparing food.',
            'D) The man is setting a table in a dining room.'
        ],
        correctAnswer: 2
    },
    {
        transcript: 'Cars are parked in rows in an outdoor parking lot.',
        options: [
            'A) Vehicles are stopped at a traffic light.',
            'B) Vehicles are parked in a lot.',
            'C) A car is being towed.',
            'D) People are crossing the street.'
        ],
        correctAnswer: 1
    },
    {
        transcript: 'A woman is watering plants on a balcony.',
        options: [
            'A) She is planting a tree.',
            'B) She is trimming a hedge.',
            'C) She is raking leaves.',
            'D) She is watering some plants.'
        ],
        correctAnswer: 3
    },
    {
        transcript: 'Workers are loading boxes onto the back of a delivery truck.',
        options: [
            'A) Boxes are being loaded onto a truck.',
            'B) The truck is being washed.',
            'C) The workers are taking a break.',
            'D) Packages are being unwrapped.'
        ],
        correctAnswer: 0
    },
    {
        transcript: 'A man is presenting a chart on a screen to a small audience.',
        options: [
            'A) The audience is leaving the room.',
            'B) The screen is being installed.',
            'C) A man is giving a presentation.',
            'D) The chairs are all unoccupied.'
        ],
        correctAnswer: 2
    }
];

// Part 2: Question-Response (bank of 15, cycled to fill 30 questions)
const TOEIC_QUESTION_RESPONSE_BANK = [
    {
        transcript: 'Where is the quarterly sales report?',
        options: ['A) Yes, I did.', 'B) It\'s on your desk.', 'C) Next Friday.', 'D) By airmail.'],
        correctAnswer: 1
    },
    {
        transcript: 'When does the staff meeting start?',
        options: ['A) In the main conference room.', 'B) With the whole team.', 'C) At ten o\'clock.', 'D) It went very well.'],
        correctAnswer: 2
    },
    {
        transcript: 'Who is leading the training session tomorrow?',
        options: ['A) Ms. Rivera is.', 'B) In Room 204.', 'C) About two hours.', 'D) Yes, it was helpful.'],
        correctAnswer: 0
    },
    {
        transcript: 'Would you like some coffee before we begin?',
        options: ['A) On the top shelf.', 'B) It starts at nine.', 'C) He drinks tea.', 'D) No, thank you.'],
        correctAnswer: 3
    },
    {
        transcript: 'How do I get to the accounting office?',
        options: ['A) Around three dollars.', 'B) Take the elevator to the fourth floor.', 'C) Every Monday morning.', 'D) She\'s an accountant.'],
        correctAnswer: 1
    },
    {
        transcript: 'Why was this morning\'s flight delayed?',
        options: ['A) Because of the storm.', 'B) At gate twelve.', 'C) A round-trip ticket.', 'D) About an hour ago.'],
        correctAnswer: 0
    },
    {
        transcript: 'Have you finished the budget proposal yet?',
        options: ['A) It costs too much.', 'B) He\'s the new manager.', 'C) Yes, I sent it this morning.', 'D) At the bank.'],
        correctAnswer: 2
    },
    {
        transcript: 'Whose umbrella is this by the door?',
        options: ['A) It might rain later.', 'B) I think it\'s Marco\'s.', 'C) The door is locked.', 'D) Near the entrance.'],
        correctAnswer: 1
    },
    {
        transcript: 'How much does the new printer cost?',
        options: ['A) About two hundred dollars.', 'B) In the supply room.', 'C) It prints in color.', 'D) Two hundred pages.'],
        correctAnswer: 0
    },
    {
        transcript: 'Could you review these figures before the meeting?',
        options: ['A) A famous painter.', 'B) The meeting room is booked.', 'C) On the second page.', 'D) Sure, I\'ll look at them now.'],
        correctAnswer: 3
    },
    {
        transcript: 'Should we take the highway or the local roads?',
        options: ['A) The highway will be faster.', 'B) A new car.', 'C) Yes, we should.', 'D) About forty miles.'],
        correctAnswer: 0
    },
    {
        transcript: 'When is the deadline for the grant application?',
        options: ['A) Ms. Ortiz applied.', 'B) The end of this month.', 'C) In the mailroom.', 'D) It was approved.'],
        correctAnswer: 1
    },
    {
        transcript: 'You\'ve met the new director, haven\'t you?',
        options: ['A) It\'s a new building.', 'B) The directions are clear.', 'C) Yes, at last week\'s orientation.', 'D) Turn left at the corner.'],
        correctAnswer: 2
    },
    {
        transcript: 'Why don\'t we order lunch for the interns?',
        options: ['A) That\'s a good idea.', 'B) They start next week.', 'C) At the restaurant downtown.', 'D) No, I haven\'t eaten.'],
        correctAnswer: 0
    },
    {
        transcript: 'Where can I find the employee handbook?',
        options: ['A) He was hired in June.', 'B) About fifty pages.', 'C) Sometime tomorrow.', 'D) There\'s a copy on the intranet.'],
        correctAnswer: 3
    }
];

// Part 3: Conversations (bank of 5 conversations x 3 questions, cycled to fill 10 conversations)
const TOEIC_CONVERSATION_BANK = [
    {
        transcript: 'Woman: Hi Mark, have you reserved a meeting room for Thursday\'s client presentation? Man: Not yet — the large room on the fifth floor is already booked. Should I try the smaller one on the third floor instead? Woman: Yes, please do. And could you ask the IT department to set up the projector in advance?',
        questions: [
            {
                question: 'What are the speakers mainly discussing?',
                options: [
                    'A) Rescheduling a client visit',
                    'B) Reserving a room for a presentation',
                    'C) Hiring a new IT technician',
                    'D) Repairing a projector'
                ],
                correctAnswer: 1
            },
            {
                question: 'What problem does the man mention?',
                options: [
                    'A) A room is already booked.',
                    'B) A client canceled a meeting.',
                    'C) The projector is broken.',
                    'D) He lost a reservation number.'
                ],
                correctAnswer: 0
            },
            {
                question: 'What does the woman ask the man to do?',
                options: [
                    'A) Print some handouts',
                    'B) Call the client',
                    'C) Move to the fifth floor',
                    'D) Contact the IT department'
                ],
                correctAnswer: 3
            }
        ]
    },
    {
        transcript: 'Man: I\'d like to return this laptop bag. The zipper broke after only a week. Woman: I\'m sorry about that. Do you have your receipt? We can offer you a refund or a replacement. Man: A replacement would be great — I really like the design.',
        questions: [
            {
                question: 'Where most likely are the speakers?',
                options: [
                    'A) At an airport',
                    'B) At a repair shop',
                    'C) At a store',
                    'D) At a bank'
                ],
                correctAnswer: 2
            },
            {
                question: 'What problem does the man mention?',
                options: [
                    'A) He was overcharged.',
                    'B) Part of his bag is broken.',
                    'C) He lost his receipt.',
                    'D) His order arrived late.'
                ],
                correctAnswer: 1
            },
            {
                question: 'What does the man decide to do?',
                options: [
                    'A) Exchange the item',
                    'B) Request a refund',
                    'C) Speak with a manager',
                    'D) Buy a different model'
                ],
                correctAnswer: 0
            }
        ]
    },
    {
        transcript: 'Woman: The quarterly budget review is next Monday, and I still haven\'t received the sales figures from your team. Man: Sorry about that — we\'ve been short-staffed all week. I\'ll e-mail them to you by tomorrow afternoon. Woman: That works, but please make sure they include the regional breakdown.',
        questions: [
            {
                question: 'What is the woman waiting for?',
                options: [
                    'A) A revised contract',
                    'B) Some sales figures',
                    'C) A staffing schedule',
                    'D) Travel receipts'
                ],
                correctAnswer: 1
            },
            {
                question: 'Why has the man\'s team been delayed?',
                options: [
                    'A) A computer system failed.',
                    'B) A deadline was moved up.',
                    'C) They have been short-staffed.',
                    'D) They were traveling.'
                ],
                correctAnswer: 2
            },
            {
                question: 'What does the woman ask the man to include?',
                options: [
                    'A) A regional breakdown',
                    'B) Next year\'s forecast',
                    'C) A list of clients',
                    'D) Updated invoices'
                ],
                correctAnswer: 0
            }
        ]
    },
    {
        transcript: 'Man: Excuse me, what time does the next train to the airport leave? Woman: At 4:45, from platform two — but it\'s running about ten minutes behind schedule today. Man: That\'s all right. My flight doesn\'t leave until eight o\'clock.',
        questions: [
            {
                question: 'Where does the conversation most likely take place?',
                options: [
                    'A) At a bus stop',
                    'B) On an airplane',
                    'C) At a hotel',
                    'D) At a train station'
                ],
                correctAnswer: 3
            },
            {
                question: 'What does the woman say about the train?',
                options: [
                    'A) It has been canceled.',
                    'B) It is running late.',
                    'C) It leaves from platform four.',
                    'D) It does not stop at the airport.'
                ],
                correctAnswer: 1
            },
            {
                question: 'What time does the man\'s flight depart?',
                options: [
                    'A) At 4:45',
                    'B) At 6:00',
                    'C) At 8:00',
                    'D) At 10:10'
                ],
                correctAnswer: 2
            }
        ]
    },
    {
        transcript: 'Woman: Have you heard? The company is moving our office to the new building downtown in March. Man: Yes, I saw the announcement this morning. I\'m glad — it\'ll be much closer to the subway. Woman: Me too, though parking near there is a lot more expensive.',
        questions: [
            {
                question: 'What are the speakers discussing?',
                options: [
                    'A) An office relocation',
                    'B) A new subway line',
                    'C) A parking garage renovation',
                    'D) A company merger'
                ],
                correctAnswer: 0
            },
            {
                question: 'Why is the man pleased?',
                options: [
                    'A) He will get a larger office.',
                    'B) His team is expanding.',
                    'C) The new location is near the subway.',
                    'D) Parking will be free.'
                ],
                correctAnswer: 2
            },
            {
                question: 'What concern does the woman mention?',
                options: [
                    'A) Longer working hours',
                    'B) Higher parking costs',
                    'C) A smaller kitchen',
                    'D) Noisy construction'
                ],
                correctAnswer: 1
            }
        ]
    }
];

// Part 4: Talks (bank of 5 talks x 3 questions, cycled to fill 10 talks)
const TOEIC_TALK_BANK = [
    {
        transcript: 'Attention, shoppers. For the next hour, all winter coats in our clothing department on the second floor are thirty percent off. And don\'t forget to sign up for our free rewards program at any register to receive coupons and members-only discounts.',
        questions: [
            {
                question: 'Where is the announcement most likely being made?',
                options: [
                    'A) At a department store',
                    'B) At a train station',
                    'C) At a fitness center',
                    'D) At a museum'
                ],
                correctAnswer: 0
            },
            {
                question: 'What is being discounted?',
                options: [
                    'A) Shoes',
                    'B) Winter coats',
                    'C) Kitchen appliances',
                    'D) Jewelry'
                ],
                correctAnswer: 1
            },
            {
                question: 'How can listeners join the rewards program?',
                options: [
                    'A) By visiting a Web site',
                    'B) By calling customer service',
                    'C) By mailing a form',
                    'D) By signing up at a register'
                ],
                correctAnswer: 3
            }
        ]
    },
    {
        transcript: 'Hello, this is Daniel calling from Riverside Dental Clinic to confirm your appointment on Wednesday, May ninth, at two thirty. If you need to reschedule, please call us at least twenty-four hours in advance. Also, please plan to arrive ten minutes early to update your patient information forms.',
        questions: [
            {
                question: 'Why is the speaker calling?',
                options: [
                    'A) To cancel an appointment',
                    'B) To confirm an appointment',
                    'C) To request a payment',
                    'D) To announce a new location'
                ],
                correctAnswer: 1
            },
            {
                question: 'What should the listener do to reschedule?',
                options: [
                    'A) Send an e-mail',
                    'B) Visit the clinic in person',
                    'C) Call at least twenty-four hours in advance',
                    'D) Fill out an online form'
                ],
                correctAnswer: 2
            },
            {
                question: 'Why should the listener arrive early?',
                options: [
                    'A) To update some forms',
                    'B) To pay a bill',
                    'C) To meet a new dentist',
                    'D) To find a parking space'
                ],
                correctAnswer: 0
            }
        ]
    },
    {
        transcript: 'Before we wrap up today\'s staff meeting, I\'d like to remind everyone that our new time-tracking software goes live on Monday. Training sessions will be held in Room 204 on Thursday and Friday. If you can\'t attend either session, a recorded tutorial will be posted on the company intranet.',
        questions: [
            {
                question: 'What is the speaker mainly discussing?',
                options: [
                    'A) A hiring plan',
                    'B) A schedule change',
                    'C) An office renovation',
                    'D) New software'
                ],
                correctAnswer: 3
            },
            {
                question: 'When will the software go live?',
                options: [
                    'A) On Monday',
                    'B) On Thursday',
                    'C) On Friday',
                    'D) At the end of the month'
                ],
                correctAnswer: 0
            },
            {
                question: 'What can employees who miss the training do?',
                options: [
                    'A) Attend a makeup class next month',
                    'B) Watch a recorded tutorial',
                    'C) Read a printed manual',
                    'D) Contact the software vendor'
                ],
                correctAnswer: 1
            }
        ]
    },
    {
        transcript: 'Good morning, everyone, and welcome aboard Flight 208 with service to Vancouver. We\'re currently third in line for takeoff and should be in the air in about fifteen minutes. Our flight time today is four hours and twenty minutes. Once we reach our cruising altitude, the cabin crew will begin the beverage service.',
        questions: [
            {
                question: 'Who most likely is the speaker?',
                options: [
                    'A) A travel agent',
                    'B) A pilot',
                    'C) A gate agent',
                    'D) A tour guide'
                ],
                correctAnswer: 1
            },
            {
                question: 'How long will the flight be?',
                options: [
                    'A) Fifteen minutes',
                    'B) Two hours',
                    'C) Four hours and twenty minutes',
                    'D) Eight hours'
                ],
                correctAnswer: 2
            },
            {
                question: 'What will happen after the plane reaches cruising altitude?',
                options: [
                    'A) A beverage service will begin.',
                    'B) A movie will start.',
                    'C) Duty-free items will be sold.',
                    'D) The captain will greet passengers.'
                ],
                correctAnswer: 0
            }
        ]
    },
    {
        transcript: 'In local business news, Grandview Hotels announced today that it will open its newest property on the city\'s waterfront next spring. The two-hundred-room hotel is expected to create more than one hundred fifty jobs. Anyone interested in applying can attend the hiring fair at the Community Center on October twelfth.',
        questions: [
            {
                question: 'What is the news report mainly about?',
                options: [
                    'A) A restaurant closing',
                    'B) A waterfront festival',
                    'C) A new hotel',
                    'D) A road construction project'
                ],
                correctAnswer: 2
            },
            {
                question: 'According to the report, how many jobs will be created?',
                options: [
                    'A) About fifty',
                    'B) More than one hundred fifty',
                    'C) Two hundred',
                    'D) Five hundred'
                ],
                correctAnswer: 1
            },
            {
                question: 'What will take place on October twelfth?',
                options: [
                    'A) A grand opening',
                    'B) A press conference',
                    'C) A city council vote',
                    'D) A hiring fair'
                ],
                correctAnswer: 3
            }
        ]
    }
];

// Part 5: Incomplete Sentences (bank of 20, cycled to fill 40 questions)
const TOEIC_INCOMPLETE_SENTENCE_BANK = [
    {
        sentence: 'The company\'s profits have increased significantly _____ the new marketing strategy.',
        options: ['A) because', 'B) because of', 'C) due', 'D) owing'],
        correctAnswer: 1
    },
    {
        sentence: 'All employees are required to _____ the safety training by the end of the month.',
        options: ['A) completes', 'B) complete', 'C) completing', 'D) completion'],
        correctAnswer: 1
    },
    {
        sentence: 'Ms. Alvarez will review the budget proposal _____ she returns from the conference.',
        options: ['A) during', 'B) among', 'C) when', 'D) despite'],
        correctAnswer: 2
    },
    {
        sentence: 'The new printer is considerably faster _____ the previous model.',
        options: ['A) as', 'B) than', 'C) from', 'D) to'],
        correctAnswer: 1
    },
    {
        sentence: 'Please submit your expense reports _____ Friday at 5:00 P.M.',
        options: ['A) by', 'B) until', 'C) at', 'D) in'],
        correctAnswer: 0
    },
    {
        sentence: 'Applicants must have at least three years of _____ experience in sales.',
        options: ['A) relevance', 'B) relevant', 'C) relevantly', 'D) relevancy'],
        correctAnswer: 1
    },
    {
        sentence: 'The board voted _____ to approve the merger with Hartfield Industries.',
        options: ['A) unanimous', 'B) unanimously', 'C) unanimity', 'D) unanimousness'],
        correctAnswer: 1
    },
    {
        sentence: '_____ the heavy rain, the outdoor event proceeded as scheduled.',
        options: ['A) Because', 'B) Despite', 'C) Although', 'D) However'],
        correctAnswer: 1
    },
    {
        sentence: 'Employees _____ parking permits should contact the facilities office.',
        options: ['A) who need', 'B) who needs', 'C) whose need', 'D) them needing'],
        correctAnswer: 0
    },
    {
        sentence: 'The management seminar has been postponed _____ next Tuesday.',
        options: ['A) until', 'B) by', 'C) in', 'D) on'],
        correctAnswer: 0
    },
    {
        sentence: 'Mr. Chen asked his assistant to make ten _____ of the annual report.',
        options: ['A) copy', 'B) copies', 'C) copying', 'D) copied'],
        correctAnswer: 1
    },
    {
        sentence: 'Our customer service team responds to inquiries as _____ as possible.',
        options: ['A) prompt', 'B) prompter', 'C) promptly', 'D) promptness'],
        correctAnswer: 2
    },
    {
        sentence: 'The contract must be signed by _____ parties before work can begin.',
        options: ['A) every', 'B) both', 'C) each', 'D) much'],
        correctAnswer: 1
    },
    {
        sentence: '_____ of the two proposals was accepted by the review committee.',
        options: ['A) Neither', 'B) None', 'C) Nothing', 'D) Nobody'],
        correctAnswer: 0
    },
    {
        sentence: 'The marketing director is responsible _____ overseeing all advertising campaigns.',
        options: ['A) of', 'B) for', 'C) to', 'D) with'],
        correctAnswer: 1
    },
    {
        sentence: 'Sales figures for the second quarter were significantly _____ than analysts had predicted.',
        options: ['A) high', 'B) higher', 'C) highest', 'D) highly'],
        correctAnswer: 1
    },
    {
        sentence: 'All visitors must wear identification badges _____ on company premises.',
        options: ['A) during', 'B) while', 'C) among', 'D) toward'],
        correctAnswer: 1
    },
    {
        sentence: 'The finance department will _____ a detailed audit of all accounts next month.',
        options: ['A) conduct', 'B) conducts', 'C) conducting', 'D) conduction'],
        correctAnswer: 0
    },
    {
        sentence: 'Ms. Patel\'s flight was delayed; _____, she missed the opening session of the conference.',
        options: ['A) moreover', 'B) therefore', 'C) otherwise', 'D) meanwhile'],
        correctAnswer: 1
    },
    {
        sentence: 'Interested candidates should send their résumés _____ to the human resources department.',
        options: ['A) direct', 'B) directly', 'C) direction', 'D) directed'],
        correctAnswer: 1
    }
];

// Part 6: Text Completion (4 passages x 3 questions = 12 questions)
const TOEIC_TEXT_COMPLETION_BANK = [
    {
        passage: 'Dear Team,\n\nI am writing to inform you about the upcoming changes to our company policies. Starting next month, we will be implementing a new remote work policy that will allow employees to work from home up to three days per week.\n\nThis change is being made in response to employee feedback and the success we have seen with remote work during the past year. We believe this policy will improve work-life balance and increase job satisfaction.\n\nPlease note that this policy applies to all full-time employees. If you have any questions about how this policy affects your specific role, please contact your supervisor or the human resources department.\n\nThank you for your continued dedication to our company.\n\nBest regards,\nHR Department',
        questions: [
            {
                question: 'What is the main topic of this memo?',
                options: [
                    'A) New remote work policy',
                    'B) Employee feedback system',
                    'C) Work-life balance programs',
                    'D) Human resources procedures'
                ],
                correctAnswer: 0
            },
            {
                question: 'How many days per week may employees work from home?',
                options: [
                    'A) One',
                    'B) Two',
                    'C) Three',
                    'D) Five'
                ],
                correctAnswer: 2
            },
            {
                question: 'Who should employees contact if they have questions?',
                options: [
                    'A) The company president',
                    'B) Their supervisor or the human resources department',
                    'C) The IT help desk',
                    'D) Their clients'
                ],
                correctAnswer: 1
            }
        ]
    },
    {
        passage: 'Dear Mr. Tanaka,\n\nThank you for your order of fifteen office chairs (Order #4521). Unfortunately, the model you selected is temporarily out of stock. We expect a new shipment to arrive at our warehouse on August 3, and your order will be shipped the following day.\n\nAs an apology for the inconvenience, we will upgrade your delivery to express shipping at no extra charge. If you would prefer to cancel your order or choose a different model, please reply to this e-mail or call our customer service line.\n\nSincerely,\nRebecca Moore\nCustomer Service, Delano Office Supply',
        questions: [
            {
                question: 'Why was the e-mail sent?',
                options: [
                    'A) To confirm a payment',
                    'B) To explain a delay in an order',
                    'C) To advertise a new product',
                    'D) To request a product catalog'
                ],
                correctAnswer: 1
            },
            {
                question: 'What will Delano Office Supply provide as an apology?',
                options: [
                    'A) A discount coupon',
                    'B) A partial refund',
                    'C) Free express shipping',
                    'D) An extra chair'
                ],
                correctAnswer: 2
            },
            {
                question: 'When will the order most likely be shipped?',
                options: [
                    'A) On August 1',
                    'B) On August 3',
                    'C) On August 4',
                    'D) On August 15'
                ],
                correctAnswer: 2
            }
        ]
    },
    {
        passage: 'Position Available: Marketing Coordinator\n\nBrightway Media is seeking a full-time marketing coordinator for its downtown Chicago office. Responsibilities include preparing press releases, updating the company\'s social media accounts, and coordinating promotional events.\n\nApplicants must have a bachelor\'s degree in marketing or a related field and at least two years of professional experience. Fluency in Spanish is preferred but not required.\n\nTo apply, submit a résumé and cover letter to careers@brightwaymedia.com by September 30. Interviews will be held during the second week of October.',
        questions: [
            {
                question: 'What position is being advertised?',
                options: [
                    'A) Sales representative',
                    'B) Event photographer',
                    'C) Social media intern',
                    'D) Marketing coordinator'
                ],
                correctAnswer: 3
            },
            {
                question: 'What is a requirement for the position?',
                options: [
                    'A) Fluency in Spanish',
                    'B) At least two years of professional experience',
                    'C) A master\'s degree',
                    'D) Residence in Chicago'
                ],
                correctAnswer: 1
            },
            {
                question: 'What is the deadline for applications?',
                options: [
                    'A) September 30',
                    'B) The first week of October',
                    'C) The second week of October',
                    'D) The end of October'
                ],
                correctAnswer: 0
            }
        ]
    },
    {
        passage: 'Notice to All Staff\n\nThe elevators in the north wing will be out of service from Monday, June 12, through Friday, June 16, while they undergo scheduled maintenance. During this period, please use the elevators in the south wing or the stairways.\n\nEmployees who need assistance moving heavy materials between floors should contact the building services desk at extension 2145 at least one day in advance.\n\nWe apologize for any inconvenience and thank you for your patience.\n\n— Building Management',
        questions: [
            {
                question: 'What is the purpose of this notice?',
                options: [
                    'A) To announce a building expansion',
                    'B) To announce elevator maintenance',
                    'C) To introduce new staff members',
                    'D) To describe a fire drill'
                ],
                correctAnswer: 1
            },
            {
                question: 'How long will the north wing elevators be out of service?',
                options: [
                    'A) One day',
                    'B) Three days',
                    'C) Five days',
                    'D) Two weeks'
                ],
                correctAnswer: 2
            },
            {
                question: 'What should employees do if they need to move heavy materials?',
                options: [
                    'A) Use the south wing stairways',
                    'B) Wait until June 17',
                    'C) Ask their supervisor for a key',
                    'D) Contact building services one day in advance'
                ],
                correctAnswer: 3
            }
        ]
    }
];

// Part 7: Reading Comprehension question sets, aligned by index with the
// passages returned by generateReadingPassage() (4 questions per passage)
const TOEIC_READING_COMPREHENSION_BANK = [
    // Passage 1: 'Global Economy Shows Signs of Recovery'
    [
        {
            question: 'What is the main topic of this passage?',
            options: [
                'A) A worldwide economic recovery',
                'B) A new banking regulation',
                'C) A merger between technology firms',
                'D) A decline in online sales'
            ],
            correctAnswer: 0
        },
        {
            question: 'According to the report, how much is global GDP expected to grow this year?',
            options: [
                'A) 2.5%',
                'B) 3.2%',
                'C) 25%',
                'D) 45%'
            ],
            correctAnswer: 1
        },
        {
            question: 'Which sector is mentioned as recovering particularly strongly?',
            options: [
                'A) Agriculture',
                'B) Tourism',
                'C) Technology',
                'D) Construction'
            ],
            correctAnswer: 2
        },
        {
            question: 'According to the passage, what challenge do emerging markets face?',
            options: [
                'A) Rising labor costs',
                'B) Supply chain disruptions',
                'C) Falling exchange rates',
                'D) Higher corporate taxes'
            ],
            correctAnswer: 1
        }
    ],
    // Passage 2: 'Innovation in Renewable Energy'
    [
        {
            question: 'What is the main topic of this passage?',
            options: [
                'A) Rising oil prices',
                'B) A shortage of solar panels',
                'C) New airline regulations',
                'D) Growth and innovation in renewable energy'
            ],
            correctAnswer: 3
        },
        {
            question: 'By how much has solar panel efficiency increased over the past two years?',
            options: [
                'A) 10%',
                'B) 25%',
                'C) 45%',
                'D) 80%'
            ],
            correctAnswer: 1
        },
        {
            question: 'What have companies like Google, Apple, and Microsoft committed to?',
            options: [
                'A) Building their own wind farms',
                'B) Lowering electricity prices',
                'C) Achieving carbon neutrality within the next decade',
                'D) Manufacturing solar panels'
            ],
            correctAnswer: 2
        },
        {
            question: 'According to the International Energy Agency, what will renewable energy account for over the next decade?',
            options: [
                'A) 80% of new power capacity additions',
                'B) 25% of global oil consumption',
                'C) Half of all government spending',
                'D) A decline in energy investment'
            ],
            correctAnswer: 0
        }
    ]
];

class TOEICTestSimulator {
    constructor() {
        this.testSessions = new Map();
        this.currentTest = null;
        this.testConfig = {
            listening: {
                totalQuestions: 100,
                timeLimit: 45 * 60 * 1000, // 45 minutes in milliseconds
                sections: {
                    photographs: { count: 10, timePerQuestion: 3000 },
                    questionResponse: { count: 30, timePerQuestion: 2000 },
                    conversations: { count: 30, timePerQuestion: 4500 },
                    talks: { count: 30, timePerQuestion: 6000 }
                }
            },
            reading: {
                totalQuestions: 100,
                timeLimit: 75 * 60 * 1000, // 75 minutes in milliseconds
                sections: {
                    incompleteSentences: { count: 40, timePerQuestion: 30000 },
                    textCompletion: { count: 12, timePerQuestion: 45000 },
                    readingComprehension: { count: 48, timePerQuestion: 60000 }
                }
            }
        };
        
        this.scoringSystem = {
            listening: {
                rawToScaled: this.generateListeningScoreTable(),
                maxScore: 495
            },
            reading: {
                rawToScaled: this.generateReadingScoreTable(),
                maxScore: 495
            }
        };
        
        this.testHistory = [];
        this.loadTestHistory();
        
        console.log('📝 TOEIC Test Simulator initialized');
    }
    
    /**
     * Start a full TOEIC test (Listening + Reading)
     */
    startFullTest() {
        return this.startTest({ type: 'full' });
    }

    /**
     * Start a listening-only test
     */
    startListeningTest() {
        return this.startTest({ type: 'listening' });
    }

    /**
     * Start a reading-only test
     */
    startReadingTest() {
        return this.startTest({ type: 'reading' });
    }
    
    generateListeningScoreTable() {
        // Generate realistic score conversion table for listening
        const table = {};
        for (let raw = 0; raw <= 100; raw++) {
            // TOEIC listening scores typically range from 5-495
            // Higher raw scores get higher scaled scores with some curve
            let scaled = Math.round(5 + (raw / 100) * 490);
            
            // Add some realistic variation
            if (raw >= 90) scaled = Math.min(scaled + 10, 495);
            else if (raw >= 80) scaled = Math.min(scaled + 5, 485);
            else if (raw <= 10) scaled = Math.max(scaled - 5, 5);
            
            table[raw] = scaled;
        }
        return table;
    }
    
    generateReadingScoreTable() {
        // Generate realistic score conversion table for reading
        const table = {};
        for (let raw = 0; raw <= 100; raw++) {
            // TOEIC reading scores typically range from 5-495
            let scaled = Math.round(5 + (raw / 100) * 490);
            
            // Reading section often has slightly different curve
            if (raw >= 95) scaled = Math.min(scaled + 15, 495);
            else if (raw >= 85) scaled = Math.min(scaled + 8, 485);
            else if (raw <= 15) scaled = Math.max(scaled - 8, 5);
            
            table[raw] = scaled;
        }
        return table;
    }
    
    loadTestHistory() {
        try {
            const savedHistory = localStorage.getItem('toeicTestHistory');
            if (savedHistory) {
                this.testHistory = JSON.parse(savedHistory);
                console.log(`✅ Loaded ${this.testHistory.length} test sessions`);
            }
        } catch (error) {
            console.error('❌ Error loading test history:', error);
        }
    }
    
    saveTestHistory() {
        try {
            localStorage.setItem('toeicTestHistory', JSON.stringify(this.testHistory));
        } catch (error) {
            console.error('❌ Error saving test history:', error);
        }
    }
    
    // Start a new test session
    startTest(options = {}) {
        const testId = this.generateTestId();
        const testType = options.type || 'full'; // 'full', 'listening', 'reading'
        
        this.currentTest = {
            id: testId,
            type: testType,
            startTime: Date.now(),
            endTime: null,
            status: 'in_progress',
            currentSection: testType === 'full' ? 'listening' : testType,
            currentQuestion: 0,
            answers: {},
            timeRemaining: this.calculateTimeRemaining(testType),
            sections: this.initializeSections(testType),
            score: null,
            results: null
        };
        
        this.testSessions.set(testId, this.currentTest);

        // Activate the first section so getCurrentQuestion() can serve questions
        this.startSection(this.currentTest.currentSection);

        console.log(`🎯 Started TOEIC test: ${testType} (ID: ${testId})`);
        return this.currentTest;
    }
    
    generateTestId() {
        return 'toeic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    calculateTimeRemaining(testType) {
        if (testType === 'full') {
            return this.testConfig.listening.timeLimit + this.testConfig.reading.timeLimit;
        } else if (testType === 'listening') {
            return this.testConfig.listening.timeLimit;
        } else if (testType === 'reading') {
            return this.testConfig.reading.timeLimit;
        }
        return 0;
    }
    
    initializeSections(testType) {
        const sections = {};
        
        if (testType === 'full' || testType === 'listening') {
            sections.listening = {
                status: 'pending',
                startTime: null,
                endTime: null,
                timeRemaining: this.testConfig.listening.timeLimit,
                questions: this.generateListeningQuestions(),
                answers: {},
                score: null
            };
        }
        
        if (testType === 'full' || testType === 'reading') {
            sections.reading = {
                status: 'pending',
                startTime: null,
                endTime: null,
                timeRemaining: this.testConfig.reading.timeLimit,
                questions: this.generateReadingQuestions(),
                answers: {},
                score: null
            };
        }
        
        return sections;
    }
    
    generateListeningQuestions() {
        const questions = [];
        let questionNumber = 1;
        
        // Photographs (Questions 1-10)
        for (let i = 0; i < 10; i++) {
            const item = TOEIC_PHOTOGRAPH_BANK[i % TOEIC_PHOTOGRAPH_BANK.length];
            questions.push({
                number: questionNumber++,
                type: 'photographs',
                imageUrl: `assets/images/toeic/photo_${String(i + 1).padStart(2, '0')}.jpg`,
                audioUrl: `assets/audio/toeic/photo_${String(i + 1).padStart(2, '0')}.mp3`,
                transcript: item.transcript,
                options: item.options,
                correctAnswer: item.correctAnswer,
                timeLimit: this.testConfig.listening.sections.photographs.timePerQuestion
            });
        }

        // Question-Response (Questions 11-40)
        for (let i = 0; i < 30; i++) {
            const item = TOEIC_QUESTION_RESPONSE_BANK[i % TOEIC_QUESTION_RESPONSE_BANK.length];
            questions.push({
                number: questionNumber++,
                type: 'questionResponse',
                audioUrl: `assets/audio/toeic/qr_${String(i + 1).padStart(2, '0')}.mp3`,
                transcript: item.transcript,
                options: item.options,
                correctAnswer: item.correctAnswer,
                timeLimit: this.testConfig.listening.sections.questionResponse.timePerQuestion
            });
        }

        // Conversations (Questions 41-70)
        for (let i = 0; i < 30; i++) {
            const conversationNumber = Math.floor(i / 3) + 1;
            const questionInConversation = (i % 3) + 1;
            const conversation = TOEIC_CONVERSATION_BANK[(conversationNumber - 1) % TOEIC_CONVERSATION_BANK.length];
            const item = conversation.questions[questionInConversation - 1];

            questions.push({
                number: questionNumber++,
                type: 'conversations',
                conversationNumber: conversationNumber,
                questionInConversation: questionInConversation,
                audioUrl: `assets/audio/toeic/conv_${String(conversationNumber).padStart(2, '0')}.mp3`,
                transcript: conversation.transcript,
                question: item.question,
                options: item.options,
                correctAnswer: item.correctAnswer,
                timeLimit: this.testConfig.listening.sections.conversations.timePerQuestion
            });
        }

        // Talks (Questions 71-100)
        for (let i = 0; i < 30; i++) {
            const talkNumber = Math.floor(i / 3) + 1;
            const questionInTalk = (i % 3) + 1;
            const talk = TOEIC_TALK_BANK[(talkNumber - 1) % TOEIC_TALK_BANK.length];
            const item = talk.questions[questionInTalk - 1];

            questions.push({
                number: questionNumber++,
                type: 'talks',
                talkNumber: talkNumber,
                questionInTalk: questionInTalk,
                audioUrl: `assets/audio/toeic/talk_${String(talkNumber).padStart(2, '0')}.mp3`,
                transcript: talk.transcript,
                question: item.question,
                options: item.options,
                correctAnswer: item.correctAnswer,
                timeLimit: this.testConfig.listening.sections.talks.timePerQuestion
            });
        }
        
        return questions;
    }
    
    generateReadingQuestions() {
        const questions = [];
        let questionNumber = 101; // Reading starts at 101
        
        // Incomplete Sentences (Questions 101-140)
        for (let i = 0; i < 40; i++) {
            const item = TOEIC_INCOMPLETE_SENTENCE_BANK[i % TOEIC_INCOMPLETE_SENTENCE_BANK.length];
            questions.push({
                number: questionNumber++,
                type: 'incompleteSentences',
                sentence: item.sentence,
                options: item.options,
                correctAnswer: item.correctAnswer,
                timeLimit: this.testConfig.reading.sections.incompleteSentences.timePerQuestion
            });
        }

        // Text Completion (Questions 141-152)
        for (let i = 0; i < 12; i++) {
            const textNumber = Math.floor(i / 3) + 1;
            const questionInText = (i % 3) + 1;
            const text = TOEIC_TEXT_COMPLETION_BANK[(textNumber - 1) % TOEIC_TEXT_COMPLETION_BANK.length];
            const item = text.questions[questionInText - 1];

            questions.push({
                number: questionNumber++,
                type: 'textCompletion',
                textNumber: textNumber,
                questionInText: questionInText,
                passage: text.passage,
                question: item.question,
                options: item.options,
                correctAnswer: item.correctAnswer,
                timeLimit: this.testConfig.reading.sections.textCompletion.timePerQuestion
            });
        }

        // Reading Comprehension (Questions 153-200)
        for (let i = 0; i < 48; i++) {
            const passageNumber = Math.floor(i / 4) + 1;
            const questionInPassage = (i % 4) + 1;
            const passageQuestions = TOEIC_READING_COMPREHENSION_BANK[(passageNumber - 1) % TOEIC_READING_COMPREHENSION_BANK.length];
            const item = passageQuestions[questionInPassage - 1];

            questions.push({
                number: questionNumber++,
                type: 'readingComprehension',
                passageNumber: passageNumber,
                questionInPassage: questionInPassage,
                passage: this.generateReadingPassage(passageNumber),
                question: item.question,
                options: item.options,
                correctAnswer: item.correctAnswer,
                timeLimit: this.testConfig.reading.sections.readingComprehension.timePerQuestion
            });
        }
        
        return questions;
    }
    
    generateReadingPassage(passageNumber) {
        const passages = [
            {
                title: 'Global Economy Shows Signs of Recovery',
                content: `The global economy is showing encouraging signs of recovery as major economies report positive growth indicators for the third consecutive quarter. According to the latest report from the International Monetary Fund, global GDP is expected to grow by 3.2% this year, marking a significant improvement from last year's contraction.

The recovery has been particularly strong in the technology sector, where companies have adapted quickly to the changing business landscape. E-commerce platforms have seen unprecedented growth, with online sales increasing by 45% compared to pre-pandemic levels.

However, economists warn that the recovery remains uneven across different regions and industries. While developed nations are experiencing robust growth, emerging markets continue to face challenges related to vaccine distribution and supply chain disruptions.

The report also highlights the importance of continued government support for small and medium-sized enterprises, which have been disproportionately affected by the economic downturn. Policy makers are urged to maintain fiscal stimulus measures while gradually transitioning to more sustainable economic policies.`
            },
            {
                title: 'Innovation in Renewable Energy',
                content: `The renewable energy sector continues to experience remarkable growth and innovation, with new technologies making clean energy more accessible and affordable than ever before. Solar panel efficiency has increased by 25% over the past two years, while wind turbine technology has become significantly more cost-effective.

Major corporations are increasingly investing in renewable energy solutions, recognizing both the environmental benefits and long-term cost savings. Companies like Google, Apple, and Microsoft have committed to achieving carbon neutrality within the next decade, driving demand for innovative clean energy technologies.

Government policies and incentives are also playing a crucial role in accelerating the transition to renewable energy. Many countries have implemented feed-in tariffs and tax credits to encourage both residential and commercial adoption of solar and wind power systems.

The International Energy Agency predicts that renewable energy will account for 80% of new power capacity additions over the next decade, signaling a fundamental shift in how the world generates and consumes energy.`
            }
        ];
        
        const passage = passages[(passageNumber - 1) % passages.length];
        return `${passage.title}\n\n${passage.content}`;
    }
    
    generateReadingQuestion(questionNumber) {
        const questions = [
            'What is the main topic of this passage?',
            'According to the passage, what is expected to happen?',
            'Which of the following is mentioned in the passage?',
            'What can be inferred from the passage?'
        ];
        
        return questions[(questionNumber - 1) % questions.length];
    }
    
    // Start a specific section
    startSection(sectionName) {
        if (!this.currentTest) return false;
        
        const section = this.currentTest.sections[sectionName];
        if (!section) return false;
        
        section.status = 'in_progress';
        section.startTime = Date.now();
        this.currentTest.currentSection = sectionName;
        this.currentTest.currentQuestion = 0;
        
        console.log(`📝 Started ${sectionName} section`);
        return true;
    }
    
    // Get current question
    getCurrentQuestion() {
        if (!this.currentTest) return null;
        
        const section = this.currentTest.sections[this.currentTest.currentSection];
        if (!section || section.status !== 'in_progress') return null;
        
        const question = section.questions[this.currentTest.currentQuestion];
        if (!question) return null;
        
        return {
            ...question,
            section: this.currentTest.currentSection,
            timeRemaining: section.timeRemaining,
            progress: {
                current: this.currentTest.currentQuestion + 1,
                total: section.questions.length
            }
        };
    }
    
    // Answer current question
    answerQuestion(answer, timeSpent = 0) {
        if (!this.currentTest) return false;
        
        const section = this.currentTest.sections[this.currentTest.currentSection];
        if (!section || section.status !== 'in_progress') return false;
        
        const questionNumber = section.questions[this.currentTest.currentQuestion].number;
        
        // Record answer
        section.answers[questionNumber] = {
            answer: answer,
            timeSpent: timeSpent,
            timestamp: Date.now()
        };
        
        // Move to next question
        this.currentTest.currentQuestion++;
        
        // Check if section is complete
        if (this.currentTest.currentQuestion >= section.questions.length) {
            this.completeSection(this.currentTest.currentSection);
        }
        
        return true;
    }
    
    // Move to next question
    nextQuestion() {
        if (!this.currentTest) return false;
        
        const section = this.currentTest.sections[this.currentTest.currentSection];
        if (!section || section.status !== 'in_progress') return false;
        
        this.currentTest.currentQuestion++;
        
        // Check if section is complete
        if (this.currentTest.currentQuestion >= section.questions.length) {
            this.completeSection(this.currentTest.currentSection);
            return false; // No more questions in this section
        }
        
        return true;
    }
    
    // Move to previous question
    previousQuestion() {
        if (!this.currentTest) return false;
        
        const section = this.currentTest.sections[this.currentTest.currentSection];
        if (!section || section.status !== 'in_progress') return false;
        
        if (this.currentTest.currentQuestion > 0) {
            this.currentTest.currentQuestion--;
            return true;
        }
        
        return false;
    }
    
    // Submit the test
    submitTest() {
        if (!this.currentTest) return null;
        
        console.log('📝 Submitting TOEIC test...');
        
        // Complete any remaining sections
        for (const [sectionName, section] of Object.entries(this.currentTest.sections)) {
            if (section.status !== 'completed') {
                section.status = 'completed';
                section.endTime = Date.now();
                section.score = this.calculateSectionScore(section, sectionName);
            }
        }

        // Complete the test (owns the single history record)
        this.completeTest();

        console.log('✅ Test submitted successfully');
        return this.currentTest.results;
    }
    
    // Complete a section
    completeSection(sectionName) {
        if (!this.currentTest) return false;
        
        const section = this.currentTest.sections[sectionName];
        if (!section) return false;
        
        section.status = 'completed';
        section.endTime = Date.now();
        section.score = this.calculateSectionScore(section, sectionName);

        console.log(`✅ Completed ${sectionName} section with score:`, section.score);

        // Advance to the next pending section (e.g. listening → reading in a full test)
        const pendingSection = Object.keys(this.currentTest.sections)
            .find(name => this.currentTest.sections[name].status === 'pending');
        if (pendingSection) {
            this.startSection(pendingSection);
        } else if (this.isTestComplete()) {
            this.completeTest();
        }

        return true;
    }

    // Calculate section score
    calculateSectionScore(section, sectionName) {
        let correctAnswers = 0;
        const totalQuestions = section.questions.length;

        for (const [questionNumber, answerData] of Object.entries(section.answers)) {
            const question = section.questions.find(q => q.number == questionNumber);
            if (question && answerData.answer === question.correctAnswer) {
                correctAnswers++;
            }
        }

        const rawScore = Math.round((correctAnswers / totalQuestions) * 100);
        // Score with the conversion table for this section, not the section's status
        const scoringTable = this.scoringSystem[sectionName] || this.scoringSystem.listening;
        const scaledScore = scoringTable.rawToScaled[rawScore];

        return {
            raw: rawScore,
            scaled: scaledScore,
            correct: correctAnswers,
            total: totalQuestions,
            accuracy: Math.round((correctAnswers / totalQuestions) * 100)
        };
    }
    
    // Check if test is complete
    isTestComplete() {
        if (!this.currentTest) return false;
        
        for (const [sectionName, section] of Object.entries(this.currentTest.sections)) {
            if (section.status !== 'completed') {
                return false;
            }
        }
        
        return true;
    }
    
    // Complete the test
    completeTest() {
        if (!this.currentTest) return false;

        // Guard against double completion (completeSection + submitTest can both land here)
        if (this.currentTest.status === 'completed') return this.currentTest;

        this.currentTest.status = 'completed';
        this.currentTest.endTime = Date.now();
        this.currentTest.score = this.calculateTotalScore();
        this.currentTest.results = this.generateTestResults();

        // Add one normalized record to test history
        const sectionScores = Object.values(this.currentTest.sections)
            .map(s => s.score)
            .filter(Boolean);
        const accuracy = sectionScores.length > 0
            ? Math.round(sectionScores.reduce((sum, s) => sum + s.accuracy, 0) / sectionScores.length)
            : 0;

        this.testHistory.push({
            id: this.currentTest.id,
            type: this.currentTest.type,
            date: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            score: this.currentTest.score,
            accuracy: accuracy,
            results: this.currentTest.results
        });

        this.saveTestHistory();

        console.log(`🎯 Test completed! Total score: ${this.currentTest.score.total}`);

        return this.currentTest;
    }
    
    // Calculate total score
    calculateTotalScore() {
        if (!this.currentTest) return null;
        
        let listeningScore = 0;
        let readingScore = 0;
        
        if (this.currentTest.sections.listening) {
            listeningScore = this.currentTest.sections.listening.score.scaled;
        }
        
        if (this.currentTest.sections.reading) {
            readingScore = this.currentTest.sections.reading.score.scaled;
        }
        
        const total = listeningScore + readingScore;
        
        return {
            listening: listeningScore,
            reading: readingScore,
            total: total,
            level: this.getProficiencyLevel(total)
        };
    }
    
    // Get proficiency level based on total score
    getProficiencyLevel(totalScore) {
        if (totalScore >= 900) return { level: 'C1', description: 'Advanced' };
        if (totalScore >= 800) return { level: 'B2+', description: 'Upper Intermediate' };
        if (totalScore >= 700) return { level: 'B2', description: 'Intermediate' };
        if (totalScore >= 600) return { level: 'B1+', description: 'Lower Intermediate' };
        if (totalScore >= 500) return { level: 'B1', description: 'Elementary' };
        if (totalScore >= 400) return { level: 'A2', description: 'Basic' };
        return { level: 'A1', description: 'Beginner' };
    }
    
    // Generate detailed test results
    generateTestResults() {
        if (!this.currentTest) return null;
        
        const results = {
            overall: this.currentTest.score,
            sections: {},
            recommendations: [],
            strengths: [],
            weaknesses: []
        };
        
        // Analyze each section
        for (const [sectionName, section] of Object.entries(this.currentTest.sections)) {
            if (section.status === 'completed') {
                results.sections[sectionName] = {
                    score: section.score,
                    timeSpent: section.endTime - section.startTime,
                    performance: this.analyzeSectionPerformance(section)
                };
            }
        }
        
        // Generate recommendations
        results.recommendations = this.generateRecommendations(results);
        
        return results;
    }
    
    // Analyze section performance
    analyzeSectionPerformance(section) {
        const performance = {
            strongAreas: [],
            weakAreas: [],
            timeManagement: 'good'
        };
        
        // Analyze by question type
        const typeStats = {};
        for (const question of section.questions) {
            const answer = section.answers[question.number];
            if (answer) {
                const type = question.type;
                if (!typeStats[type]) {
                    typeStats[type] = { correct: 0, total: 0 };
                }
                typeStats[type].total++;
                if (answer.answer === question.correctAnswer) {
                    typeStats[type].correct++;
                }
            }
        }
        
        // Identify strong and weak areas
        for (const [type, stats] of Object.entries(typeStats)) {
            const accuracy = (stats.correct / stats.total) * 100;
            if (accuracy >= 80) {
                performance.strongAreas.push(type);
            } else if (accuracy < 60) {
                performance.weakAreas.push(type);
            }
        }
        
        return performance;
    }
    
    // Generate recommendations
    generateRecommendations(results) {
        const recommendations = [];
        
        // Overall score recommendations
        if (results.overall.total < 600) {
            recommendations.push({
                type: 'overall',
                priority: 'high',
                message: 'Focus on building fundamental English skills before taking the actual TOEIC test.'
            });
        } else if (results.overall.total < 800) {
            recommendations.push({
                type: 'overall',
                priority: 'medium',
                message: 'Continue practicing with focus on weaker areas to improve your score.'
            });
        } else {
            recommendations.push({
                type: 'overall',
                priority: 'low',
                message: 'Excellent performance! Consider taking the actual TOEIC test soon.'
            });
        }
        
        // Section-specific recommendations
        for (const [sectionName, section] of Object.entries(results.sections)) {
            if (section.score.scaled < 300) {
                recommendations.push({
                    type: sectionName,
                    priority: 'high',
                    message: `Focus on improving ${sectionName} skills through targeted practice.`
                });
            }
        }
        
        return recommendations;
    }
    
    // Get test history
    getTestHistory() {
        return this.testHistory.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    }
    
    // Get progress statistics
    getProgressStats() {
        if (this.testHistory.length === 0) {
            return {
                totalTests: 0,
                averageScore: 0,
                bestScore: 0,
                improvement: 0,
                trend: 'stable'
            };
        }
        
        const scores = this.testHistory
            .map(test => test.score?.total)
            .filter(score => typeof score === 'number');
        if (scores.length === 0) {
            return { totalTests: this.testHistory.length, averageScore: 0, bestScore: 0, improvement: 0, trend: 'stable' };
        }
        const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
        const bestScore = Math.max(...scores);
        
        let improvement = 0;
        if (scores.length >= 2) {
            improvement = scores[scores.length - 1] - scores[0];
        }
        
        let trend = 'stable';
        if (scores.length >= 3) {
            const recent = scores.slice(-3);
            const earlier = scores.slice(0, 3);
            const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
            const earlierAvg = earlier.reduce((sum, score) => sum + score, 0) / earlier.length;
            
            if (recentAvg > earlierAvg + 20) trend = 'improving';
            else if (recentAvg < earlierAvg - 20) trend = 'declining';
        }
        
        return {
            totalTests: this.testHistory.length,
            averageScore,
            bestScore,
            improvement,
            trend
        };
    }
    
    // Pause test
    pauseTest() {
        if (!this.currentTest || this.currentTest.status !== 'in_progress') return false;
        
        this.currentTest.status = 'paused';
        this.currentTest.pausedAt = Date.now();
        
        console.log('⏸️ Test paused');
        return true;
    }
    
    // Resume test
    resumeTest() {
        if (!this.currentTest || this.currentTest.status !== 'paused') return false;

        this.currentTest.status = 'in_progress';
        if (this.currentTest.pausedAt) {
            // Accumulate paused time so it doesn't count against the clock
            const pauseDuration = Date.now() - this.currentTest.pausedAt;
            this.currentTest.totalPausedTime = (this.currentTest.totalPausedTime || 0) + pauseDuration;
            delete this.currentTest.pausedAt;
        }

        console.log('▶️ Test resumed');
        return true;
    }

    // Get time remaining
    getTimeRemaining() {
        if (!this.currentTest) return 0;

        // While paused, freeze the clock at the moment of pausing
        const now = this.currentTest.pausedAt || Date.now();
        const elapsed = now - this.currentTest.startTime - (this.currentTest.totalPausedTime || 0);
        return Math.max(0, this.currentTest.timeRemaining - elapsed);
    }
    
    // Format time remaining
    formatTimeRemaining(milliseconds) {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Reset test
    resetTest() {
        if (this.currentTest) {
            this.currentTest.status = 'cancelled';
            this.currentTest.endTime = Date.now();
        }
        
        this.currentTest = null;
        console.log('🔄 Test reset');
    }
}

// Export for global use
window.TOEICTestSimulator = TOEICTestSimulator;

