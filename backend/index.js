import express from "express";
import path from "path";
import { promises as fs } from "fs";
import ExcelJS from "exceljs";

const app = express();
app.use(express.json());

// Helper functions
function buildHeaders() {
  return [
    "timestamp",
    "firstName",
    "lastName",
    "playedBefore",
    "experienceLevel",
    "playedClub",
    "clubName",
    "gender",
    "hasDisability",
    "location",
    "email",
    "phone",
    "position",
    "goal",
    "whyJoin",
  ];
}

function buildValues(data) {
  return [
    new Date().toISOString(),
    data.firstName ?? "",
    data.lastName ?? "",
    data.playedBefore ?? "",
    data.experienceLevel ?? "",
    data.playedClub ?? "",
    data.clubName ?? "",
    data.gender ?? "",
    data.hasDisability ?? "",
    data.location ?? "",
    data.email ?? "",
    data.phone ?? "",
    data.position ?? "",
    data.goal ?? "",
    data.whyJoin ?? "",
  ];
}

// POST /api/signup
app.post("/api/signup", async (req, res) => {
  try {
    const headers = buildHeaders();
    const values = buildValues(req.body);

    const dataDir = path.join(process.cwd(), "data");
    const csvPath = path.join(dataDir, "signups.csv");
    const xlsxPath = path.join(dataDir, "signups.xlsx");

    await fs.mkdir(dataDir, { recursive: true });

    // Ensure CSV file exists with headers
    try {
      await fs.access(csvPath);
    } catch {
      await fs.writeFile(csvPath, headers.join(",") + "\n", "utf8");
    }

    // Append CSV row (escape quotes)
    const escapedRow = values.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",") + "\n";
    await fs.appendFile(csvPath, escapedRow, "utf8");

    // Handle XLSX
    const workbook = new ExcelJS.Workbook();
    let worksheet;
    try {
      await fs.access(xlsxPath);
      await workbook.xlsx.readFile(xlsxPath);
      worksheet = workbook.getWorksheet("Signups") || workbook.worksheets[0];
    } catch {
      worksheet = workbook.addWorksheet("Signups");
      worksheet.columns = headers.map((h) => ({ header: h, key: h, width: 20 }));
      worksheet.views = [{ state: "frozen", ySplit: 1 }];
    }

    worksheet.addRow(values);
    await workbook.xlsx.writeFile(xlsxPath);

    res.json({ success: true });
  } catch (err) {
    console.error("Error saving signup:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// GET /api/signups – return JSON array of all sign-ups
app.get("/api/signups", async (_req, res) => {
  try {
    const xlsxPath = path.join(process.cwd(), "data", "signups.xlsx");

    // If file doesn't exist yet, return empty array
    try {
      await fs.access(xlsxPath);
    } catch {
      return res.json([]);
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(xlsxPath);
    const worksheet = workbook.getWorksheet("Signups") || workbook.worksheets[0];
    if (!worksheet) return res.json([]);

    const headers = (worksheet.getRow(1).values ?? []).slice(1);
    const rows = worksheet.getRows(2, worksheet.rowCount - 1) || [];

    const data = rows.map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = String(row.values[i + 1] ?? "");
      });
      return obj;
    });

    return res.json(data);
  } catch (err) {
    console.error("Error reading signups:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`)); 