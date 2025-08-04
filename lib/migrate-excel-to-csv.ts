import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";
import { csvManager, SignupData, AdminUser } from "./csv-data-manager";

export async function migrateExcelToCSV() {
  const dataDir = path.join(process.cwd(), "data");
  
  console.log("🔄 Starting Excel to CSV migration...");
  
  try {
    // Migrate signups.xlsx
    console.log("📊 Migrating signups.xlsx...");
    await migrateSignups(dataDir);
    
    // Migrate admin-users.xlsx
    console.log("👥 Migrating admin-users.xlsx...");
    await migrateAdminUsers(dataDir);
    
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

async function migrateSignups(dataDir: string) {
  const xlsxPath = path.join(dataDir, "signups.xlsx");
  
  try {
    await fs.access(xlsxPath);
  } catch {
    console.log("⚠️ signups.xlsx not found, skipping...");
    return;
  }
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);
  const worksheet = workbook.getWorksheet("Signups") ?? workbook.worksheets[0];
  
  if (!worksheet || worksheet.rowCount <= 1) {
    console.log("⚠️ No data in signups.xlsx");
    return;
  }
  
  const headers = (worksheet.getRow(1).values as string[]).slice(1);
  const rows = worksheet.getRows(2, worksheet.rowCount - 1) ?? [];
  
  const signups: SignupData[] = [];
  
  for (const row of rows) {
    const values = row.values as (string | number | undefined)[];
    const signup: Record<string, string> = {};
    
    headers.forEach((header, idx) => {
      const value = values[idx + 1];
      signup[header] = value !== undefined && value !== null ? String(value) : "";
    });
    
    // Skip empty rows
    if (!signup.email) continue;
    
    signups.push({
      timestamp: signup.timestamp || new Date().toISOString(),
      planType: signup.planType || "free",
      paymentStatus: signup.paymentStatus || "n/a",
      firstName: signup.firstName || "",
      lastName: signup.lastName || "",
      fullName: signup.fullName || "",
      age: signup.age || "",
      playedBefore: signup.playedBefore || "",
      experienceLevel: signup.experienceLevel || signup.currentLevel || "",
      playedClub: signup.playedClub || "",
      clubName: signup.clubName || "",
      gender: signup.gender || "",
      hasDisability: signup.hasDisability || "",
      location: signup.location || "",
      email: signup.email || "",
      phone: signup.phone || "",
      position: signup.position || "",
      goal: signup.goal || "",
      whyJoin: signup.whyJoin || "",
      whyJoinReason: signup.whyJoinReason || "",
      birthday: signup.birthday || "",
      status: signup.status || "waitlisted",
      referredBy: signup.referredBy || "",
      assignedTo: signup.assignedTo || "",
      ambassadorId: signup.ambassadorId || "",
      processedBy: signup.processedBy || "",
      paymentId: signup.paymentId || "",
      amount: signup.amount || "",
      currency: signup.currency || "",
      billing: signup.billing || ""
    } as SignupData);
  }
  
  // Save to CSV
  await csvManager.saveSignups(signups);
  console.log(`✅ Migrated ${signups.length} signups to CSV`);
  
  // Create backup
  const backupPath = path.join(dataDir, `signups_excel_backup_${Date.now()}.xlsx`);
  await fs.rename(xlsxPath, backupPath);
  console.log(`📦 Created backup: ${backupPath}`);
}

async function migrateAdminUsers(dataDir: string) {
  const xlsxPath = path.join(dataDir, "admin-users.xlsx");
  
  try {
    await fs.access(xlsxPath);
  } catch {
    console.log("⚠️ admin-users.xlsx not found, creating default admin...");
    const defaultAdmin: AdminUser = {
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      id: 'admin-default',
      created: new Date().toISOString(),
      stats: {}
    };
    await csvManager.addAdminUser(defaultAdmin);
    return;
  }
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);
  const worksheet = workbook.getWorksheet("AdminUsers") ?? workbook.worksheets[0];
  
  if (!worksheet || worksheet.rowCount <= 1) {
    console.log("⚠️ No data in admin-users.xlsx");
    return;
  }
  
  const headers = (worksheet.getRow(1).values as string[]).slice(1);
  const rows = worksheet.getRows(2, worksheet.rowCount - 1) ?? [];
  
  const adminUsers: AdminUser[] = [];
  
  for (const row of rows) {
    const values = row.values as (string | number | undefined)[];
    const user: Record<string, string> = {};
    
    headers.forEach((header, idx) => {
      const value = values[idx + 1];
      user[header] = value !== undefined && value !== null ? String(value) : "";
    });
    
    // Skip empty rows
    if (!user.username) continue;
    
    let stats = {};
    try {
      stats = user.stats ? JSON.parse(user.stats) : {};
    } catch {
      stats = {};
    }
    
    adminUsers.push({
      username: user.username,
      password: user.password,
      role: user.role as 'controller' | 'ambassador' | 'admin',
      id: user.id,
      created: user.created || new Date().toISOString(),
      stats
    });
  }
  
  // Save to CSV
  await csvManager.saveAdminUsers(adminUsers);
  console.log(`✅ Migrated ${adminUsers.length} admin users to CSV`);
  
  // Create backup
  const backupPath = path.join(dataDir, `admin-users_excel_backup_${Date.now()}.xlsx`);
  await fs.rename(xlsxPath, backupPath);
  console.log(`📦 Created backup: ${backupPath}`);
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateExcelToCSV().catch(console.error);
}