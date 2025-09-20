// TOEIC Reading Comprehension System
// Handles reading passages, questions, and comprehension exercises

class TOEICReadingSystem {
    constructor() {
        this.passages = new Map();
        this.questions = new Map();
        this.userProgress = new Map();
        this.currentSession = null;
        this.sessionStats = {
            totalQuestions: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            timeSpent: 0,
            startTime: null
        };
        
        this.questionTypes = {
            'incomplete_sentences': {
                name: 'Incomplete Sentences',
                description: 'Choose the word or phrase that best completes the sentence',
                timeLimit: 30, // seconds per question
                points: 1
            },
            'text_completion': {
                name: 'Text Completion',
                description: 'Read the text and choose the word or phrase that best fits each blank',
                timeLimit: 45,
                points: 1
            },
            'reading_comprehension': {
                name: 'Reading Comprehension',
                description: 'Read the passage and answer questions about it',
                timeLimit: 60,
                points: 2
            }
        };
        
        this.loadReadingMaterials();
        this.loadUserProgress();
        
        console.log('📖 TOEIC Reading System initialized');
    }
    
    async loadReadingMaterials() {
        try {
            // Load reading passages and questions
            await this.loadPassages();
            await this.loadQuestions();
            console.log(`✅ Loaded ${this.passages.size} passages and ${this.questions.size} questions`);
        } catch (error) {
            console.error('❌ Error loading reading materials:', error);
            this.loadFallbackMaterials();
        }
    }
    
