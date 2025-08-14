"use client";

import Image from "next/image";

const features = [
  {
    icon: "/icons/MonitoringIcon.png",
    title: "Monitoring Performance",
    desc: "Uptime server, beban CPU, penggunaan memori, bandwidth, status aplikasi",
  },
  {
    icon: "/icons/SecurityIcon.png",
    title: "Monitoring Security",
    desc: "Deteksi intrusi, anomali log, MITRE ATT&CK mapping, alert berbasis rule",
  },
  {
    icon: "/icons/AlertIcon.png",
    title: "Alert Cerdas",
    desc: "Notifikasi otomatis saat performa dan keamanan menunjukan potensi masalah",
  },
  {
    icon: "/icons/KorelasiIcon.png",
    title: "Korelasi Data",
    desc: "Context: CPU usage melonjak + brute force detected = potensi kompromi serius",
  },
];

export default function Features() {
  return (
    <section id="feature" className="bg-[#0D1B2A] text-white py-20 px-6">
      <h2 className="text-3xl font-bold text-center mb-14">
        Solusi dari <span className="text-[#3BAFDA]">PRESSOC</span>
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="bg-[#0C1A2A] p-8 rounded-xl text-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center mb-5">
              <Image
                src={f.icon}
                alt={f.title}
                width={48}
                height={48}
                className="drop-shadow-lg"
              />
            </div>
            <h3 className="text-lg font-semibold mb-3">{f.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
