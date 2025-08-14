"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Ambil userAgent dari browser
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "Unknown";

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, userAgent }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login gagal");
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1725] text-white">
      <div className="w-full max-w-sm bg-[#0D1725] p-8 rounded-md shadow-lg border border-[#1C2A3A]">
        <h1 className="text-center text-xl font-semibold mb-6 tracking-wide">PRESSOC</h1>
        <form onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <div className="mb-4">
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full px-4 py-2 bg-[#122132] text-white rounded-md border border-[#1C2A3A] focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full px-4 py-2 bg-[#122132] text-white rounded-md border border-[#1C2A3A] focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#183D74] hover:bg-[#285193] text-white py-2 rounded-md transition duration-200"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