    async loadPassages() {
        // Business email passages
        const emailPassages = [
            {
                id: 'email_001',
                type: 'business_email',
                title: 'Meeting Request',
                content: `Dear Mr. Johnson,

I hope this email finds you well. I am writing to request a meeting to discuss the upcoming project proposal that we submitted last week. 

As you know, our team has been working diligently on the comprehensive market analysis, and we believe we have some valuable insights to share with you. The preliminary results show significant opportunities in the European market, particularly in the technology sector.

I would appreciate the opportunity to present our findings and discuss potential strategies for moving forward. I am available for a meeting next Tuesday or Wednesday afternoon, whichever works better for your schedule.

Please let me know your availability, and I will arrange the meeting room accordingly. I look forward to hearing from you soon.

Best regards,
Sarah Williams
Project Manager
Innovation Solutions Inc.`,
                wordCount: 120,
                difficulty: 'B1',
                category: 'business_communication'
            },
            {
                id: 'email_003',
                type: 'business_email',
                title: 'Customer Complaint Response',
                content: `Dear Ms. Rodriguez,

Thank you for bringing this matter to our attention. We sincerely apologize for the inconvenience you experienced with our delivery service last week.

After reviewing your complaint, I can confirm that there was indeed a delay in processing your order due to an unexpected system outage in our warehouse. This is not the level of service we strive to provide, and we have already implemented additional backup systems to prevent similar issues in the future.

As a gesture of goodwill, we would like to offer you a full refund for your order, plus a 20% discount on your next purchase. Additionally, we will expedite the shipping of your replacement items at no extra cost.

Our customer service team will contact you within 24 hours to arrange the refund and discuss the replacement order. We value your business and hope to restore your confidence in our services.

Thank you for your patience and understanding.

Sincerely,
Michael Chen
Customer Relations Manager
QuickShip Logistics`,
                wordCount: 150,
                difficulty: 'B2',
                category: 'customer_service'
            },
            {
                id: 'email_004',
                type: 'business_email',
                title: 'Project Status Update',
                content: `Subject: Q3 Project Status Update

Dear Team,

I hope this message finds you all well. I wanted to provide you with an update on our current projects and upcoming milestones for the third quarter.

The website redesign project is progressing ahead of schedule, with the new user interface now 85% complete. Our development team has successfully integrated the new payment system, and user testing has shown a 40% improvement in checkout completion rates.

The mobile application development is also on track, with the beta version scheduled for release next Friday. We have received positive feedback from our focus groups, particularly regarding the improved navigation and faster loading times.

However, we are experiencing some challenges with the database migration project. The technical team has identified compatibility issues that may require an additional two weeks to resolve. I will keep you updated on this matter as we work through the solutions.

Please note that the quarterly review meeting has been moved to October 15th at 2:00 PM in the main conference room. All project managers are required to attend and present their current status reports.

Thank you for your continued dedication and hard work.

Best regards,
Jennifer Park
Project Director
TechForward Solutions`,
                wordCount: 180,
                difficulty: 'B2',
                category: 'project_management'
            },
            {
                id: 'email_005',
                type: 'business_email',
                title: 'Training Program Invitation',
                content: `Dear Colleagues,

We are excited to announce the launch of our new professional development program, "Leadership Excellence 2024." This comprehensive training initiative is designed to enhance your leadership skills and prepare you for future career advancement opportunities.

The program will consist of eight modules covering essential leadership topics including strategic thinking, team management, communication excellence, and change management. Each module will be delivered through a combination of interactive workshops, case study analysis, and peer learning sessions.

Sessions will be held every Tuesday and Thursday from 9:00 AM to 11:00 AM, starting March 1st. The program is open to all employees at the manager level and above, and we encourage participation from those aspiring to leadership roles.

To register for the program, please complete the online application form by February 20th. Space is limited to 25 participants per cohort, so early registration is recommended. The program is fully funded by the company, and participants will receive a certificate upon successful completion.

We believe this investment in your professional development will not only benefit your career growth but also contribute to our organization's continued success.

Warm regards,
David Thompson
Human Resources Director
Global Enterprises Inc.`,
                wordCount: 200,
                difficulty: 'B2',
                category: 'human_resources'
            },
            {
                id: 'email_002',
                type: 'business_email',
                title: 'Product Launch Announcement',
                content: `Subject: Exciting News - New Product Launch

Dear Valued Customers,

We are thrilled to announce the launch of our revolutionary new software solution, TechFlow Pro, which will transform the way you manage your business operations.

TechFlow Pro offers advanced features including real-time analytics, automated reporting, and seamless integration with existing systems. Our development team has spent over two years perfecting this product, and we are confident it will exceed your expectations.

The software will be available for download starting next Monday, March 15th. As a valued customer, you will receive a 30% discount on your first year subscription. Additionally, we are offering free training sessions for all users during the first month.

To take advantage of this special offer, please visit our website and use the promotional code LAUNCH30 at checkout. Our customer support team is standing by to assist you with any questions or technical issues.

Thank you for your continued support and trust in our products.

Warm regards,
Michael Chen
CEO
TechFlow Solutions`,
                wordCount: 150,
                difficulty: 'B2',
                category: 'business_communication'
            }
        ];
        
        // News article passages
        const newsPassages = [
            {
                id: 'news_001',
                type: 'news_article',
                title: 'Global Economy Shows Signs of Recovery',
                content: `The global economy is showing encouraging signs of recovery as major economies report positive growth indicators for the third consecutive quarter. According to the latest report from the International Monetary Fund, global GDP is expected to grow by 3.2% this year, marking a significant improvement from last year's contraction.

The recovery has been particularly strong in the technology sector, where companies have adapted quickly to the changing business landscape. E-commerce platforms have seen unprecedented growth, with online sales increasing by 45% compared to pre-pandemic levels.

However, economists warn that the recovery remains uneven across different regions and industries. While developed nations are experiencing robust growth, emerging markets continue to face challenges related to vaccine distribution and supply chain disruptions.

The report also highlights the importance of continued government support for small and medium-sized enterprises, which have been disproportionately affected by the economic downturn. Policy makers are urged to maintain fiscal stimulus measures while gradually transitioning to more sustainable economic policies.

Looking ahead, the IMF predicts that global trade will return to pre-pandemic levels by the end of next year, provided that current vaccination rates continue to improve and supply chain issues are resolved.`,
                wordCount: 180,
                difficulty: 'B2',
                category: 'economics'
            }
        ];
        
        // Advertisement passages
        const adPassages = [
            {
                id: 'ad_001',
                type: 'advertisement',
                title: 'Premium Office Space Available',
                content: `PREMIUM OFFICE SPACE AVAILABLE

Located in the heart of the business district, our modern office complex offers the perfect environment for growing companies. With state-of-the-art facilities and flexible lease terms, we provide everything you need to succeed.

Features include:
• High-speed internet and advanced telecommunications
• 24/7 security and concierge services
• Modern conference rooms with video conferencing capabilities
• On-site parking and easy access to public transportation
• Fitness center and wellness programs for employees

Our flexible lease options allow you to scale up or down as your business needs change. Whether you need a single office or an entire floor, we have the perfect space for your organization.

Special promotion: First three months rent-free for new tenants who sign a two-year lease. This offer is valid until the end of the month and cannot be combined with other promotions.

Contact us today to schedule a tour and see why leading companies choose our facilities for their headquarters.

Call: (555) 123-4567
Email: leasing@premiumoffices.com
Website: www.premiumoffices.com`,
                wordCount: 160,
                difficulty: 'B1',
                category: 'real_estate'
            }
        ];
        
        // Combine all passages
        const allPassages = [...emailPassages, ...newsPassages, ...adPassages];
        
        allPassages.forEach(passage => {
            this.passages.set(passage.id, {
                ...passage,
                questions: [],
                userStats: {
                    timesRead: 0,
                    averageTime: 0,
                    comprehensionScore: 0,
                    lastRead: null
                }
            });
        });
        
        console.log(`✅ Loaded ${allPassages.length} reading passages`);
    }
    
