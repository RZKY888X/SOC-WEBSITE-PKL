import { LogItem } from "../../lib/types";

interface LogActivityProps {
  recentLogs: LogItem[];
}

export default function LogActivity({ recentLogs }: LogActivityProps) {
  const downLogs = recentLogs.filter((log) => log.status === "Down");

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
      {/* ALERT - kiri */}
      <div className='bg-[#1B263B] p-4 rounded'>
        <h2 className='text-lg font-semibold mb-2 text-red-400'>
          Alert (Sensor Down)
        </h2>
        <ul className='text-sm list-disc list-inside space-y-1'>
          {downLogs.length === 0 && (
            <p className='text-gray-400'>Tidak ada sensor yang down.</p>
          )}
          {downLogs.map((log, i) => {
            const time = new Date(log.timestamp).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            return (
              <li key={`${log.objid}-alert-${i}`}>
                [{time}] ❌ Sensor <strong>{log.sensor}</strong> di device{" "}
                <strong>{log.device}</strong> status:{" "}
                <strong>{log.status}</strong>, nilai:{" "}
                <strong>{log.lastvalue}</strong>
              </li>
            );
          })}
        </ul>
      </div>

      {/* LOG ACTIVITY - kanan */}
      <div className='bg-[#1B263B] p-4 rounded'>
        <h2 className='text-lg font-semibold mb-2'>
          Log Activity (Last Update)
        </h2>
        <ul className='text-sm list-disc list-inside space-y-1'>
          {recentLogs.map((log, i) => {
            const time = new Date(log.timestamp).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            const icon =
              log.status === "Down"
                ? "❌"
                : log.status === "Warning"
                ? "⚠️"
                : "✅";

            return (
              <li key={`${log.objid}-log-${i}`}>
                [{time}] {icon} Sensor <strong>{log.sensor}</strong> di device{" "}
                <strong>{log.device}</strong> status:{" "}
                <strong>{log.status}</strong>, nilai:{" "}
                <strong>{log.lastvalue}</strong>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
