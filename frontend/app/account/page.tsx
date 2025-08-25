"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const plan = searchParams.get("plan") || "User";

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="bg-[#0f172a] min-h-screen px-4 py-8 text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">PRESSOC</h1>
      </div>

      {/* Account Card */}
      <div className="bg-[#1c2530] p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Account Settings</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
          <div className="text-gray-400">Name :</div>
          <div>{session?.user?.name || "Tidak diketahui"}</div>

          <div className="text-gray-400">Role :</div>
          <div className="italic">
            {session?.user?.role || "Tidak diketahui"}
          </div>

          <div className="text-gray-400">Email Address :</div>
          <div className="italic">
            {session?.user?.email || "Tidak diketahui"}
          </div>

          <div className="text-gray-400">Plan Account :</div>
          <div className="italic">
            {plan}
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#1c2530] rounded-lg text-red-500 font-semibold hover:bg-red-900/10 transition"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </div>
  );
}