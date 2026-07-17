// TOEIC Listening + Part 6 content banks (2018+ format)
// Consumed by toeic-test-simulator.js. Pure data — no logic.
//
// Schema:
// window.TOEIC_LISTENING_BANK = {
//   part1: [{ scene: '<emoji scene>', caption: '<alt text for the scene>',
//             statements: [4 strings, spoken via TTS], correctAnswer: 0-3 }],
//   part2: [{ question: '<spoken>', responses: [3 strings, spoken], correctAnswer: 0-2 }],
//   part3: [{ conversation: [{ speaker: 'M'|'W'|'M2'|'W2', text: '...' }],
//             questions: [{ question, options: [4], correctAnswer } x3 ] }],
//   part4: [{ type: 'announcement'|'talk'|'advertisement'|'telephone message'|'excerpt from a meeting',
//             talk: '<spoken text>',
//             questions: [{ question, options: [4], correctAnswer } x3 ] }]
// };
// window.TOEIC_PART6_BANK = [{ passage: '<text with ___(1)___ .. ___(4)___ blanks>',
//                              questions: [{ question, options: [4], correctAnswer } x4 ] }];

window.TOEIC_LISTENING_BANK = {
  part1: [
    {
      scene: "👩‍💼💻📞🏢",
      caption: "A woman is talking on the telephone while sitting at a desk with a laptop in an office.",
      statements: [
        "The woman is speaking on the telephone.",
        "The woman is closing her laptop.",
        "The woman is standing near a copier.",
        "The woman is filing some documents."
      ],
      correctAnswer: 0
    },
    {
      scene: "👷🪜🎨🧱",
      caption: "A worker is standing on a ladder, painting a brick wall.",
      statements: [
        "The man is climbing the stairs.",
        "The man is painting a wall.",
        "The man is repairing a roof.",
        "The man is carrying some bricks."
      ],
      correctAnswer: 1
    },
    {
      scene: "🧑‍🍳🍳🍽️👨‍🍳",
      caption: "Two chefs are preparing food in a commercial kitchen.",
      statements: [
        "The cooks are washing the dishes.",
        "The men are eating a meal.",
        "Some food is being prepared.",
        "The kitchen is being cleaned."
      ],
      correctAnswer: 2
    },
    {
      scene: "🚉🧳👥⏰",
      caption: "Passengers with luggage are waiting on a train platform.",
      statements: [
        "The people are boarding an airplane.",
        "Suitcases are being loaded onto a cart.",
        "The travelers are buying tickets.",
        "Some people are waiting on a platform."
      ],
      correctAnswer: 3
    },
    {
      scene: "👨‍💼👩‍💼🤝📄",
      caption: "Two businesspeople are shaking hands over some documents.",
      statements: [
        "They are signing a contract.",
        "The people are shaking hands.",
        "They are handing out flyers.",
        "The men are stacking some papers."
      ],
      correctAnswer: 1
    },
    {
      scene: "🚚📦🏬👷",
      caption: "A worker is unloading boxes from a delivery truck outside a store.",
      statements: [
        "The truck is being repaired.",
        "The man is driving the truck.",
        "Boxes are stacked inside a warehouse.",
        "Some packages are being unloaded from a vehicle."
      ],
      correctAnswer: 3
    },
    {
      scene: "👩‍💼📊👥🖥️",
      caption: "A woman is presenting a chart to a group of people in a meeting room.",
      statements: [
        "A woman is presenting a chart to an audience.",
        "The people are leaving the room.",
        "A monitor is being installed.",
        "The woman is drawing on a whiteboard."
      ],
      correctAnswer: 0
    },
    {
      scene: "🌳🧹🍂",
      caption: "A man is sweeping fallen leaves from a walkway in a park.",
      statements: [
        "The man is watering some plants.",
        "The trees are being cut down.",
        "A walkway is being swept.",
        "Some people are having a picnic."
      ],
      correctAnswer: 2
    }
  ],

  part2: [
    {
      question: "Who is leading the training session this afternoon?",
      responses: [
        "Ms. Alvarez from Human Resources.",
        "In the main conference room.",
        "Yes, I attended last year."
      ],
      correctAnswer: 0
    },
    {
      question: "When does the shipment from Dallas arrive?",
      responses: [
        "By express courier.",
        "Sometime on Thursday morning.",
        "About thirty boxes."
      ],
      correctAnswer: 1
    },
    {
      question: "Where can I find the office supply catalog?",
      responses: [
        "A new supplier.",
        "Every three months.",
        "There's a copy on the shelf by the printer."
      ],
      correctAnswer: 2
    },
    {
      question: "Why was the staff meeting postponed?",
      responses: [
        "In meeting room B.",
        "At two o'clock.",
        "Because the director is out of town."
      ],
      correctAnswer: 2
    },
    {
      question: "How do I request time off next month?",
      responses: [
        "Just fill out a form on the employee portal.",
        "Two weeks in July.",
        "The month-end report."
      ],
      correctAnswer: 0
    },
    {
      question: "Have you finished reviewing the budget proposal?",
      responses: [
        "He proposed a new schedule.",
        "Almost — I just need to check the last section.",
        "In the finance department."
      ],
      correctAnswer: 1
    },
    {
      question: "You've met the new branch manager, haven't you?",
      responses: [
        "The branch on Fifth Avenue.",
        "No, she doesn't start until Monday.",
        "He managed to fix it."
      ],
      correctAnswer: 1
    },
    {
      question: "Would you like coffee or tea with your breakfast?",
      responses: [
        "Yes, please.",
        "At the café downstairs.",
        "Tea would be lovely, thank you."
      ],
      correctAnswer: 2
    },
    {
      question: "The printer on the third floor is out of paper again.",
      responses: [
        "I'll bring a new box up from the supply room.",
        "It was printed yesterday.",
        "Three copies, please."
      ],
      correctAnswer: 0
    },
    {
      question: "Could you email me the sales figures before noon?",
      responses: [
        "The mail arrived late.",
        "Sure, I'll send them right away.",
        "He works in sales."
      ],
      correctAnswer: 1
    },
    {
      question: "What time does the pharmacy close on weekends?",
      responses: [
        "At six on Saturdays and five on Sundays.",
        "It's close to the station.",
        "Some cold medicine."
      ],
      correctAnswer: 0
    },
    {
      question: "Do you know whether the flight to Chicago is delayed?",
      responses: [
        "A window seat, please.",
        "About two hours long.",
        "Yes, it's been pushed back an hour."
      ],
      correctAnswer: 2
    },
    {
      question: "Who's responsible for updating the company website?",
      responses: [
        "It was updated last week.",
        "That would be the marketing team.",
        "On the home page."
      ],
      correctAnswer: 1
    },
    {
      question: "Shouldn't we order more chairs for the seminar?",
      responses: [
        "Good idea — I'll call the rental company.",
        "He's the new chairperson.",
        "In the auditorium."
      ],
      correctAnswer: 0
    },
    {
      question: "How many people signed up for the wellness workshop?",
      responses: [
        "Next to the gym.",
        "That's a good sign.",
        "Around forty, so far."
      ],
      correctAnswer: 2
    },
    {
      question: "Why don't we take a taxi to the convention center?",
      responses: [
        "Because it was cancelled.",
        "Actually, the subway would be faster.",
        "A very convenient location."
      ],
      correctAnswer: 1
    },
    {
      question: "I can't find the key to the storage room.",
      responses: [
        "Ask Dennis — he borrowed it this morning.",
        "A three-year storage contract.",
        "Yes, the room is quite big."
      ],
      correctAnswer: 0
    },
    {
      question: "Is the quarterly report due this Friday or next?",
      responses: [
        "Yes, it is.",
        "Next Friday — we got an extension.",
        "Four pages long."
      ],
      correctAnswer: 1
    },
    {
      question: "Where should I park while my car is being serviced?",
      responses: [
        "In the lot behind the building.",
        "A part-time position.",
        "It usually takes an hour."
      ],
      correctAnswer: 0
    },
    {
      question: "Won't the new software slow down the older computers?",
      responses: [
        "He walked quite slowly.",
        "At the hardware store.",
        "No, it's actually lighter than the current version."
      ],
      correctAnswer: 2
    },
    {
      question: "Whose umbrella is this by the reception desk?",
      responses: [
        "It's raining pretty hard.",
        "I think it belongs to Ms. Chen.",
        "At the front desk."
      ],
      correctAnswer: 1
    },
    {
      question: "Can I help you carry those files to the archive?",
      responses: [
        "Thanks, they're heavier than they look.",
        "A very helpful manual.",
        "He filed a complaint."
      ],
      correctAnswer: 0
    },
    {
      question: "The elevator's been out of service all morning, hasn't it?",
      responses: [
        "An excellent service.",
        "On the tenth floor.",
        "Yes, we've all been using the stairs."
      ],
      correctAnswer: 2
    },
    {
      question: "What's the fastest way to get to the airport from here?",
      responses: [
        "A round-trip ticket.",
        "The express train leaves every twenty minutes.",
        "About five kilometers away."
      ],
      correctAnswer: 1
    },
    {
      question: "Didn't you use to work at the downtown branch?",
      responses: [
        "Yes, for almost three years.",
        "It's just down the street.",
        "The bank opens at nine."
      ],
      correctAnswer: 0
    },
    {
      question: "Should we book the hotel now or wait for the group discount?",
      responses: [
        "I read that book too.",
        "A double room, please.",
        "Let's wait — the discount starts next week."
      ],
      correctAnswer: 2
    },
    {
      question: "Our biggest client just increased their order for next quarter.",
      responses: [
        "It's a quarter past three.",
        "That's great news — we'll need to add a production shift.",
        "No, I didn't order anything."
      ],
      correctAnswer: 1
    },
    {
      question: "How long will the road outside the office be closed?",
      responses: [
        "About two miles long.",
        "The office closes at six.",
        "Until the end of the month, I heard."
      ],
      correctAnswer: 2
    }
  ],

  part3: [
    {
      conversation: [
        { speaker: "M", text: "Hi, Rachel. The copier on the second floor is jammed again, and I need to print handouts for the ten o'clock meeting." },
        { speaker: "W", text: "Not again. The repair technician isn't coming until tomorrow. Why don't you use the machine in the mailroom? It was serviced last week." },
        { speaker: "M", text: "I didn't know we could use that one. Do I need a code?" },
        { speaker: "W", text: "Yes, it's the same code as the second-floor copier. Just make sure you refill the paper tray when you're done — the mailroom staff say people keep leaving it empty." },
        { speaker: "M", text: "Will do. Thanks — I'd better hurry if I want everything ready before ten." }
      ],
      questions: [
        {
          question: "What problem does the man mention?",
          options: ["A meeting was canceled", "A machine is jammed", "Some handouts are missing", "A technician is late"],
          correctAnswer: 1
        },
        {
          question: "What does the woman suggest the man do?",
          options: ["Wait until tomorrow", "Call a repair technician", "Use a machine in the mailroom", "Reschedule his meeting"],
          correctAnswer: 2
        },
        {
          question: "What does the woman remind the man to do?",
          options: ["Enter a new code", "Notify the mailroom staff", "Print extra copies", "Refill the paper tray"],
          correctAnswer: 3
        }
      ]
    },
    {
      conversation: [
        { speaker: "W", text: "Daniel, the client from Brightway Media wants to move our presentation from Thursday to Wednesday afternoon. Are you free then?" },
        { speaker: "M", text: "Wednesday's tricky — I have a dentist appointment at two, but I could be back by three thirty." },
        { speaker: "W", text: "The client suggested two o'clock, unfortunately. Could you move your appointment instead?" },
        { speaker: "M", text: "Let me call the dental office. If they can see me Friday morning, I'll confirm Wednesday at two with you." },
        { speaker: "W", text: "Perfect. I'll hold off on replying to the client until I hear from you. Just let me know by the end of the day." }
      ],
      questions: [
        {
          question: "Why does the woman talk to the man?",
          options: ["To reschedule a presentation", "To cancel a client contract", "To plan a dental visit", "To review some slides"],
          correctAnswer: 0
        },
        {
          question: "What conflict does the man have on Wednesday?",
          options: ["A staff meeting", "A business trip", "A dentist appointment", "A training session"],
          correctAnswer: 2
        },
        {
          question: "What will the man most likely do next?",
          options: ["Reply to the client", "Call the dental office", "Prepare the presentation", "Meet the woman at two o'clock"],
          correctAnswer: 1
        }
      ]
    },
    {
      conversation: [
        { speaker: "M", text: "We still need to arrange lunch for Friday's staff retreat. Any suggestions?" },
        { speaker: "W", text: "Garden Bistro catered our spring workshop, and everyone loved the food. Their sandwich platters were reasonable, too." },
        { speaker: "M", text: "How much did we pay last time?" },
        { speaker: "W", text: "Around three hundred dollars for thirty people, I think. Nadia handled the invoice — Nadia, do you remember?" },
        { speaker: "W2", text: "It was three hundred twenty, including delivery. But they need at least three days' notice for large orders, so we should call today." },
        { speaker: "M", text: "Good point. I'll phone them this afternoon and ask for the same menu." }
      ],
      questions: [
        {
          question: "What event are the speakers preparing for?",
          options: ["A spring workshop", "A client dinner", "A staff retreat", "A product launch"],
          correctAnswer: 2
        },
        {
          question: "What does Nadia say about Garden Bistro?",
          options: ["They require advance notice", "Their prices have increased", "They no longer deliver", "Their menu has changed"],
          correctAnswer: 0
        },
        {
          question: "What will the man do this afternoon?",
          options: ["Visit the restaurant", "Pay an invoice", "Send out a menu", "Call the caterer"],
          correctAnswer: 3
        }
      ]
    },
    {
      conversation: [
        { speaker: "W", text: "Good morning, Horizon Travel, this is Priya." },
        { speaker: "M", text: "Hi, this is Tom Becker. I'm booked on the eight a.m. flight to Denver on Monday, but my meeting there was moved to the afternoon. Is there a later flight?" },
        { speaker: "W", text: "Let me check. There's an eleven fifteen that arrives at one o'clock, but changing your ticket comes with a fifty-dollar fee." },
        { speaker: "M", text: "That's fine — it's better than waiting at the airport all morning. Does my seat preference carry over?" },
        { speaker: "W", text: "I can request an aisle seat again, yes. I'll email you the updated itinerary within the hour." },
        { speaker: "M", text: "Great, thank you." }
      ],
      questions: [
        {
          question: "Why is the man calling?",
          options: ["To cancel a hotel reservation", "To change a flight", "To confirm a meeting", "To request a refund"],
          correctAnswer: 1
        },
        {
          question: "According to the woman, what does the ticket change require?",
          options: ["An extra fee", "A manager's approval", "A new reservation number", "A different airline"],
          correctAnswer: 0
        },
        {
          question: "What will the woman send the man?",
          options: ["A refund confirmation", "A boarding pass", "An updated itinerary", "A meeting agenda"],
          correctAnswer: 2
        }
      ]
    },
    {
      conversation: [
        { speaker: "M", text: "Welcome aboard, Ms. Ito. Before you head to your desk, we need to finish a couple of things. Did you bring your bank details for payroll?" },
        { speaker: "W", text: "Yes, I have them right here. I also filled out the tax forms you emailed me last week." },
        { speaker: "M", text: "Excellent — that saves us time. Next, we'll take your photo for your ID badge. The badge opens the main entrance and the elevator to your floor." },
        { speaker: "W", text: "How long does the badge take to make?" },
        { speaker: "M", text: "About ten minutes. While we wait, I'll show you the break room and introduce you to your team leader." }
      ],
      questions: [
        {
          question: "Who most likely is the man?",
          options: ["A bank teller", "A security guard", "A photographer", "A human resources officer"],
          correctAnswer: 3
        },
        {
          question: "What did the woman do before the meeting?",
          options: ["Completed some tax forms", "Took an ID photo", "Met her team leader", "Opened a bank account"],
          correctAnswer: 0
        },
        {
          question: "What will the speakers do while the badge is being made?",
          options: ["Set up payroll", "Tour part of the office", "Take the elevator to her desk", "Fill out more paperwork"],
          correctAnswer: 1
        }
      ]
    },
    {
      conversation: [
        { speaker: "W", text: "Excuse me — we ordered the grilled salmon about forty minutes ago, and it still hasn't come. We have theater tickets for eight o'clock." },
        { speaker: "M", text: "I'm very sorry for the wait. We're short one cook tonight, and the kitchen is behind. Let me check on your order right away." },
        { speaker: "W", text: "Thank you. If it's going to take much longer, we may have to change it to something quicker." },
        { speaker: "M", text: "I understand. The salmon should be up in about five minutes, and I'll bring your desserts on the house to apologize for the delay." },
        { speaker: "W", text: "That's very kind — thank you." }
      ],
      questions: [
        {
          question: "Where does the conversation most likely take place?",
          options: ["At a theater", "At a restaurant", "At a grocery store", "In a hotel lobby"],
          correctAnswer: 1
        },
        {
          question: "Why has the order been delayed?",
          options: ["The salmon is sold out", "The order was written down incorrectly", "Some kitchen equipment broke", "The restaurant is missing a cook"],
          correctAnswer: 3
        },
        {
          question: "What does the man offer the woman?",
          options: ["A discount on the meal", "A faster dish", "Free desserts", "Tickets to a show"],
          correctAnswer: 2
        }
      ]
    },
    {
      conversation: [
        { speaker: "M", text: "Good evening. I'm checking in — the name is Okafor, reservation for three nights." },
        { speaker: "W", text: "Welcome, Mr. Okafor. I see your reservation. Unfortunately, the king room you booked isn't ready because of a plumbing repair. I can offer you a suite on the top floor at no extra charge." },
        { speaker: "M", text: "A free upgrade? I certainly won't say no to that. Is breakfast still included?" },
        { speaker: "W", text: "Yes, breakfast is served in the lobby restaurant from six thirty to ten. And since the suite has a coffee machine, we'll also send up a welcome basket tonight." },
        { speaker: "M", text: "Wonderful. Could someone help with my bags? I have some heavy sample cases for a trade show." },
        { speaker: "W", text: "Of course — the porter will bring them up right away." }
      ],
      questions: [
        {
          question: "Where most likely are the speakers?",
          options: ["At an airport", "At a trade show", "At a hotel", "At a restaurant"],
          correctAnswer: 2
        },
        {
          question: "Why is the man's original room unavailable?",
          options: ["It was double-booked", "It is being repaired", "It is being cleaned", "The hotel is fully booked"],
          correctAnswer: 1
        },
        {
          question: "What does the man ask for?",
          options: ["Help with his luggage", "A late breakfast", "A coffee machine", "A room on a lower floor"],
          correctAnswer: 0
        }
      ]
    },
    {
      conversation: [
        { speaker: "W", text: "Marcus, the new designers start next month, and we're short two desks. Should we order the same model we bought last year?" },
        { speaker: "M", text: "That model's been discontinued, actually. But the supplier has a similar one — adjustable height, and it's ten percent cheaper." },
        { speaker: "W", text: "Adjustable desks? The design team will love that. How soon can they deliver?" },
        { speaker: "M", text: "Normally two weeks, but if we order before Friday, we qualify for their month-end promotion — free assembly and delivery within one week." },
        { speaker: "W", text: "Then let's not wait. Send me the quote today and I'll get the budget approved by tomorrow morning." }
      ],
      questions: [
        {
          question: "What are the speakers mainly discussing?",
          options: ["Hiring new designers", "Ordering office furniture", "Repairing some desks", "Choosing a new supplier"],
          correctAnswer: 1
        },
        {
          question: "What does the man say about the old desk model?",
          options: ["It is too expensive", "It arrived damaged", "It cannot be adjusted", "It is no longer available"],
          correctAnswer: 3
        },
        {
          question: "What will the woman do by tomorrow morning?",
          options: ["Place the order", "Assemble the desks", "Get budget approval", "Contact the supplier"],
          correctAnswer: 2
        }
      ]
    },
    {
      conversation: [
        { speaker: "M", text: "IT help desk, this is Kevin." },
        { speaker: "W", text: "Hi Kevin, it's Laura in Accounting. My laptop won't connect to the network since this morning's update, and I can't open the shared drive." },
        { speaker: "M", text: "You're the third caller today — the update changed some security settings. Have you tried restarting?" },
        { speaker: "W", text: "Twice, but no luck. I have to submit the payroll file by three o'clock, so I'm getting nervous." },
        { speaker: "M", text: "Understood. I'll push a fix to your machine remotely — it takes about fifteen minutes. If you're still offline after that, I'll bring you a loaner laptop so you don't miss your deadline." },
        { speaker: "W", text: "Thank you, that's a relief." }
      ],
      questions: [
        {
          question: "What problem is the woman having?",
          options: ["Her laptop cannot connect to the network", "Her password expired", "Her payroll file was deleted", "Her office door is locked"],
          correctAnswer: 0
        },
        {
          question: "What most likely caused the problem?",
          options: ["An old laptop", "A software update", "A power outage", "A wrong password"],
          correctAnswer: 1
        },
        {
          question: "What does the man say he will do if the fix fails?",
          options: ["Restart the server", "Extend her deadline", "Call her back tomorrow", "Provide a replacement laptop"],
          correctAnswer: 3
        }
      ]
    },
    {
      conversation: [
        { speaker: "W", text: "Mr. Reyes, this is Anna from Coastal Office Supply. I'm calling about your order of filing cabinets. There's been a delay at our warehouse." },
        { speaker: "M", text: "Oh no. We're moving into our new office on the twentieth — will they arrive by then?" },
        { speaker: "W", text: "The gray cabinets you ordered are back-ordered until the twenty-fifth. However, we have the same model in black in stock, and we can deliver those by the eighteenth." },
        { speaker: "M", text: "Hmm, black would actually match our new shelving. Is the price the same?" },
        { speaker: "W", text: "Exactly the same, and we'll take ten percent off for the inconvenience." },
        { speaker: "M", text: "That works. Please switch the order to black." }
      ],
      questions: [
        {
          question: "Why is the woman calling?",
          options: ["To confirm a payment", "To announce a new product", "To report a shipping delay", "To schedule an office move"],
          correctAnswer: 2
        },
        {
          question: "What does the woman offer?",
          options: ["A different color at a discount", "Free shelving", "A faster shipping company", "A full refund"],
          correctAnswer: 0
        },
        {
          question: "What does the man decide to do?",
          options: ["Cancel the order", "Wait until the twenty-fifth", "Postpone the office move", "Accept the black cabinets"],
          correctAnswer: 3
        }
      ]
    },
    {
      conversation: [
        { speaker: "M", text: "Hi, Sandra. Did you see the announcement about the new employee fitness benefit?" },
        { speaker: "W", text: "I skimmed the email. The company covers half the membership at Riverside Gym, right?" },
        { speaker: "M", text: "Half at Riverside, or forty dollars a month toward any other gym. You just have to submit the receipt through the benefits portal each month." },
        { speaker: "W", text: "That's generous. Is there a deadline to sign up?" },
        { speaker: "M", text: "Enrollment closes at the end of this month. After that, the next chance isn't until January." },
        { speaker: "W", text: "Then I'd better register this week. I've been meaning to get back to swimming anyway." }
      ],
      questions: [
        {
          question: "What are the speakers discussing?",
          options: ["A new fitness benefit", "A gym renovation", "A swimming competition", "A change in work hours"],
          correctAnswer: 0
        },
        {
          question: "According to the man, what must employees do each month?",
          options: ["Visit Riverside Gym", "Submit a receipt", "Pay forty dollars", "Renew their membership"],
          correctAnswer: 1
        },
        {
          question: "What does the woman say she will do?",
          options: ["Wait until January", "Cancel her membership", "Ask about the deadline", "Register this week"],
          correctAnswer: 3
        }
      ]
    },
    {
      conversation: [
        { speaker: "W", text: "All right, last item — the logistics conference in Atlanta. Jae, did you register our team?" },
        { speaker: "M", text: "I registered you and me last week. Early-bird pricing ends tomorrow, so if Omar is coming, we should book his spot today." },
        { speaker: "M2", text: "I'd like to go — my session proposal on green shipping was accepted, so I'll be presenting on the second day." },
        { speaker: "W", text: "Congratulations, Omar! In that case, your registration is free as a presenter. Jae, can you double-check that with the organizers?" },
        { speaker: "M", text: "Sure, I'll email them this afternoon and copy you both." },
        { speaker: "M2", text: "Thanks. I'll forward you the acceptance letter in case they ask for it." }
      ],
      questions: [
        {
          question: "What event are the speakers discussing?",
          options: ["A training seminar", "A conference in Atlanta", "A shipping deadline", "A team celebration"],
          correctAnswer: 1
        },
        {
          question: "Why might Omar's registration be free?",
          options: ["He registered early", "He is a student", "He is presenting a session", "He won a prize"],
          correctAnswer: 2
        },
        {
          question: "What will Jae do this afternoon?",
          options: ["Book a hotel", "Forward an acceptance letter", "Prepare a presentation", "Email the organizers"],
          correctAnswer: 3
        }
      ]
    },
    {
      conversation: [
        { speaker: "M", text: "Hi, I bought this wireless keyboard here last Tuesday, but several keys stopped working yesterday. I'd like to exchange it." },
        { speaker: "W", text: "I'm sorry about that. Do you have your receipt?" },
        { speaker: "M", text: "I have the email receipt on my phone — here it is." },
        { speaker: "W", text: "Perfect. We have the same model in stock, or for fifteen dollars more you could take the newer version with a two-year warranty instead of one." },
        { speaker: "M", text: "The longer warranty sounds worthwhile. I'll pay the difference." },
        { speaker: "W", text: "Great choice. I'll process the exchange at register two — it'll just take a minute." }
      ],
      questions: [
        {
          question: "Why is the man at the store?",
          options: ["To buy a phone", "To ask about a warranty", "To return a defective keyboard", "To pick up an online order"],
          correctAnswer: 2
        },
        {
          question: "What does the woman ask the man for?",
          options: ["Proof of purchase", "The original packaging", "A credit card", "His phone number"],
          correctAnswer: 0
        },
        {
          question: "What does the man decide to do?",
          options: ["Get a full refund", "Pay extra for a newer model", "Keep the keyboard", "Come back on Tuesday"],
          correctAnswer: 1
        }
      ]
    }
  ],

  part4: [
    {
      type: "announcement",
      talk: "Attention, passengers on Skyline Air flight two seventy-one to Portland. Due to a scheduling change, this flight will now depart from gate B fourteen instead of gate B six. Boarding will begin at four twenty, ten minutes later than originally planned. Passengers needing extra assistance, and those traveling with small children, are invited to board first. Please have your boarding pass and photo identification ready. We apologize for any inconvenience and thank you for choosing Skyline Air.",
      questions: [
        {
          question: "Where is the announcement being made?",
          options: ["At a train station", "At an airport", "On an airplane", "At a bus terminal"],
          correctAnswer: 1
        },
        {
          question: "What change is announced?",
          options: ["A new departure gate", "A flight cancellation", "A different destination", "A crew replacement"],
          correctAnswer: 0
        },
        {
          question: "Who is invited to board first?",
          options: ["Business-class passengers", "Frequent flyers", "Passengers with small children", "Airline employees"],
          correctAnswer: 2
        }
      ]
    },
    {
      type: "telephone message",
      talk: "Hello, this message is for Karen Doyle. This is Sam from Fairview Print Shop, calling about the two hundred brochures you ordered for the trade fair. Unfortunately, the glossy paper you selected is out of stock until next Wednesday, which is after your pickup date. We do have a matte paper of the same weight, and honestly, the colors look just as sharp. If that works for you, we can still have everything ready by Friday at noon. Please call me back at five five five, zero one four two, before the end of the day so we can keep your order on schedule. Thanks.",
      questions: [
        {
          question: "Why is the speaker calling?",
          options: ["To confirm a delivery address", "To report a problem with an order", "To cancel a trade fair", "To offer a discount"],
          correctAnswer: 1
        },
        {
          question: "What does the speaker suggest?",
          options: ["Delaying the trade fair", "Ordering fewer brochures", "Picking up on Wednesday", "Using a different paper"],
          correctAnswer: 3
        },
        {
          question: "What does the speaker ask the listener to do?",
          options: ["Return his call today", "Visit the shop on Friday", "Pay in advance", "Choose new colors"],
          correctAnswer: 0
        }
      ]
    },
    {
      type: "advertisement",
      talk: "Is your office relocating? Let Beacon Movers do the heavy lifting. For over twenty years, Beacon has helped businesses across the region move desks, files, and equipment quickly and safely. Most office moves are completed over a single weekend, so your team never misses a workday. Our staff pack, label, and reassemble everything, and every move is fully insured. This month only, book online and receive free packing materials plus ten percent off your total. Visit beacon movers dot com for a free estimate today.",
      questions: [
        {
          question: "What service is being advertised?",
          options: ["Office cleaning", "Furniture repair", "Business relocation", "Storage rental"],
          correctAnswer: 2
        },
        {
          question: "According to the advertisement, why are weekend moves an advantage?",
          options: ["Rates are lower on weekends", "Employees do not miss work", "Traffic is lighter", "More trucks are available"],
          correctAnswer: 1
        },
        {
          question: "How can customers receive a discount?",
          options: ["By booking online this month", "By paying in cash", "By referring a friend", "By moving on a weekday"],
          correctAnswer: 0
        }
      ]
    },
    {
      type: "excerpt from a meeting",
      talk: "Next on the agenda: third-quarter results. Overall sales rose six percent, but the numbers tell two different stories. Our online store grew twenty percent, while sales at our retail locations actually fell slightly. Customers clearly like the free-shipping program we launched in July, so we'll extend it through the holiday season. As for the stores, I'm asking each branch manager to send me three ideas for improving foot traffic by next Friday. We'll pick the strongest proposals and test them in the Riverside branch first.",
      questions: [
        {
          question: "What is the speaker mainly discussing?",
          options: ["A store opening", "Hiring branch managers", "A holiday schedule", "Quarterly sales results"],
          correctAnswer: 3
        },
        {
          question: "What does the speaker say about the free-shipping program?",
          options: ["It will be extended", "It will end in July", "It was too expensive", "It applies to stores only"],
          correctAnswer: 0
        },
        {
          question: "What are branch managers asked to do?",
          options: ["Visit the Riverside branch", "Submit ideas by Friday", "Reduce store expenses", "Launch an online store"],
          correctAnswer: 1
        }
      ]
    },
    {
      type: "talk",
      talk: "Welcome to the Harborview Maritime Museum. My name is Elena, and I'll be your guide for the next hour. We'll begin here in the main hall with the shipbuilding exhibit, then move upstairs to see navigation instruments from the eighteen hundreds. Please don't touch the displays, but feel free to take photographs anywhere except the model-ship room. At the end of the tour, you'll each receive a coupon for ten percent off at the museum café. If you have questions at any point, just raise your hand. All right, follow me.",
      questions: [
        {
          question: "Who most likely is the speaker?",
          options: ["A museum guide", "A ship captain", "A café manager", "A photographer"],
          correctAnswer: 0
        },
        {
          question: "What are listeners asked not to do?",
          options: ["Take photographs in the main hall", "Ask questions during the tour", "Touch the displays", "Go upstairs"],
          correctAnswer: 2
        },
        {
          question: "What will listeners receive at the end of the tour?",
          options: ["A model ship", "A free guidebook", "A museum membership", "A café coupon"],
          correctAnswer: 3
        }
      ]
    },
    {
      type: "announcement",
      talk: "Attention, Milton's Market shoppers. The store will be closing in fifteen minutes. Please bring your final selections to the registers at the front of the store. As a reminder, our bakery counter is already closed, but freshly baked bread is still available in aisle three. Starting next Monday, we'll be open until ten p.m. on weeknights to serve you better. Also, don't forget to scan your rewards card at checkout to earn double points this week. Thank you for shopping at Milton's, and we'll see you again soon.",
      questions: [
        {
          question: "Where most likely is this announcement being heard?",
          options: ["At a bakery school", "In a grocery store", "At a farmers market", "In a restaurant"],
          correctAnswer: 1
        },
        {
          question: "What change will begin next Monday?",
          options: ["Longer weeknight hours", "A new bakery counter", "Double reward points", "A store renovation"],
          correctAnswer: 0
        },
        {
          question: "What are shoppers reminded to do at checkout?",
          options: ["Show a coupon", "Bring their own bags", "Scan a rewards card", "Pay in cash"],
          correctAnswer: 2
        }
      ]
    },
    {
      type: "telephone message",
      talk: "Hi, this message is for Marcus Webb. This is Diane Fuller, hiring manager at Northgate Logistics. Thank you for applying for the operations coordinator position. We were impressed with your résumé, and we'd like to invite you for an interview next week. We have openings Tuesday at ten or Thursday at two — whichever suits you better. The interview will last about an hour and include a short scheduling exercise, so no special preparation is needed. Please reply to my email or call the office at five five five, zero one nine three, to confirm a time. We look forward to meeting you.",
      questions: [
        {
          question: "Why is the speaker calling?",
          options: ["To offer the listener a job", "To arrange an interview", "To request a résumé", "To reschedule a meeting"],
          correctAnswer: 1
        },
        {
          question: "What does the speaker say about the interview?",
          options: ["It will be held online", "It requires a written report", "It includes a driving test", "It will last about an hour"],
          correctAnswer: 3
        },
        {
          question: "How should the listener confirm a time?",
          options: ["By visiting the office", "By submitting a form", "By replying to an email or calling", "By sending a text message"],
          correctAnswer: 2
        }
      ]
    },
    {
      type: "advertisement",
      talk: "Planning a business trip or a weekend getaway? Rent smarter with Velocity Car Rental. Choose from compact cars, comfortable sedans, and spacious SUVs — all less than two years old and cleaned before every rental. Every booking includes unlimited mileage and twenty-four-hour roadside assistance at no extra cost. Need a car at the last minute? Reserve on our mobile app and your keys will be ready in under five minutes at any of our forty airport locations. This week, app users get a free upgrade to the next vehicle class. Velocity Car Rental — arrive ready.",
      questions: [
        {
          question: "What is being advertised?",
          options: ["A travel agency", "A mobile phone plan", "An airline", "A car rental company"],
          correctAnswer: 3
        },
        {
          question: "What is included with every booking?",
          options: ["A free upgrade", "Unlimited mileage", "Airport parking", "A full tank of gas"],
          correctAnswer: 1
        },
        {
          question: "What can customers get this week by using the app?",
          options: ["A vehicle upgrade", "A discount coupon", "Faster roadside assistance", "Free cleaning"],
          correctAnswer: 0
        }
      ]
    },
    {
      type: "excerpt from a meeting",
      talk: "Before we finish, a quick update on the building's new recycling program. Starting the first of next month, the trash bins at individual desks will be removed. Instead, you'll find sorting stations in each kitchen area with separate bins for paper, plastic, and food waste. Facilities will hold two short training sessions next week to explain what goes where — attendance at one of them is required. The cleaning schedule won't change otherwise. If your team has special disposal needs, like electronics or ink cartridges, email Facilities and they'll arrange a pickup.",
      questions: [
        {
          question: "What is the speaker mainly discussing?",
          options: ["A cleaning company contract", "A new recycling program", "A kitchen renovation", "An office relocation"],
          correctAnswer: 1
        },
        {
          question: "What will happen at the beginning of next month?",
          options: ["Desk trash bins will be removed", "The cleaning schedule will change", "New kitchens will open", "Training sessions will end"],
          correctAnswer: 0
        },
        {
          question: "What should employees with electronics to dispose of do?",
          options: ["Attend an extra training session", "Use the kitchen bins", "Give items to the cleaning staff", "Email Facilities for a pickup"],
          correctAnswer: 3
        }
      ]
    },
    {
      type: "talk",
      talk: "Good morning, everyone, and welcome to day one of the customer service training program. Over the next three days, you'll learn our call-handling system, practice with recorded customer scenarios, and finally take live calls with a mentor sitting beside you. Today is all about the software, so keep your headsets in the box for now — you won't need them until tomorrow. Lunch is provided in the cafeteria at noon, and we'll take short breaks every ninety minutes. One last thing: please silence your phones, but keep them nearby, because we'll use them to test the callback feature this afternoon.",
      questions: [
        {
          question: "Who most likely are the listeners?",
          options: ["Experienced mentors", "Software developers", "New customer service trainees", "Cafeteria staff"],
          correctAnswer: 2
        },
        {
          question: "When will listeners first use their headsets?",
          options: ["This afternoon", "Tomorrow", "On day three", "At noon"],
          correctAnswer: 1
        },
        {
          question: "Why should listeners keep their phones nearby?",
          options: ["To test a callback feature", "To take live customer calls", "To order lunch", "To record scenarios"],
          correctAnswer: 0
        }
      ]
    }
  ]
};