    async loadQuestions() {
        // Questions for email_001
        const email001Questions = [
            {
                id: 'q_email_001_1',
                passageId: 'email_001',
                type: 'reading_comprehension',
                question: 'What is the main purpose of this email?',
                options: [
                    'To request a meeting about a project proposal',
                    'To submit a market analysis report',
                    'To schedule a conference call',
                    'To discuss European market opportunities'
                ],
                correctAnswer: 0,
                explanation: 'The email is requesting a meeting to discuss the project proposal and present findings.',
                difficulty: 'B1'
            },
            {
                id: 'q_email_001_2',
                passageId: 'email_001',
                type: 'reading_comprehension',
                question: 'According to the email, what do the preliminary results show?',
                options: [
                    'Limited opportunities in the European market',
                    'Significant opportunities in the technology sector',
                    'Challenges in the European market',
                    'No clear market trends'
                ],
                correctAnswer: 1,
                explanation: 'The email states that preliminary results show significant opportunities in the European market, particularly in the technology sector.',
                difficulty: 'B1'
            },
            {
                id: 'q_email_001_3',
                passageId: 'email_001',
                type: 'reading_comprehension',
                question: 'When is the sender available for a meeting?',
                options: [
                    'Monday or Tuesday afternoon',
                    'Tuesday or Wednesday afternoon',
                    'Wednesday or Thursday morning',
                    'Thursday or Friday afternoon'
                ],
                correctAnswer: 1,
                explanation: 'The sender mentions being available for a meeting next Tuesday or Wednesday afternoon.',
                difficulty: 'A2'
            }
        ];
        
        // Questions for email_003 (Customer Complaint Response)
        const email003Questions = [
            {
                id: 'q_email_003_1',
                passageId: 'email_003',
                type: 'reading_comprehension',
                question: 'What is the main purpose of this email?',
                options: [
                    'To announce a new delivery service',
                    'To respond to a customer complaint',
                    'To promote a discount offer',
                    'To schedule a meeting'
                ],
                correctAnswer: 1,
                explanation: 'The email is responding to a customer complaint about delivery service issues.',
                difficulty: 'B2'
            },
            {
                id: 'q_email_003_2',
                passageId: 'email_003',
                type: 'reading_comprehension',
                question: 'What caused the delivery delay?',
                options: [
                    'Weather conditions',
                    'System outage in the warehouse',
                    'Staff shortage',
                    'Traffic problems'
                ],
                correctAnswer: 1,
                explanation: 'The email states that the delay was due to an unexpected system outage in the warehouse.',
                difficulty: 'B1'
            },
            {
                id: 'q_email_003_3',
                passageId: 'email_003',
                type: 'reading_comprehension',
                question: 'What compensation is being offered to the customer?',
                options: [
                    'Only a full refund',
                    'Full refund plus 20% discount',
                    'Only a 20% discount',
                    'Free shipping on next order'
                ],
                correctAnswer: 1,
                explanation: 'The company is offering a full refund plus a 20% discount on the next purchase.',
                difficulty: 'B2'
            }
        ];
        
        // Questions for email_004 (Project Status Update)
        const email004Questions = [
            {
                id: 'q_email_004_1',
                passageId: 'email_004',
                type: 'reading_comprehension',
                question: 'What is the completion status of the website redesign project?',
                options: [
                    '50% complete',
                    '75% complete',
                    '85% complete',
                    '95% complete'
                ],
                correctAnswer: 2,
                explanation: 'The email states that the website redesign project is 85% complete.',
                difficulty: 'B1'
            },
            {
                id: 'q_email_004_2',
                passageId: 'email_004',
                type: 'reading_comprehension',
                question: 'What improvement was achieved in the checkout process?',
                options: [
                    '20% improvement',
                    '30% improvement',
                    '40% improvement',
                    '50% improvement'
                ],
                correctAnswer: 2,
                explanation: 'User testing has shown a 40% improvement in checkout completion rates.',
                difficulty: 'B2'
            },
            {
                id: 'q_email_004_3',
                passageId: 'email_004',
                type: 'reading_comprehension',
                question: 'What challenge is mentioned regarding the database migration?',
                options: [
                    'Budget constraints',
                    'Compatibility issues',
                    'Staff availability',
                    'Timeline conflicts'
                ],
                correctAnswer: 1,
                explanation: 'The email mentions compatibility issues that may require an additional two weeks to resolve.',
                difficulty: 'B2'
            },
            {
                id: 'q_email_004_4',
                passageId: 'email_004',
                type: 'reading_comprehension',
                question: 'When is the quarterly review meeting scheduled?',
                options: [
                    'October 10th at 2:00 PM',
                    'October 15th at 2:00 PM',
                    'October 20th at 2:00 PM',
                    'October 25th at 2:00 PM'
                ],
                correctAnswer: 1,
                explanation: 'The quarterly review meeting has been moved to October 15th at 2:00 PM.',
                difficulty: 'A2'
            }
        ];
        
        // Questions for email_005 (Training Program Invitation)
        const email005Questions = [
            {
                id: 'q_email_005_1',
                passageId: 'email_005',
                type: 'reading_comprehension',
                question: 'What is the name of the professional development program?',
                options: [
                    'Leadership Excellence 2023',
                    'Leadership Excellence 2024',
                    'Management Excellence 2024',
                    'Professional Excellence 2024'
                ],
                correctAnswer: 2,
                explanation: 'The program is called "Leadership Excellence 2024."',
                difficulty: 'A2'
            },
            {
                id: 'q_email_005_2',
                passageId: 'email_005',
                type: 'reading_comprehension',
                question: 'How many modules does the program consist of?',
                options: [
                    'Six modules',
                    'Seven modules',
                    'Eight modules',
                    'Nine modules'
                ],
                correctAnswer: 2,
                explanation: 'The program consists of eight modules covering essential leadership topics.',
                difficulty: 'A2'
            },
            {
                id: 'q_email_005_3',
                passageId: 'email_005',
                type: 'reading_comprehension',
                question: 'What is the maximum number of participants per cohort?',
                options: [
                    '20 participants',
                    '25 participants',
                    '30 participants',
                    '35 participants'
                ],
                correctAnswer: 1,
                explanation: 'Space is limited to 25 participants per cohort.',
                difficulty: 'B1'
            },
            {
                id: 'q_email_005_4',
                passageId: 'email_005',
                type: 'reading_comprehension',
                question: 'When is the registration deadline?',
                options: [
                    'February 15th',
                    'February 20th',
                    'February 25th',
                    'March 1st'
                ],
                correctAnswer: 1,
                explanation: 'The online application form must be completed by February 20th.',
                difficulty: 'B1'
            }
        ];
        
        // Questions for news_001
        const news001Questions = [
            {
                id: 'q_news_001_1',
                passageId: 'news_001',
                type: 'reading_comprehension',
                question: 'What is the expected global GDP growth this year?',
                options: [
                    '2.1%',
                    '3.2%',
                    '4.5%',
                    '5.2%'
                ],
                correctAnswer: 1,
                explanation: 'The article states that global GDP is expected to grow by 3.2% this year.',
                difficulty: 'B1'
            },
            {
                id: 'q_news_001_2',
                passageId: 'news_001',
                type: 'reading_comprehension',
                question: 'Which sector has shown particularly strong recovery?',
                options: [
                    'Manufacturing',
                    'Technology',
                    'Agriculture',
                    'Healthcare'
                ],
                correctAnswer: 1,
                explanation: 'The article mentions that the recovery has been particularly strong in the technology sector.',
                difficulty: 'B1'
            }
        ];
        
        // Incomplete sentences questions
        const incompleteSentences = [
            {
                id: 'q_incomplete_001',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'The company\'s profits have increased significantly _____ the new marketing strategy.',
                options: [
                    'because',
                    'because of',
                    'due',
                    'owing'
                ],
                correctAnswer: 1,
                explanation: '"Because of" is used before a noun phrase to show reason.',
                difficulty: 'B1'
            },
            {
                id: 'q_incomplete_002',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'All employees _____ attend the mandatory training session next week.',
                options: [
                    'must',
                    'should',
                    'could',
                    'might'
                ],
                correctAnswer: 0,
                explanation: '"Must" is used to express strong obligation or necessity.',
                difficulty: 'A2'
            },
            {
                id: 'q_incomplete_003',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'The meeting has been postponed _____ further notice.',
                options: [
                    'until',
                    'for',
                    'since',
                    'during'
                ],
                correctAnswer: 0,
                explanation: '"Until" is used to indicate the time when something will happen.',
                difficulty: 'B1'
            },
            {
                id: 'q_incomplete_004',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'The new software system will be implemented _____ the end of this month.',
                options: [
                    'by',
                    'until',
                    'since',
                    'during'
                ],
                correctAnswer: 0,
                explanation: '"By" is used to indicate a deadline or time limit.',
                difficulty: 'B1'
            },
            {
                id: 'q_incomplete_005',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'Our sales team has exceeded their targets _____ 25% this quarter.',
                options: [
                    'by',
                    'for',
                    'with',
                    'in'
                ],
                correctAnswer: 0,
                explanation: '"By" is used to indicate the amount or degree of increase.',
                difficulty: 'B2'
            },
            {
                id: 'q_incomplete_006',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'The conference room is equipped _____ the latest presentation technology.',
                options: [
                    'with',
                    'by',
                    'for',
                    'in'
                ],
                correctAnswer: 0,
                explanation: '"Equipped with" is the correct prepositional phrase.',
                difficulty: 'B1'
            },
            {
                id: 'q_incomplete_007',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'We need to review the contract _____ signing it.',
                options: [
                    'before',
                    'after',
                    'while',
                    'during'
                ],
                correctAnswer: 0,
                explanation: '"Before" indicates the action that should happen first.',
                difficulty: 'A2'
            },
            {
                id: 'q_incomplete_008',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'The project deadline has been extended _____ two weeks.',
                options: [
                    'for',
                    'by',
                    'until',
                    'since'
                ],
                correctAnswer: 0,
                explanation: '"For" is used to indicate duration of time.',
                difficulty: 'B1'
            }
        ];
        
        // Text completion questions
        const textCompletion = [
            {
                id: 'q_text_001',
                passageId: null,
                type: 'text_completion',
                passage: `Dear Team,

I am writing to inform you about the upcoming changes to our company policies. Starting next month, we will be implementing a new remote work policy that will allow employees to work from home up to three days per week.

This change is being made in response to employee feedback and the success we have seen with remote work during the past year. We believe this policy will improve work-life balance and increase job satisfaction.

Please note that this policy applies to all full-time employees. If you have any questions about how this policy affects your specific role, please contact your supervisor or the human resources department.

Thank you for your continued dedication to our company.

Best regards,
HR Department`,
                questions: [
                    {
                        question: 'What is the main topic of this memo?',
                        options: [
                            'New remote work policy',
                            'Employee feedback system',
                            'Work-life balance programs',
                            'Human resources procedures'
                        ],
                        correctAnswer: 0,
                        explanation: 'The memo is primarily about implementing a new remote work policy.'
                    },
                    {
                        question: 'How many days per week can employees work from home?',
                        options: [
                            'Two days',
                            'Three days',
                            'Four days',
                            'Five days'
                        ],
                        correctAnswer: 1,
                        explanation: 'The memo states that employees can work from home up to three days per week.'
                    }
                ],
                difficulty: 'B1'
            }
        ];
        
        // Combine all questions
        const allQuestions = [
            ...email001Questions,
            ...email003Questions,
            ...email004Questions,
            ...email005Questions,
            ...news001Questions,
            ...incompleteSentences,
            ...textCompletion
        ];
        
        allQuestions.forEach(question => {
            this.questions.set(question.id, {
                ...question,
                userStats: {
                    timesAnswered: 0,
                    correctCount: 0,
                    incorrectCount: 0,
                    averageTime: 0,
                    lastAnswered: null
                }
            });
        });
        
        // Link questions to passages
        this.linkQuestionsToPassages();
        
        console.log(`✅ Loaded ${this.questions.size} reading questions`);
    }
    
