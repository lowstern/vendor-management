# 🚀 Quick Deployment Guide

## Fastest Way to Deploy (5 Minutes)

### Method 1: Vercel (Recommended - Easiest)

**Step 1: Install Vercel CLI**
```bash
npm i -g vercel
```

**Step 2: Login**
```bash
vercel login
```

**Step 3: Deploy**
```bash
cd "/Users/lowellstern/Public/Drop Box"
vercel
```

Answer the prompts:
- Set up and deploy? **Yes**
- Which scope? (select your account)
- Link to existing project? **No**
- Project name: **vendor-management** (or press Enter)
- Directory: **./** (press Enter)
- Override settings? **No**

**Step 4: Deploy to Production**
```bash
vercel --prod
```

**✅ Done!** Your app is live at `https://vendor-management.vercel.app`

---

### Method 2: Netlify (Also Easy)

**Step 1: Build Locally**
```bash
cd "/Users/lowellstern/Public/Drop Box"
npm run build
```

**Step 2: Deploy**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

Follow the prompts to login and deploy.

---

### Method 3: GitHub + Vercel (Best for Ongoing Development)

**Step 1: Initialize Git** (if not already done)
```bash
cd "/Users/lowellstern/Public/Drop Box"
git init
git add .
git commit -m "Initial commit"
```

**Step 2: Push to GitHub**
```bash
# Create a new repo on GitHub first, then:
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

**Step 3: Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects everything
5. Click "Deploy"

**✅ Automatic deployments:** Every push to `main` = auto-deploy!

---

## 🔧 Pre-Deployment Checklist

Before deploying:

- [ ] Test build locally: `npm run build`
- [ ] Review `DEPLOYMENT.md` for detailed instructions
- [ ] (Optional) Add environment variables in platform settings
- [ ] (Optional) Set up custom domain

---

## ⚙️ Environment Variables (Optional)

If you need to add environment variables:

**Vercel:**
1. Project Settings → Environment Variables
2. Add variables (they start with `VITE_`)

**Netlify:**
1. Site Settings → Environment Variables
2. Add variables

Common variables:
```
VITE_API_URL=https://your-api.com/api
VITE_ENCRYPTION_KEY=your-secret-key
```

---

## 🌐 Custom Domain

After deployment:

**Vercel:**
- Project Settings → Domains → Add Domain

**Netlify:**
- Domain Settings → Add Custom Domain

Both platforms provide free SSL automatically!

---

## 📝 Post-Deployment

1. ✅ Visit your deployed URL
2. ✅ Test login (admin@example.com / admin123)
3. ✅ Test all features
4. ✅ Share with your team!

---

## 🆘 Troubleshooting

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Need help?** See `DEPLOYMENT.md` for detailed guide.

---

**Ready? Run `vercel` and you're live in 5 minutes!** 🚀

