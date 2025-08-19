import express from "express";
import prisma from "../../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const sensors = await prisma.sensor_logs.findMany({
      where: {
        device: {
          contains: "DESKTOP", // pastikan sesuai nama device di database
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 30, // ambil 30 data terbaru
    });

    res.json(sensors);
  } catch (error) {
    console.error("Gagal mengambil sensor dari database", error);
    res.status(500).json({ error: "Gagal mengambil data sensor" });
  }
});

export default router;
