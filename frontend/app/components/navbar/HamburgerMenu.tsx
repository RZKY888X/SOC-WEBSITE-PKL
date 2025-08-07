"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/device", label: "Devices" },
    { href: "/sensor", label: "Sensors" },
    { href: "/alert", label: "Alerts" },
    { href: "/ticket", label: "Ticket" },
    { href: "/sla", label: "Sla" },
    { href: "/account", label: "Account" },
    { href: "/user-management", label: "User Managements" },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className='z-50 relative space-y-1 text-white text-3xl p-2'
        aria-label='Open menu'
      >
        <span className='block h-1 w-6 bg-amber-50' />
        <span className='block h-1 w-6 bg-amber-50' />
        <span className='block h-1 w-6 bg-amber-50' />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-[#030E1C] shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className='flex justify-end p-4'>
          <button
            onClick={() => setIsOpen(false)}
            className='text-white text-4xl hover:text-red-400'
            aria-label='Close menu'
          >
            &times;
          </button>
        </div>

        <ul className='flex-grow flex flex-col items-center justify-start text-white text-base w-full space-y-2'>
          {/* Logo di atas Dashboard */}
          <div className="mb-4">
            <Image
              src='/Pressoc.png'
              alt='Logo'
              width={200}
              height={200}
              className='object-contain border border-[#5d7bb6] rounded-2xl'
              priority
            />
            <hr className="mt-6 border-t border-[#5d7bb6] w-full opacity-50"/>
          </div>


          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href} className='text-center'>
                <Link
                  href={item.href}
                  className={`block text-2xl font-medium py-2 transition-all ${
                    isActive
                      ? "text-[#5d7bb6] border-b-2 border-[#5d7bb6]"
                      : "hover:text-[#5d7bb6]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}