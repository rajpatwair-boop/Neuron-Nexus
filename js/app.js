// ==========================================
// MAIN APPLICATION LOGIC
// ==========================================

const App = {
    // Initialize application
    init() {
        // Check if user is logged in
        if (State.load() && State.user.isLoggedIn) {
            if (State.user.onboardingComplete) {
                State.navigateTo('dashboard');
                State.initDashboard();
            } else {
                State.navigateTo('onboarding');
                this.startOnboarding();
            }
        } else {
            this.showAuthScreen();
        }
        
        this.setupEventListeners();
        this.initMatrixRain();
        this.initParticles();
    },
    
    // ==========================================
    // AUTH SYSTEM
    // ==========================================
    showAuthScreen() {
        State.navigateTo('auth');
        this.setupAuthToggle();
    },
    
    setupAuthToggle() {
        const loginToggle = document.getElementById('login-toggle');
        const signupToggle = document.getElementById('signup-toggle');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        
        if (loginToggle) {
            loginToggle.onclick = () => {
                loginToggle.classList.add('active');
                signupToggle.classList.remove('active');
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
            };
        }
        
        if (signupToggle) {
            signupToggle.onclick = () => {
                signupToggle.classList.add('active');
                loginToggle.classList.remove('active');
                signupForm.style.display = 'block';
                loginForm.style.display = 'none';
            };
        }
    },
    
    handleSignup() {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        
        // Validate Gmail format
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            State.showModal('Invalid Email', 'Please enter a valid Gmail address', 'OK');
            return;
        }
        
        if (password.length < 6) {
            State.showModal('Weak Password', 'Password must be at least 6 characters', 'OK');
            return;
        }
        
        State.saveAuth(email, password, name);
        State.user = { ...State.user, email, name, isLoggedIn: true };
        State.save();
        
        State.showModal('Account Created', 'Welcome to the Neural System', 'Continue', () => {
            State.navigateTo('onboarding');
            this.startOnboarding();
        });
    },
    
    handleLogin() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        
        // Dummy authentication: accept any non-empty email and password
        if (!email || !password) {
            State.showModal('Access Denied', 'Please enter both email and password', 'Try Again');
            return;
        }
        
        // Check if user exists in storage, otherwise create a temporary user
        if (State.verifyAuth(email, password)) {
            State.loadUserByEmail(email);
        } else {
            // Create temporary user for dummy auth
            const tempName = email.split('@')[0] || 'Operator';
            State.user = { 
                ...State.user, 
                email: email, 
                name: tempName, 
                isLoggedIn: true 
            };
            State.saveAuth(email, password, tempName);
            State.save();
        }
        
        State.showModal('Access Granted', `Welcome back, ${State.user.name}`, 'Enter System', () => {
            if (State.user.onboardingComplete) {
                State.navigateTo('dashboard');
                State.initDashboard();
            } else {
                State.navigateTo('onboarding');
                this.startOnboarding();
            }
        });
    },
    
    // Add back button to current screen
    addBackButton() {
        const activeScreen = document.querySelector('.screen.active');
        if (!activeScreen) return;
        
        // Remove existing back button if any
        const existingBtn = activeScreen.querySelector('.back-button');
        if (existingBtn) existingBtn.remove();
        
        // Don't add back button to auth and entry screens
        if (activeScreen.id === 'auth-screen' || activeScreen.id === 'entry-screen') return;
        
        const backBtn = document.createElement('button');
        backBtn.className = 'back-button';
        backBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg> Back';
        backBtn.onclick = () => this.handleBack();
        activeScreen.appendChild(backBtn);
    },
    
    handleBack() {
        // Go to previous screen based on current state
        const currentScreen = State.session.currentScreen;
        
        switch (currentScreen) {
            case 'onboarding':
                this.prevStep();
                break;
            case 'dashboard':
                // Logout and go to auth
                State.user.isLoggedIn = false;
                State.save();
                State.navigateTo('auth');
                break;
            case 'dungeon':
            case 'battle':
            case 'practice':
                State.navigateTo('dashboard');
                State.initDashboard();
                break;
        }
    },
    
    // ==========================================
    // MATRIX RAIN EFFECT
    // ==========================================
    initMatrixRain() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
        
        const draw = () => {
            // Stronger fade trail for smoother, more subtle effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Reduced opacity for ambient atmosphere
            ctx.fillStyle = 'rgba(0, 255, 65, 0.15)';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                
                // Vary opacity per character for depth
                const opacity = 0.1 + Math.random() * 0.15;
                ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
                
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        setInterval(draw, 50); // Slower, more subtle animation
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    },
    
    // ==========================================
    // PARTICLE SYSTEM
    // ==========================================
    initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    },
    
    // ==========================================
    // PHASE 1: SYSTEM ENTRY
    // ==========================================
    startEntrySequence() {
        const terminalText = document.getElementById('terminal-text');
        const enterBtn = document.getElementById('enter-btn');
        
        const messages = [
            { text: '> Initializing Neural Interface...', delay: 800 },
            { text: '> Syncing Cognitive Modules...', delay: 1000 },
            { text: '> Establishing User Link...', delay: 900 },
            { text: '> Loading Intelligence Engine...', delay: 1100 },
            { text: '> Calibrating Neural Pathways...', delay: 800 },
            { text: '> System Ready.', delay: 600, glitch: true }
        ];
        
        let index = 0;
        
        const showMessage = () => {
            if (index < messages.length) {
                const msg = messages[index];
                const line = document.createElement('div');
                line.className = 'line';
                line.textContent = msg.text;
                
                if (msg.glitch) {
                    line.style.animation = 'heavyGlitch 0.5s ease, terminalType 0.5s ease';
                }
                
                terminalText.appendChild(line);
                index++;
                setTimeout(showMessage, msg.delay);
            } else {
                setTimeout(() => {
                    enterBtn.style.display = 'inline-block';
                    enterBtn.style.animation = 'intensePulseGlow 2s ease-in-out infinite, scaleIn 0.5s ease';
                }, 500);
            }
        };
        
        setTimeout(showMessage, 1000);
    },
    
    // Typewriter effect
    typewriterEffect(element, text, callback) {
        let charIndex = 0;
        
        // Ensure element is visible
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.color = 'var(--text-primary)'; // Strong contrast
        
        const typeChar = () => {
            if (charIndex < text.length) {
                element.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 30); // Faster typing
            } else {
                // Remove cursor after typing
                setTimeout(() => {
                    element.classList.remove('typewriter-cursor');
                    if (callback) callback();
                }, 300);
            }
        };
        
        typeChar();
    },
    
    // ==========================================
    // PHASE 2: INTERACTIVE ONBOARDING
    // ==========================================
    startOnboarding() {
        // Skip name input if user already has name from signup
        if (State.user.name && State.user.name.length > 0) {
            State.session.onboardingStep = 2;
        } else {
            State.session.onboardingStep = 1;
        }
        State.navigateTo('onboarding');
        this.renderOnboardingStep();
    },
    
    renderOnboardingStep() {
        const step = State.session.onboardingStep;
        const stepContent = document.getElementById('step-content');
        const stepNavigation = document.getElementById('step-navigation');
        const stepIndicator = document.getElementById('step-indicator');
        
        // Render step indicator (adjust total steps if programming path selected)
        const totalSteps = State.user.currentSubject === 'Programming' && State.user.currentCategory ? 6 : 5;
        stepIndicator.innerHTML = '';
        for (let i = 1; i <= totalSteps; i++) {
            const dot = document.createElement('div');
            dot.className = 'step-dot';
            if (i === step) dot.classList.add('active');
            if (i < step) dot.classList.add('completed');
            stepIndicator.appendChild(dot);
        }
        
        // Render step content
        switch (step) {
            case 1:
                this.renderStep1_Identity(stepContent, stepNavigation);
                break;
            case 2:
                this.renderStep2_Age(stepContent, stepNavigation);
                break;
            case 3:
                this.renderStep3_AcademicLevel(stepContent, stepNavigation);
                break;
            case 4:
                this.renderStep4_Subjects(stepContent, stepNavigation);
                break;
            case 5:
                // Check if Programming was selected
                if (State.user.currentSubject === 'Programming') {
                    this.renderStep5_ProgrammingPath(stepContent, stepNavigation);
                } else {
                    this.renderStep5_Mode(stepContent, stepNavigation);
                }
                break;
            case 6:
                this.renderStep6_Mode(stepContent, stepNavigation);
                break;
        }
        
        // Animate content
        stepContent.style.animation = 'none';
        setTimeout(() => {
            stepContent.style.animation = 'fadeInUp 0.5s ease forwards';
        }, 10);
    },
    
    // Step 1: Identity
    renderStep1_Identity(content, navigation) {
        content.innerHTML = `
            <h2>Identify yourself</h2>
            <div class="input-group">
                <input type="text" id="name-input" class="input-field" placeholder="Enter your name" autocomplete="off">
            </div>
        `;
        
        navigation.innerHTML = `
            <button class="cta-primary" onclick="App.validateStep1()">Continue</button>
        `;
        
        setTimeout(() => {
            document.getElementById('name-input').focus();
        }, 100);
    },
    
    validateStep1() {
        const input = document.getElementById('name-input');
        const name = input.value.trim();
        
        if (name.length < 2) {
            input.classList.add('invalid');
            setTimeout(() => input.classList.remove('invalid'), 500);
            return;
        }
        
        input.classList.add('valid');
        State.user.name = name;
        State.session.onboardingStep = 2;
        this.renderOnboardingStep();
    },
    
    // Step 2: Age
    renderStep2_Age(content, navigation) {
        content.innerHTML = `
            <h2>Enter your age</h2>
            <div class="input-group">
                <label for="age-input" class="input-label">Age</label>
                <input type="number" id="age-input" class="input-field" placeholder="Enter your age" min="10" max="50" autocomplete="off">
            </div>
        `;
        
        navigation.innerHTML = `
            <button class="cta-secondary" onclick="App.prevStep()">Back</button>
            <button class="cta-primary" onclick="App.validateStep2()">Continue</button>
        `;
        
        setTimeout(() => {
            document.getElementById('age-input').focus();
        }, 100);
    },
    
    validateStep2() {
        const input = document.getElementById('age-input');
        const age = parseInt(input.value);
        
        if (isNaN(age) || age < 10 || age > 50) {
            input.classList.add('invalid');
            setTimeout(() => input.classList.remove('invalid'), 500);
            return;
        }
        
        input.classList.add('valid');
        State.user.age = age;
        State.session.onboardingStep = 3;
        this.renderOnboardingStep();
    },
    
    // Step 3: Academic Level
    renderStep3_AcademicLevel(content, navigation) {
        content.innerHTML = `
            <h2>Select your academic level</h2>
            <div class="step-card-grid">
                <div class="selection-card" data-level="school">
                    <h3>School</h3>
                    <p>Grades 8-10</p>
                </div>
                <div class="selection-card" data-level="highSchool">
                    <h3>High School</h3>
                    <p>Grades 11-12</p>
                </div>
                <div class="selection-card" data-level="college">
                    <h3>College</h3>
                    <p>Undergraduate & Beyond</p>
                </div>
            </div>
        `;
        
        navigation.innerHTML = `
            <button class="cta-secondary" onclick="App.prevStep()">Back</button>
            <button class="cta-primary" onclick="App.validateStep3()">Continue</button>
        `;
        
        // Add selection handlers
        const cards = content.querySelectorAll('.selection-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                card.dataset.selected = 'true';
            });
            
            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y - rect.height / 2) / 15;
                const rotateY = (rect.width / 2 - x) / 15;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('selected')) {
                    card.style.transform = '';
                }
            });
        });
    },
    
    validateStep3() {
        const selected = document.querySelector('.selection-card.selected');
        if (!selected) {
            State.showModal('Selection Required', 'Please select your academic level to continue');
            return;
        }
        
        State.user.academicLevel = selected.dataset.level;
        State.session.onboardingStep = 4;
        this.renderOnboardingStep();
    },
    
    // Step 4: Subject Selection
    renderStep4_Subjects(content, navigation) {
        const level = State.user.academicLevel;
        const subjects = QuestionGenerator.subjectMap[level] || [];
        
        const subjectCards = subjects.map(subject => `
            <div class="selection-card" data-subject="${subject}">
                <h3>${subject}</h3>
            </div>
        `).join('');
        
        content.innerHTML = `
            <h2>Choose your learning domain</h2>
            <div class="step-card-grid">
                ${subjectCards}
            </div>
        `;
        
        navigation.innerHTML = `
            <button class="cta-secondary" onclick="App.prevStep()">Back</button>
            <button class="cta-primary" onclick="App.validateStep4()">Continue</button>
        `;
        
        // Add selection handlers
        const cards = content.querySelectorAll('.selection-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
            
            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y - rect.height / 2) / 15;
                const rotateY = (rect.width / 2 - x) / 15;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('selected')) {
                    card.style.transform = '';
                }
            });
        });
    },
    
    validateStep4() {
        const selected = document.querySelector('.selection-card.selected');
        if (!selected) {
            State.showModal('Selection Required', 'Please select a subject to continue');
            return;
        }
        
        State.user.currentSubject = selected.dataset.subject;
        State.user.subjects = [selected.dataset.subject];
        
        // If Programming selected, go to path selection (step 5)
        // Otherwise, skip to mode selection (step 5 becomes mode)
        State.session.onboardingStep = 5;
        this.renderOnboardingStep();
    },
    
    // Step 5: Programming Path Selection (NEW)
    renderStep5_ProgrammingPath(content, navigation) {
        content.innerHTML = `
            <h2>Select your programming path</h2>
            <div class="step-card-grid">
                <div class="selection-card" data-path="C">
                    <h3>C Programming</h3>
                    <p>Foundation & systems</p>
                </div>
                <div class="selection-card" data-path="Python">
                    <h3>Python</h3>
                    <p>Versatile & modern</p>
                </div>
                <div class="selection-card" data-path="Java">
                    <h3>Java</h3>
                    <p>Enterprise & OOP</p>
                </div>
                <div class="selection-card" data-path="DSA">
                    <h3>Data Structures</h3>
                    <p>Algorithms & logic</p>
                </div>
                <div class="selection-card" data-path="OS">
                    <h3>Operating Systems</h3>
                    <p>Core concepts</p>
                </div>
                <div class="selection-card" data-path="Web Development">
                    <h3>Web Development</h3>
                    <p>HTML, CSS, JavaScript</p>
                </div>
            </div>
        `;
        
        navigation.innerHTML = `
            <button class="cta-secondary" onclick="App.prevStep()">Back</button>
            <button class="cta-primary" onclick="App.validateStep5_ProgrammingPath()">Continue</button>
        `;
        
        // Add selection handlers
        const cards = content.querySelectorAll('.selection-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
            
            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y - rect.height / 2) / 15;
                const rotateY = (rect.width / 2 - x) / 15;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('selected')) {
                    card.style.transform = '';
                }
            });
        });
    },
    
    validateStep5_ProgrammingPath() {
        const selected = document.querySelector('.selection-card.selected');
        if (!selected) {
            State.showModal('Selection Required', 'Please select a programming path');
            return;
        }
        
        State.user.currentCategory = selected.dataset.path;
        State.session.onboardingStep = 6;
        this.renderOnboardingStep();
    },
    
    validateStep6() {
        const selected = document.querySelector('.selection-card.selected');
        if (!selected) {
            State.showModal('Selection Required', 'Please select a learning mode to continue');
            return;
        }
        
        State.user.preferredMode = selected.dataset.mode;
        State.user.onboardingComplete = true;
        State.save();
        
        // Directly start learning with selected mode
        const mode = State.user.preferredMode;
        this.startLearningMode(mode);
    },
    
    // Step 5/6: Learning Mode
    renderStep5_Mode(content, navigation) {
        this.renderModeSelection(content, navigation, 5);
    },
    
    renderStep6_Mode(content, navigation) {
        this.renderModeSelection(content, navigation, 6);
    },
    
    renderModeSelection(content, navigation, step) {
        content.innerHTML = `
            <h2>Select your learning mode</h2>
            <div class="step-card-grid">
                <div class="selection-card" data-mode="dungeon">
                    <h3>Story Mode</h3>
                    <p>Immersive simulation challenges</p>
                </div>
                <div class="selection-card" data-mode="battle">
                    <h3>Battle Mode</h3>
                    <p>Compete against AI opponents</p>
                </div>
                <div class="selection-card" data-mode="practice">
                    <h3>Practice Mode</h3>
                    <p>Focused skill development</p>
                </div>
            </div>
        `;
        
        const validateFn = step === 6 ? 'App.validateStep6()' : 'App.validateStep5()';
        navigation.innerHTML = `
            <button class="cta-secondary" onclick="App.prevStep()">Back</button>
            <button class="cta-primary" onclick="${validateFn}">Start Session</button>
        `;
        
        // Add selection handlers
        const cards = content.querySelectorAll('.selection-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
            
            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y - rect.height / 2) / 15;
                const rotateY = (rect.width / 2 - x) / 15;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('selected')) {
                    card.style.transform = '';
                }
            });
        });
    },
    
    validateStep5() {
        const selected = document.querySelector('.selection-card.selected');
        if (!selected) {
            State.showModal('Selection Required', 'Please select a learning mode to continue');
            return;
        }
        
        State.user.preferredMode = selected.dataset.mode;
        State.user.onboardingComplete = true;
        State.save();
        
        // Directly start learning with selected mode
        const mode = State.user.preferredMode;
        this.startLearningMode(mode);
    },
    
    prevStep() {
        if (State.session.onboardingStep > 1) {
            State.session.onboardingStep--;
            // Skip programming path if not programming subject
            if (State.session.onboardingStep === 5 && State.user.currentSubject !== 'Programming') {
                State.session.onboardingStep--;
            }
            this.renderOnboardingStep();
        }
    },
    
    // ==========================================
    // PHASE 3: DASHBOARD
    // ==========================================
    continueLearning() {
        const mode = State.user.preferredMode || 'practice';
        this.startLearningMode(mode);
    },
    
    startLearningMode(mode) {
        console.log('=== STARTING LEARNING MODE ===');
        console.log('Mode:', mode);
        console.log('Subject:', State.user.currentSubject);
        console.log('Category:', State.user.currentCategory);
        console.log('User Level:', State.user.level);
        
        // Notify immersion layer of mode change
        if (typeof ImmersionLayer !== 'undefined') {
            ImmersionLayer.setMode(mode);
        }
        
        State.resetSession();
        State.session.currentMode = mode;
        
        const difficulty = QuestionGenerator.getDifficultyForLevel(State.user.level);
        console.log('Difficulty:', difficulty);
        
        let questions = QuestionGenerator.generate(
            State.user.currentSubject,
            State.user.currentCategory || null,
            difficulty,
            5
        );
        
        console.log('Generated questions:', questions);
        console.log('Questions count:', questions.length);
        
        // Fallback: if no questions generated, use comprehensive default set
        if (!questions || questions.length === 0) {
            console.warn('No questions generated, using default fallback');
            questions = [
                { question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctIndex: 1, xpReward: 10 },
                { question: 'What is the chemical symbol for water?', options: ['H2O', 'CO2', 'NaCl', 'O2'], correctIndex: 0, xpReward: 10 },
                { question: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1, xpReward: 10 },
                { question: 'What is the past tense of "run"?', options: ['Runned', 'Ran', 'Running', 'Runs'], correctIndex: 1, xpReward: 10 },
                { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'], correctIndex: 2, xpReward: 10 }
            ];
        }
        
        State.session.questions = questions;
        State.session.currentQuestion = 0;
        
        console.log('Session state:', State.session);
        console.log('===========================');
        
        switch (mode) {
            case 'dungeon':
                this.startDungeonMode();
                break;
            case 'battle':
                this.startBattleMode();
                break;
            case 'practice':
                this.startPracticeMode();
                break;
        }
    },
    
    // ==========================================
    // PHASE 4: DUNGEON MODE (STORY MODE)
    // ==========================================
    startDungeonMode() {
        // HARD RESET: Ensure we start from question 0
        State.session.currentQuestion = 0;
        
        // Validate questions exist
        if (!State.session.questions || State.session.questions.length === 0) {
            console.error('ERROR: No questions available for Story Mode');
            State.showModal('Error', 'No questions loaded. Please try again.', 'OK', () => {
                State.navigateTo('dashboard');
            });
            return;
        }
        
        console.log('=== STORY MODE START ===');
        console.log('Questions:', State.session.questions);
        console.log('Total Questions:', State.session.questions.length);
        console.log('Starting Index:', State.session.currentQuestion);
        
        // Navigate to dungeon screen
        State.navigateTo('dungeon');
        
        // Render first question immediately
        this.renderDungeonChallenge();
        
        console.log('===========================');
    },
    
    renderDungeonChallenge() {
        // Validate questions array
        if (!State.session.questions || State.session.questions.length === 0) {
            console.error('ERROR: Questions array is empty');
            return;
        }
        
        // Validate current question index
        if (State.session.currentQuestion >= State.session.questions.length) {
            console.log('All questions completed');
            this.completeDungeonMode();
            return;
        }
        
        // Get current question
        const question = State.session.questions[State.session.currentQuestion];
        
        if (!question) {
            console.error('ERROR: Question is null at index', State.session.currentQuestion);
            return;
        }
        
        console.log('=== RENDERING STORY QUESTION ===');
        console.log('Index:', State.session.currentQuestion);
        console.log('Question:', question.question);
        console.log('Options:', question.options);
        
        // Update progress bar
        const challengeNum = State.session.currentQuestion + 1;
        const totalChallenges = State.session.questions.length;
        const progressEl = document.getElementById('dungeon-progress');
        const xpFillEl = document.getElementById('dungeon-xp-fill');
        
        if (progressEl) {
            progressEl.textContent = `Challenge ${challengeNum} of ${totalChallenges}`;
        }
        if (xpFillEl) {
            xpFillEl.style.width = `${(challengeNum / totalChallenges) * 100}%`;
        }
        
        // Get DOM elements
        const storyText = document.getElementById('story-text');
        const choicesContainer = document.getElementById('choices');
        
        if (!storyText || !choicesContainer) {
            console.error('ERROR: DOM elements not found');
            return;
        }
        
        // Render question text
        storyText.textContent = question.question;
        
        // Clear and render options
        choicesContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = option;
            btn.onclick = () => this.handleDungeonAnswer(index, question.correctIndex, btn);
            choicesContainer.appendChild(btn);
        });
        
        console.log('Story question rendered successfully');
        console.log('===========================');
    },
    
    handleDungeonAnswer(selected, correct, btn) {
        // Disable all buttons to prevent double-clicking
        const buttons = document.querySelectorAll('.choice-btn');
        buttons.forEach(b => b.disabled = true);
        
        // Show correct/wrong feedback
        if (selected === correct) {
            btn.classList.add('correct');
            const xp = State.session.questions[State.session.currentQuestion].xpReward;
            State.addXP(xp);
            console.log('Correct! +', xp, 'XP');
        } else {
            btn.classList.add('wrong');
            buttons[correct].classList.add('correct');
            console.log('Incorrect. Correct answer highlighted.');
        }
        
        // Move to next question after delay
        setTimeout(() => {
            State.session.currentQuestion++;
            this.renderDungeonChallenge();
        }, 1500);
    },
    
    completeDungeonMode() {
        console.log('=== STORY MODE COMPLETE ===');
        
        State.showModal(
            'Simulation Complete',
            'You\'ve completed the training module. Excellent work!',
            'Return to Dashboard',
            () => {
                State.navigateTo('dashboard');
                State.initDashboard();
            }
        );
    },
    
    // ==========================================
    // PHASE 4: BATTLE MODE
    // ==========================================
    startBattleMode() {
        console.log('=== STARTING BATTLE MODE ===');
        State.navigateTo('battle');
        
        // Reset battle completion flag
        State.session.battleCompleted = false;
        
        console.log('Battle State:', {
            questions: State.session.questions.length,
            currentIndex: State.session.currentQuestion,
            questions: State.session.questions
        });
        
        const searching = document.getElementById('searching');
        const arena = document.getElementById('arena');
        
        // Enhanced searching animation
        searching.style.display = 'block';
        arena.style.display = 'none';
        searching.innerHTML = `
            <p class="searching-text">Scanning neural network...</p>
            <div class="loading-dots"><span></span><span></span><span></span></div>
            <p class="text-muted" style="margin-top: var(--space-md);">Searching for worthy opponent</p>
        `;
        
        setTimeout(() => {
            searching.innerHTML = `
                <p class="searching-text" style="color: var(--accent-red);">Opponent Located</p>
                <div class="animate-pulse" style="font-size: var(--text-2xl); margin-top: var(--space-md);">
                    Preparing battle arena...
                </div>
            `;
            
            setTimeout(() => {
                console.log('Battle: Showing arena...');
                searching.style.display = 'none';
                arena.style.display = 'block';
                arena.style.animation = 'scaleIn 0.5s ease';
                
                // Setup opponent
                const opponentNames = ['CyberAI', 'NeuralBot', 'QuantumX', 'SynapseAI', 'DeepMind'];
                const opponentName = opponentNames[Math.floor(Math.random() * opponentNames.length)];
                document.getElementById('opponent-name').textContent = opponentName;
                
                State.session.battleOpponent = {
                    score: 0,
                    accuracy: 0.6 + Math.random() * 0.3
                };
                
                State.session.playerScore = 0;
                State.session.currentQuestion = 0;
                
                console.log('Battle: Opponent:', opponentName);
                console.log('Battle: Rendering first question...');
                
                this.renderBattleQuestion();
                console.log('===========================');
            }, 1500);
        }, 2500);
    },
    
    renderBattleQuestion() {
        console.log('=== RENDER BATTLE QUESTION ===');
        console.log('Current Index:', State.session.currentQuestion);
        console.log('Total Questions:', State.session.questions.length);
        
        // Check if battle is already completed
        if (State.session.battleCompleted) {
            console.log('Battle already completed, skipping render');
            return;
        }
        
        // Check if we've gone through all questions
        if (State.session.currentQuestion >= State.session.questions.length) {
            console.log('All battle questions completed');
            this.completeBattleMode();
            return;
        }
        
        const question = State.session.questions[State.session.currentQuestion];
        
        if (!question) {
            console.error('No battle question data at index', State.session.currentQuestion);
            this.completeBattleMode();
            return;
        }
        
        console.log('Question:', question.question);
        console.log('Options:', question.options);
        console.log('===========================');
        
        // Update question
        const questionEl = document.getElementById('battle-question');
        if (questionEl) {
            questionEl.textContent = question.question;
            questionEl.style.opacity = '1';
            questionEl.style.visibility = 'visible';
        }
        
        // Render choices
        const choicesContainer = document.getElementById('battle-choices');
        if (!choicesContainer) {
            console.error('Battle choices container not found!');
            return;
        }
        
        choicesContainer.innerHTML = '';
        choicesContainer.style.opacity = '1';
        choicesContainer.style.visibility = 'visible';
        choicesContainer.style.display = 'flex';
        
        console.log('Rendering', question.options.length, 'battle choices');
        
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = option;
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
            btn.onclick = () => this.handleBattleAnswer(index, question.correctIndex, btn);
            choicesContainer.appendChild(btn);
        });
        
        console.log('Battle choices rendered');
        
        // Start timer
        this.startBattleTimer();
        
        // Simulate opponent answer
        this.simulateOpponentAnswer();
    },
    
    startBattleTimer() {
        let timeLeft = 15;
        const timerElement = document.getElementById('timer');
        timerElement.textContent = timeLeft;
        timerElement.classList.remove('warning');
        
        if (State.session.battleTimer) {
            clearInterval(State.session.battleTimer);
        }
        
        State.session.battleTimer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            
            if (timeLeft <= 5) {
                timerElement.classList.add('warning');
            }
            
            if (timeLeft <= 0) {
                clearInterval(State.session.battleTimer);
                this.nextBattleQuestion();
            }
        }, 1000);
    },
    
    simulateOpponentAnswer() {
        const opponent = State.session.battleOpponent;
        const delay = 3000 + Math.random() * 5000;
        
        setTimeout(() => {
            if (Math.random() < opponent.accuracy) {
                opponent.score += 10;
                document.getElementById('opponent-score').textContent = opponent.score;
            }
        }, delay);
    },
    
    handleBattleAnswer(selected, correct, btn) {
        // Disable all buttons and timer
        const buttons = document.querySelectorAll('.choice-btn');
        buttons.forEach(b => b.disabled = true);
        clearInterval(State.session.battleTimer);
        
        if (selected === correct) {
            btn.classList.add('correct');
            State.session.playerScore += 10;
            document.getElementById('player-score').textContent = State.session.playerScore;
            State.addXP(15);
        } else {
            btn.classList.add('wrong');
            buttons[correct].classList.add('correct');
        }
        
        setTimeout(() => this.nextBattleQuestion(), 1500);
    },
    
    nextBattleQuestion() {
        // Prevent multiple rapid calls
        if (State.session.battleCompleted) {
            return;
        }
        State.session.currentQuestion++;
        this.renderBattleQuestion();
    },
    
    completeBattleMode() {
        // Prevent duplicate completion calls
        if (State.session.battleCompleted) {
            return;
        }
        State.session.battleCompleted = true;
        
        const playerScore = State.session.playerScore || 0;
        const opponentScore = State.session.battleOpponent ? State.session.battleOpponent.score : 0;
        
        let result = '';
        if (playerScore > opponentScore) {
            result = 'Victory! You dominated the battle!';
        } else if (playerScore < opponentScore) {
            result = 'Defeat. Train harder and return stronger.';
        } else {
            result = 'Draw! An evenly matched battle.';
        }
        
        State.showModal(
            'Battle Complete',
            `${result}\n\nYour Score: ${playerScore}\nOpponent Score: ${opponentScore}`,
            'Return to Dashboard',
            () => {
                State.session.battleCompleted = false;
                State.navigateTo('dashboard');
                State.initDashboard();
            }
        );
    },
    
    // ==========================================
    // PHASE 4: PRACTICE MODE
    // ==========================================
    startPracticeMode() {
        console.log('=== STARTING PRACTICE MODE ===');
        State.navigateTo('practice');
        
        console.log('Practice State:', {
            questions: State.session.questions.length,
            currentIndex: State.session.currentQuestion,
            questions: State.session.questions
        });
        
        console.log('Practice: Rendering first question...');
        this.renderPracticeQuestion();
        console.log('===========================');
    },
    
    renderPracticeQuestion() {
        console.log('=== RENDER PRACTICE QUESTION ===');
        const questionNum = State.session.currentQuestion + 1;
        const totalQuestions = State.session.questions.length;
        
        console.log('Current Index:', State.session.currentQuestion);
        console.log('Total Questions:', totalQuestions);
        
        // Update progress
        document.getElementById('practice-progress').textContent = 
            `Question ${questionNum} of ${totalQuestions}`;
        
        // Get current question
        const question = State.session.questions[State.session.currentQuestion];
        if (!question) {
            console.error('No practice question data at index', State.session.currentQuestion);
            console.log('Questions array:', State.session.questions);
            this.completePracticeMode();
            return;
        }
        
        console.log('Question:', question.question);
        console.log('Options:', question.options);
        console.log('===========================');
        // Render question
        document.getElementById('practice-question').textContent = question.question;
        
        // Render choices
        const choicesContainer = document.getElementById('practice-choices');
        choicesContainer.innerHTML = '';
        document.getElementById('practice-feedback').style.display = 'none';
        
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = option;
            btn.onclick = () => this.handlePracticeAnswer(index, question.correctIndex, btn);
            choicesContainer.appendChild(btn);
        });
    },
    
    handlePracticeAnswer(selected, correct, btn) {
        // Disable all buttons
        const buttons = document.querySelectorAll('.choice-btn');
        buttons.forEach(b => b.disabled = true);
        
        const feedback = document.getElementById('practice-feedback');
        
        if (selected === correct) {
            btn.classList.add('correct');
            const xp = State.session.questions[State.session.currentQuestion].xpReward;
            State.addXP(xp);
            
            feedback.className = 'feedback-panel correct';
            feedback.innerHTML = `<strong>Correct!</strong> +${xp} XP earned`;
        } else {
            btn.classList.add('wrong');
            buttons[correct].classList.add('correct');
            
            feedback.className = 'feedback-panel wrong';
            feedback.innerHTML = `<strong>Incorrect.</strong> The correct answer is highlighted.`;
        }
        
        feedback.style.display = 'block';
        
        // Next question after delay
        setTimeout(() => {
            State.session.currentQuestion++;
            this.renderPracticeQuestion();
        }, 2000);
    },
    
    completePracticeMode() {
        State.showModal(
            'Practice Complete',
            'Great job! You\'ve completed the practice session.',
            'Return to Dashboard',
            () => {
                State.navigateTo('dashboard');
                State.initDashboard();
            }
        );
    },
    
    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    setupEventListeners() {
        // Auth buttons
        document.getElementById('login-btn')?.addEventListener('click', () => this.handleLogin());
        document.getElementById('signup-btn')?.addEventListener('click', () => this.handleSignup());
        
        // Enter button (Phase 1)
        document.getElementById('enter-btn')?.addEventListener('click', () => {
            this.startOnboarding();
        });
        
        // Continue button (Dashboard)
        document.getElementById('continue-btn')?.addEventListener('click', () => {
            this.continueLearning();
        });
        
        // Mode cards (Dashboard)
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.mode;
                this.startLearningMode(mode);
            });
        });
        
        // Input field reactions
        document.querySelectorAll('.input-field').forEach(input => {
            input.addEventListener('focus', () => this.triggerInputReaction(input));
            input.addEventListener('input', () => this.triggerInputReaction(input));
        });
        
        // Enter key support for inputs
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (State.session.currentScreen === 'auth') {
                    const loginForm = document.getElementById('login-form');
                    if (loginForm.style.display !== 'none') {
                        this.handleLogin();
                    } else {
                        this.handleSignup();
                    }
                } else if (State.session.onboardingStep === 1) {
                    this.validateStep1();
                } else if (State.session.onboardingStep === 2) {
                    this.validateStep2();
                }
            }
        });
        
        // Mutation observer to add back button when screen changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('screen') && target.classList.contains('active')) {
                        setTimeout(() => this.addBackButton(), 100);
                    }
                }
            });
        });
        
        document.querySelectorAll('.screen').forEach(screen => {
            observer.observe(screen, { attributes: true });
        });
    },
    
    // Subtle background reaction during input
    triggerInputReaction(input) {
        const screen = document.querySelector('.screen.active');
        if (!screen) return;
        
        // Add subtle pulse effect
        screen.style.animation = 'none';
        setTimeout(() => {
            screen.style.animation = 'screenPulse 0.3s ease';
        }, 10);
    },
};

