"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FiBell } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdOutlineWarningAmber, MdErrorOutline } from "react-icons/md";
import Link from "next/link";

interface Sensor {
  sensor: string;
  device: string;
  status: number;
  lastvalue: string;
  timestamp: string;
}

export default function NotificationBell() {
  const [alerts, setAlerts] = useState<Sensor[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement | null>(null);

  const [counts, setCounts] = useState({
    ok: 0,
    warning: 0,
    critical: 0,
  });

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await axios.get<Sensor[]>("http://localhost:3001/api/sensors/");
        const sensors = res.data;

        const latestPerSensor = new Map<string, Sensor>();
        sensors.forEach((s) => {
          const key = `${s.device}::${s.sensor}`;
          if (!latestPerSensor.has(key)) {
            latestPerSensor.set(key, s);
          } else {
            const existing = latestPerSensor.get(key)!;
            const ts1 = new Date(existing.timestamp).getTime();
            const ts2 = new Date(s.timestamp).getTime();
            if (ts2 > ts1) latestPerSensor.set(key, s);
          }
        });

        const grouped = Array.from(latestPerSensor.values());
        const ok = grouped.filter((s) => s.status === 3).length;
        const warning = grouped.filter((s) => s.status === 2).length;
        const criticalList = grouped.filter((s) => s.status === 1 || s.status === 0);
        const critical = criticalList.length;

        setCounts({ ok, warning, critical });
        setAlerts(criticalList);
      } catch (err) {
        console.error("Gagal fetch sensor:", err);
      }
    }

    fetchAlerts();
    const iv = setInterval(fetchAlerts, 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => window.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={bellRef}>
      <button onClick={() => setIsOpen((prev) => !prev)}>
        <FiBell className="w-6 h-6" />
        {counts.critical > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#0f172a] border border-white/10 rounded-lg shadow-xl p-4 z-50 ring-1 ring-blue-500">
          <h3 className="text-base font-semibold mb-4">Critical Alerts</h3>

          {/* Status Icons */}
          <div className="flex justify-between items-center mb-4 space-x-2">
            {/* OK */}
            <div className="flex-1 flex items-center justify-center bg-[#102A43] rounded-lg py-2">
              <AiOutlineCheckCircle className="text-green-400 mr-2 text-lg" />
              <span>{counts.ok}</span>
            </div>

            {/* Warning */}
            <div className="flex-1 flex items-center justify-center bg-[#102A43] rounded-lg py-2">
              <MdOutlineWarningAmber className="text-yellow-400 mr-2 text-lg" />
              <span>{counts.warning}</span>
            </div>

            {/* Critical (Link to alert) */}
            <Link
              href="/alert"
              className="flex-1 flex items-center justify-center bg-[#102A43] rounded-lg py-2 hover:bg-[#1b344c] transition"
            >
              <MdErrorOutline className="text-red-500 mr-2 text-lg" />
              <span>{counts.critical}</span>
            </Link>
          </div>

          {/* List Alert */}
          <div className="max-h-64 overflow-auto space-y-2">
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-400">No critical alerts.</p>
            ) : (
              alerts.map((alert, idx) => (
                <div key={idx} className="bg-[#2b1a1a] p-3 rounded text-sm">
                  <div className="font-semibold mb-1">
                    {alert.device} / {alert.sensor}
                  </div>
                  <div className="text-xs text-gray-300">
                    Status: Down • Value: {alert.lastvalue || "-"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}