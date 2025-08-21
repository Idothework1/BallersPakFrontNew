import { NextRequest, NextResponse } from "next/server";
import { dataManager } from "@/lib/data-manager";

async function updatePlayerAssignments(playerEmails: string[], assigneeId: string, assigneeType: 'controller' | 'ambassador') {
  const signups = await dataManager.getSignups();
  let updatedCount = 0;
  
  for (const email of playerEmails) {
    const player = signups.find(s => s.email === email);
    if (!player) continue;
    
    // Build updates without removing the other assignment type
    const updates: any = {};
    if (assigneeType === 'controller') {
      // Only set controller assignment; do not touch ambassador assignment
      updates.processedBy = assigneeId;
    } else if (assigneeType === 'ambassador') {
      // Only set ambassador assignment; do not touch controller assignment
      updates.assignedTo = assigneeId;
    }
    
    const updated = await dataManager.updateSignup(email, updates);
    if (updated) {
      updatedCount++;
    }
  }
  
  // Update assignee stats
  const adminUser = await dataManager.getAdminUsers().then(users => 
    users.find(u => u.id === assigneeId)
  );
  
  if (adminUser) {
    const currentStats = adminUser.stats || {};
    await dataManager.updateAdminUser(assigneeId, {
      stats: {
        ...currentStats,
        assignments: (currentStats.assignments || 0) + updatedCount
      }
    });
  }
  
  return updatedCount;
}

export async function POST(request: NextRequest) {
  try {
    const {
      playerEmails,
      assigneeId,
      assigneeType,
      controllerId,
      ambassadorId
    } = await request.json();
    
    // Normalize incoming payload to final assignee id/type
    let finalAssigneeId: string | undefined = assigneeId || controllerId || ambassadorId;
    let finalAssigneeType: 'controller' | 'ambassador' | undefined =
      controllerId ? 'controller' : ambassadorId ? 'ambassador' : undefined;
    
    // Validate inputs
    if (!playerEmails || !Array.isArray(playerEmails) || playerEmails.length === 0) {
      return NextResponse.json({ 
        error: "Player emails array is required" 
      }, { status: 400 });
    }
    
    // If type still not provided, try to infer from provided assigneeId by looking up the admin user
    if (!finalAssigneeType && finalAssigneeId) {
      const adminUsers = await dataManager.getAdminUsers();
      const found = adminUsers.find(u => u.id === finalAssigneeId);
      if (found && (found.role === 'controller' || found.role === 'ambassador')) {
        finalAssigneeType = found.role;
      }
    }
    
    if (!finalAssigneeId || !finalAssigneeType) {
      return NextResponse.json({
        error: "Provide controllerId or ambassadorId (or assigneeId with valid type)"
      }, { status: 400 });
    }
    
    // finalAssigneeType has been normalized or inferred above; validate against it
    if (!['controller', 'ambassador'].includes(finalAssigneeType)) {
      return NextResponse.json({
        error: "Assignee type must be 'controller' or 'ambassador'"
      }, { status: 400 });
    }
    
    console.log(`📋 Assigning ${playerEmails.length} players to ${finalAssigneeType} ${finalAssigneeId}`);
    
    const updatedCount = await updatePlayerAssignments(playerEmails, finalAssigneeId, finalAssigneeType);
    
    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${updatedCount} players to ${finalAssigneeType}`,
      assigned: updatedCount,
      total: playerEmails.length
    });
    
  } catch (error) {
    console.error("Error assigning players:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}