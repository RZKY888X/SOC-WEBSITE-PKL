"use client";

import HamburgerMenu from "@/app/components/navbar/HamburgerMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarLayout() {
  const pathname = usePathname();

  // Sembunyikan header hanya di /login
  if (pathname === "/login") return null;

  return (
      <nav className='min-w-screen bg-[#0D1B2A] text-white p-6 font-sans'>
        <div className='flex items-center justify-between'>
          <Link href='#' className='text-2xl font-bold'>
            PRESSOC
          </Link>
          <HamburgerMenu />
        </div>
      </nav>
  );
}
