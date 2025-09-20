// Admin Dashboard System - Real-time Student Tracking
// Provides comprehensive monitoring and management tools for administrators

class AdminDashboard {
    constructor() {
        this.isActive = false;
        this.studentData = new Map();
        this.realTimeUpdates = true;
        this.updateInterval = null;
        this.dashboardElement = null;
        this.studentSessions = new Map();
        this.performanceMetrics = {
            totalSessions: 0,
            activeStudents: 0,
            averageScore: 0,
            completionRate: 0
        };
        this.isProduction = false;
        this.updateIntervalMs = 2000; // Default 2 seconds
        
        this.init();
    }
    
    init() {
        console.log('👨‍💼 Admin Dashboard initialized');
        this.setupEventListeners();
        this.loadStudentData();
    }
    
    // Setup event listeners for real-time updates
    setupEventListeners() {
        // Listen for student activities
        document.addEventListener('studentActivity', (event) => {
            this.handleStudentActivity(event.detail);
        });
        
        // Listen for session updates
        document.addEventListener('sessionUpdate', (event) => {
            this.handleSessionUpdate(event.detail);
        });
        
        // Listen for performance updates
        document.addEventListener('performanceUpdate', (event) => {
            this.handlePerformanceUpdate(event.detail);
        });
    }
    
