//TicketDetail.tsx
"use client";

import { useState } from "react";
import type { Ticket } from "./page";

interface TicketDetailProps {
  ticket: Ticket;
  onBack: () => void;
  onSave: (updated: Ticket) => void;
}

export default function TicketDetail({
  ticket,
  onBack,
  onSave,
}: TicketDetailProps) {
  const [form, setForm] = useState<Ticket>(ticket);

  function handleChange<K extends keyof Ticket>(field: K, value: Ticket[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className='p-6 text-white'>
      <h2 className='text-2xl font-bold mb-6'>Ticket Detail</h2>

      <div className='mb-3'>
        <p className='text-sm'>Ticket</p>
        <p className='text-lg font-semibold'>{form.title}</p>
      </div>

      <div className='mb-3'>
        <p className='text-sm'>Sensor</p>
        <p className='text-base'>{form.sensor}</p>
      </div>

      <div className='mb-3'>
        <label className='text-sm'>Assigned To</label>
        <select
          className='w-full bg-slate-800 px-3 py-2 rounded'
          value={form.assignedTo}
          onChange={(e) => handleChange("assignedTo", e.target.value)}
        >
          <option>Unassigned</option>
          <option>Rauf</option>
          <option>Dimas</option>
          <option>Rani</option>
        </select>
      </div>

      <div className='mb-3'>
        <label className='text-sm'>Status</label>
        <select
          className='w-full bg-slate-800 px-3 py-2 rounded'
          value={form.status}
          onChange={(e) =>
            handleChange("status", e.target.value as Ticket["status"])
          }
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
      </div>

      <div className='mb-3'>
        <label className='text-sm'>Priority</label>
        <select
          className='w-full bg-slate-800 px-3 py-2 rounded'
          value={form.priority}
          onChange={(e) =>
            handleChange("priority", e.target.value as Ticket["priority"])
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className='mb-3'>
        <label className='text-sm'>Description</label>
        <textarea
          className='w-full bg-slate-800 px-3 py-2 rounded resize-none'
          value={form.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className='mb-6'>
        <label className='text-sm'>Recent Activity</label>
        <p className='text-xs text-slate-300'>
          {form.updatedAt} — <i>System: Ticket Created</i>
        </p>
      </div>

      <div className='flex items-center gap-2 mb-6'>
        <span>💬</span>
        <input
          placeholder='Add Comment...'
          className='flex-1 bg-slate-800 px-3 py-2 rounded'
        />
      </div>

      <div className='flex gap-2'>
        <button
          onClick={() => onSave(form)}
          className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded'
        >
          Save
        </button>
        <button
          onClick={onBack}
          className='flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded'
        >
          Back
        </button>
      </div>
    </div>
  );
}
