# 🌐 Production Environment Setup

Copy this file to `.env.production` and update with your actual values:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# Authentication (Required)
NEXTAUTH_SECRET=YOUR_32_CHARACTER_SECRET_STRING_HERE
NEXTAUTH_URL=https://your-app-name.vercel.app

# Production Settings
NODE_ENV=production
```

## 📋 How to Get Your Supabase Values

1. Go to [supabase.com](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

## 🔐 Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use an online generator: [generate-secret.now.sh/32](https://generate-secret.now.sh/32)

## 🚀 Quick Setup Script

Run this script to set up your production environment:

```bash
# Create production environment file
cp .env.example .env.production

# Edit with your values
nano .env.production  # or use your preferred editor
```

## ⚠️ Security Notes

- Never commit `.env.production` to version control
- Keep your service role key secure
- Use a strong NEXTAUTH_SECRET
- Regularly rotate your secrets

## 🔧 Vercel Environment Variables

Instead of using `.env.production`, you can set variables directly in Vercel:

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add each variable for Production environment
4. Deploy your project

This is the recommended approach for production deployments.
