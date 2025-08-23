#!/usr/bin/env node

/**
 * Deployment Script for University Application Tracking System
 * This script automates the deployment process to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment process for Apply Track System...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI found');
} catch (error) {
  console.log('📦 Installing Vercel CLI...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI. Please install manually: npm install -g vercel');
    process.exit(1);
  }
}

// Pre-deployment checks
console.log('\n🔍 Running pre-deployment checks...');

// Check if .env.production exists
if (!fs.existsSync('.env.production')) {
  console.warn('⚠️  Warning: .env.production not found. Make sure to set up environment variables in Vercel dashboard.');
}

// Run build test
console.log('🏗️  Testing build process...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build test successful');
} catch (error) {
  console.error('❌ Build failed. Please fix build errors before deploying.');
  process.exit(1);
}

// Clean up build files
console.log('🧹 Cleaning up build files...');
try {
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'pipe' });
  }
  console.log('✅ Build cleanup complete');
} catch (error) {
  // Ignore cleanup errors
}

// Ask user for deployment type
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('🤔 Deploy to production? (y/N): ', (answer) => {
  const deployToProduction = answer.toLowerCase().startsWith('y');
  
  console.log(`\n🚀 Deploying to ${deployToProduction ? 'PRODUCTION' : 'PREVIEW'}...`);
  
  try {
    const deployCommand = deployToProduction ? 'vercel --prod' : 'vercel';
    execSync(deployCommand, { stdio: 'inherit' });
    
    console.log('\n🎉 Deployment completed successfully!');
    console.log('\n📋 Post-deployment checklist:');
    console.log('  □ Test authentication (login/signup)');
    console.log('  □ Check student dashboard');
    console.log('  □ Verify parent dashboard');
    console.log('  □ Test university search');
    console.log('  □ Check API routes');
    console.log('  □ Verify mobile responsiveness');
    console.log('\n📚 For troubleshooting, see DEPLOYMENT_GUIDE.md');
    
  } catch (error) {
    console.error('\n❌ Deployment failed. Common solutions:');
    console.error('  1. Check environment variables in Vercel dashboard');
    console.error('  2. Verify Supabase configuration');
    console.error('  3. Review deployment logs: vercel logs [deployment-url]');
    console.error('  4. See DEPLOYMENT_GUIDE.md for detailed troubleshooting');
    process.exit(1);
  }
  
  rl.close();
});
