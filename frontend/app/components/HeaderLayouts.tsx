"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbDynamic } from "./navbar/BreadcrumbDynamic";
import DashboardNavbar from "./navbar/DashboardNavbar";

export default function HeaderLayout() {
  const pathname = usePathname();

  // Jangan tampilkan header saat di halaman login
  if (pathname === "/login") return null;
  
  return (
    <div>
      <DashboardNavbar/>
      <BreadcrumbDynamic />
    </div>
  );
}