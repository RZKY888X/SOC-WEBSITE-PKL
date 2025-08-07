"use client";

import { useState, useEffect } from "react";

interface CreateInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "create" | "invite";
}

export default function CreateInviteModal({
  isOpen,
  onClose,
  defaultTab = "create",
}: CreateInviteModalProps) {
  const [activeTab, setActiveTab] = useState<"create" | "invite">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [expiryDays, setExpiryDays] = useState(30);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setEmail("");
      setPassword("");
      setExpiryDays(30);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center'>
      <div className='bg-[#0C1A2A] rounded-lg w-full max-w-md p-6 shadow-lg'>
        <h2 className='text-white text-lg font-semibold mb-4'>
          {activeTab === "create" ? "Create New Account" : "Invite User"}
        </h2>

        {/* Tabs */}
        <div className='flex border-b border-[#1a2e44] mb-4'>
          <button
            className={`flex-1 py-2 text-sm font-medium transition ${
              activeTab === "create"
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("create")}
          >
            Create
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium transition ${
              activeTab === "invite"
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("invite")}
          >
            Invite
          </button>
        </div>

        {/* Form Fields */}
        <div className='space-y-4'>
          {/* Email */}
          <div>
            <label className='block text-sm text-white mb-1'>Email</label>
            <input
              type='email'
              placeholder='name@example.com'
              className='w-full px-3 py-2 rounded bg-[#091521] text-white border border-[#1f2d3d] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password - only on create */}
          {activeTab === "create" && (
            <div>
              <label className='block text-sm text-white mb-1'>Password</label>
              <input
                type='password'
                placeholder='Enter password'
                className='w-full px-3 py-2 rounded bg-[#091521] text-white border border-[#1f2d3d] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {/* Expiry Days - only on invite */}
          {activeTab === "invite" && (
            <div>
              <label className='block text-sm text-white mb-1'>
                Invitation Expiry
              </label>
              <select
                className='w-full px-3 py-2 rounded bg-[#091521] text-white border border-[#1f2d3d] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
              >
                <option value={7}>7 Days</option>
                <option value={14}>14 Days</option>
                <option value={30}>30 Days</option>
                <option value={60}>60 Days</option>
              </select>
              <p className='text-xs text-gray-400 mt-1'>
                Invite links will expire after the specified number of days.
              </p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className='flex justify-end mt-6 gap-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm bg-[#1f2d3d] text-white rounded hover:bg-[#2b3f56] transition'
          >
            Cancel
          </button>
          <button className='px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition'>
            {activeTab === "create" ? "Create" : "Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
