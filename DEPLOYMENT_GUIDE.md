# 🚀 Vercel Deployment Guide

This guide will walk you through deploying your University Application Tracking System to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Supabase Project**: Ensure your Supabase database is set up
4. **Domain** (Optional): Custom domain for production

## 🔧 Pre-Deployment Setup

### 1. Update Environment Variables

First, update your `.env.production` file with actual production values:

```bash
# Copy your actual Supabase project details
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key

# Update with your actual domain
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### 2. Database Migration

Ensure your Supabase database has all required tables:

```bash
# Run database setup (if not already done)
npm run db:migrate
```

### 3. Build Test

Test your build locally before deployment:

```bash
npm run build
npm start
```

## 🚀 Deployment Methods

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
# From your project root
vercel

# Follow the prompts:
# ? Set up and deploy "apply-track"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? apply-track
# ? In which directory is your code located? ./
```

4. **Production Deployment**:
```bash
vercel --prod
```

### Method 2: GitHub Integration

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure settings (see below)

## ⚙️ Vercel Configuration

### Environment Variables Setup

In Vercel Dashboard → Project → Settings → Environment Variables, add:

#### Production Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
NEXTAUTH_SECRET = your_32_char_secret
NODE_ENV = production
```

#### Build Settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Domain Configuration

1. **Default Domain**: Your app will be available at `https://your-project-name.vercel.app`

2. **Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

## 🔒 Security Configuration

### 1. Update CORS Settings

The `vercel.json` already includes CORS headers. Update if needed:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://your-domain.com"
        }
      ]
    }
  ]
}
```

### 2. Supabase RLS Policies

Ensure your RLS policies are properly configured for production:

```sql
-- Allow authenticated users to access their own data
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Similar policies for students, parents, applications tables
```

### 3. Authentication URLs

Update Supabase Auth settings:
- Go to Supabase Dashboard → Authentication → URL Configuration
- Add your Vercel domain to "Site URL"
- Add redirect URLs: `https://your-domain.com/auth/callback`

## 📊 Monitoring & Analytics

### 1. Vercel Analytics

Enable in Vercel Dashboard → Project → Analytics

### 2. Performance Monitoring

The app includes built-in performance monitoring. Check:
- Core Web Vitals in Vercel Dashboard
- Function execution times
- Build performance

### 3. Error Tracking

Optional: Integrate Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

## 🔄 Continuous Deployment

### Automatic Deployments

Once connected to GitHub:
- **Push to `main`** → Automatic production deployment
- **Push to other branches** → Preview deployments
- **Pull Requests** → Preview deployments with unique URLs

### Manual Deployments

```bash
# Deploy current branch to preview
vercel

# Deploy to production
vercel --prod

# Deploy specific branch
git checkout feature-branch
vercel
```

## 🐛 Troubleshooting

### Common Issues:

1. **Build Errors**:
   - Check TypeScript errors: `npm run lint`
   - Verify all dependencies: `npm install`
   - Test build locally: `npm run build`

2. **Environment Variables**:
   - Verify in Vercel Dashboard
   - Ensure no extra spaces or quotes
   - Redeploy after changes

3. **Database Connection**:
   - Check Supabase service status
   - Verify connection strings
   - Test API routes locally

4. **Authentication Issues**:
   - Update Supabase redirect URLs
   - Check NEXTAUTH_URL environment variable
   - Verify NEXTAUTH_SECRET is set

### Debug Commands:

```bash
# Check deployment logs
vercel logs your-deployment-url

# Inspect build
vercel inspect your-deployment-url

# Download deployment for debugging
vercel download your-deployment-url
```

## 🎯 Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Authentication works (login/signup)
- [ ] Database connections working
- [ ] Student dashboard displays correctly
- [ ] Parent dashboard accessible
- [ ] University search functions
- [ ] Application tracking works
- [ ] All API routes respond correctly
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable

## 📈 Optimization Tips

1. **Performance**:
   - Enable Vercel Edge Network
   - Configure caching headers
   - Optimize images with `next/image`

2. **SEO**:
   - Add metadata to pages
   - Configure sitemap
   - Set up analytics

3. **User Experience**:
   - Test on multiple devices
   - Verify loading states
   - Check error handling

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production](https://supabase.com/docs/guides/platform/going-to-prod)
- [Domain Configuration](https://vercel.com/docs/concepts/projects/domains)

---

## 🆘 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally with production build
4. Review Supabase dashboard for errors
5. Check this deployment guide

Your University Application Tracking System should now be successfully deployed on Vercel! 🎉
