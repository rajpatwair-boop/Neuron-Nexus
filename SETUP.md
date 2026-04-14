# 🧠 Neural Learning System - Backend Setup

## ⚠️ PREREQUISITE: Install Node.js

### Step 1: Download and Install Node.js
1. Go to https://nodejs.org/
2. Click **"LTS"** (Long Term Support) version
3. Download the Windows Installer (.msi)
4. Run the installer and follow prompts
5. **IMPORTANT: Restart PowerShell after installation**

### Step 2: Verify Installation
Open PowerShell and run:
```powershell
node --version
npm --version
```

You should see version numbers like:
- `v20.10.0` (Node.js)
- `10.2.3` (npm)

---

## 🚀 Project Setup (After Node.js is installed)

### Step 3: Navigate to Project Folder
```powershell
cd C:\Users\Raj\neon-nexus-backend
```

### Step 4: Install Dependencies
```powershell
npm install
```

This will install:
- express
- mongoose
- cors
- dotenv
- bcryptjs
- jsonwebtoken
- nodemon (dev dependency)

### Step 5: Run the Server

**Development mode (with auto-restart):**
```powershell
npm run dev
```

**Production mode:**
```powershell
npm start
```

---

## ✅ Test the Server

Once running, open browser or use curl:

```
http://localhost:5000/
http://localhost:5000/api/test
http://localhost:5000/api/health
```

---

## 🔧 Troubleshooting

### "npm is not recognized"
**Solution:** Node.js is not installed or not in PATH
1. Install Node.js from https://nodejs.org/
2. Restart PowerShell
3. If still not working, restart your computer

### "Cannot find path"
**Solution:** Navigate to correct folder
```powershell
cd C:\Users\Raj\neon-nexus-backend
```

### Port already in use
**Solution:** Change port in .env file or kill existing process
```powershell
# Find process using port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Kill the process
Stop-Process -Id <PID>
```

### Installation fails
**Solution:** Clear npm cache and try again
```powershell
npm cache clean --force
npm install
```

---

## 📁 Project Structure

```
neon-nexus-backend/
├── node_modules/       # Dependencies (auto-generated)
├── .env               # Environment variables
├── .gitignore         # Git ignore rules
├── package.json       # Project config
├── package-lock.json  # Lock file (auto-generated)
├── server.js          # Main server file
└── SETUP.md           # This file
```

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm start` | Run server (production) |
| `npm run dev` | Run server with auto-restart |

---

## 🌐 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/` | Welcome message |
| GET | `/api/test` | Test API |
| GET | `/api/health` | Health check |

---

## 💡 Next Steps

1. ✅ Install Node.js
2. ✅ Run `npm install`
3. ✅ Run `npm run dev`
4. ✅ Test in browser: http://localhost:5000
5. 🚀 Start building your API!
