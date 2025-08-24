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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 backdrop-blur-xl ${
        scrolled 
          ? "bg-[#0D1B2A]/95 shadow-2xl border-b border-cyan-500/20" 
          : "bg-[#0D1B2A]/70 shadow-lg border-b border-cyan-500/10"
      }`}
    >
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-[10%] w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-4 left-[20%] w-1 h-1 bg-blue-400 rounded-full opacity-40 animate-pulse delay-500"></div>
        <div className="absolute top-3 right-[15%] w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50 animate-pulse delay-1000"></div>
        <div className="absolute top-5 right-[25%] w-1 h-1 bg-cyan-300 rounded-full opacity-30 animate-pulse delay-1500"></div>
        
        {/* Floating gradient orbs */}
        <div className="absolute -top-20 left-1/4 w-40 h-40 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-16 right-1/3 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand with enhanced styling */}
          <Link 
            href="/" 
            className="group relative"
          >
            <div className="flex items-center gap-3">
              {/* Icon/Symbol */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300 group-hover:scale-110">
                  <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-sm"></div>
                  </div>
                </div>
                {/* Pulse effect */}
                <div className="absolute inset-0 w-10 h-10 bg-cyan-400/20 rounded-xl animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Brand Text */}
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-purple-400 transition-all duration-300">
                  PRESSOC
                </span>
                <span className="text-xs text-gray-400 -mt-1 group-hover:text-cyan-400 transition-colors duration-300">
                  Security & Performance
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Menu with enhanced styling */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#0C1A2A]/80 backdrop-blur-sm px-3 py-2 rounded-2xl border border-gray-700/50 shadow-inner">
              <Link 
                href="#solutions" 
                className="group relative px-6 py-3 rounded-xl transition-all duration-300 hover:bg-[#0A1520] overflow-hidden"
              >
                <span className="relative z-10 text-sm font-medium text-gray-300 group-hover:text-cyan-400 transition-colors duration-300">
                  💡 Solutions
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </Link>
              
              <Link 
                href="#pricing" 
                className="group relative px-6 py-3 rounded-xl transition-all duration-300 hover:bg-[#0A1520] overflow-hidden"
              >
                <span className="relative z-10 text-sm font-medium text-gray-300 group-hover:text-cyan-400 transition-colors duration-300">
                  💰 Pricing
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </Link>
              
              <Link 
                href="#free-trial" 
                className="group relative px-6 py-3 rounded-xl transition-all duration-300 hover:bg-[#0A1520] overflow-hidden"
              >
                <span className="relative z-10 text-sm font-medium text-gray-300 group-hover:text-cyan-400 transition-colors duration-300">
                  🚀 Free Trial
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                {/* Trial badge */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* CTA Login Button */}
            <Link
              href="/login"
              className="relative group ml-4 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Login</span>
                <span className="text-xs opacity-80 group-hover:opacity-100 transition-opacity">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
          </div>

          {/* Mobile Hamburger with enhanced styling */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="group relative p-3 bg-[#0C1A2A]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex flex-col justify-center items-center w-6 h-6 gap-1.5">
                <span
                  className={`block h-0.5 w-6 bg-gray-300 group-hover:bg-cyan-400 transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-gray-300 group-hover:bg-cyan-400 transition-all duration-300 ${
                    isOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-gray-300 group-hover:bg-cyan-400 transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </div>
              
              {/* Menu indicator */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="absolute top-full left-4 right-4 bg-[#0D1B2A]/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl md:hidden z-50 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                {/* Menu Header */}
                <div className="text-center pb-4 border-b border-gray-700/50">
                  <p className="text-sm text-gray-400">Navigate to</p>
                </div>

                {/* Menu Items */}
                <div className="space-y-3">
                  <Link 
                    href="#solutions" 
                    className="group flex items-center gap-4 p-4 bg-[#0C1A2A]/60 hover:bg-[#0A1520] rounded-xl border border-gray-700/30 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                      <span className="text-lg">💡</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">Solutions</p>
                      <p className="text-xs text-gray-400">Explore our features</p>
                    </div>
                    <span className="text-gray-400 group-hover:text-cyan-400 transition-colors">→</span>
                  </Link>
                  
                  <Link 
                    href="#pricing" 
                    className="group flex items-center gap-4 p-4 bg-[#0C1A2A]/60 hover:bg-[#0A1520] rounded-xl border border-gray-700/30 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                      <span className="text-lg">💰</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">Pricing</p>
                      <p className="text-xs text-gray-400">View our plans</p>
                    </div>
                    <span className="text-gray-400 group-hover:text-cyan-400 transition-colors">→</span>
                  </Link>
                  
                  <Link 
                    href="#free-trial" 
                    className="group flex items-center gap-4 p-4 bg-[#0C1A2A]/60 hover:bg-[#0A1520] rounded-xl border border-gray-700/30 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="relative w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
                      <span className="text-lg">🚀</span>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">Free Trial</p>
                      <p className="text-xs text-gray-400">Start your journey</p>
                    </div>
                    <span className="text-gray-400 group-hover:text-cyan-400 transition-colors">→</span>
                  </Link>
                </div>

                {/* Mobile CTA */}
                <div className="pt-4 border-t border-gray-700/50">
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>Get Started</span>
                    <span className="text-sm">→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent shadow-sm"></div>
      
      {/* Subtle glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-cyan-400/20 blur-sm"></div>
    </nav>
  );
}