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


  return (
    <div>
      <DashboardNavbar/>
      <BreadcrumbDynamic />
    </div>
  );
}
