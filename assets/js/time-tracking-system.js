/**
 * Time Tracking System
 * Handles timezone detection, live time display, and user timeline data collection
 */

class TimeTrackingSystem {
    constructor() {
        this.userTimezone = null;
        this.userCountry = null;
        this.userCity = null;
        this.sessionStartTime = null;
        this.activityTimeline = [];
        this.timeDisplayElements = [];
        this.updateInterval = null;
        
        this.init();
    }
    
    async init() {
        console.log('🕐 Initializing Time Tracking System...');
        
        // Detect user timezone and location
        await this.detectUserTimezone();
        
        // Start live time updates
        this.startLiveTimeUpdates();
        
        // Track session start
        this.trackSessionStart();
        
        // Set up activity tracking
        this.setupActivityTracking();
        
        console.log('✅ Time Tracking System initialized');
    }
    
    /**
     * Detect user timezone and location
     */
    async detectUserTimezone() {
        try {
            // Get timezone from browser
            this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log('🌍 Detected timezone:', this.userTimezone);
            
            // Try to get more detailed location info
            await this.getLocationInfo();
            
            // Store user timezone data
            this.storeUserTimezoneData();
            
        } catch (error) {
            console.error('❌ Error detecting timezone:', error);
            this.userTimezone = 'UTC'; // Fallback
        }
    }
    
    /**
     * Get detailed location information
     */
    async getLocationInfo() {
        try {
            // Skip location API call to avoid CORS issues
            console.log('📍 Location detection disabled to avoid CORS issues');
            this.userCountry = 'Unknown';
            this.userCity = 'Unknown';
            
        } catch (error) {
            console.warn('⚠️ Could not get location info:', error);
            // Continue without location data
            this.userCountry = 'Unknown';
            this.userCity = 'Unknown';
        }
    }
    
    /**
     * Store user timezone data in localStorage
     */
    storeUserTimezoneData() {
        const timezoneData = {
            timezone: this.userTimezone,
            country: this.userCountry,
            city: this.userCity,
            detectedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language
        };
        
        localStorage.setItem('toeic_user_timezone', JSON.stringify(timezoneData));
        console.log('💾 Timezone data stored:', timezoneData);
    }
    
    /**
     * Get stored user timezone data
     */
    getUserTimezoneData() {
        const stored = localStorage.getItem('toeic_user_timezone');
        return stored ? JSON.parse(stored) : null;
    }
    
    /**
     * Start live time updates
     */
    startLiveTimeUpdates() {
        // Update time every second
        this.updateInterval = setInterval(() => {
            this.updateAllTimeDisplays();
        }, 1000);
        
        // Initial update
        this.updateAllTimeDisplays();
    }
    
    /**
     * Update all time display elements
     */
    updateAllTimeDisplays() {
        const now = new Date();
        
        // Update all registered time elements
        this.timeDisplayElements.forEach(element => {
            this.updateTimeElement(element, now);
        });
        
        // Update any elements with time classes
        this.updateTimeClasses(now);
    }
    
    /**
     * Update a specific time element
     */
    updateTimeElement(element, date = new Date()) {
        if (!element) return;
        
        const options = element.dataset.timeOptions ? 
            JSON.parse(element.dataset.timeOptions) : 
            this.getDefaultTimeOptions();
        
        const formattedTime = this.formatTime(date, options);
        const previousTime = element.textContent;
        
        // Only update if time has changed
        if (formattedTime !== previousTime) {
            element.textContent = formattedTime;
            
            // Add pulse animation for time updates
            element.classList.add('updating');
            setTimeout(() => {
                element.classList.remove('updating');
            }, 500);
        }
        
        // Update title attribute with full date
        element.title = this.formatFullDateTime(date);
    }
    
    /**
     * Update elements with time classes
     */
    updateTimeClasses(date = new Date()) {
        // Update elements with live-time class
        document.querySelectorAll('.live-time').forEach(element => {
            this.updateTimeElement(element, date);
        });
        
        // Update elements with live-date class
        document.querySelectorAll('.live-date').forEach(element => {
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            element.textContent = this.formatTime(date, options);
        });
        
        // Update elements with live-datetime class
        document.querySelectorAll('.live-datetime').forEach(element => {
            const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            element.textContent = this.formatTime(date, options);
        });
    }
    
    /**
     * Format time according to options
     */
    formatTime(date, options = {}) {
        const defaultOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: this.userTimezone
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        return new Intl.DateTimeFormat(navigator.language, finalOptions).format(date);
    }
    
