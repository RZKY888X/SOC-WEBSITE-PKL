import type { Metadata } from "next";
import DashboardPages from "../components/dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard for monitoring devices and sensors",
};


export default function DashboardPage() {
  return (
    <div className='min-h-screen bg-[#0D1B2A] text-white p-6 font-sans'>
      <DashboardPages/>      
    </div>
  );
}