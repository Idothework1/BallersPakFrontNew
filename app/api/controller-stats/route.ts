import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";

// Verify controller session
async function verifyControllerSession(request: NextRequest): Promise<string | null> {
  const sessionCookie = request.cookies.get('admin-session');
  if (!sessionCookie) return null;

  try {
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    return sessionData.role === 'controller' && sessionData.exp > Date.now() ? sessionData.id : null;
  } catch {
    return null;
  }
}

async function getSignupsData() {
  const dataDir = path.join(process.cwd(), "data");
  const xlsxPath = path.join(dataDir, "signups.xlsx");
  
  try {
    await fs.access(xlsxPath);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(xlsxPath);
    const worksheet = workbook.getWorksheet("Signups") ?? workbook.worksheets[0];
    
    if (!worksheet || worksheet.rowCount <= 1) return [];
    
    const headers = (worksheet.getRow(1).values as string[]).slice(1);
    const rows = worksheet.getRows(2, worksheet.rowCount - 1) ?? [];
    
    return rows.map((row) => {
      const values = row.values as (string | number | undefined)[];
      const obj: Record<string, string> = {};
      headers.forEach((header, idx) => {
        obj[header] = String(values[idx + 1] ?? "");
      });
      return obj;
    });
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const controllerId = await verifyControllerSession(request);
    if (!controllerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`📊 Loading stats for controller: ${controllerId}`);

    // Get all signups data
    const allSignups = await getSignupsData();
    console.log(`📊 Total signups found: ${allSignups.length}`);
    
    // Filter for users assigned to this controller
    const assignedUsers = allSignups
      .filter(signup => {
        const isAssigned = signup.assignedTo === controllerId;
        if (isAssigned) {
          console.log(`📊 Found assigned user: ${signup.email} (status: ${signup.status})`);
        }
        return isAssigned;
      })
      .map(signup => ({
        id: signup.email, // Use email as ID for now
        firstName: signup.firstName || '',
        lastName: signup.lastName || '',
        email: signup.email || '',
        phone: signup.phone || '',
        location: signup.location || '',
        experienceLevel: signup.experienceLevel || '',
        goal: signup.goal || '',
        timestamp: signup.timestamp || '',
        status: signup.status === 'approved' ? 'approved' : 
               signup.status === 'rejected' ? 'rejected' : 'assigned'
      }));

    console.log(`📊 Assigned users after filtering: ${assignedUsers.length}`);

    // If no assigned users, show some waitlisted users for testing purposes
    if (assignedUsers.length === 0) {
      console.log(`📊 No assigned users found, showing waitlisted users for testing`);
      const waitlistedUsers = allSignups
        .filter(signup => signup.status === 'waitlisted' && signup.planType === 'free')
        .slice(0, 10) // Show first 10 for testing
        .map(signup => ({
          id: signup.email,
          firstName: signup.firstName || '',
          lastName: signup.lastName || '',
          email: signup.email || '',
          phone: signup.phone || '',
          location: signup.location || '',
          experienceLevel: signup.experienceLevel || '',
          goal: signup.goal || '',
          timestamp: signup.timestamp || '',
          status: 'assigned' as const // Show as assigned for testing
        }));
      
      assignedUsers.push(...waitlistedUsers);
      console.log(`📊 Added ${waitlistedUsers.length} waitlisted users for testing`);
    }

    // Calculate stats
    const totalAssigned = assignedUsers.length;
    const approved = assignedUsers.filter(user => user.status === 'approved').length;
    const rejected = assignedUsers.filter(user => user.status === 'rejected').length;
    const pending = assignedUsers.filter(user => user.status === 'assigned').length;
    const successRate = totalAssigned > 0 ? Math.round((approved / totalAssigned) * 100) : 0;

    console.log(`📊 Final stats:`, {
      totalAssigned,
      approved,
      rejected,
      pending,
      successRate
    });

    return NextResponse.json({
      assignedUsers,
      stats: {
        totalAssigned,
        approved,
        rejected,
        pending,
        successRate
      }
    });

  } catch (error) {
    console.error("Error fetching controller stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 