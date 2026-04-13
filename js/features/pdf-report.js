/**
 * PDF Report Generation System
 * Generates downloadable PDF reports using jsPDF
 */

(function() {
    'use strict';

    const PDFReport = {
        init() {
            this.loadJSPDF();
            this.addDownloadButtons();
            console.log('📄 PDF Report System initialized');
        },

        loadJSPDF() {
            if (window.jspdf) return;
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => console.log('✅ jsPDF loaded');
            document.head.appendChild(script);
        },

        addDownloadButtons() {
            setTimeout(() => {
                this.injectProfileButton();
                this.injectCompletionButton();
            }, 1500);
        },

        injectProfileButton() {
            const profileSection = document.querySelector('.profile-stats, #profile-stats, .user-profile');
            if (!profileSection || document.getElementById('btn-download-report')) return;

            const btn = document.createElement('button');
            btn.id = 'btn-download-report';
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
                transition: transform 0.2s;
            `;
            btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            btn.onclick = () => this.generateReport();

            profileSection.appendChild(btn);
        },

        injectCompletionButton() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const isCompletion = node.classList?.contains('completion-screen') ||
                                               node.querySelector?.('.completion-message, .course-complete, [class*="success"]');
                            
                            if (isCompletion && !node.querySelector('#btn-completion-report')) {
                                const courseData = this.extractCourseData(node);
                                
                                const btn = document.createElement('button');
                                btn.id = 'btn-completion-report';
                                btn.innerHTML = '📄 Download Report';
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
                                btn.onclick = () => this.generateReport(courseData);
                                
                                const container = node.querySelector('.actions, .button-container') || node;
                                container.appendChild(btn);
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        },

        extractCourseData(node) {
            const courseName = node.querySelector('.course-name, h2, h3')?.textContent || 'Course';
            const scoreText = node.querySelector('.score, .percentage')?.textContent || '0%';
            const score = parseInt(scoreText.match(/\d+/)?.[0] || '0');
            
            return { courseName, score, completedAt: new Date().toISOString() };
        },

        async generateReport(courseData) {
            if (!window.jspdf) {
                alert('PDF library loading... Please try again in a moment.');
                return;
            }

            const user = this.getCurrentUser();
            const data = courseData || await this.getLatestCompletion();
            
            if (!data) {
                alert('No course completion data found.');
                return;
            }

            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // Header background
                doc.setFillColor(10, 10, 15);
                doc.rect(0, 0, 210, 50, 'F');
                
                // Title
                doc.setTextColor(0, 212, 255);
                doc.setFontSize(28);
                doc.setFont('helvetica', 'bold');
                doc.text('NEUROQUEST', 105, 25, { align: 'center' });
                
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(16);
                doc.text('Course Completion Report', 105, 40, { align: 'center' });
                
                // User Info Section
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'normal');
                
                const userName = user?.name || user?.username || 'Student';
                const userEmail = user?.email || 'N/A';
                
                doc.text(`Student Name: ${userName}`, 20, 70);
                doc.text(`Email: ${userEmail}`, 20, 78);
                doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 86);
                
                // Course Details Box
                doc.setFillColor(240, 248, 255);
                doc.roundedRect(20, 100, 170, 60, 5, 5, 'F');
                
                doc.setTextColor(0, 212, 255);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Course Details', 30, 115);
                
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'normal');
                doc.text(`Course: ${data.courseName}`, 30, 130);
                doc.text(`Completion: 100%`, 30, 140);
                doc.text(`Score: ${data.score}%`, 30, 150);
                
                // Performance Summary
                doc.setTextColor(0, 212, 255);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Performance Summary', 20, 180);
                
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                
                let performanceText = '';
                if (data.score >= 90) performanceText = 'Outstanding performance! You have mastered this course.';
                else if (data.score >= 75) performanceText = 'Great job! You have successfully completed this course.';
                else if (data.score >= 60) performanceText = 'Good work! You have passed this course.';
                else performanceText = 'Course completed. Keep practicing to improve your score.';
                
                const splitText = doc.splitTextToSize(performanceText, 170);
                doc.text(splitText, 20, 195);
                
                // Footer
                doc.setFillColor(10, 10, 15);
                doc.rect(0, 270, 210, 27, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.text('Generated by NeuroQuest Learning Platform', 105, 285, { align: 'center' });
                
                // Download
                doc.save(`NeuroQuest_Report_${data.courseName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
                console.log('✅ PDF Report downloaded');
                
            } catch (error) {
                console.error('Failed to generate PDF:', error);
                alert('Failed to generate PDF. Please try again.');
            }
        },

        async getLatestCompletion() {
            const user = this.getCurrentUser();
            if (!user) return null;
            
            const completions = JSON.parse(localStorage.getItem(`completions_${user.id}`) || '[]');
            return completions.length > 0 ? completions[completions.length - 1] : null;
        },

        getCurrentUser() {
            return window.AuthPersistence?.getUserData() || 
                   window.currentUser || 
                   JSON.parse(localStorage.getItem('neuroquest_user_data') || 'null');
        }
    };

    window.PDFReport = PDFReport;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => PDFReport.init());
    } else {
        PDFReport.init();
    }
})();