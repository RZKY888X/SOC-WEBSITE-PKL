"use client";
import { usePathname } from "next/navigation";

export default function FooterSection() {
  const pathname = usePathname();

  // Sembunyikan header hanya di /login
  if (pathname === "/login") return null;

  return (
    <footer className='bg-[#0b1622] text-white py-8 text-center text-sm'>
      <div className='container mx-auto space-y-4'>
        <p>
          © {new Date().getFullYear()} Prestasi Prima PKL Team. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
