# Vendor Management Backend API

Production-ready backend infrastructure with database, file storage, and background jobs.

## 🚀 Quick Start

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to SQL Editor and run `src/db/schema.sql`
4. Go to Storage and create bucket: `vendor-documents`
5. Copy your project URL and API keys

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-random-secret-key
```

### 4. Set up Redis (for background jobs)

**Option A: Local Redis**
```bash
# macOS
brew install redis
brew services start redis
```

**Option B: Upstash (Cloud Redis - Free tier available)**
1. Go to [upstash.com](https://upstash.com)
2. Create Redis database
3. Copy connection URL to `.env`:
```env
REDIS_URL=redis://default:password@host:port
```

### 5. Run Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.js           # Main server file
│   ├── db/
│   │   └── schema.sql      # Database schema
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   ├── files.js        # File upload routes
│   │   ├── companies.js    # Company routes
│   │   ├── consultants.js  # Consultant routes
│   │   ├── contracts.js    # Contract routes
│   │   └── firms.js        # Firm routes
│   ├── jobs/
│   │   ├── queues.js       # Job queues setup
│   │   └── processors.js   # Job workers
│   └── middleware/
│       └── auth.js         # Authentication middleware
├── .env.example
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Files
- `POST /api/files/upload` - Upload contract file
- `GET /api/files/:id` - Get file metadata
- `GET /api/files/company/:companyId` - List company files
- `DELETE /api/files/:id` - Delete file

### Admin
- `GET /admin/queues` - Bull Board (job queue dashboard)
- `GET /health` - Health check

## 📦 Background Jobs

Jobs are automatically processed in the background:

- **File Processing**: Extract text, generate thumbnails, virus scan
- **Email Notifications**: Send emails (when configured)
- **Data Sync**: Sync with external systems
- **Reports**: Generate reports

View jobs at: `http://localhost:3000/admin/queues`

## 🗄️ Database

Uses PostgreSQL via Supabase:
- Multi-tenant architecture (firms)
- Row Level Security (RLS)
- Automatic backups
- Real-time subscriptions (if needed)

## 📤 File Storage

Uses Supabase Storage:
- Automatic CDN
- File versioning
- Access control
- 1GB free, then $0.021/GB/month

## 🚀 Deployment

### Railway (Recommended)

1. Connect GitHub repo
2. Add environment variables
3. Deploy automatically

### Render

1. Create new Web Service
2. Connect GitHub repo
3. Add environment variables
4. Deploy

### Fly.io

```bash
fly launch
fly secrets set SUPABASE_URL=...
fly deploy
```

## 💰 Cost Estimates

**Development:**
- Supabase: Free
- Redis (Upstash): Free
- Hosting: Free (Railway/Render free tiers)
- **Total: $0/month**

**Production (Small):**
- Supabase: $25/month
- Redis: $10/month
- Hosting: $20/month
- **Total: ~$55/month**

**Production (Growth):**
- Supabase: $100/month
- Redis: $50/month
- Hosting: $100/month
- **Total: ~$250/month**

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- Row Level Security (RLS)
- File type validation
- File size limits
- CORS protection

## 📚 Next Steps

1. Create remaining API routes (companies, consultants, etc.)
2. Add email service (SendGrid, AWS SES)
3. Add logging (Winston, Pino)
4. Add monitoring (Sentry)
5. Add rate limiting
6. Add API documentation (Swagger)

