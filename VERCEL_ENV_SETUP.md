# Vercel Environment Variables Setup

## Required Environment Variables

You need to add these environment variables to your Vercel project:

### 1. Go to your Vercel Dashboard
1. Navigate to your project
2. Go to "Settings" tab
3. Click on "Environment Variables"

### 2. Add the following variables:

#### Supabase Configuration:
```
USE_SUPABASE=true
NEXT_PUBLIC_SUPABASE_URL=https://younysmtbtlwgaapayaz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdW55c210YnRsd2dhYXBheWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzQyODYsImV4cCI6MjA2OTkxMDI4Nn0.ULkA2J9beXRj2NuNKBqngYZRCmVm54bTBAIVclxgkFU
DATABASE_URL_POOLED=postgresql://postgres.younysmtbtlwgaapayaz:jEcArMSJgoojCuDZ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

#### Stripe Configuration (REQUIRED):
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

#### App Configuration:
```
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

### 3. Important Notes:

- Make sure to add these to all environments (Production, Preview, Development)
- After adding, redeploy your project for changes to take effect

### 4. Verify Setup

After deployment, your app should:
- Automatically use Supabase in production (we've updated the code to force this)
- Show "Using Supabase data manager" in the Vercel function logs
- Successfully create accounts without "Internal server error"

### 5. Database Initialization

The Supabase tables will be automatically created on first use. The code includes:
- `signups` table for player registrations
- `admin_users` table for staff accounts

### 6. Troubleshooting

If you still get errors after adding these variables:
1. Check Vercel function logs for specific error messages
2. Ensure the Supabase project is active and not paused
3. Verify the connection string is correct