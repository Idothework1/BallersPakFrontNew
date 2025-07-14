import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import ExcelJS from "exceljs";

// Force dynamic because we rely on filesystem reads
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, birthday } = await request.json();

    if (!email || !birthday) {
      return NextResponse.json({ success: false, error: "Email and birthday are required" }, { status: 400 });
    }

    // Read the signups data
    const dataDir = path.join(process.cwd(), "data");
    const xlsxPath = path.join(dataDir, "signups.xlsx");
    
    try {
      await fs.access(xlsxPath);
    } catch {
      return NextResponse.json({ success: false, error: "No users found" }, { status: 404 });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(xlsxPath);
    const worksheet = workbook.getWorksheet("Signups") ?? workbook.worksheets[0];
    
    if (!worksheet) {
      return NextResponse.json({ success: false, error: "No users found" }, { status: 404 });
    }

    const headers = (worksheet.getRow(1).values as string[]).slice(1);
    const rows = worksheet.getRows(2, worksheet.rowCount - 1) ?? [];

    // Find user by email and birthday
    const user = rows.find((row) => {
      const values = row.values as (string | number | undefined)[];
      const userData: Record<string, string> = {};
      headers.forEach((header, idx) => {
        userData[header] = String(values[idx + 1] ?? "");
      });
      
      return userData.email === email && userData.birthday === birthday;
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or birthday" }, { status: 401 });
    }

    // Extract user data
    const values = user.values as (string | number | undefined)[];
    const userData: Record<string, string> = {};
    headers.forEach((header, idx) => {
      userData[header] = String(values[idx + 1] ?? "");
    });

    // Check user status for approval
    const userStatus = userData.status || "waitlisted";
    const planType = userData.planType || "free";

    // If user is waitlisted and not a premium member, they need approval
    if (planType === "free" && (userStatus === "waitlisted" || userStatus === "pending")) {
      return NextResponse.json({ 
        success: false, 
        error: "pending_approval",
        message: "Your application is still being reviewed. Please wait for admin approval to access your profile."
      }, { status: 403 });
    }

    // If user is rejected
    if (userStatus === "rejected") {
      return NextResponse.json({ 
        success: false, 
        error: "application_rejected",
        message: "Your application has been rejected. Please contact support if you believe this is an error."
      }, { status: 403 });
    }

    // User is approved or is a premium member - allow login
    const userProfile = {
      id: user.number, // row number as ID
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: userData.fullName,
      age: userData.age,
      birthday: userData.birthday,
      planType: planType,
      paymentStatus: userData.paymentStatus || "n/a",
      position: userData.position,
      currentLevel: userData.experienceLevel || userData.currentLevel,
      location: userData.location,
      goal: userData.goal,
      timestamp: userData.timestamp,
      status: userStatus,
    };

    return NextResponse.json({ success: true, user: userProfile });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
} 