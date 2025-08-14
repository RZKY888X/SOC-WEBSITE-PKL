"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative text-white px-6 flex flex-col items-center justify-center text-center bg-cover bg-center min-h-screen"
      style={{ backgroundImage: "url('/BgCompanies.jpeg')" }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/50 via-black-blue-500/20 to-[#0D1B2A]" />

      <div className="relative z-10 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-5xl font-bold leading-tight"
        >
          PRESSOC — SOC Monitoring & Network Visibility dalam Satu Dashboard
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-6 text-gray-300 text-lg"
        >
          Di era digital yang serba cepat, performa infrastruktur dan keamanan
          siber adalah fondasi keberlangsungan bisnis.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-4 text-gray-300 text-lg"
        >
          PRESSOC hadir sebagai platform monitoring terpadu yang menggabungkan
          pemantauan performa jaringan dengan deteksi ancaman keamanan
          real-time, semuanya dari satu dashboard modern yang mudah digunakan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="flex gap-4 mt-10 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection("freetrial")}
            className="px-8 py-3 rounded bg-blue-600 hover:bg-blue-500 text-lg font-medium"
          >
            Get Trial
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection("feature")}
            className="px-8 py-3 rounded border border-white hover:bg-white hover:text-black text-lg font-medium"
          >
            Explore
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
