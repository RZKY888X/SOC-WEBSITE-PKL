//SensorSunburst.tsx
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
            ? "#10B981" // green
            : sensor.status === "Warning"
            ? "#F59E0B" // orange
            : "#EF4444", // red
      });

      return acc;
    }, []),
  };

  return (
    <div className="bg-gradient-to-br from-[#1B263B] via-[#1a2538] to-[#162235] p-6 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5"></div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-center">
          Sensor Hierarchy View
        </h3>
        <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm" style={{ height: "350px" }}>
          <ResponsiveSunburst
            data={structuredData}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            id="name"
            value="value"
            cornerRadius={4}
            borderWidth={2}
            borderColor={{ theme: "background" }}
            colors={{ datum: "data.color" }}
            childColor={{ 
              from: "color",
              modifiers: [["brighter", 0.3]]
            }}
            animate={true}
            motionConfig="gentle"
            isInteractive={true}
            tooltip={({ id, value, color }) => (
              <div className="bg-gray-900/90 backdrop-blur-sm text-white text-sm p-3 rounded-xl border border-white/20 shadow-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="font-semibold">{id}</span>
                </div>
                <div className="text-xs text-gray-300">Value: {value}</div>
              </div>
            )}
            theme={{
              tooltip: {
                container: {
                  backgroundColor: 'transparent',
                }
              }
            }}
          />
        </div>
        
        {/* Status Legend */}
        <div className="mt-4 flex justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-green-500/20 px-3 py-2 rounded-full">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-400 font-medium">Online</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-2 rounded-full">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-yellow-400 font-medium">Warning</span>
          </div>
          <div className="flex items-center gap-2 bg-red-500/20 px-3 py-2 rounded-full">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-red-400 font-medium">Critical</span>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl"></div>
    </div>
  );
};

export default SensorSunburst;