"use client";

import HamburgerMenu from "@/app/components/navbar/HamburgerMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "@/app/components/navbar/NotificationBell";

export default function DashboardNavbar() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#0b1622] via-[#081018] to-[#0b1622] text-white font-sans z-50 shadow-md relative overflow-visible">
      {/* Optional animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Navbar Utama */}
      <nav className="relative z-10 w-full px-6 md:px-12 py-4 md:py-6 pb-8">
        <div className="max-w-screen mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            PRESSOC
          </Link>

          {/* Notification & Hamburger */}
          <div className="flex items-center gap-4 relative">
            <NotificationBell  /> 
            {pathname !== "/" && <HamburgerMenu />}
          </div>
        </div>
      </nav>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
    </div>
  );
}
