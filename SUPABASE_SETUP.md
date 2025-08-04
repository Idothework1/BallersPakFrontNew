# Supabase Migration Setup 🚀

## Environment Setup

1. **Create `.env.local` file** in your project root with:

```bash
# Supabase Configuration
SUPABASE_URL=https://younysmtbtlwgaapayaz.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database URLs
DATABASE_URL=postgresql://postgres:jEcArMSJgoojCuDZ@db.younysmtbtlwgaapayaz.supabase.co:5432/postgres
DATABASE_URL_POOLED=postgresql://postgres.younysmtbtlwgaapayaz:jEcArMSJgoojCuDZ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# Use the direct connection for migrations and the pooled for application
POSTGRES_URL=postgresql://postgres:jEcArMSJgoojCuDZ@db.younysmtbtlwgaapayaz.supabase.co:5432/postgres
POSTGRES_URL_NON_POOLING=postgresql://postgres:jEcArMSJgoojCuDZ@db.younysmtbtlwgaapayaz.supabase.co:5432/postgres

# Stripe Configuration (if you have these)
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## Migration Process

### Step 1: Test Connection
```bash
npx tsx scripts/test-supabase-connection.ts
```

### Step 2: Run Migration
```bash
npx tsx scripts/migrate-to-supabase.ts
```

### Step 3: Switch Application to Supabase
```bash
npx tsx scripts/switch-to-supabase.ts
```

### Step 2: What the Migration Does

1. **Creates Tables**:
   - `signups` - All player data with proper PostgreSQL types
   - `admin_users` - Staff accounts (controllers, ambassadors, admins)

2. **Migrates Data**:
   - Reads from your existing CSV files
   - Converts to PostgreSQL format
   - Inserts into Supabase tables

3. **Adds Indexes**:
   - Email, status, assignments for fast queries
   - Username, role for admin lookups

4. **Sets Up Triggers**:
   - Auto-update timestamps
   - Data validation

### Step 3: Database Schema

#### Signups Table
```sql
CREATE TABLE signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  plan_type VARCHAR(50) NOT NULL DEFAULT 'free',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'n/a',
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  full_name VARCHAR(511),
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'waitlisted',
  -- ... more fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Admin Users Table
```sql
CREATE TABLE admin_users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'controller', 'ambassador')),
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Files Created

1. **`lib/supabase.ts`** - Database connection and types
2. **`lib/supabase-manager.ts`** - Data management functions
3. **`scripts/migrate-to-supabase.ts`** - Migration script

## Migration Commands

### 1. Test Database Connection
```bash
npx tsx scripts/test-supabase-connection.ts
```
This verifies your database connection is working.

### 2. Migrate Data
```bash
npx tsx scripts/migrate-to-supabase.ts
```
This creates tables and migrates all your CSV data to Supabase.

### 3. Switch Application
```bash
npx tsx scripts/switch-to-supabase.ts
```
This updates all your API routes to use Supabase instead of CSV.

### 4. Test Application
```bash
npm run dev
```
Test all functionality to ensure everything works with Supabase.

## Switching Back to CSV

If you need to switch back to CSV:
1. Set `USE_SUPABASE=false` in your `.env.local` file
2. Restart your application

## Next Steps

After successful migration:

1. **✅ Database Connection** - Tested and working
2. **✅ Data Migration** - All CSV data moved to Supabase  
3. **✅ Application Switch** - API routes updated automatically
4. **✅ Testing** - Verify all features work with Supabase
5. **🔄 Backup** - Keep CSV files as backup (optional cleanup later)

## Benefits of Supabase

✅ **Real-time Updates** - Instant data synchronization  
✅ **Better Performance** - PostgreSQL indexes and queries  
✅ **Scalability** - Handles thousands of users  
✅ **Data Integrity** - ACID transactions and constraints  
✅ **Advanced Queries** - Complex filtering and aggregation  
✅ **Built-in Auth** - User authentication system  
✅ **Row Level Security** - Secure data access  

## Troubleshooting

If migration fails:
1. Check database connection string
2. Verify Supabase project is active
3. Check for duplicate emails in CSV data
4. Review console output for specific errors

The migration script will skip existing records, so it's safe to run multiple times.