    linkQuestionsToPassages() {
        for (const [questionId, question] of this.questions) {
            if (question.passageId) {
                const passage = this.passages.get(question.passageId);
                if (passage) {
                    passage.questions.push(questionId);
                }
            }
        }
    }
    
    loadFallbackMaterials() {
        // Fallback materials for offline use
        const fallbackPassage = {
            id: 'fallback_001',
            type: 'business_email',
            title: 'Sample Business Email',
            content: `Dear Colleagues,

I hope this message finds you well. I am writing to update you on our quarterly performance and upcoming projects.

Our team has achieved excellent results this quarter, exceeding our targets by 15%. This success is due to the hard work and dedication of all team members.

Looking ahead, we have several exciting projects planned for the next quarter. I will be scheduling individual meetings with each department to discuss specific goals and expectations.

Thank you for your continued commitment to excellence.

Best regards,
Management`,
            wordCount: 80,
            difficulty: 'B1',
            category: 'business_communication'
        };
        
        this.passages.set(fallbackPassage.id, fallbackPassage);
        
        const fallbackQuestion = {
            id: 'q_fallback_001',
            passageId: 'fallback_001',
            type: 'reading_comprehension',
            question: 'What is the main purpose of this email?',
            options: [
                'To announce a new project',
                'To update on quarterly performance',
                'To schedule a meeting',
                'To request feedback'
            ],
            correctAnswer: 2,
            explanation: 'The email is updating colleagues on quarterly performance and upcoming projects.',
            difficulty: 'B1'
        };
        
        this.questions.set(fallbackQuestion.id, fallbackQuestion);
        
        console.log('⚠️ Using fallback reading materials');
    }
    
