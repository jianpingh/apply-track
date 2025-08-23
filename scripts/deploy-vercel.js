#!/usr/bin/env node

/**
 * Vercel Deployment Script for Apply-Track System
 * 
 * This script helps automate the deployment process to Vercel
 */

console.log('🚀 Apply-Track Vercel Deployment Helper');
console.log('=====================================\n');

console.log('📋 Deployment Checklist:');
console.log('1. ✅ Project files ready');
console.log('2. ❓ GitHub repository updated');
console.log('3. ❓ Environment variables configured');
console.log('4. ❓ Vercel project created\n');

console.log('🔧 Quick Setup Commands:');
console.log('');
console.log('# 1. Push to GitHub');
console.log('git add .');
console.log('git commit -m "Deploy to Vercel"');
console.log('git push origin main');
console.log('');
console.log('# 2. Install Vercel CLI (if not installed)');
console.log('npm install -g vercel');
console.log('');
console.log('# 3. Deploy to Vercel');
console.log('vercel');
console.log('');
console.log('# 4. Deploy to production');
console.log('vercel --prod');
console.log('');

console.log('🌍 Environment Variables to Configure in Vercel Dashboard:');
console.log('');
console.log('NEXT_PUBLIC_SUPABASE_URL=https://jgepefxchovheioqukba.supabase.co');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=[your_anon_key]');
console.log('SUPABASE_SERVICE_ROLE_KEY=[your_service_role_key]');
console.log('DATABASE_URL=[your_database_url]');
console.log('NEXTAUTH_SECRET=[your_32_char_secret]');
console.log('NEXTAUTH_URL=https://[your-app].vercel.app');
console.log('NODE_ENV=production');
console.log('');

console.log('📚 For detailed instructions, see:');
console.log('- VERCEL_DEPLOYMENT.md');
console.log('- .env.vercel (for exact values)');
console.log('');

console.log('🎉 After deployment, your app will be available at:');
console.log('https://[your-app-name].vercel.app');
console.log('');

// Check if we're in the right directory
const fs = require('fs');
const path = require('path');

if (fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (packageJson.name === 'apply-track') {
        console.log('✅ You are in the correct project directory');
    } else {
        console.log('⚠️  Warning: This may not be the apply-track project directory');
    }
} else {
    console.log('❌ package.json not found. Make sure you are in the project root directory');
}

console.log('\n🚀 Ready to deploy! Follow the commands above or see VERCEL_DEPLOYMENT.md for details.');
