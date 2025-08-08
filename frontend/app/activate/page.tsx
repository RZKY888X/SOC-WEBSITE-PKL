"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ActivatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    token: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("http://localhost:3001/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Activation failed");
      }

      setSuccessMsg("Aktivasi berhasil! Anda akan diarahkan ke halaman login...");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1B2A] px-4">
      <div className="max-w-md w-full p-8 rounded-xl bg-[#1B263B] border border-[#334B6E] shadow-md shadow-[#0D1B2A]/60">
        <h1 className="text-2xl font-semibold mb-6 text-center text-[#E0E1DD]">
          Aktivasi Akun
        </h1>

        {errorMsg && <p className="text-red-400 mb-4">{errorMsg}</p>}
        {successMsg && <p className="text-green-400 mb-4">{successMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {["username", "password", "name", "token"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-[#E0E1DD] capitalize"
              >
                {field === "token" ? "Token Aktivasi" : field}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                id={field}
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                required
                placeholder={field}
                className="mt-1 w-full bg-[#0D1B2A] border border-[#415A77] text-[#E0E1DD] placeholder-[#A9B3C1] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#415A77] focus:border-[#778DA9] transition"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#415A77] hover:bg-[#334B6E] text-[#E0E1DD] font-medium py-2 rounded transition duration-200 disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Aktivasi"}
          </button>
        </form>
      </div>
    </div>
  );
}