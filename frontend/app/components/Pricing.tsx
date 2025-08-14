"use client";

const plans = [
  {
    name: "Basic",
    price: 179,
    features: ["100 Sensor", "Alert Otomatis", "Support via Email"],
  },
  {
    name: "Starter",
    price: 325,
    features: [
      "200 Sensor",
      "Alert Otomatis",
      "Monitoring Real-Time",
      "Support via Email & Chat",
    ],
  },
  {
    name: "Pro",
    price: 675,
    features: [
      "Sensor Tak Terbatas",
      "Alert Otomatis & Eskalasi",
      "Analitik Lanjutan",
      "Multi-User Access",
      "Support Prioritas 24/7",
    ],
  },
  {
    name: "Enterprise",
    price: 1183,
    features: [
      "Sensor Tak Terbatas",
      "Alert & Automated Response",
      "AI Threat Detection",
      "Unlimited Team Access",
      "Dedicated Account Manager",
      "Integrasi & Penyesuaian Custom",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[#0D1B2A] text-white py-20 px-6">
      <h2 className="text-2xl font-bold text-center mb-10">Pricing Plans</h2>
      <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className="bg-[#0C1A2A] p-6 rounded-lg border border-gray-800 hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
            <p className="text-xl font-bold mb-4">${p.price}/month</p>
            <ul className="text-gray-300 mb-6 space-y-1 flex-1">
              {p.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
            <button className="w-full px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
