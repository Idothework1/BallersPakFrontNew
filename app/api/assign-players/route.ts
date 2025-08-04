import { NextRequest, NextResponse } from "next/server";
import { dataManager } from "@/lib/data-manager";

async function updatePlayerAssignments(playerEmails: string[], assigneeId: string, assigneeType: 'controller' | 'ambassador') {
  const signups = await dataManager.getSignups();
  let updatedCount = 0;
  
  for (const email of playerEmails) {
    const player = signups.find(s => s.email === email);
    if (!player) continue;
    
    const updates: any = {
      assignedTo: assigneeId
    };
    
    // If assigning to a controller, also update processedBy
    if (assigneeType === 'controller') {
      updates.processedBy = assigneeId;
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
    const { playerEmails, assigneeId, assigneeType } = await request.json();
    
    // Validate inputs
    if (!playerEmails || !Array.isArray(playerEmails) || playerEmails.length === 0) {
      return NextResponse.json({ 
        error: "Player emails array is required" 
      }, { status: 400 });
    }
    
    if (!assigneeId || !assigneeType) {
      return NextResponse.json({ 
        error: "Assignee ID and type are required" 
      }, { status: 400 });
    }
    
    if (!['controller', 'ambassador'].includes(assigneeType)) {
      return NextResponse.json({ 
        error: "Assignee type must be 'controller' or 'ambassador'" 
      }, { status: 400 });
    }
    
    console.log(`📋 Assigning ${playerEmails.length} players to ${assigneeType} ${assigneeId}`);
    
    const updatedCount = await updatePlayerAssignments(playerEmails, assigneeId, assigneeType);
    
    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${updatedCount} players to ${assigneeType}`,
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