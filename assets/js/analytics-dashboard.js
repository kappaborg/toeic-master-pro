/**
 * Analytics Dashboard for TOEIC Master Pro
 * Interactive dashboard for viewing and analyzing user data
 */

class AnalyticsDashboard {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        this.charts = {};
        this.currentView = 'overview';
        
        console.log(`📊 Analytics Dashboard v${this.version} initialized`);
    }
    
    /**
     * Initialize the dashboard
     */
    async init() {
        try {
            if (!window.advancedAnalytics) {
                console.error('❌ Advanced Analytics System not available');
                return;
            }
            
            this.isInitialized = true;
            console.log('✅ Analytics Dashboard initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Analytics Dashboard:', error);
        }
    }
    
    /**
     * Show analytics dashboard
     */
    showDashboard() {
        const content = document.getElementById('toeicModuleContent');
        if (!content) return;
        
        content.innerHTML = this.generateDashboardHTML();
        
        // Initialize dashboard components
        this.initializeDashboardComponents();
        
        // Load analytics data
        this.loadAnalyticsData();
        
        console.log('📊 Analytics Dashboard displayed');
    }
    
    /**
     * Generate dashboard HTML
     */
    generateDashboardHTML() {
        return `
            <div class="max-w-7xl mx-auto">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h3 class="text-2xl font-bold text-white mb-2">📊 Analytics Dashboard</h3>
                        <p class="text-white/80">Comprehensive learning analytics and insights</p>
                    </div>
                    <div class="flex gap-4">
                        <button onclick="window.analyticsDashboard.exportData()" class="btn btn-secondary">
                            <i data-lucide="download" class="w-5 h-5 mr-2"></i>
                            Export Data
                        </button>
                        <button onclick="window.analyticsDashboard.refreshData()" class="btn btn-primary">
                            <i data-lucide="refresh-cw" class="w-5 h-5 mr-2"></i>
                            Refresh
                        </button>
                        <button onclick="window.app.endCurrentSession()" class="btn btn-secondary">
                            <i data-lucide="home" class="w-5 h-5 mr-2"></i>
                            Back to Menu
                        </button>
                    </div>
                </div>
                
                <!-- Navigation Tabs -->
                <div class="flex space-x-1 mb-8 bg-gray-800/50 rounded-lg p-1">
                    <button onclick="window.analyticsDashboard.showView('overview')" 
                            class="tab-btn ${this.currentView === 'overview' ? 'active' : ''}" 
                            data-view="overview">
                        <i data-lucide="bar-chart-3" class="w-5 h-5 mr-2"></i>
                        Overview
                    </button>
                    <button onclick="window.analyticsDashboard.showView('performance')" 
                            class="tab-btn ${this.currentView === 'performance' ? 'active' : ''}" 
                            data-view="performance">
                        <i data-lucide="trending-up" class="w-5 h-5 mr-2"></i>
                        Performance
                    </button>
                    <button onclick="window.analyticsDashboard.showView('learning')" 
                            class="tab-btn ${this.currentView === 'learning' ? 'active' : ''}" 
                            data-view="learning">
                        <i data-lucide="book-open" class="w-5 h-5 mr-2"></i>
                        Learning
                    </button>
                    <button onclick="window.analyticsDashboard.showView('insights')" 
                            class="tab-btn ${this.currentView === 'insights' ? 'active' : ''}" 
                            data-view="insights">
                        <i data-lucide="lightbulb" class="w-5 h-5 mr-2"></i>
                        Insights
                    </button>
                    <button onclick="window.analyticsDashboard.showView('behavior')" 
                            class="tab-btn ${this.currentView === 'behavior' ? 'active' : ''}" 
                            data-view="behavior">
                        <i data-lucide="user" class="w-5 h-5 mr-2"></i>
                        Behavior
                    </button>
                </div>
                
                <!-- Dashboard Content -->
                <div id="dashboardContent">
                    <!-- Content will be loaded dynamically -->
                </div>
            </div>
        `;
    }
    
    /**
     * Show specific view
     */
    showView(view) {
        this.currentView = view;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Load view content
        const content = document.getElementById('dashboardContent');
        if (!content) return;
        
        switch (view) {
            case 'overview':
                content.innerHTML = this.generateOverviewView();
                break;
            case 'performance':
                content.innerHTML = this.generatePerformanceView();
                break;
            case 'learning':
                content.innerHTML = this.generateLearningView();
                break;
            case 'insights':
                content.innerHTML = this.generateInsightsView();
                break;
            case 'behavior':
                content.innerHTML = this.generateBehaviorView();
                break;
        }
        
        // Initialize view components
        this.initializeViewComponents(view);
    }
    
    /**
     * Generate overview view
     */
    generateOverviewView() {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <!-- Total Sessions -->
                <div class="glass-effect rounded-xl p-6 text-center">
                    <div class="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <i data-lucide="calendar" class="w-8 h-8 text-blue-400"></i>
                    </div>
                    <h4 class="text-lg font-semibold text-white mb-2">Total Sessions</h4>
                    <p class="text-3xl font-bold text-blue-400" id="totalSessions">0</p>
                </div>
                
                <!-- Study Time -->
                <div class="glass-effect rounded-xl p-6 text-center">
                    <div class="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                        <i data-lucide="clock" class="w-8 h-8 text-green-400"></i>
                    </div>
                    <h4 class="text-lg font-semibold text-white mb-2">Study Time</h4>
                    <p class="text-3xl font-bold text-green-400" id="totalStudyTime">0h</p>
                </div>
                
                <!-- Average Score -->
                <div class="glass-effect rounded-xl p-6 text-center">
                    <div class="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <i data-lucide="target" class="w-8 h-8 text-purple-400"></i>
                    </div>
                    <h4 class="text-lg font-semibold text-white mb-2">Average Score</h4>
                    <p class="text-3xl font-bold text-purple-400" id="averageScore">0</p>
                </div>
                
                <!-- Learning Velocity -->
                <div class="glass-effect rounded-xl p-6 text-center">
                    <div class="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <i data-lucide="trending-up" class="w-8 h-8 text-orange-400"></i>
                    </div>
                    <h4 class="text-lg font-semibold text-white mb-2">Learning Velocity</h4>
                    <p class="text-3xl font-bold text-orange-400" id="learningVelocity">0</p>
                </div>
            </div>
            
            <!-- Progress Chart -->
            <div class="glass-effect rounded-xl p-6 mb-8">
                <h4 class="text-lg font-semibold text-white mb-4">📈 Progress Over Time</h4>
                <div id="progressChart" class="h-64">
                    <canvas id="progressCanvas"></canvas>
                </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="glass-effect rounded-xl p-6">
                <h4 class="text-lg font-semibold text-white mb-4">🕒 Recent Activity</h4>
                <div id="recentActivity" class="space-y-3">
                    <!-- Recent activity items will be loaded here -->
                </div>
            </div>
        `;
    }
    
    /**
     * Generate performance view
     */
    generatePerformanceView() {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- Test Scores -->
                <div class="glass-effect rounded-xl p-6">
                    <h4 class="text-lg font-semibold text-white mb-4">🎯 Test Scores</h4>
                    <div id="testScoresChart" class="h-64">
                        <canvas id="testScoresCanvas"></canvas>
                    </div>
                </div>
                
                <!-- Module Performance -->
                <div class="glass-effect rounded-xl p-6">
                    <h4 class="text-lg font-semibold text-white mb-4">📚 Module Performance</h4>
                    <div id="modulePerformance" class="space-y-4">
                        <!-- Module performance items will be loaded here -->
                    </div>
                </div>
            </div>
            
            <!-- Performance Metrics -->
            <div class="glass-effect rounded-xl p-6">
                <h4 class="text-lg font-semibold text-white mb-4">⚡ Performance Metrics</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-400" id="pageLoadTime">0ms</div>
                        <div class="text-white/80">Page Load Time</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-400" id="userEngagement">0%</div>
                        <div class="text-white/80">User Engagement</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-red-400" id="errorRate">0%</div>
                        <div class="text-white/80">Error Rate</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Generate learning view
     */
    generateLearningView() {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- Learning Progress -->
                <div class="glass-effect rounded-xl p-6">
                    <h4 class="text-lg font-semibold text-white mb-4">📚 Learning Progress</h4>
                    <div id="learningProgressChart" class="h-64">
                        <canvas id="learningProgressCanvas"></canvas>
                    </div>
                </div>
                
                <!-- Study Patterns -->
                <div class="glass-effect rounded-xl p-6">
                    <h4 class="text-lg font-semibold text-white mb-4">🕒 Study Patterns</h4>
                    <div id="studyPatterns" class="space-y-4">
                        <!-- Study patterns will be loaded here -->
                    </div>
                </div>
            </div>
            
            <!-- Learning Statistics -->
            <div class="glass-effect rounded-xl p-6">
                <h4 class="text-lg font-semibold text-white mb-4">📊 Learning Statistics</h4>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-400" id="vocabularyProgress">0</div>
                        <div class="text-white/80">Vocabulary Items</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-400" id="readingProgress">0</div>
                        <div class="text-white/80">Reading Passages</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-400" id="listeningProgress">0</div>
                        <div class="text-white/80">Listening Exercises</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-orange-400" id="retentionRate">0%</div>
                        <div class="text-white/80">Retention Rate</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Generate insights view
     */
    generateInsightsView() {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- Strengths -->
                <div class="glass-effect rounded-xl p-6">
                    <h4 class="text-lg font-semibold text-white mb-4">💪 Strengths</h4>
                    <div id="strengthsList" class="space-y-3">
                        <!-- Strengths will be loaded here -->
                    </div>
                </div>
                
                <!-- Weaknesses -->
                <div class="glass-effect rounded-xl p-6">
                    <h4 class="text-lg font-semibold text-white mb-4">🎯 Areas for Improvement</h4>
                    <div id="weaknessesList" class="space-y-3">
                        <!-- Weaknesses will be loaded here -->
                    </div>
                </div>
            </div>
            
            <!-- Recommendations -->
            <div class="glass-effect rounded-xl p-6 mb-8">
                <h4 class="text-lg font-semibold text-white mb-4">💡 Recommendations</h4>
                <div id="recommendationsList" class="space-y-4">
                    <!-- Recommendations will be loaded here -->
                </div>
            </div>
            
            <!-- Progress Trend -->
            <div class="glass-effect rounded-xl p-6">
                <h4 class="text-lg font-semibold text-white mb-4">📈 Progress Trend</h4>
                <div id="progressTrend" class="text-center">
                    <!-- Progress trend will be loaded here -->
                </div>
            </div>
        `;
    }
    
    /**
     * Generate behavior view
     */
    generateBehaviorView() {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- User Engagement -->
                <div class="glass-effect rounded-xl p-6">
                    <h4 class="text-lg font-semibold text-white mb-4">👤 User Engagement</h4>
                    <div id="engagementChart" class="h-64">
                        <canvas id="engagementCanvas"></canvas>
                    </div>
                </div>
                
                <!-- Activity Timeline -->
                <div class="glass-effect rounded-xl p-6">
                    <h4 class="text-lg font-semibold text-white mb-4">⏰ Activity Timeline</h4>
                    <div id="activityTimeline" class="space-y-3">
                        <!-- Activity timeline will be loaded here -->
                    </div>
                </div>
            </div>
            
            <!-- Behavior Metrics -->
            <div class="glass-effect rounded-xl p-6">
                <h4 class="text-lg font-semibold text-white mb-4">📊 Behavior Metrics</h4>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-400" id="totalInteractions">0</div>
                        <div class="text-white/80">Total Interactions</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-400" id="focusTime">0h</div>
                        <div class="text-white/80">Focus Time</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-400" id="mostActiveTime">--:--</div>
                        <div class="text-white/80">Most Active Time</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-orange-400" id="studyFrequency">0</div>
                        <div class="text-white/80">Study Days</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Initialize dashboard components
     */
    initializeDashboardComponents() {
        // Add CSS for tabs
        const style = document.createElement('style');
        style.textContent = `
            .tab-btn {
                flex: 1;
                padding: 12px 16px;
                border-radius: 8px;
                background: transparent;
                color: #9CA3AF;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 500;
            }
            
            .tab-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #FFFFFF;
            }
            
            .tab-btn.active {
                background: rgba(59, 130, 246, 0.2);
                color: #60A5FA;
                border: 1px solid rgba(59, 130, 246, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Initialize view components
     */
    initializeViewComponents(view) {
        switch (view) {
            case 'overview':
                this.initializeOverviewComponents();
                break;
            case 'performance':
                this.initializePerformanceComponents();
                break;
            case 'learning':
                this.initializeLearningComponents();
                break;
            case 'insights':
                this.initializeInsightsComponents();
                break;
            case 'behavior':
                this.initializeBehaviorComponents();
                break;
        }
    }
    
    /**
     * Initialize overview components
     */
    initializeOverviewComponents() {
        // Initialize progress chart
        this.createProgressChart();
        
        // Load recent activity
        this.loadRecentActivity();
    }
    
    /**
     * Initialize performance components
     */
    initializePerformanceComponents() {
        // Initialize test scores chart
        this.createTestScoresChart();
        
        // Load module performance
        this.loadModulePerformance();
    }
    
    /**
     * Initialize learning components
     */
    initializeLearningComponents() {
        // Initialize learning progress chart
        this.createLearningProgressChart();
        
        // Load study patterns
        this.loadStudyPatterns();
    }
    
    /**
     * Initialize insights components
     */
    initializeInsightsComponents() {
        // Load insights data
        this.loadInsightsData();
    }
    
    /**
     * Initialize behavior components
     */
    initializeBehaviorComponents() {
        // Initialize engagement chart
        this.createEngagementChart();
        
        // Load activity timeline
        this.loadActivityTimeline();
    }
    
    /**
     * Load analytics data
     */
    loadAnalyticsData() {
        if (!window.advancedAnalytics) return;
        
        const report = window.advancedAnalytics.getAnalyticsReport();
        
        // Update overview metrics
        const totalSessionsEl = document.getElementById('totalSessions');
        if (totalSessionsEl) totalSessionsEl.textContent = report.user.totalSessions;
        
        const totalStudyTimeEl = document.getElementById('totalStudyTime');
        if (totalStudyTimeEl) totalStudyTimeEl.textContent = this.formatTime(report.realTime.activeTime);
        
        const averageScoreEl = document.getElementById('averageScore');
        if (averageScoreEl) averageScoreEl.textContent = Math.round(report.learning.averageTestScore);
        
        const learningVelocityEl = document.getElementById('learningVelocity');
        if (learningVelocityEl) learningVelocityEl.textContent = report.learning.learningVelocity.toFixed(2);
        
        // Update performance metrics
        const pageLoadTimeEl = document.getElementById('pageLoadTime');
        if (pageLoadTimeEl) pageLoadTimeEl.textContent = Math.round(report.performance.pageLoadTime) + 'ms';
        
        const userEngagementEl = document.getElementById('userEngagement');
        if (userEngagementEl) userEngagementEl.textContent = Math.round(report.performance.userEngagement * 100) + '%';
        
        const errorRateEl = document.getElementById('errorRate');
        if (errorRateEl) errorRateEl.textContent = Math.round(report.performance.errorRate * 100) + '%';
        
        // Update learning statistics
        const vocabularyProgressEl = document.getElementById('vocabularyProgress');
        if (vocabularyProgressEl) vocabularyProgressEl.textContent = report.learning.vocabularyProgress;
        
        const readingProgressEl = document.getElementById('readingProgress');
        if (readingProgressEl) readingProgressEl.textContent = report.learning.readingProgress;
        
        const listeningProgressEl = document.getElementById('listeningProgress');
        if (listeningProgressEl) listeningProgressEl.textContent = report.learning.listeningProgress;
        const retentionRateEl = document.getElementById('retentionRate');
        if (retentionRateEl) retentionRateEl.textContent = Math.round(report.learning.retentionRate * 100) + '%';
        
        // Update behavior metrics
        const totalInteractionsEl = document.getElementById('totalInteractions');
        if (totalInteractionsEl) totalInteractionsEl.textContent = report.user.totalInteractions;
        
        const focusTimeEl = document.getElementById('focusTime');
        if (focusTimeEl) focusTimeEl.textContent = this.formatTime(report.realTime.focusTime);
        
        const mostActiveTimeEl = document.getElementById('mostActiveTime');
        if (mostActiveTimeEl) mostActiveTimeEl.textContent = this.getMostActiveTime();
        
        const studyFrequencyEl = document.getElementById('studyFrequency');
        if (studyFrequencyEl) studyFrequencyEl.textContent = this.getStudyFrequency();
    }
    
    /**
     * Create progress chart
     */
    createProgressChart() {
        const canvas = document.getElementById('progressCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Simple chart implementation
        this.drawSimpleChart(ctx, canvas.width, canvas.height, 'Progress Over Time');
    }
    
    /**
     * Create test scores chart
     */
    createTestScoresChart() {
        const canvas = document.getElementById('testScoresCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Simple chart implementation
        this.drawSimpleChart(ctx, canvas.width, canvas.height, 'Test Scores');
    }
    
    /**
     * Create learning progress chart
     */
    createLearningProgressChart() {
        const canvas = document.getElementById('learningProgressCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Simple chart implementation
        this.drawSimpleChart(ctx, canvas.width, canvas.height, 'Learning Progress');
    }
    
    /**
     * Create engagement chart
     */
    createEngagementChart() {
        const canvas = document.getElementById('engagementCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Simple chart implementation
        this.drawSimpleChart(ctx, canvas.width, canvas.height, 'User Engagement');
    }
    
    /**
     * Draw simple chart
     */
    drawSimpleChart(ctx, width, height, title) {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 30);
        
        // Draw placeholder chart
        ctx.strokeStyle = '#60A5FA';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const points = 10;
        for (let i = 0; i < points; i++) {
            const x = (width / points) * i + 50;
            const y = height - 50 - (Math.random() * (height - 100));
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Draw axes
        ctx.strokeStyle = '#6B7280';
        ctx.lineWidth = 1;
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(50, height - 50);
        ctx.lineTo(width - 50, height - 50);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(50, height - 50);
        ctx.stroke();
    }
    
    /**
     * Load recent activity
     */
    loadRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;
        
        // Sample recent activity
        const activities = [
            { time: '2 minutes ago', action: 'Completed vocabulary session', score: '85%' },
            { time: '1 hour ago', action: 'Took reading practice test', score: '78%' },
            { time: '3 hours ago', action: 'Started listening exercise', score: '92%' },
            { time: '1 day ago', action: 'Completed full TOEIC test', score: '820' }
        ];
        
        container.innerHTML = activities.map(activity => `
            <div class="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <div>
                    <div class="text-white font-medium">${activity.action}</div>
                    <div class="text-white/60 text-sm">${activity.time}</div>
                </div>
                <div class="text-green-400 font-bold">${activity.score}</div>
            </div>
        `).join('');
    }
    
    /**
     * Load module performance
     */
    loadModulePerformance() {
        const container = document.getElementById('modulePerformance');
        if (!container) return;
        
        const modules = [
            { name: 'Vocabulary', score: 85, progress: 75 },
            { name: 'Reading', score: 78, progress: 60 },
            { name: 'Listening', score: 92, progress: 90 },
            { name: 'Grammar', score: 70, progress: 45 }
        ];
        
        container.innerHTML = modules.map(module => `
            <div class="space-y-2">
                <div class="flex justify-between items-center">
                    <span class="text-white font-medium">${module.name}</span>
                    <span class="text-green-400 font-bold">${module.score}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                         style="width: ${module.progress}%"></div>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Load study patterns
     */
    loadStudyPatterns() {
        const container = document.getElementById('studyPatterns');
        if (!container) return;
        
        const patterns = [
            { label: 'Most Active Time', value: '14:00 - 16:00' },
            { label: 'Average Session', value: '25 minutes' },
            { label: 'Study Days', value: '5 days/week' },
            { label: 'Preferred Module', value: 'Vocabulary' }
        ];
        
        container.innerHTML = patterns.map(pattern => `
            <div class="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span class="text-white/80">${pattern.label}</span>
                <span class="text-white font-medium">${pattern.value}</span>
            </div>
        `).join('');
    }
    
    /**
     * Load insights data
     */
    loadInsightsData() {
        if (!window.advancedAnalytics) return;
        
        const insights = window.advancedAnalytics.getLearningInsights();
        
        // Load strengths
        const strengthsContainer = document.getElementById('strengthsList');
        if (strengthsContainer) {
            strengthsContainer.innerHTML = insights.strengths.map(strength => `
                <div class="flex items-center p-3 bg-green-500/20 rounded-lg">
                    <i data-lucide="check-circle" class="w-5 h-5 text-green-400 mr-3"></i>
                    <div>
                        <div class="text-white font-medium">${strength.module}</div>
                        <div class="text-white/60 text-sm">${strength.description}</div>
                    </div>
                    <div class="ml-auto text-green-400 font-bold">${strength.score}%</div>
                </div>
            `).join('');
        }
        
        // Load weaknesses
        const weaknessesContainer = document.getElementById('weaknessesList');
        if (weaknessesContainer) {
            weaknessesContainer.innerHTML = insights.weaknesses.map(weakness => `
                <div class="flex items-center p-3 bg-red-500/20 rounded-lg">
                    <i data-lucide="alert-circle" class="w-5 h-5 text-red-400 mr-3"></i>
                    <div>
                        <div class="text-white font-medium">${weakness.module}</div>
                        <div class="text-white/60 text-sm">${weakness.description}</div>
                    </div>
                    <div class="ml-auto text-red-400 font-bold">${weakness.score}%</div>
                </div>
            `).join('');
        }
        
        // Load recommendations
        const recommendationsContainer = document.getElementById('recommendationsList');
        if (recommendationsContainer) {
            recommendationsContainer.innerHTML = insights.recommendations.map(rec => `
                <div class="flex items-start p-4 bg-blue-500/20 rounded-lg">
                    <i data-lucide="lightbulb" class="w-5 h-5 text-blue-400 mr-3 mt-1"></i>
                    <div class="flex-1">
                        <div class="text-white font-medium">${rec.action}</div>
                        <div class="text-white/60 text-sm">Priority: ${rec.priority}</div>
                    </div>
                </div>
            `).join('');
        }
        
        // Load progress trend
        const trendContainer = document.getElementById('progressTrend');
        if (trendContainer) {
            const trend = insights.progressTrend;
            const trendIcon = trend.trend === 'improving' ? 'trending-up' : 
                             trend.trend === 'declining' ? 'trending-down' : 'minus';
            const trendColor = trend.trend === 'improving' ? 'text-green-400' : 
                              trend.trend === 'declining' ? 'text-red-400' : 'text-gray-400';
            
            trendContainer.innerHTML = `
                <div class="text-center">
                    <i data-lucide="${trendIcon}" class="w-16 h-16 ${trendColor} mx-auto mb-4"></i>
                    <div class="text-2xl font-bold text-white mb-2">${trend.trend}</div>
                    <div class="text-white/80">${trend.change}% change</div>
                </div>
            `;
        }
    }
    
    /**
     * Load activity timeline
     */
    loadActivityTimeline() {
        const container = document.getElementById('activityTimeline');
        if (!container) return;
        
        // Sample activity timeline
        const timeline = [
            { time: '09:00', activity: 'Started vocabulary session', duration: '15 min' },
            { time: '14:30', activity: 'Completed reading test', duration: '30 min' },
            { time: '16:45', activity: 'Listened to audio exercises', duration: '20 min' },
            { time: '19:20', activity: 'Reviewed test results', duration: '10 min' }
        ];
        
        container.innerHTML = timeline.map(item => `
            <div class="flex items-center p-3 bg-gray-800/30 rounded-lg">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                <div class="flex-1">
                    <div class="text-white font-medium">${item.activity}</div>
                    <div class="text-white/60 text-sm">${item.time} • ${item.duration}</div>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Format time in hours and minutes
     */
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }
    
    /**
     * Get most active time
     */
    getMostActiveTime() {
        // This would be calculated from actual data
        return '14:00';
    }
    
    /**
     * Get study frequency
     */
    getStudyFrequency() {
        // This would be calculated from actual data
        return 5;
    }
    
    /**
     * Refresh data
     */
    refreshData() {
        this.loadAnalyticsData();
        console.log('🔄 Analytics data refreshed');
    }
    
    /**
     * Export data
     */
    exportData() {
        if (window.advancedAnalytics) {
            window.advancedAnalytics.exportAnalyticsData();
        }
    }
}

// Export to global scope
window.AnalyticsDashboard = AnalyticsDashboard;

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (!window.analyticsDashboard) {
        window.analyticsDashboard = new AnalyticsDashboard();
        window.analyticsDashboard.init();
    }
});

console.log('📊 Analytics Dashboard loaded');


