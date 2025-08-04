// Universal data manager that can switch between CSV and Supabase
import { csvManager } from './csv-data-manager'
import { supabaseManager } from './supabase-manager'

// Environment flag to switch between CSV and Supabase
// Force Supabase in production environments
const USE_SUPABASE = process.env.USE_SUPABASE === 'true' || 
                     process.env.NODE_ENV === 'production' ||
                     process.env.VERCEL === '1'

export const dataManager = USE_SUPABASE ? supabaseManager : csvManager

// Log which data manager is being used
if (typeof window === 'undefined') {
  console.log(`📊 Using ${USE_SUPABASE ? 'Supabase' : 'CSV'} data manager (NODE_ENV: ${process.env.NODE_ENV}, VERCEL: ${process.env.VERCEL})`);
}

// Re-export types for convenience
export type { SignupData, AdminUser } from './csv-data-manager'