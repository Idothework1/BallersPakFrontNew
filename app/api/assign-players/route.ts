import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";

async function verifyAdminSession(request: NextRequest): Promise<boolean> {
  try {
    const sessionCookie = request.cookies.get('admin-session');
    if (!sessionCookie) return false;

    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    return sessionData.exp > Date.now() && sessionData.role === 'admin';
  } catch {
    return false;
  }
}

async function updatePlayerAssignments(playerEmails: string[], assigneeId: string, assigneeType: 'controller' | 'ambassador') {
  const dataDir = path.join(process.cwd(), "data");
  const xlsxPath = path.join(dataDir, "signups.xlsx");

  try {
    await fs.access(xlsxPath);
  } catch {
    throw new Error("Signups file not found");
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);
  const worksheet = workbook.getWorksheet("Signups") ?? workbook.worksheets[0];

  if (!worksheet) {
    throw new Error("Worksheet not found");
  }

  // Get headers and find column indices
  const headers = (worksheet.getRow(1).values as string[]).slice(1);
  const emailColumnIndex = headers.indexOf("email") + 1;
  
  // Use the correct assignment column based on type
  const columnName = assigneeType === 'controller' ? 'assignedToController' : 'assignedTo';
  let assignmentColumnIndex = headers.indexOf(columnName) + 1;

  if (emailColumnIndex === 0) {
    throw new Error("Email column not found");
  }

  // Add assignment column if it doesn't exist
  if (assignmentColumnIndex === 0) {
    console.log(`📊 Adding new column: ${columnName}`);
    const newColumnIndex = headers.length + 1;
    const headerRow = worksheet.getRow(1);
    headerRow.getCell(newColumnIndex).value = columnName;
    assignmentColumnIndex = newColumnIndex;
    
    // Update local headers array for proper indexing
    headers.push(columnName);
  }

  let updatedCount = 0;

  console.log(`📊 Updating assignments for ${assigneeType}:`, {
    assigneeId,
    playerCount: playerEmails.length,
    columnName,
    columnIndex: assignmentColumnIndex
  });

  // Update assignments for matching emails
  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    const email = row.getCell(emailColumnIndex).value;
    
    if (email && playerEmails.includes(String(email))) {
      const oldValue = row.getCell(assignmentColumnIndex).value;
      row.getCell(assignmentColumnIndex).value = assigneeId;
      updatedCount++;
      
      console.log(`📊 Updated assignment:`, {
        email: String(email),
        oldValue: oldValue || "none",
        newValue: assigneeId,
        type: assigneeType
      });
    }
  }

  await workbook.xlsx.writeFile(xlsxPath);
  
  console.log(`✅ Assignment update complete:`, {
    updatedCount,
    assigneeType,
    assigneeId
  });
  
  return updatedCount;
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { playerEmails, controllerId, ambassadorId } = await request.json();

    if (!playerEmails || !Array.isArray(playerEmails) || playerEmails.length === 0) {
      return NextResponse.json({ error: "Player emails are required" }, { status: 400 });
    }

    // Determine assignment type and ID
    let assigneeId: string;
    let assigneeType: 'controller' | 'ambassador';
    
    if (controllerId) {
      assigneeId = controllerId;
      assigneeType = 'controller';
    } else if (ambassadorId) {
      assigneeId = ambassadorId;
      assigneeType = 'ambassador';
    } else {
      return NextResponse.json({ error: "Either controller ID or ambassador ID is required" }, { status: 400 });
    }

    console.log(`📊 Processing ${assigneeType} assignment:`, {
      assigneeId,
      playerCount: playerEmails.length,
      emails: playerEmails
    });

    const updatedCount = await updatePlayerAssignments(playerEmails, assigneeId, assigneeType);

    return NextResponse.json({
      success: true,
      message: `${updatedCount} players assigned to ${assigneeType} successfully`,
      assignedCount: updatedCount,
      details: {
        assigneeType,
        assigneeId,
        playerCount: playerEmails.length,
        successfulAssignments: updatedCount
      }
    });

  } catch (error) {
    console.error("Error assigning players:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Internal server error"
    }, { status: 500 });
  }
} 