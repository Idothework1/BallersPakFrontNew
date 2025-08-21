import { NextRequest, NextResponse } from "next/server";
import { dataManager } from "@/lib/data-manager";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  try {
    const controllerId = await verifyControllerSession(request);
    if (!controllerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`📊 Loading stats for controller: ${controllerId}`);

    // Get all signups data
    const allSignups = await dataManager.getSignups();
    console.log(`📊 Total signups found: ${allSignups.length}`);
    
    // Filter for users assigned to this controller (processedBy)
    const assignedUsers = allSignups
      .filter(signup => {
        const isAssigned = signup.processedBy === controllerId;
        if (isAssigned) {
          console.log(`📊 Found assigned user: ${signup.email} (status: ${signup.status})`);
        }
        return isAssigned;
      })
      .map(signup => ({
        id: signup.email, // Use email as ID for CSV
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

    // No testing fallback; only show truly assigned users

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