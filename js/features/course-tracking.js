/**
 * Course Completion Tracking System
 * Tracks and stores user progress in database
 */

(function() {
    'use strict';

    const CourseTracking = {
        DB_COLLECTION: 'user_progress',
        
        init() {
            this.setupEventListeners();
            console.log('📊 Course Tracking System initialized');
        },

        // Setup event listeners
        setupEventListeners() {
            // Listen for course completion events
            document.addEventListener('courseCompleted', (e) => {
                this.trackCompletion(e.detail);
            });
            
            document.addEventListener('quizCompleted', (e) => {
                this.trackQuizCompletion(e.detail);
            });
            
            document.addEventListener('lessonCompleted', (e) => {
                this.trackLessonCompletion(e.detail);
            });
        },

        // Track course completion
        async trackCompletion(data) {
            const user = this.getCurrentUser();
            if (!user) {
                console.error('No user logged in');
                return;
            }

            const progressData = {
                userId: user.id || user._id,
                userEmail: user.email,
                courseId: data.courseId || data.courseName,
                courseName: data.courseName,
                completionPercentage: data.completionPercentage || 100,
                score: data.score || 0,
                totalQuestions: data.totalQuestions || 0,
                correctAnswers: data.correctAnswers || 0,
                completedAt: new Date().toISOString(),
                status: 'completed'
            };

            try {
                // Store in localStorage first (offline support)
                this.storeLocally(progressData);
                
                // Try to store in backend
                await this.storeInBackend(progressData);
                
                // Update user profile
                this.updateUserProfile(progressData);
                
                // Trigger email notification
                this.triggerEmailNotification(progressData);
                
                console.log('✅ Course completion tracked:', progressData.courseName);
                
                // Dispatch event for other components
                document.dispatchEvent(new CustomEvent('completionTracked', {
                    detail: progressData
                }));
                
            } catch (error) {
                console.error('Failed to track completion:', error);
            }
        },

        // Track quiz completion
        async trackQuizCompletion(data) {
            const user = this.getCurrentUser();
            if (!user) return;

            const quizData = {
                userId: user.id || user._id,
                userEmail: user.email,
                quizId: data.quizId || data.quizName,
                quizName: data.quizName,
                score: data.score,
                totalQuestions: data.totalQuestions,
                correctAnswers: data.correctAnswers,
                percentage: Math.round((data.correctAnswers / data.totalQuestions) * 100),
                completedAt: new Date().toISOString(),
                type: 'quiz'
            };

            this.storeLocally(quizData);
            await this.storeInBackend(quizData);
            
            // Check if this completes a course
            await this.checkCourseCompletion(quizData);
            
            console.log('✅ Quiz completion tracked:', quizData.quizName);
        },

        // Track lesson completion
        async trackLessonCompletion(data) {
            const user = this.getCurrentUser();
            if (!user) return;

            const lessonData = {
                userId: user.id || user._id,
                lessonId: data.lessonId,
                lessonName: data.lessonName,
                courseId: data.courseId,
                completedAt: new Date().toISOString(),
                type: 'lesson'
            };

            // Get existing progress
            const progress = this.getUserProgress(user.id);
            const courseProgress = progress[data.courseId] || { lessons: [] };
            
            if (!courseProgress.lessons.includes(data.lessonId)) {
                courseProgress.lessons.push(data.lessonId);
                courseProgress.completionPercentage = Math.round(
                    (courseProgress.lessons.length / data.totalLessons) * 100
                );
                
                progress[data.courseId] = courseProgress;
                localStorage.setItem(`progress_${user.id}`, JSON.stringify(progress));
                
                await this.storeInBackend({
                    userId: user.id,
                    courseId: data.courseId,
                    progress: courseProgress,
                    updatedAt: new Date().toISOString()
                });
            }
        },

        // Check if course is completed
        async checkCourseCompletion(quizData) {
            // Logic to determine if quiz completion means course completion
            const user = this.getCurrentUser();
            const progress = this.getUserProgress(user.id);
            
            // If quiz score is good enough, mark course as completed
            if (quizData.percentage >= 60) {
                const courseData = {
                    courseId: quizData.quizId,
                    courseName: quizData.quizName,
                    completionPercentage: 100,
                    score: quizData.score,
                    completedAt: new Date().toISOString()
                };
                
                await this.trackCompletion(courseData);
            }
        },

        // Store locally
        storeLocally(data) {
            const key = `completions_${data.userId}`;
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            
            // Check if already exists
            const index = existing.findIndex(c => c.courseId === data.courseId);
            if (index >= 0) {
                existing[index] = { ...existing[index], ...data };
            } else {
                existing.push(data);
            }
            
            localStorage.setItem(key, JSON.stringify(existing));
        },

        // Store in backend
        async storeInBackend(data) {
            try {
                const token = window.AuthPersistence?.getToken();
                const response = await fetch('http://localhost:5000/api/progress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) throw new Error('Backend storage failed');
                
            } catch (error) {
                console.log('Backend storage failed, queued for sync:', error.message);
                this.queueForSync(data);
            }
        },

        // Queue for later sync
        queueForSync(data) {
            const queue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
            queue.push(data);
            localStorage.setItem('sync_queue', JSON.stringify(queue));
        },

        // Update user profile
        updateUserProfile(progressData) {
            const user = this.getCurrentUser();
            if (!user) return;
            
            // Update user's completed courses
            user.completedCourses = user.completedCourses || [];
            if (!user.completedCourses.includes(progressData.courseId)) {
                user.completedCourses.push(progressData.courseId);
            }
            
            // Update stats
            user.totalCoursesCompleted = user.completedCourses.length;
            user.lastActive = new Date().toISOString();
            
            // Save updated user data
            localStorage.setItem('neuroquest_user_data', JSON.stringify(user));
            
            // Dispatch profile update event
            document.dispatchEvent(new CustomEvent('profileUpdated', {
                detail: user
            }));
        },

        // Trigger email notification
        triggerEmailNotification(data) {
            document.dispatchEvent(new CustomEvent('sendCompletionEmail', {
                detail: data
            }));
        },

        // Get current user
        getCurrentUser() {
            return window.AuthPersistence?.getUserData() || 
                   window.currentUser || 
                   JSON.parse(localStorage.getItem('neuroquest_user_data') || 'null');
        },

        // Get user progress
        getUserProgress(userId) {
            return JSON.parse(localStorage.getItem(`progress_${userId}`) || '{}');
        },

        // Get completed courses
        getCompletedCourses(userId) {
            const key = `completions_${userId}`;
            return JSON.parse(localStorage.getItem(key) || '[]');
        },

        // Get course progress
        getCourseProgress(userId, courseId) {
            const progress = this.getUserProgress(userId);
            return progress[courseId] || { completionPercentage: 0, lessons: [] };
        }
    };

    // Expose globally
    window.CourseTracking = CourseTracking;

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => CourseTracking.init());
    } else {
        CourseTracking.init();
    }
})();