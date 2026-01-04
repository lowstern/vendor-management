# User Access Guide - How Users Interact With Your Platform

## 🚀 Step 1: Deploy Your Application

Your code is on GitHub. Now deploy it to make it accessible to users.

### Quick Deploy Options:

#### Option A: Deploy via Vercel (Recommended - 2 minutes)

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login (can use GitHub account)

2. **Import Project:**
   - Click "Add New Project"
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

3. **Configure (Vercel auto-detects, but verify):**
   - Framework Preset: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Deploy:**
   - Click "Deploy"
   - Wait 1-2 minutes
   - ✅ **Done!** You'll get a URL like: `https://vendor-management.vercel.app`

---

#### Option B: Deploy via Netlify (Also Easy)

1. **Go to Netlify:**
   - Visit [netlify.com](https://netlify.com)
   - Sign up/Login

2. **Import Project:**
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub
   - Select your repository

3. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Deploy:**
   - Click "Deploy site"
   - ✅ **Done!** You'll get a URL like: `https://your-app.netlify.app`

---

## 👥 Step 2: User Access

Once deployed, users can access your application:

### For End Users:

1. **Share the URL:**
   ```
   https://your-app.vercel.app
   ```
   or
   ```
   https://your-app.netlify.app
   ```

2. **Users Visit the URL:**
   - They'll see the login page
   - They can create accounts or login

3. **Default Login (For Testing):**
   - Email: `admin@example.com`
   - Password: `admin123`

---

## 🏢 Step 3: Multi-User Setup

### Option A: Users Create Their Own Accounts

1. **Users visit your URL**
2. **Click "Sign up"** on login page
3. **Fill in form:**
   - Name
   - Email
   - Password
4. **Account created** - They can start using the platform

### Option B: Setup Firms First

1. **Firm Setup:**
   - Visit your deployed URL
   - Click "Set up your firm" at bottom of login
   - Complete firm setup wizard
   - Creates firm + admin account

2. **Invite Users:**
   - Users sign up and select firm during registration
   - Or admin creates user accounts (future feature)

---

## 🔐 User Authentication Flow

### First Time User:

1. **Visit:** `https://your-app.vercel.app`
2. **See Login Page**
3. **Click "Sign up"**
4. **Fill Registration Form:**
   - Full Name
   - Email
   - Password (must meet requirements)
5. **Account Created** → Automatically logged in
6. **Can Start Using:** Swipe companies, view dashboards, etc.

### Returning User:

1. **Visit:** `https://your-app.vercel.app`
2. **Login:**
   - Email
   - Password
3. **If Duo Enabled:** Complete 2FA (optional)
4. **Access Platform** → Full access

---

## 📱 What Users Can Do

### Basic User:
- ✅ Login/Logout
- ✅ View company cards
- ✅ Swipe companies (accept/reject)
- ✅ View company details
- ✅ View dashboards
- ✅ Access VCP portal (if enabled for their firm)

### Admin User:
- ✅ Everything above PLUS:
- ✅ Firm Settings
- ✅ Enable/Disable Duo 2FA
- ✅ Enable/Disable VCP
- ✅ Manage firm configuration

---

## 🎯 Sharing With Users

### Method 1: Direct Link
```
Share this URL:
https://your-app.vercel.app
```

### Method 2: Custom Domain
1. **Set up custom domain** in Vercel/Netlify
2. **Share branded URL:**
   ```
   https://vendormgmt.yourcompany.com
   ```

### Method 3: Email Invitation
```
Subject: Access Vendor Management Platform

Hi [Name],

You now have access to our Vendor Management Platform!

URL: https://your-app.vercel.app
Login: your-email@company.com
Password: [temporary password - change after first login]

Get started:
1. Visit the URL above
2. Login with your credentials
3. Start managing vendors!

Need help? Contact support.
```

---

## 🏢 Setting Up Firms for Users

### Firm-Based Access:

Each firm gets:
- **Own Portal:** `https://firmname.vendormgmt.com` (if subdomain routing setup)
- **Own Settings:** Duo, VCP enabled/disabled per firm
- **Own Users:** Users belong to a firm

### User Flow:

1. **Firm Admin Sets Up:**
   - Visits platform
   - Clicks "Set up your firm"
   - Completes setup
   - Creates admin account

2. **Admin Invites Users:**
   - Users sign up
   - Select firm during registration
   - Or admin creates accounts (manual for now)

3. **Users Access:**
   - Login with their credentials
   - See firm-specific portal
   - Access VCP if enabled
   - Use all features

---

## 🔄 User Roles & Permissions

### Viewer:
- View companies
- View dashboards
- Read-only access

### User:
- Everything Viewer can do
- Upload contracts
- Submit VCP data
- Manage contracts

### Admin:
- Everything User can do
- Firm settings
- Enable/disable features
- Manage firm configuration

---

## 📧 User Onboarding Checklist

### For Each New User:

1. ✅ **Account Created**
   - Via signup form
   - Or admin creates account

2. ✅ **Login Credentials Shared**
   - Email
   - Password (or reset link)

3. ✅ **First Login**
   - User visits URL
   - Logs in
   - Changes password (recommended)

4. ✅ **Training (Optional)**
   - Share user guide
   - Show features
   - Explain workflow

5. ✅ **Access Granted**
   - User can start using platform
   - All features available based on role

---

## 🛠️ Admin Tasks

### Setting Up First Users:

1. **Create Firm** (if multi-tenant)
   - Setup wizard creates firm
   - Creates first admin account

2. **Create Additional Users:**
   - Users can sign up themselves
   - Or admin creates manually (via signup)

3. **Configure Firm:**
   - Enable/disable Duo
   - Enable/disable VCP
   - Set permissions

4. **Share Access:**
   - Send URL to users
   - Provide login instructions

---

## 🔗 Public vs Private Access

### Current Setup (Private):
- ✅ Requires login
- ✅ User authentication required
- ✅ Protected routes

### Future: Public VCP (Optional):
- Configure in Firm Settings
- Allow public vendor submissions
- No login required for submissions

---

## 📊 User Analytics (Future)

You can track:
- User logins
- Active users
- Feature usage
- VCP submissions
- Contract uploads

(Requires analytics integration)

---

## 🆘 User Support

### Help Users Get Started:

1. **Share Documentation:**
   - Link to README.md
   - User guide (create if needed)

2. **Support Channels:**
   - Email support
   - Help desk
   - Documentation site

3. **Common Issues:**
   - Forgot password → Need reset flow
   - Can't login → Check credentials
   - Access denied → Check user role

---

## ✅ Quick Start for First User

1. **Deploy application** (Vercel/Netlify)
2. **Get public URL**
3. **Share URL with user**
4. **User visits** → Sees login page
5. **User clicks "Sign up"** → Creates account
6. **User logs in** → Uses platform!

**That's it!** Users can immediately start using your platform.

---

## 🎉 You're Ready!

Once deployed, share the URL and users can:
- ✅ Create accounts
- ✅ Login
- ✅ Use all features
- ✅ Manage vendors
- ✅ Upload contracts
- ✅ Access dashboards

**Deploy now and share the URL with your users!** 🚀

