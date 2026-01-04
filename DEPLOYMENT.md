# Deployment Guide - Vendor Management Platform

Complete guide to deploy your Vendor Management application to production.

---

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

**Best for:** Quick deployment, automatic SSL, global CDN, zero config

#### Steps:

1. **Install Vercel CLI** (if deploying from command line):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd "/Users/lowellstern/Public/Drop Box"
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? No
   - Project name: vendor-management (or your choice)
   - Directory: ./
   - Override settings? No
   
4. **Production Deploy**:
   ```bash
   vercel --prod
   ```

**OR use GitHub Integration (Recommended):**

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite settings
   - Click "Deploy"

3. **Automatic Deployments**:
   - Every push to `main` = Production deploy
   - Pull requests = Preview deployments

---

### Option 2: Netlify

**Best for:** Simple deployments, great free tier

#### Steps:

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

**OR use GitHub Integration:**

1. Push to GitHub (same as above)

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

---

### Option 3: AWS Amplify

**Best for:** AWS ecosystem integration

#### Steps:

1. Push code to GitHub

2. **Connect to Amplify**:
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect GitHub repository
   - Auto-detects settings
   - Review and deploy

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

Create `.env.production` file (DO NOT commit this):

```env
# API Configuration
VITE_API_URL=https://your-api-domain.com/api

# Security (Generate with: openssl rand -base64 32)
VITE_ENCRYPTION_KEY=your-production-encryption-key-here

# File Upload
VITE_MAX_FILE_SIZE_MB=10
VITE_ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.txt

# Session
VITE_SESSION_TIMEOUT=86400000

# Production URL
VITE_PROD_URL=https://your-domain.com
```

**For Vercel/Netlify:**
- Add these in the platform's environment variables section
- They'll be available as `import.meta.env.VITE_*`

### 2. Update Default Credentials

⚠️ **IMPORTANT:** Before deploying:

1. **Change default admin password**:
   - Edit `src/services/authService.ts`
   - Update the mock user password hash
   - Or better: Use a real backend API

2. **Remove demo credentials**:
   - Remove or update default login credentials

### 3. Build Test

```bash
npm run build
npm run preview
```

Verify the build works locally before deploying.

---

## 🔧 Platform-Specific Configuration

### Vercel Configuration

The `vercel.json` is already configured:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Add Environment Variables in Vercel:**
1. Go to Project Settings
2. Click "Environment Variables"
3. Add all `VITE_*` variables
4. Select environments (Production, Preview, Development)

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

**Add Environment Variables:**
1. Site Settings → Environment Variables
2. Add all variables
3. Specify scopes

---

## 🌐 Custom Domain Setup

### Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. SSL certificate auto-provisioned

### Netlify

1. Domain Settings → Add custom domain
2. Configure DNS records
3. SSL auto-provisioned via Let's Encrypt

---

## 🔐 Production Security Setup

### 1. Enable HTTPS (Automatic)

Both Vercel and Netlify provide free SSL certificates automatically.

### 2. Environment Variables

- **Never commit** `.env` files
- Use platform's environment variable settings
- Rotate secrets regularly

### 3. Backend API

For production, you'll need:

```bash
# Example backend structure
backend/
├── api/
│   ├── auth.js          # Authentication endpoints
│   ├── firms.js         # Firm management
│   └── contracts.js     # Contract uploads
├── database/            # PostgreSQL/MongoDB
└── storage/             # S3/Azure Blob for files
```

### 4. Duo Security (If Using)

1. Get production Duo credentials
2. Add to environment variables:
   - `VITE_DUO_INTEGRATION_KEY`
   - `VITE_DUO_SECRET_KEY`
   - `VITE_DUO_API_HOSTNAME`

**Note:** In production, Duo API calls should be on the backend!

---

## 📦 Build Optimization

The app is already optimized, but you can:

### 1. Check Bundle Size

```bash
npm run build
npx vite-bundle-visualizer
```

### 2. Enable Compression

Vercel/Netlify auto-compress, but you can add:

```bash
npm install --save-dev vite-plugin-compression
```

### 3. Optimize Images

If adding images later:
```bash
npm install vite-imagetools
```

---

## 🧪 Testing Deployment

### 1. Preview Build Locally

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` to test production build.

### 2. Test Production URL

After deployment:
- ✅ Test login/signup
- ✅ Test all features
- ✅ Test file uploads
- ✅ Test Duo (if enabled)
- ✅ Test on mobile devices

---

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Install:
   ```bash
   npm install @vercel/analytics
   ```

2. Add to `src/main.tsx`:
   ```tsx
   import { Analytics } from '@vercel/analytics/react';
   
   // In your component
   <Analytics />
   ```

### Error Tracking

Consider adding:
- Sentry for error tracking
- Google Analytics for usage
- Custom logging service

---

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: vercel/action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🚨 Troubleshooting

### Build Fails

**Error: Cannot find module**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: Build timeout**
- Check `package.json` scripts
- Optimize build process
- Increase timeout in platform settings

### Environment Variables Not Working

- Ensure they start with `VITE_`
- Redeploy after adding variables
- Check variable names match code

### Routing Issues (404 on refresh)

- Verify `vercel.json` rewrites exist
- For Netlify: Check `netlify.toml` redirects
- Ensure SPA routing is configured

### File Upload Issues

- Check file size limits
- Verify CORS settings
- Test with different file types

---

## 📝 Post-Deployment

### 1. Verify Deployment

- [ ] Site loads correctly
- [ ] HTTPS enabled
- [ ] Login works
- [ ] All features functional
- [ ] Mobile responsive
- [ ] Environment variables loaded

### 2. Security

- [ ] Change default passwords
- [ ] Enable 2FA (if using Duo)
- [ ] Review security headers
- [ ] Test file upload security

### 3. Performance

- [ ] Check Lighthouse score
- [ ] Test load times
- [ ] Optimize images
- [ ] Enable caching

---

## 🎯 Recommended Deployment Flow

### For Quick Start (Vercel + GitHub):

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Import GitHub repo
   - Auto-detects settings
   - Deploys automatically

3. **Configure**:
   - Add environment variables
   - Set up custom domain
   - Test everything

4. **Done!** ✅

---

## 📞 Support

If you encounter issues:

1. Check platform logs (Vercel/Netlify dashboard)
2. Test build locally first
3. Verify environment variables
4. Check browser console for errors
5. Review this deployment guide

---

## ✅ Deployment Checklist

**Pre-Deployment:**
- [ ] Build works locally (`npm run build`)
- [ ] All environment variables documented
- [ ] Default credentials changed
- [ ] `.env` files in `.gitignore`

**Deployment:**
- [ ] Code pushed to GitHub
- [ ] Connected to platform (Vercel/Netlify)
- [ ] Environment variables added
- [ ] Build successful

**Post-Deployment:**
- [ ] Site accessible
- [ ] HTTPS enabled
- [ ] Login tested
- [ ] Features tested
- [ ] Custom domain configured (if needed)
- [ ] Monitoring set up

---

**Ready to deploy? Choose your platform and follow the steps above!** 🚀

