/**
 * Profile Integration System
 * Displays real user data, completed courses, and progress
 */

(function() {
    'use strict';

    const ProfileIntegration = {
        init() {
            this.setupEventListeners();
            this.injectProfileSection();
            console.log('👤 Profile Integration initialized');
        },

        // Setup event listeners
        setupEventListeners() {
            // Update profile when user logs in
            document.addEventListener('userSessionRestored', () => {
                this.updateProfileDisplay();
            });
            
            // Update profile when completion is tracked
            document.addEventListener('completionTracked', () => {
                this.updateProfileDisplay();
            });
            
            // Update profile when profile is updated
            document.addEventListener('profileUpdated', () => {
                this.updateProfileDisplay();
            });
            
            // Check for profile section periodically
            setInterval(() => this.updateProfileDisplay(), 2000);
        },

        // Inject profile section if not exists
        injectProfileSection() {
            const checkAndInject = () => {
                // Check if profile already exists
                if (document.querySelector('.profile-stats, #profile-stats')) return;
                
                // Find a good location (dashboard or settings)
                const container = document.querySelector('.dashboard, #dashboard, .main-content, ' +
                    '.settings-panel, #settings, .user-section');
                
                if (!container) return;
                
                const profileSection = document.createElement('div');
                profileSection.className = 'profile-stats';
                profileSection.id = 'profile-stats';
                profileSection.style.cssText = `
                    background: rgba(0, 212, 255, 0.1);
                    border: 1px solid rgba(0, 212, 255, 0.3);
                    border-radius: 12px;
                    padding: 20px;
                    margin: 20px 0;
                `;
                
                profileSection.innerHTML = `
                    <h3 style="color: #00d4ff; margin: 0 0 15px;">📊 Your Progress</h3>
                    <div id="profile-content">
                        <p style="color: #888;">Loading your progress...</p>
                    </div>
                `;
                
                container.insertBefore(profileSection, container.firstChild);
                this.updateProfileDisplay();
            };
            
            setTimeout(checkAndInject, 1000);
        },

        // Update profile display with real data
        updateProfileDisplay() {
            const user = this.getCurrentUser();
            const contentDiv = document.getElementById('profile-content');
            
            if (!contentDiv) return;
            
            if (!user) {
                contentDiv.innerHTML = '<p style="color: #888;">Please log in to view your progress</p>';
                return;
            }
            
            // Get completed courses
            const completions = this.getCompletedCourses(user.id);
            const totalCourses = completions.length;
            const avgScore = totalCourses > 0 
                ? Math.round(completions.reduce((a, b) => a + (b.score || 0), 0) / totalCourses)
                : 0;
            
            // Get in-progress courses
            const progress = this.getUserProgress(user.id);
            const inProgressCourses = Object.keys(progress).filter(
                courseId => progress[courseId].completionPercentage < 100
            );
            
            // Build HTML
            let html = `
                <div style="margin-bottom: 15px;">
                    <strong style="color: #00d4ff;">👤 ${user.name || user.username || user.email}</strong>
                    <span style="color: #888; font-size: 12px;"> (${user.email})</span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
                    <div style="text-align: center; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: #00ff88;">${totalCourses}</div>
                        <div style="font-size: 12px; color: #888;">Completed</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: #00d4ff;">${avgScore}%</div>
                        <div style="font-size: 12px; color: #888;">Avg Score</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: #ffaa00;">${inProgressCourses.length}</div>
                        <div style="font-size: 12px; color: #888;">In Progress</div>
                    </div>
                </div>
            `;
            
            // Completed courses list
            if (totalCourses > 0) {
                html += `<div style="margin-bottom: 15px;"><strong style="color: #00ff88;">✅ Completed Courses:</strong></div>`;
                html += `<div style="max-height: 150px; overflow-y: auto;">`;
                
                completions.slice(0, 5).forEach(course => {
                    const date = new Date(course.completedAt).toLocaleDateString();
                    html += `
                        <div style="display: flex; justify-content: space-between; padding: 8px; 
                                    background: rgba(0,255,136,0.1); margin-bottom: 5px; border-radius: 5px;">
                            <span style="color: #fff;">${course.courseName}</span>
                            <span style="color: #00ff88;">${course.score || 0}% • ${date}</span>
                        </div>
                    `;
                });
                
                if (totalCourses > 5) {
                    html += `<div style="text-align: center; color: #888; font-size: 12px;">+${totalCourses - 5} more</div>`;
                }
                
                html += `</div>`;
                
                // Download report button
                html += `
                    <button onclick="window.ReportGenerator?.generateFullReport()" 
                            style="width: 100%; margin-top: 15px; padding: 12px; 
                                   background: linear-gradient(135deg, #00d4ff, #0099cc);
                                   border: none; border-radius: 8px; color: #0a0a0f; 
                                   font-weight: 600; cursor: pointer;">
                        📥 Download Full Report
                    </button>
                `;
            } else {
                html += `
                    <div style="text-align: center; padding: 20px; color: #888;">
                        <p>No courses completed yet.</p>
                        <p style="font-size: 12px;">Start learning to see your progress here!</p>
                    </div>
                `;
            }
            
            // In-progress courses
            if (inProgressCourses.length > 0) {
                html += `<div style="margin-top: 15px;"><strong style="color: #ffaa00;">🔄 In Progress:</strong></div>`;
                
                inProgressCourses.slice(0, 3).forEach(courseId => {
                    const courseProgress = progress[courseId];
                    html += `
                        <div style="margin-bottom: 8px;">
                            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #888;">
                                <span>${courseId}</span>
                                <span>${courseProgress.completionPercentage}%</span>
                            </div>
                            <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-top: 4px;">
                                <div style="height: 100%; width: ${courseProgress.completionPercentage}%; 
                                            background: linear-gradient(90deg, #ffaa00, #ff8800); 
                                            border-radius: 3px; transition: width 0.3s;"></div>
                            </div>
                        </div>
                    `;
                });
            }
            
            contentDiv.innerHTML = html;
        },

        // Get current user
        getCurrentUser() {
            return window.AuthPersistence?.getUserData() || 
                   window.currentUser || 
                   JSON.parse(localStorage.getItem('neuroquest_user_data') || 'null');
        },

        // Get completed courses
        getCompletedCourses(userId) {
            if (window.CourseTracking?.getCompletedCourses) {
                return window.CourseTracking.getCompletedCourses(userId);
            }
            return JSON.parse(localStorage.getItem(`completions_${userId}`) || '[]');
        },

        // Get user progress
        getUserProgress(userId) {
            if (window.CourseTracking?.getUserProgress) {
                return window.CourseTracking.getUserProgress(userId);
            }
            return JSON.parse(localStorage.getItem(`progress_${userId}`) || '{}');
        }
    };

    // Expose globally
    window.ProfileIntegration = ProfileIntegration;

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ProfileIntegration.init());
    } else {
        ProfileIntegration.init();
    }
})();