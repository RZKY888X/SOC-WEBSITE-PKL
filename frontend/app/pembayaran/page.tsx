"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Step = 1 | 2 | 3;

export default function PembayaranBaru() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "User";
  const price = parseInt(searchParams.get("price") || "0", 10);

  const router = useRouter();

  // Step state
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // Profile form
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  // Backend references
  const [profileId, setProfileId] = useState<string | null>(null);

  // Payment state (dummy)
  const [paymentDone, setPaymentDone] = useState(false);

  // Invite
  const [email, setEmail] = useState("");

  const API_BASE = "http://localhost:3001";

  // Step 1: Submit profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/payment/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          price,
          companyName,
          fullName,
          city,
          country,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data profil");

      setProfileId(data.profileId);
      setStep(2);
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Dummy payment
  const handleDummyPayment = () => {
    alert(`💳 Pembayaran paket ${plan} sebesar $${price} berhasil! (Dummy)`);
    setPaymentDone(true);
    setStep(3);
  };

  // Step 3: Invite + Invoice
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) {
      alert("Profile belum dibuat. Silakan ulangi.");
      setStep(1);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/payment/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          email,
          role: "admin",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim undangan");

      alert("📩 Undangan & Invoice dummy telah dikirim ke email Anda!");
      // Redirect ke halaman activate agar user bisa input token
      if (data.token) {
        router.push(`/activate?token=${data.token}`);
      } else {
        router.push(`/activate`);
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#0D1B2A] text-white min-h-screen flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-2xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Pembayaran - {plan}</h1>
          <p className="text-gray-300">Total: ${price}</p>
        </header>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { n: 1, label: "Data Diri" },
            { n: 2, label: "Pembayaran" },
            { n: 3, label: "Undang Admin" },
          ].map(s => (
            <div key={s.n} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= (s.n as Step) ? "bg-blue-600" : "bg-[#132132]"
                }`}
              >
                {s.n}
              </div>
              <span className="ml-2 mr-4 text-sm">{s.label}</span>
              {s.n !== 3 && <div className="w-8 h-[2px] bg-[#334155]" />}
            </div>
          ))}
        </div>

        {/* Step 1: Profile */}
        {step === 1 && (
          <form onSubmit={handleSaveProfile} className="space-y-4 bg-[#0C1A2A] p-5 rounded-xl border border-[#1C2C3A]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Company Name</label>
                <input
                  className="p-3 rounded w-full bg-[#091320] border border-gray-700 outline-none"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Full Name</label>
                <input
                  className="p-3 rounded w-full bg-[#091320] border border-gray-700 outline-none"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">City</label>
                <input
                  className="p-3 rounded w-full bg-[#091320] border border-gray-700 outline-none"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Country</label>
                <input
                  className="p-3 rounded w-full bg-[#091320] border border-gray-700 outline-none"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 bg-blue-600 rounded hover:bg-blue-500 font-medium"
            >
              {loading ? "Menyimpan..." : "Lanjut ke Pembayaran"}
            </button>
          </form>
        )}

        {/* Step 2: Dummy Payment */}
        {step === 2 && (
          <div className="bg-[#0C1A2A] p-5 rounded-xl border border-[#1C2C3A]">
            <h3 className="font-semibold mb-2">Ringkasan</h3>
            <ul className="text-sm text-gray-300 mb-6 list-disc pl-5">
              <li>Plan: {plan}</li>
              <li>Price: ${price}</li>
              <li>Company: {companyName}</li>
              <li>Full Name: {fullName}</li>
              <li>City/Country: {city} / {country}</li>
            </ul>

            <button
              onClick={handleDummyPayment}
              className="px-6 py-3 bg-green-600 rounded hover:bg-green-500"
            >
              Bayar Sekarang (Dummy)
            </button>
          </div>
        )}

        {/* Step 3: Invite */}
        {step === 3 && (
          <form onSubmit={handleInvite} className="space-y-4 bg-[#0C1A2A] p-5 rounded-xl border border-[#1C2C3A]">
            <p className="text-sm text-gray-300">
              Masukkan email admin yang akan diundang. Sistem akan mengirim <b>token aktivasi</b> dan <b>invoice dummy</b> ke email tersebut.
              Setelah aktivasi, akun akan otomatis menjadi <b>Inactive</b> setelah <b>30 menit</b>.
            </p>
            <input
              type="email"
              placeholder="Email admin"
              className="p-3 rounded w-full bg-[#091320] border border-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              {loading ? "Mengirim undangan..." : "Kirim Undangan & Invoice"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
