"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function FreeTrial() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3001/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setMessage("✅ Invitation sent! Check your email.");
      setEmail("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage("❌ " + error.message);
      } else {
        setMessage("❌ An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      id="free-trial"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false }}
      className="bg-[#0D1B2A] text-white py-20 px-6 text-center"
    >
      <p className="uppercase tracking-widest text-sm text-blue-400 mb-2">
        coba gratis sekarang
      </p>
      <h2 className="text-3xl font-bold mb-6">
        Free Trial - <span className="text-cyan-400">5 Minutes</span>
      </h2>

      <motion.ul
        initial="hidden"
        whileInView="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.2 } },
        }}
        viewport={{ once: false }}
        className="text-gray-300 mb-6 space-y-2 max-w-lg mx-auto"
      >
        {[
          "Full access for 5 Minutes",
          "100% free, no credit card required",
          "No commitment",
          "Free version available after trial",
        ].map((item, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2"
          >
            ✅ <span>{item}</span>
          </motion.li>
        ))}
      </motion.ul>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row justify-center gap-4 max-w-xl mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          required
          className="p-3 rounded w-full md:w-auto flex-1 bg-[#0C1A2A] border border-gray-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-xl font-semibold shadow-md transition ${
            loading
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white"
          }`}
        >
          {loading ? "Sending..." : "🚀 Get Trial"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-sm ${
            message.startsWith("✅") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </motion.section>
  );
}
