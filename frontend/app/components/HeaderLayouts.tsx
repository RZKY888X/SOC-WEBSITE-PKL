"use client";

import { usePathname } from "next/navigation";
import NavbarLayout from "./navbar/page";
import { BreadcrumbDynamic } from "./navbar/BreadcrumbDynamic";

export default function HeaderLayout() {
  const pathname = usePathname();

  // Jangan tampilkan header saat di halaman login
  if (pathname === "/login") return null;

  return (
    <div>
      <NavbarLayout />
      <BreadcrumbDynamic />
    </div>
  );
}
