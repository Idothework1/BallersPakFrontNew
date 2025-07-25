import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";

interface AdminUser {
  username: string;
  password: string;
  role: 'admin' | 'controller' | 'ambassador';
  id: string;
  created: string;
  stats?: {
    signups?: number;
    conversions?: number;
    assignments?: number;
    completed?: number;
  };
}

// Hardcoded admin credentials
const MAIN_ADMIN = {
  username: "b@ll3rsp4k",
  password: "ibrahim123",
  role: "admin" as const,
  id: "admin-main",
  created: new Date().toISOString()
};

async function getAdminUsers(): Promise<AdminUser[]> {
  const dataDir = path.join(process.cwd(), "data");
  const xlsxPath = path.join(dataDir, "admin-users.xlsx");
  
  try {
    await fs.access(xlsxPath);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(xlsxPath);
    const worksheet = workbook.getWorksheet("AdminUsers") ?? workbook.worksheets[0];
    
    if (!worksheet) return [MAIN_ADMIN];
    
    const headers = (worksheet.getRow(1).values as string[]).slice(1);
    const rows = worksheet.getRows(2, worksheet.rowCount - 1) ?? [];
    
    const users = rows.map((row) => {
      const values = row.values as (string | number | undefined)[];
      const obj: Record<string, string> = {};
      headers.forEach((header, idx) => {
        obj[header] = String(values[idx + 1] ?? "");
      });
      
      return {
        username: obj.username,
        password: obj.password,
        role: obj.role as 'admin' | 'controller' | 'ambassador',
        id: obj.id,
        created: obj.created,
        stats: obj.stats ? JSON.parse(obj.stats) : {}
      } as AdminUser;
    });
    
    return [MAIN_ADMIN, ...users];
  } catch {
    return [MAIN_ADMIN];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, action } = await request.json();

    if (action === "login") {
      if (!username || !password) {
        return NextResponse.json({ error: "Username and password required" }, { status: 400 });
      }

      const adminUsers = await getAdminUsers();
      const user = adminUsers.find(u => u.username === username && u.password === password);

      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      // Create session token (in production, use proper JWT)
      const sessionToken = Buffer.from(JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      })).toString('base64');

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        },
        dashboardUrl: user.role === 'admin' ? '/admin/dashboard' : 
                     user.role === 'controller' ? '/controller/dashboard' : 
                     '/ambassador/dashboard'
      });

      // Set cookie
      response.cookies.set('admin-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      });

      return response;
    }

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete('admin-session');
      return response;
    }

    if (action === "verify") {
      const sessionCookie = request.cookies.get('admin-session');
      if (!sessionCookie) {
        return NextResponse.json({ error: "No session" }, { status: 401 });
      }

      try {
        const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
        if (sessionData.exp < Date.now()) {
          return NextResponse.json({ error: "Session expired" }, { status: 401 });
        }

        return NextResponse.json({
          success: true,
          user: {
            id: sessionData.id,
            username: sessionData.username,
            role: sessionData.role
          }
        });
      } catch {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 