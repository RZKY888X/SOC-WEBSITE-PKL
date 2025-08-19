// components/landing/LandingNavbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between transition-all duration-300
      ${scrolled ? "bg-black/70 backdrop-blur-md shadow-lg" : "bg-black/40 backdrop-blur-sm"}`}
    >
      <Link href="/" className="font-bold text-2xl md:text-3xl text-cyan-400">
        PRESSOC
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 text-white font-semibold">
        <Link href="#solutions" className="hover:text-cyan-400 transition">
          Solutions
        </Link>
        <Link href="#pricing" className="hover:text-cyan-400 transition">
          Pricing
        </Link>
        <Link href="#free-trial" className="hover:text-cyan-400 transition">
          Free Trial
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 transition"
        >
          Login
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="flex flex-col justify-between w-6 h-6 focus:outline-none">
          <span
            className={`block h-0.5 w-full bg-white transition-transform duration-300 ${
              isOpen ? "rotate-45 translate-y-2.5" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-full bg-white transition-opacity duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`block h-0.5 w-full bg-white transition-transform duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2.5" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-md flex flex-col items-center gap-4 py-6 md:hidden"
          >
            <Link href="#solutions" className="text-white text-lg" onClick={() => setIsOpen(false)}>
              Solutions
            </Link>
            <Link href="#pricing" className="text-white text-lg" onClick={() => setIsOpen(false)}>
              Pricing
            </Link>
            <Link href="#free-trial" className="text-white text-lg" onClick={() => setIsOpen(false)}>
              Free Trial
            </Link>
            {/* Login hilang di mobile */}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
