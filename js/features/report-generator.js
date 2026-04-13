/**
 * Report Generation System
 * Generates downloadable PDF reports using jsPDF
 */

(function() {
    'use strict';

    const ReportGenerator = {
        init() {
            this.loadJSPDF();
            this.addDownloadButtons();
            console.log('📄 Report Generator initialized');
        },

        // Load jsPDF library
        loadJSPDF() {
            if (window.jspdf) return;
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                console.log('✅ jsPDF loaded');
            };
            document.head.appendChild(script);
        },

        // Add download buttons to profile and completion screens
        addDownloadButtons() {
            // Wait for DOM to be ready
            setTimeout(() => {
                this.injectProfileButton();
                this.injectCompletionButton();
            }, 1000);
        },

        // Inject button into profile page
        injectProfileButton() {
            const profileSection = document.querySelector('.profile-section, #profile, .user-profile');
            if (!profileSection || document.getElementById('download-report-btn')) return;

            const btn = document.createElement('button');
            btn.id = 'download-report-btn';
            btn.innerHTML = '📥 Download Report';
            btn.style.cssText = `
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                border: none;
                border-radius: 8px;
                color: #0a0a0f;
                padding: 12px 24px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 15px;
                transition: all 0.3s;
            `;
            btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            btn.onclick = () => this.generateFullReport();

            profileSection.appendChild(btn);
        },

        // Inject button on completion screen
        injectCompletionButton() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const completionScreen = node.classList?.contains('completion-screen') ||
                                                   node.querySelector?.('.completion-message, .course-complete');
                            
                            if (completionScreen && !node.querySelector('#download-completion-report')) {
                                const btn = document.createElement('button');
                                btn.id = 'download-completion-report';
                                btn.innerHTML = '📄 Download Certificate';
                                btn.style.cssText = `
                                    background: linear-gradient(135deg, #00ff88, #00cc66);
                                    border: none;
                                    border-radius: 8px;
                                    color: #0a0a0f;
                                    padding: 15px 30px;
                                    font-weight: 600;
                                    font-size: 16px;
                                    cursor: pointer;
                                    margin-top: 20px;
                                `;
                                btn.onclick = () => {
                                    const courseData = this.extractCourseDataFromScreen(node);
                                    this.generateCertificate(courseData);
                                };
                                
                                const container = node.querySelector('.completion-actions, .button-container') || node;
                                container.appendChild(btn);
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        },

        // Extract course data from completion screen
        extractCourseDataFromScreen(screen) {
            const courseName = screen.querySelector('.course-name, h2, h3')?.textContent || 'Course';
            const scoreText = screen.querySelector('.score, .percentage')?.textContent || '0%';
            const score = parseInt(scoreText.match(/\d+/)?.[0] || '0');
            
            return {
                courseName: courseName,
                score: score,
                completedAt: new Date().toISOString()
            };
        },

        // Generate full progress report
        async generateFullReport() {
            const user = this.getCurrentUser();
            if (!user) {
                alert('Please log in to download your report');
                return;
            }

            const completions = window.CourseTracking?.getCompletedCourses(user.id) || [];
            
            if (completions.length === 0) {
                alert('No completed courses yet. Complete a course to generate a report!');
                return;
            }

            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // Header
                doc.setFillColor(10, 10, 15);
                doc.rect(0, 0, 210, 40, 'F');
                
                doc.setTextColor(0, 212, 255);
                doc.setFontSize(24);
                doc.text('NEUROQUEST', 105, 20, { align: 'center' });
                
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(16);
                doc.text('Learning Progress Report', 105, 32, { align: 'center' });
                
                // User Info
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(12);
                doc.text(`Name: ${user.name || user.username || 'Student'}`, 20, 55);
                doc.text(`Email: ${user.email}`, 20, 62);
                doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 69);
                
                // Summary
                doc.setFillColor(0, 212, 255);
                doc.rect(20, 80, 170, 30, 'F');
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(14);
                doc.text(`Total Courses Completed: ${completions.length}`, 30, 95);
                doc.setFontSize(11);
                const avgScore = Math.round(completions.reduce((a, b) => a + (b.score || 0), 0) / completions.length);
                doc.text(`Average Score: ${avgScore}%`, 30, 102);
                
                // Course Details
                doc.setFontSize(14);
                doc.setTextColor(0, 212, 255);
                doc.text('Completed Courses', 20, 125);
                
                let y = 135;
                completions.forEach((course, index) => {
                    if (y > 270) {
                        doc.addPage();
                        y = 20;
                    }
                    
                    doc.setDrawColor(0, 212, 255);
                    doc.rect(20, y - 5, 170, 25);
                    
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(12);
                    doc.text(`${index + 1}. ${course.courseName}`, 25, y + 5);
                    
                    doc.setFontSize(10);
                    doc.text(`Score: ${course.score || 0}%`, 25, y + 12);
                    doc.text(`Completed: ${new Date(course.completedAt).toLocaleDateString()}`, 25, y + 18);
                    
                    y += 30;
                });
                
                // Footer
                doc.setFillColor(10, 10, 15);
                doc.rect(0, 280, 210, 17, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.text('Generated by NeuroQuest Learning Platform', 105, 290, { align: 'center' });
                
                // Save
                doc.save(`NeuroQuest_Report_${user.name || 'Student'}_${Date.now()}.pdf`);
                console.log('✅ Report downloaded');
                
            } catch (error) {
                console.error('Failed to generate report:', error);
                alert('Failed to generate report. Please try again.');
            }
        },

        // Generate completion certificate
        async generateCertificate(courseData) {
            const user = this.getCurrentUser();
            if (!user) {
                alert('Please log in to download your certificate');
                return;
            }

            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF('landscape');
                
                // Background
                doc.setFillColor(10, 10, 15);
                doc.rect(0, 0, 297, 210, 'F');
                
                // Border
                doc.setDrawColor(0, 212, 255);
                doc.setLineWidth(3);
                doc.rect(10, 10, 277, 190);
                
                // Inner border
                doc.setDrawColor(0, 150, 200);
                doc.setLineWidth(1);
                doc.rect(15, 15, 267, 180);
                
                // Title
                doc.setTextColor(0, 212, 255);
                doc.setFontSize(40);
                doc.text('CERTIFICATE', 148.5, 50, { align: 'center' });
                doc.setFontSize(20);
                doc.text('OF COMPLETION', 148.5, 65, { align: 'center' });
                
                // Decorative line
                doc.setDrawColor(0, 212, 255);
                doc.line(80, 75, 217, 75);
                
                // Recipient
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(16);
                doc.text('This certifies that', 148.5, 95, { align: 'center' });
                
                doc.setTextColor(0, 212, 255);
                doc.setFontSize(28);
                doc.text(user.name || user.username || 'Student', 148.5, 115, { align: 'center' });
                
                // Course
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(16);
                doc.text('has successfully completed', 148.5, 135, { align: 'center' });
                
                doc.setTextColor(0, 255, 136);
                doc.setFontSize(24);
                doc.text(courseData.courseName, 148.5, 155, { align: 'center' });
                
                // Score
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(14);
                doc.text(`with a score of ${courseData.score}%`, 148.5, 170, { align: 'center' });
                
                // Date
                doc.setFontSize(12);
                doc.text(`Completed on ${new Date(courseData.completedAt).toLocaleDateString()}`, 148.5, 185, { align: 'center' });
                
                // Save
                doc.save(`Certificate_${courseData.courseName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
                console.log('✅ Certificate downloaded');
                
            } catch (error) {
                console.error('Failed to generate certificate:', error);
                alert('Failed to generate certificate. Please try again.');
            }
        },

        // Get current user
        getCurrentUser() {
            return window.AuthPersistence?.getUserData() || 
                   window.currentUser || 
                   JSON.parse(localStorage.getItem('neuroquest_user_data') || 'null');
        }
    };

    // Expose globally
    window.ReportGenerator = ReportGenerator;

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ReportGenerator.init());
    } else {
        ReportGenerator.init();
    }
})();