    loadUserProgress() {
        try {
            const savedProgress = localStorage.getItem('toeicReadingProgress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                this.userProgress = new Map(Object.entries(progress));
                console.log('✅ Loaded reading progress');
            }
        } catch (error) {
            console.error('❌ Error loading reading progress:', error);
        }
    }
    
    saveUserProgress() {
        try {
            const progressObj = Object.fromEntries(this.userProgress);
            localStorage.setItem('toeicReadingProgress', JSON.stringify(progressObj));
        } catch (error) {
            console.error('❌ Error saving reading progress:', error);
        }
    }
    
    // Start a reading comprehension session
    startSession(options = {}) {
        console.log('🔍 startSession called with options:', options);
        console.log('🔍 passages size:', this.passages.size);
        console.log('🔍 questions size:', this.questions.size);
        
        this.sessionStats = {
            totalQuestions: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            timeSpent: 0,
            startTime: Date.now()
        };
        
        const questionType = options.type || 'mixed';
        const difficulty = options.difficulty || 'mixed';
        const count = options.count || 20;
        
        console.log('🔍 Generating session with:', { questionType, difficulty, count });
        
        this.currentSession = this.generateSession(questionType, difficulty, count);
        this.currentQuestionIndex = 0; // Initialize question index
        this.sessionStats.totalQuestions = this.currentSession.length;
        
        console.log('🔍 Generated session:', this.currentSession);
        console.log(`📖 Started TOEIC reading session with ${this.currentSession.length} questions`);
        return this.currentSession;
    }
    
