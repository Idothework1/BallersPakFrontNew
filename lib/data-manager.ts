// Universal data manager that can switch between CSV and Supabase
import { csvManager } from './csv-data-manager'
import { supabaseManager } from './supabase-manager'

// Environment flag to switch between CSV and Supabase
const USE_SUPABASE = process.env.USE_SUPABASE === 'true'

export const dataManager = USE_SUPABASE ? supabaseManager : csvManager

// Re-export types for convenience
export type { SignupData, AdminUser } from './csv-data-manager'