"use client";

import HamburgerMenu from "@/app/components/navbar/HamburgerMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "@/app/components/navbar/NotificationBell";

export default function DashboardNavbar() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <nav className="relative bg-gradient-to-r from-[#0D1B2A]/95 via-[#0A1525]/95 to-[#0D1B2A]/95 backdrop-blur-xl border-b border-white/10 shadow-lg z-50">
      {/* Decorative glowing elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
        >
          PRESSOC
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-5">
          {/* Notifikasi Bell */}
          {pathname !== "/" && <NotificationBell />}

          {/* Hamburger Menu */}
          {pathname !== "/" && (
            <div className="hover:scale-105 transition-transform">
              <HamburgerMenu />
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient accent */}
      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70"></div>
    </nav>
  );
}
