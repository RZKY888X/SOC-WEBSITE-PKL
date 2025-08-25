'use client';

interface Props {
  onCancel: () => void;
}

export default function CardAddDevice({ onCancel }: Props) {
  return (
    <div className="text-white">
      <h2 className="text-xl font-bold mb-6">Add Device</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Basic Device Settings</h3>
        <label className="block text-sm mb-1">Device Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded bg-[#1e293b] text-white focus:outline-none mb-4"
          placeholder="Enter device name"
        />

        <label className="block text-sm mb-1">IP Version</label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="ipVersion" defaultChecked />
            <span>IPv4 (default)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="ipVersion" />
            <span>IPv6</span>
          </label>
        </div>

        <label className="block text-sm mb-1">IPv4 Address/DNS Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded bg-[#1e293b] text-white focus:outline-none"
          placeholder="Enter IP or DNS"
        />
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Auto Discovery Settings</h3>
        <fieldset className="space-y-2">
          {[
            'No auto-discovery (default)',
            'Default auto-discovery (recommended)',
            'Detailed auto-discovery',
            'Auto-discovery with specific device templates',
          ].map((option, idx) => (
            <label key={idx} className="flex items-center gap-2">
              <input type="radio" name="discovery" defaultChecked={idx === 0} />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
          Create
        </button>
      </div>
    </div>
  );
}