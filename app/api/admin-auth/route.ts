import { NextRequest, NextResponse } from "next/server";
import { csvManager } from "@/lib/csv-data-manager";

// Hardcoded main admin credentials
const MAIN_ADMIN = {
  username: "b@ll3rsp4k",
  password: "ibrahim123",
  role: "admin" as const,
  id: "admin-main",
  created: new Date().toISOString()
};

export async function POST(request: NextRequest) {
  try {
    const { username, password, action } = await request.json();

    if (action === "login") {
      if (!username || !password) {
        return NextResponse.json({ error: "Username and password required" }, { status: 400 });
      }

      // Check hardcoded admin first
      if (username === MAIN_ADMIN.username && password === MAIN_ADMIN.password) {
        const sessionToken = Buffer.from(JSON.stringify({
          id: MAIN_ADMIN.id,
          username: MAIN_ADMIN.username,
          role: MAIN_ADMIN.role,
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        })).toString('base64');

        const response = NextResponse.json({
          success: true,
          user: {
            id: MAIN_ADMIN.id,
            username: MAIN_ADMIN.username,
            role: MAIN_ADMIN.role
          },
          dashboardUrl: '/admin/dashboard'
        });

        response.cookies.set('admin-session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 // 24 hours
        });

        return response;
      }

      // Check CSV admin users
      const adminUsers = await csvManager.getAdminUsers();
      const user = adminUsers.find(u => u.username === username && u.password === password);

      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      // Create session token
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