    generateSession(type, difficulty, count) {
        console.log('🔍 generateSession called with:', { type, difficulty, count });
        
        let availableQuestions = Array.from(this.questions.values());
        console.log('🔍 Total available questions:', availableQuestions.length);
        
        // Filter by type
        if (type !== 'mixed') {
            availableQuestions = availableQuestions.filter(q => q.type === type);
            console.log('🔍 After type filter:', availableQuestions.length);
        }
        
        // Filter by difficulty
        if (difficulty !== 'mixed') {
            availableQuestions = availableQuestions.filter(q => q.difficulty === difficulty);
            console.log('🔍 After difficulty filter:', availableQuestions.length);
        }
        
        // Sort by user performance (show weaker areas first)
        availableQuestions.sort((a, b) => {
            const aStats = this.userProgress.get(a.id) || { correctCount: 0, incorrectCount: 0 };
            const bStats = this.userProgress.get(b.id) || { correctCount: 0, incorrectCount: 0 };
            
            const aAccuracy = aStats.correctCount + aStats.incorrectCount > 0 ? 
                aStats.correctCount / (aStats.correctCount + aStats.incorrectCount) : 0.5;
            const bAccuracy = bStats.correctCount + bStats.incorrectCount > 0 ? 
                bStats.correctCount / (bStats.correctCount + bStats.incorrectCount) : 0.5;
            
            return aAccuracy - bAccuracy; // Lower accuracy first
        });
        
        const sessionQuestions = availableQuestions.slice(0, count).map(q => q.id);
        console.log('🔍 Final session questions:', sessionQuestions);
        
        return sessionQuestions;
    }
    
    // Get next passage
    getNextPassage() {
        console.log('🔍 getNextPassage called');
        console.log('🔍 currentSession:', this.currentSession);
        console.log('🔍 passages size:', this.passages.size);
        console.log('🔍 questions size:', this.questions.size);
        
        if (!this.currentSession || this.currentSession.length === 0) {
            console.log('❌ No current session or empty session');
            return null;
        }

        // Get the first question to find its passage
        const questionId = this.currentSession[0];
        console.log('🔍 First question ID:', questionId);
        
        const question = this.questions.get(questionId);
        console.log('🔍 Question found:', question);

        if (!question) {
            console.log('❌ Question not found');
            return null;
        }

        const passage = this.passages.get(question.passageId);
        console.log('🔍 Passage found:', passage);
        
        return passage;
    }
    
    // Peek at next question without removing from session
    peekNextQuestion() {
        console.log('🔍 peekNextQuestion called');
        console.log('🔍 currentSession:', this.currentSession);
        
        if (!this.currentSession || this.currentSession.length === 0) {
            console.log('❌ No current session or empty session');
            return null;
        }
        
        const questionId = this.currentSession[0];
        console.log('🔍 First question ID:', questionId);
        
        const question = this.questions.get(questionId);
        console.log('🔍 Question found:', question);
        console.log('🔍 Question correctAnswer:', question?.correctAnswer);
        
        if (!question) {
            console.log('❌ Question not found');
            return null;
        }
        
        let passage = null;
        if (question.passageId) {
            passage = this.passages.get(question.passageId);
        }
        
        return {
            id: question.id,
            type: question.type,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            passage: passage,
            difficulty: question.difficulty,
            timeLimit: this.questionTypes[question.type].timeLimit,
            points: this.questionTypes[question.type].points,
            userStats: this.userProgress.get(questionId) || {
                timesAnswered: 0,
                correctCount: 0,
                incorrectCount: 0,
                averageTime: 0,
                lastAnswered: null
            }
        };
    }
    
    // Move to next question in session
    moveToNextQuestion() {
        if (!this.currentSession || this.currentSession.length === 0) {
            return false;
        }
        
        // Remove current question from session
        this.currentSession.shift();
        
        return this.currentSession.length > 0;
    }
    
    // Get next question
    getNextQuestion() {
        if (this.currentSession.length === 0) {
            return null;
        }
        
        const questionId = this.currentSession.shift();
        const question = this.questions.get(questionId);
        
        if (!question) return null;
        
        let passage = null;
        if (question.passageId) {
            passage = this.passages.get(question.passageId);
        }
        
        return {
            id: question.id,
            type: question.type,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            passage: passage,
            difficulty: question.difficulty,
            timeLimit: this.questionTypes[question.type].timeLimit,
            points: this.questionTypes[question.type].points,
            userStats: this.userProgress.get(questionId) || {
                timesAnswered: 0,
                correctCount: 0,
                incorrectCount: 0,
                averageTime: 0,
                lastAnswered: null
            }
        };
    }
    
    // Check answer
    checkAnswer(questionId, selectedAnswer) {
        const question = this.questions.get(questionId);
        if (!question) return false;
        
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        // Record the answer
        this.recordAnswer(questionId, selectedAnswer, 0);
        
        return isCorrect;
    }
    
