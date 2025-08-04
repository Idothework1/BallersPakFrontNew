import fs from 'fs'
import path from 'path'

// List of API routes to update
const API_ROUTES = [
  'app/api/admin-stats/route.ts',
  'app/api/admin-users/route.ts',
  'app/api/ambassador-stats/route.ts',
  'app/api/approve-player/route.ts',
  'app/api/assign-players/route.ts',
  'app/api/controller-stats/route.ts',
  'app/api/login/route.ts',
  'app/api/reject-player/route.ts',
  'app/api/signup/route.ts'
]

// Admin pages to update
const ADMIN_PAGES = [
  'app/admin/page.tsx',
  'app/admin/approved-members/page.tsx',
  'app/admin/paid-players/page.tsx',
  'app/admin/rejected-players/page.tsx'
]

function updateImports(filePath: string) {
  const fullPath = path.join(process.cwd(), filePath)
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`)
    return
  }

  let content = fs.readFileSync(fullPath, 'utf-8')
  
  // Replace CSV manager import with universal data manager
  const oldImport = 'import { csvManager } from "@/lib/csv-data-manager"'
  const newImport = 'import { dataManager } from "@/lib/data-manager"'
  
  if (content.includes(oldImport)) {
    content = content.replace(oldImport, newImport)
    
    // Replace all csvManager references with dataManager
    content = content.replace(/csvManager/g, 'dataManager')
    
    fs.writeFileSync(fullPath, content)
    console.log(`✅ Updated: ${filePath}`)
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`)
  }
}

async function switchToSupabase() {
  console.log("🔄 Switching application to use Supabase...\n")
  
  console.log("📝 Updating API routes...")
  API_ROUTES.forEach(updateImports)
  
  console.log("\n📄 Updating admin pages...")
  ADMIN_PAGES.forEach(updateImports)
  
  console.log("\n🔧 Creating environment flag...")
  
  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf-8')
    
    if (!envContent.includes('USE_SUPABASE=')) {
      envContent += '\n# Data Source Configuration\nUSE_SUPABASE=true\n'
      fs.writeFileSync(envPath, envContent)
      console.log("✅ Added USE_SUPABASE=true to .env.local")
    } else {
      // Update existing flag
      envContent = envContent.replace(/USE_SUPABASE=.*/g, 'USE_SUPABASE=true')
      fs.writeFileSync(envPath, envContent)
      console.log("✅ Updated USE_SUPABASE=true in .env.local")
    }
  } else {
    console.log("⚠️  .env.local not found. Please create it with USE_SUPABASE=true")
  }
  
  console.log("\n🎉 Switch completed!")
  console.log("\n📋 Next steps:")
  console.log("1. Ensure your .env.local has USE_SUPABASE=true")
  console.log("2. Run the migration: npx tsx scripts/migrate-to-supabase.ts")
  console.log("3. Test your application")
  console.log("4. To switch back to CSV, set USE_SUPABASE=false")
}

switchToSupabase()