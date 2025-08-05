// backend/index.js
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import getAllSensorsRouter from "./api/sensors/getAllSensors.js";
import getDesktopSensorsRouter from "./api/sensors/getDesktopDevice.js";
import getSlaLogsRouter from "./api/sla-logs/route.js";
import { syncSensors } from "./jobs/prtgSync.js";

const app = express();
const PORT = 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Endpoint sensor
app.use("/api/sensors/desktop", getDesktopSensorsRouter);
app.use("/api/sensors", getAllSensorsRouter);
app.use("/api/sla-logs", getSlaLogsRouter);

// Endpoint login untuk NextAuth CredentialsProvider
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials" });

    res.json({
      id: user.id,
      name: user.username,
      email: user.email ?? "",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Sync data PRTG saat server mulai dan setiap 10 menit
const TEN_MINUTES = 10 * 60 * 1000;
syncSensors();
setInterval(() => {
  console.log("⏳ Menjalankan sync data dari PRTG...");
  syncSensors();
}, TEN_MINUTES);

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server backend berjalan di http://localhost:${PORT}`);
});