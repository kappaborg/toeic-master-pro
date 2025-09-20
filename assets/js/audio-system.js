// WordMaster Pro - Audio Pronunciation System
// Text-to-Speech and Audio Management

class AudioSystem {
    constructor() {
        this.isSupported = 'speechSynthesis' in window;
        this.voices = [];
        this.currentUtterance = null;
        this.settings = {
            rate: 0.8,
            pitch: 1.0,
            volume: 0.8,
            language: 'en-US',
            voice: null
        };
        
        this.audioCache = new Map();
        this.loadSettings();
        this.initializeVoices();
        
        console.log('🔊 Audio System initialized');
    }
    
    async initializeVoices() {
        if (!this.isSupported) {
            console.warn('⚠️ Speech synthesis not supported');
            return;
        }
        
        // Wait for voices to load
        const loadVoices = () => {
            this.voices = speechSynthesis.getVoices();
            this.selectBestVoice();
        };
        
        loadVoices();
        
        // Some browsers load voices asynchronously
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
        
        // Fallback timeout
        setTimeout(loadVoices, 1000);
    }
    
    selectBestVoice() {
        if (this.voices.length === 0) return;
        
        // Prefer English voices
        const englishVoices = this.voices.filter(voice => 
            voice.lang.startsWith('en')
        );
        
        // Priority order for voice selection
        const priorities = [
            'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN'
        ];
        
        for (const lang of priorities) {
            const voice = englishVoices.find(v => v.lang === lang);
            if (voice) {
                this.settings.voice = voice;
                console.log(`🗣️ Selected voice: ${voice.name} (${voice.lang})`);
                return;
            }
        }
        
        // Fallback to first English voice
        if (englishVoices.length > 0) {
            this.settings.voice = englishVoices[0];
        }
    }
    
    // Speak a word or sentence
    async speak(text, options = {}) {
        if (!this.isSupported || !text) return false;
        
        // Stop any current speech
        this.stop();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Apply settings
        utterance.rate = options.rate || this.settings.rate;
        utterance.pitch = options.pitch || this.settings.pitch;
        utterance.volume = options.volume || this.settings.volume;
        utterance.lang = options.language || this.settings.language;
        
        if (this.settings.voice) {
            utterance.voice = this.settings.voice;
        }
        
        // Promise wrapper for speech synthesis
        return new Promise((resolve, reject) => {
            utterance.onend = () => {
                this.currentUtterance = null;
                resolve(true);
            };
            
            utterance.onerror = (error) => {
                this.currentUtterance = null;
                console.warn('⚠️ Speech synthesis error:', error);
                reject(error);
            };
            
            this.currentUtterance = utterance;
            speechSynthesis.speak(utterance);
            
            // Timeout fallback
            setTimeout(() => {
                if (this.currentUtterance === utterance) {
                    this.stop();
                    resolve(false);
                }
            }, 10000);
        });
    }
    
    // Speak word with emphasis for learning
    async speakWord(word, emphasize = true) {
        if (emphasize) {
            // Speak slowly and clearly for learning
            return this.speak(word, {
                rate: 0.6,
                pitch: 1.1,
                volume: 0.9
            });
        } else {
            return this.speak(word);
        }
    }
    
    // Speak text with custom rate (for listening practice)
    async speakText(text, rate = 1.0) {
        return this.speak(text, { rate: rate });
    }
    
    // Speak sentence with word highlighted
    async speakSentenceWithHighlight(sentence, targetWord) {
        if (!sentence || !targetWord) return false;
        
        const words = sentence.split(' ');
        let hasSpoken = false;
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i].replace(/[.,!?;:]/g, '');
            
