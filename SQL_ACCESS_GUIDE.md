# 🔍 SQL Access Guide - Supabase Database

How to access and query your database using SQL (free tier).

---

## 🎯 Quick Access Methods

### Method 1: Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Login to your account
   - Select your project

2. **Open SQL Editor**
   - Click **SQL Editor** in left sidebar
   - Click **New query**

3. **Write and Run SQL**
   ```sql
   SELECT * FROM companies;
   ```
   - Click **Run** or press `Ctrl+Enter` / `Cmd+Enter`

✅ **Done!** You can now run any SQL query.

---

## 📊 Common SQL Queries

### View All Companies
```sql
SELECT * FROM companies ORDER BY name;
```

### View All Consultants
```sql
SELECT 
  c.name,
  c.firm,
  c.monthly_cost,
  co.name as company_name
FROM consultants c
JOIN companies co ON c.company_id = co.id
ORDER BY c.monthly_cost DESC;
```

### Get Spending by Company
```sql
SELECT 
  name,
  spending_total,
  spending_saas,
  spending_consultants,
  spending_lawyers
FROM companies
ORDER BY spending_total DESC;
```

### View Contracts
```sql
SELECT 
  cd.name,
  cd.type,
  cd.uploaded_date,
  co.name as company_name
FROM contract_documents cd
LEFT JOIN companies co ON cd.company_id = co.id
ORDER BY cd.uploaded_date DESC;
```

### Get Users by Firm
```sql
SELECT 
  u.email,
  u.name,
  u.role,
  f.name as firm_name
FROM users u
LEFT JOIN firms f ON u.firm_id = f.id;
```

### Count Vendors by Company
```sql
SELECT 
  co.name as company_name,
  COUNT(DISTINCT c.id) as consultant_count,
  COUNT(DISTINCT s.id) as saas_count,
  COUNT(DISTINCT l.id) as legal_count
FROM companies co
LEFT JOIN consultants c ON co.id = c.company_id
LEFT JOIN saas_products s ON co.id = s.company_id
LEFT JOIN legal_cases l ON co.id = l.company_id
GROUP BY co.id, co.name
ORDER BY consultant_count + saas_count + legal_count DESC;
```

### Get Total Spending by Firm
```sql
SELECT 
  f.name as firm_name,
  SUM(co.spending_total) as total_spending,
  COUNT(co.id) as company_count
FROM firms f
LEFT JOIN companies co ON f.id = co.firm_id
GROUP BY f.id, f.name
ORDER BY total_spending DESC;
```

---

## 🔧 Advanced Queries

### Organizations with Budget Breakdown
```sql
-- This would query the org_breakdown table (when added)
SELECT * FROM org_breakdowns ORDER BY total_budget DESC;
```

### Consultants with OaaS Data
```sql
SELECT 
  c.name,
  c.firm,
  c.overall_output_summary,
  c.decision_maker,
  co.name as company_name
FROM consultants c
JOIN companies co ON c.company_id = co.id
WHERE c.overall_output_summary IS NOT NULL;
```

### Contracts Expiring Soon
```sql
SELECT 
  cd.name,
  cd.expiration_date,
  co.name as company_name
FROM contract_documents cd
JOIN companies co ON cd.company_id = co.id
WHERE cd.expiration_date IS NOT NULL
  AND cd.expiration_date > CURRENT_DATE
  AND cd.expiration_date < CURRENT_DATE + INTERVAL '90 days'
ORDER BY cd.expiration_date;
```

---

## 🔐 Access Control

### Row Level Security (RLS)

Supabase uses RLS to restrict data access. To query without RLS:

1. **Use Service Role Key** (in backend code only - never expose!)
   ```javascript
   const { createClient } = require('@supabase/supabase-js');
   const supabase = createClient(
     'YOUR_URL',
     'YOUR_SERVICE_ROLE_KEY' // Bypasses RLS
   );
   ```

2. **Or Disable RLS Temporarily** (for testing only!)
   ```sql
   -- ⚠️ Only for development/testing!
   ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
   ```

3. **Check RLS Status**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

---

## 📁 Database Structure

### Tables Overview

```sql
-- View all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Table Schemas

```sql
-- View table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'companies'
ORDER BY ordinal_position;
```

---

## 🚀 Direct Database Connection (Optional)

### Method 2: PostgreSQL Client

If you want to connect directly using a PostgreSQL client:

1. **Get Connection String**
   - Go to Supabase Dashboard
   - Settings → Database
   - Scroll to "Connection string"
   - Copy "URI" format

2. **Use psql Command Line**
   ```bash
   psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

3. **Use GUI Tool**
   - **pgAdmin** (Free, open-source)
   - **TablePlus** (Mac/Windows, $99)
   - **DBeaver** (Free, cross-platform)
   - **DataGrip** (JetBrains, paid)

   Connection details:
   - **Host**: `db.[PROJECT-REF].supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **Username**: `postgres`
   - **Password**: Your database password

---

## 🔍 Useful SQL Tips

### 1. Export Data
```sql
-- Copy results to CSV (in psql)
\copy (SELECT * FROM companies) TO '/path/to/export.csv' CSV HEADER;
```

### 2. Performance Tips
```sql
-- Check query execution time
EXPLAIN ANALYZE SELECT * FROM companies;
```

### 3. View Table Sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🆓 Free Tier Limits

### Supabase Free Tier:
- ✅ **500MB** database storage
- ✅ **1GB** file storage
- ✅ **2GB** bandwidth
- ✅ **50MB** database size limit per backup
- ✅ Full SQL access ✅
- ✅ Unlimited queries ✅

### SQL Queries:
- ✅ **Unlimited queries** (no limit!)
- ✅ **All PostgreSQL features** available
- ✅ **Full SQL syntax** supported
- ✅ **Stored procedures** allowed
- ✅ **Triggers** allowed
- ✅ **Functions** allowed

**No query limits on free tier!** 🎉

---

## 📚 SQL Resources

### Learn PostgreSQL:
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Supabase SQL Editor Docs](https://supabase.com/docs/guides/database)

### Common Patterns:
```sql
-- Aggregations
SELECT 
  COUNT(*) as total,
  SUM(monthly_cost) as total_cost,
  AVG(monthly_cost) as avg_cost
FROM consultants;

-- Grouping
SELECT 
  status,
  COUNT(*) as count,
  SUM(monthly_cost) as total
FROM consultants
GROUP BY status;

-- Joins
SELECT 
  co.name as company,
  c.name as consultant,
  c.monthly_cost
FROM companies co
JOIN consultants c ON co.id = c.company_id;
```

---

## 🎯 Quick Start

1. **Go to Supabase Dashboard**
2. **Click SQL Editor**
3. **Paste a query** (like examples above)
4. **Click Run**
5. **View results!** ✅

**You have full SQL access on the free tier!** 🚀

