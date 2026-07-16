/**
 * TOEIC Study Strategies Module
 *
 * A self-contained teaching page: test-taking strategies for every TOEIC
 * section plus time-management and study-habit advice. Renders into
 * #toeicModuleContent like the other TOEIC modules.
 *
 * UI chrome and card titles are bilingual (English + Chinese) for Chinese-
 * speaking students; the strategy bullets themselves stay in English on
 * purpose — they are the learning material. Card titles carry an inline
 * Chinese translation (titleZh) following the daily-conversation pattern.
 */

class StudyStrategies {
    constructor() {
        this.cards = this.loadStrategies();

        // Re-render when the language switches so the bilingual titles
        // and chrome pick up the new language.
        window.addEventListener('languageChanged', () => {
            if (document.getElementById('studyStrategiesRoot')) {
                this.render();
            }
        });

        console.log('💡 Study Strategies module initialized');
    }

    // ---------------------------------------------------------------
    // Data
    // ---------------------------------------------------------------

    loadStrategies() {
        return [
            {
                id: 'know-the-test',
                icon: '📋',
                title: 'Know the Test',
                titleZh: '了解考试',
                badge: 'OVERVIEW',
                bullets: [
                    'The TOEIC Listening & Reading test has 200 questions in about 2 hours: Listening (100 questions, 45 minutes) and Reading (100 questions, 75 minutes).',
                    'Listening covers Parts 1–4: photographs, question–response, conversations, and short talks.',
                    'Reading covers Parts 5–7: incomplete sentences, text completion, and reading comprehension.',
                    'Scores range from 10 to 990 (Listening 5–495 + Reading 5–495).',
                    'There is NO penalty for wrong answers — never leave a question blank. A guess has a 25% chance; a blank has 0%.'
                ]
            },
            {
                id: 'listening-part-1-2',
                icon: '🎧',
                title: 'Parts 1–2: Photos & Question–Response',
                titleZh: '第一、二部分：照片与应答',
                badge: 'LISTENING',
                bullets: [
                    'Part 1: study the photo BEFORE the audio starts — identify the people, actions, and objects, and predict likely vocabulary.',
                    'Part 2: catch the first word of the question. WH-words (who / what / where / when / why / how) tell you exactly what kind of answer to expect.',
                    'Beware of similar-sounding word traps: "copy / coffee", "walk / work", "coat / court". If an option repeats a sound from the question, it is often a distractor.',
                    'In Part 2, indirect answers are often correct: "Where is the meeting?" → "Check the schedule on the door." Do not insist on a direct answer.',
                    'If you miss a question, guess immediately and refocus — never let one lost question cost you the next two.'
                ]
            },
            {
                id: 'listening-part-3-4',
                icon: '🗣️',
                title: 'Parts 3–4: Conversations & Talks',
                titleZh: '第三、四部分：对话与短文',
                badge: 'LISTENING',
                bullets: [
                    'Read the three questions (and answer choices if you have time) BEFORE the audio plays — you will know what to listen for.',
                    'Listen to the WHOLE conversation or talk before locking in your answers; speakers often correct or change plans mid-dialogue.',
                    'Correct answers usually PARAPHRASE the audio: you hear "purchase" and the answer says "buy". Matching the meaning beats matching the words.',
                    'Answer questions in order while listening: question 1 is usually answered early, question 3 near the end.',
                    'Use the pause between sets to preview the NEXT set of questions, not to agonize over the last one.'
                ]
            },
            {
                id: 'reading-part-5-6',
                icon: '📝',
                title: 'Parts 5–6: Grammar & Vocabulary',
                titleZh: '第五、六部分：语法与词汇',
                badge: 'READING',
                bullets: [
                    'Scan the four answer choices FIRST: same word in different forms = grammar question; four different words = vocabulary question.',
                    'For grammar questions, use word families and part of speech: what fits the blank — a noun, verb, adjective, or adverb? Endings like -tion, -ive, -ly reveal the form.',
                    'Do not over-read Part 5 sentences. Often the words directly before and after the blank are enough to choose the answer.',
                    'In Part 6, some blanks test sentence connectors ("however", "therefore") or whole sentences — read the surrounding sentences for context.',
                    'Pace yourself: about 30 seconds per Part 5 question. If you are unsure after 30 seconds, guess, mark it, and move on.'
                ]
            },
            {
                id: 'reading-part-7',
                icon: '📖',
                title: 'Part 7: Reading Comprehension',
                titleZh: '第七部分：阅读理解',
                badge: 'READING',
                bullets: [
                    'Read the questions FIRST, then scan the passage for keywords — names, dates, numbers, and places are easy anchors to find.',
                    'For detail questions, scan; for main-idea and purpose questions, read the first paragraph and topic sentences carefully.',
                    'NOT / EXCEPT questions ("What is NOT mentioned?") require checking ALL four options against the text — there is no shortcut.',
                    'Watch for synonyms and paraphrases: the passage says "complimentary" and the answer says "free". The correct answer rarely copies the passage word for word.',
                    'In double and triple passages, some answers need information COMBINED from two texts — check the second passage before answering.',
                    'Budget about 1 minute per question (~55 minutes for all of Part 7). Do not let one long passage eat your remaining time.'
                ]
            },
            {
                id: 'time-management',
                icon: '⏱️',
                title: 'Time Management',
                titleZh: '时间管理',
                badge: 'PACING',
                bullets: [
                    'Listening paces itself (the audio controls you), but Reading is self-paced — plan it: Part 5 ≈ 15 min, Part 6 ≈ 10 min, Part 7 ≈ 50–55 min.',
                    'That means roughly 30 seconds per Part 5/6 question and 1 minute per Part 7 question — practice with a timer until this pace feels natural.',
                    'Skip and return: if a question stalls you, pick a temporary answer, mark it, and come back only if time remains.',
                    'Answer directly on the answer sheet as you go — transferring answers at the end wastes time and invites misalignment errors.',
                    'In the final 2–3 minutes, stop solving and fill in EVERY remaining bubble. Blank answers score zero; guesses score 25% on average.'
                ]
            },
            {
                id: 'study-habits',
                icon: '🌱',
                title: 'Study Habits',
                titleZh: '学习习惯',
                badge: 'HABITS',
                bullets: [
                    'Learn vocabulary daily with spaced repetition — review words right before you would forget them. Use this app\'s Flashcards module to make it automatic.',
                    'Take one full, timed mock test every week to build stamina and calibrate your pacing.',
                    'Review WRONG answers deeply: for every miss, explain why the correct answer is right AND why each distractor is wrong. That is where the real learning happens.',
                    'Study in consistent 25-minute focused blocks (Pomodoro style) with short breaks — daily consistency beats weekend cramming.',
                    'Train your ears every day: listen to English podcasts, announcements, and business dialogues even outside study time.',
                    'Track your scores by part to find your weakest section, then give it double practice time.'
                ]
            }
        ];
    }

