// components/landing/HeroSection.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [text, setText] = useState("");
  const fullText =
    "PRESSOC — SOC Monitoring & Network Visibility in a Single Dashboard";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = (id: string) => {
    const section = document.querySelector(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className='relative text-white flex items-center justify-center min-h-screen bg-cover bg-center'
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
      }}
    >
      <div className='absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-cyan-900/40'></div>

      <div className='relative z-10 text-center px-6 max-w-4xl flex flex-col justify-center'>
        {/* sub headline */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className='uppercase tracking-widest text-cyan-400 font-semibold mb-4'
        >
          Empowering Security & Performance
        </motion.p>

        {/* typing effect title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className='text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent'
        >
          {text}
          <span className='animate-pulse text-cyan-400'>|</span>
        </motion.h1>

        {/* description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className='mt-6 text-lg md:text-xl text-gray-100 bg-black/30 px-6 py-4 rounded-xl leading-relaxed backdrop-blur-sm shadow-lg'
        >
          In today’s fast-paced digital era,{" "}
          <span className='font-semibold text-white'>
            infrastructure performance and cybersecurity
          </span>{" "}
          are the foundation of business continuity.
          <br />
          <br />
          PRESSOC is an integrated monitoring platform that combines network
          performance visibility with{" "}
          <span className='font-semibold text-cyan-400'>
            real-time threat detection
          </span>
          — all in one modern, easy-to-use dashboard.
        </motion.p>

        {/* buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className='mt-10 flex justify-center gap-6'
        >
          <button
            onClick={() => handleScroll("#free-trial")}
            className='mb-3 px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-[0_0_25px_rgba(0,200,255,0.8)] hover:scale-105 transition-all duration-300'
          >
            Get Trial
          </button>
        </motion.div>
      </div>
    </section>
  );
}
