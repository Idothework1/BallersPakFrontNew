import { Pool } from 'pg'

// Create a direct pool connection for testing
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_POOLED || 
    'postgresql://postgres.younysmtbtlwgaapayaz:jEcArMSJgoojCuDZ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  }
})

async function testConnection() {
  console.log("🔌 Testing Supabase connection...\n")
  
  try {
    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time, version() as postgres_version')
    
    console.log("✅ Connection successful!")
    console.log(`📅 Current time: ${result.rows[0].current_time}`)
    console.log(`🐘 PostgreSQL version: ${result.rows[0].postgres_version}`)
    
    // Test table existence
    const tables = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('signups', 'admin_users')
    `)
    
    console.log(`\n📋 Tables found: ${tables.rows.length}`)
    tables.rows.forEach(row => {
      console.log(`   - ${row.tablename}`)
    })
    
    if (tables.rows.length === 0) {
      console.log("\n⚠️  No tables found. Run the migration script first:")
      console.log("   npx tsx scripts/migrate-to-supabase.ts")
    } else if (tables.rows.length === 2) {
      // Test data counts
      const signupsCount = await pool.query('SELECT COUNT(*) FROM signups')
      const usersCount = await pool.query('SELECT COUNT(*) FROM admin_users')
      
      console.log(`\n📊 Data counts:`)
      console.log(`   Signups: ${signupsCount.rows[0].count}`)
      console.log(`   Admin Users: ${usersCount.rows[0].count}`)
    }
    
    console.log("\n🎉 Supabase is ready to use!")
    
  } catch (error) {
    console.error("❌ Connection failed:", error)
    console.log("\n🔧 Troubleshooting:")
    console.log("1. Check your .env.local file exists")
    console.log("2. Verify the DATABASE_URL is correct")
    console.log("3. Ensure your Supabase project is active")
    console.log("4. Check if your IP is whitelisted in Supabase")
  } finally {
    await pool.end()
    process.exit(0)
  }
}

testConnection()