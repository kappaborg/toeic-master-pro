// WordMaster Pro - Settings Panel
// Comprehensive settings management for all features

// Prevent redeclaration
if (typeof window.SettingsPanel === 'undefined') {
class SettingsPanel {
    constructor() {
        this.isOpen = false;
        this.settings = this.loadSettings();
        this.createSettingsButton();
        
        console.log('⚙️ Settings Panel initialized');
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
            spaced_repetition: {
                enabled: true,
                difficulty_adjustment: true,
                review_notifications: true,
                max_daily_words: 50
            },
            analytics: {
                enabled: true,
                detailed_tracking: true,
                performance_monitoring: true,
                export_data: false
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
            },
            privacy: {
                data_collection: true,
                offline_mode: false,
                auto_save: true
            }
        };
        
        try {
            const stored = localStorage.getItem('wordmaster_settings');
            if (stored) {
                return { ...defaultSettings, ...JSON.parse(stored) };
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
        if (window.audioSystem) {
            window.audioSystem.updateSettings(this.settings.audio);
        }
        
        // Apply UI settings
        this.applyUISettings();
        
        // Apply game settings
        this.applyGameSettings();
        
        // Trigger settings changed event
        document.dispatchEvent(new CustomEvent('settingsChanged', { 
            detail: this.settings 
        }));
    }
    
    applyUISettings() {
        const root = document.documentElement;
        
        // Font size
        root.classList.remove('text-sm', 'text-base', 'text-lg');
        switch (this.settings.ui.font_size) {
            case 'small': root.classList.add('text-sm'); break;
            case 'large': root.classList.add('text-lg'); break;
            default: root.classList.add('text-base'); break;
        }
        
        // High contrast
        if (this.settings.ui.high_contrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }
        
        // Reduced motion
        if (this.settings.ui.reduced_motion) {
            root.classList.add('reduce-motion');
        } else {
            root.classList.remove('reduce-motion');
        }
        
        // Theme
        this.applyTheme(this.settings.ui.theme);
    }
    
    applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'auto') {
            // Use system preference
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = isDark ? 'dark' : 'light';
        }
        
        root.classList.remove('theme-light', 'theme-dark');
        root.classList.add(`theme-${theme}`);
    }
    
    applyGameSettings() {
        // Store in global object for game engine access
        window.gameSettings = this.settings.game;
    }
    
    createSettingsButton() {
        // Create floating settings button
        const button = document.createElement('button');
        button.id = 'settingsButton';
        button.className = 'fixed bottom-6 right-6 z-40 bg-white/20 backdrop-blur-lg rounded-full p-3 hover:bg-white/30 transition-all duration-300 shadow-lg';
        button.innerHTML = '<i data-lucide="settings" class="w-6 h-6 text-white"></i>';
        button.onclick = () => this.togglePanel();
        
        document.body.appendChild(button);
        
        // Reinitialize Lucide icons
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
        this.createPanel();
    }
    
    closePanel() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        const panel = document.getElementById('settingsPanel');
        if (panel) {
            panel.classList.add('opacity-0', 'translate-x-full');
            setTimeout(() => panel.remove(), 300);
        }
    }
    
    createPanel() {
        // Remove existing panel
        const existing = document.getElementById('settingsPanel');
        if (existing) existing.remove();
        
        const panel = document.createElement('div');
        panel.id = 'settingsPanel';
        panel.className = 'fixed inset-y-0 right-0 z-50 w-96 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-l border-white/20 shadow-2xl transform translate-x-full opacity-0 transition-all duration-300 overflow-y-auto';
        
        panel.innerHTML = this.createPanelContent();
        
        document.body.appendChild(panel);
        
        // Animate in
        requestAnimationFrame(() => {
            panel.classList.remove('opacity-0', 'translate-x-full');
        });
        
        // Bind events
        this.bindPanelEvents(panel);
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    createPanelContent() {
        return `
            <div class="p-6 space-y-6">
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-white/20 pb-4">
                    <h2 class="text-2xl font-bold text-white">
                        <i data-lucide="settings" class="w-6 h-6 inline mr-2"></i>
                        Settings
                    </h2>
                    <button onclick="window.settingsPanel.closePanel()" class="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                
                <!-- Audio Settings -->
                ${this.createAudioSection()}
                
                <!-- Spaced Repetition Settings -->
                ${this.createSRSSection()}
                
                <!-- Analytics Settings -->
                ${this.createAnalyticsSection()}
                
                <!-- Game Settings -->
                ${this.createGameSection()}
                
                <!-- UI Settings -->
                ${this.createUISection()}
                
                <!-- Privacy Settings -->
                ${this.createPrivacySection()}
                
                <!-- Actions -->
                <div class="border-t border-white/20 pt-4 space-y-3">
                    <button onclick="window.settingsPanel.resetSettings()" class="w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 p-3 rounded-lg transition-colors">
                        <i data-lucide="rotate-ccw" class="w-4 h-4 inline mr-2"></i>
                        Reset to Defaults
                    </button>
                    
                    <button onclick="window.settingsPanel.exportSettings()" class="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 p-3 rounded-lg transition-colors">
                        <i data-lucide="download" class="w-4 h-4 inline mr-2"></i>
                        Export Settings
                    </button>
                    
                    <input type="file" id="importSettingsFile" accept=".json" style="display: none" onchange="window.settingsPanel.importSettings(event)">
                    <button onclick="document.getElementById('importSettingsFile').click()" class="w-full bg-green-500/20 hover:bg-green-500/30 text-green-200 p-3 rounded-lg transition-colors">
                        <i data-lucide="upload" class="w-4 h-4 inline mr-2"></i>
                        Import Settings
                    </button>
                </div>
            </div>
        `;
    }
    
    createAudioSection() {
        return `
            <div class="settings-section">
                <h3 class="text-lg font-semibold text-white mb-3 flex items-center">
                    <i data-lucide="volume-2" class="w-5 h-5 mr-2"></i>
                    Audio Settings
                </h3>
                
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <label class="text-white">Enable Audio</label>
                        <input type="checkbox" ${this.settings.audio.enabled ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('audio.enabled', this.checked)"
                               class="toggle-switch">
                    </div>
                    
                    <div class="space-y-2">
                        <label class="block text-white text-sm">Speech Rate</label>
                        <input type="range" min="0.5" max="2" step="0.1" value="${this.settings.audio.rate}"
                               onchange="window.settingsPanel.updateSetting('audio.rate', parseFloat(this.value))"
                               class="w-full">
                        <div class="text-xs text-white/70">${this.settings.audio.rate}x</div>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="block text-white text-sm">Volume</label>
                        <input type="range" min="0" max="1" step="0.1" value="${this.settings.audio.volume}"
                               onchange="window.settingsPanel.updateSetting('audio.volume', parseFloat(this.value))"
                               class="w-full">
                        <div class="text-xs text-white/70">${Math.round(this.settings.audio.volume * 100)}%</div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <label class="text-white">Auto-play Pronunciation</label>
                        <input type="checkbox" ${this.settings.audio.autoPlay ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('audio.autoPlay', this.checked)"
                               class="toggle-switch">
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <label class="text-white">Audio Feedback</label>
                        <input type="checkbox" ${this.settings.audio.feedbackAudio ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('audio.feedbackAudio', this.checked)"
                               class="toggle-switch">
                    </div>
                </div>
            </div>
        `;
    }
    
    createSRSSection() {
        return `
            <div class="settings-section">
                <h3 class="text-lg font-semibold text-white mb-3 flex items-center">
                    <i data-lucide="brain" class="w-5 h-5 mr-2"></i>
                    Spaced Repetition
                </h3>
                
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <label class="text-white">Enable SRS</label>
                        <input type="checkbox" ${this.settings.spaced_repetition.enabled ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('spaced_repetition.enabled', this.checked)"
                               class="toggle-switch">
                    </div>
                    
                    <div class="space-y-2">
                        <label class="block text-white text-sm">Max Daily Words</label>
                        <input type="number" min="10" max="100" value="${this.settings.spaced_repetition.max_daily_words}"
                               onchange="window.settingsPanel.updateSetting('spaced_repetition.max_daily_words', parseInt(this.value))"
                               class="w-full bg-black/30 text-white rounded p-2">
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <label class="text-white">Difficulty Adjustment</label>
                        <input type="checkbox" ${this.settings.spaced_repetition.difficulty_adjustment ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('spaced_repetition.difficulty_adjustment', this.checked)"
                               class="toggle-switch">
                    </div>
                </div>
            </div>
        `;
    }
    
    createAnalyticsSection() {
        return `
            <div class="settings-section">
                <h3 class="text-lg font-semibold text-white mb-3 flex items-center">
                    <i data-lucide="trending-up" class="w-5 h-5 mr-2"></i>
                    Analytics
                </h3>
                
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <label class="text-white">Enable Analytics</label>
                        <input type="checkbox" ${this.settings.analytics.enabled ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('analytics.enabled', this.checked)"
                               class="toggle-switch">
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <label class="text-white">Detailed Tracking</label>
                        <input type="checkbox" ${this.settings.analytics.detailed_tracking ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('analytics.detailed_tracking', this.checked)"
                               class="toggle-switch">
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <label class="text-white">Performance Monitoring</label>
                        <input type="checkbox" ${this.settings.analytics.performance_monitoring ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('analytics.performance_monitoring', this.checked)"
                               class="toggle-switch">
                    </div>
                </div>
            </div>
        `;
    }
    
    createGameSection() {
        return `
            <div class="settings-section">
                <h3 class="text-lg font-semibold text-white mb-3 flex items-center">
                    <i data-lucide="gamepad-2" class="w-5 h-5 mr-2"></i>
                    Game Settings
                </h3>
                
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <label class="text-white">Show Hints</label>
                        <input type="checkbox" ${this.settings.game.show_hints ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('game.show_hints', this.checked)"
                               class="toggle-switch">
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <label class="text-white">Auto Next Question</label>
                        <input type="checkbox" ${this.settings.game.auto_next_question ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('game.auto_next_question', this.checked)"
                               class="toggle-switch">
                    </div>
                    
                    <div class="space-y-2">
                        <label class="block text-white text-sm">Difficulty Mode</label>
                        <select onchange="window.settingsPanel.updateSetting('game.difficulty_mode', this.value)"
                                class="w-full bg-black/30 text-white rounded p-2">
                            <option value="adaptive" ${this.settings.game.difficulty_mode === 'adaptive' ? 'selected' : ''}>Adaptive</option>
                            <option value="fixed" ${this.settings.game.difficulty_mode === 'fixed' ? 'selected' : ''}>Fixed</option>
                            <option value="progressive" ${this.settings.game.difficulty_mode === 'progressive' ? 'selected' : ''}>Progressive</option>
                        </select>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <label class="text-white">Animations</label>
                        <input type="checkbox" ${this.settings.game.animations ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('game.animations', this.checked)"
                               class="toggle-switch">
                    </div>
                </div>
            </div>
        `;
    }
    
    createUISection() {
        return `
            <div class="settings-section">
                <h3 class="text-lg font-semibold text-white mb-3 flex items-center">
                    <i data-lucide="palette" class="w-5 h-5 mr-2"></i>
                    Interface
                </h3>
                
                <div class="space-y-4">
                    <div class="space-y-2">
                        <label class="block text-white text-sm">Font Size</label>
                        <select onchange="window.settingsPanel.updateSetting('ui.font_size', this.value)"
                                class="w-full bg-black/30 text-white rounded p-2">
                            <option value="small" ${this.settings.ui.font_size === 'small' ? 'selected' : ''}>Small</option>
                            <option value="medium" ${this.settings.ui.font_size === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="large" ${this.settings.ui.font_size === 'large' ? 'selected' : ''}>Large</option>
                        </select>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <label class="text-white">High Contrast</label>
                        <input type="checkbox" ${this.settings.ui.high_contrast ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('ui.high_contrast', this.checked)"
                               class="toggle-switch">
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <label class="text-white">Reduced Motion</label>
                        <input type="checkbox" ${this.settings.ui.reduced_motion ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('ui.reduced_motion', this.checked)"
                               class="toggle-switch">
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <label class="text-white">Keyboard Shortcuts</label>
                        <input type="checkbox" ${this.settings.ui.keyboard_shortcuts ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('ui.keyboard_shortcuts', this.checked)"
                               class="toggle-switch">
                    </div>
                </div>
            </div>
        `;
    }
    
    createPrivacySection() {
        return `
            <div class="settings-section">
                <h3 class="text-lg font-semibold text-white mb-3 flex items-center">
                    <i data-lucide="shield" class="w-5 h-5 mr-2"></i>
                    Privacy
                </h3>
                
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <label class="text-white">Data Collection</label>
                        <input type="checkbox" ${this.settings.privacy.data_collection ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('privacy.data_collection', this.checked)"
                               class="toggle-switch">
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <label class="text-white">Auto Save</label>
                        <input type="checkbox" ${this.settings.privacy.auto_save ? 'checked' : ''} 
                               onchange="window.settingsPanel.updateSetting('privacy.auto_save', this.checked)"
                               class="toggle-switch">
                    </div>
                </div>
            </div>
        `;
    }
    
    bindPanelEvents(panel) {
        // Close on outside click
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                this.closePanel();
            }
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePanel();
            }
        });
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
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            localStorage.removeItem('wordmaster_settings');
            this.settings = this.loadSettings();
            this.applySettings();
            this.closePanel();
            this.openPanel(); // Refresh panel with new values
            
            console.log('⚙️ Settings reset to defaults');
        }
    }
    
    exportSettings() {
        const data = {
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `wordmaster-settings-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        console.log('⚙️ Settings exported');
    }
    
    importSettings(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.settings) {
                    this.settings = { ...this.settings, ...data.settings };
                    this.saveSettings();
                    this.closePanel();
                    this.openPanel(); // Refresh panel
                    console.log('⚙️ Settings imported successfully');
                } else {
                    alert('Invalid settings file format');
                }
            } catch (error) {
                alert('Failed to import settings: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
    
    // Show analytics dashboard
    showAnalytics() {
        if (window.advancedAnalytics) {
            const dashboard = window.advancedAnalytics.createAnalyticsDashboard();
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4';
            modal.onclick = (e) => {
                if (e.target === modal) modal.remove();
            };
            
            modal.appendChild(dashboard);
            document.body.appendChild(modal);
        }
    }
}

    // Export and auto-initialize
    window.SettingsPanel = SettingsPanel;

    // Initialize Settings Panel immediately (will be called by App)
    if (!window.settingsPanel) {
        // Don't auto-initialize, let App handle it
        // window.settingsPanel = new SettingsPanel();
    }

    console.log('⚙️ Settings Panel loaded');
}
