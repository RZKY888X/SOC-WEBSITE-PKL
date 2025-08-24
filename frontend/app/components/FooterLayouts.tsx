"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function FooterSection() {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    
    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, []);

  // Sembunyikan header hanya di /login
  if (pathname === "/login") return null;

  return (
    <footer className='relative bg-gradient-to-r from-[#0b1622] via-[#081018] to-[#0b1622] text-white overflow-hidden'>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-0 left-1/2 w-24 h-24 bg-pink-500/5 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      {/* Top gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      <div className="relative z-10 py-12">
        <div className='container mx-auto px-6'>
          {/* Main content */}
          <div className="text-center space-y-6">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                PRESSOC
              </h3>
              <p className="text-gray-400 text-sm">Advanced Monitoring & Analytics Platform</p>
            </div>
            
            {/* Divider */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-gray-600 w-20"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <div className="h-px bg-gradient-to-l from-transparent via-gray-600 to-gray-600 w-20"></div>
            </div>
            
            {/* Footer links/info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="space-y-2">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider">System</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-400 text-xs">All Services Online</span>
                  </div>
                  {mounted && (
                    <p className="text-gray-500 text-xs">
                      Last updated: {currentTime || '--:--:--'}
                    </p>
                  )}
                  {!mounted && (
                    <p className="text-gray-500 text-xs">
                      Last updated: --:--:--
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Support</h4>
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs">24/7 Monitoring</p>
                  <p className="text-gray-500 text-xs">Real-time Analytics</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Version</h4>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">v3.0.1</span>
                  </div>
                  <p className="text-gray-500 text-xs">Enhanced Dashboard</p>
                </div>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} 
                <span className="font-semibold text-white mx-2">Prestasi Prima PKL Team</span>
                All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Built with ❤️ using Next.js & Modern Web Technologies
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60"></div>
    </footer>
  );
}