// ==========================================
// BOOT SEQUENCE INTRO - ISOLATED LOGIC
// ==========================================

const BootSequence = {
    lines: [
        '> INITIALIZING NEURAL CORE...',
        '> ESTABLISHING SECURE LINK...',
        '> LOADING SYSTEM MODULES...',
        '> SYNCHRONIZING AI PROTOCOLS...',
        '> CALIBRATING USER INTERFACE...',
        '> SYSTEM READY...'
    ],
    typingSpeed: 12,
    lineDelay: 80,
    hasPlayed: false,
    
    init() {
        // Check if boot sequence has already played this session
        if (sessionStorage.getItem('bootSequencePlayed')) {
            this.skip();
            return;
        }
        
        this.overlay = document.getElementById('boot-sequence');
        this.linesContainer = document.getElementById('boot-lines');
        this.cursor = document.getElementById('boot-cursor');
        this.enterBtn = document.getElementById('boot-enter-btn');
        
        if (!this.overlay || !this.linesContainer) {
            this.skip();
            return;
        }
        
        this.start();
    },
    
    async start() {
        this.hasPlayed = true;
        
        // Type each line sequentially
        for (let i = 0; i < this.lines.length; i++) {
            await this.typeLine(this.lines[i], i);
            await this.delay(this.lineDelay);
        }
        
        // Show cursor and enter button
        this.cursor.classList.add('visible');
        this.enterBtn.style.display = 'inline-block';
        
        // Setup enter button
        this.enterBtn.addEventListener('click', () => this.complete());
        
        // Auto-complete after 3 seconds if user doesn't click
        setTimeout(() => {
            if (this.overlay && !this.overlay.classList.contains('hidden')) {
                this.complete();
            }
        }, 3000);
    },
    
    async typeLine(text, index) {
        const lineEl = document.createElement('div');
        lineEl.className = 'boot-line typing';
        lineEl.style.animationDelay = '0s';
        this.linesContainer.appendChild(lineEl);
        
        // Type each character
        for (let i = 0; i < text.length; i++) {
            lineEl.textContent = text.substring(0, i + 1);
            await this.delay(this.typingSpeed);
        }
        
        // Remove typing cursor, add special style for last line
        lineEl.classList.remove('typing');
        if (index === this.lines.length - 1) {
            lineEl.classList.add('ready');
        }
    },
    
    complete() {
        if (!this.overlay) return;
        
        // Mark as played
        sessionStorage.setItem('bootSequencePlayed', 'true');
        
        // Fade out boot sequence
        this.overlay.classList.add('hidden');
        
        // Remove from DOM after transition
        setTimeout(() => {
            if (this.overlay && this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
            }
            // Initialize main app
            App.init();
        }, 800);
    },
    
    skip() {
        const overlay = document.getElementById('boot-sequence');
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        App.init();
    },
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    BootSequence.init();
});
