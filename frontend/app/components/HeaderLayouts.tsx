//HeaderLayouts.tsx
"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbDynamic } from "./navbar/BreadcrumbDynamic";
import DashboardNavbar from "./navbar/DashboardNavbar";

export default function HeaderLayout() {
  const pathname = usePathname();

  // jangan render navbar saat login
  if (pathname === "/") return null;
  if (pathname === "/login") return null;
  if (pathname === "/activate") return null;
  if (pathname === "/pembayaran") return null;

  return (
    <div className="relative">
      {/* Animated background for header area */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0a1120] to-[#050a15] overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>
      
      <div className="relative z-10">
        <DashboardNavbar />
        <div className="px-6 py-2 bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10 backdrop-blur-sm">
          <BreadcrumbDynamic />
        </div>
      </div>
      
      {/* Separator line with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
    </div>
  );
}
