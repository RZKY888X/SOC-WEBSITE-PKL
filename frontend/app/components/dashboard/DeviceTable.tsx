import { LogItem } from "../../lib/types";

interface DeviceTableProps {
  deviceMap: { [device: string]: LogItem[] };
}

export default function DeviceTable({ deviceMap }: DeviceTableProps) {
  return (
    <div className='bg-[#1B263B] p-4 rounded'>
      <h2 className='text-lg font-semibold mb-2'>Device</h2>
      <table className='w-full text-sm'>
        <thead>
          <tr className='text-left border-b border-gray-600'>
            <th className='py-1'>Status</th>
            <th className='py-1'>Device</th>
            <th className='py-1'>Sensors</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(deviceMap).map(([device, sensors]) => (
            <tr key={device}>
              <td className='py-1 text-green-500'>⬤ Up</td>
              <td className='py-1'>{device}</td>
              <td className='py-1'>{sensors.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