            if (word.toLowerCase() === targetWord.toLowerCase()) {
                // Speak part before target word
                if (i > 0) {
                    const beforeText = words.slice(0, i).join(' ');
                    await this.speak(beforeText, { rate: 0.8 });
                    await this.pause(200);
                }
                
                // Emphasize target word
                await this.speak(targetWord, {
                    rate: 0.5,
                    pitch: 1.2,
                    volume: 1.0
                });
                await this.pause(300);
                
                // Speak part after target word
                if (i < words.length - 1) {
                    const afterText = words.slice(i + 1).join(' ');
                    await this.speak(afterText, { rate: 0.8 });
                }
                
                hasSpoken = true;
                break;
            }
        }
        
        // Fallback: speak entire sentence
        if (!hasSpoken) {
            await this.speak(sentence);
        }
        
        return true;
    }
    
    // Stop current speech
    stop() {
        if (this.isSupported && speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        this.currentUtterance = null;
    }
    
    // Pause for specified duration
    pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Check if currently speaking
    isSpeaking() {
        return this.isSupported && speechSynthesis.speaking;
    }
    
    // Get available voices
    getAvailableVoices() {
        return this.voices.filter(voice => voice.lang.startsWith('en'));
    }
    
    // Update settings
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        
        if (newSettings.voice) {
            const voice = this.voices.find(v => v.name === newSettings.voice);
            if (voice) this.settings.voice = voice;
        }
    }
    
    // Create audio controls UI
    createAudioControls(word, sentence = null) {
        const container = document.createElement('div');
        container.className = 'audio-controls flex items-center space-x-2 mt-2';
        
        // Word pronunciation button
        const wordBtn = document.createElement('button');
        wordBtn.className = 'audio-btn bg-blue-500/20 hover:bg-blue-500/30 p-2 rounded-lg transition-colors';
        wordBtn.innerHTML = '<i data-lucide="volume-2" class="w-4 h-4"></i>';
        wordBtn.title = `Pronounce: ${word}`;
        wordBtn.onclick = () => this.speakWord(word, true);
        
        container.appendChild(wordBtn);
        
        // Sentence pronunciation button (if provided)
        if (sentence) {
            const sentenceBtn = document.createElement('button');
            sentenceBtn.className = 'audio-btn bg-green-500/20 hover:bg-green-500/30 p-2 rounded-lg transition-colors';
            sentenceBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i>';
            sentenceBtn.title = 'Pronounce sentence';
            sentenceBtn.onclick = () => this.speakSentenceWithHighlight(sentence, word);
            
            container.appendChild(sentenceBtn);
        }
        
        // Stop button
        const stopBtn = document.createElement('button');
        stopBtn.className = 'audio-btn bg-red-500/20 hover:bg-red-500/30 p-2 rounded-lg transition-colors';
        stopBtn.innerHTML = '<i data-lucide="square" class="w-4 h-4"></i>';
        stopBtn.title = 'Stop audio';
        stopBtn.onclick = () => this.stop();
        
        container.appendChild(stopBtn);
        
        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        return container;
    }
    
    // Add audio controls to existing elements
    addAudioControlsToGameMode(gameMode, word, sentence = null) {
        const containers = document.querySelectorAll(`#${gameMode}Container .question-card, #${gameMode}Container .word-card`);
        
        containers.forEach(container => {
            // Remove existing audio controls
            const existingControls = container.querySelector('.audio-controls');
            if (existingControls) {
                existingControls.remove();
            }
            
            // Add new audio controls
            const audioControls = this.createAudioControls(word, sentence);
            container.appendChild(audioControls);
        });
    }
    
    // Keyboard shortcuts
    handleKeyboardShortcuts(event) {
        if (event.altKey) {
            switch (event.code) {
                case 'KeyP': // Alt+P for pronunciation
                    event.preventDefault();
                    const word = this.getCurrentDisplayedWord();
                    if (word) this.speakWord(word, true);
                    break;
                    
                case 'KeyS': // Alt+S to stop
                    event.preventDefault();
                    this.stop();
                    break;
            }
        }
    }
    
    // Get currently displayed word
    getCurrentDisplayedWord() {
        // Try to find word in various game mode containers
        const selectors = [
            '#questionWord',
            '.word-display',
            '.question-text',
            '.current-word'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        
        return null;
    }
    
    // Settings management
    loadSettings() {
        try {
            const stored = localStorage.getItem('audio_settings');
            if (stored) {
                this.settings = { ...this.settings, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.warn('⚠️ Failed to load audio settings:', error);
        }
    }
    
    saveSettings() {
        try {
            const settingsToSave = {
                rate: this.settings.rate,
                pitch: this.settings.pitch,
                volume: this.settings.volume,
                language: this.settings.language,
                voice: this.settings.voice?.name
            };
            localStorage.setItem('audio_settings', JSON.stringify(settingsToSave));
        } catch (error) {
            console.warn('⚠️ Failed to save audio settings:', error);
        }
    }
    
    // Audio settings UI
    createSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'audio-settings bg-white/10 backdrop-blur rounded-xl p-4 space-y-4';
        
        panel.innerHTML = `
            <h3 class="text-lg font-semibold text-white mb-4">Audio Settings</h3>
            
            <div class="space-y-3">
                <div>
                    <label class="block text-white text-sm mb-1">Speech Rate</label>
                    <input type="range" min="0.5" max="2" step="0.1" value="${this.settings.rate}" 
                           class="w-full audio-rate-slider" />
                    <div class="text-xs text-white/70 mt-1">Current: ${this.settings.rate}x</div>
                </div>
                
                <div>
                    <label class="block text-white text-sm mb-1">Pitch</label>
                    <input type="range" min="0.5" max="2" step="0.1" value="${this.settings.pitch}" 
                           class="w-full audio-pitch-slider" />
                    <div class="text-xs text-white/70 mt-1">Current: ${this.settings.pitch}</div>
                </div>
                
                <div>
                    <label class="block text-white text-sm mb-1">Volume</label>
                    <input type="range" min="0" max="1" step="0.1" value="${this.settings.volume}" 
                           class="w-full audio-volume-slider" />
                    <div class="text-xs text-white/70 mt-1">Current: ${Math.round(this.settings.volume * 100)}%</div>
                </div>
                
                <div>
                    <label class="block text-white text-sm mb-1">Voice</label>
                    <select class="w-full bg-black/30 text-white rounded p-2 audio-voice-select">
                        ${this.getAvailableVoices().map(voice => 
                            `<option value="${voice.name}" ${voice === this.settings.voice ? 'selected' : ''}>
                                ${voice.name} (${voice.lang})
                             </option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="flex space-x-2">
                    <button class="audio-test-btn bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white">
                        Test Voice
                    </button>
                    <button class="audio-reset-btn bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded text-white">
                        Reset
                    </button>
                </div>
            </div>
        `;
        
        this.bindSettingsEvents(panel);
        return panel;
    }
    
    bindSettingsEvents(panel) {
        // Rate slider
        const rateSlider = panel.querySelector('.audio-rate-slider');
        rateSlider.oninput = (e) => {
            this.settings.rate = parseFloat(e.target.value);
            e.target.nextElementSibling.textContent = `Current: ${this.settings.rate}x`;
            this.saveSettings();
        };
        
        // Pitch slider
        const pitchSlider = panel.querySelector('.audio-pitch-slider');
        pitchSlider.oninput = (e) => {
            this.settings.pitch = parseFloat(e.target.value);
            e.target.nextElementSibling.textContent = `Current: ${this.settings.pitch}`;
            this.saveSettings();
        };
        
        // Volume slider
        const volumeSlider = panel.querySelector('.audio-volume-slider');
        volumeSlider.oninput = (e) => {
            this.settings.volume = parseFloat(e.target.value);
            e.target.nextElementSibling.textContent = `Current: ${Math.round(this.settings.volume * 100)}%`;
            this.saveSettings();
        };
        
        // Voice select
        const voiceSelect = panel.querySelector('.audio-voice-select');
        voiceSelect.onchange = (e) => {
            const voice = this.voices.find(v => v.name === e.target.value);
            if (voice) {
                this.settings.voice = voice;
                this.saveSettings();
            }
        };
        
        // Test button
        const testBtn = panel.querySelector('.audio-test-btn');
        testBtn.onclick = () => {
            this.speak('Hello! This is a test of the pronunciation system. How does it sound?');
        };
        
        // Reset button
        const resetBtn = panel.querySelector('.audio-reset-btn');
        resetBtn.onclick = () => {
            this.settings = {
                rate: 0.8,
                pitch: 1.0,
                volume: 0.8,
                language: 'en-US',
                voice: null
            };
            this.selectBestVoice();
            this.saveSettings();
            // Refresh panel
            panel.replaceWith(this.createSettingsPanel());
        };
    }
}

// Export for global use
window.AudioSystem = AudioSystem;
console.log('🔊 Audio System loaded');