window.TOEIC_PART6_BANK = [
  {
    passage: "To: All Fitzroy Consulting Staff\nFrom: Elaine Park, Office Manager\nSubject: Parking garage maintenance\n\nDear colleagues,\n\nPlease be aware that the parking garage on Level B will be closed for resurfacing from Monday, August 3, ___(1)___ Friday, August 7. During this period, employees ___(2)___ normally park on Level B may use the visitor spaces behind the building. ___(3)___. If you choose this option, simply show your employee badge to the attendant. We apologize for the inconvenience and appreciate your ___(4)___ while the work is completed.\n\nBest regards,\nElaine Park",
    questions: [
      {
        question: "Which best fits blank (1)?",
        options: ["through", "since", "among", "at"],
        correctAnswer: 0
      },
      {
        question: "Which best fits blank (2)?",
        options: ["whose", "who", "which", "whom"],
        correctAnswer: 1
      },
      {
        question: "Which best fits blank (3)?",
        options: [
          "The visitor spaces were repainted last year.",
          "Level B has the most parking spaces in the building.",
          "Alternatively, discounted daily passes will be available at the city lot on Green Street.",
          "Ms. Park has been the office manager for ten years."
        ],
        correctAnswer: 2
      },
      {
        question: "Which best fits blank (4)?",
        options: ["patient", "patiently", "patients", "patience"],
        correctAnswer: 3
      }
    ]
  },
  {
    passage: "MEMO\n\nTo: All warehouse staff\nFrom: Gordon Hale, Operations Director\nDate: March 2\nRe: New scanner system\n\nBeginning next week, all outgoing shipments must be scanned with the new handheld scanners ___(1)___ they leave the loading dock. The devices ___(2)___ to each shift supervisor yesterday, and every team member will receive one after completing a brief training. ___(3)___. Until then, please continue using the paper checklists. We expect the new system to reduce shipping errors ___(4)___ nearly half.\n\nThank you for your cooperation.",
    questions: [
      {
        question: "Which best fits blank (1)?",
        options: ["before", "despite", "so that", "unless"],
        correctAnswer: 0
      },
      {
        question: "Which best fits blank (2)?",
        options: ["distribute", "were distributed", "distributing", "have distributed"],
        correctAnswer: 1
      },
      {
        question: "Which best fits blank (3)?",
        options: [
          "The loading dock was expanded two years ago.",
          "Shipping errors are difficult to measure.",
          "Most staff prefer the morning shift.",
          "Training sessions will be held in the break room each morning through Friday."
        ],
        correctAnswer: 3
      },
      {
        question: "Which best fits blank (4)?",
        options: ["at", "on", "by", "with"],
        correctAnswer: 2
      }
    ]
  },
  {
    passage: "NOTICE TO ALL RESIDENTS OF MAPLEWOOD APARTMENTS\n\nAnnual fire alarm testing ___(1)___ place on Tuesday, April 14, between 9:00 A.M. and noon. Technicians will need to enter every unit briefly to test the alarm inside. You do not need to be home; building staff will accompany the technicians ___(2)___ a resident is not present. ___(3)___. The alarms are loud, so residents who work from home may wish to plan ___(4)___ schedules around the testing hours. Questions may be directed to the management office at 555-0117.",
    questions: [
      {
        question: "Which best fits blank (1)?",
        options: ["taking", "will take", "to take", "taken"],
        correctAnswer: 1
      },
      {
        question: "Which best fits blank (2)?",
        options: ["although", "so", "if", "despite"],
        correctAnswer: 2
      },
      {
        question: "Which best fits blank (3)?",
        options: [
          "The building was constructed in 1998.",
          "Fire extinguishers are sold at most hardware stores.",
          "The rooftop garden will reopen in May.",
          "Each visit is expected to last no more than ten minutes."
        ],
        correctAnswer: 3
      },
      {
        question: "Which best fits blank (4)?",
        options: ["their", "theirs", "them", "themselves"],
        correctAnswer: 0
      }
    ]
  },
  {
    passage: "LOCAL BUSINESS NEWS — Harper's Bakery Expands\n\nGREENVILLE — Harper's Bakery, a downtown favorite for more than a decade, will open its second location on Cedar Avenue next month. Owner Alicia Harper said the decision came after customers repeatedly asked for a shop ___(1)___ the business district. ___(2)___. The new café will seat forty guests and offer the same breads and pastries ___(3)___ made the original store popular. Ms. Harper plans to hire twelve employees for the new location, and applications ___(4)___ accepted through the end of the month.",
    questions: [
      {
        question: "Which best fits blank (1)?",
        options: ["onto", "among", "near", "between"],
        correctAnswer: 2
      },
      {
        question: "Which best fits blank (2)?",
        options: [
          "A survey conducted last spring showed that nearly half of its weekday customers commute from nearby offices.",
          "Cedar Avenue was repaved last year.",
          "Ms. Harper studied art history in college.",
          "The original store closes early on Sundays."
        ],
        correctAnswer: 0
      },
      {
        question: "Which best fits blank (3)?",
        options: ["what", "that", "who", "whose"],
        correctAnswer: 1
      },
      {
        question: "Which best fits blank (4)?",
        options: ["is", "has been", "being", "will be"],
        correctAnswer: 3
      }
    ]
  }
];