    // Record answer
    recordAnswer(questionId, selectedAnswer, responseTime = 0) {
        const question = this.questions.get(questionId);
        if (!question) return;
        
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        // Update question stats
        let questionStats = this.userProgress.get(questionId) || {
            timesAnswered: 0,
            correctCount: 0,
            incorrectCount: 0,
            averageTime: 0,
            lastAnswered: null
        };
        
        questionStats.timesAnswered++;
        questionStats.lastAnswered = Date.now();
        
        if (isCorrect) {
            questionStats.correctCount++;
            this.sessionStats.correctAnswers++;
        } else {
            questionStats.incorrectCount++;
            this.sessionStats.incorrectAnswers++;
        }
        
        // Update average time
        const totalTime = questionStats.averageTime * (questionStats.timesAnswered - 1) + responseTime;
        questionStats.averageTime = totalTime / questionStats.timesAnswered;
        
        this.userProgress.set(questionId, questionStats);
        
        // Update passage stats if applicable
        if (question.passageId) {
            const passage = this.passages.get(question.passageId);
            if (passage) {
                passage.userStats.timesRead++;
                passage.userStats.lastRead = Date.now();
                
                // Update comprehension score
                const passageQuestions = passage.questions.map(qId => this.userProgress.get(qId));
                const totalCorrect = passageQuestions.reduce((sum, stats) => 
                    sum + (stats ? stats.correctCount : 0), 0);
                const totalAnswered = passageQuestions.reduce((sum, stats) => 
                    sum + (stats ? stats.timesAnswered : 0), 0);
                
                passage.userStats.comprehensionScore = totalAnswered > 0 ? 
                    (totalCorrect / totalAnswered) * 100 : 0;
            }
        }
        
        this.saveUserProgress();
        
        console.log(`📝 Recorded answer for question ${questionId}: ${isCorrect ? 'Correct' : 'Incorrect'}`);
        
        return {
            isCorrect,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            points: isCorrect ? this.questionTypes[question.type].points : 0
        };
    }
    
    // Get session statistics
    getSessionStats() {
        const accuracy = this.sessionStats.totalQuestions > 0 ? 
            (this.sessionStats.correctAnswers / this.sessionStats.totalQuestions) * 100 : 0;
        
        const timeSpent = this.sessionStats.startTime ? 
            Date.now() - this.sessionStats.startTime : 0;
        
        return {
            ...this.sessionStats,
            accuracy: Math.round(accuracy),
            timeSpent: timeSpent,
            questionsRemaining: this.currentSession.length
        };
    }
    
    // Get overall statistics
    getOverallStats() {
        const totalQuestions = this.questions.size;
        const answeredQuestions = this.userProgress.size;
        
        const totalCorrect = Array.from(this.userProgress.values())
            .reduce((sum, stats) => sum + stats.correctCount, 0);
        
        const totalIncorrect = Array.from(this.userProgress.values())
            .reduce((sum, stats) => sum + stats.incorrectCount, 0);
        
        const overallAccuracy = (totalCorrect + totalIncorrect) > 0 ? 
            (totalCorrect / (totalCorrect + totalIncorrect)) * 100 : 0;
        
        // Calculate estimated TOEIC reading score directly
        const estimatedScore = answeredQuestions > 0 ? 
            Math.round((overallAccuracy / 100) * 400) : 0;
        
        return {
            totalQuestions,
            answeredQuestions,
            totalCorrect,
            totalIncorrect,
            overallAccuracy: Math.round(overallAccuracy),
            estimatedTOEICScore: estimatedScore,
            progressPercentage: Math.round((answeredQuestions / totalQuestions) * 100),
            totalAnswered: totalCorrect + totalIncorrect,
            accuracy: Math.round(overallAccuracy)
        };
    }
    
    // Calculate estimated TOEIC reading score
    calculateTOEICReadingScore() {
        const totalQuestions = this.questions.size;
        const answeredQuestions = this.userProgress.size;
        
        const totalCorrect = Array.from(this.userProgress.values())
            .reduce((sum, stats) => sum + stats.correctCount, 0);
        
        const totalIncorrect = Array.from(this.userProgress.values())
            .reduce((sum, stats) => sum + stats.incorrectCount, 0);
        
        const overallAccuracy = (totalCorrect + totalIncorrect) > 0 ? 
            (totalCorrect / (totalCorrect + totalIncorrect)) * 100 : 0;
        
        if (answeredQuestions === 0) return 0;
        
        // Base score from accuracy
        let baseScore = (overallAccuracy / 100) * 400; // Max 400 for reading
        
        // Coverage bonus
        const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);
        const coverageBonus = (progressPercentage / 100) * 200; // Max 200 for coverage
        
        // Difficulty bonus (based on question types answered)
        const difficultyBonus = this.calculateDifficultyBonus();
        
        const estimatedScore = Math.min(Math.round(baseScore + coverageBonus + difficultyBonus), 495);
        
