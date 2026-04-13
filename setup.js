/**
 * Setup Script - Configure OpenRouter API Key
 * Run this to easily set your API key
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const envPath = path.join(__dirname, '.env');

console.log('\n🔑 OpenRouter API Key Setup\n');
console.log('Get your free API key from: https://openrouter.ai/keys\n');

rl.question('Enter your OpenRouter API key: ', (apiKey) => {
    apiKey = apiKey.trim();
    
    if (!apiKey || apiKey.length < 20) {
        console.error('❌ Invalid API key. Please enter a valid key.');
        rl.close();
        return;
    }
    
    const envContent = `OPENROUTER_API_KEY=${apiKey}\n`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ API key saved successfully!');
    console.log('🚀 Restart your server with: npm start\n');
    
    rl.close();
});

rl.on('close', () => {
    process.exit(0);
});