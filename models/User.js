// ==========================================
// USER MODEL
// ==========================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },
    level: {
        type: Number,
        default: 1,
        min: 1
    },
    xp: {
        type: Number,
        default: 0,
        min: 0
    },
    currentSubject: {
        type: String,
        default: null
    },
    progress: {
        totalQuestions: { type: Number, default: 0 },
        correctAnswers: { type: Number, default: 0 },
        accuracy: { type: Number, default: 0 },
        subjects: [{
            subject: String,
            questionsAttempted: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            accuracy: { type: Number, default: 0 }
        }]
    },
    battleStats: {
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        draws: { type: Number, default: 0 },
        totalBattles: { type: Number, default: 0 }
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ level: -1, xp: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Only hash if password is modified
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12); // 12 rounds for security
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Add XP and handle level up
userSchema.methods.addXP = async function(amount) {
    this.xp += amount;
    
    // Level up every 100 XP
    const newLevel = Math.floor(this.xp / 100) + 1;
    if (newLevel > this.level) {
        this.level = newLevel;
    }
    
    this.lastActive = Date.now();
    return this.save();
};

// Update progress
userSchema.methods.updateProgress = async function(subject, isCorrect) {
    this.progress.totalQuestions += 1;
    
    if (isCorrect) {
        this.progress.correctAnswers += 1;
    }
    
    // Calculate overall accuracy
    this.progress.accuracy = Math.round(
        (this.progress.correctAnswers / this.progress.totalQuestions) * 100
    );
    
    // Update subject-specific progress
    const subjectIndex = this.progress.subjects.findIndex(
        s => s.subject === subject
    );
    
    if (subjectIndex >= 0) {
        this.progress.subjects[subjectIndex].questionsAttempted += 1;
        if (isCorrect) {
            this.progress.subjects[subjectIndex].correctAnswers += 1;
        }
        this.progress.subjects[subjectIndex].accuracy = Math.round(
            (this.progress.subjects[subjectIndex].correctAnswers / 
             this.progress.subjects[subjectIndex].questionsAttempted) * 100
        );
    } else {
        this.progress.subjects.push({
            subject,
            questionsAttempted: 1,
            correctAnswers: isCorrect ? 1 : 0,
            accuracy: isCorrect ? 100 : 0
        });
    }
    
    this.lastActive = Date.now();
    return this.save();
};

// Update battle stats
userSchema.methods.updateBattleStats = async function(result) {
    this.battleStats.totalBattles += 1;
    
    if (result === 'win') this.battleStats.wins += 1;
    else if (result === 'loss') this.battleStats.losses += 1;
    else if (result === 'draw') this.battleStats.draws += 1;
    
    this.lastActive = Date.now();
    return this.save();
};

// Get public profile (exclude sensitive data)
userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        level: this.level,
        xp: this.xp,
        currentSubject: this.currentSubject,
        progress: this.progress,
        battleStats: this.battleStats,
        lastActive: this.lastActive,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('User', userSchema);
