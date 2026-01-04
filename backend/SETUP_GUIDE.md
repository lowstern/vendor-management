# 🚀 Backend Setup Guide - Step by Step

Complete guide to set up your production-ready backend infrastructure.

---

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- Account on Supabase (free)
- Account on Upstash (free) OR Redis installed locally

---

## Step 1: Set up Supabase (Database + Storage)

### 1.1 Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (easiest)

### 1.2 Create New Project

1. Click "New project"
2. Fill in:
   - **Name**: `vendor-management`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
3. Click "Create new project"
4. Wait 2-3 minutes for setup

### 1.3 Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (long string, keep secret!)

### 1.4 Create Database Schema

1. Go to **SQL Editor**
2. Click "New query"
3. Copy contents of `backend/src/db/schema.sql`
4. Paste and click "Run"
5. ✅ Schema created!

### 1.5 Create Storage Bucket

1. Go to **Storage**
2. Click "New bucket"
3. Name: `vendor-documents`
4. Make it **Private** (not public)
5. Click "Create bucket"
6. ✅ Storage ready!

---

## Step 2: Set up Redis (Background Jobs)

### Option A: Upstash (Cloud - Recommended)

1. Go to [upstash.com](https://upstash.com)
2. Sign up (free tier available)
3. Click "Create Database"
4. Choose:
   - **Name**: `vendor-management-redis`
   - **Type**: Regional (cheapest)
   - **Region**: Same as Supabase
5. Click "Create"
6. Copy the **Redis URL**: `redis://default:xxxxx@xxxxx.upstash.io:6379`

### Option B: Local Redis (For Development)

```bash
# macOS
brew install redis
brew services start redis

# Linux
sudo apt install redis-server
sudo systemctl start redis

# Windows
# Download from redis.io or use WSL
```

Use: `redis://localhost:6379`

---

## Step 3: Set up Backend Server

### 3.1 Install Dependencies

```bash
cd backend
npm install
```

### 3.2 Create Environment File

Create `.env` file in `backend/` directory:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Server Configuration
PORT=3000
NODE_ENV=development
JWT_SECRET=your-random-secret-key-change-this

# File Storage
STORAGE_BUCKET=vendor-documents

# Redis Configuration
REDIS_URL=redis://default:xxxxx@xxxxx.upstash.io:6379
# OR local: redis://localhost:6379

# CORS
FRONTEND_URL=http://localhost:5173
```

**Important:**
- Replace all `xxxxx` with your actual values
- Generate a random `JWT_SECRET`: `openssl rand -base64 32`
- Keep `.env` file SECRET (never commit to Git!)

### 3.3 Test Connection

```bash
# Start server
npm run dev

# You should see:
# 🚀 Server running on port 3000
# 📊 Bull Board: http://localhost:3000/admin/queues
# 🏥 Health: http://localhost:3000/health
```

### 3.4 Test Health Endpoint

Open browser: `http://localhost:3000/health`

Should see:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

✅ **Backend is working!**

---

## Step 4: Test File Upload

### 4.1 Register a Test User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "name": "Test User"
  }'
```

Save the `token` from response.

### 4.2 Test File Upload

```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/test.pdf" \
  -F "companyId=some-company-id"
```

✅ **File upload works!**

---

## Step 5: View Job Queue Dashboard

1. Go to: `http://localhost:3000/admin/queues`
2. You'll see:
   - File Processing Queue
   - Email Queue
   - Data Sync Queue
   - Report Queue

✅ **Background jobs ready!**

---

## 🎉 You're Done!

Your backend infrastructure is now:
- ✅ Database (Supabase PostgreSQL)
- ✅ File Storage (Supabase Storage)
- ✅ Background Jobs (BullMQ + Redis)
- ✅ API Server (Express)
- ✅ Authentication (JWT)

---

## 📊 Cost Summary

**Free Tier:**
- Supabase: Free (500MB database, 1GB storage)
- Upstash: Free (10K commands/day)
- Hosting: Free (Railway/Render free tiers)
- **Total: $0/month** ✅

**Production (Small):**
- Supabase: $25/month
- Upstash: $10/month
- Hosting: $20/month
- **Total: ~$55/month**

---

## 🐛 Troubleshooting

### Can't connect to Supabase?
- Check your `.env` file
- Verify API keys are correct
- Check project is active

### Can't connect to Redis?
- Verify Redis URL in `.env`
- Check Upstash database is running
- Try local Redis: `redis://localhost:6379`

### File upload fails?
- Check storage bucket exists
- Verify bucket name in `.env`
- Check file size limits (10MB default)

### Jobs not processing?
- Check Redis connection
- Look at server logs
- Check Bull Board dashboard

---

## 🚀 Next Steps

1. ✅ Test all endpoints
2. ✅ Connect frontend to backend
3. ✅ Deploy to production
4. ✅ Set up monitoring
5. ✅ Add email service

**Your backend is production-ready!** 🎉

