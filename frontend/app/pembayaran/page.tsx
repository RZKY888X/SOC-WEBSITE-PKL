"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Step = 1 | 2 | 3;

export default function PembayaranBaru() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const plan = searchParams.get("plan") || "User";
  const price = parseInt(searchParams.get("price") || "0", 10);

  const API_BASE = "http://localhost:3001";

  // steps
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // form state
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");

  // backend refs
  const [profileId, setProfileId] = useState<string | null>(null);

  // invite result
  const [activationToken, setActivationToken] = useState<string | null>(null);

  // helpers
  const isEmailValid = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // STEP 1 — simpan profil (sekaligus simpan email admin di profil)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid(email)) {
      alert("Format email admin tidak valid.");
      return;
    }
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
          email, // kirim email admin juga (abaikan kalau backend tidak pakai)
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan profil");
      setProfileId(data.profileId);
      setStep(2);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 — dummy payment lalu kirim undangan+invoice
  const handlePayAndInvite = async () => {
    if (!profileId) {
      alert("Profil belum dibuat. Silakan isi data terlebih dahulu.");
      setStep(1);
      return;
    }
    setLoading(true);
    try {
      // 1) Simulasi pembayaran (opsional – kalau backend kamu butuh endpoint, panggil di sini)
      alert(`💳 Pembayaran paket ${plan} sebesar $${price} berhasil! (Dummy)`);

      // 2) Kirim undangan + invoice (ambil token aktivasi)
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

      setActivationToken(data.token ?? null);
      setStep(3);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  const goToActivate = () => {
    if (activationToken) router.push(`/activate?token=${activationToken}`);
    else router.push(`/activate`);
  };

  return (
    <section className='bg-[#0D1B2A] text-white min-h-screen flex'>
      <div className='w-full max-w-2xl mx-auto px-6 py-10 pb-24'>
        {/* Header */}
        <header className='mb-6'>
          <h1 className='text-2xl font-bold'>Pembayaran - {plan}</h1>
          <p className='text-gray-300'>
            Total: <span className='font-semibold text-white'>${price}</span>
          </p>
        </header>

        {/* Stepper */}
        <div className='flex items-center gap-2 mb-8'>
          {[
            { n: 1, label: "Data Akun & Admin" },
            { n: 2, label: "Pembayaran" },
            { n: 3, label: "Konfirmasi" },
          ].map((s, i) => (
            <div key={s.n} className='flex items-center'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${
                  step > s.n
                    ? "bg-green-600"
                    : step === s.n
                    ? "bg-blue-600"
                    : "bg-[#132132]"
                }`}
                title={s.label}
              >
                {step > s.n ? "✓" : s.n}
              </div>
              <span
                className={`ml-2 mr-4 text-sm ${
                  step === s.n ? "text-white font-medium" : "text-gray-300"
                }`}
              >
                {s.label}
              </span>
              {i !== 2 && <div className='w-8 h-[2px] bg-[#334155]' />}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <form
            onSubmit={handleSaveProfile}
            className='space-y-4 bg-[#0C1A2A] p-5 rounded-xl border border-[#1C2C3A] shadow'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='md:col-span-2'>
                <label className='block text-sm mb-1'>Company Name</label>
                <input
                  className='p-3 rounded w-full bg-[#091320] border border-gray-700 outline-none'
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className='md:col-span-2'>
                <label className='block text-sm mb-1'>Full Name</label>
                <input
                  className='p-3 rounded w-full bg-[#091320] border border-gray-700 outline-none'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>City</label>
                <input
                  className='p-3 rounded w-full bg-[#091320] border border-gray-700 outline-none'
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>Country</label>
                <input
                  className='p-3 rounded w-full bg-[#091320] border border-gray-700 outline-none'
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
              <div className='md:col-span-2'>
                <label className='block text-sm mb-1'>Email Admin</label>
                <input
                  type='email'
                  className='p-3 rounded w-full bg-[#091320] border border-gray-700 outline-none'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {!email || isEmailValid(email) ? null : (
                  <p className='text-xs text-red-400 mt-1'>
                    Format email tidak valid.
                  </p>
                )}
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full px-5 py-3 bg-blue-600 rounded hover:bg-blue-500 font-medium disabled:opacity-60'
            >
              {loading ? "Menyimpan..." : "Lanjut ke Pembayaran →"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className='bg-[#0C1A2A] p-5 rounded-xl border border-[#1C2C3A] shadow'>
            <h3 className='font-semibold mb-3'>Ringkasan</h3>
            <ul className='text-sm text-gray-300 mb-6 space-y-1'>
              <li>
                <b>Plan:</b> {plan}
              </li>
              <li>
                <b>Price:</b> ${price}
              </li>
              <li>
                <b>Company:</b> {companyName}
              </li>
              <li>
                <b>Full Name:</b> {fullName}
              </li>
              <li>
                <b>City/Country:</b> {city} / {country}
              </li>
              <li>
                <b>Email Admin:</b> {email}
              </li>
            </ul>

            <button
              onClick={handlePayAndInvite}
              disabled={loading}
              className='w-full px-6 py-3 bg-green-600 rounded hover:bg-green-500 font-medium disabled:opacity-60'
            >
              {loading ? "Memproses..." : "Bayar Sekarang (Dummy)"}
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className='bg-[#0C1A2A] p-6 rounded-xl border border-[#1C2C3A] shadow text-center'>
            <h3 className='font-semibold text-lg mb-2'>
              🎉 Pembayaran Berhasil
            </h3>
            <p className='text-sm text-gray-300 mb-4'>
              Invoice dan <b>Token Aktivasi</b> telah dikirim ke email admin:
              <br />
              <span className='text-white'>{email}</span>
            </p>
            <p className='text-xs text-gray-400 mb-6'>
              Akun akan otomatis menjadi <b>Inactive</b> setelah <b>30 menit</b>{" "}
              jika tidak diaktivasi.
            </p>

            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <button
                onClick={goToActivate}
                className='px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded font-medium'
              >
                Buka Halaman Aktivasi
              </button>
              <button
                onClick={() => router.push("/")}
                className='px-5 py-3 bg-[#16263a] hover:bg-[#1c3148] rounded font-medium'
              >
                Kembali ke Beranda
              </button>
            </div>

            {activationToken && (
              <p className='mt-4 text-xs text-gray-500 break-all'>
                Token: <span className='text-gray-300'>{activationToken}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
