# Environment Variables Setup Guide

## Overview

This project uses multiple environment variable files for different environments:

- `.env.example` - Template file with all required variables (committed to repo)
- `.env.local` - Local development overrides (not committed)
- `.env.development` - Development environment specific settings (not committed)
- `.env.production` - Production environment specific settings (not committed)
- `.env.production.local` - Production local overrides (not committed)

## Environment Priority

Next.js loads environment variables in this order (later ones override earlier):

### Development Mode (NODE_ENV=development)
1. `.env`
2. `.env.local`
3. `.env.development`
4. `.env.development.local`

### Production Mode (NODE_ENV=production)
1. `.env`
2. `.env.local`
3. `.env.production`
4. `.env.production.local`

**默认环境**: 
- 开发时默认使用 `.env.local` (如果存在)
- 生产部署时默认使用 `.env.production` (如果存在)
- 如果没有这些文件，会回退到 `.env.example` 中的默认值

## Setup Instructions

### 1. Local Development Setup
```bash
# Copy the example file to create your local environment file
cp .env.example .env.local

# Edit .env.local with your actual development values
```

### 2. Production Deployment Setup
```bash
# For production deployment, create production environment file
cp .env.example .env.production

# Edit .env.production with your actual production values
# Make sure to use production Supabase project and secure secrets
```

### 2. Required Environment Variables

#### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep secret!)

#### Database
- `DATABASE_URL` - PostgreSQL connection string for migrations

#### Authentication (if using NextAuth.js)
- `NEXTAUTH_SECRET` - Secret key for JWT signing (minimum 32 characters)
- `NEXTAUTH_URL` - Your application URL

#### Development Settings
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Port number for local development

### 3. Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to Settings > API
4. Copy the following:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/Public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Database Setup

1. Run Supabase migrations:
```bash
npx supabase db reset
```

2. Seed the database (if seed file exists):
```bash
npx supabase db seed
```

### 5. Environment Variable Priority

Next.js loads environment variables in this order (later ones override earlier):
1. `.env`
2. `.env.local`
3. `.env.development` (when NODE_ENV=development)
4. `.env.development.local` (when NODE_ENV=development)

### 6. Security Notes

- Never commit `.env.local` or any file containing real credentials
- Use different Supabase projects for development and production
- Rotate secrets regularly in production
- Use environment-specific service accounts

### 7. Troubleshooting

#### Common Issues:
1. **Variables not loading**: Restart the development server after changing env files
2. **Supabase connection errors**: Verify your project URL and keys are correct
3. **Database errors**: Check your DATABASE_URL format and credentials

#### Debug Commands:
```bash
# Check if environment variables are loaded
npm run dev -- --debug

# Verify Supabase connection
npx supabase status
```

## Example .env.local File

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database
DATABASE_URL=postgresql://postgres:yourpassword@db.abcdefghijklmnop.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_SECRET=your-super-secret-jwt-secret-here-32chars-min
NEXTAUTH_URL=http://localhost:3001

# Development
NODE_ENV=development
PORT=3001
```
