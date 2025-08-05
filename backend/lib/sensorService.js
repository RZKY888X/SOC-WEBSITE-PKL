import { prisma } from "./prisma.js";

export async function saveSensorsToDB(sensors) {
  for (const sensor of sensors) {
    await prisma.sensorLog.create({
      data: {
        device: sensor.device,
        sensor: sensor.sensor,
        status: sensor.status,
        lastValue: sensor.lastvalue,
        message: sensor.message,
        datetime: new Date(sensor.lastcheck),
      },
    });
  }
}
