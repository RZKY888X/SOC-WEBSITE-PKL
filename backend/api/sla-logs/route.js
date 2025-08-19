import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Ambil SEMUA data dari tabel sensors
    const allSensors = await prisma.sensors.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Kelompokkan berdasarkan waktu
    const data1Day = allSensors.filter(item => new Date(item.timestamp) >= oneDayAgo);
    const data7Days = allSensors.filter(item => new Date(item.timestamp) >= sevenDaysAgo);
    const data30Days = allSensors.filter(item => new Date(item.timestamp) >= thirtyDaysAgo);

    res.json({
      '1day': data1Day,
      '7days': data7Days,
      '30days': data30Days,
    });
  } catch (error) {
    console.error('Gagal mengambil data SLA logs:', error);
    res.status(500).json({ error: 'Gagal mengambil data SLA logs' });
  }
});

export default router;
