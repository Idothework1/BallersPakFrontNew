import { createClient } from '@supabase/supabase-js'
import { Pool } from 'pg'

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://younysmtbtlwgaapayaz.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// PostgreSQL connection pool for direct database operations
const createPool = () => {
  const connectionString = process.env.DATABASE_URL_POOLED || 
    'postgresql://postgres.younysmtbtlwgaapayaz:jEcArMSJgoojCuDZ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
  
  return new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })
}

export const pool = createPool()

// Database interfaces
export interface SignupData {
  id?: string;
  timestamp: string;
  planType: string;
  paymentStatus: string;
  firstName: string;
  lastName: string;
  fullName: string;
  age?: string;
  playedBefore?: string;
  experienceLevel?: string;
  playedClub?: string;
  clubName?: string;
  gender?: string;
  hasDisability?: string;
  location?: string;
  email: string;
  phone?: string;
  position?: string;
  goal?: string;
  whyJoin?: string;
  whyJoinReason?: string;
  birthday?: string;
  status: string;
  referredBy?: string;
  assignedTo?: string;
  ambassadorId?: string;
  processedBy?: string;
  paymentId?: string;
  amount?: string;
  currency?: string;
  billing?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: 'controller' | 'ambassador' | 'admin';
  created: string;
  stats?: {
    signups?: number;
    conversions?: number;
    assignments?: number;
    completed?: number;
  };
  updated_at?: string;
}

// Helper function to execute queries
export async function executeQuery(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}