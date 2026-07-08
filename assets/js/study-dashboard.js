/**
 * Study Dashboard
 *
 * Replaces the decorative hero carousel with something a student can
 * act on the moment they land on the home screen:
 *   1. Continue Learning — one-click resume of the last used module
 *   2. Word of the Day  — a real word from the TOEIC vocabulary CSV,
 *      deterministic per calendar day, with audio and a practice link
 *   3. Your Progress    — streak, words studied, tests taken and best
 *      score, conversation scenarios completed
 *
 * All data comes from storage the modules already write:
 *   toeicLastModule, toeicVocabularyProgress, toeicTestHistory,
 *   enhancedProgress, dailyConversationProgress
 * Every read is defensive — a missing/corrupt key just hides that stat.
 */

class StudyDashboard {
    constructor() {
        this.container = null;
        this.vocabRetryTimer = null;

        window.addEventListener('languageChanged', () => {
            if (this.container && document.body.contains(this.container)) {
                this.render();
            }
        });

        console.log('📊 Study Dashboard initialized');
    }

    t(key, fallback) {
        if (window.t) {
            const text = window.t(key);
            if (text !== key) return text;
        }
        return fallback;
    }

    // ---------------------------------------------------------------
    // Data access (all defensive)
    // ---------------------------------------------------------------

