'use client';

import { useSession, signOut } from 'next-auth/react';
import { LogOut, User2Icon } from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white">
      <h2 className="text-lg font-semibold mb-4">Profile Account</h2>
      <div className="flex flex-col items-center bg-[#1c2530] p-4 rounded-xl gap-4 mb-6">
        <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center">
        <User2Icon className="w-6 h-6 text-black"/>
        </div>
        <span className="text-lg font-semibold">
          {session?.user?.name || 'Tidak diketahui'}
        </span>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-[#1c2530] text-red-500 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-900/10 transition"
      >
        <LogOut className="w-5 h-5" />
        Log out
      </button>
    </div>
  );
}
