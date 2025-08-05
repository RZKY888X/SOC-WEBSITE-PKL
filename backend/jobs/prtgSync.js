import { getSensorsFromPRTG } from "../lib/prtgClient.js";
import { rawQuery as query, prisma } from "../lib/db.js"; // pastikan prisma di-import dari db.js

export async function syncSensors() {
  try {
    // Buat tabel 'sensors' jika belum ada
    await query(`
      CREATE TABLE IF NOT EXISTS sensors (
        id SERIAL PRIMARY KEY,
        objid INTEGER,
        device TEXT,
        sensor TEXT,
        lastvalue TEXT,
        status TEXT,
        message TEXT,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Buat tabel 'sensor_logs' jika belum ada
    await query(`
      CREATE TABLE IF NOT EXISTS sensor_logs (
        id SERIAL PRIMARY KEY,
        device TEXT,
        sensor TEXT,
        value TEXT,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tabel siap");

    const sensors = await getSensorsFromPRTG();
    console.log(`📡 Dapat ${sensors.length} data sensor dari PRTG`);

    for (const sensor of sensors) {
      const { objid, device, sensor: sensorName, lastvalue, status, message } = sensor;

      // Simpan ke tabel 'sensors'
      await query(
        `INSERT INTO sensors (objid, device, sensor, lastvalue, status, message)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [objid, device, sensorName, lastvalue, status, message]
      );

      // Simpan juga ke tabel 'sensor_logs'
      await prisma.sensor_logs.create({
        data: {
          device,
          sensor: sensorName,
          value: lastvalue,
          timestamp: new Date(),
        },
      });
    }

    console.log("✅ Semua data berhasil disimpan ke sensors & sensor_logs");
  } catch (err) {
    console.error("❌ Gagal sync data:", err);
  }
}
