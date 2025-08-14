"use client";

import { useState } from "react";

export default function FreeTrial() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Terima kasih, ${email} berhasil mendaftar trial!`);
    setEmail("");
  };

  return (
    <section
      id="freetrial"
      className="bg-[#0D1B2A] text-white py-20 px-6 text-center"
    >
      <h2 className="text-2xl font-bold mb-6">Free Trial - 7 Day</h2>
      <div className="text-gray-300 mb-6">
        <ul className="space-y-1">
          <li>• Full access for 30 days</li>
          <li>• 100% free, no credit card required</li>
          <li>• No commitment</li>
          <li>• Free version available after trial</li>
        </ul>
      </div>
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
          className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-500"
        >
          Get Trial
        </button>
      </form>
    </section>
  );
}
