import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import slaLogsRoutes from "./api/sla-logs/route.js";
import axios from 'axios';


dotenv.config();

const app = express();
const PORT = 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/* ==================== LOGIN ==================== */
app.post("/login", async (req, res) => {
  const { username, password, userAgent } = req.body; // terima userAgent dari frontend
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "User not found" });

    if (!user.password) {
      return res.status(401).json({ error: "User has no password set" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

    // Simpan log login dengan userAgent dari body dulu, kalau kosong pakai header req
    await prisma.UserLog.create({
      data: {
        userId: user.id,
        username: user.username || "",
        action: "login",
        ip: req.ip || "",
        userAgent: userAgent || req.headers["user-agent"] || "",
      },
    });

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

/* ==================== LOGOUT ==================== */
app.post("/logout", async (req, res) => {
  try {
    const { userId, username, userAgent } = req.body; // terima userAgent dari frontend

    if (!userId || !username) {
      return res.status(400).json({ error: "User ID and username are required" });
    }

    await prisma.UserLog.create({
      data: {
        userId,
        username,
        action: "logout",
        ip: req.ip || "",
        userAgent: userAgent || req.headers["user-agent"] || "",
      },
    });

    res.json({ success: true, message: "User logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ==================== USERS ==================== */
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

/* ==================== INVITATION ==================== */
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

/* ==================== ACTIVATION ==================== */
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

/* ==================== SENSOR DATA ==================== */
app.get("/api/sensors", async (req, res) => {
  try {
    const sensors = await prisma.sensors.findMany();
    res.json(sensors);
  } catch (error) {
    console.error("Error fetching sensors:", error);
    res.status(500).json({ error: "Failed to fetch sensors" });
  }
});

app.get("/api/sensor_logs", async (req, res) => {
  try {
    const logs = await prisma.sensor_logs.findMany();
    res.json(logs);
  } catch (error) {
    console.error("Error fetching sensor logs:", error);
    res.status(500).json({ error: "Failed to fetch sensor logs" });
  }
});

/* ==================== USER LOGS ==================== */
app.get("/api/user-logs", async (req, res) => {
  try {
    const logs = await prisma.UserLog.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching user logs:", error);
    res.status(500).json({ error: "Failed to fetch user logs" });
  }
});

/* ==================== SLA LOGS ==================== */
app.use("/api/sla-logs", slaLogsRoutes);

const PRTG_HOST = process.env.PRTG_HOST;
const PRTG_USERNAME = process.env.PRTG_USERNAME;
const PRTG_PASSHASH = process.env.PRTG_PASSHASH;

/* ==================== DEVICE CRUD (PRTG API Proxy) ==================== */

// GET /api/devices : Ambil daftar device dari PRTG
app.get("/api/devices", async (req, res) => {
  try {
    const url = `${PRTG_HOST}/api/table.json`;
    const params = new URLSearchParams({
      content: "devices",
      output: "json",
      columns: "objid,device,parentid,status",
      username: PRTG_USERNAME,
      passhash: PRTG_PASSHASH,
    });

    const prtgRes = await axios.get(`${url}?${params.toString()}`);

    // PRTG response biasanya di prtgRes.data.devices, tapi cek dulu struktur
    if (prtgRes.data.devices) {
      return res.json(prtgRes.data.devices);
    }
    return res.json(prtgRes.data);
  } catch (error) {
    console.error("Error fetching devices from PRTG:", error.message || error);
    return res.status(500).json({ error: "Failed to fetch devices from PRTG" });
  }
});

// POST /api/devices : Tambah device baru ke PRTG
app.post("/api/devices", async (req, res) => {
  const { name, parentId } = req.body;
  if (!name || !parentId) {
    return res.status(400).json({ error: "Name and parentId are required" });
  }

  try {
    const url = `${PRTG_HOST}/api/adddevice.htm`;
    const params = new URLSearchParams({
      name,
      parentid: parentId,
      username: PRTG_USERNAME,
      passhash: PRTG_PASSHASH,
    });

    const prtgRes = await axios.get(`${url}?${params.toString()}`);

    if (prtgRes.data.includes("<error>0</error>")) {
      return res.json({ success: true, message: "Device added successfully" });
    } else {
      return res.status(500).json({ error: "Failed to add device in PRTG" });
    }
  } catch (error) {
    console.error("Error adding device to PRTG:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/devices/:id : Update device di PRTG
app.put("/api/devices/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const url = `${PRTG_HOST}/api/editdevice.htm`;
    const params = new URLSearchParams({
      id,
      name,
      username: PRTG_USERNAME,
      passhash: PRTG_PASSHASH,
    });

    const prtgRes = await axios.get(`${url}?${params.toString()}`);

    if (prtgRes.data.includes("<error>0</error>")) {
      return res.json({ success: true, message: "Device updated successfully" });
    } else {
      return res.status(500).json({ error: "Failed to update device" });
    }
  } catch (error) {
    console.error("Error updating device:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/devices/:id : Delete device di PRTG
app.delete("/api/devices/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const url = `${PRTG_HOST}/api/deletedevice.htm`;
    const params = new URLSearchParams({
      id,
      username: PRTG_USERNAME,
      passhash: PRTG_PASSHASH,
    });

    const prtgRes = await axios.get(`${url}?${params.toString()}`);

    if (prtgRes.data.includes("<error>0</error>")) {
      return res.json({ success: true, message: "Device deleted successfully" });
    } else {
      return res.status(500).json({ error: "Failed to delete device" });
    }
  } catch (error) {
    console.error("Error deleting device:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/* ==================== START SERVER ==================== */
app.listen(PORT, () => {
  console.log(`✅ Server backend berjalan di http://localhost:${PORT}`);
});