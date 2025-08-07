// page.tsx
"use client";

import { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import CreateInviteModal from "./components/CreateInviteModal";

const userData = [
  {
    name: "John Doe",
    email: "john@example.com",
    lastSignIn: "2025-08-01",
    role: "Admin",
    created: "2025-07-01",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    lastSignIn: "2025-07-25",
    role: "User",
    created: "2025-06-20",
  },
];

const invitationData = [
  {
    email: "invitee1@example.com",
    status: "Pending",
    invitedDate: "2025-07-28",
    expiryDate: "2025-08-28",
  },
  {
    email: "invitee2@example.com",
    status: "Expired",
    invitedDate: "2025-06-15",
    expiryDate: "2025-07-15",
  },
];

export default function UserManagementPage() {
  const [tab, setTab] = useState<"all" | "invitations">("all");
  const [sortBy, setSortBy] = useState("Created");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='min-h-screen bg-[#0D1B2A] text-white p-6 space-y-4'>
      {/* Tab Switch */}
      <div className='flex border-b border-gray-600'>
        {["all", "invitations"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as "all" | "invitations")}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t ? "border-b-2 border-white text-white" : "text-gray-400"
            }`}
          >
            {t === "all" ? "All" : "Invitations"}
          </button>
        ))}
      </div>

      {/* Controls: Search, Sort, Filter, Create */}
      <div className='flex items-center justify-between flex-wrap gap-2'>
        <div className='flex items-center gap-2 flex-wrap'>
          {/* Search */}
          <div className='flex items-center bg-[#132132] px-3 py-2 rounded'>
            <FiSearch className='text-gray-400 mr-2' />
            <input
              type='text'
              placeholder='Search.....'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='bg-transparent outline-none text-sm placeholder-gray-400 text-white'
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='bg-[#132132] text-white text-sm px-4 py-2 rounded'
          >
            <option value='Created'>Sort By: Created</option>
            <option value='Name'>Sort By: Name</option>
            <option value='Role'>Sort By: Role</option>
          </select>

          {/* Filter Icon */}
          <button className='bg-[#132132] p-2 rounded'>
            <FiFilter className='text-white' />
          </button>
        </div>

        {/* Create Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-[#1E4DB7] px-5 py-2 rounded text-white font-medium text-sm'
        >
          {tab === "all" ? "Create" : "Invite"}
        </button>
      </div>
      <CreateInviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTab={tab === "invitations" ? "invite" : "create"}
      />

      {/* Data Tables */}
      {tab === "all" ? (
        <div className='overflow-auto rounded-lg border border-[#1C2C3A]'>
          <table className='min-w-full text-sm'>
            <thead className='bg-[#030E1C] text-white'>
              <tr>
                <th className='px-4 py-2 text-left'>Name</th>
                <th className='px-4 py-2 text-left'>Email</th>
                <th className='px-4 py-2 text-left'>Last Sign In</th>
                <th className='px-4 py-2 text-left'>Role</th>
                <th className='px-4 py-2 text-left'>Created</th>
              </tr>
            </thead>
            <tbody className='bg-[#0C1A2A]'>
              {userData.map((user, index) => (
                <tr key={index} className='border-t border-[#1C2C3A]'>
                  <td className='px-4 py-2'>{user.name}</td>
                  <td className='px-4 py-2'>{user.email}</td>
                  <td className='px-4 py-2'>{user.lastSignIn}</td>
                  <td className='px-4 py-2'>{user.role}</td>
                  <td className='px-4 py-2'>{user.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='overflow-auto rounded-lg border border-[#1C2C3A]'>
          <table className='min-w-full text-sm'>
            <thead className='bg-[#030E1C] text-white'>
              <tr>
                <th className='px-4 py-2 text-left'>Email</th>
                <th className='px-4 py-2 text-left'>Status</th>
                <th className='px-4 py-2 text-left'>Invited Date</th>
                <th className='px-4 py-2 text-left'>Expiry Date</th>
              </tr>
            </thead>
            <tbody className='bg-[#0C1A2A]'>
              {invitationData.map((invite, index) => (
                <tr key={index} className='border-t border-[#1C2C3A]'>
                  <td className='px-4 py-2'>{invite.email}</td>
                  <td className='px-4 py-2'>{invite.status}</td>
                  <td className='px-4 py-2'>{invite.invitedDate}</td>
                  <td className='px-4 py-2'>{invite.expiryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
