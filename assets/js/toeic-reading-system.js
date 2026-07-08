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
        
        // Additional business email passages
        const emailPassages2 = [
            {
                id: 'email_006',
                type: 'business_email',
                title: 'Complaint About Order #48213',
                content: `Dear Customer Service,

I am writing to express my dissatisfaction with a recent purchase from your online store. On June 2, I ordered a ProBrew 500 coffee machine (order #48213) for $189.99, with delivery promised by June 6. The package did not arrive until June 9, three days later than promised.

More importantly, when I opened the box, I discovered that the water tank was cracked and the power cord was missing. I called your customer hotline twice last week, but each time I waited more than forty minutes without speaking to a representative.

I would like you to send a replacement machine or issue a full refund within seven business days. I have attached a copy of my receipt and photographs of the damaged item. If I do not receive a response by June 20, I will report this matter to the consumer protection office.

Sincerely,
Laura Bennett`,
                wordCount: 155,
                difficulty: 'B1',
                category: 'customer_service'
            },
            {
                id: 'email_007',
                type: 'business_email',
                title: 'Workshop Schedule Change',
                content: `Subject: Change to Safety Training Workshop Schedule

Dear Staff,

Please be advised that the annual safety training workshop, originally scheduled for Friday, July 18, has been moved to Monday, July 21. Our external trainer, Mr. Alvarez, has a scheduling conflict and is unable to visit our office on the original date.

The workshop will now take place in the main auditorium instead of Room 204, as a larger group is expected. The session will run from 10:00 A.M. to 12:30 P.M., and lunch vouchers will be provided to all participants afterward.

Attendance is required for all warehouse and maintenance staff. Office employees are welcome to join if space allows. If you have not yet registered, please contact the reception desk by Tuesday, July 15.

We apologize for any inconvenience this change may cause and thank you for your understanding.

Kind regards,
Angela Moore
Operations Coordinator
Brightline Manufacturing`,
                wordCount: 150,
                difficulty: 'B1',
                category: 'business_communication'
            }
        ];

        // Internal memo / notice passages
        const memoPassages = [
            {
                id: 'memo_001',
                type: 'business_email',
                title: 'Memo: Third-Floor Renovation Notice',
                content: `MEMO

To: All Employees
From: Facilities Management
Date: September 3
Subject: Third-Floor Renovation

Please be informed that renovation work on the third floor will begin on Monday, September 8, and is expected to continue until Friday, October 3. During this period, the third-floor kitchen and meeting rooms will be closed.

Employees who currently work on the third floor will be temporarily relocated to the fifth floor. Your team leaders will distribute new desk assignments by Thursday, September 4. Please pack your personal belongings into the boxes provided and label them clearly with your name and department before 5:00 P.M. on Friday, September 5.

Some noise should be expected between 9:00 A.M. and 4:00 P.M. on weekdays. Free earplugs will be available at the reception desk. The elevator on the east side of the building will remain in service throughout the renovation.

We appreciate your patience while we improve our workspace.`,
                wordCount: 155,
                difficulty: 'B1',
                category: 'office_administration'
            },
            {
                id: 'memo_002',
                type: 'business_email',
                title: 'Memo: Updated Expense Reimbursement Policy',
                content: `MEMO

To: All Department Managers
From: Karen Liu, Finance Director
Date: November 10
Subject: Updated Expense Reimbursement Policy

Effective December 1, the company will introduce a new expense reimbursement policy. All expense reports must be submitted through the new FinTrack online system; paper forms will no longer be accepted after November 30.

Under the new policy, receipts are required for every purchase over $25. Meal expenses during business trips will be reimbursed up to $60 per day, and hotel bookings must be made through our approved travel agency, Horizon Travel. Any expense above $500 will require written approval from a department director before the purchase is made.

Reports must be submitted within thirty days of the expense date. Late submissions will be reimbursed only with special approval from the Finance Department.

A thirty-minute online training session on FinTrack will be offered on November 20 and November 25. Please encourage your team members to attend one of the sessions.`,
                wordCount: 160,
                difficulty: 'B2',
                category: 'finance'
            }
        ];

        // Additional advertisement passages
        const adPassages2 = [
            {
                id: 'ad_002',
                type: 'advertisement',
                title: 'Job Posting: Sales Associate Wanted',
                content: `SALES ASSOCIATE WANTED — GREENFIELD ELECTRONICS

Greenfield Electronics, one of the region\'s fastest-growing retailers, is seeking two full-time sales associates for our new downtown branch, opening on August 1.

Responsibilities include assisting customers, processing payments, arranging product displays, and handling telephone inquiries.

Requirements:
• At least one year of retail experience
• Strong communication skills
• Availability to work weekends
• A high school diploma or equivalent

Experience with home appliances is preferred but not required.

We offer a starting salary of $2,800 per month, a 15% employee discount on all store items, paid vacation, and full health insurance after a three-month probation period.

To apply, send your resume and a cover letter to careers@greenfieldelectronics.com by July 15. Interviews will be held during the third week of July. Only shortlisted candidates will be contacted.

Greenfield Electronics is an equal opportunity employer.`,
                wordCount: 145,
                difficulty: 'B1',
                category: 'recruitment'
            },
            {
                id: 'ad_003',
                type: 'advertisement',
                title: 'SparkleClean Commercial Cleaning Services',
                content: `SPARKLECLEAN COMMERCIAL CLEANING SERVICES

Keep your workplace spotless with SparkleClean, trusted by more than 300 businesses across the city since 2015.

Choose the plan that fits your needs:

• Basic Plan – $150 per month: weekly vacuuming, dusting, and trash removal
• Standard Plan – $250 per month: all Basic services plus window and kitchen cleaning twice a week
• Premium Plan – $400 per month: daily full-office cleaning, including carpet shampooing once a month

All plans include free supplies and a satisfaction guarantee: if you are not happy with a visit, we will repeat the service at no charge within 48 hours.

Sign up before October 31 and receive your first month at half price. Customers who refer another business receive a $50 credit on their next bill.

For a free on-site estimate, call 555-0192 or visit www.sparkleclean.com. Our office is open Monday through Saturday, 8:00 A.M. to 6:00 P.M.`,
                wordCount: 155,
                difficulty: 'B1',
                category: 'services'
            }
        ];

        // Additional news / press article passages
        const newsPassages2 = [
            {
                id: 'news_002',
                type: 'news_article',
                title: 'Nordwind Furniture to Open Three New Stores',
                content: `NORDWIND FURNITURE TO OPEN THREE NEW STORES

OSLO — Scandinavian furniture retailer Nordwind announced on Tuesday that it will open three new stores in Asia next year, marking the company\'s first expansion outside Europe. The new locations, in Singapore, Seoul, and Taipei, are scheduled to open between March and September.

Chief Executive Officer Ingrid Halvorsen said the decision follows two years of record online sales in the region. "Asian customers already account for nearly 20 percent of our web orders," she said at a press conference. "Opening physical stores is the natural next step."

The expansion is expected to create approximately 450 jobs, including 120 positions at a new distribution center in Singapore. Nordwind will invest an estimated 60 million euros in the project.

Founded in 1987, Nordwind currently operates 85 stores in 12 European countries. The company reported revenue of 1.2 billion euros last year, an increase of 8 percent over the previous year.`,
                wordCount: 155,
                difficulty: 'B2',
                category: 'business_news'
            },
            {
                id: 'news_003',
                type: 'news_article',
                title: 'More Companies Switch to Electric Delivery Vehicles',
                content: `MORE COMPANIES SWITCH TO ELECTRIC DELIVERY VEHICLES

A growing number of delivery companies are replacing their gasoline vans with electric vehicles, according to a report released Monday by the Urban Transport Institute. The study found that electric vans made up 18 percent of new delivery vehicle purchases last year, up from just 7 percent three years ago.

Lower operating costs are the main reason for the change. The report estimates that an electric van costs about 40 percent less to run than a gasoline model, mainly because of savings on fuel and maintenance.

City regulations are also playing a role. At least fifteen major cities plan to ban gasoline delivery vehicles from their downtown areas by 2030.

However, the report notes that the higher purchase price of electric vans remains a barrier for small businesses. It recommends that governments expand tax credits to help smaller firms make the switch.`,
                wordCount: 150,
                difficulty: 'B2',
                category: 'transportation'
            }
        ];

        // Formal letter passages
        const letterPassages = [
            {
                id: 'letter_001',
                type: 'business_email',
                title: 'Letter: Warranty Claim Response',
                content: `Ridgeway Appliances
1420 Commerce Avenue
Portland, OR 97205

March 14

Dear Mr. Osman,

Thank you for your letter of March 8 regarding your Ridgeway DW-200 dishwasher, purchased on January 22.

We have reviewed your warranty claim and are pleased to confirm that the faulty drain pump you described is covered under your two-year manufacturer\'s warranty. A certified technician will visit your home to replace the pump free of charge. Our service center will call you within three business days to arrange a convenient appointment time.

Please note that the warranty covers parts and labor but does not cover damage caused by improper installation or the use of unauthorized cleaning products. We also recommend registering your product on our website, which extends your coverage by an additional six months at no cost.

Should you have any questions, please contact our service center at 555-0148, Monday through Friday, between 8:00 A.M. and 5:00 P.M.

Yours sincerely,
Diane Keller
Customer Care Supervisor
Ridgeway Appliances`,
                wordCount: 165,
                difficulty: 'B2',
                category: 'customer_service'
            }
        ];

        // Form / schedule-style passages
        const formPassages = [
            {
                id: 'form_001',
                type: 'business_email',
                title: 'Schedule: New Employee Orientation',
                content: `WESTBRIDGE CONSULTING — NEW EMPLOYEE ORIENTATION SCHEDULE
Monday, April 6 | Conference Center, 2nd Floor

9:00 – 9:30 A.M.    Welcome and Registration (Lobby)
                    Pick up your ID badge and welcome packet.

9:30 – 10:30 A.M.   Company Overview — Presented by CEO Marcus Webb

10:30 – 10:45 A.M.  Coffee Break

10:45 – 12:00 P.M.  Human Resources Session (Room B)
                    Topics: benefits enrollment, payroll, vacation policy.
                    Bring a signed copy of your employment contract.

12:00 – 1:00 P.M.   Lunch (provided in the staff cafeteria)

1:00 – 2:30 P.M.    IT Setup (Room C)
                    Laptop distribution and email account activation.

2:30 – 4:00 P.M.    Department Meetings
                    New hires meet their team leaders at their assigned desks.

Note: Attendance at all sessions is mandatory. If you cannot attend on April 6, contact Hannah Ruiz in Human Resources at extension 2214 no later than April 1.`,
                wordCount: 145,
                difficulty: 'B1',
                category: 'human_resources'
            }
        ];

        // Combine all passages
        const allPassages = [...emailPassages, ...newsPassages, ...adPassages, ...emailPassages2, ...memoPassages, ...adPassages2, ...newsPassages2, ...letterPassages, ...formPassages];
        
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
                correctAnswer: 1,
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
        const textCompletionPassage = `Dear Team,

I am writing to inform you about the upcoming changes to our company policies. Starting next month, we will be implementing a new remote work policy that will allow employees to work from home up to three days per week.

This change is being made in response to employee feedback and the success we have seen with remote work during the past year. We believe this policy will improve work-life balance and increase job satisfaction.

Please note that this policy applies to all full-time employees. If you have any questions about how this policy affects your specific role, please contact your supervisor or the human resources department.

Thank you for your continued dedication to our company.

Best regards,
HR Department`;

        const textCompletion = [
            {
                id: 'q_text_001a',
                passageId: null,
                type: 'text_completion',
                passage: textCompletionPassage,
                question: 'What is the main topic of this memo?',
                options: [
                    'New remote work policy',
                    'Employee feedback system',
                    'Work-life balance programs',
                    'Human resources procedures'
                ],
                correctAnswer: 0,
                explanation: 'The memo is primarily about implementing a new remote work policy.',
                difficulty: 'B1'
            },
            {
                id: 'q_text_001b',
                passageId: null,
                type: 'text_completion',
                passage: textCompletionPassage,
                question: 'How many days per week can employees work from home?',
                options: [
                    'Two days',
                    'Three days',
                    'Four days',
                    'Five days'
                ],
                correctAnswer: 1,
                explanation: 'The memo states that employees can work from home up to three days per week.',
                difficulty: 'B1'
            }
        ];
        
        // Questions for email_006 (Complaint About Order #48213)
        const email006Questions = [
            {
                id: 'q_email_006_1',
                passageId: 'email_006',
                type: 'reading_comprehension',
                question: 'What is the main purpose of this email?',
                options: [
                    'To place an order for a coffee machine',
                    'To complain about a damaged product and request a solution',
                    'To thank the company for fast delivery',
                    'To ask about the price of a new model'
                ],
                correctAnswer: 1,
                explanation: 'The writer reports a cracked water tank and missing power cord and asks the company to "send a replacement machine or issue a full refund within seven business days."',
                difficulty: 'B1'
            },
            {
                id: 'q_email_006_2',
                passageId: 'email_006',
                type: 'reading_comprehension',
                question: 'What was wrong with the coffee machine when it arrived?',
                options: [
                    'It was the wrong model',
                    'The water tank was cracked and the power cord was missing',
                    'It did not heat water properly',
                    'The box contained a used machine'
                ],
                correctAnswer: 1,
                explanation: 'The email states: "I discovered that the water tank was cracked and the power cord was missing."',
                difficulty: 'A2'
            },
            {
                id: 'q_email_006_3',
                passageId: 'email_006',
                type: 'reading_comprehension',
                question: 'What does Ms. Bennett say she will do if she receives no response by June 20?',
                options: [
                    'Cancel her credit card',
                    'Write a negative online review',
                    'Report the matter to the consumer protection office',
                    'Visit the store in person'
                ],
                correctAnswer: 2,
                explanation: 'She writes: "If I do not receive a response by June 20, I will report this matter to the consumer protection office."',
                difficulty: 'B1'
            },
            {
                id: 'q_email_006_4',
                passageId: 'email_006',
                type: 'reading_comprehension',
                question: 'What problem is NOT mentioned in the email?',
                options: [
                    'A late delivery',
                    'A long wait on the telephone',
                    'A damaged product',
                    'A rude sales representative'
                ],
                correctAnswer: 3,
                explanation: 'The email mentions a delivery three days late, a forty-minute wait on the hotline, and a cracked water tank, but never mentions a rude sales representative.',
                difficulty: 'B2'
            }
        ];

        // Questions for email_007 (Workshop Schedule Change)
        const email007Questions = [
            {
                id: 'q_email_007_1',
                passageId: 'email_007',
                type: 'reading_comprehension',
                question: 'What is the main purpose of this email?',
                options: [
                    'To cancel the annual safety training',
                    'To announce changes to a workshop\'s date and location',
                    'To introduce a new external trainer',
                    'To invite staff to a company lunch'
                ],
                correctAnswer: 1,
                explanation: 'The email announces that the workshop "has been moved to Monday, July 21" and "will now take place in the main auditorium instead of Room 204."',
                difficulty: 'B1'
            },
            {
                id: 'q_email_007_2',
                passageId: 'email_007',
                type: 'reading_comprehension',
                question: 'Why was the workshop rescheduled?',
                options: [
                    'The auditorium was unavailable',
                    'The trainer has a scheduling conflict',
                    'Too few employees registered',
                    'A public holiday falls on July 18'
                ],
                correctAnswer: 1,
                explanation: 'The email explains: "Our external trainer, Mr. Alvarez, has a scheduling conflict and is unable to visit our office on the original date."',
                difficulty: 'B1'
            },
            {
                id: 'q_email_007_3',
                passageId: 'email_007',
                type: 'reading_comprehension',
                question: 'When will the workshop now take place?',
                options: [
                    'Friday, July 18',
                    'Tuesday, July 15',
                    'Monday, July 21',
                    'Friday, July 25'
                ],
                correctAnswer: 2,
                explanation: 'The workshop, originally scheduled for Friday, July 18, "has been moved to Monday, July 21."',
                difficulty: 'A2'
            },
            {
                id: 'q_email_007_4',
                passageId: 'email_007',
                type: 'reading_comprehension',
                question: 'Who is required to attend the workshop?',
                options: [
                    'All office employees',
                    'Warehouse and maintenance staff',
                    'Only new employees',
                    'Reception desk staff'
                ],
                correctAnswer: 1,
                explanation: 'The email states: "Attendance is required for all warehouse and maintenance staff." Office employees are only "welcome to join if space allows."',
                difficulty: 'B1'
            }
        ];

        // Questions for memo_001 (Third-Floor Renovation Notice)
        const memo001Questions = [
            {
                id: 'q_memo_001_1',
                passageId: 'memo_001',
                type: 'reading_comprehension',
                question: 'What is the purpose of this memo?',
                options: [
                    'To announce the closure of the company',
                    'To inform employees about upcoming renovation work',
                    'To invite staff to a meeting on the fifth floor',
                    'To explain new security procedures'
                ],
                correctAnswer: 1,
                explanation: 'The memo informs employees that "renovation work on the third floor will begin on Monday, September 8."',
                difficulty: 'B1'
            },
            {
                id: 'q_memo_001_2',
                passageId: 'memo_001',
                type: 'reading_comprehension',
                question: 'By when must third-floor employees pack their belongings?',
                options: [
                    'September 3',
                    'September 4',
                    '5:00 P.M. on September 5',
                    'September 8'
                ],
                correctAnswer: 2,
                explanation: 'The memo asks employees to pack and label their belongings "before 5:00 P.M. on Friday, September 5."',
                difficulty: 'B1'
            },
            {
                id: 'q_memo_001_3',
                passageId: 'memo_001',
                type: 'reading_comprehension',
                question: 'Where can employees get free earplugs?',
                options: [
                    'From their team leaders',
                    'At the reception desk',
                    'On the fifth floor',
                    'In the third-floor kitchen'
                ],
                correctAnswer: 1,
                explanation: 'The memo states: "Free earplugs will be available at the reception desk."',
                difficulty: 'A2'
            },
            {
                id: 'q_memo_001_4',
                passageId: 'memo_001',
                type: 'reading_comprehension',
                question: 'What is indicated about the elevator on the east side?',
                options: [
                    'It will be closed during the renovation',
                    'It will operate only on weekends',
                    'It will remain in service during the renovation',
                    'It will be replaced in October'
                ],
                correctAnswer: 2,
                explanation: 'The memo says the east-side elevator "will remain in service throughout the renovation."',
                difficulty: 'B1'
            }
        ];

        // Questions for memo_002 (Updated Expense Reimbursement Policy)
        const memo002Questions = [
            {
                id: 'q_memo_002_1',
                passageId: 'memo_002',
                type: 'reading_comprehension',
                question: 'What is the main purpose of this memo?',
                options: [
                    'To announce a new travel agency partnership',
                    'To explain a new expense reimbursement policy',
                    'To request budget proposals from managers',
                    'To introduce a new finance director'
                ],
                correctAnswer: 1,
                explanation: 'The memo announces that "Effective December 1, the company will introduce a new expense reimbursement policy" and describes its rules.',
                difficulty: 'B1'
            },
            {
                id: 'q_memo_002_2',
                passageId: 'memo_002',
                type: 'reading_comprehension',
                question: 'For which of the following would a receipt be required?',
                options: [
                    'A $12 taxi ride',
                    'A $20 office lunch',
                    'A $40 printer cable',
                    'A $9 parking fee'
                ],
                correctAnswer: 2,
                explanation: 'The policy states that "receipts are required for every purchase over $25," and only the $40 printer cable is over $25.',
                difficulty: 'B2'
            },
            {
                id: 'q_memo_002_3',
                passageId: 'memo_002',
                type: 'reading_comprehension',
                question: 'What must an employee do before making a purchase of more than $500?',
                options: [
                    'Contact Horizon Travel',
                    'Attend a FinTrack training session',
                    'Obtain written approval from a department director',
                    'Submit a paper form to the Finance Department'
                ],
                correctAnswer: 2,
                explanation: 'The memo states: "Any expense above $500 will require written approval from a department director before the purchase is made."',
                difficulty: 'B1'
            },
            {
                id: 'q_memo_002_4',
                passageId: 'memo_002',
                type: 'reading_comprehension',
                question: 'What is suggested about expense reports submitted after thirty days?',
                options: [
                    'They will be automatically rejected',
                    'They will need special approval to be reimbursed',
                    'They must be submitted on paper',
                    'They will be reimbursed at 50 percent'
                ],
                correctAnswer: 1,
                explanation: 'The memo says: "Late submissions will be reimbursed only with special approval from the Finance Department."',
                difficulty: 'B2'
            }
        ];

        // Questions for ad_002 (Job Posting: Sales Associate)
        const ad002Questions = [
            {
                id: 'q_ad_002_1',
                passageId: 'ad_002',
                type: 'reading_comprehension',
                question: 'What position is being advertised?',
                options: [
                    'Store manager',
                    'Sales associate',
                    'Warehouse assistant',
                    'Customer service representative'
                ],
                correctAnswer: 1,
                explanation: 'The advertisement is titled "SALES ASSOCIATE WANTED" and seeks "two full-time sales associates."',
                difficulty: 'A2'
            },
            {
                id: 'q_ad_002_2',
                passageId: 'ad_002',
                type: 'reading_comprehension',
                question: 'What is a requirement for the position?',
                options: [
                    'A university degree',
                    'Two years of retail experience',
                    'Availability to work weekends',
                    'Experience with home appliances'
                ],
                correctAnswer: 2,
                explanation: 'The requirements list includes "Availability to work weekends." Appliance experience is "preferred but not required," only one year of experience is needed, and a high school diploma (not a university degree) is required.',
                difficulty: 'B2'
            },
            {
                id: 'q_ad_002_3',
                passageId: 'ad_002',
                type: 'reading_comprehension',
                question: 'By when should applications be submitted?',
                options: [
                    'By July 15',
                    'By August 1',
                    'During the third week of July',
                    'By the end of August'
                ],
                correctAnswer: 0,
                explanation: 'Applicants must send their resume and cover letter "by July 15." The third week of July is when interviews are held, and August 1 is the branch opening date.',
                difficulty: 'B1'
            },
            {
                id: 'q_ad_002_4',
                passageId: 'ad_002',
                type: 'reading_comprehension',
                question: 'What is indicated about health insurance?',
                options: [
                    'It is available immediately upon hiring',
                    'It is offered after a three-month probation period',
                    'It covers family members',
                    'It requires a monthly fee'
                ],
                correctAnswer: 1,
                explanation: 'The advertisement offers "full health insurance after a three-month probation period."',
                difficulty: 'B1'
            }
        ];

        // Questions for ad_003 (SparkleClean Cleaning Services)
        const ad003Questions = [
            {
                id: 'q_ad_003_1',
                passageId: 'ad_003',
                type: 'reading_comprehension',
                question: 'What is being advertised?',
                options: [
                    'Office furniture',
                    'A commercial cleaning service',
                    'A window repair company',
                    'Cleaning supplies for sale'
                ],
                correctAnswer: 1,
                explanation: 'The advertisement promotes SparkleClean Commercial Cleaning Services and its monthly cleaning plans.',
                difficulty: 'A2'
            },
            {
                id: 'q_ad_003_2',
                passageId: 'ad_003',
                type: 'reading_comprehension',
                question: 'How much does the Standard Plan cost per month?',
                options: [
                    '$150',
                    '$250',
                    '$400',
                    '$50'
                ],
                correctAnswer: 1,
                explanation: 'The advertisement lists "Standard Plan – $250 per month."',
                difficulty: 'A2'
            },
            {
                id: 'q_ad_003_3',
                passageId: 'ad_003',
                type: 'reading_comprehension',
                question: 'According to the advertisement, what happens if a customer is not satisfied with a visit?',
                options: [
                    'They receive a full refund',
                    'The service is repeated free of charge within 48 hours',
                    'They can cancel the contract immediately',
                    'They receive a $50 credit'
                ],
                correctAnswer: 1,
                explanation: 'The guarantee states: "if you are not happy with a visit, we will repeat the service at no charge within 48 hours."',
                difficulty: 'B1'
            },
            {
                id: 'q_ad_003_4',
                passageId: 'ad_003',
                type: 'reading_comprehension',
                question: 'How can a customer receive a $50 credit?',
                options: [
                    'By signing up before October 31',
                    'By choosing the Premium Plan',
                    'By referring another business',
                    'By paying for a full year in advance'
                ],
                correctAnswer: 2,
                explanation: 'The advertisement says: "Customers who refer another business receive a $50 credit on their next bill." Signing up before October 31 gives the first month at half price instead.',
                difficulty: 'B1'
            }
        ];

        // Questions for news_002 (Nordwind Furniture Expansion)
        const news002Questions = [
            {
                id: 'q_news_002_1',
                passageId: 'news_002',
                type: 'reading_comprehension',
                question: 'What is the article mainly about?',
                options: [
                    'A furniture company\'s plan to expand into Asia',
                    'The opening of a new factory in Europe',
                    'A merger between two retailers',
                    'A decline in online furniture sales'
                ],
                correctAnswer: 0,
                explanation: 'The article reports that Nordwind "will open three new stores in Asia next year, marking the company\'s first expansion outside Europe."',
                difficulty: 'B1'
            },
            {
                id: 'q_news_002_2',
                passageId: 'news_002',
                type: 'reading_comprehension',
                question: 'Which city is NOT mentioned as a location for a new store?',
                options: [
                    'Singapore',
                    'Seoul',
                    'Tokyo',
                    'Taipei'
                ],
                correctAnswer: 2,
                explanation: 'The new locations are "in Singapore, Seoul, and Taipei." Tokyo is not mentioned.',
                difficulty: 'B1'
            },
            {
                id: 'q_news_002_3',
                passageId: 'news_002',
                type: 'reading_comprehension',
                question: 'According to Ms. Halvorsen, why is the company expanding?',
                options: [
                    'European sales have decreased',
                    'Asian customers already make up a large share of online orders',
                    'A competitor has left the region',
                    'The government offered tax incentives'
                ],
                correctAnswer: 1,
                explanation: 'The CEO says: "Asian customers already account for nearly 20 percent of our web orders," following two years of record online sales in the region.',
                difficulty: 'B2'
            },
            {
                id: 'q_news_002_4',
                passageId: 'news_002',
                type: 'reading_comprehension',
                question: 'How many jobs is the expansion expected to create in total?',
                options: [
                    '85',
                    '120',
                    'Approximately 450',
                    '1,200'
                ],
                correctAnswer: 2,
                explanation: 'The article states: "The expansion is expected to create approximately 450 jobs." The figure 120 refers only to the distribution center positions.',
                difficulty: 'B1'
            }
        ];

        // Questions for news_003 (Electric Delivery Vehicles)
        const news003Questions = [
            {
                id: 'q_news_003_1',
                passageId: 'news_003',
                type: 'reading_comprehension',
                question: 'What is the main topic of the article?',
                options: [
                    'Rising fuel prices for delivery companies',
                    'The growing use of electric delivery vehicles',
                    'New downtown parking regulations',
                    'A shortage of delivery drivers'
                ],
                correctAnswer: 1,
                explanation: 'The article reports that "a growing number of delivery companies are replacing their gasoline vans with electric vehicles."',
                difficulty: 'B1'
            },
            {
                id: 'q_news_003_2',
                passageId: 'news_003',
                type: 'reading_comprehension',
                question: 'What percentage of new delivery vehicle purchases were electric vans last year?',
                options: [
                    '7 percent',
                    '18 percent',
                    '40 percent',
                    '30 percent'
                ],
                correctAnswer: 1,
                explanation: 'The study found that "electric vans made up 18 percent of new delivery vehicle purchases last year." The 7 percent figure is from three years ago.',
                difficulty: 'B1'
            },
            {
                id: 'q_news_003_3',
                passageId: 'news_003',
                type: 'reading_comprehension',
                question: 'What is the main reason companies are making the switch?',
                options: [
                    'Government requirements',
                    'Customer demand',
                    'Lower operating costs',
                    'Faster delivery times'
                ],
                correctAnswer: 2,
                explanation: 'The article states: "Lower operating costs are the main reason for the change," with electric vans costing about 40 percent less to run.',
                difficulty: 'B2'
            },
            {
                id: 'q_news_003_4',
                passageId: 'news_003',
                type: 'reading_comprehension',
                question: 'According to the report, what prevents some small businesses from switching?',
                options: [
                    'A lack of charging stations',
                    'The higher purchase price of electric vans',
                    'Limited driving range',
                    'Longer delivery routes'
                ],
                correctAnswer: 1,
                explanation: 'The report notes that "the higher purchase price of electric vans remains a barrier for small businesses."',
                difficulty: 'B2'
            }
        ];

        // Questions for letter_001 (Warranty Claim Response)
        const letter001Questions = [
            {
                id: 'q_letter_001_1',
                passageId: 'letter_001',
                type: 'reading_comprehension',
                question: 'What is the main purpose of this letter?',
                options: [
                    'To reject a warranty claim',
                    'To confirm that a repair will be covered under warranty',
                    'To advertise a new dishwasher model',
                    'To request payment for a repair'
                ],
                correctAnswer: 1,
                explanation: 'The letter confirms that "the faulty drain pump you described is covered under your two-year manufacturer\'s warranty" and will be replaced free of charge.',
                difficulty: 'B1'
            },
            {
                id: 'q_letter_001_2',
                passageId: 'letter_001',
                type: 'reading_comprehension',
                question: 'What will happen within three business days?',
                options: [
                    'A technician will replace the pump',
                    'Mr. Osman will receive a refund',
                    'The service center will call to arrange an appointment',
                    'A new dishwasher will be delivered'
                ],
                correctAnswer: 2,
                explanation: 'The letter states: "Our service center will call you within three business days to arrange a convenient appointment time."',
                difficulty: 'B1'
            },
            {
                id: 'q_letter_001_3',
                passageId: 'letter_001',
                type: 'reading_comprehension',
                question: 'What is NOT covered by the warranty?',
                options: [
                    'Replacement parts',
                    'Labor costs',
                    'A faulty drain pump',
                    'Damage caused by improper installation'
                ],
                correctAnswer: 3,
                explanation: 'The letter notes the warranty "covers parts and labor but does not cover damage caused by improper installation or the use of unauthorized cleaning products."',
                difficulty: 'B2'
            },
            {
                id: 'q_letter_001_4',
                passageId: 'letter_001',
                type: 'reading_comprehension',
                question: 'How can Mr. Osman extend his warranty coverage?',
                options: [
                    'By paying a $50 fee',
                    'By registering the product on the company\'s website',
                    'By calling the service center every month',
                    'By purchasing approved cleaning products'
                ],
                correctAnswer: 1,
                explanation: 'The letter recommends "registering your product on our website, which extends your coverage by an additional six months at no cost."',
                difficulty: 'B2'
            }
        ];

        // Questions for form_001 (New Employee Orientation Schedule)
        const form001Questions = [
            {
                id: 'q_form_001_1',
                passageId: 'form_001',
                type: 'reading_comprehension',
                question: 'What is the purpose of this document?',
                options: [
                    'To advertise a consulting service',
                    'To outline the schedule for a new employee orientation',
                    'To announce changes to the cafeteria menu',
                    'To invite staff to a retirement party'
                ],
                correctAnswer: 1,
                explanation: 'The document is the "NEW EMPLOYEE ORIENTATION SCHEDULE" for Westbridge Consulting, listing the sessions planned for April 6.',
                difficulty: 'A2'
            },
            {
                id: 'q_form_001_2',
                passageId: 'form_001',
                type: 'reading_comprehension',
                question: 'What should attendees bring to the Human Resources session?',
                options: [
                    'Their laptops',
                    'A signed copy of their employment contract',
                    'A photo for their ID badge',
                    'Their welcome packet'
                ],
                correctAnswer: 1,
                explanation: 'The Human Resources Session entry says: "Bring a signed copy of your employment contract."',
                difficulty: 'B1'
            },
            {
                id: 'q_form_001_3',
                passageId: 'form_001',
                type: 'reading_comprehension',
                question: 'Who will present the company overview?',
                options: [
                    'Hannah Ruiz',
                    'Marcus Webb',
                    'A team leader',
                    'A Human Resources representative'
                ],
                correctAnswer: 1,
                explanation: 'The schedule lists "Company Overview — Presented by CEO Marcus Webb."',
                difficulty: 'A2'
            },
            {
                id: 'q_form_001_4',
                passageId: 'form_001',
                type: 'reading_comprehension',
                question: 'What should employees do if they cannot attend on April 6?',
                options: [
                    'Attend a later session in Room C',
                    'Email their team leader',
                    'Contact Hannah Ruiz by April 1',
                    'Call extension 2214 on April 6'
                ],
                correctAnswer: 2,
                explanation: 'The note says to "contact Hannah Ruiz in Human Resources at extension 2214 no later than April 1."',
                difficulty: 'B1'
            }
        ];

        // Additional incomplete sentences questions (new grammar points)
        const incompleteSentences2 = [
            {
                id: 'q_incomplete_009',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'Ms. Tanaka\'s _____ to head of the marketing department was announced yesterday.',
                options: [
                    'promote',
                    'promotion',
                    'promoted',
                    'promotional'
                ],
                correctAnswer: 1,
                explanation: 'A noun is needed after the possessive "Ms. Tanaka\'s." "Promotion" is the noun form.',
                difficulty: 'B1'
            },
            {
                id: 'q_incomplete_010',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'The report must be reviewed _____ before it is sent to the client.',
                options: [
                    'careful',
                    'carefully',
                    'carefulness',
                    'more careful'
                ],
                correctAnswer: 1,
                explanation: 'An adverb is needed to modify the verb "reviewed." "Carefully" is the adverb form.',
                difficulty: 'A2'
            },
            {
                id: 'q_incomplete_011',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'All visitors _____ to sign in at the front desk upon arrival.',
                options: [
                    'require',
                    'requires',
                    'are required',
                    'requiring'
                ],
                correctAnswer: 2,
                explanation: 'The passive voice "are required" is correct because the visitors receive the action.',
                difficulty: 'B1'
            },
            {
                id: 'q_incomplete_012',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'Applicants _____ resumes are received by Friday will be contacted next week.',
                options: [
                    'who',
                    'whose',
                    'which',
                    'whom'
                ],
                correctAnswer: 1,
                explanation: 'The possessive relative pronoun "whose" is needed to show that the resumes belong to the applicants.',
                difficulty: 'B2'
            },
            {
                id: 'q_incomplete_013',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'The board postponed _____ a decision until the financial report is complete.',
                options: [
                    'to make',
                    'making',
                    'make',
                    'made'
                ],
                correctAnswer: 1,
                explanation: 'The verb "postpone" is followed by a gerund, so "postponed making" is correct.',
                difficulty: 'B2'
            },
            {
                id: 'q_incomplete_014',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'The new packaging machine is far more efficient _____ the model it replaced.',
                options: [
                    'as',
                    'than',
                    'from',
                    'to'
                ],
                correctAnswer: 1,
                explanation: 'Comparatives with "more" are followed by "than."',
                difficulty: 'A2'
            },
            {
                id: 'q_incomplete_015',
                passageId: null,
                type: 'incomplete_sentences',
                question: '_____ the marketing budget was reduced, the campaign reached a record audience.',
                options: [
                    'Despite',
                    'Although',
                    'Because',
                    'Owing to'
                ],
                correctAnswer: 1,
                explanation: '"Although" introduces a contrast clause with a subject and verb. "Despite" and "owing to" must be followed by a noun phrase, not a clause.',
                difficulty: 'B2'
            },
            {
                id: 'q_incomplete_016',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'Mr. Dubois _____ for the company since it opened its Lyon office in 2018.',
                options: [
                    'works',
                    'worked',
                    'has worked',
                    'is working'
                ],
                correctAnswer: 2,
                explanation: 'The present perfect "has worked" is used with "since" for an action continuing from the past to the present.',
                difficulty: 'B1'
            },
            {
                id: 'q_incomplete_017',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'Employees may park in the garage if they display _____ permits on the dashboard.',
                options: [
                    'they',
                    'them',
                    'their',
                    'theirs'
                ],
                correctAnswer: 2,
                explanation: 'The possessive adjective "their" is needed before the noun "permits."',
                difficulty: 'A2'
            },
            {
                id: 'q_incomplete_018',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'The two firms decided to _____ a joint venture in Southeast Asia.',
                options: [
                    'establish',
                    'install',
                    'appoint',
                    'achieve'
                ],
                correctAnswer: 0,
                explanation: '"Establish" collocates with "a joint venture." You install equipment, appoint people, and achieve goals.',
                difficulty: 'B2'
            },
            {
                id: 'q_incomplete_019',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'If the shipment _____ before noon, we will deliver the parts the same day.',
                options: [
                    'arrive',
                    'arrives',
                    'will arrive',
                    'arrived'
                ],
                correctAnswer: 1,
                explanation: 'In a first conditional sentence, the present simple "arrives" is used in the if-clause, not the future tense.',
                difficulty: 'B1'
            },
            {
                id: 'q_incomplete_020',
                passageId: null,
                type: 'incomplete_sentences',
                question: 'Shareholders were _____ to hear that quarterly profits had doubled.',
                options: [
                    'delight',
                    'delighted',
                    'delighting',
                    'delightful'
                ],
                correctAnswer: 1,
                explanation: 'The past participle adjective "delighted" describes how the shareholders felt.',
                difficulty: 'B1'
            }
        ];

        // Additional text completion passages and questions
        const textCompletionPassage2 = `Dear Valued Customer,

Thank you for subscribing to CityFiber Internet. Your installation is scheduled for Thursday, May 8, between 1:00 P.M. and 4:00 P.M. A technician will call you thirty minutes ___(1)___ arriving at your address.

Please make sure that someone over the age of eighteen is present during the visit. The installation usually takes about ninety minutes to ___(2)___.

If you need to change your appointment, please contact us at least twenty-four hours in advance.

Customer Service Team
CityFiber Communications`;

        const textCompletionPassage3 = `MEMO

To: All Staff
From: Office Management
Subject: Recycling Program

Starting next Monday, new recycling bins will be ___(1)___ on every floor next to the elevators. Blue bins are for paper, and green bins are for plastic and glass.

We encourage all employees to participate in this program. Last year, our office produced more than twelve tons of waste, and we hope to ___(2)___ that amount by at least 30 percent.

Thank you for helping us create a greener workplace.`;

        const textCompletion2 = [
            {
                id: 'q_text_002a',
                passageId: null,
                type: 'text_completion',
                passage: textCompletionPassage2,
                question: 'Which word best fits blank (1)?',
                options: [
                    'after',
                    'before',
                    'while',
                    'since'
                ],
                correctAnswer: 1,
                explanation: 'The technician calls first and then arrives, so "thirty minutes before arriving" is correct.',
                difficulty: 'B1'
            },
            {
                id: 'q_text_002b',
                passageId: null,
                type: 'text_completion',
                passage: textCompletionPassage2,
                question: 'Which word best fits blank (2)?',
                options: [
                    'completing',
                    'completion',
                    'complete',
                    'completely'
                ],
                correctAnswer: 2,
                explanation: 'The structure "takes + time + to + base verb" requires the infinitive "to complete."',
                difficulty: 'B1'
            },
            {
                id: 'q_text_003a',
                passageId: null,
                type: 'text_completion',
                passage: textCompletionPassage3,
                question: 'Which word best fits blank (1)?',
                options: [
                    'place',
                    'placing',
                    'placed',
                    'places'
                ],
                correctAnswer: 2,
                explanation: 'The passive voice "will be placed" is needed because the bins receive the action.',
                difficulty: 'B1'
            },
            {
                id: 'q_text_003b',
                passageId: null,
                type: 'text_completion',
                passage: textCompletionPassage3,
                question: 'Which word best fits blank (2)?',
                options: [
                    'raise',
                    'reduce',
                    'remove',
                    'replace'
                ],
                correctAnswer: 1,
                explanation: 'The memo is about producing less waste, so "reduce that amount by at least 30 percent" fits the context.',
                difficulty: 'A2'
            }
        ];

        // Combine all questions
        // Questions for email_002 (Product Launch Announcement)
        const email002Questions = [
            {
                id: 'q_email_002_1',
                passageId: 'email_002',
                type: 'reading_comprehension',
                question: 'What is the main purpose of this email?',
                options: [
                    'To apologize for a software problem',
                    'To announce a new product and a launch offer',
                    'To invite customers to a training conference',
                    'To explain a change in subscription pricing'
                ],
                correctAnswer: 1,
                explanation: 'The email announces the launch of TechFlow Pro and offers customers a 30% first-year discount with the code LAUNCH30.',
                difficulty: 'B1'
            },
            {
                id: 'q_email_002_2',
                passageId: 'email_002',
                type: 'reading_comprehension',
                question: 'What must customers do to receive the discount?',
                options: [
                    'Call the customer support team',
                    'Attend a free training session',
                    'Use the code LAUNCH30 on the website',
                    'Sign up before the end of two years'
                ],
                correctAnswer: 2,
                explanation: 'The email says: "please visit our website and use the promotional code LAUNCH30 at checkout."',
                difficulty: 'B1'
            },
            {
                id: 'q_email_002_3',
                passageId: 'email_002',
                type: 'reading_comprehension',
                question: 'What is offered free of charge during the first month?',
                options: [
                    'A one-year subscription',
                    'Training sessions for all users',
                    'Integration with existing systems',
                    'A second software license'
                ],
                correctAnswer: 1,
                explanation: 'The email states: "we are offering free training sessions for all users during the first month." The subscription itself is discounted 30%, not free.',
                difficulty: 'B2'
            }
        ];

        // Questions for ad_001 (Premium Office Space Available)
        const ad001Questions = [
            {
                id: 'q_ad_001_1',
                passageId: 'ad_001',
                type: 'reading_comprehension',
                question: 'What special offer is mentioned in the advertisement?',
                options: [
                    'Free parking for all visitors',
                    'A discount on conference room bookings',
                    'Three months rent-free with a two-year lease',
                    'Free fitness classes for six months'
                ],
                correctAnswer: 2,
                explanation: 'The promotion says: "First three months rent-free for new tenants who sign a two-year lease."',
                difficulty: 'B1'
            },
            {
                id: 'q_ad_001_2',
                passageId: 'ad_001',
                type: 'reading_comprehension',
                question: 'What is NOT mentioned as a feature of the office complex?',
                options: [
                    'On-site parking',
                    'A rooftop restaurant',
                    '24/7 security services',
                    'Modern conference rooms'
                ],
                correctAnswer: 1,
                explanation: 'The feature list includes parking, 24/7 security, and conference rooms — a restaurant is never mentioned.',
                difficulty: 'B1'
            },
            {
                id: 'q_ad_001_3',
                passageId: 'ad_001',
                type: 'reading_comprehension',
                question: 'What is true about the rent-free promotion?',
                options: [
                    'It can be combined with other offers.',
                    'It is only valid until the end of the month.',
                    'It applies to all current tenants.',
                    'It requires a five-year lease.'
                ],
                correctAnswer: 1,
                explanation: 'The ad says the offer "is valid until the end of the month and cannot be combined with other promotions", and it is for NEW tenants with a two-year lease.',
                difficulty: 'B2'
            }
        ];

        const allQuestions = [
            ...email001Questions,
            ...email002Questions,
            ...ad001Questions,
            ...email003Questions,
            ...email004Questions,
            ...email005Questions,
            ...news001Questions,
            ...incompleteSentences,
            ...textCompletion,
            ...email006Questions,
            ...email007Questions,
            ...memo001Questions,
            ...memo002Questions,
            ...ad002Questions,
            ...ad003Questions,
            ...news002Questions,
            ...news003Questions,
            ...letter001Questions,
            ...form001Questions,
            ...incompleteSentences2,
            ...textCompletion2
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
    
    // Get next question and advance the session pointer.
    // Non-destructive: uses the same shift-based cursor as
    // peekNextQuestion()/moveToNextQuestion() so the two flows
    // can never disagree about the current position.
    getNextQuestion() {
        if (!this.currentSession || this.currentSession.length === 0) {
            return null;
        }

        const questionId = this.currentSession[0];
        this.moveToNextQuestion();
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
            questionsRemaining: this.currentSession?.length ?? 0
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
            totalQuestions: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            timeSpent: 0,
            startTime: null
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
    
    answerQuestion(selectedAnswer, responseTime = 0) {
        if (!this.currentSession || this.currentQuestionIndex >= this.currentSession.length) {
            return false;
        }

        const questionId = this.currentSession[this.currentQuestionIndex];
        const question = this.questions.get(questionId);

        if (!question) {
            return false;
        }

        const isCorrect = selectedAnswer === question.correctAnswer;

        // Record answer in user progress with lastAnswer field
        // (recordAnswer owns the session stats increments)
        this.recordAnswer(questionId, selectedAnswer, responseTime);
        
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

