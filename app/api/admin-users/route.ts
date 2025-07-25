import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";

interface AdminUser {
  username: string;
  password: string;
  role: 'controller' | 'ambassador';
  id: string;
  created: string;
  stats?: {
    signups?: number;
    conversions?: number;
    assignments?: number;
    completed?: number;
  };
}

async function ensureAdminUsersFile() {
  const dataDir = path.join(process.cwd(), "data");
  const xlsxPath = path.join(dataDir, "admin-users.xlsx");

  try {
    await fs.access(xlsxPath);
  } catch {
    // Create new file
    await fs.mkdir(dataDir, { recursive: true });
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("AdminUsers");
    
    const headers = ["username", "password", "role", "id", "created", "stats"];
    worksheet.columns = headers.map((h) => ({ header: h, key: h, width: 20 }));
    
    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" },
    };
    
    await workbook.xlsx.writeFile(xlsxPath);
  }
  return xlsxPath;
}

async function getAdminUsers(): Promise<AdminUser[]> {
  const xlsxPath = await ensureAdminUsersFile();
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);
  const worksheet = workbook.getWorksheet("AdminUsers") ?? workbook.worksheets[0];
  
  if (!worksheet || worksheet.rowCount <= 1) return [];
  
  const headers = (worksheet.getRow(1).values as string[]).slice(1);
  const rows = worksheet.getRows(2, worksheet.rowCount - 1) ?? [];
  
  return rows.map((row) => {
    const values = row.values as (string | number | undefined)[];
    const obj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      obj[header] = String(values[idx + 1] ?? "");
    });
    
    return {
      username: obj.username,
      password: obj.password,
      role: obj.role as 'controller' | 'ambassador',
      id: obj.id,
      created: obj.created,
      stats: obj.stats ? JSON.parse(obj.stats) : {}
    } as AdminUser;
  });
}

async function saveAdminUser(user: AdminUser): Promise<void> {
  const xlsxPath = await ensureAdminUsersFile();
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);
  const worksheet = workbook.getWorksheet("AdminUsers") ?? workbook.worksheets[0];
  
  const newRow = worksheet.addRow([
    user.username,
    user.password,
    user.role,
    user.id,
    user.created,
    JSON.stringify(user.stats || {})
  ]);
  
  await workbook.xlsx.writeFile(xlsxPath);
}

async function deleteAdminUser(userId: string): Promise<boolean> {
  const xlsxPath = await ensureAdminUsersFile();
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);
  const worksheet = workbook.getWorksheet("AdminUsers") ?? workbook.worksheets[0];
  
  const headers = (worksheet.getRow(1).values as string[]).slice(1);
  const idColumnIndex = headers.indexOf("id") + 1;
  
  if (idColumnIndex === 0) return false;
  
  let found = false;
  for (let i = worksheet.rowCount; i >= 2; i--) {
    const row = worksheet.getRow(i);
    if (row.getCell(idColumnIndex).value === userId) {
      worksheet.spliceRows(i, 1);
      found = true;
      break;
    }
  }
  
  if (found) {
    await workbook.xlsx.writeFile(xlsxPath);
  }
  
  return found;
}

// Verify admin session
async function verifyAdminSession(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get('admin-session');
  if (!sessionCookie) return false;

  try {
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    return sessionData.role === 'admin' && sessionData.exp > Date.now();
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await getAdminUsers();
    return NextResponse.json({ users });

  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, password, role } = await request.json();

    if (!username || !password || !role) {
      return NextResponse.json({ error: "Username, password, and role are required" }, { status: 400 });
    }

    if (!['controller', 'ambassador'].includes(role)) {
      return NextResponse.json({ error: "Role must be controller or ambassador" }, { status: 400 });
    }

    // Check if username already exists
    const existingUsers = await getAdminUsers();
    if (existingUsers.some(u => u.username === username)) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const newUser: AdminUser = {
      username,
      password,
      role,
      id: `${role}-${Date.now()}`,
      created: new Date().toISOString(),
      stats: {
        signups: 0,
        conversions: 0,
        assignments: 0,
        completed: 0
      }
    };

    await saveAdminUser(newUser);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        created: newUser.created
      }
    });

  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const deleted = await deleteAdminUser(userId);

    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting admin user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 