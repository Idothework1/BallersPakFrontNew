import { NextRequest, NextResponse } from "next/server";
import { dataManager } from "@/lib/data-manager";

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

    const users = await dataManager.getAdminUsers();
    
    // Filter out admin role for security, but include passwords for staff management
    const filteredUsers = users.filter(u => u.role !== 'admin').map(u => ({
      id: u.id,
      username: u.username,
      password: u.password, // Include password for admin management
      role: u.role,
      created: u.created,
      stats: u.stats
    }));

    return NextResponse.json({ users: filteredUsers });

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
    const existingUser = await dataManager.findAdminUser(username);
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const newUser = {
      username,
      password,
      role: role as 'controller' | 'ambassador',
      id: `${role}-${Date.now()}`,
      created: new Date().toISOString(),
      stats: {
        signups: 0,
        conversions: 0,
        assignments: 0,
        completed: 0
      }
    };

    await dataManager.addAdminUser(newUser);

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

    const deleted = await dataManager.deleteAdminUser(userId);

    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting admin user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}