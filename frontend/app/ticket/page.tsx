//page.tsx
"use client";

import { useEffect, useState } from "react";
import TicketDetail from "./TicketDetail";

type SensorData = {
  sensor: string;
  device: string;
  status: "Down" | "Warning" | "OK";
  lastcheck?: string;
};

export type Ticket = {
  id: number;
  title: string;
  status: "Open" | "In Progress" | "Resolved";
  priority: "High" | "Medium" | "Low";
  sensor: string;
  assignedTo: string;
  updatedAt: string;
  description?: string;
};

export default function TicketPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("http://localhost:3001/api/sensors");
        const data: unknown = await res.json();

        if (!Array.isArray(data)) {
          console.error("Invalid data format");
          return;
        }

        const mapped = (data as SensorData[]).map((item, index) => {
          const status =
            item.status === "Down"
              ? "Open"
              : item.status === "Warning"
              ? "In Progress"
              : "Resolved";

          const priority =
            item.status === "Down"
              ? "High"
              : item.status === "Warning"
              ? "Medium"
              : "Low";

          return {
            id: index + 1,
            title: `${item.sensor} - ${item.device}`,
            status,
            priority,
            sensor: item.sensor,
            assignedTo: "Auto",
            updatedAt: item.lastcheck?.split(" ")[0] || "Unknown",
          } satisfies Ticket;
        });

        setTickets(mapped);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchPriority = priorityFilter
      ? ticket.priority === priorityFilter
      : true;
    return matchStatus && matchPriority;
  });

  useEffect(() => {
    document.body.style.overflow = selectedTicket ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedTicket]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 relative overflow-hidden">
      <h1 className="text-2xl font-bold mb-6">Ticket List</h1>

      {!selectedTicket && (
        <div className="mb-4 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-600 px-2 py-1 rounded text-white"
            >
              <option value="">All</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-800 border border-slate-600 px-2 py-1 rounded text-white"
            >
              <option value="">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      )}

      {selectedTicket && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={() => setSelectedTicket(null)}
          />
          <div className="fixed top-0 right-0 w-full md:w-[400px] h-full bg-slate-900 z-50 shadow-xl overflow-y-auto transform transition-transform duration-300 ease-in-out">
            <TicketDetail
              ticket={selectedTicket}
              onBack={() => setSelectedTicket(null)}
              onSave={(updated) => {
                setTickets((prev) =>
                  prev.map((t) => (t.id === updated.id ? updated : t))
                );
                setSelectedTicket(null);
              }}
            />
          </div>
        </>
      )}

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-800 text-sm">
            <th className="p-3">Title</th>
            <th className="p-3">Status</th>
            <th className="p-3">Priority</th>
            <th className="p-3">Updated</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket) => (
            <tr key={ticket.id} className="border-t border-slate-700">
              <td className="p-3">{ticket.title}</td>
              <td className="p-3">
                <span className="px-2 py-1 rounded bg-sky-700 text-xs">
                  {ticket.status}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    ticket.priority === "High"
                      ? "bg-red-700"
                      : ticket.priority === "Medium"
                      ? "bg-yellow-600"
                      : "bg-green-700"
                  }`}
                >
                  {ticket.priority}
                </span>
              </td>
              <td className="p-3 text-sm">{ticket.updatedAt}</td>
              <td className="p-3">
                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="text-blue-400 hover:underline text-sm"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>  
    </div>
  );
}
