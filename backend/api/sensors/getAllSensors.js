// backend/api/sensors/getAllSensors.js
import express from "express";
import { getSensorsFromPRTG } from "../../lib/prtgClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const sensors = await getSensorsFromPRTG();
  res.json(sensors);
});

export default router;
