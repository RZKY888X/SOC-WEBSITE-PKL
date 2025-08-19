"use client";

import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiTrash2, FiRefreshCw, FiUsers, FiList, FiFileText } from "react-icons/fi";
import CreateInviteModal from "./components/CreateInviteModal";

type User = {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  role: string | null;
  isActivated: boolean;
  createdAt: string;
  updatedAt: string;
};

type UserLog = {
  id: number;
  userId?: number | null;
  username?: string | null;
  action: string;
  userAgent?: string | null;
  createdAt: string;
};

type UserProfile = {
  id: string;
  companyName: string;
  fullName: string;
  city: string;
  country: string;
  createdAt: string;
};

export default function UserManagementPage() {
  const [view, setView] = useState<"users" | "logs" | "profiles">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [errorLogs, setErrorLogs] = useState<string | null>(null);
  const [errorProfiles, setErrorProfiles] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE = "http://localhost:3001";

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const res = await fetch(`${API_BASE}/api/user`);
      if (!res.ok) throw new Error(`Failed to fetch users (${res.status})`);
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setErrorUsers(err.message || "Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    setLoadingLogs(true);
    setErrorLogs(null);
    try {
      const res = await fetch(`${API_BASE}/api/user-logs`);
      if (!res.ok) throw new Error(`Failed to fetch logs (${res.status})`);
      const data: UserLog[] = await res.json();
      setLogs(data);
    } catch (err: any) {
      setErrorLogs(err.message || "Failed to fetch logs");
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  const fetchProfiles = useCallback(async () => {
    setLoadingProfiles(true);
    setErrorProfiles(null);
    try {
      const res = await fetch(`${API_BASE}/api/subscription-profiles`);
      if (!res.ok) throw new Error(`Failed to fetch profiles (${res.status})`);
      const data: UserProfile[] = await res.json();
      setProfiles(data);
    } catch (err: any) {
      setErrorProfiles(err.message || "Failed to fetch profiles");
    } finally {
      setLoadingProfiles(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchLogs();
    fetchProfiles();
    let iv: NodeJS.Timeout | null = null;
    if (view === "logs") {
      iv = setInterval(fetchLogs, 10_000);
    }
    return () => iv && clearInterval(iv);
  }, [fetchUsers, fetchLogs, fetchProfiles, view]);

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/user/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("User deleted successfully");
        fetchUsers();
      } else {
        const err = await res.json();
        alert("Failed to delete user: " + (err?.error || "unknown"));
      }
    } catch {
      alert("Error deleting user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      (user.name?.toLowerCase().includes(q) ?? false) ||
      (user.email?.toLowerCase().includes(q) ?? false) ||
      (user.username?.toLowerCase().includes(q) ?? false)
    );
  });

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    return (log.username?.toLowerCase().includes(q) ?? false) || log.action.toLowerCase().includes(q);
  });

  const filteredProfiles = profiles.filter((profile) => {
    const q = search.toLowerCase();
    return (
      profile.companyName.toLowerCase().includes(q) ||
      profile.fullName.toLowerCase().includes(q) ||
      profile.city.toLowerCase().includes(q) ||
      profile.country.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white flex">
      {/* Sidebar */}
      <nav className="w-56 bg-[#0D1B2A] p-4 flex flex-col gap-4">
        <h2 className="text-lg font-semibold mb-4">Management</h2>

        <button
  className={`flex items-center gap-2 px-3 py-2 rounded font-medium text-sm ${
    view === "users" ? "bg-[#1E4DB7]" : "hover:bg-[#1E3C72]"
  }`}
  onClick={() => setView("users")}
  aria-label="User Management"
>
  <FiUsers size={18} />
  User Management
</button>

<button
  className={`flex items-center gap-2 px-3 py-2 rounded font-medium text-sm ${
    view === "logs" ? "bg-[#1E4DB7]" : "hover:bg-[#1E3C72]"
  }`}
  onClick={() => setView("logs")}
>
  <FiList size={18} />
  Log Management
</button>

<button
  className={`flex items-center gap-2 px-3 py-2 rounded font-medium text-sm ${
    view === "profiles" ? "bg-[#1E4DB7]" : "hover:bg-[#1E3C72]"
  }`}
  onClick={() => setView("profiles")}
  aria-label="Data Diri"
>
  <FiFileText size={18} />
  Data Diri
</button>

      </nav>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-xl font-semibold">
            {view === "users" ? "User Management" : view === "logs" ? "User Logs" : "Data Diri"}
          </h1>

          {view === "users" && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#1E4DB7] px-5 py-2 rounded text-white font-medium text-sm"
              >
                Invite User
              </button>

              <button
                onClick={() => {
                  fetchUsers();
                  fetchLogs();
                  fetchProfiles();
                }}
                title="Refresh"
                className="bg-[#132132] p-2 rounded"
              >
                <FiRefreshCw />
              </button>
            </div>
          )}

          {view === "logs" && (
            <button
              onClick={() => fetchLogs()}
              title="Refresh Logs"
              className="bg-[#132132] p-2 rounded"
            >
              <FiRefreshCw />
            </button>
          )}

          {view === "profiles" && (
            <button
              onClick={() => fetchProfiles()}
              title="Refresh Profiles"
              className="bg-[#132132] p-2 rounded"
            >
              <FiRefreshCw />
            </button>
          )}
        </header>

        {/* Search bar */}
        <div className="mb-4 max-w-md">
          <input
            type="text"
            placeholder={`Search ${view === "users" ? "users" : view === "logs" ? "logs" : "profiles"}...`}
            className="w-full rounded px-3 py-2 bg-[#132132] placeholder-gray-400 text-white outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Content Table */}
        {view === "users" && (
          <div className="overflow-auto rounded-lg border border-[#1C2C3A] bg-[#0C1A2A]">
            {errorUsers ? (
              <div className="p-4 text-red-400">Error: {errorUsers}</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-[#030E1C] text-white sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-[#0C1A2A]">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400 italic">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400 italic">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t border-[#1C2C3A] hover:bg-[#334155]"
                      >
                        <td className="px-4 py-2">{user.name || "-"}</td>
                        <td className="px-4 py-2">{user.email || "-"}</td>
                        <td className="px-4 py-2">{user.username || "-"}</td>
                        <td className="px-4 py-2 capitalize">{user.role || "-"}</td>
                        <td className="px-4 py-2">
                          {user.isActivated ? "Active" : "Inactive"}
                        </td>
                        <td className="px-4 py-2">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:text-red-700 transition"
                            title="Delete user"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {view === "logs" && (
          <div className="overflow-auto rounded-lg border border-[#1C2C3A] bg-[#0C1A2A]">
            {errorLogs ? (
              <div className="p-4 text-red-400">Error: {errorLogs}</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-[#030E1C] text-white sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">Action</th>
                    <th className="px-4 py-2 text-left">User Agent</th>
                    <th className="px-4 py-2 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="bg-[#0C1A2A]">
                  {loadingLogs ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 italic">
                        Loading logs...
                      </td>
                    </tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 italic">
                        No logs found.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-t border-[#1C2C3A] hover:bg-[#334155]"
                      >
                        <td className="px-4 py-2">{log.username || "-"}</td>
                        <td className="px-4 py-2 capitalize">{log.action}</td>
                        <td className="px-4 py-2 text-xs truncate">
                          {log.userAgent || "-"}
                        </td>
                        <td className="px-4 py-2">
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {view === "profiles" && (
          <div className="overflow-auto rounded-lg border border-[#1C2C3A] bg-[#0C1A2A]">
            {errorProfiles ? (
              <div className="p-4 text-red-400">Error: {errorProfiles}</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-[#030E1C] text-white sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Company</th>
                    <th className="px-4 py-2 text-left">Full Name</th>
                    <th className="px-4 py-2 text-left">City</th>
                    <th className="px-4 py-2 text-left">Country</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                  </tr>
                </thead>
                <tbody className="bg-[#0C1A2A]">
                  {loadingProfiles ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 italic">
                        Loading profiles...
                      </td>
                    </tr>
                  ) : filteredProfiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 italic">
                        No profiles found.
                      </td>
                    </tr>
                  ) : (
                    filteredProfiles.map((p) => (
                      <tr
                        key={p.id}
                        className="border-t border-[#1C2C3A] hover:bg-[#334155]"
                      >
                        <td className="px-4 py-2">{p.companyName}</td>
                        <td className="px-4 py-2">{p.fullName}</td>
                        <td className="px-4 py-2">{p.city}</td>
                        <td className="px-4 py-2">{p.country}</td>
                        <td className="px-4 py-2">
                          {p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        <CreateInviteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </div>
  );
}
