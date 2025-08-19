// backend/api/utils/formatSensorData.js
export default function formatSensorData(data) {
    return data.map((sensor) => ({
      id: sensor.id,
      device: sensor.device,
      sensor: sensor.sensor,
      status: sensor.status,
      value: sensor.value,
      unit: sensor.unit,
      datetime: sensor.datetime,
    }));
  }
  