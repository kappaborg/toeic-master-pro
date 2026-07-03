// Login System - Authentication for TOEIC Master Pro
// Handles student and admin login with secure credential validation

// Stored sessions older than this are considered expired
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

class LoginSystem {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.userRoles = {
            student: 'student',
            admin: 'admin'
        };
        
        // Predefined credentials
        this.credentials = {
            'Monica': {
                password: 'Thailand',
                role: 'student',
                displayName: 'Monica',
                fullName: 'Monica'
            },
            'Kappasutra': {
                password: 'Kappa14',
                role: 'admin',
                displayName: 'Kappasutra',
                fullName: 'Kappasutra'
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('🔐 Login System initialized');
        this.checkExistingSession();
    }
    
    // Check if user is already logged in
    checkExistingSession() {
        try {
            const savedUser = localStorage.getItem('toeic_current_user');
            if (savedUser) {
                const user = JSON.parse(savedUser);

                // Reject expired sessions
                const loginTime = Date.parse(user.loginTime);
                if (!Number.isFinite(loginTime) || Date.now() - loginTime > SESSION_DURATION_MS) {
                    console.log('⏰ Stored session expired, clearing it');
                    localStorage.removeItem('toeic_current_user');
                    return false;
                }

                this.currentUser = user;
                this.isAuthenticated = true;
                console.log('✅ User session restored:', user.displayName);
                return true;
            }
        } catch (error) {
            console.error('❌ Error checking existing session:', error);
            this.logout();
        }
        return false;
    }
    
    // Authenticate user with credentials
    authenticate(username, password) {
        console.log('🔐 Attempting authentication for:', username);
        
        // Validate input
        if (!username || !password) {
            console.log('❌ Missing username or password');
            return { success: false, message: 'Please enter both username and password' };
        }
        
        // Check credentials
        const user = this.credentials[username];
        if (!user) {
            console.log('❌ User not found:', username);
            return { success: false, message: 'Invalid username or password' };
        }
        
        if (user.password !== password) {
            console.log('❌ Invalid password for user:', username);
            return { success: false, message: 'Invalid username or password' };
        }
        
        // Successful authentication
        this.currentUser = {
            username: username,
            displayName: user.displayName,
            fullName: user.fullName,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        
        this.isAuthenticated = true;
        
        // Save session
        this.saveSession();
        
        console.log('✅ Authentication successful for:', username, 'Role:', user.role);
        
        return { 
            success: true, 
            message: 'Login successful!',
            user: this.currentUser
        };
    }
    
    // Save user session to localStorage
    saveSession() {
        try {
            localStorage.setItem('toeic_current_user', JSON.stringify(this.currentUser));
            console.log('💾 User session saved');
        } catch (error) {
            console.error('❌ Error saving session:', error);
        }
    }
    
    // Logout user
    logout() {
        console.log('🚪 Logging out user:', this.currentUser?.displayName || 'Unknown');
        
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Clear session
        try {
            localStorage.removeItem('toeic_current_user');
            console.log('🗑️ User session cleared');
        } catch (error) {
            console.error('❌ Error clearing session:', error);
        }
    }
    
    // Get current user info
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Check if user is authenticated
    isLoggedIn() {
        return this.isAuthenticated && this.currentUser !== null;
    }
    
    // Check if user has specific role
    hasRole(role) {
        return this.isAuthenticated && this.currentUser && this.currentUser.role === role;
    }
    
    // Check if user is admin
    isAdmin() {
        return this.hasRole('admin');
    }
    
    // Check if user is student
    isStudent() {
        return this.hasRole('student');
    }
    
    // Get welcome message for user
    getWelcomeMessage() {
        if (!this.isAuthenticated || !this.currentUser) {
            return 'Welcome to TOEIC Master Pro!';
        }
        
        const name = this.currentUser.displayName;
        const role = this.currentUser.role;
        
        const greetings = [
            `Welcome back, ${name}! 🌟`,
            `Hello ${name}! Ready to practice? 📚`,
            `Great to see you again, ${name}! 🎯`,
            `Welcome, ${name}! Let's ace that TOEIC! 💪`,
            `Hi ${name}! Time to master English! 🚀`
        ];
        
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        return {
            greeting: randomGreeting,
            name: name,
            role: role,
            isAdmin: role === 'admin',
            isStudent: role === 'student'
        };
    }
    
    // Get user dashboard info
    getUserDashboardInfo() {
        if (!this.isAuthenticated || !this.currentUser) {
            return null;
        }
        
        return {
            name: this.currentUser.displayName,
            role: this.currentUser.role,
            loginTime: this.currentUser.loginTime,
            isAdmin: this.currentUser.role === 'admin',
            isStudent: this.currentUser.role === 'student',
            permissions: this.getUserPermissions()
        };
    }
    
    // Get user permissions based on role
    getUserPermissions() {
        if (!this.isAuthenticated || !this.currentUser) {
            return [];
        }
        
        const role = this.currentUser.role;
        
        if (role === 'admin') {
            return [
                'student_tracking',
                'real_time_monitoring',
                'analytics_dashboard',
                'session_management',
                'progress_monitoring',
                'performance_analysis',
                'user_management',
                'system_controls'
            ];
        } else if (role === 'student') {
            return [
                'vocabulary_practice',
                'reading_comprehension',
                'grammar_practice',
                'test_simulation',
                'flashcard_review',
                'progress_tracking'
            ];
        }
        
        return [];
    }
    
    // Check if user has specific permission
    hasPermission(permission) {
        const permissions = this.getUserPermissions();
        return permissions.includes(permission);
    }
    
    // Get admin-specific features
    getAdminFeatures() {
        if (!this.isAdmin()) {
            return [];
        }
        
        return [
            {
                id: 'student_tracking',
                name: 'Student Tracking',
                description: 'Monitor student activities in real-time',
                icon: '👥',
                enabled: true
            },
            {
                id: 'analytics_dashboard',
                name: 'Analytics Dashboard',
                description: 'View detailed performance analytics',
                icon: '📊',
                enabled: true
            },
            {
                id: 'session_management',
                name: 'Session Management',
                description: 'Manage and control student sessions',
                icon: '⚙️',
                enabled: true
            },
            {
                id: 'progress_monitoring',
                name: 'Progress Monitoring',
                description: 'Track student learning progress',
                icon: '📈',
                enabled: true
            }
        ];
    }
}

// Initialize login system
window.loginSystem = new LoginSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginSystem;
}
