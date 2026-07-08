// TOEIC Master Pro - Settings Panel
// Modern slide-over drawer with glassmorphism styling.
// Only settings that actually do something are shown:
//   Audio     → applied via window.audioSystem.updateSettings()
//   Game      → published as window.gameSettings
//   Interface → font size / contrast / motion classes on <html>
// UI chrome is translated via window.t() and re-renders on languageChanged.

// Prevent redeclaration
if (typeof window.SettingsPanel === 'undefined') {
class SettingsPanel {
    constructor() {
        this.isOpen = false;
        this.settings = this.loadSettings();
        this.createSettingsButton();
        this.applySettings();

        // Bind global listeners ONCE (the old version stacked an ESC
        // listener on every panel open)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePanel();
            }
        });
        window.addEventListener('languageChanged', () => {
            if (this.isOpen) {
                this.renderPanelContent();
            }
        });

        console.log('⚙️ Settings Panel initialized');
    }

    t(key, fallback) {
        if (window.t) {
            const text = window.t(key);
            if (text !== key) return text;
        }
        return fallback;
    }

    loadSettings() {
        const defaultSettings = {
            audio: {
                enabled: true,
                rate: 0.8,
                pitch: 1.0,
                volume: 0.8,
                language: 'en-US',
                voice: null,
                autoPlay: true,
                feedbackAudio: true
            },
            game: {
                show_hints: true,
                auto_next_question: false,
                difficulty_mode: 'adaptive',
                time_pressure: false,
                animations: true
            },
            ui: {
                theme: 'auto',
                reduced_motion: false,
                font_size: 'medium',
                high_contrast: false,
                keyboard_shortcuts: true
            }
        };

        try {
            const stored = localStorage.getItem('wordmaster_settings');
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    audio: { ...defaultSettings.audio, ...(parsed.audio || {}) },
                    game: { ...defaultSettings.game, ...(parsed.game || {}) },
                    ui: { ...defaultSettings.ui, ...(parsed.ui || {}) }
                };
            }
        } catch (error) {
            console.warn('⚠️ Failed to load settings:', error);
        }

        return defaultSettings;
    }

    saveSettings() {
        try {
            localStorage.setItem('wordmaster_settings', JSON.stringify(this.settings));
            this.applySettings();
        } catch (error) {
            console.warn('⚠️ Failed to save settings:', error);
        }
    }

    applySettings() {
        // Apply audio settings
        if (window.audioSystem && typeof window.audioSystem.updateSettings === 'function') {
            window.audioSystem.updateSettings(this.settings.audio);
        }

        // Apply UI settings
        this.applyUISettings();

        // Publish game settings for the game engine
        window.gameSettings = this.settings.game;

        // Trigger settings changed event
        document.dispatchEvent(new CustomEvent('settingsChanged', {
            detail: this.settings
        }));
    }

    applyUISettings() {
        const root = document.documentElement;

        // Font size
        root.classList.remove('font-scale-small', 'font-scale-large');
        if (this.settings.ui.font_size === 'small') root.classList.add('font-scale-small');
        if (this.settings.ui.font_size === 'large') root.classList.add('font-scale-large');

        // High contrast
        root.classList.toggle('high-contrast', !!this.settings.ui.high_contrast);

        // Reduced motion
        root.classList.toggle('reduce-motion', !!this.settings.ui.reduced_motion);
    }

    createSettingsButton() {
        const existing = document.getElementById('settingsButton');
        if (existing) existing.remove();

        const button = document.createElement('button');
        button.id = 'settingsButton';
        button.className = 'settings-fab';
        button.setAttribute('aria-label', 'Settings');
        button.innerHTML = '<i data-lucide="settings" class="w-6 h-6 text-white"></i>';
        button.onclick = () => this.togglePanel();

        document.body.appendChild(button);

        // Draggable like the other floating controls
        if (window.makeFloatingDraggable) {
            window.makeFloatingDraggable(button, 'settingsButtonPosition');
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    openPanel() {
        if (this.isOpen) return;
        this.isOpen = true;

        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'settingsBackdrop';
        backdrop.className = 'settings-backdrop';
        backdrop.onclick = () => this.closePanel();
        document.body.appendChild(backdrop);

        // Drawer
        const panel = document.createElement('div');
        panel.id = 'settingsPanel';
        panel.className = 'settings-drawer';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Settings');
        document.body.appendChild(panel);

        this.renderPanelContent();

        // Animate in on the next frame
        requestAnimationFrame(() => {
            backdrop.classList.add('open');
            panel.classList.add('open');
        });
    }

    closePanel() {
        if (!this.isOpen) return;
        this.isOpen = false;

        const panel = document.getElementById('settingsPanel');
        const backdrop = document.getElementById('settingsBackdrop');
        if (panel) {
            panel.classList.remove('open');
            setTimeout(() => panel.remove(), 350);
        }
        if (backdrop) {
            backdrop.classList.remove('open');
            setTimeout(() => backdrop.remove(), 350);
        }
    }

    renderPanelContent() {
        const panel = document.getElementById('settingsPanel');
        if (!panel) return;

        panel.innerHTML = `
            <div class="settings-drawer-header">
                <div class="flex items-center space-x-2">
                    <i data-lucide="settings" class="w-6 h-6 text-white"></i>
                    <h2 class="settings-drawer-title">${this.t('settings.title', 'Settings')}</h2>
                </div>
                <button class="settings-close-btn" onclick="window.settingsPanel.closePanel()" aria-label="Close">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <div class="settings-drawer-body">
                ${this.createAudioSection()}
                ${this.createGameSection()}
                ${this.createUISection()}
                ${this.createActionsSection()}
            </div>
        `;

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    toggleRow(labelKey, labelFallback, path, checked) {
        return `
            <label class="settings-row">
                <span class="settings-row-label">${this.t(labelKey, labelFallback)}</span>
                <span class="switch">
                    <input type="checkbox" ${checked ? 'checked' : ''}
                           onchange="window.settingsPanel.updateSetting('${path}', this.checked)">
                    <span class="switch-track"><span class="switch-thumb"></span></span>
                </span>
            </label>
        `;
    }

    createAudioSection() {
        const a = this.settings.audio;
        return `
            <section class="settings-card">
                <h3 class="settings-card-title">
                    <i data-lucide="volume-2" class="w-5 h-5"></i>
                    ${this.t('settings.audioSection', 'Audio')}
                </h3>
                ${this.toggleRow('settings.enableAudio', 'Enable Audio', 'audio.enabled', a.enabled)}
                ${this.toggleRow('settings.autoPlay', 'Auto-play Pronunciation', 'audio.autoPlay', a.autoPlay)}
                ${this.toggleRow('settings.audioFeedback', 'Answer Sound Effects', 'audio.feedbackAudio', a.feedbackAudio)}
                <div class="settings-row settings-row-stacked">
                    <span class="settings-row-label">${this.t('settings.speechRate', 'Speech Rate')}
                        <span class="settings-value" id="speechRateValue">${a.rate}x</span>
                    </span>
                    <input type="range" class="settings-range" min="0.5" max="1.5" step="0.1" value="${a.rate}"
                           oninput="document.getElementById('speechRateValue').textContent = this.value + 'x'"
                           onchange="window.settingsPanel.updateSetting('audio.rate', parseFloat(this.value))">
                </div>
                <div class="settings-row settings-row-stacked">
                    <span class="settings-row-label">${this.t('settings.volume', 'Volume')}
                        <span class="settings-value" id="volumeValue">${Math.round(a.volume * 100)}%</span>
                    </span>
                    <input type="range" class="settings-range" min="0" max="1" step="0.1" value="${a.volume}"
                           oninput="document.getElementById('volumeValue').textContent = Math.round(this.value * 100) + '%'"
                           onchange="window.settingsPanel.updateSetting('audio.volume', parseFloat(this.value))">
                </div>
            </section>
        `;
    }

    createGameSection() {
        const g = this.settings.game;
        return `
            <section class="settings-card">
                <h3 class="settings-card-title">
                    <i data-lucide="gamepad-2" class="w-5 h-5"></i>
                    ${this.t('settings.gameSection', 'Practice')}
                </h3>
                ${this.toggleRow('settings.showHints', 'Show Hints', 'game.show_hints', g.show_hints)}
                ${this.toggleRow('settings.autoNext', 'Auto Next Question', 'game.auto_next_question', g.auto_next_question)}
                ${this.toggleRow('settings.animations', 'Animations', 'game.animations', g.animations)}
                <div class="settings-row settings-row-stacked">
                    <span class="settings-row-label">${this.t('settings.difficulty', 'Difficulty Level')}</span>
                    <select class="settings-select"
                            onchange="window.settingsPanel.updateSetting('game.difficulty_mode', this.value)">
                        <option value="adaptive" ${g.difficulty_mode === 'adaptive' ? 'selected' : ''}>${this.t('settings.adaptive', 'Adaptive')}</option>
                        <option value="fixed" ${g.difficulty_mode === 'fixed' ? 'selected' : ''}>${this.t('settings.fixed', 'Fixed')}</option>
                        <option value="progressive" ${g.difficulty_mode === 'progressive' ? 'selected' : ''}>${this.t('settings.progressive', 'Progressive')}</option>
                    </select>
                </div>
            </section>
        `;
    }

    createUISection() {
        const u = this.settings.ui;
        return `
            <section class="settings-card">
                <h3 class="settings-card-title">
                    <i data-lucide="palette" class="w-5 h-5"></i>
                    ${this.t('settings.interfaceSection', 'Interface')}
                </h3>
                <div class="settings-row settings-row-stacked">
                    <span class="settings-row-label">${this.t('settings.fontSize', 'Font Size')}</span>
                    <select class="settings-select"
                            onchange="window.settingsPanel.updateSetting('ui.font_size', this.value)">
                        <option value="small" ${u.font_size === 'small' ? 'selected' : ''}>${this.t('settings.small', 'Small')}</option>
                        <option value="medium" ${u.font_size === 'medium' ? 'selected' : ''}>${this.t('settings.medium', 'Medium')}</option>
                        <option value="large" ${u.font_size === 'large' ? 'selected' : ''}>${this.t('settings.large', 'Large')}</option>
                    </select>
                </div>
                ${this.toggleRow('settings.highContrast', 'High Contrast', 'ui.high_contrast', u.high_contrast)}
                ${this.toggleRow('settings.reducedMotion', 'Reduced Motion', 'ui.reduced_motion', u.reduced_motion)}
            </section>
        `;
    }

    createActionsSection() {
        return `
            <section class="settings-card settings-actions">
                <button class="settings-action-btn settings-action-danger" onclick="window.settingsPanel.resetSettings()">
                    <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
                    ${this.t('settings.resetDefaults', 'Reset to Defaults')}
                </button>
            </section>
        `;
    }

    updateSetting(path, value) {
        const keys = path.split('.');
        let obj = this.settings;

        for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
        }

        obj[keys[keys.length - 1]] = value;
        this.saveSettings();

        console.log(`⚙️ Setting updated: ${path} = ${value}`);
    }

    resetSettings() {
        if (confirm(this.t('settings.resetConfirm', 'Reset all settings to defaults?'))) {
            localStorage.removeItem('wordmaster_settings');
            this.settings = this.loadSettings();
            this.applySettings();
            this.renderPanelContent();
            console.log('⚙️ Settings reset to defaults');
        }
    }

    // Show analytics dashboard (kept for external callers)
    showAnalytics() {
        if (window.analyticsDashboard && typeof window.analyticsDashboard.showDashboard === 'function') {
            window.analyticsDashboard.showDashboard();
        } else {
            console.warn('⚠️ Analytics dashboard is not available');
        }
    }
}

    // Export — App instantiates window.settingsPanel during init
    window.SettingsPanel = SettingsPanel;

    console.log('⚙️ Settings Panel loaded');
}
