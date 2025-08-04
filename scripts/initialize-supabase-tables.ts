import { supabaseManager } from '../lib/supabase-manager';

async function initializeTables() {
  console.log('🚀 Initializing Supabase tables...');
  
  try {
    await supabaseManager.initializeTables();
    console.log('✅ Tables initialized successfully!');
    
    // Test the connection by fetching stats
    const stats = await supabaseManager.getStats();
    console.log('📊 Current database stats:', stats);
    
    // Check if default admin exists
    const adminUsers = await supabaseManager.getAdminUsers();
    const hasAdmin = adminUsers.some(u => u.role === 'admin');
    
    if (!hasAdmin) {
      console.log('⚠️  No admin user found. Creating default admin...');
      await supabaseManager.addAdminUser({
        id: `admin_${Date.now()}`,
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        created: new Date().toISOString(),
        stats: {
          signups: 0,
          conversions: 0,
          assignments: 0,
          completed: 0
        }
      });
      console.log('✅ Default admin created (username: admin, password: admin123)');
      console.log('⚠️  IMPORTANT: Change this password immediately!');
    }
    
  } catch (error) {
    console.error('❌ Error initializing tables:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeTables();
}

export { initializeTables };