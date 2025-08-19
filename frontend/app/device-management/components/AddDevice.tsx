// components/AddDevice.tsx
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddDeviceForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [parentId, setParentId] = useState(''); 

  const [groups, setGroups] = useState<{ objid: string; group: string }[]>([]);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await axios.get('http://localhost:3001/api/groups');
        const data = res.data;

        let groupList: { objid: string; group: string }[] = [];

        // ✅ Normalisasi hasil API biar selalu dapat objid + group
        if (Array.isArray(data.groups)) {
          groupList = data.groups.map((g: any) => ({
            objid: String(g.objid),
            group: g.group || g.name || 'Unnamed Group',
          }));
        } else if (data?.tree?.nodes) {
          groupList = data.tree.nodes.map((g: any) => ({
            objid: String(g.objid),
            group: g.group || g.name || 'Unnamed Group',
          }));
        }

        setGroups(groupList);
        if (groupList.length > 0) {
          setParentId(groupList[0].objid); // default parent ID = group pertama
        }
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    }
    fetchGroups();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !host.trim() || !parentId.trim()) {
      alert('⚠️ Name, Host, dan Parent Group wajib diisi!');
      return;
    }
    onSubmit(name.trim(), host.trim(), parentId.trim());
  };

  return (
    <div className="bg-[#1e293b] p-6 rounded-lg w-96">
      <h3 className="text-lg font-semibold mb-4">Add Device</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Device Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
        />
        <input
          type="text"
          placeholder="Host (IP/DNS)"
          value={host}
          onChange={e => setHost(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
        />
        <select
          value={parentId}
          onChange={e => setParentId(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
        >
          <option value="">-- Pilih Group --</option>
          {groups.map(g => (
            <option key={g.objid} value={g.objid}>
              {g.group} (ID: {g.objid})
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 px-4 py-1 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
