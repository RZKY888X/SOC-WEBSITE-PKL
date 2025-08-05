"use client";

import React from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";

// Tipe untuk satu log sensor
interface SensorLog {
  device: string;
  sensor: string;
  status: string;
  lastvalue_raw?: string;
}

// Tipe untuk props komponen
interface SensorSunburstProps {
  data: SensorLog[];
}

const SensorSunburst: React.FC<SensorSunburstProps> = ({ data }) => {
  const structuredData = {
    name: "All Sensors",
    children: data.reduce<
      { name: string; children: { name: string; value: number; color: string }[] }[]
    >((acc, sensor) => {
      let device = acc.find((d) => d.name === sensor.device);
      if (!device) {
        device = { name: sensor.device, children: [] };
        acc.push(device);
      }

      device.children.push({
        name: sensor.sensor,
        value: Number(sensor.lastvalue_raw || 1),
        color:
          sensor.status === "Up"
            ? "green"
            : sensor.status === "Warning"
            ? "orange"
            : "red",
      });

      return acc;
    }, []),
  };

  return (
    <div style={{ height: "300px" }}>
      <ResponsiveSunburst
        data={structuredData}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        id="name"
        value="value"
        cornerRadius={2}
        borderWidth={1}
        borderColor={{ theme: "background" }}
        colors={{ datum: "data.color" }}
        childColor={{ from: "color" }}
        animate={true}
        motionConfig="gentle"
        isInteractive={true}
        tooltip={({ id, value }) => (
          <div className="bg-gray-800 text-white text-xs p-1 rounded">
            {id}: {value}
          </div>
        )}
      />
    </div>
  );
};

export default SensorSunburst;
