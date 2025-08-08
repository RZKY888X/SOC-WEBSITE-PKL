import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import slaLogsRoutes from "./api/sla-logs/route.js"; // ⬅️ Import router SLA logs

dotenv.config();

const app = express();
const PORT = 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ==================== LOGIN ====================
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

    res.json({
      id: user.id,
      name: user.username,
      email: user.email ?? "",
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== USERS ====================
// GET all users
app.get("/api/user", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        isActivated: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE user
app.delete("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ==================== INVITATION ====================
app.post("/api/invitation", async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: "Email and role are required" });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already invited" });
    }

    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

    await prisma.user.create({
      data: {
        email,
        role,
        isActivated: false,
        activationToken: token,
      },
    });

    const activationLink = `http://localhost:3000/activate`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SOC Dashboard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "You're Invited to SOC Dashboard",
      html: `
        <p>Hello,</p>
        <p>You have been invited to SOC Dashboard as <strong>${role}</strong>.</p>
        <p>Please open the activation page at:</p>
        <p><a href="${activationLink}">${activationLink}</a></p>
        <p>And use the following token to activate your account:</p>
        <p style="font-size: 18px;"><code>${token}</code></p>
        <p>This token is valid until used.</p>
      `,
    });

    console.log(`✅ Invitation sent to ${email}`);
    res.status(200).json({ success: true, message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Invitation error:", error);
    res.status(500).json({ error: "Failed to send invitation" });
  }
});

// ==================== ACTIVATION ====================
app.post("/api/activate", async (req, res) => {
  const { token, username, password, name } = req.body;

  if (!token || !username || !password || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { activationToken: token, isActivated: false },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        username,
        name,
        password: hashedPassword,
        isActivated: true,
        activationToken: null,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Activation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== SENSOR DATA ====================
// Get all sensors
app.get("/api/sensors", async (req, res) => {
  try {
    const sensors = await prisma.sensors.findMany();
    res.json(sensors);
  } catch (error) {
    console.error("Error fetching sensors:", error);
    res.status(500).json({ error: "Failed to fetch sensors" });
  }
});

// Get all sensor logs
app.get("/api/sensor_logs", async (req, res) => {
  try {
    const logs = await prisma.sensor_logs.findMany();
    res.json(logs);
  } catch (error) {
    console.error("Error fetching sensor logs:", error);
    res.status(500).json({ error: "Failed to fetch sensor logs" });
  }
});

// ==================== SLA LOGS ROUTES ====================
app.use("/api/sla-logs", slaLogsRoutes);

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`✅ Server backend berjalan di http://localhost:${PORT}`);
});
