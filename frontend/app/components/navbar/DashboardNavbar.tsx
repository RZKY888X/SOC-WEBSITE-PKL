"use client";

import HamburgerMenu from "@/app/components/navbar/HamburgerMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiBell } from "react-icons/fi";

interface Sensor {
  sensor: string;
  device: string;
  status: number;
  lastvalue: string;
  timestamp: string;
}

export default function DashboardNavbar() {
  const pathname = usePathname();
  const [hasAlert, setHasAlert] = useState(false);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await axios.get<Sensor[]>(
          "http://localhost:3001/api/sensors/"
        );
        const sensors = res.data;

        const downSensors = sensors.filter((s) => s.status !== 3);
        setHasAlert(downSensors.length > 0);
      } catch (err) {
        console.error("Gagal fetch sensor:", err);
      }
    }

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (pathname === "/login") return null;

  return (
    <nav className="min-w-screen bg-[#0D1B2A] text-white p-6 font-sans">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          PRESSOC
        </Link>
        <div className="flex items-center gap-4">

          {/* Tombol Lonceng */}
          {pathname !== "/" && (
            <Link href="/alert" className="relative">
              <FiBell className="w-6 h-6" />
              {hasAlert && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </Link>
          )}

          {/* Hamburger Menu */}
          {pathname !== "/" && <HamburgerMenu />}
        </div>
      </div>
    </nav>
  );
}
