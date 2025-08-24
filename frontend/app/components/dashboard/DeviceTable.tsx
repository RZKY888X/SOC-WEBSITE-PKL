import { LogItem } from "@/lib/types";

interface DeviceTableProps {
  deviceMap: { [device: string]: LogItem[] };
}

export default function DeviceTable({ deviceMap }: DeviceTableProps) {
  return (
    <div className='bg-gradient-to-br from-[#1B263B] via-[#1a2538] to-[#162235] p-6 rounded-3xl shadow-2xl border border-white/10 overflow-hidden'>
      <div className="flex items-center justify-between mb-6">
        <h2 className='text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
          Device Status Overview
        </h2>
        <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
          <span className="text-sm text-gray-400">Total: </span>
          <span className="font-semibold text-blue-400">{Object.keys(deviceMap).length} devices</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className='w-full text-sm'>
          <thead>
            <tr className='text-left border-b-2 border-gradient-to-r from-blue-500/50 to-purple-500/50'>
              <th className='py-4 px-4 font-semibold text-gray-300 uppercase tracking-wider'>Status</th>
              <th className='py-4 px-4 font-semibold text-gray-300 uppercase tracking-wider'>Device Name</th>
              <th className='py-4 px-4 font-semibold text-gray-300 uppercase tracking-wider text-center'>Sensors Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {Object.entries(deviceMap).map(([device, sensors]) => (
              <tr key={device} className='hover:bg-white/5 transition-all duration-300 group'>
                <td className='py-4 px-4'>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-30"></div>
                    </div>
                    <span className='text-green-400 font-semibold text-sm'>Online</span>
                  </div>
                </td>
                <td className='py-4 px-4'>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {device.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-white group-hover:text-blue-300 transition-colors">
                      {device}
                    </span>
                  </div>
                </td>
                <td className='py-4 px-4 text-center'>
                  <div className="inline-flex items-center justify-center bg-blue-500/20 text-blue-400 font-bold px-3 py-2 rounded-full min-w-[60px]">
                    {sensors.length}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {Object.keys(deviceMap).length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">📟</div>
          <div className="text-gray-400">No devices found</div>
        </div>
      )}
    </div>
  );
}