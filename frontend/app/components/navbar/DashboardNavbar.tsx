//DashboardNavbar.tsx
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
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await axios.get<Sensor[]>(
          "http://localhost:3001/api/sensors/"
        );
        const sensors = res.data;

        const downSensors = sensors.filter((s) => s.status !== 3);
        setHasAlert(downSensors.length > 0);
        setAlertCount(downSensors.length);
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
    <nav className="min-w-screen bg-gradient-to-r from-[#0D1B2A] via-[#0a1520] to-[#0D1B2A] text-white shadow-2xl border-b border-white/10 backdrop-blur-sm relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 p-6 font-sans">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link 
            href="/" 
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 relative"
          >
            <span className="relative z-10">PRESSOC</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
          </Link>
          
          <div className="flex items-center gap-6">
            {/* Status Indicator */}
            <div className="hidden md:flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-30"></div>
              </div>
              <span className="text-sm text-gray-300 font-medium">System Online</span>
            </div>

            {/* Alert Bell */}
            {pathname !== "/" && (
              <Link 
                href="/alert" 
                className="relative group p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 backdrop-blur-sm"
              >
                <FiBell className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
                {hasAlert && (
                  <>
                    {/* Alert dot */}
                    <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50"></span>
                    </span>
                    {/* Alert count */}
                    {alertCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg animate-pulse">
                        {alertCount > 99 ? '99+' : alertCount}
                      </span>
                    )}
                  </>
                )}
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
              </Link>
            )}

            {/* Hamburger Menu */}
            {pathname !== "/" && (
              <div className="relative">
                <HamburgerMenu />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </nav>
  );
}