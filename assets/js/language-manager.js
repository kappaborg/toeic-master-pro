/**
 * Language Manager - Multilingual Support System
 * Supports English and Simplified Chinese with instant switching
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.supportedLanguages = ['en', 'zh-CN'];
        this.translations = {
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.progress': 'Progress',
                'nav.settings': 'Settings',
                'nav.analytics': 'Analytics',
                
                // Welcome Screen
                'welcome.title': 'Master English',
                'welcome.subtitle': 'Vocabulary',
                'welcome.description': 'Professional ESL learning platform with 10 interactive game modes and 731+ vocabulary words across all levels',
                'welcome.startLearning': 'Start Learning Journey',
                'welcome.viewAnalytics': 'View Analytics',
                
                // Hero Carousel
                'hero.smartLearning.title': 'Smart Learning',
                'hero.smartLearning.description': 'AI-powered adaptive learning system that adjusts to your level and learning pace',
                'hero.smartLearning.highlight': 'Personalized Experience',
                'hero.smartLearning.action': 'Start Learning',
                
                'hero.realConversations.title': 'Real Conversations',
                'hero.realConversations.description': 'Practice real-world conversations and dialogues in various everyday scenarios',
                'hero.realConversations.highlight': 'Practical Skills',
                'hero.realConversations.action': 'Begin Practice',
                
                'hero.memoryScience.title': 'Memory Science',
                'hero.memoryScience.description': 'Advanced spaced repetition algorithm for optimal vocabulary retention',
                'hero.memoryScience.highlight': 'Scientific Approach',
                'hero.memoryScience.action': 'Learn More',
                
                'hero.gamifiedLearning.title': 'Gamified Learning',
                'hero.gamifiedLearning.description': 'Earn XP, unlock achievements, and compete on leaderboards while learning',
                'hero.gamifiedLearning.highlight': 'Fun & Engaging',
                'hero.gamifiedLearning.action': 'Play Now',
                
                'hero.progressAnalytics.title': 'Progress Analytics',
                'hero.progressAnalytics.description': 'Track your learning journey with detailed insights and performance metrics',
                'hero.progressAnalytics.highlight': 'Data-Driven',
                'hero.progressAnalytics.action': 'View Progress',
                
                'hero.globalCommunity.title': 'Global Community',
                'hero.globalCommunity.description': 'Connect with learners worldwide and share your achievements',
                'hero.globalCommunity.highlight': 'Social Learning',
                'hero.globalCommunity.action': 'Join Community',
                
                // Game Modes
                'game.multipleChoice': 'Multiple Choice',
                'game.conversation': 'Conversation',
                'game.modalVerbs': 'Modal Verbs',
                'game.timeTelling': 'Time Practice',
                'game.categorySort': 'Category Sort',
                'game.visualLearning': 'Visual Learning',
                'game.conversationBuilder': 'Conversation Builder',
                'game.prefixSuffix': 'Prefix & Suffix',
                'game.readingComprehension': 'Reading Comprehension',
                'game.vocabularyLearning': 'Vocabulary Learning',
                
                // Global Controls
                'control.progress': 'Toggle Progress Panel (Drag to move)',
                'control.home': 'Go to Home (Drag to move)',
                
                // Language Switcher
                'language.english': 'English',
                'language.chinese': '中文',
                'language.switch': 'Switch Language'
            },
            'zh-CN': {
                // Navigation
                'nav.home': '首页',
                'nav.progress': '进度',
                'nav.settings': '设置',
                'nav.analytics': '分析',
                
                // Welcome Screen
                'welcome.title': '掌握英语',
                'welcome.subtitle': '词汇',
                'welcome.description': '专业的ESL学习平台，包含10种互动游戏模式和731+个词汇，涵盖所有级别',
                'welcome.startLearning': '开始学习之旅',
                'welcome.viewAnalytics': '查看分析',
                
                // Hero Carousel
                'hero.smartLearning.title': '智能学习',
                'hero.smartLearning.description': 'AI驱动的自适应学习系统，根据您的水平和学习节奏进行调整',
                'hero.smartLearning.highlight': '个性化体验',
                'hero.smartLearning.action': '开始学习',
                
                'hero.realConversations.title': '真实对话',
                'hero.realConversations.description': '在各种日常场景中练习真实世界的对话和对话',
                'hero.realConversations.highlight': '实用技能',
                'hero.realConversations.action': '开始练习',
                
                'hero.memoryScience.title': '记忆科学',
                'hero.memoryScience.description': '先进的间隔重复算法，实现最佳词汇记忆',
                'hero.memoryScience.highlight': '科学方法',
                'hero.memoryScience.action': '了解更多',
                
                'hero.gamifiedLearning.title': '游戏化学习',
                'hero.gamifiedLearning.description': '在学习过程中获得XP、解锁成就并在排行榜上竞争',
                'hero.gamifiedLearning.highlight': '有趣且引人入胜',
                'hero.gamifiedLearning.action': '立即游戏',
                
                'hero.progressAnalytics.title': '进度分析',
                'hero.progressAnalytics.description': '通过详细的洞察和性能指标跟踪您的学习之旅',
                'hero.progressAnalytics.highlight': '数据驱动',
                'hero.progressAnalytics.action': '查看进度',
                
                'hero.globalCommunity.title': '全球社区',
                'hero.globalCommunity.description': '与世界各地的学习者联系并分享您的成就',
                'hero.globalCommunity.highlight': '社交学习',
                'hero.globalCommunity.action': '加入社区',
                
                // Game Modes
                'game.multipleChoice': '选择题',
                'game.conversation': '对话',
                'game.modalVerbs': '情态动词',
                'game.timeTelling': '时间练习',
                'game.categorySort': '分类排序',
                'game.visualLearning': '视觉学习',
                'game.conversationBuilder': '对话构建',
                'game.prefixSuffix': '前缀和后缀',
                'game.readingComprehension': '阅读理解',
                'game.vocabularyLearning': '词汇学习',
                
                // Global Controls
                'control.progress': '切换进度面板（拖拽移动）',
                'control.home': '返回首页（拖拽移动）',
                
                // Language Switcher
                'language.english': 'English',
                'language.chinese': '中文',
                'language.switch': '切换语言'
            }
        };
        
        this.initialize();
        console.log('🌍 Language Manager initialized');
    }
    
    initialize() {
        // Load saved language preference
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        }
        
        // Create language switcher
        this.createLanguageSwitcher();
        
        // Apply current language
        this.applyLanguage(this.currentLanguage);
    }
    
    createLanguageSwitcher() {
        // Update navbar language toggle only
        this.updateNavbarLanguageToggle();
        console.log('🌍 Navbar language toggle updated');
    }
    
    updateNavbarLanguageToggle() {
        const navbarToggle = document.getElementById('navbarLanguageToggle');
        if (navbarToggle) {
            const languageText = navbarToggle.querySelector('.language-text');
            if (languageText) {
                languageText.textContent = this.currentLanguage === 'en' ? 'EN' : '中';
            }
            
            // Add click event if not already added
            if (!navbarToggle.hasAttribute('data-language-bound')) {
                navbarToggle.setAttribute('data-language-bound', 'true');
                navbarToggle.addEventListener('click', () => this.toggleLanguage());
            }
        }
        
        // Update mobile language text
        const mobileLanguageText = document.querySelector('.mobile-language-text');
        if (mobileLanguageText) {
            mobileLanguageText.textContent = this.currentLanguage === 'en' ? 'Switch to 中文' : 'Switch to English';
        }
    }
    
    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'en' ? 'zh-CN' : 'en';
        this.switchLanguage(newLanguage);
    }
    
    switchLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.error(`❌ Unsupported language: ${language}`);
            return;
        }
        
        console.log(`🌍 Switching language from ${this.currentLanguage} to ${language}`);
        
        this.currentLanguage = language;
        localStorage.setItem('preferredLanguage', language);
        
        // Apply new language
        this.applyLanguage(language);
        
        // Update language switcher
        this.createLanguageSwitcher();
        
        // Trigger language change event
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
    }
    
    applyLanguage(language) {
        const translations = this.translations[language];
        if (!translations) {
            console.error(`❌ Translations not found for language: ${language}`);
            return;
        }
        
        // Update all translatable elements
        Object.keys(translations).forEach(key => {
            const elements = document.querySelectorAll(`[data-i18n="${key}"]`);
            elements.forEach(element => {
                element.textContent = translations[key];
            });
        });
        
        // Update specific elements by ID or class
        this.updateSpecificElements(language);
        
        console.log(`✅ Language applied: ${language}`);
    }
    
    updateSpecificElements(language) {
        const translations = this.translations[language];
        
        // Update welcome screen (scoped to #welcomeScreen so the loading
        // screen title is never overwritten)
        const welcomeTitle = document.querySelector('#welcomeScreen .heading-1');
        if (welcomeTitle) {
            welcomeTitle.innerHTML = `
                ${translations['welcome.title']}
                <br>
                <span class="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">${translations['welcome.subtitle']}</span>
            `;
        }

        // NOTE: 'welcome.description' still contains legacy WordMaster ESL copy
        // ("10 interactive game modes", "731+ vocabulary words") that does not
        // match the current TOEIC welcome content, so the description in the
        // DOM is intentionally left alone until those keys are updated.
        
        // Update action buttons
        const startLearningBtn = document.querySelector('button[onclick="startLearning()"]');
        if (startLearningBtn) {
            startLearningBtn.innerHTML = `
                <i data-lucide="play" class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true"></i>
                ${translations['welcome.startLearning']}
            `;
        }
        
        const viewAnalyticsBtn = document.querySelector('button[onclick="showAnalytics()"]');
        if (viewAnalyticsBtn) {
            viewAnalyticsBtn.innerHTML = `
                <i data-lucide="bar-chart-3" class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true"></i>
                ${translations['welcome.viewAnalytics']}
            `;
        }
        
        // Update navigation
        const navHome = document.querySelector('a[href="#home"]');
        if (navHome) {
            navHome.textContent = translations['nav.home'];
        }
        
        const navProgress = document.querySelector('a[href="#progress"]');
        if (navProgress) {
            navProgress.textContent = translations['nav.progress'];
        }
        
        const navSettings = document.querySelector('a[href="#settings"]');
        if (navSettings) {
            navSettings.textContent = translations['nav.settings'];
        }
        
        const navAnalytics = document.querySelector('a[href="#analytics"]');
        if (navAnalytics) {
            navAnalytics.textContent = translations['nav.analytics'];
        }
    }
    
    getText(key) {
        const translations = this.translations[this.currentLanguage];
        return translations[key] || key;
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    isEnglish() {
        return this.currentLanguage === 'en';
    }
    
    isChinese() {
        return this.currentLanguage === 'zh-CN';
    }
}

// Initialize language manager
window.LanguageManager = LanguageManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.languageManager = new LanguageManager();
    });
} else {
    window.languageManager = new LanguageManager();
}

        console.log('🌍 Language Manager system loaded');
        
        // Add global mobile toggle function
        window.toggleLanguageFromMobile = () => {
            if (window.languageManager) {
                window.languageManager.toggleLanguage();
            }
        };
