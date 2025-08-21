import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

export interface SignupData {
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
}

export interface AdminUser {
  username: string;
  password: string;
  role: 'controller' | 'ambassador' | 'admin';
  id: string;
  created: string;
  stats?: {
    signups?: number;
    conversions?: number;
    assignments?: number;
    completed?: number;
  };
}

export class CSVDataManager {
  private dataDir: string;
  private signupsPath: string;
  private adminUsersPath: string;
  private mutex = new Map<string, Promise<any>>();

  constructor() {
    this.dataDir = path.join(process.cwd(), "data");
    this.signupsPath = path.join(this.dataDir, "signups.csv");
    this.adminUsersPath = path.join(this.dataDir, "admin-users.csv");
  }

  // Mutex to prevent concurrent writes
  private async withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.mutex.get(key);
    if (existing) {
      await existing;
    }
    
    const promise = fn();
    this.mutex.set(key, promise);
    
    try {
      const result = await promise;
      return result;
    } finally {
      this.mutex.delete(key);
    }
  }

  async ensureDataDir(): Promise<void> {
    await fs.mkdir(this.dataDir, { recursive: true });
  }

  // Signup Data Management
  async getSignups(): Promise<SignupData[]> {
    try {
      const content = await fs.readFile(this.signupsPath, 'utf-8');
      return parse(content, {
        columns: true,
        skip_empty_lines: true,
      }) as SignupData[];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  async saveSignups(signups: SignupData[]): Promise<void> {
    await this.withLock('signups', async () => {
      await this.ensureDataDir();
      const content = stringify(signups, {
        header: true,
        columns: [
          'timestamp', 'planType', 'paymentStatus', 'firstName', 'lastName', 
          'fullName', 'age', 'playedBefore', 'experienceLevel', 'playedClub',
          'clubName', 'gender', 'hasDisability', 'location', 'email',
          'phone', 'position', 'goal', 'whyJoin', 'whyJoinReason',
          'birthday', 'status', 'referredBy', 'assignedTo', 'ambassadorId',
          'processedBy', 'paymentId', 'amount', 'currency', 'billing'
        ]
      });
      await fs.writeFile(this.signupsPath, content, 'utf-8');
    });
  }

  async addSignup(signup: Partial<SignupData>): Promise<void> {
    const signups = await this.getSignups();
    
    // Ensure required fields have defaults
    const newSignup: SignupData = {
      timestamp: new Date().toISOString(),
      planType: 'free',
      paymentStatus: 'n/a',
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      status: 'waitlisted',
      ...signup
    };
    
    signups.push(newSignup);
    await this.saveSignups(signups);
  }

  async updateSignup(email: string, updates: Partial<SignupData>): Promise<boolean> {
    const signups = await this.getSignups();
    const index = signups.findIndex(s => s.email === email);
    
    if (index === -1) {
      return false;
    }
    
    signups[index] = { ...signups[index], ...updates };
    await this.saveSignups(signups);
    return true;
  }

  async findSignupByEmail(email: string): Promise<SignupData | null> {
    const signups = await this.getSignups();
    return signups.find(s => s.email === email) || null;
  }

  async findSignupByPaymentId(paymentId: string): Promise<SignupData | null> {
    const signups = await this.getSignups();
    return signups.find(s => s.paymentId === paymentId) || null;
  }

  async deleteSignup(email: string): Promise<boolean> {
    const signups = await this.getSignups();
    const filtered = signups.filter(s => s.email !== email);
    if (filtered.length === signups.length) {
      return false;
    }
    await this.saveSignups(filtered);
    return true;
  }

  // Admin User Management
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      const content = await fs.readFile(this.adminUsersPath, 'utf-8');
      const rows = parse(content, {
        columns: true,
        skip_empty_lines: true,
      });
      
      return rows.map((row: any) => ({
        ...row,
        stats: row.stats ? JSON.parse(row.stats) : {}
      })) as AdminUser[];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, create with default admin
        const defaultAdmins: AdminUser[] = [
          {
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            id: 'admin-default',
            created: new Date().toISOString(),
            stats: {}
          }
        ];
        await this.saveAdminUsers(defaultAdmins);
        return defaultAdmins;
      }
      throw error;
    }
  }

  async saveAdminUsers(users: AdminUser[]): Promise<void> {
    await this.withLock('admin-users', async () => {
      await this.ensureDataDir();
      const data = users.map(user => ({
        ...user,
        stats: JSON.stringify(user.stats || {})
      }));
      
      const content = stringify(data, {
        header: true,
        columns: ['username', 'password', 'role', 'id', 'created', 'stats']
      });
      
      await fs.writeFile(this.adminUsersPath, content, 'utf-8');
    });
  }

  async addAdminUser(user: AdminUser): Promise<void> {
    const users = await this.getAdminUsers();
    users.push(user);
    await this.saveAdminUsers(users);
  }

  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<boolean> {
    const users = await this.getAdminUsers();
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return false;
    }
    
    users[index] = { ...users[index], ...updates };
    await this.saveAdminUsers(users);
    return true;
  }

  async deleteAdminUser(id: string): Promise<boolean> {
    const users = await this.getAdminUsers();
    const filteredUsers = users.filter(u => u.id !== id);
    
    if (filteredUsers.length === users.length) {
      return false; // User not found
    }
    
    await this.saveAdminUsers(filteredUsers);
    return true;
  }

  async findAdminUser(username: string): Promise<AdminUser | null> {
    const users = await this.getAdminUsers();
    return users.find(u => u.username === username) || null;
  }

  // Statistics helpers
  async getStats() {
    const signups = await this.getSignups();
    const adminUsers = await this.getAdminUsers();
    
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
      
      // Count paid users
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

  // Migration helper from Excel
  async migrateFromExcel(): Promise<void> {
    try {
      // This will be implemented in a separate function
      // to handle the Excel to CSV conversion
      console.log("Migration from Excel to CSV initiated");
    } catch (error) {
      console.error("Migration error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const csvManager = new CSVDataManager();