    /**
     * Format full date and time
     */
    formatFullDateTime(date) {
        return new Intl.DateTimeFormat(navigator.language, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: this.userTimezone
        }).format(date);
    }
    
    /**
     * Get default time options
     */
    getDefaultTimeOptions() {
        return {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
    }
    
    /**
     * Register a time display element
     */
    registerTimeElement(element, options = {}) {
        if (element) {
            element.dataset.timeOptions = JSON.stringify(options);
            this.timeDisplayElements.push(element);
            this.updateTimeElement(element);
        }
    }
    
    /**
     * Unregister a time display element
     */
    unregisterTimeElement(element) {
        const index = this.timeDisplayElements.indexOf(element);
        if (index > -1) {
            this.timeDisplayElements.splice(index, 1);
        }
    }
    
    /**
     * Track session start
     */
    trackSessionStart() {
        this.sessionStartTime = new Date();
        
        const sessionData = {
            startTime: this.sessionStartTime.toISOString(),
            timezone: this.userTimezone,
            country: this.userCountry,
            city: this.userCity,
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`
        };
        
        this.addToTimeline('session_start', sessionData);
        console.log('📊 Session started:', sessionData);
    }
    
    /**
     * Track session end
     */
    trackSessionEnd() {
        if (!this.sessionStartTime) return;
        
        const sessionDuration = Date.now() - this.sessionStartTime.getTime();
        
        const sessionData = {
            endTime: new Date().toISOString(),
            duration: sessionDuration,
            timezone: this.userTimezone
        };
        
        this.addToTimeline('session_end', sessionData);
        console.log('📊 Session ended:', sessionData);
    }
    
    /**
     * Setup activity tracking
     */
    setupActivityTracking() {
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.addToTimeline('page_hidden', { timestamp: new Date().toISOString() });
            } else {
                this.addToTimeline('page_visible', { timestamp: new Date().toISOString() });
            }
        });
        
        // Track focus/blur events
        window.addEventListener('focus', () => {
            this.addToTimeline('window_focus', { timestamp: new Date().toISOString() });
        });
        
        window.addEventListener('blur', () => {
            this.addToTimeline('window_blur', { timestamp: new Date().toISOString() });
        });
        
        // Track beforeunload
        window.addEventListener('beforeunload', () => {
            this.trackSessionEnd();
        });
    }
    
    /**
     * Add event to timeline
     */
    addToTimeline(eventType, data = {}) {
        const timelineEvent = {
            id: this.generateEventId(),
            type: eventType,
            timestamp: new Date().toISOString(),
            timezone: this.userTimezone,
            data: data
        };
        
        this.activityTimeline.push(timelineEvent);
        
        // Store in localStorage (keep last 100 events)
        this.storeTimelineData();
        
        // Send to analytics if available
        this.sendToAnalytics(timelineEvent);
        
        return timelineEvent;
    }
    
    /**
     * Generate unique event ID
     */
    generateEventId() {
        return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Store timeline data in localStorage
     */
    storeTimelineData() {
        // Keep only last 100 events to avoid storage bloat
        const recentEvents = this.activityTimeline.slice(-100);
        
        localStorage.setItem('toeic_timeline', JSON.stringify(recentEvents));
    }
    
    /**
     * Get timeline data
     */
    getTimelineData() {
        const stored = localStorage.getItem('toeic_timeline');
        return stored ? JSON.parse(stored) : [];
    }
    
    /**
     * Send timeline event to analytics
     */
    sendToAnalytics(event) {
        if (window.advancedAnalytics && typeof window.advancedAnalytics.recordLearningEvent === 'function') {
            window.advancedAnalytics.recordLearningEvent('timeline_event', {
                eventType: event.type,
                timestamp: event.timestamp,
                timezone: event.timezone,
                data: event.data
            });
        }
    }
    
    /**
     * Get current time in user's timezone
     */
    getCurrentTime() {
        return new Date();
    }
    
    /**
     * Get timezone offset
     */
    getTimezoneOffset() {
        const now = new Date();
        return now.getTimezoneOffset();
    }
    
    /**
     * Get timezone info
     */
    getTimezoneInfo() {
        return {
            timezone: this.userTimezone,
            country: this.userCountry,
            city: this.userCity,
            offset: this.getTimezoneOffset(),
            currentTime: this.getCurrentTime().toISOString()
        };
    }
    
    /**
     * Get session statistics
     */
    getSessionStats() {
        if (!this.sessionStartTime) return null;
        
        const now = new Date();
        const duration = now.getTime() - this.sessionStartTime.getTime();
        
        return {
            startTime: this.sessionStartTime.toISOString(),
            currentTime: now.toISOString(),
            duration: duration,
            durationFormatted: this.formatDuration(duration),
            timezone: this.userTimezone,
            timelineEvents: this.activityTimeline.length
        };
    }
    
    /**
     * Format duration in human readable format
     */
    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
    
    /**
     * Create a time display element
     */
    createTimeDisplay(options = {}) {
        const element = document.createElement('span');
        element.className = 'live-time clock-text text-white font-bold';
        
        if (options.className) {
            element.className += ` ${options.className}`;
        }
        
        if (options.format) {
            element.dataset.timeOptions = JSON.stringify(options.format);
        }
        
        this.registerTimeElement(element, options.format);
        return element;
    }
    
    /**
     * Cleanup
     */
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.trackSessionEnd();
    }
}

// Export to global scope
window.TimeTrackingSystem = TimeTrackingSystem;

// Auto-initialize if not already done
if (!window.timeTracker) {
    window.timeTracker = new TimeTrackingSystem();
}

console.log('🕐 Time Tracking System loaded');
