// TOEIC Test Simulator - Complete TOEIC test simulation with scoring
// Simulates the actual TOEIC test format and timing

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
        const testId = 'full_' + Date.now();
        const testSession = {
            id: testId,
            type: 'full',
            startTime: Date.now(),
            listening: {
                startTime: Date.now(),
                endTime: null,
                answers: [],
                score: 0
            },
            reading: {
                startTime: null,
                endTime: null,
                answers: [],
                score: 0
            },
            totalScore: 0,
            status: 'active'
        };
        
        this.testSessions.set(testId, testSession);
        this.currentTest = testSession;
        
        console.log('📝 Started full TOEIC test:', testId);
        return testSession;
    }
    
    /**
     * Start a listening-only test
     */
    startListeningTest() {
        const testId = 'listening_' + Date.now();
        const testSession = {
            id: testId,
            type: 'listening',
            startTime: Date.now(),
            answers: [],
            score: 0,
            status: 'active'
        };
        
        this.testSessions.set(testId, testSession);
        this.currentTest = testSession;
        
        console.log('🎧 Started listening TOEIC test:', testId);
        return testSession;
    }
    
    /**
     * Start a reading-only test
     */
    startReadingTest() {
        const testId = 'reading_' + Date.now();
        const testSession = {
            id: testId,
            type: 'reading',
            startTime: Date.now(),
            answers: [],
            score: 0,
            status: 'active'
        };
        
        this.testSessions.set(testId, testSession);
        this.currentTest = testSession;
        
        console.log('📖 Started reading TOEIC test:', testId);
        return testSession;
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
            questions.push({
                number: questionNumber++,
                type: 'photographs',
                imageUrl: `assets/images/toeic/photo_${String(i + 1).padStart(2, '0')}.jpg`,
                audioUrl: `assets/audio/toeic/photo_${String(i + 1).padStart(2, '0')}.mp3`,
                options: [
                    'A) The people are having a meeting.',
                    'B) The people are eating lunch.',
                    'C) The people are waiting for a bus.',
                    'D) The people are shopping for clothes.'
                ],
                correctAnswer: Math.floor(Math.random() * 4),
                timeLimit: this.testConfig.listening.sections.photographs.timePerQuestion
            });
        }
        
        // Question-Response (Questions 11-40)
        for (let i = 0; i < 30; i++) {
            questions.push({
                number: questionNumber++,
                type: 'questionResponse',
                audioUrl: `assets/audio/toeic/qr_${String(i + 1).padStart(2, '0')}.mp3`,
                options: [
                    'A) Yes, I do.',
                    'B) No, thank you.',
                    'C) It\'s on the desk.',
                    'D) I\'ll be there soon.'
                ],
                correctAnswer: Math.floor(Math.random() * 4),
                timeLimit: this.testConfig.listening.sections.questionResponse.timePerQuestion
            });
        }
        
        // Conversations (Questions 41-70)
        for (let i = 0; i < 30; i++) {
            const conversationNumber = Math.floor(i / 3) + 1;
            const questionInConversation = (i % 3) + 1;
            
            questions.push({
                number: questionNumber++,
                type: 'conversations',
                conversationNumber: conversationNumber,
                questionInConversation: questionInConversation,
                audioUrl: `assets/audio/toeic/conv_${String(conversationNumber).padStart(2, '0')}.mp3`,
                question: `What does the man/woman say about...?`,
                options: [
                    'A) He/She is excited about it.',
                    'B) He/She has concerns about it.',
                    'C) He/She needs more information.',
                    'D) He/She will discuss it later.'
                ],
                correctAnswer: Math.floor(Math.random() * 4),
                timeLimit: this.testConfig.listening.sections.conversations.timePerQuestion
            });
        }
        
        // Talks (Questions 71-100)
        for (let i = 0; i < 30; i++) {
            const talkNumber = Math.floor(i / 3) + 1;
            const questionInTalk = (i % 3) + 1;
            
            questions.push({
                number: questionNumber++,
                type: 'talks',
                talkNumber: talkNumber,
                questionInTalk: questionInTalk,
                audioUrl: `assets/audio/toeic/talk_${String(talkNumber).padStart(2, '0')}.mp3`,
                question: `According to the speaker, what...?`,
                options: [
                    'A) The company will expand next year.',
                    'B) The meeting has been postponed.',
                    'C) New policies will be implemented.',
                    'D) The deadline is approaching.'
                ],
                correctAnswer: Math.floor(Math.random() * 4),
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
            questions.push({
                number: questionNumber++,
                type: 'incompleteSentences',
                sentence: 'The company\'s profits have increased significantly _____ the new marketing strategy.',
                options: [
                    'A) because',
                    'B) because of',
                    'C) due',
                    'D) owing'
                ],
                correctAnswer: Math.floor(Math.random() * 4),
                timeLimit: this.testConfig.reading.sections.incompleteSentences.timePerQuestion
            });
        }
        
        // Text Completion (Questions 141-152)
        for (let i = 0; i < 12; i++) {
            const textNumber = Math.floor(i / 3) + 1;
            const questionInText = (i % 3) + 1;
            
            questions.push({
                number: questionNumber++,
                type: 'textCompletion',
                textNumber: textNumber,
                questionInText: questionInText,
                passage: 'Dear Team,\n\nI am writing to inform you about the upcoming changes to our company policies. Starting next month, we will be implementing a new remote work policy that will allow employees to work from home up to three days per week.\n\nThis change is being made in response to employee feedback and the success we have seen with remote work during the past year. We believe this policy will improve work-life balance and increase job satisfaction.\n\nPlease note that this policy applies to all full-time employees. If you have any questions about how this policy affects your specific role, please contact your supervisor or the human resources department.\n\nThank you for your continued dedication to our company.\n\nBest regards,\nHR Department',
                question: 'What is the main topic of this memo?',
                options: [
                    'A) New remote work policy',
                    'B) Employee feedback system',
                    'C) Work-life balance programs',
                    'D) Human resources procedures'
                ],
                correctAnswer: Math.floor(Math.random() * 4),
                timeLimit: this.testConfig.reading.sections.textCompletion.timePerQuestion
            });
        }
        
        // Reading Comprehension (Questions 153-200)
        for (let i = 0; i < 48; i++) {
            const passageNumber = Math.floor(i / 4) + 1;
            const questionInPassage = (i % 4) + 1;
            
            questions.push({
                number: questionNumber++,
                type: 'readingComprehension',
                passageNumber: passageNumber,
                questionInPassage: questionInPassage,
                passage: this.generateReadingPassage(passageNumber),
                question: this.generateReadingQuestion(questionInPassage),
                options: [
                    'A) The company will expand internationally.',
                    'B) New products will be launched next quarter.',
                    'C) Employee training programs will be enhanced.',
                    'D) The marketing budget will be increased.'
                ],
                correctAnswer: Math.floor(Math.random() * 4),
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
            if (section.status === 'in_progress') {
                section.status = 'completed';
                section.endTime = Date.now();
                section.score = this.calculateSectionScore(section);
            }
        }
        
        // Complete the test
        this.completeTest();
        
        // Generate results
        const results = this.generateTestResults();
        
        // Save to history
        this.testHistory.push({
            id: this.currentTest.id,
            type: this.currentTest.type,
            date: new Date().toISOString(),
            results: results
        });
        this.saveTestHistory();
        
        console.log('✅ Test submitted successfully');
        return results;
    }
    
    // Complete a section
    completeSection(sectionName) {
        if (!this.currentTest) return false;
        
        const section = this.currentTest.sections[sectionName];
        if (!section) return false;
        
        section.status = 'completed';
        section.endTime = Date.now();
        section.score = this.calculateSectionScore(section);
        
        console.log(`✅ Completed ${sectionName} section with score: ${section.score}`);
        
        // Check if test is complete
        if (this.isTestComplete()) {
            this.completeTest();
        }
        
        return true;
    }
    
    // Calculate section score
    calculateSectionScore(section) {
        let correctAnswers = 0;
        const totalQuestions = section.questions.length;
        
        for (const [questionNumber, answerData] of Object.entries(section.answers)) {
            const question = section.questions.find(q => q.number == questionNumber);
            if (question && answerData.answer === question.correctAnswer) {
                correctAnswers++;
            }
        }
        
        const rawScore = Math.round((correctAnswers / totalQuestions) * 100);
        const scaledScore = this.scoringSystem[section.status === 'completed' ? 'listening' : 'reading'].rawToScaled[rawScore];
        
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
        
        this.currentTest.status = 'completed';
        this.currentTest.endTime = Date.now();
        this.currentTest.score = this.calculateTotalScore();
        this.currentTest.results = this.generateTestResults();
        
        // Add to test history
        this.testHistory.push({
            ...this.currentTest,
            completedAt: new Date().toISOString()
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
        
        const scores = this.testHistory.map(test => test.score.total);
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
            const pauseDuration = Date.now() - this.currentTest.pausedAt;
            this.currentTest.timeRemaining -= pauseDuration;
            delete this.currentTest.pausedAt;
        }
        
        console.log('▶️ Test resumed');
        return true;
    }
    
    // Get time remaining
    getTimeRemaining() {
        if (!this.currentTest) return 0;
        
        const elapsed = Date.now() - this.currentTest.startTime;
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

