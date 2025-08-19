// scripts/fetchLogs.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const logs = await prisma.sensorLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 20, // ambil 20 data terbaru (bisa diubah jadi 2000)
  });
  console.log(logs);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