    // Load existing student data
    loadStudentData() {
        try {
            const savedData = localStorage.getItem('admin_student_data');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.studentData = new Map(data.students || []);
                this.performanceMetrics = data.metrics || this.performanceMetrics;
                console.log('📊 Student data loaded:', this.studentData.size, 'students');
            }
        } catch (error) {
            console.error('❌ Error loading student data:', error);
            // Initialize with empty data if loading fails
            this.studentData = new Map();
            this.performanceMetrics = {
                totalSessions: 0,
                activeStudents: 0,
                averageScore: 0,
                completionRate: 0
            };
        }
    }
    
    // Save student data
    saveStudentData() {
        try {
            const data = {
                students: Array.from(this.studentData.entries()),
                metrics: this.performanceMetrics,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('admin_student_data', JSON.stringify(data));
        } catch (error) {
            console.error('❌ Error saving student data:', error);
        }
    }
    
    // Handle student activity events
    handleStudentActivity(activity) {
        const { studentId, activityType, data, timestamp } = activity;
        
        if (!this.studentData.has(studentId)) {
            this.studentData.set(studentId, {
                id: studentId,
                name: data.name || 'Unknown Student',
                lastActivity: timestamp,
                activities: [],
                totalSessions: 0,
                averageScore: 0,
                currentSession: null
            });
        }
        
        const student = this.studentData.get(studentId);
        student.lastActivity = timestamp;
        student.activities.push({
            type: activityType,
            data: data,
            timestamp: timestamp
        });
        
        // Keep only last 50 activities
        if (student.activities.length > 50) {
            student.activities = student.activities.slice(-50);
        }
        
        this.updateRealTimeDisplay();
        this.saveStudentData();
    }
    
    // Handle session updates
    handleSessionUpdate(sessionData) {
        const { studentId, sessionType, status, data } = sessionData;
        
        if (!this.studentSessions.has(studentId)) {
            this.studentSessions.set(studentId, []);
        }
        
        const sessions = this.studentSessions.get(studentId);
        sessions.push({
            type: sessionType,
            status: status,
            data: data,
            timestamp: new Date().toISOString()
        });
        
        // Update student data
        if (this.studentData.has(studentId)) {
            const student = this.studentData.get(studentId);
            student.currentSession = sessionData;
            student.totalSessions++;
        }
        
        this.updatePerformanceMetrics();
        this.updateRealTimeDisplay();
    }
    
    // Handle performance updates
    handlePerformanceUpdate(performanceData) {
        const { studentId, scores, completionRate } = performanceData;
        
        if (this.studentData.has(studentId)) {
            const student = this.studentData.get(studentId);
            student.averageScore = scores.average || 0;
            student.completionRate = completionRate || 0;
            student.lastPerformanceUpdate = new Date().toISOString();
        }
        
        this.updatePerformanceMetrics();
        this.updateRealTimeDisplay();
    }
    
    // Update performance metrics
    updatePerformanceMetrics() {
        const students = Array.from(this.studentData.values());
        
        this.performanceMetrics.totalSessions = students.reduce((sum, student) => sum + student.totalSessions, 0);
        this.performanceMetrics.activeStudents = students.filter(student => {
            const lastActivity = new Date(student.lastActivity);
            const now = new Date();
            return (now - lastActivity) < 300000; // Active within last 5 minutes
        }).length;
        
        const studentsWithScores = students.filter(student => student.averageScore > 0);
        this.performanceMetrics.averageScore = studentsWithScores.length > 0 
            ? studentsWithScores.reduce((sum, student) => sum + student.averageScore, 0) / studentsWithScores.length 
            : 0;
        
        this.performanceMetrics.completionRate = students.length > 0 
            ? students.reduce((sum, student) => sum + student.completionRate, 0) / students.length 
            : 0;
    }
    
    // Show admin dashboard
    showDashboard() {
        if (!window.loginSystem || !window.loginSystem.isAdmin()) {
            console.error('❌ Admin access required');
            return;
        }
        
        this.isActive = true;
        this.createDashboardHTML();
        this.startRealTimeUpdates();
        console.log('👨‍💼 Admin dashboard opened');
    }
    
    // Create dashboard HTML
    createDashboardHTML() {
        // Remove existing dashboard if any
        const existingDashboard = document.getElementById('adminDashboard');
        if (existingDashboard) {
            existingDashboard.remove();
        }
        
        // Create dashboard container
        this.dashboardElement = document.createElement('div');
        this.dashboardElement.id = 'adminDashboard';
        this.dashboardElement.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        
        this.dashboardElement.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold">👨‍💼 Admin Dashboard</h1>
                        <p class="text-purple-200 mt-1">Real-time Student Monitoring & Analytics</p>
                    </div>
                    <button id="closeAdminDashboard" class="text-white hover:text-purple-200 text-2xl font-bold">
                        ✕
                    </button>
                </div>
                
                <!-- Dashboard Content -->
                <div class="flex h-full">
                    <!-- Sidebar -->
                    <div class="w-1/4 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
                        <div class="space-y-4">
                            <!-- Quick Stats -->
                            <div class="bg-white rounded-lg p-4 shadow-sm">
                                <h3 class="font-semibold text-gray-800 mb-3">📊 Quick Stats</h3>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span>Active Students:</span>
                                        <span class="font-semibold text-green-600" id="activeStudentsCount">${this.performanceMetrics.activeStudents}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Total Sessions:</span>
                                        <span class="font-semibold text-blue-600" id="totalSessionsCount">${this.performanceMetrics.totalSessions}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Avg Score:</span>
                                        <span class="font-semibold text-purple-600" id="averageScoreDisplay">${(this.performanceMetrics.averageScore || 0).toFixed(1)}%</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Completion:</span>
                                        <span class="font-semibold text-orange-600" id="completionRateDisplay">${(this.performanceMetrics.completionRate || 0).toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Student List -->
                            <div class="bg-white rounded-lg p-4 shadow-sm">
                                <h3 class="font-semibold text-gray-800 mb-3">👥 Students</h3>
                                <div id="studentList" class="space-y-2 max-h-64 overflow-y-auto">
                                    ${this.generateStudentListHTML()}
                                </div>
                            </div>
                            
                            <!-- Controls -->
                            <div class="bg-white rounded-lg p-4 shadow-sm">
                                <h3 class="font-semibold text-gray-800 mb-3">⚙️ Controls</h3>
                                <div class="space-y-2">
                                    <button id="refreshData" class="w-full bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                                        🔄 Refresh Data
                                    </button>
                                    <button id="exportData" class="w-full bg-green-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-600 transition-colors">
                                        📊 Export Analytics
                                    </button>
                                    <button id="clearData" class="w-full bg-red-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors">
                                        🗑️ Clear Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Main Content -->
                    <div class="flex-1 p-6 overflow-y-auto">
                        <div class="space-y-6">
                            <!-- Real-time Activity Feed -->
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div class="p-4 border-b border-gray-200">
                                    <h3 class="text-lg font-semibold text-gray-800">🔄 Real-time Activity Feed</h3>
                                </div>
                                <div id="activityFeed" class="p-4 max-h-64 overflow-y-auto">
                                    ${this.generateActivityFeedHTML()}
                                </div>
                            </div>
                            
                            <!-- Student Details -->
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div class="p-4 border-b border-gray-200">
                                    <h3 class="text-lg font-semibold text-gray-800">👤 Student Details</h3>
                                </div>
                                <div id="studentDetails" class="p-4">
                                    <div class="text-center text-gray-500 py-8">
                                        Select a student to view details
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Performance Analytics -->
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div class="p-4 border-b border-gray-200">
                                    <h3 class="text-lg font-semibold text-gray-800">📈 Performance Analytics</h3>
                                </div>
                                <div id="performanceAnalytics" class="p-4">
                                    ${this.generatePerformanceAnalyticsHTML()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.dashboardElement);
        this.setupDashboardEventListeners();
    }
    
    // Generate student list HTML
    generateStudentListHTML() {
        const students = Array.from(this.studentData.values());
        
        if (students.length === 0) {
            return '<div class="text-gray-500 text-sm text-center py-4">No student data available</div>';
        }
        
        return students.map(student => {
            const isActive = this.isStudentActive(student);
            const statusColor = isActive ? 'text-green-600' : 'text-gray-500';
            const statusIcon = isActive ? '🟢' : '⚪';
            
            return `
                <div class="student-item p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors" data-student-id="${student.id}">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="font-medium text-sm">${student.name}</div>
                            <div class="text-xs ${statusColor}">${statusIcon} ${isActive ? 'Active' : 'Inactive'}</div>
                        </div>
                        <div class="text-xs text-gray-500">
                            ${student.totalSessions} sessions
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Generate activity feed HTML
    generateActivityFeedHTML() {
        const allActivities = [];
        
        this.studentData.forEach(student => {
            student.activities.forEach(activity => {
                allActivities.push({
                    ...activity,
                    studentName: student.name
                });
            });
        });
        
        // Sort by timestamp (newest first)
        allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (allActivities.length === 0) {
            return '<div class="text-gray-500 text-sm text-center py-4">No recent activity</div>';
        }
        
        return allActivities.slice(0, 20).map(activity => {
            const timeAgo = this.getTimeAgo(activity.timestamp);
            const activityIcon = this.getActivityIcon(activity.type);
            
            return `
                <div class="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                    <div class="text-lg">${activityIcon}</div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-900">${activity.studentName}</div>
                        <div class="text-sm text-gray-600">${activity.type}</div>
                        <div class="text-xs text-gray-500">${timeAgo}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Generate performance analytics HTML
    generatePerformanceAnalyticsHTML() {
        const students = Array.from(this.studentData.values());
        
        if (students.length === 0) {
            return '<div class="text-gray-500 text-sm text-center py-4">No performance data available</div>';
        }
        
        const topPerformers = students
            .filter(student => student.averageScore > 0)
            .sort((a, b) => b.averageScore - a.averageScore)
            .slice(0, 5);
        
        const mostActive = students
            .sort((a, b) => b.totalSessions - a.totalSessions)
            .slice(0, 5);
        
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Top Performers -->
                <div>
                    <h4 class="font-semibold text-gray-800 mb-3">🏆 Top Performers</h4>
                    <div class="space-y-2">
                        ${topPerformers.map((student, index) => `
                            <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div class="flex items-center space-x-2">
                                    <span class="text-sm font-medium">${index + 1}.</span>
                                    <span class="text-sm">${student.name}</span>
                                </div>
                                <span class="text-sm font-semibold text-green-600">${student.averageScore.toFixed(1)}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Most Active -->
                <div>
                    <h4 class="font-semibold text-gray-800 mb-3">🔥 Most Active</h4>
                    <div class="space-y-2">
                        ${mostActive.map((student, index) => `
                            <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div class="flex items-center space-x-2">
                                    <span class="text-sm font-medium">${index + 1}.</span>
                                    <span class="text-sm">${student.name}</span>
                                </div>
                                <span class="text-sm font-semibold text-blue-600">${student.totalSessions} sessions</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Setup dashboard event listeners
    setupDashboardEventListeners() {
        // Close dashboard
        document.getElementById('closeAdminDashboard').addEventListener('click', () => {
            this.hideDashboard();
        });
        
        // Student selection
        document.querySelectorAll('.student-item').forEach(item => {
            item.addEventListener('click', () => {
                const studentId = item.dataset.studentId;
                this.showStudentDetails(studentId);
            });
        });
        
        // Control buttons
        document.getElementById('refreshData').addEventListener('click', () => {
            this.refreshData();
        });
        
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportAnalytics();
        });
        
        document.getElementById('clearData').addEventListener('click', () => {
            this.clearAllData();
        });
        
        // Close on outside click
        this.dashboardElement.addEventListener('click', (e) => {
            if (e.target === this.dashboardElement) {
                this.hideDashboard();
            }
        });
    }
    
    // Show student details
    showStudentDetails(studentId) {
        const student = this.studentData.get(studentId);
        if (!student) return;
        
        const detailsElement = document.getElementById('studentDetails');
        detailsElement.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        ${student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 class="text-xl font-semibold text-gray-800">${student.name}</h4>
                        <p class="text-gray-600">Student ID: ${student.id}</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-blue-50 p-3 rounded-lg text-center">
                        <div class="text-2xl font-bold text-blue-600">${student.totalSessions}</div>
                        <div class="text-sm text-gray-600">Total Sessions</div>
                    </div>
                    <div class="bg-green-50 p-3 rounded-lg text-center">
                        <div class="text-2xl font-bold text-green-600">${student.averageScore.toFixed(1)}%</div>
                        <div class="text-sm text-gray-600">Average Score</div>
                    </div>
                    <div class="bg-purple-50 p-3 rounded-lg text-center">
                        <div class="text-2xl font-bold text-purple-600">${student.completionRate.toFixed(1)}%</div>
                        <div class="text-sm text-gray-600">Completion Rate</div>
                    </div>
                    <div class="bg-orange-50 p-3 rounded-lg text-center">
                        <div class="text-2xl font-bold text-orange-600">${this.isStudentActive(student) ? 'Active' : 'Inactive'}</div>
                        <div class="text-sm text-gray-600">Status</div>
                    </div>
                </div>
                
                <div>
                    <h5 class="font-semibold text-gray-800 mb-2">Recent Activities</h5>
                    <div class="space-y-2 max-h-40 overflow-y-auto">
                        ${student.activities.slice(-10).map(activity => `
                            <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                                <span>${this.getActivityIcon(activity.type)}</span>
                                <span class="text-sm">${activity.type}</span>
                                <span class="text-xs text-gray-500 ml-auto">${this.getTimeAgo(activity.timestamp)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Set production mode
    setProductionMode(isProduction) {
        this.isProduction = isProduction;
        if (isProduction) {
            console.log('🚀 Admin Dashboard: Production mode enabled');
            // Optimize for production
            this.updateIntervalMs = 2000; // 2 seconds in production
        } else {
            this.updateIntervalMs = 1000; // 1 second in development
        }
    }
    
    // Start real-time updates
    startRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(() => {
            this.updateRealTimeDisplay();
        }, this.updateIntervalMs);
    }
    
    // Stop real-time updates
    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    // Update real-time display
    updateRealTimeDisplay() {
        if (!this.isActive || !this.dashboardElement) return;
        
        // Update quick stats
        document.getElementById('activeStudentsCount').textContent = this.performanceMetrics.activeStudents;
        document.getElementById('totalSessionsCount').textContent = this.performanceMetrics.totalSessions;
        document.getElementById('averageScoreDisplay').textContent = `${this.performanceMetrics.averageScore.toFixed(1)}%`;
        document.getElementById('completionRateDisplay').textContent = `${this.performanceMetrics.completionRate.toFixed(1)}%`;
        
        // Update student list
        document.getElementById('studentList').innerHTML = this.generateStudentListHTML();
        
        // Update activity feed
        document.getElementById('activityFeed').innerHTML = this.generateActivityFeedHTML();
        
        // Update performance analytics
        document.getElementById('performanceAnalytics').innerHTML = this.generatePerformanceAnalyticsHTML();
        
        // Re-setup event listeners for new elements
        this.setupStudentListListeners();
    }
    
    // Setup student list listeners
    setupStudentListListeners() {
        document.querySelectorAll('.student-item').forEach(item => {
            item.addEventListener('click', () => {
                const studentId = item.dataset.studentId;
                this.showStudentDetails(studentId);
            });
        });
    }
    
    // Hide dashboard
    hideDashboard() {
        this.isActive = false;
        this.stopRealTimeUpdates();
        
        if (this.dashboardElement) {
            this.dashboardElement.remove();
            this.dashboardElement = null;
        }
        
        console.log('👨‍💼 Admin dashboard closed');
    }
    
    // Refresh data
    refreshData() {
        this.loadStudentData();
        this.updatePerformanceMetrics();
        this.updateRealTimeDisplay();
        console.log('🔄 Admin data refreshed');
    }
    
    // Export analytics
    exportAnalytics() {
        const data = {
            students: Array.from(this.studentData.entries()),
            metrics: this.performanceMetrics,
            sessions: Array.from(this.studentSessions.entries()),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `toeic-admin-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📊 Analytics exported');
    }
    
    // Clear all data
    clearAllData() {
        if (confirm('Are you sure you want to clear all student data? This action cannot be undone.')) {
            this.studentData.clear();
            this.studentSessions.clear();
            this.performanceMetrics = {
                totalSessions: 0,
                activeStudents: 0,
                averageScore: 0,
                completionRate: 0
            };
            
            localStorage.removeItem('admin_student_data');
            this.updateRealTimeDisplay();
            console.log('🗑️ All admin data cleared');
        }
    }
    
    // Utility methods
    isStudentActive(student) {
        const lastActivity = new Date(student.lastActivity);
        const now = new Date();
        return (now - lastActivity) < 300000; // Active within last 5 minutes
    }
    
    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }
    
    getActivityIcon(activityType) {
        const icons = {
            'login': '🔐',
            'vocabulary_practice': '📚',
            'reading_comprehension': '📖',
            'grammar_practice': '✏️',
            'test_simulation': '📝',
            'flashcard_review': '🃏',
            'session_start': '▶️',
            'session_end': '⏹️',
            'answer_submitted': '✅',
            'score_achieved': '🎯'
        };
        return icons[activityType] || '📋';
    }
    
    // Public methods for external use
    trackStudentActivity(studentId, activityType, data) {
        const activity = {
            studentId,
            activityType,
            data,
            timestamp: new Date().toISOString()
        };
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('studentActivity', { detail: activity }));
    }
    
    trackSessionUpdate(studentId, sessionType, status, data) {
        const sessionUpdate = {
            studentId,
            sessionType,
            status,
            data,
            timestamp: new Date().toISOString()
        };
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('sessionUpdate', { detail: sessionUpdate }));
    }
    
    trackPerformanceUpdate(studentId, scores, completionRate) {
        const performanceUpdate = {
            studentId,
            scores,
            completionRate,
            timestamp: new Date().toISOString()
        };
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('performanceUpdate', { detail: performanceUpdate }));
    }
}

// Initialize admin dashboard
window.adminDashboard = new AdminDashboard();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDashboard;
}