        return Math.max(estimatedScore, 5); // Minimum score of 5
    }
    
    // End current session
    endSession() {
        console.log('📖 Ending TOEIC Reading session...');
        this.currentSession = null;
        this.currentPassage = null;
        this.currentQuestion = null;
        this.sessionStartTime = null;
        this.sessionStats = {
            correct: 0,
            incorrect: 0,
            total: 0,
            timeSpent: 0
        };
        console.log('✅ TOEIC Reading session ended');
    }
    
    calculateDifficultyBonus() {
        let bonus = 0;
        
        for (const [questionId, stats] of this.userProgress) {
            const question = this.questions.get(questionId);
            if (question) {
                const accuracy = stats.timesAnswered > 0 ? 
                    stats.correctCount / stats.timesAnswered : 0;
                
                if (question.difficulty === 'B2' && accuracy > 0.7) bonus += 2;
                else if (question.difficulty === 'B1' && accuracy > 0.8) bonus += 1;
            }
        }
        
        return Math.min(bonus, 100); // Max 100 bonus points
    }
    
    // Get statistics by question type
    getStatsByType() {
        const typeStats = {};
        
        for (const [questionId, stats] of this.userProgress) {
            const question = this.questions.get(questionId);
            if (question) {
                const type = question.type;
                
                if (!typeStats[type]) {
                    typeStats[type] = {
                        total: 0,
                        correct: 0,
                        incorrect: 0,
                        accuracy: 0
                    };
                }
                
                typeStats[type].total++;
                typeStats[type].correct += stats.correctCount;
                typeStats[type].incorrect += stats.incorrectCount;
            }
        }
        
        // Calculate accuracy for each type
        for (const type in typeStats) {
            const stats = typeStats[type];
            const totalAnswers = stats.correct + stats.incorrect;
            stats.accuracy = totalAnswers > 0 ? (stats.correct / totalAnswers) * 100 : 0;
        }
        
        return typeStats;
    }
    
    // Get weak areas for improvement
    getWeakAreas() {
        const typeStats = this.getStatsByType();
        const weakAreas = [];
        
        for (const [type, stats] of Object.entries(typeStats)) {
            if (stats.accuracy < 70) {
                weakAreas.push({
                    type: type,
                    accuracy: Math.round(stats.accuracy),
                    recommendation: this.getRecommendationForType(type)
                });
            }
        }
        
        return weakAreas;
    }
    
    getRecommendationForType(type) {
        const recommendations = {
            'incomplete_sentences': 'Focus on grammar rules, especially prepositions, conjunctions, and verb forms.',
            'text_completion': 'Practice reading comprehension and understanding context clues.',
            'reading_comprehension': 'Improve reading speed and practice identifying main ideas and details.'
        };
        
        return recommendations[type] || 'Continue practicing this question type.';
    }
    
    // Search passages
    searchPassages(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        for (const [id, passage] of this.passages) {
            if (passage.title.toLowerCase().includes(lowerQuery) ||
                passage.content.toLowerCase().includes(lowerQuery) ||
                passage.category.toLowerCase().includes(lowerQuery)) {
                results.push({
                    id: id,
                    title: passage.title,
                    type: passage.type,
                    category: passage.category,
                    difficulty: passage.difficulty,
                    wordCount: passage.wordCount,
                    userStats: passage.userStats
                });
            }
        }
        
        return results;
    }
    
    // Get reading speed analysis
    getReadingSpeedAnalysis() {
        const passageStats = [];
        
        for (const [id, passage] of this.passages) {
            if (passage.userStats.timesRead > 0) {
                const wordsPerMinute = passage.wordCount / (passage.userStats.averageTime / 60);
                passageStats.push({
                    id: id,
                    title: passage.title,
                    wordCount: passage.wordCount,
                    averageTime: passage.userStats.averageTime,
                    wordsPerMinute: Math.round(wordsPerMinute),
                    comprehensionScore: passage.userStats.comprehensionScore
                });
            }
        }
        
        return passageStats.sort((a, b) => a.wordsPerMinute - b.wordsPerMinute);
    }
    
    // Reset progress
    resetProgress() {
        this.userProgress.clear();
        this.saveUserProgress();
        console.log('🔄 Reading progress reset');
    }
    
    // Navigation methods for the interface
    nextQuestion() {
        if (!this.currentSession || this.currentQuestionIndex >= this.currentSession.length - 1) {
            return false;
        }
        
        this.currentQuestionIndex++;
        return true;
    }
    
    previousQuestion() {
        if (!this.currentSession || this.currentQuestionIndex <= 0) {
            return false;
        }
        
        this.currentQuestionIndex--;
        return true;
    }
    
    getCurrentQuestion() {
        if (!this.currentSession || this.currentQuestionIndex >= this.currentSession.length) {
            return null;
        }
        
        const questionId = this.currentSession[this.currentQuestionIndex];
        return this.questions.get(questionId);
    }
    
    answerQuestion(selectedAnswer) {
        if (!this.currentSession || this.currentQuestionIndex >= this.currentSession.length) {
            return false;
        }
        
        const questionId = this.currentSession[this.currentQuestionIndex];
        const question = this.questions.get(questionId);
        
        if (!question) {
            return false;
        }
        
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        // Update session stats
        if (isCorrect) {
            this.sessionStats.correctAnswers++;
        } else {
            this.sessionStats.incorrectAnswers++;
        }
        
        // Record answer in user progress with lastAnswer field
        this.recordAnswer(questionId, selectedAnswer, isCorrect ? 1 : 0);
        
        // Store the last answer for review purposes
        const userProgress = this.userProgress.get(questionId) || {
            correctCount: 0,
            incorrectCount: 0,
            totalTime: 0,
            lastAnswer: -1,
            lastCorrect: false
        };
        userProgress.lastAnswer = selectedAnswer;
        userProgress.lastCorrect = isCorrect;
        this.userProgress.set(questionId, userProgress);
        
        console.log(`📖 Question ${this.currentQuestionIndex + 1}: ${isCorrect ? 'Correct' : 'Incorrect'}`);
        
        return isCorrect;
    }
}

// Export for global use
window.TOEICReadingSystem = TOEICReadingSystem;

