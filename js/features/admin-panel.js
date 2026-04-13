/**
 * Feature 8: Admin Panel
 * Strict access control, full monitoring
 */

(function() {
    'use strict';

    const AdminPanel = {
        isAdmin: false,
        
        init() {
            this.injectAdminLoginOption();
            this.checkAdminSession();
        },
        
        injectAdminLoginOption() {
            // Add admin option to login screen
            const checkAndInject = () => {
                const loginForm = document.querySelector('#login-form') || 
                                 document.querySelector('.login-form') ||
                                 document.querySelector('[id*="login"]');
                
                if (loginForm && !document.getElementById('user-type-selector')) {
                    const selector = document.createElement('div');
                    selector.id = 'user-type-selector';
                    selector.style.cssText = `
                        display: flex;
                        gap: 10px;
                        margin-bottom: 20px;
                        justify-content: center;
                    `;
                    selector.innerHTML = `
                        <label style="
                            display: flex;
                            align-items: center;
                            gap: 5px;
                            padding: 10px 20px;
                            background: rgba(0,212,255,0.1);
                            border: 2px solid #00d4ff;
                            border-radius: 8px;
                            cursor: pointer;
                            color: #fff;
                        ">
                            <input type="radio" name="userType" value="user" checked>
                            <span>User</span>
                        </label>
                        <a href="admin.html" style="text-decoration: none;">
                            <label style="
                                display: flex;
                                align-items: center;
                                gap: 5px;
                                padding: 10px 20px;
                                background: rgba(255,0,0,0.1);
                                border: 2px solid #ff4444;
                                border-radius: 8px;
                                cursor: pointer;
                                color: #fff;
                            ">
                                <span>🔒 Admin</span>
                            </label>
                        </a>
                    `;
                    
                    loginForm.parentNode.insertBefore(selector, loginForm);
                }
            };
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', checkAndInject);
            } else {
                checkAndInject();
            }
            setTimeout(checkAndInject, 500);
        },
        
        checkAdminSession() {
            const user = JSON.parse(localStorage.getItem('neuroquest_user') || '{}');
            if (user.isAdmin) {
                this.isAdmin = true;
                this.injectAdminDashboard();
            }
        },
        
        injectAdminDashboard() {
            // Add admin dashboard button to navigation
            const checkAndInject = () => {
                const nav = document.querySelector('.nav-links') || 
                           document.querySelector('nav') ||
                           document.querySelector('.navbar');
                
                if (nav && !document.getElementById('admin-dashboard-btn')) {
                    const adminBtn = document.createElement('button');
                    adminBtn.id = 'admin-dashboard-btn';
                    adminBtn.innerHTML = '⚡ Admin';
                    adminBtn.style.cssText = `
                        background: linear-gradient(135deg, #ff4444, #cc0000);
                        color: #fff;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-left: 10px;
                    `;
                    adminBtn.onclick = () => this.openAdminDashboard();
                    nav.appendChild(adminBtn);
                }
            };
            
            checkAndInject();
            setTimeout(checkAndInject, 500);
        },
        
        openAdminDashboard() {
            if (!this.isAdmin) {
                alert('Admin access required');
                return;
            }
            
            // Remove existing dashboard
            const existing = document.getElementById('admin-dashboard');
            if (existing) existing.remove();
            
            const dashboard = document.createElement('div');
            dashboard.id = 'admin-dashboard';
            dashboard.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #0a0a0f;
                z-index: 10000;
                overflow-y: auto;
                padding: 20px;
            `;
            
            dashboard.innerHTML = `
                <div style="max-width: 1400px; margin: 0 auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 15px; border: 2px solid #ff4444;">
                        <div>
                            <h1 style="color: #ff4444; margin: 0;">⚡ ADMIN DASHBOARD</h1>
                            <p style="color: #888; margin: 5px 0 0;">System Monitoring & Control</p>
                        </div>
                        <button onclick="AdminPanel.closeDashboard()" style="
                            background: transparent;
                            border: 2px solid #ff4444;
                            color: #ff4444;
                            padding: 10px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: bold;
                        ">Close</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
                        <div style="background: rgba(0,212,255,0.1); border: 1px solid #00d4ff; border-radius: 10px; padding: 20px;">
                            <h3 style="color: #00d4ff; margin: 0 0 10px;">Total Users</h3>
                            <p id="admin-total-users" style="font-size: 36px; color: #fff; margin: 0;">Loading...</p>
                        </div>
                        <div style="background: rgba(0,255,0,0.1); border: 1px solid #00ff00; border-radius: 10px; padding: 20px;">
                            <h3 style="color: #00ff00; margin: 0 0 10px;">Active Today</h3>
                            <p id="admin-active-today" style="font-size: 36px; color: #fff; margin: 0;">Loading...</p>
                        </div>
                        <div style="background: rgba(255,0,255,0.1); border: 1px solid #ff00ff; border-radius: 10px; padding: 20px;">
                            <h3 style="color: #ff00ff; margin: 0 0 10px;">Total XP Earned</h3>
                            <p id="admin-total-xp" style="font-size: 36px; color: #fff; margin: 0;">Loading...</p>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 20px;">
                            <h3 style="color: #00d4ff; margin: 0 0 20px;">👥 All Users</h3>
                            <div id="admin-users-list" style="max-height: 400px; overflow-y: auto;">
                                Loading...
                            </div>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 20px;">
                            <h3 style="color: #00ff00; margin: 0 0 20px;">📊 User Progress</h3>
                            <div id="admin-progress-list" style="max-height: 400px; overflow-y: auto;">
                                Loading...
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 20px; margin-top: 20px;">
                        <h3 style="color: #ff00ff; margin: 0 0 20px;">📋 Activity Logs</h3>
                        <div id="admin-activity-logs" style="max-height: 300px; overflow-y: auto;">
                            Loading...
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 20px; margin-top: 20px;">
                        <h3 style="color: #ffff00; margin: 0 0 20px;">📧 Contact Messages</h3>
                        <div id="admin-contact-messages" style="max-height: 300px; overflow-y: auto;">
                            Loading...
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dashboard);
            this.loadAdminData();
        },
        
        closeDashboard() {
            const dashboard = document.getElementById('admin-dashboard');
            if (dashboard) dashboard.remove();
        },
        
        async loadAdminData() {
            const token = localStorage.getItem('neuroquest_token');
            
            try {
                // Fetch users
                const usersRes = await fetch('http://localhost:5000/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const usersData = await usersRes.json();
                
                if (usersData.success) {
                    this.renderUsers(usersData.data);
                    document.getElementById('admin-total-users').textContent = usersData.data.length;
                    const totalXP = usersData.data.reduce((sum, u) => sum + (u.xp || 0), 0);
                    document.getElementById('admin-total-xp').textContent = totalXP.toLocaleString();
                }
                
                // Fetch progress
                const progressRes = await fetch('http://localhost:5000/api/admin/progress', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const progressData = await progressRes.json();
                
                if (progressData.success) {
                    this.renderProgress(progressData.data);
                }
                
                // Fetch activity logs
                const activityRes = await fetch('http://localhost:5000/api/admin/activity', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const activityData = await activityRes.json();
                
                if (activityData.success) {
                    this.renderActivity(activityData.data);
                    const today = new Date().toDateString();
                    const activeToday = activityData.data.filter(a => 
                        new Date(a.timestamp).toDateString() === today
                    ).length;
                    document.getElementById('admin-active-today').textContent = activeToday;
                }
                
                // Fetch contact messages
                const messagesRes = await fetch('http://localhost:5000/api/admin/messages', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const messagesData = await messagesRes.json();
                
                if (messagesData.success) {
                    this.renderMessages(messagesData.data);
                }
                
            } catch (error) {
                console.error('Admin data load failed:', error);
                this.loadLocalData();
            }
        },
        
        loadLocalData() {
            // Fallback to local storage data
            const users = JSON.parse(localStorage.getItem('neuroquest_users') || '[]');
            const progress = JSON.parse(localStorage.getItem('neuroquest_progress') || '[]');
            const messages = JSON.parse(localStorage.getItem('neuroquest_contact_messages') || '[]');
            
            document.getElementById('admin-total-users').textContent = users.length;
            document.getElementById('admin-active-today').textContent = 'N/A';
            document.getElementById('admin-total-xp').textContent = 'N/A';
            
            this.renderUsers(users);
            this.renderProgress(progress);
            this.renderMessages(messages);
        },
        
        renderUsers(users) {
            const container = document.getElementById('admin-users-list');
            if (!users || users.length === 0) {
                container.innerHTML = '<p style="color: #888;">No users found</p>';
                return;
            }
            
            container.innerHTML = users.map(u => `
                <div style="
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(0,212,255,0.3);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 10px;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong style="color: #00d4ff;">${u.name}</strong>
                            <p style="color: #888; margin: 5px 0 0; font-size: 12px;">${u.email}</p>
                        </div>
                        <div style="text-align: right;">
                            <span style="color: #00ff00;">Lvl ${u.level || 1}</span>
                            <p style="color: #888; margin: 5px 0 0; font-size: 12px;">${u.xp || 0} XP</p>
                        </div>
                    </div>
                    <p style="color: #666; margin: 10px 0 0; font-size: 11px;">
                        Last login: ${u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                    </p>
                </div>
            `).join('');
        },
        
        renderProgress(progressData) {
            const container = document.getElementById('admin-progress-list');
            if (!progressData || progressData.length === 0) {
                container.innerHTML = '<p style="color: #888;">No progress data</p>';
                return;
            }
            
            container.innerHTML = progressData.map(p => `
                <div style="
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(0,255,0,0.3);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 10px;
                ">
                    <strong style="color: #00ff00;">${p.userName || 'Unknown'}</strong>
                    <p style="color: #fff; margin: 5px 0;">${p.progress?.length || 0} courses</p>
                    <p style="color: #888; margin: 0; font-size: 12px;">
                        ${p.progress?.map(c => c.course).join(', ') || 'No courses'}
                    </p>
                </div>
            `).join('');
        },
        
        renderActivity(logs) {
            const container = document.getElementById('admin-activity-logs');
            if (!logs || logs.length === 0) {
                container.innerHTML = '<p style="color: #888;">No activity logs</p>';
                return;
            }
            
            container.innerHTML = logs.slice(-20).reverse().map(log => `
                <div style="
                    background: rgba(0,0,0,0.3);
                    border-left: 3px solid ${log.type === 'login' ? '#00ff00' : '#00d4ff'};
                    padding: 10px 15px;
                    margin-bottom: 8px;
                    font-size: 13px;
                ">
                    <span style="color: ${log.type === 'login' ? '#00ff00' : '#00d4ff'};">
                        ${log.type.toUpperCase()}
                    </span>
                    <span style="color: #fff;"> - ${log.email}</span>
                    <span style="color: #666; float: right;">
                        ${new Date(log.timestamp).toLocaleString()}
                    </span>
                </div>
            `).join('');
        },
        
        renderMessages(messages) {
            const container = document.getElementById('admin-contact-messages');
            if (!messages || messages.length === 0) {
                container.innerHTML = '<p style="color: #888;">No messages</p>';
                return;
            }
            
            container.innerHTML = messages.map(m => `
                <div style="
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,0,0.3);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 10px;
                ">
                    <div style="display: flex; justify-content: space-between;">
                        <strong style="color: #ffff00;">${m.name}</strong>
                        <span style="color: #666; font-size: 12px;">
                            ${new Date(m.timestamp).toLocaleString()}
                        </span>
                    </div>
                    <p style="color: #888; margin: 5px 0; font-size: 12px;">${m.email}</p>
                    <p style="color: #fff; margin: 10px 0 0;">${m.message}</p>
                </div>
            `).join('');
        }
    };

    // Expose to global scope
    window.AdminPanel = AdminPanel;
    
    // Auto-initialize
    AdminPanel.init();
})();