    readJSON(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || 'null');
        } catch (e) {
            return null;
        }
    }

    getLastModule() {
        const last = this.readJSON('toeicLastModule');
        if (!last || !last.type) return null;
        const KNOWN = ['vocabulary', 'reading', 'listening', 'test', 'flashcards', 'grammar', 'dailyConversation'];
        return KNOWN.includes(last.type) ? last : null;
    }

    moduleMeta(type) {
        const icons = {
            vocabulary: '📚', reading: '📖', listening: '🎧', test: '📋',
            flashcards: '🃏', grammar: '📝', dailyConversation: '💬'
        };
        return {
            icon: icons[type] || '📚',
            title: this.t(`module.${type}.title`, type)
        };
    }

    getWordOfTheDay() {
        const vocab = window.toeicVocabulary && window.toeicVocabulary.vocabulary;
        if (!vocab || vocab.size === 0) return null;

        const words = Array.from(vocab.keys()).sort();
        const dayNumber = Math.floor(Date.now() / 86400000);
        const word = words[dayNumber % words.length];
        const data = vocab.get(word) || {};
        return {
            word,
            meaning: data.meaning || '',
            example: Array.isArray(data.examples) ? data.examples[0] : (data.examples || ''),
            level: data.level || '',
            category: data.category || ''
        };
    }

    getStats() {
        const stats = [];

        const enhanced = this.readJSON('enhancedProgress');
        const streak = enhanced && enhanced.streakData && Number(enhanced.streakData.current);
        if (Number.isFinite(streak) && streak > 0) {
            stats.push({ icon: '🔥', value: streak, label: this.t('dashboard.streakDays', 'Day Streak') });
        }

        const vocabProgress = this.readJSON('toeicVocabularyProgress');
        const wordsStudied = vocabProgress ? Object.keys(vocabProgress).length : 0;
        stats.push({ icon: '📚', value: wordsStudied, label: this.t('dashboard.wordsStudied', 'Words Studied') });

        const history = this.readJSON('toeicTestHistory');
        if (Array.isArray(history) && history.length > 0) {
            const best = Math.max(...history.map(h => Number(h.totalScore ?? h.score ?? 0)));
            stats.push({
                icon: '📋',
                value: history.length,
                label: this.t('dashboard.testsTaken', 'Tests Taken'),
                sub: Number.isFinite(best) && best > 0
                    ? `${this.t('dashboard.bestScore', 'Best')}: ${best}`
                    : ''
            });
        } else {
            stats.push({ icon: '📋', value: 0, label: this.t('dashboard.testsTaken', 'Tests Taken') });
        }

        const conv = this.readJSON('dailyConversationProgress');
        const scenariosDone = conv ? Object.values(conv).filter(s => s && s.completed).length : 0;
        stats.push({ icon: '💬', value: scenariosDone, label: this.t('dashboard.conversationsDone', 'Conversations') });

        return stats;
    }

    // ---------------------------------------------------------------
    // Rendering
    // ---------------------------------------------------------------

    init() {
        this.container = document.getElementById('studyDashboard');
        if (!this.container) return;
        this.render();

        // The vocabulary CSV loads async — refresh the word-of-the-day
        // card once it arrives (bounded retry, no permanent timer)
        let attempts = 0;
        const retry = () => {
            if (this.getWordOfTheDay()) {
                this.render();
                return;
            }
            if (++attempts < 20) {
                this.vocabRetryTimer = setTimeout(retry, 500);
            }
        };
        if (!this.getWordOfTheDay()) retry();
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="dashboard-grid">
                ${this.renderContinueCard()}
                ${this.renderWordCard()}
                ${this.renderStatsCard()}
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    }

    renderContinueCard() {
        const last = this.getLastModule();
        const meta = last ? this.moduleMeta(last.type) : null;
        const resume = last
            ? (last.type === 'dailyConversation'
                ? "window.startDailyConversation()"
                : `window.startTOEICModule('${last.type}')`)
            : "window.startTOEICModule('vocabulary')";

        return `
            <div class="dashboard-card">
                <h3 class="dashboard-card-title">
                    <i data-lucide="play-circle" class="w-5 h-5"></i>
                    ${this.t('dashboard.continueLearning', 'Continue Learning')}
                </h3>
                <div class="dashboard-card-body">
                    <div class="dashboard-continue">
                        <span class="dashboard-continue-icon">${meta ? meta.icon : '🚀'}</span>
                        <div>
                            <p class="dashboard-continue-title">${meta ? meta.title : this.t('dashboard.newHere', 'Ready to start?')}</p>
                            <p class="dashboard-continue-sub">${meta
                                ? this.t('dashboard.pickUp', 'Pick up where you left off')
                                : this.t('dashboard.suggestion', 'Vocabulary is a great first step')}</p>
                        </div>
                    </div>
                    <button class="dashboard-primary-btn" onclick="${resume}">
                        ${meta ? this.t('dashboard.continue', 'Continue') : this.t('dashboard.startLearning', 'Start Learning')}
                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;
    }

    renderWordCard() {
        const wotd = this.getWordOfTheDay();

        if (!wotd) {
            return `
                <div class="dashboard-card">
                    <h3 class="dashboard-card-title">
                        <i data-lucide="sparkles" class="w-5 h-5"></i>
                        ${this.t('dashboard.wordOfTheDay', 'Word of the Day')}
                    </h3>
                    <div class="dashboard-card-body">
                        <p class="dashboard-continue-sub">${this.t('quiz.loading', 'Loading...')}</p>
                    </div>
                </div>
            `;
        }

        const speakable = window.audioSystem && typeof window.audioSystem.speakWord === 'function';
        const safeWord = wotd.word.replace(/'/g, "\\'");

        return `
            <div class="dashboard-card dashboard-card-accent">
                <h3 class="dashboard-card-title">
                    <i data-lucide="sparkles" class="w-5 h-5"></i>
                    ${this.t('dashboard.wordOfTheDay', 'Word of the Day')}
                </h3>
                <div class="dashboard-card-body">
                    <div class="dashboard-wotd-header">
                        <span class="dashboard-wotd-word">${wotd.word}</span>
                        ${wotd.level ? `<span class="dashboard-chip">${wotd.level}</span>` : ''}
                        ${speakable ? `
                        <button class="dashboard-icon-btn" aria-label="Pronounce"
                                onclick="window.audioSystem.speakWord('${safeWord}')">
                            <i data-lucide="volume-2" class="w-4 h-4"></i>
                        </button>` : ''}
                    </div>
                    ${wotd.meaning ? `<p class="dashboard-wotd-meaning">${wotd.meaning}</p>` : ''}
                    ${wotd.example ? `<p class="dashboard-wotd-example">"${wotd.example}"</p>` : ''}
                    <button class="dashboard-secondary-btn" onclick="window.startTOEICModule('vocabulary')">
                        ${this.t('dashboard.practiceWord', 'Practice Vocabulary')}
                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;
    }

    renderStatsCard() {
        const stats = this.getStats();
        const chips = stats.map(s => `
            <div class="dashboard-stat">
                <span class="dashboard-stat-icon">${s.icon}</span>
                <span class="dashboard-stat-value">${s.value}</span>
                <span class="dashboard-stat-label">${s.label}${s.sub ? ` · ${s.sub}` : ''}</span>
            </div>
        `).join('');

        return `
            <div class="dashboard-card">
                <h3 class="dashboard-card-title">
                    <i data-lucide="trending-up" class="w-5 h-5"></i>
                    ${this.t('dashboard.yourProgress', 'Your Progress')}
                </h3>
                <div class="dashboard-card-body dashboard-stats">
                    ${chips}
                </div>
            </div>
        `;
    }
}

// Expose globally; App calls window.studyDashboard.init() once the
// welcome screen is ready.
// NOTE: assign unconditionally — the #studyDashboard element in
// index.html already shadows window.studyDashboard via named element
// access, so a truthiness guard would see the DOM node and skip
// creating the instance.
window.StudyDashboard = StudyDashboard;
if (!(window.studyDashboard instanceof StudyDashboard)) {
    window.studyDashboard = new StudyDashboard();
}

console.log('📊 Study Dashboard loaded');
