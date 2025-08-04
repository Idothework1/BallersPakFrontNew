import { Pool } from 'pg'
import { SignupData, AdminUser } from './supabase'

// Create PostgreSQL pool for database operations
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_POOLED || 
    'postgresql://postgres.younysmtbtlwgaapayaz:jEcArMSJgoojCuDZ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  }
})

// Helper function to execute queries
async function executeQuery(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export class SupabaseDataManager {
  private initialized = false;
  
  // Ensure tables are initialized before any operation
  private async ensureInitialized() {
    if (!this.initialized) {
      try {
        await this.initializeTables();
        this.initialized = true;
        console.log('✅ Supabase tables initialized');
      } catch (error) {
        console.error('❌ Failed to initialize Supabase tables:', error);
        throw error;
      }
    }
  }
  // Initialize database tables
  async initializeTables(): Promise<void> {
    // Create signups table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS signups (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        plan_type VARCHAR(50) NOT NULL DEFAULT 'free',
        payment_status VARCHAR(50) NOT NULL DEFAULT 'n/a',
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        full_name VARCHAR(511),
        age VARCHAR(10),
        played_before VARCHAR(10),
        experience_level VARCHAR(50),
        played_club VARCHAR(10),
        club_name VARCHAR(255),
        gender VARCHAR(20),
        has_disability VARCHAR(10),
        location VARCHAR(255),
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(50),
        position VARCHAR(100),
        goal VARCHAR(255),
        why_join VARCHAR(255),
        why_join_reason TEXT,
        birthday DATE,
        status VARCHAR(50) NOT NULL DEFAULT 'waitlisted',
        referred_by VARCHAR(255),
        assigned_to VARCHAR(255),
        ambassador_id VARCHAR(255),
        processed_by VARCHAR(255),
        payment_id VARCHAR(255),
        amount DECIMAL(10,2),
        currency VARCHAR(10),
        billing VARCHAR(50),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_signups_email ON signups(email);
      CREATE INDEX IF NOT EXISTS idx_signups_status ON signups(status);
      CREATE INDEX IF NOT EXISTS idx_signups_assigned_to ON signups(assigned_to);
      CREATE INDEX IF NOT EXISTS idx_signups_ambassador_id ON signups(ambassador_id);
      CREATE INDEX IF NOT EXISTS idx_signups_referred_by ON signups(referred_by);
    `)

    // Create admin_users table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'controller', 'ambassador')),
        stats JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
      CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
    `)

    // Create update triggers
    await executeQuery(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
      
      DROP TRIGGER IF EXISTS update_signups_updated_at ON signups;
      CREATE TRIGGER update_signups_updated_at BEFORE UPDATE ON signups
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
      DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
      CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `)
  }

  // Signup Data Management
  async getSignups(): Promise<SignupData[]> {
    await this.ensureInitialized();
    const result = await executeQuery('SELECT * FROM signups ORDER BY created_at DESC')
    return result.rows.map(this.mapSignupFromDB)
  }

  async addSignup(signup: Partial<SignupData>): Promise<SignupData> {
    await this.ensureInitialized();
    const {
      timestamp, planType, paymentStatus, firstName, lastName, fullName,
      age, playedBefore, experienceLevel, playedClub, clubName, gender,
      hasDisability, location, email, phone, position, goal, whyJoin,
      whyJoinReason, birthday, status, referredBy, assignedTo,
      ambassadorId, processedBy, paymentId, amount, currency, billing
    } = signup

    // Handle empty strings for numeric fields
    const cleanAmount = amount && amount.trim() !== '' ? parseFloat(amount) : null

    const result = await executeQuery(`
      INSERT INTO signups (
        timestamp, plan_type, payment_status, first_name, last_name, full_name,
        age, played_before, experience_level, played_club, club_name, gender,
        has_disability, location, email, phone, position, goal, why_join,
        why_join_reason, birthday, status, referred_by, assigned_to,
        ambassador_id, processed_by, payment_id, amount, currency, billing
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
      ) RETURNING *
    `, [
      timestamp || new Date().toISOString(),
      planType || 'free',
      paymentStatus || 'n/a',
      firstName, lastName, fullName, age, playedBefore, experienceLevel,
      playedClub, clubName, gender, hasDisability, location, email, phone,
      position, goal, whyJoin, whyJoinReason, birthday,
      status || 'waitlisted',
      referredBy, assignedTo, ambassadorId, processedBy, paymentId,
      cleanAmount, currency, billing
    ])

    return this.mapSignupFromDB(result.rows[0])
  }

  async updateSignup(email: string, updates: Partial<SignupData>): Promise<boolean> {
    const setClause = Object.keys(updates)
      .filter(key => key !== 'email' && updates[key as keyof SignupData] !== undefined)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ')

    if (!setClause) return false

    const values = Object.keys(updates)
      .filter(key => key !== 'email' && updates[key as keyof SignupData] !== undefined)
      .map(key => updates[key as keyof SignupData])

    const result = await executeQuery(
      `UPDATE signups SET ${setClause} WHERE email = $1`,
      [email, ...values]
    )

    return (result.rowCount ?? 0) > 0
  }

  async findSignupByEmail(email: string): Promise<SignupData | null> {
    await this.ensureInitialized();
    const result = await executeQuery('SELECT * FROM signups WHERE email = $1', [email])
    return result.rows.length > 0 ? this.mapSignupFromDB(result.rows[0]) : null
  }

  async findSignupByPaymentId(paymentId: string): Promise<SignupData | null> {
    const result = await executeQuery('SELECT * FROM signups WHERE payment_id = $1', [paymentId])
    return result.rows.length > 0 ? this.mapSignupFromDB(result.rows[0]) : null
  }

  // Admin User Management
  async getAdminUsers(): Promise<AdminUser[]> {
    await this.ensureInitialized();
    const result = await executeQuery('SELECT * FROM admin_users ORDER BY created_at')
    return result.rows.map(this.mapAdminUserFromDB)
  }

  async addAdminUser(user: AdminUser): Promise<void> {
    await this.ensureInitialized();
    await executeQuery(`
      INSERT INTO admin_users (id, username, password, role, stats)
      VALUES ($1, $2, $3, $4, $5)
    `, [user.id, user.username, user.password, user.role, JSON.stringify(user.stats || {})])
  }

  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<boolean> {
    const setClause = Object.keys(updates)
      .filter(key => key !== 'id' && updates[key as keyof AdminUser] !== undefined)
      .map((key, index) => {
        if (key === 'stats') {
          return `stats = $${index + 2}`
        }
        return `${key} = $${index + 2}`
      })
      .join(', ')

    if (!setClause) return false

    const values = Object.keys(updates)
      .filter(key => key !== 'id' && updates[key as keyof AdminUser] !== undefined)
      .map(key => {
        if (key === 'stats') {
          return JSON.stringify(updates[key as keyof AdminUser])
        }
        return updates[key as keyof AdminUser]
      })

    const result = await executeQuery(
      `UPDATE admin_users SET ${setClause} WHERE id = $1`,
      [id, ...values]
    )

    return (result.rowCount ?? 0) > 0
  }

  async deleteAdminUser(id: string): Promise<boolean> {
    const result = await executeQuery('DELETE FROM admin_users WHERE id = $1', [id])
    return (result.rowCount ?? 0) > 0
  }

  async findAdminUser(username: string): Promise<AdminUser | null> {
    await this.ensureInitialized();
    const result = await executeQuery('SELECT * FROM admin_users WHERE username = $1', [username])
    return result.rows.length > 0 ? this.mapAdminUserFromDB(result.rows[0]) : null
  }

  // Helper methods to map database rows to interfaces
  private mapSignupFromDB(row: any): SignupData {
    return {
      timestamp: row.timestamp,
      planType: row.plan_type,
      paymentStatus: row.payment_status,
      firstName: row.first_name,
      lastName: row.last_name,
      fullName: row.full_name,
      age: row.age,
      playedBefore: row.played_before,
      experienceLevel: row.experience_level,
      playedClub: row.played_club,
      clubName: row.club_name,
      gender: row.gender,
      hasDisability: row.has_disability,
      location: row.location,
      email: row.email,
      phone: row.phone,
      position: row.position,
      goal: row.goal,
      whyJoin: row.why_join,
      whyJoinReason: row.why_join_reason,
      birthday: row.birthday,
      status: row.status,
      referredBy: row.referred_by,
      assignedTo: row.assigned_to,
      ambassadorId: row.ambassador_id,
      processedBy: row.processed_by,
      paymentId: row.payment_id,
      amount: row.amount,
      currency: row.currency,
      billing: row.billing
    }
  }

  private mapAdminUserFromDB(row: any): AdminUser {
    return {
      id: row.id,
      username: row.username,
      password: row.password,
      role: row.role,
      created: row.created_at,
      stats: row.stats || {}
    }
  }

  // Statistics helper
  async getStats() {
    const signups = await this.getSignups()
    const adminUsers = await this.getAdminUsers()
    
    let totalSignups = signups.length;
    let waitlistedUsers = 0;
    let approvedUsers = 0;
    let premiumUsers = 0;
    let paidUsers = 0;
    let ambassadorReferrals = 0;
    let controllerAssignments = 0;
    
    signups.forEach(signup => {
      const planType = signup.planType?.toLowerCase() || 'free';
      const status = signup.status?.toLowerCase() || 'waitlisted';
      const paymentStatus = signup.paymentStatus?.toLowerCase() || 'n/a';
      
      if (paymentStatus === 'paid' || paymentStatus === 'subscription') {
        paidUsers++;
      }
      
      if (planType === 'elite' || planType === 'pro' || planType === 'premium' || planType === 'paid') {
        premiumUsers++;
      }
      
      if (planType === 'free' && (status === 'waitlisted' || status === 'pending')) {
        waitlistedUsers++;
      }
      
      if (planType === 'free' && status === 'approved') {
        approvedUsers++;
      }
      
      if (signup.referredBy || signup.ambassadorId) {
        ambassadorReferrals++;
      }
      
      if (signup.processedBy) {
        controllerAssignments++;
      }
    });
    
    const totalControllers = adminUsers.filter(u => u.role === 'controller').length;
    const totalAmbassadors = adminUsers.filter(u => u.role === 'ambassador').length;
    
    return {
      totalSignups,
      waitlistedUsers,
      approvedUsers,
      premiumUsers,
      paidUsers,
      ambassadorReferrals,
      controllerAssignments,
      totalControllers,
      totalAmbassadors
    };
  }
}

// Export singleton instance
export const supabaseManager = new SupabaseDataManager()