    // ---------------------------------------------------------------
    // Translation helpers
    // ---------------------------------------------------------------

    t(key, fallback) {
        if (window.t) {
            const translated = window.t(key);
            if (translated && translated !== key) return translated;
        }
        return fallback !== undefined ? fallback : key;
    }

    cardTitle(card) {
        const zh = window.languageManager && window.languageManager.isChinese();
        return zh && card.titleZh ? `${card.title} · ${card.titleZh}` : card.title;
    }

    // ---------------------------------------------------------------
    // Entry point + view plumbing
    // ---------------------------------------------------------------

    show() {
        // Remember for the dashboard's "Continue Learning" card
        try {
            localStorage.setItem('toeicLastModule', JSON.stringify({
                type: 'studyStrategies',
                timestamp: Date.now()
            }));
        } catch (e) { /* non-fatal */ }

        // Hide the main menu and other module content, show our container
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) mainMenu.classList.add('hidden');
        const container = document.getElementById('toeicModuleContent');
        if (container) container.classList.remove('hidden');

        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    goHome() {
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

        const zh = window.languageManager && window.languageManager.isChinese();
        const subtitle = zh
            ? 'Proven strategies for every TOEIC section · 每个 TOEIC 部分的实用应试策略'
            : 'Proven test-taking strategies for every section of the TOEIC';
        const pageTitle = zh ? 'TOEIC Study Strategies · 备考策略' : 'TOEIC Study Strategies';

        container.innerHTML = `
            <div id="studyStrategiesRoot" class="module-shell">
                <button class="module-back-btn" onclick="window.studyStrategies.goHome()">
                    ← <span data-i18n="quiz.backToMenu">${this.t('quiz.backToMenu', 'Back to Menu')}</span>
                </button>

                <div class="module-header">
                    <span class="toeic-part-badge">TEST MAP · PARTS 1–7</span>
                    <div class="module-header-icon">💡</div>
                    <h1 class="module-header-title">${pageTitle}</h1>
                    <p class="module-header-subtitle">${subtitle}</p>
                </div>

                ${this.cards.map(card => this.renderCard(card)).join('')}

                ${this.renderPracticeNow()}
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    }

    renderCard(card) {
        return `
            <div class="content-card">
                <div class="content-card-title">
                    <span>${card.icon}</span>
                    <span>${this.cardTitle(card)}</span>
                    <span class="content-card-badge">${card.badge}</span>
                </div>
                <ul>
                    ${card.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    renderPracticeNow() {
        const zh = window.languageManager && window.languageManager.isChinese();
        const heading = zh ? 'Practice Now · 立即练习' : 'Practice Now';
        const testTitle = zh ? 'Take a Practice Test · 模拟测试' : 'Take a Practice Test';
        const testDesc = zh
            ? 'Apply these strategies under real timed conditions · 在真实计时条件下运用这些策略'
            : 'Apply these strategies under real timed conditions';
        const vocabTitle = zh ? 'Review Vocabulary · 复习词汇' : 'Review Vocabulary';
        const vocabDesc = zh
            ? 'Build your word bank with spaced-repetition flashcards · 用间隔重复闪卡积累词汇'
            : 'Build your word bank with spaced-repetition flashcards';

        return `
            <div class="module-header" style="margin-top: 32px; margin-bottom: 16px;">
                <h2 class="module-header-title" style="font-size: 1.25rem;">${heading}</h2>
            </div>
            <div class="module-actions">
                <button class="module-action-btn primary" onclick="window.startTOEICModule('test')">
                    <span class="module-action-icon"><i data-lucide="clipboard-check"></i></span>
                    <span class="module-action-text">
                        <span class="module-action-title">${testTitle}</span>
                        <span class="module-action-desc">${testDesc}</span>
                    </span>
                    <span class="module-action-chevron">→</span>
                </button>
                <button class="module-action-btn" onclick="window.startTOEICModule('flashcards')">
                    <span class="module-action-icon"><i data-lucide="credit-card"></i></span>
                    <span class="module-action-text">
                        <span class="module-action-title">${vocabTitle}</span>
                        <span class="module-action-desc">${vocabDesc}</span>
                    </span>
                    <span class="module-action-chevron">→</span>
                </button>
            </div>
        `;
    }
}

// Initialize and expose globally. Guard with instanceof (NOT truthiness):
// another script may have parked a placeholder object on the global.
window.StudyStrategies = StudyStrategies;

function initStudyStrategies() {
    if (!(window.studyStrategies instanceof StudyStrategies)) {
        window.studyStrategies = new StudyStrategies();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStudyStrategies);
} else {
    initStudyStrategies();
}

// Global entry point used by the module card in index.html
window.showStudyStrategies = () => window.studyStrategies.show();

console.log('💡 Study Strategies module loaded');
